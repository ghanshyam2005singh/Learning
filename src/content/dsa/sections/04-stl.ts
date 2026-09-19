import type { DSASection } from '@/types/dsa';

export const stlSection: DSASection = {
  id: 'stl',
  slug: 'stl',
  title: 'Learn STL / Java Collections',
  description: 'Master the C++ Standard Template Library — vector, map, set, stack, queue, priority_queue, and more.',
  icon: '📦',
  color: 'from-orange-500 to-amber-500',
  topics: [
    {
      id: 'stl-cpp',
      slug: 'stl-cpp',
      title: 'C++ STL — Complete Reference',
      type: 'lesson',
      difficulty: 'easy',
      introduction: `The C++ Standard Template Library (STL) is a collection of ready-to-use data structures and algorithms. Knowing STL is essential for competitive programming — it lets you use optimized implementations of arrays, hash maps, sets, stacks, queues, heaps, and sorting in just 1-2 lines of code.`,
      theory: `## Key STL Containers\n\n### Sequence Containers\n**vector<T>** — Dynamic array. Use for most arrays.\n- \`v.push_back(x)\`, \`v.pop_back()\`, \`v.size()\`, \`v[i]\`, \`v.front()\`, \`v.back()\`\n- \`v.begin()\`, \`v.end()\` — iterators for algorithms\n\n**string** — Dynamic character array. Covered in Arrays section.\n\n**deque<T>** — Double-ended queue. push/pop from both ends O(1).\n- \`dq.push_front(x)\`, \`dq.push_back(x)\`, \`dq.pop_front()\`, \`dq.pop_back()\`\n\n### Associative Containers\n**map<K,V>** — Sorted key-value pairs. O(log n) operations.\n- \`m[key] = val\`, \`m.count(key)\`, \`m.find(key)\`, \`m.erase(key)\`\n- Iterates in sorted key order.\n\n**unordered_map<K,V>** — Hash map. O(1) average.\n- Same interface as map but FASTER for lookup/insert.\n- Use this unless you need sorted order.\n\n**set<T>** — Sorted unique elements. O(log n).\n- \`s.insert(x)\`, \`s.count(x)\`, \`s.erase(x)\`, \`s.find(x)\`\n\n**unordered_set<T>** — Hash set. O(1) average.\n- Same as set but FASTER. Use unless sorted order needed.\n\n**multiset<T>** — Like set but allows duplicates.\n\n### Adapter Containers\n**stack<T>** — LIFO. push, pop, top, empty.\n- \`s.push(x)\`, \`s.top()\`, \`s.pop()\`, \`s.empty()\`\n\n**queue<T>** — FIFO. push, pop, front, back, empty.\n- \`q.push(x)\`, \`q.front()\`, \`q.back()\`, \`q.pop()\`\n\n**priority_queue<T>** — Max-heap by default.\n- \`pq.push(x)\`, \`pq.top()\` (max), \`pq.pop()\`, \`pq.empty()\`\n- Min-heap: \`priority_queue<int, vector<int>, greater<int>> pq;\`\n\n### pairs and tuples\n**pair<A,B>** — Two values.\n- \`pair<int,int> p = {1, 2};\`, \`p.first\`, \`p.second\`\n- \`make_pair(1, 2)\`\n\n### STL Algorithms (from <algorithm>)\n- \`sort(v.begin(), v.end())\` — O(n log n)\n- \`sort(v.begin(), v.end(), greater<int>())\` — Descending\n- \`reverse(v.begin(), v.end())\`\n- \`*max_element(v.begin(), v.end())\` — Max value\n- \`*min_element(v.begin(), v.end())\` — Min value\n- \`accumulate(v.begin(), v.end(), 0)\` — Sum (needs <numeric>)\n- \`count(v.begin(), v.end(), val)\` — Count occurrences\n- \`find(v.begin(), v.end(), val)\` — Returns iterator\n- \`lower_bound(v.begin(), v.end(), val)\` — First >= val (sorted)\n- \`upper_bound(v.begin(), v.end(), val)\` — First > val (sorted)\n- \`binary_search(v.begin(), v.end(), val)\` — Returns bool`,
      codeExamples: [
        {
          title: 'vector — complete cheatsheet',
          language: 'cpp',
          code: `#include <vector>
#include <algorithm>
using namespace std;

vector<int> v = {3, 1, 4, 1, 5, 9};
v.push_back(2);          // add to end
v.pop_back();            // remove from end
cout << v.size();        // 6
cout << v[0];            // 3
cout << v.front();       // 3 (first)
cout << v.back();        // 9 (last)
v.insert(v.begin(), 0);  // insert 0 at front O(n)
v.erase(v.begin());      // erase front O(n)

sort(v.begin(), v.end()); // ascending O(n log n)
reverse(v.begin(), v.end());

// 2D vector
vector<vector<int>> grid(3, vector<int>(4, 0)); // 3x4 zeros`,
        },
        {
          title: 'unordered_map — frequency counting',
          language: 'cpp',
          code: `#include <unordered_map>
using namespace std;

vector<int> arr = {1, 2, 2, 3, 3, 3};
unordered_map<int, int> freq;

for (int x : arr) freq[x]++;  // count frequency

// Iterate
for (auto& [key, val] : freq) {  // C++17 structured binding
    cout << key << ": " << val << "\\n";
}

// Check existence
if (freq.count(2)) cout << "2 exists\\n";
if (freq.find(5) == freq.end()) cout << "5 not found\\n";`,
        },
        {
          title: 'priority_queue — max and min heap',
          language: 'cpp',
          code: `#include <queue>
using namespace std;

// Max-heap (default)
priority_queue<int> maxPQ;
maxPQ.push(3); maxPQ.push(1); maxPQ.push(4);
cout << maxPQ.top(); // 4 (largest)
maxPQ.pop();
cout << maxPQ.top(); // 3

// Min-heap
priority_queue<int, vector<int>, greater<int>> minPQ;
minPQ.push(3); minPQ.push(1); minPQ.push(4);
cout << minPQ.top(); // 1 (smallest)`,
        },
      ],
      revisionNotes: [
        'vector: dynamic array. push_back O(1) amortized.',
        'unordered_map: hash map O(1). map: sorted O(log n).',
        'unordered_set: hash set O(1). set: sorted O(log n).',
        'priority_queue: max-heap default. Add greater<int> for min-heap.',
        'stack: LIFO (top/push/pop). queue: FIFO (front/back/push/pop).',
        'sort(), lower_bound(), upper_bound() need sorted range.',
      ],
      keyTakeaways: [
        'STL saves time — never implement basic structures from scratch in contests.',
        'Use unordered_map/unordered_set for O(1) vs map/set for O(log n).',
        'Min-heap: priority_queue<int, vector<int>, greater<int>>.',
      ],
    },
    {
      id: 'java-collections',
      slug: 'java-collections',
      title: 'Java Collections Framework',
      type: 'lesson',
      difficulty: 'easy',
      introduction: `For Java users: the Java Collections Framework (JCF) provides the same structures as C++ STL. The main interfaces are List, Set, Map, Queue, and Deque.`,
      theory: `**Java equivalents of C++ STL:**\n\n| C++ | Java |\n|-----|------|\n| vector<T> | ArrayList<T> |\n| map<K,V> | TreeMap<K,V> |\n| unordered_map | HashMap<K,V> |\n| set<T> | TreeSet<T> |\n| unordered_set | HashSet<T> |\n| stack<T> | Stack<T> or Deque |\n| queue<T> | Queue<T> / LinkedList |\n| priority_queue (max) | PriorityQueue (min by default!) |\n| pair<A,B> | int[] {a, b} or custom class |\n\n**Important Java difference:** Java's PriorityQueue is a MIN-HEAP by default (opposite of C++).\n- For max-heap: \`new PriorityQueue<>(Collections.reverseOrder())\`\n\n**Sorting:**\n- \`Arrays.sort(arr)\` — for primitive arrays\n- \`Collections.sort(list)\` — for ArrayList\n- \`Arrays.sort(arr, (a,b) -> a - b)\` — custom comparator`,
      codeExamples: [
        {
          title: 'Java equivalents',
          language: 'cpp',
          code: `// Java — key collections
import java.util.*;

// ArrayList (like vector)
List<Integer> list = new ArrayList<>();
list.add(3); list.add(1);
Collections.sort(list);

// HashMap (like unordered_map)
Map<Integer, Integer> freq = new HashMap<>();
freq.put(key, freq.getOrDefault(key, 0) + 1);

// PriorityQueue (MIN-HEAP by default!)
PriorityQueue<Integer> minPQ = new PriorityQueue<>();
PriorityQueue<Integer> maxPQ = new PriorityQueue<>(Collections.reverseOrder());

// HashSet
Set<Integer> seen = new HashSet<>();
seen.add(5);
seen.contains(5);  // true`,
        },
      ],
      revisionNotes: [
        'Java PriorityQueue is MIN-HEAP by default (opposite of C++).',
        'Java has no direct pair — use int[] {a, b} or create a class.',
        'getOrDefault(key, 0) is common for frequency counting in Java.',
      ],
      keyTakeaways: [
        'Java PriorityQueue = min-heap. Use Collections.reverseOrder() for max-heap.',
        'HashMap for O(1) lookup, TreeMap for O(log n) sorted order.',
      ],
    },
  ],
};
