"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import { GradientButton } from "@/components/landing/ui/gradient-button";
import { Button } from "@/components/ui/button";
import AnimatedDashboardPreview from "./animated-dashboard-preview";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-4"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                <span className="text-foreground">Enterprise</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Retrieval Augmented
                </span>
                <br />
                <span className="text-foreground">Generation Platform</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                Deploy production-ready RAG pipelines with multi-provider AI support,
                hybrid search, and enterprise security. No Python required.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="flex flex-wrap gap-4"
            >
              <GradientButton glow size="lg" asChild>
                <a href="/auth/login">
                  Start Building
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </GradientButton>
              <Button variant="outline" size="lg" className="rounded-xl px-8 py-6 text-lg" asChild>
                <a href="https://github.com/gawadx1/omnirag" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" />
                  View GitHub
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex items-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-background bg-gradient-to-br from-primary/40 to-blue-400/40"
                  />
                ))}
              </div>
              <span>Trusted by enterprise teams worldwide</span>
            </motion.div>
          </div>

          <div className="hidden lg:block">
            <AnimatedDashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
