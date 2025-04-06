import { gateway } from "@vercel/ai-sdk-gateway";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  const models = await gateway.getAvailableModels();
  //   console.log(JSON.stringify(models, null, 2));
  return json(models);
};
