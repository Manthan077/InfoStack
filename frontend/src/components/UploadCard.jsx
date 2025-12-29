import { useState } from "react";
import { BACKEND_URL } from "../config";
import ImageUpload from "./ImageUpload";


export default function UploadCard() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    try {
      setLoading(true);
      setStatus("");

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        await fetch(`${BACKEND_URL}/upload`, {
          method: "POST",
          body: formData
        });

        setStatus("PDF indexed successfully");
      } 
      else if (url) {
        await fetch(`${BACKEND_URL}/scrape`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url })
        });

        setStatus("Website indexed successfully");
      } 
      else {
        setStatus("Please upload a file or enter a URL");
      }
    } catch (err) {
      setStatus("Error indexing data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
      <h2 className="text-xl font-semibold mb-4">📂 Knowledge Source</h2>

      <div className="space-y-4">
        <ImageUpload />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full border rounded-lg p-2"
        />

        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border rounded-lg p-2"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-xl hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Indexing..." : "Index Data"}
        </button>

        {status && (
          <p className="text-sm text-gray-600">{status}</p>
        )}
      </div>
    </div>
  );
}
