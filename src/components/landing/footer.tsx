"use client";

import { Bot, Github, FileText, BookOpen, Shield, Mail } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Documentation", href: "#", icon: BookOpen },
    { label: "API Reference", href: "#", icon: FileText },
    { label: "GitHub", href: "https://github.com/gawadx1/omnirag", icon: Github },
    { label: "Changelog", href: "#", icon: FileText },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "License", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contact", href: "#", icon: Mail },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">OmniRAG</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Enterprise Retrieval-Augmented Generation Platform. Built with TypeScript, powered by Next.js.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold mb-3">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => {
                  const Icon = (link as any).icon;
                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {Icon && <Icon className="w-3.5 h-3.5" />}
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} OmniRAG. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">License</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
