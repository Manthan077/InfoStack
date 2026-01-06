import express from "express";
import { qdrant } from "../services/qdrant.js";

const router = express.Router();

router.delete("/:source", async (req, res) => {
  try {
    const source = decodeURIComponent(req.params.source);

    await qdrant.delete("rag-data", {
      wait: true,
      filter: {
        must: [{ key: "source", match: { value: source } }],
      },
    });

    res.json({
      success: true,
      message: `Document '${source}' removed successfully`,
    });
  } catch (err) {
    console.error("Delete document error:", err);
    res.status(500).json({ error: "Failed to delete document" });
  }
});

export default router;
