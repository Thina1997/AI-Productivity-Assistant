import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wand2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AiOutputPanel } from "@/components/AiOutputPanel";
import { useAiTool } from "@/hooks/use-ai-tool";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI" },
      {
        name: "description",
        content: "Turn raw meeting notes into key points, action items with owners, deadlines and risks.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      { property: "og:description", content: "Structured summaries, action items and deadlines from messy notes." },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const { result, error, isLoading, generate } = useAiTool("notes");
  const [title, setTitle] = useState("");
  const [attendees, setAttendees] = useState("");
  const [notes, setNotes] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;
    generate(
      [
        title.trim() ? `Meeting: ${title}` : "",
        attendees.trim() ? `Attendees: ${attendees}` : "",
        `Raw notes / transcript:\n${notes}`,
      ]
        .filter(Boolean)
        .join("\n"),
    );
  };

  return (
    <AppShell title="Meeting Notes Summarizer" description="Key points, action items and deadlines">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Meeting input</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Meeting title (optional)</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Q3 roadmap review"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attendees">Attendees (optional)</Label>
                  <Input
                    id="attendees"
                    value={attendees}
                    onChange={(e) => setAttendees(e.target.value)}
                    placeholder="Thina, Sipho, Amara"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Raw notes or transcript</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={14}
                  placeholder="Paste your messy notes here — bullet fragments and transcripts both work."
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading || !notes.trim()} className="w-full">
                <Wand2 className="size-4" />
                {isLoading ? "Summarising…" : "Summarise meeting"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <AiOutputPanel
          result={result}
          isLoading={isLoading}
          error={error}
          emptyHint="Paste notes to get a summary, key points, an action-item table and open risks."
        />
      </div>
    </AppShell>
  );
}
