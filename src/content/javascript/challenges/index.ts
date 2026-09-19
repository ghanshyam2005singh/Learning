import type { Challenge } from '@/types';

export const challenges: Challenge[] = [
  {
    id: 'reverse-string',
    slug: 'reverse-string',
    title: 'Reverse a String',
    description: 'Write a function that reverses a string without using the built-in .reverse() method on an array.',
    difficulty: 'beginner',
    topic: 'Strings',
    starterCode: `function reverseString(str) {
  // Reverse the string without using array.reverse()
  // "hello" → "olleh"
}

console.log(reverseString("hello"));   // "olleh"
console.log(reverseString("JavaScript")); // "tpircSavaJ"
console.log(reverseString(""));        // ""`,
    solution: `function reverseString(str) {
  let result = "";
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }
  return result;
  // One-liner alternative: return str.split("").reverse().join("");
}`,
    hints: [
      'Loop from the end to the start',
      'Build a new string character by character',
      'Or: split into array → reverse → join',
    ],
    explanation: 'Iterate from the last character to the first, building a new string. Alternatively split("") converts to char array, reverse() reverses it, join("") converts back.',
    tags: ['strings', 'loops', 'beginner'],
  },
  {
    id: 'palindrome-check',
    slug: 'palindrome-check',
    title: 'Check Palindrome',
    description: 'Determine if a string is a palindrome. Ignore case and non-alphanumeric characters.',
    difficulty: 'beginner',
    topic: 'Strings',
    starterCode: `function isPalindrome(str) {
  // Return true if str reads the same forwards and backwards
  // Ignore case and non-alphanumeric characters
}

console.log(isPalindrome("racecar"));      // true
console.log(isPalindrome("A man a plan a canal Panama")); // true
console.log(isPalindrome("hello"));        // false`,
    solution: `function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === cleaned.split("").reverse().join("");
}`,
    hints: [
      'First clean the string: lowercase and remove non-alphanumeric',
      'Use regex /[^a-z0-9]/g to remove unwanted chars',
      'Compare the string to its reverse',
    ],
    explanation: 'Clean the string first by lowercasing and removing non-alphanumeric characters using a regex. Then compare with its reverse.',
    tags: ['strings', 'regex', 'beginner'],
  },
  {
    id: 'count-vowels',
    slug: 'count-vowels',
    title: 'Count Vowels',
    description: 'Count the number of vowels (a, e, i, o, u) in a string.',
    difficulty: 'beginner',
    topic: 'Strings',
    starterCode: `function countVowels(str) {
  // Count vowels (a, e, i, o, u) — case insensitive
}

console.log(countVowels("hello"));       // 2
console.log(countVowels("JavaScript"));  // 3
console.log(countVowels("rhythm"));      // 0`,
    solution: `function countVowels(str) {
  return (str.toLowerCase().match(/[aeiou]/g) || []).length;
}`,
    hints: [
      'Use a regex to match vowels',
      '.match() returns null if no matches — handle that',
      'Or filter the characters: [...str].filter(c => "aeiou".includes(c))',
    ],
    explanation: 'Use a regex /[aeiou]/g to find all vowels. .match() returns null if none found, so fall back to empty array. Alternatively iterate and check each character.',
    tags: ['strings', 'regex', 'beginner'],
  },
  {
    id: 'flatten-array',
    slug: 'flatten-array',
    title: 'Flatten Nested Array',
    description: 'Flatten an arbitrarily nested array into a single-level array without using .flat().',
    difficulty: 'intermediate',
    topic: 'Arrays',
    starterCode: `function flatten(arr) {
  // Flatten nested array to single level
  // Do not use .flat()
}

console.log(flatten([1, [2, 3], [4, [5, 6]]]));
// [1, 2, 3, 4, 5, 6]

console.log(flatten([1, [2, [3, [4, [5]]]]]));
// [1, 2, 3, 4, 5]`,
    solution: `function flatten(arr) {
  return arr.reduce((flat, item) => {
    return flat.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}`,
    hints: [
      'Use recursion — if an item is an array, flatten it recursively',
      'Use reduce to build the result array',
      'Array.isArray() checks if something is an array',
    ],
    explanation: 'Use reduce with recursion. For each element, if it is an array, recursively flatten it and concat the result. If not an array, concat the element directly.',
    tags: ['arrays', 'recursion', 'reduce', 'intermediate'],
  },
  {
    id: 'find-duplicates',
    slug: 'find-duplicates',
    title: 'Find Duplicates',
    description: 'Find all duplicate values in an array.',
    difficulty: 'intermediate',
    topic: 'Arrays',
    starterCode: `function findDuplicates(arr) {
  // Return array of values that appear more than once
  // Each duplicate should appear once in the result
}

console.log(findDuplicates([1, 2, 3, 2, 4, 3, 5])); // [2, 3]
console.log(findDuplicates([1, 1, 1, 2]));            // [1]
console.log(findDuplicates([1, 2, 3]));               // []`,
    solution: `function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();
  for (const item of arr) {
    if (seen.has(item)) duplicates.add(item);
    else seen.add(item);
  }
  return [...duplicates];
}`,
    hints: [
      'Use two Sets: one for seen items, one for duplicates',
      'If an item is already in "seen", add it to "duplicates"',
      'Use Set to avoid adding the same duplicate twice',
    ],
    explanation: 'Track seen items with a Set. When we encounter an item already in seen, add it to duplicates Set. Return the duplicates as array.',
    tags: ['arrays', 'sets', 'intermediate'],
  },
  {
    id: 'group-by',
    slug: 'group-by',
    title: 'Group By Property',
    description: 'Group an array of objects by a specified property.',
    difficulty: 'intermediate',
    topic: 'Arrays',
    starterCode: `function groupBy(arr, key) {
  // Group array items by the given key
  // Return an object with keys being the unique values
}

const people = [
  { name: "Alice", city: "London" },
  { name: "Bob",   city: "Paris" },
  { name: "Carol", city: "London" },
  { name: "Dan",   city: "Paris" },
];

console.log(groupBy(people, "city"));
// {
//   London: [{name:"Alice",...}, {name:"Carol",...}],
//   Paris:  [{name:"Bob",...},  {name:"Dan",...}]
// }`,
    solution: `function groupBy(arr, key) {
  return arr.reduce((groups, item) => {
    const groupKey = item[key];
    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(item);
    return groups;
  }, {});
}`,
    hints: [
      'Use reduce with an empty object as the accumulator',
      'For each item, get item[key] as the group key',
      'Initialize the group as an empty array if it doesn\'t exist',
    ],
    explanation: 'Use reduce to build an object. For each item, get the group key value, initialize the array if needed, then push the item.',
    tags: ['arrays', 'objects', 'reduce', 'intermediate'],
  },
  {
    id: 'deep-clone',
    slug: 'deep-clone',
    title: 'Deep Clone Object',
    description: 'Create a deep clone of an object without using structuredClone or JSON tricks.',
    difficulty: 'advanced',
    topic: 'Objects',
    starterCode: `function deepClone(obj) {
  // Deep clone the object
  // Handle: primitives, arrays, plain objects
  // Note: no need to handle Date, Map, Set, functions
}

const original = { a: 1, b: { c: 2, d: [3, 4] } };
const clone = deepClone(original);

clone.b.c = 99;
clone.b.d.push(5);

console.log(original.b.c);        // 2 (unchanged)
console.log(original.b.d.length); // 2 (unchanged)`,
    solution: `function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, deepClone(v)])
  );
}`,
    hints: [
      'Base case: if not an object (or null), return as-is',
      'Arrays: map each element through deepClone recursively',
      'Objects: clone each value recursively using Object.entries',
    ],
    explanation: 'Recursive approach: primitives and null are returned as-is. Arrays are mapped with recursive deepClone. Objects use Object.fromEntries to rebuild with each value deep-cloned.',
    tags: ['objects', 'recursion', 'advanced'],
  },
  {
    id: 'merge-objects',
    slug: 'merge-objects',
    title: 'Deep Merge Objects',
    description: 'Deeply merge two objects, recursively merging nested objects.',
    difficulty: 'advanced',
    topic: 'Objects',
    starterCode: `function deepMerge(target, source) {
  // Deep merge source into target
  // Nested objects should be merged recursively
  // Arrays and primitives from source override target
}

const a = { x: 1, nested: { y: 2, z: 3 } };
const b = { nested: { y: 99, w: 4 }, extra: true };

console.log(deepMerge(a, b));
// { x: 1, nested: { y: 99, z: 3, w: 4 }, extra: true }`,
    solution: `function deepMerge(target, source) {
  const result = { ...target };
  for (const [key, val] of Object.entries(source)) {
    if (val && typeof val === 'object' && !Array.isArray(val)
      && typeof target[key] === 'object' && !Array.isArray(target[key])) {
      result[key] = deepMerge(target[key], val);
    } else {
      result[key] = val;
    }
  }
  return result;
}`,
    hints: [
      'Start with a shallow copy of target',
      'For each source key, if BOTH values are plain objects, recurse',
      'Otherwise, source value wins',
    ],
    explanation: 'Copy target first, then iterate source entries. If both values are plain objects, recursively merge. Otherwise let source win.',
    tags: ['objects', 'recursion', 'advanced'],
  },
  {
    id: 'memoize',
    slug: 'memoize',
    title: 'Memoize Function',
    description: 'Implement a memoize higher-order function that caches function results.',
    difficulty: 'intermediate',
    topic: 'Functions',
    starterCode: `function memoize(fn) {
  // Return a memoized version of fn
  // Cache results based on arguments
}

let callCount = 0;
const slowSquare = (n) => {
  callCount++;
  return n * n;
};

const fastSquare = memoize(slowSquare);

console.log(fastSquare(5));  // 25 (callCount: 1)
console.log(fastSquare(5));  // 25 (callCount: still 1, cached)
console.log(fastSquare(6));  // 36 (callCount: 2)
console.log(callCount);      // 2`,
    solution: `function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}`,
    hints: [
      'Use a Map or object to store cached results',
      'Create a unique cache key from arguments using JSON.stringify',
      'Use fn.apply(this, args) to preserve the original this context',
    ],
    explanation: 'Use a Map for caching. Convert args to a string key with JSON.stringify. On each call, check the cache first; if miss, compute and store.',
    tags: ['functions', 'closures', 'intermediate'],
  },
  {
    id: 'curry',
    slug: 'curry',
    title: 'Currying',
    description: 'Transform a function of N arguments into N chained functions of one argument each.',
    difficulty: 'advanced',
    topic: 'Functions',
    starterCode: `function curry(fn) {
  // Convert fn into a curried version
}

function add(a, b, c) { return a + b + c; }

const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6 (partial application)
console.log(curriedAdd(1)(2, 3)); // 6`,
    solution: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}`,
    hints: [
      'fn.length gives you the expected number of arguments',
      'If we have enough args, call the original function',
      'If not, return a function that collects more args',
    ],
    explanation: 'Check if collected args length >= fn.length. If yes, call fn. If no, return a new function that collects more args and recurses.',
    tags: ['functions', 'closures', 'advanced'],
  },
  {
    id: 'compose',
    slug: 'compose',
    title: 'Function Composition',
    description: 'Implement compose and pipe functions for functional programming.',
    difficulty: 'intermediate',
    topic: 'Functions',
    starterCode: `// pipe: applies functions left to right
function pipe(...fns) {
  // fn1 → fn2 → fn3 (left to right)
}

// compose: applies functions right to left
function compose(...fns) {
  // fn3 → fn2 → fn1 (right to left)
}

const double = x => x * 2;
const addOne = x => x + 1;
const square = x => x * x;

console.log(pipe(double, addOne, square)(3));    // (3*2+1)²=49
console.log(compose(square, addOne, double)(3)); // same: 49`,
    solution: `function pipe(...fns) {
  return (value) => fns.reduce((v, fn) => fn(v), value);
}

function compose(...fns) {
  return (value) => fns.reduceRight((v, fn) => fn(v), value);
}`,
    hints: [
      'pipe uses reduce (left to right)',
      'compose uses reduceRight (right to left)',
      'Both pass the result of each function as input to the next',
    ],
    explanation: 'pipe uses reduce — starts from first function. compose uses reduceRight — starts from last function. Both thread a value through the function chain.',
    tags: ['functions', 'functional-programming', 'intermediate'],
  },
  {
    id: 'sequential-promises',
    slug: 'sequential-promises',
    title: 'Sequential Promises',
    description: 'Execute an array of async functions sequentially, each receiving the result of the previous.',
    difficulty: 'advanced',
    topic: 'Async',
    starterCode: `async function runSequential(fns, initialValue) {
  // Run each async function in sequence
  // Each receives the result of the previous
}

const add10 = async (n) => n + 10;
const double = async (n) => n * 2;
const stringify = async (n) => \`Result: \${n}\`;

runSequential([add10, double, stringify], 5)
  .then(console.log); // "Result: 30"
// 5 → add10 → 15 → double → 30 → stringify → "Result: 30"`,
    solution: `async function runSequential(fns, initialValue) {
  let result = initialValue;
  for (const fn of fns) {
    result = await fn(result);
  }
  return result;
}`,
    hints: [
      'for...of preserves await order (unlike forEach)',
      'Store each result and pass to next function',
    ],
    explanation: 'Use for...of with await to run each function in sequence. Store the result and pass to the next. forEach does not work with await.',
    tags: ['async', 'promises', 'advanced'],
  },
  {
    id: 'debounce',
    slug: 'debounce',
    title: 'Debounce',
    description: 'Implement a debounce function that delays invoking a function until after a specified wait time.',
    difficulty: 'advanced',
    topic: 'Functions',
    starterCode: `function debounce(fn, delay) {
  // Return a debounced version of fn
  // fn only fires after delay ms have passed without another call
}

let count = 0;
const increment = debounce(() => {
  count++;
  console.log("Called! count:", count);
}, 100);

increment(); // resets timer
increment(); // resets timer
increment(); // fires after 100ms: "Called! count: 1"`,
    solution: `function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}`,
    hints: [
      'Store a timer ID in closure',
      'clearTimeout on each call to reset',
      'setTimeout to schedule the actual call',
    ],
    explanation: 'Store a timeout ID in closure. Each call clears the previous timer and sets a new one. Only when the delay passes without another call does fn execute.',
    tags: ['functions', 'closures', 'async', 'advanced'],
  },
  {
    id: 'flatten-object',
    slug: 'flatten-object',
    title: 'Flatten Nested Object',
    description: 'Flatten a nested object into dot-notation keys.',
    difficulty: 'advanced',
    topic: 'Objects',
    starterCode: `function flattenObject(obj, prefix = "") {
  // Flatten nested object to dot-notation
}

const nested = {
  a: 1,
  b: { c: 2, d: { e: 3 } },
  f: 4
};

console.log(flattenObject(nested));
// { a: 1, "b.c": 2, "b.d.e": 3, f: 4 }`,
    solution: `function flattenObject(obj, prefix = "") {
  return Object.entries(obj).reduce((flat, [key, val]) => {
    const newKey = prefix ? \`\${prefix}.\${key}\` : key;
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(flat, flattenObject(val, newKey));
    } else {
      flat[newKey] = val;
    }
    return flat;
  }, {});
}`,
    hints: [
      'Recursively handle nested objects',
      'Build the key with prefix + "." + current key',
      'Base case: if value is not an object, set it directly',
    ],
    explanation: 'Iterate entries. Build the new key by joining prefix and current key with a dot. If value is a plain object, recurse with the new key as prefix. Otherwise assign the value.',
    tags: ['objects', 'recursion', 'advanced'],
  },
  {
    id: 'event-emitter',
    slug: 'event-emitter',
    title: 'Build an Event Emitter',
    description: 'Implement a simple EventEmitter class with on, off, and emit methods.',
    difficulty: 'advanced',
    topic: 'Objects',
    starterCode: `class EventEmitter {
  constructor() {
    // Initialize listeners storage
  }

  on(event, listener) {
    // Register listener for event
  }

  off(event, listener) {
    // Remove specific listener
  }

  emit(event, ...args) {
    // Call all listeners for event
  }
}

const emitter = new EventEmitter();
const handler = (data) => console.log("Received:", data);

emitter.on("message", handler);
emitter.emit("message", "Hello!"); // "Received: Hello!"
emitter.off("message", handler);
emitter.emit("message", "World"); // (nothing)`,
    solution: `class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(event, listener) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(listener);
    return this;
  }

  off(event, listener) {
    if (!this.listeners[event]) return this;
    this.listeners[event] = this.listeners[event].filter(l => l !== listener);
    return this;
  }

  emit(event, ...args) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(l => l(...args));
    return this;
  }
}`,
    hints: [
      'Use an object where keys are event names and values are arrays of listeners',
      'on: push to the array',
      'off: filter out the listener',
      'emit: call each listener with the args',
    ],
    explanation: 'Store listeners in an object keyed by event name. on pushes the listener, off filters it out, emit calls all listeners for the event.',
    tags: ['objects', 'design-patterns', 'advanced'],
  },
];
