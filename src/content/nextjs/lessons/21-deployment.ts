import type { Lesson } from '@/types';

export const deploymentLesson: Lesson = {
  id: 'nextjs-deployment',
  slug: 'nextjs-deployment',
  title: 'Deployment and DevOps',
  description:
    'Master deploying Next.js — Vercel deployment, self-hosting with Docker, CI/CD pipelines, environment variables in production, health checks, and monitoring.',
  category: 'Deployment',
  order: 21,
  difficulty: 'advanced',
  estimatedTime: 50,
  prevLesson: 'nextjs-internationalization',
  nextLesson: 'nextjs-scalable-architecture',

  content: `# Deployment and DevOps for Next.js

## Deployment Options Overview

| Platform | Best for | Cost | Control |
|---|---|---|---|
| Vercel | Most apps, easiest DX | Free-$20+/mo | Low (managed) |
| Netlify | Static/edge first | Free-$19+/mo | Low (managed) |
| AWS (Amplify/ECS) | Enterprise, AWS ecosystem | Variable | High |
| Docker + any VPS | Self-hosted, full control | VPS cost | Full |
| Railway/Render | Simple self-hosted | $5-20/mo | Medium |

---

## Vercel Deployment

Vercel is built by the same team as Next.js — deepest integration:

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy (from project root)
vercel

# Production deploy
vercel --prod
\`\`\`

Or connect your GitHub repository — every push auto-deploys:
1. Go to vercel.com → New Project
2. Import from GitHub
3. Set environment variables in dashboard
4. Every push to \`main\` deploys to production
5. Every push to other branches gets a preview URL

**What Vercel handles automatically:**
- Edge Network (CDN) for static assets
- Server functions for dynamic routes
- ISR (revalidation) infrastructure
- Automatic HTTPS
- Preview deployments per branch

---

## Self-Hosting with Docker

For teams that need full control or have data sovereignty requirements:

\`\`\`dockerfile
# Dockerfile — Production-optimized Next.js image

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Rebuild source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image — small
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only the build output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
\`\`\`

\`\`\`ts
// next.config.ts — Enable standalone output for Docker
export default {
  output: 'standalone', // Creates minimal deployable bundle
};
\`\`\`

\`\`\`yaml
# docker-compose.yml — Development + production setup
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/myapp
      - NEXTAUTH_SECRET=your-secret-here
      - NEXTAUTH_URL=https://yourapp.com
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d myapp"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
\`\`\`

---

## CI/CD with GitHub Actions

\`\`\`yaml
# .github/workflows/ci.yml

name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: testpassword
          POSTGRES_DB: testdb
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Run tests
        run: npm test
        env:
          DATABASE_URL: postgresql://postgres:testpassword@localhost:5432/testdb

  build:
    name: Build
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          DATABASE_URL: \${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: \${{ secrets.NEXTAUTH_SECRET }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
\`\`\`

---

## Environment Variables

\`\`\`bash
# .env.local — Local development (never commit)
DATABASE_URL=postgresql://localhost:5432/myapp_dev
NEXTAUTH_SECRET=local-dev-secret-32-chars-min
NEXTAUTH_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# .env.example — Commit this (shows required variables, no values)
DATABASE_URL=postgresql://user:password@host:5432/dbname
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://yourapp.com
STRIPE_SECRET_KEY=
NEXT_PUBLIC_APP_URL=
\`\`\`

\`\`\`tsx
// lib/env.ts — Validated environment variables (fail fast on startup)
// Install: npm install @t3-oss/env-nextjs zod

import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(32),
    STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
// If any env var is missing/invalid, the app throws at startup — not at runtime.
\`\`\`

---

## Health Check Endpoint

\`\`\`tsx
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic'; // Always check live

export async function GET() {
  try {
    // Check database connectivity
    await db.$queryRaw\`SELECT 1\`;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: 'Database unavailable' },
      { status: 503 }
    );
  }
}
\`\`\`

---

## Production Checklist

\`\`\`
Environment:
  ✓ All environment variables set in production
  ✓ Database URL points to production DB
  ✓ NEXTAUTH_URL set to production domain
  ✓ Secrets are 32+ random characters

Performance:
  ✓ next.config.ts has output: 'standalone' (Docker) or standard (Vercel)
  ✓ Images use remotePatterns for production domains
  ✓ removeConsole: true in production

Security:
  ✓ Security headers configured
  ✓ HTTPS enforced (HSTS)
  ✓ Cookies are httpOnly + Secure + SameSite

Database:
  ✓ Connection pooling enabled (PgBouncer or connection pool URL)
  ✓ Migrations applied before deploy (npx prisma migrate deploy)
  ✓ Backups configured

Monitoring:
  ✓ Error monitoring (Sentry)
  ✓ Health check endpoint at /api/health
  ✓ Uptime monitoring (Better Uptime, Pingdom)
  ✓ Analytics (Vercel Analytics, PostHog)
\`\`\``,

  codeExamples: [
    {
      title: 'Zero-downtime deployment with Prisma migrations',
      code: `// The challenge: running database migrations during deployment
// without downtime or errors when old and new code run simultaneously

// Strategy: Backward-compatible migrations

// ── Step 1: Add column as nullable first ──────────────────────────
// prisma/migrations/20240101_add_bio/migration.sql
ALTER TABLE "User" ADD COLUMN "bio" TEXT;
-- NOT NULL constraint comes AFTER all rows are backfilled

// ── Step 2: Deploy code that handles both old (null) and new (value) state
// The new code handles null bio gracefully:
export function UserProfile({ user }) {
  return (
    <div>
      <p>{user.bio ?? 'No bio yet'}</p>
    </div>
  );
}

// ── Step 3: Backfill existing rows ─────────────────────────────────
// scripts/backfill-bio.ts
await db.user.updateMany({
  where: { bio: null },
  data: { bio: '' },
});

// ── Step 4: Add NOT NULL constraint in next migration ──────────────
// prisma/migrations/20240102_bio_not_null/migration.sql
ALTER TABLE "User" ALTER COLUMN "bio" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "bio" SET DEFAULT '';

// ── CI/CD pipeline ──────────────────────────────────────────────────
// package.json scripts:
{
  "scripts": {
    "db:migrate": "prisma migrate deploy",
    "build": "next build",
    "start": "node server.js",
    // Run in this order:
    "deploy": "npm run db:migrate && npm run build && npm run start"
  }
}

// GitHub Actions step:
// - name: Deploy
//   run: |
//     npx prisma migrate deploy  # Apply pending migrations
//     npm run build              # Build the app
//     # Then swap containers (zero-downtime)`,
      explanation:
        'Zero-downtime migrations require backward compatibility: add columns as nullable first, deploy code that handles both old and new states, then backfill and add constraints in a follow-up migration. Running prisma migrate deploy before the build applies pending migrations to the production database.',
    },
  ],

  commonMistakes: [
    'Committing .env files with real secrets — use .env.local (git-ignored) for secrets.',
    'Not validating environment variables at startup — missing env vars cause confusing runtime errors deep in the code.',
    'Running prisma migrate dev in production — use prisma migrate deploy for CI/CD.',
    'Not setting NEXTAUTH_URL in production — auth redirect URLs will be wrong.',
    'Using development Stripe keys in production — sk_test_ keys do not process real payments.',
    'Not setting up a health check endpoint — load balancers and monitoring cannot detect unhealthy instances.',
    'Ignoring connection pool limits in serverless — each function invocation creates a DB connection; use PgBouncer or a pool-compatible URL.',
  ],

  interviewQuestions: [
    {
      question: 'What is the difference between next build output modes and when would you use each?',
      answer:
        "Next.js has three output modes: (1) Default (no config) — creates a .next directory with all build artifacts. Used when deploying to platforms that run node server.js, like Vercel or Render. (2) standalone — creates a self-contained directory with only the files needed to run the app. The node_modules are tree-shaken to a minimal set. Used for Docker deployments — results in a much smaller Docker image. (3) export — generates a fully static HTML/CSS/JS site with no server. Used when you have no dynamic routes, no Server Actions, no Route Handlers, and want to host on any static file server (S3, Netlify static). Most production apps use default (Vercel) or standalone (Docker).",
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'deploy-ex-1',
      title: 'Create a production-ready Dockerfile and CI workflow',
      description: `Create deployment configuration for a Next.js app:
1. Multi-stage Dockerfile with standalone output
2. GitHub Actions workflow: type-check → lint → build on push to main
3. Health check endpoint at /api/health
4. Validated environment variables with @t3-oss/env-nextjs`,
      starterCode: `// app/api/health/route.ts — IMPLEMENT THIS
// GET /api/health should return:
// 200 { status: 'healthy', timestamp: '...' }
// 503 { status: 'unhealthy', error: '...' } if DB fails

// Dockerfile — IMPLEMENT THIS
// Multi-stage: deps → builder → runner
// runner should use non-root user

// .github/workflows/ci.yml — IMPLEMENT THIS
// Run on push to main
// Steps: checkout, setup node, npm ci, type-check, lint, build`,
      solution: `// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await db.$queryRaw\`SELECT 1\`;
    return NextResponse.json({ status: 'healthy', timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ status: 'unhealthy', error: 'DB unavailable' }, { status: 503 });
  }
}

// Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -g 1001 nodejs && adduser -u 1001 -G nodejs nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]

// .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run build
        env:
          DATABASE_URL: \${{ secrets.DATABASE_URL }}`,
      hints: [
        'next.config.ts needs output: "standalone" for the Dockerfile to work',
        'GitHub secrets store production env vars securely',
        'The health check needs force-dynamic to always run the DB check',
        'Multi-stage Docker builds keep the final image small',
      ],
    },
  ],

  keyTakeaways: [
    'Vercel is the easiest deployment target — built by the same team, deepest Next.js integration.',
    'Docker with output: "standalone" creates a minimal self-contained image for self-hosting.',
    'CI/CD pipeline: type-check → lint → test → build → deploy — never skip the checks.',
    'Validate environment variables at startup (t3-oss/env-nextjs) — fail fast with clear errors.',
    'Use prisma migrate deploy (not dev) in CI/CD — safe for production migrations.',
    'Add a /api/health endpoint — required for load balancers and uptime monitoring.',
    'Never commit .env files — commit .env.example to show required variables without values.',
    'Connection pooling is mandatory for serverless — each invocation creates a DB connection without it.',
  ],
};
