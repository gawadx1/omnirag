"use client";

import { motion } from "framer-motion";
import { Section, SectionHeader, FadeIn } from "@/components/landing/ui/section";
import {
  FileText,
  Search,
  Brain,
  PenTool,
  Network,
  MessagesSquare,
  Quote,
  ShieldAlert,
  BarChart3,
  Bot,
  KeyRound,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Document Ingestion",
    description: "Parse PDF, DOCX, TXT, Markdown, HTML, CSV, and images with OCR. Automatic chunking and embedding.",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Search,
    title: "Hybrid Search",
    description: "Combine vector search with BM25 or Elasticsearch. Semantic + keyword for optimal relevance.",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: Brain,
    title: "Semantic Search",
    description: "Understand meaning, not just keywords. Multi-provider embeddings for accurate retrieval.",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
  {
    icon: PenTool,
    title: "Query Rewriting",
    description: "Automatic query expansion, HyDE, and multi-query generation for better recall.",
    gradient: "from-orange-500/20 to-yellow-500/20",
  },
  {
    icon: Network,
    title: "Multi-Vector Retrieval",
    description: "Parent-child chunking, MMR diversification, and metadata filtering for precision.",
    gradient: "from-red-500/20 to-rose-500/20",
  },
  {
    icon: MessagesSquare,
    title: "Streaming Responses",
    description: "Real-time streaming with markdown rendering, code highlighting, and source citations.",
    gradient: "from-indigo-500/20 to-purple-500/20",
  },
  {
    icon: Quote,
    title: "Source Citations",
    description: "Every answer includes verified sources, confidence scores, and document references.",
    gradient: "from-teal-500/20 to-cyan-500/20",
  },
  {
    icon: ShieldAlert,
    title: "Hallucination Detection",
    description: "Real-time groundedness checking, citation validation, and faithfulness scoring.",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: BarChart3,
    title: "Evaluation Pipeline",
    description: "RAGAS metrics: faithfulness, answer relevancy, context precision, and recall.",
    gradient: "from-sky-500/20 to-blue-500/20",
  },
  {
    icon: Bot,
    title: "Multi-Provider AI",
    description: "OpenAI, Claude, Gemini, DeepSeek, Ollama. Switch providers from the UI.",
    gradient: "from-violet-500/20 to-purple-500/20",
  },
  {
    icon: KeyRound,
    title: "Authentication",
    description: "Email, Google, GitHub login with Better Auth. RBAC and workspace support.",
    gradient: "from-pink-500/20 to-rose-500/20",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "Encrypted API keys, audit logs, rate limiting, CSRF protection, and input validation.",
    gradient: "from-gray-500/20 to-slate-500/20",
  },
];

export default function FeaturesSection() {
  return (
    <Section id="features">
      <SectionHeader
        title="Enterprise-Grade RAG Pipeline"
        subtitle="Everything you need to build production-ready retrieval-augmented generation systems."
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, i) => (
          <FeatureCard key={feature.title} feature={feature} index={i} />
        ))}
      </div>
    </Section>
  );
}

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const Icon = feature.icon;
  return (
    <FadeIn delay={index * 0.05}>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        className="group relative rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-6 hover:border-primary/30 hover:bg-card/50 transition-all duration-300"
      >
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        <div className="relative z-10">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">{feature.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
        </div>
      </motion.div>
    </FadeIn>
  );
}
