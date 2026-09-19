import type { Lesson } from '@/types';

export const renderingStrategiesLesson: Lesson = {
  id: 'nextjs-rendering-strategies',
  slug: 'nextjs-rendering-strategies',
  title: 'Rendering Strategies',
  description:
    'Master all rendering strategies in Next.js: CSR, SSR, SSG, ISR, static rendering, dynamic rendering — how each works, when to use each, tradeoffs, and real production examples.',
  category: 'Rendering',
  order: 7,
  difficulty: 'intermediate',
  estimatedTime: 60,
  prevLesson: 'nextjs-client-components',
  nextLesson: 'nextjs-data-fetching',

  content: `# Rendering Strategies

## Why Rendering Strategy Matters

The rendering strategy you choose for a page determines:
- How fast users see content (Time to First Byte, First Contentful Paint)
- Whether search engines can index the content (SEO)
- How fresh the data is (stale content vs real-time)
- How much infrastructure you need (CDN vs dedicated server)
- How much it costs to serve (compute per request vs pre-built files)

There is no single right answer. The correct strategy depends on the specific page and its data requirements.

---

## CSR — Client-Side Rendering

### How it works
\`\`\`
Build time: Next.js creates a minimal HTML shell
Request: Browser downloads the HTML shell
         Browser downloads JavaScript bundle
         JavaScript executes
         React renders components
         Components call APIs to fetch data
         Page shows real content
\`\`\`

### In Next.js
CSR happens inside Client Components when data is fetched with useEffect:

\`\`\`tsx
"use client";

import { useState, useEffect } from 'react';

export function UserDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner />;
  return <StatsDisplay stats={stats} />;
}
\`\`\`

Also via \`next/dynamic\` with \`ssr: false\`:

\`\`\`tsx
import dynamic from 'next/dynamic';

// This component is NEVER server-rendered
// Downloaded and rendered only in browser
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});
\`\`\`

### Advantages
- Can access browser APIs immediately
- No server needed for the component
- Works for highly personalized, real-time content

### Disadvantages
- User sees blank/loading state initially
- No SEO (content not in initial HTML)
- Slower perceived performance (waterfall: HTML → JS → API → render)

### Use cases
- Admin dashboards behind auth (no SEO needed)
- Real-time data that must always be fresh
- Browser-only features (canvas, WebGL, live audio)
- Third-party widgets (maps, chat)

---

## SSR — Server-Side Rendering

### How it works
\`\`\`
Request arrives:
  Server runs your component code
  Fetches data (DB, API)
  Generates complete HTML with real content
  Sends HTML to browser

Browser:
  Displays HTML immediately (user sees content)
  Downloads JS bundle
  React hydrates (attaches interactivity)
\`\`\`

### In Next.js
SSR happens automatically for Server Components that are **dynamic** (use cookies, headers, searchParams, or opt out of caching):

\`\`\`tsx
// app/dashboard/page.tsx
// This is SSR because it reads cookies (user-specific data)

import { cookies } from 'next/headers';

export default async function DashboardPage() {
  const cookieStore = cookies(); // Reading cookies = dynamic rendering
  const userId = cookieStore.get('userId')?.value;

  const userStats = await db.user.findUnique({
    where: { id: userId },
    include: { orders: true, notifications: true },
  });

  return <Dashboard stats={userStats} />;
}
\`\`\`

You can also force dynamic rendering:

\`\`\`tsx
// Force this page to always be dynamically rendered (never cached)
export const dynamic = 'force-dynamic';

export default async function LivePricingPage() {
  const prices = await fetchLiveCryptoPrices();
  return <PriceTable prices={prices} />;
}
\`\`\`

### Advantages
- Fresh data on every request (always current)
- Full SEO (complete HTML sent)
- Can use request-time data (cookies, headers, IP)
- Good for personalized content

### Disadvantages
- Slower than static (server computation per request)
- Higher infrastructure cost (server always running)
- Cannot be served from CDN alone (server needed)
- Database becomes bottleneck under high load

### Use cases
- User dashboards with personalized data
- Pages showing real-time inventory or pricing
- Content that changes per user (cart, recommendations)
- Pages that require authentication checks per request

---

## SSG — Static Site Generation

### How it works
\`\`\`
Build time (next build):
  Next.js runs your component code once
  Fetches data
  Generates HTML files
  Stores in .next/static/

Request:
  CDN serves pre-built HTML file
  No server computation
  Near-instant response
\`\`\`

### In Next.js
SSG is the default for pages with no dynamic data:

\`\`\`tsx
// app/about/page.tsx — Static (no data fetching = pre-built at build time)
export default function AboutPage() {
  return (
    <div>
      <h1>About Our Company</h1>
      <p>We were founded in 2020...</p>
    </div>
  );
}

// app/blog/page.tsx — Static (cached fetch = pre-built)
export default async function BlogPage() {
  // This fetch is cached — runs at build time, result stored
  const posts = await fetch('https://api.example.com/posts', {
    cache: 'force-cache', // Cache indefinitely (SSG behavior)
  }).then(r => r.json());

  return <PostList posts={posts} />;
}

// app/blog/[slug]/page.tsx — Dynamic route + SSG
export async function generateStaticParams() {
  // Tell Next.js which slugs to pre-build
  const posts = await getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);
  return <Article post={post} />;
}
\`\`\`

### Advantages
- Fastest possible performance (CDN delivery)
- Zero server cost per request
- Infinitely scalable (CDN handles all traffic)
- Best SEO (HTML immediately available)
- Works even if your backend is down

### Disadvantages
- Content is stale until next build
- Long build times for thousands of pages
- Cannot show user-specific content
- Requires a rebuild to update content

### Use cases
- Marketing pages, landing pages
- Blog posts, documentation
- Product catalog (if prices rarely change)
- Legal pages, about pages
- Any content that is the same for every user

---

## ISR — Incremental Static Regeneration

ISR combines the speed of static generation with the freshness of server-side rendering.

### How it works
\`\`\`
First request after deploy (or after revalidation period):
  CDN has no cached version (or cache expired)
  Server generates the page
  Stores the HTML in CDN cache
  Serves the just-generated HTML

Subsequent requests (within revalidation period):
  CDN serves cached HTML (instant, no server)

After revalidation period expires:
  First request after expiry: serves stale HTML immediately
  Background: server regenerates the page
  Next request: serves fresh HTML from CDN
\`\`\`

This is **stale-while-revalidate** — serve stale content immediately, update in background.

### In Next.js
\`\`\`tsx
// Revalidate every 60 seconds
export const revalidate = 60;

export default async function NewsPage() {
  const articles = await fetch('https://api.news.com/articles', {
    next: { revalidate: 60 }, // or set at page level above
  }).then(r => r.json());

  return <NewsFeed articles={articles} />;
}
// Result: page is a static HTML file
// After 60 seconds: first visitor gets stale HTML, page regenerates in background
// Next visitor gets fresh HTML
\`\`\`

### On-demand ISR (Tag-based revalidation)
\`\`\`tsx
// app/products/[id]/page.tsx
export default async function ProductPage({ params }) {
  const product = await fetch(\`/api/products/\${params.id}\`, {
    next: { tags: [\`product-\${params.id}\`] }, // Tag this cache entry
  }).then(r => r.json());

  return <ProductDetail product={product} />;
}

// app/api/webhook/route.ts — called when a product is updated in CMS
import { revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  const { productId } = await request.json();

  // Instantly invalidate cache for this specific product
  revalidateTag(\`product-\${productId}\`);

  return Response.json({ revalidated: true });
}
// Result: within seconds of a product update in the CMS,
// the product page regenerates and shows fresh content
\`\`\`

### Advantages
- Fast delivery (CDN cached)
- Content stays reasonably fresh
- Server load is minimal (only generates when cache expires)
- On-demand revalidation for instant updates

### Disadvantages
- Users may briefly see stale content
- More complex than pure SSG or SSR
- Requires careful cache tag design for on-demand

### Use cases
- E-commerce product pages (prices update sometimes)
- News and blog sites (new content added frequently)
- Documentation (occasionally updated)
- Any page where "a few minutes stale" is acceptable

---

## Static vs Dynamic Rendering (App Router)

In Next.js App Router, rendering is determined at the **route** level:

\`\`\`tsx
// ── STATIC RENDERING (default) ─────────────────────────────
// Next.js pre-renders this at build time

export default async function StaticPage() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'force-cache', // explicitly cached
  });
  return <div>{data.content}</div>;
}

// ── DYNAMIC RENDERING (triggered by dynamic functions) ──────
// Any of these make the route dynamic:

// 1. cookies() or headers() from 'next/headers'
import { cookies } from 'next/headers';
export default async function Page() {
  const theme = cookies().get('theme'); // → dynamic
}

// 2. searchParams prop
export default async function Page({ searchParams }) {
  const q = searchParams.q; // → dynamic
}

// 3. Uncached fetch (no cache option)
export default async function Page() {
  const data = await fetch('https://api.example.com/live');
  // No cache option → dynamic by default in Next.js 15
}

// 4. Force dynamic explicitly
export const dynamic = 'force-dynamic';

// ── PARTIAL PRERENDERING (Next.js 14+ experimental) ─────────
// Static shell + dynamic holes
// Experimental — not covered in depth here
\`\`\`

---

## Rendering Strategy Decision Tree

\`\`\`
Is this content the same for every user?
│
├─ YES: Can it be pre-built at deploy time?
│   │
│   ├─ YES: Does it ever change?
│   │   ├─ NO: Pure SSG (marketing pages, docs)
│   │   └─ YES: How often?
│   │       ├─ Rarely (hours/days): ISR with long revalidation
│   │       └─ Frequently (minutes): ISR with short revalidation
│   │           or On-demand ISR
│   │
│   └─ NO: SSR (dynamic public content)
│
└─ NO: Is it different per user?
    │
    ├─ YES: Does it need SEO?
    │   ├─ NO: CSR with useEffect (admin dashboards)
    │   └─ YES: SSR (personalized but SEO important)
    │
    └─ Is it real-time?
        ├─ YES: CSR with polling/WebSocket
        └─ NO: SSR with caching per user
\`\`\`

---

## Comparison Table

| Strategy | Build Time | Request Time | SEO | Freshness | Cost | Best For |
|---|---|---|---|---|---|---|
| CSR | Fast | Fast (no server) | Poor | Real-time | Low | Admin tools, real-time |
| SSR | Fast | Slower (server runs) | Excellent | Always fresh | Medium | User dashboards, auth pages |
| SSG | Slow | Instant (CDN) | Excellent | Stale until rebuild | Lowest | Marketing, blogs, docs |
| ISR | Slow | Fast (CDN + background refresh) | Excellent | Configurable | Low | E-commerce, news |

---

## A Real Production Example: E-commerce

\`\`\`
Homepage (/)                    → SSG (pre-built, fast marketing page)
/products                       → SSG + ISR (product list, refreshes hourly)
/products/[id]                  → SSG + ISR (product page, on-demand revalidation)
/products/[id]?color=red        → Dynamic SSR (URL params = dynamic)
/cart                           → CSR (user-specific, always fresh, behind auth)
/checkout                       → SSR (personalized, security requirements)
/orders                         → SSR (user-specific orders, auth required)
/orders/[id]                    → SSR (specific order, auth required)
/admin/*                        → CSR or SSR (behind auth, no SEO needed)
/api/*                          → Dynamic (API routes are always dynamic)
\`\`\`

This hybrid approach gives maximum performance for public pages while ensuring user-specific pages are always fresh and secure.`,

  codeExamples: [
    {
      title: 'Controlling rendering behavior in Next.js',
      code: `// ── Route-level rendering control ──────────────────────────

// app/products/page.tsx

// Option 1: Revalidate every hour (ISR)
export const revalidate = 3600;

// Option 2: Never cache (always SSR)
export const dynamic = 'force-dynamic';

// Option 3: Always static (SSG, fail if any dynamic data)
export const dynamic = 'force-static';

// ── Fetch-level caching control ─────────────────────────────

export default async function ProductsPage() {

  // SSG: cached forever, only updates on rebuild
  const categories = await fetch('https://api.example.com/categories', {
    cache: 'force-cache',
  }).then(r => r.json());

  // ISR: cached for 1 hour
  const featuredProducts = await fetch('https://api.example.com/featured', {
    next: { revalidate: 3600 },
  }).then(r => r.json());

  // SSR: never cached, always fresh
  const liveInventory = await fetch('https://api.example.com/inventory', {
    cache: 'no-store',
  }).then(r => r.json());

  // Tagged cache (for on-demand revalidation)
  const flashSale = await fetch('https://api.example.com/flash-sale', {
    next: { tags: ['flash-sale'], revalidate: 300 },
  }).then(r => r.json());

  return (
    <div>
      <CategoryNav categories={categories} />        {/* Static */}
      <FeaturedProducts products={featuredProducts} />{/* ISR 1hr */}
      <InventoryBadge inventory={liveInventory} />   {/* Always fresh */}
      {flashSale && <FlashSaleBanner sale={flashSale} />} {/* ISR + tags */}
    </div>
  );
}`,
      explanation:
        'Different data on the same page can have different caching strategies. Categories change rarely → SSG. Featured products change hourly → ISR 1hr. Live inventory must be current → no-store. Flash sales can be invalidated on-demand via tags.',
    },
    {
      title: 'On-demand revalidation for a CMS-driven site',
      code: `// This pattern is used by Notion, Contentful, Sanity, etc.
// Editors update content in the CMS → webhook fires → page regenerates

// app/blog/[slug]/page.tsx — ISR with tag-based invalidation
export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await fetch(\`https://api.cms.com/posts/\${params.slug}\`, {
    next: {
      tags: [\`post-\${params.slug}\`, 'posts'], // Multiple tags
    },
  }).then(r => r.json());

  if (!post) notFound();

  return (
    <article>
      <h1>{post.title}</h1>
      <time>{post.publishedAt}</time>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}

// app/api/revalidate/route.ts — Webhook receiver
import { revalidateTag, revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  // Verify this is from your CMS (important security check)
  const secret = request.headers.get('x-webhook-secret');
  if (secret !== process.env.WEBHOOK_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await request.json();

  if (body.type === 'post.updated') {
    // Revalidate just this post's cache
    revalidateTag(\`post-\${body.slug}\`);
    console.log(\`Revalidated: post-\${body.slug}\`);
  }

  if (body.type === 'post.published' || body.type === 'post.deleted') {
    // Revalidate all posts (index page)
    revalidateTag('posts');
    // Also revalidate the specific post path
    revalidatePath(\`/blog/\${body.slug}\`);
  }

  return Response.json({ revalidated: true, timestamp: Date.now() });
}

// Flow:
// Editor publishes a post in Contentful →
// Contentful calls POST /api/revalidate →
// Next.js revalidates 'posts' tag →
// Next visit to /blog/my-post generates fresh HTML →
// CDN caches the fresh HTML
// Total propagation time: ~1-3 seconds`,
      explanation:
        'On-demand ISR connects your CMS to your Next.js site. When content changes in the CMS, a webhook triggers immediate page regeneration. Users always see current content without waiting for a scheduled revalidation window.',
    },
  ],

  commonMistakes: [
    'Using SSR everywhere by default — most pages benefit from SSG or ISR. SSR has a server computation cost per request.',
    'Using SSG for pages that show user-specific content — SSG content is the same for everyone. User dashboards need SSR or CSR.',
    'Forgetting that using cookies() or headers() in Next.js automatically makes a page dynamic — be intentional about this.',
    'Setting revalidate = 0 thinking it means "always fresh" — use cache: "no-store" or dynamic = "force-dynamic" instead.',
    'Not using generateStaticParams for dynamic SSG routes — without it, Next.js cannot pre-build the pages and falls back to SSR.',
    'Over-relying on ISR for financial or inventory data — if a user should never see stale pricing, use SSR with no caching.',
    'Not implementing webhook revalidation for CMS-driven sites — time-based ISR without on-demand invalidation means stale content until the timer expires.',
  ],

  interviewQuestions: [
    {
      question: 'Explain the difference between SSR, SSG, and ISR.',
      answer:
        'SSR (Server-Side Rendering): page generates on the server on every request. User always gets fresh, potentially user-specific content. Higher server load. Good for personalized or frequently changing data. SSG (Static Site Generation): page generates at build time and is stored as a static HTML file. Served from CDN with zero server cost per request. Content is stale until next build. Best for content that rarely changes (marketing pages, docs). ISR (Incremental Static Regeneration): combines SSG speed with SSR freshness. Pages are pre-generated but revalidated on a schedule (e.g., every 60 seconds) or on-demand. Users get static speed; content stays reasonably fresh. Best for e-commerce, news, and blogs.',
      difficulty: 'intermediate',
      tip: 'Always explain the tradeoff: SSG = fastest but stale, SSR = fresh but slower/costlier, ISR = balance.',
    },
    {
      question: 'What makes a Next.js route static vs dynamic?',
      answer:
        'In Next.js App Router, a route is static by default if it makes no dynamic function calls. It becomes dynamic when: (1) cookies() or headers() from "next/headers" are called — these require request-time data. (2) searchParams prop is accessed — URL query strings change per request. (3) A fetch with no caching or cache: "no-store" is used. (4) The page is explicitly opted out with export const dynamic = "force-dynamic". Static routes are pre-rendered at build time; dynamic routes render per request. The distinction is important for performance: static routes are served instantly from CDN; dynamic routes require a server.',
      difficulty: 'intermediate',
    },
    {
      question: 'How does ISR stale-while-revalidate work?',
      answer:
        'ISR uses the stale-while-revalidate pattern. When a page has revalidate = 60, the first request after deployment generates the page and caches it. Subsequent requests within 60 seconds serve the cached static HTML (instant). After 60 seconds, the cache is "stale." The NEXT request still gets the stale HTML immediately (no user waits), but Next.js triggers a background regeneration of the page. When regeneration completes, the cache is replaced with fresh content. The following request gets the fresh HTML. This means users always get a fast response, but content can be up to 2x the revalidation period old (once before expiry, once during regeneration). On-demand revalidation (revalidateTag) bypasses the timer and forces immediate regeneration.',
      difficulty: 'advanced',
    },
    {
      question: 'When would you choose CSR over SSR in a Next.js app?',
      answer:
        'CSR is preferable when: (1) The page is behind authentication and SEO is irrelevant — no reason to pay for server computation if Google never sees the page. (2) The content must be real-time and personalized (live stock prices, chat messages, collaborative tools). (3) The feature requires browser APIs that are impossible to server-render (canvas, WebGL, audio APIs, geolocation). (4) You need to render third-party components that are client-only (some map SDKs, rich text editors). In practice, Next.js apps use a mix: public-facing pages use SSR or SSG for SEO and performance, while authenticated app sections often use a mix of server-rendered structure with CSR for interactive, real-time elements.',
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'render-ex-1',
      title: 'Choose the right rendering strategy',
      description: `For each page described below, choose the optimal rendering strategy (CSR, SSR, SSG, ISR) and configure it in Next.js. Explain your reasoning.

1. Homepage with marketing content — updated by marketing team monthly
2. Product page for an e-commerce site — prices change occasionally, stock changes frequently
3. User dashboard showing orders and account balance (requires login)
4. Live crypto price ticker (updates every second)
5. Blog post — written once, rarely updated
6. Search results page (/search?q=nextjs)`,
      starterCode: `// For each scenario, write:
// 1. The rendering strategy
// 2. The Next.js configuration code
// 3. A one-line reason

// Example:
// Strategy: SSG
// export const revalidate = false; // static
// Reason: static content, updated only on deploy

// 1. Homepage
// Strategy:
// Config:
// Reason:

// 2. Product page (/products/[id])
// Strategy:
// Config:
// Reason:

// 3. User dashboard (/dashboard)
// Strategy:
// Config:
// Reason:

// 4. Crypto ticker (/prices)
// Strategy:
// Config:
// Reason:

// 5. Blog post (/blog/[slug])
// Strategy:
// Config:
// Reason:

// 6. Search results (/search?q=...)
// Strategy:
// Config:
// Reason:`,
      solution: `// 1. Homepage — marketing content, monthly updates
// Strategy: SSG
export default function HomePage() { /* no dynamic data */ }
// Or explicitly:
export const dynamic = 'force-static';
// Reason: Content never changes between deploys. Serve from CDN, zero server cost.

// 2. Product page — prices change occasionally, stock frequently
// Strategy: ISR with on-demand revalidation for stock
export const revalidate = 3600; // Re-check prices every hour
// Plus on-demand revalidation when stock changes via CMS webhook:
// revalidateTag(\`product-\${id}\`)
// Reason: Mostly static (CDN speed) but stays reasonably fresh.
// On-demand for critical stock changes.

// 3. User dashboard — personalized, requires auth
// Strategy: SSR (or CSR for real-time sections)
import { cookies } from 'next/headers';
export default async function DashboardPage() {
  const session = cookies().get('session'); // cookies() = automatic SSR
  const data = await getUserData(session);
  return <Dashboard data={data} />;
}
// Reason: User-specific data. Cannot cache across users. Cookies force dynamic.

// 4. Crypto ticker — updates every second
// Strategy: CSR with polling or WebSocket
"use client";
import { useState, useEffect } from 'react';
export default function CryptoPage() {
  const [prices, setPrices] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      fetch('/api/prices').then(r => r.json()).then(setPrices);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return <PriceTable prices={prices} />;
}
// Reason: Data changes every second. SSR/ISR cannot keep up. CSR is correct here.

// 5. Blog post — written once, rarely updated
// Strategy: SSG with optional ISR for edits
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(p => ({ slug: p.slug }));
}
export const revalidate = 86400; // Optional: re-check daily
// Reason: Content is stable. Pre-build all posts. Serve from CDN for best SEO + speed.

// 6. Search results — ?q= changes per user
// Strategy: SSR (searchParams make it dynamic automatically)
export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  // searchParams usage = automatic dynamic rendering
  const results = await search(searchParams.q ?? '');
  return <SearchResults results={results} />;
}
// Reason: Query string is user-provided. Cannot pre-build. Must be dynamic.
// Note: results could be cached per-query using unstable_cache if desired.`,
      hints: [
        'Think about: Does every user see the same content? → If yes, SSG or ISR is possible',
        'Think about: Does the data change? How fast? → determines revalidation interval',
        'Think about: Does it need to be SEO indexed? → If yes, avoid CSR',
        'cookies() and searchParams automatically trigger dynamic rendering',
      ],
    },
  ],

  keyTakeaways: [
    'CSR: rendered entirely in the browser. No SEO. Good for real-time, personalized, or browser-only content.',
    'SSR: rendered on the server per request. Always fresh. Full SEO. Higher cost. Good for personalized or frequently changing content.',
    'SSG: pre-rendered at build time. Instant (CDN). Best SEO. Content is stale until rebuild. Good for content that rarely changes.',
    'ISR: SSG with a revalidation timer. CDN speed with configurable freshness. On-demand revalidation for immediate updates.',
    'A Next.js route is static by default — using cookies(), headers(), or searchParams makes it dynamic.',
    'Different data on the same page can use different caching strategies via the fetch cache option.',
    'The rendering decision is always a tradeoff: speed vs freshness, cost vs personalization.',
    'E-commerce pattern: homepage (SSG), product pages (ISR), cart/checkout (SSR), admin (CSR).',
  ],
};
