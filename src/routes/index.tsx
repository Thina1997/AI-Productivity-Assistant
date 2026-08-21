import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, NotebookPen, ListChecks, Telescope, MessagesSquare, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DISCLAIMER } from "@/lib/prompts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant — Dashboard" },
      {
        name: "description",
        content:
          "Automate daily work with AI: draft emails, summarise meetings, plan tasks, research topics and chat with a work assistant.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Draft emails, summarise meetings, plan tasks and research faster with AI.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    description: "Ready-to-send emails tuned to tone, audience and intent.",
  },
  {
    to: "/notes",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    description: "Key points, owners, deadlines and open risks from raw notes.",
  },
  {
    to: "/planner",
    icon: ListChecks,
    title: "AI Task Planner",
    description: "Prioritised task list plus a realistic time-blocked schedule.",
  },
  {
    to: "/research",
    icon: Telescope,
    title: "AI Research Assistant",
    description: "Briefings with insights, trade-offs and next steps.",
  },
  {
    to: "/chat",
    icon: MessagesSquare,
    title: "AI Chatbot",
    description: "Think out loud with a professional assistant that keeps context.",
  },
] as const;

function Dashboard() {
  return (
    <AppShell
      title="Dashboard"
      description="Your AI workspace for everyday professional tasks"
    >
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <section className="overflow-hidden rounded-2xl bg-gradient-primary p-6 shadow-elevated sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/80">
            Workplace AI
          </p>
          <h2 className="mt-3 max-w-2xl text-2xl font-bold text-primary-foreground sm:text-3xl">
            Spend less time on busywork and more on the work that matters.
          </h2>
          <p className="mt-3 max-w-xl text-sm text-primary-foreground/85">
            Five focused assistants built with structured prompts, so outputs stay clear, consistent and
            genuinely usable at work.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link to="/email">
                Draft an email <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link to="/chat">Open AI chat</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <Card key={tool.to} className="group shadow-card transition-shadow hover:shadow-elevated">
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <tool.icon className="size-5" />
                </span>
                <CardTitle className="mt-3 text-base">{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" size="sm" className="px-0 text-primary hover:bg-transparent">
                  <Link to={tool.to}>
                    Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>

        <p className="text-xs text-muted-foreground">{DISCLAIMER}</p>
      </div>
    </AppShell>
  );
}
