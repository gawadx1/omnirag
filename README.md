# Enterprise RAG Platform

A production-ready, enterprise-grade Retrieval-Augmented Generation platform built entirely with TypeScript and Next.js. Deployable on Vercel with zero Python dependencies.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js 15 (App Router)                  │
├──────────┬──────────┬──────────┬──────────┬─────────────────┤
│ Dashboard │   Chat   │ Documents │ Settings │     Admin       │
├──────────┴──────────┴──────────┴──────────┴─────────────────┤
│                     API Route Handlers                        │
├──────────┬──────────┬──────────┬──────────┬─────────────────┤
│   LLM    │   RAG    │   Rerank  │ Security │    Monitoring    │
│ Providers │ Pipeline │          │          │                  │
├──────────┴──────────┴──────────┴──────────┴─────────────────┤
│                    Services Layer                              │
├──────────┬──────────┬──────────┬──────────┬─────────────────┤
│ Embeddings│ Vector DB │ Document │ Chunking │     Search      │
│           │ Adapters  │ Parsers  │          │  (Hybrid/BM25)  │
├──────────┴──────────┴──────────┴──────────┴─────────────────┤
│                      Data Layer                                │
├──────────┬──────────┬──────────┬──────────┬─────────────────┤
│ PostgreSQL│  Qdrant  │ Pinecone  │  Chroma  │    Redis/Cache   │
│ (Prisma)  │          │          │          │                  │
└──────────┴──────────┴──────────┴──────────┴─────────────────┘
```

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** TailwindCSS v4, shadcn/ui components
- **Database:** PostgreSQL + Prisma ORM
- **AI/LLM:** LangChain.js, Vercel AI SDK
- **Vector DB:** Qdrant, Pinecone, Chroma (user-selectable)
- **Auth:** Better Auth (Email, Google, GitHub)
- **Search:** Hybrid (Vector + BM25/Elasticsearch)
- **Caching:** Redis (optional)
- **Observability:** LangSmith, OpenTelemetry
- **Storage:** Local, S3-compatible, UploadThing
- **Deployment:** Vercel (no Docker required)

## Features

### AI Providers
- OpenAI (GPT-4o, GPT-4-turbo, etc.)
- Anthropic Claude (Claude 3 Opus, Sonnet, Haiku)
- Google Gemini (Gemini 1.5 Pro, Flash)
- DeepSeek (DeepSeek Chat, DeepSeek V2)
- Ollama (Llama 3.1, Mistral, etc. - local)

### Document Processing
- **Parsers:** PDF, DOCX, TXT, Markdown, HTML, CSV, Images (OCR)
- **Chunking:** Recursive, Semantic, Parent-Child, Metadata-aware
- **Embeddings:** Multi-provider support with automatic switching
- **Versioning:** Document version history with incremental indexing

### Advanced RAG
- **Retrieval:** Hybrid (Vector + BM25/ES), Multi-Vector, MMR, Parent Document
- **Query Processing:** Rewrite, Multi-Query, HyDE, Context Expansion, History-aware
- **Reranking:** Jina AI, Cohere, BGE, Cross-Encoder
- **Generation:** Streaming, Structured Output, Citations, Sources, Confidence Scores

### Evaluation & Monitoring
- Hallucination Detection (groundedness, citation validation, faithfulness)
- RAG Metrics (faithfulness, answer relevancy, context precision/recall)
- Latency & Cost tracking
- Admin Dashboard with charts and trends
- Audit logging

### Security
- RBAC (Admin, Member, Viewer)
- Encrypted API key storage (AES-256-GCM)
- CSRF protection
- Rate limiting
- Input validation (Zod schemas)
- Workspace support

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/               # REST API endpoints
│   │   ├── chat/          # Chat completion API
│   │   ├── documents/     # Document CRUD API
│   │   ├── settings/      # Settings API
│   │   ├── ingest/        # Document ingestion API
│   │   ├── evaluate/      # RAG evaluation API
│   │   └── webhooks/      # Webhook management API
│   ├── dashboard/         # Main dashboard page
│   ├── chat/              # Chat interface page
│   ├── documents/         # Document management page
│   ├── settings/          # Settings page (UI provider config)
│   ├── admin/             # Admin dashboard page
│   └── auth/              # Authentication pages
├── components/
│   ├── ui/                # shadcn/ui components
│   └── layout/            # Layout components (sidebar, navbar)
├── lib/
│   ├── llm/               # LLM provider interface & registry
│   │   └── providers/     # Provider implementations
│   ├── vector-store/      # Vector DB interface & adapters
│   │   └── adapters/      # DB-specific adapters
│   └── search/            # Elasticsearch integration
├── providers/              # React providers (theme, auth)
├── types/                  # TypeScript types & interfaces
├── schemas/                # Zod validation schemas
├── config/                 # App configuration
├── embeddings/             # Embedding service
├── ingestion/              # Document ingestion pipeline
│   ├── parsers/           # Document parsers
│   └── chunking/          # Chunking strategies
├── retrieval/              # Retrieval pipeline
├── chat/                   # Generation & chat logic
├── evaluation/             # RAG evaluation & hallucination
├── security/               # Auth, RBAC, audit
├── monitoring/             # Metrics & observability
└── db/                     # Prisma client
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd enterprise-rag-platform
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Set up the database:
   ```bash
   npx prisma db push
   ```

5. Start development:
   ```bash
   npm run dev
   ```

6. Open http://localhost:3000

### Configuration

All provider configuration is done through the UI Settings page - no `.env` editing required for:
- AI Provider selection (OpenAI, Claude, Gemini, DeepSeek, Ollama)
- API keys (encrypted at rest)
- Model selection
- Embedding models
- Vector database selection
- Chunking strategy
- Reranking toggles

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Chat completion with RAG |
| `/api/documents` | GET | List documents |
| `/api/documents` | POST | Upload document |
| `/api/documents` | DELETE | Delete document |
| `/api/settings` | GET | Get settings |
| `/api/settings` | PUT | Update settings |
| `/api/settings` | PATCH | Save provider credentials |
| `/api/ingest` | POST | Ingest document |
| `/api/evaluate` | POST | Evaluate RAG response |
| `/api/webhooks` | GET | List webhooks |
| `/api/webhooks` | POST | Create webhook |

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

No Docker required. The platform runs entirely on Next.js serverless functions.

## Environment Variables

See `.env.example` for the full list of environment variables.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Auth secret (min 32 chars)
- `ENCRYPTION_KEY` - Key for encrypting API keys (min 32 chars)
- Provider API keys (optional, can be set via UI)

## License

MIT
