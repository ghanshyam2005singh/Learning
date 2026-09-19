import type { Lesson } from '@/types';

export const jsxLesson: Lesson = {
  id: 'jsx',
  slug: 'jsx',
  title: 'JSX',
  description:
    'Understand what JSX is, why it exists, how it compiles to JavaScript, expressions, conditional rendering, and rendering lists — the syntax layer every React developer writes daily.',
  category: 'JSX',
  order: 3,
  difficulty: 'beginner',
  estimatedTime: 20,
  content: `JSX (JavaScript XML) is a syntax extension for JavaScript that lets you write HTML-like markup inside JavaScript. It is the syntax you write in every React component.

JSX is **not HTML**. It is not a template language. It compiles to plain JavaScript function calls.

---

## What JSX Actually Is

When you write this in React:

\`\`\`jsx
const element = <h1 className="title">Hello, World</h1>;
\`\`\`

The JSX compiler (Babel or the TypeScript compiler) transforms it into:

\`\`\`js
const element = React.createElement('h1', { className: 'title' }, 'Hello, World');
\`\`\`

\`React.createElement\` returns a plain JavaScript object:

\`\`\`js
{
  type: 'h1',
  props: {
    className: 'title',
    children: 'Hello, World'
  }
}
\`\`\`

This object is a **React element** — a description of what should appear on screen. It is not a DOM node. It is not HTML. It is a JavaScript object that React uses to build and update the DOM.

**Why does this matter?**
- JSX is JavaScript. You can use any JavaScript expression inside it.
- You are not writing HTML. JSX has different rules.
- The compilation step is why you need a build tool (Vite, Next.js, CRA) for React.

---

## Why JSX Exists

Before JSX, developers wrote React with raw \`React.createElement\` calls:

\`\`\`js
// Without JSX — the old way
function UserCard({ user }) {
  return React.createElement(
    'div',
    { className: 'card' },
    React.createElement('img', { src: user.avatar, alt: user.name }),
    React.createElement('h2', null, user.name),
    React.createElement('p', null, user.bio),
    React.createElement(
      'button',
      { onClick: handleFollow },
      'Follow'
    )
  );
}
\`\`\`

This is unreadable at scale. JSX was introduced because the visual structure of HTML-like syntax matches the visual structure of the UI. It is easier to understand, write, and maintain.

JSX is optional — you could still write React without it — but every real-world React project uses JSX.

---

## JSX Rules

JSX looks like HTML but has important differences:

### 1. Return a single root element

Every component must return one root element. If you need multiple elements at the top level, wrap them in a \`<div>\` or use a **Fragment**.

\`\`\`jsx
// ❌ Wrong — two root elements
return (
  <h1>Title</h1>
  <p>Paragraph</p>
);

// ✅ Correct — wrapped in a Fragment
return (
  <>
    <h1>Title</h1>
    <p>Paragraph</p>
  </>
);
\`\`\`

Fragments (\`<></>\` or \`<React.Fragment>\`) let you group elements without adding an extra DOM node.

### 2. Close all tags

In HTML, some tags are self-closing (\`<br>\`, \`<img>\`, \`<input>\`). In JSX, **all tags must be closed**.

\`\`\`jsx
// ❌ Wrong — HTML style
<img src="photo.jpg">
<input type="text">
<br>

// ✅ Correct — JSX style
<img src="photo.jpg" />
<input type="text" />
<br />
\`\`\`

### 3. camelCase attributes

HTML attributes that have dashes or reserved names use camelCase in JSX:

| HTML | JSX |
|------|-----|
| \`class\` | \`className\` |
| \`for\` | \`htmlFor\` |
| \`onclick\` | \`onClick\` |
| \`tabindex\` | \`tabIndex\` |
| \`stroke-width\` | \`strokeWidth\` |

\`class\` becomes \`className\` because \`class\` is a reserved keyword in JavaScript.

### 4. JSX is case-sensitive

Lowercase tags are HTML elements (\`<div>\`, \`<span>\`). Uppercase tags are React components (\`<Button>\`, \`<UserCard>\`). This is how React tells them apart.

\`\`\`jsx
<div>   // Creates a <div> DOM element
<Div>   // Looks for a component named Div
<Button> // React component
<button> // HTML button element
\`\`\`

---

## Expressions in JSX

You can embed any JavaScript expression inside JSX using **curly braces** \`{}\`.

\`\`\`jsx
const name = 'Alice';
const items = ['Apples', 'Bananas', 'Cherries'];

function Profile({ user }) {
  return (
    <div>
      {/* String expression */}
      <h1>Hello, {name}</h1>

      {/* Property access */}
      <img src={user.avatarUrl} alt={user.name} />

      {/* Function call */}
      <p>Joined: {formatDate(user.createdAt)}</p>

      {/* Arithmetic */}
      <span>Price: \${(price * 1.1).toFixed(2)}</span>

      {/* Ternary */}
      <span>{user.isOnline ? 'Online' : 'Offline'}</span>

      {/* Template literal */}
      <p className={\`user-card \${user.role}\`}>...</p>
    </div>
  );
}
\`\`\`

**What you CANNOT put in curly braces:**
- Statements (\`if\`, \`for\`, \`while\`)
- Function declarations
- Variable declarations

Only **expressions** (things that evaluate to a value) can go inside \`{}\`.

---

## Conditional Rendering

Since JSX is JavaScript, you use JavaScript patterns for conditionals — not special template syntax.

### Pattern 1: Ternary operator

\`\`\`jsx
function Badge({ user }) {
  return (
    <span>
      {user.isPremium ? '⭐ Premium' : 'Free'}
    </span>
  );
}
\`\`\`

### Pattern 2: Logical AND (&&)

Use when you want to render something OR nothing:

\`\`\`jsx
function NotificationBadge({ count }) {
  return (
    <div>
      {count > 0 && <span className="badge">{count}</span>}
    </div>
  );
}
// When count is 0: renders nothing
// When count is 5: renders <span className="badge">5</span>
\`\`\`

**Gotcha with &&:** If the left side is \`0\`, React renders \`0\` instead of nothing.

\`\`\`jsx
// ❌ Bug: renders "0" when items.length is 0
{items.length && <ItemList items={items} />}

// ✅ Fix: use explicit boolean
{items.length > 0 && <ItemList items={items} />}
// or
{!!items.length && <ItemList items={items} />}
\`\`\`

### Pattern 3: Early return

For complex conditions, return early from the component:

\`\`\`jsx
function UserProfile({ user }) {
  if (!user) {
    return <div>Loading...</div>;
  }

  if (user.isBanned) {
    return <div>Account suspended</div>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
    </div>
  );
}
\`\`\`

### Pattern 4: Variable assignment

For complex conditional JSX, assign to a variable before the return:

\`\`\`jsx
function Alert({ type, message }) {
  let icon;
  if (type === 'error') icon = <ErrorIcon />;
  else if (type === 'warning') icon = <WarningIcon />;
  else icon = <InfoIcon />;

  return (
    <div className={\`alert alert-\${type}\`}>
      {icon}
      <span>{message}</span>
    </div>
  );
}
\`\`\`

---

## Rendering Lists

To render a list in JSX, use \`.map()\` to transform data into React elements.

\`\`\`jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}
\`\`\`

**The key prop is required for lists.** Without it, React generates a warning and cannot optimize list updates. Keys must be:
- **Unique** among siblings (not globally unique)
- **Stable** — not generated fresh each render (no \`Math.random()\`)
- **From your data** — use database IDs, slugs, or stable identifiers

\`\`\`jsx
// ❌ Index as key — wrong for dynamic lists
{items.map((item, index) => <Item key={index} {...item} />)}

// ✅ Stable ID as key
{items.map(item => <Item key={item.id} {...item} />)}
\`\`\`

Index as key is acceptable **only** when the list is static and never reordered, filtered, or modified.

---

## JSX Comments

You cannot use \`//\` comments inside JSX. Use \`{/* */}\`:

\`\`\`jsx
return (
  <div>
    {/* This is a JSX comment */}
    <h1>Title</h1>
    {/* <p>This is commented out</p> */}
  </div>
);
\`\`\`

---

## Whitespace in JSX

JSX handles whitespace differently from HTML. Multiple spaces collapse to one, but newlines between elements are removed:

\`\`\`jsx
// These render differently than you might expect:
<p>Hello   World</p>  // Renders: "Hello   World" (spaces preserved in JSX)

<p>
  Hello
  World
</p>
// Renders: "Hello World" (newlines become spaces, but differently from HTML)

// For an explicit space between inline elements:
<span>Hello</span>{' '}<span>World</span>
\`\`\``,

  codeExamples: [
    {
      title: 'JSX to JavaScript compilation',
      code: `// What you write (JSX):
function Greeting({ name, isLoggedIn }) {
  return (
    <div className="greeting">
      <h1>Hello, {name}!</h1>
      {isLoggedIn && <p>Welcome back.</p>}
    </div>
  );
}

// What the compiler produces (plain JS):
function Greeting({ name, isLoggedIn }) {
  return React.createElement(
    'div',
    { className: 'greeting' },
    React.createElement('h1', null, 'Hello, ', name, '!'),
    isLoggedIn && React.createElement('p', null, 'Welcome back.')
  );
}

// Both are identical. JSX is purely syntactic sugar.`,
      explanation:
        'JSX compiles to React.createElement calls. Understanding this demystifies JSX. Expressions in {} become arguments to createElement. The curly braces are not special HTML — they are JavaScript expression boundaries.',
    },
    {
      title: 'Conditional rendering patterns',
      code: `function OrderStatus({ order }) {
  // Pattern 1: Early return for loading/error states
  if (!order) return <Spinner />;
  if (order.error) return <ErrorMessage message={order.error} />;

  return (
    <div className="order">
      <h2>Order #{order.id}</h2>

      {/* Pattern 2: Ternary for either/or */}
      <span className={\`status \${order.isPaid ? 'paid' : 'pending'}\`}>
        {order.isPaid ? '✓ Paid' : '⏳ Pending payment'}
      </span>

      {/* Pattern 3: && for render-or-nothing */}
      {order.trackingNumber && (
        <a href={\`/track/\${order.trackingNumber}\`}>
          Track Package
        </a>
      )}

      {/* Pattern 4: null to render nothing */}
      {order.isDelivered ? <DeliveredBanner /> : null}
    </div>
  );
}`,
      explanation:
        'Use the right pattern for the situation: early return for guard clauses, ternary for either/or, && for show/hide, null to explicitly render nothing. Avoid nested ternaries — they become unreadable quickly.',
    },
    {
      title: 'List rendering with keys',
      code: `function ProductGrid({ products, categories }) {
  return (
    <div>
      {/* Simple list */}
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} — \${product.price}
          </li>
        ))}
      </ul>

      {/* Nested lists — each level needs unique keys within that level */}
      {categories.map(category => (
        <section key={category.id}>
          <h2>{category.name}</h2>
          <ul>
            {category.products.map(product => (
              // key only needs to be unique among siblings in the same list
              <li key={product.id}>{product.name}</li>
            ))}
          </ul>
        </section>
      ))}

      {/* Filtering inline */}
      <ul>
        {products
          .filter(p => p.inStock)
          .map(p => <ProductCard key={p.id} product={p} />)
        }
      </ul>
    </div>
  );
}`,
      explanation:
        'Keys only need to be unique among siblings in the same list, not globally. You can have two lists both using the same IDs if they are different lists. Chain .filter() before .map() to filter inline.',
    },
    {
      title: 'Spreading props',
      code: `// Spreading an object as props — common pattern
function Button({ variant = 'primary', size = 'md', children, ...rest }) {
  // \`...rest\` captures all other props (onClick, disabled, type, etc.)
  return (
    <button
      className={\`btn btn-\${variant} btn-\${size}\`}
      {...rest}  // Spreads onClick, disabled, aria-label, etc.
    >
      {children}
    </button>
  );
}

// Usage
<Button
  variant="danger"
  onClick={handleDelete}
  disabled={isDeleting}
  aria-label="Delete post"
>
  Delete
</Button>

// The ...rest spread forwards all DOM-valid attributes
// to the underlying <button> without explicitly listing them`,
      explanation:
        'The spread operator in JSX (...rest or {...props}) passes all properties at once. This is useful for wrapper components that forward HTML attributes to a DOM element.',
    },
  ],

  commonMistakes: [
    'Using class instead of className — class is a reserved keyword in JavaScript. React will warn and the styling will not apply.',
    'Forgetting to close self-closing tags (<br>, <img>, <input>) — JSX requires explicit closure: <br />, <img />, <input />.',
    'Using 0 with && conditional — {count && <Badge />} renders "0" when count is 0. Use {count > 0 && <Badge />} instead.',
    'Using array index as key in dynamic lists — causes React to match wrong elements when list items are added, removed, or reordered.',
    'Trying to use if/for/while inside JSX curly braces — only expressions allowed. Use ternary, &&, or move logic above the return.',
    'Not wrapping multiple root elements — JSX must return a single root. Use <> </> Fragment to wrap without adding a DOM node.',
  ],

  interviewQuestions: [
    {
      question: 'What is JSX and how does it work?',
      answer:
        'JSX is a syntax extension for JavaScript that lets you write HTML-like markup in JavaScript files. It is not HTML and not a template language — it compiles to React.createElement() calls. For example, <h1 className="title">Hello</h1> compiles to React.createElement("h1", { className: "title" }, "Hello"). The result is a plain JavaScript object (React element) that describes what should appear on screen. JSX requires a build step (Babel, TypeScript compiler) to transform it to JavaScript.',
      difficulty: 'beginner',
    },
    {
      question: 'Why does JSX use className instead of class?',
      answer:
        'class is a reserved keyword in JavaScript (used for class definitions). Since JSX is JavaScript, using class as an attribute name would cause a parsing conflict. React chose className to avoid this. Similarly, for becomes htmlFor because for is a reserved JavaScript keyword (used in for loops).',
      difficulty: 'beginner',
    },
    {
      question: 'What is the purpose of the key prop in React lists?',
      answer:
        'The key prop helps React identify which elements in a list have changed, been added, or been removed during reconciliation. Without keys, React uses position-based matching — reordering a list causes React to update every element incorrectly. With stable keys (like database IDs), React correctly matches elements across renders and applies minimal DOM operations. Keys must be unique among siblings and stable (not randomly generated on each render).',
      difficulty: 'beginner',
    },
    {
      question: 'What is a Fragment in React and when do you use it?',
      answer:
        'A Fragment (<> </> or <React.Fragment>) lets you return multiple elements from a component without wrapping them in an extra DOM node. Use it when a wrapper div would break your CSS layout (e.g., flexbox or grid children) or add unnecessary DOM depth. <React.Fragment key={id}> is the only Fragment syntax that accepts props — useful for fragments inside lists that need a key.',
      difficulty: 'beginner',
    },
  ],

  exercises: [
    {
      id: 'jsx-ex-1',
      title: 'Fix the JSX Errors',
      description: 'This JSX has 5 bugs. Find and fix all of them.',
      starterCode: `function UserCard({ user }) {
  return (
    <div class="card">
      <img src={user.avatar}>
      <h2>{user.name}</h2>
      <p for="bio">{user.bio}</p>
      {user.postCount && <span>{user.postCount} posts</span>}
      <p>Status: {user.isActive ? 'Active'}</p>
    </div>
  );
}`,
      solution: `function UserCard({ user }) {
  return (
    <div className="card">        {/* class → className */}
      <img src={user.avatar} />   {/* Self-closing tag */}
      <h2>{user.name}</h2>
      <p htmlFor="bio">{user.bio}</p>  {/* for → htmlFor */}
      {user.postCount > 0 && <span>{user.postCount} posts</span>}  {/* 0 bug */}
      <p>Status: {user.isActive ? 'Active' : 'Inactive'}</p>  {/* Ternary needs else */}
    </div>
  );
}`,
      hints: [
        'HTML attributes have different names in JSX',
        'All JSX tags must be closed',
        'Watch out for the 0 falsy value with &&',
        'Ternary operators need both true and false branches',
      ],
    },
    {
      id: 'jsx-ex-2',
      title: 'Build a Dynamic List',
      description: 'Render a list of notifications. Show a badge count only when count > 0. Mark urgent notifications in red.',
      starterCode: `const notifications = [
  { id: 1, text: 'New message from Alice', count: 3, isUrgent: false },
  { id: 2, text: 'Server alert', count: 0, isUrgent: true },
  { id: 3, text: 'Weekly report ready', count: 1, isUrgent: false },
];

function NotificationList() {
  return (
    // TODO: Render the notifications array as a list
    // - Each item shows the text
    // - Show count badge only when count > 0
    // - Apply className="urgent" when isUrgent is true
    <ul>
    </ul>
  );
}`,
      solution: `function NotificationList() {
  return (
    <ul>
      {notifications.map(notification => (
        <li
          key={notification.id}
          className={notification.isUrgent ? 'urgent' : ''}
        >
          {notification.text}
          {notification.count > 0 && (
            <span className="badge">{notification.count}</span>
          )}
        </li>
      ))}
    </ul>
  );
}`,
      hints: [
        'Use .map() to transform the array to JSX elements',
        'Every element needs a unique key prop',
        'Use && for the count badge — only show when count > 0',
        'Use a ternary or template literal for the className',
      ],
    },
  ],

  keyTakeaways: [
    'JSX compiles to React.createElement() calls — it is JavaScript, not HTML. Every JSX expression produces a plain JavaScript object.',
    'JSX rules: single root element, all tags closed, camelCase attributes, className not class.',
    'Use expressions ({}) in JSX — not statements. Conditionals use ternary, &&, or early return. Lists use .map().',
    'The && shortcut renders "0" when the left side is 0 — always use an explicit boolean: count > 0 && ...',
    'List keys must be unique among siblings and stable (not index for dynamic lists).',
    'Fragments (<> </>) let you return multiple elements without extra DOM nodes.',
  ],

  nextLesson: 'components',
  prevLesson: 'react-architecture',
};
