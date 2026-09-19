import type { Lesson } from '@/types';

export const componentsLesson: Lesson = {
  id: 'components',
  slug: 'components',
  title: 'Components',
  description:
    'Master functional components, component composition, reusability, separation of concerns, and the difference between presentational and container components — the building blocks of every React application.',
  category: 'Components',
  order: 4,
  difficulty: 'beginner',
  estimatedTime: 25,
  content: `Components are the fundamental building blocks of React applications. A component is a **self-contained, reusable piece of UI**. Understanding how to design components well is one of the most important skills in React development.

---

## What is a Functional Component

A React functional component is a **JavaScript function that returns JSX**.

\`\`\`jsx
// The simplest possible component
function Greeting() {
  return <h1>Hello, World!</h1>;
}

// Arrow function syntax — also valid
const Greeting = () => <h1>Hello, World!</h1>;
\`\`\`

Three rules:
1. The function name must start with a **capital letter** (React uses this to distinguish components from HTML elements)
2. It must **return JSX** (or null to render nothing)
3. It must be a **pure function** — same input always produces the same output

Before React 16.8, components could be classes (\`class Greeting extends React.Component\`). Functional components with hooks replaced class components entirely. You will see class components in older codebases, but you should never write new ones.

---

## Component Composition

Composition is the practice of **building components out of smaller components**. This is React's primary tool for managing complexity.

\`\`\`
Simple components combine into complex UIs
Button → IconButton → ConfirmButton
Avatar → UserInfo → UserCard → UserGrid
Input → FormField → LoginForm → AuthPage
\`\`\`

Each level adds more specific behavior while delegating rendering to the level below.

\`\`\`jsx
// Primitive component
function Avatar({ src, alt, size = 'md' }) {
  return (
    <img
      src={src}
      alt={alt}
      className={\`avatar avatar-\${size}\`}
    />
  );
}

// Composite component — uses Avatar
function UserInfo({ user }) {
  return (
    <div className="user-info">
      <Avatar src={user.avatar} alt={user.name} size="sm" />
      <div>
        <strong>{user.name}</strong>
        <span>{user.role}</span>
      </div>
    </div>
  );
}

// Higher composite — uses UserInfo
function CommentCard({ comment }) {
  return (
    <div className="comment">
      <UserInfo user={comment.author} />
      <p>{comment.text}</p>
      <time>{comment.createdAt}</time>
    </div>
  );
}
\`\`\`

The \`Avatar\` component is used in \`UserInfo\`, \`PostHeader\`, \`CommentCard\`, \`DirectMessage\`, and any other place that needs a user avatar. Change \`Avatar\` once — it updates everywhere.

---

## Reusability

A component is reusable when it can work in multiple contexts without modification. This requires the component to:

1. **Accept data through props** — not hardcode values
2. **Be focused** — do one thing well
3. **Not assume its context** — it should not know or care where it is placed

\`\`\`jsx
// ❌ Not reusable — hardcoded for one specific use
function JohnAvatar() {
  return <img src="/john.jpg" alt="John" className="avatar" />;
}

// ✅ Reusable — works for any user
function Avatar({ src, alt, size = 'md' }) {
  return <img src={src} alt={alt} className={\`avatar avatar-\${size}\`} />;
}

// Works for any user, any context:
<Avatar src={post.author.photo} alt={post.author.name} />
<Avatar src={currentUser.photo} alt={currentUser.name} size="lg" />
<Avatar src={commenter.photo} alt={commenter.name} size="xs" />
\`\`\`

---

## Separation of Concerns

In React, "separation of concerns" means each component has a **clear, single responsibility**. A component should either:

- **Render UI** (know what to display)
- **Manage logic** (know what data to fetch or transform)

Not both.

This leads to the classic distinction:

---

## Presentational Components (Dumb Components)

A presentational component:
- Receives all its data through props
- Has no side effects (no API calls, no data fetching)
- Is entirely focused on rendering
- Is easily testable (pass props, check rendered output)
- Is highly reusable

\`\`\`jsx
// Presentational — receives everything via props, just renders
function ProductCard({ name, price, imageUrl, inStock, onAddToCart }) {
  return (
    <div className={\`product-card \${!inStock ? 'out-of-stock' : ''}\`}>
      <img src={imageUrl} alt={name} />
      <h3>{name}</h3>
      <span className="price">\${price.toFixed(2)}</span>
      <button
        onClick={onAddToCart}
        disabled={!inStock}
      >
        {inStock ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
}
\`\`\`

This component knows nothing about where products come from. It only knows how to display one.

---

## Container Components (Smart Components)

A container component:
- Fetches data (from API, state store, or context)
- Manages state
- Passes data to presentational components

\`\`\`jsx
// Container — fetches data, manages state, passes to presentational
function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="product-list">
      {products.map(product => (
        <ProductCard
          key={product.id}
          name={product.name}
          price={product.price}
          imageUrl={product.image}
          inStock={product.stock > 0}
          onAddToCart={() => addToCart(product.id)}
        />
      ))}
    </div>
  );
}
\`\`\`

**The pattern:** Container handles the "what data" problem. Presentational handles the "how to display it" problem. Each is independently testable and replaceable.

---

## Component Design Principles

### 1. Single Responsibility
Each component should do one thing. If a component is doing two unrelated things, split it.

\`\`\`jsx
// ❌ Too much responsibility
function UserDashboard() {
  // fetches user, fetches posts, manages modal, renders everything
}

// ✅ Each component has one responsibility
function UserDashboard() {
  return (
    <div>
      <UserProfile />
      <RecentPostsList />
      <ActivityChart />
    </div>
  );
}
\`\`\`

### 2. Keep Components Small

If you cannot see the entire component on your screen without scrolling, it is probably doing too much.

### 3. Lift State Up

When two sibling components need the same data, lift the state to their common parent:

\`\`\`jsx
// ❌ Two siblings each fetching the same user data
function Sidebar() {
  const [user, setUser] = useState(null);
  useEffect(() => { fetchUser().then(setUser); }, []);
  return <UserInfo user={user} />;
}

function Header() {
  const [user, setUser] = useState(null);
  useEffect(() => { fetchUser().then(setUser); }, []);
  return <UserAvatar user={user} />;
}

// ✅ Parent owns shared state, passes to both children
function Layout() {
  const [user, setUser] = useState(null);
  useEffect(() => { fetchUser().then(setUser); }, []);

  return (
    <div>
      <Header user={user} />
      <Sidebar user={user} />
    </div>
  );
}
\`\`\`

### 4. Colocate Related Code

Put things that change together in the same place. A component's JSX, styles, logic, and tests should live near each other.

\`\`\`
components/
└── ProductCard/
    ├── ProductCard.tsx      # Component
    ├── ProductCard.test.tsx # Tests
    └── ProductCard.module.css # Styles
\`\`\`

---

## The children Prop

Components can receive other components as children, enabling powerful composition patterns:

\`\`\`jsx
function Card({ title, children }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2>{title}</h2>
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

// Usage — anything between <Card> tags becomes children
function App() {
  return (
    <Card title="User Profile">
      <Avatar src={user.photo} alt={user.name} />
      <p>{user.bio}</p>
      <Button>Follow</Button>
    </Card>
  );
}
\`\`\`

The \`children\` prop makes components flexible containers. The \`Card\` component does not need to know what it contains — it just provides the card structure and lets the parent decide what goes inside.

---

## Component Naming and Organization

**Naming conventions:**
- Component names: PascalCase (\`UserCard\`, \`ProductList\`)
- File names: match component name (\`UserCard.tsx\`)
- One component per file for shared components
- Multiple related components can share a file for small, tightly related components

**What NOT to do:**
\`\`\`jsx
// ❌ Defining components inside other components
function Parent() {
  // This creates a NEW function on every render of Parent
  // React treats it as a different component each time → remounts!
  function Child() {
    return <div>Child</div>;
  }

  return <Child />;
}

// ✅ Define outside
function Child() {
  return <div>Child</div>;
}

function Parent() {
  return <Child />;
}
\`\`\`

Defining components inside other components is a common mistake that causes subtle bugs and performance issues.`,

  codeExamples: [
    {
      title: 'Building a real component hierarchy',
      code: `// A realistic component breakdown for a tweet

// Level 1: Atomic (no children, purely presentational)
function Avatar({ src, alt, size = 'md' }) {
  return <img className={\`avatar \${size}\`} src={src} alt={alt} />;
}

function LikeCount({ count }) {
  return <span className="like-count">{count.toLocaleString()}</span>;
}

// Level 2: Composite
function TweetHeader({ author, timestamp }) {
  return (
    <header className="tweet-header">
      <Avatar src={author.photo} alt={author.name} size="sm" />
      <div>
        <strong>{author.name}</strong>
        <span>@{author.handle}</span>
        <time>{timestamp}</time>
      </div>
    </header>
  );
}

function TweetActions({ tweet, onLike, onRetweet, onReply }) {
  return (
    <footer className="tweet-actions">
      <button onClick={onReply}>💬 {tweet.replies}</button>
      <button onClick={onRetweet}>🔁 {tweet.retweets}</button>
      <button onClick={onLike}>❤️ <LikeCount count={tweet.likes} /></button>
    </footer>
  );
}

// Level 3: Full tweet card
function TweetCard({ tweet, onLike, onRetweet, onReply }) {
  return (
    <article className="tweet">
      <TweetHeader author={tweet.author} timestamp={tweet.createdAt} />
      <p className="tweet-content">{tweet.text}</p>
      {tweet.image && <img src={tweet.image} alt="Tweet media" />}
      <TweetActions tweet={tweet} onLike={onLike} onRetweet={onRetweet} onReply={onReply} />
    </article>
  );
}

// Level 4: Container that fetches and manages
function TweetFeed() {
  const [tweets, setTweets] = useState([]);
  const { likeTweet, retweetTweet } = useTweetActions();

  return (
    <main>
      {tweets.map(tweet => (
        <TweetCard
          key={tweet.id}
          tweet={tweet}
          onLike={() => likeTweet(tweet.id)}
          onRetweet={() => retweetTweet(tweet.id)}
          onReply={() => openReplyModal(tweet.id)}
        />
      ))}
    </main>
  );
}`,
      explanation:
        'Notice the hierarchy: atomic components (Avatar, LikeCount) → composite components (TweetHeader, TweetActions) → full component (TweetCard) → container (TweetFeed). Each level delegates to the level below. The container manages data; everything below it just renders.',
    },
    {
      title: 'children prop for flexible containers',
      code: `// Modal component that accepts any content
function Modal({ title, onClose, children, footer }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <header>
          <h2>{title}</h2>
          <button onClick={onClose}>×</button>
        </header>
        <main className="modal-body">
          {children}
        </main>
        {footer && (
          <footer className="modal-footer">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}

// Usage 1: Confirmation dialog
<Modal
  title="Delete Post?"
  onClose={closeModal}
  footer={
    <>
      <button onClick={closeModal}>Cancel</button>
      <button className="danger" onClick={handleDelete}>Delete</button>
    </>
  }
>
  <p>This action cannot be undone.</p>
</Modal>

// Usage 2: Image preview
<Modal title="Photo" onClose={closeModal}>
  <img src={photo.url} alt={photo.caption} />
</Modal>

// Same Modal component, completely different content.`,
      explanation:
        'The children prop makes Modal a flexible container. It knows nothing about what goes inside it — that is decided at the usage site. The optional footer prop uses the same concept for a named slot pattern.',
    },
  ],

  commonMistakes: [
    'Defining components inside other components — creates a new function on every render, causing remounts and lost state.',
    'Making components too large — if a component has more than ~100 lines, it probably does too much. Break it apart.',
    'Mixing data fetching and rendering in every component — creates untestable, unreusable components. Separate containers from presentational components.',
    'Not lifting state when siblings need the same data — leads to duplicated fetches, inconsistent data.',
    'Using lowercase for component names — <button> is a DOM element, <Button> is your component. React uses the capitalization to tell them apart.',
    'Creating overly generic components too early — start specific, refactor to generic when the second use case appears.',
  ],

  interviewQuestions: [
    {
      question: 'What is the difference between a presentational component and a container component?',
      answer:
        'A presentational component receives all its data via props and focuses entirely on rendering. It has no side effects, no API calls, and no complex logic. It is highly reusable and easy to test. A container component fetches data (from API, state store, or context), manages state, and passes data down to presentational components. The container knows "what data" and the presentational component knows "how to display it." Modern React blurs this distinction with hooks — custom hooks often replace the container pattern.',
      difficulty: 'intermediate',
    },
    {
      question: 'Why should you not define components inside other components?',
      answer:
        'Defining a component inside another component creates a new function reference on every render of the parent. React compares component types by reference — since it is a different function each render, React treats it as a different component entirely. React unmounts the old instance and mounts a new one, destroying all local state and causing unnecessary DOM operations. Always define components at the module level.',
      difficulty: 'intermediate',
    },
    {
      question: 'What does "lifting state up" mean?',
      answer:
        'Lifting state up means moving state from a child component to the closest common parent of all components that need that state. When two sibling components need to share data, the sibling that owns the state cannot share it sideways — only downward. The solution is to move the state to their parent, which can then pass it down to both children as props. This keeps data in one place (single source of truth) and avoids duplication.',
      difficulty: 'beginner',
    },
    {
      question: 'What is component composition and why is it important?',
      answer:
        'Component composition is building complex UIs by combining simple, focused components. Instead of one large component, you have a tree of small components each doing one thing. This enables: (1) Reuse — compose the same small component in many places, (2) Testability — small components are easy to test in isolation, (3) Maintainability — changing a small component has localized effects, (4) Team collaboration — teams can own different components independently, (5) Readability — component hierarchy mirrors the visual hierarchy of the UI.',
      difficulty: 'beginner',
    },
  ],

  exercises: [
    {
      id: 'components-ex-1',
      title: 'Split a Monolith Component',
      description:
        'This single large component does too much. Identify at least 3 smaller components it should be split into. Then implement the split.',
      starterCode: `// This component does everything — split it
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetch(\`/api/products/\${productId}\`)
      .then(r => r.json())
      .then(setProduct);
    fetch(\`/api/products/\${productId}/reviews\`)
      .then(r => r.json())
      .then(setReviews);
  }, [productId]);

  function handleAddToCart() {
    setCartCount(c => c + quantity);
  }

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <nav>Cart ({cartCount})</nav>
      <img src={product.image} alt={product.name} />
      <h1>{product.name}</h1>
      <p>\${product.price}</p>
      <p>{product.description}</p>
      <select value={quantity} onChange={e => setQuantity(Number(e.target.value))}>
        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
      </select>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <h2>Reviews ({reviews.length})</h2>
      {reviews.map(review => (
        <div key={review.id}>
          <strong>{review.author}</strong>
          <span>{'★'.repeat(review.rating)}</span>
          <p>{review.text}</p>
        </div>
      ))}
    </div>
  );
}`,
      solution: `// Split into focused components:

// Presentational: shows one review
function ReviewCard({ review }) {
  return (
    <div className="review">
      <strong>{review.author}</strong>
      <span>{'★'.repeat(review.rating)}</span>
      <p>{review.text}</p>
    </div>
  );
}

// Presentational: quantity selector + add to cart
function AddToCartForm({ price, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  return (
    <div>
      <p>\${price}</p>
      <select value={quantity} onChange={e => setQuantity(Number(e.target.value))}>
        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
      </select>
      <button onClick={() => onAddToCart(quantity)}>Add to Cart</button>
    </div>
  );
}

// Presentational: product details
function ProductDetails({ product, onAddToCart }) {
  return (
    <div>
      <img src={product.image} alt={product.name} />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <AddToCartForm price={product.price} onAddToCart={onAddToCart} />
    </div>
  );
}

// Container: owns data fetching and state
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetch(\`/api/products/\${productId}\`).then(r => r.json()).then(setProduct);
    fetch(\`/api/products/\${productId}/reviews\`).then(r => r.json()).then(setReviews);
  }, [productId]);

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <nav>Cart ({cartCount})</nav>
      <ProductDetails
        product={product}
        onAddToCart={(qty) => setCartCount(c => c + qty)}
      />
      <h2>Reviews ({reviews.length})</h2>
      {reviews.map(review => <ReviewCard key={review.id} review={review} />)}
    </div>
  );
}`,
      hints: [
        'Look for repeated UI patterns (ReviewCard)',
        'Look for related form controls (quantity + button)',
        'Separate the data fetching from the rendering',
        'Each component should have one clear responsibility',
      ],
    },
  ],

  keyTakeaways: [
    'A functional component is a pure JavaScript function that returns JSX. Component names must be capitalized.',
    'Composition is React\'s primary tool for managing complexity — build complex UIs from simple, focused components.',
    'Presentational components receive data via props and only render. Container components fetch data and pass it to presentational components.',
    'Never define components inside other components — creates remount bugs and destroys state.',
    'The children prop makes components flexible containers — they do not need to know what they contain.',
    'Lift state to the closest common parent when siblings need the same data.',
  ],

  nextLesson: 'props',
  prevLesson: 'jsx',
};
