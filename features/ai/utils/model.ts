import { createOpenAI } from "@ai-sdk/openai";

const openrouter = createOpenAI({
  apiKey: process.env.AI_API_KEY!,
  baseURL: process.env.AI_BASE_URL,

//   // Optional but recommended by OpenRouter
//   headers: {
//     "HTTP-Referer": "https://your-site.com",
//     "X-Title": "Your App",
//   },
});

/** Default model used when a conversation has no model override. */
export const DEFAULT_CHAT_MODEL =
  process.env.AI_MODEL_NAME || "mistralai/mistral-small-3.2-24b-instruct";

/**
 * Returns a language model instance.
 */
export function getChatModel(modelId?: string | null) {
  return openrouter(modelId ?? DEFAULT_CHAT_MODEL);
}