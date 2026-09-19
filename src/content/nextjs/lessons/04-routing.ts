import type { Lesson } from '@/types';

export const routingLesson: Lesson = {
  id: 'nextjs-routing',
  slug: 'nextjs-routing',
  title: 'Routing in Next.js',
  description:
    'Master dynamic routes, catch-all routes, parallel routes, intercepting routes, search params, navigation, redirects, and real-world routing patterns.',
  category: 'Routing',
  order: 4,
  difficulty: 'intermediate',
  estimatedTime: 50,
  prevLesson: 'nextjs-project-structure',
  nextLesson: 'nextjs-server-components',

  content: `# Routing in Next.js

## File-Based Routing Recap

Every folder in \`/app\` is a route segment. \`page.tsx\` makes it accessible. This is the foundation.

Now we go deeper into the powerful routing features that make Next.js exceptional for complex applications.

---

## Dynamic Routes

A segment wrapped in \`[brackets]\` captures any URL value at that position:

\`\`\`
app/products/[id]/page.tsx
↓ matches:
/products/1
/products/abc-123
/products/iphone-15-pro
\`\`\`

The captured value is available via the \`params\` prop:

\`\`\`tsx
// app/products/[id]/page.tsx

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await db.product.findUnique({
    where: { id: params.id },
  });

  if (!product) notFound(); // Triggers not-found.tsx

  return (
    <article>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <span>{product.price}</span>
    </article>
  );
}

// Also generate metadata dynamically:
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  const product = await db.product.findUnique({
    where: { id: params.id },
  });

  return {
    title: product?.name ?? 'Product Not Found',
    description: product?.description,
    openGraph: {
      images: [product?.imageUrl ?? ''],
    },
  };
}
\`\`\`

---

## Catch-All Routes

\`[...slug]\` catches ALL remaining segments as an array:

\`\`\`
app/docs/[...slug]/page.tsx
↓ matches:
/docs/getting-started           → params.slug = ['getting-started']
/docs/api/auth/login            → params.slug = ['api', 'auth', 'login']
/docs/v2/components/button      → params.slug = ['v2', 'components', 'button']
\`\`\`

\`\`\`tsx
// app/docs/[...slug]/page.tsx

export default async function DocsPage({
  params,
}: {
  params: { slug: string[] };
}) {
  // Convert array to file path: ['api', 'auth'] → 'api/auth'
  const filePath = params.slug.join('/');

  const doc = await getDocContent(filePath);

  if (!doc) notFound();

  return (
    <article>
      <h1>{doc.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: doc.content }} />
    </article>
  );
}
\`\`\`

**Optional catch-all: \`[[...slug]]\`** — also matches the route with NO segments at all:

\`\`\`
app/docs/[[...slug]]/page.tsx
↓ matches:
/docs                           → params.slug = undefined
/docs/getting-started           → params.slug = ['getting-started']
/docs/api/auth/login            → params.slug = ['api', 'auth', 'login']
\`\`\`

---

## Multiple Dynamic Segments

You can have multiple dynamic segments:

\`\`\`
app/[username]/[postId]/page.tsx
↓ matches: /john/my-first-post

app/shop/[category]/[product]/page.tsx
↓ matches: /shop/electronics/iphone-15

app/[org]/[repo]/issues/[id]/page.tsx (like GitHub)
↓ matches: /vercel/next.js/issues/123
\`\`\`

---

## Search Parameters (Query Strings)

Search params (\`?key=value\`) are available via the \`searchParams\` prop on page components:

\`\`\`tsx
// app/products/page.tsx
// URL: /products?category=electronics&sort=price&page=2

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    category?: string;
    sort?: string;
    page?: string;
  };
}) {
  const category = searchParams.category ?? 'all';
  const sort = searchParams.sort ?? 'newest';
  const page = Number(searchParams.page ?? '1');

  const products = await db.product.findMany({
    where: category !== 'all' ? { category } : {},
    orderBy: sort === 'price' ? { price: 'asc' } : { createdAt: 'desc' },
    skip: (page - 1) * 20,
    take: 20,
  });

  return (
    <div>
      <FilterBar currentCategory={category} currentSort={sort} />
      <ProductGrid products={products} />
      <Pagination currentPage={page} />
    </div>
  );
}
\`\`\`

**Important:** \`searchParams\` is a dynamic value — it makes the page dynamic (not cached). If your page uses \`searchParams\`, it opts into dynamic rendering.

---

## Navigation

### Link Component (Client-Side Navigation)

\`\`\`tsx
import Link from 'next/link';

// Basic
<Link href="/about">About</Link>

// With dynamic segment
<Link href={\`/products/\${product.id}\`}>View Product</Link>

// With search params
<Link href="/products?category=electronics&sort=price">
  Electronics by Price
</Link>

// Object syntax (more explicit)
<Link href={{ pathname: '/products', query: { category: 'electronics' } }}>
  Electronics
</Link>

// Prefetching: by default, Link prefetches the page in viewport
// Disable for large lists with many links:
<Link href="/products/123" prefetch={false}>Product</Link>

// Active link styling:
"use client";
import { usePathname } from 'next/navigation';

function NavLink({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={isActive ? 'font-bold text-blue-600' : 'text-gray-600'}
    >
      {children}
    </Link>
  );
}
\`\`\`

### Programmatic Navigation

\`\`\`tsx
"use client";
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await login(formData);

    if (result.success) {
      router.push('/dashboard');      // Navigate to new page
      // router.replace('/dashboard'); // Replace history (no back button)
      // router.back();               // Go back
      // router.forward();            // Go forward
      // router.refresh();            // Refresh current page server data
    }
  }

  return <form onSubmit={handleSubmit}>...</form>;
}
\`\`\`

### Server-Side Redirects

\`\`\`tsx
// In Server Components, layouts, or server actions:
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login'); // 307 temporary redirect (default)
    // redirects can also be permanent:
    // redirect('/new-url', RedirectType.replace);
  }

  return <Dashboard user={user} />;
}

// In next.config.ts — permanent redirects at the infrastructure level:
// const nextConfig = {
//   async redirects() {
//     return [
//       {
//         source: '/old-page',
//         destination: '/new-page',
//         permanent: true, // 308 permanent redirect
//       },
//     ];
//   },
// };
\`\`\`

---

## Parallel Routes

Parallel routes let you render multiple pages simultaneously in the same layout. Each \`@slot\` is an independent page with its own loading and error states.

\`\`\`
app/dashboard/
├── layout.tsx
├── page.tsx
├── @analytics/
│   └── page.tsx       ← Rendered alongside main dashboard
└── @team/
    └── page.tsx       ← Also rendered alongside
\`\`\`

\`\`\`tsx
// app/dashboard/layout.tsx
// The layout receives all slots as props

export default function DashboardLayout({
  children,        // app/dashboard/page.tsx
  analytics,       // app/dashboard/@analytics/page.tsx
  team,            // app/dashboard/@team/page.tsx
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <div>
      <div className="main-content">{children}</div>
      <aside>
        <div>{analytics}</div>
        <div>{team}</div>
      </aside>
    </div>
  );
}

// Each slot:
// - Has its own loading.tsx
// - Has its own error.tsx
// - Loads independently (parallel data fetching)
// - Can be conditionally shown

// Real-world: Twitch uses this pattern —
// the stream, chat, and info panel load independently
\`\`\`

---

## Intercepting Routes

Intercepting routes let you show a route in a different context without the user leaving the current page. The classic use case: clicking a photo in a gallery opens it in a modal, but directly visiting /photos/123 opens the full page.

\`\`\`
app/photos/
├── page.tsx              → /photos (gallery)
├── [id]/
│   └── page.tsx          → /photos/123 (full page view)
└── (.)photos/            ← Intercepts /photos from current level
    └── [id]/
        └── page.tsx      → /photos/123 shown as MODAL over gallery
\`\`\`

\`\`\`
Conventions:
(.)   intercept same level
(..)  intercept one level up
(..)(..)  intercept two levels up
(...)     intercept from root
\`\`\`

\`\`\`tsx
// app/photos/page.tsx — Gallery
import Link from 'next/link';

export default function PhotoGallery({ photos }) {
  return (
    <div className="grid">
      {photos.map(photo => (
        // When clicked: (.)photos/[id]/page.tsx intercepts and shows modal
        // When visited directly: /photos/[id]/page.tsx shows full page
        <Link key={photo.id} href={\`/photos/\${photo.id}\`}>
          <img src={photo.thumbnail} alt={photo.title} />
        </Link>
      ))}
    </div>
  );
}

// app/photos/(.)photos/[id]/page.tsx — Modal version
import { Modal } from '@/components/Modal';

export default function PhotoModal({ params }) {
  return (
    <Modal>
      <PhotoDetail id={params.id} />
    </Modal>
  );
}
// Result: clicking a photo shows a modal with the photo
// But pressing refresh or visiting URL directly shows the full photo page
// This is how Instagram, Pinterest, and Twitter work
\`\`\`

---

## generateStaticParams — Static Generation for Dynamic Routes

For dynamic routes that should be statically generated at build time:

\`\`\`tsx
// app/blog/[slug]/page.tsx

// This function runs at BUILD TIME
// Returns all slugs that should be pre-rendered
export async function generateStaticParams() {
  const posts = await db.post.findMany({
    select: { slug: true },
  });

  // Returns array of param objects
  return posts.map(post => ({ slug: post.slug }));
}

export default async function BlogPost({ params }) {
  const post = await db.post.findUnique({
    where: { slug: params.slug },
  });

  return <article>{post.content}</article>;
}

// Result:
// /blog/intro-to-nextjs → pre-rendered to HTML at build time
// /blog/server-components → pre-rendered to HTML at build time
// All served from CDN. No server needed per request.
\`\`\`

---

## Route Patterns Summary

| Pattern | Example | Use case |
|---|---|---|
| Static | /about | Fixed pages |
| Dynamic | /products/[id] | Individual items |
| Nested dynamic | /[org]/[repo] | GitHub-style URLs |
| Catch-all | /docs/[...slug] | Documentation trees |
| Optional catch-all | /[[...slug]] | Optional path prefix |
| Route group | /(marketing)/ | Layout organization |
| Parallel route | /@analytics | Independent sections |
| Intercepting | /(.)photos | Modal over page |`,

  codeExamples: [
    {
      title: 'Building a full-featured product page with dynamic routing',
      code: `// app/[category]/[slug]/page.tsx
// URL pattern: /electronics/iphone-15-pro, /clothing/blue-shirt

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// ── Type for params ─────────────────────────────────────────
type Params = { category: string; slug: string };
type Props = { params: Params; searchParams: { color?: string } };

// ── Static generation (optional, for performance) ──────────
export async function generateStaticParams() {
  const products = await db.product.findMany({
    select: { category: true, slug: true },
  });

  return products.map(p => ({
    category: p.category,
    slug: p.slug,
  }));
}

// ── Dynamic SEO metadata ────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.category, params.slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: \`\${product.name} - Shop\`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.imageUrl, width: 1200, height: 630 }],
    },
  };
}

// ── Page component ──────────────────────────────────────────
export default async function ProductPage({ params, searchParams }: Props) {
  const product = await getProduct(params.category, params.slug);

  if (!product) notFound();

  const selectedColor = searchParams.color ?? product.colors[0];

  return (
    <div>
      <nav aria-label="Breadcrumb">
        <Link href="/">Home</Link> /
        <Link href={\`/\${params.category}\`}>{params.category}</Link> /
        <span>{product.name}</span>
      </nav>

      <h1>{product.name}</h1>
      <p>{product.price}</p>

      {/* Color selector changes URL: ?color=red */}
      <ColorSelector colors={product.colors} selected={selectedColor} />

      {/* Interactive - needs client component */}
      <AddToCartButton productId={product.id} color={selectedColor} />
    </div>
  );
}`,
      explanation:
        'A real product page uses multiple features together: dynamic route segments for category and slug, generateStaticParams for pre-rendering at build time, generateMetadata for dynamic SEO, searchParams for color selection, and notFound() for missing products.',
    },
    {
      title: 'Instagram-style parallel + intercepting routes',
      code: `// This implements Instagram's photo behavior:
// - Photo grid shows inline previews
// - Clicking opens modal WITHOUT changing underlying page
// - Direct URL visit or refresh shows the full photo page

// File structure:
// app/
// ├── @modal/
// │   ├── (.)photos/[id]/
// │   │   └── page.tsx    ← Modal version
// │   └── default.tsx     ← Null (no modal by default)
// ├── photos/
// │   ├── page.tsx        ← Photo grid
// │   └── [id]/
// │       └── page.tsx    ← Full photo page
// └── layout.tsx

// app/layout.tsx — receives modal slot
export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode; // the @modal slot
}) {
  return (
    <html>
      <body>
        {children}
        {modal}  {/* modal renders here when intercepted */}
      </body>
    </html>
  );
}

// app/@modal/default.tsx — default (no modal)
export default function ModalDefault() {
  return null;
}

// app/@modal/(.)photos/[id]/page.tsx — modal version
"use client";
import { useRouter } from 'next/navigation';

export default function PhotoModal({ params }: { params: { id: string } }) {
  const router = useRouter();

  return (
    // Full-screen overlay modal
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
      onClick={() => router.back()} // Close modal = go back
    >
      <div
        className="bg-white rounded-xl max-w-4xl w-full p-4"
        onClick={e => e.stopPropagation()}
      >
        <PhotoDetail id={params.id} />
        <button onClick={() => router.back()}>Close</button>
      </div>
    </div>
  );
}

// app/photos/[id]/page.tsx — full page version (used on direct visit)
export default async function PhotoPage({ params }) {
  const photo = await getPhoto(params.id);
  return (
    <div>
      <PhotoDetail photo={photo} />
      <Link href="/photos">← Back to gallery</Link>
    </div>
  );
}

// Result:
// /photos + click photo → shows modal (URL changes to /photos/123)
// Refresh /photos/123 → shows full page (modal not shown)
// Back button → closes modal, returns to /photos`,
      explanation:
        'Intercepting routes + parallel routes together enable the "modal that updates URL" pattern used by Instagram, Pinterest, and Twitter. The same URL shows different UI depending on whether you navigated there or visited directly.',
    },
  ],

  commonMistakes: [
    'Using useRouter from next/navigation in Server Components — useRouter is a client hook. Use redirect() for server-side navigation.',
    'Forgetting to call notFound() for missing dynamic pages — without it, the page will show empty content instead of a 404.',
    'Accessing params or searchParams without awaiting in Next.js 15 — params and searchParams are now Promises in Next.js 15 and must be awaited.',
    'Creating route files inside route groups without matching URL structure — route groups organize layout, but URL segments still need matching folder structure.',
    'Using searchParams in a Server Component without understanding it opts into dynamic rendering — any use of searchParams makes the page non-cacheable.',
    'Forgetting default.tsx in parallel route slots — when navigating between pages that do not have a matching slot, Next.js shows 404 without a default.tsx fallback.',
  ],

  interviewQuestions: [
    {
      question: 'What is the difference between dynamic routes [id] and catch-all routes [...slug]?',
      answer:
        'A dynamic route [id] captures exactly ONE URL segment. /products/[id] matches /products/123 but NOT /products/electronics/123 (two segments). A catch-all route [...slug] captures ONE OR MORE segments as an array. /docs/[...slug] matches /docs/intro, /docs/api/auth, and /docs/v2/components/button. The optional catch-all [[...slug]] also matches the route with no extra segments at all. Use dynamic routes for single-segment identifiers (product IDs, user slugs). Use catch-all routes for file-system-like paths (documentation, CMS content with arbitrary depth).',
      difficulty: 'intermediate',
    },
    {
      question: 'How do parallel routes differ from regular nested routes?',
      answer:
        'Regular nested routes are sequential — a parent layout wraps a child page in a linear hierarchy. Parallel routes (@slot folders) render multiple independent pages simultaneously in the same layout. Each slot loads independently, has its own loading.tsx and error.tsx, and can be updated independently without affecting other slots. This is useful when different sections of a page have unrelated data requirements — a dashboard with an analytics panel, a notifications panel, and main content can each fetch their own data independently without one blocking the others. Instagram uses this to show the main feed and a modal simultaneously.',
      difficulty: 'advanced',
    },
    {
      question: 'What are intercepting routes and what problem do they solve?',
      answer:
        'Intercepting routes allow a route to be rendered in a different context when navigated to via client-side navigation. The classic problem: on Instagram, clicking a photo should show a modal (to preserve the feed in the background) but visiting /posts/123 directly should show the full post page. Without intercepting routes, you would need complex state management to track "is this photo being viewed in a modal or as its own page?" With intercepting routes, the (.)photos/[id] path intercepts /photos/[id] when navigating from the same level and shows a modal, while direct URL visits or refreshes use the regular /photos/[id] page. Same URL, different rendering context.',
      difficulty: 'advanced',
    },
  ],

  exercises: [
    {
      id: 'routing-ex-1',
      title: 'Implement a blog with dynamic routes and metadata',
      description: `Build a blog route that:
1. Lists all posts at /blog
2. Shows individual posts at /blog/[slug]
3. Returns 404 for non-existent slugs
4. Generates dynamic metadata (title, description, og:image) per post
5. Pre-generates static pages for all posts at build time

Use the mock data provided.`,
      starterCode: `// Mock data (pretend this is your database)
const POSTS = [
  {
    slug: 'intro-to-nextjs',
    title: 'Introduction to Next.js',
    description: 'Learn why Next.js exists and what problems it solves.',
    content: 'Next.js is a React framework...',
    imageUrl: '/og-nextjs.jpg',
    publishedAt: '2024-01-15',
  },
  {
    slug: 'server-components-explained',
    title: 'Server Components Explained',
    description: 'Deep dive into React Server Components.',
    content: 'Server Components run exclusively on the server...',
    imageUrl: '/og-rsc.jpg',
    publishedAt: '2024-02-20',
  },
];

async function getPost(slug: string) {
  return POSTS.find(p => p.slug === slug) ?? null;
}

async function getAllPosts() {
  return POSTS;
}

// TODO: Implement these files:
// 1. app/blog/page.tsx — list of posts
// 2. app/blog/[slug]/page.tsx — individual post with:
//    - generateStaticParams
//    - generateMetadata
//    - notFound() for missing posts
//    - Post content display`,
      solution: `// app/blog/page.tsx
import Link from 'next/link';

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <ul className="space-y-6">
        {posts.map(post => (
          <li key={post.slug}>
            <Link href={\`/blog/\${post.slug}\`} className="group">
              <h2 className="text-xl font-semibold group-hover:underline">
                {post.title}
              </h2>
              <p className="text-gray-500 mt-1">{post.description}</p>
              <time className="text-sm text-gray-400">{post.publishedAt}</time>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

// ──────────────────────────────────────────────────────────────

// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type Props = { params: { slug: string } };

// Pre-render all posts at build time
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

// Dynamic metadata per post
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [{ url: post.imageUrl, width: 1200, height: 630 }],
    },
  };
}

// Post page
export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);

  if (!post) notFound(); // Triggers app/not-found.tsx

  return (
    <article className="max-w-2xl mx-auto py-12 px-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <p className="text-gray-500 mt-2">{post.description}</p>
        <time className="text-sm text-gray-400 block mt-1">
          {post.publishedAt}
        </time>
      </header>
      <div className="prose">{post.content}</div>
    </article>
  );
}`,
      hints: [
        'generateStaticParams returns an array of { slug: string } objects',
        'generateMetadata receives the same params as the page component',
        'notFound() must be called before returning JSX — it throws internally',
        'Check post is null/undefined before calling notFound()',
      ],
    },
  ],

  keyTakeaways: [
    'Dynamic routes use [brackets] to capture URL segments as params. Nested dynamic segments like [org]/[repo] work naturally.',
    'Catch-all routes [...slug] capture one or more segments as an array. Optional catch-all [[...slug]] also matches empty.',
    'searchParams are available as props on page.tsx and make the page dynamically rendered (not cached).',
    'Use Link component for client navigation (prefetches, instant transitions). Use redirect() for server redirects. Use useRouter for programmatic client navigation.',
    'Parallel routes (@slot folders) render multiple independent pages simultaneously — each loads independently with its own loading/error states.',
    'Intercepting routes enable "modal that updates URL" — same URL shows modal during navigation but full page on direct visit.',
    'generateStaticParams pre-renders dynamic routes at build time — converting runtime DB queries to static HTML files served from CDN.',
    'Always call notFound() for missing dynamic content — do not return empty or broken UI.',
  ],
};
