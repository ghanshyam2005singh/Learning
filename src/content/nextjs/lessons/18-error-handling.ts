import type { Lesson } from '@/types';

export const errorHandlingLesson: Lesson = {
  id: 'nextjs-error-handling',
  slug: 'nextjs-error-handling',
  title: 'Error Handling',
  description:
    'Master production error handling in Next.js — error.tsx boundaries, not-found pages, global errors, Server Action error states, graceful degradation, and error monitoring.',
  category: 'Error Handling',
  order: 18,
  difficulty: 'intermediate',
  estimatedTime: 40,
  prevLesson: 'nextjs-seo',
  nextLesson: 'nextjs-security',

  content: `# Error Handling in Next.js

## Why Error Handling Matters in Production

Every app has errors. The difference between amateur and professional apps is:

- **Amateur**: White screen of death when something fails
- **Professional**: Graceful UI, useful feedback, silent recovery where possible, and errors tracked in monitoring

Next.js provides a structured, file-based system for handling errors at every level.

---

## error.tsx — Route Segment Error Boundary

\`error.tsx\` wraps a route segment in a React Error Boundary. When a Server Component or Client Component in that segment throws, \`error.tsx\` renders instead of crashing the entire page.

\`\`\`tsx
// app/dashboard/error.tsx
"use client"; // Error boundaries MUST be Client Components

import { useEffect } from 'react';

type ErrorProps = {
  error: Error & { digest?: string }; // digest is Next.js error ID
  reset: () => void; // Retry the failed segment
};

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to error monitoring (Sentry, DataDog, etc.)
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-64 p-8">
      <div className="text-red-500 text-5xl mb-4">⚠️</div>
      <h2 className="text-xl font-semibold text-gray-800">
        Something went wrong
      </h2>
      <p className="text-gray-500 mt-2 text-center max-w-sm">
        We could not load the dashboard. Please try again.
      </p>
      {/* Show digest in dev, hide in production */}
      {process.env.NODE_ENV === 'development' && (
        <code className="mt-2 text-xs text-gray-400">{error.message}</code>
      )}
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );
}
\`\`\`

**How error.tsx works:**
- File: \`app/[segment]/error.tsx\`
- Scope: catches errors in \`[segment]/page.tsx\` and all children
- The \`reset\` function re-renders the segment (does NOT do a full page reload)
- The parent layout is preserved — sidebar, header, footer remain
- \`error.tsx\` does NOT catch errors in \`layout.tsx\` at the same level (use parent's error.tsx)

---

## not-found.tsx

\`\`\`tsx
// app/not-found.tsx — Global 404 page
export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <p className="text-xl text-gray-600 mt-4">Page not found</p>
      <a href="/" className="mt-6 text-blue-600 hover:underline">
        Go home
      </a>
    </div>
  );
}

// app/products/not-found.tsx — Scoped 404 for products section
export default function ProductNotFound() {
  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold">Product not found</h2>
      <p className="text-gray-500 mt-2">
        This product may have been removed or the link is incorrect.
      </p>
      <a href="/products" className="mt-4 inline-block text-blue-600">
        Browse all products →
      </a>
    </div>
  );
}

// Triggering not-found programmatically in a Server Component:
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await db.product.findUnique({ where: { id: params.id } });

  if (!product) {
    notFound(); // Renders not-found.tsx
  }

  return <ProductDetail product={product} />;
}
\`\`\`

---

## global-error.tsx

Catches errors in \`app/layout.tsx\` and \`app/template.tsx\` (error.tsx cannot catch these):

\`\`\`tsx
// app/global-error.tsx
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // Must render its own <html> and <body> tags
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-2xl font-bold">Something went seriously wrong</h2>
          <button onClick={reset} className="mt-4 px-4 py-2 bg-red-600 text-white rounded">
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
\`\`\`

---

## Server Action Error Handling

\`\`\`tsx
// lib/actions/posts.ts — Structured error responses
"use server";

import { z } from 'zod';

export type ActionResult<T = null> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createPost(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  // 1. Auth check
  const user = await requireAuth();

  // 2. Validation
  const result = PostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!result.success) {
    return {
      success: false,
      error: 'Validation failed',
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  // 3. Business logic errors
  const slugExists = await db.post.findUnique({
    where: { slug: slugify(result.data.title) },
  });

  if (slugExists) {
    return {
      success: false,
      error: 'A post with this title already exists',
      fieldErrors: { title: ['This title is already taken'] },
    };
  }

  // 4. Database errors
  try {
    const post = await db.post.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        slug: slugify(result.data.title),
        authorId: user.id,
      },
    });

    revalidatePath('/blog');
    return { success: true, data: { id: post.id } };
  } catch (error) {
    // Log the real error, return safe message to client
    console.error('Failed to create post:', error);
    return { success: false, error: 'Failed to create post. Please try again.' };
  }
}
\`\`\`

---

## Graceful Degradation with Promise.allSettled

When a page has multiple data sources, don't let one failure kill the whole page:

\`\`\`tsx
export default async function DashboardPage() {
  // Sequential: if first fails, nothing renders
  // const [stats, activity, notifications] = await Promise.all([...]);

  // Graceful: each section renders independently
  const [statsResult, activityResult, notificationsResult] = await Promise.allSettled([
    getStats(),
    getActivity(),
    getNotifications(),
  ]);

  return (
    <div className="grid grid-cols-3 gap-4">
      {statsResult.status === 'fulfilled' ? (
        <StatsWidget data={statsResult.value} />
      ) : (
        <ErrorWidget message="Could not load stats" />
      )}

      {activityResult.status === 'fulfilled' ? (
        <ActivityFeed data={activityResult.value} />
      ) : (
        <ErrorWidget message="Could not load activity" />
      )}

      {notificationsResult.status === 'fulfilled' ? (
        <NotificationList data={notificationsResult.value} />
      ) : (
        <ErrorWidget message="Could not load notifications" />
      )}
    </div>
  );
}
\`\`\`

---

## Error Monitoring (Sentry)

\`\`\`bash
npx @sentry/wizard@latest -i nextjs
\`\`\`

\`\`\`tsx
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,  // 10% of transactions
  replaysOnErrorSampleRate: 1.0, // 100% session replay on errors
});

// Capture custom errors:
Sentry.captureException(error, {
  extra: { userId: user.id, action: 'createPost' },
});
\`\`\``,

  codeExamples: [
    {
      title: 'Production error handling with retry logic',
      code: `// Layered error handling for a data-heavy page

// app/analytics/error.tsx
"use client";
import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function AnalyticsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <p className="text-red-700 font-medium">Analytics temporarily unavailable</p>
      <p className="text-red-500 text-sm mt-1">
        Error ID: {error.digest ?? 'unknown'}
      </p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 text-sm bg-white border border-red-300 text-red-700 rounded hover:bg-red-50"
      >
        Reload Analytics
      </button>
    </div>
  );
}

// app/analytics/page.tsx — Multiple sections, independent errors
import { Suspense } from 'react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      {/* Each Suspense boundary is also an independent failure unit */}
      <Suspense fallback={<MetricsSkeleton />}>
        <KeyMetrics />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <RevenueChart />
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <TopProducts />
      </Suspense>
    </div>
  );
}

// components/analytics/KeyMetrics.tsx — throws on error
async function KeyMetrics() {
  const metrics = await fetchMetrics(); // May throw
  return <MetricsGrid data={metrics} />;
}

// If KeyMetrics throws:
// → error.tsx catches it (keeps the rest of the page alive)
// → user sees the error UI only for KeyMetrics section
// → RevenueChart and TopProducts still render normally`,
      explanation:
        'Combining error.tsx with Suspense gives you independent failure domains. If one section fails, only that section shows an error — the rest of the page renders normally. error.tsx is scoped to its route segment and does not affect siblings.',
    },
  ],

  commonMistakes: [
    'Forgetting "use client" on error.tsx — error boundaries must be Client Components.',
    'Using try-catch in Server Components and returning null silently — users see nothing and have no way to recover.',
    'Exposing real error messages (stack traces, SQL errors) to users — always show a safe message, log the real error server-side.',
    'Not handling the 404 case with notFound() — a 200 response with "not found" content is bad for SEO.',
    'Using Promise.all when one failure should not block the whole page — use Promise.allSettled for independent data sources.',
    'Not logging errors — if no monitoring is set up, you will never know about production errors.',
    'Putting error.tsx at app level only — scope error.tsx to the segment where the error is likely (e.g., app/dashboard/error.tsx).',
  ],

  interviewQuestions: [
    {
      question: 'How does error.tsx work in Next.js and what are its limitations?',
      answer:
        "error.tsx wraps a route segment in a React Error Boundary. When any component in that segment throws during rendering, error.tsx renders instead of crashing the page. The key property is that the parent layout is preserved — the sidebar and header still render. error.tsx receives two props: error (the thrown Error object) and reset (a function to retry the failed segment). Limitations: (1) error.tsx does NOT catch errors in the layout.tsx at the same level — it only wraps page.tsx and its children. (2) To catch layout errors, use the parent segment's error.tsx. (3) For the root layout, use global-error.tsx. (4) error.tsx must be a Client Component because Error Boundaries are a React concept that requires lifecycle methods, which only exist in client-side React.",
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'error-ex-1',
      title: 'Add comprehensive error handling to a dashboard',
      description: `A dashboard page has three sections that fetch data independently. Add:
1. error.tsx that shows a retry button and logs to console
2. not-found.tsx for the dashboard section
3. Use Promise.allSettled so one section failing does not break others
4. Show a graceful error widget per section that fails`,
      starterCode: `// CURRENT — fragile
export default async function DashboardPage() {
  // If any of these fail, the whole page crashes
  const [stats, chart, activity] = await Promise.all([
    fetchStats(),
    fetchChartData(),
    fetchActivity(),
  ]);

  return (
    <div>
      <Stats data={stats} />
      <Chart data={chart} />
      <Activity data={activity} />
    </div>
  );
}`,
      solution: `// app/dashboard/error.tsx
"use client";
import { useEffect } from 'react';

export default function DashboardError({ error, reset }) {
  useEffect(() => {
    console.error('Dashboard error:', error.message);
  }, [error]);

  return (
    <div className="flex flex-col items-center p-8 text-center">
      <p className="text-gray-700 font-medium">Dashboard failed to load</p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Retry
      </button>
    </div>
  );
}

// app/dashboard/not-found.tsx
export default function DashboardNotFound() {
  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold">Dashboard not found</h2>
      <a href="/" className="text-blue-600 mt-2 block">← Back to home</a>
    </div>
  );
}

// app/dashboard/page.tsx
function ErrorWidget({ message }: { message: string }) {
  return (
    <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-600">
      {message}
    </div>
  );
}

export default async function DashboardPage() {
  const [statsResult, chartResult, activityResult] = await Promise.allSettled([
    fetchStats(),
    fetchChartData(),
    fetchActivity(),
  ]);

  return (
    <div className="grid gap-6">
      {statsResult.status === 'fulfilled' ? (
        <Stats data={statsResult.value} />
      ) : (
        <ErrorWidget message="Could not load statistics" />
      )}

      {chartResult.status === 'fulfilled' ? (
        <Chart data={chartResult.value} />
      ) : (
        <ErrorWidget message="Could not load chart data" />
      )}

      {activityResult.status === 'fulfilled' ? (
        <Activity data={activityResult.value} />
      ) : (
        <ErrorWidget message="Could not load activity feed" />
      )}
    </div>
  );
}`,
      hints: [
        'error.tsx must have "use client" at the top',
        'Promise.allSettled never rejects — check .status === "fulfilled" for each result',
        'The reset prop on error.tsx re-renders the segment without full page reload',
        'notFound() in a Server Component triggers not-found.tsx',
      ],
    },
  ],

  keyTakeaways: [
    'error.tsx wraps route segments in Error Boundaries — failed segments show error UI, not blank pages.',
    'error.tsx MUST be a Client Component and receives error and reset props.',
    'error.tsx does not catch errors in layout.tsx at the same level — use the parent segment or global-error.tsx.',
    'notFound() in a Server Component triggers not-found.tsx — returns a proper 404 response.',
    'Promise.allSettled enables graceful degradation — one failure does not crash the whole page.',
    'Never expose real error messages to users — log server-side, show safe messages client-side.',
    'Install error monitoring (Sentry) on day one — you cannot fix bugs you cannot see.',
    'Scope error.tsx to the smallest segment where errors are likely for the best user experience.',
  ],
};
