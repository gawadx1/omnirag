import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, MessageSquare, FileText, Settings, Shield, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Enterprise RAG</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/login">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl font-bold tracking-tight max-w-3xl mx-auto">
            Enterprise-Grade Retrieval-Augmented Generation Platform
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
            Deploy a production-ready RAG system with multi-provider AI support,
            hybrid search, and enterprise security.
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                Dashboard
              </Button>
            </Link>
          </div>
        </section>

        <section className="border-t py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<MessageSquare className="h-8 w-8 text-primary" />}
                title="Multi-Provider AI"
                description="Support for OpenAI, Anthropic Claude, Google Gemini, DeepSeek, and Ollama"
              />
              <FeatureCard
                icon={<FileText className="h-8 w-8 text-primary" />}
                title="Document Intelligence"
                description="Parse PDF, DOCX, TXT, Markdown, HTML, CSV, and images with OCR"
              />
              <FeatureCard
                icon={<Settings className="h-8 w-8 text-primary" />}
                title="Hybrid Search"
                description="Combine vector search with BM25 or Elasticsearch for optimal results"
              />
              <FeatureCard
                icon={<Shield className="h-8 w-8 text-primary" />}
                title="Enterprise Security"
                description="RBAC, encrypted credentials, audit logs, rate limiting"
              />
              <FeatureCard
                icon={<Bot className="h-8 w-8 text-primary" />}
                title="Advanced RAG"
                description="Semantic chunking, parent-child retrieval, MMR, query rewriting, HyDE"
              />
              <FeatureCard
                icon={<ArrowRight className="h-8 w-8 text-primary" />}
                title="Vercel Deployable"
                description="Full Next.js 15 app router deployment, no Docker required"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
