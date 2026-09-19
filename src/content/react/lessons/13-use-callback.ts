import type { Lesson } from '@/types';

export const useCallbackLesson: Lesson = {
  id: 'use-callback',
  slug: 'use-callback',
  title: 'useCallback',
  description:
    'Master function memoization with useCallback — when it prevents unnecessary re-renders, when it stabilizes effect dependencies, and when it is completely unnecessary.',
  category: 'Hooks',
  order: 13,
  difficulty: 'intermediate',
  estimatedTime: 18,
  content: `\`useCallback\` memoizes a function reference between renders. It returns the same function instance unless the specified dependencies change.

Just like \`useMemo\`, it is an optimization — not a requirement for correctness.

---

## The API

\`\`\`jsx
const memoizedFn = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
// Returns the same function reference when a and b are unchanged
// Returns a new function when a or b changes
\`\`\`

---

## The Problem It Solves

Every render of a React component creates new function references for all inline functions. This is fine — creating a function is cheap.

The problem arises when:
1. You pass a function as a prop to a **memoized child** (\`React.memo\`)
2. You use a function as a **\`useEffect\` dependency**

### Problem 1: Breaking React.memo

\`\`\`jsx
const MemoizedButton = React.memo(({ onClick, label }) => {
  console.log(\`Button "\${label}" rendered\`);
  return <button onClick={onClick}>{label}</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  // ❌ New function reference every render
  const handleSave = () => {
    saveData(count);
  };

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      {/* MemoizedButton re-renders on every count change
          because handleSave is a new function each time */}
      <MemoizedButton onClick={handleSave} label="Save" />
    </div>
  );
}
\`\`\`

Every time count changes, \`handleSave\` is a new function. \`MemoizedButton\` sees a new prop → re-renders → \`React.memo\` is useless.

### Fix with useCallback

\`\`\`jsx
function Parent() {
  const [count, setCount] = useState(0);

  // ✅ Same function reference unless count changes
  const handleSave = useCallback(() => {
    saveData(count);
  }, [count]); // Re-creates when count changes (needed — uses count in the body)

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      {/* MemoizedButton now only re-renders when handleSave actually changes */}
      <MemoizedButton onClick={handleSave} label="Save" />
    </div>
  );
}
\`\`\`

---

### Problem 2: Infinite loops in useEffect

\`\`\`jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  // ❌ New function reference every render
  const loadUser = async () => {
    const data = await fetchUser(userId);
    setUser(data);
  };

  // Including loadUser in deps → infinite loop
  useEffect(() => {
    loadUser();
  }, [loadUser]); // loadUser recreated → effect runs → state update → re-render → loadUser recreated → ...

  return <div>{user?.name}</div>;
}
\`\`\`

\`\`\`jsx
// Fix option 1: Move the function inside useEffect
useEffect(() => {
  async function load() {
    const data = await fetchUser(userId);
    setUser(data);
  }
  load();
}, [userId]); // Only depends on userId

// Fix option 2: useCallback to stabilize
const loadUser = useCallback(async () => {
  const data = await fetchUser(userId);
  setUser(data);
}, [userId]); // Same function unless userId changes

useEffect(() => {
  loadUser();
}, [loadUser]); // Now only runs when userId changes
\`\`\`

**Option 1 (inline function in useEffect) is usually cleaner.** Option 2 is useful when the function is also needed elsewhere (passed to a button, for example).

---

## When NOT to Use useCallback

\`\`\`jsx
// ❌ Pointless — the child is not memoized
<button onClick={useCallback(() => setOpen(true), [])}>Open</button>
// Without React.memo on the button, it re-renders anyway

// ❌ Pointless — event handler is only used in JSX
function Form() {
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    submitForm(data);
  }, [data]);
  // handleSubmit is only passed to the form's onSubmit
  // The <form> element always renders — no React.memo here
  // useCallback adds no value
  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}

// ✅ Useful — child is memoized AND function passed as prop
const ExpensiveChild = React.memo(({ onAction }) => {
  // expensive rendering...
});

function Parent() {
  const onAction = useCallback(() => dispatch({ type: 'ACTION' }), [dispatch]);
  return <ExpensiveChild onAction={onAction} />;
}
\`\`\`

**Rules for using useCallback:**
1. The function is passed to a component wrapped in \`React.memo\`
2. The function is in a \`useEffect\` dependency array
3. The function is passed as a dependency to \`useMemo\`

---

## useCallback with Empty Dependencies

When a function does not use any reactive values from the component, the dependency array is empty:

\`\`\`jsx
// This function only uses its parameters — no component scope values
const handleClose = useCallback(() => {
  setOpen(false);
}, []); // Empty — setOpen is a stable state setter, never changes

// React guarantees that setState functions are stable references
// You do not need to include them in useCallback deps
\`\`\`

React guarantees that \`setState\` functions (from \`useState\`) are stable — they never change between renders. You do not need to include them in dependency arrays.

---

## The Complete Pattern: React.memo + useCallback

For a memoized component to actually avoid re-renders, **all of its props must be stable**:

\`\`\`jsx
interface SearchResultsProps {
  query: string;
  onResultClick: (id: string) => void;
  onLoadMore: () => void;
}

// Memoized — only re-renders if props change
const SearchResults = React.memo(({ query, onResultClick, onLoadMore }: SearchResultsProps) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    searchApi(query).then(setResults);
  }, [query]);

  return (
    <ul>
      {results.map(r => (
        <li key={r.id} onClick={() => onResultClick(r.id)}>{r.title}</li>
      ))}
      <button onClick={onLoadMore}>Load more</button>
    </ul>
  );
});

function SearchPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  // ✅ Stable references — SearchResults memo works correctly
  const handleResultClick = useCallback((id: string) => {
    navigate(\`/item/\${id}\`);
  }, []); // navigate is stable

  const handleLoadMore = useCallback(() => {
    setPage(p => p + 1); // Functional update — doesn't need page in deps
  }, []);

  return (
    <div>
      <input value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} />
      <SearchResults
        query={query}
        onResultClick={handleResultClick}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
\`\`\`

---

## The Three-Part Memoization Trio

| Tool | Memoizes | Use when |
|------|---------|---------|
| \`React.memo\` | Component renders | Child has expensive rendering |
| \`useMemo\` | Computed values | Expensive computation or stable reference needed |
| \`useCallback\` | Function references | Function passed to React.memo child or in useEffect deps |

All three work together. \`React.memo\` without \`useCallback\` for functions is often useless.`,

  codeExamples: [
    {
      title: 'The full memoization picture — React.memo + useCallback + useMemo',
      code: `interface DataTableProps {
  data: Row[];
  onSort: (column: string) => void;
  onFilter: (query: string) => void;
  columns: Column[];
}

// Memoized — expensive table rendering
const DataTable = React.memo(({ data, onSort, onFilter, columns }: DataTableProps) => {
  return (/* expensive table rendering */);
});

function ReportPage({ rawData }) {
  const [sortColumn, setSortColumn] = useState('name');
  const [filterQuery, setFilterQuery] = useState('');
  const [highlightedId, setHighlightedId] = useState(null);

  // useMemo: stabilize computed data
  const processedData = useMemo(() =>
    rawData
      .filter(row => row.name.includes(filterQuery))
      .sort((a, b) => a[sortColumn].localeCompare(b[sortColumn])),
    [rawData, filterQuery, sortColumn]
  );

  // useMemo: stabilize the columns array (doesn't change)
  const columns = useMemo(() => [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'revenue', label: 'Revenue' },
  ], []);

  // useCallback: stabilize event handler functions
  const handleSort = useCallback((column: string) => {
    setSortColumn(column);
  }, []); // No reactive deps — setSortColumn is always stable

  const handleFilter = useCallback((query: string) => {
    setFilterQuery(query);
  }, []);

  // highlightedId changes don't affect DataTable props
  // → DataTable does NOT re-render when user highlights a row in a sidebar
  return (
    <div>
      <Sidebar onHighlight={setHighlightedId} />
      <DataTable
        data={processedData}
        onSort={handleSort}
        onFilter={handleFilter}
        columns={columns}
      />
    </div>
  );
}`,
      explanation:
        'Three layers working together: React.memo prevents DataTable from re-rendering when only highlightedId changes. useMemo ensures processedData and columns are stable references. useCallback ensures onSort and onFilter are stable references. Without all three aligned, DataTable would re-render on every highlightedId change.',
    },
  ],

  commonMistakes: [
    'Using useCallback for every function — only useful when passed to React.memo children or in useEffect deps.',
    'Using useCallback without React.memo on the child — the child re-renders anyway, useCallback does nothing.',
    'Missing dependencies in useCallback — same stale closure problem as useEffect.',
    'Thinking useCallback is always needed for useEffect functions — moving the function inside useEffect is often cleaner.',
  ],

  interviewQuestions: [
    {
      question: 'When should you use useCallback?',
      answer:
        'Use useCallback in two situations: (1) The function is passed as a prop to a component wrapped in React.memo — without stable function references, React.memo cannot prevent re-renders since function props change every render; (2) The function is in a useEffect dependency array — unstable function references cause infinite loops in effects. Do not use useCallback for functions only used in JSX event handlers on native elements (div, button) — those elements always re-render anyway.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is the difference between useMemo and useCallback?',
      answer:
        'useMemo memoizes a value — the result of running a function. useCallback memoizes a function itself — the function reference. useCallback(fn, deps) is equivalent to useMemo(() => fn, deps). Use useMemo for expensive computations you want to cache. Use useCallback when you need a stable function reference (for memoized children or effect dependencies).',
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'use-callback-ex-1',
      title: 'Make React.memo Actually Work',
      description: 'The memoized ListItem re-renders on every parent render despite React.memo. Fix it with useCallback.',
      starterCode: `const ListItem = React.memo(({ item, onDelete, onToggle }) => {
  console.log(\`ListItem \${item.id} rendered\`);
  return (
    <li>
      <span style={{ textDecoration: item.done ? 'line-through' : 'none' }}>
        {item.text}
      </span>
      <button onClick={() => onToggle(item.id)}>Toggle</button>
      <button onClick={() => onDelete(item.id)}>Delete</button>
    </li>
  );
});

function TodoList() {
  const [items, setItems] = useState([
    { id: 1, text: 'Learn React', done: false },
    { id: 2, text: 'Build something', done: false },
  ]);
  const [count, setCount] = useState(0);

  // PROBLEM: New function references every render
  const handleDelete = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleToggle = (id) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, done: !item.done } : item
    ));
  };

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Other state: {count}</button>
      <ul>
        {items.map(item => (
          <ListItem
            key={item.id}
            item={item}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        ))}
      </ul>
    </div>
  );
}`,
      solution: `function TodoList() {
  const [items, setItems] = useState([
    { id: 1, text: 'Learn React', done: false },
    { id: 2, text: 'Build something', done: false },
  ]);
  const [count, setCount] = useState(0);

  // ✅ Stable function references — ListItem memo now works
  const handleDelete = useCallback((id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []); // No reactive deps — only uses functional setter

  const handleToggle = useCallback((id: number) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, done: !item.done } : item
    ));
  }, []); // No reactive deps — only uses functional setter

  // Now clicking "Other state" does NOT cause ListItem to re-render
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Other state: {count}</button>
      <ul>
        {items.map(item => (
          <ListItem
            key={item.id}
            item={item}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        ))}
      </ul>
    </div>
  );
}`,
      hints: [
        'Wrap handleDelete and handleToggle in useCallback',
        'Both use functional setItems updates — they don\'t need items in their closure',
        'Empty dep arrays are correct here — the setters are always stable',
      ],
    },
  ],

  keyTakeaways: [
    'useCallback memoizes a function reference — returns the same function instance unless dependencies change.',
    'Use it when: (1) passing functions to React.memo children, (2) functions are in useEffect dependency arrays.',
    'Do NOT use it for every function — only beneficial when the function\'s reference stability matters.',
    'React.memo + useCallback work as a pair. React.memo without stable callbacks is often useless.',
    'setState functions from useState are always stable — no need to include in useCallback deps or useEffect deps.',
    'Moving functions inside useEffect is often cleaner than useCallback for effect-only functions.',
  ],

  nextLesson: 'custom-hooks',
  prevLesson: 'use-memo',
};
