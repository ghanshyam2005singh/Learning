import type { Lesson } from '@/types';

export const guidedProjectsLesson: Lesson = {
  id: 'nextjs-guided-projects',
  slug: 'nextjs-guided-projects',
  title: 'Guided Projects',
  description:
    'Build three complete production-ready applications — a personal blog with CMS, a SaaS dashboard with auth, and a real-time collaborative tool — step by step with full architecture guidance.',
  category: 'Projects',
  order: 26,
  difficulty: 'advanced',
  estimatedTime: 300,
  prevLesson: 'nextjs-practice',
  nextLesson: 'nextjs-revision-hub',

  content: `# Guided Projects

## How to Use This Module

These projects take you from concept to deployed app. Each project is designed to be:
- **Realistic**: patterns you would use in a real job
- **Progressive**: builds on concepts from previous modules
- **Complete**: has auth, data, UI, testing, and deployment

Build them in order — each one introduces new complexity.

---

## Project 1: Personal Blog with CMS (Beginner-Intermediate)

### What you'll build
A personal blog where you write posts in Markdown, they are statically generated, and the site is automatically redeployed when you publish new posts. Think: a simpler version of dev.to or Medium's author dashboard.

### Tech stack
- Next.js 14 (App Router)
- MDX for blog content
- Prisma + PostgreSQL for post metadata
- Tailwind CSS
- Vercel deployment

### Architecture

\`\`\`
app/
  (marketing)/
    layout.tsx          ← Marketing layout (no auth)
    page.tsx            ← Homepage with recent posts
    blog/
      page.tsx          ← All posts list
      [slug]/
        page.tsx        ← Individual post (SSG + ISR)
  (admin)/
    layout.tsx          ← Admin layout (requires auth)
    admin/
      page.tsx          ← Post dashboard
      new/page.tsx      ← Create post editor
      [id]/edit/page.tsx ← Edit post
features/
  posts/
    queries.ts
    actions.ts
    schemas.ts
\`\`\`

### Step 1: Data Model

\`\`\`prisma
model Post {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  excerpt     String
  content     String   // Markdown/MDX content
  published   Boolean  @default(false)
  publishedAt DateTime?
  updatedAt   DateTime @updatedAt
  createdAt   DateTime @default(now())
  coverImage  String?
  tags        Tag[]
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  posts Post[]
}
\`\`\`

### Step 2: Blog Listing (SSG)

\`\`\`tsx
// app/(marketing)/blog/page.tsx
import { cache } from 'react';
import { db } from '@/lib/db';
import { PostCard } from '@/features/posts/components/PostCard';

const getPublishedPosts = cache(async () => {
  return db.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    include: { tags: true },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
      coverImage: true,
      tags: { select: { name: true } },
    },
  });
});

// ISR — revalidate every 10 minutes
export const revalidate = 600;

export const metadata = {
  title: 'Blog',
  description: 'Articles about web development, design, and engineering.',
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet. Check back soon!</p>
      ) : (
        <div className="space-y-8">
          {posts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  );
}
\`\`\`

### Step 3: Individual Post (SSG + ISR)

\`\`\`tsx
// app/(marketing)/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { cache } from 'react';
import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { MDXRemote } from 'next-mdx-remote/rsc'; // Renders MDX on server

export const revalidate = 600; // Revalidate every 10 minutes

const getPost = cache(async (slug: string) => {
  return db.post.findUnique({
    where: { slug, published: true },
    include: { tags: true },
  });
});

export async function generateStaticParams() {
  const posts = await db.post.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return posts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Not Found' };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <article className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex gap-2 mb-3">
          {post.tags.map(t => (
            <span key={t.id} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {t.name}
            </span>
          ))}
        </div>
        <h1 className="text-4xl font-bold">{post.title}</h1>
        {post.publishedAt && (
          <p className="text-gray-500 mt-2">
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        )}
      </div>

      {/* MDX renders markdown with React component support */}
      <div className="prose prose-lg max-w-none">
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}
\`\`\`

### Step 4: Admin Post Creation

\`\`\`tsx
// features/posts/actions.ts
"use server";
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

const PostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(10, 'Content too short'),
  excerpt: z.string().max(300),
  published: z.boolean().default(false),
});

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export async function createPost(prevState: any, formData: FormData) {
  await requireAuth();

  const result = PostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    excerpt: formData.get('excerpt'),
    published: formData.get('published') === 'on',
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const post = await db.post.create({
    data: {
      ...result.data,
      slug: slugify(result.data.title),
      publishedAt: result.data.published ? new Date() : null,
    },
  });

  revalidatePath('/blog');
  return { success: true, id: post.id };
}
\`\`\`

---

## Project 2: SaaS Dashboard (Intermediate-Advanced)

### What you'll build
A full-stack SaaS dashboard with authentication, subscription billing (Stripe), team management, and analytics. Think: a basic version of Linear, Notion, or Vercel's dashboard.

### Tech stack
- Next.js 14 (App Router)
- NextAuth.js v5 for authentication
- Prisma + PostgreSQL
- Stripe for billing
- Tailwind CSS + shadcn/ui
- Vercel deployment with Vercel Analytics

### Key Features

1. **Authentication**: Email/password + Google OAuth via NextAuth.js
2. **Organizations**: Users create an org, invite team members
3. **Billing**: Free tier (3 projects) → Pro tier ($29/mo, unlimited)
4. **Dashboard**: Project list, usage stats, team members

### Core Architecture

\`\`\`
features/
  auth/
    actions.ts        ← register, login, logout
    queries.ts        ← getCurrentUser, getUserOrgs
  organizations/
    actions.ts        ← createOrg, inviteMember, updateOrg
    queries.ts        ← getOrg, getOrgMembers, getOrgProjects
  billing/
    service.ts        ← Stripe checkout, webhook handler
    queries.ts        ← getSubscription, getInvoices
  projects/
    actions.ts        ← createProject, deleteProject
    queries.ts        ← getProjects, getProject
\`\`\`

### Schema (key models)

\`\`\`prisma
model User {
  id               String   @id @default(cuid())
  name             String
  email            String   @unique
  hashedPassword   String?
  stripeCustomerId String?
  memberships      Membership[]
  accounts         Account[]  // For NextAuth OAuth
  createdAt        DateTime @default(now())
}

model Organization {
  id           String       @id @default(cuid())
  name         String
  slug         String       @unique
  plan         String       @default("free")
  memberships  Membership[]
  projects     Project[]
  subscription Subscription?
}

model Membership {
  id     String @id @default(cuid())
  role   Role   @default(MEMBER)
  user   User   @relation(fields: [userId], references: [id])
  userId String
  org    Organization @relation(fields: [orgId], references: [id])
  orgId  String
  @@unique([userId, orgId])
}

model Project {
  id        String   @id @default(cuid())
  name      String
  org       Organization @relation(fields: [orgId], references: [id])
  orgId     String
  createdAt DateTime @default(now())
}

enum Role { OWNER ADMIN MEMBER }
\`\`\`

---

## Project 3: Real-Time Collaborative Notes (Advanced)

### What you'll build
A collaborative note-taking app where multiple users can see each other's edits in real-time. Think: a simplified Notion or Google Docs.

### Tech stack
- Next.js 14 (App Router)
- Liveblocks for real-time state (handles WebSockets, presence, conflict resolution)
- Tiptap for rich text editing
- Prisma + PostgreSQL for persistence
- JWT authentication

### Key Features

1. **Rich text editing**: Bold, italic, lists, headings with Tiptap
2. **Real-time cursors**: See where other users are in the document
3. **Presence indicators**: "Alice is editing" notification
4. **Auto-save**: Debounced save to database
5. **Version history**: View previous versions

### Architecture Insight

\`\`\`
The challenge: Real-time + Persistence

Two sources of truth:
1. Liveblocks (real-time state — what's on screen right now)
2. PostgreSQL (persistent state — what's saved)

Strategy:
- Liveblocks handles real-time sync between users
- Every 30 seconds OR on blur: save Liveblocks state to PostgreSQL
- On page load: initialize Liveblocks with PostgreSQL content
\`\`\`

\`\`\`tsx
// app/(app)/notes/[id]/page.tsx
import { Liveblocks } from "@liveblocks/node";
import { CollaborativeEditor } from './CollaborativeEditor';
import { getNote } from '@/features/notes/queries';
import { requireAuth } from '@/lib/auth';

const liveblocks = new Liveblocks({ secret: process.env.LIVEBLOCKS_SECRET! });

export default async function NotePage({ params }: { params: { id: string } }) {
  const user = await requireAuth();
  const note = await getNote(params.id);

  if (!note) notFound();

  // Create a Liveblocks session token scoped to this room
  const { token } = await liveblocks.prepareSession(user.id, {
    userInfo: { name: user.name, avatarUrl: user.avatarUrl },
  }).allow(\`note:\${params.id}\`, ['room:write']).authorize();

  return (
    <CollaborativeEditor
      noteId={params.id}
      initialContent={note.content}
      liveblocksToken={token}
    />
  );
}

// components/CollaborativeEditor.tsx — Client Component
"use client";
import { RoomProvider, useOthers, useUpdateMyPresence } from '@liveblocks/react';
import { useEditor, EditorContent } from '@tiptap/react';
import { useCallback } from 'react';
import { saveNote } from '@/features/notes/actions';

export function CollaborativeEditor({ noteId, initialContent, liveblocksToken }) {
  const editor = useEditor({
    content: initialContent,
    onUpdate: ({ editor }) => {
      // Debounced save
      debouncedSave(noteId, editor.getHTML());
    },
  });

  return (
    <RoomProvider id={\`note:\${noteId}\`} initialPresence={{ cursor: null }}>
      <PresenceBar />
      <EditorContent editor={editor} className="prose max-w-none min-h-screen p-8" />
    </RoomProvider>
  );
}

function PresenceBar() {
  const others = useOthers();
  return (
    <div className="flex items-center gap-2 p-3 border-b">
      {others.map(({ connectionId, info }) => (
        <div key={connectionId} className="flex items-center gap-1 text-sm">
          <img src={info.avatarUrl} className="h-6 w-6 rounded-full" />
          <span>{info.name}</span>
        </div>
      ))}
    </div>
  );
}
\`\`\`

---

## Choosing a Project to Build for Your Portfolio

When asked "show me a Next.js project":

| If you want to show | Build |
|---|---|
| Core Next.js skills | Project 1 (Blog) |
| Full-stack / auth / billing | Project 2 (SaaS Dashboard) |
| Advanced real-time features | Project 3 (Collaborative Notes) |
| All of the above | Project 2 with real-time feature added |

**Portfolio advice**: One complete, well-built project beats three incomplete ones. Focus on:
- Clean code (feature-sliced, TypeScript throughout)
- Deployed and live
- Good README explaining architecture decisions
- Tests for critical paths`,

  codeExamples: [
    {
      title: 'Project starter: one command setup',
      code: `# Recommended starter stack for any project

npx create-next-app@latest my-project --typescript --tailwind --app --src-dir

cd my-project

# Core dependencies
npm install prisma @prisma/client zod bcryptjs jose

# Dev dependencies
npm install -D @types/bcryptjs

# Optional: react-hook-form for complex forms
npm install react-hook-form @hookform/resolvers

# Optional: Zustand for client state
npm install zustand

# Initialize Prisma
npx prisma init --datasource-provider postgresql

# ── Project structure ──────────────────────────────────────

mkdir -p src/features/auth/{components,actions,queries,schemas}
mkdir -p src/lib
mkdir -p src/components/ui

# ── Essential files ─────────────────────────────────────────

# src/lib/db.ts — Prisma singleton
cat > src/lib/db.ts << 'EOF'
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
EOF

# src/lib/auth.ts — requireAuth helper
cat > src/lib/auth.ts << 'EOF'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function requireAuth() {
  const token = cookies().get('session')?.value;
  if (!token) redirect('/login');

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { userId: string; email: string };
  } catch {
    redirect('/login');
  }
}
EOF

echo "✅ Project initialized"`,
      explanation:
        'A consistent project setup saves time. The Prisma singleton prevents dev hot-reload connection issues. The requireAuth helper is used in every protected Server Component and Server Action. Structure features by domain from day one.',
    },
  ],

  commonMistakes: [
    'Starting too complex — begin with Project 1 before attempting Project 3.',
    'Not deploying early — deploy a bare-bones version on day 1 and add features incrementally.',
    'Building features before authentication — auth touches everything; implement it first.',
    'Not using TypeScript strictly — type errors caught early save hours of debugging.',
    'Skipping error handling — a portfolio project without error states looks unfinished.',
    'Not writing a README — employers look at the README first; explain your architecture decisions.',
  ],

  interviewQuestions: [
    {
      question: 'Walk me through the architecture of a project you built with Next.js.',
      answer:
        "A great answer structure: (1) What problem the app solves — 1-2 sentences. (2) Why Next.js specifically — SSR for SEO, Server Actions for full-stack without separate backend, ISR for blog posts. (3) Key architectural decisions: App Router, feature-sliced design, data access layer in queries.ts, Prisma for ORM, JWT auth with jose. (4) One interesting technical challenge you solved — e.g., 'I had a race condition in inventory management and solved it with a Prisma transaction with conditional updateMany'. (5) What you would do differently — shows self-awareness. Interviewers value the reasoning behind decisions more than the technology chosen.",
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'project-ex-1',
      title: 'Build Project 1: Personal Blog',
      description: `Build the complete personal blog from scratch:

Phase 1 (2-3 hours):
- Set up Next.js with TypeScript + Tailwind
- Create Prisma schema (Post, Tag models)
- Build homepage, blog listing, and individual post pages
- Add generateStaticParams + generateMetadata

Phase 2 (2-3 hours):
- Add simple admin section (no auth for now — just /admin)
- Create post form with Server Action
- Add draft/publish toggle
- Add ISR with revalidation on publish

Phase 3 (1-2 hours):
- Add basic auth (hardcoded admin password is fine)
- Style the site
- Deploy to Vercel

Stretch goals:
- MDX support for rich posts
- Tag filtering
- RSS feed at /feed.xml`,
      starterCode: `# Run this to initialize:
npx create-next-app@latest blog --typescript --tailwind --app --src-dir
cd blog
npm install prisma @prisma/client
npx prisma init --datasource-provider postgresql

# Add to prisma/schema.prisma:
# model Post {
#   id          String   @id @default(cuid())
#   title       String
#   slug        String   @unique
#   content     String
#   excerpt     String
#   published   Boolean  @default(false)
#   publishedAt DateTime?
#   createdAt   DateTime @default(now())
#   updatedAt   DateTime @updatedAt
# }`,
      solution: `// See the full blog implementation in the module content above.
// Key files to implement:
// 1. prisma/schema.prisma — Post model
// 2. src/lib/db.ts — Prisma singleton
// 3. app/(marketing)/blog/page.tsx — SSG listing
// 4. app/(marketing)/blog/[slug]/page.tsx — SSG post + generateStaticParams + generateMetadata
// 5. features/posts/actions.ts — createPost Server Action
// 6. app/(admin)/admin/new/page.tsx — Post creation form

// Minimum viable deployable version:
// - Blog listing (static, reads from DB)
// - Individual post (static + ISR)
// - Admin create form (no auth required for Phase 1)
// - Deployed to Vercel`,
      hints: [
        'Set up Prisma and push the schema before writing any page code',
        'Seed the database with 2-3 sample posts to test the listing page',
        'Deploy early — catch production issues before adding more features',
        'generateStaticParams with an empty DB returns [] — that is fine, pages are generated on demand',
      ],
    },
  ],

  keyTakeaways: [
    'Project 1 (Blog): masters SSG, ISR, generateStaticParams, generateMetadata, Server Actions.',
    'Project 2 (SaaS): masters auth, multi-tenancy, billing, team management — most interview relevant.',
    'Project 3 (Collaborative): masters real-time, WebSockets/Liveblocks, presence, conflict resolution.',
    'Build features incrementally — deploy on day 1, add complexity gradually.',
    'Auth first — implement authentication before any feature that needs it.',
    'Feature-sliced design from the start prevents architecture rewrites later.',
    'One complete, deployed, well-documented project beats three incomplete demos.',
    'The README matters — explain architecture decisions, tradeoffs, and what you would improve.',
  ],
};
