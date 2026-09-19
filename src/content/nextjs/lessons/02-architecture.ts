import type { Lesson } from '@/types';

export const architectureLesson: Lesson = {
  id: 'nextjs-architecture',
  slug: 'nextjs-architecture',
  title: 'Next.js Architecture',
  description:
    'Understand how Next.js works internally — the build process, rendering pipeline, Server vs Client Components, hybrid rendering, and the full request lifecycle.',
  category: 'Architecture',
  order: 2,
  difficulty: 'intermediate',
  estimatedTime: 45,
  prevLesson: 'what-is-nextjs',
  nextLesson: 'nextjs-project-structure',

  content: `# Next.js Architecture

## How Next.js Works Under the Hood

Understanding Next.js architecture is not optional knowledge — it is the foundation that makes every other concept click. If you understand how Next.js processes a request, you will know why Server Components exist, why hydration is necessary, why some things must be "use client", and why certain optimizations work the way they do.

Let's go deep.

---

## The Two Environments

Next.js code can run in two completely different environments:

### Server Environment
- Node.js process (or Edge Runtime)
- Has access to filesystem, environment variables, databases
- Has NO access to browser APIs (window, document, localStorage)
- Never exposed to users directly
- Can be expensive computationally without affecting user experience

### Client Environment
- User's browser (Chrome, Firefox, Safari)
- Has access to browser APIs (window, document, localStorage, cookies)
- Has NO access to filesystem, databases, environment secrets
- Every byte of JS shipped here is paid for by the user's bandwidth and device CPU
- Performance directly impacts user experience

**The fundamental Next.js insight:** Most of your application's logic does not need to run in the browser. Data fetching, database queries, authentication checks, business logic — these can all run on the server. Only interactivity (event handlers, state updates, animations) needs the browser.

Next.js makes it possible to be explicit about which code runs where.

---

## The Build Process

When you run \`next build\`, Next.js does the following:

\`\`\`
next build
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  1. TypeScript compilation + type checking           │
│     All .ts/.tsx files compiled to JS               │
├─────────────────────────────────────────────────────┤
│  2. Route discovery                                 │
│     Scans /app directory for page.tsx files         │
│     Builds routing tree                             │
├─────────────────────────────────────────────────────┤
│  3. Static analysis                                 │
│     Determines which routes are static vs dynamic   │
│     Static: no dynamic data = pre-renderable        │
│     Dynamic: user-specific data = render on demand  │
├─────────────────────────────────────────────────────┤
│  4. Static Generation (SSG)                         │
│     Pre-renders all static pages to HTML files      │
│     These are served from CDN with no server cost   │
├─────────────────────────────────────────────────────┤
│  5. Bundle optimization                             │
│     Splits JS into route-level chunks               │
│     Tree-shakes unused code                         │
│     Minifies and compresses                         │
├─────────────────────────────────────────────────────┤
│  6. .next/ output directory created                 │
│     Contains: HTML files, JS chunks, source maps    │
└─────────────────────────────────────────────────────┘
\`\`\`

The output is a \`.next/\` directory containing everything needed to serve your application.

---

## The Rendering Pipeline

Next.js has multiple rendering modes. Understanding each is critical:

### Static Rendering (Build Time)
\`\`\`
Build time (next build):
Developer machine → Next.js → Runs your components → Generates HTML files → Stores in .next/

Request time:
User visits /about → CDN serves pre-built HTML → Instant response
\`\`\`

Best for: Pages whose content does not change per user or per request (marketing pages, blog posts, documentation).

### Dynamic Rendering (Request Time)
\`\`\`
Request time:
User visits /dashboard → Server runs your components → Fetches user-specific data → Generates HTML → Sends to browser
\`\`\`

Best for: Pages with user-specific content (dashboard, profile, feed).

### Client Rendering (Browser)
\`\`\`
Browser:
User interaction → React state update → Component re-renders → DOM updates
\`\`\`

Best for: Interactive UI elements (modals, forms, real-time updates).

---

## React Server Components (RSC)

Server Components are the most important architectural concept in Next.js 13+.

### What they are
Server Components are React components that execute **exclusively on the server**. They never run in the browser. They never become JavaScript that is sent to the client.

### What this means
\`\`\`
// app/products/page.tsx — Server Component (default in App Router)

import { db } from '@/lib/db';  // ← This import works because we're on the server

export default async function ProductsPage() {
  // This database call runs on the server.
  // The user's browser never sees this code.
  // No API endpoint needed.
  const products = await db.product.findMany();

  return (
    <ul>
      {products.map(p => <li key={p.id}>{p.name}: {p.price}</li>)}
    </ul>
  );
}

// What is sent to the browser:
// <ul>
//   <li>iPhone 15: $999</li>
//   <li>MacBook Pro: $1999</li>
//   <li>AirPods: $249</li>
// </ul>
//
// No JavaScript sent for this component.
// The HTML IS the component output.
\`\`\`

### The RSC Payload
When a Server Component renders, Next.js does not just send HTML. It sends an **RSC Payload** — a special format that React understands, containing the component tree, references to Client Components, and serialized props. This enables seamless transitions between server-rendered and client-rendered parts of your app.

---

## Client Components

Client Components are the React you already know. They run in the browser. They can use state, effects, and browser APIs.

You opt into Client Components with the \`"use client"\` directive:

\`\`\`tsx
"use client";

// This directive tells Next.js: "Everything below runs in the browser"
// This file and all imports from this file become client-side JavaScript

import { useState } from 'react';

export function AddToCartButton({ productId }: { productId: string }) {
  const [added, setAdded] = useState(false);

  return (
    <button onClick={() => setAdded(true)}>
      {added ? '✓ Added' : 'Add to Cart'}
    </button>
  );
}
\`\`\`

**Critical understanding:** \`"use client"\` does not mean "only runs on client." It means "runs on both server (for initial HTML) AND client (for interactivity)." It marks the boundary where server-only code ends and interactive code begins.

---

## The Component Tree: Server and Client Together

The real power is combining Server and Client Components:

\`\`\`
app/products/[id]/page.tsx (Server Component)
│
├── ProductImages.tsx (Server Component — fetches images from storage)
│
├── ProductInfo.tsx (Server Component — fetches product from DB)
│   └── Price (rendered on server with real data)
│
├── AddToCartButton.tsx ("use client" — needs onClick state)
│
└── Reviews.tsx (Server Component — fetches reviews from DB)
    └── ReviewForm.tsx ("use client" — needs form input state)
\`\`\`

Most of this tree runs on the server. Only the interactive leaf nodes (\`AddToCartButton\`, \`ReviewForm\`) become client JavaScript. This means you ship a fraction of the JavaScript compared to a React SPA where everything is client-side.

---

## The Request Lifecycle

Here is what happens when a user visits a Next.js page for the first time:

\`\`\`
── USER TYPES URL ─────────────────────────────────────────────
1. Browser sends HTTP GET request to Next.js server

── SERVER SIDE ────────────────────────────────────────────────
2. Next.js router matches the URL to a route (e.g., /products/123)
3. Next.js finds the page component (app/products/[id]/page.tsx)
4. Next.js renders Server Components:
   - Runs async data fetching (DB queries, fetch calls)
   - Renders component tree to RSC Payload
   - Converts RSC Payload to HTML
5. Next.js sends:
   - Complete HTML (user sees it immediately)
   - RSC Payload (React uses for hydration)
   - JS bundle for Client Components only

── BROWSER SIDE ───────────────────────────────────────────────
6. Browser renders HTML — user sees full page content
7. Browser downloads JS bundle (small — only Client Components)
8. React "hydrates":
   - Attaches event handlers to existing HTML
   - Makes interactive elements functional
9. Page is now fully interactive
\`\`\`

The user experience: sees content at step 6, before step 8 even starts. Interactive at step 9. This is fundamentally faster than React SPA where users wait until after step 8 to see anything.

---

## Hydration

Hydration is the process where React in the browser "takes over" the static HTML sent by the server and makes it interactive.

Think of it as two steps:
1. **Server:** Renders HTML with all content visible (the "dry" state)
2. **Browser:** React "waters" the HTML — attaches event listeners and connects components to React's state system (the "hydrated" state)

\`\`\`
SERVER sends:
<button>Add to Cart</button>

BROWSER after hydration:
<button onClick={handleAddToCart}>Add to Cart</button>
      ↑
      React attached this event handler
\`\`\`

Before hydration completes, the page looks correct but is not interactive. This is why you might see a button that does not work for a split second — hydration is in progress.

**Hydration mismatch:** A common error in Next.js. If your server renders different HTML than what React would render in the browser, React panics. Common causes: using \`window\` in a Server Component, dates that differ between server and client, random values.

---

## Streaming

Modern Next.js supports **streaming** — sending HTML in chunks as each Server Component completes.

\`\`\`
Without streaming (old model):
Server waits for ALL data → sends complete HTML → user sees everything at once
(user waits for the slowest data fetch)

With streaming:
Server sends HTML immediately for fast parts →
sends more HTML as slower parts complete →
user sees fast parts first
\`\`\`

\`\`\`tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { UserStats } from './UserStats';       // fast
import { RecentActivity } from './RecentActivity'; // slow DB query
import { Recommendations } from './Recommendations'; // slowest

export default function DashboardPage() {
  return (
    <div>
      {/* Renders and streams immediately */}
      <UserStats />

      {/* Streams when data is ready, shows spinner meanwhile */}
      <Suspense fallback={<Spinner />}>
        <RecentActivity />
      </Suspense>

      {/* Streams independently when recommendations load */}
      <Suspense fallback={<Spinner />}>
        <Recommendations />
      </Suspense>
    </div>
  );
}
\`\`\`

The user sees the dashboard layout immediately. Sections fill in as their data arrives. This eliminates the "white screen while loading" problem.

---

## Edge Runtime vs Node.js Runtime

Next.js can run in two server environments:

### Node.js Runtime (default)
- Full Node.js APIs available
- Can use any npm package
- Runs in traditional server or serverless functions
- Cold start: ~100-500ms

### Edge Runtime
- Lightweight V8-based runtime (not Node.js)
- No filesystem, no native Node.js modules
- Runs at CDN edge nodes worldwide (30+ locations)
- Responses come from the nearest edge node to the user
- Cold start: ~0ms (always warm)
- Use case: middleware, simple API endpoints, auth checks

\`\`\`tsx
// Opt into Edge Runtime for a route
export const runtime = 'edge';

export async function GET() {
  return new Response('Hello from the edge!');
}
// This function runs in 30+ locations worldwide.
// A user in Tokyo gets a response from Tokyo.
// A user in London gets a response from London.
// Latency approaches zero.
\`\`\`

---

## The Mental Model Summary

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                     YOUR NEXT.JS APP                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │               SERVER BOUNDARY                        │   │
│  │  Server Components (default)                        │   │
│  │  • Async/await for data                             │   │
│  │  • Direct DB access                                 │   │
│  │  • Access to secrets                                │   │
│  │  • Zero JavaScript to client                        │   │
│  │  • NO: useState, useEffect, onClick, window         │   │
│  └─────────────────────────┬───────────────────────────┘   │
│                             │  passes serializable props    │
│  ┌─────────────────────────▼───────────────────────────┐   │
│  │               CLIENT BOUNDARY ("use client")         │   │
│  │  Client Components                                  │   │
│  │  • useState, useEffect, hooks                       │   │
│  │  • Event handlers (onClick, onChange)               │   │
│  │  • Browser APIs (window, document, localStorage)    │   │
│  │  • Renders on server first, hydrates in browser     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
\`\`\`

Server Components are for data. Client Components are for interactivity. The boundary between them is explicit and intentional.`,

  codeExamples: [
    {
      title: 'Server Component vs Client Component — side by side',
      code: `// ─── SERVER COMPONENT (default) ──────────────────────────────
// File: app/products/page.tsx
// NO "use client" at the top

import { db } from '@/lib/db';

// async is allowed — runs on server
export default async function ProductsPage() {
  // Direct database query — no API call
  const products = await db.product.findMany({
    where: { published: true },
  });

  // process.env.SECRET_KEY is accessible — server only
  console.log('Secret key:', process.env.SECRET_API_KEY); // safe on server

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// What is NOT allowed in Server Components:
// ❌ useState, useReducer, useContext (interactive state)
// ❌ useEffect, useLayoutEffect (lifecycle effects)
// ❌ onClick, onChange (event handlers)
// ❌ window, document, localStorage (browser APIs)

// ─── CLIENT COMPONENT ─────────────────────────────────────────
// File: app/products/AddToCartButton.tsx
"use client";  // ← This one directive changes everything

import { useState } from 'react';

// Client Component: can use all React hooks
export function AddToCartButton({ productId, price }: {
  productId: string;
  price: number;
}) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
    setCount(c => c + 1);
    setLoading(false);
  }

  // What is NOT allowed in Client Components:
  // ❌ Direct database access (db.product.findMany)
  // ❌ Reading server-only env vars (process.env.SECRET)
  // ❌ fs, crypto, native Node.js modules

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Adding...' : count > 0 ? \`Added (\${count})\` : 'Add to Cart'}
    </button>
  );
}`,
      explanation:
        'Server Components and Client Components look nearly identical — they are both React components. The only difference is "use client" at the top. But this single directive determines where the component runs, what APIs are available, and whether JavaScript is sent to the browser.',
    },
    {
      title: 'Composing Server and Client Components correctly',
      code: `// ─── CORRECT: Pass Server data as props to Client Component ──

// app/product/[id]/page.tsx — SERVER COMPONENT
import { db } from '@/lib/db';
import { AddToCartButton } from './AddToCartButton';
import { ProductReviews } from './ProductReviews';

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  // Fetch data on server
  const product = await db.product.findUnique({
    where: { id: params.id },
    include: { images: true },
  });

  if (!product) notFound();

  return (
    <main>
      {/* Server-rendered — no JS */}
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <img src={product.images[0].url} alt={product.name} />

      {/* Client Component — receives serialized props from server */}
      <AddToCartButton
        productId={product.id}
        price={product.price}
        inStock={product.stock > 0}
      />

      {/* Server Component that fetches its own data */}
      <ProductReviews productId={product.id} />
    </main>
  );
}

// ─── WRONG: Cannot import Server Component inside Client Component ──

"use client";
// ❌ This does NOT work
import { DatabaseComponent } from './DatabaseComponent'; // Server Component

export function ClientWrapper() {
  const [open, setOpen] = useState(false);
  // ERROR: Cannot import a Server Component into a Client Component
  // Server Components cannot be rendered inside Client Components
  return <DatabaseComponent />;
}

// ─── CORRECT: Pass Server Component as children prop ───────────

// Server Component
import { ClientWrapper } from './ClientWrapper';
import { ServerContent } from './ServerContent';

export default function Page() {
  return (
    // Pass the Server Component as children
    <ClientWrapper>
      <ServerContent /> {/* ← This works! Passed as a prop, not imported inside */}
    </ClientWrapper>
  );
}`,
      explanation:
        'The golden rule: Server Components pass data DOWN to Client Components as props. Client Components cannot import Server Components — but they can receive them as children. This pattern lets you have interactive wrappers around server-rendered content.',
    },
    {
      title: 'The rendering pipeline with streaming',
      code: `// app/dashboard/page.tsx
import { Suspense } from 'react';

// Each of these is a separate Server Component
// Each fetches its own data independently
async function DashboardHeader() {
  const user = await getCurrentUser(); // fast — 10ms
  return <header>Welcome, {user.name}</header>;
}

async function RevenueChart() {
  // Slow query — 800ms
  const revenue = await db.query(\`
    SELECT date, SUM(amount) as total
    FROM orders
    WHERE created_at > NOW() - INTERVAL '30 days'
    GROUP BY date
  \`);
  return <Chart data={revenue} />;
}

async function TopProducts() {
  // Also slow — 600ms
  const products = await db.product.findMany({
    orderBy: { sales: 'desc' },
    take: 5,
  });
  return <ProductList products={products} />;
}

// The page component orchestrates all sections
export default function DashboardPage() {
  return (
    <div>
      {/*
        DashboardHeader renders first — fast
        Streams to browser immediately
      */}
      <DashboardHeader />

      {/*
        RevenueChart and TopProducts render independently
        Each has its own Suspense boundary
        User sees a spinner for each, then content fills in
        They load in parallel — total wait = max(800ms, 600ms) = 800ms
        NOT sequential: 800ms + 600ms = 1400ms
      */}
      <div className="grid grid-cols-2 gap-4">
        <Suspense fallback={<ChartSkeleton />}>
          <RevenueChart />
        </Suspense>

        <Suspense fallback={<ListSkeleton />}>
          <TopProducts />
        </Suspense>
      </div>
    </div>
  );
}

// Timeline:
// T=0ms:   Browser receives header HTML, shows it
// T=600ms: TopProducts HTML streams in, spinner replaced
// T=800ms: RevenueChart HTML streams in, spinner replaced
// T=800ms: Dashboard fully loaded
// (vs T=1400ms without parallel streaming)`,
      explanation:
        'Streaming with Suspense fundamentally changes perceived performance. Each section of the page loads independently. Users see fast content immediately and slow content when ready. Parallel fetching ensures sections do not wait for each other.',
    },
  ],

  commonMistakes: [
    'Adding "use client" to every component — this makes Next.js behave like a React SPA. Only add it where interactivity is needed.',
    'Importing a Server Component inside a Client Component — this is not allowed. Pass server data as props or pass Server Components as children.',
    'Using browser APIs (window, document) in a Server Component — they do not exist on the server. This causes "window is not defined" errors.',
    'Forgetting that "use client" marks a boundary — all imports inside a "use client" file also become client-side, even if they were server-only modules.',
    'Not using Suspense with slow data fetches — without Suspense, a slow component blocks the entire page from rendering.',
    'Passing non-serializable props from Server to Client — you can only pass plain objects, strings, numbers, arrays. No functions, no class instances, no Dates.',
    'Treating the Edge Runtime like Node.js — Edge Runtime has no filesystem, no native modules, and limited APIs.',
  ],

  interviewQuestions: [
    {
      question: 'What is the difference between Server Components and Client Components?',
      answer:
        'Server Components run exclusively on the server and are never sent to the browser as JavaScript. They can use async/await, access databases directly, and read environment secrets. They cannot use useState, useEffect, event handlers, or browser APIs. Client Components (marked with "use client") run first on the server (for initial HTML) then hydrate in the browser. They can use all React hooks and browser APIs but cannot access server-only resources. The key benefit: Server Components send zero JavaScript to the browser, significantly reducing bundle size and improving performance.',
      difficulty: 'intermediate',
      tip: 'The interviewer wants to hear: "Server Components run ONLY on server, zero JS to client." Then explain what each can and cannot do.',
    },
    {
      question: 'What is hydration and why is it necessary?',
      answer:
        'Hydration is the process where React in the browser attaches event listeners and state to server-rendered HTML. The server sends complete HTML (static, non-interactive). The browser displays it immediately — this is why Next.js pages feel fast. Then React downloads the JS bundle, runs in the browser, and "hydrates" the existing HTML — connecting it to React\'s component tree and adding interactivity. It is necessary because the server can only send static HTML, but the browser needs to know which elements have event handlers, which have React state, and how they connect. Without hydration, buttons would not work. The tradeoff: there is a brief window between rendering and hydration where the UI looks correct but is not interactive.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is a hydration mismatch and how do you fix it?',
      answer:
        'A hydration mismatch occurs when the HTML the server sends is different from what React would render in the browser. React panics and either throws an error or rewrites the DOM (breaking performance). Common causes: (1) Using Math.random() or Date.now() without suppression — the value changes between server and client renders. (2) Using window or navigator in a component — they exist in the browser but not on the server. (3) User locale affecting date/number formatting. Fixes: (1) Move non-deterministic logic to useEffect (runs only in browser). (2) Use the suppressHydrationWarning prop for values that are intentionally different. (3) Check typeof window !== "undefined" before accessing browser globals. (4) For dates, use a consistent formatting approach on both sides.',
      difficulty: 'advanced',
    },
    {
      question: 'How does streaming improve performance in Next.js?',
      answer:
        'Without streaming, the server must complete ALL data fetching for a page before sending any HTML. If one section takes 2 seconds, the user waits 2 seconds for a blank screen. With streaming, Next.js sends HTML in chunks as each Suspense boundary resolves. Fast sections stream immediately. Slow sections show a loading skeleton (fallback) while their data loads. The key benefit: users see content progressively. A dashboard with 5 sections will show the header and fast widgets instantly, while slower analytics charts fill in as they load. Technically, HTTP chunked transfer encoding allows the server to send partial HTML over a single connection. Combined with React Suspense, each async Server Component streams its HTML when its data is ready.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is the Edge Runtime and when would you use it?',
      answer:
        'The Edge Runtime is a lightweight V8-based JavaScript runtime that runs at CDN edge locations worldwide (30+ locations) rather than in a central Node.js server. Key differences from Node.js: no filesystem access, no native Node.js modules, limited APIs (Fetch API, Web Crypto, URL). Benefits: near-zero cold start (always warm), geographic proximity to users (a Tokyo user gets a response from a Tokyo server, not a US server), much lower latency for simple operations. Use the Edge Runtime for: middleware (auth checks, redirects, A/B testing), simple API endpoints that only need fetch and basic logic, personalization at the edge. Use Node.js runtime for: anything requiring database connections, filesystem, native modules, or complex computation.',
      difficulty: 'advanced',
    },
  ],

  exercises: [
    {
      id: 'arch-exercise-1',
      title: 'Classify components as Server or Client',
      description: `For each component description, decide: Server Component or Client Component? Explain why.

1. A navigation bar that highlights the current page (uses usePathname hook)
2. A product listing page that fetches products from the database
3. A "like" button that updates count when clicked (useState)
4. A user profile section that shows name and avatar from the database
5. A search input that filters results as you type (onChange handler)
6. A modal dialog that opens when a button is clicked
7. A blog post page that renders markdown content
8. A data visualization chart that animates on mount (useEffect)`,
      starterCode: `// Classify each as: "server" | "client"
// Explain the key reason

// 1. Navigation bar with active link highlighting
const nav = {
  type: "", // "server" | "client"
  reason: "",
};

// 2. Product listing from database
const productListing = {
  type: "",
  reason: "",
};

// 3. Like button with click handler
const likeButton = {
  type: "",
  reason: "",
};

// 4. User profile section (name, avatar from DB)
const userProfile = {
  type: "",
  reason: "",
};

// 5. Search input with onChange
const searchInput = {
  type: "",
  reason: "",
};

// 6. Modal dialog (open/close state)
const modal = {
  type: "",
  reason: "",
};

// 7. Blog post with markdown content
const blogPost = {
  type: "",
  reason: "",
};

// 8. Animated chart (useEffect for animation)
const chart = {
  type: "",
  reason: "",
};`,
      solution: `// 1. Navigation bar with active link highlighting
const nav = {
  type: "client",
  reason: "usePathname() is a client hook — needs to read the browser URL. Requires 'use client'.",
};

// 2. Product listing from database
const productListing = {
  type: "server",
  reason: "Fetches from database. No interactivity needed. Async Server Component handles this perfectly.",
};

// 3. Like button with click handler
const likeButton = {
  type: "client",
  reason: "onClick event handler + useState for count. Both require browser environment.",
};

// 4. User profile section (name, avatar from DB)
const userProfile = {
  type: "server",
  reason: "Just displays data from database. No interactivity. Server Component — zero JS to client.",
};

// 5. Search input with onChange
const searchInput = {
  type: "client",
  reason: "onChange event handler for real-time filtering. Requires browser event system.",
};

// 6. Modal dialog (open/close state)
const modal = {
  type: "client",
  reason: "useState for open/close. Event handlers to trigger. Browser DOM manipulation. All client.",
};

// 7. Blog post with markdown content
const blogPost = {
  type: "server",
  reason: "Pure content rendering. Markdown parsed and rendered on server. No interactivity. No JS to client.",
};

// 8. Animated chart (useEffect for animation)
const chart = {
  type: "client",
  reason: "useEffect runs only in browser. Animation APIs (requestAnimationFrame, CSS transitions) are browser-only.",
};

// Key pattern to remember:
// Server: data fetching, content display, no hooks, no events
// Client: useState, useEffect, event handlers, browser APIs`,
      hints: [
        'Server Components: async/await, database calls, no hooks, no event handlers',
        'Client Components: any React hook (useState, useEffect, usePathname), any event handler (onClick, onChange)',
        'The question is always: "Does this need the browser?" If yes, client. If no, server.',
        'Data display = server. Interactivity = client.',
      ],
    },
  ],

  keyTakeaways: [
    'Next.js code runs in two environments: the server (Node.js, with DB/filesystem access) and the client (browser, with DOM/state access). Understanding this boundary is everything.',
    'Server Components (App Router default) run only on the server. Zero JavaScript sent to the browser. Can use async/await and access databases directly.',
    'Client Components ("use client") run on both server (initial render) and browser (hydration + interactivity). Required for state, effects, and event handlers.',
    'Hydration is React attaching event listeners to server-rendered HTML. Before hydration, the page looks correct but is non-interactive.',
    'Streaming allows Next.js to send HTML in chunks as each Suspense boundary resolves. Users see fast content before slow content loads.',
    'The build process (next build) compiles TypeScript, discovers routes, pre-renders static pages, and splits JavaScript into route-level chunks.',
    'Edge Runtime runs at CDN edge locations worldwide with near-zero latency. Node.js Runtime has full capabilities but higher cold start.',
    'Pass non-serializable data from Server to Client via props. Server Components cannot be imported into Client Components (but can be passed as children).',
  ],
};
