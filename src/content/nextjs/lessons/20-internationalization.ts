import type { Lesson } from '@/types';

export const internationalizationLesson: Lesson = {
  id: 'nextjs-internationalization',
  slug: 'nextjs-internationalization',
  title: 'Internationalization (i18n)',
  description:
    'Master internationalization in Next.js — locale routing, next-intl, translation files, dynamic locale detection, RTL support, date/number formatting, and SEO for multiple languages.',
  category: 'Internationalization',
  order: 20,
  difficulty: 'intermediate',
  estimatedTime: 45,
  prevLesson: 'nextjs-security',
  nextLesson: 'nextjs-deployment',

  content: `# Internationalization (i18n) in Next.js

## What is i18n?

**Internationalization (i18n)**: Building your app so it CAN support multiple languages/locales.
**Localization (l10n)**: Actually translating and adapting content for a specific locale.

The "18" in i18n = 18 letters between "i" and "n" in "internationalization".

---

## The Next.js i18n Strategy

Next.js App Router recommends URL-based locale routing:

\`\`\`
/en/products        → English
/fr/products        → French
/ar/products        → Arabic (RTL)
/products           → Redirects to detected locale
\`\`\`

The locale is part of the URL — this is better than cookie-based locale because:
- Pages can be cached per-locale (SSG)
- URLs are shareable and indexable by search engines
- No JavaScript needed to determine locale

---

## Setup with next-intl

\`next-intl\` is the most popular i18n library for Next.js App Router:

\`\`\`bash
npm install next-intl
\`\`\`

**Directory structure:**
\`\`\`
app/
  [locale]/
    layout.tsx
    page.tsx
    products/
      page.tsx
messages/
  en.json
  fr.json
  ar.json
middleware.ts
i18n.ts
\`\`\`

---

## Translation Files

\`\`\`json
// messages/en.json
{
  "nav": {
    "home": "Home",
    "products": "Products",
    "about": "About",
    "signin": "Sign in"
  },
  "home": {
    "hero": {
      "title": "Build faster with Acme",
      "subtitle": "The best platform for modern teams",
      "cta": "Get started free"
    }
  },
  "products": {
    "title": "Products",
    "addToCart": "Add to Cart",
    "outOfStock": "Out of Stock",
    "price": "{price, number, ::currency/USD}"
  },
  "errors": {
    "notFound": "Page not found",
    "serverError": "Something went wrong"
  }
}
\`\`\`

\`\`\`json
// messages/fr.json
{
  "nav": {
    "home": "Accueil",
    "products": "Produits",
    "about": "À propos",
    "signin": "Se connecter"
  },
  "home": {
    "hero": {
      "title": "Construisez plus vite avec Acme",
      "subtitle": "La meilleure plateforme pour les équipes modernes",
      "cta": "Commencer gratuitement"
    }
  },
  "products": {
    "title": "Produits",
    "addToCart": "Ajouter au panier",
    "outOfStock": "Rupture de stock",
    "price": "{price, number, ::currency/EUR}"
  }
}
\`\`\`

---

## Middleware for Locale Detection

\`\`\`tsx
// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'fr', 'de', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always', // /en/... for all locales
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
\`\`\`

---

## i18n Configuration

\`\`\`tsx
// i18n.ts — next-intl request config
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(\`./messages/\${locale}.json\`)).default,
  timeZone: 'UTC',
  now: new Date(),
}));
\`\`\`

---

## Root Layout with Locale

\`\`\`tsx
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'fr', 'de', 'ar'] as const;
type Locale = (typeof locales)[number];

// RTL languages
const rtlLocales = ['ar', 'he', 'fa', 'ur'];

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={rtlLocales.includes(locale) ? 'rtl' : 'ltr'}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
\`\`\`

---

## Using Translations in Server Components

\`\`\`tsx
// app/[locale]/page.tsx — Server Component
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('home.hero');

  return (
    <section>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
      <a href="/products">{t('cta')}</a>
    </section>
  );
}
\`\`\`

---

## Using Translations in Client Components

\`\`\`tsx
// components/NavBar.tsx — Client Component
"use client";

import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export function NavBar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();

  function switchLocale(newLocale: string) {
    // Replace the locale prefix in the current path
    router.push(\`/\${newLocale}\${window.location.pathname.replace(\`/\${locale}\`, '')}\`);
  }

  return (
    <nav>
      <a href={\`/\${locale}\`}>{t('home')}</a>
      <a href={\`/\${locale}/products\`}>{t('products')}</a>
      <a href={\`/\${locale}/about\`}>{t('about')}</a>

      {/* Language switcher */}
      <div>
        {['en', 'fr', 'de'].map(l => (
          <button
            key={l}
            onClick={() => switchLocale(l)}
            className={locale === l ? 'font-bold' : ''}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </nav>
  );
}
\`\`\`

---

## Date, Number, and Currency Formatting

\`\`\`tsx
// next-intl's useFormatter handles locale-aware formatting

"use client";
import { useFormatter } from 'next-intl';

export function ProductCard({ product }) {
  const format = useFormatter();

  return (
    <div>
      {/* Currency: $9.99 (en-US), 9,99 € (fr-FR), £9.99 (en-GB) */}
      <p>{format.number(product.price, { style: 'currency', currency: 'USD' })}</p>

      {/* Date: "Jan 15, 2024" (en-US), "15 janv. 2024" (fr-FR) */}
      <p>{format.dateTime(product.updatedAt, { dateStyle: 'medium' })}</p>

      {/* Relative time: "3 days ago" (en-US), "il y a 3 jours" (fr-FR) */}
      <p>{format.relativeTime(product.createdAt)}</p>

      {/* List: "Red, Blue, and Green" (en), "Rouge, Bleu et Vert" (fr) */}
      <p>{format.list(['Red', 'Blue', 'Green'], { type: 'conjunction' })}</p>
    </div>
  );
}

// In Server Components, use getFormatter:
import { getFormatter } from 'next-intl/server';

async function ServerProductCard({ product }) {
  const format = await getFormatter();
  return <p>{format.number(product.price, { style: 'currency', currency: 'USD' })}</p>;
}
\`\`\`

---

## i18n SEO

\`\`\`tsx
// app/[locale]/layout.tsx — hreflang tags for SEO
export async function generateMetadata({ params: { locale } }) {
  return {
    alternates: {
      canonical: \`https://acme.com/\${locale}\`,
      languages: {
        'en': 'https://acme.com/en',
        'fr': 'https://acme.com/fr',
        'de': 'https://acme.com/de',
        'x-default': 'https://acme.com/en',
      },
    },
  };
}
\`\`\``,

  codeExamples: [
    {
      title: 'Pluralization and ICU message format',
      code: `// messages/en.json — ICU message format
{
  "cart": {
    "itemCount": "{count, plural, =0 {No items} =1 {1 item} other {# items}} in your cart",
    "welcome": "Welcome back, {name}!",
    "lastSeen": "Last seen on {date, date, medium}"
  }
}

// messages/fr.json — French pluralization rules differ
{
  "cart": {
    "itemCount": "{count, plural, =0 {Aucun article} =1 {1 article} other {# articles}} dans votre panier",
    "welcome": "Bon retour, {name} !",
    "lastSeen": "Vu la dernière fois le {date, date, medium}"
  }
}

// Usage in component:
"use client";
import { useTranslations } from 'next-intl';

export function CartSummary({ count, userName, lastSeen }: {
  count: number;
  userName: string;
  lastSeen: Date;
}) {
  const t = useTranslations('cart');

  return (
    <div>
      {/* Pluralization handled automatically per locale */}
      <p>{t('itemCount', { count })}</p>
      {/* "No items in your cart" / "1 item in your cart" / "3 items in your cart" */}

      {/* Variable interpolation */}
      <p>{t('welcome', { name: userName })}</p>
      {/* "Welcome back, John!" */}

      {/* Date formatting with variable */}
      <p>{t('lastSeen', { date: lastSeen })}</p>
      {/* "Last seen on Jan 15, 2024" */}
    </div>
  );
}`,
      explanation:
        'ICU message format handles pluralization (which varies between languages — Arabic has 6 plural forms, Russian has 3, English has 2), variable interpolation, and embedded date/number formatting. next-intl uses the same ICU format as the native Intl API.',
    },
  ],

  commonMistakes: [
    'Hardcoding strings in JSX — any string visible to users must come from a translation file.',
    'Using cookie-based locale without also reflecting it in the URL — breaks SSG caching and SEO.',
    'Not adding hreflang tags — search engines need to know which URL to show for which language.',
    'Assuming LTR layout — design components with RTL in mind, use logical CSS properties (margin-inline-start instead of margin-left).',
    'Not handling missing translations — use a fallback locale for untranslated strings.',
    'Storing locale-specific text in the database without a locale column — internationalized content needs locale-aware data models.',
  ],

  interviewQuestions: [
    {
      question: 'Why is URL-based locale routing preferred over cookie-based in Next.js?',
      answer:
        "URL-based routing (/en/products, /fr/products) has three key advantages: (1) Caching — Next.js can statically generate or cache pages per-locale. With cookie-based locale, the same URL serves different content for different users, which breaks caching. (2) SEO — Google can crawl and index each locale as a separate URL. Search users in France see /fr content, in the US see /en content. You add hreflang tags to tell Google about alternative locales. (3) Shareability — a French user can share a URL with an English colleague who sees the English version by just changing /fr to /en. Cookie-based locale is invisible in the URL and the shared link shows the sharer's language to the recipient.",
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'i18n-ex-1',
      title: 'Set up a basic bilingual (en/fr) Next.js app',
      description: `Set up next-intl for English and French:
1. Create messages/en.json and messages/fr.json with navigation strings
2. Set up middleware to route /en/* and /fr/*
3. Create the [locale] layout with NextIntlClientProvider
4. Create a navbar that shows translated links and a language switcher`,
      starterCode: `// Install: npm install next-intl

// Your task:
// 1. messages/en.json — nav.home, nav.products, nav.about
// 2. messages/fr.json — translations of the above
// 3. middleware.ts — createMiddleware with locales: ['en', 'fr']
// 4. app/[locale]/layout.tsx — NextIntlClientProvider
// 5. components/Navbar.tsx — useTranslations + language switcher`,
      solution: `// messages/en.json
{
  "nav": {
    "home": "Home",
    "products": "Products",
    "about": "About"
  }
}

// messages/fr.json
{
  "nav": {
    "home": "Accueil",
    "products": "Produits",
    "about": "À propos"
  }
}

// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
});

export const config = {
  matcher: ['/((?!api|_next|.*\\.).*)'],
};

// i18n.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(\`./messages/\${locale}.json\`)).default,
}));

// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export default async function LocaleLayout({ children, params: { locale } }) {
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

// components/Navbar.tsx
"use client";
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(newLocale: string) {
    const newPath = pathname.replace(\`/\${locale}\`, \`/\${newLocale}\`);
    router.push(newPath);
  }

  return (
    <nav className="flex items-center gap-6 p-4 border-b">
      <Link href={\`/\${locale}\`}>{t('home')}</Link>
      <Link href={\`/\${locale}/products\`}>{t('products')}</Link>
      <Link href={\`/\${locale}/about\`}>{t('about')}</Link>

      <div className="ml-auto flex gap-2">
        {['en', 'fr'].map(l => (
          <button
            key={l}
            onClick={() => switchLocale(l)}
            className={\`text-sm px-2 py-1 rounded \${locale === l ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}\`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </nav>
  );
}`,
      hints: [
        'The [locale] directory makes the locale a URL parameter',
        'NextIntlClientProvider must wrap all components that use useTranslations',
        'getMessages() in a Server Component reads messages for the current locale',
        'Language switcher replaces the locale prefix in the current pathname',
      ],
    },
  ],

  keyTakeaways: [
    'URL-based locale routing (/en/*, /fr/*) enables SSG caching and SEO — preferred over cookie-based.',
    'next-intl is the recommended i18n library for Next.js App Router with Server Component support.',
    'Translation files (messages/en.json) must cover all user-visible strings.',
    'ICU message format handles pluralization (which varies significantly between languages).',
    'Add dir="rtl" to the html element for Arabic, Hebrew, and other RTL languages.',
    'Add hreflang tags to tell search engines about locale alternatives.',
    'useTranslations works in both Server and Client Components with next-intl.',
    'Date/number/currency formatting uses the native Intl API — always locale-aware.',
  ],
};
