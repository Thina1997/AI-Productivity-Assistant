import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ToolInput = z.object({
  feature: z.enum(["email", "notes", "planner", "research"]),
  prompt: z.string().min(1).max(20000),
});

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(10000),
      }),
    )
    .min(1)
    .max(40),
});

async function callGateway(system: string, messages: { role: "user" | "assistant"; content: string }[]) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured (missing API key).");

  const { streamText } = await import("ai");
  const { createLovableAiGatewayProvider, AI_MODEL } = await import("./ai-gateway.server");

  const gateway = createLovableAiGatewayProvider(key);

  try {
    const result = streamText({
      model: gateway(AI_MODEL),
      system,
      messages,
    });
    return { text: await result.text };
  } catch (error) {
    const status = (error as { statusCode?: number; status?: number })?.statusCode ??
      (error as { status?: number })?.status;
    if (status === 429) {
      throw new Error("Rate limit reached. Please wait a moment and try again.");
    }
    if (status === 402) {
      throw new Error("AI credits are exhausted. Add credits in Lovable to continue.");
    }
    if (status === 403) {
      throw new Error("AI access is blocked for this workspace. Contact the workspace admin.");
    }
    throw new Error(
      (error as Error)?.message ? `AI request failed: ${(error as Error).message}` : "AI request failed.",
    );
  }
}

export const runAssistantTool = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ToolInput.parse(input))
  .handler(async ({ data }) => {
    const { SYSTEM_PROMPTS } = await import("./prompts");
    return callGateway(SYSTEM_PROMPTS[data.feature], [{ role: "user", content: data.prompt }]);
  });

export const runAssistantChat = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const { SYSTEM_PROMPTS } = await import("./prompts");
    return callGateway(SYSTEM_PROMPTS.chat, data.messages);
  });
