import type { Lesson } from '@/types';

export const stateManagementLesson: Lesson = {
  id: 'state-management',
  slug: 'state-management',
  title: 'State Management',
  description:
    'Compare every state management approach — local state, Context, Zustand, Redux, TanStack Query — and learn when to use each, when not to, and how they differ.',
  category: 'State Management',
  order: 18,
  difficulty: 'advanced',
  estimatedTime: 40,
  content: `State management is one of the most debated topics in React. Different projects need different tools. This module gives you the complete picture — what each tool does, why it exists, and when to reach for it.

---

## The State Categories

Before choosing a tool, understand the different kinds of state in a React app:

| State Type | Definition | Example |
|-----------|-----------|---------|
| **Local UI state** | State owned by one component | modal open/closed, input value |
| **Shared client state** | State multiple components need | user preferences, cart |
| **Server state** | Data fetched from an API | user profile, product list |
| **URL state** | State in the URL | current page, filters, tab |
| **Form state** | Form input values and validation | registration form |

**Each category has the right tool.** Mixing them causes problems.

---

## Option 1: Local State (useState)

**When:** State used by one component only.

\`\`\`tsx
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
\`\`\`

**Use when:**
- Only one component needs this state
- State does not outlive the component
- No need to share across routes

**Do not use when:**
- Multiple components need the same state (lift it up or use a store)

---

## Option 2: Context API

**When:** Global data shared widely but updated infrequently.

\`\`\`tsx
const AuthContext = createContext(null);
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}
\`\`\`

**Use when:**
- Auth, theme, locale, feature flags
- Data is truly global and changes rarely
- You want zero dependencies

**Do not use when:**
- State changes frequently (causes mass re-renders)
- Complex state with many derived values
- You need DevTools, time-travel debugging, or selectors

---

## Option 3: Zustand

**When:** Client state that needs to be shared across the app without the overhead of Redux.

\`\`\`tsx
import { create } from 'zustand';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItems: () => number;
}

const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item) => set(state => ({
    items: state.items.some(i => i.id === item.id)
      ? state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      : [...state.items, { ...item, quantity: 1 }],
  })),

  removeItem: (id) => set(state => ({
    items: state.items.filter(i => i.id !== id),
  })),

  clearCart: () => set({ items: [] }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));

// Usage anywhere — no provider needed!
function CartBadge() {
  const totalItems = useCartStore(state => state.totalItems());
  return <span>{totalItems}</span>;
}

function ProductCard({ product }) {
  const addItem = useCartStore(state => state.addItem);
  return <button onClick={() => addItem(product)}>Add to Cart</button>;
}
\`\`\`

**Why Zustand is excellent:**
- No providers needed — works anywhere
- Selector-based subscriptions — \`useCartStore(state => state.items)\` only re-renders when items changes
- Tiny bundle (~1KB)
- Works with React's Concurrent Mode
- Easy to test
- No boilerplate

**Use when:**
- Shared client state with multiple consumers
- State that needs to persist across route changes
- Replacing Context for performance-sensitive state

**Do not use when:**
- You need Redux DevTools time-travel (use Redux)
- You are managing server state (use TanStack Query)

---

## Option 4: Redux (with Redux Toolkit)

**When:** Very large enterprise apps with complex state and team-wide patterns.

\`\`\`tsx
// Redux Toolkit (modern Redux)
import { createSlice, configureStore } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] as CartItem[] },
  reducers: {
    addItem(state, action) {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.quantity += 1; // Immer allows mutations
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeItem(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
  },
});

const store = configureStore({ reducer: { cart: cartSlice.reducer } });

// Usage
const dispatch = useDispatch();
const items = useSelector(state => state.cart.items);

dispatch(cartSlice.actions.addItem(product));
\`\`\`

**Use when:**
- Large team with many developers — enforced patterns
- You need Redux DevTools, time-travel debugging, action replay
- Complex state with many interdependencies
- Already using Redux in the codebase

**Do not use when:**
- Small to medium apps — overkill, too much boilerplate
- Starting fresh — Zustand is simpler with equal capability

**Redux vs Zustand:**

| | Zustand | Redux Toolkit |
|---|---|---|
| Boilerplate | Minimal | Medium |
| DevTools | Basic | Full time-travel |
| Bundle | ~1KB | ~14KB |
| Learning curve | Low | Medium |
| Async actions | Simple | Requires thunks/sagas |
| Team conventions | Flexible | Enforced |

---

## Option 5: TanStack Query (React Query)

**When:** Managing server state — data fetched from APIs.

\`\`\`tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetching data
function UserProfile({ userId }) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => usersApi.getById(userId),
    staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error />;
  return <UserCard user={user} />;
}

// Mutations with automatic cache invalidation
function UpdateUserButton({ userId }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updates) => usersApi.update(userId, updates),
    onSuccess: () => {
      // Invalidate cache — forces refetch of user profile
      queryClient.invalidateQueries({ queryKey: ['users', userId] });
    },
  });

  return (
    <button onClick={() => mutation.mutate({ name: 'New Name' })}>
      Update Name
    </button>
  );
}
\`\`\`

**What TanStack Query gives you for free:**
- Caching — same query key = shared cache entry, no duplicate requests
- Background refetching — stale data refreshed when window refocuses
- Loading/error states per query
- Automatic retry with backoff
- Request deduplication
- Pagination and infinite scroll helpers
- Optimistic updates with rollback
- Cache synchronization after mutations

**Use when:**
- ANY server data fetching
- You want automatic caching and background sync
- Multiple components use the same API data

**Do not use when:**
- Client-only state (UI state, user preferences) — use Zustand

---

## The Right Tool for Each Problem

\`\`\`
Component toggle open/closed?        → useState (local)
Active tab in a navigation?          → useState (local)
Form input values?                   → useState (local) or react-hook-form
Auth user, theme, locale?            → Context
Shopping cart, user preferences?     → Zustand
Large app complex client state?      → Zustand or Redux Toolkit
All API/server data?                 → TanStack Query
Current page, filters, search query? → URL params (useSearchParams)
\`\`\`

---

## Combining Tools

In a real production app, you use multiple tools together:

\`\`\`tsx
// They handle different concerns — they do not compete
function App() {
  return (
    <QueryClientProvider client={queryClient}>  {/* TanStack Query for server state */}
      <AuthProvider>                             {/* Context for auth */}
        <ThemeProvider>                          {/* Context for theme */}
          <Router>
            <Routes />
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// Zustand store handles client state (no provider needed)
const useUIStore = create(...)    // sidebar, modals, preferences
const useCartStore = create(...)  // shopping cart

// TanStack Query handles all server data
const { data: products } = useQuery(['products'], fetchProducts);
const { data: user } = useQuery(['user', userId], fetchUser);
\`\`\`

---

## Server State vs Client State

This is the most important distinction in modern React state management:

**Client state:** Lives only in the browser. You own it completely. The "source of truth" is your app.
Examples: modal open, selected tab, cart items, user preferences.

**Server state:** Lives on the server. Your app has a cached copy. The server is the source of truth.
Examples: user profile, product list, order history, comments.

Do not manage server state manually with useState + useEffect. TanStack Query was built specifically for server state and handles all the edge cases (stale-while-revalidate, cache invalidation, optimistic updates) that manual approaches miss.`,

  codeExamples: [
    {
      title: 'Zustand with persistence and devtools',
      code: `import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

interface UserPreferencesStore {
  theme: 'dark' | 'light';
  language: string;
  sidebarCollapsed: boolean;
  setTheme: (theme: 'dark' | 'light') => void;
  setLanguage: (lang: string) => void;
  toggleSidebar: () => void;
}

const usePreferencesStore = create<UserPreferencesStore>()(
  devtools(      // Adds Redux DevTools support
    persist(     // Persists state to localStorage
      (set) => ({
        theme: 'dark',
        language: 'en',
        sidebarCollapsed: false,

        setTheme: (theme) => set({ theme }, false, 'setTheme'),
        setLanguage: (language) => set({ language }, false, 'setLanguage'),
        toggleSidebar: () =>
          set(state => ({ sidebarCollapsed: !state.sidebarCollapsed }), false, 'toggleSidebar'),
      }),
      { name: 'user-preferences' }  // localStorage key
    )
  )
);

// Usage anywhere — persists across page reloads
function ThemeToggle() {
  const { theme, setTheme } = usePreferencesStore();
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}`,
      explanation:
        'Zustand middleware composes cleanly. persist wraps the store creation to sync with localStorage. devtools adds Redux DevTools integration. Both are optional — add them only when needed.',
    },
  ],

  commonMistakes: [
    'Using Context for frequently changing state — causes mass re-renders across the app.',
    'Using Zustand or Redux for server state — managing loading/error/caching manually is what TanStack Query solves.',
    'Using global state for local UI state — modal open/closed, input values do not belong in a global store.',
    'Starting with Redux in new projects — modern alternatives (Zustand + TanStack Query) are simpler with equal or greater capability.',
    'Mixing server state and client state in the same store — they have different lifecycles and needs.',
  ],

  interviewQuestions: [
    {
      question: 'How do you decide between useState, Context, Zustand, and Redux?',
      answer:
        'The decision tree: useState for state used by one component; Context for widely shared data that rarely changes (auth, theme); Zustand for shared client state with frequent updates across many components; Redux for large enterprise apps needing strict patterns and time-travel debugging. For server state (API data), none of these — use TanStack Query, which handles caching, background sync, and stale data automatically.',
      difficulty: 'advanced',
    },
    {
      question: 'What is the difference between server state and client state?',
      answer:
        'Client state lives only in the browser — your app is the source of truth (modal open/closed, cart items, preferences). Server state is a cached copy of data that lives on the server — the server is the source of truth (user profiles, products, orders). Server state introduces problems client state does not have: staleness, cache invalidation, background syncing, concurrent requests. TanStack Query is designed specifically to manage server state; using useState + useEffect for it is error-prone.',
      difficulty: 'advanced',
    },
    {
      question: 'What problem does Zustand solve that Context does not?',
      answer:
        'Context re-renders all consumers when any part of the context value changes. Zustand uses selector subscriptions — a component subscribes to only the slice of state it needs: useStore(state => state.count). Only re-renders when count changes, even if other parts of the store update. This makes Zustand suitable for frequently changing state where Context would cause performance problems.',
      difficulty: 'advanced',
    },
  ],

  exercises: [
    {
      id: 'state-mgmt-ex-1',
      title: 'Migrate from Context to Zustand',
      description: 'This app uses Context for a shopping cart with performance issues. Migrate it to Zustand with selectors so components only re-render when their relevant data changes.',
      starterCode: `// Current: Context-based cart (causes all consumers to re-render on any cart change)
const CartContext = createContext(null);

function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const addItem = (item) => setItems(prev => [...prev, item]);
  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));

  return (
    <CartContext.Provider value={{ items, addItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

// TODO: Migrate to Zustand
// CartBadge should only re-render when item COUNT changes
// CartPage should only re-render when items array changes
// ProductCard should only get the addItem function (stable reference)`,
      solution: `import { create } from 'zustand';

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
}

const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (item) => set(state => ({
    items: state.items.some(i => i.id === item.id)
      ? state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      : [...state.items, { ...item, quantity: 1 }],
  })),
  removeItem: (id) => set(state => ({
    items: state.items.filter(i => i.id !== id),
  })),
}));

// Selector: only re-renders when item count changes
function CartBadge() {
  const count = useCartStore(state => state.items.reduce((s, i) => s + i.quantity, 0));
  return <span>{count}</span>;
}

// Selector: re-renders when items array changes
function CartPage() {
  const items = useCartStore(state => state.items);
  const removeItem = useCartStore(state => state.removeItem);
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.name} × {item.quantity}
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
}

// Selector: only re-renders if addItem reference changes (never does)
function ProductCard({ product }) {
  const addItem = useCartStore(state => state.addItem);
  return <button onClick={() => addItem(product)}>Add to Cart</button>;
}

// No providers needed — Zustand works anywhere in the tree`,
      hints: [
        'Import { create } from "zustand"',
        'Pass a selector function to the hook: useCartStore(state => state.items)',
        'No provider is needed — just the hook',
        'The addItem function is stable (Zustand guarantees this) — ProductCard never re-renders',
      ],
    },
  ],

  keyTakeaways: [
    'State has categories: local UI, shared client, server, URL, form. Each needs different tooling.',
    'useState: local; Context: global but infrequently changed; Zustand: shared client state; TanStack Query: server state.',
    'Zustand uses selectors — components subscribe to slices of state, re-rendering only when that slice changes.',
    'TanStack Query is the correct tool for server state — it handles caching, stale data, retry, and background sync.',
    'In real apps you combine tools: TanStack Query + Zustand + Context for auth/theme.',
    'Do not use global state for local UI state. Do not use Context for frequently updated state.',
  ],

  nextLesson: 'component-patterns',
  prevLesson: 'context-api',
};
