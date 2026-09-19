import type { Lesson } from '@/types';

export const contextApiLesson: Lesson = {
  id: 'context-api',
  slug: 'context-api',
  title: 'Context API',
  description:
    'Understand React Context — what it is, why it exists, how to use it properly, its performance limitations, and when to use it vs state management libraries.',
  category: 'State Management',
  order: 17,
  difficulty: 'intermediate',
  estimatedTime: 25,
  content: `React Context lets you share data across the component tree without passing it through every level as props. It is the built-in solution for the prop drilling problem.

---

## What Context Is

Context provides a way to make a value available to **any descendant component** without explicitly passing it through every component in between.

\`\`\`
Without Context (prop drilling):
App (theme) → Layout (theme) → Main (theme) → Sidebar (theme) → Widget (theme) ← finally used

With Context:
App (provides theme) → ... → Widget (consumes theme directly)
\`\`\`

Context creates a "supply chain" for data in your component tree.

---

## Creating and Using Context

Context has three parts: **create**, **provide**, **consume**.

\`\`\`tsx
import { createContext, useContext, useState } from 'react';

// 1. Create context with a default value
interface ThemeContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

// 2. Create a custom hook for consuming (best practice)
function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

// 3. Create a provider component
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 4. Wrap the app (or part of it) with the provider
function App() {
  return (
    <ThemeProvider>
      <Layout />
    </ThemeProvider>
  );
}

// 5. Consume anywhere inside the provider tree
function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'dark' ? 'light' : 'dark'} mode
    </button>
  );
}
\`\`\`

---

## What Belongs in Context

Context is good for **global** or **widely shared** data that does not change frequently:

✅ Good Context candidates:
- Current user / authentication state
- Theme (dark/light)
- Locale / language
- Feature flags
- Cart (basic)

❌ Bad Context candidates:
- High-frequency updates (mouse position, scroll position)
- Large datasets (product lists, post lists)
- Frequently updated derived data
- Server state (use TanStack Query instead)

---

## Context Performance: The Re-render Problem

Every component that calls \`useContext\` re-renders when **any part of the context value changes**.

\`\`\`tsx
// ❌ Problematic: one context with multiple concerns
const AppContext = createContext({
  user: null,        // Changes rarely
  theme: 'dark',     // Changes occasionally
  notifications: [], // Changes often (new notifications constantly)
  cart: [],          // Changes when items added/removed
});

// Any update to notifications causes ALL consumers of AppContext to re-render
// The user profile, theme toggle, and cart badge all re-render on every notification
\`\`\`

### Solution: Split Contexts

\`\`\`tsx
// ✅ Separate contexts by update frequency
const UserContext = createContext<User | null>(null);      // Rarely changes
const ThemeContext = createContext<ThemeState>(defaultTheme); // Occasionally changes
const CartContext = createContext<CartState>(defaultCart);    // Often changes
const NotificationsContext = createContext<NotificationState>(defaultNotifications); // Frequently changes

// A component consuming UserContext does NOT re-render when notifications change
\`\`\`

### Solution: Memoize Context Value

When context value is an object, every re-render of the provider creates a new object reference, causing all consumers to re-render:

\`\`\`tsx
function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // ❌ New object every render
  return (
    <CartContext.Provider value={{ items, setItems }}>
      {children}
    </CartContext.Provider>
  );
}

// ✅ Memoized value — consumers only re-render when items actually changes
function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = useCallback((item) => {
    setItems(prev => [...prev, item]);
  }, []);

  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const value = useMemo(
    () => ({ items, addItem, removeItem }),
    [items, addItem, removeItem]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
\`\`\`

---

## Context Architecture Pattern

For any significant context, follow this pattern:

\`\`\`tsx
// auth-context.tsx

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    getSession()
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const loggedInUser = await authApi.login({ email, password });
    setUser(loggedInUser);
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, logout, isLoading }),
    [user, login, logout, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Usage in any component:
function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <LoginButton />;
  return (
    <nav>
      <span>Hello, {user!.name}</span>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}
\`\`\`

---

## Context Limitations

Context is not a state management solution — it is a **data distribution mechanism**.

Limitations:
1. **No selectors** — any update to context re-renders all consumers (no way to subscribe to just one field)
2. **No derived state** — computing derived values efficiently requires careful memoization
3. **Debugging** — no DevTools support like Redux or Zustand
4. **Testing** — components depending on context need provider wrappers in tests
5. **Not designed for frequent updates** — high-frequency state (real-time data) causes performance issues

For anything beyond basic global state (auth, theme, locale), reach for Zustand or TanStack Query.

---

## Context vs Prop Drilling vs State Management

| Scenario | Solution |
|----------|---------|
| Data needed by 1-2 levels of children | Props (no drilling) |
| UI state shared across siblings | Lift state to common parent |
| Global data rarely changed (theme, auth) | Context |
| Complex client state with frequent updates | Zustand / Redux |
| Server state (API data, caching, refetching) | TanStack Query |`,

  codeExamples: [
    {
      title: 'Multi-context provider composition',
      code: `// Compose multiple providers cleanly
function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <NotificationsProvider>
            {children}
          </NotificationsProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

// Or with a helper to avoid deep nesting:
function composeProviders(...providers: React.ComponentType<{ children: React.ReactNode }>[]) {
  return function ComposedProviders({ children }: { children: React.ReactNode }) {
    return providers.reduceRight(
      (acc, Provider) => <Provider>{acc}</Provider>,
      children as React.ReactElement
    );
  };
}

const AppProviders = composeProviders(
  AuthProvider,
  ThemeProvider,
  CartProvider,
  NotificationsProvider
);

// Usage:
function App() {
  return (
    <AppProviders>
      <Router>
        <AppRoutes />
      </Router>
    </AppProviders>
  );
}`,
      explanation:
        'Each context handles one concern. Components subscribe only to the contexts they need. A CartProvider re-render does not affect components only consuming AuthContext.',
    },
  ],

  commonMistakes: [
    'Putting everything in one context — causes unnecessary re-renders across unrelated components.',
    'Not memoizing the context value — a new object reference on every provider render re-renders all consumers.',
    'Using context for high-frequency updates (scroll position, mouse position) — causes performance issues.',
    'Not creating a custom hook wrapper (useAuth, useTheme) — consumers get confusing null-check errors.',
    'Using context as a replacement for proper state management — context is distribution, not state management.',
  ],

  interviewQuestions: [
    {
      question: 'What is React Context and when should you use it?',
      answer:
        'React Context provides a way to share data across the component tree without prop drilling. Use it for data that needs to be accessible to many components at different nesting levels — typically: authentication state, theme, locale/language, and feature flags. Context is not a state management system — it is a data distribution mechanism. Do not use it for frequently changing data or complex state with derived values — use Zustand or TanStack Query for those.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is the performance issue with React Context and how do you fix it?',
      answer:
        'Every consumer of a context re-renders when any part of the context value changes. Two fixes: (1) Split contexts by concern — separate contexts for different pieces of state so components only subscribe to what they need; (2) Memoize the context value with useMemo and memoize all functions with useCallback — prevents re-renders when the provider re-renders for unrelated reasons.',
      difficulty: 'advanced',
    },
    {
      question: 'What is the difference between Context and prop drilling?',
      answer:
        'Prop drilling passes data through intermediate components that don\'t use the data — they only pass it further down. It creates tight coupling: renaming a prop requires changing every level. Context makes data available to any descendant without explicit passing. However, overusing Context (putting everything in context) creates a different problem: invisible dependencies and performance issues. The right tool: props for 1-2 levels, composition for medium depth, context for truly global data.',
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'context-ex-1',
      title: 'Build a Cart Context',
      description: 'Create a CartContext with addItem, removeItem, and clearCart. Consume it in CartIcon (shows count) and CartPage (shows items).',
      starterCode: `interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// TODO: Create CartContext, CartProvider, useCart
// CartContext should provide: items, totalItems, totalPrice, addItem, removeItem, clearCart

function CartIcon() {
  // TODO: use useCart to show item count
  return <div>Cart</div>;
}

function CartPage() {
  // TODO: use useCart to show items with remove buttons and total price
  return <div>Cart Page</div>;
}`,
      solution: `interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}

function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const totalItems = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, totalItems, totalPrice, addItem, removeItem, clearCart }),
    [items, totalItems, totalPrice, addItem, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function CartIcon() {
  const { totalItems } = useCart();
  return <div>Cart ({totalItems})</div>;
}

function CartPage() {
  const { items, totalPrice, removeItem, clearCart } = useCart();
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          {item.name} × {item.quantity} = \${(item.price * item.quantity).toFixed(2)}
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <p>Total: \${totalPrice.toFixed(2)}</p>
      <button onClick={clearCart}>Clear</button>
    </div>
  );
}`,
      hints: [
        'Create the context with null as default, check for null in the custom hook',
        'Memoize the context value object with useMemo',
        'Memoize all functions with useCallback',
        'Derived values (totalItems, totalPrice) can be computed in the provider with useMemo',
      ],
    },
  ],

  keyTakeaways: [
    'Context shares data across the tree without prop drilling. Good for: auth, theme, locale.',
    'Every context consumer re-renders when context value changes — split contexts by update frequency.',
    'Memoize context values (useMemo) and functions (useCallback) to prevent unnecessary re-renders.',
    'Always wrap context in a custom hook (useAuth, useTheme) — provides null checking and better errors.',
    'Context is a distribution mechanism, not state management. For complex state, use Zustand or Redux.',
    'createContext null default + throw in custom hook = clear error message when used outside provider.',
  ],

  nextLesson: 'state-management',
  prevLesson: 'api-integration',
};
