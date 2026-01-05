import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import logo from "../assets/infostack-logo.png";

export default function Navbar() {
  const [showAbout, setShowAbout] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowAbout(false);
      }
    };
    if (showAbout) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [showAbout]);

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
              loading="lazy"
            />

            {/* Primary brand */}
            <h1 className="text-xl md:text-2xl font-semibold tracking-widest text-gray-100">
              INFOSTACK
            </h1>
          </div>
        </div>

        {/* Right: Status + About */}
        <div className="flex items-center gap-2">
          {/* Online Status */}
          <div className="flex items-center gap-2 text-xs px-4 py-2 rounded-full border border-green-500/40 text-green-400 bg-green-500/10">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Online
          </div>

          {/* About button with aria-label */}
          <button
            onClick={() => setShowAbout(true)}
            aria-label="About InfoStack"
            title="About InfoStack"
            className="p-2 rounded-full border border-gray-600 text-gray-400 hover:text-blue-400 hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <Info size={16} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* About Modal with backdrop and fade-in */}
      {showAbout && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
            aria-hidden="true"
            onClick={() => setShowAbout(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
            <div 
              className="w-full max-w-md rounded-xl bg-gray-800 border border-gray-700 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="about-title"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700">
                <h3 id="about-title" className="text-sm font-semibold text-gray-100">
                  About InfoStack
                </h3>
                <button
                  onClick={() => setShowAbout(false)}
                  className="p-1 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-full transition focus:outline-none focus:ring-2 focus:ring-gray-500"
                  aria-label="Close modal"
                >
                  <span aria-hidden="true">✕</span>
                </button>
              </div>

              {/* Content */}
              <div className="px-5 py-4 space-y-3 text-sm text-gray-300">
                <p>
                  <span className="font-semibold text-gray-100">InfoStack</span> is
                  a Retrieval-Augmented Generation (RAG) playground for exploring
                  document-grounded AI.
                </p>

                <p>
                  Upload PDFs, websites, or text and query them using
                  <span className="text-blue-400 font-medium"> Strict</span> or
                  <span className="text-blue-400 font-medium"> Hybrid</span> modes.
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

              {/* Footer */}
              <div className="px-5 py-3 border-t border-gray-700 text-right">
                <button
                  onClick={() => setShowAbout(false)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
