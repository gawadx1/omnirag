# Folder Structure Guide

```
src/
├── app/                          # Next.js 15 App Router
│   ├── api/                      # REST API Route Handlers
│   │   ├── chat/                 # Chat completion endpoint
│   │   ├── documents/            # Document CRUD endpoints
│   │   ├── settings/             # Settings CRUD endpoints
│   │   ├── ingest/               # Document ingestion endpoint
│   │   ├── evaluate/             # RAG evaluation endpoint
│   │   └── webhooks/             # Webhook management endpoints
│   ├── dashboard/                # Main dashboard page
│   ├── chat/                     # Chat interface page
│   ├── documents/                # Document management page
│   ├── settings/                 # Settings page
│   ├── admin/                    # Admin dashboard page
│   └── auth/                     # Authentication pages
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── switch.tsx
│   │   ├── dialog.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx / toaster.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── avatar.tsx
│   │   ├── skeleton.tsx
│   │   ├── badge.tsx
│   │   └── label.tsx / textarea.tsx
│   └── layout/                   # Layout components
│       ├── sidebar.tsx           # Navigation sidebar
│       ├── navbar.tsx            # Top navigation bar
│       └── sidebar-layout.tsx    # Combined layout wrapper
├── providers/                    # React Context Providers
│   └── theme-provider.tsx        # Dark/Light mode provider
├── lib/                          # Core library code
│   ├── llm/                      # LLM Provider system
│   │   ├── types.ts              # Provider interface
│   │   ├── registry.ts           # Provider factory/registry
│   │   ├── index.ts              # Public exports
│   │   └── providers/            # Provider implementations
│   │       ├── openai.ts
│   │       ├── anthropic.ts
│   │       ├── gemini.ts
│   │       ├── deepseek.ts
│   │       └── ollama.ts
│   ├── vector-store/             # Vector Database adapters
│   │   ├── types.ts              # Adapter interface
│   │   ├── index.ts              # Adapter factory/registry
│   │   └── adapters/             # DB-specific implementations
│   │       ├── qdrant.ts
│   │       ├── pinecone.ts
│   │       └── chroma.ts
│   ├── search/                   # Search integration
│   │   └── elasticsearch.ts      # Elasticsearch client
│   ├── env.ts                    # Environment validation
│   ├── prisma.ts                 # Prisma client singleton
│   ├── crypto.ts                 # AES-256 encryption utilities
│   ├── utils.ts                  # General utilities (cn)
│   └── observability.ts          # Logging, caching, tracking
├── types/                        # TypeScript type definitions
│   ├── index.ts                  # Core types/interfaces
│   └── modules.d.ts              # Module declarations
├── schemas/                      # Zod validation schemas
│   └── index.ts
├── config/                       # Application configuration
│   └── index.ts
├── embeddings/                   # Embedding service
│   └── index.ts                  # Embedding provider factory
├── ingestion/                    # Document ingestion pipeline
│   ├── index.ts                  # Main ingestion orchestrator
│   ├── parsers/                  # Document parsers
│   │   ├── types.ts
│   │   ├── index.ts              # Parser registry
│   │   ├── pdf.ts
│   │   ├── docx.ts
│   │   ├── text.ts
│   │   ├── markdown.ts
│   │   ├── html.ts
│   │   ├── csv.ts
│   │   └── ocr.ts
│   └── chunking/                 # Chunking strategies
│       ├── types.ts
│       ├── index.ts              # Strategy registry
│       ├── recursive.ts
│       ├── semantic.ts
│       ├── parent-child.ts
│       └── metadata.ts
├── retrieval/                    # Retrieval pipeline
│   ├── index.ts                  # Main retrieval (hybrid, vector)
│   ├── advanced.ts               # MMR, parent-doc, multi-vector
│   ├── query-processing.ts       # Rewrite, HyDE, multi-query, etc.
│   └── reranking.ts              # Reranker implementations
├── chat/                         # Generation & chat
│   └── generate.ts               # RAG generation orchestrator
├── evaluation/                   # RAG evaluation
│   ├── hallucination.ts          # Hallucination detection
│   └── metrics.ts                # RAGAS metrics (TypeScript)
├── security/                     # Security layer
│   └── index.ts                  # RBAC, rate limiting, audit
├── monitoring/                   # Observability & metrics
│   └── index.ts                  # Dashboard stats, trends
└── db/                           # (Prisma client auto-imported)
prisma/
└── schema.prisma                 # Database schema
```

## Key Principles

1. **Separation of Concerns**: Each directory has a single responsibility
2. **Dependency Injection**: Services receive their dependencies via constructors/functions
3. **Interface Segregation**: Each adapter/strategy implements a focused interface
4. **Factory Pattern**: Registries create the right implementation based on config
5. **No Circular Dependencies**: Imports flow one direction (components → lib → data)
6. **Type Safety**: Every module is fully typed with TypeScript
