import type { Lesson } from '@/types';

export const useMemoLesson: Lesson = {
  id: 'use-memo',
  slug: 'use-memo',
  title: 'useMemo',
  description:
    'Understand memoization in React — when useMemo prevents expensive recalculations, when it stabilizes references, when NOT to use it, and how to measure before optimizing.',
  category: 'Hooks',
  order: 12,
  difficulty: 'intermediate',
  estimatedTime: 20,
  content: `\`useMemo\` caches the result of a computation between renders. It only recomputes when the specified dependencies change.

The key word is **caches** — \`useMemo\` is an optimization tool, not a correctness tool. Your app should work without it. \`useMemo\` makes it faster.

---

## The API

\`\`\`jsx
const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

// On first render: runs the function, caches the result
// On subsequent renders: returns cached result if a and b haven't changed
// If a or b changes: re-runs the function, caches new result
\`\`\`

---

## What is Memoization?

Memoization is a performance technique where you cache the return value of a function for a given set of inputs. If the function is called again with the same inputs, return the cached result without re-running.

\`\`\`
First call: computeSort([3,1,2]) → sorts → [1,2,3] → cache {[3,1,2]: [1,2,3]}
Second call: computeSort([3,1,2]) → same input → return [1,2,3] from cache
Third call: computeSort([5,2,4]) → different input → sorts → [2,4,5] → cache
\`\`\`

\`useMemo\` applies this to React render cycles.

---

## When to Use useMemo

### Use Case 1: Expensive computations

If a computation takes significant time and its inputs do not change on every render, memoize it:

\`\`\`jsx
function ProductAnalytics({ products, dateRange }) {
  // This computation processes thousands of items
  const analytics = useMemo(() => {
    return products
      .filter(p => isInDateRange(p.date, dateRange))
      .reduce((acc, product) => ({
        totalRevenue: acc.totalRevenue + product.price * product.quantity,
        topCategories: updateCategories(acc.topCategories, product),
        averageOrderValue: acc.totalRevenue / acc.count,
        count: acc.count + 1,
      }), { totalRevenue: 0, topCategories: {}, averageOrderValue: 0, count: 0 });
  }, [products, dateRange]); // Only recompute when products or dateRange changes

  return <AnalyticsDashboard data={analytics} />;
}
\`\`\`

Without \`useMemo\`, this computation runs on every render — even if the parent re-renders for an unrelated reason (e.g., a header animation update).

### Use Case 2: Stabilizing references for child components

Objects and arrays are recreated on every render. If a child component uses \`React.memo\` to avoid re-renders, it will still re-render if it receives a new object/array reference even with the same values.

\`\`\`jsx
function Parent({ userId, includeDetails }) {
  // ❌ New object every render — breaks React.memo in child
  const options = { userId, includeDetails };

  // ✅ Stable reference — only new when inputs change
  const options = useMemo(
    () => ({ userId, includeDetails }),
    [userId, includeDetails]
  );

  return <DataFetcher options={options} />;
}

// DataFetcher with React.memo — only re-renders if props change
const DataFetcher = React.memo(({ options }) => {
  // ...
});
\`\`\`

---

## When NOT to Use useMemo

\`useMemo\` has a cost:
1. Memory — stores the cached value
2. Complexity — harder to read
3. Comparison overhead — React has to compare dependencies on every render

### Do NOT use for cheap operations

\`\`\`jsx
// ❌ Pointless — adding two numbers is cheaper than the memoization overhead
const total = useMemo(() => price + tax, [price, tax]);
// ✅ Just compute directly
const total = price + tax;

// ❌ Pointless — string concatenation is trivial
const fullName = useMemo(() => \`\${firstName} \${lastName}\`, [firstName, lastName]);
// ✅ Just compute directly
const fullName = \`\${firstName} \${lastName}\`;

// ❌ Pointless — filtering a 5-item array is trivial
const activeItems = useMemo(() =>
  items.filter(i => i.active), [items]
);
// ✅ Only add useMemo if items has thousands of entries
const activeItems = items.filter(i => i.active);
\`\`\`

### Do NOT use for everything "just in case"

A very common anti-pattern is wrapping every computed value in \`useMemo\` to "be safe." This adds noise and complexity without measurable benefit.

**Rule: Measure first, optimize second.** Use the React Profiler or browser DevTools to identify actual performance bottlenecks before adding \`useMemo\`.

---

## Reference Stability

One of the most important uses of \`useMemo\` is for reference stability — ensuring an object or array has the same JavaScript reference when its content has not changed.

\`\`\`jsx
// Every render, filters is a NEW object — even if values are the same
const filters = { category, priceRange, inStock };

// useEffect with filters in deps → runs on every render
useEffect(() => {
  fetchProducts(filters);
}, [filters]); // ❌ filters is always new → infinite loop

// Fix: Memoize filters
const filters = useMemo(
  () => ({ category, priceRange, inStock }),
  [category, priceRange, inStock]
);

// Now filters is stable → effect only runs when actual values change
useEffect(() => {
  fetchProducts(filters);
}, [filters]); // ✅
\`\`\`

---

## useMemo vs useCallback

Both memoize. The difference is what they memoize:

\`\`\`jsx
// useMemo: memoizes a VALUE (the result of a computation)
const sortedList = useMemo(() => [...items].sort(), [items]);
// Returns: the sorted array

// useCallback: memoizes a FUNCTION (the function reference itself)
const handleSort = useCallback(() => {
  setSorted(prev => !prev);
}, []);
// Returns: the same function reference between renders

// useMemo can replicate useCallback:
const handleSort = useMemo(() => () => {
  setSorted(prev => !prev);
}, []);
// Both return the same stable function reference
// useCallback is syntactic sugar for this pattern
\`\`\`

---

## How to Measure Before Optimizing

### Method 1: React Profiler (DevTools)

1. Open React DevTools → Profiler tab
2. Record a session while interacting with the UI
3. Look for components that render unnecessarily often or take long
4. Add \`useMemo\` only where you see a real problem

### Method 2: console.time

\`\`\`jsx
function Component({ data }) {
  console.time('expensive-calculation');
  const result = expensiveCalculation(data); // Time this
  console.timeEnd('expensive-calculation');
  // If this logs < 1ms, useMemo is not needed
}
\`\`\`

If the computation takes less than 1ms, \`useMemo\` will not provide a noticeable improvement for users.

---

## Practical Pattern: Memoized Filters and Sorted Data

\`\`\`tsx
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

interface Filters {
  category: string | null;
  maxPrice: number;
  inStockOnly: boolean;
  sortBy: 'name' | 'price';
}

function ProductList({ products }: { products: Product[] }) {
  const [filters, setFilters] = useState<Filters>({
    category: null,
    maxPrice: Infinity,
    inStockOnly: false,
    sortBy: 'name',
  });

  // Memoize the derived data — only recompute when products or filters change
  const processedProducts = useMemo(() => {
    let result = [...products];

    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }
    if (filters.inStockOnly) {
      result = result.filter(p => p.inStock);
    }
    result = result.filter(p => p.price <= filters.maxPrice);

    result.sort((a, b) =>
      filters.sortBy === 'price'
        ? a.price - b.price
        : a.name.localeCompare(b.name)
    );

    return result;
  }, [products, filters]);

  return (
    <div>
      <FilterBar filters={filters} onChange={setFilters} />
      <p>{processedProducts.length} products</p>
      <div className="grid">
        {processedProducts.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
\`\`\`

This is the ideal use case: a large dataset undergoing multiple filter and sort operations. Without \`useMemo\`, this runs on every render — every time the parent updates, every scroll event that causes a parent to update. With \`useMemo\`, it only runs when the actual data or filters change.`,

  codeExamples: [
    {
      title: 'useMemo for reference stability with child memoization',
      code: `// DataGrid is an expensive component — React.memo prevents unnecessary re-renders
const DataGrid = React.memo(({ columns, rows, onRowClick }) => {
  console.log('DataGrid rendered');
  // Expensive rendering...
  return (/* table JSX */);
});

function Dashboard({ users, currentTheme }) {
  const [selectedId, setSelectedId] = useState(null);

  // ❌ Without useMemo: new array every render → DataGrid re-renders on every theme change
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
  ];

  // ✅ With useMemo: same reference → DataGrid does NOT re-render when theme changes
  const columns = useMemo(() => [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
  ], []); // Empty deps — columns never change

  return (
    <div className={currentTheme}>
      <DataGrid
        columns={columns}
        rows={users}
        onRowClick={setSelectedId}
      />
    </div>
  );
}`,
      explanation:
        'currentTheme changes do not change the columns data, but without useMemo, columns is a new array reference on every render. React.memo on DataGrid compares props by reference — new array = re-render. useMemo gives columns a stable reference, so DataGrid correctly skips re-renders when only the theme changes.',
    },
  ],

  commonMistakes: [
    'Memoizing cheap computations — useMemo has overhead. Only use it for genuinely expensive operations.',
    'Memoizing everything "just in case" — adds noise and complexity without benefit for fast operations.',
    'Missing dependencies in the useMemo array — stale cached values that do not update when they should.',
    'Using useMemo for correctness rather than performance — the code should work without it.',
    'Not profiling before optimizing — add useMemo only where you measure an actual performance problem.',
  ],

  interviewQuestions: [
    {
      question: 'What is useMemo and when should you use it?',
      answer:
        'useMemo caches the result of a computation between renders, recomputing only when specified dependencies change. Use it for: (1) Expensive computations that run on every render but whose inputs rarely change; (2) Stabilizing object/array references so memoized child components (React.memo) don\'t re-render unnecessarily. Do not use it for trivial computations — the memoization overhead can exceed the computation cost. Always measure with the React Profiler before adding useMemo.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is the difference between useMemo and useCallback?',
      answer:
        'Both memoize across renders. useMemo memoizes a computed VALUE — it returns the result of a function. useCallback memoizes a FUNCTION REFERENCE — it returns the same function instance between renders. useCallback(fn, deps) is equivalent to useMemo(() => fn, deps). Use useMemo for expensive computed values or stable references for props. Use useCallback for event handlers passed to memoized children.',
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'use-memo-ex-1',
      title: 'Optimize a Filter + Sort Pipeline',
      description: 'This component re-processes all 10,000 items on every keystroke in the search box. Use useMemo to optimize.',
      starterCode: `function ItemList({ items }: { items: Item[] }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');
  const [minPrice, setMinPrice] = useState(0);

  // PROBLEM: This runs on every render — including search input onChange
  const processedItems = items
    .filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      item.price >= minPrice
    )
    .sort((a, b) =>
      sortBy === 'price' ? a.price - b.price : a.name.localeCompare(b.name)
    );

  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      {/* filters UI */}
      <p>{processedItems.length} items</p>
      {processedItems.map(item => <ItemCard key={item.id} item={item} />)}
    </div>
  );
}`,
      solution: `function ItemList({ items }: { items: Item[] }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');
  const [minPrice, setMinPrice] = useState(0);

  // Only re-process when actual dependencies change
  const processedItems = useMemo(() => {
    return items
      .filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        item.price >= minPrice
      )
      .sort((a, b) =>
        sortBy === 'price' ? a.price - b.price : a.name.localeCompare(b.name)
      );
  }, [items, search, sortBy, minPrice]);

  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      <p>{processedItems.length} items</p>
      {processedItems.map(item => <ItemCard key={item.id} item={item} />)}
    </div>
  );
}`,
      hints: [
        'Wrap the filter/sort pipeline in useMemo',
        'All values used inside (items, search, sortBy, minPrice) must be in the deps array',
        'On each keystroke, search changes → useMemo recomputes (correct behavior, but now only when needed)',
      ],
    },
  ],

  keyTakeaways: [
    'useMemo caches a computed value between renders. Recomputes only when dependencies change.',
    'Use it for expensive computations on large data sets and for stabilizing object/array references for memoized children.',
    'Do NOT use it for trivial computations — the overhead exceeds the benefit.',
    'Always measure performance with React Profiler or console.time before adding useMemo.',
    'useMemo memoizes values; useCallback memoizes function references. useCallback(fn, deps) = useMemo(() => fn, deps).',
    'Missing dependencies cause stale cached values. All reactive values used inside must be listed.',
  ],

  nextLesson: 'use-callback',
  prevLesson: 'use-ref',
};
