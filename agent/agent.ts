import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { defineAgent } from "eve";

const ollama = createOpenAICompatible({
  name: "ollama",
  baseURL: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1",
  apiKey: process.env.OLLAMA_API_KEY ?? "ollama",
});

export default defineAgent({
  model: ollama(process.env.OLLAMA_MODEL ?? "llama3.2"),
  modelContextWindowTokens: Number(process.env.OLLAMA_CONTEXT_WINDOW ?? "32768"),
});
