import express from "express";
import { askQuestion } from "../services/ragChain.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { question, mode = "hybrid" } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    // ✅ askQuestion already returns { answer, sources }
    const result = await askQuestion({ question, mode });

    // ✅ Forward it directly (DO NOT WRAP AGAIN)
    return res.json(result);

  } catch (err) {
    console.error("Query error:", err);

    return res.status(500).json({
      answer: "⚠️ Something went wrong while processing your request.",
      sources: [],
    });
  }
});

export default router;
