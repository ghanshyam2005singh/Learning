import type { Lesson } from '@/types';

export const architectureLesson: Lesson = {
  id: 'react-architecture',
  slug: 'react-architecture',
  title: 'React Architecture',
  description:
    'Deep dive into the React component tree, rendering flow, reconciliation algorithm, Virtual DOM diffing, and component lifecycle — the internals every serious React developer must understand.',
  category: 'Architecture',
  order: 2,
  difficulty: 'intermediate',
  estimatedTime: 35,
  content: `Understanding React's architecture is not optional for serious React development. Every confusing behavior you will encounter — unexpected re-renders, stale closures, performance issues — traces back to how React works internally.

---

## The Component Tree

Every React application is a **tree of components**. There is one root component (usually \`App\`) and every other component is a descendant.

\`\`\`
App
├── Header
│   ├── Logo
│   └── NavLinks
│       ├── NavLink ("Home")
│       ├── NavLink ("About")
│       └── NavLink ("Contact")
├── Main
│   ├── Sidebar
│   └── Content
│       ├── ArticleList
│       │   └── ArticleCard (×N)
│       └── Pagination
└── Footer
\`\`\`

**Why this matters:**

- React renders from the top down. When a parent re-renders, all its children re-render by default.
- Data flows down through this tree via props.
- Events bubble up through callbacks.
- This tree structure dictates where you place state, how you share data, and where performance bottlenecks live.

---

## The Rendering Flow

"Rendering" in React means **calling your component function** and getting back a description of what the UI should look like.

React's rendering happens in two phases:

### Phase 1: Render Phase

React calls your component functions. Each function returns JSX — a description of the UI. React builds a new Virtual DOM tree from these descriptions.

During this phase:
- Your component functions run
- No DOM changes happen yet
- This phase can be interrupted and restarted (Concurrent Mode)

### Phase 2: Commit Phase

React compares the new Virtual DOM against the previous one (reconciliation), computes the minimal diff, then writes changes to the real DOM.

During this phase:
- DOM mutations happen
- \`useEffect\` cleanup runs (for effects being cleaned up)
- \`useEffect\` runs (for new effects)
- This phase is synchronous and cannot be interrupted

\`\`\`
State/Props Change
       ↓
  Render Phase
(component functions run, build Virtual DOM)
       ↓
  Reconciliation
(diff new Virtual DOM vs old Virtual DOM)
       ↓
  Commit Phase
(apply minimal DOM changes)
       ↓
  Effects Run
(useEffect, useLayoutEffect)
\`\`\`

---

## What Triggers a Render

React re-renders a component when:

1. **Its state changes** — \`setState\` or \`useState\` setter called
2. **Its props change** — the parent re-renders and passes new props
3. **Its context changes** — a context it subscribes to updates
4. **Its parent re-renders** — this is the most surprising one

Point 4 is critical: **if a parent re-renders, ALL its children re-render by default**, even if their props did not change. React has to call the child function to know whether its output changed.

This is not necessarily a bug — it is how React works by default. Optimization tools like \`React.memo\`, \`useMemo\`, and \`useCallback\` exist specifically to prevent unnecessary child re-renders.

---

## Reconciliation — The Diffing Algorithm

After the render phase, React has two Virtual DOM trees: the old one and the new one. Reconciliation is the process of comparing them to find what changed.

React's diffing algorithm makes three key assumptions that allow it to run in O(n) time instead of the theoretical O(n³) for tree diffing:

### Assumption 1: Elements of different types produce different trees

If a \`<div>\` is replaced by a \`<section>\`, React does not try to reuse the DOM node. It destroys the old tree and builds a new one. This is why changing a component's root element type causes all its children to remount.

### Assumption 2: Keys identify stable elements across renders

When rendering a list, React uses the \`key\` prop to match elements between renders. Without keys, React matches by position — the first element in the new list matches the first element in the old list. With keys, React correctly matches elements even if the list order changed.

\`\`\`
Old list: [A, B, C]
New list: [B, A, C]

Without keys: React updates all 3 elements (position-based matching)
With keys: React moves A and B — no DOM text changes needed
\`\`\`

### Assumption 3: Developer hints via key reset state

If you change the \`key\` prop of a component, React treats it as a completely different component — it unmounts the old one and mounts a new one. This is a useful pattern for resetting component state.

---

## The Virtual DOM in Detail

The Virtual DOM is a plain JavaScript object tree. A Virtual DOM node looks like this:

\`\`\`js
// This JSX:
<div className="post" id="post-42">
  <h2>Hello React</h2>
  <p>A paragraph</p>
</div>

// Becomes this Virtual DOM object:
{
  type: 'div',
  props: {
    className: 'post',
    id: 'post-42',
    children: [
      { type: 'h2', props: { children: 'Hello React' } },
      { type: 'p', props: { children: 'A paragraph' } }
    ]
  }
}
\`\`\`

React compares this object tree before and after renders. Comparing JavaScript objects is fast. Comparing actual DOM nodes is slow. That is the entire point of the Virtual DOM.

---

## Component Lifecycle

React components have a lifecycle: they mount, update, and unmount. Understanding the lifecycle is critical for \`useEffect\` and avoiding memory leaks.

### Mount
The component appears on screen for the first time. React:
1. Calls the component function
2. Builds the DOM nodes
3. Inserts them into the page
4. Runs \`useEffect\` hooks (after paint)

### Update
State or props change. React:
1. Calls the component function again
2. Diffs the new output against the old output
3. Updates only the changed DOM nodes
4. Runs \`useEffect\` cleanup for changed dependencies
5. Runs \`useEffect\` with new values

### Unmount
The component is removed from the tree. React:
1. Removes DOM nodes
2. Runs all \`useEffect\` cleanup functions
3. (No more renders after this)

\`\`\`
MOUNT                UPDATE               UNMOUNT
  │                    │                    │
  ├─ Render            ├─ Render            ├─ Cleanup effects
  ├─ DOM created       ├─ Diff + patch DOM  ├─ DOM removed
  └─ Effects run       └─ Effects run       └─ ──────────────
\`\`\`

---

## Fiber — React's Internal Architecture

Since React 16, React's reconciler is called **Fiber**. Fiber is an internal data structure that represents a unit of work.

Before Fiber (React 15 and earlier), reconciliation was synchronous and recursive. Once React started updating a large tree, it could not stop until it finished. This caused jank — the browser could not process user input or animations while React was working.

Fiber splits rendering into small units of work that can be:
- **Paused** and resumed
- **Abandoned** and restarted
- **Prioritized** — urgent updates (user input) interrupt low-priority updates (background data loading)

This is what enables React's **Concurrent Features** (React 18+): Suspense, transitions, and streaming SSR all depend on Fiber's ability to interrupt and resume work.

**What this means for you practically:**
- Never rely on render functions running to completion without interruption
- Render functions must be pure — no side effects
- Effects (\`useEffect\`) run after the render, not during it

---

## Render Triggers vs DOM Updates

A common misconception: "every render = a DOM change." This is wrong.

React renders (calls component functions) frequently. But it only updates the DOM when the output actually differs from the previous output.

\`\`\`js
function Counter() {
  const [count, setCount] = useState(0);

  // Clicking when count is already 0 causes a re-render,
  // but if the output is identical, React skips the DOM update
  return <button onClick={() => setCount(0)}>Count: {count}</button>;
}
\`\`\`

React bails out of the commit phase (DOM update) if nothing changed. This is called **bailout**. However, the render phase still runs — the component function still gets called. Only the DOM write is skipped.

---

## The Component Tree and Data Flow Diagram

\`\`\`
                    App (state: user, theme)
                          │
              ┌───────────┴───────────┐
           Header                   Main
         (props: user)           (props: theme)
              │                       │
         NavMenu               ┌──────┴──────┐
       (props: user)        Sidebar        Content
                           (no props)    (props: theme)
                                              │
                                         ArticleList
                                       (props: articles)
                                              │
                                      ArticleCard ×N
                                     (props: article)

Data flows DOWN via props  →  →  →
Events flow UP via callbacks  ←  ←  ←
\`\`\`

This is **unidirectional data flow**. State lives in a parent. Children receive it as props. Children cannot modify the parent's state directly — they call a function the parent passed down.

This predictability is one of React's greatest strengths. You can always trace where data comes from.`,

  codeExamples: [
    {
      title: 'Re-render cascade — parent re-renders all children',
      code: `import { useState } from 'react';

function Child({ name }) {
  console.log(\`Child "\${name}" rendered\`);
  return <div>{name}</div>;
}

function Parent() {
  const [count, setCount] = useState(0);
  console.log('Parent rendered');

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
      {/* These children re-render every time Parent re-renders */}
      {/* even though their props never change */}
      <Child name="Alice" />
      <Child name="Bob" />
    </div>
  );
}

// Output on every button click:
// Parent rendered
// Child "Alice" rendered
// Child "Bob" rendered`,
      explanation:
        'When Parent re-renders (due to count changing), both Child components re-render too. Their props ("Alice", "Bob") never changed. This is React\'s default behavior. React.memo can prevent this when needed.',
    },
    {
      title: 'Key-based reconciliation — lists',
      code: `function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        // WITHOUT key: React matches by position
        // Reordering list = all items update (incorrect DOM updates)
        // WITH key: React matches by ID
        // Reordering list = React moves nodes (correct and efficient)
        <li key={todo.id}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

// When todos reorder from [A, B, C] to [B, A, C]:
// Without key: React updates text of all 3 <li> elements
// With key:   React reorders the existing <li> DOM nodes`,
      explanation:
        'Keys tell React how to match elements between renders. Without keys, React uses position — expensive and incorrect for reordered lists. With keys, React identifies which elements moved and applies minimal DOM operations.',
    },
    {
      title: 'Key to reset state — using key intentionally',
      code: `function UserProfile({ userId }) {
  return (
    // When userId changes, the key changes.
    // React treats this as a DIFFERENT component.
    // The old ProfileForm unmounts. A new one mounts.
    // All internal state in ProfileForm resets.
    <ProfileForm key={userId} userId={userId} />
  );
}

function ProfileForm({ userId }) {
  // This state will reset whenever the parent passes a new key
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  // Without key: navigating from user 1 to user 2 would show
  // user 2's data but with user 1's form input still in the fields.
  // With key: the form is completely fresh for each user.
  return (/* form JSX */);
}`,
      explanation:
        'Changing a component\'s key prop forces React to unmount it and mount a fresh instance. This resets all local state. This is a useful and intentional pattern for forms that display data for different entities (users, posts, products).',
    },
    {
      title: 'The render phase is pure — no side effects',
      code: `// WRONG: side effects in render
function BadComponent() {
  // ❌ This runs on every render — could be called multiple times
  // in Concurrent Mode (React 18+) before committing to DOM
  localStorage.setItem('lastRender', Date.now().toString());
  document.title = 'Rendering...';
  fetch('/api/track-view'); // ❌ Network request in render!

  return <div>Hello</div>;
}

// CORRECT: side effects go in useEffect
function GoodComponent() {
  useEffect(() => {
    // ✅ This runs after the component commits to the DOM
    // Runs once on mount (empty dependency array)
    document.title = 'Page Loaded';
    fetch('/api/track-view');
  }, []);

  return <div>Hello</div>;
}`,
      explanation:
        'The render phase must be pure. In Concurrent Mode, React may call your component function multiple times before committing. Side effects in render run multiple times unexpectedly. All side effects belong in useEffect, which runs after the commit phase.',
    },
  ],

  commonMistakes: [
    'Thinking "re-render" means the DOM changed. Re-render = component function called. DOM update = only when the output differs. These are separate.',
    'Using array index as key in lists. Index keys cause subtle bugs when list items are added, removed, or reordered — React matches wrong elements.',
    'Triggering side effects in the render body. The render phase can run multiple times. Effects belong in useEffect.',
    'Not understanding that parent re-renders cause child re-renders. This leads to surprising behavior and performance issues in large trees.',
    'Confusing mounting with rendering. Mounting happens once (component enters the tree). Rendering happens on every state/props change.',
  ],

  interviewQuestions: [
    {
      question: 'What is React reconciliation?',
      answer:
        'Reconciliation is the process React uses to determine what changed between renders. After the render phase produces a new Virtual DOM tree, React diffs it against the previous tree using its reconciliation algorithm. React\'s algorithm assumes: (1) Different element types produce different trees. (2) Keys identify stable elements in lists. These assumptions let React run in O(n) instead of O(n³). The result is a minimal set of DOM operations that React applies in the commit phase.',
      difficulty: 'intermediate',
    },
    {
      question: 'Explain the two phases of React rendering.',
      answer:
        'React rendering has two phases: (1) Render Phase — React calls component functions to build a new Virtual DOM tree. This phase can be paused, interrupted, or restarted (Concurrent Mode). No DOM changes happen here. Components must be pure. (2) Commit Phase — React applies the computed changes to the real DOM. This phase is synchronous and cannot be interrupted. After DOM updates, React runs useEffect hooks.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is React Fiber and why was it introduced?',
      answer:
        'React Fiber is React\'s internal reconciliation engine, introduced in React 16. Before Fiber, reconciliation was a synchronous recursive process — once started, it ran to completion and blocked the browser. Fiber breaks rendering into small units of work that can be paused, prioritized, and resumed. This enables Concurrent Mode features: Suspense, transitions, and streaming SSR. Practically: urgent updates (user input) can interrupt background updates (data loading), preventing jank.',
      difficulty: 'advanced',
    },
    {
      question: 'Why must React component functions be pure?',
      answer:
        'Component functions must be pure because: (1) React may call them multiple times before committing (Concurrent Mode). (2) React uses the render output to compute diffs — side effects during render would run multiple times unexpectedly. (3) Features like Strict Mode deliberately double-invoke components to surface impurity bugs. Purity means: same inputs always produce the same output, no side effects (no network calls, no DOM writes, no global mutations). Side effects belong in useEffect, which runs predictably after commit.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is unidirectional data flow in React?',
      answer:
        'Unidirectional data flow means data has one direction of travel through the component tree: top to bottom. State lives in a parent component. Children receive it as props. Children cannot directly modify parent state — they call callback functions the parent passed down as props. Events travel upward through callbacks. This predictability makes React UIs easier to debug: you always know where data came from and what can change it.',
      difficulty: 'beginner',
    },
  ],

  exercises: [
    {
      id: 'react-arch-ex-1',
      title: 'Trace a Re-render Cascade',
      description:
        'Given this component tree, a button click in Counter changes its count state. List every component that re-renders and explain why.',
      starterCode: `// Component tree:
//
// App
// ├── Header (receives: user prop from App state)
// ├── Counter (has its own count state)
// │   └── Display (receives: count prop from Counter)
// └── Footer (no props, no state)
//
// Question: Counter's button is clicked. count goes from 0 to 1.
// Which components re-render?
//
// Your answer (as comments):
// Re-renders:
// Does NOT re-render:`,
      solution: `// Re-renders:
// - Counter: its own state changed (count: 0 → 1)
// - Display: its parent (Counter) re-rendered, passing new count prop

// Does NOT re-render:
// - App: its state did not change (user is unchanged)
// - Header: its parent (App) did not re-render
// - Footer: its parent (App) did not re-render

// Key insight: Re-renders propagate DOWNWARD from the component whose
// state changed. Siblings and parent components are not affected.`,
      hints: [
        'Re-renders start at the component whose state changed',
        'Re-renders flow downward through the tree',
        'Siblings are not affected by a sibling\'s state change',
        'Parent re-renders only if ITS state or props changed',
      ],
    },
  ],

  keyTakeaways: [
    'Every React app is a component tree. Data flows top-down via props. Events flow bottom-up via callbacks.',
    'React rendering has two phases: Render (component functions run, Virtual DOM built) and Commit (minimal DOM updates applied).',
    'When a parent re-renders, all children re-render by default — even if props did not change. React.memo prevents this.',
    'Reconciliation is React\'s diffing algorithm. Keys are critical for correct list reconciliation.',
    'React Fiber enables Concurrent Mode — rendering can be paused and prioritized for better user experience.',
    'Component functions must be pure. No side effects in the render phase. Side effects belong in useEffect.',
  ],

  nextLesson: 'jsx',
  prevLesson: 'what-is-react',
};
