import type { Lesson } from '@/types';

export const useStateLesson: Lesson = {
  id: 'use-state',
  slug: 'use-state',
  title: 'useState',
  description:
    'Master useState — state creation, updates, functional updates, complex state patterns, lazy initialization, and all the pitfalls that trip up developers.',
  category: 'Hooks',
  order: 9,
  difficulty: 'beginner',
  estimatedTime: 25,
  content: `\`useState\` is the most fundamental React hook. It lets a component remember values between renders and trigger re-renders when those values change.

You already saw state in the State module. This module goes deeper into \`useState\` specifically — all its patterns, edge cases, and pitfalls.

---

## The API

\`\`\`jsx
const [value, setValue] = useState(initialValue);
\`\`\`

- \`value\` — the current state value
- \`setValue\` — the function to update state (triggers re-render)
- \`initialValue\` — the value on first render only

React returns an array of exactly two items. Destructuring gives them meaningful names.

---

## Initialization

The initial value is only used on the **first render**. On subsequent renders, React ignores the initial value argument and returns the current state.

\`\`\`jsx
const [count, setCount] = useState(0);
// First render: count = 0
// After setCount(5): count = 5
// The "0" argument is never evaluated again
\`\`\`

### Lazy Initialization

If computing the initial state is expensive (reading from localStorage, processing data), pass a **function** instead of a value. React calls this function once, on mount only:

\`\`\`jsx
// ❌ This runs on EVERY render (even though only mount uses the value)
const [todos, setTodos] = useState(
  JSON.parse(localStorage.getItem('todos') ?? '[]') // Runs every render!
);

// ✅ Lazy initialization — function runs only on mount
const [todos, setTodos] = useState(() =>
  JSON.parse(localStorage.getItem('todos') ?? '[]') // Runs once
);
\`\`\`

Lazy initialization is important whenever the initial value involves expensive computation or reading from external storage.

---

## Setter Function

The setter function (\`setValue\`) accepts two forms:

### Form 1: Direct value
\`\`\`jsx
setCount(5);         // Sets count to 5
setName('Alice');    // Sets name to 'Alice'
setError(null);      // Sets error to null
\`\`\`

### Form 2: Functional update
\`\`\`jsx
setCount(prev => prev + 1);        // Increments by 1
setItems(prev => [...prev, item]); // Adds to array
setUser(prev => ({ ...prev, name: 'Bob' })); // Updates object field
\`\`\`

**When to use functional update:**
- Whenever new state depends on previous state
- When the setter might be called multiple times before re-render
- Inside useEffect, useCallback, or setTimeout (avoids stale closures)

**Rule of thumb:** If the new value uses the current value, use functional update.

---

## useState with Objects

When state is an object, the setter **replaces** the entire state, unlike \`this.setState\` in class components (which merged).

\`\`\`jsx
const [user, setUser] = useState({
  name: 'Alice',
  email: 'alice@example.com',
  role: 'admin',
});

// ❌ Wrong — replaces entire state with just { name }
// email and role are lost
setUser({ name: 'Bob' });

// ✅ Correct — spread old state, override what changed
setUser(prev => ({ ...prev, name: 'Bob' }));
// Result: { name: 'Bob', email: 'alice@example.com', role: 'admin' }
\`\`\`

For deeply nested objects, each level needs to be spread:

\`\`\`jsx
const [config, setConfig] = useState({
  ui: {
    theme: 'dark',
    fontSize: 14,
  },
  api: {
    baseUrl: 'https://api.example.com',
  },
});

// Update a nested property
setConfig(prev => ({
  ...prev,
  ui: {
    ...prev.ui,
    theme: 'light',
  },
}));
\`\`\`

For deeply nested state, consider splitting into separate \`useState\` calls, or using \`useReducer\` (covered in a later module).

---

## useState with Arrays

Arrays follow the same rule: create a new array, never mutate.

\`\`\`jsx
const [tasks, setTasks] = useState([]);

// Add
const addTask = (task) => setTasks(prev => [...prev, task]);

// Remove by id
const removeTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));

// Update one item
const updateTask = (id, updates) =>
  setTasks(prev =>
    prev.map(t => t.id === id ? { ...t, ...updates } : t)
  );

// Toggle a boolean field
const toggleComplete = (id) =>
  setTasks(prev =>
    prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
  );

// Move item to different position (e.g., drag and drop)
const moveTask = (fromIndex, toIndex) =>
  setTasks(prev => {
    const next = [...prev];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    return next;
  });
\`\`\`

---

## When State Does Not Trigger Re-render

React uses \`Object.is\` to compare old and new state. If the comparison returns true, React bails out and does not re-render.

\`\`\`jsx
// These do NOT cause re-renders (same value):
setCount(count);       // Same primitive value
setArray(array);       // Same array reference (even if you mutated it!)
setUser(user);         // Same object reference

// These DO cause re-renders:
setCount(count + 1);   // Different number
setArray([...array]);  // New array reference (even with same content)
setUser({ ...user });  // New object reference
\`\`\`

This is why mutations do not work: \`array.push(item)\` mutates in place — same reference — React doesn't see a change. \`[...array, item]\` creates a new reference — React detects the change.

---

## Multiple State Variables vs One Object

When should you split state into multiple \`useState\` calls vs one state object?

**Split into separate variables when:**
- The values change independently
- Some values are related to different concerns

\`\`\`jsx
// Good — these are independent
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState(null);
\`\`\`

**Use one object when:**
- Values always change together
- You need to do atomic updates (update several fields in one operation)

\`\`\`jsx
// Good — these form one unit
const [position, setPosition] = useState({ x: 0, y: 0 });
// Moving always updates both x and y together
\`\`\`

---

## useState Pitfalls

### Pitfall 1: The state update is async
\`\`\`jsx
const [count, setCount] = useState(0);

function handleClick() {
  setCount(1);
  console.log(count); // Still 0! Update not applied yet
  // count will be 1 on the NEXT render
}
\`\`\`

### Pitfall 2: Stale closure in setInterval / setTimeout
\`\`\`jsx
// ❌ Stale closure — count is always 0
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1); // count is always the initial snapshot (0)
  }, 1000);
  return () => clearInterval(id);
}, []); // empty deps → captures count = 0 forever

// ✅ Functional update — always gets latest value
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1); // Always adds 1 to current value
  }, 1000);
  return () => clearInterval(id);
}, []); // Safe — doesn't need count in deps
\`\`\`

### Pitfall 3: Initializing state from a prop that changes
\`\`\`jsx
// ❌ Stale initialization — stays stuck at initial prop value
function Input({ defaultValue }) {
  const [value, setValue] = useState(defaultValue);
  // If the parent changes defaultValue, this Input still shows old value
}

// ✅ If you need to reset when a specific prop changes, use key
function Parent() {
  const [userId, setUserId] = useState(1);
  // Changing key resets the Input completely
  return <Input key={userId} defaultValue={fetchedUser.name} />;
}
\`\`\`

### Pitfall 4: Creating objects/arrays in useState initial value (without lazy init)
\`\`\`jsx
// ❌ Array created fresh every render (wasteful, doesn't matter since only used once)
const [items, setItems] = useState([]);         // OK — [] is cheap

// ❌ Complex initialization runs every render
const [data, setData] = useState(processLargeDataSet()); // Expensive!

// ✅ Lazy init for expensive operations
const [data, setData] = useState(() => processLargeDataSet()); // Runs once
\`\`\``,

  codeExamples: [
    {
      title: 'Lazy initialization with localStorage',
      code: `function usePersistentState<T>(key: string, initialValue: T) {
  // Lazy initialization — reads localStorage once on mount
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Sync to localStorage whenever value changes
  const setAndPersist = (newValue: T | ((prev: T) => T)) => {
    setValue(prev => {
      const next = typeof newValue === 'function'
        ? (newValue as (prev: T) => T)(prev)
        : newValue;
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  };

  return [value, setAndPersist] as const;
}

// Usage — works exactly like useState but persists to localStorage
function Settings() {
  const [theme, setTheme] = usePersistentState('theme', 'dark');
  const [language, setLanguage] = usePersistentState('language', 'en');

  return (
    <div>
      <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
        Toggle Theme: {theme}
      </button>
    </div>
  );
}`,
      explanation:
        'Lazy initialization with a function prevents expensive localStorage reads on every render. The custom hook wraps useState and adds persistence, showing how useState can be the foundation for more complex patterns.',
    },
    {
      title: 'Complex state — multi-step form',
      code: `type Step = 'personal' | 'address' | 'payment' | 'review';

interface FormData {
  name: string;
  email: string;
  address: string;
  city: string;
  cardNumber: string;
}

function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const steps: Step[] = ['personal', 'address', 'payment', 'review'];
  const currentIndex = steps.indexOf(currentStep);
  const isLastStep = currentIndex === steps.length - 1;

  function updateField(field: keyof FormData, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }

  function goNext() {
    const stepErrors = validateStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    if (!isLastStep) {
      setCurrentStep(steps[currentIndex + 1]);
    } else {
      submitForm(formData);
    }
  }

  return (
    <div>
      <StepIndicator steps={steps} current={currentStep} />
      <StepContent
        step={currentStep}
        data={formData}
        errors={errors}
        onUpdate={updateField}
      />
      <div>
        {currentIndex > 0 && (
          <button onClick={() => setCurrentStep(steps[currentIndex - 1])}>
            Back
          </button>
        )}
        <button onClick={goNext}>
          {isLastStep ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
}`,
      explanation:
        'Multiple useState calls manage independent concerns: currentStep (navigation), formData (form values), errors (validation). They are kept separate because they change at different times for different reasons.',
    },
  ],

  commonMistakes: [
    'Not using functional updates when new state depends on previous state.',
    'Mutating state directly — push, splice, or direct property assignment do not trigger re-renders.',
    'Forgetting to spread nested objects — setUser({ ...user, address: { ...user.address, city } }).',
    'Using lazy initialization syntax wrong — useState(expensiveFn()) calls immediately; useState(expensiveFn) defers it.',
    'Reading state immediately after setting it — the update is asynchronous; the new value appears on the next render.',
  ],

  interviewQuestions: [
    {
      question: 'What is lazy initialization in useState?',
      answer:
        'Lazy initialization is passing a function to useState instead of a value. React calls this function once on mount to get the initial value, then ignores it on subsequent renders. Without lazy initialization, the expression in useState() evaluates on every render — for expensive operations like JSON.parse(localStorage.getItem(...)), this is wasteful. Syntax: useState(() => computeExpensiveValue()) — note the arrow function wrapper.',
      difficulty: 'intermediate',
    },
    {
      question: 'When does React NOT re-render after calling setState?',
      answer:
        'React uses Object.is comparison between old and new state. If they are the same reference (for objects/arrays) or same primitive value, React bails out and skips the re-render. This is why direct mutations do not work — mutating an array and setting the same reference does not trigger re-render. You must create a new reference (new object or array) for React to detect the change.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is the difference between useState(value) and useState(() => value)?',
      answer:
        'useState(value) evaluates the expression on every render but only uses the result on the first render. For cheap values this is fine. useState(() => value) evaluates the function only on the first render (lazy initialization). Use the function form for expensive initial values: reading from localStorage, parsing large data, or any computation that should run once.',
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'use-state-ex-1',
      title: 'Build an Undo/Redo Stack',
      description: 'Implement an undo/redo system using useState. Each action should push to the history stack. Undo/redo should navigate the stack.',
      starterCode: `function useUndoable<T>(initialValue: T) {
  // State: history array and current index
  // Implement: set (add to history), undo, redo, canUndo, canRedo
  // When you set a new value after undoing, clear the redo history

  const set = (value: T) => { /* TODO */ };
  const undo = () => { /* TODO */ };
  const redo = () => { /* TODO */ };

  return { value: initialValue, set, undo, redo, canUndo: false, canRedo: false };
}

// Test with:
function Counter() {
  const { value, set, undo, redo, canUndo, canRedo } = useUndoable(0);
  return (
    <div>
      <p>Count: {value}</p>
      <button onClick={() => set(value + 1)}>+1</button>
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
    </div>
  );
}`,
      solution: `function useUndoable<T>(initialValue: T) {
  const [history, setHistory] = useState<T[]>([initialValue]);
  const [index, setIndex] = useState(0);

  const value = history[index];
  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  const set = (newValue: T) => {
    setHistory(prev => {
      // When setting after undo, discard the redo history
      const newHistory = prev.slice(0, index + 1);
      return [...newHistory, newValue];
    });
    setIndex(prev => prev + 1);
  };

  const undo = () => {
    if (canUndo) setIndex(prev => prev - 1);
  };

  const redo = () => {
    if (canRedo) setIndex(prev => prev + 1);
  };

  return { value, set, undo, redo, canUndo, canRedo };
}`,
      hints: [
        'Store the full history as an array and track the current index',
        'set() adds to history and moves index forward',
        'undo/redo just change the index',
        'When setting after undo, slice history to discard future entries',
      ],
    },
  ],

  keyTakeaways: [
    'useState(initialValue) — initial value used only on first render. Use a function (lazy init) for expensive initial values.',
    'State setter can receive a value or a function. Use the function form (prev => ...) when new state depends on previous.',
    'State updates are asynchronous — the new value is not available until the next render.',
    'Object.is comparison: if old and new state are the same reference, React skips the re-render.',
    'Never mutate state directly. Spread objects, use map/filter/spread for arrays.',
    'Split into separate useState calls for independent values; one state object for values that change together.',
  ],

  nextLesson: 'use-effect',
  prevLesson: 'hooks-fundamentals',
};
