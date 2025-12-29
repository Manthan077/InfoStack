import express from "express";
import puppeteer from "puppeteer";
import { indexText } from "../services/ragChain.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded" });

    const text = await page.evaluate(() =>
      document.body.innerText
    );

    await browser.close();

    if (!text || text.length < 50) {
      return res.status(400).json({ error: "No readable text found" });
    }

    await indexText(text);

    res.json({ success: true, message: "Website indexed successfully" });
  } catch (err) {
    console.error("WEBSITE INDEX ERROR:", err);
    res.status(500).json({ error: "Website indexing failed" });
  }
});

export default router;
