"use client";

import { motion } from "framer-motion";
import { Section, SectionHeader, FadeIn } from "@/components/landing/ui/section";
import {
  FileClock,
  ShieldCheck,
  Building2,
  ScrollText,
  BarChart3,
  LineChart,
  Bell,
  Globe,
  Webhook,
  Key,
} from "lucide-react";

const features = [
  {
    icon: FileClock,
    title: "Document Versioning",
    description: "Track every change with full version history and incremental indexing.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access",
    description: "Admin, Member, and Viewer roles with granular permission controls.",
  },
  {
    icon: Building2,
    title: "Multi-Workspace",
    description: "Isolated environments for teams, projects, and clients.",
  },
  {
    icon: ScrollText,
    title: "Audit Logs",
    description: "Complete audit trail of all actions for compliance and security.",
  },
  {
    icon: BarChart3,
    title: "Evaluation Dashboard",
    description: "RAGAS metrics, hallucination scoring, and quality monitoring.",
  },
  {
    icon: LineChart,
    title: "Analytics",
    description: "Usage metrics, latency tracking, cost analysis, and trends.",
  },
  {
    icon: Bell,
    title: "Monitoring",
    description: "Real-time system health, alerts, and performance dashboards.",
  },
  {
    icon: Globe,
    title: "REST API",
    description: "Full-featured API for programmatic document management and queries.",
  },
  {
    icon: Webhook,
    title: "Webhooks",
    description: "Event-driven integration with your existing infrastructure.",
  },
];

export default function EnterpriseSection() {
  return (
    <Section id="enterprise">
      <SectionHeader
        title="Enterprise-Grade Features"
        subtitle="Built for production workloads with security, compliance, and scalability."
      />
      <div className="relative max-w-4xl mx-auto">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-primary/10 to-transparent" />
        <div className="space-y-0">
          {features.map((f, i) => (
            <EnterpriseItem key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </Section>
  );
}

function EnterpriseItem({
  feature,
  index,
}: {
  feature: typeof features[0];
  index: number;
}) {
  const Icon = feature.icon;
  return (
    <FadeIn delay={index * 0.08}>
      <div className="relative flex gap-6 pb-10">
        <div className="relative z-10 w-16 h-16 rounded-xl border border-border/50 bg-card flex items-center justify-center shadow-lg shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="pt-3">
          <h3 className="font-semibold text-lg">{feature.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
        </div>
      </div>
    </FadeIn>
  );
}
