import type { Lesson } from '@/types';

export const stateManagementLesson: Lesson = {
  id: 'nextjs-state-management',
  slug: 'nextjs-state-management',
  title: 'State Management',
  description:
    'Master state management in Next.js — when to use local state, Context, Zustand, Redux Toolkit, TanStack Query, and server state. Understand which tool belongs where.',
  category: 'State Management',
  order: 15,
  difficulty: 'intermediate',
  estimatedTime: 45,
  prevLesson: 'nextjs-forms-validation',
  nextLesson: 'nextjs-performance-optimization',

  content: `# State Management in Next.js

## The New Mental Model

In a React SPA, you manage everything in client state. In Next.js, most state should live on the server:

\`\`\`
OLD (React SPA): State lives in JS memory
  User data → useState
  Product data → useState + useEffect + Redux
  Cart items → useState / Redux
  Filters → useState

NEW (Next.js): State lives where it belongs
  User data → Server Component (DB query)
  Product data → Server Component (DB query or fetch)
  Cart items → Server state (DB) + local UI state
  Filters → URL searchParams (shareable, bookmarkable)
\`\`\`

URL as state is particularly powerful in Next.js — it is shareable, works with the browser back button, and enables Server Components to read it.

---

## State Decision Framework

\`\`\`
Where does this state belong?

Is it server data (user info, products, posts)?
  → Fetch in Server Components. Don't put it in client state.

Does it only change based on user interaction (modal open, tab selected)?
  → Local useState. It's ephemeral UI state.

Does it need to be shared across many components?
  → Context API (if it changes infrequently)
  → Zustand (if it changes frequently or has complex logic)

Is it a filter/sort/search that should be URL-shareable?
  → URL searchParams with router.push

Is it server data needed in client components (cart, user preferences)?
  → TanStack Query or SWR (server state management)
\`\`\`

---

## Local State (useState)

For component-level UI state:

\`\`\`tsx
"use client";

// Good use cases for useState:
// - Modal open/close
// - Dropdown/accordion state
// - Tab selection
// - Loading state for optimistic updates

export function ProductTabs({ productId }: { productId: string }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews'>('overview');

  return (
    <div>
      <div role="tablist" className="flex gap-4 border-b">
        {(['overview', 'specs', 'reviews'] as const).map(tab => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'border-b-2 border-blue-500' : ''}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      {activeTab === 'overview' && <Overview productId={productId} />}
      {activeTab === 'specs' && <Specs productId={productId} />}
      {activeTab === 'reviews' && <Reviews productId={productId} />}
    </div>
  );
}
\`\`\`

---

## URL State (searchParams)

URL state is the most underused pattern in Next.js. Use it for:
- Filters and sorting
- Pagination
- Search queries
- Active tab (shareable)

\`\`\`tsx
// app/products/page.tsx — URL-driven filtering
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string; page?: string };
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
      {/* FilterBar updates URL, page re-renders with new server data */}
      <FilterBar category={category} sort={sort} />
      <ProductGrid products={products} />
      <Pagination page={page} />
    </div>
  );
}

// components/FilterBar.tsx — Client Component updates URL
"use client";
import { useRouter, useSearchParams } from 'next/navigation';

export function FilterBar({
  category,
  sort,
}: {
  category: string;
  sort: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    params.delete('page'); // Reset to page 1 on filter change
    router.push(\`?\${params.toString()}\`);
  }

  return (
    <div className="flex gap-4">
      <select
        value={category}
        onChange={e => updateFilter('category', e.target.value)}
      >
        <option value="all">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>
      <select
        value={sort}
        onChange={e => updateFilter('sort', e.target.value)}
      >
        <option value="newest">Newest</option>
        <option value="price">Price: Low to High</option>
      </select>
    </div>
  );
}
\`\`\`

---

## Context API

For state that needs to be accessed by many components but does not change frequently:

\`\`\`tsx
// lib/contexts/theme.tsx
"use client";

import { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved) setTheme(saved);
  }, []);

  function handleSetTheme(newTheme: Theme) {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark',
      newTheme === 'dark' ||
      (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

// app/layout.tsx — Wrap only the part that needs it
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>  {/* Must be a Client Component */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
\`\`\`

---

## Zustand

For complex client-side state with multiple actions:

\`\`\`tsx
// lib/stores/cart.ts
"use client"; // Zustand stores must run on client

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => set((state) => {
        const existing = state.items.find(i => i.id === item.id);
        if (existing) {
          return {
            items: state.items.map(i =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          };
        }
        return { items: [...state.items, { ...item, quantity: 1 }] };
      }),

      removeItem: (id) => set(state => ({
        items: state.items.filter(i => i.id !== id),
      })),

      updateQuantity: (id, quantity) => set(state => ({
        items: quantity <= 0
          ? state.items.filter(i => i.id !== id)
          : state.items.map(i => i.id === id ? { ...i, quantity } : i),
      })),

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'cart-storage',   // localStorage key
      partialize: (state) => ({ items: state.items }), // Only persist items, not functions
    }
  )
);

// Usage in any Client Component:
export function CartButton() {
  const { totalItems, addItem } = useCart();
  return (
    <button>Cart ({totalItems()})</button>
  );
}
\`\`\`

---

## TanStack Query (Server State)

For client-side data fetching with caching, mutation, and real-time:

\`\`\`tsx
// providers/QueryProvider.tsx
"use client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60 * 1000 }, // Cache for 1 minute
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// Usage in Client Components
"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function Notifications({ userId }: { userId: string }) {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => fetch(\`/api/notifications?userId=\${userId}\`).then(r => r.json()),
    refetchInterval: 30000, // Poll every 30 seconds
  });

  const qc = useQueryClient();
  const markRead = useMutation({
    mutationFn: (id: string) =>
      fetch(\`/api/notifications/\${id}/read\`, { method: 'POST' }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications', userId] }),
  });

  if (isLoading) return <Spinner />;
  return (
    <ul>
      {notifications?.map(n => (
        <li key={n.id} onClick={() => markRead.mutate(n.id)}>
          {n.message}
        </li>
      ))}
    </ul>
  );
}
\`\`\`

---

## State Management Decision Table

| State type | Tool | Why |
|---|---|---|
| Server data (DB/API) | Server Components | No JS to browser |
| Filters, search | URL searchParams | Shareable, bookmarkable |
| UI state (modal, tab) | useState | Ephemeral, component-local |
| Shared UI state (theme) | Context | Infrequent changes |
| Shopping cart | Zustand + persist | Complex, needs localStorage |
| Real-time/polling data | TanStack Query | Caching + background refresh |
| Complex global state | Zustand | Better than Redux for Next.js |`,

  codeExamples: [
    {
      title: 'Zustand store with Next.js Server Component integration',
      code: `// The challenge: Zustand runs on client. How do we initialize it with server data?

// Pattern: Server Component fetches data → passes to Client Component → seeds Zustand

// lib/stores/user.ts
"use client";
import { create } from 'zustand';

type UserStore = {
  user: { id: string; name: string; role: string } | null;
  setUser: (user: UserStore['user']) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>()(set => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

// components/UserStoreInitializer.tsx
// This Client Component seeds the Zustand store with server data
"use client";
import { useEffect } from 'react';
import { useUserStore } from '@/lib/stores/user';

export function UserStoreInitializer({
  user,
}: {
  user: { id: string; name: string; role: string } | null;
}) {
  const setUser = useUserStore(s => s.setUser);

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return null; // Renders nothing — just initializes store
}

// app/layout.tsx — Server Component fetches, passes to initializer
import { getCurrentUser } from '@/lib/auth';
import { UserStoreInitializer } from '@/components/UserStoreInitializer';

export default async function RootLayout({ children }) {
  const user = await getCurrentUser(); // Server side

  return (
    <html>
      <body>
        <UserStoreInitializer user={user} />
        {children}
      </body>
    </html>
  );
}

// Now any Client Component can read the user from the store:
"use client";
export function UserAvatar() {
  const user = useUserStore(s => s.user);
  if (!user) return null;
  return <div>{user.name.charAt(0).toUpperCase()}</div>;
}`,
      explanation:
        'Zustand cannot access server data directly. The pattern: server fetches data, passes it to a thin Client Component initializer, which seeds the store. Subsequent client components read from the store without any server round trip.',
    },
  ],

  commonMistakes: [
    'Putting server data (products, posts) into Zustand or Redux — Server Components handle this without any client state.',
    'Using Context for frequently-changing state (every keystroke triggers re-renders for all consumers).',
    'Not using URL state for filters — users cannot bookmark or share filtered views.',
    'Creating a Zustand store as a module-level variable without Provider — works but causes issues with SSR and testing.',
    'Wrapping the entire app in QueryClientProvider but not the server data — TanStack Query is for client fetching only.',
    'Using Redux for a Next.js app without a specific reason — Zustand is simpler and works better with Next.js.',
  ],

  interviewQuestions: [
    {
      question: 'How does state management differ between a React SPA and a Next.js application?',
      answer:
        'In a React SPA, most state lives in JS memory: product data in Redux, user info in useState, filters in component state. In Next.js, the mental model shifts: server data (products, user profiles, posts) should live in Server Components fetched from the database — not in client state at all. This eliminates the need for Redux/React Query for most data. Client state should be limited to: UI state (modal open/close, tab selection — useState), URL-driven state (filters, pagination — searchParams), and global UI state that crosses component trees (shopping cart, theme — Zustand). This makes apps simpler, faster, and easier to reason about.',
      difficulty: 'intermediate',
    },
    {
      question: 'When would you use Zustand vs Context API?',
      answer:
        'Context API is good for state that changes infrequently and has simple logic: theme, locale, current user. Every Context consumer re-renders when context value changes, so it is not suitable for frequently-updating state. Zustand uses subscriptions — components only re-render when the specific state they subscribe to changes. Use Zustand for: frequently-changing state (shopping cart, notifications), complex state with multiple actions, state that benefits from persist middleware (save to localStorage), state accessed by many disconnected components. Rule of thumb: if you would have written multiple useState hooks and a useReducer to manage it, Zustand is probably the right choice.',
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'state-ex-1',
      title: 'Implement URL-driven filters for a product listing',
      description: `Build a product listing page where:
1. Category filter updates the URL (?category=electronics)
2. Sort order updates the URL (?sort=price)
3. The page is a Server Component that reads searchParams
4. The filter controls are a Client Component that updates the URL
5. Changing filters resets to page 1`,
      starterCode: `// Mock data
const PRODUCTS = [
  { id: '1', name: 'iPhone 15', price: 999, category: 'electronics' },
  { id: '2', name: 'MacBook Pro', price: 1999, category: 'electronics' },
  { id: '3', name: 'Blue Shirt', price: 29, category: 'clothing' },
  { id: '4', name: 'Red Jacket', price: 79, category: 'clothing' },
];

// TODO: Build
// 1. app/shop/page.tsx — Server Component with searchParams
// 2. components/ShopFilters.tsx — Client Component with useRouter`,
      solution: `// app/shop/page.tsx — Server Component
import { ShopFilters } from '@/components/ShopFilters';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string };
}) {
  const category = searchParams.category ?? 'all';
  const sort = searchParams.sort ?? 'default';

  // Filter
  let products = PRODUCTS.filter(p =>
    category === 'all' ? true : p.category === category
  );

  // Sort
  if (sort === 'price_asc') products = [...products].sort((a, b) => a.price - b.price);
  if (sort === 'price_desc') products = [...products].sort((a, b) => b.price - a.price);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Shop</h1>
      <ShopFilters category={category} sort={sort} />
      <div className="grid grid-cols-3 gap-4 mt-6">
        {products.map(p => (
          <div key={p.id} className="border rounded p-4">
            <h2 className="font-semibold">{p.name}</h2>
            <p className="text-gray-500">\${p.price}</p>
          </div>
        ))}
        {products.length === 0 && (
          <p className="col-span-3 text-gray-500 text-center py-8">No products found.</p>
        )}
      </div>
    </div>
  );
}

// components/ShopFilters.tsx — Client Component
"use client";
import { useRouter, useSearchParams } from 'next/navigation';

export function ShopFilters({
  category,
  sort,
}: {
  category: string;
  sort: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || value === 'default') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete('page'); // Reset pagination
    router.push(\`?\${params.toString()}\`);
  }

  return (
    <div className="flex gap-4">
      <select
        value={category}
        onChange={e => update('category', e.target.value)}
        className="border rounded px-3 py-2"
      >
        <option value="all">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      <select
        value={sort}
        onChange={e => update('sort', e.target.value)}
        className="border rounded px-3 py-2"
      >
        <option value="default">Default Sort</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  );
}`,
      hints: [
        'Server Component reads searchParams to filter — this makes the page dynamically rendered',
        'Client Component uses useRouter().push() to update URL',
        'Deleting the param (not setting to empty) keeps URLs clean',
        'Resetting page on filter change prevents empty pages',
      ],
    },
  ],

  keyTakeaways: [
    'Shift the mental model: server data belongs in Server Components, not client state.',
    'URL searchParams is the most underused pattern — use it for filters, pagination, search, and active tabs.',
    'Local useState for ephemeral UI state (modals, dropdowns, tabs).',
    'Context for infrequently-changing shared state (theme, locale).',
    'Zustand for complex, frequently-changing global state (cart, notifications) with optional persistence.',
    'TanStack Query for client-side data fetching with caching, mutations, and background refresh.',
    'Every piece of state has a natural home — choosing wrong adds complexity without benefit.',
    'Avoid Redux in new Next.js apps — Zustand + URL state + Server Components cover most needs.',
  ],
};
