"use client";

import { cn } from "@/lib/landing/utils";
import { useMousePosition } from "@/lib/landing/hooks";
import { useEffect, useState } from "react";

export function AnimatedBackground() {
  const mouse = useMousePosition();
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; speed: number }[]>([]);

  useEffect(() => {
    const arr = Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.1,
    }));
    setParticles(arr);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          background: `radial-gradient(600px circle at ${mouse.x}px ${mouse.y}px, hsl(var(--primary) / 0.08), transparent 40%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, black, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, black, transparent 70%)",
          opacity: 0.3,
        }}
      />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-primary/40"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            animation: `float ${8 / p.speed}s infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
}
