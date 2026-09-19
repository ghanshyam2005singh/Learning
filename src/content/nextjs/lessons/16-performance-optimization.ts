import type { Lesson } from '@/types';

export const performanceOptimizationLesson: Lesson = {
  id: 'nextjs-performance-optimization',
  slug: 'nextjs-performance-optimization',
  title: 'Performance Optimization',
  description:
    'Master Next.js performance — Image optimization, font optimization, code splitting, lazy loading, streaming, caching strategies, bundle optimization, and Core Web Vitals.',
  category: 'Performance',
  order: 16,
  difficulty: 'advanced',
  estimatedTime: 60,
  prevLesson: 'nextjs-state-management',
  nextLesson: 'nextjs-seo',

  content: `# Performance Optimization

## Why Performance Matters

Performance is not a "nice to have" — it directly impacts business outcomes:

- **53% of mobile users** abandon sites that take more than 3 seconds to load
- **1 second delay** reduces conversions by 7% (Akamai)
- **100ms improvement** increased Amazon revenue by 1%
- **Google ranks** faster pages higher (Core Web Vitals are a ranking signal)

Next.js provides built-in performance primitives. This module teaches you to use them correctly.

---

## Core Web Vitals

Google measures these three metrics:

| Metric | What it measures | Good | Needs Work | Poor |
|---|---|---|---|---|
| LCP (Largest Contentful Paint) | When main content appears | < 2.5s | 2.5s-4s | > 4s |
| FID/INP (Interaction to Next Paint) | Time until page responds to input | < 200ms | 200ms-500ms | > 500ms |
| CLS (Cumulative Layout Shift) | Unexpected layout movement | < 0.1 | 0.1-0.25 | > 0.25 |

Next.js is designed to help you achieve good scores on all three.

---

## Image Optimization

The \`<Image>\` component from \`next/image\` is one of the most impactful optimizations:

\`\`\`tsx
import Image from 'next/image';

// ── Basic usage ──────────────────────────────────────────────
<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={630}
  priority         // Preload above-the-fold images
/>

// ── Lazy-loaded below-fold image ─────────────────────────────
<Image
  src={product.imageUrl}
  alt={product.name}
  width={400}
  height={400}
  // No priority — lazy loaded by default
/>

// ── Responsive image ─────────────────────────────────────────
<div className="relative h-64 w-full">
  <Image
    src="/banner.jpg"
    alt="Banner"
    fill                    // Fills the parent container
    sizes="100vw"           // Hint for responsive sizes
    className="object-cover"
    priority
  />
</div>

// ── Product image with multiple sizes ───────────────────────
<Image
  src={product.imageUrl}
  alt={product.name}
  width={800}
  height={800}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
  // ^ Tells browser which size to download at different viewport widths
/>
\`\`\`

What \`next/image\` does automatically:
- Converts to WebP (30% smaller than JPEG, 80% smaller than PNG)
- Resizes to the exact size needed for the viewport
- Lazy loads images below the fold
- Prevents layout shift by reserving space before image loads
- Serves from a CDN cache after first generation

**Remote images** require domain configuration:

\`\`\`tsx
// next.config.ts
export default {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
        pathname: '/uploads/**',
      },
    ],
  },
};
\`\`\`

---

## Font Optimization

\`next/font\` eliminates layout shift from fonts and eliminates external font requests:

\`\`\`tsx
// app/layout.tsx

import { Inter, Playfair_Display } from 'next/font/google';

// Fonts are downloaded at build time and self-hosted
// No external request at runtime → faster, no CORS, no GDPR concerns
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',           // Show text with fallback font while loading
  variable: '--font-inter',  // CSS variable for Tailwind
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '700'],   // Only load weights you use
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={\`\${inter.variable} \${playfair.variable}\`}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

// Local font (no Google Fonts dependency):
import localFont from 'next/font/local';

const myFont = localFont({
  src: [
    { path: './fonts/MyFont-Regular.woff2', weight: '400' },
    { path: './fonts/MyFont-Bold.woff2', weight: '700' },
  ],
  variable: '--font-myfont',
});
\`\`\`

---

## Code Splitting and Lazy Loading

Next.js automatically splits code by route. For large components, use \`next/dynamic\`:

\`\`\`tsx
import dynamic from 'next/dynamic';

// Load only when the component enters the viewport or is needed
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,  // Don't server-render — this component needs the DOM
});

const MapComponent = dynamic(() => import('@/components/Map'), {
  loading: () => <div className="h-64 bg-gray-100 rounded animate-pulse" />,
  ssr: false,  // Leaflet, Google Maps etc. are client-only
});

const RichTextEditor = dynamic(() => import('@/components/RichEditor'), {
  loading: () => <textarea />,  // Show a basic textarea while loading
  ssr: false,
});

// Good use cases for dynamic imports:
// - Maps (Leaflet, Mapbox)
// - Charts that need canvas (D3, Chart.js)
// - Rich text editors (TipTap, Quill)
// - Heavy analytics/monitoring libraries
// - Components only shown on user interaction (modal content)
\`\`\`

---

## Streaming and Suspense (Performance)

Streaming improves perceived performance by sending content progressively:

\`\`\`tsx
// app/page.tsx
import { Suspense } from 'react';

// ── Critical above-the-fold content (no Suspense) ────────────
// Renders immediately in the initial HTML
export default function HomePage() {
  return (
    <div>
      {/* No Suspense — this must render immediately */}
      <HeroSection />

      {/* These can load progressively */}
      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedProducts />   {/* ~300ms DB query */}
      </Suspense>

      <Suspense fallback={<RecommendSkeleton />}>
        <Recommendations />    {/* ~800ms ML query */}
      </Suspense>

      <Suspense fallback={<ReviewSkeleton />}>
        <RecentReviews />      {/* ~200ms DB query */}
      </Suspense>
    </div>
  );
}
// Hero loads instantly.
// Reviews at 200ms, FeaturedProducts at 300ms, Recommendations at 800ms.
// Total perceived load: immediate hero + progressive filling
\`\`\`

---

## Caching Strategy

Next.js has multiple caching layers:

\`\`\`tsx
// 1. Request Memoization (automatic, within a single request)
// Same fetch() call with same URL is deduplicated — runs once per request
const data = await fetch('https://api.example.com/user', { cache: 'no-store' });

// 2. Data Cache (persistent, across requests)
// Stored on the filesystem. Survives process restarts.
const products = await fetch('https://api.example.com/products', {
  next: { revalidate: 3600 },  // Persist for 1 hour
});

// 3. React cache() (within one render tree)
import { cache } from 'react';
const getUser = cache(async (id: string) => {
  return db.user.findUnique({ where: { id } });
});

// 4. Full Route Cache (HTML + RSC payload)
// Static routes are cached as HTML files
// Dynamic routes are not cached

// 5. Router Cache (client-side)
// Pages visited are cached in browser memory
// Navigating back is instant — no refetch
\`\`\`

\`\`\`tsx
// Combining caching strategies on one page:
export default async function ProductsPage() {
  // Cache forever — categories rarely change
  const categories = await fetch('https://api.example.com/categories', {
    cache: 'force-cache',
  }).then(r => r.json());

  // ISR — products update occasionally
  const featured = await fetch('https://api.example.com/featured', {
    next: { revalidate: 3600 },
  }).then(r => r.json());

  // No cache — live inventory count
  const inventory = await fetch('https://api.example.com/inventory', {
    cache: 'no-store',
  }).then(r => r.json());

  return <ProductsLayout categories={categories} featured={featured} inventory={inventory} />;
}
\`\`\`

---

## Bundle Optimization

\`\`\`tsx
// next.config.ts

import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Compiler optimizations (SWC-based)
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Experimental performance features
  experimental: {
    // Optimize package imports — tree-shake large icon libraries
    optimizePackageImports: ['lucide-react', '@heroicons/react', 'lodash'],
  },
};

export default withBundleAnalyzer(nextConfig);

// Run analysis:
// ANALYZE=true npm run build
\`\`\`

\`\`\`tsx
// Import only what you need from large libraries:

// ❌ Imports entire lodash (500KB+)
import _ from 'lodash';
const debounced = _.debounce(fn, 300);

// ✅ Import just what you need
import debounce from 'lodash/debounce';
const debounced = debounce(fn, 300);

// ✅ Or use native equivalents
// For most lodash functions, there are native alternatives in 2024
\`\`\`

---

## Key Performance Checklist

\`\`\`
Images:
  ✓ Use next/image for all images
  ✓ Add priority to above-the-fold images
  ✓ Provide correct width/height or use fill with sizes
  ✓ Use WebP format where possible

Fonts:
  ✓ Use next/font/google (eliminates external request + layout shift)
  ✓ Set display: 'swap'
  ✓ Load only the weights you use

Loading:
  ✓ Wrap slow Server Components in Suspense
  ✓ Use loading.tsx for route-level skeletons
  ✓ Lazy-load heavy client-only components

Caching:
  ✓ Use static/ISR for public content that doesn't change per user
  ✓ Tag fetches for on-demand revalidation
  ✓ Use cache() to deduplicate DB calls

Bundle:
  ✓ Analyze bundle size with @next/bundle-analyzer
  ✓ Dynamic import heavy client-only libraries
  ✓ Import specific functions from large libraries
  ✓ Remove console.log in production
\`\`\``,

  codeExamples: [
    {
      title: 'Optimized product page — all performance patterns applied',
      code: `// app/products/[id]/page.tsx
// Demonstrates: Image optimization, font, Suspense, caching

import Image from 'next/image';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { db } from '@/lib/db';
import { cache } from 'react';

// Dynamic import for heavy client component (review editor)
const ReviewForm = dynamic(() => import('./ReviewForm'), {
  loading: () => <div className="h-24 bg-gray-100 rounded animate-pulse" />,
  ssr: false,
});

// cache() prevents duplicate queries
const getProduct = cache(async (id: string) => {
  return db.product.findUnique({
    where: { id },
    include: {
      images: true,
      category: { select: { name: true } },
    },
  });
});

// Async component for reviews (wrapped in Suspense)
async function ProductReviews({ productId }: { productId: string }) {
  const reviews = await db.review.findMany({
    where: { productId },
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, avatarUrl: true } } },
  });

  return (
    <div>
      {reviews.map(r => (
        <div key={r.id} className="border-b py-4">
          <div className="flex items-center gap-2">
            <Image src={r.user.avatarUrl} alt={r.user.name} width={32} height={32} className="rounded-full" />
            <span className="font-medium">{r.user.name}</span>
          </div>
          <p className="mt-2 text-gray-600">{r.content}</p>
        </div>
      ))}
    </div>
  );
}

async function RelatedProducts({ categoryId }: { categoryId: string }) {
  const related = await db.product.findMany({
    where: { categoryId, id: { not: 'current-product-id' } },
    take: 4,
    select: { id: true, name: true, price: true, images: { take: 1 } },
  });

  return (
    <div className="grid grid-cols-4 gap-4">
      {related.map(p => (
        <a key={p.id} href={\`/products/\${p.id}\`} className="group">
          <Image
            src={p.images[0]?.url ?? '/placeholder.jpg'}
            alt={p.name}
            width={200}
            height={200}
            className="rounded group-hover:opacity-90 transition"
          />
          <p className="mt-2 text-sm">{p.name}</p>
          <p className="text-gray-500">\${p.price}</p>
        </a>
      ))}
    </div>
  );
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 gap-8">
        {/* Main image: priority (above the fold) */}
        <Image
          src={product.images[0]?.url ?? '/placeholder.jpg'}
          alt={product.name}
          width={600}
          height={600}
          priority          // ← Critical: above the fold image
          className="rounded-lg"
        />

        <div>
          <p className="text-sm text-gray-500">{product.category.name}</p>
          <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
          <p className="text-2xl font-semibold mt-2">\${product.price}</p>
          <p className="mt-4 text-gray-600">{product.description}</p>
        </div>
      </div>

      {/* Related products — streams independently */}
      <section className="mt-12">
        <h2 className="text-xl font-bold mb-4">Related Products</h2>
        <Suspense fallback={<div className="grid grid-cols-4 gap-4">{Array(4).fill(0).map((_, i) => <div key={i} className="h-48 bg-gray-100 rounded animate-pulse" />)}</div>}>
          <RelatedProducts categoryId={product.categoryId} />
        </Suspense>
      </section>

      {/* Reviews — streams independently (often slowest) */}
      <section className="mt-12">
        <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
        <Suspense fallback={<div className="space-y-4">{Array(3).fill(0).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />)}</div>}>
          <ProductReviews productId={product.id} />
        </Suspense>

        {/* Heavy editor loads only in browser */}
        <ReviewForm productId={product.id} />
      </section>
    </main>
  );
}`,
      explanation:
        'All performance patterns in one page: priority image for above-fold content, Suspense for independent streaming sections, cache() for deduplication, dynamic import for the heavy review editor, and proper image sizing hints.',
    },
  ],

  commonMistakes: [
    'Not adding priority to the hero/LCP image — this is the most common Core Web Vitals issue. The largest above-fold image must have priority.',
    'Using <img> instead of next/image — you lose WebP conversion, lazy loading, and layout shift prevention.',
    'Not specifying sizes prop for responsive images — without it, the browser downloads the largest image size.',
    'Importing large libraries (Lodash, Moment.js) entirely — import specific functions or use native alternatives.',
    'Not wrapping slow components in Suspense — without it, the entire page waits for the slowest component.',
    'Using next/font without setting display: "swap" — users see invisible text while the font loads.',
    'Not analyzing your bundle — you cannot optimize what you cannot see. Use @next/bundle-analyzer.',
  ],

  interviewQuestions: [
    {
      question: 'What does next/image do that a regular <img> tag does not?',
      answer:
        'next/image provides: (1) Automatic format conversion — images are converted to WebP (typically 30% smaller than JPEG) or AVIF without any configuration. (2) Responsive resizing — generates multiple image sizes and serves the appropriate one based on the user\'s viewport. (3) Lazy loading by default — images below the fold are not downloaded until they are near the viewport. (4) Layout shift prevention — requires width and height (or fill) which reserves space before the image loads, eliminating CLS (Cumulative Layout Shift). (5) Priority hint — the priority prop adds a preload link for above-fold images, improving LCP. (6) CDN caching — generated images are cached on Vercel or your configured image CDN.',
      difficulty: 'intermediate',
    },
    {
      question: 'What are Core Web Vitals and how does Next.js help you achieve good scores?',
      answer:
        "Core Web Vitals are Google's user experience metrics: LCP (Largest Contentful Paint — how fast main content appears), INP (Interaction to Next Paint — how fast the page responds to input), and CLS (Cumulative Layout Shift — unexpected movement). Next.js helps: LCP is improved by SSR/SSG (user sees content in the initial HTML, not after JS loads) and by next/image with priority for the main image. INP is improved by Server Components (less JS to parse and execute) and code splitting (only load what's needed). CLS is improved by next/image (reserves space) and next/font (eliminates font layout shift). These built-in optimizations mean a well-built Next.js app naturally achieves good Core Web Vitals scores.",
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'perf-ex-1',
      title: 'Optimize an image-heavy gallery page',
      description: `A photo gallery page has performance issues. Fix them:

1. Above-fold hero image loads slowly
2. All gallery images load at once (no lazy loading)
3. Images are not WebP optimized
4. The image grid causes layout shift
5. A heavy image editing library loads on page load

Convert the page to use next/image with correct priority, lazy loading, sizes, and use dynamic import for the editor.`,
      starterCode: `// BROKEN — Multiple performance issues

export default function GalleryPage() {
  return (
    <div>
      {/* Issue 1: Regular img tag, no optimization */}
      <img src="/hero-photo.jpg" alt="Gallery" style={{ width: '100%', height: '400px' }} />

      {/* Issue 2: All images load immediately */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        {photos.map(photo => (
          <img
            key={photo.id}
            src={photo.url}
            alt={photo.title}
            style={{ width: '400px', height: '300px' }}
          />
        ))}
      </div>

      {/* Issue 3: Heavy library always loaded */}
      <PhotoEditor photos={photos} />
    </div>
  );
}`,
      solution: `import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamic import — PhotoEditor only loads when needed
const PhotoEditor = dynamic(() => import('@/components/PhotoEditor'), {
  loading: () => <div className="h-64 bg-gray-100 rounded animate-pulse" />,
  ssr: false,
});

const photos = [/* ... */];

export default function GalleryPage() {
  return (
    <div>
      {/* Fix 1: next/image with priority for hero (above fold) */}
      <div className="relative h-96 w-full">
        <Image
          src="/hero-photo.jpg"
          alt="Gallery hero"
          fill
          className="object-cover"
          priority         // ← LCP image gets priority preload
          sizes="100vw"    // Full width on all screens
        />
      </div>

      {/* Fix 2 & 3: next/image with lazy loading + WebP + correct dimensions */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        {photos.map(photo => (
          <Image
            key={photo.id}
            src={photo.url}
            alt={photo.title}
            width={400}
            height={300}
            // No priority — lazy loads by default (below fold)
            sizes="(max-width: 768px) 100vw, 33vw"
            // Reserves 400x300 space → no layout shift
          />
        ))}
      </div>

      {/* Fix 4: Dynamic import — loads only in browser when reached */}
      <PhotoEditor photos={photos} />
    </div>
  );
}`,
      hints: [
        'Hero image = above fold = needs priority prop',
        'Gallery images = below fold = lazy loaded by default with next/image',
        'fill + sizes for full-width images, explicit width/height for constrained images',
        'dynamic() with ssr: false for browser-only heavy components',
      ],
    },
  ],

  keyTakeaways: [
    'Add priority to the LCP (Largest Contentful Paint) image — the hero or main above-fold image.',
    'Use next/image for all images — automatic WebP, lazy loading, layout shift prevention.',
    'Use next/font — eliminates external font requests, prevents font layout shift, self-hosts fonts.',
    'Wrap slow Server Components in Suspense — enables streaming so fast sections render before slow ones.',
    'Use dynamic() for heavy client-only libraries — maps, charts, editors load only when needed.',
    'Import specific functions from large libraries — avoid bundle bloat from unused code.',
    'Analyze your bundle with @next/bundle-analyzer before shipping to production.',
    'Core Web Vitals (LCP, INP, CLS) affect both user experience and Google search ranking.',
  ],
};
