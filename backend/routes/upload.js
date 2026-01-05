import express from "express";
import multer from "multer";
import fs from "fs";
import pdfParse from "pdf-parse/lib/pdf-parse.js";

import { indexText } from "../services/ragChain.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let text = "";

    if (req.file.mimetype === "application/pdf") {
      const data = await pdfParse(fs.readFileSync(req.file.path));
      text = data.text;
    } else {
      text = fs.readFileSync(req.file.path, "utf-8");
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "No text content found in file" });
    }

    // ✅ Use original filename as document source
    const source = req.file.originalname;

    const totalChunks = await indexText(text, source);

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: "File uploaded and indexed successfully",
      source,
      chunks: totalChunks,
    });
  } catch (err) {
    console.error("Upload error:", err.message);

    // Clean up uploaded file on error
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;
