import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { runAssistantTool } from "@/lib/ai.functions";

type Feature = "email" | "notes" | "planner" | "research";

export function useAiTool(feature: Feature) {
  const run = useServerFn(runAssistantTool);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generate = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await run({ data: { feature, prompt } });
      setResult(data.text);
    } catch (e) {
      setError((e as Error)?.message ?? "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { result, error, isLoading, generate };
}
