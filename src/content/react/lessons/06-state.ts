import type { Lesson } from '@/types';

export const stateLesson: Lesson = {
  id: 'state',
  slug: 'state',
  title: 'State',
  description:
    'One of the most important modules. Understand what state is, local vs derived state, how state updates work, state architecture, and the most common mistakes that cause bugs.',
  category: 'State Management',
  order: 6,
  difficulty: 'beginner',
  estimatedTime: 30,
  content: `State is the most important concept in React. State is **data that changes over time and drives the UI**. When state changes, React re-renders the component to reflect the new data.

Understanding state deeply — not just "how to use useState" — is what separates good React developers from average ones.

---

## What State Is

State is any data in your application that:
1. **Can change** over time
2. **Affects the UI** when it changes
3. **Cannot be computed** from other values (if it can, it is derived state)

Examples of state:
- The current user (logged in or not)
- A list of fetched posts
- Whether a modal is open
- The text in an input field
- The current page number
- Which tab is selected

Examples of things that are **not** state:
- Constants that never change
- Values derived from state (\`filteredPosts = posts.filter()\` — this is derived from \`posts\` state)
- React refs (they persist but do not cause re-renders)

---

## What Happens When State Updates

When you call a state setter function, React schedules a re-render:

1. You call \`setCount(count + 1)\`
2. React queues the state update
3. React re-renders the component (calls the function again)
4. The component returns new JSX with the updated \`count\`
5. React updates the DOM

**Critical**: The state update does not happen immediately. The new value is not available on the next line after the setter call.

\`\`\`jsx
const [count, setCount] = useState(0);

function handleClick() {
  setCount(count + 1);
  console.log(count); // Still 0! The update is queued, not immediate
}

// You will see the new value on the NEXT render, not immediately after calling setCount
\`\`\`

---

## State Updates Are Snapshots

React state works like **snapshots**. When a component renders, it captures the state value at that moment. That snapshot is what every event handler in that render uses.

\`\`\`jsx
const [count, setCount] = useState(0);

function handleTripleClick() {
  // All three of these use the SAME snapshot (count = 0)
  setCount(count + 1); // setCount(0 + 1) → requests 1
  setCount(count + 1); // setCount(0 + 1) → requests 1 (again!)
  setCount(count + 1); // setCount(0 + 1) → requests 1 (again!)
  // Result: count becomes 1, not 3
}
\`\`\`

To update state based on the previous value, use the **functional update pattern**:

\`\`\`jsx
function handleTripleClick() {
  // Each of these receives the LATEST state, not the snapshot
  setCount(prev => prev + 1); // 0 → 1
  setCount(prev => prev + 1); // 1 → 2
  setCount(prev => prev + 1); // 2 → 3
  // Result: count becomes 3 ✅
}
\`\`\`

**Always use the functional pattern** when the new state depends on the old state.

---

## State Batching

React batches multiple state updates from the same event handler into a single re-render (React 18+):

\`\`\`jsx
function handleSubmit() {
  setLoading(true);
  setError(null);
  setData(null);
  // These three setters are batched — one re-render happens, not three
}
\`\`\`

This is an optimization — no need to worry about causing too many re-renders from a single event handler.

---

## Local State

Local state lives in one component and is not shared with others. Use \`useState\` for local state.

\`\`\`jsx
function Accordion({ items }) {
  // openIndex is local — the Accordion manages it internally
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div>
      {items.map((item, i) => (
        <div key={item.id}>
          <button onClick={() => setOpenIndex(openIndex === i ? null : i)}>
            {item.title}
          </button>
          {openIndex === i && <p>{item.content}</p>}
        </div>
      ))}
    </div>
  );
}
\`\`\`

The parent that uses \`<Accordion>\` does not need to know which item is open — it is an internal detail.

---

## Derived State

Derived state is a value you can compute from existing state or props. **Do not duplicate it in state.**

\`\`\`jsx
// ❌ Wrong — firstName and lastName are in state, and fullName is derived
// but stored in state too. Duplication → risk of getting out of sync.
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [fullName, setFullName] = useState(''); // ❌ Redundant

// You now have to remember to update fullName every time either part changes

// ✅ Correct — derive it at render time
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const fullName = \`\${firstName} \${lastName}\`; // Derived during render — always in sync
\`\`\`

**Rule:** If a value can be computed from other state or props, compute it. Do not store it in state.

More examples of derived state:
\`\`\`jsx
const [todos, setTodos] = useState([]);
const [filter, setFilter] = useState('all');

// Derived — not stored in state
const filteredTodos = todos.filter(todo => {
  if (filter === 'active') return !todo.completed;
  if (filter === 'completed') return todo.completed;
  return true;
});

const completedCount = todos.filter(t => t.completed).length; // Derived
const hasCompletedTodos = completedCount > 0; // Derived
\`\`\`

---

## State Architecture

Where should state live? Apply this thought process:

1. **Identify which components need this state**
2. **Find their closest common ancestor**
3. **Put the state there**

\`\`\`
If only one component needs it → local state in that component
If a parent and child need it → parent's state, passed as prop
If two siblings need it → lifted to their parent
If deeply nested components need it → Context API or state management
\`\`\`

**Signs state is in the wrong place:**
- You are passing a prop down 5+ levels (prop drilling) — lift it higher or use Context
- Two components show the same data but get out of sync — they each have their own state. Single source of truth needed.
- A component changes its own props — not possible. That data should be state in the parent.

---

## State Update Patterns for Objects and Arrays

React state updates must be **immutable**. You cannot mutate state directly — you must create a new value.

### Updating objects

\`\`\`jsx
const [user, setUser] = useState({ name: 'Alice', age: 30, role: 'admin' });

// ❌ Wrong — mutates the existing state object
function handleAgeChange(newAge) {
  user.age = newAge; // Mutation! React won't detect this change
  setUser(user);     // Same reference → no re-render
}

// ✅ Correct — create a new object with the spread operator
function handleAgeChange(newAge) {
  setUser(prev => ({ ...prev, age: newAge }));
  // Creates a new object with all old properties, age overwritten
}
\`\`\`

### Updating arrays

\`\`\`jsx
const [items, setItems] = useState([]);

// ✅ Adding an item
setItems(prev => [...prev, newItem]);

// ✅ Removing an item
setItems(prev => prev.filter(item => item.id !== targetId));

// ✅ Updating an item
setItems(prev =>
  prev.map(item =>
    item.id === targetId ? { ...item, ...updates } : item
  )
);

// ❌ Wrong — mutates the array
items.push(newItem);    // Direct mutation
items.splice(0, 1);    // Direct mutation
setItems(items);        // Same reference → no re-render
\`\`\`

---

## Common State Mistakes

### Mistake 1: Using state when a regular variable would work

\`\`\`jsx
// ❌ Unnecessary state
function Timer() {
  const [intervalId, setIntervalId] = useState(null); // intervalId doesn't affect UI
  // ...
}

// ✅ Use a ref for values that don't affect rendering
function Timer() {
  const intervalId = useRef(null); // Persists without causing re-renders
}
\`\`\`

### Mistake 2: Redundant state from props

\`\`\`jsx
// ❌ Copying props into state
function UserProfile({ user }) {
  const [name, setName] = useState(user.name); // Copies prop to state

  // Problem: if the parent passes a new user, name is stuck on the old value
}

// ✅ Use the prop directly unless you need to edit it locally
function UserProfile({ user }) {
  return <h1>{user.name}</h1>; // Just use the prop
}

// If you genuinely need a local copy to edit:
function EditableUserProfile({ user, onSave }) {
  const [localName, setLocalName] = useState(user.name);
  // key the component to reset when user.id changes
}
\`\`\`

### Mistake 3: Not using functional updates

\`\`\`jsx
// ❌ Stale closure — if called multiple times, loses updates
function addMultiple() {
  setCount(count + 1);
  setCount(count + 1); // Both use the same stale count
}

// ✅ Always use functional update when state depends on previous state
function addMultiple() {
  setCount(c => c + 1);
  setCount(c => c + 1); // Each gets the latest c
}
\`\`\``,

  codeExamples: [
    {
      title: 'Complete state example — shopping cart',
      code: `interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

function ShoppingCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  // Derived state — never stored, always computed
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isEmpty = items.length === 0;

  function addItem(product: { id: string; name: string; price: number }) {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        // Update quantity — create new array with updated item
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Add new item — create new array with new item appended
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(item => item.id !== id));
  }

  function clearCart() {
    setItems([]); // Replace with empty array
  }

  return (
    <div>
      <h2>Cart ({totalItems} items)</h2>
      {isEmpty && <p>Your cart is empty</p>}
      {items.map(item => (
        <div key={item.id}>
          <span>{item.name} × {item.quantity}</span>
          <span>\${(item.price * item.quantity).toFixed(2)}</span>
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      {!isEmpty && (
        <>
          <p>Total: \${totalPrice.toFixed(2)}</p>
          <button onClick={clearCart}>Clear Cart</button>
        </>
      )}
    </div>
  );
}`,
      explanation:
        'All state updates are immutable — spread for objects, map/filter for arrays. totalItems, totalPrice, and isEmpty are derived values, not state. The functional update pattern (prev => ...) ensures updates are based on the latest state.',
    },
    {
      title: 'State snapshot problem — the classic bug',
      code: `// Classic interview scenario: why does this not work?
function BuggyCounter() {
  const [count, setCount] = useState(0);

  function handleTripleIncrement() {
    // These all capture count = 0 from this render's snapshot
    setCount(count + 1); // setCount(1)
    setCount(count + 1); // setCount(1) — same thing!
    setCount(count + 1); // setCount(1) — same thing!
    // count is 1 after this, not 3
  }

  return (
    <div>
      <p>{count}</p>
      <button onClick={handleTripleIncrement}>+3</button>
    </div>
  );
}

// Fixed with functional updates
function FixedCounter() {
  const [count, setCount] = useState(0);

  function handleTripleIncrement() {
    setCount(prev => prev + 1); // 0 → 1
    setCount(prev => prev + 1); // 1 → 2
    setCount(prev => prev + 1); // 2 → 3
    // count is 3 ✅
  }

  return (
    <div>
      <p>{count}</p>
      <button onClick={handleTripleIncrement}>+3</button>
    </div>
  );
}`,
      explanation:
        'The snapshot problem is one of the most asked React interview questions. Each render has its own snapshot of state. Multiple setCount(count + 1) in one handler all use the same snapshot. The functional update setCount(prev => prev + 1) always gets the most recent value from the queue.',
    },
    {
      title: 'Immutable state updates — objects and arrays',
      code: `interface FormState {
  name: string;
  email: string;
  address: {
    city: string;
    country: string;
  };
  tags: string[];
}

function ProfileForm() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    address: { city: '', country: '' },
    tags: [],
  });

  // Update a top-level field
  function updateField(field: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  // Update a nested field
  function updateAddress(field: 'city' | 'country', value: string) {
    setForm(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  }

  // Add to array
  function addTag(tag: string) {
    setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
  }

  // Remove from array
  function removeTag(tag: string) {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  }

  return (/* form JSX */);
}`,
      explanation:
        'Each update creates a new state object, never mutating the existing one. For nested updates, you must spread at every level. For arrays: spread + push equivalent for adding, filter for removing, map for updating.',
    },
  ],

  commonMistakes: [
    'Mutating state directly — setting array[0] = value or object.prop = value does not trigger re-render. React compares references.',
    'Using state when derived state (computed value) is the right tool — leads to synchronization bugs.',
    'Not using functional updates when new state depends on previous state — leads to stale closure bugs.',
    'Initializing state with a prop and then not updating it when the prop changes (stale state copy).',
    'Over-using state — not every value needs to be state. Constants, refs, and derived values do not belong in state.',
    'Placing state too high or too low in the component tree — too high causes unnecessary re-renders; too low prevents sharing.',
  ],

  interviewQuestions: [
    {
      question: 'What is a state snapshot in React?',
      answer:
        'Each render captures a snapshot of state values. Event handlers created during a render use those snapshot values — not the latest state. This means if you call setCount(count + 1) three times in one event handler, all three calls use the same initial count. Use functional updates (setCount(prev => prev + 1)) to always work with the most recent state value, bypassing the snapshot limitation.',
      difficulty: 'intermediate',
      tip: 'This is one of the most common React interview questions. Know the snapshot concept and the functional update solution.',
    },
    {
      question: 'What is derived state and when should you use it?',
      answer:
        'Derived state is any value that can be computed from existing state or props. You should derive it at render time (simple computation) rather than storing it as separate state. Storing derived state creates duplication and synchronization risk — two pieces of state can get out of sync. The rule: if it can be computed, compute it. Only store values in state that cannot be derived.',
      difficulty: 'intermediate',
    },
    {
      question: 'Why must React state updates be immutable?',
      answer:
        'React detects state changes by comparing references, not by deep equality. If you mutate an existing object or array and pass the same reference to setState, React sees the same reference and skips the re-render. Immutable updates always create new references, ensuring React detects the change and re-renders. Additionally, immutable updates make state history predictable (useful for undo/redo, debugging with React DevTools).',
      difficulty: 'intermediate',
    },
    {
      question: 'What is state batching?',
      answer:
        'State batching is React\'s optimization of combining multiple setState calls from the same event handler into a single re-render. In React 18, batching applies everywhere (event handlers, setTimeout, promises, native events). In React 17 and earlier, batching only applied to React event handlers. Batching prevents unnecessary intermediate renders when multiple state values are updated together.',
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'state-ex-1',
      title: 'Build a Todo List with State',
      description: 'Build a todo app with add, toggle complete, and delete. Use immutable updates. Show derived stats.',
      starterCode: `interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  // TODO: implement addTodo, toggleTodo, deleteTodo
  // TODO: derive completedCount and activeCount from todos
  // TODO: render the list with stats

  return (
    <div>
      {/* TODO: form for adding todos */}
      {/* TODO: list of todos with toggle and delete */}
      {/* TODO: show "X completed, Y active" */}
    </div>
  );
}`,
      solution: `function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [nextId, setNextId] = useState(1);

  // Derived state — not stored
  const completedCount = todos.filter(t => t.completed).length;
  const activeCount = todos.length - completedCount;

  function addTodo() {
    if (!input.trim()) return;
    setTodos(prev => [...prev, { id: nextId, text: input.trim(), completed: false }]);
    setNextId(n => n + 1);
    setInput('');
  }

  function toggleTodo(id: number) {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function deleteTodo(id: number) {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }

  return (
    <div>
      <p>{completedCount} completed, {activeCount} active</p>
      <form onSubmit={e => { e.preventDefault(); addTodo(); }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Add todo..." />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            <button onClick={() => toggleTodo(todo.id)}>
              {todo.completed ? '✓' : '○'}
            </button>
            {todo.text}
            <button onClick={() => deleteTodo(todo.id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
      hints: [
        'Use [...prev, newItem] to add to an array',
        'Use prev.map() to update one item — return a new object with spread',
        'Use prev.filter() to remove an item',
        'Derive counts from todos — do not store them as state',
      ],
    },
  ],

  keyTakeaways: [
    'State is data that changes over time and causes re-renders. If a value can be derived from other state, compute it — do not store it.',
    'State updates are asynchronous — the new value is not available immediately after calling the setter.',
    'State captures a snapshot per render. Multiple setX(value) calls in one handler use the same snapshot. Use setX(prev => ...) when new state depends on previous.',
    'State updates must be immutable — create new objects and arrays, never mutate existing ones.',
    'React 18 batches all state updates into a single re-render per event handler.',
    'State should live at the lowest common ancestor of all components that need it.',
  ],

  nextLesson: 'event-handling',
  prevLesson: 'props',
};
