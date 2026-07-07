"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section, SectionHeader } from "@/components/landing/ui/section";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What is OmniRAG?",
    a: "OmniRAG is a production-ready enterprise RAG (Retrieval-Augmented Generation) platform built entirely with TypeScript and Next.js. It enables you to upload documents, ask questions, and get AI-powered answers with source citations.",
  },
  {
    q: "Do I need Python to run OmniRAG?",
    a: "No. OmniRAG is built 100% with TypeScript and Next.js. There are zero Python dependencies. It deploys seamlessly on Vercel as serverless functions.",
  },
  {
    q: "Which AI providers are supported?",
    a: "OmniRAG supports OpenAI (GPT-4o, GPT-4-turbo), Anthropic Claude (Sonnet, Opus, Haiku), Google Gemini (Pro, Flash), DeepSeek (V2, Coder), and Ollama (Llama 3.1, Mistral, Qwen, and more). You can switch providers from the UI without changing code.",
  },
  {
    q: "How is security handled?",
    a: "API keys are encrypted at rest using AES-256-GCM. All sensitive operations are server-side only. We provide RBAC, audit logging, rate limiting, and CSRF protection. API keys are never exposed to the client.",
  },
  {
    q: "What vector databases can I use?",
    a: "OmniRAG supports Qdrant, Pinecone, and Chroma. You can switch between them from the Settings page. Hybrid search combines vector search with BM25 for optimal results.",
  },
  {
    q: "Can I deploy this on Vercel?",
    a: "Yes. OmniRAG is designed for Vercel deployment. It uses Next.js serverless functions and supports PostgreSQL via Prisma. No Docker or additional infrastructure required.",
  },
  {
    q: "How does hallucination detection work?",
    a: "OmniRAG implements multi-layer hallucination detection: answer groundedness checking against source documents, citation validation, unsupported statement detection, and faithfulness scoring. Each response includes a confidence score and warning flags.",
  },
  {
    q: "What file formats are supported?",
    a: "We support PDF, DOCX, TXT, Markdown, HTML, CSV, and images (PNG, JPEG, WebP, TIFF) with OCR. Documents are automatically parsed, chunked, and indexed.",
  },
];

export default function FAQSection() {
  return (
    <Section id="faq">
      <SectionHeader
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about OmniRAG."
      />
      <div className="max-w-2xl mx-auto space-y-2">
        {faqs.map((faq, i) => (
          <FAQItem key={i} question={faq.q} answer={faq.a} index={i} />
        ))}
      </div>
    </Section>
  );
}

function FAQItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03 }}
      className="rounded-xl border border-border/40 bg-card/20 backdrop-blur-sm overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/20 transition-colors"
      >
        <span className="text-sm font-medium">{question}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
