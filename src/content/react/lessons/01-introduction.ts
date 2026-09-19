import type { Lesson } from '@/types';

export const introductionLesson: Lesson = {
  id: 'what-is-react',
  slug: 'what-is-react',
  title: 'What is React?',
  description:
    'Understand why React exists, the problems it solves over Vanilla JavaScript, the SPA model, Virtual DOM, and declarative UI — the foundational thinking every React developer needs.',
  category: 'Introduction',
  order: 1,
  difficulty: 'beginner',
  estimatedTime: 20,
  content: `React is a **JavaScript library for building user interfaces**, created by Facebook (Meta) and open-sourced in 2013. It is not a framework — it is a library focused entirely on one thing: rendering UI and keeping it in sync with data.

Before you write a single line of React, you need to understand *why it was built*. React did not appear because someone wanted a new syntax. It appeared because building large, interactive UIs in Vanilla JavaScript was becoming unmanageable.

---

## The Problem React Solves

Imagine you are building a social media feed. The page has:

- A list of posts
- A like count on each post
- A comment count
- A user avatar that appears in multiple places
- A notification badge in the header

Every time a user likes a post, you need to:

1. Update the like count on that specific post
2. Update the notification badge if needed
3. Make sure the avatar reflects the current user state
4. Not break anything else on the page

In Vanilla JavaScript, you do all of this with manual DOM manipulation:

\`\`\`js
// Vanilla JS approach
document.getElementById('like-count-42').innerText = newCount;
document.querySelector('.notification-badge').innerText = unreadCount;
document.querySelectorAll('.user-avatar').forEach(el => {
  el.src = newAvatarUrl;
});
\`\`\`

This works for small apps. But it does not scale.

**The core problems:**

1. **State and UI get out of sync.** You manually update the DOM. If you forget one element, or update it in the wrong order, the UI shows stale data. The bug is invisible — the data in memory is correct, but the screen is wrong.

2. **No single source of truth.** Your data lives in variables. Your UI lives in the DOM. They are separate. You must constantly bridge them by hand.

3. **DOM manipulation is expensive and fragile.** Reading and writing to the DOM repeatedly causes layout reflows. It is slow. And it is easy to accidentally overwrite DOM elements managed by other code.

4. **No component reuse.** If the same UI pattern appears in three places, you copy and paste HTML and JavaScript. When you need to change it, you change three places. You miss one. A bug is born.

5. **Impossible to reason about at scale.** When a button click triggers 15 different DOM mutations across the page, nobody can trace what changed what.

---

## React's Answer: Declarative UI

React introduced a different mental model.

**Imperative (Vanilla JS):** You tell the browser *how* to change the DOM, step by step.

**Declarative (React):** You describe *what* the UI should look like for a given state. React figures out how to get there.

\`\`\`
Vanilla JS: "Find element #like-count. Get its text. Parse it as a number. Add 1. Set the text back."

React: "When likes = 42, the UI looks like this. When likes = 43, the UI looks like this. You figure out what changed."
\`\`\`

This is not just a convenience. It is a fundamentally different way of thinking about UI.

In React:
- You define UI as a **function of state**
- When state changes, React **re-renders** and figures out the minimal DOM update
- You never touch the DOM directly

---

## What is a Single Page Application (SPA)?

Traditional websites reload the entire page on every navigation. The server sends a new HTML document for every click.

An SPA loads **one HTML page once** and dynamically updates the content using JavaScript. Navigation feels instant — there is no full page reload.

React is a natural fit for SPAs. When the user navigates from the home page to a profile page, React swaps out the components on screen. The URL changes. The page does not reload.

**SPA benefits:**
- Instant navigation after initial load
- Rich, app-like interactions
- Persistent state across navigation (e.g., audio keeps playing)

**SPA tradeoffs:**
- Larger initial JavaScript bundle
- SEO requires extra work (server-side rendering or SSG)
- First load can be slower

Meta's Facebook, Twitter, Airbnb, and Netflix all use SPA architecture with React.

---

## The Virtual DOM

React maintains a **Virtual DOM** — a JavaScript representation of the actual DOM.

When your state changes:

1. React re-renders your component and builds a new Virtual DOM tree
2. React **diffs** the new tree against the previous tree (reconciliation)
3. React calculates the minimal set of changes needed
4. React applies only those changes to the real DOM

\`\`\`
State changes → New Virtual DOM → Diff against old Virtual DOM → Minimal real DOM updates
\`\`\`

**Why this matters:** Direct DOM manipulation is expensive. By batching and minimizing DOM writes, React keeps the UI fast even in complex applications.

The Virtual DOM is an implementation detail — you never interact with it directly. But understanding it explains why React can be fast and why you should not mix React with direct DOM manipulation.

---

## Component-Based Architecture

React's other core idea is **components**.

A component is a reusable, self-contained piece of UI. It has its own:
- Structure (what it renders)
- Logic (how it behaves)
- State (what data it tracks)

Instead of one large HTML file, you build a tree of components:

\`\`\`
App
├── Header
│   ├── Logo
│   └── Navigation
├── Feed
│   ├── Post (repeated for each post)
│   │   ├── Avatar
│   │   ├── PostContent
│   │   └── LikeButton
└── Sidebar
    ├── TrendingTopics
    └── SuggestedUsers
\`\`\`

Each component is independent. Change the \`LikeButton\` component and every post's like button updates — you changed it in one place.

This is how React enables large teams to work on large codebases without stepping on each other.

---

## Why Companies Use React

**Meta (Facebook):** React was built at Facebook to solve their own UI complexity problem. Facebook.com and Instagram.com run on React.

**Netflix:** Uses React for their UI layer. The performance characteristics and component reusability were key factors.

**Airbnb:** Migrated to React and has contributed heavily to the open-source React ecosystem (react-dates, enzyme).

**Why the industry adopted React:**
1. **Component model** — maps naturally to how designers and developers think about UI
2. **Unidirectional data flow** — state flows down, events flow up. Predictable.
3. **Ecosystem** — React has the largest frontend ecosystem: state management, routing, UI libraries, testing tools
4. **Hiring market** — React developers are abundant and the pattern is standardized
5. **React Native** — same component model for mobile apps

---

## What React Is NOT

Before going further, clarify what React is not:

- React is **not a framework**. It handles the View layer only. You need to add routing (React Router), state management (Zustand/Redux), data fetching (TanStack Query) yourself.
- React is **not a replacement for JavaScript**. You still write JavaScript. React adds a component model and rendering engine on top.
- React is **not magic**. Components are functions. State is data. Rendering is function calls. Understanding this deeply is what separates good React developers from average ones.`,

  codeExamples: [
    {
      title: 'The Vanilla JS problem — manual DOM sync',
      code: `// Vanilla JavaScript — you manage the DOM manually
let likes = 0;

function handleLike() {
  likes++;

  // You must manually find and update every element that shows likes
  document.getElementById('like-count').textContent = likes;
  document.getElementById('like-btn').textContent = likes > 0 ? 'Liked' : 'Like';

  // What if you forget to update one of these?
  // The data is correct. The screen is wrong. A silent bug.
}

document.getElementById('like-btn').addEventListener('click', handleLike);`,
      explanation:
        'In Vanilla JS, you are responsible for keeping the DOM in sync with your data. Every mutation requires manual DOM updates. Miss one and you have a stale UI bug.',
    },
    {
      title: 'The React answer — declarative UI',
      code: `// React — you describe WHAT the UI looks like for a given state
import { useState } from 'react';

function LikeButton() {
  const [likes, setLikes] = useState(0);

  // You do not touch the DOM. You update state.
  // React re-renders and syncs the DOM automatically.
  return (
    <div>
      <button onClick={() => setLikes(likes + 1)}>
        {likes > 0 ? 'Liked' : 'Like'}
      </button>
      <span>{likes} likes</span>
    </div>
  );
}

// When likes changes: React re-renders, diffs the Virtual DOM,
// and updates only what changed in the real DOM.`,
      explanation:
        'React separates "what the UI should look like" (your description) from "how to update the DOM" (React\'s job). You update state. React keeps the DOM in sync. You can never forget to update a DOM element because you never update DOM elements directly.',
    },
    {
      title: 'Component tree — reusable, composable UI',
      code: `// A simple component tree
function Avatar({ src, alt }) {
  return <img className="avatar" src={src} alt={alt} />;
}

function PostHeader({ author }) {
  return (
    <div className="post-header">
      {/* Avatar is reused anywhere you need it */}
      <Avatar src={author.avatarUrl} alt={author.name} />
      <span>{author.name}</span>
    </div>
  );
}

function Post({ post }) {
  return (
    <div className="post">
      <PostHeader author={post.author} />
      <p>{post.content}</p>
      <LikeButton initialLikes={post.likes} postId={post.id} />
    </div>
  );
}

// The Feed renders a list of Posts
function Feed({ posts }) {
  return (
    <div className="feed">
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}`,
      explanation:
        'Components compose into trees. Avatar is defined once and reused in PostHeader, UserProfile, Comment, and anywhere else it appears. Change Avatar once — it updates everywhere.',
    },
    {
      title: 'Declarative vs Imperative — the mental shift',
      code: `// Imperative: "DO these steps in this order"
function showUserImperative(user) {
  const container = document.getElementById('user-card');
  container.innerHTML = '';

  const avatar = document.createElement('img');
  avatar.src = user.avatarUrl;
  container.appendChild(avatar);

  const name = document.createElement('h2');
  name.textContent = user.name;
  container.appendChild(name);

  if (user.isOnline) {
    const badge = document.createElement('span');
    badge.textContent = 'Online';
    badge.className = 'online-badge';
    container.appendChild(badge);
  }
}

// Declarative: "This is WHAT it looks like"
function UserCard({ user }) {
  return (
    <div id="user-card">
      <img src={user.avatarUrl} alt={user.name} />
      <h2>{user.name}</h2>
      {user.isOnline && <span className="online-badge">Online</span>}
    </div>
  );
}
// React handles all the DOM work. You just describe the output.`,
      explanation:
        'The declarative version reads like a description: "A user card contains an avatar, a name, and an online badge if the user is online." The imperative version reads like instructions. Declarative code is easier to understand, test, and maintain.',
    },
  ],

  commonMistakes: [
    'Thinking React is a full framework — React only handles the View layer. You must add routing, state management, and data fetching separately.',
    'Trying to mix direct DOM manipulation (document.getElementById) with React. React owns the DOM it renders. Direct manipulation creates conflicts.',
    'Thinking the Virtual DOM means React is always fast. The Virtual DOM is an optimization, not a guarantee. Poor component design or unnecessary re-renders still cause performance problems.',
    'Skipping the "why" and jumping straight to syntax. Without understanding what problem React solves, the API decisions feel arbitrary.',
    'Believing React is the only option. Svelte, Vue, Solid, and Angular solve the same problems differently. Knowing why React makes the tradeoffs it does helps you evaluate alternatives.',
  ],

  interviewQuestions: [
    {
      question: 'What is React and why was it created?',
      answer:
        'React is a JavaScript library for building user interfaces, created by Facebook and open-sourced in 2013. It was created to solve the problem of building large, interactive UIs where keeping the DOM in sync with application state was error-prone and expensive. React introduces a declarative programming model where you describe what the UI should look like for a given state, and React handles all DOM updates automatically.',
      difficulty: 'beginner',
    },
    {
      question: 'What is the Virtual DOM and why does React use it?',
      answer:
        'The Virtual DOM is a JavaScript object representation of the real DOM. When state changes, React builds a new Virtual DOM tree and compares (diffs) it against the previous one using its reconciliation algorithm. React then applies only the minimal set of changes to the real DOM. This matters because direct DOM manipulation is expensive — batching and minimizing DOM writes improves performance significantly in complex UIs.',
      difficulty: 'beginner',
    },
    {
      question: 'What is the difference between declarative and imperative programming in the context of React?',
      answer:
        'Imperative programming describes HOW to do something — "find this element, change its text, add this class." Vanilla JS DOM manipulation is imperative. Declarative programming describes WHAT the output should be — "when the user is online, the card looks like this; when offline, it looks like this." React is declarative: you describe the UI as a function of state, and React figures out how to update the DOM to match. Declarative code is easier to understand, test, and predict because the UI is always a direct reflection of state.',
      difficulty: 'beginner',
    },
    {
      question: 'What problems does component-based architecture solve?',
      answer:
        'Component-based architecture solves: (1) Code reuse — define a Button or Avatar once, use it everywhere; (2) Separation of concerns — each component owns its own logic and UI; (3) Independent development — teams can work on different components without conflicts; (4) Easier testing — components are functions, easy to unit test in isolation; (5) Maintainability — changing a component updates every usage automatically.',
      difficulty: 'beginner',
    },
    {
      question: 'What is a Single Page Application (SPA)?',
      answer:
        'An SPA loads a single HTML document once and dynamically updates the content as the user navigates, without full page reloads. JavaScript intercepts navigation events, fetches data, and updates the DOM. React applications are typically SPAs. Benefits: instant navigation after initial load, app-like interactions, persistent state. Tradeoffs: larger initial bundle, SEO requires extra work (SSR/SSG), potentially slower first load.',
      difficulty: 'beginner',
    },
  ],

  exercises: [
    {
      id: 'react-intro-ex-1',
      title: 'Identify Component Boundaries',
      description:
        'Look at a Twitter/X post. Identify at least 5 distinct components you would create. Write their names and describe what each one renders and what state (if any) each one owns.',
      starterCode: `// Write your component breakdown below as comments
// Example:
// TweetCard — renders the full tweet, owns expanded/collapsed state
//
// Your answer:
// 1.
// 2.
// 3.
// 4.
// 5.`,
      solution: `// TweetCard — renders the full tweet container
// Avatar — renders user profile picture (no state — receives src/alt as props)
// TweetContent — renders tweet text, images, links (no state)
// LikeButton — renders like count and icon, owns optimistic like state
// RetweetButton — renders retweet count, owns retweet menu open/closed state
// ReplyButton — renders reply count (no state — opens a modal above it)
// Timestamp — renders relative time (e.g. "2h ago") — could be stateless
// MoreOptionsMenu — renders the three-dot menu, owns open/closed state`,
      hints: [
        'Look for repeated UI patterns — those are components',
        'Ask: what data does this piece of UI need? Who provides it?',
        'Ask: does this piece of UI have its own behavior (open/close, loading)?',
      ],
    },
    {
      id: 'react-intro-ex-2',
      title: 'Translate Imperative to Declarative Thinking',
      description:
        'You have this imperative Vanilla JS code. Write what the declarative React description (in plain English, not code) would be for the same UI.',
      starterCode: `// Imperative Vanilla JS code:
function renderProfile(user) {
  document.getElementById('avatar').src = user.photo;
  document.getElementById('username').textContent = user.name;

  if (user.isPremium) {
    document.getElementById('badge').style.display = 'block';
    document.getElementById('badge').textContent = 'Premium';
  } else {
    document.getElementById('badge').style.display = 'none';
  }

  if (user.followersCount > 1000) {
    document.getElementById('popular-tag').style.display = 'block';
  }
}

// Write your declarative description here as a comment:
// "A UserProfile card shows..."`,
      solution: `// Declarative description:
// "A UserProfile card shows the user's photo and name.
// If the user is premium, a 'Premium' badge is visible.
// If the user has more than 1000 followers, a 'Popular' tag is visible."

// In React (for reference):
function UserProfile({ user }) {
  return (
    <div className="profile">
      <img src={user.photo} alt={user.name} />
      <span>{user.name}</span>
      {user.isPremium && <span className="badge">Premium</span>}
      {user.followersCount > 1000 && <span className="tag">Popular</span>}
    </div>
  );
}

// Notice: the component reads exactly like the description.
// No instructions. Just a description of the output.`,
      hints: [
        'Start with: "This component shows..."',
        'For conditionals: "If X, then Y is visible"',
        'You are describing the output, not the steps to create it',
      ],
    },
  ],

  keyTakeaways: [
    'React solves the problem of keeping UI in sync with state in large applications — a problem Vanilla JS handles poorly at scale.',
    'React is declarative: you describe WHAT the UI should look like, not HOW to manipulate the DOM. React handles DOM updates.',
    'The Virtual DOM is React\'s internal mechanism for computing minimal DOM updates. You never interact with it directly.',
    'Component-based architecture enables reuse, independent development, and maintainable UI at scale.',
    'React is a library for the View layer only — not a full framework. You compose it with other tools.',
    'Unidirectional data flow (state flows down, events flow up) makes React UIs predictable and debuggable.',
  ],

  nextLesson: 'react-architecture',
};
