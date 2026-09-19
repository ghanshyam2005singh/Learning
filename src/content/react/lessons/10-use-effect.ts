import type { Lesson } from '@/types';

export const useEffectLesson: Lesson = {
  id: 'use-effect',
  slug: 'use-effect',
  title: 'useEffect',
  description:
    'The most misunderstood hook in React. Master useEffect deeply — why it exists, synchronization with external systems, dependency arrays, cleanup, stale closures, infinite loops, memory leaks, and every interview-critical pattern.',
  category: 'Hooks',
  order: 10,
  difficulty: 'intermediate',
  estimatedTime: 45,
  content: `\`useEffect\` is the most important and most misunderstood hook in React. Most React bugs involve \`useEffect\` — stale closures, infinite loops, memory leaks, missing cleanup.

Mastering \`useEffect\` requires understanding its true mental model, not just its API.

---

## The Mental Model: Synchronization

The React documentation (post React 18) frames \`useEffect\` correctly:

**\`useEffect\` synchronizes your component with an external system.**

"External system" means anything outside React: the DOM, a browser API, a WebSocket connection, a timer, a third-party library.

\`\`\`
External System ←→ useEffect ←→ React Component
\`\`\`

This framing is more accurate than "useEffect runs on lifecycle events" — though lifecycle events are still a useful way to think about the timing.

---

## Why useEffect Exists

The render phase must be pure. It cannot have side effects. But real applications need side effects:

- Fetching data from an API
- Setting up event listeners
- Starting a timer
- Connecting to a WebSocket
- Setting \`document.title\`
- Interacting with third-party libraries (charts, maps, players)

\`useEffect\` provides a safe place to run these side effects — **after the component renders and the DOM is updated**.

---

## The Dependency Array

\`useEffect\` takes two arguments: the effect function and an optional dependency array.

### No dependency array — runs after every render

\`\`\`jsx
useEffect(() => {
  document.title = \`Page: \${count}\`;
}); // No array — runs after every render
\`\`\`

This is rarely what you want. Any state or prop change causes the effect to re-run.

### Empty dependency array — runs once on mount

\`\`\`jsx
useEffect(() => {
  // Set up subscription, fetch initial data, etc.
  const sub = subscribe();
  return () => sub.unsubscribe(); // Cleanup on unmount
}, []); // Empty array — runs once
\`\`\`

The effect runs after the first render, never again.

### With dependencies — runs when dependencies change

\`\`\`jsx
useEffect(() => {
  fetchUser(userId).then(setUser);
}, [userId]); // Re-runs whenever userId changes
\`\`\`

The effect runs on mount AND whenever \`userId\` changes.

---

## What Goes in the Dependency Array

**Every reactive value used inside the effect must be in the dependency array.**

Reactive values are:
- Props
- State
- Anything derived from props or state
- Values declared inside the component that change between renders

\`\`\`jsx
function UserProfile({ userId, includeDetails }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Uses userId and includeDetails → both must be deps
    fetchUser(userId, { details: includeDetails }).then(setUser);
  }, [userId, includeDetails]); // ✅ Both listed
}
\`\`\`

**What does NOT need to be in deps:**
- Stable functions (from outside the component, setState functions, dispatch)
- Constants that never change
- Refs (\`ref.current\` is not reactive)

---

## Cleanup

Many effects need to be cleaned up when the component unmounts or before the effect runs again.

\`useEffect\` returns a **cleanup function** that React calls:
1. When the component unmounts
2. Before the effect runs again (due to dependency change)

\`\`\`jsx
useEffect(() => {
  // Set up
  const handler = () => setOnline(navigator.onLine);
  window.addEventListener('online', handler);
  window.addEventListener('offline', handler);

  // Cleanup — React calls this on unmount or before next run
  return () => {
    window.removeEventListener('online', handler);
    window.removeEventListener('offline', handler);
  };
}, []);
\`\`\`

### What requires cleanup:
- Event listeners (\`removeEventListener\`)
- Subscriptions (unsubscribe)
- Timers (\`clearInterval\`, \`clearTimeout\`)
- WebSocket connections (\`ws.close()\`)
- Abort controllers (\`controller.abort()\`)
- Third-party library cleanup

---

## Data Fetching Pattern

\`\`\`jsx
function UserDetails({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false; // Flag to handle race conditions

    setLoading(true);
    setError(null);

    fetchUser(userId)
      .then(data => {
        if (!cancelled) {
          setUser(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true; // Cancel stale response
    };
  }, [userId]);

  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  return <UserCard user={user} />;
}
\`\`\`

The \`cancelled\` flag prevents a race condition: if \`userId\` changes quickly, two fetches might be in flight. The cleanup from the first effect sets \`cancelled = true\`, so the first response is discarded when it arrives.

**Modern alternative:** Use an AbortController:

\`\`\`jsx
useEffect(() => {
  const controller = new AbortController();

  fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
    .then(r => r.json())
    .then(setUser)
    .catch(err => {
      if (err.name !== 'AbortError') setError(err.message);
    });

  return () => controller.abort(); // Cancel inflight request on cleanup
}, [userId]);
\`\`\`

---

## The Infinite Loop Problem

The most common \`useEffect\` bug is an infinite loop.

\`\`\`jsx
// ❌ Infinite loop
function BadComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData([1, 2, 3]); // Updates state
  }); // No deps → runs after every render → renders again → repeats forever
}

// ❌ Infinite loop with deps
function AnotherBad() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser().then(setUser);
  }, [user]); // user changes → effect runs → user changes → effect runs → ∞
  // Should be [] — only fetch on mount
}

// ❌ Object/array in deps without memoization
function ObjectDeps({ filters }) {
  useEffect(() => {
    fetchData(filters);
  }, [filters]); // filters is an object — new reference every render → infinite loop
  // Fix: use useMemo for filters, or destructure primitive values
}
\`\`\`

**Infinite loop checklist:**
1. Missing or no dependency array → add empty array or correct deps
2. Setting state that is in the dependency array → restructure the logic
3. Object or array in deps that is recreated every render → stabilize with useMemo or destructure primitives

---

## Stale Closures in useEffect

A stale closure occurs when the effect captures an old value from a previous render and continues using it.

\`\`\`jsx
// ❌ Stale closure
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // 'count' is captured from mount (= 0)
      // After 3 seconds: count is still 0, not 3
    }, 1000);
    return () => clearInterval(id);
  }, []); // Empty deps — effect runs once, captures count = 0 forever

  return <p>{count}</p>;
}

// ✅ Fix 1: Functional update (doesn't need count in closure)
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1); // Always gets latest count
  }, 1000);
  return () => clearInterval(id);
}, []);

// ✅ Fix 2: Add count to deps (but this resets the interval on every tick)
// Not ideal here, but correct for effects that should react to count changes
\`\`\`

---

## Memory Leaks

A memory leak in React occurs when an effect attempts to update state after the component has unmounted.

\`\`\`jsx
// ❌ Memory leak — state update after unmount
function UserCard({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(data => {
      setUser(data); // What if component unmounted before this resolved?
      // React warning: "Can't perform a React state update on an unmounted component"
    });
  }, [userId]);
}

// ✅ Fixed with cleanup flag
useEffect(() => {
  let mounted = true;
  fetchUser(userId).then(data => {
    if (mounted) setUser(data); // Only update if still mounted
  });
  return () => { mounted = false; };
}, [userId]);

// ✅ Fixed with AbortController (preferred)
useEffect(() => {
  const ac = new AbortController();
  fetch(\`/api/users/\${userId}\`, { signal: ac.signal })
    .then(r => r.json())
    .then(setUser)
    .catch(e => { if (e.name !== 'AbortError') console.error(e); });
  return () => ac.abort();
}, [userId]);
\`\`\`

---

## React Strict Mode and Double Invocation

In development, React 18 mounts components **twice** (mount → unmount → mount) to surface cleanup bugs. This means:

- Effects run twice
- If your effect creates a side effect without cleanup, you will see it twice
- This is intentional — it surfaces missing cleanup

\`\`\`jsx
// ❌ Effect without cleanup — visible in Strict Mode
useEffect(() => {
  // In Strict Mode dev: this creates TWO connections
  const ws = new WebSocket('ws://localhost:8080');
}, []);

// ✅ With cleanup — Strict Mode works correctly
useEffect(() => {
  const ws = new WebSocket('ws://localhost:8080');
  ws.onmessage = handleMessage;
  return () => ws.close(); // Closed before second mount
}, []);
\`\`\`

If your app breaks in Strict Mode but works without it, you have a missing cleanup.

---

## useEffect vs useLayoutEffect

\`useLayoutEffect\` runs **synchronously after DOM mutations but before the browser paints**.

\`useEffect\` runs **after the browser has painted** (asynchronous).

\`\`\`
DOM updated → useLayoutEffect → browser paints → useEffect
\`\`\`

Use \`useLayoutEffect\` only when you need to read DOM measurements before the browser shows the screen (e.g., tooltip positioning, measuring element size before showing it). In almost all other cases, use \`useEffect\`.

---

## Common Interview Scenarios

### "What happens when you fetch in useEffect without cleanup?"
Race condition: if userId changes quickly, two fetches are in flight. The second response might arrive before the first, setting stale data. Cleanup with a cancelled flag or AbortController prevents this.

### "How do you run an effect only once?"
Empty dependency array: \`useEffect(() => { ... }, [])\`

### "How do you run an effect when a specific value changes?"
Include the value in the dependency array: \`useEffect(() => { ... }, [specificValue])\`

### "What causes infinite loops in useEffect?"
(1) No dependency array and effect changes state, (2) The effect sets state that is in the dependencies, (3) An object/array in dependencies is recreated every render.`,

  codeExamples: [
    {
      title: 'WebSocket connection with proper cleanup',
      code: `function ChatRoom({ roomId, userId }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Connect to the room
    const ws = new WebSocket(\`wss://chat.example.com/rooms/\${roomId}\`);

    ws.onopen = () => {
      setConnected(true);
      ws.send(JSON.stringify({ type: 'join', userId }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data) as Message;
      setMessages(prev => [...prev, message]);
    };

    ws.onerror = () => setConnected(false);
    ws.onclose = () => setConnected(false);

    // Cleanup: disconnect when roomId changes or component unmounts
    return () => {
      ws.send(JSON.stringify({ type: 'leave', userId }));
      ws.close();
      setConnected(false);
    };
  }, [roomId, userId]); // Re-connect when roomId or userId changes

  return (
    <div>
      <div className={\`status \${connected ? 'connected' : 'disconnected'}\`}>
        {connected ? '● Connected' : '○ Disconnected'}
      </div>
      <MessageList messages={messages} />
    </div>
  );
}`,
      explanation:
        'The cleanup function disconnects the WebSocket when roomId changes (so a new connection forms) or when the component unmounts. Without cleanup, old connections would persist and new message handlers would stack up — a memory leak.',
    },
    {
      title: 'Debounced search with cleanup',
      code: `function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Don't search for empty queries
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    // Debounce: wait 300ms before searching
    const timerId = setTimeout(() => {
      const controller = new AbortController();

      fetch(\`/api/search?q=\${encodeURIComponent(query)}\`, {
        signal: controller.signal,
      })
        .then(r => r.json())
        .then(data => {
          setResults(data);
          setLoading(false);
        })
        .catch(err => {
          if (err.name !== 'AbortError') {
            setResults([]);
            setLoading(false);
          }
        });

      // Return inner cleanup: abort the fetch if timer fires again
      // Note: this inner cleanup is called by the outer cleanup below
    }, 300);

    // Cleanup: cancel the timer (and any inflight fetch) if query changes
    return () => {
      clearTimeout(timerId);
      setLoading(false);
    };
  }, [query]);

  return loading ? <Spinner /> : <ResultList results={results} />;
}`,
      explanation:
        'Two levels of cleanup here: (1) clearTimeout cancels the debounce timer if query changes before 300ms, preventing a stale search from running; (2) The AbortController would cancel the fetch if it was already started. This is how you build production-grade search without debounce libraries.',
    },
    {
      title: 'Effect synchronization pattern — document title',
      code: `// This is the canonical simple useEffect example
// Synchronizing with an external system (the document title)

function ProfilePage({ user }) {
  const [isEditing, setIsEditing] = useState(false);

  // Synchronize document.title with component state
  useEffect(() => {
    const prevTitle = document.title;
    document.title = isEditing
      ? \`Editing \${user.name} — MyApp\`
      : \`\${user.name} — MyApp\`;

    // Restore original title when component unmounts
    return () => {
      document.title = prevTitle;
    };
  }, [user.name, isEditing]); // Re-sync when either changes

  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={() => setIsEditing(e => !e)}>
        {isEditing ? 'Save' : 'Edit'}
      </button>
    </div>
  );
}

// Notice: the effect SYNCHRONIZES the external system (document.title)
// with the component's current state. This is the mental model.`,
      explanation:
        'useEffect synchronizes an external system (document.title) with React state. When state changes, the effect re-syncs. On unmount, the cleanup restores the title. This is exactly the mental model the React team recommends: "synchronization with an external system."',
    },
  ],

  commonMistakes: [
    'Missing dependency array — runs after every render, causes infinite loops or unnecessary work.',
    'Missing dependencies in the array — stale closures that use outdated values.',
    'Putting derived state computation in useEffect — derive synchronously at render time instead.',
    'Not cleaning up event listeners, timers, or subscriptions — memory leaks and ghost event handlers.',
    'Not handling the race condition in data fetching — no cancelled flag or AbortController.',
    'Adding functions defined in the component body to deps without useMemo — recreated every render, causes infinite loops.',
  ],

  interviewQuestions: [
    {
      question: 'What is the true purpose of useEffect?',
      answer:
        'useEffect synchronizes a React component with an external system — anything outside React like the DOM, a WebSocket, a timer, localStorage, a third-party library. The mental model of "lifecycle hook" is secondary to this synchronization model. The effect runs after render to sync external state with React state. The cleanup reverses that synchronization when the component unmounts or before the next run.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is a stale closure in useEffect and how do you fix it?',
      answer:
        'A stale closure occurs when a useEffect captures a value from a render and holds onto it even after the state has changed. Common in timers: setInterval inside a useEffect with empty deps captures the initial state value forever. Fix: (1) Use functional state updates (setCount(prev => prev + 1)) which don\'t need the current value in closure; (2) Add the value to the dependency array so the effect re-runs with the latest value; (3) Use a ref to store the latest value without needing it in deps.',
      difficulty: 'advanced',
    },
    {
      question: 'How do you prevent a race condition in data fetching with useEffect?',
      answer:
        'Race condition: userId changes, two fetches run, the second resolves before the first, setting stale data. Solutions: (1) Cleanup flag — in the effect return, set cancelled = true; in the .then(), check if cancelled before calling setState; (2) AbortController — fetch with a signal, abort on cleanup; aborted fetches throw an AbortError which you catch and ignore. The AbortController approach is preferred as it also cancels the actual network request.',
      difficulty: 'advanced',
    },
    {
      question: 'What is the difference between useEffect and useLayoutEffect?',
      answer:
        'Both run after the render phase. useEffect runs asynchronously after the browser has painted the screen. useLayoutEffect runs synchronously after DOM mutations but before the browser paints. Use useLayoutEffect when you need to read DOM measurements before the user sees the screen (tooltips, popover positioning, measuring element sizes). Use useEffect for everything else — it does not block the browser\'s paint and gives better performance.',
      difficulty: 'intermediate',
    },
    {
      question: 'Why does React run effects twice in Strict Mode?',
      answer:
        'React 18 Strict Mode intentionally mounts → unmounts → mounts components to verify that cleanup functions properly reverse effects. If your app behaves differently after the double-mount, you have a missing or incorrect cleanup function. In production, effects run once. Strict Mode\'s double-invocation is a development-only check that surfaces real bugs early.',
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'use-effect-ex-1',
      title: 'Fix All useEffect Bugs',
      description: 'This component has an infinite loop, a memory leak, and a stale closure. Fix all three.',
      starterCode: `function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [count, setCount] = useState(0);

  // Bug 1: Potential memory leak
  useEffect(() => {
    fetchUser(userId).then(data => setUser(data));
  }, [userId]);

  // Bug 2: Stale closure
  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Bug 3: Infinite loop
  useEffect(() => {
    if (user) {
      setUser({ ...user, lastSeen: new Date() });
    }
  }, [user]);

  return <div>{user?.name}: {count}</div>;
}`,
      solution: `function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [count, setCount] = useState(0);

  // Fix 1: Prevent memory leak with AbortController
  useEffect(() => {
    const controller = new AbortController();
    fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
      .then(r => r.json())
      .then(data => setUser(data))
      .catch(err => { if (err.name !== 'AbortError') console.error(err); });
    return () => controller.abort();
  }, [userId]);

  // Fix 2: Functional update — no need for count in deps
  useEffect(() => {
    const id = setInterval(() => {
      setCount(prev => prev + 1); // Gets latest count without capturing it
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Fix 3: Remove this effect — lastSeen should be set on fetch, not in an effect loop
  // Or if truly needed, don't include user in deps:
  // Run only on mount with a ref for user, etc.
  // Simplest fix: just remove it and set lastSeen in the fetch effect
  useEffect(() => {
    if (user) {
      setUser(prev => prev ? { ...prev, lastSeen: new Date() } : prev);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Depend on user.id (stable), not the whole user object

  return <div>{user?.name}: {count}</div>;
}`,
      hints: [
        'Use AbortController to cancel the fetch on unmount',
        'Functional updates avoid needing the current value in the closure',
        'For infinite loop: find what changes in the effect that is also in deps',
      ],
    },
  ],

  keyTakeaways: [
    'useEffect synchronizes your component with external systems. Run effects after render; clean up before unmount.',
    'Every reactive value used in an effect must be in the dependency array — missing deps cause stale closures.',
    'Empty array [] = runs once on mount. No array = runs every render. [dep1, dep2] = runs when deps change.',
    'Always return a cleanup function for event listeners, timers, subscriptions, and WebSocket connections.',
    'Prevent data fetching race conditions with a cancelled flag or AbortController.',
    'useEffect with objects/arrays in deps causes infinite loops if those objects are recreated every render.',
  ],

  nextLesson: 'use-ref',
  prevLesson: 'use-state',
};
