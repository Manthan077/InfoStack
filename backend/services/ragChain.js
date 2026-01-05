import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { generateAnswer } from "./gemini.js";
import { qdrant } from "./qdrant.js";

/* ---------- Gemini Embedding Function ---------- */
async function embedText(text) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: {
          parts: [{ text: text }]
        }
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Embedding API failed: ${response.status}`);
  }

  const data = await response.json();
  return data.embedding.values;
}

/* ---------- Indexing ---------- */
export async function indexText(text) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = await splitter.splitText(text);

  // Create collection if it doesn't exist
  const collections = await qdrant.getCollections();
  const exists = collections.collections.some(
    (c) => c.name === "rag-data"
  );

  if (!exists) {
    await qdrant.createCollection("rag-data", {
      vectors: { size: 768, distance: "Cosine" },
    });
  }

  // Index all chunks
  for (let i = 0; i < chunks.length; i++) {
    const vector = await embedText(chunks[i]);

    await qdrant.upsert("rag-data", {
      wait: true,
      points: [
        {
          id: Date.now() + i,
          vector,
          payload: { text: chunks[i] },
        },
      ],
    });
  }

  console.log(`Indexing complete. Processed ${chunks.length} chunks.`);
  return chunks.length;
}

/* ---------- QUESTION TYPE CHECK ---------- */
function isDefinitionQuestion(question) {
  const q = question.toLowerCase().trim();
  return (
    q.startsWith("what is") ||
    q.startsWith("meaning of") ||
    q.startsWith("define") ||
    q.includes("what does")
  );
}

/* ---------- ASK QUESTION ---------- */
export async function askQuestion({ question, mode = "hybrid" }) {
  try {
    const queryVector = await embedText(question);

    const results = await qdrant.search("rag-data", {
      vector: queryVector,
      limit: 5,
    });

    const contextChunks = results.map((r) => r.payload.text);
    const context = contextChunks.join("\n");

    /* ---------- STRICT MODE ---------- */
    if (mode === "strict") {
      if (!context || context.trim().length === 0) {
        return "This information is not present in the uploaded document.";
      }

      return await generateAnswer({
        systemPrompt: `
You are a document-grounded AI assistant.
Answer ONLY using the provided context.
If the answer is not explicitly present, say:
"This information is not present in the uploaded document."
`,
        context,
        question,
      });
    }

    /* ---------- HYBRID MODE ---------- */
    if (isDefinitionQuestion(question)) {
      return await generateAnswer({
        systemPrompt: `
You are a hybrid AI assistant.

Rules:
- If the question asks for the meaning or definition of a term or name,
  you may use general knowledge.
- Do NOT invent document-specific facts.
- Acknowledge document mentions if relevant.
`,
        context,
        question,
      });
    }

    return await generateAnswer({
      systemPrompt: `
You are a hybrid RAG AI assistant.

Rules:
- Use document context for document-specific facts.
- Never fabricate document facts.
- General explanations and advice are allowed.
- Be honest when information is not present.
`,
      context,
      question,
    });

  } catch (err) {
    if (err?.status === 429) {
      return "⚠️ Daily AI usage limit reached. Please try again later.";
    }

    console.error("askQuestion error:", err);
    return "⚠️ AI service is temporarily unavailable. Please try again later.";
  }
}