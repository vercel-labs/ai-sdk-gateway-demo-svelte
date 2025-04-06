import { gateway } from "@vercel/ai-sdk-gateway";
import { streamText } from "ai";
import type { RequestEvent } from "@sveltejs/kit";

const DEFAULT_MODEL = "xai/grok-2-1212";

export async function POST({ request }: RequestEvent) {
  const { messages, modelId = DEFAULT_MODEL } = await request.json();

  const result = streamText({
    model: gateway(modelId),
    system: "You are a software engineer exploring Generative AI.",
    messages,
    onError: (error) => {
      console.error(error);
    },
  });

  return result.toDataStreamResponse();
}
