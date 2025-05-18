import { gateway } from "@vercel/ai-sdk-gateway";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import type { RequestEvent } from "@sveltejs/kit";

const DEFAULT_MODEL = "xai/grok-3-beta";

export async function POST({ request }: RequestEvent) {
  const {
    messages,
    modelId = DEFAULT_MODEL,
  }: { messages: UIMessage[]; modelId: string } = await request.json();

  const result = streamText({
    model: gateway(modelId),
    system: "You are a software engineer exploring Generative AI.",
    messages: convertToModelMessages(messages),
    onError: (error) => {
      console.error(error);
    },
  });

  return result.toUIMessageStreamResponse();
}
