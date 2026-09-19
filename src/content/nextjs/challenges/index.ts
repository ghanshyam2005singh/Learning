import type { Challenge } from '@/types';

export const challenges: Challenge[] = [
  // ─── SERVER COMPONENTS ───────────────────────────────────────────────────────
  {
    id: 'nextjs-server-component-fetch',
    slug: 'nextjs-server-component-fetch',
    title: 'Server Component Data Fetch',
    description: 'Write a Server Component that fetches a list of users from a mock API and renders them as a list. Handle the loading state with Suspense and the error state with error.tsx.',
    difficulty: 'beginner',
    topic: 'Server Components',
    starterCode: `// app/users/page.tsx
// TODO: Make this a Server Component that:
// 1. Fetches users from https://jsonplaceholder.typicode.com/users
// 2. Renders each user's name and email
// 3. The parent wraps it in <Suspense fallback={...}>

export default function UsersPage() {
  return <div>TODO</div>;
}`,
    solution: `// app/users/page.tsx
// No "use client" needed — Server Component by default

type User = {
  id: number;
  name: string;
  email: string;
  company: { name: string };
};

async function getUsers(): Promise<User[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/users', {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Users ({users.length})</h1>
      <ul className="space-y-3">
        {users.map(user => (
          <li key={user.id} className="p-4 border rounded-lg">
            <p className="font-semibold">{user.name}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <p className="text-gray-400 text-xs mt-1">{user.company.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// app/users/loading.tsx — Shown while UsersPage fetches
export default function UsersLoading() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="h-8 bg-gray-200 rounded w-32 mb-6 animate-pulse" />
      <div className="space-y-3">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="p-4 border rounded-lg animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}`,
    hints: [
      'Server Components can be async functions — just add async before function',
      'fetch() in Server Components uses Next.js extended caching — add next: { revalidate: 3600 }',
      'No useState/useEffect needed — await the data directly in the component',
      'loading.tsx in the same directory shows automatically while the page fetches',
    ],
    explanation: 'Server Components are async by default in Next.js App Router. You can directly await fetch() or database queries at the top level of the component — no useEffect needed. The next: { revalidate } option caches the response and revalidates it in the background.',
    tags: ['server-components', 'data-fetching', 'caching', 'suspense'],
  },

  // ─── SERVER ACTIONS ──────────────────────────────────────────────────────────
  {
    id: 'nextjs-server-action-form',
    slug: 'nextjs-server-action-form',
    title: 'Server Action Contact Form',
    description: 'Build a contact form that uses a Server Action for submission, validates input with Zod, shows field-level errors, and displays a success message.',
    difficulty: 'intermediate',
    topic: 'Server Actions',
    starterCode: `// TODO: Build a contact form with Server Action
// Fields: name (required), email (valid email), message (min 20 chars)
// On submit: validate, if errors show per-field, if success show thank you

// Hint: use useFormState from react-dom

// lib/actions/contact.ts
"use server";
// TODO: Implement contact action

// components/ContactForm.tsx
"use client";
// TODO: Implement form component`,
    solution: `// lib/actions/contact.ts
"use server";
import { z } from 'zod';

const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

export type ContactState = {
  errors?: { name?: string[]; email?: string[]; message?: string[] };
  success?: boolean;
};

export async function submitContact(
  prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const result = ContactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  // In real app: send email, save to DB, etc.
  console.log('Contact submission:', result.data);

  return { success: true };
}

// components/ContactForm.tsx
"use client";
import { useFormState, useFormStatus } from 'react-dom';
import { submitContact, type ContactState } from '@/lib/actions/contact';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2 bg-blue-600 text-white rounded disabled:opacity-50"
    >
      {pending ? 'Sending...' : 'Send Message'}
    </button>
  );
}

export function ContactForm() {
  const [state, action] = useFormState<ContactState, FormData>(submitContact, {});

  if (state.success) {
    return (
      <div className="text-center py-8 text-green-600">
        <p className="text-2xl mb-2">✓</p>
        <p className="font-semibold">Message sent!</p>
        <p className="text-sm text-gray-500 mt-1">We will get back to you soon.</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input name="name" className="w-full border rounded px-3 py-2" />
        {state.errors?.name && <p className="text-red-500 text-sm mt-1">{state.errors.name[0]}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input name="email" type="email" className="w-full border rounded px-3 py-2" />
        {state.errors?.email && <p className="text-red-500 text-sm mt-1">{state.errors.email[0]}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Message</label>
        <textarea name="message" rows={4} className="w-full border rounded px-3 py-2" />
        {state.errors?.message && <p className="text-red-500 text-sm mt-1">{state.errors.message[0]}</p>}
      </div>
      <SubmitButton />
    </form>
  );
}`,
    hints: [
      'useFormState returns [state, formAction] — state holds errors or success',
      'useFormStatus must be in a child component of the form to work',
      'Zod safeParse returns { success, data } or { success: false, error }',
      'error.flatten().fieldErrors gives you per-field error arrays',
    ],
    explanation: 'Server Actions with useFormState enable progressive enhancement — the form works without JavaScript. useFormStatus gives the pending state for the submit button. Zod validation provides type-safe field-level errors.',
    tags: ['server-actions', 'forms', 'validation', 'zod'],
  },

  // ─── ROUTING ─────────────────────────────────────────────────────────────────
  {
    id: 'nextjs-dynamic-route-404',
    slug: 'nextjs-dynamic-route-404',
    title: 'Dynamic Route with 404 Handling',
    description: 'Create a product detail page at /products/[id] that fetches a product by ID from a mock array, returns 404 for unknown IDs, and pre-renders all products at build time.',
    difficulty: 'beginner',
    topic: 'Routing',
    starterCode: `// Mock products data
const products = [
  { id: '1', name: 'MacBook Pro', price: 1999, category: 'Laptops' },
  { id: '2', name: 'iPhone 15', price: 999, category: 'Phones' },
  { id: '3', name: 'AirPods Pro', price: 249, category: 'Audio' },
];

// TODO: Build app/products/[id]/page.tsx that:
// 1. Renders the product for a valid ID
// 2. Returns 404 for an invalid ID
// 3. Has generateStaticParams to pre-render all product pages
// 4. Has generateMetadata to set the title to the product name`,
    solution: `// app/products/[id]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const products = [
  { id: '1', name: 'MacBook Pro', price: 1999, category: 'Laptops' },
  { id: '2', name: 'iPhone 15', price: 999, category: 'Phones' },
  { id: '3', name: 'AirPods Pro', price: 249, category: 'Audio' },
];

function getProduct(id: string) {
  return products.find(p => p.id === id) ?? null;
}

// Pre-render all product pages at build time
export function generateStaticParams() {
  return products.map(p => ({ id: p.id }));
}

// Dynamic metadata per product
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = getProduct(params.id);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.name,
    description: \`\${product.name} — \$\{product.category} for \$\{product.price}\`,
  };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id);

  // Triggers not-found.tsx (or the global not-found page)
  if (!product) notFound();

  return (
    <div className="max-w-xl mx-auto p-6">
      <p className="text-sm text-gray-500 mb-1">{product.category}</p>
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-2xl font-semibold mt-2 text-blue-600">\${product.price}</p>
    </div>
  );
}

// app/products/not-found.tsx (optional scoped 404)
export default function ProductNotFound() {
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-semibold">Product not found</h2>
      <a href="/products" className="text-blue-600 mt-4 inline-block">Browse all products →</a>
    </div>
  );
}`,
    hints: [
      'notFound() from next/navigation triggers the nearest not-found.tsx',
      'generateStaticParams returns an array of { id: string } objects',
      'generateMetadata is async and receives the same params as the page',
      'This page is synchronous (no async needed) since data is in memory',
    ],
    explanation: 'Dynamic routes with generateStaticParams are pre-rendered as static HTML at build time. notFound() returns a 404 response and renders the nearest not-found.tsx. generateMetadata provides per-product SEO metadata.',
    tags: ['routing', 'dynamic-routes', 'not-found', 'ssg', 'metadata'],
  },

  // ─── CACHING ─────────────────────────────────────────────────────────────────
  {
    id: 'nextjs-isr-revalidation',
    slug: 'nextjs-isr-revalidation',
    title: 'ISR with On-Demand Revalidation',
    description: 'Build a blog listing page with ISR (1-hour revalidation) and a webhook endpoint that revalidates the blog page on demand when called with a secret token.',
    difficulty: 'intermediate',
    topic: 'Caching & ISR',
    starterCode: `// app/blog/page.tsx
// TODO: Add ISR with 1-hour revalidation
// Fetch posts from: https://jsonplaceholder.typicode.com/posts?_limit=10

// app/api/revalidate/route.ts
// TODO: POST endpoint that:
// 1. Verifies Authorization: Bearer <secret> header
// 2. Calls revalidatePath('/blog')
// 3. Returns { revalidated: true }`,
    solution: `// app/blog/page.tsx
type Post = { id: number; title: string; body: string };

// ISR: revalidate every 3600 seconds (1 hour)
// After 1 hour, the next request triggers background regeneration
export const revalidate = 3600;

async function getPosts(): Promise<Post[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Blog</h1>
      <div className="space-y-4">
        {posts.map(post => (
          <article key={post.id} className="p-4 border rounded">
            <h2 className="font-semibold capitalize">{post.title}</h2>
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">{post.body}</p>
          </article>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4">
        Page generated at: {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}

// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const auth = request.headers.get('authorization');
  const secret = process.env.REVALIDATION_SECRET ?? 'dev-secret';

  if (auth !== \`Bearer \${secret}\`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const path = typeof body.path === 'string' ? body.path : '/blog';

  revalidatePath(path);
  return NextResponse.json({ revalidated: true, path, timestamp: Date.now() });
}

// Test the webhook:
// curl -X POST http://localhost:3000/api/revalidate \\
//   -H "Authorization: Bearer dev-secret" \\
//   -H "Content-Type: application/json" \\
//   -d '{"path": "/blog"}'`,
    hints: [
      'export const revalidate = 3600 at the top of the page file sets ISR TTL',
      'revalidatePath() purges the cache for that path immediately',
      'The Authorization header format is: "Bearer <token>"',
      'Add REVALIDATION_SECRET to .env.local for the webhook secret',
    ],
    explanation: 'ISR (Incremental Static Regeneration) pre-renders pages at build time and regenerates them in the background after the revalidate TTL. On-demand revalidation via revalidatePath() allows instant cache busting when content changes — useful for CMS webhooks.',
    tags: ['caching', 'isr', 'revalidation', 'webhooks'],
  },

  // ─── RENDERING ───────────────────────────────────────────────────────────────
  {
    id: 'nextjs-streaming-suspense',
    slug: 'nextjs-streaming-suspense',
    title: 'Streaming with Suspense',
    description: 'Build a dashboard page with three independent sections that each fetch data. The fast sections should stream to the browser immediately without waiting for the slow sections.',
    difficulty: 'intermediate',
    topic: 'Rendering & Streaming',
    starterCode: `// Simulate different data fetching speeds
async function fetchFast() {
  await new Promise(r => setTimeout(r, 200));
  return { metric: 'Page Views', value: '12,483' };
}

async function fetchMedium() {
  await new Promise(r => setTimeout(r, 800));
  return { metric: 'Conversion Rate', value: '3.2%' };
}

async function fetchSlow() {
  await new Promise(r => setTimeout(r, 2000));
  return { metric: 'Revenue', value: '$48,290' };
}

// TODO: Build a dashboard page where:
// 1. Each metric is in its own async component
// 2. Each is wrapped in Suspense with a skeleton fallback
// 3. Fast metric appears at 200ms, medium at 800ms, slow at 2000ms
// 4. The user sees content progressively, not all at once`,
    solution: `// app/dashboard/page.tsx
import { Suspense } from 'react';

async function fetchFast() {
  await new Promise(r => setTimeout(r, 200));
  return { metric: 'Page Views', value: '12,483' };
}

async function fetchMedium() {
  await new Promise(r => setTimeout(r, 800));
  return { metric: 'Conversion Rate', value: '3.2%' };
}

async function fetchSlow() {
  await new Promise(r => setTimeout(r, 2000));
  return { metric: 'Revenue', value: '$48,290' };
}

function MetricSkeleton() {
  return (
    <div className="p-6 border rounded-xl animate-pulse">
      <div className="h-3 bg-gray-200 rounded w-24 mb-3" />
      <div className="h-8 bg-gray-200 rounded w-32" />
    </div>
  );
}

async function FastMetric() {
  const data = await fetchFast();
  return <MetricCard {...data} />;
}

async function MediumMetric() {
  const data = await fetchMedium();
  return <MetricCard {...data} />;
}

async function SlowMetric() {
  const data = await fetchSlow();
  return <MetricCard {...data} />;
}

function MetricCard({ metric, value }: { metric: string; value: string }) {
  return (
    <div className="p-6 border rounded-xl">
      <p className="text-sm text-gray-500">{metric}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

// The page itself renders instantly — the sections stream in progressively
export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        {/* Renders at ~200ms */}
        <Suspense fallback={<MetricSkeleton />}>
          <FastMetric />
        </Suspense>

        {/* Renders at ~800ms */}
        <Suspense fallback={<MetricSkeleton />}>
          <MediumMetric />
        </Suspense>

        {/* Renders at ~2000ms */}
        <Suspense fallback={<MetricSkeleton />}>
          <SlowMetric />
        </Suspense>
      </div>
    </div>
  );
}`,
    hints: [
      'Each Suspense boundary streams independently — fast ones do not wait for slow ones',
      'The page component itself is synchronous — only the child components are async',
      'Each async component fetches its own data — no prop drilling needed',
      'The fallback appears instantly, replaced when the component resolves',
    ],
    explanation: 'Streaming with Suspense sends the HTML for fast sections immediately while slow sections stream in later. Each Suspense boundary is independent — a 2-second slow component does not delay a 200ms fast component. Users see progressive content instead of waiting for everything.',
    tags: ['streaming', 'suspense', 'rendering', 'performance'],
  },

  // ─── AUTH ─────────────────────────────────────────────────────────────────────
  {
    id: 'nextjs-protected-action',
    slug: 'nextjs-protected-action',
    title: 'Protected Server Action',
    description: 'Write a Server Action that updates a user\'s profile. It must check authentication, validate inputs with Zod, verify the user can only update their own profile, then save to the database.',
    difficulty: 'advanced',
    topic: 'Authentication & Security',
    starterCode: `// lib/actions/profile.ts
"use server";

// TODO: Implement updateProfile action that:
// 1. Calls requireAuth() — throws/redirects if not logged in
// 2. Validates: name (2-50 chars), bio (max 300), website (valid URL or empty)
// 3. Verifies the formData's userId matches session.userId (no IDOR)
// 4. Updates the user in the database
// 5. Revalidates /profile

// Mock implementations for the challenge:
async function requireAuth() {
  return { userId: 'user-123', email: 'alice@example.com' };
}

async function updateUserInDb(userId: string, data: object) {
  console.log('Updating user', userId, data);
}`,
    solution: `// lib/actions/profile.ts
"use server";

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const ProfileSchema = z.object({
  name: z.string().min(2, 'Name too short').max(50, 'Name too long').trim(),
  bio: z.string().max(300, 'Bio too long').optional().default(''),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
});

async function requireAuth() {
  // In real app: read httpOnly cookie → verify JWT → return payload
  return { userId: 'user-123', email: 'alice@example.com' };
}

async function updateUserInDb(userId: string, data: object) {
  console.log('Updating user', userId, data);
}

export type ProfileState = {
  errors?: { name?: string[]; bio?: string[]; website?: string[]; _form?: string[] };
  success?: boolean;
};

export async function updateProfile(
  prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  // ── 1. Authentication ─────────────────────────────────────────
  const session = await requireAuth();
  // If requireAuth throws/redirects, execution stops here

  // ── 2. Authorization ──────────────────────────────────────────
  // Prevent IDOR: user can only update their own profile
  const targetUserId = formData.get('userId') as string;
  if (targetUserId && targetUserId !== session.userId) {
    return { errors: { _form: ['You can only update your own profile'] } };
  }

  // ── 3. Validation ─────────────────────────────────────────────
  const result = ProfileSchema.safeParse({
    name: formData.get('name'),
    bio: formData.get('bio'),
    website: formData.get('website'),
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  // ── 4. Execute ────────────────────────────────────────────────
  try {
    await updateUserInDb(session.userId, result.data);
    revalidatePath('/profile');
    return { success: true };
  } catch {
    return { errors: { _form: ['Failed to update profile. Please try again.'] } };
  }
}`,
    hints: [
      'Auth → AuthZ → Validate → Execute — always in this order',
      'Never trust userId from formData — always get it from the session',
      'safeParse returns { success, data } or { success: false, error } — no throwing',
      'Wrap the DB call in try/catch and return a safe error message',
    ],
    explanation: 'The auth → authz → validate → execute pattern is the core of every secure Server Action. Getting userId from the session (not form data) prevents IDOR (Insecure Direct Object Reference) attacks where a malicious user sends another user\'s ID.',
    tags: ['server-actions', 'authentication', 'security', 'zod', 'idor'],
  },

  // ─── PERFORMANCE ─────────────────────────────────────────────────────────────
  {
    id: 'nextjs-cache-deduplication',
    slug: 'nextjs-cache-deduplication',
    title: 'Cache Deduplication with React cache()',
    description: 'A dashboard page has three components that all need the current user\'s data. Ensure the database query runs exactly once per request despite being called in three separate components.',
    difficulty: 'intermediate',
    topic: 'Performance & Caching',
    starterCode: `// Problem: Each component calls getUser() — 3 DB queries per render!

async function getUser(id: string) {
  console.log('DB query for user:', id); // Should print ONCE, not three times
  return { id, name: 'Alice', role: 'admin', credits: 42 };
}

// These three components all need the user
async function UserHeader({ userId }: { userId: string }) {
  const user = await getUser(userId); // Query 1
  return <h2>{user.name}</h2>;
}

async function UserRole({ userId }: { userId: string }) {
  const user = await getUser(userId); // Query 2 — DUPLICATE!
  return <span>{user.role}</span>;
}

async function UserCredits({ userId }: { userId: string }) {
  const user = await getUser(userId); // Query 3 — DUPLICATE!
  return <span>{user.credits} credits</span>;
}

// TODO: Use React cache() to ensure getUser runs once per request`,
    solution: `import { cache } from 'react';

// Wrap with cache() — subsequent calls with the same args return cached result
// The cache is per-request (not shared between users or requests)
const getUser = cache(async (id: string) => {
  console.log('DB query for user:', id); // Now prints ONCE per request
  return { id, name: 'Alice', role: 'admin', credits: 42 };
});

// All three components call getUser(userId)
// Only the FIRST call hits the database
// Subsequent calls within the same request get the cached result instantly

async function UserHeader({ userId }: { userId: string }) {
  const user = await getUser(userId); // First call: hits DB, caches result
  return <h2 className="text-xl font-bold">{user.name}</h2>;
}

async function UserRole({ userId }: { userId: string }) {
  const user = await getUser(userId); // Cache hit: no DB query
  return (
    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-sm">
      {user.role}
    </span>
  );
}

async function UserCredits({ userId }: { userId: string }) {
  const user = await getUser(userId); // Cache hit: no DB query
  return <span className="text-gray-600">{user.credits} credits</span>;
}

// Dashboard page — renders all three, but only ONE DB query fires
export default async function Dashboard() {
  const userId = 'user-123';

  return (
    <div>
      <UserHeader userId={userId} />
      <div className="flex items-center gap-4 mt-2">
        <UserRole userId={userId} />
        <UserCredits userId={userId} />
      </div>
    </div>
  );
}

// Note: React cache() is different from Next.js Data Cache:
// - React cache() deduplicates within one request (in-memory, per-request)
// - Next.js fetch() caching persists across requests (on disk/CDN)`,
    hints: [
      'Import cache from "react" (not from Next.js)',
      'cache() deduplicates by function reference AND argument values',
      'The cache is reset per request — no stale data leaking between users',
      'Works with any async function, not just fetch() — great for Prisma queries',
    ],
    explanation: 'React cache() memoizes a function for the duration of one server render. When multiple components call the same cached function with the same arguments, only the first call runs — others get the cached result instantly. This is critical for data access layer functions called by multiple components.',
    tags: ['performance', 'caching', 'react-cache', 'server-components'],
  },

  // ─── URL STATE ────────────────────────────────────────────────────────────────
  {
    id: 'nextjs-url-state-filters',
    slug: 'nextjs-url-state-filters',
    title: 'URL-Driven Filter State',
    description: 'Build a product listing where category and sort filters live in the URL (?category=electronics&sort=price). The page is a Server Component that reads searchParams. The filters are a Client Component that updates the URL.',
    difficulty: 'intermediate',
    topic: 'State Management',
    starterCode: `// Mock products
const products = [
  { id: '1', name: 'iPhone 15', price: 999, category: 'phones' },
  { id: '2', name: 'MacBook Pro', price: 1999, category: 'laptops' },
  { id: '3', name: 'AirPods', price: 249, category: 'audio' },
  { id: '4', name: 'iPad Pro', price: 799, category: 'tablets' },
  { id: '5', name: 'Galaxy S24', price: 899, category: 'phones' },
];

// TODO: Build:
// 1. app/shop/page.tsx — Server Component, reads searchParams, filters products
// 2. components/ShopFilters.tsx — Client Component, updates URL on change`,
    solution: `// app/shop/page.tsx — Server Component
import { ShopFilters } from '@/components/ShopFilters';

const products = [
  { id: '1', name: 'iPhone 15', price: 999, category: 'phones' },
  { id: '2', name: 'MacBook Pro', price: 1999, category: 'laptops' },
  { id: '3', name: 'AirPods', price: 249, category: 'audio' },
  { id: '4', name: 'iPad Pro', price: 799, category: 'tablets' },
  { id: '5', name: 'Galaxy S24', price: 899, category: 'phones' },
];

export default function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string };
}) {
  const category = searchParams.category ?? 'all';
  const sort = searchParams.sort ?? 'default';

  let filtered = category === 'all'
    ? products
    : products.filter(p => p.category === category);

  if (sort === 'price_asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === 'price_desc') filtered = [...filtered].sort((a, b) => b.price - a.price);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Shop</h1>
      <ShopFilters category={category} sort={sort} />
      <div className="grid grid-cols-2 gap-4 mt-6">
        {filtered.map(p => (
          <div key={p.id} className="p-4 border rounded-xl">
            <p className="font-semibold">{p.name}</p>
            <p className="text-blue-600">\$\{p.price}</p>
            <p className="text-xs text-gray-400 mt-1">{p.category}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-2 text-center text-gray-500 py-8">No products found.</p>
        )}
      </div>
    </div>
  );
}

// components/ShopFilters.tsx — Client Component
"use client";
import { useRouter, useSearchParams } from 'next/navigation';

export function ShopFilters({ category, sort }: { category: string; sort: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || value === 'default') params.delete(key);
    else params.set(key, value);
    router.push(\`?\${params.toString()}\`);
  }

  return (
    <div className="flex gap-3">
      <select
        value={category}
        onChange={e => update('category', e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      >
        <option value="all">All Categories</option>
        <option value="phones">Phones</option>
        <option value="laptops">Laptops</option>
        <option value="audio">Audio</option>
        <option value="tablets">Tablets</option>
      </select>
      <select
        value={sort}
        onChange={e => update('sort', e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      >
        <option value="default">Default Sort</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  );
}`,
    hints: [
      'Server Component reads searchParams (makes the page dynamic — no revalidate needed)',
      'Client Component uses useRouter().push("?" + params) to update URL without reload',
      'new URLSearchParams(searchParams.toString()) preserves existing params',
      'Delete params when value is "all" or "default" to keep URLs clean',
    ],
    explanation: 'URL state is shareable and bookmarkable — users can share filtered views. The Server Component reads searchParams to filter data on the server (no client fetching). The Client Component only manages the URL — all data logic stays server-side.',
    tags: ['state-management', 'url-state', 'routing', 'server-components'],
  },

  // ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
  {
    id: 'nextjs-middleware-auth-guard',
    slug: 'nextjs-middleware-auth-guard',
    title: 'Middleware Auth Guard',
    description: 'Write middleware that protects all /dashboard/* routes by verifying a JWT from a cookie. Redirect to /login if the token is missing or invalid. Allow all other routes through.',
    difficulty: 'advanced',
    topic: 'Middleware',
    starterCode: `// middleware.ts
// TODO: Protect /dashboard/* routes
// - Read 'session' cookie
// - If missing → redirect to /login
// - Verify JWT with jose (Edge-compatible) using JWT_SECRET env var
// - If invalid/expired → redirect to /login
// - Otherwise → allow request through

// IMPORTANT: Cannot use jsonwebtoken — Edge Runtime only supports Web APIs
// Use: import { jwtVerify } from 'jose'

import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // TODO: implement
}

export const config = {
  matcher: [], // TODO: only match /dashboard paths
};`,
    solution: `// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PROTECTED_PREFIX = '/dashboard';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect dashboard routes (matcher handles this, but good to be explicit)
  if (!pathname.startsWith(PROTECTED_PREFIX)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('session')?.value;

  // No token → redirect to login with return URL
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify JWT
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET ?? 'fallback-dev-secret-32-chars-min'
    );
    await jwtVerify(token, secret);
    return NextResponse.next(); // Valid token — allow through
  } catch {
    // Token invalid or expired
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    loginUrl.searchParams.set('reason', 'session_expired');
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    // Exclude: api routes, static files, Next.js internals
  ],
};

// Note: Middleware runs on Edge Runtime:
// ✅ jose (jwtVerify) — uses Web Crypto API, works on Edge
// ❌ jsonwebtoken — uses Node.js crypto module, NOT Edge-compatible
// ❌ Prisma — uses native bindings, NOT Edge-compatible`,
    hints: [
      'Use jose not jsonwebtoken — Edge Runtime has no Node.js crypto module',
      'TextEncoder().encode(secret) converts string to Uint8Array for jose',
      'Preserve the return URL in searchParams so login can redirect back',
      'The matcher prevents middleware from running on _next/static, _next/image etc.',
    ],
    explanation: 'Middleware runs on the Edge Runtime (V8 isolates, no Node.js APIs) which means certain libraries do not work. jose uses the Web Crypto API and works everywhere. Middleware is ideal for auth checks because it runs before any server work — a cheaper way to block unauthorized requests.',
    tags: ['middleware', 'authentication', 'jwt', 'edge-runtime', 'jose'],
  },
];
