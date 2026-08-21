import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Telescope } from "lucide-react";
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

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace AI" },
      {
        name: "description",
        content: "Get structured briefings with insights, trade-offs and recommended next steps on any work topic.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      { property: "og:description", content: "Executive briefings with insights and next steps." },
    ],
  }),
  component: ResearchPage,
});

const DEPTHS = ["Quick brief", "Standard briefing", "Deep dive"];

function ResearchPage() {
  const { result, error, isLoading, generate } = useAiTool("research");
  const [topic, setTopic] = useState("");
  const [goal, setGoal] = useState("");
  const [depth, setDepth] = useState(DEPTHS[1]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    generate(
      [
        `Research topic: ${topic}`,
        `Depth: ${depth}`,
        goal.trim() ? `What the reader needs to decide or do:\n${goal}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    );
  };

  return (
    <AppShell title="AI Research Assistant" description="Insights, trade-offs and next steps">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Research request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic or question</Label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="How should a 20-person team adopt AI note-taking tools?"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Depth</Label>
                <Select value={depth} onValueChange={setDepth}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DEPTHS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal">Decision or context (optional)</Label>
                <Textarea
                  id="goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  rows={7}
                  placeholder="We need a recommendation for the leadership meeting on Friday. Budget is limited."
                />
              </div>
              <Button type="submit" disabled={isLoading || !topic.trim()} className="w-full">
                <Telescope className="size-4" />
                {isLoading ? "Researching…" : "Generate briefing"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <AiOutputPanel
          result={result}
          isLoading={isLoading}
          error={error}
          emptyHint="Ask a question to receive an executive summary, insights, trade-offs and next steps."
        />
      </div>
    </AppShell>
  );
}
