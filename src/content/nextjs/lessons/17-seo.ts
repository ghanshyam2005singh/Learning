import type { Lesson } from '@/types';

export const seoLesson: Lesson = {
  id: 'nextjs-seo',
  slug: 'nextjs-seo',
  title: 'SEO and Metadata',
  description:
    'Master SEO in Next.js — Metadata API, dynamic metadata, Open Graph, Twitter cards, JSON-LD structured data, sitemap, robots.txt, and canonical URLs.',
  category: 'SEO',
  order: 17,
  difficulty: 'intermediate',
  estimatedTime: 40,
  prevLesson: 'nextjs-performance-optimization',
  nextLesson: 'nextjs-error-handling',

  content: `# SEO and Metadata in Next.js

## Why Next.js is Superior for SEO

React SPAs are bad for SEO because the HTML sent to Google is:
\`\`\`html
<div id="root"></div>  <!-- Google sees almost nothing -->
\`\`\`

Next.js sends actual content:
\`\`\`html
<title>Buy iPhone 15 | Apple Store</title>
<meta name="description" content="Get the iPhone 15 with..." />
<h1>iPhone 15</h1>
<p>The latest iPhone with...</p>
<!-- All actual product content -->
\`\`\`

Google can index this immediately without executing JavaScript.

---

## Static Metadata (export const metadata)

For pages where metadata is fixed:

\`\`\`tsx
// app/layout.tsx — Default metadata for entire site
import type { Metadata } from 'next';

export const metadata: Metadata = {
  // Basic
  title: {
    template: '%s | Acme Corp',  // %s is replaced by child page title
    default: 'Acme Corp — Best Products',
  },
  description: 'Acme Corp sells the highest quality products.',
  keywords: ['ecommerce', 'products', 'acme'],

  // Open Graph (Facebook, LinkedIn, Slack previews)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://acme.com',
    siteName: 'Acme Corp',
    images: [
      {
        url: 'https://acme.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Acme Corp',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@AcmeCorp',
    creator: '@AcmeCorp',
  },

  // Icons
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  // Verification for Google/Bing Search Console
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },

  // Canonical URL (prevents duplicate content penalties)
  alternates: {
    canonical: 'https://acme.com',
  },
};

// app/about/page.tsx — Page-level metadata inherits and extends
export const metadata: Metadata = {
  title: 'About Us',  // Rendered as: "About Us | Acme Corp"
  description: 'Learn about our mission and team.',
  openGraph: {
    title: 'About Acme Corp',
    description: 'Our story and mission.',
  },
};
\`\`\`

---

## Dynamic Metadata (generateMetadata)

For pages where metadata depends on data:

\`\`\`tsx
// app/products/[id]/page.tsx

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';

type Props = {
  params: { id: string };
};

// generateMetadata runs BEFORE the page component
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await db.product.findUnique({
    where: { id: params.id },
    select: { name: true, description: true, images: { take: 1 } },
  });

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.name,  // → "iPhone 15 | Acme Corp"
    description: product.description,

    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
      images: product.images[0]
        ? [{ url: product.images[0].url, width: 1200, height: 630 }]
        : [],
    },

    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: product.images[0] ? [product.images[0].url] : [],
    },

    alternates: {
      canonical: \`https://acme.com/products/\${params.id}\`,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await db.product.findUnique({ where: { id: params.id } });
  if (!product) notFound();
  // NOTE: generateMetadata and the page component share the same DB query.
  // Next.js deduplicates it via request memoization — only one DB call happens.

  return <ProductDetail product={product} />;
}
\`\`\`

---

## JSON-LD Structured Data

Structured data helps Google display rich snippets (star ratings, prices, FAQs):

\`\`\`tsx
// components/JsonLd.tsx

export function ProductJsonLd({ product }: { product: ProductWithDetails }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map(i => i.url),
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Acme Corp',
      },
    },
    aggregateRating: product.reviewCount > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.averageRating,
      reviewCount: product.reviewCount,
    } : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Usage in Server Component (no JS overhead):
export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  return (
    <>
      <ProductJsonLd product={product} />
      <ProductDetail product={product} />
    </>
  );
}
\`\`\`

\`\`\`tsx
// Organization schema for company pages
export function OrganizationJsonLd() {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Acme Corp',
      url: 'https://acme.com',
      logo: 'https://acme.com/logo.png',
      sameAs: [
        'https://twitter.com/AcmeCorp',
        'https://linkedin.com/company/acme-corp',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-555-0100',
        contactType: 'Customer Service',
      },
    })}} />
  );
}
\`\`\`

---

## Sitemap

\`\`\`tsx
// app/sitemap.ts — Automatically available at /sitemap.xml

import type { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await db.product.findMany({
    select: { id: true, updatedAt: true },
  });

  const productEntries: MetadataRoute.Sitemap = products.map(p => ({
    url: \`https://acme.com/products/\${p.id}\`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://acme.com/products',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...productEntries,
  ];
}
\`\`\`

---

## Robots.txt

\`\`\`tsx
// app/robots.ts — Available at /robots.txt

import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/', '/_next/'],
      },
    ],
    sitemap: 'https://acme.com/sitemap.xml',
  };
}
\`\`\`

---

## Open Graph Image Generation

\`\`\`tsx
// app/opengraph-image.tsx — Generate OG image dynamically with Satori

import { ImageResponse } from 'next/og';

export const runtime = 'edge'; // Fast generation at the edge

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: '#1a1a2e',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <div style={{ color: 'white', fontSize: 72, fontWeight: 'bold' }}>
          Acme Corp
        </div>
        <div style={{ color: '#a0a0b0', fontSize: 28, marginTop: 16 }}>
          Best Products on the Web
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

// Dynamic per-product OG image:
// app/products/[id]/opengraph-image.tsx

export default async function ProductOGImage({ params }: { params: { id: string } }) {
  const product = await db.product.findUnique({
    where: { id: params.id },
    select: { name: true, price: true },
  });

  return new ImageResponse(
    (
      <div style={{ /* styles */ }}>
        <div style={{ fontSize: 64 }}>{product?.name}</div>
        <div style={{ fontSize: 32 }}>\${product?.price}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
\`\`\``,

  codeExamples: [
    {
      title: 'Blog post with complete SEO setup',
      code: `// app/blog/[slug]/page.tsx

import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { cache } from 'react';

const getPost = cache(async (slug: string) => {
  return db.post.findUnique({
    where: { slug, published: true },
    include: { author: { select: { name: true } } },
  });
});

// generateStaticParams pre-renders all posts at build time
export async function generateStaticParams() {
  const posts = await db.post.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return posts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author.name }],
    publishedTime: post.publishedAt.toISOString(),

    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt.toISOString(),
      authors: [post.author.name],
      images: post.coverImage
        ? [{ url: post.coverImage, width: 1200, height: 630 }]
        : [],
    },

    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },

    alternates: {
      canonical: \`https://blog.acme.com/\${params.slug}\`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  // JSON-LD for blog article
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Acme Blog',
    },
  };

  return (
    <article className="max-w-2xl mx-auto px-4 py-8">
      {/* JSON-LD injected into the page head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <h1 className="text-4xl font-bold">{post.title}</h1>
      <div className="mt-2 text-gray-500">
        By {post.author.name} · {new Date(post.publishedAt).toLocaleDateString()}
      </div>

      <div
        className="mt-8 prose"
        dangerouslySetInnerHTML={{ __html: post.htmlContent }}
      />
    </article>
  );
}`,
      explanation:
        'Complete SEO setup for a blog post: generateStaticParams pre-renders all posts at build time, generateMetadata provides dynamic title/description/OG/Twitter metadata, and JSON-LD provides structured data for Google rich snippets. cache() deduplicates the DB call between generateMetadata and the page component.',
    },
  ],

  commonMistakes: [
    'Not using the title.template in the root layout — page titles are not branded without it.',
    'Duplicate canonical URLs — each page should have a unique canonical pointing to its own URL.',
    'Missing Open Graph images — social media links look bare and unappealing without OG images.',
    'Not using generateStaticParams for blog/product pages — they become dynamically rendered (slower, no caching).',
    'Putting private admin pages in the sitemap — this wastes crawl budget and may expose structure.',
    'Using the same description for multiple pages — duplicate metadata hurts SEO.',
    'Not verifying structured data — use Google\'s Rich Results Test tool to validate JSON-LD.',
  ],

  interviewQuestions: [
    {
      question: 'How is SEO in Next.js different from a standard React application?',
      answer:
        "Standard React apps (CRA, Vite with no SSR) send an empty HTML shell to the browser. Googlebot receives <div id='root'></div> and must execute JavaScript to see content. Although Google can crawl JS, it is slower and less reliable — many pages get indexed without their dynamic content. Next.js sends fully-rendered HTML: the title, description, and all page content are in the initial response. Googlebot sees real content without executing any JavaScript. Next.js also provides the Metadata API for programmatic metadata generation, automatic sitemap and robots.txt support, and generateStaticParams for pre-building dynamic routes — all critical for SEO at scale.",
      difficulty: 'intermediate',
    },
    {
      question: 'What is the difference between static metadata and generateMetadata?',
      answer:
        'Static metadata (export const metadata = {...}) is used when the metadata is the same for every render of the page — for example, the About page or Contact page. It is defined once and never changes. generateMetadata (export async function generateMetadata({params})) is used when metadata depends on runtime data — for example, a product page where the title is the product name from the database. generateMetadata receives params and searchParams, can await async operations (database queries, API calls), and returns a Metadata object. Next.js runs generateMetadata before the page component and uses request memoization to ensure the same DB query is not duplicated between generateMetadata and the page component.',
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'seo-ex-1',
      title: 'Add full SEO to a blog listing and post page',
      description: `Add SEO to two pages:
1. /blog — Static listing page with title "Blog | Acme" and description
2. /blog/[slug] — Dynamic post page with title from DB, description from excerpt, OG metadata
3. Add JSON-LD Article schema to the post page
4. Add generateStaticParams to pre-render all published posts`,
      starterCode: `// app/blog/page.tsx — missing metadata
export default async function BlogPage() {
  const posts = await getPosts();
  return <PostList posts={posts} />;
}

// app/blog/[slug]/page.tsx — missing metadata, generateStaticParams, and JSON-LD
export default async function PostPage({ params }) {
  const post = await getPost(params.slug);
  if (!post) notFound();
  return <PostContent post={post} />;
}`,
      solution: `// app/blog/page.tsx
import type { Metadata } from 'next';
import { getPosts } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Blog',  // → "Blog | Acme" with title template
  description: 'Articles about web development, design, and engineering.',
  openGraph: {
    title: 'Acme Blog',
    description: 'Articles about web development, design, and engineering.',
  },
};

export default async function BlogPage() {
  const posts = await getPosts();
  return <PostList posts={posts} />;
}

// app/blog/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { getPost, getAllPostSlugs } from '@/lib/queries';

const fetchPost = cache(getPost);

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await fetchPost(params.slug);
  if (!post) return { title: 'Not Found' };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt.toISOString(),
      images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630 }] : [],
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt },
    alternates: { canonical: \`https://acme.com/blog/\${params.slug}\` },
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);
  if (!post) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { '@type': 'Person', name: post.author.name },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <PostContent post={post} />
    </article>
  );
}`,
      hints: [
        'export const metadata works for static pages, generateMetadata for dynamic ones',
        'cache() on getPost ensures generateMetadata and page component share one DB call',
        'generateStaticParams enables SSG — all posts pre-built at build time',
        'JSON-LD script goes inside the JSX, not in the metadata object',
      ],
    },
  ],

  keyTakeaways: [
    'Next.js SSR/SSG sends real HTML to Google — no JS execution required for indexing.',
    'export const metadata for static pages; generateMetadata (async) for data-driven pages.',
    'title.template in root layout brands all page titles automatically.',
    'Open Graph metadata controls how your page looks when shared on social media.',
    'JSON-LD structured data enables Google rich snippets (stars, prices, FAQs).',
    'app/sitemap.ts generates /sitemap.xml; app/robots.ts generates /robots.txt.',
    'generateStaticParams + dynamic routes = SSG with dynamic content — best of both worlds.',
    'cache() deduplicates the DB call between generateMetadata and the page component.',
  ],
};
