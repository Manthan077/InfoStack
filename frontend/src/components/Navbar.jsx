import { useState, useEffect } from "react";
import { Info, Menu } from "lucide-react";
import logo from "../assets/infostack-logo.png";

export default function Navbar({ onMenuClick }) {
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setShowAbout(false);
    };
    if (showAbout) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [showAbout]);

  return (
    <>
      <header className="h-14 md:h-16 px-3 md:px-10 flex items-center bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mr-2"
        >
          <Menu size={20} />
        </button>

        {/* Context chip - hidden on mobile */}
        <div className="hidden md:block text-xs px-5 py-2 rounded-full bg-gray-100 dark:bg-gray-700/70 border border-gray-300 dark:border-gray-600/60 text-gray-700 dark:text-gray-300">
          RAG Playground
        </div>

        {/* Brand */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Infostack Logo"
              className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 transition hover:scale-105"
              loading="lazy"
            />
            <h1 className="text-lg md:text-2xl font-semibold tracking-widest text-gray-900 dark:text-gray-100">
              INFOSTACK
            </h1>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Online status - hidden on mobile */}
          <div className="hidden md:flex items-center gap-2 text-xs px-4 py-2 rounded-full border border-green-500/40 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Online
          </div>

          {/* About */}
          <button
            onClick={() => setShowAbout(true)}
            className="p-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <Info size={16} />
          </button>
        </div>
      </header>

      {/* About Modal */}
      {showAbout && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAbout(false)}
          />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl">
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  About InfoStack
                </h3>
                <button
                  onClick={() => setShowAbout(false)}
                  className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
                >
                  <span>✕</span>
                </button>
              </div>

              <div className="px-5 py-4 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">InfoStack</span> is
                  a Retrieval-Augmented Generation (RAG) playground for exploring
                  document-grounded AI.
                </p>

                <p>
                  Upload PDFs, websites, or text and query them using
                  <span className="text-blue-600 dark:text-blue-400 font-medium"> Strict</span> or
                  <span className="text-blue-600 dark:text-blue-400 font-medium"> Hybrid</span> modes.
                </p>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400">
                    Built by{" "}
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      Manthan Sharma
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    React · Node.js · Qdrant · Gemini · RAG
                  </p>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700 text-right">
                <button
                  onClick={() => setShowAbout(false)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition"
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
