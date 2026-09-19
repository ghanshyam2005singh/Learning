import type { Lesson } from '@/types';

export const apiDevelopmentLesson: Lesson = {
  id: 'nextjs-api-development',
  slug: 'nextjs-api-development',
  title: 'API Development with Route Handlers',
  description:
    'Build REST APIs in Next.js using Route Handlers — request/response handling, validation, middleware, error handling, CORS, webhooks, and API architecture patterns.',
  category: 'API Development',
  order: 10,
  difficulty: 'intermediate',
  estimatedTime: 50,
  prevLesson: 'nextjs-server-actions',
  nextLesson: 'nextjs-middleware',

  content: `# API Development with Route Handlers

## What are Route Handlers?

Route Handlers are the Next.js way to create API endpoints. They replace the legacy Pages Router \`/pages/api\` files with a more modern, Web Standard-based approach using the standard \`Request\` and \`Response\` objects.

\`\`\`
app/api/users/route.ts    → Handles all HTTP methods for /api/users
app/api/users/[id]/route.ts → Handles /api/users/123, /api/users/456
\`\`\`

Route Handler files export HTTP method functions:

\`\`\`tsx
// app/api/hello/route.ts

export async function GET(request: Request) {
  return Response.json({ message: 'Hello World' });
}

export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({ received: body }, { status: 201 });
}

export async function PUT(request: Request) { /* ... */ }
export async function DELETE(request: Request) { /* ... */ }
export async function PATCH(request: Request) { /* ... */ }
\`\`\`

---

## Request Object

\`\`\`tsx
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  // ── Body parsing ────────────────────────────────────────
  const json = await request.json();          // JSON body
  const text = await request.text();          // Plain text
  const formData = await request.formData();  // Form data

  // ── URL parsing ─────────────────────────────────────────
  const url = new URL(request.url);
  const page = url.searchParams.get('page') ?? '1';
  const limit = url.searchParams.get('limit') ?? '20';

  // ── NextRequest adds helpers ─────────────────────────────
  const page2 = request.nextUrl.searchParams.get('page');

  // ── Headers ─────────────────────────────────────────────
  const authHeader = request.headers.get('authorization');
  const contentType = request.headers.get('content-type');

  // ── Cookies ─────────────────────────────────────────────
  const sessionCookie = request.cookies.get('session')?.value;

  // ── IP address ──────────────────────────────────────────
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';

  return Response.json({ page, limit });
}
\`\`\`

---

## Response Object

\`\`\`tsx
// ── JSON response ───────────────────────────────────────────
return Response.json({ data: products });
return Response.json({ data: products }, { status: 200 });

// ── Error responses ─────────────────────────────────────────
return Response.json({ error: 'Not Found' }, { status: 404 });
return Response.json({ error: 'Unauthorized' }, { status: 401 });
return Response.json({ error: 'Bad Request', details: errors }, { status: 400 });
return new Response(null, { status: 204 }); // No content

// ── Custom headers ──────────────────────────────────────────
return new Response(JSON.stringify(data), {
  status: 200,
  headers: {
    'Content-Type': 'application/json',
    'X-Total-Count': '100',
    'Cache-Control': 'public, max-age=3600',
  },
});

// ── Redirect ────────────────────────────────────────────────
return Response.redirect(new URL('/login', request.url), 302);

// ── Text response ────────────────────────────────────────────
return new Response('OK', { status: 200 });

// ── Stream response ─────────────────────────────────────────
const stream = new ReadableStream({ /* ... */ });
return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } });
\`\`\`

---

## Route Parameters

\`\`\`tsx
// app/api/products/[id]/route.ts

import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await db.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    return Response.json({ error: 'Product not found' }, { status: 404 });
  }

  return Response.json({ data: product });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  const updated = await db.product.update({
    where: { id: params.id },
    data: body,
  });

  return Response.json({ data: updated });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await db.product.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}
\`\`\`

---

## Building a Full REST API

\`\`\`tsx
// app/api/posts/route.ts — Collection endpoint

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getCurrentUserId } from '@/lib/auth';

const CreatePostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  published: z.boolean().default(false),
  tags: z.array(z.string()).max(10).default([]),
});

// GET /api/posts — List posts with pagination and filtering
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? '20')));
  const tag = searchParams.get('tag');
  const search = searchParams.get('q');

  const where = {
    published: true,
    ...(tag ? { tags: { has: tag } } : {}),
    ...(search ? {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    } : {}),
  };

  const [posts, total] = await Promise.all([
    db.post.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { publishedAt: 'desc' },
      select: { id: true, title: true, publishedAt: true, author: { select: { name: true } } },
    }),
    db.post.count({ where }),
  ]);

  return Response.json({
    data: posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
}

// POST /api/posts — Create a post
export async function POST(request: NextRequest) {
  // Authentication
  const userId = await getCurrentUserId(request);
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse and validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const validation = CreatePostSchema.safeParse(body);
  if (!validation.success) {
    return Response.json(
      { error: 'Validation failed', details: validation.error.flatten() },
      { status: 422 }
    );
  }

  // Create post
  const post = await db.post.create({
    data: { ...validation.data, authorId: userId },
  });

  return Response.json({ data: post }, { status: 201 });
}
\`\`\`

---

## Error Handling Middleware Pattern

\`\`\`tsx
// lib/api.ts — Shared API utilities

export function withErrorHandling(
  handler: (req: Request, ctx: any) => Promise<Response>
) {
  return async (req: Request, ctx: any): Promise<Response> => {
    try {
      return await handler(req, ctx);
    } catch (error) {
      console.error('[API Error]', error);

      if (error instanceof z.ZodError) {
        return Response.json(
          { error: 'Validation failed', details: error.flatten() },
          { status: 422 }
        );
      }

      if (error instanceof AuthError) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }

      if (error instanceof NotFoundError) {
        return Response.json({ error: error.message }, { status: 404 });
      }

      return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  };
}

// Usage:
export const GET = withErrorHandling(async (request) => {
  const products = await getProducts(); // May throw NotFoundError
  return Response.json({ data: products });
});
\`\`\`

---

## CORS Configuration

\`\`\`tsx
// lib/cors.ts

const ALLOWED_ORIGINS = [
  'https://yourdomain.com',
  'https://app.yourdomain.com',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
].filter(Boolean);

export function withCors(handler: Function) {
  return async (request: Request, ctx: any) => {
    const origin = request.headers.get('origin') ?? '';
    const isAllowed = ALLOWED_ORIGINS.includes(origin);

    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': isAllowed ? origin : '',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    const response = await handler(request, ctx);

    // Add CORS headers to all responses
    const headers = new Headers(response.headers);
    if (isAllowed) {
      headers.set('Access-Control-Allow-Origin', origin);
    }

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  };
}
\`\`\`

---

## Webhook Endpoints

\`\`\`tsx
// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  // 1. Get the raw body (webhooks require raw body for signature verification)
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;

  // 2. Verify the webhook signature (CRITICAL SECURITY STEP)
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // 3. Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await db.order.update({
        where: { stripePaymentIntentId: paymentIntent.id },
        data: { status: 'paid' },
      });
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await db.user.update({
        where: { stripeCustomerId: subscription.customer as string },
        data: { plan: 'free' },
      });
      break;
    }
  }

  return Response.json({ received: true });
}
\`\`\``,

  codeExamples: [
    {
      title: 'Standardized API response format',
      code: `// lib/api-response.ts — Consistent response formatting

type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
  details?: unknown;
};

export function ok<T>(data: T, status = 200): Response {
  const body: ApiResponse<T> = { success: true, data };
  return Response.json(body, { status });
}

export function created<T>(data: T): Response {
  return ok(data, 201);
}

export function noContent(): Response {
  return new Response(null, { status: 204 });
}

export function badRequest(message: string, details?: unknown): Response {
  const body: ApiResponse<never> = { success: false, error: message, details };
  return Response.json(body, { status: 400 });
}

export function unauthorized(): Response {
  return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
}

export function forbidden(): Response {
  return Response.json({ success: false, error: 'Forbidden' }, { status: 403 });
}

export function notFound(resource = 'Resource'): Response {
  return Response.json(
    { success: false, error: \`\${resource} not found\` },
    { status: 404 }
  );
}

export function serverError(message = 'Internal server error'): Response {
  return Response.json({ success: false, error: message }, { status: 500 });
}

// Usage in route handler:
// app/api/products/[id]/route.ts
import { ok, notFound, unauthorized } from '@/lib/api-response';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const product = await db.product.findUnique({ where: { id: params.id } });

  if (!product) return notFound('Product');

  return ok(product);
  // Response: { success: true, data: { id: '...', name: '...' } }
}`,
      explanation:
        'Standardized API responses make client code simpler and API behavior predictable. Every endpoint returns the same shape: success with data, or error with message. This is the pattern used in production APIs at scale.',
    },
  ],

  commonMistakes: [
    'Forgetting to export named HTTP method functions — the file must export GET, POST, etc. not a default export.',
    'Not validating request body before using it — always parse and validate with Zod before touching user-provided data.',
    'Returning raw errors to clients — never expose stack traces or internal error messages; return user-friendly messages.',
    'Skipping authentication — Route Handlers are public endpoints; always verify auth for protected operations.',
    'Not handling the OPTIONS preflight request for CORS — browsers send OPTIONS before cross-origin requests.',
    'Using Server Actions for endpoints that mobile apps or external services will call — use Route Handlers for public APIs.',
  ],

  interviewQuestions: [
    {
      question: 'What is the difference between Route Handlers and the Pages Router API routes?',
      answer:
        'Route Handlers use Web Standard APIs (Request, Response, Headers, URL) and live in the /app directory as route.ts files. Pages Router API routes use Node.js-style (req, res) arguments and live in /pages/api. Route Handlers support all HTTP methods as named exports (GET, POST, PUT, DELETE). They support streaming, edge runtime, and native Web Crypto. They are more aligned with modern web standards and work consistently across Node.js and Edge runtimes. Pages Router API routes require the res.json() pattern from Express-style Node.js. In new projects, always use Route Handlers.',
      difficulty: 'beginner',
    },
    {
      question: 'How do you handle authentication in Route Handlers?',
      answer:
        'Authentication in Route Handlers is manual — unlike Server Actions where you can use server-side functions directly. Common approaches: (1) JWT tokens in Authorization header — parse with request.headers.get("authorization"), verify the token with your JWT library. (2) Session cookies — read with request.cookies.get("session"), look up the session in your database. (3) NextAuth.js provides getServerSession() that works in Route Handlers. Always: verify authentication before any data access, return 401 Unauthorized if not authenticated, return 403 Forbidden if authenticated but not authorized for the specific resource.',
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'api-ex-1',
      title: 'Build a paginated REST API endpoint',
      description: `Build GET /api/products that supports:
- Pagination: ?page=1&limit=10
- Filtering: ?category=electronics
- Search: ?q=iphone
- Sorting: ?sort=price_asc or ?sort=price_desc
- Returns: { data, pagination: { page, limit, total, totalPages } }

Add validation so page/limit cannot be negative or zero.`,
      starterCode: `// app/api/products/route.ts

import { NextRequest } from 'next/server';

// Mock data
const products = [
  { id: '1', name: 'iPhone 15', price: 999, category: 'electronics' },
  { id: '2', name: 'MacBook Pro', price: 1999, category: 'electronics' },
  { id: '3', name: 'Blue T-Shirt', price: 29, category: 'clothing' },
  // ... more products
];

export async function GET(request: NextRequest) {
  // TODO: Implement pagination, filtering, search, and sorting
  // Return: { data: Product[], pagination: { page, limit, total, totalPages } }
}`,
      solution: `// app/api/products/route.ts
import { NextRequest } from 'next/server';

const products = [
  { id: '1', name: 'iPhone 15', price: 999, category: 'electronics' },
  { id: '2', name: 'MacBook Pro', price: 1999, category: 'electronics' },
  { id: '3', name: 'Blue T-Shirt', price: 29, category: 'clothing' },
  { id: '4', name: 'AirPods Pro', price: 249, category: 'electronics' },
  { id: '5', name: 'Red Jacket', price: 79, category: 'clothing' },
];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // Parse and validate query params
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? '10')));
  const category = searchParams.get('category');
  const search = searchParams.get('q')?.toLowerCase();
  const sort = searchParams.get('sort') ?? 'id_asc';

  // Filter
  let filtered = products.filter(p => {
    if (category && p.category !== category) return false;
    if (search && !p.name.toLowerCase().includes(search)) return false;
    return true;
  });

  // Sort
  filtered = filtered.sort((a, b) => {
    if (sort === 'price_asc') return a.price - b.price;
    if (sort === 'price_desc') return b.price - a.price;
    if (sort === 'name_asc') return a.name.localeCompare(b.name);
    return 0; // default: no sort
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return Response.json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  });
}`,
      hints: [
        'Parse query params with request.nextUrl.searchParams',
        'Clamp page and limit to sensible ranges (page >= 1, 1 <= limit <= 100)',
        'Filter the array before paginating',
        'Sort before slicing for pagination',
      ],
    },
  ],

  keyTakeaways: [
    'Route Handlers use Web Standard Request/Response objects — no Node.js req/res pattern.',
    'Export named functions (GET, POST, PUT, DELETE) from route.ts files — not a default export.',
    'Always validate request bodies with Zod before processing.',
    'Always authenticate and authorize before any data access.',
    'Route Handlers are for public APIs, webhooks, and external integrations — Server Actions are for mutations from your own UI.',
    'Use consistent response formats across all endpoints — success/error shapes should be predictable.',
    'Webhook endpoints must verify signatures before processing — never trust unverified webhooks.',
    'Route Handlers can run on Edge Runtime for global low-latency API responses.',
  ],
};
