import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import crypto from "crypto";
import { generateAnswer } from "./gemini.js";
import { qdrant } from "./qdrant.js";

/* ---------- Embedding ---------- */
function fakeEmbedding(text) {
  const hash = crypto.createHash("sha256").update(text).digest();
  const base = Array.from(hash).map((v) => v / 255);

  const vector = [];
  while (vector.length < 64) vector.push(...base);

  return vector.slice(0, 64);
}

/* ---------- Indexing ---------- */
export async function indexText(text) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = await splitter.splitText(text);

  try {
    await qdrant.deleteCollection("rag-data");
  } catch (_) {}

  await qdrant.createCollection("rag-data", {
    vectors: { size: 64, distance: "Cosine" },
  });

  for (let i = 0; i < chunks.length; i++) {
    await qdrant.upsert("rag-data", {
      points: [
        {
          id: Date.now() + i,
          vector: fakeEmbedding(chunks[i]),
          payload: { text: chunks[i] },
        },
      ],
    });
  }
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

/* ---------- ASK QUESTION (FIXED & SAFE) ---------- */
export async function askQuestion({ question, mode = "hybrid" }) {
  try {
    const queryVector = fakeEmbedding(question);

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
    // 🔥 FINAL GUARANTEE: ALWAYS RETURN STRING
    if (err?.status === 429) {
      return "⚠️ Daily AI usage limit reached. Please try again later.";
    }

    console.error("askQuestion error:", err);
    return "⚠️ AI service is temporarily unavailable. Please try again later.";
  }
}
