import { gateway } from "@ai-sdk/gateway";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import type { RequestEvent } from "@sveltejs/kit";
import { DEFAULT_MODEL, SUPPORTED_MODELS } from "$lib/constants";

export async function POST({ request }: RequestEvent) {
  const {
    messages,
    modelId = DEFAULT_MODEL,
  }: { messages: UIMessage[]; modelId: string } = await request.json();

  // Validate that the modelId is supported
  if (!SUPPORTED_MODELS.includes(modelId)) {
    return new Response(
      JSON.stringify({ error: `Model ${modelId} is not supported` }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const result = streamText({
    model: gateway(modelId),
    system: "You are a software engineer exploring Generative AI.",
    messages: convertToModelMessages(messages),
    onError: (error: unknown) => {
      console.error(error);
    },
  });

  return result.toUIMessageStreamResponse();
}
