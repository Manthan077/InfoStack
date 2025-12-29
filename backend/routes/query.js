import express from "express";
import { askQuestion } from "../services/ragChain.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { question, mode = "hybrid" } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const answer = await askQuestion({ question, mode });

    // ✅ Always return a string answer
    return res.json({ answer });

  } catch (err) {
    console.error("Query error:", err);

    // ❌ No Gemini-specific logic here
    // ✅ Generic backend failure only
    return res.status(500).json({
      answer: "⚠️ Something went wrong while processing your request.",
    });
  }
});

export default router;
