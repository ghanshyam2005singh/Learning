import type { Lesson } from '@/types';

export const securityLesson: Lesson = {
  id: 'nextjs-security',
  slug: 'nextjs-security',
  title: 'Security Best Practices',
  description:
    'Master security in Next.js — CSRF protection, XSS prevention, SQL injection, CORS, rate limiting, security headers, secrets management, and the OWASP Top 10 in the Next.js context.',
  category: 'Security',
  order: 19,
  difficulty: 'advanced',
  estimatedTime: 50,
  prevLesson: 'nextjs-error-handling',
  nextLesson: 'nextjs-internationalization',

  content: `# Security Best Practices in Next.js

## Security Mindset for Next.js Developers

Next.js applications span the full stack — the same codebase handles the frontend, API routes, and server-side logic. This means more surface area, but also more control.

The core principle: **never trust input, always validate, always authorize**.

---

## Authentication vs Authorization

These two are constantly confused:

- **Authentication (AuthN)**: WHO are you? (verified by session/JWT)
- **Authorization (AuthZ)**: WHAT can you do? (verified by role/permission)

A bug in authentication = anyone can access any account (critical).
A bug in authorization = logged-in users can access things they should not (also critical).

Both must be checked at EVERY protected layer.

---

## NEVER Trust the Client

\`\`\`tsx
// ❌ DANGEROUS — trusting client-provided IDs
// A malicious user can send any userId in the request body
export async function deletePost(formData: FormData) {
  const userId = formData.get('userId'); // NEVER trust this
  const postId = formData.get('postId');
  await db.post.delete({ where: { id: postId, authorId: userId } });
}

// ✅ CORRECT — get user identity from the session (server-controlled)
export async function deletePost(formData: FormData) {
  const session = await requireAuth(); // Reads from httpOnly cookie
  const postId = formData.get('postId') as string;

  // Check ownership before deletion
  const post = await db.post.findUnique({ where: { id: postId } });
  if (!post || post.authorId !== session.userId) {
    throw new Error('Unauthorized');
  }

  await db.post.delete({ where: { id: postId } });
}
\`\`\`

---

## Server Actions Security Checklist

Every Server Action should follow this pattern:

\`\`\`tsx
"use server";

export async function updateUserRole(formData: FormData) {
  // ──────────────── 1. Authentication ────────────────────────────
  const session = await requireAuth();
  // Throws if not logged in — no execution continues

  // ──────────────── 2. Authorization ─────────────────────────────
  if (session.role !== 'admin') {
    throw new Error('Unauthorized: admin role required');
  }

  // ──────────────── 3. Input Validation ──────────────────────────
  const result = UpdateRoleSchema.safeParse({
    targetUserId: formData.get('targetUserId'),
    newRole: formData.get('newRole'),
  });

  if (!result.success) {
    return { error: 'Invalid input' };
  }

  // ──────────────── 4. Business Logic ────────────────────────────
  // Prevent privilege escalation — admin cannot make someone super-admin
  if (result.data.newRole === 'super-admin') {
    return { error: 'Cannot assign super-admin role' };
  }

  // ──────────────── 5. Execute ────────────────────────────────────
  await db.user.update({
    where: { id: result.data.targetUserId },
    data: { role: result.data.newRole },
  });

  return { success: true };
}
\`\`\`

---

## Security Headers

\`\`\`tsx
// next.config.ts — Security headers

const securityHeaders = [
  // Prevents clickjacking — page cannot be rendered in an iframe
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },

  // Prevents MIME type sniffing — browser respects Content-Type
  { key: 'X-Content-Type-Options', value: 'nosniff' },

  // Forces HTTPS for 1 year (production only)
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },

  // Controls what the browser sends in Referer header
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

  // Restricts what permissions the page can request
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },

  // Content Security Policy — most powerful, prevents XSS
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Relax for Next.js
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
    ].join('; '),
  },
];

export default {
  async headers() {
    return [
      {
        source: '/(.*)',   // Apply to all routes
        headers: securityHeaders,
      },
    ];
  },
};
\`\`\`

---

## Rate Limiting

\`\`\`tsx
// middleware.ts — Rate limiting with Upstash Redis (production-grade)
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '60 s'), // 10 requests per 60 seconds
  analytics: true,
});

export async function middleware(request: NextRequest) {
  // Rate limit auth endpoints specifically
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    const ip = request.ip ?? 'anonymous';
    const { success, limit, remaining, reset } = await ratelimit.limit(ip);

    if (!success) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      });
    }
  }

  return NextResponse.next();
}
\`\`\`

---

## SQL Injection Prevention

Using Prisma or Drizzle ORM protects you from SQL injection by default — all queries use parameterized statements:

\`\`\`tsx
// ✅ SAFE — Prisma parameterizes automatically
const users = await db.user.findMany({
  where: { email: userInput }, // userInput is parameterized, never injected
});

// ✅ SAFE — Drizzle ORM
const users = await db.select().from(usersTable).where(eq(usersTable.email, userInput));

// ❌ DANGEROUS — raw SQL with string interpolation
const users = await db.$queryRawUnsafe(
  \`SELECT * FROM users WHERE email = '\${userInput}'\` // NEVER do this
);

// ✅ SAFE — raw SQL with parameterized values (when you must use raw SQL)
const users = await db.$queryRaw\`SELECT * FROM users WHERE email = \${userInput}\`;
// Prisma tagged template → parameterized query, safe from injection
\`\`\`

---

## XSS Prevention

\`\`\`tsx
// Next.js (React) escapes HTML by default — JSX is safe
export function Comment({ text }: { text: string }) {
  return <p>{text}</p>; // React escapes text — <script> becomes &lt;script&gt;
}

// ❌ DANGEROUS — never use dangerouslySetInnerHTML with user content
export function BlogPost({ htmlContent }: { htmlContent: string }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    // If htmlContent contains <script>alert('XSS')</script>, it EXECUTES
  );
}

// ✅ SAFE — sanitize before using dangerouslySetInnerHTML
import DOMPurify from 'isomorphic-dompurify';

export function BlogPost({ htmlContent }: { htmlContent: string }) {
  const sanitized = DOMPurify.sanitize(htmlContent, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'li', 'a', 'h2', 'h3'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });

  return (
    <div dangerouslySetInnerHTML={{ __html: sanitized }} />
  );
}
\`\`\`

---

## Environment Variables Security

\`\`\`tsx
// ✅ Server-only secrets (never exposed to client)
process.env.DATABASE_URL         // Only in Server Components, Server Actions, Route Handlers
process.env.JWT_SECRET           // Only server-side
process.env.STRIPE_SECRET_KEY    // Only server-side

// ✅ Client-safe public variables (start with NEXT_PUBLIC_)
process.env.NEXT_PUBLIC_API_URL  // Safe to expose
process.env.NEXT_PUBLIC_APP_URL  // Safe to expose

// ❌ DANGEROUS — accessing a server secret in a Client Component
"use client";
function MyComponent() {
  // DATABASE_URL does NOT exist in the browser bundle — it is undefined
  // But if you accidentally use NEXT_PUBLIC_DATABASE_URL, it IS exposed
  const db = process.env.DATABASE_URL; // undefined in browser
}

// Protect secrets with server-only guard:
// lib/server-only.ts (import this in files that must not run on client)
import 'server-only'; // Throws build error if imported in Client Component
\`\`\`

---

## CORS for Route Handlers

\`\`\`tsx
// app/api/posts/route.ts — CORS configuration
import { NextResponse } from 'next/server';

const ALLOWED_ORIGINS = ['https://app.acme.com', 'https://admin.acme.com'];

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin') ?? '';
  const isAllowed = ALLOWED_ORIGINS.includes(origin);

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': isAllowed ? origin : '',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function GET(request: Request) {
  const origin = request.headers.get('origin') ?? '';
  const isAllowed = ALLOWED_ORIGINS.includes(origin);

  const posts = await db.post.findMany();

  return NextResponse.json(posts, {
    headers: {
      'Access-Control-Allow-Origin': isAllowed ? origin : '',
    },
  });
}
\`\`\``,

  codeExamples: [
    {
      title: 'Defense in depth — auth at every layer',
      code: `// Three layers of protection for a sensitive admin action

// Layer 1: Middleware (Edge) — block non-authenticated traffic early
// middleware.ts
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('session')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  return NextResponse.next();
}

// Layer 2: Layout (Server Component) — verify role and redirect
// app/admin/layout.tsx
export default async function AdminLayout({ children }) {
  const user = await getCurrentUser(); // Full DB check

  if (!user || user.role !== 'admin') {
    redirect('/'); // Can't access admin as non-admin
  }

  return (
    <AdminShell user={user}>
      {children}
    </AdminShell>
  );
}

// Layer 3: Server Action — re-verify for every mutation
// lib/actions/admin.ts
"use server";

export async function deleteUser(formData: FormData) {
  // Even though the UI only renders for admins,
  // someone could call this action directly via fetch
  const session = await requireAuth();
  if (session.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const targetUserId = formData.get('userId') as string;

  // Prevent self-deletion
  if (targetUserId === session.userId) {
    return { error: 'You cannot delete your own account' };
  }

  await db.user.delete({ where: { id: targetUserId } });
  revalidatePath('/admin/users');
  return { success: true };
}`,
      explanation:
        'Each layer catches different attack vectors: Middleware catches unauthenticated requests at the edge before any server work happens. Layout prevents rendering for unauthorized users. Server Action re-checks because actions are plain POST endpoints — anyone can call them directly, bypassing the UI entirely.',
    },
  ],

  commonMistakes: [
    'Trusting user-provided IDs in Server Actions — always get the user ID from the session, never from form data.',
    'Skipping authorization (authZ) after authentication (authN) — just because a user is logged in does not mean they can do anything.',
    'Using NEXT_PUBLIC_ prefix for secrets — these are bundled into the client JavaScript and visible to anyone.',
    'Using dangerouslySetInnerHTML with unsan itized user content — always sanitize with DOMPurify.',
    'Not adding security headers — clickjacking, MIME sniffing, and many other attacks are trivially blocked by headers.',
    'Relying only on client-side validation — validation must happen on the server for every request.',
    'Storing secrets in .env and committing to git — use .env.local (in .gitignore) for secrets.',
  ],

  interviewQuestions: [
    {
      question: 'What is the difference between authentication and authorization, and how do you implement both in Next.js?',
      answer:
        "Authentication (AuthN) answers 'who are you?' and is typically implemented by verifying a session cookie or JWT token. In Next.js, you check authentication in middleware (using jose for Edge-compatible JWT verification) and in Server Components using a requireAuth() helper that reads from cookies. Authorization (AuthZ) answers 'what can you do?' and is implemented by checking the authenticated user's role or permissions against the requested action. In Next.js, authorization happens in: layouts (redirect non-admin users away from admin routes), Server Actions (check role before executing mutations), and Route Handlers (check role before returning sensitive data). Critical: you must check both on every request. A user could bypass the UI and call a Server Action directly via a POST request, so the action must always re-verify auth and authz regardless of what the UI shows.",
      difficulty: 'intermediate',
    },
    {
      question: 'How does Next.js protect against CSRF attacks?',
      answer:
        "CSRF (Cross-Site Request Forgery) is when a malicious site tricks your browser into making requests to another site where you are authenticated. Next.js Server Actions have built-in CSRF protection: they require the Content-Type header to be 'text/plain' or 'multipart/form-data', they check the Origin header against the host, and they only accept POST requests. This means a cross-site form cannot trigger a Server Action. For Route Handlers, you need to implement CSRF protection manually — either check the Origin/Referer header, use a CSRF token (generate on server, validate on submission), or use SameSite=Strict cookies. The httpOnly SameSite=Lax cookie (the default) also mitigates most CSRF attacks for navigation requests.",
      difficulty: 'advanced',
    },
  ],

  exercises: [
    {
      id: 'security-ex-1',
      title: 'Secure a file deletion endpoint',
      description: `The following Server Action has multiple security vulnerabilities. Identify and fix them all:

\`\`\`tsx
"use server";
export async function deleteFile(formData: FormData) {
  const userId = formData.get('userId') as string;  // Issue 1
  const filePath = formData.get('filePath') as string;  // Issue 2
  await fs.unlink(filePath);  // Issue 3
  await db.file.delete({ where: { path: filePath } });  // Issue 4
}
\`\`\`

The action should:
- Get user identity from session
- Verify ownership before deletion
- Prevent path traversal attacks
- Handle errors properly`,
      starterCode: `"use server";

export async function deleteFile(formData: FormData) {
  const userId = formData.get('userId') as string;
  const filePath = formData.get('filePath') as string;
  await fs.unlink(filePath);
  await db.file.delete({ where: { path: filePath } });
}`,
      solution: `"use server";
import { join, resolve, normalize } from 'path';
import { unlink } from 'fs/promises';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';

const UPLOADS_DIR = resolve('./uploads');

export async function deleteFile(formData: FormData): Promise<{ success: boolean; error?: string }> {
  // Fix 1: Get user from session, never trust form data
  const session = await requireAuth();

  const fileId = formData.get('fileId') as string;

  if (!fileId) {
    return { success: false, error: 'File ID is required' };
  }

  // Fix 2: Look up file by ID (not path), then check ownership
  const file = await db.file.findUnique({ where: { id: fileId } });

  if (!file) {
    return { success: false, error: 'File not found' };
  }

  // Fix 3: Authorization — verify ownership
  if (file.userId !== session.userId) {
    return { success: false, error: 'Unauthorized' };
  }

  // Fix 4: Path traversal prevention
  // Resolve the path and ensure it is within the uploads directory
  const safePath = resolve(join(UPLOADS_DIR, file.filename));
  if (!safePath.startsWith(UPLOADS_DIR)) {
    return { success: false, error: 'Invalid file path' };
  }

  // Fix 5: Delete both the file and the DB record in a transaction
  try {
    await unlink(safePath);
    await db.file.delete({ where: { id: fileId } });
    return { success: true };
  } catch (error) {
    console.error('Failed to delete file:', error);
    return { success: false, error: 'Deletion failed. Please try again.' };
  }
}`,
      hints: [
        'Never use user-provided paths directly in fs operations — path traversal attacks use "../../../etc/passwd"',
        'Look up the file in the database first, then use its stored path (not client-provided path)',
        'Check ownership: file.userId === session.userId',
        'Validate that the resolved path starts with your uploads directory',
      ],
    },
  ],

  keyTakeaways: [
    'Never trust client-provided data — get user identity from the server-controlled session.',
    'Always check both authentication (who) and authorization (what) on every sensitive operation.',
    'Server Actions must re-verify auth/authz because they are plain POST endpoints anyone can call.',
    'Use parameterized queries (Prisma/Drizzle ORM) — never string-interpolate user input into SQL.',
    'React escapes JSX by default — only dangerous when using dangerouslySetInnerHTML with unsanitized content.',
    'Security headers (X-Frame-Options, CSP, HSTS) are a free line of defense — add them in next.config.ts.',
    'NEXT_PUBLIC_ variables are bundled into client code — never use this prefix for secrets.',
    'Defense in depth: middleware (edge) + layout (server) + action (server) — each layer catches different attacks.',
  ],
};
