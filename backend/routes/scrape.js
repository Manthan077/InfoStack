import express from "express";
import puppeteer from "puppeteer";

import { indexText } from "../services/ragChain.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { url } = req.body;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const text = await page.evaluate(() => document.body.innerText);
  await browser.close();

  await indexText(text);
  res.json({ success: true });
});

export default router;
