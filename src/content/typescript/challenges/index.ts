import type { Challenge } from '@/types';

export const challenges: Challenge[] = [
  // ─── BASIC TYPES ────────────────────────────────────────────────────────────
  {
    id: 'ts-annotate-function',
    slug: 'ts-annotate-function',
    title: 'Annotate a Function',
    description: 'Add TypeScript type annotations to this JavaScript function so it is fully typed.',
    difficulty: 'beginner',
    topic: 'Basic Types',
    starterCode: `function calculateDiscount(price, discountPercent) {
  return price - (price * discountPercent) / 100;
}

console.log(calculateDiscount(100, 20)); // 80
console.log(calculateDiscount(250, 10)); // 225`,
    solution: `function calculateDiscount(price: number, discountPercent: number): number {
  return price - (price * discountPercent) / 100;
}

console.log(calculateDiscount(100, 20)); // 80
console.log(calculateDiscount(250, 10)); // 225`,
    hints: [
      'Add : type after each parameter',
      'Add : returnType after the closing parenthesis',
      'Both parameters and return value are numbers',
    ],
    explanation: 'Type annotations use : TypeName syntax. Parameters are annotated after their name, return types go after the closing parenthesis. TypeScript will now catch calls with wrong argument types.',
    tags: ['types', 'functions', 'beginner'],
  },
  {
    id: 'ts-unknown-vs-any',
    slug: 'ts-unknown-vs-any',
    title: 'Fix the any — Use unknown',
    description: 'Replace the unsafe any with unknown and add proper narrowing before using the value.',
    difficulty: 'beginner',
    topic: 'Basic Types',
    starterCode: `function processInput(value: any): string {
  // BUG: This will crash at runtime if value is a number
  return value.toUpperCase();
}

console.log(processInput("hello")); // "HELLO"
console.log(processInput(42));      // Runtime crash!`,
    solution: `function processInput(value: unknown): string {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return String(value).toUpperCase();
}

console.log(processInput("hello")); // "HELLO"
console.log(processInput(42));      // "42"`,
    hints: [
      'Change any to unknown',
      'Use typeof value === "string" to narrow before calling string methods',
      'Handle the non-string case with String(value)',
    ],
    explanation: 'unknown forces you to check the type before using the value. any bypasses all checks. Use unknown for values from external sources — it catches bugs that any hides.',
    tags: ['types', 'unknown', 'narrowing', 'beginner'],
  },
  {
    id: 'ts-never-exhaustive',
    slug: 'ts-never-exhaustive',
    title: 'Add Exhaustive Check with never',
    description: 'Add a never-based exhaustive check so TypeScript errors if a new shape is added without handling.',
    difficulty: 'intermediate',
    topic: 'Basic Types',
    starterCode: `type Shape = 'circle' | 'square' | 'triangle';

function area(shape: Shape, size: number): number {
  if (shape === 'circle') return Math.PI * size * size;
  if (shape === 'square') return size * size;
  // Missing triangle case — no compile-time safety!
  return 0;
}`,
    solution: `type Shape = 'circle' | 'square' | 'triangle';

function area(shape: Shape, size: number): number {
  if (shape === 'circle') return Math.PI * size * size;
  if (shape === 'square') return size * size;
  if (shape === 'triangle') return 0.5 * size * size;

  const _exhaustive: never = shape;
  throw new Error(\`Unhandled shape: \${shape}\`);
}`,
    hints: [
      'Handle all union members first',
      'In the final else/default: assign shape to a never variable',
      'TypeScript will error if shape is not never at that point',
    ],
    explanation: 'Assigning to never is a compile-time assertion that "this code is unreachable". If you add "hexagon" to Shape but forget to handle it, TypeScript errors on the never assignment — catching the bug at compile time.',
    tags: ['never', 'exhaustive', 'unions', 'intermediate'],
  },

  // ─── INTERFACES & TYPES ──────────────────────────────────────────────────────
  {
    id: 'ts-interface-user',
    slug: 'ts-interface-user',
    title: 'Design a User Interface',
    description: 'Create a TypeScript interface for a user profile with required, optional, and readonly fields.',
    difficulty: 'beginner',
    topic: 'Interfaces',
    starterCode: `// Design a User interface:
// - readonly: id (string), createdAt (Date)
// - required: name (string), email (string)
// - optional: bio (string), avatarUrl (string), role ("admin" | "user" | "guest")

interface User {
  // fill in
}

// Test: this should work without errors
const user: User = {
  id: 'usr-1',
  name: 'Alice',
  email: 'alice@example.com',
  createdAt: new Date(),
};

console.log(user.name); // "Alice"`,
    solution: `interface User {
  readonly id: string;
  readonly createdAt: Date;
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  role?: 'admin' | 'user' | 'guest';
}

const user: User = {
  id: 'usr-1',
  name: 'Alice',
  email: 'alice@example.com',
  createdAt: new Date(),
};

console.log(user.name); // "Alice"`,
    hints: [
      'readonly goes before the property name',
      '? after the property name makes it optional',
      'Union types use | between the options',
    ],
    explanation: 'readonly prevents reassignment after creation. ? makes a property optional (it becomes T | undefined). Union literal types ("admin" | "user") restrict the value to those specific strings.',
    tags: ['interfaces', 'readonly', 'optional', 'beginner'],
  },
  {
    id: 'ts-extend-interface',
    slug: 'ts-extend-interface',
    title: 'Extend Interfaces',
    description: 'Create a BaseEntity interface and extend it for User and Post entities.',
    difficulty: 'intermediate',
    topic: 'Interfaces',
    starterCode: `// Create:
// 1. BaseEntity: readonly id (string), readonly createdAt (Date), updatedAt (Date)
// 2. User extends BaseEntity: name, email, role ("admin"|"user")
// 3. Post extends BaseEntity: title, content, authorId (string), published (boolean)

interface BaseEntity {
  // fill in
}

interface User extends BaseEntity {
  // fill in
}

interface Post extends BaseEntity {
  // fill in
}`,
    solution: `interface BaseEntity {
  readonly id: string;
  readonly createdAt: Date;
  updatedAt: Date;
}

interface User extends BaseEntity {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface Post extends BaseEntity {
  title: string;
  content: string;
  authorId: string;
  published: boolean;
}

const post: Post = {
  id: 'post-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  title: 'TypeScript is Great',
  content: 'Here is why...',
  authorId: 'usr-1',
  published: true,
};`,
    hints: [
      'Use interface Child extends Parent {} syntax',
      'The child gets all parent fields automatically',
      'You only need to add the new fields in the child',
    ],
    explanation: 'extends creates an inheritance relationship. User and Post automatically get id, createdAt, and updatedAt from BaseEntity. Changing BaseEntity updates all child interfaces.',
    tags: ['interfaces', 'extends', 'inheritance', 'intermediate'],
  },

  // ─── GENERICS ────────────────────────────────────────────────────────────────
  {
    id: 'ts-generic-identity',
    slug: 'ts-generic-identity',
    title: 'Write Your First Generic Function',
    description: 'Convert these two duplicate functions into a single generic function.',
    difficulty: 'beginner',
    topic: 'Generics',
    starterCode: `// These two functions do the same thing but for different types
// Combine them into ONE generic function

function lastNumber(arr: number[]): number | undefined {
  return arr[arr.length - 1];
}

function lastString(arr: string[]): string | undefined {
  return arr[arr.length - 1];
}

console.log(lastNumber([1, 2, 3]));       // 3
console.log(lastString(['a', 'b', 'c'])); // 'c'`,
    solution: `function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

console.log(last([1, 2, 3]));       // 3
console.log(last(['a', 'b', 'c'])); // 'c'
console.log(last([true, false]));   // false`,
    hints: [
      'Add <T> after the function name',
      'Replace number and string with T',
      'The return type is T | undefined',
    ],
    explanation: 'The <T> is a type parameter — a placeholder TypeScript fills in based on what you pass. When you call last([1, 2, 3]), TypeScript infers T = number and returns number | undefined.',
    tags: ['generics', 'functions', 'beginner'],
  },
  {
    id: 'ts-generic-pick',
    slug: 'ts-generic-pick',
    title: 'Implement Pick<T, K> from Scratch',
    description: 'Build a type-safe pick function that selects specific keys from an object.',
    difficulty: 'intermediate',
    topic: 'Generics',
    starterCode: `// Implement pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>
// It should return a new object with only the specified keys

function pick(obj: any, keys: string[]): any {
  // replace any with proper generics
  const result: any = {};
  keys.forEach(key => { result[key] = (obj as any)[key]; });
  return result;
}

const user = { id: 1, name: 'Alice', email: 'alice@example.com', password: 'secret' };
const safe = pick(user, ['id', 'name', 'email']);
// safe should be typed as { id: number; name: string; email: string }`,
    solution: `function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    result[key] = obj[key];
  });
  return result;
}

const user = { id: 1, name: 'Alice', email: 'alice@example.com', password: 'secret' };
const safe = pick(user, ['id', 'name', 'email']);
// TypeScript knows: safe is { id: number; name: string; email: string }
console.log(safe);`,
    hints: [
      'K extends keyof T ensures K is a valid key of T',
      'Pick<T, K> is the built-in utility type for the return',
      'Cast the initial object as Pick<T, K> to satisfy TypeScript',
    ],
    explanation: 'K extends keyof T constrains K to be valid keys of T. The return type Pick<T, K> is the built-in utility type — TypeScript knows exactly which properties are in the result.',
    tags: ['generics', 'keyof', 'utility-types', 'intermediate'],
  },
  {
    id: 'ts-generic-result',
    slug: 'ts-generic-result',
    title: 'Build a Result Type',
    description: 'Create a generic Result<T, E> type and implement a safe division function using it.',
    difficulty: 'intermediate',
    topic: 'Generics',
    starterCode: `// Create a Result type:
// Result<T, E> = { ok: true; data: T } | { ok: false; error: E }

// Then implement safeDivide(a, b) using Result:
// - Returns ok: true with the result if b !== 0
// - Returns ok: false with error message if b === 0

type Result<T, E> = // your type here

function safeDivide(a: number, b: number): Result<number, string> {
  // implement
}

const r1 = safeDivide(10, 2);
const r2 = safeDivide(10, 0);`,
    solution: `type Result<T, E> =
  | { ok: true; data: T }
  | { ok: false; error: E };

function safeDivide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return { ok: false, error: 'Division by zero' };
  }
  return { ok: true, data: a / b };
}

const r1 = safeDivide(10, 2);
if (r1.ok) console.log(r1.data); // 5

const r2 = safeDivide(10, 0);
if (!r2.ok) console.log(r2.error); // "Division by zero"`,
    hints: [
      'Use a discriminated union with the ok: true/false discriminant',
      'Return the appropriate variant from safeDivide',
      'TypeScript narrows to the correct variant when you check r.ok',
    ],
    explanation: 'The Result pattern represents errors as values instead of exceptions. The discriminated union (ok: true/false) lets TypeScript narrow to the correct variant — callers must handle both cases.',
    tags: ['generics', 'discriminated-unions', 'result-pattern', 'intermediate'],
  },

  // ─── UTILITY TYPES ───────────────────────────────────────────────────────────
  {
    id: 'ts-utility-types-api',
    slug: 'ts-utility-types-api',
    title: 'Shape API Types with Utility Types',
    description: 'Use Partial, Omit, Pick, and Required to create all the API types for a User resource.',
    difficulty: 'intermediate',
    topic: 'Utility Types',
    starterCode: `interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

// Create these using ONLY utility types:
type PublicUser = // All fields except passwordHash
type CreateUserInput = // name and email only (no id, no passwordHash, no createdAt)
type UpdateUserInput = // name and email — both optional
type AdminUser = // All fields, all required (no optionals)`,
    solution: `interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

type PublicUser = Omit<User, 'passwordHash'>;
type CreateUserInput = Pick<User, 'name' | 'email'>;
type UpdateUserInput = Partial<Pick<User, 'name' | 'email'>>;
type AdminUser = Required<User>;

const input: CreateUserInput = { name: 'Alice', email: 'alice@example.com' };
const update: UpdateUserInput = { name: 'Alice Updated' }; // email is optional`,
    hints: [
      'Omit removes keys, Pick selects keys',
      'Partial makes all properties optional',
      'Combine utility types: Partial<Pick<T, K>> for optional subset',
    ],
    explanation: 'Utility types compose to create precise types for each API operation. Omit removes sensitive fields. Pick selects only what is needed. Partial makes fields optional for updates.',
    tags: ['utility-types', 'partial', 'pick', 'omit', 'intermediate'],
  },
  {
    id: 'ts-record-type',
    slug: 'ts-record-type',
    title: 'Type a Permission System with Record',
    description: 'Use Record<K, V> to create a typed permission map for user roles.',
    difficulty: 'intermediate',
    topic: 'Utility Types',
    starterCode: `type UserRole = 'admin' | 'editor' | 'viewer';
type Permission = 'read' | 'write' | 'delete' | 'admin';

// Create a type where every role has an array of permissions
// Then create the actual permissions object
// TypeScript should error if a role is missing

type RolePermissions = // use Record

const permissions: RolePermissions = {
  // fill in — all 3 roles required
};

function hasPermission(role: UserRole, permission: Permission): boolean {
  return permissions[role].includes(permission);
}`,
    solution: `type UserRole = 'admin' | 'editor' | 'viewer';
type Permission = 'read' | 'write' | 'delete' | 'admin';

type RolePermissions = Record<UserRole, Permission[]>;

const permissions: RolePermissions = {
  admin:  ['read', 'write', 'delete', 'admin'],
  editor: ['read', 'write'],
  viewer: ['read'],
};

function hasPermission(role: UserRole, permission: Permission): boolean {
  return permissions[role].includes(permission);
}

console.log(hasPermission('admin', 'delete'));  // true
console.log(hasPermission('viewer', 'write')); // false`,
    hints: [
      'Record<K, V> creates { [key in K]: V }',
      'If a role is missing, TypeScript will error',
      'K is the union of roles, V is Permission[]',
    ],
    explanation: 'Record<UserRole, Permission[]> is equivalent to { admin: Permission[]; editor: Permission[]; viewer: Permission[] }. TypeScript errors if any role is missing from the object.',
    tags: ['utility-types', 'record', 'intermediate'],
  },

  // ─── ADVANCED TYPES ──────────────────────────────────────────────────────────
  {
    id: 'ts-mapped-type',
    slug: 'ts-mapped-type',
    title: 'Build a Nullable Mapped Type',
    description: 'Write a Nullable<T> mapped type that makes every property T | null.',
    difficulty: 'advanced',
    topic: 'Advanced Types',
    starterCode: `// Implement Nullable<T> — makes every property T[K] | null
// Do NOT use the built-in Partial or Readonly — write it from scratch

type Nullable<T> = // your mapped type

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

type NullableUser = Nullable<User>;
// Should be: { id: string | null; name: string | null; email: string | null; age: number | null }

const emptyUser: NullableUser = {
  id: null,
  name: null,
  email: null,
  age: null,
};`,
    solution: `type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

type NullableUser = Nullable<User>;

const emptyUser: NullableUser = {
  id: null,
  name: null,
  email: null,
  age: null,
};

// Can also mix null and real values:
const partialUser: NullableUser = {
  id: 'usr-1',
  name: 'Alice',
  email: null,
  age: null,
};`,
    hints: [
      'Use [K in keyof T] to iterate over all keys',
      'The value type is T[K] | null (original type or null)',
      'This is a mapped type — no need for if/else',
    ],
    explanation: '[K in keyof T] iterates over all keys of T. T[K] is the original value type. Adding | null makes every property nullable. This is how TypeScript builds Partial, Readonly, etc. internally.',
    tags: ['mapped-types', 'advanced', 'keyof'],
  },
  {
    id: 'ts-conditional-flatten',
    slug: 'ts-conditional-flatten',
    title: 'Write a Flatten Conditional Type',
    description: 'Write a Flatten<T> type that unwraps one level of array nesting.',
    difficulty: 'advanced',
    topic: 'Advanced Types',
    starterCode: `// Implement Flatten<T>:
// If T is an array (T[]), return the element type
// If T is not an array, return T as-is

type Flatten<T> = // your conditional type

// Test:
type A = Flatten<string[]>;   // should be: string
type B = Flatten<number[]>;   // should be: number
type C = Flatten<string>;     // should be: string (not an array)
type D = Flatten<User[]>;     // should be: User`,
    solution: `type Flatten<T> = T extends (infer E)[] ? E : T;

type A = Flatten<string[]>; // string
type B = Flatten<number[]>; // number
type C = Flatten<string>;   // string
type D = Flatten<User[]>;   // User

// Recursive version that flattens all levels:
type DeepFlatten<T> = T extends (infer E)[] ? DeepFlatten<E> : T;

type X = DeepFlatten<number[][][]>; // number`,
    hints: [
      'Use T extends (infer E)[] to check if T is an array and capture the element type',
      'Return E (the element type) if it is an array, T if it is not',
      'infer captures the element type from within the extends clause',
    ],
    explanation: 'T extends (infer E)[] matches arrays and captures the element type as E. If T is not an array, the condition is false and T is returned as-is. This is the infer keyword in action.',
    tags: ['conditional-types', 'infer', 'advanced'],
  },

  // ─── REACT ───────────────────────────────────────────────────────────────────
  {
    id: 'ts-react-props',
    slug: 'ts-react-props',
    title: 'Type React Component Props',
    description: 'Add TypeScript types to this React component\'s props interface.',
    difficulty: 'intermediate',
    topic: 'React',
    starterCode: `// Add proper TypeScript types to the props

function UserCard({ user, onEdit, onDelete, showActions }) {
  return (
    <div className="card">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      {showActions && (
        <div>
          <button onClick={() => onEdit(user.id)}>Edit</button>
          <button onClick={() => onDelete(user.id)}>Delete</button>
        </div>
      )}
    </div>
  );
}`,
    solution: `interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  showActions?: boolean;
}

function UserCard({ user, onEdit, onDelete, showActions = true }: UserCardProps) {
  return (
    <div className="card">
      {user.avatar && <img src={user.avatar} alt={user.name} />}
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      {showActions && (
        <div>
          <button onClick={() => onEdit(user.id)}>Edit</button>
          <button onClick={() => onDelete(user.id)}>Delete</button>
        </div>
      )}
    </div>
  );
}`,
    hints: [
      'Define a User interface first',
      'Callback props are typed as (id: string) => void',
      'showActions is a boolean — use ? to make it optional with a default',
    ],
    explanation: 'Props interfaces define the contract for component usage. Callback types like (id: string) => void ensure callers pass the right handler signature. Optional props (?) can have defaults in destructuring.',
    tags: ['react', 'props', 'interfaces', 'intermediate'],
  },
  {
    id: 'ts-react-generic-list',
    slug: 'ts-react-generic-list',
    title: 'Generic List Component',
    description: 'Convert this hardcoded list component into a generic component that works with any item type.',
    difficulty: 'advanced',
    topic: 'React',
    starterCode: `// Currently only works with User
function UserList({ users, onSelect }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id} onClick={() => onSelect(user)}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}

// Make it generic so it works with ANY type:
// <List<User> items={users} keyExtractor={u => u.id} renderItem={u => u.name} onSelect={...} />
// <List<Post> items={posts} keyExtractor={p => p.id} renderItem={p => p.title} onSelect={...} />`,
    solution: `import React from 'react';

interface ListProps<T> {
  items: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  onSelect?: (item: T) => void;
  className?: string;
}

function List<T>({ items, keyExtractor, renderItem, onSelect, className }: ListProps<T>) {
  return (
    <ul className={className}>
      {items.map(item => (
        <li
          key={keyExtractor(item)}
          onClick={onSelect ? () => onSelect(item) : undefined}
          style={{ cursor: onSelect ? 'pointer' : 'default' }}
        >
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

// Usage:
interface User { id: string; name: string; }
interface Post { id: string; title: string; }

<List<User>
  items={users}
  keyExtractor={u => u.id}
  renderItem={u => u.name}
  onSelect={u => console.log(u.id)}
/>`,
    hints: [
      'Add <T> to the interface name: interface ListProps<T>',
      'Add <T> after the function name: function List<T>',
      'keyExtractor, renderItem, and onSelect all use T',
    ],
    explanation: 'Generic components work with any typed data. ListProps<T> makes the items array, keyExtractor, and renderItem all use the same type T. TypeScript ensures they are consistent.',
    tags: ['react', 'generics', 'components', 'advanced'],
  },

  // ─── ERROR HANDLING ──────────────────────────────────────────────────────────
  {
    id: 'ts-safe-json-parse',
    slug: 'ts-safe-json-parse',
    title: 'Safe JSON Parser with Result Type',
    description: 'Write safeJsonParse<T> that returns a Result type instead of throwing on invalid JSON.',
    difficulty: 'intermediate',
    topic: 'Error Handling',
    starterCode: `// JSON.parse throws on invalid JSON.
// Write safeJsonParse<T> that never throws.
// Return { ok: true, data: T } or { ok: false, error: string }

type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function safeJsonParse<T>(input: string): ParseResult<T> {
  // implement
}

const r1 = safeJsonParse<{ name: string }>('{"name":"Alice"}');
// r1.ok === true, r1.data.name === "Alice"

const r2 = safeJsonParse<{ name: string }>('not json');
// r2.ok === false, r2.error contains the error message`,
    solution: `type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function safeJsonParse<T>(input: string): ParseResult<T> {
  try {
    const data = JSON.parse(input) as T;
    return { ok: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid JSON';
    return { ok: false, error: message };
  }
}

const r1 = safeJsonParse<{ name: string }>('{"name":"Alice"}');
if (r1.ok) console.log(r1.data.name); // "Alice"

const r2 = safeJsonParse<{ name: string }>('not json');
if (!r2.ok) console.log(r2.error); // "Unexpected token..."`,
    hints: [
      'Wrap JSON.parse in try/catch',
      'On success return { ok: true, data }',
      'On failure, extract message with instanceof Error check',
    ],
    explanation: 'The Result pattern converts exceptions into typed values. Callers handle both cases at compile time — they cannot accidentally use data without checking ok first.',
    tags: ['error-handling', 'result-type', 'generics', 'intermediate'],
  },

  // ─── CLASSES ─────────────────────────────────────────────────────────────────
  {
    id: 'ts-class-stack',
    slug: 'ts-class-stack',
    title: 'Build a Typed Stack',
    description: 'Implement a generic Stack<T> class with push, pop, peek, isEmpty, and size.',
    difficulty: 'intermediate',
    topic: 'Classes',
    starterCode: `// Implement Stack<T> with:
// push(item: T): void
// pop(): T | undefined
// peek(): T | undefined
// isEmpty(): boolean
// get size(): number

class Stack {
  // make this generic
}

const stack = new Stack<number>();
stack.push(1);
stack.push(2);
stack.push(3);
console.log(stack.peek());  // 3
console.log(stack.pop());   // 3
console.log(stack.size);    // 2`,
    solution: `class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  get size(): number {
    return this.items.length;
  }
}

const stack = new Stack<number>();
stack.push(1);
stack.push(2);
stack.push(3);
console.log(stack.peek());  // 3
console.log(stack.pop());   // 3
console.log(stack.size);    // 2`,
    hints: [
      'Add <T> after the class name',
      'Use T[] for the private items array',
      'All methods that deal with items use T',
    ],
    explanation: 'Generic classes maintain type safety throughout all methods. new Stack<number>() creates a stack that only accepts numbers. The type T flows through every method automatically.',
    tags: ['classes', 'generics', 'data-structures', 'intermediate'],
  },

  // ─── MIGRATION ───────────────────────────────────────────────────────────────
  {
    id: 'ts-migrate-service',
    slug: 'ts-migrate-service',
    title: 'Migrate a JavaScript Service',
    description: 'Convert this JavaScript service class to TypeScript with proper types throughout.',
    difficulty: 'intermediate',
    topic: 'Migration',
    starterCode: `// Migrate this JavaScript class to TypeScript
// Add proper types for: constructor params, methods, return types

class ProductService {
  constructor(products) {
    this.products = products;
  }

  findById(id) {
    return this.products.find(p => p.id === id) || null;
  }

  findByCategory(category) {
    return this.products.filter(p => p.category === category);
  }

  search(query) {
    const q = query.toLowerCase();
    return this.products.filter(
      p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  getTotalValue() {
    return this.products.reduce((sum, p) => sum + p.price * p.stock, 0);
  }
}`,
    solution: `interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

class ProductService {
  constructor(private readonly products: Product[]) {}

  findById(id: string): Product | null {
    return this.products.find(p => p.id === id) ?? null;
  }

  findByCategory(category: string): Product[] {
    return this.products.filter(p => p.category === category);
  }

  search(query: string): Product[] {
    const q = query.toLowerCase();
    return this.products.filter(
      p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  getTotalValue(): number {
    return this.products.reduce((sum, p) => sum + p.price * p.stock, 0);
  }
}`,
    hints: [
      'Define a Product interface first',
      'Use constructor shorthand: constructor(private readonly products: Product[])',
      'Return types: Product | null, Product[], number',
    ],
    explanation: 'Migration pattern: define the data interface first, then migrate the class. Constructor shorthand eliminates the this.products = products boilerplate. All method return types are now explicit.',
    tags: ['migration', 'classes', 'interfaces', 'intermediate'],
  },
];
