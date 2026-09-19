import type { Lesson } from '@/types';

export const interviewPrepLesson: Lesson = {
  id: 'interview-prep',
  slug: 'interview-prep',
  title: 'React Interview Preparation',
  description:
    'Comprehensive React interview preparation — beginner to advanced questions, hooks deep-dives, state management, performance, architecture, and scenario-based system design questions.',
  category: 'Interview',
  order: 26,
  difficulty: 'advanced',
  estimatedTime: 45,
  content: `React interviews test three levels: conceptual understanding, practical patterns, and system-level thinking. This module covers all three.

---

## Beginner Level Questions

### Q: What is the Virtual DOM and how does React use it?

The Virtual DOM is an in-memory representation of the real DOM. When state changes:
1. React creates a new Virtual DOM tree
2. Compares it to the previous Virtual DOM (diffing)
3. Calculates the minimal set of changes needed
4. Applies only those changes to the real DOM (reconciliation)

This is efficient because real DOM operations are expensive. Batching and minimizing them improves performance.

### Q: What is JSX?

JSX is syntactic sugar that gets compiled to \`React.createElement()\` calls. It is not HTML — it is JavaScript that looks like HTML. Under the hood, \`<Button color="blue">Click me</Button>\` becomes \`React.createElement(Button, { color: "blue" }, "Click me")\`.

### Q: What is the difference between state and props?

**Props** — passed from parent to child, read-only, define the interface of a component.
**State** — managed inside a component, mutable via setState/useState, causes re-renders when changed.

Rule: if data can be derived from props or other state, don't make it state. If data doesn't cause a re-render when changed, don't make it state (use a ref).

### Q: What are controlled vs uncontrolled components?

**Controlled** — React controls the form element's value. The input's value comes from state and every keystroke updates state via onChange. React is the single source of truth.

**Uncontrolled** — The DOM manages its own state. You read the value with a ref when you need it. Simpler but less React-idiomatic.

---

## Intermediate Level Questions

### Q: Explain the Rules of Hooks

1. **Only call hooks at the top level** — not inside if/else, loops, or nested functions. This ensures hook call order is the same on every render (React identifies hooks by order, not name).
2. **Only call hooks from React functions** — functional components or other custom hooks.

### Q: What is a closure stale closure issue in useEffect?

\`\`\`tsx
// BUG: stale closure
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1); // count is captured from the first render
      // Always sets to 0 + 1 = 1
    }, 1000);
    return () => clearInterval(interval);
  }, []); // Empty deps — count never updates
}

// FIX: functional update — no closure needed
useEffect(() => {
  const interval = setInterval(() => {
    setCount(prev => prev + 1); // prev is always the current value
  }, 1000);
  return () => clearInterval(interval);
}, []);
\`\`\`

### Q: What does the dependency array in useEffect do?

- **No array** — runs after every render
- **Empty array []** — runs once, after mount
- **[dep1, dep2]** — runs when any of the listed dependencies change

React compares each dependency using Object.is() (same as ===). For objects and functions, this means a new reference on each render triggers the effect — a common source of infinite loops.

### Q: When would you use useCallback vs useMemo?

**useMemo** — memoize a **value** (computed result). Use when: expensive computation, or you need reference stability for an object passed to React.memo child.

**useCallback** — memoize a **function** reference. Use when: the function is a dependency of useEffect and changes it would loop, or the function is passed as a prop to a React.memo child.

Both have the same use case: **preventing unnecessary work by stabilizing references**.

### Q: What is the difference between useEffect and useLayoutEffect?

**useEffect** — runs asynchronously after the browser has painted. Good for: data fetching, subscriptions, timers.
**useLayoutEffect** — runs synchronously before the browser paints, after DOM mutation. Good for: DOM measurements (getBoundingClientRect), animations where you need to prevent flash of unstyled content.

Always start with useEffect. Use useLayoutEffect only when you see visual glitches.

---

## Advanced Level Questions

### Q: How does React reconciliation work?

React's reconciler (Fiber) does two phases:

1. **Render phase** — traverses the component tree, computes what changed (side-effect free, can be paused/resumed)
2. **Commit phase** — applies changes to the real DOM (synchronous, cannot be interrupted)

During diffing, React uses two rules for optimization:
- Elements of different types produce completely different trees (no reuse)
- Elements at the same position with the same key are updated in-place

The \`key\` prop is how React identifies elements across renders. Without keys, React uses position — rearranging a list confuses it. With keys, it can correctly match previous and new elements.

### Q: Explain the Context API performance problem

Every component that calls \`useContext(MyContext)\` re-renders when the context value changes — even if the part of the value it uses did not change.

\`\`\`tsx
// Problem: both AuthStatus and UserMenu re-render when anything in context changes
const AuthContext = createContext({ user, theme, settings });

// Fix: split into separate contexts
const UserContext = createContext({ user });
const ThemeContext = createContext({ theme });
const SettingsContext = createContext({ settings });

// AuthStatus only re-renders when user changes
// ThemeToggle only re-renders when theme changes
\`\`\`

Also: memoize the context value with useMemo so a new object is not created on every render.

### Q: How does React batching work?

In React 18+, all state updates are automatically batched — multiple \`setState\` calls in a single event handler, setTimeout, async function, or fetch callback are combined into one re-render.

Before React 18, batching only happened inside React event handlers. Async code would trigger multiple re-renders.

\`\`\`tsx
// React 18: All three updates batch into ONE re-render
function handleClick() {
  setA(1); // No re-render yet
  setB(2); // No re-render yet
  setC(3); // ONE re-render here
}

// React 18: Even in setTimeout — batched
setTimeout(() => {
  setA(1); // No re-render yet
  setB(2); // ONE re-render here
}, 1000);
\`\`\`

Use \`flushSync\` when you need to force a synchronous update.

### Q: What is React Fiber?

Fiber is React's reconciliation engine (introduced in React 16). Before Fiber, reconciliation was synchronous and recursive — it could not be interrupted. Long trees would block the main thread, causing jank.

Fiber represents each component as a "fiber node" (a unit of work). This allows React to:
- **Pause and resume** work (for concurrent features)
- **Prioritize** updates (user interactions > data updates)
- **Abort** work that is no longer needed

This enables Concurrent Mode features: Suspense, startTransition, useDeferredValue.

### Q: What is the difference between client state and server state?

**Client state** — UI state that lives in the browser: open/closed modals, form inputs, active tab, theme.

**Server state** — data from the server that you cache locally: user lists, post data, settings. It has unique challenges: it can go stale, needs refetching, can be modified by other clients.

**Wrong approach:** put everything in Redux/Context.
**Right approach:** Use TanStack Query or SWR for server state (caching, refetching, invalidation), and use useState/Zustand only for actual client state.

---

## Scenario-Based Questions

### Q: How would you optimize a React app that is rendering slowly?

1. **Measure first** — use React DevTools Profiler to find the slow components
2. **Check re-renders** — use \`why-did-you-render\` library to find unnecessary renders
3. **Memoize expensive components** — wrap with React.memo
4. **Stabilize props** — use useCallback for functions, useMemo for objects passed to memoized children
5. **Lazy load** — code split with React.lazy + Suspense
6. **Virtualize long lists** — @tanstack/react-virtual for 100+ item lists
7. **Move state down** — state that only affects a subtree should live in that subtree

Never add React.memo, useMemo, useCallback blindly. Measure, find the bottleneck, optimize that.

### Q: How would you handle global state in a large React app?

Split by state type:
- **Server state** (API data): TanStack Query — handles caching, loading, errors, refetching
- **Global UI state** (theme, user preferences, auth): Zustand — simple and performant
- **Form state**: React Hook Form — local to the form
- **URL state** (filters, search, tabs): useSearchParams — shareable and bookmarkable
- **Component state** (open/closed, hover): useState — local to the component

The question is never "which state management library" — it is "where does this state belong."

### Q: How would you implement authentication in a React app?

1. **Auth provider** — wraps app, provides user/isAuthenticated/login/logout via context
2. **Protected routes** — RequireAuth wrapper that redirects to /login if not authenticated
3. **Token storage** — httpOnly cookie (secure, not accessible to JS) preferred over localStorage
4. **Request interceptor** — axios interceptor automatically adds auth header to all requests
5. **Token refresh** — interceptor catches 401 responses, refreshes token, retries the request
6. **Logout** — clear token, invalidate TanStack Query cache, redirect to login

---

## Quick-Fire Questions

\`\`\`
Q: What triggers a re-render?
A: State change, context change, parent re-render (unless React.memo), forceUpdate

Q: What is key prop for?
A: Identifies elements across renders for stable reconciliation. Use stable unique IDs, not array index.

Q: Can you use hooks in class components?
A: No. Hooks are for functional components only.

Q: What is the difference between React.memo and useMemo?
A: React.memo memoizes a component (skips re-render if props unchanged).
   useMemo memoizes a value inside a component.

Q: What is the purpose of children prop?
A: Allows parent to pass JSX into a component without the component knowing what it contains.
   Enables the composition pattern.

Q: What is the difference between null and undefined as a return value?
A: Both render nothing. By convention, return null explicitly from render functions (not undefined).

Q: What is a side effect?
A: Any interaction with the world outside of rendering: data fetching, subscriptions, timers,
   direct DOM manipulation, localStorage access. Managed with useEffect.
\`\`\``,

  codeExamples: [
    {
      title: 'Common interview trap: state batching + closures',
      code: `// Interviewer question: What does this log?
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    console.log(count); // What does this log?
  }

  // Answer: count logs 0 on first click.
  // All three setCount calls use the same 'count' (0 from this render's closure).
  // React batches them — final state is 1, not 3.

  // To increment 3 times:
  function handleClickFixed() {
    setCount(prev => prev + 1); // prev = 0 → 1
    setCount(prev => prev + 1); // prev = 1 → 2
    setCount(prev => prev + 1); // prev = 2 → 3
    // React batches → one re-render, final count = 3
  }
}

// Another trap: async state
function handleAsync() {
  setCount(count + 1); // Still uses the old count from this render
  setTimeout(() => {
    console.log(count); // Logs old count — closure captures render's count
  }, 1000);
}`,
      explanation:
        'This tests understanding of state snapshots (state is a snapshot per render), closures (event handlers capture the render\'s state), and functional updates (using prev avoids stale closure issues).',
    },
  ],

  commonMistakes: [
    'Saying Virtual DOM is "faster than the real DOM" — Virtual DOM itself is overhead; it is faster because React batches DOM updates.',
    'Saying useEffect runs after every render — it depends on the dependency array.',
    'Saying React.memo prevents all re-renders — it only skips if props are shallowly equal. New function/object references still trigger re-renders.',
    'Confusing controlled and uncontrolled — controlled = state controls value; uncontrolled = DOM controls value.',
    'Saying Context is a state management solution — Context is a dependency injection mechanism. It does not manage state; useState does.',
  ],

  interviewQuestions: [
    {
      question: 'What is the difference between React.memo, useMemo, and useCallback?',
      answer:
        'React.memo is a higher-order component that memoizes a component — it skips re-rendering if props are shallowly equal. useMemo memoizes a computed value inside a component — returns the cached value on re-renders until dependencies change. useCallback memoizes a function reference — returns the same function instance until dependencies change. All three serve the same goal: avoid unnecessary computation by stabilizing references. React.memo is for components; useMemo is for values; useCallback is for functions.',
      difficulty: 'advanced',
    },
    {
      question: 'Explain reconciliation in React',
      answer:
        'Reconciliation is how React updates the DOM efficiently. When state/props change, React creates a new virtual DOM tree and diffs it against the previous one. Rules: (1) Different element types produce a new tree — React unmounts and remounts. (2) Same element type at the same position — React updates props in-place (efficient). (3) Lists: React uses the key prop to match old and new elements. Without keys, React uses position — rearranging items causes wrong matches and buggy behavior.',
      difficulty: 'advanced',
    },
  ],

  exercises: [
    {
      id: 'interview-ex-1',
      title: 'Debug the Stale Closure',
      description: 'This component has a stale closure bug. Identify it and fix it without removing the empty dependency array.',
      starterCode: `function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSeconds(seconds + 1); // BUG: stale closure
    }, 1000);
    return () => clearInterval(interval);
  }, [running]); // Don't add 'seconds' to deps — it would restart the interval every second

  return (
    <div>
      <p>{seconds}s</p>
      <button onClick={() => setRunning(r => !r)}>
        {running ? 'Stop' : 'Start'}
      </button>
      <button onClick={() => { setRunning(false); setSeconds(0); }}>Reset</button>
    </div>
  );
}`,
      solution: `function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1); // FIX: functional update — no closure needed
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  return (
    <div>
      <p>{seconds}s</p>
      <button onClick={() => setRunning(r => !r)}>
        {running ? 'Stop' : 'Start'}
      </button>
      <button onClick={() => { setRunning(false); setSeconds(0); }}>Reset</button>
    </div>
  );
}`,
      hints: [
        'The bug: setSeconds(seconds + 1) captures the seconds from the render where the effect ran',
        'Since running is in deps (not seconds), seconds is always the value when running changed to true',
        'Fix: use the functional update form setSeconds(prev => prev + 1) — prev is always current',
        'Functional updates are immune to stale closures because they receive the latest value as an argument',
      ],
    },
  ],

  keyTakeaways: [
    'Know the three levels: conceptual (what/why), practical (how to use), and system (architecture decisions).',
    'State batching: multiple setState calls in one event = one re-render. Use functional updates to avoid stale closures.',
    'Context performance: any context change re-renders all consumers. Split contexts and memoize values.',
    'Client vs server state: TanStack Query for server data, Zustand/useState for UI state.',
    'Fiber enables concurrent mode: React can pause/resume/prioritize work.',
    'Never add optimization blindly — measure with the Profiler first.',
  ],

  nextLesson: 'practice',
  prevLesson: 'react-typescript',
};
