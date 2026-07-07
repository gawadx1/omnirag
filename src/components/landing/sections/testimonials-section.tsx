"use client";

import { motion } from "framer-motion";
import { Section, SectionHeader, FadeIn } from "@/components/landing/ui/section";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO, DataFlow Technologies",
    content:
      "OmniRAG transformed our document search pipeline. We reduced query latency by 60% and eliminated hallucinations with the built-in detection system.",
    avatar: "SC",
  },
  {
    name: "Marcus Rivera",
    role: "Lead Engineer, FinAnalytica",
    content:
      "The multi-provider support is a game-changer. We switch between OpenAI and Claude based on task requirements without any code changes.",
    avatar: "MR",
  },
  {
    name: "Priya Patel",
    role: "VP Engineering, HealthStack",
    content:
      "Deploying on Vercel with zero Python dependencies saved us months of infrastructure work. The evaluation dashboard gives us confidence in production.",
    avatar: "PP",
  },
  {
    name: "James Wilson",
    role: "Director of AI, LegalDocs Inc.",
    content:
      "The hybrid search with reranking delivers remarkably accurate results. Our legal team now trusts AI-generated summaries with source citations.",
    avatar: "JW",
  },
];

export default function TestimonialsSection() {
  return (
    <Section id="testimonials" className="py-20 md:py-28">
      <SectionHeader
        title="Trusted by Engineering Teams"
        subtitle="See how teams are using OmniRAG in production."
      />
      <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {testimonials.map((t, i) => (
          <FadeIn key={t.name} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -2 }}
              className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-6"
            >
              <Quote className="w-6 h-6 text-primary/40 mb-3" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {t.content}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-blue-400/40 flex items-center justify-center text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
