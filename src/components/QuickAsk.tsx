"use client";

import { useState, useRef, useEffect } from "react";
import {
  Zap,
  X,
  Send,
  Loader2,
  Bot,
} from "lucide-react";

export default function QuickAsk() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Keyboard shortcut: Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const askQuestion = async () => {
    if (!question.trim() || loading) return;
    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("/api/quick-ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });

      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setAnswer(data.answer);
    } catch {
      setAnswer("Sorry, something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setQuestion("");
    setAnswer("");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all hover:scale-105 flex items-center justify-center group cursor-pointer"
        title="Quick Ask (Ctrl+K)"
      >
        <Zap className="w-5 h-5" />
        <span className="absolute right-full mr-3 bg-black text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Quick Ask <kbd className="ml-1 text-gray-400 text-[10px]">⌘K</kbd>
        </span>
      </button>

      {/* Panel Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute bottom-6 right-6 w-[380px] max-h-[500px] bg-background rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium">Quick Ask</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {answer ? (
                <div className="space-y-3">
                  <div className="text-right">
                    <span className="inline-block bg-black text-white text-sm px-3 py-2 rounded-xl rounded-br-md max-w-[90%]">
                      {question}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-gray-100 text-sm px-3 py-2 rounded-xl rounded-bl-md text-gray-700 whitespace-pre-wrap">
                      {answer}
                    </div>
                  </div>
                  <button
                    onClick={reset}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    Ask another question →
                  </button>
                </div>
              ) : loading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400 mb-2" />
                  <span className="text-sm text-gray-400">Thinking...</span>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 mb-1">Ask any quick legal question</p>
                  <p className="text-xs text-gray-400">
                    Get instant answers about Indian law
                  </p>
                </div>
              )}
            </div>

            {/* Input */}
            {!answer && (
              <div className="border-t border-gray-100 px-3 py-2.5 flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && askQuestion()}
                  placeholder="e.g. Can landlord evict without notice?"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                  disabled={loading}
                />
                <button
                  onClick={askQuestion}
                  disabled={!question.trim() || loading}
                  className="px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-30 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
