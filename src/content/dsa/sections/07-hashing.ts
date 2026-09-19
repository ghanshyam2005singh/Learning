import type { DSASection } from '@/types/dsa';

export const hashingSection: DSASection = {
  id: 'basic-hashing',
  slug: 'basic-hashing',
  title: 'Learn Basic Hashing',
  description: 'Use hash maps and arrays to count frequencies, find missing elements, and solve O(n) lookup problems.',
  icon: '#',
  color: 'from-pink-500 to-rose-600',
  topics: [
    {
      id: 'hashing-intro',
      slug: 'hashing-intro',
      title: 'Basic Hashing — Concept & Why',
      type: 'lesson',
      difficulty: 'easy',
      introduction: `Hashing allows O(1) average-time lookup, insertion, and deletion. Instead of searching linearly, a hash function maps a value directly to a bucket. This transforms many O(n²) problems into O(n).`,
      theory: `**Hashing with arrays (pre-hashing):** When values are bounded (0 to 10^6), use a direct array where index = value.\n\`count[x]++\` to mark x as seen. O(1) lookup and insert.\n\n**Hashing with unordered_map:** For arbitrary keys, use a hash map. O(1) average, but O(n) worst case (hash collisions).\n\n**Collision:** Two keys hash to the same bucket. STL handles this internally (chaining).\n\n**Common patterns using hashing:**\n- Count frequencies: \`freq[x]++\`\n- Check existence: \`freq.count(x) > 0\`\n- Two Sum: store seen values in hash set\n- Anagram check: compare frequency maps\n- Subarray sum: prefix sum + hash map`,
      codeExamples: [
        {
          title: 'Frequency count with array vs map',
          language: 'cpp',
          code: `// Method 1: Array (when values are small, bounded)
int arr[] = {1, 3, 2, 1, 3, 1};
int count[10] = {0};  // all zeros
for (int x : arr) count[x]++;
// count[1]=3, count[2]=1, count[3]=2

// Method 2: unordered_map (for arbitrary values)
unordered_map<int, int> freq;
for (int x : arr) freq[x]++;
// Works for any integer values`,
        },
      ],
      keyTakeaways: ['Hashing enables O(1) lookup. Use arrays for small bounded values, unordered_map for arbitrary.'],
    },
    {
      id: 'count-frequencies',
      slug: 'count-frequencies',
      title: 'Counting Frequencies of Array Elements',
      type: 'problem',
      difficulty: 'easy',
      pattern: 'Hashing / Frequency Count',
      problemStatement: 'Given an array, print each element and its frequency.',
      examples: [{ input: '[2,3,2,3,5]', output: '2→2, 3→2, 5→1' }],
      approaches: [
        {
          name: 'Hash Map',
          intuition: 'Count each element in one pass with a map.',
          steps: ['Iterate array, increment freq[x]', 'Print freq map'],
          complexity: { time: 'O(N)', space: 'O(N)' },
          code: `vector<int> arr = {2, 3, 2, 3, 5};\nunordered_map<int, int> freq;\nfor (int x : arr) freq[x]++;\nfor (auto& [val, cnt] : freq) cout << val << "→" << cnt << "\\n";`,
        },
      ],
      hints: ['Use unordered_map<int,int>. For each element, do freq[x]++.'],
      solution: `unordered_map<int, int> freq;\nfor (int x : arr) freq[x]++;\nfor (auto& [val, cnt] : freq) cout << val << " " << cnt << "\\n";`,
      keyTakeaways: ['Frequency counting is the most common hashing application in DSA.'],
    },
    {
      id: 'highest-occurring',
      slug: 'highest-occurring',
      title: 'Highest Occurring Element in an Array',
      type: 'problem',
      difficulty: 'easy',
      pattern: 'Hashing',
      problemStatement: 'Find the element with the highest frequency in an array.',
      examples: [{ input: '[1,2,2,3,3,3]', output: '3', explanation: '3 appears 3 times.' }],
      approaches: [
        {
          name: 'Hash Map + Max',
          intuition: 'Build frequency map, then find entry with max frequency.',
          steps: ['Count frequencies with unordered_map', 'Find key with maximum value'],
          complexity: { time: 'O(N)', space: 'O(N)' },
          code: `unordered_map<int, int> freq;\nfor (int x : arr) freq[x]++;\nint maxFreq = 0, result = arr[0];\nfor (auto& [val, cnt] : freq) {\n    if (cnt > maxFreq) { maxFreq = cnt; result = val; }\n}\nreturn result;`,
        },
      ],
      hints: ['Count all frequencies, then find the key with the maximum count.'],
      solution: `unordered_map<int,int> freq;\nfor(int x:arr) freq[x]++;\nint maxF=0,res=arr[0];\nfor(auto&[v,c]:freq) if(c>maxF){maxF=c;res=v;}\nreturn res;`,
      keyTakeaways: ['Build frequency map O(N), then single pass to find max O(N). Total O(N).'],
    },
  ],
};
