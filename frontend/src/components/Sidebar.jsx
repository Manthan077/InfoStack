import { useRef, useState } from "react";
import { BACKEND_URL } from "../config";
import {
  Database,
  Loader2,
  CheckCircle,
  X,
  FileText,
  File,
  Globe,
  Trash2,
} from "lucide-react";

const formatSize = (bytes) => {
  if (!bytes) return "—";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

export default function Sidebar() {
  const [width, setWidth] = useState(320);
  const resizingRef = useRef(false);

  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [website, setWebsite] = useState("");

  const [textLoading, setTextLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [websiteLoading, setWebsiteLoading] = useState(false);

  const [textSteps, setTextSteps] = useState([]);
  const [fileSteps, setFileSteps] = useState([]);
  const [websiteSteps, setWebsiteSteps] = useState([]);
  const [indexedSources, setIndexedSources] = useState([]);

  const [confirmClear, setConfirmClear] = useState(false);

  /* ---------- Resize ---------- */
  const startResize = () => {
    resizingRef.current = true;
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
  };

  const resize = (e) => {
    if (!resizingRef.current) return;
    setWidth(Math.min(Math.max(e.clientX, 260), 420));
  };

  const stopResize = () => {
    resizingRef.current = false;
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResize);
  };

  /* ---------- Step runner ---------- */
  const runSteps = async (labels, setSteps, action) => {
    setSteps(labels.map((label) => ({ label, done: false })));

    for (let i = 0; i < labels.length; i++) {
      setSteps((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, done: true } : s))
      );
      await new Promise((r) => setTimeout(r, 500));
    }

    await action();
    setTimeout(() => setSteps([]), 1200);
  };

  /* ---------- Clear all ---------- */
  const clearAllSources = () => {
    setIndexedSources([]);
    setConfirmClear(false);
  };

  /* ---------- Index text ---------- */
  const indexText = async () => {
    if (!text.trim()) return;
    setTextLoading(true);

    try {
      await runSteps(
        ["Chunking text", "Embedding", "Storing vectors"],
        setTextSteps,
        async () => {
          await fetch(`${BACKEND_URL}/upload/text`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
          });
        }
      );

      setIndexedSources((p) => [
        ...p,
        {
          id: Date.now(),
          name: "Text",
          type: "Text",
          size: `${text.length} chars`,
        },
      ]);

      setText("");
    } finally {
      setTextLoading(false);
    }
  };

  /* ---------- Index file ---------- */
  const indexFile = async () => {
    if (!file) return;
    setFileLoading(true);

    try {
      await runSteps(
        ["Uploading file", "Parsing", "Chunking", "Embedding", "Storing vectors"],
        setFileSteps,
        async () => {
          const formData = new FormData();
          formData.append("file", file);
          await fetch(`${BACKEND_URL}/upload`, {
            method: "POST",
            body: formData,
          });
        }
      );

      setIndexedSources((p) => [
        ...p,
        {
          id: Date.now(),
          name: file.name,
          type: file.type.includes("pdf") ? "PDF" : "Image",
          size: formatSize(file.size),
        },
      ]);

      setFile(null);
    } finally {
      setFileLoading(false);
    }
  };

  /* ---------- Index website ---------- */
  const indexWebsite = async () => {
    if (!website.trim()) return;
    setWebsiteLoading(true);

    try {
      await runSteps(
        ["Scraping site", "Cleaning", "Chunking", "Embedding", "Storing vectors"],
        setWebsiteSteps,
        async () => {
          await fetch(`${BACKEND_URL}/upload/website`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: website }),
          });
        }
      );

      setIndexedSources((p) => [
        ...p,
        {
          id: Date.now(),
          name: website,
          type: "Website",
          size: "Scraped",
        },
      ]);

      setWebsite("");
    } finally {
      setWebsiteLoading(false);
    }
  };

  return (
    <aside
      style={{ width }}
      className="h-full flex flex-col bg-gray-800 border border-gray-700 rounded-xl overflow-hidden relative"
    >
      {/* Navbar */}
      <div className="sticky top-0 z-10 h-14 bg-gray-800/95 border-b border-gray-700 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database size={18} className="text-blue-400" />
          <h2 className="text-sm font-semibold text-gray-100">
            Upload Data Sources
          </h2>
        </div>
      </div>

      {/* Indexed Sources */}
      {indexedSources.length > 0 && (
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs text-gray-400 uppercase">
              Indexed Sources
            </h3>

            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400"
              >
                <Trash2 size={12} /> Clear all
              </button>
            ) : (
              <div className="flex gap-2 text-xs">
                <button
                  onClick={clearAllSources}
                  className="text-red-400 hover:underline"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="text-gray-400 hover:underline"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2 text-sm">
            {indexedSources.map((src) => (
              <div
                key={src.id}
                className="flex items-center justify-between gap-2 text-gray-200"
              >
                <div className="flex flex-col max-w-52.5">
                  <span
                    className="truncate"
                    title={src.name}
                  >
                    {src.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {src.type} · {src.size}
                  </span>
                </div>

                <button
                  onClick={() =>
                    setIndexedSources((p) =>
                      p.filter((s) => s.id !== src.id)
                    )
                  }
                  className="text-gray-400 hover:text-red-400"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        {/* Write Text */}
        <section>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
            <FileText size={14} /> Write Text
          </label>

          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write or paste text to index…"
            style={{ resize: "none" }}
            className="mt-2 w-full rounded-lg border border-gray-600 bg-transparent p-2 text-base text-gray-100 overflow-y-auto"
          />

          <button
            onClick={indexText}
            disabled={textLoading}
            className="mt-2 w-full bg-blue-600 text-white rounded-lg py-2 text-base hover:bg-blue-700 disabled:opacity-50"
          >
            {textLoading ? "Indexing..." : "Index Text"}
          </button>

          <StepsUI steps={textSteps} />
        </section>

        {/* Upload Files */}
        <section>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
            <File size={14} /> Upload Files
          </label>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              setFile(e.dataTransfer.files[0]);
            }}
            className="mt-2 min-h-30 rounded-xl border-2 border-dashed border-gray-600 p-4 flex flex-col items-center justify-center text-base text-gray-400 hover:border-blue-500 transition text-center"
          >
            {file ? (
              <div className="flex flex-col items-center gap-1 max-w-full">
                <span
                  className="truncate max-w-55 text-gray-200"
                  title={file.name}
                >
                  📎 {file.name}
                </span>
                <span className="text-xs text-gray-400">
                  {file.type.includes("pdf") ? "PDF" : "Image"} ·{" "}
                  {formatSize(file.size)}
                </span>
              </div>
            ) : (
              "Drag & drop PDF or Image"
            )}

            <input
              type="file"
              accept=".pdf,image/*"
              hidden
              id="fileUpload"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <label
              htmlFor="fileUpload"
              className="mt-2 text-blue-400 cursor-pointer text-base hover:underline"
            >
              Browse files
            </label>
          </div>

          <button
            onClick={indexFile}
            disabled={fileLoading}
            className="mt-2 w-full bg-blue-600 text-white rounded-lg py-2 text-base hover:bg-blue-700 disabled:opacity-50"
          >
            {fileLoading ? "Indexing..." : "Index Files"}
          </button>

          <StepsUI steps={fileSteps} />
        </section>

        {/* Website */}
        <section>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
            <Globe size={14} /> Website
          </label>

          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://example.com"
            className="mt-2 w-full rounded-lg border border-gray-600 bg-transparent p-2 text-base text-gray-100"
          />

          <button
            onClick={indexWebsite}
            disabled={websiteLoading}
            className="mt-2 w-full bg-blue-600 text-white rounded-lg py-2 text-base hover:bg-blue-700 disabled:opacity-50"
          >
            {websiteLoading ? "Indexing..." : "Index Website"}
          </button>

          <StepsUI steps={websiteSteps} />
        </section>
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={startResize}
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500"
      />
    </aside>
  );
}

/* ---------- Steps UI ---------- */
function StepsUI({ steps }) {
  if (!steps.length) return null;

  const progress = (steps.filter((s) => s.done).length / steps.length) * 100;

  return (
    <div className="mt-3 space-y-2">
      <div className="h-1 w-full bg-gray-700 rounded">
        <div
          className="h-1 bg-blue-500 rounded transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
          {s.done ? (
            <CheckCircle size={12} className="text-green-400" />
          ) : (
            <Loader2 size={12} className="animate-spin text-blue-400" />
          )}
          <span>{s.label}</span>
        </div>
      ))}
    </div>
  );
}
