import type { Lesson } from '@/types';

export const propsLesson: Lesson = {
  id: 'props',
  slug: 'props',
  title: 'Props',
  description:
    'Understand props as React\'s data-passing mechanism — data flow, parent-child communication, prop drilling, default values, and TypeScript prop typing.',
  category: 'Components',
  order: 5,
  difficulty: 'beginner',
  estimatedTime: 20,
  content: `Props (short for "properties") are the mechanism React uses to pass data from a parent component to a child component. Props are the backbone of React's unidirectional data flow.

---

## What Props Are

Props are arguments you pass to a component, similar to how you pass arguments to a function.

\`\`\`jsx
// Defining a component that accepts props
function Greeting({ name, role }) {
  return <h1>Hello, {name}! You are a {role}.</h1>;
}

// Passing props to the component
<Greeting name="Alice" role="engineer" />
// Renders: <h1>Hello, Alice! You are an engineer.</h1>
\`\`\`

Behind the scenes, React collects all the attributes you write on the JSX element and passes them as a single object (the props object) to the component function:

\`\`\`jsx
// These two are identical:
function Greeting({ name, role }) { ... }  // destructured
function Greeting(props) {                 // whole object
  const { name, role } = props;
}
\`\`\`

---

## Props Are Read-Only

**Props must never be modified.** A component cannot change its own props — it can only read them.

\`\`\`jsx
// ❌ Never do this
function BadComponent({ count }) {
  count = count + 1; // ❌ Mutating a prop
  return <div>{count}</div>;
}

// ✅ If you need to transform a prop, compute a new value
function GoodComponent({ count }) {
  const displayCount = count + 1; // New value, not mutation
  return <div>{displayCount}</div>;
}
\`\`\`

If a prop needs to change, the parent component must change its state and pass a new prop value down.

---

## Data Flow: Parent to Child

Data in React flows in one direction: **from parent to child through props**. A parent can pass:

- Primitive values (strings, numbers, booleans)
- Objects and arrays
- Functions (callbacks for child-to-parent communication)
- Other components (via the \`children\` prop)

\`\`\`jsx
function Parent() {
  const [count, setCount] = useState(0);
  const user = { name: 'Alice', role: 'admin' };

  return (
    <Child
      count={count}              // number
      user={user}                // object
      isVisible={true}           // boolean (shorthand: just write the name)
      label="Click me"           // string
      onIncrement={() => setCount(c => c + 1)}  // function
    />
  );
}

function Child({ count, user, isVisible, label, onIncrement }) {
  if (!isVisible) return null;

  return (
    <div>
      <p>{user.name} ({user.role})</p>
      <p>Count: {count}</p>
      <button onClick={onIncrement}>{label}</button>
    </div>
  );
}
\`\`\`

---

## Child-to-Parent Communication

Children cannot modify a parent's state directly. But a parent can pass a **callback function as a prop** that the child calls to notify the parent of an event.

\`\`\`jsx
function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(query); // Call parent's function with the query
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <button type="submit">Search</button>
    </form>
  );
}

function App() {
  const [results, setResults] = useState([]);

  // Parent defines what happens when the child searches
  async function handleSearch(query) {
    const data = await fetchSearchResults(query);
    setResults(data);
  }

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <ResultsList results={results} />
    </div>
  );
}
\`\`\`

The child (\`SearchBar\`) knows how to capture user input. The parent (\`App\`) knows what to do with it. Each stays in its lane.

---

## Default Props

You can provide default values for props using JavaScript's default parameter syntax:

\`\`\`jsx
// Default values in destructuring
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
}) {
  return (
    <button
      className={\`btn btn-\${variant} btn-\${size}\`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// These all work:
<Button>Save</Button>                           // primary, md, not disabled
<Button variant="danger">Delete</Button>        // danger, md, not disabled
<Button variant="ghost" size="sm">Cancel</Button> // ghost, sm, not disabled
\`\`\`

---

## Prop Drilling

Prop drilling is when you pass a prop through multiple intermediate components that do not use it themselves — they only pass it down to a deeper component.

\`\`\`jsx
// The problem: theme needs to reach DeepChild
// but Middle doesn't need it
function App() {
  const [theme, setTheme] = useState('dark');
  return <Middle theme={theme} />;
}

function Middle({ theme }) {
  // Middle does not use theme — only passes it down
  return <Inner theme={theme} />;
}

function Inner({ theme }) {
  // Inner does not use theme — only passes it down
  return <DeepChild theme={theme} />;
}

function DeepChild({ theme }) {
  // Only this one actually uses it
  return <div className={theme}>Content</div>;
}
\`\`\`

Prop drilling through 2-3 levels is fine. Prop drilling through 5+ levels is a code smell. It creates tight coupling, makes components harder to move, and means every intermediate component's signature changes when the prop changes.

**Solutions to prop drilling:**
1. **Component composition** — pass components rather than data (covered in the Components module)
2. **Context API** — make data available to any descendant without passing through intermediaries (covered in Module 17)
3. **State management** — Zustand, Redux (covered in Module 18)

When you face prop drilling, think first about whether **component composition** can solve it before reaching for Context.

---

## Spreading Props

When you need to forward all props to a child element (common in UI library wrappers), use the spread operator:

\`\`\`jsx
// Button wrapper that forwards all native HTML button props
function Button({ variant = 'primary', className = '', ...htmlProps }) {
  return (
    <button
      className={\`btn btn-\${variant} \${className}\`}
      {...htmlProps}
    />
  );
}

// Now Button forwards onClick, disabled, type, aria-*, etc.
<Button
  variant="danger"
  onClick={handleDelete}
  disabled={isLoading}
  aria-label="Delete item"
  type="button"
>
  Delete
</Button>
\`\`\`

Be careful with spreading props — it can accidentally pass invalid attributes to DOM elements (React will warn about unknown DOM props).

---

## TypeScript Prop Typing

When using TypeScript (which you should), define an interface or type for your component's props:

\`\`\`tsx
// Define an interface for props
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

// TypeScript validates all prop usage
function Button({ variant = 'primary', size = 'md', disabled = false, onClick, children }: ButtonProps) {
  return (
    <button
      className={\`btn btn-\${variant} btn-\${size}\`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// TypeScript now catches mistakes:
<Button variant="invalid">Save</Button>  // ❌ Error: "invalid" not in union
<Button size={42}>Save</Button>          // ❌ Error: number not assignable to string
<Button>Save</Button>                    // ✅ All defaults used

// Common React prop types:
// React.ReactNode — any renderable content (JSX, string, number, null)
// React.FC<Props> — function component type (less common now)
// React.MouseEvent<HTMLButtonElement> — mouse event
// React.ChangeEvent<HTMLInputElement> — input change event
// React.CSSProperties — inline style object
\`\`\`

---

## Props vs State

A common point of confusion:

| | Props | State |
|---|---|---|
| Defined by | Parent component | The component itself |
| Can be changed by | Parent only | The component itself |
| When to use | Pass data in | Track changing data |
| Re-renders when | Parent re-renders with new value | setX is called |
| Mutating | ❌ Never | ✅ Via setter function |

The rule: if a value comes from outside, it is a prop. If a value is managed by the component itself, it is state.`,

  codeExamples: [
    {
      title: 'Props flow — a complete example',
      code: `interface User {
  id: string;
  name: string;
  avatarUrl: string;
  isOnline: boolean;
}

interface UserCardProps {
  user: User;
  onFollow: (userId: string) => void;
  isFollowing: boolean;
}

function UserCard({ user, onFollow, isFollowing }: UserCardProps) {
  return (
    <div className="user-card">
      <div className="user-card-header">
        <img src={user.avatarUrl} alt={user.name} />
        <span className={\`status \${user.isOnline ? 'online' : 'offline'}\`} />
      </div>
      <h3>{user.name}</h3>
      <button
        onClick={() => onFollow(user.id)}
        className={isFollowing ? 'following' : 'follow'}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </button>
    </div>
  );
}

function UserGrid({ users }: { users: User[] }) {
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());

  function handleFollow(userId: string) {
    setFollowingIds(prev => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  }

  return (
    <div className="user-grid">
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          onFollow={handleFollow}
          isFollowing={followingIds.has(user.id)}
        />
      ))}
    </div>
  );
}`,
      explanation:
        'UserGrid owns the following state and passes an onFollow callback to each UserCard. When a card button is clicked, it calls onFollow with the user ID. The parent updates its state. The child re-renders with the new isFollowing value. This is the callback pattern for child-to-parent communication.',
    },
    {
      title: 'Solving prop drilling with composition',
      code: `// Instead of drilling theme through Middle and Inner,
// pass the already-rendered DeepChild as a prop

// ❌ Prop drilling version:
function App() {
  const theme = 'dark';
  return <Layout theme={theme} />;
}
function Layout({ theme }) {
  return <Sidebar theme={theme} />;
}
function Sidebar({ theme }) {
  return <Menu theme={theme} />;
}
function Menu({ theme }) {
  return <div className={theme}>Menu</div>; // finally used
}

// ✅ Composition version — no drilling:
function App() {
  const theme = 'dark';
  // App creates the deep component directly, using theme here
  return (
    <Layout>
      <Sidebar>
        <Menu className={theme} />
      </Sidebar>
    </Layout>
  );
}

// Layout and Sidebar just render their children — no awareness of theme
function Layout({ children }) {
  return <main>{children}</main>;
}
function Sidebar({ children }) {
  return <aside>{children}</aside>;
}`,
      explanation:
        'Instead of passing theme as a prop through every level, App creates the final component itself (where it has access to theme) and passes it down as children. Intermediate components just render children — they never see the theme prop. This is often the cleanest solution to prop drilling.',
    },
  ],

  commonMistakes: [
    'Mutating props — props are read-only. Mutating them does not trigger re-renders and creates subtle bugs.',
    'Passing too many individual props when an object would be cleaner — instead of name, avatarUrl, role, bio separately, pass a user object.',
    'Prop drilling too deep — if you are passing a prop through 5+ levels, use Context or composition instead.',
    'Not providing default values for optional props — causes undefined errors when callers omit optional props.',
    'Using spread to pass all props to a DOM element without filtering — causes React warnings about unknown DOM attributes.',
  ],

  interviewQuestions: [
    {
      question: 'How does data flow in React?',
      answer:
        'Data in React flows in one direction: from parent to child through props. A parent component owns state and passes data down to child components as props. Children cannot directly modify a parent\'s state — they communicate upward by calling callback functions the parent passed down as props. This unidirectional flow makes data predictable: you always know where data came from and what can change it.',
      difficulty: 'beginner',
    },
    {
      question: 'What is prop drilling and how do you solve it?',
      answer:
        'Prop drilling is passing a prop through multiple intermediate components that do not use the prop — they only pass it to a deeper child. It creates tight coupling and makes components harder to move. Solutions: (1) Component composition — have the parent create the deep component directly and pass it as children, eliminating the need for intermediaries to know about the prop; (2) Context API — makes data available to any descendant without explicit passing; (3) State management libraries like Zustand or Redux.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is the difference between props and state?',
      answer:
        'Props are passed in from a parent component — the component cannot change its own props. State is data managed by the component itself — the component can change it via the setter function. Props represent external configuration. State represents internal, changing data. When to use each: if the value comes from outside and the component should not control it, it\'s a prop; if the value changes over time and the component controls it, it\'s state.',
      difficulty: 'beginner',
    },
  ],

  exercises: [
    {
      id: 'props-ex-1',
      title: 'Build a Typed Component',
      description: 'Create a fully-typed ProfileCard component that receives user data via props and calls an onMessage callback.',
      starterCode: `// Create a ProfileCard component with these requirements:
// - Accepts: name (string), bio (string), avatarUrl (string),
//   followers (number), isVerified (boolean, optional, default false)
// - Accepts onMessage callback that receives the user's name
// - Shows a ✓ badge next to name if isVerified
// - Shows followers count formatted (e.g., 12500 → "12.5K")
// - Has a "Message" button that calls onMessage

interface ProfileCardProps {
  // TODO: define the props
}

function ProfileCard(props: ProfileCardProps) {
  // TODO: implement
  return null;
}`,
      solution: `interface ProfileCardProps {
  name: string;
  bio: string;
  avatarUrl: string;
  followers: number;
  isVerified?: boolean;
  onMessage: (name: string) => void;
}

function formatFollowers(count: number): string {
  if (count >= 1_000_000) return \`\${(count / 1_000_000).toFixed(1)}M\`;
  if (count >= 1_000) return \`\${(count / 1_000).toFixed(1)}K\`;
  return count.toString();
}

function ProfileCard({
  name,
  bio,
  avatarUrl,
  followers,
  isVerified = false,
  onMessage,
}: ProfileCardProps) {
  return (
    <div className="profile-card">
      <img src={avatarUrl} alt={name} className="avatar" />
      <h2>
        {name}
        {isVerified && <span className="verified" title="Verified">✓</span>}
      </h2>
      <p className="bio">{bio}</p>
      <span className="followers">{formatFollowers(followers)} followers</span>
      <button onClick={() => onMessage(name)}>Message</button>
    </div>
  );
}`,
      hints: [
        'Use optional chaining (?.) for optional props',
        'Default values go in the destructured parameters',
        'Format followers as a helper function outside the component',
      ],
    },
  ],

  keyTakeaways: [
    'Props are read-only data passed from parent to child. A component must never modify its own props.',
    'Data flows down via props. Events flow up via callback functions passed as props.',
    'Prop drilling (passing props through many intermediary components) is a code smell — use composition or Context.',
    'Default values for props use JavaScript\'s default parameter syntax in destructuring.',
    'In TypeScript, always define an interface for your component\'s props.',
    'The difference between props and state: props come from outside (read-only), state is managed internally (mutable via setter).',
  ],

  nextLesson: 'state',
  prevLesson: 'components',
};
