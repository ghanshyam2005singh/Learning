import type { Lesson } from '@/types';

export const practiceLesson: Lesson = {
  id: 'nextjs-practice',
  slug: 'nextjs-practice',
  title: 'Practice Challenges',
  description:
    'Hands-on coding challenges covering all Next.js patterns — from beginner exercises to production-grade challenges involving auth, caching, real-time, and architecture.',
  category: 'Practice',
  order: 25,
  difficulty: 'intermediate',
  estimatedTime: 120,
  prevLesson: 'nextjs-interview-preparation',
  nextLesson: 'nextjs-guided-projects',

  content: `# Practice Challenges

## How to Use These Challenges

Each challenge has:
1. A clear goal and requirements
2. Starter code (what you begin with)
3. A solution to compare against after attempting
4. Key concepts it tests

Work through them in order — they build on each other. **Do not look at the solution until you have spent at least 20 minutes trying.**

---

## Challenge 1 — Beginner: Server Component Product Page

**Goal:** Build a product page that fetches data from a mock database and renders it as a Server Component.

**Requirements:**
- \`/products/[id]\` — dynamic route
- Server Component that fetches product by ID
- Shows 404 if product not found
- TypeScript throughout

**Starter:**
\`\`\`tsx
// Mock database (use this for the challenge)
const products = [
  { id: '1', name: 'Mechanical Keyboard', price: 149, description: 'A great keyboard.', inStock: true },
  { id: '2', name: 'USB-C Hub', price: 59, description: 'Connects everything.', inStock: false },
  { id: '3', name: 'Monitor Stand', price: 89, description: 'Elevate your screen.', inStock: true },
];

// TODO: Build app/products/[id]/page.tsx
\`\`\`

**Solution:**
\`\`\`tsx
// app/products/[id]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const products = [
  { id: '1', name: 'Mechanical Keyboard', price: 149, description: 'A great keyboard.', inStock: true },
  { id: '2', name: 'USB-C Hub', price: 59, description: 'Connects everything.', inStock: false },
  { id: '3', name: 'Monitor Stand', price: 89, description: 'Elevate your screen.', inStock: true },
];

async function getProduct(id: string) {
  // Simulate DB latency
  await new Promise(r => setTimeout(r, 100));
  return products.find(p => p.id === id) ?? null;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) return { title: 'Product Not Found' };
  return { title: product.name, description: product.description };
}

export async function generateStaticParams() {
  return products.map(p => ({ id: p.id }));
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-2xl font-semibold mt-2 text-blue-600">\${product.price}</p>
      <p className="mt-4 text-gray-600">{product.description}</p>
      <span className={\`mt-4 inline-block px-3 py-1 rounded-full text-sm font-medium \${
        product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }\`}>
        {product.inStock ? 'In Stock' : 'Out of Stock'}
      </span>
    </div>
  );
}
\`\`\`

---

## Challenge 2 — Beginner: Client Component Counter

**Goal:** Build a counter that uses Client Component patterns correctly.

**Requirements:**
- Counter with increment/decrement/reset
- Show an alert when count reaches 10
- Persist count in localStorage between page refreshes

**Solution:**
\`\`\`tsx
// components/PersistentCounter.tsx
"use client";

import { useState, useEffect } from 'react';

export function PersistentCounter() {
  const [count, setCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('counter');
    if (saved) setCount(parseInt(saved, 10));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem('counter', count.toString());

    if (count === 10) {
      alert('You reached 10!');
    }
  }, [count, loaded]);

  if (!loaded) return null; // Prevent hydration mismatch

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <div className="text-6xl font-bold">{count}</div>
      <div className="flex gap-3">
        <button onClick={() => setCount(c => c - 1)} className="px-4 py-2 bg-red-500 text-white rounded">-</button>
        <button onClick={() => setCount(0)} className="px-4 py-2 bg-gray-500 text-white rounded">Reset</button>
        <button onClick={() => setCount(c => c + 1)} className="px-4 py-2 bg-green-500 text-white rounded">+</button>
      </div>
    </div>
  );
}
\`\`\`

---

## Challenge 3 — Intermediate: Server Action Form

**Goal:** Build a contact form that uses a Server Action with validation and error handling.

**Requirements:**
- Fields: name, email, message (all required)
- Email must be valid format
- Message must be at least 20 characters
- Show field-specific errors
- Show success message after submission
- Disable submit button while pending

---

## Challenge 4 — Intermediate: URL-Driven Search

**Goal:** Build a search page where the search query is in the URL (bookmarkable).

**Requirements:**
- Search input updates the URL (?q=searchterm)
- Server Component reads searchParams and filters results
- Empty state when no query
- Client Component debounces the search (300ms) before pushing to URL

---

## Challenge 5 — Advanced: ISR with On-Demand Revalidation

**Goal:** Build a blog system with ISR that can be revalidated via a webhook.

**Requirements:**
- Blog posts pre-rendered at build time (\`generateStaticParams\`)
- ISR with 1-hour TTL (\`revalidate: 3600\`)
- Webhook endpoint at \`POST /api/revalidate\` that accepts a post ID and revalidates its page
- Protect the webhook with a secret token

**Solution:**
\`\`\`tsx
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Verify the secret token
  const authHeader = request.headers.get('authorization');
  if (authHeader !== \`Bearer \${process.env.REVALIDATION_SECRET}\`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { postId, type } = body;

  if (type === 'post' && postId) {
    revalidatePath(\`/blog/\${postId}\`);
    revalidateTag('posts');
    return NextResponse.json({ revalidated: true, path: \`/blog/\${postId}\` });
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}

// app/blog/[slug]/page.tsx
export const revalidate = 3600; // 1-hour ISR

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(p => ({ slug: p.slug }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.htmlContent }} />
    </article>
  );
}
\`\`\`

---

## Challenge 6 — Advanced: Optimistic UI with useOptimistic

**Goal:** Build a like button that updates instantly (optimistically) before the server confirms.

**Requirements:**
- Click heart icon → count increments immediately
- Server Action runs in background
- If server fails, count reverts
- Prevent double-clicking (debounce or disable during pending)

**Solution:**
\`\`\`tsx
"use client";

import { useOptimistic, useTransition } from 'react';
import { toggleLike } from '@/lib/actions/posts';

type Props = {
  postId: string;
  initialCount: number;
  initialLiked: boolean;
};

export function LikeButton({ postId, initialCount, initialLiked }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(
    { count: initialCount, liked: initialLiked },
    (state, liked: boolean) => ({
      count: liked ? state.count + 1 : state.count - 1,
      liked,
    })
  );

  function handleLike() {
    if (isPending) return;

    const newLiked = !optimistic.liked;

    startTransition(async () => {
      setOptimistic(newLiked); // Instant UI update
      await toggleLike(postId, newLiked); // Server sync (slow)
      // On error, startTransition automatically reverts the optimistic state
    });
  }

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className="flex items-center gap-2"
    >
      <span>{optimistic.liked ? '❤️' : '🤍'}</span>
      <span>{optimistic.count}</span>
    </button>
  );
}
\`\`\`

---

## Challenge 7 — Expert: Full Auth Flow

**Goal:** Implement a complete JWT-based authentication system:
- \`POST /api/auth/register\` — creates user, returns JWT
- \`POST /api/auth/login\` — verifies credentials, sets httpOnly cookie
- \`POST /api/auth/logout\` — clears cookie
- Protected middleware that redirects /dashboard if not authenticated
- requireAuth() helper used in Server Components and Actions

---

## Challenge 8 — Expert: Paginated Feed with Cursor Pagination

**Goal:** Build an infinite-scroll blog feed using cursor-based pagination.

**Requirements:**
- First page loads via Server Component (SSR)
- "Load more" button fetches next page via Route Handler
- Uses cursor pagination (not offset) for consistency
- Loading state per batch

**Key concept — cursor vs offset pagination:**
\`\`\`tsx
// ❌ Offset pagination — breaks when items are added:
// Page 1: items 1-20 (OFFSET 0)
// User adds an item
// Page 2: items 2-21 (OFFSET 20) — item 20 appears twice!

// ✅ Cursor pagination — stable:
// Page 1: items where createdAt > start, take 20
// Cursor = last item's createdAt
// Page 2: items where createdAt < cursor, take 20

// Route Handler with cursor:
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor');
  const limit = 20;

  const posts = await db.post.findMany({
    where: cursor
      ? { createdAt: { lt: new Date(cursor) } }
      : {},
    orderBy: { createdAt: 'desc' },
    take: limit + 1, // Fetch one extra to know if there's a next page
  });

  const hasMore = posts.length > limit;
  const items = posts.slice(0, limit);
  const nextCursor = hasMore ? items[items.length - 1].createdAt.toISOString() : null;

  return NextResponse.json({ items, nextCursor });
}
\`\`\``,

  codeExamples: [
    {
      title: 'Debugging challenge — find the bug',
      code: `// This component has multiple bugs. Find and fix them all.

// Bug 1:
export async function UserDashboard() {
  const [user, setUser] = useState(null); // ← BUG: useState in async Server Component
  const data = await db.user.findFirst();
  setUser(data);
  return <div>{user?.name}</div>;
}

// Bug 2:
"use client";
async function fetchData() {
  const data = await fetch('/api/data');
  return data; // ← BUG: not calling .json()
}

// Bug 3:
export default function Page() {
  return (
    <Suspense>
      <DataComponent />   {/* ← BUG: no fallback prop */}
    </Suspense>
  );
}

// Bug 4:
// middleware.ts
export async function middleware() {
  const user = await db.user.findFirst(); // ← BUG: Prisma in middleware (Edge Runtime)
  if (!user) return NextResponse.redirect('/login');
}

// SOLUTIONS:
// Bug 1: Remove useState — Server Components cannot use hooks.
//   Just return <div>{data?.name}</div> directly.

// Bug 2: const data = await fetch('/api/data').then(r => r.json());

// Bug 3: <Suspense fallback={<LoadingSpinner />}>

// Bug 4: Use jose to verify JWT from cookie instead of querying DB:
//   const token = request.cookies.get('session')?.value;
//   await jwtVerify(token, secret);`,
      explanation:
        'Bug-finding exercises reveal conceptual understanding better than "write from scratch" exercises. Common bugs: using hooks in Server Components, not calling .json() on fetch, missing Suspense fallback, using Prisma in Edge Runtime.',
    },
  ],

  commonMistakes: [],

  interviewQuestions: [
    {
      question: 'Walk me through building a paginated blog with ISR from scratch.',
      answer:
        "Start with the data layer: a getPosts(page) query function using cache(). Then the page component: mark it with export const revalidate = 3600 for ISR. Use generateStaticParams to pre-render popular pages at build time (page 1 and 2). The listing page reads searchParams for page number — this makes it dynamic, so combine with force-static if you want SSG. For each post page, generateStaticParams pre-renders all published posts. On publish, call revalidatePath and revalidateTag from the CMS webhook. Add generateMetadata for SEO. The router cache handles client-side navigation. Result: build-time static HTML, hourly background refresh, instant revalidation on publish.",
      difficulty: 'advanced',
    },
  ],

  exercises: [
    {
      id: 'practice-ex-1',
      title: 'Complete all 8 challenges',
      description: `Complete challenges 1-8 above in order. For each:
1. Read the requirements carefully
2. Attempt without looking at the solution
3. Compare your solution with the provided one
4. Note what you did differently and why

Mark each one as you complete it:
[ ] Challenge 1 — Server Component Product Page
[ ] Challenge 2 — Client Component Counter
[ ] Challenge 3 — Server Action Form
[ ] Challenge 4 — URL-Driven Search
[ ] Challenge 5 — ISR with On-Demand Revalidation
[ ] Challenge 6 — Optimistic UI with useOptimistic
[ ] Challenge 7 — Full Auth Flow
[ ] Challenge 8 — Paginated Feed with Cursor Pagination`,
      starterCode: `// Start with Challenge 1:
// Build a product listing and product detail page with:
// - /products → list all products
// - /products/[id] → single product with generateStaticParams
// - not-found.tsx for invalid product IDs
// - generateMetadata for each product

// You have this data:
const products = [
  { id: '1', name: 'Mechanical Keyboard', price: 149, inStock: true, description: 'A great keyboard for developers.' },
  { id: '2', name: 'USB-C Hub', price: 59, inStock: false, description: 'Connects all your devices.' },
  { id: '3', name: 'Monitor Stand', price: 89, inStock: true, description: 'Elevate your monitor ergonomically.' },
];`,
      solution: `// Full solution for all 8 challenges is shown in the challenge descriptions above.
// The most important takeaway is the pattern, not the exact code.

// Core patterns you must know:
// 1. async Server Component + notFound() + generateStaticParams + generateMetadata
// 2. useFormState + useFormStatus for Server Action forms
// 3. URL state with useRouter().push() for filters/search
// 4. export const revalidate + revalidatePath/Tag for ISR
// 5. useOptimistic + startTransition for instant UI
// 6. requireAuth() in Server Actions (never trust client-provided identity)
// 7. Cursor pagination for stable infinite scroll`,
      hints: [
        'Challenge 1 is the baseline — get it working before moving to harder ones',
        'Challenge 3 (Server Action form) is the most commonly tested in interviews',
        'Challenge 6 (useOptimistic) is the most advanced — attempt it last if struggling',
        'Read the error messages carefully — Next.js errors usually tell you exactly what went wrong',
      ],
    },
  ],

  keyTakeaways: [
    'The best way to learn Next.js is by building — challenges reveal gaps that reading cannot.',
    'Common interview coding tasks: Server Component with data fetching, protected Server Action, ISR revalidation.',
    'Debugging skills matter: know that Prisma cannot run in Edge Runtime, hooks cannot run in Server Components.',
    'Cursor pagination is more robust than offset pagination — items added between pages do not cause duplicates.',
    'useOptimistic + startTransition: update UI instantly, server runs in background, reverts on failure.',
    'URL state for search/filters: shareable, bookmarkable, works with browser back button.',
    'generateStaticParams + notFound() + generateMetadata is the standard pattern for dynamic routes.',
    'Every Server Action: auth check → authorization check → validation → execute → revalidate.',
  ],
};
