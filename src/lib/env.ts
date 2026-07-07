import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  ENCRYPTION_KEY: z.string().min(32),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GOOGLE_GEMINI_API_KEY: z.string().optional(),
  DEEPSEEK_API_KEY: z.string().optional(),

  QDRANT_URL: z.string().optional(),
  QDRANT_API_KEY: z.string().optional(),
  PINECONE_API_KEY: z.string().optional(),
  PINECONE_INDEX: z.string().optional(),
  CHROMA_URL: z.string().optional(),

  REDIS_URL: z.string().optional(),

  UPLOADTHING_TOKEN: z.string().optional(),
  S3_ENDPOINT: z.string().optional(),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
  S3_BUCKET: z.string().optional(),

  LANGCHAIN_TRACING_V2: z.string().optional(),
  LANGCHAIN_API_KEY: z.string().optional(),
  LANGCHAIN_PROJECT: z.string().optional(),

  ELASTICSEARCH_URL: z.string().optional(),
  ELASTICSEARCH_API_KEY: z.string().optional(),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
});

function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.issues.map((i) => i.path.join("."));
      console.warn(`Missing environment variables: ${missing.join(", ")}`);
      return envSchema.partial().parse(process.env);
    }
    throw error;
  }
}

export const env = validateEnv();

export function getRequiredEnv(key: keyof z.infer<typeof envSchema>): string {
  const value = env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}
