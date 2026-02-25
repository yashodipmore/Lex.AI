"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Send,
  Plus,
  Loader2,
  MessageSquare,
  Trash2,
  Bot,
  User,
  Clock,
  Sparkles,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

interface ChatItem {
  _id: string;
  title: string;
  category: string;
  lastMessageAt: string;
  messageCount: number;
  lastMessage: string;
}

const QUICK_PROMPTS = [
  "What are my rights as a tenant in India?",
  "Can my employer enforce a non-compete clause?",
  "How to file a consumer complaint online?",
  "What is Section 138 of NI Act (cheque bounce)?",
  "How much security deposit can a landlord take?",
  "What is the process to send a legal notice?",
  "Can I break a lock-in period in rental agreement?",
  "What are my rights if employer withholds salary?",
];

const CATEGORIES = [
  { value: "general", label: "General Legal" },
  { value: "tenant", label: "Tenant / Rental" },
  { value: "employment", label: "Employment" },
  { value: "consumer", label: "Consumer" },
  { value: "property", label: "Property" },
  { value: "business", label: "Business" },
  { value: "family", label: "Family Law" },
  { value: "criminal", label: "Criminal" },
];

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [chats, setChats] = useState<ChatItem[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [category, setCategory] = useState("general");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth");
  }, [user, authLoading, router]);

  // Load chat list
  useEffect(() => {
    if (user) loadChats();
  }, [user]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadChats = async () => {
    try {
      setLoadingChats(true);
      const res = await fetch("/api/chat");
      if (res.ok) {
        const data = await res.json();
        setChats(data.chats || []);
      }
    } catch {
      /* silent */
    } finally {
      setLoadingChats(false);
    }
  };

  const loadChat = async (chatId: string) => {
    try {
      const res = await fetch(`/api/chat/${chatId}`);
      if (res.ok) {
        const data = await res.json();
        setActiveChatId(chatId);
        setMessages(data.chat.messages || []);
        setCategory(data.chat.category || "general");
      }
    } catch {
      /* silent */
    }
  };

  const startNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setInput("");
    setCategory("general");
  };

  const deleteChat = async (chatId: string) => {
    try {
      const res = await fetch(`/api/chat/${chatId}`, { method: "DELETE" });
      if (res.ok) {
        setChats((prev) => prev.filter((c) => c._id !== chatId));
        if (activeChatId === chatId) startNewChat();
      }
    } catch {
      /* silent */
    }
  };

  const sendMessage = async (text?: string) => {
    const message = text || input.trim();
    if (!message || sending) return;

    setInput("");
    setSending(true);

    // Optimistically add user message
    setMessages((prev) => [...prev, { role: "user", content: message }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          chatId: activeChatId,
          category,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);

      // Update chat ID and list
      if (!activeChatId) {
        setActiveChatId(data.chatId);
      }
      loadChats();
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-56px)]">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-72" : "w-0"
        } bg-gray-50/80 border-r border-gray-200 flex flex-col transition-all duration-200 overflow-hidden shrink-0`}
      >
        <div className="p-3 border-b border-gray-200">
          <button
            onClick={startNewChat}
            className="flex items-center gap-2 w-full px-3 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingChats ? (
            <div className="p-4 space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : chats.length === 0 ? (
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-xs text-gray-400">No chats yet</p>
              <p className="text-[10px] text-gray-300 mt-0.5">Start your first conversation</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  className={`group flex items-start gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    activeChatId === chat._id
                      ? "bg-background border border-gray-200 shadow-sm"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => loadChat(chat._id)}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 truncate">{chat.title}</p>
                    <p className="text-xs text-gray-400 truncate">{chat.lastMessage}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat._id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-200 bg-background">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <h2 className="text-sm font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Ask LexAI
            </h2>
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-xs border border-gray-200 rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium mb-1">Ask LexAI Anything</h3>
                <p className="text-sm text-gray-400 max-w-sm">
                  Your personal Indian legal AI assistant. Ask about rights,
                  laws, contracts, disputes — anything legal.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(prompt)}
                    className="text-left px-4 py-3 border border-gray-200 rounded-xl text-xs text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-black text-white rounded-br-md"
                        : "bg-gray-100 text-gray-800 rounded-bl-md"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              {sending && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                    <span className="text-sm text-gray-500">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 bg-background px-4 py-3">
          <div className="max-w-3xl mx-auto flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask any legal question..."
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 transition-colors"
              disabled={sending}
            />
            <button
              onClick={() => sendMessage()}
              disabled={sending || !input.trim()}
              className="px-4 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-30 cursor-pointer"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            LexAI provides legal guidance under Indian law. For formal proceedings, consult a qualified advocate.
          </p>
        </div>
      </div>
    </div>
  );
}
