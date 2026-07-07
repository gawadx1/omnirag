# Architecture Overview

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     Client (Browser)                         │
├──────────────────────────────────────────────────────────────┤
│                     Next.js 15 App Router                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
│  │ Dashboard │  │   Chat   │  │Documents │  │   Settings   │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬──────┘  │
│       │             │             │               │          │
│  ┌────┴─────────────┴─────────────┴───────────────┴──────┐   │
│  │                  Server Actions / API Routes           │   │
│  └────────────────────────┬──────────────────────────────┘   │
│                           │                                   │
├───────────────────────────┴──────────────────────────────────┤
│                     Service Layer                             │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
│  │   LLM    │  │    RAG   │  │   Rerank  │  │  Evaluation │  │
│  │ Providers│  │ Pipeline │  │           │  │             │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬──────┘  │
│       │             │             │               │          │
│  ┌────┴─────────────┴─────────────┴───────────────┴──────┐   │
│  │             Ingestion Pipeline                          │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  │   │
│  │  │ Parsers │  │Chunking │  │Embedding│  │  Index  │  │   │
│  │  │PDF/DOCX │  │ Semantic│  │  OpenAI │  │ Vector  │  │   │
│  │  │ TXT/MD  │  │Recursive│  │  Gemini │  │   DB    │  │   │
│  │  │ HTML/CSV│  │Parent-  │  │  Ollama │  │ Qdrant/ │  │   │
│  │  │  Image  │  │ Child   │  │         │  │Pinecone │  │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                              │
├───────────────────────────┬──────────────────────────────────┤
│                     Data Layer                                │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
│  │PostgreSQL│  │  Qdrant  │  │ Pinecone │  │    Redis    │  │
│  │ (Prisma) │  │ Vector DB│  │ Vector DB│  │   (Cache)   │  │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow

### Document Ingestion Flow
```
Upload → Parse → Chunk → Embed → Index Vector DB → Store Metadata in PostgreSQL
```

### Query/RAG Flow
```
User Query
    │
    ├─→ Query Processing (Rewrite, Multi-Query, HyDE)
    │
    ├─→ Embed Query
    │
    ├─→ Retrieve from Vector DB (Hybrid Search)
    │       │
    │       ├─→ Vector Search
    │       └─→ BM25 / Elasticsearch
    │
    ├─→ Optional: Rerank Results (Jina/Cohere/BGE)
    │
    ├─→ Context Compression / MMR
    │
    ├─→ Generate Response (with streaming)
    │       │
    │       └─→ Hallucination Detection
    │
    └─→ Return: Response + Sources + Confidence + Citations
```

## Key Design Patterns

### Strategy Pattern - LLM Providers
All providers implement the same `LLMProvider` interface:
- `chat()` - Text completion
- `stream()` - Streaming completion
- `embeddings()` - Generate embeddings
- `validateConfig()` - Validate credentials

### Adapter Pattern - Vector Databases
All vector DBs implement the same `VectorStoreAdapter` interface:
- `initialize()` - Connect and create collection
- `upsertVectors()` - Insert/update vectors
- `queryVectors()` - Search nearest neighbors
- `deleteVectors()` - Remove vectors

### Factory Pattern
- `getLLMProvider()` - Creates correct provider based on config
- `getVectorStore()` - Creates correct DB adapter
- `getChunkingStrategy()` - Creates correct chunking strategy
- `getParser()` - Creates correct document parser

## Security

- API keys encrypted with AES-256-GCM before database storage
- Server-only API routes (no key exposure to client)
- Zod validation on all API inputs
- Rate limiting configurable per endpoint
- Audit logging for sensitive operations
- CSRF protection via token validation
- RBAC with Admin/Member/Viewer roles
