import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, AlertCircle, Sparkles } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DISCLAIMER } from "@/lib/prompts";

export function Markdown({ children }: { children: string }) {
  return (
    <div className="ai-output text-sm text-foreground">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}

export function AiOutputPanel({
  result,
  isLoading,
  error,
  emptyHint,
}: {
  result: string | null;
  isLoading: boolean;
  error: string | null;
  emptyHint: ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="text-base">Output</CardTitle>
        {result && !isLoading ? (
          <Button variant="outline" size="sm" onClick={copy}>
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        ) : null}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3" aria-live="polite" aria-busy="true">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="size-4 animate-pulse text-primary" />
              Generating a professional draft…
            </div>
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : error ? (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : result ? (
          <>
            <Markdown>{result}</Markdown>
            <p className="mt-6 border-t border-border pt-3 text-xs text-muted-foreground">{DISCLAIMER}</p>
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-muted/40 p-6 text-sm text-muted-foreground">
            {emptyHint}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
