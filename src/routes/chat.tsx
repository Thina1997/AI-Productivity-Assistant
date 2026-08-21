import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SendHorizontal, Sparkles, User, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Markdown } from "@/components/AiOutputPanel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { runAssistantChat } from "@/lib/ai.functions";
import { DISCLAIMER } from "@/lib/prompts";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat — Workplace AI" },
      {
        name: "description",
        content: "Chat with a professional AI assistant that helps you draft, plan and think through work.",
      },
      { property: "og:title", content: "AI Chat — Workplace AI" },
      { property: "og:description", content: "A pragmatic AI colleague for everyday work questions." },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Help me say no to a low-priority request politely",
  "Turn this update into three bullet points for leadership",
  "What should I ask in a vendor evaluation call?",
];

function ChatPage() {
  const send = useServerFn(runAssistantChat);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const submit = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setError(null);
    setIsLoading(true);
    try {
      const data = await send({ data: { messages: next.slice(-20) } });
      setMessages([...next, { role: "assistant", content: data.text }]);
    } catch (e) {
      setError((e as Error)?.message ?? "The assistant could not respond. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell title="AI Chat" description="A professional assistant that keeps your context">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <Card className="flex min-h-[55vh] flex-col gap-4 p-4 shadow-card sm:p-6">
          <div className="flex-1 space-y-5">
            {messages.length === 0 && !isLoading ? (
              <div className="py-10 text-center">
                <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gradient-primary shadow-elevated">
                  <Sparkles className="size-5 text-primary-foreground" />
                </span>
                <h2 className="mt-4 text-base font-semibold">How can I help with your work today?</h2>
                <p className="mt-1 text-sm text-muted-foreground">Try one of these to get started.</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <Button key={s} variant="outline" size="sm" onClick={() => submit(s)}>
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map((m, i) => (
              <div key={i} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    m.role === "user" ? "bg-secondary text-secondary-foreground" : "bg-gradient-primary text-primary-foreground",
                  )}
                >
                  {m.role === "user" ? <User className="size-4" /> : <Sparkles className="size-4" />}
                </span>
                <div
                  className={cn(
                    "max-w-[85%] rounded-xl px-4 py-3 text-sm",
                    m.role === "user"
                      ? "bg-secondary text-secondary-foreground"
                      : "border border-border bg-card",
                  )}
                >
                  {m.role === "user" ? (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <Markdown>{m.content}</Markdown>
                  )}
                </div>
              </div>
            ))}

            {isLoading ? (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-primary">
                  <Sparkles className="size-4 animate-pulse text-primary-foreground" />
                </span>
                Thinking…
              </div>
            ) : null}

            {error ? (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="flex items-end gap-2 border-t border-border pt-4"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(input);
                }
              }}
              rows={2}
              placeholder="Ask anything about your work…"
              className="min-h-[52px] resize-none"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} aria-label="Send message">
              <SendHorizontal className="size-4" />
            </Button>
          </form>
        </Card>

        <p className="text-xs text-muted-foreground">{DISCLAIMER}</p>
      </div>
    </AppShell>
  );
}
