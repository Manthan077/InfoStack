import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { generateAnswer } from "./gemini.js";
import { qdrant } from "./qdrant.js";

/* ======================================================
   GEMINI EMBEDDING FUNCTION (WEBSITE-SAFE, PRODUCTION)
   ====================================================== */
async function embedText(text) {
  const safeText = text
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, 7000)
    .trim();

  if (!safeText) {
    throw new Error("Empty text after sanitization");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: { parts: [{ text: safeText }] },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("🔴 GEMINI EMBEDDING ERROR:", errorText);
    throw new Error("Bad Request");
  }

  const data = await response.json();
  return data.embedding.values;
}

/* ======================================================
   INDEXING (MULTI-DOCUMENT, WEBSITE SAFE)
   ====================================================== */
export async function indexText(text, source = "unknown") {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 150,
  });

  const chunks = await splitter.splitText(text);

  const collections = await qdrant.getCollections();
  const exists = collections.collections.some(
    (c) => c.name === "rag-data"
  );

  if (!exists) {
    await qdrant.createCollection("rag-data", {
      vectors: { size: 768, distance: "Cosine" },
    });
  }

  const timestamp = Date.now();

  for (let i = 0; i < chunks.length; i++) {
    const vector = await embedText(chunks[i]);

    await qdrant.upsert("rag-data", {
      wait: true,
      points: [
        {
          id: timestamp + i,
          vector,
          payload: {
            text: chunks[i],
            source,
            chunk_index: i,
            uploaded_at: new Date().toISOString(),
          },
        },
      ],
    });
  }

  console.log(
    `Indexing complete for ${source}. Chunks indexed: ${chunks.length}`
  );

  return chunks.length;
}

/* ======================================================
   QUESTION TYPE CHECK
   ====================================================== */
function isDefinitionQuestion(question) {
  const q = question.toLowerCase().trim();
  return (
    q.startsWith("what is") ||
    q.startsWith("meaning of") ||
    q.startsWith("define") ||
    q.includes("what does")
  );
}

/* ======================================================
   ASK QUESTION (MULTI-DOC + SOURCES)
   ====================================================== */
export async function askQuestion({ question, mode = "hybrid" }) {
  try {
    const collections = await qdrant.getCollections();
    const hasCollection = collections.collections.some(
      (c) => c.name === "rag-data"
    );

    /* ---------- STRICT MODE HARD BLOCK ---------- */
    if (mode === "strict") {
      if (!hasCollection) {
        return {
          answer: "This information is not present in the uploaded documents.",
          sources: [],
        };
      }

      const info = await qdrant.getCollection("rag-data");
      if (!info || info.points_count === 0) {
        return {
          answer: "This information is not present in the uploaded documents.",
          sources: [],
        };
      }
    }

    /* ---------- EMBEDDING ---------- */
    const queryVector = await embedText(question);

    /* ---------- SAFE SEARCH (HYBRID FIX) ---------- */
    const results = hasCollection
      ? await qdrant.search("rag-data", {
          vector: queryVector,
          limit: 10,
          with_payload: true,
        })
      : [];

    /* ---------- STRICT MODE HARD BLOCK (NO MATCHES) ---------- */
    if (mode === "strict" && results.length === 0) {
      return {
        answer: "This information is not present in the uploaded documents.",
        sources: [],
      };
    }

    const context = results.map((r) => r.payload.text).join("\n");
    const sources = [
      ...new Set(results.map((r) => r.payload.source)),
    ];

    /* ---------- STRICT MODE ---------- */
    if (mode === "strict") {
      const answer = await generateAnswer({
        systemPrompt: `
You are a document-grounded AI assistant.
Answer ONLY using the provided context.
If the answer is not explicitly present, say:
"This information is not present in the uploaded documents."
`,
        context,
        question,
      });

      return { answer, sources };
    }

    /* ---------- HYBRID MODE (DEFINITION) ---------- */
    if (isDefinitionQuestion(question)) {
      const answer = await generateAnswer({
        systemPrompt: `
You are a hybrid AI assistant.

Rules:
- You may use general knowledge for definitions.
- Do NOT invent document-specific facts.
- Use document mentions when relevant.
`,
        context,
        question,
      });

      return { answer, sources };
    }

    /* ---------- HYBRID MODE (GENERAL) ---------- */
    const answer = await generateAnswer({
      systemPrompt: `
You are a hybrid RAG AI assistant.

Rules:
- Use document context for document-specific facts.
- Never fabricate document facts.
- General explanations are allowed.
- Be honest when information is not present.
`,
      context,
      question,
    });

    return { answer, sources };
  } catch (err) {
    console.error("askQuestion error:", err.message);
    return {
      answer: "⚠️ AI service is temporarily unavailable. Please try again later.",
      sources: [],
    };
  }
}
