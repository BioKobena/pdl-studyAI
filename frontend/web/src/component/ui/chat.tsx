"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User } from "lucide-react";
import { sendChatMessage } from "@/lib/api/chat";
import { useSearchParams } from "next/navigation";

export default function AIMessageBar() {
  const params = useSearchParams();
  const key = params.get("key") || "";
  const subjectIdFromUrl = params.get("subjectId") || "";

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  // ✅ Fix: restaurer activeSubjectId depuis URL / subjectId:key
  useEffect(() => {
    const fromActive = sessionStorage.getItem("activeSubjectId") || "";
    const fromKey = key ? sessionStorage.getItem(`subjectId:${key}`) || "" : "";
    const resolved = subjectIdFromUrl || fromActive || fromKey;

    if (resolved) {
      sessionStorage.setItem("activeSubjectId", resolved);
    }
  }, [key, subjectIdFromUrl]);

  const getUserId = () => {
    // ✅ tu stockes "userId" (dans auth.ts). On garde aussi "userid" au cas où.
    const fromLocal = localStorage.getItem("userId") || localStorage.getItem("userid");
    if (fromLocal) return fromLocal;

    try {
      const currentUser = JSON.parse(localStorage.getItem("current_user") || "{}");
      return currentUser?.id || null;
    } catch {
      return null;
    }
  };

  const getActiveSubjectId = () => {
    return (
      subjectIdFromUrl ||
      sessionStorage.getItem("activeSubjectId") ||
      (key ? sessionStorage.getItem(`subjectId:${key}`) : "") ||
      ""
    );
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");

    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setIsTyping(true);

    try {
      const userId = getUserId();
      const subjectId = getActiveSubjectId();

      if (!userId) throw new Error("Utilisateur non connecté (userId introuvable).");
      if (!subjectId) throw new Error("Aucun PDF actif : subjectId introuvable.");

      const result = await sendChatMessage(userId, subjectId, userMessage);

      setMessages((prev) => [...prev, { text: result?.message ?? "Réponse vide.", isUser: false }]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { text: err?.message ?? "Erreur lors de l’envoi du message.", isUser: false },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full mx-auto h-[600px] rounded-2xl shadow-xl bg-gradient-to-br from-[#f3faff] to-[#e6f4fb] border border-[#3FA9D9]/20 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-[#3FA9D9] text-white rounded-t-2xl flex items-center gap-3 shadow-md">
        <Bot className="w-6 h-6" />
        <h2 className="font-semibold text-lg">StudyAI Assistant</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
            <Bot className="w-14 h-14 text-[#3FA9D9]" />
            <p className="text-[#3FA9D9] text-lg font-medium">
              Comment puis-je vous aider aujourd&apos;hui ?
            </p>
            <p className="text-gray-500 text-sm max-w-xs">
              Posez une question, demandez une explication de cours ou lancez une discussion.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.isUser ? "justify-end" : ""}`}>
              {!msg.isUser && (
                <Bot className="w-6 h-6 text-[#3FA9D9] bg-white p-1 rounded-full shadow-sm" />
              )}

              <div
                className={`px-4 py-2 max-w-[75%] rounded-2xl shadow-sm text-sm leading-relaxed ${
                  msg.isUser
                    ? "bg-[#3FA9D9] text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-[#3FA9D9]/20 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>

              {msg.isUser && (
                <User className="w-6 h-6 text-white bg-[#3FA9D9] p-1 rounded-full shadow-sm" />
              )}
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-[#3FA9D9]" />
            <div className="px-4 py-2 bg-white border border-[#3FA9D9]/30 rounded-2xl shadow-sm text-gray-500">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-[#3FA9D9] animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-[#3FA9D9] animate-bounce delay-150"></span>
                <span className="w-2 h-2 rounded-full bg-[#3FA9D9] animate-bounce delay-300"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
        <div className="relative">
          <input
            className="w-full bg-[#f0f7fb] border border-gray-300 rounded-full py-3 pl-4 pr-12 text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-[#3FA9D9] outline-none"
            placeholder="Écrivez votre message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#3FA9D9] hover:bg-[#2B7FB5] text-white p-2 rounded-full shadow transition disabled:opacity-50"
          >
            {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  );
}
