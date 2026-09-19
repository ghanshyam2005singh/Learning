import { CodePlayground } from '@/components/playground/CodePlayground';

export default function PlaygroundPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Playground</h1>
        <p className="text-slate-400">Write and run JavaScript directly in the browser. Output appears on the right.</p>
      </div>
      <CodePlayground
        height="500px"
        initialCode={`// Welcome to the JavaScript Playground!
// Write any code and click Run to see the output.

// Example: explore closures
function makeCounter(start = 0) {
  let count = start;
  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
  };
}

const counter = makeCounter(10);
console.log(counter.increment()); // 11
console.log(counter.increment()); // 12
console.log(counter.decrement()); // 11
console.log(counter.value());     // 11

// Try modifying this code!
`}
      />
    </div>
  );
}
