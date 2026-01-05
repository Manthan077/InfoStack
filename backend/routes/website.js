import express from "express";
import puppeteer from "puppeteer";
import { indexText } from "../services/ragChain.js";

const router = express.Router();

// simple text cleaner (CRITICAL)
function cleanText(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/[^\x20-\x7E]+/g, " ") // remove invalid unicode
    .trim();
}

router.post("/", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    );

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    const rawText = await page.evaluate(() =>
      document.body.innerText || ""
    );

    await browser.close();

    const text = cleanText(rawText);

    if (!text || text.length < 100) {
      return res
        .status(400)
        .json({ error: "No readable text found" });
    }

    // ✅ URL as source
    const source = url;

    const totalChunks = await indexText(text, source);

    res.json({
      success: true,
      message: "Website indexed successfully",
      source,
      chunks: totalChunks,
    });
  } catch (err) {
    console.error("Website indexing error:", err.message);
    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;
