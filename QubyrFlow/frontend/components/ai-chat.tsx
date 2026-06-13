"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ChatMessage } from "@/lib/types";
import { callGemini } from "@/lib/api";

const MOCK_RESPONSES = [
  "**Pipeline Status:** All systems are currently **Nominal**. No immediate action required. Next scheduled inspection is in 14 days.",
  "**Corrosion Analysis:** Rates are within acceptable parameters at **0.12 mm/yr**. Scheduled maintenance can proceed as planned.",
  "**Lifetime Estimate:** Based on current degradation models, DEMO-001 has an estimated **46.7 years** until critical threshold.",
  "**Pressure Report:** Fluctuations detected are within normal operating range (**90-110 psi**). No anomalies flagged.",
  "**Thermal Status:** Temperature readings stable at **22.3C**. Thermal expansion coefficients are within design specifications.",
  "**Model Confidence:** Predictive model accuracy is at **94.2%**. Recommend next physical inspection in **6 months**.",
];

function parseMarkdownBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export function AiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm the **EcoPipe Guard** AI Assistant. Ask me about **pipeline health**, corrosion data, or maintenance schedules.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSend = () => {
  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const prompt = input.trim();
    setInput("");
    setIsTyping(true);

    try {
      const res = await callGemini(prompt);
      // Try common response shapes
      let content = "";
      if (!res) content = "(empty response)";
      else if (typeof res === "string") content = res;
      else if (res.text) content = res.text;
      else if (res.output_text) content = res.output_text;
      else if (res.result) content = typeof res.result === "string" ? res.result : JSON.stringify(res.result);
      else content = JSON.stringify(res);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: `Ошибка: ${err?.message ?? String(err)}`,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
          open
            ? "scale-0 opacity-0"
            : "scale-100 bg-primary opacity-100 hover:shadow-xl"
        }`}
        aria-label="Open AI chat"
      >
        <Sparkles className="h-6 w-6 text-primary-foreground" />
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-6 left-6 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl transition-all duration-300 ${
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="relative flex items-center justify-between bg-primary px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/20">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-extrabold tracking-tight text-primary-foreground">
                EcoPipe AI
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                <span className="text-[11px] font-bold text-primary-foreground/70">
                  Online
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            className="h-8 w-8 rounded-full bg-transparent p-0 text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto bg-secondary/30 px-4 py-4"
        >
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    msg.role === "assistant"
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground text-background"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Bot className="h-3.5 w-3.5" />
                  ) : (
                    <User className="h-3.5 w-3.5" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-md bg-primary font-semibold text-primary-foreground"
                      : "rounded-bl-md border border-border/60 bg-card font-medium text-card-foreground shadow-sm"
                  }`}
                >
                  {msg.role === "assistant"
                    ? parseMarkdownBold(msg.content)
                    : msg.content}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-end gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-border/60 bg-card px-4 py-3 shadow-sm">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-border/50 bg-card px-4 py-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about pipeline data..."
              disabled={isTyping}
              className="h-10 flex-1 rounded-xl border border-border/60 bg-secondary/50 px-4 text-sm font-semibold text-foreground placeholder:font-medium placeholder:text-muted-foreground/60 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40 disabled:hover:bg-primary"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-2 text-center text-[10px] font-bold text-muted-foreground/50">
            Powered by EcoPipe Guard AI
          </p>
        </div>
      </div>
    </>
  );
}
}
