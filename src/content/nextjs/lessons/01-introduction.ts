import type { Lesson } from '@/types';

export const introductionLesson: Lesson = {
  id: 'what-is-nextjs',
  slug: 'what-is-nextjs',
  title: 'What is Next.js?',
  description:
    'Understand what Next.js is, why it exists, the real problems it solves that React SPA cannot, and why companies like Netflix, OpenAI, and TikTok moved to it.',
  category: 'Introduction',
  order: 1,
  difficulty: 'beginner',
  estimatedTime: 35,
  nextLesson: 'nextjs-architecture',

  content: `# What is Next.js?

## Before Next.js: The React SPA Era

To understand what Next.js is, you first need to understand what problem it solves. And to understand the problem, you need to understand what a React SPA (Single Page Application) is and why it has fundamental limitations at production scale.

When you build a standard React application with Create React App or Vite, you get a **Single Page Application**. Here is what happens when a user visits your site:

\`\`\`
User types URL in browser
         │
         ▼
Browser sends request to server
         │
         ▼
Server sends back: index.html (almost empty)
         │
         ▼
Browser downloads and executes JavaScript bundle (often 500KB-2MB+)
         │
         ▼
JavaScript runs, makes API calls to fetch data
         │
         ▼
API returns data
         │
         ▼
React renders the page with real content
         │
         ▼
User finally sees something useful
\`\`\`

This process has serious problems. Let's go through each one.

---

## Problem 1: Performance

The user sees nothing until the entire JavaScript bundle downloads and executes. On a slow mobile connection or an older device, this can take 3–8 seconds. Users see a blank screen or a spinner.

Web studies show:
- 53% of mobile users abandon a site that takes more than 3 seconds to load
- Every 100ms delay in page load reduces revenue by 1% (Amazon's research)
- Google found that going from 3s to 1s load time improves conversions by 27%

A React SPA forces users to wait. Next.js was built to eliminate that wait.

---

## Problem 2: SEO (Search Engine Optimization)

When a Google crawler visits your React SPA, it sees this HTML:

\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>My App</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="/bundle.js"></script>
  </body>
</html>
\`\`\`

The \`<div id="root"></div>\` is empty. Google's crawler used to not execute JavaScript at all. Even today, Googlebot's JavaScript execution is limited and often delayed by days or weeks.

This means:
- Your product pages have no indexable content
- Your blog posts cannot be found on Google
- Your company cannot rank for any keywords
- Your entire content is invisible to search engines

For any content-heavy site, e-commerce store, blog, or SaaS marketing page — a React SPA is simply not viable for SEO.

---

## Problem 3: Routing Challenges

React has no built-in router. You install react-router (a third-party library) and configure it manually. As your application grows:

- Route-level code splitting requires extra configuration
- Nested layouts require wrapping components manually
- Parallel data fetching is complex to coordinate
- Loading and error states per route need custom implementation
- Server-side redirects are not possible without a separate server

Every React app ends up building its own routing infrastructure. Teams waste weeks solving the same problems every time.

---

## Problem 4: No Full-Stack Capability

A React SPA is frontend only. You need a separate backend (Node.js/Express, Django, Rails, etc.) to handle:
- Database queries
- API endpoints
- Authentication logic
- Business logic
- File uploads

This means two separate codebases, two deployment processes, two teams, CORS configuration, and double the infrastructure cost. For small teams or startups, this overhead is enormous.

---

## What is Next.js?

**Next.js is a full-stack React framework** built by Vercel that solves all of the above problems.

It adds to React:

| What it adds | Why it matters |
|---|---|
| Server-Side Rendering (SSR) | HTML is generated on the server, user sees content instantly |
| Static Site Generation (SSG) | Pages pre-built at deploy time, served from CDN, fastest possible |
| File-based routing | Create a file, get a route. No configuration needed. |
| API Routes / Route Handlers | Write backend code in the same codebase |
| Server Components | Run React components on the server, zero JS sent to client |
| Image optimization | Automatic WebP conversion, lazy loading, proper sizing |
| Font optimization | Self-hosted fonts, no layout shift |
| Built-in SEO tools | Metadata API, Open Graph, sitemap generation |

Next.js is not a replacement for React. **React is still the UI library.** Next.js is the framework that provides everything React intentionally left out.

---

## How Next.js Actually Works

When a user requests a page in Next.js:

\`\`\`
User types URL in browser
         │
         ▼
Request hits Next.js server
         │
         ▼
Next.js executes your Server Components on the server
(fetches data from your database directly — no API call needed)
         │
         ▼
Next.js generates complete HTML with real content
         │
         ▼
Browser receives full HTML — user sees content immediately
         │
         ▼
Next.js sends a small JavaScript bundle for interactivity
         │
         ▼
React "hydrates" — attaches event handlers to existing HTML
\`\`\`

The key difference: the user sees real content before any JavaScript executes. This is called **Server-Side Rendering**.

---

## Who Uses Next.js and Why

### OpenAI (ChatGPT)
ChatGPT is built with Next.js. Reasons: Server Components allow the AI response stream to be sent directly from the server. The marketing pages benefit from SSG for SEO. The full-stack capability means OpenAI's engineers write both frontend and backend in one codebase.

### TikTok Web
TikTok's web version uses Next.js. With hundreds of millions of users, every millisecond matters. SSR ensures videos load immediately without waiting for JavaScript. SEO is critical for discovery.

### Twitch
Twitch moved to Next.js for their dashboard. App Router's parallel routes let them show the stream, chat, and info panel as independent sections that load and update independently.

### Notion
Notion's marketing and blog use Next.js SSG. Pages are pre-built as static files, served from a CDN. Zero server load, instant load times, perfect SEO.

### Hulu
Hulu's web app uses Next.js for performance-critical content delivery with proper SEO for their show library.

---

## Next.js vs React: The Right Mental Model

**React** is the engine. It knows how to:
- Render components to UI
- Manage state
- Handle events
- Update the DOM efficiently

**Next.js** is the car. It knows how to:
- Route users between pages
- Decide what renders on server vs client
- Fetch data at the right time
- Optimize images and fonts
- Handle authentication
- Deploy and serve the application
- Generate SEO metadata

You still write React components. Next.js just decides when and where they render.

| Feature | React (CRA/Vite) | Next.js |
|---|---|---|
| Rendering | Client-side only | Server, client, static, or hybrid |
| Routing | Manual (react-router) | File-based (automatic) |
| Data fetching | useEffect + fetch | Server Components + async/await |
| Backend | Separate project | Built-in API routes |
| SEO | Poor (empty HTML) | Excellent (server-rendered HTML) |
| Performance | Slower (JS-first) | Fast (HTML-first) |
| Image optimization | Manual | Built-in next/image |
| Deployment | Static host | Edge, serverless, or Node.js |
| Learning curve | Lower | Higher (more concepts) |

---

## The App Router vs Pages Router

Next.js has two routing systems:

**Pages Router** (Next.js 12 and earlier): The original system. Files in \`/pages\` directory map to routes. Stable, well-documented, widely used in production.

**App Router** (Next.js 13+): The modern system. Files in \`/app\` directory. Built on React Server Components. More powerful, better performance, the future of Next.js.

**This track teaches the App Router.** It is the current standard and what you will encounter in modern codebases. Understanding the App Router means understanding React Server Components — arguably the biggest shift in React's architecture since hooks.

---

## When to Use Next.js

Use Next.js when:
- You need SEO (marketing pages, blogs, e-commerce, content sites)
- You need fast initial load times (performance is a priority)
- You are building a full-stack application (need both frontend and backend)
- You are building a SaaS product (auth, database, API all in one)
- You are building with a team (Next.js provides structure and conventions)
- You need image optimization, font optimization, code splitting (production requirements)

Use a React SPA (Vite) when:
- You are building a tool that never needs SEO (admin dashboards, internal tools)
- Your app only works when the user is logged in (no public-facing pages)
- You need very complex client-side interactions that SSR would complicate
- You are prototyping quickly and don't need production features yet

**Most production applications should use Next.js.** The days of React SPA for anything beyond simple tools are largely over.`,

  codeExamples: [
    {
      title: 'React SPA vs Next.js — What the HTML looks like',
      code: `<!-- React SPA (CRA / Vite) — what Google and users receive first -->
<!DOCTYPE html>
<html>
  <head>
    <title>My Store</title>
  </head>
  <body>
    <!-- EMPTY. User sees nothing. Google sees nothing. -->
    <div id="root"></div>
    <script src="/bundle.js"></script>
  </body>
</html>

<!-- -------------------------------------------------------- -->

<!-- Next.js SSR — what Google and users receive first -->
<!DOCTYPE html>
<html>
  <head>
    <title>iPhone 15 Pro - Best Price | My Store</title>
    <meta name="description" content="Buy iPhone 15 Pro at $999. Free shipping.">
    <meta property="og:title" content="iPhone 15 Pro">
    <meta property="og:image" content="/iphone15-pro.jpg">
  </head>
  <body>
    <!-- FULL CONTENT. User sees the page. Google indexes it. -->
    <header>
      <nav>My Store | Products | Cart (3)</nav>
    </header>
    <main>
      <h1>iPhone 15 Pro</h1>
      <img src="/iphone15-pro.jpg" alt="iPhone 15 Pro" />
      <p>The most powerful iPhone ever built.</p>
      <span class="price">$999</span>
      <button>Add to Cart</button>
    </main>
  </body>
</html>`,
      explanation:
        'The React SPA sends an empty HTML shell. The Next.js version sends fully rendered HTML with real content, metadata for SEO, and Open Graph tags for social sharing. This is the fundamental difference that drives all Next.js benefits.',
    },
    {
      title: 'Your first Next.js page — Server Component by default',
      code: `// app/page.tsx
// This is a Server Component — it runs on the server, not in the browser.
// You can use async/await directly. No useEffect. No useState needed.

// This async function fetches data directly from your database.
// No API call needed. No loading spinner. Data is ready before HTML is sent.
async function getProducts() {
  // In a real app, this would query your database directly
  const res = await fetch('https://api.example.com/products');
  return res.json();
}

export default async function HomePage() {
  // Server Components can be async — this is impossible in client React
  const products = await getProducts();

  return (
    <main>
      <h1>Our Products</h1>
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.price}</p>
        </div>
      ))}
    </main>
  );
}

// What Next.js does with this:
// 1. Runs this function on the server
// 2. Fetches products data from the API
// 3. Renders the full HTML with all product names and prices
// 4. Sends the complete HTML to the browser
// Zero JavaScript sent for this component. Instant content.`,
      explanation:
        'This is the most important shift from React SPA: components run on the server by default. The async/await directly in the component body is not possible in client-side React. No useEffect, no loading state, no empty renders. The user receives fully populated HTML.',
    },
    {
      title: 'Full-stack in one file — API and page in the same project',
      code: `// app/api/products/route.ts
// This is a backend API endpoint — runs on Node.js server
// Same codebase as your frontend

import { db } from '@/lib/db';  // Your database connection

export async function GET() {
  const products = await db.product.findMany({
    where: { inStock: true },
    orderBy: { createdAt: 'desc' },
  });

  return Response.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const product = await db.product.create({ data: body });
  return Response.json(product, { status: 201 });
}

// ─────────────────────────────────────────────────────────

// app/page.tsx
// This is your frontend page — runs on server by default
// Can call your database DIRECTLY without going through the API

import { db } from '@/lib/db';

export default async function ProductsPage() {
  // Direct database query — no HTTP request needed
  const products = await db.product.findMany({
    where: { inStock: true },
  });

  return (
    <div>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

// One repository. One deployment. Frontend + backend together.
// No CORS. No separate API server. No duplicate type definitions.`,
      explanation:
        'Next.js eliminates the frontend/backend split for most applications. Your database queries, API endpoints, and UI components live in the same codebase. Server Components can query the database directly — bypassing the HTTP layer entirely.',
    },
  ],

  commonMistakes: [
    'Thinking Next.js replaces React — Next.js IS React, with the framework layer added on top. You still write React components.',
    'Using useEffect to fetch data on page load — in Next.js, fetch data in Server Components with async/await directly.',
    'Building everything as client components (adding "use client" everywhere) — this defeats the purpose of Next.js and makes it no better than a React SPA.',
    'Ignoring the difference between App Router and Pages Router — they are fundamentally different systems with different mental models.',
    'Assuming Next.js is only for static sites — Next.js is a full-stack framework. Dynamic apps, APIs, authentication, databases — all work natively.',
    'Not understanding that Next.js is opinionated — follow the conventions (file-based routing, Server Components by default) rather than fighting them.',
  ],

  interviewQuestions: [
    {
      question: 'What is Next.js and why does it exist?',
      answer:
        'Next.js is a full-stack React framework built by Vercel that solves the core limitations of React SPAs. React intentionally left out routing, data fetching strategy, server rendering, and backend capabilities. Next.js provides all of these. It exists because React SPAs have fundamental problems: poor SEO (empty HTML sent to browsers), slow initial load (user waits for JS to download and execute before seeing anything), no built-in routing, and no backend capability. Next.js adds server-side rendering, static site generation, file-based routing, API routes, Server Components, image optimization, and SEO tools — making it possible to build production-grade full-stack applications with React.',
      difficulty: 'beginner',
      tip: 'Always mention the two key problems: SEO and performance. Then mention full-stack capability.',
    },
    {
      question: 'What is the difference between a React SPA and a Next.js application?',
      answer:
        'A React SPA sends empty HTML to the browser and relies on JavaScript to render content. The user sees nothing until JS downloads, parses, and executes — often 2-5 seconds. Google receives empty HTML, making SEO nearly impossible. A Next.js application renders HTML on the server (SSR) or at build time (SSG) and sends complete, content-filled HTML to the browser. The user sees content immediately. Google receives fully rendered content. Additionally, Next.js provides file-based routing (no react-router needed), API routes (no separate backend needed), Server Components (React runs on server, zero JS sent to client), built-in image/font optimization, and SEO metadata APIs.',
      difficulty: 'beginner',
    },
    {
      question: 'Why would a company like OpenAI or TikTok choose Next.js?',
      answer:
        'Large companies choose Next.js for several reasons: (1) Performance — SSR and SSG ensure users see content immediately, not after JS executes. For TikTok with hundreds of millions of users, every 100ms of improvement matters. (2) SEO — content must be indexable by search engines. Static HTML with full content ranks far better than JS-rendered content. (3) Full-stack in one codebase — Next.js API routes allow frontend engineers to write backend logic without maintaining a separate service. (4) Developer experience — file-based routing, TypeScript by default, and built-in optimizations reduce the boilerplate that teams otherwise build themselves. (5) Vercel deployment — first-class deployment platform with edge functions, analytics, and previews.',
      difficulty: 'intermediate',
    },
    {
      question: 'When should you NOT use Next.js?',
      answer:
        'Next.js adds complexity. Avoid it when: (1) Building pure admin dashboards or internal tools with no public-facing pages — SEO is irrelevant and the complexity is unnecessary. (2) Building apps that are always behind auth — if every page requires login, SSR benefits are minimal since you cannot cache personalized content anyway. (3) Rapid prototyping where you just need a React UI quickly. (4) Teams unfamiliar with server-side rendering concepts — the mental model shift (Server vs Client Components, hydration, streaming) has a learning curve. Use a plain Vite React setup for these cases.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is the difference between the App Router and Pages Router?',
      answer:
        'The Pages Router (Next.js 12 and earlier) uses the /pages directory where each file maps to a route. Data fetching uses getServerSideProps and getStaticProps functions. The App Router (Next.js 13+) uses the /app directory and is built on React Server Components. Key differences: App Router components are Server Components by default (run on server, zero JS); Pages Router components always run on client. App Router has layouts, templates, loading.tsx, and error.tsx as special files. App Router supports streaming and Suspense natively. App Router is the current standard and the future of Next.js. The Pages Router is maintained but not where new features are added.',
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'nextjs-intro-1',
      title: 'Identify React SPA vs Next.js Problems',
      description: `You are evaluating whether to use React SPA or Next.js for the following projects. For each, state which you would choose and why.

1. A company blog with 500 articles that needs to rank on Google
2. An internal HR dashboard used only by 50 employees (always behind login)
3. An e-commerce store selling handmade jewelry
4. A real-time collaborative code editor (like CodeSandbox)
5. A SaaS product with a public marketing page and a private app

Explain the reasoning for each — mention SEO, performance, or full-stack needs where relevant.`,
      starterCode: `// No code needed — this is an architectural thinking exercise.
// Write your answers as comments.

// 1. Company Blog:
// Choice:
// Reason:

// 2. Internal HR Dashboard:
// Choice:
// Reason:

// 3. E-commerce Jewelry Store:
// Choice:
// Reason:

// 4. Real-time Code Editor:
// Choice:
// Reason:

// 5. SaaS with marketing + app:
// Choice:
// Reason:`,
      solution: `// 1. Company Blog:
// Choice: Next.js (SSG)
// Reason: SEO is the primary requirement. 500 articles need to rank on Google.
// Next.js SSG pre-builds all article pages as static HTML at deploy time.
// Google indexes complete content. Fast load from CDN. No server cost per request.

// 2. Internal HR Dashboard:
// Choice: React SPA (Vite) is fine
// Reason: No public-facing pages. No SEO needed. Always behind login.
// The complexity of SSR adds no value here. Keep it simple.

// 3. E-commerce Jewelry Store:
// Choice: Next.js (SSG + ISR)
// Reason: Product pages need SEO to rank for search queries.
// SSG makes product pages fast (served from CDN).
// ISR (Incremental Static Regeneration) keeps inventory in sync.
// Full-stack capability means checkout API can live in same codebase.

// 4. Real-time Code Editor:
// Choice: React SPA or Next.js with care
// Reason: Real-time collaborative features need WebSockets, heavy client-side state.
// SSR benefits are minimal here — the editor is not indexable content.
// Next.js can still be used but SSR adds limited value for this specific use case.

// 5. SaaS with marketing + app:
// Choice: Next.js
// Reason: Marketing pages need SEO (Next.js SSG for marketing section).
// App section is behind auth (can be rendered client-side or SSR for performance).
// One codebase handles both. API routes handle backend logic.
// This is the most common and ideal Next.js use case.`,
      hints: [
        'The key questions: Does Google need to index this? Will users see it before logging in?',
        'SEO matters for anything publicly accessible: blogs, product pages, marketing pages',
        'Real-time features (WebSockets, live collaboration) are not SSR problems — they are client-side by nature',
        'Full-stack capability matters when you need both frontend AND backend logic',
      ],
    },
  ],

  keyTakeaways: [
    'Next.js is a full-stack React framework — React is still the UI library, Next.js adds routing, rendering strategies, backend, and optimization on top.',
    'React SPAs have three fundamental problems: poor SEO (empty HTML), slow initial load (waits for JS), and no backend capability.',
    'Next.js sends fully rendered HTML to the browser, solving SEO and initial load time simultaneously.',
    'Server Components (App Router default) run on the server — they can fetch data directly from databases and send zero JavaScript to the browser.',
    'The App Router is the current standard; the Pages Router is the legacy system. This track focuses on App Router.',
    'Next.js is opinionated — file-based routing, Server Components by default, colocated backend. Follow the conventions rather than fighting them.',
    'Not every project needs Next.js — internal tools, admin dashboards, and always-authenticated apps may not benefit from its complexity.',
    'Companies like OpenAI, TikTok, Twitch, and Notion chose Next.js for performance, SEO, and full-stack developer experience.',
  ],
};
