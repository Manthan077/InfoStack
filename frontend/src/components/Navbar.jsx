import { useState } from "react";
import { Info } from "lucide-react";
import logo from "../assets/infostack-logo.png";

export default function Navbar() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <header className="h-16 px-10 flex items-center bg-gray-800 border border-gray-700 shadow-sm">
        {/* Left: Context Chip */}
        <div className="text-xs px-5 py-2 rounded-full bg-gray-700/70 border border-gray-600/60 text-gray-300">
          RAG Playground
        </div>

        {/* Center: Brand */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2">
            {/* Subtle logo mark */}
            <img
              src={logo}
              alt="Infostack Logo"
              className="h-10 w-10 rounded-full object-cover bg-gray-800 border border-gray-600 transition hover:scale-105"
            />

            {/* Primary brand */}
            <h1 className="text-xl font-semibold tracking-widest text-gray-100">
              INFOSTACK
            </h1>
          </div>
        </div>

        {/* Right: Status + About */}
        <div className="flex items-center gap-2">
          {/* Online Status */}
          <div className="flex items-center gap-2 text-xs px-4 py-2 rounded-full border border-green-500/40 text-green-400 bg-green-500/10">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Online
          </div>

          {/* About */}
          <button
            onClick={() => setShowAbout(true)}
            title="About InfoStack"
            className="p-2 rounded-full border border-gray-600 text-gray-400 hover:text-blue-400 hover:bg-gray-700 transition"
          >
            <Info size={16} />
          </button>
        </div>
      </header>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-gray-800 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700">
              <h3 className="text-sm font-semibold text-gray-100">
                About InfoStack
              </h3>
              <button
                onClick={() => setShowAbout(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="px-5 py-4 space-y-3 text-sm text-gray-300">
              <p>
                <span className="font-semibold text-gray-100">InfoStack</span> is
                a Retrieval-Augmented Generation (RAG) playground for exploring
                document-grounded AI.
              </p>

              <p>
                Upload PDFs, websites, or text and query them using
                <span className="text-blue-400"> Strict</span> or
                <span className="text-blue-400"> Hybrid</span> modes.
              </p>

              <div className="pt-2 border-t border-gray-700">
                <p className="text-gray-400">
                  Built by{" "}
                  <span className="text-gray-100 font-medium">
                    Manthan Sharma
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  React · Node.js · Qdrant · Gemini · RAG
                </p>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-gray-700 text-right">
              <button
                onClick={() => setShowAbout(false)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
