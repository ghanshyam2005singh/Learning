import type { Lesson } from '@/types';

export const projectStructureLesson: Lesson = {
  id: 'nextjs-project-structure',
  slug: 'nextjs-project-structure',
  title: 'Project Structure & App Router',
  description:
    'Master the App Router directory structure, file conventions (page, layout, loading, error, template), route segments, route groups, and professional project organization.',
  category: 'Project Structure',
  order: 3,
  difficulty: 'beginner',
  estimatedTime: 40,
  prevLesson: 'nextjs-architecture',
  nextLesson: 'nextjs-routing',

  content: `# Project Structure & App Router

## The App Router Directory

The App Router uses the \`/app\` directory. Every folder inside \`/app\` represents a URL segment. The structure of your folders IS your routing structure.

\`\`\`
app/
├── page.tsx          → /
├── about/
│   └── page.tsx      → /about
├── blog/
│   ├── page.tsx      → /blog
│   └── [slug]/
│       └── page.tsx  → /blog/anything
└── dashboard/
    ├── page.tsx      → /dashboard
    └── settings/
        └── page.tsx  → /dashboard/settings
\`\`\`

The rule: **a folder creates a route segment. A \`page.tsx\` file makes that segment publicly accessible.**

---

## Reserved File Names

The App Router has special file names with specific purposes. You must know all of them:

### page.tsx — The route's UI
Makes a route segment publicly accessible. Without \`page.tsx\`, the route does not exist in the browser.

\`\`\`tsx
// app/about/page.tsx
// Accessible at: /about

export default function AboutPage() {
  return <h1>About Us</h1>;
}
\`\`\`

### layout.tsx — Persistent shell around routes
Wraps all pages in its directory AND all nested directories. Does NOT re-render when navigating between children. Perfect for navigation, sidebars, headers that persist across pages.

\`\`\`tsx
// app/layout.tsx — Root layout (required)
// Wraps EVERY page in your application

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>My App</header>
        <main>{children}</main>
        <footer>© 2024</footer>
      </body>
    </html>
  );
}
\`\`\`

\`\`\`tsx
// app/dashboard/layout.tsx — Dashboard layout
// Wraps all pages under /dashboard/*
// The RootLayout wraps this layout

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />          {/* Persists across all dashboard pages */}
      <main>{children}</main>
    </div>
  );
}
\`\`\`

**Layout nesting:** Layouts nest inside each other. The Root layout wraps the dashboard layout which wraps the page. A user navigating from /dashboard/overview to /dashboard/settings: the Root layout and Dashboard layout do NOT re-render. Only the page component changes.

### loading.tsx — Instant loading UI
Automatically shown while a page or Suspense boundary is loading. Built on React Suspense.

\`\`\`tsx
// app/dashboard/loading.tsx
// Shown while app/dashboard/page.tsx is loading

export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48 mb-4" />
      <div className="h-64 bg-gray-200 rounded" />
    </div>
  );
}
\`\`\`

### error.tsx — Error boundary for a route
Catches errors thrown during rendering in its route segment. Must be a Client Component (error boundaries require class components or the "use client" hook pattern).

\`\`\`tsx
// app/dashboard/error.tsx
"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;  // Call to retry rendering
}) {
  return (
    <div>
      <h2>Something went wrong in the dashboard</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
\`\`\`

### not-found.tsx — 404 page
Rendered when \`notFound()\` is called or no matching route exists.

\`\`\`tsx
// app/not-found.tsx — Global 404 page

export default function NotFound() {
  return (
    <div>
      <h1>404 — Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}
\`\`\`

### template.tsx — Re-rendering layout
Like layout.tsx, but creates a new instance on every navigation. Use when you need animations that trigger on route change, or per-page setup/teardown.

\`\`\`tsx
// app/template.tsx
// Unlike layout.tsx, this RE-RENDERS on every navigation

"use client";
import { motion } from 'framer-motion';

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
\`\`\`

### route.ts — API endpoint
Not a page — this creates a REST API endpoint. No \`page.tsx\` needed.

\`\`\`tsx
// app/api/users/route.ts
// Accessible at: GET/POST /api/users

export async function GET() {
  const users = await db.user.findMany();
  return Response.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  const user = await db.user.create({ data: body });
  return Response.json(user, { status: 201 });
}
\`\`\`

### middleware.ts — Runs before every request
Not inside \`/app\` — lives at the root of your project.

\`\`\`
my-app/
├── app/
├── middleware.ts   ← Root level, not inside /app
└── package.json
\`\`\`

---

## File Convention Summary

| File | Purpose | Wraps children? | Re-renders on nav? |
|---|---|---|---|
| page.tsx | Public route UI | No | Yes |
| layout.tsx | Persistent wrapper | Yes | No |
| template.tsx | Re-rendering wrapper | Yes | Yes |
| loading.tsx | Suspense fallback | No | Per navigation |
| error.tsx | Error boundary | No | On error |
| not-found.tsx | 404 page | No | On 404 |
| route.ts | API endpoint | No | Per request |

---

## Route Groups: Organize Without Affecting URLs

Wrap a folder name in parentheses to create a route group. Route groups do NOT appear in the URL.

\`\`\`
app/
├── (marketing)/
│   ├── layout.tsx         ← Marketing layout (no sidebar)
│   ├── page.tsx           → /
│   ├── about/
│   │   └── page.tsx       → /about
│   └── pricing/
│       └── page.tsx       → /pricing
│
└── (app)/
    ├── layout.tsx         ← App layout (with sidebar, requires auth)
    ├── dashboard/
    │   └── page.tsx       → /dashboard
    └── settings/
        └── page.tsx       → /settings
\`\`\`

The URL \`/about\` does NOT have "(marketing)" in it. Route groups are purely organizational — different layouts for different sections without polluting URLs.

**Best use case:** A SaaS product where marketing pages (\`/\`, \`/pricing\`, \`/about\`) have a different layout than the authenticated app (\`/dashboard\`, \`/settings\`).

---

## Dynamic Segments

Square brackets create dynamic segments:

\`\`\`
app/
├── blog/
│   └── [slug]/
│       └── page.tsx    → /blog/my-first-post, /blog/next-js-guide, etc.
│
├── products/
│   └── [id]/
│       └── page.tsx    → /products/123, /products/456
│
└── users/
    └── [username]/
        └── profile/
            └── page.tsx → /users/john/profile, /users/jane/profile
\`\`\`

Access the parameter via the \`params\` prop:

\`\`\`tsx
// app/blog/[slug]/page.tsx

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const post = await db.post.findUnique({
    where: { slug: params.slug },
  });

  if (!post) notFound();

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
\`\`\`

---

## The \`src/\` Directory Convention

For larger projects, put everything under \`src/\`:

\`\`\`
my-app/
├── src/
│   ├── app/          ← All routes
│   ├── components/   ← Shared components
│   ├── lib/          ← Utilities, DB client
│   ├── hooks/        ← Custom hooks
│   ├── types/        ← TypeScript types
│   └── styles/       ← Global styles
├── public/           ← Static files (images, fonts, favicon)
├── next.config.ts
├── tsconfig.json
└── package.json
\`\`\`

---

## Professional Project Organization

Here is how production Next.js applications are structured:

\`\`\`
src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx           ← Auth pages layout
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   │
│   ├── (marketing)/
│   │   ├── layout.tsx           ← Marketing layout
│   │   ├── page.tsx             ← Homepage
│   │   ├── about/page.tsx
│   │   └── pricing/page.tsx
│   │
│   ├── (app)/
│   │   ├── layout.tsx           ← Protected app layout
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── projects/
│   │       ├── page.tsx
│   │       └── [id]/
│   │           └── page.tsx
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts
│   │   └── webhooks/
│   │       └── stripe/route.ts
│   │
│   ├── layout.tsx               ← Root layout (required)
│   └── not-found.tsx
│
├── components/
│   ├── ui/                      ← Generic: Button, Input, Modal
│   ├── layout/                  ← Header, Sidebar, Footer
│   └── features/                ← Feature-specific components
│       ├── dashboard/
│       ├── auth/
│       └── projects/
│
├── lib/
│   ├── db.ts                    ← Database client (Prisma/Drizzle)
│   ├── auth.ts                  ← Auth config
│   └── utils.ts                 ← Shared utilities
│
├── hooks/                       ← Client-side custom hooks
├── types/                       ← TypeScript interfaces
└── styles/
    └── globals.css
\`\`\`

### The Colocation Pattern

Next.js allows you to colocate non-page files inside the \`/app\` directory. Only \`page.tsx\` and \`route.ts\` files are publicly accessible — everything else is invisible:

\`\`\`
app/dashboard/
├── page.tsx              ← Public: /dashboard
├── DashboardClient.tsx   ← Not public (no page.tsx)
├── types.ts              ← Not public
└── hooks.ts              ← Not public
\`\`\`

This lets you keep component files close to the routes that use them, instead of a separate \`/components\` folder for everything.

---

## What Goes Where: Decision Guide

| Code type | Where to put it |
|---|---|
| Page component | \`app/[route]/page.tsx\` |
| Shared layout | \`app/[route]/layout.tsx\` |
| API endpoint | \`app/api/[name]/route.ts\` |
| Reusable UI component | \`src/components/ui/\` |
| Feature-specific component | \`src/components/features/[feature]/\` |
| Server utility (DB queries) | \`src/lib/\` |
| Client-only hook | \`src/hooks/\` |
| TypeScript types | \`src/types/\` |
| Static files (images, fonts) | \`public/\` |
| Environment-specific config | \`.env.local\` |`,

  codeExamples: [
    {
      title: 'Layout nesting in action',
      code: `// app/layout.tsx — ROOT LAYOUT (required, wraps everything)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TopNavbar />        {/* Always visible */}
        {children}
        <Footer />          {/* Always visible */}
      </body>
    </html>
  );
}

// ──────────────────────────────────────────────────

// app/(app)/layout.tsx — APP LAYOUT (wraps /dashboard, /settings, etc.)
// This layout is nested INSIDE RootLayout
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Redirect unauthenticated users to login
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen">
      <Sidebar user={user} />    {/* Visible on all app pages */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

// ──────────────────────────────────────────────────

// app/(app)/dashboard/page.tsx
// This page is wrapped by: RootLayout > AppLayout > DashboardPage
// Accessible at: /dashboard

export default async function DashboardPage() {
  return <h1>Dashboard</h1>;
}

// When user navigates from /dashboard to /settings:
// RootLayout: NOT re-rendered (persistent)
// AppLayout: NOT re-rendered (persistent — sidebar stays)
// page.tsx: RE-RENDERED (new page content loads)`,
      explanation:
        'Layout nesting is one of the most powerful features of App Router. Persistent layouts mean navigation is instant — only the page content changes. The sidebar, header, and auth check do not need to re-run on every navigation.',
    },
    {
      title: 'Route groups for a SaaS product',
      code: `// SaaS product structure with route groups

app/
├── (marketing)/
│   ├── layout.tsx     ← Simple layout: just header + footer
│   ├── page.tsx       → / (homepage)
│   ├── pricing/
│   │   └── page.tsx   → /pricing
│   └── blog/
│       └── page.tsx   → /blog
│
├── (auth)/
│   ├── layout.tsx     ← Centered card layout for auth forms
│   ├── login/
│   │   └── page.tsx   → /login
│   └── register/
│       └── page.tsx   → /register
│
└── (app)/
    ├── layout.tsx     ← Full dashboard layout with sidebar
    ├── dashboard/
    │   └── page.tsx   → /dashboard
    └── settings/
        └── page.tsx   → /settings

// IMPORTANT: (marketing), (auth), (app) do NOT appear in URLs
// /pricing NOT /(marketing)/pricing
// /login NOT /(auth)/login
// /dashboard NOT /(app)/dashboard

// Each group has its own layout:
// Marketing: no sidebar, simple header, SEO optimized
// Auth: centered card, no navigation
// App: full sidebar, requires authentication check

// app/(marketing)/layout.tsx
export default function MarketingLayout({ children }) {
  return (
    <div>
      <MarketingHeader />
      {children}
      <MarketingFooter />
    </div>
  );
}

// app/(auth)/layout.tsx
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {children}
      </div>
    </div>
  );
}`,
      explanation:
        'Route groups let you have completely different layouts for different sections of your app without the group name appearing in the URL. This is the standard pattern for SaaS products that have both public marketing pages and a private authenticated app.',
    },
    {
      title: 'loading.tsx and error.tsx automatic integration',
      code: `// app/dashboard/
// ├── page.tsx
// ├── loading.tsx    ← Automatically shown while page.tsx loads
// └── error.tsx      ← Automatically shown if page.tsx throws

// app/dashboard/page.tsx — Simulates a slow server component
async function getExpensiveData() {
  // Simulates a 2-second database query
  await new Promise(resolve => setTimeout(resolve, 2000));
  return { revenue: 50000, users: 1234 };
}

export default async function DashboardPage() {
  const data = await getExpensiveData(); // Takes 2 seconds
  return (
    <div>
      <h1>Revenue: {data.revenue}</h1>
      <h1>Users: {data.users}</h1>
    </div>
  );
}

// ──────────────────────────────────────────────────

// app/dashboard/loading.tsx
// Automatically shown for 2 seconds while DashboardPage loads
// Next.js wraps page.tsx in <Suspense fallback={<Loading />}>

export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      <div className="h-8 bg-gray-200 rounded w-64" />
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────

// app/dashboard/error.tsx
// Automatically shown if DashboardPage throws any error
"use client"; // Error boundaries must be Client Components

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="text-center p-8">
      <h2 className="text-xl font-bold text-red-600">Dashboard failed to load</h2>
      <p className="text-gray-500 mt-2">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Retry
      </button>
    </div>
  );
}

// Next.js automatically:
// 1. Wraps page.tsx in <Suspense fallback={<DashboardLoading />}>
// 2. Wraps that in <ErrorBoundary fallback={<DashboardError />}>
// You just create the files. Next.js wires it up.`,
      explanation:
        'loading.tsx and error.tsx are automatically wired up by Next.js — you do not write any Suspense or ErrorBoundary code yourself. Just create the file in the same directory as the page and Next.js handles the integration.',
    },
  ],

  commonMistakes: [
    'Forgetting that layout.tsx does NOT re-render on navigation — if you need per-page setup (analytics page views), use template.tsx instead.',
    'Putting page.tsx inside a route group folder name — route groups (parentheses) are just for organization, the page.tsx still needs to be in the right nested folder.',
    'Confusing route.ts (API endpoint) with page.tsx (UI page) — a folder can have both, serving different purposes.',
    'Not creating a root app/layout.tsx — this is required. Next.js will error without it.',
    'Forgetting "use client" on error.tsx — error boundaries are a React class component feature that requires client-side JavaScript.',
    'Naming files incorrectly — these are exact names: page.tsx, layout.tsx, loading.tsx, error.tsx, not-found.tsx, template.tsx, route.ts.',
    'Putting sensitive logic in page.tsx thinking it is protected — if a route is accessible, so is the page. Put auth checks in layouts.',
  ],

  interviewQuestions: [
    {
      question: 'What is the difference between layout.tsx and template.tsx?',
      answer:
        "Both layout.tsx and template.tsx wrap child pages. The key difference is re-rendering behavior. layout.tsx persists across navigations — it is created once and never unmounts while navigating between children. State is preserved. This makes sidebars and headers work without re-rendering. template.tsx creates a new instance on every navigation — it unmounts and remounts. State is reset. Use layout.tsx for persistent UI (sidebar, header) and template.tsx when you need per-route behavior like page transition animations (where the animation needs to trigger on every route change) or per-route setup/teardown.",
      difficulty: 'intermediate',
    },
    {
      question: 'What are route groups and why would you use them?',
      answer:
        'Route groups are folders wrapped in parentheses (e.g., "(marketing)") that create organizational structure without affecting the URL. A file at app/(marketing)/about/page.tsx is accessible at /about, not /(marketing)/about. They are used for: (1) Different layouts for different sections — a SaaS app can have a marketing layout for public pages and a dashboard layout for authenticated pages, both starting from the root URL. (2) Organizing related routes without URL pollution. (3) Creating separate layout trees — each route group can have its own layout.tsx without interfering with other groups.',
      difficulty: 'intermediate',
    },
    {
      question: 'How does Next.js automatically handle loading and error states?',
      answer:
        'Next.js automatically wraps page.tsx in React Suspense and ErrorBoundary components based on the presence of loading.tsx and error.tsx files. When loading.tsx exists in a directory, Next.js wraps that directory\'s page in a Suspense boundary with loading.tsx as the fallback — no code needed. When error.tsx exists, it wraps the page in an ErrorBoundary with error.tsx as the fallback. This means you only write the loading UI and error UI — Next.js handles the Suspense and ErrorBoundary wiring automatically. error.tsx must be a Client Component because error boundaries use React\'s class component pattern.',
      difficulty: 'intermediate',
    },
    {
      question: 'What makes a route segment publicly accessible in Next.js App Router?',
      answer:
        "A route segment is publicly accessible ONLY when it has a page.tsx file. Creating a folder (even inside /app) does NOT create a public route. The folder defines the URL segment, but the page.tsx makes it accessible. This is important for colocation: you can put helper components, utilities, and hooks inside /app subdirectories, and they are NOT accessible via URL — only page.tsx and route.ts files are. This allows you to keep related code close to the routes that use it without exposing them as endpoints.",
      difficulty: 'beginner',
    },
  ],

  exercises: [
    {
      id: 'structure-ex-1',
      title: 'Design folder structure for a SaaS product',
      description: `Design the /app folder structure for a project management SaaS tool with these requirements:

Pages needed:
- Homepage (public, SEO, different layout)
- Pricing (public, SEO, same marketing layout)
- Login and Register (centered auth layout)
- Dashboard (requires auth, sidebar)
- Projects list (requires auth, sidebar)
- Single project view with /projects/[id] (requires auth, sidebar)
- Project settings at /projects/[id]/settings (requires auth, sidebar)
- User profile at /profile (requires auth, sidebar)
- API endpoints: GET/POST /api/projects, GET/PUT/DELETE /api/projects/[id]

Requirements:
- Marketing pages share one layout (no sidebar)
- Auth pages share a different layout (centered card)
- App pages share a third layout (with sidebar, auth-protected)
- URLs must be clean: /dashboard, /projects, /projects/123 (no group names in URLs)`,
      starterCode: `// Draw the folder structure as a comment tree
// Mark each file as: page.tsx, layout.tsx, or route.ts

app/
├── `,
      solution: `app/
├── layout.tsx                          ← Root layout (html/body tags)
│
├── (marketing)/
│   ├── layout.tsx                      ← Marketing layout (header, footer, no sidebar)
│   ├── page.tsx                        → / (Homepage)
│   └── pricing/
│       └── page.tsx                    → /pricing
│
├── (auth)/
│   ├── layout.tsx                      ← Auth layout (centered card)
│   ├── login/
│   │   └── page.tsx                    → /login
│   └── register/
│       └── page.tsx                    → /register
│
├── (app)/
│   ├── layout.tsx                      ← App layout (sidebar + auth check)
│   ├── dashboard/
│   │   ├── page.tsx                    → /dashboard
│   │   └── loading.tsx                 ← Dashboard skeleton
│   ├── projects/
│   │   ├── page.tsx                    → /projects
│   │   └── [id]/
│   │       ├── page.tsx                → /projects/123
│   │       └── settings/
│   │           └── page.tsx            → /projects/123/settings
│   └── profile/
│       └── page.tsx                    → /profile
│
└── api/
    └── projects/
        ├── route.ts                    ← GET /api/projects, POST /api/projects
        └── [id]/
            └── route.ts               ← GET/PUT/DELETE /api/projects/123`,
      hints: [
        'Route groups (parentheses) organize without affecting URLs',
        'Each group needs its own layout.tsx for the different visual style',
        'Dynamic segments [id] work within the group structure',
        'API routes go in /api subdirectory with route.ts (not page.tsx)',
      ],
    },
  ],

  keyTakeaways: [
    'The /app directory IS your routing structure — folders create URL segments, page.tsx makes them publicly accessible.',
    'Reserved file names have specific jobs: page.tsx (route UI), layout.tsx (persistent wrapper), loading.tsx (Suspense fallback), error.tsx (error boundary), not-found.tsx (404), route.ts (API endpoint).',
    'layout.tsx persists across navigation (does not re-render). template.tsx re-creates on every navigation.',
    'Route groups (parentheses folders) organize code without affecting URLs — essential for multiple layout sections in one app.',
    'Only page.tsx and route.ts files create public endpoints — other files colocated inside /app are not accessible via URL.',
    'loading.tsx and error.tsx are automatically wired up by Next.js as Suspense and ErrorBoundary wrappers.',
    'Professional structure: (marketing), (auth), (app) route groups with separate layouts for each section.',
    'error.tsx must always be a Client Component — error boundaries are a client-side React concept.',
  ],
};
