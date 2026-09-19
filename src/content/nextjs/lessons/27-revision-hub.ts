import type { Lesson } from '@/types';

export const revisionHubLesson: Lesson = {
  id: 'nextjs-revision-hub',
  slug: 'nextjs-revision-hub',
  title: 'Revision Hub',
  description:
    'Complete Next.js revision — one-page summary of every concept, quick-reference tables, common patterns, and the mental model that ties everything together.',
  category: 'Revision',
  order: 27,
  difficulty: 'beginner',
  estimatedTime: 45,
  prevLesson: 'nextjs-guided-projects',
  nextLesson: undefined,

  content: `# Next.js Revision Hub

## The One Mental Model

\`\`\`
Server = Free performance (no JS, direct DB, secure)
Client = Required for interactivity (state, events, browser APIs)
URL    = State that lives between server and client (filters, pagination)

When in doubt: stay on the server.
When you need interactivity: push it to the smallest possible component.
\`\`\`

---

## Module-by-Module Summary

### Module 1: Introduction
- Next.js solves: React SPA performance/SEO, routing, full-stack development
- App Router is the current standard (not Pages Router)
- Core feature: colocation of frontend + backend in one project

### Module 2: Architecture
- Request → Edge/CDN → Next.js Server → React renders (RSC + Client) → Hydration
- Server Components default, Client Components opt-in with "use client"
- RSC payload: serialized component tree used for client-side navigation

### Module 3: Project Structure
\`\`\`
Reserved files: page.tsx, layout.tsx, template.tsx,
               loading.tsx, error.tsx, not-found.tsx,
               route.ts, middleware.ts
Route groups: (marketing), (auth), (app) — group without URL impact
\`\`\`

### Module 4: Routing
\`\`\`
[id]         → /products/123
[...slug]    → /docs/a/b/c
[[...slug]]  → /docs OR /docs/a/b/c
@slot        → Parallel routes
(.)path      → Intercepting routes
\`\`\`

### Module 5: Server Components
- Async function, no hooks, direct DB access, zero JS to browser
- Cannot use: useState, useEffect, browser APIs, event handlers

### Module 6: Client Components
- "use client" = ships to browser + runs on both server (SSR) and browser (hydration)
- Required for: state, effects, event handlers, navigation hooks, browser APIs

### Module 7: Rendering Strategies
\`\`\`
CSR:  Browser renders. No initial HTML. Bad SEO.
SSR:  Server renders per request. Fresh data. Slower TTFB.
SSG:  Build time render. Fastest. Stale data.
ISR:  Build time + background refresh. Best of SSG + SSR.

Dynamic triggers: cookies(), headers(), searchParams, force-dynamic
\`\`\`

### Module 8: Data Fetching
\`\`\`tsx
// Force-cache (SSG-like): cache forever
fetch(url, { cache: 'force-cache' })

// No-store (SSR-like): never cache
fetch(url, { cache: 'no-store' })

// ISR: revalidate after N seconds
fetch(url, { next: { revalidate: 3600 } })

// Tagged: invalidate by tag
fetch(url, { next: { tags: ['posts'] } })

// Parallel: run together
const [a, b] = await Promise.all([fetchA(), fetchB()])

// Sequential: when B needs A's result
const a = await fetchA()
const b = await fetchB(a.id)
\`\`\`

### Module 9: Server Actions
\`\`\`tsx
"use server";  // File-level or function-level

// 1. Auth → 2. Validate (Zod) → 3. Execute → 4. Revalidate
async function action(prevState, formData) {
  const user = await requireAuth();
  const result = Schema.safeParse(Object.fromEntries(formData));
  if (!result.success) return { errors: result.error.flatten().fieldErrors };
  await db.create({ data: result.data });
  revalidatePath('/page');
  return { success: true };
}

// Form: <form action={action}>
// Programmatic: await action(null, formData)
// With state: useFormState(action, initialState)
// Pending: useFormStatus() → { pending }
\`\`\`

### Module 10: API Development
\`\`\`tsx
// app/api/posts/route.ts
export async function GET(req: NextRequest) { return NextResponse.json(data) }
export async function POST(req: NextRequest) { ... }

// Dynamic: app/api/posts/[id]/route.ts
export async function GET(req, { params }: { params: { id: string } }) { ... }
\`\`\`

### Module 11: Middleware
\`\`\`tsx
// middleware.ts — Edge Runtime (near user)
export function middleware(request: NextRequest) {
  // Auth check: redirect if no valid session
  // Rate limiting: with Upstash Redis
  // Tenant routing: extract subdomain
  // A/B testing: rewrite URL
}
export const config = { matcher: ['/protected/:path*'] }
// ⚠️ Edge Runtime: no Prisma, use jose not jsonwebtoken
\`\`\`

### Module 12: Authentication
\`\`\`
Layers:
  Middleware → quick edge check (JWT verify, no DB)
  Layout    → full DB check, redirect unauthorized
  Action    → re-verify every mutation

JWT (jose) vs Session (DB):
  JWT: stateless, hard to revoke, good for microservices
  Session: stateful, instant revocation, simple to implement

NextAuth.js: for OAuth providers (Google, GitHub)
\`\`\`

### Module 13: Database
\`\`\`tsx
// Prisma singleton (prevents hot-reload connection exhaustion)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const db = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

// Transaction:
await db.$transaction([
  db.a.create({ data: aData }),
  db.b.update({ where: { id }, data: bData }),
]);
\`\`\`

### Module 14: Forms & Validation
\`\`\`
Client validation: react-hook-form + zodResolver (UX)
Server validation: Zod safeParse (security — always required)
Error display: field-specific errors from .flatten().fieldErrors
Multi-step: accumulate in state, submit all on final step
\`\`\`

### Module 15: State Management
\`\`\`
Server data    → Server Components (no client state needed)
URL state      → searchParams + router.push (filters, pagination)
UI state       → useState (modal, tab, form input)
Shared UI      → Context (theme, locale — infrequent changes)
Complex global → Zustand + persist (cart, notifications)
Remote data    → TanStack Query (with caching + mutations)
\`\`\`

### Module 16: Performance
\`\`\`
Images:   next/image — WebP, lazy load, layout shift prevention
          priority prop for LCP (Largest Contentful Paint) image
Fonts:    next/font — no external request, no layout shift
Code:     dynamic() for heavy client-only libs
Streaming: Suspense wrapping slow components
Cache:    ISR for public pages, cache() for DB deduplication
Bundle:   ANALYZE=true npm run build
\`\`\`

### Module 17: SEO
\`\`\`tsx
// Static: export const metadata: Metadata = { title, description, openGraph }
// Dynamic: export async function generateMetadata({ params }) { return ... }
// Template: title: { template: '%s | Site', default: 'Site' }
// Sitemap: app/sitemap.ts → /sitemap.xml
// Robots: app/robots.ts → /robots.txt
// JSON-LD: <script type="application/ld+json"> in JSX
// hreflang: alternates.languages in metadata
\`\`\`

### Module 18: Error Handling
\`\`\`
error.tsx:        catches errors in page.tsx, must be "use client"
                  has reset() to retry without full reload
not-found.tsx:    triggered by notFound() in Server Components
global-error.tsx: catches errors in root layout.tsx
Promise.allSettled: graceful degradation for multi-source pages
Never expose real errors to users — log server-side
\`\`\`

### Module 19: Security
\`\`\`
Never trust client: get userId from session, not form data
Server Actions:    auth → authz → validate → execute
Security headers:  X-Frame-Options, CSP, HSTS in next.config.ts
SQL injection:     Prisma/Drizzle parameterize automatically
XSS:              React escapes JSX; sanitize dangerouslySetInnerHTML
Env vars:          NEXT_PUBLIC_ is public; secrets are server-only
\`\`\`

### Module 20: i18n
\`\`\`
URL-based routing: /en/*, /fr/* — enables SSG + SEO
Library: next-intl — Server + Client Component support
Translation files: messages/en.json, messages/fr.json
ICU format: pluralization, variables, date formatting
RTL: dir="rtl" on html element for Arabic/Hebrew
hreflang: alternates.languages in generateMetadata
\`\`\`

### Module 21: Deployment
\`\`\`
Vercel:     git push → auto deploy. Best DX. Built by Next.js team.
Docker:     output: 'standalone' → minimal image → any platform
CI/CD:      type-check → lint → test → build → deploy
Env vars:   .env.local (never commit), .env.example (commit)
Validate:   @t3-oss/env-nextjs — fail fast on missing vars
Migrations: prisma migrate deploy (not dev) in CI/CD
\`\`\`

### Module 22: Scalable Architecture
\`\`\`
Feature-sliced: features/[domain]/{components,actions,queries,schemas}
Data layer:     queries.ts for reads, actions.ts for writes
Service layer:  complex business logic (billing, notifications)
Pages:          thin composers, call feature components
Shared:         components/ui/ (design system), lib/ (infrastructure)
cache():        on all query functions (deduplication)
\`\`\`

### Module 23: System Design
\`\`\`
Multi-tenant:  subdomain routing in middleware + tenantId on all queries
E-commerce:    DB transactions for inventory (prevent race conditions)
Real-time:     SSE (one-way, serverless) or WebSockets (two-way, persistent)
Caching:       Edge CDN → Route Cache → Data Cache → Request Memo → React cache()
Concurrency:   updateMany with condition OR SELECT FOR UPDATE
\`\`\`

---

## Quick Reference: Which Directive/Pattern to Use

\`\`\`
I need to:                        | Use:
──────────────────────────────────|──────────────────────────────────
Query DB in component             | Server Component (no directive)
Handle a button click             | Client Component ("use client")
Handle a form submission          | Server Action ("use server")
Create a REST API endpoint        | Route Handler (route.ts)
Protect all routes in a section   | Middleware (middleware.ts)
Fetch data from an external API   | fetch() in Server Component
Share data between components     | Pass as props (Server) or Context/Zustand (Client)
Cache a DB query                  | React cache() function
Invalidate cache after mutation   | revalidatePath() or revalidateTag()
Show content while loading        | Suspense with fallback
Handle errors gracefully          | error.tsx in route segment
Show 404 page                     | notFound() function
Redirect to another page          | redirect() (server) or router.push() (client)
\`\`\`

---

## The 20 Concepts Every Next.js Developer Must Know

1. Server Components — async, zero JS, direct DB
2. Client Components — "use client", runs on server + client
3. App Router file conventions — page.tsx, layout.tsx, loading.tsx, error.tsx
4. Dynamic routes — [id], [...slug], [[...slug]]
5. Route groups — (group) — layouts without URL impact
6. Server Actions — "use server", form handling, mutations
7. Route Handlers — route.ts, REST API endpoints
8. Rendering strategies — CSR, SSR, SSG, ISR
9. Static vs dynamic rendering — triggers: cookies, headers, searchParams
10. Data caching — force-cache, no-store, revalidate, cache()
11. revalidatePath vs revalidateTag — path vs tag-based invalidation
12. Streaming — Suspense boundaries, progressive HTML
13. generateStaticParams — pre-render dynamic routes at build time
14. generateMetadata — dynamic SEO metadata
15. Middleware — Edge Runtime, runs before routes, auth/rate limiting
16. next/image — WebP, lazy load, priority, layout shift prevention
17. next/font — no external request, no layout shift
18. next/dynamic — code splitting for heavy client components
19. Defense in depth auth — middleware → layout → action
20. Error handling — error.tsx, notFound(), global-error.tsx

---

## The Day-Before-Interview Checklist

\`\`\`
30 minutes each:

□ Write a Server Component from memory that:
  - Queries a database
  - Handles not-found
  - Has dynamic metadata
  - Uses generateStaticParams

□ Write a Server Action from memory that:
  - Checks authentication
  - Validates with Zod
  - Executes the mutation
  - Revalidates the cache
  - Returns typed state

□ Explain these out loud:
  - "use client" = runs on BOTH server and browser, not just browser
  - Server Actions create POST endpoints automatically
  - Why you use middleware for auth (Edge, fast, no DB)
  - What ISR is and when you'd use it over SSG or SSR
  - How Suspense enables streaming

□ Read your project's README once
  - Be ready to explain every architectural decision
  - Know what you would improve
\`\`\``,

  codeExamples: [
    {
      title: 'Complete Next.js pattern — all concepts in 80 lines',
      code: `// This 80-line snippet covers ALL the major patterns.
// Memorize the structure, not the content.

// 1. Server Component page with all patterns
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { cache } from 'react';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// ── Data layer ──────────────────────────────────────────────────────
const getProduct = cache(async (id: string) => {
  return db.product.findUnique({ where: { id } });
});

// ── Static params (SSG) ─────────────────────────────────────────────
export async function generateStaticParams() {
  const products = await db.product.findMany({ select: { id: true } });
  return products.map(p => ({ id: p.id }));
}

// ── Dynamic metadata ────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) return { title: 'Not Found' };
  return { title: product.name, description: product.description };
}

// ── Server Action ───────────────────────────────────────────────────
async function addToCart(formData: FormData) {
  'use server';
  const user = await requireAuth();           // 1. Auth
  const productId = formData.get('id') as string;
  if (!productId) return;                     // 2. Validate
  await db.cartItem.create({
    data: { userId: user.id, productId },     // 3. Execute
  });
  revalidatePath('/cart');                    // 4. Revalidate
}

// ── Streaming async component ───────────────────────────────────────
async function Reviews({ productId }: { productId: string }) {
  const reviews = await db.review.findMany({ where: { productId } });
  return (
    <ul>{reviews.map(r => <li key={r.id}>{r.text}</li>)}</ul>
  );
}

// ── Page component ─────────────────────────────────────────────────
export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  return (
    <main>
      <h1>{product.name}</h1>
      <p>\${product.price}</p>

      {/* Server Action form */}
      <form action={addToCart}>
        <input type="hidden" name="id" value={product.id} />
        <button type="submit">Add to Cart</button>
      </form>

      {/* Streaming — Reviews load independently */}
      <Suspense fallback={<p>Loading reviews...</p>}>
        <Reviews productId={product.id} />
      </Suspense>
    </main>
  );
}`,
      explanation:
        'Every major pattern in one file: cache() for deduplication, generateStaticParams for SSG, generateMetadata for SEO, "use server" Server Action with auth, notFound() for 404, and Suspense for streaming. This is the skeleton of 80% of production Next.js pages.',
    },
  ],

  commonMistakes: [],

  interviewQuestions: [
    {
      question: 'If you had to explain Next.js to someone who has never heard of it, what would you say?',
      answer:
        "Next.js is a framework on top of React that adds three things React does not have: (1) Rendering strategies — instead of always rendering in the browser (slow, bad for SEO), Next.js can render pages on the server at build time or request time, so users see content instantly and search engines can index it. (2) File-based routing — instead of configuring React Router, you create files in a directory and they become pages automatically. (3) Full-stack capabilities — you can write database queries and API endpoints in the same project as your React components, so you don't need a separate backend. The result: a single Next.js project replaces what used to be a React frontend + a separate Express or Django backend.",
      difficulty: 'beginner',
    },
    {
      question: 'What is the single most important concept to understand in Next.js App Router?',
      answer:
        "Server Components. Everything else builds on top of this. Server Components are React components that run only on the server — they never send JavaScript to the browser. They can query databases directly, use environment variables, and access the file system. The App Router makes Server Components the default, which means your first instinct should always be: 'Can this be a Server Component?' The answer is yes for anything that only needs to render HTML from data — product listings, blog posts, user profiles. Only add 'use client' when you genuinely need browser-specific features: event handlers, useState, useEffect, or browser APIs. This mental shift from 'everything is client-side React' to 'start on the server, add client only where needed' is what makes Next.js fundamentally different from a React SPA.",
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'revision-ex-1',
      title: 'The Full Review',
      description: `Complete this revision exercise before interviews or to test your understanding:

**Round 1 — Terminology (5 min)**: Define these without looking at notes:
1. RSC (React Server Component)
2. "use client" directive
3. ISR (Incremental Static Regeneration)
4. RSC payload
5. Server Action

**Round 2 — Code from memory (15 min)**: Write from scratch:
1. A Server Component that queries a database and handles 404
2. A Server Action with auth, validation, and cache revalidation
3. A middleware that protects /dashboard routes

**Round 3 — Architecture (10 min)**: Answer out loud:
1. How would you structure a Next.js project for a team of 5?
2. Where would you put authentication logic and why?
3. When would you use URL state vs useState vs Zustand?

**Round 4 — Debugging (10 min)**: What's wrong?
1. \`"use client"; async function MyComponent() { const data = await db.users.findMany(); ... }\`
2. \`export default function Page() { const [count, setCount] = useState(0); return <div>{count}</div> }\` (file has no "use client")
3. A middleware that uses \`import { PrismaClient } from '@prisma/client'\``,
      starterCode: `// Write your answers here:

// Round 1: Definitions
const definitions = {
  rsc: '',
  useClient: '',
  isr: '',
  rscPayload: '',
  serverAction: '',
};

// Round 2: Write the code
// Server Component:

// Server Action:

// Middleware:

// Round 4: Debugging
const bugs = {
  bug1: '', // What's wrong?
  bug2: '', // What's wrong?
  bug3: '', // What's wrong?
};`,
      solution: `// Round 1: Definitions
const definitions = {
  rsc: 'React Server Components — components that run only on the server, zero JS to browser, can access DB directly',
  useClient: 'Marks module as "use client" boundary — component ships to browser AND runs there. Does NOT mean only-browser.',
  isr: 'Incremental Static Regeneration — pages pre-built at build time, regenerated in background after revalidate TTL expires',
  rscPayload: 'Serialized representation of the Server Component render tree. Sent during client-side navigation to update page without full reload.',
  serverAction: '"use server" function that creates a POST endpoint — called from Client Components, runs on server, handles mutations.',
};

// Round 4: Bugs
const bugs = {
  bug1: '"use client" prevents async/await — Client Components cannot be async. Remove "use client" and make it a Server Component instead.',
  bug2: 'useState in a Server Component — all components in App Router are Server Components by default. Add "use client" at the top.',
  bug3: 'Prisma in middleware (Edge Runtime) — Edge Runtime has no access to native Node.js modules Prisma needs. Use jose for JWT verification instead.',
};`,
      hints: [
        'Bug 3 is the most commonly missed — Prisma cannot run in Edge Runtime',
        'Round 2: write the auth check first, then validation, then mutation',
        'The mental model for where state lives: server data (Server Components), UI state (useState), shared state (Context/Zustand), URL state (searchParams)',
        'Architecture question answer: feature-sliced design by domain, not by technical layer',
      ],
    },
  ],

  keyTakeaways: [
    'The core mental model: stay on the server by default, add client only for interactivity.',
    'Server Components: async, zero JS, direct DB — the foundation of App Router.',
    '"use client" means runs on BOTH server (SSR) and browser (hydration) — not just browser.',
    'Four rendering strategies: CSR (browser), SSR (per-request), SSG (build time), ISR (build + refresh).',
    'Server Actions: auth → validate → execute → revalidate. Always in this order.',
    'Defense in depth: middleware (Edge) + layout (Server) + action (re-verify).',
    'Performance trifecta: next/image (LCP), next/font (no shift), Suspense (streaming).',
    'Feature-sliced architecture: organize by business domain for maintainable codebases at scale.',
  ],
};
