"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Send, Loader2, Trophy, RotateCcw, Swords } from "lucide-react";
import PageHeader from "@/components/PageHeader";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Debrief {
  outcome: string;
  outcome_explanation: string;
  score: number;
  what_worked: string;
  what_to_improve: string;
  real_world_tip: string;
  probability_of_success: string;
}

export default function RoleplayPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [clauseText, setClauseText] = useState("");
  const [persona, setPersona] = useState("landlord");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [debrief, setDebrief] = useState<Debrief | null>(null);
  const [started, setStarted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth");
  }, [user, authLoading, router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending || exchangeCount >= 3) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setSending(true);

    const newExchangeCount = exchangeCount + 1;
    setExchangeCount(newExchangeCount);

    try {
      // SSE Streaming
      const res = await fetch("/api/negotiation-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          clauseText,
          persona,
          exchangeCount: newExchangeCount,
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantContent += parsed.content;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: assistantContent,
                  };
                  return updated;
                });
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      // Get debrief after 3 exchanges
      if (newExchangeCount >= 3) {
        const debriefRes = await fetch("/api/negotiation-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...newMessages, { role: "assistant", content: assistantContent }],
            clauseText,
            persona,
            exchangeCount: newExchangeCount,
            requestDebrief: true,
          }),
        });
        if (debriefRes.ok) {
          const debriefData = await debriefRes.json();
          setDebrief(debriefData.debrief);
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setSending(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setExchangeCount(0);
    setDebrief(null);
    setStarted(false);
    setClauseText("");
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader
        icon={<Swords className="w-5 h-5" />}
        title="Negotiation Roleplay"
        subtitle="Practice negotiating with AI — 3 exchanges, then get a debrief"
      />

      {!started ? (
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-xl p-5">
            <label className="block text-sm font-medium mb-2">Clause to negotiate</label>
            <textarea
              value={clauseText}
              onChange={(e) => setClauseText(e.target.value)}
              placeholder="Paste the clause you want to negotiate about..."
              className="w-full h-32 px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="border border-gray-200 rounded-xl p-5">
            <label className="block text-sm font-medium mb-3">Who are you negotiating with?</label>
            <div className="flex gap-2">
              {["landlord", "employer", "client"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPersona(p)}
                  className={`px-4 py-2.5 rounded-xl text-sm capitalize transition-colors cursor-pointer ${
                    persona === p
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setStarted(true)}
            disabled={clauseText.trim().length < 20}
            className="w-full sm:w-auto px-6 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Start Negotiation →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Clause context */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Negotiating about</p>
              <span className="text-xs text-gray-400 capitalize">vs {persona}</span>
            </div>
            <p className="text-sm text-gray-700 line-clamp-2">{clauseText}</p>
          </div>

          {/* Exchange counter with progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-500 font-medium">Progress</span>
              <span className="text-xs text-gray-400">{exchangeCount}/3 exchanges</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full">
              <div
                className="h-full bg-black rounded-full transition-all"
                style={{ width: `${(exchangeCount / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-3 min-h-[200px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-black text-white rounded-br-md"
                      : "bg-gray-100 text-gray-800 rounded-bl-md"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <p className="text-xs text-gray-400 mb-1 capitalize">{persona}</p>
                  )}
                  {msg.content}
                </div>
              </div>
            ))}
            {sending && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          {exchangeCount < 3 && !debrief && (
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Type your response..."
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                disabled={sending}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          )}

          {/* Debrief */}
          {debrief && (
            <div className="border border-gray-200 rounded-xl p-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="font-medium">Negotiation Debrief</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1.5 rounded-xl text-sm font-medium ${
                    debrief.outcome === "WIN" ? "bg-green-100 text-green-700" :
                    debrief.outcome === "PARTIAL_WIN" ? "bg-amber-100 text-amber-700" :
                    debrief.outcome === "LOSS" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {debrief.outcome?.replace(/_/g, " ")}
                  </span>
                  <span className="text-sm text-gray-500">Score: <strong>{debrief.score}/10</strong></span>
                  <span className="text-sm text-gray-400">
                    Success: {debrief.probability_of_success}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{debrief.outcome_explanation}</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-xs text-green-700 font-medium mb-1.5">✓ What worked</p>
                    <p className="text-sm text-green-800">{debrief.what_worked}</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4">
                    <p className="text-xs text-amber-700 font-medium mb-1.5">△ To improve</p>
                    <p className="text-sm text-amber-800">{debrief.what_to_improve}</p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs text-blue-700 font-medium mb-1.5">💡 Real-world tip</p>
                  <p className="text-sm text-blue-800">{debrief.real_world_tip}</p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 mt-4 text-sm text-gray-400 hover:text-black transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Practice again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
