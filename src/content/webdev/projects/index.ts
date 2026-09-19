import type { Project } from '@/types';

export const webdevProjects: Project[] = [
  {
    id: 'full-stack-blog',
    slug: 'full-stack-blog',
    title: 'Full Stack Blog Platform',
    description:
      'Build a complete blog platform with rich text editing, tags, comments, and author management. Deploy to production with CI/CD.',
    difficulty: 'intermediate',
    estimatedTime: '3-4 weeks',
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Tiptap', 'Vercel', 'Neon'],
    features: [
      'Email/password authentication with NextAuth.js',
      'Rich text post editor (Tiptap)',
      'Tag system with filtering',
      'Nested comments (reply to comments)',
      'Cover image upload (Cloudflare R2)',
      'Public feed with pagination',
      'Author profile pages',
      'Draft/publish workflow',
      'SEO meta tags and Open Graph',
      'Admin: manage posts and approve comments',
    ],
    folderStructure: `src/
  app/
    (auth)/login/page.tsx
    (auth)/signup/page.tsx
    (blog)/page.tsx          ← public feed
    (blog)/[slug]/page.tsx   ← individual post
    (blog)/tags/[tag]/page.tsx
    admin/
      page.tsx               ← admin dashboard
      posts/page.tsx
    api/
      auth/[...nextauth]/route.ts
      posts/route.ts
      posts/[id]/route.ts
      comments/route.ts
      upload/route.ts
  features/
    auth/
    posts/
    comments/
    tags/
  components/
    ui/
    layout/
    editor/                  ← Tiptap rich text editor
  lib/
    db.ts                    ← Prisma client
    auth.ts                  ← NextAuth config`,
    steps: [
      {
        title: 'Setup and Database Schema',
        description: 'Initialize Next.js, Prisma, and design the database schema for users, posts, tags, and comments.',
        code: `// prisma/schema.prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String
  name          String
  bio           String?
  avatarUrl     String?
  role          String    @default("user")
  posts         Post[]
  comments      Comment[]
  createdAt     DateTime  @default(now())
}

model Post {
  id          String    @id @default(uuid())
  author      User      @relation(fields: [authorId], references: [id])
  authorId    String
  title       String
  slug        String    @unique
  content     String
  excerpt     String?
  coverImage  String?
  published   Boolean   @default(false)
  publishedAt DateTime?
  tags        PostTag[]
  comments    Comment[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Tag {
  id    String    @id @default(uuid())
  name  String    @unique
  slug  String    @unique
  posts PostTag[]
}

model PostTag {
  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId String
  tag    Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)
  tagId  String

  @@id([postId, tagId])
}

model Comment {
  id        String    @id @default(uuid())
  post      Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId    String
  author    User      @relation(fields: [authorId], references: [id])
  authorId  String
  parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  parentId  String?
  replies   Comment[] @relation("CommentReplies")
  content   String
  createdAt DateTime  @default(now())
}`,
        hint: 'Slug must be unique — generate from title, handle conflicts by appending a number.',
      },
      {
        title: 'Authentication',
        description: 'Set up NextAuth.js with email/password and configure session handling.',
        hint: 'Use bcrypt for password hashing in the credentials provider. Configure Prisma adapter for session storage.',
      },
      {
        title: 'Post Editor',
        description: 'Integrate Tiptap rich text editor with image upload capability.',
        hint: 'Tiptap stores content as JSON (portable, queryable) or HTML. Consider using tiptap-markdown extension for cleaner storage.',
      },
      {
        title: 'Public Blog Pages',
        description: 'Build the public feed with SSG/ISR, individual post pages with SSR, and tag filtering.',
        hint: 'Use Next.js generateStaticParams for popular posts. For recent posts, use revalidate: 60 (ISR).',
      },
      {
        title: 'Comments',
        description: 'Implement nested comments with loading states and optimistic updates.',
        hint: 'Build a recursive CommentThread component. Load top-level comments first, lazy-load replies on expand.',
      },
      {
        title: 'Deploy and Monitor',
        description: 'Deploy to Vercel + Neon, set up GitHub Actions CI, configure Sentry for errors.',
        hint: 'Configure Sentry in both client (next/headers) and server (route handlers). Set up UptimeRobot on /health.',
      },
    ],
    interviewQuestions: [
      {
        question: 'How did you handle image uploads for post cover images?',
        answer:
          'I used Cloudflare R2 (S3-compatible) for storage. The upload flow: client sends file to /api/upload route handler, server validates file type using file-type library (not the extension), resizes and converts to WebP using sharp, uploads to R2, returns the CDN URL. The CDN URL is stored in the database. Files have UUID-based names to prevent enumeration.',
        difficulty: 'intermediate',
      },
      {
        question: 'How does the nested comment system work?',
        answer:
          'Comments have a parent_id self-referential foreign key. Top-level comments have parent_id = null. I load comments with a recursive CTE or two queries: first fetch top-level comments, then fetch all replies and group by parent_id in JavaScript. The CommentThread component renders recursively. I limited nesting depth to 3 levels to prevent infinitely deep threads.',
        difficulty: 'intermediate',
      },
    ],
    tags: ['next.js', 'postgresql', 'authentication', 'rich-text', 'file-upload', 'ssr', 'ssg'],
  },
  {
    id: 'saas-dashboard',
    slug: 'saas-dashboard',
    title: 'Multi-Tenant SaaS Dashboard',
    description:
      'Build a multi-tenant SaaS application with organizations, team member management, subscription billing via Stripe, and usage analytics.',
    difficulty: 'advanced',
    estimatedTime: '5-6 weeks',
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Clerk', 'Stripe', 'Recharts', 'Tailwind', 'shadcn/ui'],
    features: [
      'Multi-tenant: organizations with multiple members',
      'Role-based access (owner, admin, member, viewer)',
      'Invite team members via email',
      'Stripe subscription integration (monthly/annual plans)',
      'Billing portal (Stripe Customer Portal)',
      'Usage tracking (items created, API calls, storage)',
      'Usage analytics charts (Recharts)',
      'Audit log (who did what, when)',
      'API key management',
      'Webhook event log',
    ],
    folderStructure: `src/
  app/
    (auth)/
    (dashboard)/
      layout.tsx           ← org switcher, nav
      [orgSlug]/
        page.tsx           ← dashboard home
        settings/
          page.tsx
          billing/page.tsx
          team/page.tsx
        projects/
    api/
      webhooks/stripe/route.ts   ← Stripe webhook handler
      orgs/route.ts
      members/route.ts
  features/
    organizations/
    billing/
    team/
    analytics/
  lib/
    stripe.ts
    clerk.ts`,
    steps: [
      {
        title: 'Organization and Multi-Tenancy Setup',
        description: 'Design the multi-tenant database schema and implement organization-scoped queries.',
        code: `// Every query must scope to the current organization
// This is the core of multi-tenancy

// Middleware: extract current org from URL or header
async function getCurrentOrg(orgSlug: string, userId: string) {
  const membership = await prisma.membership.findFirst({
    where: {
      org: { slug: orgSlug },
      userId,
    },
    include: { org: true },
  });

  if (!membership) throw new ForbiddenError('Not a member of this organization');
  return { org: membership.org, role: membership.role };
}

// Example scoped query — every query includes orgId
async function getProjects(orgId: string) {
  return prisma.project.findMany({
    where: { orgId },  // always scope to org
    orderBy: { createdAt: 'desc' },
  });
}`,
        hint: 'Row-level security: every database query must include WHERE org_id = $orgId. Consider using a middleware that validates org membership and attaches it to the request context.',
      },
      {
        title: 'Stripe Subscription Integration',
        description: 'Implement subscription creation, plan changes, and webhook processing for billing events.',
        hint: 'Stripe webhooks can be delivered multiple times. Use stripe_event_id to make webhook processing idempotent (store processed event IDs, skip duplicates).',
      },
      {
        title: 'Team Management',
        description: 'Build invite flow, role management, and member removal.',
        hint: 'Email invites: create a pending_invites table with a token. Accepting the invite creates the membership and deletes the invite. Expiry check on invite acceptance.',
      },
    ],
    interviewQuestions: [
      {
        question: 'How did you implement multi-tenancy?',
        answer:
          'Every table that contains tenant-specific data has an org_id column. Every query includes WHERE org_id = $orgId. I created a middleware that validates the user is a member of the requested organization and attaches the org to the request context. This ensures no query can accidentally return data from another tenant.',
        difficulty: 'advanced',
      },
    ],
    tags: ['saas', 'multi-tenant', 'stripe', 'billing', 'rbac', 'next.js', 'advanced'],
  },
];
