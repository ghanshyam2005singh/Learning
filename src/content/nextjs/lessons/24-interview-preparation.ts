import type { Lesson } from '@/types';

export const interviewPreparationLesson: Lesson = {
  id: 'nextjs-interview-preparation',
  slug: 'nextjs-interview-preparation',
  title: 'Interview Preparation',
  description:
    'Comprehensive Next.js interview prep — 50 most common questions from beginner to senior level, with full answers, follow-ups, and the mental framework interviewers expect.',
  category: 'Interview',
  order: 24,
  difficulty: 'intermediate',
  estimatedTime: 90,
  prevLesson: 'nextjs-system-design',
  nextLesson: 'nextjs-practice',

  content: `# Next.js Interview Preparation

## How Interviews Work

Next.js interviews at most companies follow this pattern:

1. **Conceptual round** — "What is X? How does Y work? Why would you use Z?"
2. **Code round** — Live coding, often: implement a Server Component, fix a bug, design a form
3. **Architecture round** — "How would you build X? Walk me through your design decisions"
4. **Debugging round** — "This code has a bug. Find and fix it."

The key insight: interviewers do not want memorized definitions. They want to see that you **understand the WHY** behind each concept and can **apply it in practice**.

---

## Beginner Level Questions

### Q1: What is Next.js and what problems does it solve?

**What they're really asking:** Do you understand why Next.js exists beyond "it's a React framework"?

**Full answer:**
Next.js is a React framework that adds full-stack capabilities and rendering strategies that React alone does not provide. It was created to solve three main problems with React SPAs:

1. **Performance and SEO**: React SPAs send an empty HTML file to the browser. JavaScript loads, executes, and renders the page. Search engines and users must wait for JS to render content. Next.js renders pages on the server and sends ready HTML — both search engines and users see content immediately.

2. **No routing**: React has no built-in router. You need React Router, have to configure code splitting yourself, and handle nested layouts manually. Next.js provides file-based routing where the directory structure IS the routing structure — zero configuration.

3. **No full-stack**: React-only apps need a separate backend (Express, FastAPI, etc.) for data access and APIs. Next.js allows you to write server code (Server Components, Server Actions, Route Handlers) in the same project as your React components.

---

### Q2: What is the difference between the App Router and Pages Router?

**Full answer:**

| Feature | Pages Router (old) | App Router (new) |
|---|---|---|
| Default component | Client Component | Server Component |
| Data fetching | getServerSideProps, getStaticProps | async/await directly in component |
| Layouts | Custom _app.js | Nested layout.tsx files |
| Loading states | Custom loading logic | loading.tsx |
| Streaming | Not supported | Built-in via Suspense |
| Server Actions | Not available | Built-in |
| Metadata | next/head | export const metadata |

App Router is the future. All new projects should use it. Pages Router is legacy and only maintained for backwards compatibility.

---

### Q3: What is a Server Component?

**Full answer:**
A Server Component is a React component that runs ONLY on the server — it is never sent to the browser as JavaScript. It renders to HTML (and RSC payload for client updates), and the resulting output is what the browser receives.

Key properties:
- Can directly access databases, file system, environment variables
- Cannot use useState, useEffect, or browser APIs
- Zero JS contribution to the client bundle
- Can be async — \`async function ProductPage() { const data = await db.query(); }\`

In Next.js App Router, ALL components are Server Components by default.

---

### Q4: When would you use a Client Component?

**Full answer:**
Use a Client Component when you need:
- **Interactivity**: event handlers (onClick, onChange, onSubmit)
- **State**: useState, useReducer, useContext
- **Lifecycle**: useEffect, custom hooks
- **Browser APIs**: localStorage, window, navigator
- **Navigation hooks**: useRouter, usePathname, useSearchParams
- **Real-time**: WebSockets, SSE (EventSource)

Best practice: Keep Client Components as small and as leaf-like as possible. Push interactivity to the smallest possible component — keep parents as Server Components.

---

### Q5: What is the "use client" directive?

**Full answer:**
\`"use client"\` is a React directive (not a Next.js-specific thing) that marks the module as the **boundary between server and client**. It means: "This component and everything imported by it will be included in the JavaScript bundle sent to the browser."

Important misconception: \`"use client"\` does NOT mean "only runs in the browser". Client Components still render on the server during the initial HTML generation (SSR). They just ALSO render on the client during hydration. \`"use client"\` means "runs on both server and client".

---

## Intermediate Level Questions

### Q6: What are the four rendering strategies? When would you use each?

**Full answer:**

1. **CSR (Client-Side Rendering)**: JavaScript renders the UI in the browser. No content in initial HTML. Good for: highly interactive UIs, dashboards behind auth, admin panels.

2. **SSR (Server-Side Rendering)**: Page generated fresh for every request. Good for: personalized content (shopping cart, user profile), real-time data, pages with sensitive data.

3. **SSG (Static Site Generation)**: Page generated once at build time. Served as a static HTML file. Good for: marketing pages, blogs, documentation — content that does not change per user.

4. **ISR (Incremental Static Regeneration)**: Page pre-generated at build time, then regenerated in the background after a TTL expires. Good for: news articles, product pages, content that changes but not real-time.

In Next.js App Router, the default is static rendering. A route becomes dynamically rendered when you use \`cookies()\`, \`headers()\`, \`searchParams\`, or \`{ cache: 'no-store' }\`.

---

### Q7: How does caching work in Next.js?

**Full answer:**
Next.js has five caching layers (from fastest to slowest):

1. **Router Cache** (client): Pages visited are cached in the browser memory. Back navigation is instant.
2. **Full Route Cache** (server): Static routes are stored as HTML + RSC payload files on the server filesystem.
3. **Data Cache** (server): Extended \`fetch()\` with \`next: { revalidate }\` or \`force-cache\` caches API responses persistently.
4. **Request Memoization** (per-request): The same \`fetch()\` URL called multiple times in one render is deduplicated — only one network request.
5. **React cache()**: Wrapping a function with \`cache()\` deduplicates DB calls — the same query function called from multiple components runs once per request.

---

### Q8: What is a Server Action?

**Full answer:**
A Server Action is a function marked with \`"use server"\` that can be called from a Client Component but executes on the server. It is the recommended way to handle mutations (create, update, delete) in Next.js App Router.

How it works technically: Next.js creates a POST endpoint for each Server Action. When called from a Client Component, the browser sends a POST request with serialized arguments. The server executes the function and returns the result.

Benefits:
- Works without JavaScript (forms with Server Actions work even when JS is disabled)
- Automatically CSRF-protected (Origin header check)
- Direct database access without an API layer
- Can revalidate cache after mutation

Usage: \`<form action={myServerAction}>\` or \`await myServerAction(data)\` from event handlers.

---

### Q9: How does Streaming work in Next.js?

**Full answer:**
HTTP streaming allows the server to send parts of the HTML response progressively, rather than waiting for everything to be ready. Next.js uses React Suspense to enable streaming.

\`\`\`tsx
export default function Page() {
  return (
    <>
      <FastContent />      {/* Sent immediately */}
      <Suspense fallback={<Skeleton />}>
        <SlowContent />    {/* Sent when ready (1s later) */}
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <VerySlowContent /> {/* Sent when ready (3s later) */}
      </Suspense>
    </>
  );
}
\`\`\`

Browser receives: FastContent HTML immediately, then SlowContent at 1s, then VerySlowContent at 3s. Without streaming, the user would wait 3 seconds for anything. With streaming, they see content progressively.

---

### Q10: What is the difference between revalidatePath and revalidateTag?

**Full answer:**
Both invalidate the Next.js Data Cache and Full Route Cache, but they work differently:

**revalidatePath('/blog')**: Invalidates all cached data for a specific URL path. Everything on /blog will be refetched on the next request.

**revalidateTag('posts')**: Invalidates all cached fetch() calls that were tagged with 'posts', regardless of which pages they appear on. A fetch tagged with 'posts' that appears on /blog, /home, and /author/123 would all be invalidated.

Use revalidateTag when the same data appears on multiple pages. Use revalidatePath when you know exactly which page needs to update.

---

## Advanced Level Questions

### Q11: What is the RSC payload?

**Full answer:**
RSC (React Server Component) payload is a special data format that Next.js uses to enable Client Components to update when navigating between pages without a full HTML reload.

When you click a \`<Link>\` to navigate: Next.js fetches the RSC payload for the new page instead of a full HTML page. The payload is a serialized representation of the React component tree — it contains the rendered output of Server Components and references to Client Components (not their full bundle — those are already loaded).

This is why Next.js navigation feels instant compared to full page reloads: Server Components re-render on the server (only the RSC payload travels), but Client Components are already hydrated and only need their props updated.

---

### Q12: How do you implement authentication across all layers in Next.js?

**Full answer:**
Next.js has four layers where auth must be checked:

1. **Middleware (Edge)**: Protect routes at the CDN edge before any server work. Use jose (edge-compatible JWT) to verify the session cookie. Redirect to login if invalid. This is the first and cheapest check — no DB access.

2. **Layout (Server Component)**: Verify in the root layout for protected sections. Can do a full DB lookup to check if the user/session still exists. Redirect if expired.

3. **Route Handlers**: Check auth in every Route Handler before returning data.

4. **Server Actions**: Re-verify auth in every Server Action before executing mutations. Actions are POST endpoints anyone can call directly — UI restrictions are not enough.

Defense in depth: each layer catches different attack vectors. Middleware catches unauthenticated requests. Layout verifies against DB. Server Actions re-verify because they can be called directly bypassing the UI.

---

### Q13: When would you use middleware?

**Full answer:**
Middleware runs on the Edge Runtime before a request reaches a route. Use it for:

1. **Authentication**: Block unauthenticated requests before any server work
2. **Redirects**: Locale-based redirects, A/B testing routing
3. **Rate limiting**: With Redis (Upstash), limit requests per IP
4. **Bot protection**: Check User-Agent or use Cloudflare Turnstile
5. **Tenant routing**: Extract tenant from subdomain, rewrite URL
6. **Feature flags**: Route to different page variants

Do NOT use middleware for: database-heavy operations, user role checks (no DB access is fast in middleware), complex business logic.

Edge Runtime limitations: no Prisma, no Node.js core modules, no native bindings. Use jose instead of jsonwebtoken for JWT.

---

### Q14: How do you optimize a Next.js app for performance?

**Full answer:**
Performance optimization in layers:

**Images**: Always use next/image. Add \`priority\` to the LCP image. Provide correct \`sizes\` hint.

**Fonts**: Use next/font — eliminates external font request, prevents layout shift.

**Server Components**: Default in App Router. Zero JS for server components means smaller bundle.

**Streaming**: Wrap slow components in Suspense. Users see fast content while slow content loads.

**Code splitting**: Dynamic import heavy libraries. next/dynamic with ssr: false for client-only libs.

**Caching**: Use ISR for public content. Tag fetches for on-demand revalidation. Use cache() for deduplication.

**Bundle analysis**: ANALYZE=true npm run build. Identify large dependencies.

---

## Code Questions You May Be Asked

### Q15: Write a protected Server Action

\`\`\`tsx
"use server";
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

const schema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(10),
});

export async function createPost(prevState: any, formData: FormData) {
  // 1. Auth
  const user = await requireAuth();

  // 2. Validate
  const result = schema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  // 3. Execute
  const post = await db.post.create({
    data: { ...result.data, authorId: user.id },
  });

  revalidatePath('/blog');
  return { success: true, id: post.id };
}
\`\`\`

### Q16: Explain what's wrong with this code

\`\`\`tsx
// ❌ Bug: accessing DB from Client Component
"use client";

export async function UserList() {
  const users = await db.user.findMany(); // ← Error: db not available in client
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// ✅ Correct: Server Component for DB access
// Remove "use client" — default is Server Component
export async function UserList() {
  const users = await db.user.findMany(); // Works in Server Component
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
\`\`\``,

  codeExamples: [
    {
      title: 'The 10-minute review — most tested concepts at a glance',
      code: `// 1. Server Component — async, direct DB, no useState
export default async function Page() {
  const data = await db.post.findMany(); // ← async DB call
  return <PostList posts={data} />;
}

// 2. Client Component — event handlers, useState
"use client";
export function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(p => !p)}>{liked ? '❤️' : '🤍'}</button>;
}

// 3. Server Action — "use server", auth, validate, mutate
"use server";
export async function likePost(postId: string) {
  const user = await requireAuth();  // ← Auth check
  await db.like.create({ data: { postId, userId: user.id } });
  revalidatePath(\`/posts/\${postId}\`);  // ← Cache invalidation
}

// 4. Route Handler — named exports for HTTP methods
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const post = await db.post.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

// 5. Metadata — title template + dynamic
export const metadata: Metadata = { title: { template: '%s | Site', default: 'Site' } };

export async function generateMetadata({ params }) {
  const post = await getPost(params.id);
  return { title: post.title, description: post.excerpt };
}

// 6. Suspense + streaming
export default function Page() {
  return (
    <>
      <Header />
      <Suspense fallback={<Skeleton />}>
        <SlowSection />       {/* Streams independently */}
      </Suspense>
    </>
  );
}

// 7. Dynamic route + generateStaticParams
export function generateStaticParams() {
  return posts.map(p => ({ slug: p.slug }));  // Pre-render all at build time
}`,
      explanation:
        'These seven patterns cover ~80% of Next.js interview questions. Know each one cold: Server Component (async, DB), Client Component (state/events), Server Action (auth+validate+mutate), Route Handler (HTTP methods), Metadata (static+dynamic), Suspense (streaming), generateStaticParams (SSG for dynamic routes).',
    },
  ],

  commonMistakes: [
    'Confusing "use client" with "only runs in browser" — Client Components run on BOTH server (SSR) and client (hydration).',
    'Thinking Server Actions require an API endpoint — they create POST endpoints automatically.',
    'Not knowing the rendering strategies and when to use each — interviewers commonly ask this.',
    'Forgetting that middleware runs on Edge Runtime — no Prisma, no jsonwebtoken in middleware.',
    'Not understanding the caching layers — know Request Memoization vs Data Cache vs Full Route Cache.',
    'Being vague about security — always specify auth + authz + validation in Server Actions.',
  ],

  interviewQuestions: [
    {
      question: 'How does Next.js App Router differ from a traditional MVC backend?',
      answer:
        "In a traditional MVC backend, you have separate Model (DB), View (template), and Controller (route handler). The browser makes a request, the controller fetches data, passes it to the template, and returns HTML. Next.js collapses this: Server Components ARE the controller and view combined — they fetch data (model) and render HTML (view) in one function. Server Actions are the controllers for mutations. Route Handlers are explicit API endpoints when you need them for external consumers. The key difference: in Next.js, the 'controller logic' lives right next to the React component that uses it — there is no separate routing file or controller class. This colocation is more maintainable for frontend developers and eliminates the round trip between frontend API calls and backend controllers for most operations.",
      difficulty: 'advanced',
    },
  ],

  exercises: [
    {
      id: 'interview-ex-1',
      title: 'Practice: explain these concepts out loud',
      description: `Practice explaining each concept without looking at notes. Record yourself or explain to someone:

1. Explain RSC (React Server Components) to a non-technical person
2. Explain why "use client" does NOT mean "only runs in browser"
3. Explain when you would choose SSG vs SSR vs ISR for a product page
4. Explain how a Server Action works under the hood
5. Explain why middleware uses Edge Runtime (not Node.js)

For each, aim for: clear definition → concrete example → real-world use case.`,
      starterCode: `// Practice template — fill in each explanation

const explanations = {
  rsc: \`
    RSC is...
    Example: ...
    Used when: ...
  \`,

  useClient: \`
    "use client" means...
    Common misconception: ...
    Actually happens: ...
  \`,

  // ... fill in the rest
};`,
      solution: `// Sample answers (your words may differ — that's fine):

const explanations = {
  rsc: \`
    RSC (React Server Components) are React components that run only on the server.
    They generate HTML which is sent to the browser, but no JavaScript for the component
    itself is sent. Think of them like PHP or Django templates that can also import
    npm packages and run async code.

    Example: A ProductList component that queries the database directly —
    it renders the list as HTML, sends that HTML to the browser, but the database
    query code never runs in the browser.

    Used when: Most of your app — any component that doesn't need browser events
    or state should be a Server Component by default.
  \`,

  useClient: \`
    "use client" marks the boundary where React starts including code in the
    browser JavaScript bundle. It does NOT mean the component only runs in the browser.

    Common misconception: "use client" = only runs in browser (WRONG)
    Actually: Client Components render TWICE —
      1. On the server during initial page generation (produces HTML)
      2. In the browser during hydration (makes it interactive)

    The "client" in "use client" means "this code ships to the client (browser)",
    not "this code only runs on the client."
  \`,

  ssgVsSsrVsIsr: \`
    Product page rendering strategy decision:

    SSG (Static): Build-time render, cached as HTML file.
    Use for: Products that rarely change, SEO-critical pages with high traffic.
    "The iPhone 15 product page content is the same for everyone."

    SSR (Dynamic): Renders fresh for every request.
    Use for: Personalized pricing, real-time inventory, A/B test variants.
    "Show different price for logged-in users vs. guests."

    ISR (best of both): Pre-rendered at build time, regenerated in background after TTL.
    Use for: Most product pages — accurate within an hour is fine.
    "Regenerate every hour. User sees the cached version instantly,
    background refresh ensures fresh data within an hour."
  \`,
};`,
      hints: [
        'The best answers have: definition → concrete analogy → when/when not to use',
        'Interviewers notice when you say "use client means client-only" — this is a very common mistake',
        'For rendering strategies, always ground the answer in a real use case',
        'Practice saying these explanations out loud — writing is different from speaking',
      ],
    },
  ],

  keyTakeaways: [
    '"use client" means code ships to the browser AND runs there — components still SSR on server initially.',
    'Server Components are async, zero JS to browser, direct DB access — default in App Router.',
    'Server Actions create POST endpoints automatically, work without JS, are CSRF-protected.',
    'Rendering strategy choice: SSG for public cacheable content, SSR for personalized/real-time, ISR for most product pages.',
    'Auth defense in depth: middleware (edge) → layout (DB check) → action (re-verify for mutations).',
    'Caching layers from fast to slow: Router Cache → Full Route Cache → Data Cache → Request Memoization → React cache().',
    'Streaming: Suspense boundaries are independent — each section streams when ready, fast sections do not wait for slow ones.',
    'The most common interview mistake: not knowing WHY a concept exists — always know the problem it solves.',
  ],
};
