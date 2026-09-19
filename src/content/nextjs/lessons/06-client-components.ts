import type { Lesson } from '@/types';

export const clientComponentsLesson: Lesson = {
  id: 'nextjs-client-components',
  slug: 'nextjs-client-components',
  title: 'Client Components',
  description:
    'Understand Client Components — when they are required, how "use client" works, interactivity patterns, browser APIs, state management in Next.js, and how to minimize their use.',
  category: 'Client Components',
  order: 6,
  difficulty: 'intermediate',
  estimatedTime: 40,
  prevLesson: 'nextjs-server-components',
  nextLesson: 'nextjs-rendering-strategies',

  content: `# Client Components

## What Client Components Are

Client Components are React components that run in the browser. They are the React you already know from your React track — hooks, state, effects, event handlers, browser APIs. All of it works exactly as you learned.

In Next.js, the difference is that you must be **explicit** about it. You add \`"use client"\` at the top of the file to mark it as a Client Component.

\`\`\`tsx
"use client";  // This is a directive, not a comment

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
\`\`\`

Without \`"use client"\`, this would be a Server Component — and Server Components cannot use \`useState\`. You would get an error.

---

## What "use client" Actually Means

\`"use client"\` does NOT mean "only runs on client." This is a common misconception.

**What it actually means:** \`"use client"\` marks the **boundary** between server and client code. It tells Next.js:

1. This file and all its imports are part of the client bundle
2. This component will render on the server for initial HTML (SSR)
3. This component will hydrate and become interactive in the browser

So a Client Component renders twice:
- **Once on the server** — to generate the initial HTML the user sees immediately
- **Once on the client** — to hydrate, attach event listeners, and activate state

\`\`\`tsx
"use client";

// This runs on BOTH server and client:
// Server run: produces initial HTML
// Client run: hydrates the HTML, activates useState and onClick

import { useState } from 'react';

export function LikeButton({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);

  function handleLike() {
    setLiked(true);
    setCount(c => c + 1);
  }

  return (
    <button
      onClick={handleLike}
      className={liked ? 'text-red-500' : 'text-gray-400'}
    >
      ♥ {count}
    </button>
  );
}
\`\`\`

---

## When Client Components Are Required

| Requirement | Example | Why client is needed |
|---|---|---|
| useState | Toggle, counter, form | State lives in browser memory |
| useEffect | Data polling, subscriptions | Runs after DOM is available |
| useReducer | Complex state machines | Same as useState |
| Event handlers | onClick, onChange, onSubmit | Events fire in browser |
| Browser APIs | localStorage, sessionStorage | Only in browser |
| Geolocation | navigator.geolocation | Only in browser |
| Canvas / WebGL | Drawings, 3D graphics | DOM APIs |
| Third-party UI | Charts, maps, editors | Most require DOM |
| useRouter, usePathname, useSearchParams | Navigation hooks | Read browser URL |
| Custom hooks that use any of the above | useLocalStorage, useDebounce | Inherit client requirement |

---

## The "use client" Boundary

When you add \`"use client"\` to a file, it creates a client boundary. ALL imports from that file are also treated as client-side.

\`\`\`tsx
// nav.tsx
"use client";

// EVERYTHING imported here becomes client-side JavaScript:
import { UserAvatar } from './UserAvatar';    // becomes client
import { SearchBar } from './SearchBar';      // becomes client
import { Logo } from './Logo';               // becomes client

// Even if Logo is a simple static component with no state or effects,
// it becomes part of the client bundle because it is imported inside
// a "use client" file.
\`\`\`

**Implication:** Keep Client Components small and focused. Do not import large libraries or Server-only code inside a Client Component.

---

## Client-Only APIs

\`\`\`tsx
"use client";

import { useEffect, useState } from 'react';

// ── localStorage ────────────────────────────────────────────
export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // localStorage only accessible in browser
    // useEffect only runs in browser (after mount)
    const saved = localStorage.getItem('theme') as 'light' | 'dark';
    if (saved) setTheme(saved);
  }, []);

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  }

  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}

// ── Geolocation ─────────────────────────────────────────────
export function LocationButton() {
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);

  function getLocation() {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation(pos.coords),
      (err) => console.error(err)
    );
  }

  return (
    <div>
      <button onClick={getLocation}>Get Location</button>
      {location && (
        <p>Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}</p>
      )}
    </div>
  );
}
\`\`\`

---

## Navigation Hooks (Client Only)

\`\`\`tsx
"use client";

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

// ── Active Navigation ────────────────────────────────────────
export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname(); // Current URL path
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    <a
      href={href}
      className={isActive ? 'font-bold text-blue-600' : 'text-gray-600 hover:text-gray-900'}
    >
      {children}
    </a>
  );
}

// ── Search with URL sync ─────────────────────────────────────
export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get('q') ?? '';

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set('q', e.target.value);
    } else {
      params.delete('q');
    }
    // Update URL without page reload
    router.push(\`?\${params.toString()}\`);
  }

  return (
    <input
      type="search"
      defaultValue={currentQuery}
      onChange={handleSearch}
      placeholder="Search..."
      className="border rounded px-3 py-2"
    />
  );
}
\`\`\`

---

## Keeping Client Components Small

The goal is to minimize the client bundle. The pattern: push state and interactivity down to the smallest possible component.

\`\`\`tsx
// ❌ WRONG: Making the entire page a Client Component for one button

"use client";
import { useState } from 'react';

// This makes ALL of this a client bundle:
// - The database-fetched product data pattern
// - ProductImages (could be server)
// - ProductInfo (could be server)
// - Reviews (could be server)
// Just because AddToCart needs state

export default function ProductPage() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <div>
      <ProductImages />   {/* Forced client */}
      <ProductInfo />     {/* Forced client */}
      <button onClick={() => setCartCount(c => c + 1)}>
        Add to Cart ({cartCount})
      </button>
      <Reviews />         {/* Forced client */}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────

// ✅ CORRECT: Extract the interactive part to a small Client Component

// app/products/[id]/page.tsx — Server Component (no client directive)
import { AddToCartButton } from './AddToCartButton'; // Client Component

export default async function ProductPage({ params }) {
  const product = await db.product.findUnique({ where: { id: params.id } });

  return (
    <div>
      <ProductImages images={product.images} />   {/* Server */}
      <ProductInfo product={product} />            {/* Server */}
      <AddToCartButton productId={product.id} />  {/* Only this is client */}
      <Reviews productId={product.id} />          {/* Server */}
    </div>
  );
}

// components/AddToCartButton.tsx — Small, focused Client Component
"use client";
import { useState } from 'react';

export function AddToCartButton({ productId }: { productId: string }) {
  const [added, setAdded] = useState(false);

  async function handleAddToCart() {
    await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
    setAdded(true);
  }

  return (
    <button onClick={handleAddToCart}>
      {added ? '✓ Added to Cart' : 'Add to Cart'}
    </button>
  );
}
// Client bundle impact: just this small component
\`\`\`

---

## Common Client Component Patterns

### Form with controlled state
\`\`\`tsx
"use client";

import { useState } from 'react';

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      await fetch('/api/contact', { method: 'POST', body: JSON.stringify(form) });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        placeholder="Name"
      />
      <input
        value={form.email}
        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        placeholder="Email"
      />
      <textarea
        value={form.message}
        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
        placeholder="Message"
      />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending...' : 'Send'}
      </button>
      {status === 'success' && <p>Message sent!</p>}
      {status === 'error' && <p>Failed. Try again.</p>}
    </form>
  );
}
\`\`\`

### Dropdown / Toggle with state
\`\`\`tsx
"use client";

import { useState, useRef, useEffect } from 'react';

export function Dropdown({ items }: { items: string[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click — requires browser event listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}>
        Options ▾
      </button>
      {open && (
        <ul className="absolute top-full left-0 bg-white shadow-lg rounded border">
          {items.map(item => (
            <li key={item} className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
\`\`\`

---

## Preventing Hydration Mismatches

If your Client Component renders different content on server vs client, React throws a hydration mismatch error.

\`\`\`tsx
"use client";

import { useEffect, useState } from 'react';

// ❌ Causes hydration mismatch
export function BadComponent() {
  // On server: window is undefined, uses empty string
  // On client: uses window.innerWidth
  const width = typeof window !== 'undefined' ? window.innerWidth : '';
  return <div>Width: {width}</div>;
  // Server renders "Width: " but client renders "Width: 1440" — MISMATCH
}

// ✅ Correct: wait for client mount
export function GoodComponent() {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    // Only runs in browser, after hydration
    setWidth(window.innerWidth);
  }, []);

  if (width === null) return <div>Width: loading...</div>;
  return <div>Width: {width}</div>;
  // Server renders "loading..." AND client initially renders "loading..."
  // Then client updates to the real width — no mismatch
}
\`\`\``,

  codeExamples: [
    {
      title: 'Real-world example: Sidebar with mobile toggle',
      code: `// components/layout/Sidebar.tsx — Client Component
// Needs state for mobile open/close, uses window for resize detection
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/projects', label: 'Projects', icon: '📁' },
  { href: '/team', label: 'Team', icon: '👥' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export function Sidebar({ user }: { user: { name: string; avatarUrl: string } }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar when route changes (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close on escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(o => !o)}
        aria-label="Toggle sidebar"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={\`
          fixed left-0 top-0 h-full w-64 bg-white border-r z-40 transform transition-transform
          lg:translate-x-0 lg:static
          \${isOpen ? 'translate-x-0' : '-translate-x-full'}
        \`}
      >
        {/* User info — data passed from Server Component as props */}
        <div className="p-4 border-b">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
          <span className="ml-2 font-medium">{user.name}</span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={\`
                  flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                  \${isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                \`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

// Usage in Server Component layout:
// app/(app)/layout.tsx
// export default async function AppLayout({ children }) {
//   const user = await getCurrentUser();
//   return (
//     <div className="flex">
//       <Sidebar user={user} />  {/* Client Component — receives server data as props */}
//       <main>{children}</main>
//     </div>
//   );
// }`,
      explanation:
        'The sidebar needs to be a Client Component for mobile toggle state and keyboard handling. But notice: the user data is fetched in the Server Component layout and passed as props — the data fetching stays on the server.',
    },
  ],

  commonMistakes: [
    'Adding "use client" to every component because it feels safer — this defeats the performance benefits of Next.js.',
    'Thinking "use client" means the component only runs in the browser — it still server-renders for initial HTML (SSR).',
    'Putting data fetching in Client Components with useEffect — move this to Server Components where possible.',
    'Creating large Client Components that import many libraries — every import inside a Client Component becomes browser JavaScript.',
    'Not passing server-fetched data as props to Client Components — fetch in a Server Component, pass data down as props.',
    'Using window or document outside of useEffect in a Client Component — these cause hydration mismatches because server does not have them.',
  ],

  interviewQuestions: [
    {
      question: 'Does "use client" mean a component only runs in the browser?',
      answer:
        'No — this is a common misconception. "use client" marks the server-to-client boundary. A Client Component still renders on the server for the initial HTML (server-side rendering). This is why users see content before JavaScript loads. After the initial render, React hydrates the component in the browser, attaching event listeners and activating state. So a Client Component renders twice: once on the server (produces static HTML) and once in the browser (hydrates and becomes interactive). "use client" tells Next.js to include this component in the browser JavaScript bundle.',
      difficulty: 'intermediate',
      tip: 'This is a very common interview trick question. The answer: it renders on BOTH server and client.',
    },
    {
      question: 'How do you minimize the client JavaScript bundle in Next.js?',
      answer:
        'The primary strategy is to push interactivity as deep (as late in the component tree) as possible. Instead of making an entire page a Client Component for one interactive button, extract just the button as a "use client" component. The rest of the page stays as Server Components. Techniques: (1) Keep "use client" components small and focused. (2) Avoid importing large libraries inside Client Components. (3) Pass server-fetched data as props to Client Components rather than fetching in Client Components. (4) Use Server Components for everything that does not need browser interactivity. (5) Use dynamic imports (next/dynamic) with { ssr: false } for third-party client-only components (like maps or editors) to lazy-load them only when needed.',
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'cc-ex-1',
      title: 'Build a tabs component with proper server/client split',
      description: `Build a tabbed interface for a user profile page where:
- User data (name, bio, stats) fetches on the server
- The tab switching is a Client Component
- Content for each tab fetches on the server when the tab is selected

The tabs are: Overview, Posts (10 posts), and Followers (list of users).

Design this so the minimum code is client-side.`,
      starterCode: `// Mock data
async function getUser(username: string) {
  return { name: 'Jane Doe', bio: 'Software Engineer', followers: 1234 };
}

async function getUserPosts(username: string) {
  return [{ id: '1', title: 'My First Post' }, { id: '2', title: 'Next.js Tips' }];
}

async function getUserFollowers(username: string) {
  return [{ id: '1', name: 'Alice' }, { id: '2', name: 'Bob' }];
}

// TODO: Implement:
// 1. app/users/[username]/page.tsx — Server Component (main page)
// 2. components/ProfileTabs.tsx — Client Component (just the tab switching)
// 3. How does tab content render? Server or client?`,
      solution: `// app/users/[username]/page.tsx — Server Component
import { ProfileTabs } from '@/components/ProfileTabs';

export default async function UserProfilePage({
  params,
  searchParams,
}: {
  params: { username: string };
  searchParams: { tab?: string };
}) {
  const user = await getUser(params.username);
  const activeTab = searchParams.tab ?? 'overview';

  // Pre-fetch data for the active tab
  // searchParams-driven — server renders the correct tab content
  const tabData = await (async () => {
    if (activeTab === 'posts') return getUserPosts(params.username);
    if (activeTab === 'followers') return getUserFollowers(params.username);
    return null;
  })();

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Server-rendered user info */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-gray-500">{user.bio}</p>
        <p className="text-sm">{user.followers} followers</p>
      </header>

      {/* Client Component handles tab click (updates URL searchParam) */}
      {/* Server Component receives the tab content as children */}
      <ProfileTabs activeTab={activeTab}>
        {activeTab === 'overview' && (
          <div>
            <h2>Overview</h2>
            <p>Welcome to {user.name}'s profile.</p>
          </div>
        )}
        {activeTab === 'posts' && (
          <ul>
            {(tabData as any[]).map((post) => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        )}
        {activeTab === 'followers' && (
          <ul>
            {(tabData as any[]).map((follower) => (
              <li key={follower.id}>{follower.name}</li>
            ))}
          </ul>
        )}
      </ProfileTabs>
    </div>
  );
}

// components/ProfileTabs.tsx — Client Component (ONLY for tab navigation)
"use client";
import { useRouter, useSearchParams } from 'next/navigation';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'posts', label: 'Posts' },
  { id: 'followers', label: 'Followers' },
];

export function ProfileTabs({
  activeTab,
  children,
}: {
  activeTab: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function selectTab(tabId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tabId);
    router.push(\`?\${params.toString()}\`); // URL changes → page re-fetches on server
  }

  return (
    <div>
      <div className="flex border-b mb-4">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => selectTab(tab.id)}
            className={\`px-4 py-2 -mb-px \${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                : 'text-gray-500'
            }\`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}

// KEY INSIGHT: Tab content is SERVER-rendered via searchParams
// Clicking a tab: updates ?tab= URL param → server re-runs page.tsx
// → fetches correct tab data → renders as HTML
// The Client Component only handles the click → URL update
// All data fetching stays on the server`,
      hints: [
        'Use searchParams to track active tab in the URL — this keeps tab state server-side',
        'The ProfileTabs Client Component only needs to handle onClick → router.push',
        'Tab content can be passed as children from the Server Component',
        'This pattern: URL is the state, server renders the content',
      ],
    },
  ],

  keyTakeaways: [
    '"use client" marks the server-to-client boundary — the component still server-renders for initial HTML, then hydrates in the browser.',
    'Client Components are required for: useState, useEffect, event handlers, browser APIs (localStorage, window, navigator), and navigation hooks.',
    'Keep Client Components small — extract only the interactive part, keep the rest as Server Components.',
    'Every import inside a "use client" file becomes part of the browser bundle — avoid large imports in Client Components.',
    'Pass server-fetched data as props to Client Components rather than fetching inside them.',
    'Prevent hydration mismatches by reading browser-only values inside useEffect, not during initial render.',
    'The goal is a mostly Server Component tree with interactive Client Component leaves.',
    'The "use client" boundary is a performance boundary — everything below it costs browser JavaScript.',
  ],
};
