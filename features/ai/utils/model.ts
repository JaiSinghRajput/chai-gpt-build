import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  fetch: async (input, init) => {
    console.log(init?.headers);

    return fetch(input, init);
  },
});

/** Default OpenAI model used when a conversation has no model override. */
export const DEFAULT_CHAT_MODEL =
  process.env.OPENAI_MODEL_NAME || 'gpt-4.1-mini';

/**
 * Returns an OpenAI language model instance for chat completions.
 *
 * @param modelId - Optional model identifier; falls back to DEFAULT_CHAT_MODEL.
 */
export function getChatModel(modelId?: string | null) {
  return openai(modelId || DEFAULT_CHAT_MODEL);
}