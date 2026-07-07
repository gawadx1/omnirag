import type { LLMProvider, LLMProviderConstructor } from "./types";
import type { AIProvider, LLMModelConfig } from "@/types";
import { OpenAIProvider } from "./providers/openai";
import { AnthropicProvider } from "./providers/anthropic";
import { GeminiProvider } from "./providers/gemini";
import { DeepSeekProvider } from "./providers/deepseek";
import { OllamaProvider } from "./providers/ollama";

const registry: Record<AIProvider, LLMProviderConstructor> = {
  OPENAI: OpenAIProvider,
  ANTHROPIC: AnthropicProvider,
  GEMINI: GeminiProvider,
  DEEPSEEK: DeepSeekProvider,
  OLLAMA: OllamaProvider,
};

export function getLLMProvider(config: LLMModelConfig): LLMProvider {
  const Provider = registry[config.provider];
  if (!Provider) {
    throw new Error(`Unsupported provider: ${config.provider}`);
  }
  return new Provider(config);
}

export function getProviderNames(): { id: AIProvider; name: string }[] {
  return [
    { id: "OPENAI", name: "OpenAI" },
    { id: "ANTHROPIC", name: "Anthropic Claude" },
    { id: "GEMINI", name: "Google Gemini" },
    { id: "DEEPSEEK", name: "DeepSeek" },
    { id: "OLLAMA", name: "Ollama" },
  ];
}
