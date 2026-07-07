"use client";

import { motion } from "framer-motion";
import { Bot, MessageSquare, FileText, BarChart3, Shield, Activity } from "lucide-react";

const stats = [
  { label: "Documents", value: "12.4k" },
  { label: "Queries", value: "89.2k" },
  { label: "Avg Latency", value: "187ms" },
  { label: "Uptime", value: "99.9%" },
];

const recentQueries = [
  "What is the refund policy for enterprise plans?",
  "Summarize the Q3 financial report",
  "Who signed the NDA agreement?",
  "Compare pricing between tiers",
];

export default function AnimatedDashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
      className="relative"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-muted-foreground ml-2">OmniRAG Dashboard</span>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="rounded-lg bg-muted/50 p-2.5 text-center"
              >
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-sm font-bold">{s.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="rounded-lg bg-muted/30 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium">Recent Queries</span>
            </div>
            <div className="space-y-1.5">
              {recentQueries.map((q, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.15 }}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <MessageSquare className="w-3 h-3 shrink-0" />
                  <span className="truncate">{q}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-primary/10 to-blue-500/10 p-3">
            <Bot className="w-8 h-8 text-primary" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">RAG Assistant</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">Active</span>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                Ready to answer questions from 12.4k indexed documents
              </p>
            </div>
          </div>

          <div className="h-16 rounded-lg bg-muted/20 overflow-hidden">
            <div className="flex h-full items-end gap-1 px-2 pb-2">
              {[35, 55, 40, 70, 45, 85, 60, 50, 75, 42, 65, 80].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 1.5 + i * 0.05, duration: 0.5 }}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/60 to-blue-400/60"
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="absolute -bottom-4 -right-4 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10" />
      <div className="absolute -top-4 -left-4 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] -z-10" />
    </motion.div>
  );
}
