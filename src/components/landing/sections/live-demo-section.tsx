"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section, SectionHeader } from "@/components/landing/ui/section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Upload,
  Send,
  FileText,
  Loader2,
  Bot,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: { name: string; score: number }[];
  confidence?: number;
  latency?: number;
  chunks?: number;
  provider?: string;
};

const exampleQuestions = [
  "What is the refund policy?",
  "Summarize this document",
  "Who signed the contract?",
  "What are the key terms?",
];

export default function LiveDemoSection() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to the OmniRAG playground! Upload a document or try an example question to see RAG in action.",
    },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSend = useCallback(async () => {
    if (!input.trim() || streaming) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setStreaming(true);
    setStreamingContent("");

    const mockResponse = `Great question! Based on the documents I've analyzed, here's what I found:

## Key Findings

- **Primary Answer**: The requested information shows that enterprise RAG platforms process documents through multiple stages
- **Confidence**: This analysis is based on semantic search across your indexed documents
- **Supporting Evidence**: Multiple sources confirm this finding

### Related Details

1. Document parsing handles various formats
2. Chunking strategies optimize retrieval
3. Embedding models generate vector representations

\`\`\`typescript
// Example configuration
const config = {
  chunkSize: 1000,
  overlap: 200,
  strategy: "semantic"
};
\`\`\`

> This response was generated using hybrid search with reranking.`;

    let idx = 0;
    const interval = setInterval(() => {
      idx += 2;
      setStreamingContent(mockResponse.slice(0, idx));
      if (idx >= mockResponse.length) {
        clearInterval(interval);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: mockResponse,
            sources: [
              { name: "document-1.pdf", score: 0.95 },
              { name: "report-q3.docx", score: 0.87 },
              { name: "policy.md", score: 0.76 },
            ],
            confidence: 0.92,
            latency: 187,
            chunks: 4,
            provider: "gpt-4o",
          },
        ]);
        setStreamingContent("");
        setStreaming(false);
      }
    }, 20);
  }, [input, streaming]);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `✅ Document **${f.name}** (${(f.size / 1024).toFixed(1)} KB) has been ingested. I've split it into **chunks**, generated **embeddings**, and indexed it in the vector database. You can now ask questions about its content.`,
        },
      ]);
    }, 1500);
  }, []);

  return (
    <Section id="demo">
      <SectionHeader
        title="Interactive RAG Playground"
        subtitle="Upload a document and ask questions. See the full RAG pipeline in action."
      />
      <div className="grid lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary" />
              Upload Document
            </h3>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-lg p-8 cursor-pointer hover:border-primary/50 transition-colors">
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-sm font-medium">Drop or click to upload</span>
              <span className="text-xs text-muted-foreground mt-1">PDF, DOCX, TXT, MD, HTML, CSV</span>
              <input type="file" className="hidden" accept=".pdf,.docx,.txt,.md,.html,.csv" onChange={handleFile} />
            </label>
            {uploading && (
              <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                Processing document...
              </div>
            )}
            {file && !uploading && (
              <div className="flex items-center gap-2 mt-3 text-sm text-green-500">
                <CheckCircle2 className="w-4 h-4" />
                {file.name} indexed
              </div>
            )}
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <h3 className="font-semibold mb-3 text-sm">Try an example</h3>
            <div className="space-y-2">
              {exampleQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setInput(q);
                    setTimeout(() => handleSend(), 100);
                  }}
                  className="w-full text-left text-sm p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="flex flex-col h-[600px] bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
              <Bot className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">RAG Chat</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-500 ml-auto">Streaming</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl p-3 ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm">{msg.content}</p>
                      )}
                      {msg.sources && (
                        <div className="mt-3 pt-3 border-t border-border/30 space-y-1.5">
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                            Sources & Metrics
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            <MetricBadge icon={<CheckCircle2 className="w-3 h-3" />} label="Confidence" value={`${((msg.confidence ?? 0) * 100).toFixed(0)}%`} />
                            <MetricBadge icon={<Clock className="w-3 h-3" />} label="Latency" value={`${msg.latency}ms`} />
                            <MetricBadge icon={<FileText className="w-3 h-3" />} label="Chunks" value={`${msg.chunks}`} />
                            <MetricBadge icon={<Bot className="w-3 h-3" />} label="Provider" value={msg.provider ?? "gpt-4o"} />
                          </div>
                          <div className="mt-2 space-y-1">
                            {msg.sources.map((s) => (
                              <div key={s.name} className="flex items-center justify-between text-[11px]">
                                <span className="text-muted-foreground truncate">{s.name}</span>
                                <span className="font-mono text-primary">{(s.score * 100).toFixed(0)}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {streaming && streamingContent && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[85%] rounded-xl p-3 bg-muted/50">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {streamingContent}
                        </ReactMarkdown>
                      </div>
                      <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t border-border/50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question about your documents..."
                  className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  disabled={streaming}
                />
                <Button type="submit" size="icon" disabled={streaming || !input.trim()}>
                  {streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
}

function MetricBadge({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-background/50 rounded-md px-2 py-1">
      {icon}
      <span>{label}:</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
