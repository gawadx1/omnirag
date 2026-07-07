"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/landing/ui/section";
import { useIntersection, useCountUp } from "@/lib/landing/hooks";

const metrics = [
  { value: 12400, suffix: "+", label: "Documents Indexed", prefix: "" },
  { value: 89200, suffix: "+", label: "Queries Processed", prefix: "" },
  { value: 187, suffix: "ms", label: "Average Latency", prefix: "" },
  { value: 94, suffix: "%", label: "Hallucination Reduction", prefix: "" },
  { value: 50, suffix: "+", label: "Supported Models", prefix: "" },
];

export default function MetricsSection() {
  return (
    <Section className="py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-5xl mx-auto"
      >
        {metrics.map((m, i) => (
          <MetricCounter key={m.label} metric={m} index={i} />
        ))}
      </motion.div>
    </Section>
  );
}

function MetricCounter({
  metric,
  index,
}: {
  metric: typeof metrics[0];
  index: number;
}) {
  const { ref, isVisible } = useIntersection();
  const count = useCountUp(metric.value, 2000, isVisible);

  return (
    <div ref={ref} className="text-center">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="text-3xl md:text-4xl font-bold bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent"
      >
        {count.toLocaleString()}{metric.suffix}
      </motion.p>
      <p className="text-sm text-muted-foreground mt-1.5">{metric.label}</p>
    </div>
  );
}
