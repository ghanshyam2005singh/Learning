import type { Lesson } from '@/types';

export const revisionHubLesson: Lesson = {
  id: 'revision-hub',
  slug: 'revision-hub',
  title: 'Revision Hub',
  description:
    'Complete React cheat sheets — JSX rules, hooks reference, state management decision guide, performance checklist, component patterns, and interview answer templates. Your quick-reference before any React interview.',
  category: 'Revision',
  order: 30,
  difficulty: 'intermediate',
  estimatedTime: 30,
  content: `This is your quick-reference for the entire React track. Use it to revise before interviews, before starting a new project, or when you want to check if you have missed anything.

---

## Core Concepts at a Glance

\`\`\`
React = Component tree + State → UI

Key ideas:
- Declarative: describe what the UI should look like, React handles updates
- Component-based: UI is a tree of composable functions
- Unidirectional data flow: data flows down (props), events flow up (callbacks)
- State causes re-renders: change state → React re-renders → UI updates
\`\`\`

---

## JSX Rules Quick Reference

\`\`\`tsx
// 1. Single root element (or fragment)
return <><div>A</div><div>B</div></>;

// 2. All tags must close
<img src="..." alt="..." />  // self-closing
<input />                     // self-closing

// 3. HTML attributes are camelCase
className  htmlFor  onClick  onChange  tabIndex  aria-label (hyphenated ARIA is fine)

// 4. Expressions in {}
{count}  {condition && <p>Shown</p>}  {condition ? <A /> : <B />}

// 5. Lists need unique, stable keys
{items.map(item => <li key={item.id}>{item.name}</li>)}

// 6. Comments in JSX
{/* This is a comment */}
\`\`\`

---

## Hooks Quick Reference

\`\`\`tsx
// useState
const [value, setValue] = useState(initial);
setValue(newValue);                        // Direct update
setValue(prev => prev + 1);               // Functional update (use this for derived values)

// useEffect
useEffect(() => {                         // Runs on mount and when deps change
  // side effect
  return () => { /* cleanup */ };         // Runs before next effect and on unmount
}, [dep1, dep2]);

useEffect(() => { /* ... */ }, []);       // Runs once on mount only
useEffect(() => { /* ... */ });           // Runs after every render (usually wrong)

// useRef
const domRef = useRef<HTMLInputElement>(null);   // DOM ref — null until mounted
const valueRef = useRef<number>(0);              // Mutable value — no re-render

// useMemo
const result = useMemo(() => expensiveCalc(a, b), [a, b]);  // Memoize a value

// useCallback
const handler = useCallback(() => doSomething(id), [id]);   // Memoize a function

// useContext
const value = useContext(MyContext);       // Subscribe to context

// useReducer
const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: 'INCREMENT', payload: 5 });
\`\`\`

---

## Rules of Hooks — The Two Rules

\`\`\`
1. Only call hooks at the top level
   ❌ if (condition) { useState(...) }
   ❌ for (item of items) { useState(...) }
   ✅ const [x, setX] = useState(...)  ← top level, always runs

2. Only call hooks from React functions
   ✅ Functional components
   ✅ Custom hooks
   ❌ Regular JavaScript functions
   ❌ Class components
\`\`\`

---

## State Management Decision Matrix

\`\`\`
Question: Where should this state live?

Is it async data from an API? → TanStack Query
Is it shared across many components? → Zustand (or Context for simple cases)
Is it specific to one component? → useState
Is it form data? → React Hook Form
Should it be in the URL? → useSearchParams
Does it need to persist across sessions? → localStorage + useState

Common mistake: putting server data in Zustand/Redux.
Server data (users, posts, products) belongs in TanStack Query.
UI state (modal open, selected tab, theme) belongs in Zustand/useState.
\`\`\`

---

## useEffect Patterns

\`\`\`tsx
// Pattern 1: Fetch on mount
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal }).then(r => r.json()).then(setData);
  return () => controller.abort();
}, []);

// Pattern 2: Fetch when ID changes
useEffect(() => {
  fetchUser(userId).then(setUser);
}, [userId]);

// Pattern 3: Event listener
useEffect(() => {
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);

// Pattern 4: Timer
useEffect(() => {
  const timer = setInterval(tick, 1000);
  return () => clearInterval(timer);
}, []);

// Pattern 5: WebSocket
useEffect(() => {
  const ws = new WebSocket(url);
  ws.onmessage = handleMessage;
  return () => ws.close();
}, [url]);
\`\`\`

---

## Performance Optimization Checklist

\`\`\`
Before optimizing: measure with React DevTools Profiler

1. React.memo — wrap component to skip re-render when props unchanged
   - Only useful when parent re-renders often
   - Only works if props are primitives OR stably referenced objects/functions

2. useMemo — memoize expensive computations
   - Use for: filtering/sorting large arrays, complex calculations
   - Do NOT use for: simple operations, the cost of the memo itself exceeds savings

3. useCallback — stable function references
   - Use for: functions passed to React.memo children
   - Use for: functions in useEffect dependencies to avoid infinite loops
   - Do NOT use for: every function — it has overhead too

4. Lazy loading — code split with React.lazy + Suspense
   - Apply to routes and heavy page sections

5. List virtualization — @tanstack/react-virtual
   - Apply when rendering 100+ items

6. Move state down — state that only affects a subtree should live there

7. Children trick — pass stable JSX as children to prevent re-renders
\`\`\`

---

## Component Patterns Summary

\`\`\`
Compound Components — Parent manages state, children access via context
  Use for: complex widgets (Tabs, Select, Accordion, Menu)

Render Props — Component receives a function and calls it with data
  Use for: sharing behavior, rendering different UIs for same logic
  Today: often replaced by custom hooks

HOC (Higher-Order Component) — Function takes a component, returns enhanced component
  Use for: cross-cutting concerns (auth, logging)
  Today: mostly replaced by hooks

Controlled + Uncontrolled (Dual Mode) — Accept both value prop and internal state
  Use for: reusable form components that work in both controlled and uncontrolled contexts

Headless Components — Logic and accessibility without any UI
  Use for: maximum customization (dropdown, combobox, date picker)
\`\`\`

---

## React Router v6 Cheat Sheet

\`\`\`tsx
// Setup
<BrowserRouter><App /></BrowserRouter>

// Routes
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/posts/:id" element={<Post />} />
  <Route path="*" element={<NotFound />} />
</Routes>

// Nested routes
<Route path="/" element={<Layout />}>    // Layout has <Outlet />
  <Route index element={<Home />} />
  <Route path="about" element={<About />} />
</Route>

// Hooks
const { id } = useParams();                          // Route params
const navigate = useNavigate();                       // Programmatic navigation
navigate('/path');  navigate(-1);  navigate('/path', { replace: true });
const location = useLocation();                       // Current location
const [params, setParams] = useSearchParams();        // URL search params

// Protected routes
function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
\`\`\`

---

## TypeScript + React Quick Reference

\`\`\`tsx
// Component props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

// Events
(e: React.ChangeEvent<HTMLInputElement>) => void
(e: React.FormEvent<HTMLFormElement>) => void
(e: React.MouseEvent<HTMLButtonElement>) => void
(e: React.KeyboardEvent<HTMLInputElement>) => void

// useRef
const domRef = useRef<HTMLInputElement>(null);       // null for DOM refs
const valRef = useRef<number>(0);                    // initial value for mutable refs

// useState
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<string[]>([]);

// Context with null check
const ctx = useContext(MyContext);
if (!ctx) throw new Error('useMyContext must be within MyProvider');

// Custom hook tuple return
return [value, toggle] as const;    // Typed as [boolean, () => void]
\`\`\`

---

## Common Interview Q&A — One-Liners

\`\`\`
Q: What triggers a re-render?
A: State change, context change, parent re-render (unless React.memo)

Q: What is the Virtual DOM?
A: In-memory copy of the DOM; React diffs it to minimize real DOM operations

Q: What is reconciliation?
A: React's process of diffing old and new virtual DOM trees to compute minimal DOM updates

Q: What are keys for?
A: Stable identity for list items across renders so React can reuse/update/delete correctly

Q: What is Fiber?
A: React's reconciliation engine; enables concurrent features by making rendering interruptible

Q: useState vs useReducer?
A: useState for simple values; useReducer for complex state with multiple sub-values or actions

Q: Context vs Zustand?
A: Context = dependency injection (pass anything deep); Zustand = global state store with subscriptions

Q: useEffect vs useLayoutEffect?
A: useEffect = async after paint (most cases); useLayoutEffect = sync before paint (DOM measurements)

Q: What does React.StrictMode do?
A: Runs effects twice in development to detect side effects; enables additional warnings

Q: What is Concurrent Mode?
A: React can interrupt, pause, and resume rendering; enables Suspense, startTransition, useDeferredValue
\`\`\`

---

## Error Boundary Quick Reference

\`\`\`tsx
// Error Boundaries are class components (no hook equivalent for render errors)
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { logError(error, info); }
  render() { return this.state.hasError ? <Fallback /> : this.props.children; }
}

// What they catch: render errors, constructor errors, lifecycle errors
// What they DON'T catch: event handlers, async code, SSR, errors in the boundary itself

// react-error-boundary library provides:
// <ErrorBoundary FallbackComponent={...} onReset={...} />
// useErrorBoundary() — throw errors from async code into the boundary
\`\`\`

---

## Architecture Decision Guide

\`\`\`
Small app (1 dev, simple UI):
→ useState + useContext + React Router + TanStack Query

Medium app (2-5 devs, multiple features):
→ Feature-based folders + Zustand + TanStack Query + custom hooks per feature

Large app (5+ devs, complex domain):
→ Feature-based with index.ts boundaries + Zustand slices + TanStack Query
→ ESLint import rules to enforce feature boundaries
→ Design system in shared/components/ui/
→ Shared service layer for auth, logging, analytics
\`\`\`

---

## Before Your Interview

Read through this entire page. Then close it and answer:

1. Explain the Virtual DOM and reconciliation in 60 seconds
2. What are the Rules of Hooks and why do they exist?
3. When would you use useMemo vs useCallback?
4. What is the difference between client state and server state?
5. How do you implement protected routes in React Router?
6. What is a stale closure in useEffect and how do you fix it?
7. How does Context cause performance issues and how do you fix them?
8. What is React Fiber?

If you struggle on any of these, revisit that module and come back.`,

  codeExamples: [
    {
      title: 'Everything in one component (spot the patterns)',
      code: `// This component uses: useState, useEffect, useMemo, useCallback,
// custom hook, Context, TypeScript, event handling, conditional rendering

interface Post { id: string; title: string; liked: boolean; }

function PostList() {
  const { user } = useAuth();                       // Context
  const [search, setSearch] = useState('');         // UI state
  const debouncedSearch = useDebounce(search, 300); // Custom hook

  const { data: posts = [], isLoading } = useQuery<Post[]>({  // Server state
    queryKey: ['posts', debouncedSearch],
    queryFn: () => postsApi.search(debouncedSearch),
  });

  const queryClient = useQueryClient();
  const likeMutation = useMutation({
    mutationFn: postsApi.like,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });

  // Derived — no extra state needed
  const filteredPosts = useMemo(
    () => posts.filter(p => p.title.toLowerCase().includes(debouncedSearch.toLowerCase())),
    [posts, debouncedSearch]
  );

  // Stable reference for React.memo child
  const handleLike = useCallback((id: string) => {
    likeMutation.mutate(id);
  }, [likeMutation]);

  if (!user) return <Navigate to="/login" />;       // Route guard
  if (isLoading) return <Spinner />;

  return (
    <div>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}  // Controlled input
        placeholder="Search posts..."
      />
      {filteredPosts.length === 0
        ? <EmptyState />                             // Conditional rendering
        : filteredPosts.map(post => (                // List rendering with keys
          <PostCard key={post.id} post={post} onLike={handleLike} />
        ))
      }
    </div>
  );
}`,
      explanation:
        'Read through this component and identify each pattern: Context (useAuth), server state (useQuery), mutation (useMutation), derived state (useMemo), stable callbacks (useCallback), custom hooks (useDebounce), controlled input (useState + onChange), conditional rendering, list rendering with keys. This is what production React code looks like.',
    },
  ],

  commonMistakes: [
    'Studying React by reading but not building — knowledge becomes skill only through practice.',
    'Memorizing answers instead of understanding concepts — interviewers follow up to test depth.',
    'Ignoring the "why" — knowing when to use something matters as much as knowing how.',
    'Skipping the revision module — most errors in interviews are gaps in fundamentals, not advanced topics.',
  ],

  interviewQuestions: [
    {
      question: 'What is the most important thing to know about React state?',
      answer:
        'State is a snapshot. When you call setState, React schedules a re-render. The new render has a new "snapshot" of state. The current render\'s event handlers always see the state from when that render happened — not the state after future updates. This is why setCount(count + 1) called three times results in count + 1, not count + 3. Functional updates (setState(prev => prev + 1)) bypass this by receiving the latest state as an argument.',
      difficulty: 'advanced',
    },
  ],

  exercises: [
    {
      id: 'revision-ex-1',
      title: 'The Revision Challenge',
      description: 'Without looking at any previous modules, write a component that: fetches a list of posts, allows searching with debounce, shows a loading spinner while fetching, handles errors, and renders the filtered list.',
      starterCode: `// Write from scratch — use the cheat sheets in this module if needed.
// No looking at previous modules' code.

function PostSearch() {
  // 1. State for the search input
  // 2. Debounce the search value (build or use useDebounce)
  // 3. Fetch posts using useQuery with the debounced search
  // 4. Handle loading and error states
  // 5. Render a controlled input
  // 6. Render the list with keys
}`,
      solution: `function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function PostSearch() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['posts', debouncedSearch],
    queryFn: () => fetch(\`/api/posts?q=\${debouncedSearch}\`).then(r => r.json()),
  });

  return (
    <div>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search posts..."
      />
      {isLoading && <Spinner />}
      {isError && <button onClick={() => refetch()}>Retry</button>}
      {data && (
        <ul>
          {data.map((post: { id: string; title: string }) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
      hints: [
        'Start with useState for the search input',
        'Build useDebounce: useState + useEffect with setTimeout + cleanup',
        'useQuery with queryKey including the debounced value',
        'isLoading → show spinner; isError → show retry button; data → show list',
      ],
    },
  ],

  keyTakeaways: [
    'React = Component tree + State → UI. Every concept builds on this foundation.',
    'Hooks are the mechanism for connecting component logic to React\'s rendering cycle.',
    'State is a snapshot per render — use functional updates to work with the latest value.',
    'Performance: measure first, optimize the bottleneck, not everything.',
    'Architecture: feature-based structure + API layer + TanStack Query + Zustand for UI state.',
    'Accessibility and security are not optional — they are part of building real software.',
  ],

  prevLesson: 'real-world-engineering',
};
