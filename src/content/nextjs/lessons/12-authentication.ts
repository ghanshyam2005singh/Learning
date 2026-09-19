import type { Lesson } from '@/types';

export const authenticationLesson: Lesson = {
  id: 'nextjs-authentication',
  slug: 'nextjs-authentication',
  title: 'Authentication',
  description:
    'Master authentication in Next.js — session-based auth, JWT auth, OAuth, social login, NextAuth.js, protected routes, RBAC, middleware protection, and production auth architecture.',
  category: 'Authentication',
  order: 12,
  difficulty: 'advanced',
  estimatedTime: 70,
  prevLesson: 'nextjs-middleware',
  nextLesson: 'nextjs-database-integration',

  content: `# Authentication in Next.js

## Authentication in the Full-Stack Context

Next.js applications need authentication at multiple layers:

1. **Middleware** — Block requests before they reach your routes
2. **Server Components** — Verify user before rendering a page
3. **Route Handlers** — Protect API endpoints
4. **Server Actions** — Verify user before mutating data

You need authentication to work consistently across all four layers.

---

## Authentication Strategies

### Session-Based Authentication

Session auth stores user data server-side. The browser gets a session ID cookie.

\`\`\`
Login:
  User sends credentials →
  Server validates, creates session in DB/Redis →
  Server sends session_id cookie to browser

Subsequent requests:
  Browser sends session_id cookie →
  Server looks up session in DB →
  Server gets user data from session
\`\`\`

\`\`\`tsx
// Server Action: Login with session
"use server";

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Find user
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return { error: 'Invalid credentials' };

  // Verify password
  const valid = await bcrypt.compare(password, user.hashedPassword);
  if (!valid) return { error: 'Invalid credentials' };

  // Create session in database
  const sessionId = randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await db.session.create({
    data: {
      id: sessionId,
      userId: user.id,
      expiresAt,
    },
  });

  // Set session cookie
  cookies().set('session', sessionId, {
    httpOnly: true,    // Not accessible via JavaScript
    secure: true,      // HTTPS only in production
    sameSite: 'lax',   // CSRF protection
    expires: expiresAt,
    path: '/',
  });

  redirect('/dashboard');
}

export async function logout() {
  const sessionId = cookies().get('session')?.value;
  if (sessionId) {
    await db.session.delete({ where: { id: sessionId } });
  }
  cookies().delete('session');
  redirect('/login');
}
\`\`\`

### JWT Authentication

JWT stores user data client-side in a signed token. No server-side storage needed.

\`\`\`tsx
// lib/jwt.ts
import * as jose from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export type JWTPayload = {
  userId: string;
  email: string;
  role: string;
};

export async function createToken(payload: JWTPayload): Promise<string> {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Token expires in 7 days
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jose.jwtVerify(token, SECRET);
  return payload as JWTPayload;
}

// Server Action: Login with JWT
"use server";

export async function loginWithJWT(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const user = await db.user.findUnique({ where: { email } });
  if (!user) return { error: 'Invalid credentials' };

  const valid = await bcrypt.compare(password, user.hashedPassword);
  if (!valid) return { error: 'Invalid credentials' };

  const token = await createToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  cookies().set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });

  redirect('/dashboard');
}
\`\`\`

### Session vs JWT Comparison

| | Session-Based | JWT |
|---|---|---|
| Storage | Server (DB/Redis) | Client (cookie/localStorage) |
| Revocation | Instant (delete from DB) | Cannot revoke until expiry |
| Scalability | Requires shared state (Redis) | Stateless — works across servers |
| Payload size | Small (just an ID) | Larger (all user data in token) |
| Database lookup | Every request | Only for sensitive operations |
| Use case | Standard web apps | Microservices, cross-domain auth |

**Recommendation:** For most Next.js apps, sessions work well. For microservices or multiple services sharing auth, JWT is better.

---

## The Auth Data Access Layer

Create a centralized auth helper — reference this throughout your app:

\`\`\`tsx
// lib/auth.ts
import { cache } from 'react';
import { cookies } from 'next/headers';

// Session-based implementation
export const getCurrentUser = cache(async () => {
  const sessionId = cookies().get('session')?.value;
  if (!sessionId) return null;

  const session = await db.session.findUnique({
    where: {
      id: sessionId,
      expiresAt: { gt: new Date() }, // Not expired
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true, avatarUrl: true },
      },
    },
  });

  return session?.user ?? null;
});

// Require auth — redirects if not authenticated
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    const { redirect } = await import('next/navigation');
    redirect('/login');
  }
  return user;
}

// Require specific role
export async function requireRole(role: string) {
  const user = await requireAuth();
  if (user.role !== role) {
    const { redirect } = await import('next/navigation');
    redirect('/unauthorized');
  }
  return user;
}
\`\`\`

Usage across your app:

\`\`\`tsx
// In a Server Component page
export default async function DashboardPage() {
  const user = await requireAuth(); // Redirects if not logged in
  return <Dashboard user={user} />;
}

// In a Server Action
export async function updateProfile(formData: FormData) {
  "use server";
  const user = await requireAuth();
  await db.user.update({ where: { id: user.id }, data: { ... } });
}

// In a Route Handler
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  return Response.json({ user });
}
\`\`\`

---

## NextAuth.js (Auth.js)

NextAuth.js is the most popular auth library for Next.js. It handles OAuth providers, credentials, sessions, and database adapters.

### Why use NextAuth.js

- Pre-built OAuth for 50+ providers (Google, GitHub, Discord, etc.)
- Built-in session management
- Database adapters (Prisma, Drizzle, etc.)
- CSRF protection built-in
- Token rotation handled automatically
- TypeScript support

### Why NOT to use NextAuth.js

- Adds complexity for simple email/password apps
- Version 5 (Auth.js) has breaking changes from v4
- Heavy abstraction can make debugging difficult
- If you have very custom auth requirements

### Basic NextAuth Setup (v5 / Auth.js)

\`\`\`tsx
// auth.ts (root level)
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';
import bcrypt from 'bcrypt';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      async authorize(credentials) {
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user || !user.hashedPassword) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        );
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    session({ session, token }) {
      session.user.id = token.sub!;
      return session;
    },
  },
  pages: {
    signIn: '/login', // Custom login page
    error: '/auth/error',
  },
});

// app/api/auth/[...nextauth]/route.ts
export { GET, POST } from '@/auth';

// middleware.ts — Protect routes with NextAuth
import { auth } from '@/auth';

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith('/dashboard')) {
    return Response.redirect(new URL('/login', req.url));
  }
});
\`\`\`

---

## OAuth / Social Login

\`\`\`tsx
// app/login/page.tsx

import { signIn } from '@/auth';

export default function LoginPage() {
  return (
    <div>
      <h1>Sign In</h1>

      {/* Google OAuth */}
      <form action={async () => {
        'use server';
        await signIn('google', { redirectTo: '/dashboard' });
      }}>
        <button type="submit">Sign in with Google</button>
      </form>

      {/* GitHub OAuth */}
      <form action={async () => {
        'use server';
        await signIn('github', { redirectTo: '/dashboard' });
      }}>
        <button type="submit">Sign in with GitHub</button>
      </form>

      {/* Credentials form */}
      <CredentialsForm />
    </div>
  );
}
\`\`\`

---

## Protected Routes Architecture

\`\`\`tsx
// Three layers of protection (defense in depth):

// LAYER 1: Middleware (fastest — runs at edge before any server load)
// middleware.ts — blocks unauthenticated requests early

// LAYER 2: Layout (catches anything middleware missed, redirects)
// app/(app)/layout.tsx
export default async function AppLayout({ children }) {
  const user = await requireAuth(); // Redirects if not authenticated
  return (
    <div>
      <Sidebar user={user} />
      <main>{children}</main>
    </div>
  );
}

// LAYER 3: Page level (for role-specific protection)
// app/(app)/admin/page.tsx
export default async function AdminPage() {
  const user = await requireRole('admin'); // Redirects if not admin
  return <AdminDashboard user={user} />;
}

// Why multiple layers?
// - Middleware can't do database lookups (Edge Runtime limitation)
// - Layout covers what middleware misses (e.g., after session validation)
// - Page level for fine-grained role control
// - Defense in depth: if one layer has a bug, others catch it
\`\`\``,

  codeExamples: [
    {
      title: 'Complete email/password auth implementation',
      code: `// Complete auth system without NextAuth.js
// Simple, transparent, fully custom

// ── Types ────────────────────────────────────────────────────
type User = { id: string; name: string; email: string; role: 'user' | 'admin' };

// ── lib/auth.ts ──────────────────────────────────────────────
import { cache } from 'react';
import { cookies } from 'next/headers';
import * as jose from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const token = cookies().get('auth')?.value;
  if (!token) return null;

  try {
    const { payload } = await jose.jwtVerify(token, SECRET);
    return payload as unknown as User;
  } catch {
    return null; // Token expired or invalid
  }
});

export const requireAuth = async (): Promise<User> => {
  const user = await getCurrentUser();
  if (!user) {
    const { redirect } = await import('next/navigation');
    redirect('/login');
  }
  return user;
};

// ── lib/actions/auth.ts ──────────────────────────────────────
"use server";

import bcrypt from 'bcrypt';
import * as jose from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60,
};

const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const RegisterSchema = LoginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export async function register(prev: any, formData: FormData) {
  const result = RegisterSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!result.success) return { errors: result.error.flatten().fieldErrors };

  const existing = await db.user.findUnique({ where: { email: result.data.email } });
  if (existing) return { errors: { email: ['Email already registered'] } };

  const hashedPassword = await bcrypt.hash(result.data.password, 12);
  const user = await db.user.create({
    data: { name: result.data.name, email: result.data.email, hashedPassword, role: 'user' },
  });

  await setAuthCookie(user);
  redirect('/dashboard');
}

export async function login(prev: any, formData: FormData) {
  const result = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!result.success) return { errors: result.error.flatten().fieldErrors };

  const user = await db.user.findUnique({ where: { email: result.data.email } });

  // Use constant-time comparison to prevent timing attacks
  const passwordToCheck = user?.hashedPassword ?? '$2b$12$invalid';
  const valid = await bcrypt.compare(result.data.password, passwordToCheck);

  if (!user || !valid) {
    return { errors: { _form: ['Invalid email or password'] } };
  }

  await setAuthCookie(user);

  const callbackUrl = formData.get('callbackUrl') as string;
  redirect(callbackUrl?.startsWith('/') ? callbackUrl : '/dashboard');
}

export async function logout() {
  cookies().delete('auth');
  redirect('/login');
}

async function setAuthCookie(user: User) {
  const token = await new jose.SignJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET);

  cookies().set('auth', token, COOKIE_OPTIONS);
}`,
      explanation:
        'A complete custom auth system covering registration, login, logout, JWT tokens, and security measures (constant-time comparison to prevent timing attacks, httpOnly cookies, CSRF protection via sameSite).',
    },
  ],

  commonMistakes: [
    'Storing JWT in localStorage instead of httpOnly cookies — localStorage is vulnerable to XSS attacks.',
    'Not validating callbackUrl — check it starts with "/" to prevent open redirect attacks.',
    'Using the same error message for "user not found" and "wrong password" is correct — different messages help attackers enumerate valid emails.',
    'Skipping the authorization check inside Server Actions — middleware protects routes but not actions called programmatically.',
    'Not setting token expiry — tokens without expiry are a security risk if ever compromised.',
    'Using plain password comparison instead of bcrypt — never store or compare plain text passwords.',
  ],

  interviewQuestions: [
    {
      question: 'How do you implement authentication in a Next.js App Router application?',
      answer:
        'Authentication in Next.js requires coverage at multiple layers: (1) Middleware for fast request blocking at the edge — verifies the JWT or session cookie, redirects unauthenticated requests before they reach the server. (2) Server Component layouts for authenticated sections — runs getCurrentUser() and redirects if null. (3) Server Actions — always call getCurrentUser() before any mutation. (4) Route Handlers — check auth header or cookie before processing. The auth data access layer should use React cache() so multiple components calling getCurrentUser() only hit the database once per request.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is the difference between session-based and JWT authentication?',
      answer:
        'Session-based auth stores user data on the server (in a database or Redis) and gives the client only a session ID in a cookie. Every request requires a DB lookup to fetch the session. Advantages: instant revocation (delete the session), small cookie size, user data always current. JWT auth stores all user data in a signed token on the client. No server storage needed. Advantages: stateless (works across multiple servers without shared storage), good for microservices. Disadvantages: cannot revoke a JWT until it expires; if user changes role, the token still has the old role until expiry. For most Next.js apps, session-based auth is simpler and more flexible. JWT is preferred for microservices architectures.',
      difficulty: 'intermediate',
    },
    {
      question: 'Why is it important to use httpOnly cookies for auth tokens?',
      answer:
        'httpOnly cookies cannot be accessed via JavaScript (document.cookie). This prevents XSS (Cross-Site Scripting) attacks from stealing auth tokens. If a malicious script is injected into your page, it cannot read httpOnly cookies. localStorage and regular cookies do not have this protection. Additional cookie security flags: secure (only sent over HTTPS, prevents interception on HTTP), sameSite: lax (prevents CSRF attacks by not sending the cookie on cross-site requests that use unsafe methods). These three flags together — httpOnly, secure, sameSite — are the baseline security requirements for auth cookies in production.',
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'auth-ex-1',
      title: 'Build a protected page with auth check at multiple layers',
      description: `Using the auth helpers provided, build a protected dashboard that:
1. Uses middleware to block unauthenticated requests
2. Uses layout to verify auth server-side (defense in depth)
3. Shows user name and role from the server
4. Has a logout button (Server Action)

The admin dashboard (/dashboard/admin) should only be accessible to users with role="admin".`,
      starterCode: `// Provided auth helpers:
// getCurrentUser() → User | null (cached per request)
// requireAuth() → User (redirects if not authed)
// requireRole(role) → User (redirects if wrong role)
// logout() Server Action

// TODO 1: middleware.ts — block unauthenticated /dashboard requests
// TODO 2: app/(app)/layout.tsx — auth check at layout level
// TODO 3: app/(app)/dashboard/page.tsx — user dashboard page
// TODO 4: app/(app)/dashboard/admin/page.tsx — admin-only page`,
      solution: `// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/dashboard')) return NextResponse.next();

  const token = request.cookies.get('auth')?.value;
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  try {
    await jose.jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }
}

export const config = { matcher: ['/dashboard/:path*'] };

// ──────────────────────────────────────────────────────────────

// app/(app)/layout.tsx
import { requireAuth } from '@/lib/auth';
import { logout } from '@/lib/actions/auth';

export default async function AppLayout({ children }) {
  const user = await requireAuth(); // Defense in depth
  return (
    <div>
      <header>
        <span>Hello, {user.name} ({user.role})</span>
        <form action={logout}>
          <button type="submit">Logout</button>
        </form>
      </header>
      <main>{children}</main>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────

// app/(app)/dashboard/page.tsx
import { requireAuth } from '@/lib/auth';

export default async function DashboardPage() {
  const user = await requireAuth();
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome back, {user.name}!</p>
      <p>Your email: {user.email}</p>
      {user.role === 'admin' && (
        <a href="/dashboard/admin">Go to Admin Panel →</a>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────

// app/(app)/dashboard/admin/page.tsx
import { requireRole } from '@/lib/auth';

export default async function AdminPage() {
  const user = await requireRole('admin'); // Redirects non-admins
  return (
    <div>
      <h1>Admin Panel</h1>
      <p>You are logged in as admin: {user.email}</p>
    </div>
  );
}`,
      hints: [
        'Middleware does a fast JWT check without DB lookup — just signature verification',
        'Layout does a full auth check with DB lookup for session validation',
        'requireRole() should internally call requireAuth() first',
        'The logout form uses a Server Action with "use server" to delete the cookie',
      ],
    },
  ],

  keyTakeaways: [
    'Authentication in Next.js requires coverage at four layers: middleware, layouts, Server Actions, and Route Handlers.',
    'Sessions store data server-side (instant revocation, small cookie). JWT is client-side (stateless, good for microservices).',
    'Always use httpOnly + secure + sameSite cookies for auth tokens — never localStorage.',
    'The auth data layer (getCurrentUser with cache()) prevents duplicate DB calls per request.',
    'Use multiple layers of protection: middleware for speed, layout for depth, page for fine-grained roles.',
    'NextAuth.js handles OAuth providers, sessions, and database adapters — good for social login.',
    'Never reveal in error messages which part of credentials is wrong — use "Invalid email or password" for both cases.',
    'Always check authorization (ownership) in Server Actions — authenticated does not mean authorized.',
  ],
};
