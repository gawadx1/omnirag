"use client";

import { motion } from "framer-motion";
import { Section, SectionHeader, FadeIn } from "@/components/landing/ui/section";
import { Check, X, Bot, Sparkles, Eye, Box } from "lucide-react";

const providers = [
  {
    name: "OpenAI",
    gradient: "from-green-500/20 to-emerald-500/20",
    models: ["GPT-4o", "GPT-4-turbo", "GPT-3.5-turbo"],
    embeddings: "text-embedding-3-small / 3-large",
    streaming: true,
    vision: true,
  },
  {
    name: "Claude",
    gradient: "from-orange-500/20 to-amber-500/20",
    models: ["Claude 3.5 Sonnet", "Claude 3 Opus", "Claude 3 Haiku"],
    embeddings: "OpenAI compatible",
    streaming: true,
    vision: true,
  },
  {
    name: "Gemini",
    gradient: "from-blue-500/20 to-indigo-500/20",
    models: ["Gemini 1.5 Pro", "Gemini 1.5 Flash", "Gemini 1.0 Pro"],
    embeddings: "embedding-001",
    streaming: true,
    vision: true,
  },
  {
    name: "DeepSeek",
    gradient: "from-cyan-500/20 to-teal-500/20",
    models: ["DeepSeek-V2", "DeepSeek-Coder"],
    embeddings: "text-embedding-ada-002",
    streaming: true,
    vision: false,
  },
  {
    name: "Ollama",
    gradient: "from-purple-500/20 to-pink-500/20",
    models: ["Llama 3.1", "Mistral", "Qwen 2.5", "Phi-3", "Gemma 2"],
    embeddings: "nomic-embed-text / mxbai-embed",
    streaming: true,
    vision: false,
  },
];

export default function ProvidersSection() {
  return (
    <Section id="providers">
      <SectionHeader
        title="Multi-Provider AI Support"
        subtitle="Switch between leading AI providers without changing your code."
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-w-6xl mx-auto">
        {providers.map((p, i) => (
          <ProviderCard key={p.name} provider={p} index={i} />
        ))}
      </div>
    </Section>
  );
}

function ProviderCard({
  provider,
  index,
}: {
  provider: typeof providers[0];
  index: number;
}) {
  return (
    <FadeIn delay={index * 0.1}>
      <motion.div
        whileHover={{ y: -4 }}
        className="group relative rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-5 hover:border-primary/30 transition-all duration-300"
      >
        <div
          className={`absolute inset-0 rounded-xl bg-gradient-to-br ${provider.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{provider.name}</h3>
              <p className="text-[10px] text-muted-foreground">{provider.embeddings}</p>
            </div>
          </div>
          <div className="space-y-1.5">
            {provider.models.map((m) => (
              <div key={m} className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-primary/60" />
                {m}
              </div>
            ))}
          </div>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              {provider.streaming ? <Check className="w-3 h-3 text-green-500" /> : <X className="w-3 h-3 text-red-500" />}
              Streaming
            </span>
            <span className="flex items-center gap-1">
              {provider.vision ? <Eye className="w-3 h-3 text-green-500" /> : <X className="w-3 h-3 text-red-500" />}
              Vision
            </span>
            <span className="flex items-center gap-1">
              <Box className="w-3 h-3 text-primary/60" />
              Embeddings
            </span>
          </div>
        </div>
      </motion.div>
    </FadeIn>
  );
}
