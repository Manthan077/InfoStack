import express from "express";
import puppeteer from "puppeteer";
import { indexText } from "../services/ragChain.js";

const router = express.Router();

/* ---------- text cleaner (IMPORTANT) ---------- */
function cleanText(text) {
  return text
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

router.post("/", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    const rawText = await page.evaluate(
      () => document.body.innerText || ""
    );

    await browser.close();

    const text = cleanText(rawText);

    if (!text || text.length < 100) {
      return res
        .status(400)
        .json({ error: "No readable text found" });
    }

    // ✅ SOURCE IS REQUIRED
    const source = url;

    const chunks = await indexText(text, source);

    res.json({
      success: true,
      message: "Website indexed successfully",
      source,
      chunks,
    });
  } catch (err) {
    console.error("Website indexing error:", err);
    res.status(500).json({
      error: err.message || "Website indexing failed",
    });
  }
});

export default router;
