import type { Lesson } from '@/types';

export const serverComponentsLesson: Lesson = {
  id: 'nextjs-server-components',
  slug: 'nextjs-server-components',
  title: 'Server Components',
  description:
    'Master React Server Components — what they are, why they exist, their performance benefits, data fetching patterns, limitations, and when to use them vs Client Components.',
  category: 'Server Components',
  order: 5,
  difficulty: 'intermediate',
  estimatedTime: 55,
  prevLesson: 'nextjs-routing',
  nextLesson: 'nextjs-client-components',

  content: `# Server Components

## Why Server Components Exist

Before Server Components, there was a fundamental tension in React applications:

**Problem 1: Data fetching requires round trips**
In a React SPA, to show data you must:
1. Render the component (client)
2. Mount it (client)
3. Run useEffect (client)
4. Call an API (client → server)
5. Wait for response (network)
6. Update state (client)
7. Re-render with data (client)

That is 7 steps. Steps 4-6 happen over the network. Users see a loading spinner.

**Problem 2: JavaScript bundle bloat**
Every npm package imported in React components ships to the browser. A component that formats dates, processes markdown, or parses syntax — all of that code ships to every user's browser, even if it only runs once.

**Problem 3: Direct data access requires an API layer**
To fetch data from a database, you need:
1. A database (server)
2. An API endpoint (server)
3. A fetch call (client)
4. State management
5. Loading states
6. Error handling

Server Components solve all three problems.

---

## What are Server Components?

Server Components are React components that run **only on the server**. They:

- Never become JavaScript in the browser
- Can use \`async/await\` directly
- Can access databases, file system, environment secrets
- Can import any npm package without it affecting bundle size
- Cannot use state, effects, or browser APIs

They are the **default** in Next.js App Router. Every component is a Server Component unless you add \`"use client"\`.

---

## The Core Benefit: Zero JavaScript

When a Server Component renders, its output is HTML (or RSC payload). Nothing from the component's code reaches the browser.

\`\`\`tsx
// This entire file runs on server. NONE of it ships to browser.

import { marked } from 'marked';        // markdown parser — not shipped to browser
import { Prism } from 'prismjs';        // code highlighter — not shipped to browser
import { format } from 'date-fns';      // date formatter — not shipped to browser
import { db } from '@/lib/db';          // DB client — never reaches browser

export default async function BlogPost({ params }: { params: { slug: string } }) {
  // Direct database query — no API endpoint needed
  const post = await db.post.findUnique({
    where: { slug: params.slug },
    include: { author: true },
  });

  if (!post) return notFound();

  // Process markdown on server — no JS shipped to browser
  const htmlContent = marked(post.content);

  // Format date on server
  const formattedDate = format(new Date(post.publishedAt), 'MMMM d, yyyy');

  return (
    <article>
      <h1>{post.title}</h1>
      <time>{formattedDate}</time>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </article>
  );
}

// Browser receives:
// <article>
//   <h1>Getting Started with Next.js</h1>
//   <time>January 15, 2024</time>
//   <div><h2>Introduction</h2><p>Next.js is...</p></div>
// </article>
//
// Browser JavaScript for this page: 0 bytes (no client code)
// marked, Prism, date-fns, Prisma: none of this ships to browser
\`\`\`

A standard React SPA with the same functionality would ship 200-400KB of JavaScript for markdown parsing, syntax highlighting, and date formatting alone. Server Components eliminate this entirely.

---

## Data Fetching in Server Components

### Direct Database Queries

\`\`\`tsx
// No API layer needed. Query database directly.
export default async function UsersPage() {
  const users = await db.user.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, avatarUrl: true },
  });

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          <img src={user.avatarUrl} alt={user.name} />
          <span>{user.name}</span>
        </li>
      ))}
    </ul>
  );
}
\`\`\`

### Fetch with Caching

\`\`\`tsx
async function getWeatherData(city: string) {
  // Next.js extends fetch with caching options
  const res = await fetch(
    \`https://api.weather.com/v1/\${city}\`,
    {
      next: {
        revalidate: 3600, // Cache for 1 hour (ISR behavior)
        // OR: next: { tags: ['weather'] } — for tag-based revalidation
      },
    }
  );

  if (!res.ok) throw new Error('Weather API failed');
  return res.json();
}

export default async function WeatherPage({
  params,
}: {
  params: { city: string };
}) {
  const weather = await getWeatherData(params.city);

  return (
    <div>
      <h1>{params.city}</h1>
      <p>{weather.temperature}°C</p>
      <p>{weather.description}</p>
    </div>
  );
}
\`\`\`

### Accessing Environment Variables Securely

\`\`\`tsx
// Server Component — environment variables are SAFE here
export default async function PaymentWidget() {
  // process.env.STRIPE_SECRET_KEY stays on server — never reaches browser
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const prices = await stripe.prices.list({ active: true });

  return (
    <div>
      {prices.data.map(price => (
        <PriceCard key={price.id} price={price} />
      ))}
    </div>
  );
}

// In a Client Component, process.env values are undefined
// UNLESS prefixed with NEXT_PUBLIC_ (which makes them public)
\`\`\`

---

## What Server Components CANNOT Do

These will cause errors in Server Components:

\`\`\`tsx
// ❌ useState — no state in Server Components
import { useState } from 'react';
export default function Counter() {
  const [count, setCount] = useState(0); // ERROR
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// ❌ useEffect — no effects in Server Components
import { useEffect } from 'react';
export default function TimerPage() {
  useEffect(() => { // ERROR
    const timer = setInterval(() => console.log('tick'), 1000);
    return () => clearInterval(timer);
  }, []);
}

// ❌ onClick / event handlers
export default function Button() {
  return <button onClick={() => alert('Hi')}>Click</button>; // ERROR
  // onClick handlers require browser runtime
}

// ❌ Browser APIs
export default function LocalStorageReader() {
  const theme = localStorage.getItem('theme'); // ERROR: localStorage not defined
  return <div>{theme}</div>;
}

// ❌ useContext (but can pass data as props)
import { useContext } from 'react';
export default function ThemeReader() {
  const theme = useContext(ThemeContext); // ERROR
}
\`\`\`

---

## Server Component Patterns

### Pattern 1: Component as Data Layer

Each Server Component owns its own data fetching. No prop drilling of data through multiple layers.

\`\`\`tsx
// Each component fetches what IT needs
// No need for a top-level "fetch everything and pass down"

// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div>
      <UserHeader />          {/* Fetches user data itself */}
      <RevenueChart />        {/* Fetches revenue data itself */}
      <RecentOrders />        {/* Fetches orders data itself */}
      <QuickActions />        {/* No data needed — static buttons */}
    </div>
  );
}

// Each component is self-contained:
async function UserHeader() {
  const user = await getCurrentUser();
  return <header>Welcome, {user.name}</header>;
}

async function RevenueChart() {
  const revenue = await db.query('SELECT ...');
  return <Chart data={revenue} />;
}

async function RecentOrders() {
  const orders = await db.order.findMany({ take: 5 });
  return <OrderList orders={orders} />;
}
\`\`\`

### Pattern 2: Conditional Rendering Without Client State

\`\`\`tsx
// Check authentication, feature flags, etc. on server
export default async function AdminPanel() {
  const user = await getCurrentUser();

  // These checks happen on server — no JavaScript in browser for the check
  if (!user) return <LoginPrompt />;
  if (user.role !== 'admin') return <AccessDenied />;

  const [stats, users, logs] = await Promise.all([
    getAdminStats(),
    db.user.findMany(),
    getAuditLogs(),
  ]);

  return (
    <div>
      <StatsPanel stats={stats} />
      <UserTable users={users} />
      <AuditLog entries={logs} />
    </div>
  );
}
\`\`\`

### Pattern 3: Passing Server Data to Client Components

\`\`\`tsx
// Server Component — fetches data
async function ProductSection({ productId }: { productId: string }) {
  const product = await db.product.findUnique({
    where: { id: productId },
  });

  if (!product) return null;

  return (
    <div>
      {/* Server-rendered static content */}
      <h2>{product.name}</h2>
      <p>{product.description}</p>

      {/* Pass serializable data to Client Component */}
      <AddToCartButton
        productId={product.id}         // string ✓
        price={product.price}          // number ✓
        inStock={product.stock > 0}    // boolean ✓
        name={product.name}            // string ✓
        // NOT: onClick={handleClick}   ← functions are not serializable
        // NOT: date={new Date()}       ← Date objects need toString()
      />
    </div>
  );
}
\`\`\`

---

## Performance Impact

Let's quantify what Server Components actually do for performance:

**A typical e-commerce product page in React SPA:**
- React: ~45KB (core library)
- React DOM: ~127KB
- Data fetching library (SWR/React Query): ~40KB
- Date formatting (date-fns): ~75KB
- Markdown parser: ~30KB
- Total: ~317KB minimum, often 500KB+ with routing and state management

**Same page in Next.js with Server Components:**
- React (client only): ~6KB (small subset for hydration)
- Client components only (e.g., Add to Cart button, quantity selector): ~5-20KB
- Total: ~11-26KB

That is a **10-25x reduction** in JavaScript shipped to the browser. On mobile networks and slow devices, this is transformative.

---

## Server Components vs Client Components: Decision Framework

Ask yourself: **"Does this component need the browser?"**

| Needs browser? | Examples | Use |
|---|---|---|
| No | Display data, format text, render markdown | Server Component |
| Yes — state | Counter, toggle, form inputs | Client Component |
| Yes — effects | Data polling, subscriptions, animations | Client Component |
| Yes — events | Buttons, forms, drag and drop | Client Component |
| Yes — browser APIs | localStorage, geolocation, canvas | Client Component |
| Yes — third-party UI | Charts that need DOM, map components | Client Component |

**Default to Server.** Only move to Client when you have a specific reason. Your component tree should look like: mostly Server Components with Client Components at the interactive leaves.

---

## The "use server" Directive

Separate from Server Components, \`"use server"\` marks functions as **Server Actions** — functions that can be called from Client Components but execute on the server. Covered in Module 9.

Do not confuse:
- Server Components: no directive needed (default)
- Server Actions: \`"use server"\` at top of function or file
- Client Components: \`"use client"\` at top of file`,

  codeExamples: [
    {
      title: 'Real-world dashboard page — all Server Components',
      code: `// app/(app)/dashboard/page.tsx
// Everything here is a Server Component
// ZERO client-side JavaScript except for interactive leaf nodes

import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

// ── Main page orchestrates sections ──────────────────────────
export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className="space-y-6 p-6">
      {/* Fast — just shows user name, instant */}
      <DashboardHeader user={user} />

      {/* Metric cards load in parallel via Suspense */}
      <div className="grid grid-cols-3 gap-4">
        <Suspense fallback={<MetricSkeleton />}>
          <RevenueMetric userId={user.id} />
        </Suspense>
        <Suspense fallback={<MetricSkeleton />}>
          <UsersMetric />
        </Suspense>
        <Suspense fallback={<MetricSkeleton />}>
          <OrdersMetric userId={user.id} />
        </Suspense>
      </div>

      {/* Recent activity table */}
      <Suspense fallback={<TableSkeleton />}>
        <RecentActivity userId={user.id} />
      </Suspense>
    </div>
  );
}

// ── Individual sections fetch their own data ─────────────────

function DashboardHeader({ user }: { user: User }) {
  // No async — data passed as prop
  return (
    <header>
      <h1>Welcome back, {user.name}</h1>
      <p>Here's what's happening today</p>
    </header>
  );
}

async function RevenueMetric({ userId }: { userId: string }) {
  // Each metric fetches independently — they run in parallel via Suspense
  const revenue = await db.order.aggregate({
    where: { userId, createdAt: { gte: startOfMonth(new Date()) } },
    _sum: { total: true },
  });

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <p className="text-sm text-gray-500">Revenue This Month</p>
      <p className="text-3xl font-bold">
        \${revenue._sum.total?.toLocaleString() ?? 0}
      </p>
    </div>
  );
}

async function RecentActivity({ userId }: { userId: string }) {
  const orders = await db.order.findMany({
    where: { userId },
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { customer: { select: { name: true } } },
  });

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>Customer</th>
          <th>Amount</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(order => (
          <tr key={order.id}>
            <td>{order.customer.name}</td>
            <td>\${order.total}</td>
            <td>{format(order.createdAt, 'MMM d')}</td>
            <td><StatusBadge status={order.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// This entire page: ~8KB of JS (only the StatusBadge if it has client interactions)
// A React SPA equivalent: ~400KB+`,
      explanation:
        'A production dashboard page where each section is an independent Server Component that fetches its own data. Combined with Suspense, sections load in parallel. The browser receives zero JavaScript for any of the data display logic.',
    },
    {
      title: 'Reducing bundle size with Server Components',
      code: `// BEFORE: React SPA approach (all this ships to browser)
// bundle includes: marked (30KB), prismjs (50KB), date-fns (75KB), react-query (40KB)

// components/BlogPost.tsx (client component in React SPA)
import { marked } from 'marked';          // 30KB shipped
import Prism from 'prismjs';              // 50KB shipped
import { format } from 'date-fns';        // 75KB shipped
import { useQuery } from '@tanstack/react-query'; // 40KB shipped

export function BlogPost({ slug }: { slug: string }) {
  const { data: post, isLoading } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => fetch(\`/api/posts/\${slug}\`).then(r => r.json()),
  });

  if (isLoading) return <Spinner />;

  const html = marked(post.content);
  const date = format(new Date(post.publishedAt), 'MMMM d, yyyy');

  Prism.highlightAll(); // Run syntax highlighting in browser

  return (
    <article>
      <time>{date}</time>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
// Total additional JS: 195KB just for this component

// ─────────────────────────────────────────────────────────────

// AFTER: Next.js Server Component approach
// bundle includes: NONE of these libraries (they run on server)

// app/blog/[slug]/page.tsx (Server Component — no "use client")
import { marked } from 'marked';          // Runs on server, 0KB to browser
import Prism from 'prismjs';              // Runs on server, 0KB to browser
import { format } from 'date-fns';        // Runs on server, 0KB to browser
// No react-query needed — async/await directly

export default async function BlogPost({ params }: { params: { slug: string } }) {
  // Direct DB query — no API endpoint, no fetch, no network round trip
  const post = await db.post.findUnique({ where: { slug: params.slug } });

  if (!post) notFound();

  // All processing on server
  const html = marked(post.content);
  const date = format(new Date(post.publishedAt), 'MMMM d, yyyy');

  // Syntax highlighting on server
  const highlightedHtml = applySyntaxHighlighting(html, Prism);

  return (
    <article>
      <time>{date}</time>
      <div dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
    </article>
  );
}
// Total additional JS shipped to browser: 0KB
// The component output (HTML) is what gets sent — not the component code`,
      explanation:
        'The same functionality — markdown rendering, syntax highlighting, date formatting — but with zero JavaScript shipped to the browser. Server Components let you use any npm package on the server without it affecting the client bundle size.',
    },
  ],

  commonMistakes: [
    'Defaulting to "use client" on every component out of habit from React SPA development — always ask "does this need the browser?" first.',
    'Trying to use useState or useEffect in a Server Component — these will throw errors. Move interactive logic to a separate Client Component.',
    'Passing non-serializable values from Server to Client Components — functions, class instances, and Dates cannot be passed as props across the server/client boundary.',
    'Importing a database library in a Client Component — database clients have Node.js dependencies and will fail in the browser.',
    'Thinking Server Components are "just async components" — they are more: they never ship to the browser and have completely different capabilities.',
    'Using cookies or headers in a Server Component without importing from next/headers — these are available but require the correct import.',
  ],

  interviewQuestions: [
    {
      question: 'What are the key benefits of React Server Components?',
      answer:
        'Server Components provide three major benefits: (1) Zero JavaScript to the browser — Server Component code never ships to the client, reducing bundle size dramatically. Heavy libraries (markdown parsers, date formatters, syntax highlighters) run on the server without affecting client performance. (2) Direct data access — Server Components can query databases, access files, and read environment secrets directly without an API layer. No useEffect, no loading states, no API endpoints for the common case. (3) Improved performance — the component renders on the server where data lives, eliminating the client → API → database → client round trip. Users receive fully rendered HTML with real data, not empty shells that fetch data after rendering.',
      difficulty: 'intermediate',
      tip: 'The three key points: zero JS to browser, direct data access, no network round trip for data.',
    },
    {
      question: 'What are the limitations of Server Components?',
      answer:
        'Server Components cannot: (1) Use React state (useState, useReducer) — they render once on the server and send static output. (2) Use side effects (useEffect, useLayoutEffect) — effects are for browser lifecycle. (3) Use event handlers (onClick, onChange) — events fire in the browser. (4) Access browser APIs (window, document, localStorage, navigator) — these do not exist on the server. (5) Use Context — but they can pass data down as props. (6) Be rendered inside a Client Component (but can be passed as children). They also have one practical limitation: if you need real-time data updates, you need a Client Component with polling or WebSockets.',
      difficulty: 'intermediate',
    },
    {
      question: 'How do Server Components affect JavaScript bundle size?',
      answer:
        'Server Components fundamentally change bundle size calculation. In a React SPA, every component and every import from that component chain becomes JavaScript shipped to the browser. A markdown parser, date library, and ORM imported in a component all end up in the bundle. With Server Components, none of this reaches the browser. The component code runs on the server, generates HTML, and only the HTML output is sent. This means: (1) Heavy libraries (Prism.js, marked.js, date-fns) have zero browser cost. (2) The DB client never ships to the browser. (3) Only Client Component code and its imports go into the browser bundle. In practice, Server Components reduce JavaScript bundle sizes by 50-90% for content-heavy applications.',
      difficulty: 'advanced',
    },
    {
      question: 'How do you decide between a Server Component and a Client Component?',
      answer:
        'The primary question is: "Does this component need the browser?" If the component only displays data (no user interaction, no state, no browser APIs), it should be a Server Component. If it needs onClick, onChange, animations, useState, useEffect, or browser APIs like localStorage — it must be a Client Component. In practice: keep the majority of your component tree as Server Components. Only interactive "leaf" components at the edges of your tree need to be Client Components. A product page can be a Server Component (fetches product data) with an AddToCartButton Client Component nested inside. The Server Component renders the product info; the Client Component handles the cart interaction. This pattern minimizes JavaScript while preserving interactivity.',
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'sc-ex-1',
      title: 'Convert a React SPA component to a Server Component',
      description: `The following component is written as a React SPA Client Component. Convert it to a Next.js Server Component that:
1. Removes the useEffect and useState
2. Fetches data directly (no API call needed)
3. Handles the loading state without useState
4. Handles errors properly`,
      starterCode: `// BEFORE: React SPA pattern (Client Component)
"use client";

import { useState, useEffect } from 'react';

export function ProductList({ category }: { category: string }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch(\`/api/products?category=\${category}\`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {products.map(p => (
        <li key={p.id}>{p.name} - \${p.price}</li>
      ))}
    </ul>
  );
}

// TODO: Convert this to a Next.js Server Component
// The mock DB function: await db.product.findMany({ where: { category } })`,
      solution: `// AFTER: Next.js Server Component pattern
// No "use client" — this is a Server Component
// No useState, no useEffect, no fetch to /api
// Just async/await directly

import { db } from '@/lib/db';

// Loading is handled by loading.tsx or Suspense fallback — not here
// Errors are handled by error.tsx — not here

export default async function ProductList({ category }: { category: string }) {
  // Direct database query — no API endpoint, no network round trip
  const products = await db.product.findMany({
    where: { category },
    orderBy: { price: 'asc' },
    select: { id: true, name: true, price: true },
  });

  if (products.length === 0) {
    return <p className="text-gray-500">No products in {category} category.</p>;
  }

  return (
    <ul className="space-y-2">
      {products.map(product => (
        <li key={product.id} className="flex justify-between p-3 border rounded">
          <span>{product.name}</span>
          <span className="font-semibold">\${product.price}</span>
        </li>
      ))}
    </ul>
  );
}

// Usage in a page (or parent component):
// app/shop/[category]/page.tsx
// export default async function ShopPage({ params }) {
//   return (
//     <Suspense fallback={<ProductListSkeleton />}>
//       <ProductList category={params.category} />
//     </Suspense>
//   );
// }

// What changed:
// ✅ Removed: "use client"
// ✅ Removed: useState (loading, error, products)
// ✅ Removed: useEffect
// ✅ Removed: fetch('/api/products')
// ✅ Added: async function
// ✅ Added: direct db.product.findMany()
// ✅ Loading handled by: parent Suspense boundary
// ✅ Errors handled by: closest error.tsx`,
      hints: [
        'Remove "use client" — Server Components have no directive',
        'Replace useState + useEffect pattern with async/await at the top of the function',
        'Replace fetch("/api/...") with a direct database call',
        'Loading is handled by Suspense — the Server Component does not manage loading state',
      ],
    },
  ],

  keyTakeaways: [
    'Server Components are the default in Next.js App Router — every component is a Server Component unless "use client" is added.',
    'Server Component code NEVER ships to the browser — not the component code, not its imports, not the libraries it uses.',
    'Server Components can use async/await directly, query databases, and access secrets — impossible in client React.',
    'Server Components cannot use state, effects, event handlers, or browser APIs — these require Client Components.',
    'The pattern: Server Components handle data, Client Components handle interactivity. The tree should be mostly server with interactive leaves.',
    'Server Components eliminate the useEffect data fetching pattern — async/await replaces the useState + useEffect + fetch cycle.',
    'Heavy npm packages (markdown parsers, date formatters, ORMs) used only in Server Components cost zero browser JavaScript.',
    'Pass data from Server Components to Client Components as serializable props (strings, numbers, objects, arrays — not functions or class instances).',
  ],
};
