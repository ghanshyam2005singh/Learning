import type { Lesson } from '@/types';

export const databaseIntegrationLesson: Lesson = {
  id: 'nextjs-database-integration',
  slug: 'nextjs-database-integration',
  title: 'Database Integration',
  description:
    'Integrate databases with Next.js — Prisma setup, Drizzle ORM, connection management, Server Components querying directly, transactions, and the data layer architecture.',
  category: 'Database Integration',
  order: 13,
  difficulty: 'intermediate',
  estimatedTime: 50,
  prevLesson: 'nextjs-authentication',
  nextLesson: 'nextjs-forms-validation',

  content: `# Database Integration

> This module focuses on the Next.js integration side. For deep SQL, PostgreSQL, MongoDB, and indexing — see the Database Track.

## The Next.js Database Advantage

In a React SPA, the database is always behind an API layer:

\`\`\`
Client → fetch('/api/products') → Server → DB → response → Client
\`\`\`

In Next.js Server Components, you can skip the API layer:

\`\`\`
Server Component → DB directly → HTML to Client
\`\`\`

This eliminates one complete round trip and an entire API endpoint for most read operations.

---

## Setting Up Prisma

\`\`\`bash
npm install prisma @prisma/client
npx prisma init --datasource-provider postgresql
\`\`\`

\`\`\`prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String    @id @default(cuid())
  name         String
  email        String    @unique
  hashedPassword String?
  role         Role      @default(USER)
  posts        Post[]
  sessions     Session[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Post {
  id          String    @id @default(cuid())
  title       String
  content     String
  published   Boolean   @default(false)
  authorId    String
  author      User      @relation(fields: [authorId], references: [id])
  tags        String[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
}

enum Role {
  USER
  ADMIN
}
\`\`\`

---

## The Database Client Singleton

**Critical in Next.js:** In development, Next.js hot-reloads can create multiple Prisma client instances, exhausting database connection pools. Prevent this with a singleton:

\`\`\`tsx
// lib/db.ts

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
\`\`\`

This pattern stores the Prisma client on the global object. Hot-reloads reuse the existing client instead of creating a new one. In production, a single client is created and reused.

---

## Querying in Server Components

\`\`\`tsx
// app/posts/page.tsx — Direct DB query in Server Component

import { db } from '@/lib/db';

export default async function PostsPage() {
  const posts = await db.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          <h2>{post.title}</h2>
          <p>by {post.author.name}</p>
        </li>
      ))}
    </ul>
  );
}
\`\`\`

---

## Drizzle ORM

Drizzle is a TypeScript-first ORM that is SQL-like and has better Edge Runtime support than Prisma:

\`\`\`bash
npm install drizzle-orm postgres
npm install -D drizzle-kit
\`\`\`

\`\`\`tsx
// lib/schema.ts — Drizzle schema

import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['USER', 'ADMIN']);

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  hashedPassword: text('hashed_password'),
  role: roleEnum('role').default('USER').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const posts = pgTable('posts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  content: text('content').notNull(),
  published: boolean('published').default(false).notNull(),
  authorId: text('author_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// lib/db.ts — Drizzle client
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });

// Querying with Drizzle
const allPosts = await db
  .select()
  .from(posts)
  .where(eq(posts.published, true))
  .leftJoin(users, eq(posts.authorId, users.id))
  .orderBy(desc(posts.createdAt))
  .limit(10);
\`\`\`

---

## Prisma vs Drizzle

| | Prisma | Drizzle |
|---|---|---|
| Type Safety | Excellent (auto-generated) | Excellent (schema-inferred) |
| Query Style | Object/method chain | SQL-like |
| Migrations | prisma migrate dev | drizzle-kit generate |
| Edge Runtime | ❌ (Node.js only) | ✅ (works at edge) |
| Bundle size | Large (binary) | Small |
| Relations | Built-in (include) | Manual JOINs |
| Raw SQL | db.$queryRaw | db.execute(sql\`...\`) |
| Community | Larger, more examples | Growing fast |

**Use Prisma** for most applications — better DX, relations handling, and more learning resources.
**Use Drizzle** when you need Edge Runtime compatibility, want SQL-like queries, or need smaller bundle size.

---

## Transactions

\`\`\`tsx
// Use transactions for operations that must succeed or fail together

// Prisma transactions
const [order, inventory] = await db.$transaction([
  db.order.create({
    data: { userId: 'user-123', total: 99.99 },
  }),
  db.product.update({
    where: { id: 'product-456' },
    data: { stock: { decrement: 1 } },
  }),
]);
// If either fails, both are rolled back

// Interactive transactions (for conditional logic)
const result = await db.$transaction(async (tx) => {
  const product = await tx.product.findUnique({
    where: { id: 'product-456' },
  });

  if (!product || product.stock < 1) {
    throw new Error('Out of stock');
  }

  const order = await tx.order.create({
    data: { userId: 'user-123', productId: product.id, total: product.price },
  });

  await tx.product.update({
    where: { id: product.id },
    data: { stock: { decrement: 1 } },
  });

  return order;
});
\`\`\`

---

## Server Actions + Database Mutations

\`\`\`tsx
// lib/actions/posts.ts
"use server";

import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const CreatePostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  published: z.coerce.boolean().default(false),
});

export async function createPost(prevState: any, formData: FormData) {
  const user = await requireAuth();

  const result = CreatePostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    published: formData.get('published') === 'on',
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const post = await db.post.create({
    data: { ...result.data, authorId: user.id },
  });

  revalidatePath('/posts');
  redirect(\`/posts/\${post.id}\`);
}
\`\`\`

---

## Data Layer Architecture

For production apps, separate your database access from your route/component logic:

\`\`\`
src/
├── lib/
│   ├── db.ts              ← DB client singleton
│   ├── queries/           ← Read queries (used in Server Components)
│   │   ├── posts.ts
│   │   ├── users.ts
│   │   └── products.ts
│   └── actions/           ← Write operations (Server Actions)
│       ├── posts.ts
│       ├── auth.ts
│       └── orders.ts
\`\`\`

\`\`\`tsx
// lib/queries/posts.ts — Read operations
import { cache } from 'react';
import { db } from '@/lib/db';

export const getPublishedPosts = cache(async (options?: {
  limit?: number;
  offset?: number;
  tag?: string;
}) => {
  return db.post.findMany({
    where: {
      published: true,
      ...(options?.tag ? { tags: { has: options.tag } } : {}),
    },
    include: { author: { select: { name: true } } },
    take: options?.limit ?? 20,
    skip: options?.offset ?? 0,
    orderBy: { createdAt: 'desc' },
  });
});

export const getPostBySlug = cache(async (slug: string) => {
  return db.post.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true, avatarUrl: true } },
    },
  });
});
\`\`\``,

  codeExamples: [
    {
      title: 'Full-stack create flow: form → server action → database → revalidate',
      code: `// This is the complete cycle for a CRUD operation in Next.js

// ── Schema ───────────────────────────────────────────────────
// prisma/schema.prisma
// model Product {
//   id          String  @id @default(cuid())
//   name        String
//   price       Float
//   stock       Int     @default(0)
//   ownerId     String
//   createdAt   DateTime @default(now())
// }

// ── Server Action ────────────────────────────────────────────
// lib/actions/products.ts
"use server";
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const ProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  price: z.coerce.number().min(0.01, 'Price must be positive'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
});

export async function createProduct(prev: any, formData: FormData) {
  const user = await requireAuth();

  const result = ProductSchema.safeParse({
    name: formData.get('name'),
    price: formData.get('price'),
    stock: formData.get('stock'),
  });

  if (!result.success) return { errors: result.error.flatten().fieldErrors };

  const product = await db.product.create({
    data: { ...result.data, ownerId: user.id },
  });

  revalidatePath('/products');          // Refresh the products list
  revalidatePath(\`/products/\${product.id}\`); // Pre-build individual page
  return { success: true, productId: product.id };
}

// ── Page ─────────────────────────────────────────────────────
// app/products/page.tsx — Server Component
import { db } from '@/lib/db';
import { CreateProductForm } from './CreateProductForm';

export default async function ProductsPage() {
  // Direct DB query
  const products = await db.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1>Products</h1>
      <CreateProductForm />           {/* Client Component form */}
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name} - \${p.price} ({p.stock} in stock)</li>
        ))}
      </ul>
    </div>
  );
}

// ── Form Client Component ────────────────────────────────────
// app/products/CreateProductForm.tsx
"use client";
import { useFormState, useFormStatus } from 'react-dom';
import { createProduct } from '@/lib/actions/products';

function Submit() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? 'Saving...' : 'Create Product'}</button>;
}

export function CreateProductForm() {
  const [state, action] = useFormState(createProduct, {});
  return (
    <form action={action} className="space-y-4">
      <input name="name" placeholder="Product name" required />
      {state.errors?.name && <p className="text-red-500">{state.errors.name[0]}</p>}
      <input name="price" type="number" step="0.01" placeholder="Price" required />
      <input name="stock" type="number" placeholder="Stock" defaultValue="0" />
      <Submit />
      {state.success && <p className="text-green-500">Product created!</p>}
    </form>
  );
}`,
      explanation:
        'The complete Next.js data cycle: Prisma schema defines the shape, Server Action validates and writes, revalidatePath triggers cache update, Server Component re-renders with fresh data from DB. No API endpoint needed.',
    },
  ],

  commonMistakes: [
    'Creating a new PrismaClient on every request in development — use the singleton pattern to prevent connection pool exhaustion.',
    'Importing the database client in Client Components — db requires Node.js, which is not available in the browser.',
    'Not using transactions for related writes — if one fails, the other should roll back (e.g., creating order + decrementing stock).',
    'Over-fetching with include — only select the fields you need to reduce payload size and query time.',
    'Running Prisma in Edge Runtime — Prisma requires Node.js. Use Drizzle or Neon (serverless HTTP driver) for Edge.',
    'Not handling connection limits in serverless — configure connection pooling (PgBouncer, Prisma Accelerate) for serverless deployments.',
  ],

  interviewQuestions: [
    {
      question: 'How does database access differ between Next.js and a traditional React SPA?',
      answer:
        'In a React SPA, the database is always behind an API layer: the client fetches from an API, the API queries the database. In Next.js with Server Components, you can query the database directly from the component — no API endpoint needed for read operations. This eliminates one network round trip, reduces latency, and removes the need for API endpoints that only exist to proxy data to the frontend. Server Components run on the server where the database lives, so direct queries are both possible and efficient. For mutations, Server Actions provide a similar direct connection pattern.',
      difficulty: 'intermediate',
    },
    {
      question: 'Why do you need the Prisma singleton pattern in Next.js?',
      answer:
        "In development, Next.js uses Hot Module Replacement (HMR). Each time a file changes, modules can be re-evaluated. Without the singleton pattern, each hot reload creates a new PrismaClient instance, which opens a new database connection pool. Prisma's default pool size is 5-10 connections. After a few hot reloads, you exhaust your database's connection limit and get connection errors. The singleton pattern stores the PrismaClient on globalThis, which persists across hot reloads. The check `if (process.env.NODE_ENV !== 'production')` means this only applies in development — production deployments create one client and reuse it naturally.",
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'db-ex-1',
      title: 'Build a paginated blog with direct DB queries',
      description: `Build a blog that:
1. Lists posts at /blog (paginated, ?page=1)
2. Each post links to /blog/[id]
3. The post page shows the full content + author name
4. Uses the Prisma singleton
5. Uses cache() for the individual post query`,
      starterCode: `// Provided: mock db (simulate Prisma)
const mockPosts = [
  { id: '1', title: 'Hello World', content: 'My first post content...', authorId: 'u1', published: true, createdAt: new Date() },
  { id: '2', title: 'Next.js Guide', content: 'Learn Next.js...', authorId: 'u2', published: true, createdAt: new Date() },
];
const mockUsers = [
  { id: 'u1', name: 'Alice' },
  { id: 'u2', name: 'Bob' },
];
const db = {
  post: {
    findMany: async ({ skip = 0, take = 10 }) => mockPosts.slice(skip, skip + take),
    count: async () => mockPosts.length,
    findUnique: async ({ where }) => mockPosts.find(p => p.id === where.id) ?? null,
  },
  user: {
    findUnique: async ({ where }) => mockUsers.find(u => u.id === where.id) ?? null,
  },
};

// TODO: Implement:
// 1. lib/queries/blog.ts — getPosts(page), getPost(id) with cache()
// 2. app/blog/page.tsx — paginated post list
// 3. app/blog/[id]/page.tsx — full post with author`,
      solution: `// lib/queries/blog.ts
import { cache } from 'react';

const PAGE_SIZE = 10;

export async function getPosts(page: number = 1) {
  const skip = (page - 1) * PAGE_SIZE;
  const [posts, total] = await Promise.all([
    db.post.findMany({ skip, take: PAGE_SIZE }),
    db.post.count(),
  ]);
  return { posts, total, totalPages: Math.ceil(total / PAGE_SIZE) };
}

export const getPost = cache(async (id: string) => {
  const post = await db.post.findUnique({ where: { id } });
  if (!post) return null;
  const author = await db.user.findUnique({ where: { id: post.authorId } });
  return { ...post, author };
});

// app/blog/page.tsx
import Link from 'next/link';

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, Number(searchParams.page ?? '1'));
  const { posts, totalPages } = await getPosts(page);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <ul className="space-y-4">
        {posts.map(post => (
          <li key={post.id}>
            <Link href={\`/blog/\${post.id}\`}>
              <h2 className="text-xl font-semibold hover:underline">{post.title}</h2>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex gap-4 mt-8">
        {page > 1 && <Link href={\`?page=\${page - 1}\`}>← Previous</Link>}
        <span>Page {page} of {totalPages}</span>
        {page < totalPages && <Link href={\`?page=\${page + 1}\`}>Next →</Link>}
      </div>
    </div>
  );
}

// app/blog/[id]/page.tsx
import { notFound } from 'next/navigation';

export default async function BlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await getPost(params.id);
  if (!post) notFound();

  return (
    <article className="max-w-2xl mx-auto py-8">
      <h1 className="text-4xl font-bold">{post.title}</h1>
      {post.author && <p className="text-gray-500">By {post.author.name}</p>}
      <div className="mt-6">{post.content}</div>
    </article>
  );
}`,
      hints: [
        'cache() wraps the function — the DB query only runs once even if multiple components call getPost(id)',
        'searchParams drives the page number — accessing it makes the blog list page dynamically rendered',
        'notFound() triggers the not-found.tsx page for missing posts',
        'Promise.all() for count + posts runs both queries in parallel',
      ],
    },
  ],

  keyTakeaways: [
    'Next.js Server Components can query the database directly — no API layer needed for reads.',
    'Use the Prisma singleton pattern (globalThis) to prevent connection exhaustion during development hot reloads.',
    'Prisma requires Node.js and cannot run on Edge Runtime — use Drizzle or serverless adapters for edge.',
    'Use transactions for related writes that must succeed or fail together.',
    'Separate read queries (lib/queries) from write operations (lib/actions) for clean architecture.',
    'Wrap database queries with React cache() to prevent duplicate queries per request.',
    'Only select the fields you need — over-fetching with include increases query time and payload size.',
    'For serverless deployments, configure connection pooling (PgBouncer, Prisma Accelerate, Neon).',
  ],
};
