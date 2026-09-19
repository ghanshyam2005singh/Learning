import type { InterviewQuestion } from '@/types';

export const interviewQuestions: InterviewQuestion[] = [
  // ─── BEGINNER ────────────────────────────────────────────────────────────────
  {
    question: 'What is TypeScript and how is it different from JavaScript?',
    answer: 'TypeScript is a statically typed superset of JavaScript developed by Microsoft. It adds optional static typing, interfaces, generics, and other features on top of JavaScript. The key difference: JavaScript catches type errors at runtime, TypeScript catches them at compile time. TypeScript compiles to plain JavaScript — all type information is erased at runtime (type erasure). This means TypeScript has zero runtime cost.',
    difficulty: 'beginner',
    tip: 'Always mention: superset of JS, compile-time type checking, and type erasure.',
  },
  {
    question: 'What is type erasure in TypeScript?',
    answer: 'Type erasure is the process by which TypeScript removes all type annotations, interfaces, generics, and TypeScript-specific syntax during compilation. The output is plain JavaScript. This means types have zero runtime cost — they exist only during development to catch bugs. You cannot use TypeScript types at runtime for instanceof checks or dynamic behavior.',
    difficulty: 'beginner',
  },
  {
    question: 'What is the difference between any and unknown in TypeScript?',
    answer: 'Both allow a variable to hold any type of value. The critical difference is in usage: any disables all type checking — you can call any method, access any property, and TypeScript will not complain. unknown is the safe version — TypeScript requires you to narrow the type (typeof, instanceof, or custom type guard) before using the value. Use unknown for external data (API responses, JSON.parse). Avoid any in new code.',
    difficulty: 'beginner',
    followUp: ['When would you use any?', 'How do you narrow an unknown type?'],
    tip: 'Interviewers love this question. Key phrase: "unknown forces you to prove the type before using it."',
  },
  {
    question: 'What is type inference in TypeScript?',
    answer: 'Type inference is TypeScript\'s ability to automatically determine the type of a variable without an explicit annotation. TypeScript infers types from: variable assignments (const x = 5 → number), function return values (from return statements), array elements, object properties, and callback parameters from context. You should let TypeScript infer where it can and only annotate what it cannot figure out — mainly function parameters.',
    difficulty: 'beginner',
    followUp: ['When should you add explicit type annotations?', 'What does as const do to inference?'],
  },
  {
    question: 'What are the primitive types in TypeScript?',
    answer: 'TypeScript has all JavaScript primitives: string, number, boolean, null, undefined, bigint, symbol. It adds: any (disable type checking), unknown (safe any — must narrow before use), never (impossible value — functions that throw or infinite loops), and void (function returns nothing). The most important addition is unknown — it is the type-safe replacement for any when you do not know the type upfront.',
    difficulty: 'beginner',
  },
  {
    question: 'What is tsconfig.json and what are the most important options?',
    answer: 'tsconfig.json is the TypeScript compiler configuration file. The most important options: strict: true (enables all strict checks — always use this), target (output JavaScript version: ES2020), module (CommonJS for Node.js, ESNext for bundlers), outDir (where compiled JS goes), rootDir (where TS source lives), esModuleInterop: true (better import compatibility). strict: true is the single most important setting — without it, TypeScript catches far fewer bugs.',
    difficulty: 'beginner',
    tip: 'Always emphasize strict: true. Interviewers want to know you understand this.',
  },

  // ─── INTERMEDIATE ─────────────────────────────────────────────────────────────
  {
    question: 'What is the difference between interface and type alias in TypeScript?',
    answer: 'Both can define object shapes. Key differences: (1) interface supports declaration merging — you can declare the same interface name twice and TypeScript merges them. type aliases cannot merge. (2) Only type can define unions (string | number), primitive aliases, and conditional types. (3) interface uses extends for inheritance; type uses & (intersection). (4) Error messages with interfaces often show the interface name; type aliases sometimes show the full expanded type. Convention: use interface for object shapes that will be extended or implemented; use type for unions, primitives, and complex type operations.',
    difficulty: 'intermediate',
    followUp: ['What is declaration merging and why is it useful?', 'Can a class implement a type alias?'],
    tip: 'The honest answer: for simple objects, both are nearly identical. The differences matter in edge cases. Pick one style and be consistent.',
  },
  {
    question: 'What are generics in TypeScript and why do they exist?',
    answer: 'Generics allow you to write reusable code that works with multiple types while maintaining full type safety. Without generics, you either duplicate code for each type or use any (which loses type information). A generic type parameter <T> is a placeholder that TypeScript fills in based on what you pass. Example: function first<T>(arr: T[]): T | undefined — works for any array type while preserving the element type. Generics are used in functions, interfaces, classes, and type aliases.',
    difficulty: 'intermediate',
    followUp: ['What is a generic constraint?', 'What does K extends keyof T mean?'],
  },
  {
    question: 'What is a discriminated union and when do you use it?',
    answer: 'A discriminated union is a union type where each member has a shared literal property (the discriminant) that uniquely identifies the variant. Example: type Shape = { kind: "circle"; radius: number } | { kind: "square"; side: number }. The kind field discriminates. TypeScript uses this to narrow the type in switch/if statements — in the "circle" branch, TypeScript knows radius exists. Use discriminated unions for state machines, Redux actions, API responses with multiple variants, and error types.',
    difficulty: 'intermediate',
    followUp: ['What is exhaustive checking with never?', 'How does TypeScript narrow in a switch statement?'],
    tip: 'Show the never exhaustive check pattern in your answer — it demonstrates deep understanding.',
  },
  {
    question: 'Explain the keyof and typeof operators in TypeScript.',
    answer: 'keyof T produces a union of all property keys of type T. Example: keyof { id: string; name: string } produces "id" | "name". Used with generics for type-safe property access: function get<T, K extends keyof T>(obj: T, key: K): T[K]. typeof (at the type level) extracts the type of a value: const config = { port: 3000 }; type Config = typeof config gives { port: number }. Combine them: type Keys = keyof typeof config gives "port". These are the building blocks of utility types like Partial, Pick, and Record.',
    difficulty: 'intermediate',
    followUp: ['What is an indexed access type T[K]?', 'How does typeof differ from the JavaScript typeof operator?'],
  },
  {
    question: 'What are utility types? Name five and explain what they do.',
    answer: 'Utility types are built-in generic type transformations. Five most common: (1) Partial<T> — makes all properties optional. (2) Omit<T, K> — removes keys K from T, returns the rest. (3) Pick<T, K> — returns only the keys K from T. (4) Record<K, V> — creates an object type with keys K and values V — useful for typed dictionaries. (5) ReturnType<T> — extracts the return type of a function type. Others: Required, Readonly, Exclude, Extract, NonNullable, Parameters, ConstructorParameters.',
    difficulty: 'intermediate',
    tip: 'Know the difference between Exclude (works on unions) and Omit (works on object types). This trips many candidates.',
  },
  {
    question: 'What is type narrowing and what are the different ways to narrow a type?',
    answer: 'Type narrowing reduces a union type to a more specific type within a code block. Methods: (1) typeof — typeof x === "string". (2) instanceof — x instanceof Error. (3) in operator — "email" in user. (4) Equality — x === "active". (5) Truthy/falsy checks — if (x) {...}. (6) Custom type guards — function isUser(v: unknown): v is User { ... }. (7) Assertion functions — function assertIsUser(v: unknown): asserts v is User. TypeScript tracks narrowing through control flow — in each branch, it knows the narrowed type.',
    difficulty: 'intermediate',
    followUp: ['What is a type predicate?', 'What is an assertion function?'],
  },
  {
    question: 'What are mapped types in TypeScript?',
    answer: 'Mapped types create a new type by iterating over the keys of an existing type. Syntax: { [K in keyof T]: NewValueType }. For each key K in T, you define the new value type. You can add or remove modifiers: + or - before readonly and ?. This is how TypeScript implements Partial ({ [K in keyof T]?: T[K] }), Readonly ({ readonly [K in keyof T]: T[K] }), and Required ({ [K in keyof T]-?: T[K] }). You can also remap keys with as: { [K in keyof T as Capitalize<string & K>]: T[K] }.',
    difficulty: 'intermediate',
    followUp: ['How do you remove readonly from all properties?', 'How do you filter keys in a mapped type?'],
  },
  {
    question: 'What is the difference between Exclude and Omit in TypeScript?',
    answer: 'Exclude operates on union types — it removes members from a union. Exclude<"a" | "b" | "c", "a"> gives "b" | "c". Omit operates on object types — it removes property keys from an object type. Omit<User, "password"> gives all User properties except password. They are often confused because both "remove" something. Remember: Exclude for unions, Omit for object types. Internally, Omit<T, K> is implemented as Pick<T, Exclude<keyof T, K>>.',
    difficulty: 'intermediate',
    tip: 'This is one of the most common TypeScript interview mistakes. Memorize: Exclude = unions, Omit = objects.',
  },

  // ─── ADVANCED ────────────────────────────────────────────────────────────────
  {
    question: 'What are conditional types in TypeScript?',
    answer: 'Conditional types are type-level if/else expressions: T extends U ? TrueType : FalseType. If T is assignable to U, the result is TrueType, otherwise FalseType. Key feature: distributivity — when T is a union, the condition distributes over each member. Example: NonNullable<T> = T extends null | undefined ? never : T removes null and undefined from unions. The infer keyword inside conditional types captures a type: T extends Promise<infer R> ? R : T unwraps a Promise.',
    difficulty: 'advanced',
    followUp: ['What is distributive conditional types?', 'How does infer work?'],
  },
  {
    question: 'What is the infer keyword and how is it used?',
    answer: 'infer is used inside conditional types to capture and name a type that TypeScript infers from the extends clause. It can only appear in the extends part of a conditional type. Examples: type ReturnType<T> = T extends (...args: any) => infer R ? R : never — captures the return type. type ElementType<T> = T extends (infer E)[] ? E : never — captures the array element type. type Awaited<T> = T extends Promise<infer R> ? R : T — unwraps Promises. It is how TypeScript\'s built-in ReturnType, Parameters, and Awaited utility types are implemented.',
    difficulty: 'advanced',
    followUp: ['Can you use infer multiple times in one conditional type?'],
  },
  {
    question: 'What is declaration merging and when is it useful?',
    answer: 'Declaration merging allows multiple interface declarations with the same name to be merged into a single interface. Only interfaces (not type aliases) support this. Most common use cases: (1) Augmenting Express.Request to add req.user after auth middleware — declare global { namespace Express { interface Request { user?: AuthUser } } }. (2) Extending Window with custom globals. (3) Adding types to third-party library interfaces. This is a unique capability of interfaces and a key reason library type definitions prefer interfaces over type aliases.',
    difficulty: 'advanced',
    followUp: ['Can you merge a type alias with an interface?', 'What is module augmentation?'],
  },
  {
    question: 'What is structural typing in TypeScript?',
    answer: 'TypeScript uses structural typing (also called duck typing) — two types are compatible if they have the same structure (same properties and types), regardless of their declared names or relationships. If object A has all the properties that interface B requires, A is assignable to B even without explicit declaration. This is different from nominal typing (Java, C#) where types must explicitly declare their relationships. Structural typing enables natural JavaScript patterns to work with TypeScript without ceremony.',
    difficulty: 'advanced',
    followUp: ['Can you simulate nominal typing in TypeScript?', 'What is a branded type?'],
  },
  {
    question: 'What is the never type and what are its practical uses?',
    answer: 'never represents values that can never exist. Two main practical uses: (1) Exhaustiveness checking — in a switch on a discriminated union, the default branch has type never. Assigning the value to a never variable: const _: never = value — TypeScript errors if any union member is unhandled, catching bugs when you add new union members later. (2) Functions that never return — functions that always throw or loop forever have return type never, allowing TypeScript to know that code after such calls is unreachable.',
    difficulty: 'advanced',
    tip: 'Show the exhaustive check pattern: const _exhaustive: never = value in switch default.',
  },
  {
    question: 'How do you create a branded or nominal type in TypeScript?',
    answer: 'TypeScript is structurally typed, so type UserId = string and type Email = string are interchangeable. Branded types simulate nominal typing using intersection with a unique marker: type UserId = string & { readonly __brand: "UserId" }. Now UserId and Email are distinct types even though both are strings. You need a "brand" function to create values: function userId(s: string): UserId { return s as UserId }. Use branded types to prevent accidentally passing an email where a user ID is expected.',
    difficulty: 'advanced',
    followUp: ['What are the trade-offs of branded types?', 'Is there a simpler alternative?'],
  },

  // ─── REACT TYPESCRIPT ────────────────────────────────────────────────────────
  {
    question: 'How do you type React component props in TypeScript?',
    answer: 'Define an interface (or type alias) for props and use it as the parameter type. Use ? for optional props and provide defaults in destructuring. For children: React.ReactNode accepts anything renderable. For callbacks: (param: Type) => void or (param: Type) => ReturnType. Plain function components are preferred over React.FC — simpler types, explicit children. TypeScript verifies all JSX usages — missing required props, wrong types, and invalid values are compile-time errors.',
    difficulty: 'intermediate',
    followUp: ['When would you use React.FC?', 'How do you type children?'],
  },
  {
    question: 'How do you type useState in TypeScript?',
    answer: 'TypeScript infers the state type from the initial value: useState(0) gives [number, Dispatch<SetStateAction<number>>]. For null or empty initial values, add the generic: useState<User | null>(null) — without it, TypeScript infers never[] for empty arrays or null for null, which prevents you from setting real values later. For complex state: useState<Status>("idle") where Status is "idle" | "loading" | "success" | "error" constrains the state to valid values.',
    difficulty: 'intermediate',
    followUp: ['How do you type useReducer?', 'How do you type a state that starts as null but later becomes an object?'],
  },
  {
    question: 'How do you type event handlers in React TypeScript?',
    answer: 'React provides specific event types for each element. Common ones: React.ChangeEvent<HTMLInputElement> for input onChange, React.FormEvent<HTMLFormElement> for form onSubmit (e.preventDefault()), React.MouseEvent<HTMLButtonElement> for onClick with mouse details, React.KeyboardEvent<HTMLInputElement> for keyboard events. For simple onClick without needing the event object: () => void. Access the value with e.target.value (string from inputs).',
    difficulty: 'intermediate',
  },
  {
    question: 'How do you type the React Context API?',
    answer: 'Create context with createContext<ValueType | null>(null) — null signals the context is not provided. Create a custom hook that reads the context, checks for null, and throws a descriptive error if null: function useAuth() { const ctx = useContext(AuthCtx); if (!ctx) throw new Error("useAuth must be inside AuthProvider"); return ctx; }. This pattern: (1) Removes null from the type in consuming components, (2) Provides a clear error if used outside the provider, (3) Makes the provider optional at the type level.',
    difficulty: 'intermediate',
    followUp: ['Why not use a non-null assertion instead of the null check?', 'How do you type a context that changes often?'],
  },

  // ─── SCENARIO-BASED ──────────────────────────────────────────────────────────
  {
    question: 'You need to write a function that returns a different type based on the input type. How do you handle this?',
    answer: 'Use function overloads. Define multiple overload signatures (no implementation) followed by the implementation signature: function parse(input: string): string[]; function parse(input: number): number; function parse(input: string | number): string[] | number { ... }. Callers see only the overload signatures — TypeScript picks the right one based on what they pass. Avoid if the return type distinction can be expressed with generics — overloads add complexity. Alternative: return a discriminated union if the caller needs to handle both cases.',
    difficulty: 'advanced',
    followUp: ['When should you use overloads vs generics?', 'How many overload signatures can you have?'],
  },
  {
    question: 'How would you type an Express middleware that adds properties to req?',
    answer: 'Use declaration merging to augment the Express.Request interface in a .d.ts file: declare global { namespace Express { interface Request { user?: AuthUser; requestId: string; } } }. This file must be in the TypeScript project (included in tsconfig include). In the middleware, assign req.user after verification — TypeScript knows it is valid. In route handlers after the middleware, req.user is typed as AuthUser. Without the augmentation, TypeScript would error on req.user as it does not exist on the default Request type.',
    difficulty: 'advanced',
  },
  {
    question: 'How do you share types between a frontend and backend in TypeScript?',
    answer: 'In a monorepo, create a shared types package (packages/shared-types) with domain interfaces, DTOs, and API contracts. Both frontend and backend install and import from it: import type { User, CreateUserInput } from "@company/shared-types". Changes to the contract are visible to both. Tools like tRPC take this further — the router types flow from server to client automatically, eliminating manual type duplication. For REST APIs, tools like Zod with z.infer give types from validation schemas that work on both sides.',
    difficulty: 'advanced',
  },
  {
    question: 'What is the difference between Partial<T> and making all properties optional manually?',
    answer: 'Functionally identical — { id?: string; name?: string } equals Partial<{ id: string; name: string }>. The advantage of Partial<T> is that it derives from an existing type and stays in sync automatically. If you add a field to User, Partial<User> includes it automatically. A manually written optional type would need manual updating. Use Partial<T> for update inputs and patch operations where you derive from an existing complete type.',
    difficulty: 'intermediate',
  },
];
