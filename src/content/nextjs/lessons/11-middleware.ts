import type { Lesson } from '@/types';

export const middlewareLesson: Lesson = {
  id: 'nextjs-middleware',
  slug: 'nextjs-middleware',
  title: 'Middleware',
  description:
    'Master Next.js Middleware — request processing, authentication guards, redirects, rewrites, A/B testing, rate limiting, localization, and the Edge Runtime.',
  category: 'Middleware',
  order: 11,
  difficulty: 'intermediate',
  estimatedTime: 40,
  prevLesson: 'nextjs-api-development',
  nextLesson: 'nextjs-authentication',

  content: `# Middleware

## What is Middleware?

Middleware runs **before a request reaches your route**. It intercepts every incoming request and can:
- Redirect the user to a different URL
- Rewrite the URL internally
- Modify request/response headers
- Block the request entirely
- Run authentication/authorization checks
- Implement rate limiting

Middleware runs on the **Edge Runtime** — it executes at CDN edge locations near the user, before the request even reaches your application server. This makes it extremely fast.

\`\`\`
User Request
     │
     ▼
  MIDDLEWARE (Edge — 0ms latency, near user)
     │
     ├── Redirect? → Send redirect response
     ├── Block? → Send 401/403 response
     ├── Rewrite? → Change destination URL internally
     │
     ▼
  Your Next.js Route
  (Server Components, Route Handlers, etc.)
\`\`\`

---

## Creating Middleware

Middleware lives at the **root of your project** (not inside /app):

\`\`\`
my-app/
├── app/
├── middleware.ts    ← Root level
└── package.json
\`\`\`

\`\`\`tsx
// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function runs for EVERY matched request
export function middleware(request: NextRequest) {
  // Log every request (basic example)
  console.log('Request:', request.method, request.nextUrl.pathname);

  // Continue to the actual route
  return NextResponse.next();
}

// Configure which paths trigger this middleware
export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
\`\`\`

---

## The matcher Config

Control exactly which paths trigger your middleware:

\`\`\`tsx
export const config = {
  matcher: [
    // Match a specific path
    '/dashboard',

    // Match a path and all sub-paths
    '/dashboard/:path*',

    // Match multiple paths
    '/dashboard/:path*',
    '/settings/:path*',
    '/api/protected/:path*',

    // Exclude paths (negative lookahead)
    // Everything EXCEPT static files and images
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',

    // Only API routes
    '/api/:path*',
  ],
};
\`\`\`

---

## Authentication Guard

The most common use of middleware:

\`\`\`tsx
// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Public paths that do NOT require auth
const PUBLIC_PATHS = [
  '/',
  '/about',
  '/pricing',
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this path is public
  const isPublic = PUBLIC_PATHS.some(
    path => pathname === path || pathname.startsWith(path + '/')
  );

  if (isPublic) {
    return NextResponse.next(); // Allow without auth check
  }

  // Get session token from cookie
  const token = request.cookies.get('session')?.value;

  if (!token) {
    // No token — redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname); // Remember where they were going
    return NextResponse.redirect(loginUrl);
  }

  // Verify token validity
  try {
    const payload = await verifyToken(token);

    // Add user info to headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);
    requestHeaders.set('x-user-role', payload.role);

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch {
    // Invalid token — clear cookie and redirect
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('session');
    return response;
  }
}

export const config = {
  // Apply to all routes except static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)', '/api/:path*'],
};
\`\`\`

---

## Role-Based Access Control (RBAC)

\`\`\`tsx
// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ROUTE_PERMISSIONS: Record<string, string[]> = {
  '/admin': ['admin'],
  '/admin/users': ['admin'],
  '/billing': ['admin', 'billing_manager'],
  '/reports': ['admin', 'analyst'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const userRole = request.cookies.get('user-role')?.value;
  // In production: decode from JWT token instead of cookie

  // Check if this route has role restrictions
  const requiredRoles = Object.entries(ROUTE_PERMISSIONS).find(([path]) =>
    pathname.startsWith(path)
  )?.[1];

  if (requiredRoles && (!userRole || !requiredRoles.includes(userRole))) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}
\`\`\`

---

## URL Rewriting

Rewrites change the destination URL without changing what the user sees in their browser:

\`\`\`tsx
// middleware.ts

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // A/B Testing: Send 50% of users to /new-homepage
  if (pathname === '/') {
    const bucket = Math.random() < 0.5 ? 'control' : 'variant';

    const url = request.nextUrl.clone();
    url.pathname = bucket === 'variant' ? '/new-homepage' : '/homepage';

    const response = NextResponse.rewrite(url);
    response.cookies.set('ab-bucket', bucket, { maxAge: 86400 }); // Remember bucket
    return response;
  }

  // Multi-tenant: route by subdomain
  const hostname = request.headers.get('host') ?? '';
  const subdomain = hostname.split('.')[0];

  if (subdomain && subdomain !== 'www' && subdomain !== 'app') {
    // app.company1.yourdomain.com → /tenants/company1/...
    const url = request.nextUrl.clone();
    url.pathname = \`/tenants/\${subdomain}\${pathname}\`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
\`\`\`

---

## Localization / Internationalization

\`\`\`tsx
// middleware.ts

import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const SUPPORTED_LOCALES = ['en', 'fr', 'de', 'es', 'ja'];
const DEFAULT_LOCALE = 'en';

function getLocale(request: NextRequest): string {
  // Check URL for explicit locale (/en/products, /fr/products)
  const pathnameLocale = SUPPORTED_LOCALES.find(locale =>
    request.nextUrl.pathname.startsWith(\`/\${locale}/\`) ||
    request.nextUrl.pathname === \`/\${locale}\`
  );
  if (pathnameLocale) return pathnameLocale;

  // Check cookie
  const savedLocale = request.cookies.get('locale')?.value;
  if (savedLocale && SUPPORTED_LOCALES.includes(savedLocale)) return savedLocale;

  // Negotiate from Accept-Language header
  const headers = { 'accept-language': request.headers.get('accept-language') ?? 'en' };
  const languages = new Negotiator({ headers }).languages();

  return match(languages, SUPPORTED_LOCALES, DEFAULT_LOCALE);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files
  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Check if URL already has a locale prefix
  const hasLocale = SUPPORTED_LOCALES.some(
    locale => pathname.startsWith(\`/\${locale}/\`) || pathname === \`/\${locale}\`
  );

  if (!hasLocale) {
    const locale = getLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = \`/\${locale}\${pathname}\`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
\`\`\`

---

## Rate Limiting

\`\`\`tsx
// middleware.ts — Simple in-memory rate limiter
// For production, use Redis (Upstash) for distributed rate limiting

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limit (NOT suitable for multiple instances)
// Use Upstash Redis for production
const requests = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 100;    // Max requests
const WINDOW_MS = 60_000;  // Per minute

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? '127.0.0.1';
  const now = Date.now();

  const entry = requests.get(ip);

  if (!entry || entry.resetTime < now) {
    // New window
    requests.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return NextResponse.next();
  }

  if (entry.count >= RATE_LIMIT) {
    return Response.json(
      { error: 'Rate limit exceeded. Try again in a minute.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((entry.resetTime - now) / 1000)),
          'X-RateLimit-Limit': String(RATE_LIMIT),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  entry.count++;
  return NextResponse.next();
}
\`\`\`

---

## Middleware Limitations

Middleware runs on Edge Runtime — it has restrictions:

\`\`\`tsx
// ❌ NOT allowed in middleware:
import { db } from '@/lib/db';     // No native Node.js modules (Prisma uses them)
import { readFile } from 'fs';      // No filesystem
import { createHash } from 'crypto'; // ❌ But...

// ✅ Allowed — Web Crypto API works:
const encoder = new TextEncoder();
const data = encoder.encode(secret);
const hashBuffer = await crypto.subtle.digest('SHA-256', data);

// ✅ Allowed — Edge-compatible libraries:
import * as jose from 'jose'; // JWT library (edge-compatible)
import { match } from 'path-to-regexp'; // Path matching

// ❌ Middleware cannot:
// - Make database queries (no Prisma, no direct DB connection)
// - Read environment secrets securely (use config.matcher + server)
// - Run heavy computation

// For database access, use Server Components or Route Handlers.
// Middleware is for FAST request/response logic only.
\`\`\``,

  codeExamples: [
    {
      title: 'Production authentication middleware',
      code: `// middleware.ts — Production-ready auth middleware

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose'; // Edge-compatible JWT library

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// Route protection configuration
const PROTECTED_PREFIXES = ['/dashboard', '/settings', '/admin', '/api/protected'];
const ADMIN_PREFIXES = ['/admin'];
const AUTH_PAGES = ['/login', '/register'];

async function validateToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; role: string; exp: number };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/public') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth-token')?.value;
  const payload = token ? await validateToken(token) : null;

  const isAuthenticated = !!payload;
  const isAdmin = payload?.role === 'admin';

  // Redirect logged-in users away from auth pages
  if (isAuthenticated && AUTH_PAGES.some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protect authenticated-only routes
  if (PROTECTED_PREFIXES.some(p => pathname.startsWith(p))) {
    if (!isAuthenticated) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    // Admin-only routes
    if (ADMIN_PREFIXES.some(p => pathname.startsWith(p)) && !isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Inject user context into request headers
    const headers = new Headers(request.headers);
    headers.set('x-user-id', payload!.userId);
    headers.set('x-user-role', payload!.role);

    return NextResponse.next({ request: { headers } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};`,
      explanation:
        'Production auth middleware handles: redirecting logged-in users away from login page, protecting routes with authentication, admin-only route protection, and injecting user context into request headers for downstream Server Components to read via headers() function.',
    },
  ],

  commonMistakes: [
    'Trying to use Prisma or database clients in middleware — Edge Runtime does not support Node.js native modules.',
    'Making middleware too heavy — middleware should be fast (edge checks, cookie reads, JWT verification). Heavy logic belongs in Route Handlers.',
    'Not setting the matcher — without a matcher, middleware runs on EVERY request including static files.',
    'Using process.env secrets in Edge Runtime code without checking they are available — not all env vars are available at edge.',
    'Redirecting in a loop — if your login page is not excluded from the auth check, authenticated users redirected away will be caught in an infinite loop.',
    'Forgetting to handle the OPTIONS preflight in API middleware — CORS preflight must pass through or be handled.',
  ],

  interviewQuestions: [
    {
      question: 'What is middleware in Next.js and where does it run?',
      answer:
        'Middleware is a function that runs before every matched request reaches your Next.js routes. It lives at the root of the project in middleware.ts. It runs on the Edge Runtime — at CDN edge locations near the user, before the request reaches your application server. This means middleware runs globally with near-zero latency regardless of where the user is. Middleware can redirect, rewrite, or block requests, modify headers, and read/set cookies. It is ideal for authentication guards, A/B testing, localization routing, and rate limiting — any logic that needs to run on every request with minimal latency.',
      difficulty: 'intermediate',
    },
    {
      question: 'What are the limitations of Next.js middleware?',
      answer:
        'Middleware runs on Edge Runtime which has significant restrictions: (1) No native Node.js modules — no Prisma, no filesystem, no native crypto (but Web Crypto API works). (2) No database connections — you cannot query a database from middleware. (3) Limited environment access — use only edge-compatible environment variables. (4) No long-running operations — middleware must be fast (milliseconds). (5) Limited memory — edge functions have lower memory limits. Practical implications: for JWT verification, use edge-compatible libraries like jose instead of jsonwebtoken. For database-based auth checks, verify the JWT in middleware (stateless check) and leave database lookups to Server Components or Route Handlers.',
      difficulty: 'advanced',
    },
  ],

  exercises: [
    {
      id: 'mw-ex-1',
      title: 'Implement auth middleware with redirect after login',
      description: `Build middleware that:
1. Protects /dashboard and /settings routes (requires auth)
2. Protects /admin routes (requires admin role)
3. Redirects unauthenticated users to /login?callbackUrl=[path]
4. After login, redirects back to the original URL
5. Skips static files and the login/register pages themselves`,
      starterCode: `// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simulate token validation (in real app, verify JWT)
function parseUserFromCookie(cookie: string | undefined) {
  if (!cookie) return null;
  // Mock: cookie format is "userId:role" e.g. "123:admin" or "456:user"
  const [userId, role] = cookie.split(':');
  return { userId, role };
}

export function middleware(request: NextRequest) {
  // TODO: Implement the middleware
  // 1. Skip static files
  // 2. Skip auth pages (/login, /register)
  // 3. For /admin routes: require auth + admin role
  // 4. For /dashboard, /settings: require auth
  // 5. Redirect to /login?callbackUrl=... if not authed
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};`,
      solution: `// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function parseUserFromCookie(cookie: string | undefined) {
  if (!cookie) return null;
  const [userId, role] = cookie.split(':');
  if (!userId || !role) return null;
  return { userId, role };
}

const PROTECTED_ROUTES = ['/dashboard', '/settings'];
const ADMIN_ROUTES = ['/admin'];
const AUTH_PAGES = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files
  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const userCookie = request.cookies.get('user')?.value;
  const user = parseUserFromCookie(userCookie);

  // Redirect authenticated users away from login/register
  if (AUTH_PAGES.some(p => pathname.startsWith(p))) {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Admin routes: require admin role
  if (ADMIN_ROUTES.some(p => pathname.startsWith(p))) {
    if (!user) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    if (user.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    return NextResponse.next();
  }

  // Protected routes: require auth
  if (PROTECTED_ROUTES.some(p => pathname.startsWith(p))) {
    if (!user) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

// To use callbackUrl after login:
// In your login Server Action or Route Handler:
// const callbackUrl = formData.get('callbackUrl') as string || '/dashboard';
// redirect(callbackUrl.startsWith('/') ? callbackUrl : '/dashboard');`,
      hints: [
        'Auth pages (/login, /register) should be reachable without auth',
        'Use Array.some() to check if pathname starts with any protected prefix',
        'The callbackUrl lets users return to where they were going after login',
        'Validate callbackUrl starts with / to prevent open redirect attacks',
      ],
    },
  ],

  keyTakeaways: [
    'Middleware runs at the Edge Runtime before requests reach your routes — extremely fast, near-zero latency.',
    'Middleware lives at the project root as middleware.ts — not inside /app.',
    'Use config.matcher to control which paths trigger middleware — always exclude static files.',
    'Middleware is ideal for: auth guards, role checks, redirects, rewrites, A/B testing, localization.',
    'Edge Runtime limitations: no database connections, no native Node.js modules, no Prisma.',
    'For JWT verification, use edge-compatible libraries (jose instead of jsonwebtoken).',
    'Middleware can inject user context via request headers — Server Components read it with headers().',
    'Always exclude the login page from auth middleware to prevent redirect loops.',
  ],
};
