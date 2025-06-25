import { gateway } from "@ai-sdk/gateway";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { SUPPORTED_MODELS } from "$lib/constants";

export const GET: RequestHandler = async () => {
  return json({
    models: (await gateway.getAvailableModels()).models.filter((model) =>
      SUPPORTED_MODELS.includes(model.id)
    ),
  });
};
