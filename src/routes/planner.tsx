import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AiOutputPanel } from "@/components/AiOutputPanel";
import { useAiTool } from "@/hooks/use-ai-tool";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workplace AI" },
      {
        name: "description",
        content: "Prioritise your task list and get a realistic, time-blocked schedule for the day.",
      },
      { property: "og:title", content: "AI Task Planner" },
      { property: "og:description", content: "Priorities, effort estimates and a time-blocked plan." },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const { result, error, isLoading, generate } = useAiTool("planner");
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState([8]);
  const [workday, setWorkday] = useState("09:00–17:00");
  const [constraints, setConstraints] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tasks.trim()) return;
    generate(
      [
        `Tasks (one per line, with any stated deadlines):\n${tasks}`,
        `Available working hours today: ${hours[0]} hours`,
        `Working window: ${workday}`,
        constraints.trim() ? `Fixed commitments and constraints:\n${constraints}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    );
  };

  return (
    <AppShell title="AI Task Planner" description="Prioritisation and realistic scheduling">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Your day</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="tasks">Tasks</Label>
                <Textarea
                  id="tasks"
                  value={tasks}
                  onChange={(e) => setTasks(e.target.value)}
                  rows={9}
                  placeholder={"Finish client proposal (due tomorrow)\nReview 3 PRs\nPrep board slides\nInbox triage"}
                  required
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="hours">Available hours</Label>
                  <span className="text-sm font-semibold text-primary">{hours[0]}h</span>
                </div>
                <Slider id="hours" value={hours} onValueChange={setHours} min={1} max={12} step={1} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workday">Working window</Label>
                <Input id="workday" value={workday} onChange={(e) => setWorkday(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="constraints">Fixed commitments (optional)</Label>
                <Textarea
                  id="constraints"
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  rows={4}
                  placeholder="Standup 09:15–09:30, client call 14:00–15:00"
                />
              </div>

              <Button type="submit" disabled={isLoading || !tasks.trim()} className="w-full">
                <CalendarClock className="size-4" />
                {isLoading ? "Planning…" : "Build my plan"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <AiOutputPanel
          result={result}
          isLoading={isLoading}
          error={error}
          emptyHint="Add your tasks to get priorities, effort estimates and a time-blocked schedule."
        />
      </div>
    </AppShell>
  );
}
