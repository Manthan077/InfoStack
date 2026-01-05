import express from "express";
import { indexText } from "../services/ragChain.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Text is required" });
    }

    // ✅ Unique source for raw text input
    const source = `user-text-${Date.now()}`;

    const totalChunks = await indexText(text, source);

    res.json({
      success: true,
      message: "Text indexed successfully",
      source,
      chunks: totalChunks,
    });
  } catch (err) {
    console.error("Text indexing error:", err.message);
    res.status(500).json({ error: "Text indexing failed" });
  }
});

export default router;
