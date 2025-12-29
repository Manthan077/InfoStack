import { useState, useRef, useEffect } from "react";
import {
  Bot,
  RotateCcw,
  Copy,
  RefreshCcw,
  Check,
} from "lucide-react";
import { BACKEND_URL } from "../config";

/* ---------- Improved Empty State ---------- */
const INITIAL_MESSAGE = {
  role: "assistant",
  text:
    "📄 Upload a document, website, or text from the sidebar.\n\n" +
    "🔒 Use STRICT mode for verified, document-only answers.\n" +
    "🧠 Use HYBRID mode for explanations, meanings, and guidance.",
};

const generateSessionId = () => Math.random().toString(36).substring(2, 8);

export default function ChatBox() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(generateSessionId());
  const [confirmReset, setConfirmReset] = useState(false);

  const [mode, setMode] = useState("hybrid");

  const [copiedIndex, setCopiedIndex] = useState(null);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (questionOverride) => {
    const userQuestion = questionOverride || input;
    if (!userQuestion.trim() || loading) return;

    if (!questionOverride) {
      setMessages((prev) => [...prev, { role: "user", text: userQuestion }]);
      setInput("");
    }

    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userQuestion,
          sessionId,
          mode,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer || "⚠️ AI did not return a response.",
          mode,
          originalQuestion: userQuestion,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "⚠️ Something went wrong while fetching the answer.",
          mode,
          originalQuestion: userQuestion,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setSessionId(generateSessionId());
    setConfirmReset(false);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
      {/* Navbar */}
      <div className="sticky top-0 z-10 h-14 bg-gray-800/95 border-b border-gray-700 px-6 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <Bot size={18} className="text-blue-400" />
          <span className="text-sm font-semibold text-gray-100">
            InfoStack AI
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Session */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300 font-medium">
              Session:
            </span>
            <span className="px-2 py-0.5 rounded-md bg-gray-700 border border-gray-600 text-gray-200 font-mono text-xs">
              {sessionId}
            </span>
          </div>

          {/* Mode */}
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="px-2 py-1 rounded-md bg-gray-700 border border-gray-600 text-gray-200 text-xs outline-none hover:bg-gray-600"
          >
            <option value="hybrid">Hybrid (Doc + AI)</option>
            <option value="strict">Strict (Doc Only)</option>
          </select>

          {/* Reset */}
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-700 border border-gray-600 text-xs text-gray-200 hover:bg-gray-600"
            >
              <RotateCcw size={14} />
              New Chat
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={startNewChat}
                className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs hover:bg-red-700"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-3 py-1.5 rounded-lg bg-gray-700 border border-gray-600 text-xs text-gray-200 hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div className="mb-1 text-xs text-gray-400">
              {msg.role === "user" ? "You" : "AI"}
            </div>

            <div
              className={`max-w-[75%] px-5 py-3 rounded-xl text-base whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-gray-700 text-gray-100 rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>

            {msg.role === "assistant" && msg.originalQuestion && (
              <div className="mt-1 flex gap-4 text-xs">
                <button
                  onClick={() => copyToClipboard(msg.text, i)}
                  className={`flex items-center gap-1 ${
                    copiedIndex === i
                      ? "text-green-400"
                      : "text-gray-400 hover:text-blue-400"
                  }`}
                >
                  {copiedIndex === i ? (
                    <>
                      <Check size={12} /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={12} /> Copy
                    </>
                  )}
                </button>

                <button
                  onClick={() => sendMessage(msg.originalQuestion)}
                  className="flex items-center gap-1 text-gray-400 hover:text-green-400"
                >
                  <RefreshCcw size={12} /> Regenerate
                </button>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="bg-gray-700 text-gray-300 px-5 py-3 rounded-xl text-base w-fit">
            AI is thinking...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-700 px-4 py-3 flex gap-2 items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask something about your data…"
          className="flex-1 rounded-lg px-3 py-2 bg-gray-700 text-gray-100 outline-none"
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
