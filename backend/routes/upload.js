import express from "express";
import multer from "multer";
import fs from "fs";
import pdfParse from "pdf-parse/lib/pdf-parse.js";

import { indexText } from "../services/ragChain.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    console.log("UPLOAD ROUTE HIT");

    if (!req.file) {
      console.log("NO FILE RECEIVED");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("FILE RECEIVED:", req.file.originalname);

    let text = "";

    if (req.file.mimetype === "application/pdf") {
      console.log("Parsing PDF...");
      const data = await pdfParse(fs.readFileSync(req.file.path));
      text = data.text;
    } else {
      console.log("Parsing text file...");
      text = fs.readFileSync(req.file.path, "utf-8");
    }

    console.log("Text length:", text.length);

    await indexText(text);

    console.log("INDEXING COMPLETE");

    res.json({ success: true });
  } catch (err) {
    console.error("UPLOAD ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
