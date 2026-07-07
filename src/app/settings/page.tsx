"use client";

import { useState } from "react";
import SidebarLayout from "@/components/layout/sidebar-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [aiProvider, setAiProvider] = useState("OPENAI");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [embeddingModel, setEmbeddingModel] = useState("");
  const [temperature, setTemperature] = useState("0.7");
  const [maxTokens, setMaxTokens] = useState("4096");
  const [baseUrl, setBaseUrl] = useState("");
  const [vectorDb, setVectorDb] = useState("QDRANT");
  const [chunkStrategy, setChunkStrategy] = useState("RECURSIVE");
  const [rerankEnabled, setRerankEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  const providerFields = () => {
    switch (aiProvider) {
      case "OLLAMA":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="baseUrl">Base URL</Label>
              <Input
                id="baseUrl"
                placeholder="http://localhost:11434"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input id="model" placeholder="llama3.1" value={model} onChange={(e) => setModel(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="embeddingModel">Embedding Model</Label>
              <Input id="embeddingModel" placeholder="nomic-embed-text" value={embeddingModel} onChange={(e) => setEmbeddingModel(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key (optional)</Label>
              <Input id="apiKey" type="password" placeholder="For remote Ollama servers" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            </div>
          </>
        );
      case "GEMINI":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input id="apiKey" type="password" placeholder="AIza..." value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input id="model" placeholder="gemini-1.5-pro" value={model} onChange={(e) => setModel(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="embeddingModel">Embedding Model</Label>
              <Input id="embeddingModel" placeholder="embedding-001" value={embeddingModel} onChange={(e) => setEmbeddingModel(e.target.value)} />
            </div>
          </>
        );
      case "CLAUDE":
      case "ANTHROPIC":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input id="apiKey" type="password" placeholder="sk-ant-..." value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input id="model" placeholder="claude-3-opus-20240229" value={model} onChange={(e) => setModel(e.target.value)} />
            </div>
          </>
        );
      case "DEEPSEEK":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input id="apiKey" type="password" placeholder="sk-..." value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input id="model" placeholder="deepseek-chat" value={model} onChange={(e) => setModel(e.target.value)} />
            </div>
          </>
        );
      default:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input id="apiKey" type="password" placeholder="sk-..." value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input id="model" placeholder="gpt-4o" value={model} onChange={(e) => setModel(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="embeddingModel">Embedding Model</Label>
              <Input id="embeddingModel" placeholder="text-embedding-3-small" value={embeddingModel} onChange={(e) => setEmbeddingModel(e.target.value)} />
            </div>
          </>
        );
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    toast({ title: "Settings saved", description: "Your configuration has been updated." });
    setSaving(false);
  };

  return (
    <SidebarLayout>
      <div className="p-6 space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure your RAG platform</p>
        </div>

        <Tabs defaultValue="ai">
          <TabsList>
            <TabsTrigger value="ai">AI Provider</TabsTrigger>
            <TabsTrigger value="vector">Vector Database</TabsTrigger>
            <TabsTrigger value="chunking">Chunking</TabsTrigger>
            <TabsTrigger value="retrieval">Retrieval</TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Provider Configuration</CardTitle>
                <CardDescription>Select and configure your AI provider</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Provider</Label>
                  <Select value={aiProvider} onValueChange={setAiProvider}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPENAI">OpenAI</SelectItem>
                      <SelectItem value="ANTHROPIC">Anthropic Claude</SelectItem>
                      <SelectItem value="GEMINI">Google Gemini</SelectItem>
                      <SelectItem value="DEEPSEEK">DeepSeek</SelectItem>
                      <SelectItem value="OLLAMA">Ollama</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {providerFields()}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Input
                      id="temperature"
                      type="number"
                      min="0"
                      max="2"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxTokens">Max Tokens</Label>
                    <Input
                      id="maxTokens"
                      type="number"
                      min="1"
                      max="128000"
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vector" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Vector Database</CardTitle>
                <CardDescription>Select your vector database provider</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Database</Label>
                  <Select value={vectorDb} onValueChange={setVectorDb}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="QDRANT">Qdrant</SelectItem>
                      <SelectItem value="PINECONE">Pinecone</SelectItem>
                      <SelectItem value="CHROMA">Chroma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chunking" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Chunking Configuration</CardTitle>
                <CardDescription>Configure how documents are split</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Strategy</Label>
                  <Select value={chunkStrategy} onValueChange={setChunkStrategy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RECURSIVE">Recursive Character Splitter</SelectItem>
                      <SelectItem value="SEMANTIC">Semantic Chunking</SelectItem>
                      <SelectItem value="PARENT_CHILD">Parent-Child Chunking</SelectItem>
                      <SelectItem value="METADATA">Metadata-Aware Chunking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="retrieval" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Retrieval Settings</CardTitle>
                <CardDescription>Configure retrieval and reranking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Reranking</Label>
                    <p className="text-sm text-muted-foreground">Improve result quality with reranking</p>
                  </div>
                  <Switch checked={rerankEnabled} onCheckedChange={setRerankEnabled} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </SidebarLayout>
  );
}
