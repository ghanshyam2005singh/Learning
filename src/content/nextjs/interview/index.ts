import type { InterviewQuestion } from '@/types';

export const interviewQuestions: InterviewQuestion[] = [
  // ─── BEGINNER ────────────────────────────────────────────────────────────────
  {
    question: 'What is Next.js and what problems does it solve over a plain React app?',
    answer: 'Next.js is a React framework that adds three things React lacks: (1) Rendering strategies — pages can render on the server (SSR), at build time (SSG), or incrementally (ISR), giving better performance and SEO than a React SPA that ships empty HTML. (2) File-based routing — directory structure becomes the URL structure with zero configuration. (3) Full-stack capabilities — Server Components, Server Actions, and Route Handlers allow database access and API endpoints in the same project. The result: one codebase replaces a separate React frontend + Express backend.',
    difficulty: 'beginner',
    tip: 'Always mention: server rendering (SEO/performance), routing, and full-stack as the three main reasons.',
    followUp: [
      'When would you NOT use Next.js?',
      'What is the difference between App Router and Pages Router?',
    ],
  },
  {
    question: 'What is the difference between the App Router and Pages Router?',
    answer: 'The Pages Router (pre-Next.js 13) uses pages/ directory, all components are Client Components by default, and data fetching uses getServerSideProps/getStaticProps special functions. The App Router (Next.js 13+) uses the app/ directory, components are Server Components by default, data fetching is just async/await in components, and adds features like Server Actions, Streaming with Suspense, nested layouts, and intercepting routes. New projects should always use App Router. Pages Router is legacy and only maintained for backwards compatibility.',
    difficulty: 'beginner',
    tip: 'Key differences: default component type, data fetching pattern, streaming support.',
    followUp: ['Can you mix App Router and Pages Router in one project?'],
  },
  {
    question: 'What is a Server Component? What are its limitations?',
    answer: 'A Server Component is a React component that runs only on the server — it generates HTML that is sent to the browser, but its JavaScript code is never sent to the client. Benefits: direct database access, secure environment variables, zero JS bundle contribution, can be async. Limitations: cannot use useState, useReducer, useContext, or any hook; cannot use browser APIs (window, localStorage, document); cannot attach event handlers (onClick, onChange); cannot use libraries that require the browser DOM.',
    difficulty: 'beginner',
    tip: 'Memory aid: "Server Components are READ-only. No hooks, no events, no browser."',
    followUp: [
      'How do Server Components communicate with Client Components?',
      'Can a Server Component import a Client Component?',
    ],
  },
  {
    question: 'What does "use client" mean? Does it mean the component only runs in the browser?',
    answer: 'No — this is the most common misconception. "use client" marks the boundary where code is included in the JavaScript bundle sent to the browser. Client Components still render on the server during the initial page load (SSR/SSG) to produce HTML, and then they re-render (hydrate) in the browser to become interactive. So Client Components run on BOTH the server (initial HTML) and the client (hydration + updates). "use client" means: "this code ships to the client", not "this code only runs on the client".',
    difficulty: 'beginner',
    tip: 'The interviewer is specifically testing this misconception. State it clearly and directly.',
  },
  {
    question: 'What are the reserved file names in the App Router and what does each do?',
    answer: 'page.tsx: defines the UI for a route, makes the route publicly accessible. layout.tsx: wraps all pages in the segment and persists across navigation (does NOT re-render on navigation). loading.tsx: shown immediately as a Suspense fallback while the page loads. error.tsx: React Error Boundary for the segment, must be "use client". not-found.tsx: shown when notFound() is called or for unmatched routes. template.tsx: like layout but re-renders on every navigation. route.ts: API endpoint for the route (no UI).',
    difficulty: 'beginner',
    tip: 'Remember: layout.tsx persists and does NOT re-render. template.tsx does re-render.',
  },
  {
    question: 'What is the difference between static and dynamic rendering in Next.js?',
    answer: 'Static rendering happens at build time — the HTML is generated once and served from CDN for every user. Dynamic rendering happens at request time — fresh HTML is generated for each request. A route is static by default. It becomes dynamic when: cookies() or headers() is called (request-specific data), searchParams is accessed, or fetch() is called with cache: "no-store" or force-dynamic is exported. Static routes are faster (CDN-cached). Dynamic routes are needed for user-specific content.',
    difficulty: 'beginner',
    followUp: ['How do you force a route to be dynamic? How do you force static?'],
  },

  // ─── INTERMEDIATE ────────────────────────────────────────────────────────────
  {
    question: 'Explain the four rendering strategies: CSR, SSR, SSG, and ISR.',
    answer: 'CSR (Client-Side Rendering): Browser downloads JS, JS renders UI. Initial HTML is empty. Good for: dashboards behind auth, highly interactive apps. Bad for: SEO, initial load time. SSR (Server-Side Rendering): Server generates HTML per request. Always fresh. Good for: personalized content, real-time data. Bad for: higher server cost, slower than cached. SSG (Static Site Generation): HTML generated at build time, served from CDN. Fastest. Good for: blogs, marketing, documentation. Bad for: stale data, long build times with many pages. ISR (Incremental Static Regeneration): SSG pages regenerated in background after TTL expires. Combines SSG speed with eventual freshness. Good for: product pages, news articles. The default in Next.js App Router is static (SSG-like). Dynamic routes use SSR.',
    difficulty: 'intermediate',
    tip: 'Use a concrete use case for each: CSR=admin dashboard, SSR=user profile, SSG=blog post, ISR=product page.',
    followUp: ['When would you choose ISR over SSR for a product page?'],
  },
  {
    question: 'How does data caching work in Next.js? Explain the different cache layers.',
    answer: 'Next.js has five caching layers: (1) Request Memoization — same fetch() URL in one render is deduplicated, runs once. Per-request, automatic. (2) Data Cache — fetch() with next: {revalidate} or force-cache. Stored on disk, persists across requests and deployments. (3) Full Route Cache — complete HTML + RSC payload of static pages cached on the server filesystem. (4) Router Cache — client-side cache of visited pages in browser memory. Makes back navigation instant. (5) React cache() — memoizes a function for one server render, used for DB queries to prevent duplicate calls across components.',
    difficulty: 'intermediate',
    tip: 'Work from fastest to slowest: Router Cache (browser memory) → Route Cache (server disk) → Data Cache (server disk) → DB.',
    followUp: ['What is the difference between revalidatePath and revalidateTag?'],
  },
  {
    question: 'What is a Server Action and how does it work under the hood?',
    answer: 'A Server Action is a function marked with "use server" that runs on the server but can be called from a Client Component. Under the hood: Next.js generates a unique ID for each Server Action and creates a POST endpoint. When called from a Client Component, the browser sends a POST request to that endpoint with serialized arguments. The server receives it, deserializes the arguments, runs the function, serializes the return value, and sends it back. Benefits: works without JavaScript (forms), automatically CSRF-protected (Origin + Content-Type headers checked), direct database access, no separate API needed for mutations.',
    difficulty: 'intermediate',
    followUp: ['What is the difference between Server Actions and Route Handlers?'],
  },
  {
    question: 'How does Streaming work in Next.js and why does it improve performance?',
    answer: 'HTTP streaming allows the server to send parts of the HTML response progressively instead of waiting for everything. Next.js uses React Suspense to enable streaming. Each <Suspense> boundary is an independent streaming chunk. When the server has the HTML for a section ready, it sends that chunk to the browser. The browser can start rendering fast sections (200ms) while slow sections (2s) are still loading. Without streaming: user waits 2 seconds for anything. With streaming: user sees fast content at 200ms, slow content fills in at 2s. This dramatically improves perceived performance (Time to First Byte and LCP).',
    difficulty: 'intermediate',
    tip: 'Key insight: Suspense boundaries are independent — fast ones do not wait for slow ones.',
    followUp: ['What is the loading.tsx file and how does it relate to Suspense?'],
  },
  {
    question: 'What is generateStaticParams and when should you use it?',
    answer: 'generateStaticParams is an async function exported from a dynamic route segment that tells Next.js which parameter values to pre-render at build time. For example, on /blog/[slug]/page.tsx, generateStaticParams returns [{slug: "post-1"}, {slug: "post-2"}] and Next.js generates HTML for each at build time. This enables SSG for dynamic routes — pages are pre-rendered and cached on CDN. Without it, dynamic routes are server-rendered on demand. Use it for: blog posts, product pages, documentation — any content that can be enumerated at build time.',
    difficulty: 'intermediate',
    followUp: ['What happens when someone navigates to a path not in generateStaticParams?'],
  },
  {
    question: 'Explain the difference between revalidatePath and revalidateTag.',
    answer: 'Both invalidate the Data Cache and Full Route Cache, but differ in scope. revalidatePath("/blog") purges cache for a specific URL path — everything on /blog is re-fetched on next request. revalidateTag("posts") purges all fetch() calls tagged with "posts" across any page — useful when the same data appears on multiple pages (/blog, /home, /author/123 all fetch posts). Use revalidatePath when you know exactly which page to update. Use revalidateTag when the same data is shared across multiple routes — tag all related fetch calls and invalidate the tag on write.',
    difficulty: 'intermediate',
    tip: 'revalidatePath = URL-based, revalidateTag = data-based. Tag is more powerful for shared data.',
  },

  // ─── ADVANCED ────────────────────────────────────────────────────────────────
  {
    question: 'How do you implement authentication that works correctly across all layers of Next.js?',
    answer: 'Next.js has four authentication layers: (1) Middleware (Edge Runtime) — runs before any route. Verify JWT from cookie using jose (not jsonwebtoken — Edge has no Node.js). Redirect to login if missing/invalid. Fast and cheap — no DB access. (2) Layout (Server Component) — for full DB verification. Check if session still exists in DB. Redirect if revoked or expired. (3) Route Handlers — verify auth before returning API data. (4) Server Actions — re-verify before every mutation. Critical: Server Actions are POST endpoints anyone can call directly, bypassing the UI. Defense in depth: middleware catches unauthenticated requests early; layout does full DB check; actions re-verify for mutations.',
    difficulty: 'advanced',
    tip: 'The key point: middleware uses Edge Runtime (jose only, no Prisma). Actions must always re-verify because they bypass UI.',
    followUp: ['Why can\'t you use Prisma in middleware?', 'What is the difference between session-based and JWT auth?'],
  },
  {
    question: 'What is the RSC payload and why does it matter for client-side navigation?',
    answer: 'The RSC (React Server Component) payload is a special serialized format that represents the output of Server Component rendering. It contains: the rendered HTML of Server Components, references (not full code) to Client Components and their props, and data boundaries. When you click a <Link> for client-side navigation, Next.js fetches the RSC payload for the new page (not full HTML). The router takes this payload and uses it to update only the changed parts of the React tree. Server Components re-render on the server (their output travels as payload), while Client Components already in the browser update their props. This is why Next.js navigation is fast — no full page reload, no re-downloading Client Component JS.',
    difficulty: 'advanced',
    followUp: ['How does the RSC payload differ from a JSON API response?'],
  },
  {
    question: 'How does parallel routing work and when would you use it?',
    answer: 'Parallel routes use @slotName folders to render multiple pages simultaneously in the same layout. For example, @feed and @sidebar in the layout receive independent page components. Each slot has its own loading.tsx, error.tsx, and navigation state. Use cases: (1) Dashboard with independent sections — @analytics and @activity render concurrently, each can stream independently. (2) Modals while keeping the underlying page visible — Instagram photo modal pattern. (3) Multi-panel layouts where each panel navigates independently. Parallel routes enable "simultaneous views of different parts of the same URL" — each slot can match a different page based on the current route.',
    difficulty: 'advanced',
    followUp: ['What is the difference between parallel routes and intercepting routes?'],
  },
  {
    question: 'How would you optimize a Next.js application that has poor Core Web Vitals scores?',
    answer: 'Diagnose first with Lighthouse and Vercel Speed Insights. For LCP (Largest Contentful Paint): identify the largest above-fold image and add priority prop to next/image. Ensure the page uses SSR/SSG so HTML arrives with content (not empty). For CLS (Cumulative Layout Shift): add explicit width/height to all images (next/image does this), use next/font to prevent font layout shift, add CSS skeleton placeholders. For INP (Interaction to Next Paint): reduce JS bundle — use dynamic import for heavy libraries, prefer Server Components (zero JS to browser), analyze with ANALYZE=true npm run build. General: wrap slow Server Components in Suspense for streaming, use ISR instead of SSR for public pages (CDN-cached), add connection pooling to prevent DB bottlenecks.',
    difficulty: 'advanced',
    tip: 'Start with the LCP image — adding priority to the hero image is the single most impactful change for most pages.',
  },
  {
    question: 'What are the Edge Runtime limitations in Next.js and why do they exist?',
    answer: 'The Edge Runtime is a minimal JavaScript environment based on V8 isolates (Cloudflare Workers / Vercel Edge). It runs geographically close to users for low latency. Limitations: no Node.js built-in modules (fs, path, crypto module), no native addons, limited npm packages. Specifically: cannot use Prisma (requires native bindings), cannot use jsonwebtoken (uses Node.js crypto), cannot use the file system. Use instead: jose for JWT (uses Web Crypto API), fetch() for HTTP, lightweight pure-JS libraries. The trade-off is worth it: middleware on Edge starts in <1ms vs ~100ms for a Node.js cold start. Use the Node.js runtime for Route Handlers and Server Actions where you need Prisma.',
    difficulty: 'advanced',
    tip: 'The why: Edge Runtime is not Node.js — it is a subset of Web APIs optimized for cold-start speed.',
    followUp: ['How do you specify which runtime to use for a Route Handler?'],
  },
  {
    question: 'Explain the security model of Server Actions. How do you prevent common attacks?',
    answer: 'Server Actions are automatically CSRF-protected: Next.js checks the Origin header against the host and requires specific Content-Type headers, preventing cross-site form submissions. Additional security: (1) Authentication — call requireAuth() first; the session cookie is httpOnly so JS cannot read it. (2) Authorization — verify the user can perform the action (role check, ownership check). (3) Input validation — use Zod safeParse; never trust client-provided data. (4) IDOR prevention — never trust userId from form data; always get it from the session. (5) Rate limiting — use Upstash Redis in middleware for sensitive actions. The most common mistake: trusting a userId from FormData — a malicious user can send any userId to update another user\'s data.',
    difficulty: 'advanced',
    tip: 'The pattern: Auth → AuthZ → Validate → Execute. Skipping any step creates a security hole.',
  },
];
