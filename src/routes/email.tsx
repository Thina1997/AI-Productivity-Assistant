import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AiOutputPanel } from "@/components/AiOutputPanel";
import { useAiTool } from "@/hooks/use-ai-tool";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      {
        name: "description",
        content: "Generate professional work emails tailored to tone, audience, length and intent.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      { property: "og:description", content: "Tone- and audience-aware business emails in seconds." },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Professional", "Friendly", "Persuasive", "Apologetic", "Assertive", "Concise"];
const AUDIENCES = ["Client", "Manager", "Team member", "Executive leadership", "Vendor", "New prospect"];
const LENGTHS = ["Short (under 100 words)", "Medium (100-180 words)", "Detailed (200+ words)"];

function EmailPage() {
  const { result, error, isLoading, generate } = useAiTool("email");
  const [purpose, setPurpose] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState<string>(TONES[0]!);
  const [audience, setAudience] = useState<string>(AUDIENCES[0]!);
  const [length, setLength] = useState<string>(LENGTHS[1]!);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim()) return;
    generate(
      [
        `Purpose of the email: ${purpose}`,
        `Audience: ${audience}`,
        `Tone: ${tone}`,
        `Length: ${length}`,
        context.trim() ? `Additional context and key points to include:\n${context}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    );
  };

  return (
    <AppShell title="Smart Email Generator" description="Tone- and audience-aware business emails">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Email brief</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="purpose">What is the email about?</Label>
                <Input
                  id="purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Follow up on the delayed Q3 deliverable"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Audience</Label>
                  <Select value={audience} onValueChange={setAudience}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {AUDIENCES.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Length</Label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LENGTHS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="context">Key points / context (optional)</Label>
                <Textarea
                  id="context"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  rows={6}
                  placeholder="New delivery date is 14 Sept, cause was a vendor delay, offer a call on Thursday."
                />
              </div>

              <Button type="submit" disabled={isLoading || !purpose.trim()} className="w-full">
                <Send className="size-4" />
                {isLoading ? "Writing email…" : "Generate email"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <AiOutputPanel
          result={result}
          isLoading={isLoading}
          error={error}
          emptyHint="Describe the email and your draft will appear here, complete with a subject line."
        />
      </div>
    </AppShell>
  );
}
