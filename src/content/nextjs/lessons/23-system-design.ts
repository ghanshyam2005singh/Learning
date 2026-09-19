import type { Lesson } from '@/types';

export const systemDesignLesson: Lesson = {
  id: 'nextjs-system-design',
  slug: 'nextjs-system-design',
  title: 'System Design with Next.js',
  description:
    'Design real production systems with Next.js — SaaS architecture, e-commerce platform, real-time features, scaling decisions, caching architecture, and multi-tenant design.',
  category: 'System Design',
  order: 23,
  difficulty: 'advanced',
  estimatedTime: 60,
  prevLesson: 'nextjs-scalable-architecture',
  nextLesson: 'nextjs-interview-preparation',

  content: `# System Design with Next.js

## Designing Production Systems

System design is about making trade-offs. For every decision, ask:
- What are the constraints?
- What scales?
- What fails and how does it recover?
- What are we optimizing for: speed, consistency, availability, cost?

This module applies these principles to real Next.js system design.

---

## Design 1: Multi-Tenant SaaS Platform

**Requirements:**
- Multiple organizations (tenants) share the same codebase
- Data must be completely isolated between tenants
- Custom domains per tenant (acme.ourplatform.com or acme.com → your app)
- Different feature sets per subscription tier

**Architecture decisions:**

\`\`\`
Approach 1: Subdomain-based
  acme.app.com → tenant: acme
  tesla.app.com → tenant: tesla

Approach 2: URL path-based
  app.com/acme → tenant: acme
  app.com/tesla → tenant: tesla

Approach 3: Database per tenant (full isolation, expensive)
Approach 4: Row-level isolation (shared DB, tenant_id column)

For most SaaS → Row-level isolation + subdomain routing
\`\`\`

\`\`\`tsx
// middleware.ts — Tenant resolution from subdomain
export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') ?? '';
  const subdomain = hostname.split('.')[0];

  // Skip for the main marketing domain
  if (subdomain === 'www' || subdomain === 'app') {
    return NextResponse.next();
  }

  // Validate tenant exists (cached — do NOT hit DB on every request)
  const tenantId = await getTenantIdBySubdomain(subdomain); // Uses Edge KV store

  if (!tenantId) {
    return NextResponse.rewrite(new URL('/not-found', request.url));
  }

  // Pass tenant to all requests via header
  const response = NextResponse.next();
  response.headers.set('x-tenant-id', tenantId);
  return response;
}

// lib/tenant.ts — Get current tenant in any Server Component or Action
import { headers } from 'next/headers';
import { cache } from 'react';

export const getTenant = cache(async () => {
  const tenantId = headers().get('x-tenant-id');
  if (!tenantId) throw new Error('No tenant in request');

  return db.tenant.findUniqueOrThrow({
    where: { id: tenantId },
    include: { plan: true },
  });
});

// All queries must be tenant-scoped:
export const getPosts = cache(async () => {
  const tenant = await getTenant();
  return db.post.findMany({
    where: { tenantId: tenant.id },  // Always filter by tenant
    orderBy: { createdAt: 'desc' },
  });
});
\`\`\`

**Feature flags per subscription tier:**
\`\`\`tsx
export async function requireFeature(feature: 'analytics' | 'api' | 'sso') {
  const tenant = await getTenant();

  const features: Record<string, string[]> = {
    free: [],
    pro: ['analytics', 'api'],
    enterprise: ['analytics', 'api', 'sso'],
  };

  if (!features[tenant.plan.name]?.includes(feature)) {
    redirect('/billing?upgrade=true');
  }
}

// Usage in any Server Component or Action:
export async function AnalyticsDashboard() {
  await requireFeature('analytics'); // Redirects if not on pro+
  const data = await getAnalytics();
  return <AnalyticsView data={data} />;
}
\`\`\`

---

## Design 2: E-Commerce Platform

**Key technical challenges:**
- Product catalog: 1M+ products, needs fast search
- Inventory: must be accurate (race conditions)
- Checkout: payment + inventory decrement must be atomic
- Cart: survives browser close, syncs when logged in

\`\`\`tsx
// Inventory decrement with optimistic locking
// The challenge: two users buy the last item simultaneously
export async function purchaseProduct(productId: string, quantity: number) {
  const session = await requireAuth();

  const result = await db.$transaction(async (tx) => {
    // Lock the product row for this transaction
    const product = await tx.$queryRaw\`
      SELECT * FROM "Product" WHERE id = \${productId} FOR UPDATE
    \`;

    if (product[0].stock < quantity) {
      throw new Error('Insufficient stock');
    }

    await tx.product.update({
      where: { id: productId },
      data: { stock: { decrement: quantity } },
    });

    const order = await tx.order.create({
      data: {
        userId: session.userId,
        items: { create: [{ productId, quantity, price: product[0].price }] },
        status: 'pending',
      },
    });

    return order;
  });

  return result;
}

// Rendering strategy for product pages:
// - Static product info (title, description, images) → ISR (revalidate: 3600)
// - Pricing → SSR or client-fetched (may vary by user location/currency)
// - Stock status → client-fetched (real-time)
// - Product list with filters → SSR with searchParams
\`\`\`

---

## Design 3: Real-Time Features

**Options for real-time in Next.js:**

\`\`\`
1. Server-Sent Events (SSE) — simple one-way server→client streaming
2. WebSockets — two-way, requires persistent connection, not serverless-friendly
3. Long polling — fallback, works everywhere
4. Third-party (Pusher, Ably, Liveblocks) — managed, works with serverless
\`\`\`

\`\`\`tsx
// app/api/notifications/stream/route.ts
// Server-Sent Events for real-time notifications

export async function GET(request: Request) {
  const session = await getSession(request);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function send(data: object) {
        controller.enqueue(encoder.encode(\`data: \${JSON.stringify(data)}\\n\\n\`));
      }

      // Send initial state
      const notifications = await getUnreadNotifications(session.userId);
      send({ type: 'initial', notifications });

      // Poll for new notifications (simple approach)
      const interval = setInterval(async () => {
        const latest = await getLatestNotifications(session.userId, new Date());
        if (latest.length > 0) {
          send({ type: 'update', notifications: latest });
        }
      }, 5000);

      // Cleanup on disconnect
      request.signal.addEventListener('abort', () => clearInterval(interval));
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// Client Component consumer:
"use client";
import { useEffect, useState } from 'react';

export function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const eventSource = new EventSource('/api/notifications/stream');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCount(data.notifications.filter(n => !n.read).length);
    };

    return () => eventSource.close(); // Cleanup
  }, []);

  return <button>🔔 {count > 0 && <span>{count}</span>}</button>;
}
\`\`\`

---

## Caching Architecture for Scale

\`\`\`
Request
  ↓
Edge CDN (Vercel Edge / Cloudflare)    ← Static HTML served from CDN
  ↓ (cache miss)
Next.js Full Route Cache               ← Cached render on server
  ↓ (dynamic route or cache miss)
Data Cache                             ← next: { revalidate } or force-cache
  ↓ (no-store or revalidated)
Database / API
  ↑ (writes)
revalidatePath / revalidateTag         ← Invalidate specific cache entries
\`\`\`

\`\`\`tsx
// Layered caching strategy for a blog:
// Post list page: ISR 1 hour (new posts show within 1 hour)
// Post detail: ISR 24 hours (posts rarely change)
// Author page: ISR 1 week (author info rarely changes)
// Home page hero: Static (updated by CMS webhook)

// Tag-based invalidation:
export async function publishPost(postId: string) {
  await db.post.update({ where: { id: postId }, data: { published: true } });

  // Invalidate specific pages immediately
  revalidatePath('/blog');                 // Blog listing
  revalidateTag('posts');                  // Any fetch tagged with 'posts'
  revalidatePath(\`/blog/\${postId}\`);    // The post itself
}

// The ISR revalidation flow:
// 1. User visits /blog after an hour
// 2. Next.js serves the stale page immediately (fast)
// 3. Background: regenerates the page
// 4. Next visitor gets the fresh page
\`\`\`

---

## Scaling Decisions Cheat Sheet

\`\`\`
"My app is slow"
  → Check: Is it a DB query? Add indexes, use explain analyze
  → Check: Is it layout shift? Use next/image with dimensions
  → Check: Is it JS? Run bundle analyzer, dynamic import heavy libs
  → Check: Is it rendering? Use ISR or SSG for cacheable pages

"My DB is overloaded"
  → Add connection pooling (PgBouncer)
  → Cache reads (ISR, Redis, React cache())
  → Read from replica, write to primary
  → Move heavy queries to background jobs

"My app crashes under load"
  → Add rate limiting (Upstash Redis)
  → Use a queue for heavy operations (BullMQ, Inngest)
  → Separate read and write paths

"I need real-time"
  → Simple notifications: SSE
  → Collaborative: WebSockets (not serverless) or Liveblocks
  → Background jobs: Inngest, Trigger.dev
\`\`\``,

  codeExamples: [
    {
      title: 'Optimistic locking for concurrent inventory updates',
      code: `// Problem: Flash sale — 1000 users try to buy the last item simultaneously

// ❌ Race condition — this can oversell:
export async function buggyPurchase(productId: string) {
  const product = await db.product.findUnique({ where: { id: productId } });
  if (product.stock === 0) throw new Error('Out of stock');

  // The gap between the check and the update can be exploited
  // by concurrent requests — RACE CONDITION!
  await db.product.update({
    where: { id: productId },
    data: { stock: product.stock - 1 },
  });
}

// ✅ Optimistic locking — safe concurrent updates:
export async function safePurchase(productId: string, userId: string) {
  return db.$transaction(async (tx) => {
    // Approach 1: Conditional update — only succeed if stock > 0
    const updated = await tx.product.updateMany({
      where: {
        id: productId,
        stock: { gt: 0 },  // Condition checked atomically
      },
      data: { stock: { decrement: 1 } },
    });

    if (updated.count === 0) {
      throw new Error('Item is out of stock');
    }

    // Create order only if update succeeded
    return tx.order.create({
      data: { userId, items: { create: [{ productId, quantity: 1 }] } },
    });
  });
}

// Approach 2: Database-level locking (SELECT FOR UPDATE)
export async function safePurchaseWithLock(productId: string, userId: string) {
  return db.$transaction(async (tx) => {
    // Lock this row for the duration of the transaction
    const [product] = await tx.$queryRaw<Product[]>\`
      SELECT * FROM "Product" WHERE id = \${productId} FOR UPDATE
    \`;

    if (!product || product.stock <= 0) {
      throw new Error('Item is out of stock');
    }

    await tx.product.update({
      where: { id: productId },
      data: { stock: { decrement: 1 } },
    });

    return tx.order.create({
      data: { userId, items: { create: [{ productId, quantity: 1 }] } },
    });
  });
}`,
      explanation:
        'Race conditions in inventory management cause overselling. The fix: use Prisma transactions with either conditional updateMany (check and update atomically) or SELECT FOR UPDATE (lock the row for the transaction duration). The database guarantees only one transaction succeeds when the condition is no longer met.',
    },
  ],

  commonMistakes: [
    'Not considering concurrency in e-commerce — always use transactions for inventory changes.',
    'Using WebSockets on a serverless platform — serverless cannot maintain persistent connections.',
    'Not scoping multi-tenant queries by tenantId — data leaks between tenants.',
    'Forgetting to invalidate cache after writes — users see stale data after mutations.',
    'Using SSE for two-way communication — SSE is one-way (server→client only).',
    'Not rate limiting real-time endpoints — SSE connections can exhaust server resources.',
  ],

  interviewQuestions: [
    {
      question: 'How would you design a multi-tenant SaaS app with Next.js?',
      answer:
        "I would use subdomain-based tenant routing with row-level data isolation. In middleware (Edge Runtime), I would extract the subdomain from the Host header and look up the tenant ID from a cached store (Redis or KV) — never hitting the database on every request. I would set the tenant ID in a response header that all downstream Server Components can read via headers(). All database queries would be scoped to the tenant ID, enforced by a getTenant() helper that throws if no tenant context exists. Feature flags would check the tenant's subscription plan before allowing access to premium features. For data isolation I prefer a single database with tenantId columns over separate databases — simpler to operate, cheaper, easier to deploy migrations. Database migrations that add a new tenantId-scoped table affect all tenants atomically.",
      difficulty: 'advanced',
    },
  ],

  exercises: [
    {
      id: 'sysdesign-ex-1',
      title: 'Design a notification system with real-time delivery',
      description: `Design a notification system that:
1. Creates notifications from Server Actions (e.g., "User X liked your post")
2. Delivers them in real-time to connected clients via SSE
3. Persists notifications in the DB so users see them after reconnecting
4. Marks notifications as read

Design the schema, the Server Action, the SSE endpoint, and the client component.`,
      starterCode: `// Design these four pieces:
// 1. Prisma schema for Notification model
// 2. createNotification() — Server Action called when events happen
// 3. GET /api/notifications/stream — SSE endpoint
// 4. NotificationDropdown component — client, shows real-time count`,
      solution: `// prisma/schema.prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      String   // 'like', 'comment', 'follow'
  message   String
  read      Boolean  @default(false)
  link      String?
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}

// lib/actions/notifications.ts
"use server";
export async function createNotification(
  userId: string,
  type: string,
  message: string,
  link?: string
) {
  return db.notification.create({
    data: { userId, type, message, link },
  });
}

export async function markAsRead(notificationId: string) {
  const user = await requireAuth();
  await db.notification.update({
    where: { id: notificationId, userId: user.id },
    data: { read: true },
  });
}

// app/api/notifications/stream/route.ts
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getSession(request);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const encoder = new TextEncoder();
  let lastId: string | undefined;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(\`data: \${JSON.stringify(data)}\\n\\n\`));
      };

      // Initial load
      const initial = await db.notification.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });
      if (initial.length > 0) lastId = initial[0].id;
      send({ type: 'initial', notifications: initial });

      // Poll for new ones
      const interval = setInterval(async () => {
        const fresh = await db.notification.findMany({
          where: {
            userId: session.userId,
            ...(lastId && { createdAt: { gt: new Date() } }),
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        });
        if (fresh.length > 0) {
          lastId = fresh[0].id;
          send({ type: 'new', notifications: fresh });
        }
      }, 5000);

      request.signal.addEventListener('abort', () => clearInterval(interval));
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}

// components/NotificationDropdown.tsx
"use client";
import { useEffect, useState } from 'react';
import { markAsRead } from '@/lib/actions/notifications';

type Notification = { id: string; message: string; read: boolean; link?: string };

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const es = new EventSource('/api/notifications/stream');
    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'initial') setNotifications(data.notifications);
      if (data.type === 'new') setNotifications(p => [...data.notifications, ...p]);
    };
    return () => es.close();
  }, []);

  return (
    <div className="relative">
      <button onClick={() => setOpen(p => !p)}>
        🔔 {unread > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-1">{unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg max-h-96 overflow-y-auto">
          {notifications.length === 0 && <p className="p-4 text-gray-500">No notifications</p>}
          {notifications.map(n => (
            <div
              key={n.id}
              className={\`p-4 border-b cursor-pointer hover:bg-gray-50 \${n.read ? 'opacity-60' : 'bg-blue-50'}\`}
              onClick={() => { markAsRead(n.id); setNotifications(p => p.map(x => x.id === n.id ? { ...x, read: true } : x)); }}
            >
              {n.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`,
      hints: [
        'SSE is one-way: server pushes to client. For actions (mark read), use Server Actions',
        'SSE streams stay open — close them with request.signal abort listener',
        'Poll the DB every 5s for simplicity; use Redis pub/sub for true real-time at scale',
        'Client optimistically marks notification as read before server confirms',
      ],
    },
  ],

  keyTakeaways: [
    'Multi-tenant SaaS: subdomain routing in middleware, tenantId on every DB query, feature flags per plan.',
    'E-commerce concurrency: use DB transactions with conditional updates or SELECT FOR UPDATE to prevent race conditions.',
    'Real-time: SSE for notifications (one-way, serverless-friendly); WebSockets for collaborative features (requires persistent server).',
    'Caching architecture: Edge CDN → Full Route Cache → Data Cache → DB. Invalidate with revalidatePath/revalidateTag on writes.',
    'Connection pooling is mandatory at scale — serverless functions exhaust DB connections without it.',
    'Design for the failure mode: what happens when the DB is down? When a payment fails? When a notification fails to deliver?',
    'Optimistic updates + server confirmation: update UI immediately, confirm or rollback based on server response.',
    'Background jobs (Inngest, Trigger.dev) for heavy operations — do not run them in Server Actions.',
  ],
};
