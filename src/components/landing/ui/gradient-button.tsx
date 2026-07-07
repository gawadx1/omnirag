"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/landing/utils";

interface GradientButtonProps extends React.ComponentProps<typeof Button> {
  glow?: boolean;
}

export function GradientButton({ children, glow, className, ...props }: GradientButtonProps) {
  return (
    <div className="relative group">
      {glow && (
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 rounded-lg blur-xl opacity-40 group-hover:opacity-70 transition duration-500" />
      )}
      <Button
        className={cn(
          "relative bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-lg px-8 py-6 text-lg rounded-xl",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    </div>
  );
}
