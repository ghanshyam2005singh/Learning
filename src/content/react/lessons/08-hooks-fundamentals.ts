import type { Lesson } from '@/types';

export const hooksFundamentalsLesson: Lesson = {
  id: 'hooks-fundamentals',
  slug: 'hooks-fundamentals',
  title: 'React Hooks Fundamentals',
  description:
    'Understand why hooks exist, the rules of hooks, how hooks work internally, and the mental model required to use all hooks correctly.',
  category: 'Hooks',
  order: 8,
  difficulty: 'intermediate',
  estimatedTime: 25,
  content: `Hooks are functions that let functional components access React features like state, side effects, context, and more. Understanding hooks deeply — not just their API — is essential for React development.

---

## Why Hooks Were Introduced

Before hooks (pre React 16.8), there was a fundamental problem: **functional components could not have state or lifecycle methods**. Only class components could.

This created several issues:

### Problem 1: Logic coupling in classes
Class components forced unrelated logic into the same lifecycle methods:

\`\`\`jsx
// Class component — unrelated logic forced together
class Dashboard extends React.Component {
  componentDidMount() {
    // Setting up a chat subscription
    this.chatSub = subscribeToChatMessages(this.handleNewMessage);
    // AND fetching user data
    fetchUser(this.props.userId).then(user => this.setState({ user }));
    // AND tracking analytics
    trackPageView('dashboard');
  }

  componentWillUnmount() {
    // Cleanup mixed with different cleanup
    this.chatSub.unsubscribe();
  }
  // ...
}
\`\`\`

All three concerns (chat, data fetching, analytics) are forced into the same methods. Splitting them is impossible without creating separate components.

### Problem 2: Logic was hard to reuse between components
Class components encouraged Higher-Order Components and render props for sharing stateful logic — complex patterns that created "wrapper hell".

### Problem 3: Classes are confusing
\`this\` binding, \`this.setState\`, class fields — all added cognitive overhead.

### The Hook Solution
Hooks let you **extract stateful logic into reusable functions** (custom hooks) and use that logic in any functional component without restructuring your component hierarchy.

---

## What Hooks Are

Hooks are **special functions provided by React** that hook into React's internal features.

\`\`\`
useState     → React's state system
useEffect    → React's lifecycle system
useContext   → React's context system
useRef       → React's ref system
useMemo      → React's memoization system
useCallback  → React's callback memoization
useReducer   → React's reducer-based state
useId        → React's unique ID generator
useTransition → React's Concurrent Mode transitions
\`\`\`

You can also create your own hooks (custom hooks) that combine these primitives.

---

## The Rules of Hooks

React enforces two rules for hooks. Breaking either causes bugs that are hard to debug.

### Rule 1: Only call hooks at the top level

Never call hooks inside:
- Conditionals (\`if\`, \`switch\`)
- Loops (\`for\`, \`while\`, \`.forEach\`)
- Nested functions
- Event handlers (unless those are themselves hooks)
- After an early return

\`\`\`jsx
// ❌ WRONG — hook inside conditional
function UserProfile({ userId }) {
  if (userId) {
    const [user, setUser] = useState(null); // ❌ Conditional hook
  }
  // ...
}

// ❌ WRONG — hook inside loop
function ItemList({ items }) {
  return items.map(item => {
    const [selected, setSelected] = useState(false); // ❌ Hook in loop
    return <Item key={item.id} selected={selected} />;
  });
}

// ✅ CORRECT — hooks always at top level
function UserProfile({ userId }) {
  const [user, setUser] = useState(null); // Always called, every render
  // Handle the conditional in the JSX, not around the hook
  // ...
}
\`\`\`

### Rule 2: Only call hooks from React functions

Hooks can only be called from:
- Functional components
- Custom hooks (functions that start with \`use\`)

Not from:
- Regular JavaScript functions
- Class components
- Event listeners outside React
- setTimeout or setInterval callbacks

---

## Why These Rules Exist

React identifies which hook call belongs to which hook by **position** — the order in which hooks are called. React maintains an internal array of hook values for each component. The first \`useState\` call gets index 0, the second gets index 1, etc.

\`\`\`
Render 1:                    Render 2:
useState('') → index 0       useState('') → index 0  ✅ Same
useState(0) → index 1        useState(0) → index 1   ✅ Same
useEffect() → index 2        useEffect() → index 2   ✅ Same
\`\`\`

If hooks are called conditionally:

\`\`\`
Render 1 (isAdmin = true):   Render 2 (isAdmin = false):
useState('') → index 0       useState('') → index 0  ✅ OK
useState(null) → index 1     useEffect() → index 1   ❌ WRONG! Different hook!
useEffect() → index 2        (hook missing)
\`\`\`

React now reads the wrong state from index 1. The bugs are subtle and difficult to trace. The rules prevent this completely.

---

## Hook Lifecycle

Each hook type has its own relationship with the component lifecycle:

\`\`\`
MOUNT:
  1. Component function runs
  2. useState initializes with the initial value
  3. useRef initializes with the initial value
  4. useMemo/useCallback compute initial values
  5. Component renders (returns JSX)
  6. DOM committed
  7. useEffect runs (after paint)

UPDATE (state/props change):
  1. Component function runs again
  2. useState returns CURRENT value (not initial)
  3. useEffect cleanup runs (for changed deps)
  4. Component renders
  5. DOM committed
  6. useEffect runs again (for changed deps)

UNMOUNT:
  1. useEffect cleanup functions run
  2. DOM nodes removed
\`\`\`

---

## The \`use\` Naming Convention

Any function that calls React hooks must start with \`use\`. This is not just a convention — the React linter and React itself use this prefix to:

1. Enforce the rules of hooks on the function (hooks can only be called from \`use*\` functions or components)
2. Identify custom hooks in error messages and DevTools
3. Enable lint rules to check hook usage inside custom hooks

\`\`\`jsx
// Custom hook — starts with 'use'
function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// ❌ Not a custom hook — won't work
function getWindowSize() { // missing 'use' prefix
  const [size, setSize] = useState({ ... }); // Hook in non-hook function!
}
\`\`\`

---

## Mental Model for All Hooks

Every hook follows this pattern:

\`\`\`
useX(
  initialValueOrConfiguration,
  [dependencies]          ← optional, for some hooks
) → returnedValue
\`\`\`

Before learning each hook, ask:
1. **What does this hook store or do?** (useState: a value; useEffect: a side effect; useRef: a mutable reference)
2. **When does it run?** (useState: every render returns current value; useEffect: after render when deps change)
3. **What does it return?** (useState: [value, setter]; useEffect: nothing; useRef: a ref object)
4. **What are the pitfalls?** (useEffect: stale closures, missing deps; useState: snapshot problem)

---

## Built-in Hooks Overview

| Hook | Purpose | Returns |
|------|---------|---------|
| \`useState\` | Local reactive state | \`[value, setter]\` |
| \`useEffect\` | Side effects (fetching, subscriptions) | Cleanup function |
| \`useRef\` | DOM refs / persistent mutable values | \`{ current: value }\` |
| \`useMemo\` | Memoize expensive computations | Computed value |
| \`useCallback\` | Memoize function references | Memoized function |
| \`useContext\` | Read context values | Context value |
| \`useReducer\` | Complex state with reducer pattern | \`[state, dispatch]\` |
| \`useId\` | Generate stable unique IDs | String ID |
| \`useTransition\` | Mark updates as non-urgent | \`[isPending, startTransition]\` |
| \`useDeferredValue\` | Defer non-urgent value updates | Deferred value |

---

## Common Hook Architecture Mistakes

### Mistake 1: Putting too much in one component
When you have 5 \`useEffect\` hooks and 8 \`useState\` hooks in one component, that component is doing too much. Extract logic into custom hooks.

### Mistake 2: Not understanding dependencies
Every hook that takes a dependency array (\`useEffect\`, \`useMemo\`, \`useCallback\`) must list every reactive value it uses. Missing dependencies cause stale closures. Unnecessary dependencies cause too many re-runs.

### Mistake 3: Over-optimizing
\`useMemo\` and \`useCallback\` are not free. They add memory overhead and complexity. Only use them when you have a measured performance problem.

### Mistake 4: Deriving state in useEffect
A common mistake is using \`useEffect\` to compute derived state:

\`\`\`jsx
// ❌ Wrong — useEffect to compute derived state
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(\`\${firstName} \${lastName}\`);
}, [firstName, lastName]);

// ✅ Correct — derive at render time
const fullName = \`\${firstName} \${lastName}\`;
\`\`\`

If a value can be derived synchronously, derive it. \`useEffect\` runs asynchronously after render — you would see the old derived value for one render.`,

  codeExamples: [
    {
      title: 'Hooks enable logic reuse — the before and after',
      code: `// BEFORE hooks: sharing stateful logic required complex patterns
// You had to use HOCs or render props — "wrapper hell"
const withWindowSize = (WrappedComponent) => {
  return class extends React.Component {
    state = { width: window.innerWidth, height: window.innerHeight };
    componentDidMount() {
      window.addEventListener('resize', this.handleResize);
    }
    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }
    handleResize = () => {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    };
    render() {
      return <WrappedComponent windowSize={this.state} {...this.props} />;
    }
  };
};

// AFTER hooks: logic is a simple reusable function
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handler = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return size;
}

// Use in any component, no wrapper needed
function ResponsiveLayout() {
  const { width } = useWindowSize();
  return <div>{width > 768 ? <DesktopLayout /> : <MobileLayout />}</div>;
}`,
      explanation:
        'Hooks replace the HOC and render props patterns for sharing stateful logic. The custom hook useWindowSize is a plain function — no class, no wrapper, no prop injection. Any component can use it by simply calling it at the top level.',
    },
    {
      title: 'Why hook order matters — internal model',
      code: `// Simplified version of how React tracks hook state internally
// (This is a mental model, not the actual implementation)

const hooksState = {}; // keyed by component

function renderComponent(componentFn, componentId) {
  let hookIndex = 0;
  const componentHooks = hooksState[componentId] ?? [];

  // React provides getCurrentHookIndex to hooks
  function useState(initialValue) {
    const currentIndex = hookIndex++;
    if (componentHooks[currentIndex] === undefined) {
      componentHooks[currentIndex] = initialValue; // First render
    }
    const value = componentHooks[currentIndex];
    const setter = (newValue) => {
      componentHooks[currentIndex] = newValue;
      scheduleRender(componentFn, componentId);
    };
    return [value, setter];
  }

  hooksState[componentId] = componentHooks;
  return componentFn({ useState }); // Call the component function
}

// If you call hooks conditionally:
// Render 1: hooks called in positions 0, 1, 2 → correct mapping
// Render 2: condition false, hooks called in positions 0, 2 → WRONG mapping
// Index 2 now reads from what was index 1 before`,
      explanation:
        'This shows why hook order is enforced by position. React\'s actual implementation uses a linked list of "fiber" nodes, but the core principle is the same: hook calls are identified by their position in the call sequence, not by name. Skipping a hook in a conditional breaks the sequence for all subsequent hooks.',
    },
  ],

  commonMistakes: [
    'Calling hooks inside conditionals, loops, or early returns — breaks the call order React depends on.',
    'Calling hooks in regular functions (not components or custom hooks) — hooks will not work outside React\'s render cycle.',
    'Using useEffect to compute derived state — derive synchronously at render time instead.',
    'Ignoring the eslint-plugin-react-hooks linter — it catches missing dependencies and rule violations automatically.',
    'Not starting custom hook names with "use" — the lint rules and React itself require this prefix.',
  ],

  interviewQuestions: [
    {
      question: 'Why were React hooks introduced?',
      answer:
        'Hooks were introduced to solve three problems with class components: (1) Stateful logic was hard to reuse — Higher-Order Components and render props created complex wrapper hierarchies; (2) Unrelated logic was forced into the same lifecycle methods (componentDidMount might handle subscriptions, data fetching, and analytics all mixed together); (3) Classes had confusing this binding. Hooks let you extract stateful logic into custom hooks (reusable functions), collocate related logic together, and eliminate class syntax entirely.',
      difficulty: 'intermediate',
    },
    {
      question: 'What are the rules of hooks and why do they exist?',
      answer:
        'Two rules: (1) Only call hooks at the top level — never inside conditionals, loops, or after early returns; (2) Only call hooks from React functional components or custom hooks. These rules exist because React identifies hooks by their call order. React maintains an internal array of hook values. The first useState is index 0, the second is index 1, etc. If hooks are called conditionally, the indices shift between renders and React reads the wrong state for subsequent hooks.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is a custom hook?',
      answer:
        'A custom hook is a function whose name starts with "use" and that calls other hooks. Custom hooks let you extract and reuse stateful logic across components. Unlike components, custom hooks do not return JSX — they return data and functions. Examples: useLocalStorage (persists state to localStorage), useDebounce (delays value updates), useWindowSize (tracks window dimensions), useFetch (manages loading/error/data state for API calls).',
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'hooks-fund-ex-1',
      title: 'Fix the Hook Rule Violations',
      description: 'This component has 3 hook rule violations. Find them and fix them without changing the component\'s behavior.',
      starterCode: `function UserDashboard({ userId, showStats }) {
  // Hook violation 1
  if (!userId) {
    return null;
  }
  const [user, setUser] = useState(null);

  const loadUser = async () => {
    const data = await fetchUser(userId);
    setUser(data);
  };

  // Hook violation 2
  if (showStats) {
    const [stats, setStats] = useState(null);
    useEffect(() => {
      fetchStats(userId).then(setStats);
    }, [userId]);
  }

  // Hook violation 3
  return users.map(u => {
    const [hover, setHover] = useState(false);
    return <div key={u.id} onMouseEnter={() => setHover(true)}>{u.name}</div>;
  });
}`,
      solution: `function UserDashboard({ userId, showStats }) {
  // Fix 1: Move all hooks before any conditional returns
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!userId) return;
    fetchUser(userId).then(setUser);
  }, [userId]);

  // Fix 2: Hook not in conditional — use conditional inside the effect
  useEffect(() => {
    if (!userId || !showStats) return;
    fetchStats(userId).then(setStats);
  }, [userId, showStats]);

  if (!userId) return null;

  // Fix 3: Hooks can't be inside .map() — use a single state for all hover states
  return users.map(u => (
    <div
      key={u.id}
      onMouseEnter={() => setHoverStates(prev => ({ ...prev, [u.id]: true }))}
      onMouseLeave={() => setHoverStates(prev => ({ ...prev, [u.id]: false }))}
    >
      {u.name}
    </div>
  ));
}`,
      hints: [
        'All hooks must come before any return statement',
        'Move conditional logic inside the hook (useEffect), not around it',
        'For per-item state in lists, track it in a single state object keyed by item ID',
      ],
    },
  ],

  keyTakeaways: [
    'Hooks let functional components use state, lifecycle, context, and other React features.',
    'Hooks were introduced to solve: logic reuse (custom hooks), scattered logic in lifecycle methods, and class complexity.',
    'Rule 1: Always call hooks at the top level — never in conditions, loops, or after early returns.',
    'Rule 2: Only call hooks in React functional components or custom hooks.',
    'These rules exist because React identifies hooks by their call order position — conditional calls break the order.',
    'Custom hooks are functions starting with "use" that call other hooks. They share stateful logic without wrappers.',
  ],

  nextLesson: 'use-state',
  prevLesson: 'event-handling',
};
