import type { Lesson } from '@/types';

export const useRefLesson: Lesson = {
  id: 'use-ref',
  slug: 'use-ref',
  title: 'useRef',
  description:
    'Understand useRef for DOM access and persistent mutable values that should not trigger re-renders — a critical tool for timers, previous values, and library integration.',
  category: 'Hooks',
  order: 11,
  difficulty: 'intermediate',
  estimatedTime: 20,
  content: `\`useRef\` returns a mutable object that persists for the full lifetime of a component. Unlike state, **changing a ref does not cause a re-render**.

This makes refs the right tool for two distinct use cases:
1. Accessing DOM nodes directly
2. Storing values that should persist across renders without triggering re-renders

---

## The API

\`\`\`jsx
const ref = useRef(initialValue);
// ref.current = initialValue on first render
// ref.current persists across renders
// Writing to ref.current does NOT trigger re-render
\`\`\`

The returned \`ref\` object has a single property: \`current\`. You read and write \`ref.current\` directly.

---

## Use Case 1: DOM References

The most common use for refs is accessing a DOM element directly. Pass the ref to the \`ref\` prop of a JSX element — React sets \`ref.current\` to the DOM node after render.

\`\`\`jsx
function AutoFocusInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // After mount, focus the input
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} placeholder="This focuses automatically" />;
}
\`\`\`

### Common DOM ref use cases

\`\`\`jsx
// 1. Focus management
function Modal({ isOpen, onClose }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus(); // Move focus into modal when it opens
    }
  }, [isOpen]);

  return isOpen ? (
    <div role="dialog">
      <p>Modal content</p>
      <button ref={closeButtonRef} onClick={onClose}>Close</button>
    </div>
  ) : null;
}

// 2. Reading measurements
function Tooltip({ target, children }) {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (tooltipRef.current) {
      const { height } = tooltipRef.current.getBoundingClientRect();
      // Position tooltip above the target based on its height
      positionTooltip(tooltipRef.current, target, height);
    }
  });

  return <div ref={tooltipRef} className="tooltip">{children}</div>;
}

// 3. Scrolling
function ChatMessages({ messages }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="messages">
      {messages.map(m => <Message key={m.id} message={m} />)}
      <div ref={bottomRef} /> {/* Invisible element at the bottom */}
    </div>
  );
}

// 4. Integrating third-party libraries
function ChartComponent({ data }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const chart = new Chart(canvasRef.current, { type: 'bar', data });
    return () => chart.destroy(); // Cleanup
  }, [data]);

  return <canvas ref={canvasRef} />;
}
\`\`\`

---

## Use Case 2: Persistent Mutable Values

Refs persist across renders without causing re-renders. Use them for values that:
- The component needs to remember
- Do not affect the UI when they change

\`\`\`jsx
// 1. Storing a timer ID
function Poller({ onPoll }) {
  const intervalRef = useRef<number | null>(null);

  function startPolling() {
    intervalRef.current = window.setInterval(onPoll, 5000);
  }

  function stopPolling() {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  useEffect(() => {
    startPolling();
    return stopPolling;
  }, []);

  return <button onClick={stopPolling}>Stop Polling</button>;
}

// 2. Tracking whether the component is mounted
function DataLoader() {
  const isMountedRef = useRef(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    return () => { isMountedRef.current = false; };
  }, []);

  async function loadData() {
    const result = await fetchData();
    if (isMountedRef.current) { // Only update if still mounted
      setData(result);
    }
  }

  return <button onClick={loadData}>Load</button>;
}

// 3. Storing the previous value of a prop or state
function usePrevious<T>(value: T): T | undefined {
  const prevRef = useRef<T | undefined>(undefined);

  useEffect(() => {
    prevRef.current = value; // Update after render
  });

  return prevRef.current; // Returns the value from PREVIOUS render
}

function PriceDisplay({ price }) {
  const prevPrice = usePrevious(price);

  return (
    <div>
      <span>\${price}</span>
      {prevPrice !== undefined && (
        <span className={price > prevPrice ? 'up' : 'down'}>
          {price > prevPrice ? '▲' : '▼'}
        </span>
      )}
    </div>
  );
}
\`\`\`

---

## Ref vs State — When to Use Each

| | \`useRef\` | \`useState\` |
|---|---|---|
| Persists across renders | ✅ | ✅ |
| Triggers re-render | ❌ No | ✅ Yes |
| Use for UI data | ❌ | ✅ |
| Use for DOM access | ✅ | ❌ |
| Mutate directly | ✅ \`ref.current = x\` | ❌ Use setter |
| Read in JSX | ❌ Not reactive | ✅ |

**The rule:** If the value affects what is rendered, use state. If the value is something the component needs to track but it does not affect the UI, use a ref.

\`\`\`jsx
// ❌ Using state for a non-visual timer ID (unnecessary re-render)
const [timerId, setTimerId] = useState(null);
// Calling setTimerId causes a re-render but the UI doesn't care about timerId

// ✅ Using ref for non-visual timer ID
const timerIdRef = useRef(null);
// Writing to timerIdRef.current does not cause a re-render
\`\`\`

---

## Forwarding Refs

By default, you cannot pass a \`ref\` to a custom component — only to DOM elements. To allow a parent to access a child's DOM node, use \`forwardRef\`:

\`\`\`jsx
import { forwardRef } from 'react';

// Wrap component in forwardRef to accept a ref from the parent
const FancyInput = forwardRef<HTMLInputElement, { placeholder?: string }>(
  ({ placeholder }, ref) => {
    return (
      <div className="fancy-input-wrapper">
        <input ref={ref} placeholder={placeholder} className="fancy-input" />
      </div>
    );
  }
);

// Parent can now get a ref to the internal input element
function Form() {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFocusInput() {
    inputRef.current?.focus();
  }

  return (
    <div>
      <FancyInput ref={inputRef} placeholder="Fancy input" />
      <button onClick={handleFocusInput}>Focus Input</button>
    </div>
  );
}
\`\`\`

---

## Common Mistakes

### Mistake 1: Reading ref.current in JSX

\`\`\`jsx
// ❌ ref.current is not reactive — JSX doesn't update when it changes
function BadComponent() {
  const countRef = useRef(0);
  return (
    <button onClick={() => countRef.current++}>
      Count: {countRef.current} {/* Does not update when clicked */}
    </button>
  );
}

// ✅ Use state for values that affect the UI
function GoodComponent() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
\`\`\`

### Mistake 2: Accessing ref.current in the render body

\`\`\`jsx
// ❌ ref.current is null during first render
function BadFocus() {
  const ref = useRef(null);
  ref.current?.focus(); // Runs during render — ref not attached yet!
  return <input ref={ref} />;
}

// ✅ Access in useEffect — after DOM is attached
function GoodFocus() {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus(); // After render — ref is attached
  }, []);
  return <input ref={ref} />;
}
\`\`\``,

  codeExamples: [
    {
      title: 'usePrevious — storing the previous value',
      code: `// A highly practical custom hook built on useRef
function usePrevious<T>(value: T) {
  const ref = useRef<T | undefined>(undefined);

  // useEffect runs AFTER render — so during this render,
  // ref.current still holds the PREVIOUS render's value
  useEffect(() => {
    ref.current = value;
  }); // No deps — runs after every render

  return ref.current; // Returns previous render's value
}

// Usage: Animate transitions based on previous state
function ScoreBoard({ score }) {
  const prevScore = usePrevious(score);
  const increased = prevScore !== undefined && score > prevScore;

  return (
    <div className={\`score \${increased ? 'flash-green' : ''}\`}>
      {score}
      {increased && <span className="delta">+{score - prevScore!}</span>}
    </div>
  );
}

// Explanation of the timing:
// Render 1: score=0, ref.current=undefined → prevScore=undefined
//   → After render: ref.current = 0
// Render 2: score=5, ref.current=0 → prevScore=0
//   → After render: ref.current = 5
// Render 3: score=5, ref.current=5 → prevScore=5 (no change)`,
      explanation:
        'The key insight: useEffect runs AFTER render. During the current render, ref.current holds the previous render\'s value. After the render, the effect updates ref.current to the current value. Next render, ref.current is this render\'s value (which will be "previous" to the next render).',
    },
  ],

  commonMistakes: [
    'Reading ref.current in JSX — refs are not reactive, the UI does not update when ref.current changes.',
    'Accessing ref.current before the component mounts — it is null until after the first render commit.',
    'Using a ref when state is the right tool — if changing a value should update the UI, use state.',
    'Not using forwardRef when a parent needs access to a child component\'s DOM node.',
  ],

  interviewQuestions: [
    {
      question: 'What is the difference between useRef and useState?',
      answer:
        'Both persist values across renders. The key difference: updating state (via the setter) triggers a re-render; mutating ref.current does not. Use state for values that affect the UI. Use refs for: DOM node access, storing values that should not cause re-renders (timer IDs, previous values, mounted flags), and integrating with imperative APIs. Mutating ref.current is always direct (ref.current = value), no setter needed.',
      difficulty: 'intermediate',
    },
    {
      question: 'When would you use useRef over useState?',
      answer:
        'Use useRef for: (1) DOM access — autofocus, scroll, measurements, third-party library integration; (2) Values that persist but should not cause re-renders — timer IDs, interval IDs, WebSocket instances; (3) Previous value tracking — store the last render\'s value to compare; (4) Mutable values in effects — avoiding stale closures when you need a stable reference; (5) Tracking whether the component is mounted to prevent state updates after unmount.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is forwardRef and when do you need it?',
      answer:
        'forwardRef is a React API that lets a parent component access a DOM node inside a child component. By default, you cannot pass a ref to a custom component — only to DOM elements. Wrapping a custom component with forwardRef enables ref forwarding. You need it when building reusable input or button components that consumers need to focus, blur, or measure. It\'s common in design system libraries.',
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'use-ref-ex-1',
      title: 'Build a Stopwatch',
      description: 'Build a stopwatch with start, stop, reset. The timer ID should be stored in a ref (not state). Elapsed time should be in state.',
      starterCode: `function Stopwatch() {
  const [elapsed, setElapsed] = useState(0); // milliseconds
  const [running, setRunning] = useState(false);
  // TODO: store interval ID in a ref

  function start() { /* TODO */ }
  function stop() { /* TODO */ }
  function reset() { /* TODO */ }

  const seconds = Math.floor(elapsed / 1000);
  const ms = elapsed % 1000;

  return (
    <div>
      <p>{seconds}.{String(ms).padStart(3, '0')}</p>
      <button onClick={running ? stop : start}>{running ? 'Stop' : 'Start'}</button>
      <button onClick={reset} disabled={running}>Reset</button>
    </div>
  );
}`,
      solution: `function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  function start() {
    if (running) return;
    startTimeRef.current = Date.now() - elapsed;
    intervalRef.current = window.setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 10);
    setRunning(true);
  }

  function stop() {
    if (!running) return;
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
  }

  function reset() {
    stop();
    setElapsed(0);
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, []);

  const seconds = Math.floor(elapsed / 1000);
  const ms = elapsed % 1000;

  return (
    <div>
      <p>{seconds}.{String(ms).padStart(3, '0')}s</p>
      <button onClick={running ? stop : start}>{running ? 'Stop' : 'Start'}</button>
      <button onClick={reset} disabled={running}>Reset</button>
    </div>
  );
}`,
      hints: [
        'intervalRef stores the setInterval ID — never needs to be state',
        'Cleanup the interval in a useEffect return when component unmounts',
        'Track start time in a ref so you can resume after stop',
        'elapsed in state triggers re-renders to show the updated time',
      ],
    },
  ],

  keyTakeaways: [
    'useRef returns { current: value } — persists across renders, changes do NOT trigger re-renders.',
    'Use refs for DOM access (focus, scroll, measure, third-party libraries) and non-visual persistent values (timer IDs, previous values).',
    'ref.current is null before first render commit — always access in useEffect, not in the render body.',
    'Use forwardRef to let a parent access a DOM node inside a custom child component.',
    'ref.current in JSX is not reactive — the UI will not update when ref.current changes. Use state for UI-affecting values.',
  ],

  nextLesson: 'use-memo',
  prevLesson: 'use-effect',
};
