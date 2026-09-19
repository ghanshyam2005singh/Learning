import type { Lesson } from '@/types';

export const scalableArchitectureLesson: Lesson = {
  id: 'nextjs-scalable-architecture',
  slug: 'nextjs-scalable-architecture',
  title: 'Scalable Architecture Patterns',
  description:
    'Master scalable Next.js architecture — feature-sliced design, data access layers, repository patterns, service layers, modular monoliths, and patterns used by large teams at scale.',
  category: 'Architecture',
  order: 22,
  difficulty: 'advanced',
  estimatedTime: 55,
  prevLesson: 'nextjs-deployment',
  nextLesson: 'nextjs-system-design',

  content: `# Scalable Architecture Patterns in Next.js

## Why Architecture Matters

A small Next.js app can be built with everything in \`app/\`. But as teams and codebases grow:

- Multiple developers work on the same feature
- A change in one place breaks something else
- Business logic leaks into UI components
- Tests become hard to write
- Onboarding new developers takes weeks

Good architecture solves these problems. The goal: **each piece of code has one reason to change**.

---

## Feature-Sliced Design

Organize by feature, not by technical layer:

\`\`\`
src/
  features/
    auth/
      components/     ← Auth-specific UI (LoginForm, RegisterForm)
      actions/        ← Server Actions (login, register, logout)
      queries/        ← DB queries (getUser, getUserByEmail)
      schemas/        ← Zod schemas (LoginSchema, RegisterSchema)
      hooks/          ← Client hooks (useSession)
      types.ts        ← Auth-specific types
    posts/
      components/     ← PostCard, PostEditor, PostList
      actions/        ← createPost, updatePost, deletePost
      queries/        ← getPosts, getPost, getPostsByAuthor
      schemas/        ← PostSchema, UpdatePostSchema
      types.ts
    billing/
      components/     ← PricingTable, SubscriptionStatus
      actions/        ← createCheckoutSession, cancelSubscription
      queries/        ← getSubscription, getInvoices
      types.ts
  components/         ← Shared, reusable UI (Button, Modal, Input)
  lib/
    db.ts             ← Database client singleton
    auth.ts           ← requireAuth, getCurrentUser
    env.ts            ← Validated environment
  app/                ← Next.js routes (thin — just compose features)
    (marketing)/
      page.tsx
    (auth)/
      login/page.tsx
    (app)/
      dashboard/page.tsx
      posts/page.tsx
\`\`\`

Benefits:
- Adding a new feature = new folder under \`features/\`
- Deleting a feature = delete its folder
- Easy to see what a feature owns
- Multiple developers work without conflicts

---

## Data Access Layer

Never access the database directly from Server Components or Server Actions. Create a dedicated query layer:

\`\`\`tsx
// features/posts/queries.ts — All DB reads for posts

import { cache } from 'react';
import { db } from '@/lib/db';
import type { Post } from './types';

// cache() deduplicates within a single request
export const getPost = cache(async (id: string): Promise<Post | null> => {
  return db.post.findUnique({
    where: { id, published: true },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
      tags: { select: { name: true } },
      _count: { select: { comments: true, likes: true } },
    },
  });
});

export const getPosts = cache(async (options?: {
  authorId?: string;
  tag?: string;
  page?: number;
  limit?: number;
}) => {
  const { authorId, tag, page = 1, limit = 20 } = options ?? {};

  const [posts, total] = await Promise.all([
    db.post.findMany({
      where: {
        published: true,
        ...(authorId && { authorId }),
        ...(tag && { tags: { some: { name: tag } } }),
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        author: { select: { name: true, avatarUrl: true } },
        tags: { select: { name: true } },
        _count: { select: { comments: true } },
      },
    }),
    db.post.count({ where: { published: true } }),
  ]);

  return { posts, total, pages: Math.ceil(total / limit) };
});
\`\`\`

\`\`\`tsx
// features/posts/actions.ts — All mutations for posts
"use server";

import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath, revalidateTag } from 'next/cache';
import { PostSchema } from './schemas';
import type { ActionResult } from '@/lib/types';

export async function createPost(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const user = await requireAuth();

  const result = PostSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return { success: false, error: 'Validation failed', fieldErrors: result.error.flatten().fieldErrors };
  }

  const post = await db.post.create({
    data: {
      title: result.data.title,
      content: result.data.content,
      authorId: user.id,
      slug: slugify(result.data.title),
    },
  });

  revalidatePath('/posts');
  revalidateTag('posts');
  return { success: true, data: { id: post.id } };
}
\`\`\`

---

## Service Layer (for complex business logic)

Between the Server Action and the database query, add a service layer for complex operations:

\`\`\`tsx
// features/billing/service.ts — Business logic, not in actions or queries

import { db } from '@/lib/db';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const billingService = {
  async createCheckoutSession(userId: string, planId: string) {
    // 1. Get user
    const user = await db.user.findUniqueOrThrow({ where: { id: userId } });

    // 2. Ensure no active subscription
    const existing = await db.subscription.findFirst({
      where: { userId, status: { in: ['active', 'trialing'] } },
    });
    if (existing) throw new Error('User already has an active subscription');

    // 3. Get or create Stripe customer
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({ email: user.email });
      stripeCustomerId = customer.id;
      await db.user.update({
        where: { id: userId },
        data: { stripeCustomerId },
      });
    }

    // 4. Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      line_items: [{ price: planId, quantity: 1 }],
      success_url: \`\${process.env.NEXT_PUBLIC_APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}\`,
      cancel_url: \`\${process.env.NEXT_PUBLIC_APP_URL}/billing\`,
    });

    return { url: session.url! };
  },

  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await db.subscription.create({
          data: {
            stripeSubscriptionId: session.subscription as string,
            userId: await getUserIdByStripeCustomer(session.customer as string),
            status: 'active',
          },
        });
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await db.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: { status: 'canceled' },
        });
        break;
      }
    }
  },
};
\`\`\`

---

## Shared Component Library (design system)

\`\`\`tsx
// components/ui/button.tsx — Reusable, variant-based design system component

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-blue-600 text-white hover:bg-blue-700',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50',
        ghost: 'hover:bg-gray-100',
        link: 'text-blue-600 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>
  & VariantProps<typeof buttonVariants>
  & { asChild?: boolean };

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

// Usage: <Button variant="outline" size="sm">Cancel</Button>
\`\`\`

---

## The Rule of Thumb for Layer Placement

\`\`\`
UI (app/ + components/) — renders, handles user input
  ↕
Server Actions (features/*/actions.ts) — mutations, orchestrates service
  ↕
Services (features/*/service.ts) — complex business logic (optional)
  ↕
Queries (features/*/queries.ts) — data access
  ↕
Database (lib/db.ts) — the actual data

WRONG direction:
  ✗ UI queries DB directly
  ✗ DB queries call services
  ✗ Services call UI components
\`\`\``,

  codeExamples: [
    {
      title: 'Thin Server Components that compose feature layers',
      code: `// app/(app)/dashboard/page.tsx — Thin page, composes features

// ✅ This page does almost nothing itself:
// - Gets the user from auth
// - Passes it to feature components
// - Each feature handles its own data fetching

import { requireAuth } from '@/lib/auth';
import { Suspense } from 'react';
import { DashboardStats } from '@/features/analytics/components/DashboardStats';
import { PostsList } from '@/features/posts/components/PostsList';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <NotificationBell userId={user.id} />
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats userId={user.id} />
      </Suspense>

      <Suspense fallback={<PostsSkeleton />}>
        <PostsList userId={user.id} limit={5} />
      </Suspense>
    </div>
  );
}

// features/posts/components/PostsList.tsx — Owns its data fetching
import { getPosts } from '../queries';

export async function PostsList({
  userId,
  limit,
}: {
  userId: string;
  limit: number;
}) {
  // The page doesn't know HOW posts are fetched
  // This component owns that knowledge
  const { posts } = await getPosts({ authorId: userId, limit });

  if (posts.length === 0) {
    return <EmptyPosts />;
  }

  return (
    <ul className="space-y-3">
      {posts.map(p => <PostCard key={p.id} post={p} />)}
    </ul>
  );
}

// features/analytics/components/DashboardStats.tsx — Independent
import { getStats } from '../queries';

export async function DashboardStats({ userId }: { userId: string }) {
  const stats = await getStats(userId);
  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard label="Total Posts" value={stats.totalPosts} />
      <StatCard label="Total Views" value={stats.totalViews} />
      <StatCard label="Comments" value={stats.totalComments} />
      <StatCard label="Likes" value={stats.totalLikes} />
    </div>
  );
}`,
      explanation:
        'The page component is a thin composer — it only handles auth and layout. Each feature component owns its own data fetching via the queries layer. This makes each feature independently testable and replaceable without touching the page.',
    },
  ],

  commonMistakes: [
    'Putting business logic in Server Actions directly — actions should orchestrate, services hold logic.',
    'Accessing the database in UI components — always go through the queries layer.',
    'Giant shared utility files (utils.ts) with unrelated functions — organize by feature.',
    'Mixing feature concerns — billing components should not import from posts queries.',
    'Overengineering small apps — feature-sliced design is for teams of 3+; a personal project does not need it.',
    'Not using cache() on queries — the same user profile fetched in multiple components hits the DB multiple times.',
    'Circular imports between features — features should be independent (use shared lib/ for cross-feature utilities).',
  ],

  interviewQuestions: [
    {
      question: 'How would you structure a Next.js application for a team of 10 developers?',
      answer:
        'For a large team I would use feature-sliced design: each business domain (auth, posts, billing, notifications) lives in features/[domain]/ with its own components, actions, queries, schemas, and types. The app/ directory contains only thin route files that compose feature components. Shared infrastructure lives in lib/ (db, auth, env). Shared UI components live in components/ui/. This structure means: (1) developers work in their feature directory without conflicts, (2) each feature is independently testable, (3) adding or removing a feature is a single directory operation, (4) business logic never leaks into UI components. I would also establish conventions for the data access layer — Server Components always go through the queries layer, never access the DB directly — enforced by code review and ESLint rules.',
      difficulty: 'advanced',
    },
  ],

  exercises: [
    {
      id: 'arch-ex-1',
      title: 'Refactor a monolithic page into feature-sliced architecture',
      description: `The following page does too much. Refactor it into feature-sliced design:
- Move DB queries to features/*/queries.ts
- Move Server Actions to features/*/actions.ts
- Create feature components that own their data fetching
- Make the page a thin composer`,
      starterCode: `// BEFORE — everything in the page
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const user = await db.user.findUnique({ where: { id: session.userId } });
  const posts = await db.post.findMany({ where: { authorId: session.userId } });
  const followers = await db.follow.count({ where: { followingId: session.userId } });

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{followers} followers</p>
      {posts.map(p => <div key={p.id}>{p.title}</div>)}
    </div>
  );
}`,
      solution: `// features/users/queries.ts
import { cache } from 'react';
import { db } from '@/lib/db';

export const getUserProfile = cache(async (userId: string) => {
  return db.user.findUnique({
    where: { id: userId },
    include: { _count: { select: { followers: true } } },
  });
});

// features/posts/queries.ts
export const getUserPosts = cache(async (userId: string) => {
  return db.post.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, createdAt: true },
  });
});

// features/users/components/UserProfile.tsx
import { getUserProfile } from '../queries';

export async function UserProfile({ userId }: { userId: string }) {
  const user = await getUserProfile(userId);
  if (!user) return null;
  return (
    <div>
      <h1 className="text-2xl font-bold">{user.name}</h1>
      <p className="text-gray-500">{user._count.followers} followers</p>
    </div>
  );
}

// features/posts/components/UserPostList.tsx
import { getUserPosts } from '../queries';

export async function UserPostList({ userId }: { userId: string }) {
  const posts = await getUserPosts(userId);
  return (
    <ul className="mt-6 space-y-2">
      {posts.map(p => (
        <li key={p.id} className="border rounded p-3">
          <a href={\`/posts/\${p.id}\`} className="font-medium hover:underline">{p.title}</a>
        </li>
      ))}
    </ul>
  );
}

// app/(app)/profile/page.tsx — thin page
import { requireAuth } from '@/lib/auth';
import { Suspense } from 'react';
import { UserProfile } from '@/features/users/components/UserProfile';
import { UserPostList } from '@/features/posts/components/UserPostList';

export default async function ProfilePage() {
  const session = await requireAuth();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Suspense fallback={<div className="h-24 bg-gray-100 rounded animate-pulse" />}>
        <UserProfile userId={session.userId} />
      </Suspense>
      <Suspense fallback={<div className="mt-6 space-y-2">{Array(3).fill(0).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}</div>}>
        <UserPostList userId={session.userId} />
      </Suspense>
    </div>
  );
}`,
      hints: [
        'cache() on queries enables deduplication when multiple components need the same data',
        'Feature components own their own DB queries — the page does not pass raw data',
        'Suspense boundaries allow independent streaming per section',
        'The page only knows about auth and composition — not about DB structure',
      ],
    },
  ],

  keyTakeaways: [
    'Feature-sliced design: organize by business domain, not technical layer.',
    'Data access layer: queries in features/*/queries.ts, mutations in features/*/actions.ts.',
    'Service layer for complex business logic that spans multiple queries/actions.',
    'Server Components should be thin composers — they call feature components, not DB queries directly.',
    'Feature components own their data fetching — reduces coupling between page and data.',
    'Use cache() on all query functions — prevents duplicate DB calls when multiple components need the same data.',
    'Shared UI lives in components/ui/; shared infrastructure lives in lib/.',
    'Features should be independent — no cross-feature imports except through lib/.',
  ],
};
