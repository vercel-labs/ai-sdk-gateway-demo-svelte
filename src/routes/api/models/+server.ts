import { gateway } from "@ai-sdk/gateway";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { SUPPORTED_MODELS } from "$lib/constants";

export const GET: RequestHandler = async () => {
  const allModels = await gateway.getAvailableModels();

  // Filter to only include supported models
  const supportedModels = {
    models: allModels.models.filter((model) =>
      SUPPORTED_MODELS.includes(model.id)
    ),
  };

  return json(supportedModels);
};
