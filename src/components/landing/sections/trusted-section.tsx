"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/landing/ui/section";

const technologies = [
  { name: "Next.js", icon: "▲" },
  { name: "LangChain", icon: "🦜" },
  { name: "OpenAI", icon: "○" },
  { name: "Claude", icon: "☕" },
  { name: "Gemini", icon: "✦" },
  { name: "Qdrant", icon: "◈" },
  { name: "Pinecone", icon: "△" },
  { name: "Chroma", icon: "◇" },
  { name: "DeepSeek", icon: "◎" },
  { name: "Elasticsearch", icon: "⬡" },
  { name: "Redis", icon: "⚡" },
  { name: "PostgreSQL", icon: "🐘" },
];

export default function TrustedSection() {
  return (
    <Section className="py-16 md:py-20">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-sm text-muted-foreground mb-8 tracking-wide uppercase"
      >
        Powered by Industry-Leading Technology
      </motion.p>
      <div className="flex flex-wrap justify-center gap-x-10 gap-y-6">
        {technologies.map((tech, i) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30 border border-border/30 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
          >
            <span className="text-sm">{tech.icon}</span>
            <span>{tech.name}</span>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
