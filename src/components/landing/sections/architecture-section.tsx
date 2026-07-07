"use client";

import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/landing/ui/section";
import { useIntersection } from "@/lib/landing/hooks";
import { useState, useEffect, useRef } from "react";
import {
  Upload,
  FileText,
  SplitSquareHorizontal,
  Box,
  Database,
  Search,
  ArrowDown,
  SlidersHorizontal,
  Cpu,
  MessageSquareText,
} from "lucide-react";

const steps = [
  { icon: Upload, label: "Upload Documents", desc: "PDF, DOCX, TXT, MD, HTML, CSV, Images" },
  { icon: FileText, label: "Parsing", desc: "Extract text and metadata" },
  { icon: SplitSquareHorizontal, label: "Chunking", desc: "Semantic / Recursive / Parent-Child" },
  { icon: Box, label: "Embeddings", desc: "Multi-provider vector generation" },
  { icon: Database, label: "Vector Database", desc: "Qdrant / Pinecone / Chroma" },
  { icon: Search, label: "Retriever", desc: "Hybrid search + BM25 + MMR" },
  { icon: SlidersHorizontal, label: "Reranker", desc: "Jina / Cohere / BGE / Cross-Encoder" },
  { icon: Cpu, label: "LLM", desc: "OpenAI / Claude / Gemini / DeepSeek / Ollama" },
  { icon: MessageSquareText, label: "Answer with Citations", desc: "Sources + confidence + streaming" },
];

export default function ArchitectureSection() {
  return (
    <Section id="architecture">
      <SectionHeader
        title="How It Works"
        subtitle="End-to-end RAG pipeline from document upload to verified answers."
      />
      <div className="relative max-w-3xl mx-auto">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />
        <div className="space-y-0">
          {steps.map((step, i) => (
            <ArchitectureStep key={step.label} step={step} index={i} total={steps.length} />
          ))}
        </div>
      </div>
    </Section>
  );
}

function ArchitectureStep({
  step,
  index,
  total,
}: {
  step: typeof steps[0];
  index: number;
  total: number;
}) {
  const { ref, isVisible } = useIntersection();
  const Icon = step.icon;

  return (
    <div ref={ref} className="relative flex gap-6 pb-0">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={isVisible ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative z-10 w-16 h-16 rounded-xl border border-border/50 bg-card flex items-center justify-center shadow-lg"
        >
          <Icon className="w-6 h-6 text-primary" />
        </motion.div>
        {index < total - 1 && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isVisible ? { scaleY: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-px flex-1 bg-gradient-to-b from-primary/30 to-border/10 origin-top"
          />
        )}
      </div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="pb-12 pt-3"
      >
        <h3 className="font-semibold text-lg">{step.label}</h3>
        <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
      </motion.div>
    </div>
  );
}
