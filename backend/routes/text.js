import express from "express";
import { indexText } from "../services/ragChain.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Text is required" });
    }

    await indexText(text);

    res.json({ success: true, message: "Text indexed successfully" });
  } catch (err) {
    console.error("TEXT INDEX ERROR:", err);
    res.status(500).json({ error: "Text indexing failed" });
  }
});

export default router;
