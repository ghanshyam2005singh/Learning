import type { Lesson } from '@/types';

export const dataFetchingLesson: Lesson = {
  id: 'nextjs-data-fetching',
  slug: 'nextjs-data-fetching',
  title: 'Data Fetching',
  description:
    'Master data fetching in Next.js: server fetching, async components, parallel vs sequential fetching, Suspense streaming, caching, revalidation, and the React cache() function.',
  category: 'Data Fetching',
  order: 8,
  difficulty: 'intermediate',
  estimatedTime: 55,
  prevLesson: 'nextjs-rendering-strategies',
  nextLesson: 'nextjs-server-actions',

  content: `# Data Fetching in Next.js

## The Old Way vs The New Way

In a React SPA, data fetching always followed the same pattern:

\`\`\`tsx
// Old React SPA pattern — every data fetch looked like this
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(r => r.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <Spinner />;
  return <div>{user.name}</div>;
}
\`\`\`

Next.js with Server Components eliminates this pattern entirely for most cases:

\`\`\`tsx
// Next.js Server Component — async/await directly
async function UserProfile({ userId }: { userId: string }) {
  // No useState. No useEffect. No loading state here.
  // Just: await the data, render the component.
  const user = await db.user.findUnique({ where: { id: userId } });
  return <div>{user.name}</div>;
}
// Loading is handled by the parent's Suspense boundary — not here.
\`\`\`

---

## Server-Side Data Fetching

### Direct Database Access

\`\`\`tsx
// app/dashboard/page.tsx
import { db } from '@/lib/db';

export default async function DashboardPage() {
  // Query database directly — no API endpoint needed
  const [user, orders, notifications] = await Promise.all([
    db.user.findUnique({ where: { id: 'current-user-id' } }),
    db.order.findMany({ where: { userId: 'current-user-id' }, take: 10 }),
    db.notification.findMany({ where: { userId: 'current-user-id', read: false } }),
  ]);

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <OrderList orders={orders} />
      <NotificationBell count={notifications.length} />
    </div>
  );
}
\`\`\`

### Fetch with Next.js Cache Extensions

Next.js extends the native \`fetch\` API with caching options:

\`\`\`tsx
// Different caching behaviors

// 1. Cache forever (SSG equivalent)
const data = await fetch('https://api.example.com/config', {
  cache: 'force-cache',
});

// 2. Never cache (SSR equivalent, always fresh)
const data = await fetch('https://api.example.com/live-prices', {
  cache: 'no-store',
});

// 3. Revalidate on a schedule (ISR equivalent)
const data = await fetch('https://api.example.com/products', {
  next: { revalidate: 3600 }, // revalidate every hour
});

// 4. Cache with tags (for on-demand invalidation)
const data = await fetch(\`https://api.example.com/products/\${id}\`, {
  next: { tags: [\`product-\${id}\`] },
});
\`\`\`

---

## Parallel Data Fetching

The most important performance optimization in data fetching.

### Sequential (waterfall) — Slow ❌

\`\`\`tsx
// DON'T DO THIS — each query waits for the previous one
async function SlowPage() {
  const user = await getUser();                    // 100ms
  const posts = await getPosts(user.id);           // waits for user → 200ms
  const comments = await getComments(user.id);     // waits for posts → 150ms
  // Total time: 100 + 200 + 150 = 450ms
  return <div>...</div>;
}
\`\`\`

### Parallel — Fast ✅

\`\`\`tsx
// DO THIS — all queries start simultaneously
async function FastPage() {
  // Promise.all starts ALL fetches at the same time
  const [user, posts, comments] = await Promise.all([
    getUser(),          // starts at 0ms
    getPosts(),         // starts at 0ms
    getComments(),      // starts at 0ms
  ]);
  // Total time: max(100ms, 200ms, 150ms) = 200ms (not 450ms!)
  return <div>...</div>;
}
\`\`\`

### When Sequential IS Correct

Sometimes you need one result before you can make the next request:

\`\`\`tsx
async function ConditionalPage({ userId }: { userId: string }) {
  // Must get user first to know their role
  const user = await getUser(userId);

  // Then fetch role-specific data
  const dashboardData = user.role === 'admin'
    ? await getAdminDashboard()
    : await getUserDashboard(user.id);

  return <Dashboard data={dashboardData} user={user} />;
}
\`\`\`

---

## Streaming with Suspense

Suspense allows sections of a page to stream independently. Each Suspense boundary is a separate stream chunk.

\`\`\`tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';

// These components each do their own async data fetching
async function RevenueCard() {
  const revenue = await getMonthlyRevenue(); // 300ms
  return <MetricCard title="Revenue" value={revenue} />;
}

async function UsersCard() {
  const users = await getActiveUsers(); // 150ms
  return <MetricCard title="Users" value={users} />;
}

async function RecentOrders() {
  const orders = await getRecentOrders(); // 500ms
  return <OrderTable orders={orders} />;
}

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* These three load in PARALLEL — each streams when ready */}
      <div className="grid grid-cols-3 gap-4">
        <Suspense fallback={<MetricSkeleton />}>
          <RevenueCard />       {/* Streams at 300ms */}
        </Suspense>

        <Suspense fallback={<MetricSkeleton />}>
          <UsersCard />         {/* Streams at 150ms */}
        </Suspense>

        <Suspense fallback={<MetricSkeleton />}>
          {/* Expensive — but doesn't block other sections */}
          <RecentOrders />      {/* Streams at 500ms */}
        </Suspense>
      </div>
    </div>
  );
}

// Timeline (all parallel):
// T=0ms:   Page HTML streams, skeletons shown
// T=150ms: UsersCard HTML streams in, replaces skeleton
// T=300ms: RevenueCard HTML streams in, replaces skeleton
// T=500ms: RecentOrders HTML streams in, replaces skeleton
//
// Without Suspense (one Suspense for all):
// T=0ms:  Skeleton shown
// T=500ms: All content shown at once (waits for slowest)
\`\`\`

---

## The React cache() Function

\`cache()\` deduplicates requests within a single render cycle. If multiple Server Components call the same function with the same args, the actual database query only runs once.

\`\`\`tsx
// lib/queries.ts
import { cache } from 'react';
import { db } from './db';

// Wrap your database calls with cache()
// Same userId + same request → one DB query, result shared
export const getUser = cache(async (userId: string) => {
  console.log('Fetching user:', userId); // Only logs once per request
  return db.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });
});

// Now multiple components can call getUser(userId) without duplicate DB queries:

// app/page.tsx
async function Header() {
  const user = await getUser('user-123'); // DB query runs
  return <nav>Hello, {user.name}</nav>;
}

async function ProfileWidget() {
  const user = await getUser('user-123'); // Returns CACHED result, no DB query
  return <div>{user.profile.bio}</div>;
}

async function CartCount() {
  const user = await getUser('user-123'); // Returns CACHED result, no DB query
  return <span>{user.cartCount} items</span>;
}

// Three components, three calls, ONE database query.
// cache() deduplicates within the same request lifecycle.
\`\`\`

**Important:** \`cache()\` only deduplicates within a single request. Between requests, the database query runs again.

---

## Client-Side Data Fetching

For data that must be client-side (user interactions, real-time, browser-only):

### Simple client fetch

\`\`\`tsx
"use client";

import { useState, useEffect } from 'react';

export function LivePrice({ symbol }: { symbol: string }) {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    function fetchPrice() {
      fetch(\`/api/prices/\${symbol}\`)
        .then(r => r.json())
        .then(d => setPrice(d.price));
    }

    fetchPrice();
    const interval = setInterval(fetchPrice, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [symbol]);

  if (price === null) return <span>Loading...</span>;
  return <span>\${price.toFixed(2)}</span>;
}
\`\`\`

### SWR (stale-while-revalidate client library)

\`\`\`tsx
"use client";

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function UserStats({ userId }: { userId: string }) {
  const { data, error, isLoading } = useSWR(
    \`/api/users/\${userId}/stats\`,
    fetcher,
    {
      refreshInterval: 30000,     // Refresh every 30 seconds
      revalidateOnFocus: true,    // Refresh when window gets focus
      dedupingInterval: 5000,     // Dedupe requests within 5 seconds
    }
  );

  if (isLoading) return <StatsSkeleton />;
  if (error) return <p>Failed to load stats</p>;

  return <StatsGrid stats={data} />;
}
\`\`\`

### TanStack Query

\`\`\`tsx
"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function ProductManager() {
  const queryClient = useQueryClient();

  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetch('/api/products').then(r => r.json()),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  // Update product mutation
  const updateProduct = useMutation({
    mutationFn: (product) =>
      fetch(\`/api/products/\${product.id}\`, {
        method: 'PUT',
        body: JSON.stringify(product),
      }).then(r => r.json()),
    // After mutation, invalidate and refetch products list
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  return (
    <div>
      {products?.map(product => (
        <ProductRow
          key={product.id}
          product={product}
          onUpdate={updateProduct.mutate}
        />
      ))}
    </div>
  );
}
\`\`\`

---

## When to Use What

| Scenario | Solution |
|---|---|
| Page data (public, server-rendered) | Server Component + async/await |
| User-specific page data | Server Component + async/await + cookies() |
| Data shared across multiple Server Components | cache() wrapper |
| Real-time data updates | Client Component + useSWR or polling |
| Complex client-side mutations with cache management | TanStack Query |
| Form submissions and mutations | Server Actions (Module 9) |
| External API data with ISR | fetch with next: { revalidate } |

---

## Error Handling in Data Fetching

\`\`\`tsx
// Pattern 1: Try-catch in Server Component
export default async function ProductPage({ params }) {
  try {
    const product = await db.product.findUniqueOrThrow({
      where: { id: params.id },
    });
    return <ProductDetail product={product} />;
  } catch (error) {
    // If error.tsx exists, this propagates to it automatically
    throw new Error('Failed to load product');
  }
}

// Pattern 2: notFound() for missing resources
export default async function ProductPage({ params }) {
  const product = await db.product.findUnique({ where: { id: params.id } });

  if (!product) notFound(); // Renders not-found.tsx

  return <ProductDetail product={product} />;
}

// Pattern 3: Graceful degradation — show partial content on error
export default async function DashboardPage() {
  const [user, orders] = await Promise.allSettled([
    getUser(),
    getRecentOrders(),
  ]);

  return (
    <div>
      {user.status === 'fulfilled'
        ? <UserHeader user={user.value} />
        : <p>Could not load user info</p>
      }
      {orders.status === 'fulfilled'
        ? <OrderList orders={orders.value} />
        : <p>Could not load orders</p>
      }
    </div>
  );
}
\`\`\``,

  codeExamples: [
    {
      title: 'Production data layer with cache() and error handling',
      code: `// lib/queries.ts — Centralized data access layer
import { cache } from 'react';
import { cookies } from 'next/headers';
import { db } from './db';

// ── Auth helpers ──────────────────────────────────────────────
export const getCurrentUserId = cache(async (): Promise<string | null> => {
  const sessionId = cookies().get('session')?.value;
  if (!sessionId) return null;

  const session = await db.session.findUnique({
    where: { id: sessionId },
    select: { userId: true, expiresAt: true },
  });

  if (!session || session.expiresAt < new Date()) return null;
  return session.userId;
});

export const requireAuth = cache(async () => {
  const userId = await getCurrentUserId();
  if (!userId) {
    const { redirect } = await import('next/navigation');
    redirect('/login');
  }
  return userId;
});

// ── User queries ──────────────────────────────────────────────
export const getUser = cache(async (userId: string) => {
  return db.user.findUnique({
    where: { id: userId },
    include: { profile: true, subscription: true },
  });
});

// ── Project queries ───────────────────────────────────────────
export const getUserProjects = cache(async (userId: string) => {
  return db.project.findMany({
    where: { OR: [{ ownerId: userId }, { members: { some: { userId } } }] },
    include: { _count: { select: { tasks: true, members: true } } },
    orderBy: { updatedAt: 'desc' },
  });
});

// ── Usage in components ───────────────────────────────────────
// Each component calls these functions independently.
// cache() ensures DB is only hit once per function per request.

// app/(app)/dashboard/page.tsx
export default async function DashboardPage() {
  const userId = await requireAuth(); // Redirects if not authed

  // These can safely be called in parallel:
  // cache() means if userId was already fetched above, it returns the cached result
  const [user, projects] = await Promise.all([
    getUser(userId),
    getUserProjects(userId),
  ]);

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsGrid projects={projects} />
      </Suspense>
    </div>
  );
}`,
      explanation:
        'A production data layer uses cache() for deduplication, centralizes auth checks, and separates data access from components. Multiple components can call getUser() without hitting the database multiple times.',
    },
    {
      title: 'Streaming a page with independent data sections',
      code: `// A real dashboard that streams each section independently

// app/analytics/page.tsx
import { Suspense } from 'react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      {/* Summary cards — load in parallel */}
      <div className="grid grid-cols-4 gap-4">
        <Suspense fallback={<MetricCardSkeleton />}>
          <PageviewsCard />       {/* Fast: 50ms */}
        </Suspense>
        <Suspense fallback={<MetricCardSkeleton />}>
          <UniqueVisitorsCard />  {/* Medium: 150ms */}
        </Suspense>
        <Suspense fallback={<MetricCardSkeleton />}>
          <BounceRateCard />      {/* Medium: 120ms */}
        </Suspense>
        <Suspense fallback={<MetricCardSkeleton />}>
          <ConversionRateCard /> {/* Slow: 400ms */}
        </Suspense>
      </div>

      {/* Charts section — loads independently */}
      <Suspense fallback={<ChartSkeleton height={300} />}>
        <TrafficChart />        {/* Slow: 600ms query */}
      </Suspense>

      {/* Table — loads independently */}
      <Suspense fallback={<TableSkeleton rows={10} />}>
        <TopPagesTable />       {/* Very slow: 800ms */}
      </Suspense>
    </div>
  );
}

// ── Individual data-fetching components ──────────────────────

async function PageviewsCard() {
  const count = await db.pageview.count({
    where: { createdAt: { gte: startOfDay(new Date()) } },
  });
  return (
    <MetricCard
      title="Pageviews Today"
      value={count.toLocaleString()}
      trend="+12%"
    />
  );
}

async function TrafficChart() {
  const data = await db.$queryRaw\`
    SELECT date_trunc('hour', created_at) as hour,
           COUNT(*) as pageviews
    FROM pageviews
    WHERE created_at > NOW() - INTERVAL '7 days'
    GROUP BY hour
    ORDER BY hour
  \`;

  // Note: A chart component would need "use client" for DOM rendering
  // Pass data from server to client chart component:
  return <LineChart data={data} />;
}

async function TopPagesTable() {
  const pages = await db.pageview.groupBy({
    by: ['path'],
    _count: true,
    orderBy: { _count: { path: 'desc' } },
    take: 20,
  });

  return (
    <table>
      <thead>
        <tr><th>Page</th><th>Views</th></tr>
      </thead>
      <tbody>
        {pages.map(page => (
          <tr key={page.path}>
            <td>{page.path}</td>
            <td>{page._count.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Timeline:
// T=0ms:   Page shell + skeletons shown instantly
// T=50ms:  PageviewsCard streams in
// T=120ms: BounceRateCard streams in
// T=150ms: UniqueVisitorsCard streams in
// T=400ms: ConversionRateCard streams in
// T=600ms: TrafficChart streams in
// T=800ms: TopPagesTable streams in
//
// User sees content progressively — never waits for everything`,
      explanation:
        'Each component is wrapped in its own Suspense boundary, allowing them to stream independently. The user sees content as soon as it is ready, rather than waiting for the slowest query.',
    },
  ],

  commonMistakes: [
    'Using sequential awaits when fetches are independent — use Promise.all() to run them in parallel.',
    'Fetching the same data in multiple Server Components without cache() — leads to N identical database queries per request.',
    'Using useEffect for data fetching in Server Components — Server Components are async, just await directly.',
    'Not wrapping slow sections in Suspense — without Suspense, the entire page waits for the slowest fetch.',
    'Forgetting error handling — unhandled promise rejections in Server Components propagate to error.tsx.',
    'Using fetch() for database queries — fetch is for HTTP requests. For databases, use the ORM (Prisma/Drizzle) directly.',
    'Putting all Promise.all calls in the top-level page component — better to let each component fetch its own data, coordinated via Suspense for parallel loading.',
  ],

  interviewQuestions: [
    {
      question: 'How do you avoid a data fetching waterfall in Next.js?',
      answer:
        'A waterfall occurs when data fetches are sequential: each fetch waits for the previous to complete. The solution is parallel fetching with Promise.all(). If component A needs users and component B needs orders, do not await them sequentially. Instead: const [users, orders] = await Promise.all([getUsers(), getOrders()]). For components that stream independently via Suspense, Next.js automatically parallelizes fetches — each Suspense boundary resolves its component\'s async data independently, so they all fetch in parallel without any waterfall. The key rule: only sequential fetching when you genuinely need one result before making the next request.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is the React cache() function and when should you use it?',
      answer:
        "React's cache() function memoizes the results of an async function within a single server request lifecycle. If two Server Components call getUser(userId) with the same argument, cache() ensures the database query only runs once — the second call returns the cached result. This is critical when multiple components in your tree need the same data: the data is fetched once and shared. Without cache(), calling getUser() in 5 components means 5 database queries. With cache(), it's 1 query. Use it on any data-fetching function that might be called multiple times per request. Note: cache() only deduplicates within one request — it does not persist between requests (that's what fetch's next.revalidate does).",
      difficulty: 'intermediate',
    },
    {
      question: 'How does Suspense improve data fetching performance in Next.js?',
      answer:
        'Without Suspense, a page waits for all async data before sending any HTML. If three sections take 100ms, 500ms, and 1000ms, the user waits 1000ms for a blank screen. With Suspense, each section gets its own loading state. Next.js starts streaming HTML immediately, shows skeleton loaders for pending sections, then streams each section\'s HTML as its data resolves. The 100ms section arrives at 100ms, the 500ms section at 500ms, and the 1000ms section at 1000ms. Users see content progressively. Crucially, sections that do not depend on each other load in parallel — each Suspense boundary is an independent streaming unit.',
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'df-ex-1',
      title: 'Fix a data fetching waterfall',
      description: `The following page has a data fetching waterfall. Each fetch waits for the previous. Fix it to:
1. Fetch all independent data in parallel
2. Wrap slow sections in Suspense for streaming
3. Add a cache() wrapper for the user query (called in multiple places)`,
      starterCode: `// BROKEN: Sequential waterfall — total time = sum of all queries

async function getUser() {
  await sleep(200); // Simulates 200ms DB query
  return { id: '1', name: 'Alice', role: 'admin' };
}
async function getOrders() {
  await sleep(400); // Simulates 400ms DB query
  return [{ id: 'o1', total: 99 }, { id: 'o2', total: 149 }];
}
async function getNotifications() {
  await sleep(300); // Simulates 300ms DB query
  return [{ id: 'n1', message: 'New message' }];
}
async function getStats() {
  await sleep(600); // Simulates 600ms DB query
  return { revenue: 5000, users: 120 };
}

// Current implementation — takes 200+400+300+600 = 1500ms total
export default async function DashboardPage() {
  const user = await getUser();          // 200ms
  const orders = await getOrders();      // waits → 400ms
  const notifications = await getNotifications(); // waits → 300ms
  const stats = await getStats();        // waits → 600ms

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <OrderList orders={orders} />
      <NotificationList notifications={notifications} />
      <StatsPanel stats={stats} />
    </div>
  );
}`,
      solution: `import { Suspense } from 'react';
import { cache } from 'react';

// cache() prevents duplicate queries if getUser is called elsewhere
const getUser = cache(async () => {
  await sleep(200);
  return { id: '1', name: 'Alice', role: 'admin' };
});

async function getOrders() {
  await sleep(400);
  return [{ id: 'o1', total: 99 }, { id: 'o2', total: 149 }];
}
async function getNotifications() {
  await sleep(300);
  return [{ id: 'n1', message: 'New message' }];
}
async function getStats() {
  await sleep(600);
  return { revenue: 5000, users: 120 };
}

// Individual components fetch their own data independently
async function OrderSection() {
  const orders = await getOrders(); // 400ms, runs in parallel
  return <OrderList orders={orders} />;
}

async function NotificationSection() {
  const notifications = await getNotifications(); // 300ms, runs in parallel
  return <NotificationList notifications={notifications} />;
}

async function StatsSection() {
  const stats = await getStats(); // 600ms, runs in parallel
  return <StatsPanel stats={stats} />;
}

// FIXED: user (200ms) + max(400ms, 300ms, 600ms) = 200 + 600 = 800ms total
// (vs 1500ms sequential)
// And user sees content at: 300ms, 400ms, 600ms (not all at 1500ms)
export default async function DashboardPage() {
  const user = await getUser(); // 200ms — needed before rendering page structure

  return (
    <div>
      <h1>Welcome, {user.name}</h1>

      {/* These all start fetching in parallel at the same time */}
      <Suspense fallback={<OrderSkeleton />}>
        <OrderSection />         {/* Streams at 400ms */}
      </Suspense>

      <Suspense fallback={<NotificationSkeleton />}>
        <NotificationSection />  {/* Streams at 300ms */}
      </Suspense>

      <Suspense fallback={<StatsSkeleton />}>
        <StatsSection />         {/* Streams at 600ms */}
      </Suspense>
    </div>
  );
}`,
      hints: [
        'getUser is needed for the page title, but orders/notifications/stats are independent of each other',
        'Wrap independent sections in their own async components + Suspense boundaries',
        'Suspense components that are siblings all start fetching in parallel',
        'cache() on getUser means even if it is called elsewhere in the tree, only one DB query runs',
      ],
    },
  ],

  keyTakeaways: [
    'Server Components eliminate the useEffect + useState data fetching pattern — use async/await directly.',
    'Always fetch independent data in parallel with Promise.all() — sequential awaits create waterfalls.',
    'Wrap slow sections in Suspense boundaries — each section streams independently when ready.',
    "React's cache() function deduplicates DB calls within a request — if 5 components call getUser(), only 1 DB query runs.",
    'Next.js extends fetch() with caching: force-cache (SSG), no-store (SSR), next.revalidate (ISR), next.tags (on-demand).',
    'Client-side data fetching (SWR, TanStack Query) is for real-time data, user interactions, and browser-only cases.',
    'Use Promise.allSettled() when you want partial success — some sections can fail without breaking the whole page.',
    'Put data fetching close to where data is used — each component fetching its own data scales better than one top-level fetch.',
  ],
};
