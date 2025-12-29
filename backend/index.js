import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import uploadRoutes from "./routes/upload.js";
import queryRoutes from "./routes/query.js";
import scrapeRoutes from "./routes/scrape.js";
import textRoutes from "./routes/text.js";
import websiteRoutes from "./routes/website.js";

dotenv.config();
console.log("Gemini key loaded:", process.env.GEMINI_API_KEY?.slice(0, 6));

const app = express();

app.use(cors());
app.use(express.json());

app.use("/upload", uploadRoutes);
app.use("/query", queryRoutes);
app.use("/scrape", scrapeRoutes);
app.use("/upload/text", textRoutes);
app.use("/upload/website", websiteRoutes);

app.get("/", (req, res) => {
  res.send("RAG Playground Backend Running");
});

app.post("/test", (req, res) => {
  console.log("TEST ROUTE HIT");
  res.json({ ok: true });
});


app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
