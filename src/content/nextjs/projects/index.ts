import type { Project } from '@/types';

export const projects: Project[] = [
  // ─── PROJECT 1: Personal Blog ─────────────────────────────────────────────────
  {
    id: 'nextjs-personal-blog',
    slug: 'nextjs-personal-blog',
    title: 'Personal Blog with CMS',
    description: 'Build a personal blog where posts are stored in a database, rendered statically with ISR, and managed through a simple admin panel — all in one Next.js project.',
    difficulty: 'beginner',
    estimatedTime: '6-8 hours',
    techStack: ['Next.js 14', 'Prisma', 'PostgreSQL', 'Tailwind CSS', 'Zod'],
    features: [
      'Public blog listing and post pages (SSG + ISR)',
      'generateStaticParams for pre-rendered post pages',
      'generateMetadata for SEO per post',
      'Admin panel to create and publish posts',
      'Server Action for post creation with Zod validation',
      'On-demand revalidation when posts are published',
      'not-found.tsx for missing posts',
      'loading.tsx skeleton for blog listing',
    ],
    folderStructure: `nextjs-blog/
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx
│   │   ├── page.tsx          ← Homepage
│   │   └── blog/
│   │       ├── page.tsx      ← Blog listing (ISR)
│   │       ├── loading.tsx   ← Skeleton
│   │       └── [slug]/
│   │           ├── page.tsx  ← Post page (SSG)
│   │           └── not-found.tsx
│   └── (admin)/
│       ├── layout.tsx        ← Admin layout (auth check)
│       └── admin/
│           ├── page.tsx      ← Post dashboard
│           └── new/
│               └── page.tsx  ← Create post form
├── features/
│   └── posts/
│       ├── actions.ts        ← createPost, publishPost
│       ├── queries.ts        ← getPosts, getPost
│       └── schemas.ts        ← PostSchema (Zod)
├── lib/
│   └── db.ts                 ← Prisma singleton
└── prisma/
    └── schema.prisma`,
    steps: [
      {
        title: 'Initialize project and database',
        description: 'Create the Next.js app, install Prisma, define the Post schema, and push the schema to the database.',
        code: `# Create project
npx create-next-app@latest blog --typescript --tailwind --app --src-dir
cd blog
npm install prisma @prisma/client zod
npx prisma init --datasource-provider postgresql

# prisma/schema.prisma
model Post {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  excerpt     String
  content     String
  published   Boolean  @default(false)
  publishedAt DateTime?
  coverImage  String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

# Push schema to DB
npx prisma db push
npx prisma studio  # Open visual editor to add test posts`,
        hint: 'Add a few test posts via Prisma Studio before building the UI — it is easier to see if your queries work.',
      },
      {
        title: 'Create the Prisma singleton and queries',
        description: 'Set up the Prisma client singleton (prevents hot-reload connection exhaustion) and write the data access functions.',
        code: `// lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const db = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

// features/posts/queries.ts
import { cache } from 'react';
import { db } from '@/lib/db';

export const getPosts = cache(async () => {
  return db.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    select: { id: true, title: true, slug: true, excerpt: true, publishedAt: true },
  });
});

export const getPost = cache(async (slug: string) => {
  return db.post.findUnique({ where: { slug, published: true } });
});`,
        hint: 'cache() from React deduplicates queries — if generateMetadata and page both call getPost, it only hits the DB once.',
      },
      {
        title: 'Build the blog listing page with ISR',
        description: 'Create the public blog listing page that uses ISR to regenerate every 10 minutes.',
        code: `// app/(marketing)/blog/page.tsx
import { getPosts } from '@/features/posts/queries';
import Link from 'next/link';

export const revalidate = 600; // ISR: regenerate every 10 minutes

export const metadata = {
  title: 'Blog',
  description: 'Articles and tutorials',
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      {posts.length === 0 && (
        <p className="text-gray-500">No posts yet.</p>
      )}
      <div className="space-y-6">
        {posts.map(post => (
          <article key={post.id}>
            <Link href={\`/blog/\${post.slug}\`}>
              <h2 className="text-xl font-semibold hover:underline">{post.title}</h2>
            </Link>
            <p className="text-gray-500 mt-1">{post.excerpt}</p>
            {post.publishedAt && (
              <time className="text-sm text-gray-400">
                {new Date(post.publishedAt).toLocaleDateString()}
              </time>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

// app/(marketing)/blog/loading.tsx
export default function BlogLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-full mb-1" />
          <div className="h-3 bg-gray-100 rounded w-24" />
        </div>
      ))}
    </div>
  );
}`,
        hint: 'export const revalidate = 600 at the top of the file enables ISR — Next.js pre-renders the page and regenerates it in the background after 10 minutes.',
      },
      {
        title: 'Build the individual post page with SSG',
        description: 'Create the post detail page with generateStaticParams for build-time rendering, generateMetadata for SEO, and not-found handling.',
        code: `// app/(marketing)/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getPost, getPosts } from '@/features/posts/queries';
import type { Metadata } from 'next';

// Pre-render all published posts at build time
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug); // cache() deduplicates this call
  if (!post) return { title: 'Not Found' };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug); // cache() deduplicates this call
  if (!post) notFound();

  return (
    <article className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      {post.publishedAt && (
        <time className="text-gray-400 text-sm block mb-8">
          {new Date(post.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
        </time>
      )}
      {/* In a real app: render Markdown/MDX here */}
      <div className="prose max-w-none">{post.content}</div>
    </article>
  );
}

// app/(marketing)/blog/[slug]/not-found.tsx
import Link from 'next/link';
export default function PostNotFound() {
  return (
    <div className="text-center py-16">
      <h2 className="text-xl font-semibold">Post not found</h2>
      <Link href="/blog" className="text-blue-600 mt-4 inline-block">
        ← Back to blog
      </Link>
    </div>
  );
}`,
        hint: 'cache() ensures getPost is called only once even though both generateMetadata and the page component call it.',
      },
      {
        title: 'Build the admin panel with Server Action',
        description: 'Create a simple admin form to create posts using a Server Action with Zod validation.',
        code: `// features/posts/schemas.ts
import { z } from 'zod';
export const PostSchema = z.object({
  title: z.string().min(1, 'Title required').max(200),
  excerpt: z.string().max(300),
  content: z.string().min(10, 'Content too short'),
  published: z.boolean().default(false),
});

// features/posts/actions.ts
"use server";
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { PostSchema } from './schemas';

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/, '');
}

export async function createPost(prevState: any, formData: FormData) {
  const result = PostSchema.safeParse({
    title: formData.get('title'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    published: formData.get('published') === 'on',
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  await db.post.create({
    data: {
      ...result.data,
      slug: slugify(result.data.title),
      publishedAt: result.data.published ? new Date() : null,
    },
  });

  revalidatePath('/blog');
  return { success: true };
}

// app/(admin)/admin/new/page.tsx
"use client";
import { useFormState, useFormStatus } from 'react-dom';
import { createPost } from '@/features/posts/actions';

function Submit() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? 'Saving...' : 'Create Post'}</button>;
}

export default function NewPostPage() {
  const [state, action] = useFormState(createPost, {});
  if (state.success) return <p>Post created!</p>;
  return (
    <form action={action} className="space-y-4 max-w-xl">
      <input name="title" placeholder="Title" className="w-full border rounded p-2" />
      {state.errors?.title && <p className="text-red-500 text-sm">{state.errors.title[0]}</p>}
      <textarea name="excerpt" placeholder="Excerpt" rows={2} className="w-full border rounded p-2" />
      <textarea name="content" placeholder="Content" rows={10} className="w-full border rounded p-2" />
      <label className="flex items-center gap-2">
        <input type="checkbox" name="published" /> Publish now
      </label>
      <Submit />
    </form>
  );
}`,
        hint: 'revalidatePath("/blog") purges the ISR cache for the blog listing so the new post appears immediately.',
      },
    ],
    interviewQuestions: [
      {
        question: 'Why did you use ISR instead of SSR for the blog listing?',
        answer: 'Blog posts do not change per-user and do not need to be real-time. ISR pre-renders the page once and serves it from CDN (fast). It regenerates in the background every 10 minutes. A new post appears within 10 minutes of publishing — acceptable for a blog. SSR would hit the database on every request (slower, more cost). SSG without ISR would never update after build. ISR is the best trade-off: CDN speed + eventual freshness.',
        difficulty: 'intermediate',
      },
    ],
    tags: ['blog', 'ssg', 'isr', 'server-actions', 'prisma', 'seo'],
  },

  // ─── PROJECT 2: SaaS Dashboard ────────────────────────────────────────────────
  {
    id: 'nextjs-saas-dashboard',
    slug: 'nextjs-saas-dashboard',
    title: 'SaaS Dashboard with Auth',
    description: 'Build a multi-page SaaS dashboard with JWT authentication, protected routes, Server Actions for CRUD, and dynamic charts — the kind of app you will build in real jobs.',
    difficulty: 'intermediate',
    estimatedTime: '10-15 hours',
    techStack: ['Next.js 14', 'Prisma', 'PostgreSQL', 'Tailwind CSS', 'Zod', 'jose', 'bcryptjs'],
    features: [
      'JWT authentication with httpOnly cookies',
      'Middleware protecting all /dashboard/* routes',
      'Register and login forms with Server Actions',
      'Protected dashboard with user-specific data',
      'Project CRUD (create, list, delete) via Server Actions',
      'Defense in depth: middleware + layout + action auth',
      'Proper error handling with error.tsx',
      'Loading skeletons with loading.tsx',
    ],
    folderStructure: `nextjs-saas/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── (app)/
│       ├── layout.tsx     ← Auth check (DB lookup)
│       └── dashboard/
│           ├── page.tsx   ← Dashboard overview
│           ├── loading.tsx
│           ├── error.tsx
│           └── projects/
│               ├── page.tsx      ← Projects list
│               └── new/page.tsx  ← Create project
├── features/
│   ├── auth/
│   │   ├── actions.ts    ← register, login, logout
│   │   └── queries.ts    ← getCurrentUser, getUserByEmail
│   └── projects/
│       ├── actions.ts    ← createProject, deleteProject
│       └── queries.ts    ← getProjects, getProject
├── lib/
│   ├── auth.ts           ← requireAuth, createToken, verifyToken
│   └── db.ts             ← Prisma singleton
└── middleware.ts         ← Protect /dashboard/*`,
    steps: [
      {
        title: 'Set up JWT auth library',
        description: 'Create the auth utility using jose (Edge-compatible JWT) with createToken, verifyToken, and requireAuth.',
        code: `// lib/auth.ts
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from './db';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'dev-secret-change-in-production-32ch'
);

export async function createToken(userId: string) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { userId: string };
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const token = cookies().get('session')?.value;
  if (!token) redirect('/login');

  const payload = await verifyToken(token);
  if (!payload) redirect('/login');

  const user = await db.user.findUnique({ where: { id: payload.userId } });
  if (!user) redirect('/login');

  return user;
}`,
        hint: 'jose is used instead of jsonwebtoken because middleware runs on Edge Runtime which has no Node.js crypto module.',
      },
      {
        title: 'Write middleware to protect the dashboard',
        description: 'Protect all /dashboard routes at the edge using a JWT check in middleware.',
        code: `// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'dev-secret-change-in-production-32ch'
);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL('/login', request.url));
    res.cookies.delete('session');
    return res;
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};`,
        hint: 'Middleware cannot use Prisma — only JWT verification (no DB). The layout does the full DB check.',
      },
      {
        title: 'Build register and login Server Actions',
        description: 'Implement authentication Server Actions that validate input, hash passwords, create sessions, and set cookies.',
        code: `// features/auth/actions.ts
"use server";
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { createToken } from '@/lib/auth';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function login(prevState: any, formData: FormData) {
  const result = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const user = await db.user.findUnique({ where: { email: result.data.email } });
  if (!user) return { errors: { email: ['Invalid email or password'] } };

  const valid = await bcrypt.compare(result.data.password, user.hashedPassword);
  if (!valid) return { errors: { email: ['Invalid email or password'] } };

  const token = await createToken(user.id);
  cookies().set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  redirect('/dashboard');
}

export async function logout() {
  cookies().delete('session');
  redirect('/login');
}`,
        hint: 'Never store the raw password — bcrypt.hash(password, 12) before saving. bcrypt.compare on login.',
      },
      {
        title: 'Build the projects CRUD with Server Actions',
        description: 'Implement createProject and deleteProject Server Actions, and the projects listing page.',
        code: `// features/projects/actions.ts
"use server";
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';

const ProjectSchema = z.object({
  name: z.string().min(1, 'Name required').max(50),
  description: z.string().max(200).optional(),
});

export async function createProject(prevState: any, formData: FormData) {
  const user = await requireAuth(); // Auth + AuthZ

  const result = ProjectSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!result.success) return { errors: result.error.flatten().fieldErrors };

  await db.project.create({ data: { ...result.data, userId: user.id } });
  revalidatePath('/dashboard/projects');
  return { success: true };
}

export async function deleteProject(formData: FormData) {
  const user = await requireAuth();
  const projectId = formData.get('projectId') as string;

  // Verify ownership before deletion
  const project = await db.project.findUnique({ where: { id: projectId } });
  if (!project || project.userId !== user.id) {
    throw new Error('Unauthorized');
  }

  await db.project.delete({ where: { id: projectId } });
  revalidatePath('/dashboard/projects');
}

// app/(app)/dashboard/projects/page.tsx
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { deleteProject } from '@/features/projects/actions';
import Link from 'next/link';

export default async function ProjectsPage() {
  const user = await requireAuth();
  const projects = await db.project.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link href="/dashboard/projects/new" className="px-4 py-2 bg-blue-600 text-white rounded">
          New Project
        </Link>
      </div>
      <div className="space-y-3">
        {projects.map(p => (
          <div key={p.id} className="flex items-center justify-between p-4 border rounded-xl">
            <div>
              <p className="font-semibold">{p.name}</p>
              {p.description && <p className="text-gray-500 text-sm">{p.description}</p>}
            </div>
            <form action={deleteProject}>
              <input type="hidden" name="projectId" value={p.id} />
              <button type="submit" className="text-red-500 text-sm hover:underline">
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}`,
        hint: 'Always verify ownership before delete — a user could send any projectId in the form data.',
      },
    ],
    interviewQuestions: [
      {
        question: 'Why use JWT over database sessions for this project?',
        answer: 'JWT is stateless — the server verifies the token without a database lookup on every request. This is important for middleware which runs on Edge Runtime and cannot use Prisma. The layout does a full DB check to verify the user still exists. Trade-off: JWTs cannot be instantly revoked (until they expire) — if you need instant revocation (account deletion, security incident), use database sessions.',
        difficulty: 'intermediate',
      },
    ],
    tags: ['saas', 'authentication', 'jwt', 'prisma', 'crud', 'middleware'],
  },
];
