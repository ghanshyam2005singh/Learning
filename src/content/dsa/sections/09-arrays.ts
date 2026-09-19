import type { DSASection } from '@/types/dsa';

export const arraysSection: DSASection = {
  id: 'arrays',
  slug: 'arrays',
  title: 'Solve Problems on Arrays',
  description: 'Master array manipulation from easy to hard — sliding window, hashing, sorting tricks, matrix problems, and divide-and-conquer counting.',
  icon: '[ ]',
  color: 'from-blue-400 to-blue-600',
  subsections: [
    {
      id: 'array-theory',
      title: 'Theory',
      topics: [
        {
          id: 'arrays-theory',
          slug: 'arrays-theory',
          title: 'Arrays — Theory (Read This First)',
          type: 'lesson',
          difficulty: 'easy',
          introduction: `An array (\`std::vector<int>\` in modern C++) is a block of memory where elements sit **contiguously** (right next to each other) so any element can be reached by index in **O(1)** — the computer computes the exact address as \`base_address + i * element_size\`, no searching needed. Why it exists: it is the most basic building block for organizing a sequence of same-type values, and this O(1) random access is what makes so many array algorithms about being clever with **indices** rather than searching. Real-world usage: every list you scroll through in an app, every row in a spreadsheet, every pixel buffer in an image, every stock-price time series is backed by an array under the hood.`,
          theory: `\`\`\`cpp\nvector<int> arr = {10, 20, 30, 40};\n//                   0    1   2   3   <- indices, 0-based\ncout << arr[2];   // prints 30 instantly — direct address computation, not a search\n\`\`\`\n\n**Prefix Sum — the single most useful array trick.** Precompute a running total so "sum of range [i,j]" becomes an O(1) lookup instead of an O(n) re-scan:\n\`\`\`cpp\nvector<int> prefix(arr.size() + 1, 0);      // prefix[i] = sum of arr[0..i-1]\nfor (int i = 0; i < arr.size(); i++) prefix[i + 1] = prefix[i] + arr[i];\n// sum of arr[i..j] inclusive = prefix[j+1] - prefix[i]\n\`\`\`\nThe \`+1\` offset lets \`prefix[0] = 0\` mean "sum of zero elements," so the formula works even when \`i == 0\` without a special case.\n\n**Kadane's Algorithm — maximum subarray sum.** At each index you only ever have two choices: extend the previous running subarray, or restart fresh here — take whichever gives the bigger sum:\n\`\`\`cpp\nint currentSum = arr[0], maxSum = arr[0];\nfor (int i = 1; i < arr.size(); i++) {\n    currentSum = max(arr[i], currentSum + arr[i]);   // extend or restart\n    maxSum = max(maxSum, currentSum);\n}\n\`\`\`\n\n**Moore's Voting Algorithm — majority element (appears > n/2 times) in O(1) space:**\n\`\`\`cpp\nint candidate = 0, count = 0;\nfor (int num : arr) {\n    if (count == 0) candidate = num;             // no strong candidate — adopt this one\n    count += (num == candidate) ? 1 : -1;\n}\n\`\`\`\nEvery non-majority element that "cancels" the candidate's count uses up one of a strictly-minority group, so the true majority element can never be fully cancelled — it always survives as the final candidate.\n\n**Dutch National Flag (3-pointer partition)** — sort an array of only 0s/1s/2s in one pass using \`low, mid, high\` pointers; after swapping with \`high\` the new \`arr[mid]\` is unexamined so \`mid\` must **not** advance, but after swapping with \`low\` it's already known-good so \`mid\` does advance. See the array problem files for the full template.\n\n**Cyclic Sort** — when values are guaranteed in range \`[1..n]\`, each value has a "correct home" at index \`value - 1\`; repeatedly swapping each element into its home takes O(n) total swaps (every swap places at least one element permanently), useful for "find missing/duplicate number" problems.`,
          codeExamples: [
            { title: 'Simple: range-sum query with prefix sum', language: 'cpp', code: `vector<int> arr = {2, 4, 1, 5, 3};\nvector<int> prefix(arr.size() + 1, 0);\nfor (int i = 0; i < (int)arr.size(); i++) prefix[i + 1] = prefix[i] + arr[i];\n\nint sum_1_to_3 = prefix[4] - prefix[1];   // arr[1]+arr[2]+arr[3] = 4+1+5 = 10`, explanation: 'Build once in O(n), then answer any range-sum query in O(1).' },
            { title: 'Practical: maximum subarray sum (Kadane\'s)', language: 'cpp', code: `int maxSubArray(vector<int>& arr) {\n    int currentSum = arr[0], maxSum = arr[0];\n    for (int i = 1; i < arr.size(); i++) {\n        currentSum = max(arr[i], currentSum + arr[i]);\n        maxSum = max(maxSum, currentSum);\n    }\n    return maxSum;\n}`, explanation: 'One pass, O(1) space — compare to brute-force O(n^2)/O(n^3) checking every subarray.' },
            { title: 'Industry-style: rolling analytics window (e.g. 7-day revenue total)', language: 'cpp', code: `// Prefix sums power dashboards that need many different range totals over the same data\nvector<long long> dailyPrefix(revenue.size() + 1, 0);\nfor (int i = 0; i < (int)revenue.size(); i++) dailyPrefix[i+1] = dailyPrefix[i] + revenue[i];\nlong long weekTotal = dailyPrefix[day + 7] - dailyPrefix[day];   // O(1) per query`, explanation: 'Any analytics dashboard answering many "sum over this date range" queries reuses this exact prefix-sum idea instead of re-summing raw rows each time.' },
          ],
          commonMistakes: [
            'Off-by-one in prefix sum indexing — always sanity check with a tiny 2-element example by hand.',
            'Forgetting Kadane\'s needs the max(arr[i], currentSum + arr[i]) reset logic, not just always adding.',
            'Assuming Moore\'s Voting alone proves a majority exists — if the problem does not guarantee one, a second verification pass over the array is required.',
            'In Dutch Flag partitioning, advancing mid after a swap with high (the new arr[mid] is unexamined and must be rechecked).',
            'Applying cyclic sort when values are not actually guaranteed to be in range [1..n] — it silently produces wrong results otherwise.',
          ],
          revisionNotes: [
            'Prefix sum: O(n) build, O(1) range-sum query.',
            'Kadane\'s: O(n)/O(1) — currentSum = max(arr[i], currentSum + arr[i]).',
            'Moore\'s Voting: O(n)/O(1) — candidate cancels out via count, verify with a second pass if majority isn\'t guaranteed.',
            'Dutch Flag: O(n)/O(1) three-way partition; cyclic sort: O(n)/O(1) for values in [1..n].',
          ],
          interviewQuestions: [
            { question: 'How does prefix sum reduce repeated range-sum queries from O(n) each to O(1) each?', answer: 'By precomputing a running total array once in O(n), any range sum [i,j] can be derived as prefix[j+1] - prefix[i], a single subtraction, instead of re-adding every element in the range each time.', difficulty: 'easy' },
            { question: 'Why does Kadane\'s algorithm work, i.e. why is it safe to "restart" the running sum when it goes negative?', answer: 'If the running sum ending at the previous index is negative, including it in any future subarray can only reduce that subarray\'s total, so the best choice is to discard it and start a fresh subarray at the current element — this greedy local choice is provably optimal because the max subarray ending at index i only depends on the max subarray ending at i-1.', difficulty: 'medium' },
          ],
          keyTakeaways: ['O(1) indexed access is what makes arrays special — most techniques exploit this.', 'Prefix sum, Kadane\'s, Moore\'s Voting, Dutch Flag, and Cyclic Sort are the five array tricks that show up repeatedly across problems.'],
        },
      ],
    },
    {
      id: 'easy-array-problems',
      title: 'Easy Array Problems',
      topics: [
        {
          id: 'largest-element',
          slug: 'largest-element',
          title: 'Find Largest Element in Array',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Linear Scan',
          conceptsRequired: ['arrays', 'linear search'],
          approaches: [
            {
              name: 'Single Pass Linear Scan',
              intuition: 'Keep a running maximum. For each element, if it is greater than the current max, update max.',
              steps: [
                'Initialize max = arr[0].',
                'Iterate from index 1 to n-1.',
                'If arr[i] > max, set max = arr[i].',
                'Return max after the loop.',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `int largestElement(vector<int>& arr) {
    int maxVal = arr[0];
    for (int i = 1; i < arr.size(); i++)
        if (arr[i] > maxVal) maxVal = arr[i];
    return maxVal;
}`,
              starterCode: `#include <bits/stdc++.h>   // includes vector, algorithm, etc.
using namespace std;       // lets us write vector instead of std::vector

// vector<int>& arr  →  a REFERENCE to a vector of integers
// & means reference: we borrow the array without copying it (efficient)
// Without &, C++ would copy the entire array (slow for large arrays)
int largestElement(vector<int>& arr) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {3, 1, 4, 1, 5, 9, 2, 6};
    cout << largestElement(test1) << endl;  // Expected: 9

    vector<int> test2 = {-5, -1, -8, -3};
    cout << largestElement(test2) << endl;  // Expected: -1

    vector<int> test3 = {42};
    cout << largestElement(test3) << endl;  // Expected: 42

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

// vector<int>& arr = reference to a vector of integers (no copy)
int largestElement(vector<int>& arr) {

    // Start tracking maximum from the first element
    // WHY arr[0] and not 0?
    //   If all elements are negative like {-5, -3, -1},
    //   starting from 0 would wrongly return 0 (not in array)
    //   arr[0] always gives us a real element to compare against
    int maxVal = arr[0];

    // Loop from index 1 (second element) to last element
    // arr.size() returns how many elements are in the array
    // i = 1 because we already "used" arr[0] as our initial max
    for (int i = 1; i < arr.size(); i++) {

        // Check: is current element bigger than our tracked max?
        if (arr[i] > maxVal) {
            maxVal = arr[i];  // update max — we found something bigger
        }
    }

    // After scanning all elements, maxVal is the largest
    return maxVal;
}

int main() {
    vector<int> test1 = {3, 1, 4, 1, 5, 9, 2, 6};
    cout << largestElement(test1) << endl;  // 9

    vector<int> test2 = {-5, -1, -8, -3};
    cout << largestElement(test2) << endl;  // -1

    return 0;
}`,
              expectedOutput: `9
-1
42`,
            },
          ],
          hints: [
            'You do not need to sort; a single pass is enough.',
            'Initialize max with the first element, not 0, to handle all-negative arrays.',
            'STL: *max_element(arr.begin(), arr.end()) does the same in one line.',
          ],
          solution: `int largestElement(vector<int>& arr) {
    int maxVal = arr[0];
    for (int x : arr) maxVal = max(maxVal, x);
    return maxVal;
}`,
        },
        {
          id: 'second-largest',
          slug: 'second-largest',
          title: 'Find Second Largest Element (Without Sorting)',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Linear Scan',
          conceptsRequired: ['arrays'],
          approaches: [
            {
              name: 'Two-Variable Tracking',
              intuition: 'Maintain the top-two distinct values in a single pass. When a new element beats largest, the old largest becomes second largest.',
              steps: [
                'Initialize largest = INT_MIN, secondLargest = INT_MIN.',
                'For each element x in the array:',
                '  If x > largest: set secondLargest = largest, then largest = x.',
                '  Else if x > secondLargest AND x != largest: set secondLargest = x.',
                'Return secondLargest (-1 if all elements are equal).',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `int secondLargest(vector<int>& arr) {
    int first = INT_MIN, second = INT_MIN;
    for (int x : arr) {
        if (x > first) { second = first; first = x; }
        else if (x > second && x != first) second = x;
    }
    return second == INT_MIN ? -1 : second;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// INT_MIN = the smallest possible integer in C++ = -2,147,483,648
// It acts as a "sentinel" — any real array value will be greater than it
int secondLargest(vector<int>& arr) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {3, 1, 4, 1, 5, 9};
    cout << secondLargest(test1) << endl;  // Expected: 5

    vector<int> test2 = {5, 5, 5};
    cout << secondLargest(test2) << endl;  // Expected: -1 (all same)

    vector<int> test3 = {-1, -3, -2};
    cout << secondLargest(test3) << endl;  // Expected: -2

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

int secondLargest(vector<int>& arr) {

    // INT_MIN = -2,147,483,648 (lowest possible int)
    // We use it as a "dummy minimum" — any real value in the array
    // will be larger than INT_MIN, so these get overwritten immediately
    int first = INT_MIN;   // will hold the LARGEST value seen so far
    int second = INT_MIN;  // will hold the SECOND LARGEST seen so far

    // Range-based for loop: "for each element x in arr"
    // Equivalent to: for (int i = 0; i < arr.size(); i++) { int x = arr[i]; ... }
    for (int x : arr) {

        if (x > first) {
            // x is bigger than our current max
            // The old max becomes the new second-largest
            second = first;  // push current first down to second
            first = x;       // x is the new maximum
        }
        else if (x > second && x != first) {
            // x is not the max, but it's bigger than second-largest
            // AND it's not equal to first (we want DISTINCT values)
            second = x;
        }
        // If x <= second or x == first: ignore it, contributes nothing
    }

    // If second is still INT_MIN, all elements were the same (e.g., {5,5,5})
    // In that case, no second largest exists → return -1
    return second == INT_MIN ? -1 : second;
}

int main() {
    vector<int> test1 = {3, 1, 4, 1, 5, 9};
    cout << secondLargest(test1) << endl;  // 5

    vector<int> test2 = {5, 5, 5};
    cout << secondLargest(test2) << endl;  // -1

    return 0;
}`,
              expectedOutput: `5
-1
-2`,
            },
          ],
          hints: [
            'Track two variables: largest and second largest.',
            'Be careful with duplicate values — second largest must be strictly different from largest.',
            'Use INT_MIN as sentinel so any real value overwrites it.',
          ],
          solution: `int secondLargest(vector<int>& arr) {
    int first = INT_MIN, second = INT_MIN;
    for (int x : arr) {
        if (x > first) { second = first; first = x; }
        else if (x > second && x != first) second = x;
    }
    return second == INT_MIN ? -1 : second;
}`,
        },
        {
          id: 'array-sorted-check',
          slug: 'array-sorted-check',
          title: 'Check if Array is Sorted',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Linear Scan',
          conceptsRequired: ['arrays'],
          approaches: [
            {
              name: 'Adjacent Pair Check',
              intuition: 'An array is sorted in non-decreasing order iff every adjacent pair satisfies arr[i] <= arr[i+1].',
              steps: [
                'Loop from i = 0 to n-2.',
                'If arr[i] > arr[i+1], return false.',
                'If loop completes, return true.',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `bool isSorted(vector<int>& arr) {
    for (int i = 0; i + 1 < arr.size(); i++)
        if (arr[i] > arr[i + 1]) return false;
    return true;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// bool = return type that is either true or false
// true means sorted, false means not sorted
bool isSorted(vector<int>& arr) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {1, 2, 3, 4, 5};
    cout << isSorted(test1) << endl;  // Expected: 1 (true)

    vector<int> test2 = {1, 3, 2, 4};
    cout << isSorted(test2) << endl;  // Expected: 0 (false)

    vector<int> test3 = {5};
    cout << isSorted(test3) << endl;  // Expected: 1 (single element is sorted)

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

// bool = a type that holds either true (1) or false (0)
bool isSorted(vector<int>& arr) {

    // We check every PAIR of adjacent elements: (arr[0],arr[1]), (arr[1],arr[2]), ...
    // We stop at index n-2 because we compare arr[i] with arr[i+1]
    // If i went to n-1, then arr[i+1] = arr[n] which is out of bounds!
    //
    // i + 1 < arr.size() is the safe way to say i < n-1
    // (arr.size() returns an UNSIGNED number, so n-1 could overflow if n=0)
    for (int i = 0; i + 1 < arr.size(); i++) {

        // If any adjacent pair is out of order, array is NOT sorted
        // Return false immediately — no need to check the rest
        if (arr[i] > arr[i + 1]) return false;
    }

    // If we checked all pairs and none violated the rule → sorted!
    return true;
}

int main() {
    vector<int> test1 = {1, 2, 3, 4, 5};
    cout << isSorted(test1) << endl;  // 1 (true)

    vector<int> test2 = {1, 3, 2, 4};
    cout << isSorted(test2) << endl;  // 0 (false)

    return 0;
}`,
              expectedOutput: `1
0
1`,
            },
          ],
          hints: [
            'Compare each element with the next one.',
            'A single violation disproves sorted order — short-circuit immediately.',
            'An array of size 0 or 1 is trivially sorted.',
          ],
          solution: `bool isSorted(vector<int>& arr) {
    for (int i = 0; i + 1 < (int)arr.size(); i++)
        if (arr[i] > arr[i+1]) return false;
    return true;
}`,
        },
        {
          id: 'remove-duplicates-sorted',
          slug: 'remove-duplicates-sorted',
          title: 'Remove Duplicates from Sorted Array',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Two Pointers',
          conceptsRequired: ['arrays', 'two pointers'],
          leetcodeUrl: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/',
          approaches: [
            {
              name: 'Two-Pointer In-Place',
              intuition: 'Use a slow pointer i that marks the boundary of the unique section. The fast pointer j scans ahead. Whenever j finds a new value, copy it to ++i.',
              steps: [
                'If array is empty, return 0.',
                'Set i = 0 (points to last written unique element).',
                'Loop j from 1 to n-1.',
                '  If arr[j] != arr[i]: increment i, set arr[i] = arr[j].',
                'Return i + 1.',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `int removeDuplicates(vector<int>& nums) {
    if (nums.empty()) return 0;
    int i = 0;
    for (int j = 1; j < nums.size(); j++)
        if (nums[j] != nums[i]) nums[++i] = nums[j];
    return i + 1;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// The function modifies the array IN-PLACE and returns the new length
// "In-place" means: no extra array, we reuse the same memory
int removeDuplicates(vector<int>& nums) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {1, 1, 2, 2, 3};
    int k1 = removeDuplicates(test1);
    cout << k1 << endl;  // Expected: 3 (unique: 1, 2, 3)

    vector<int> test2 = {0, 0, 1, 1, 1, 2, 2, 3, 3, 4};
    int k2 = removeDuplicates(test2);
    cout << k2 << endl;  // Expected: 5 (unique: 0, 1, 2, 3, 4)

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

int removeDuplicates(vector<int>& nums) {

    // Edge case: empty array has 0 unique elements
    if (nums.empty()) return 0;

    // i = "write pointer" — points to the last confirmed unique element
    // Everything at index 0..i is our "unique region"
    int i = 0;

    // j = "read pointer" — scans forward looking for new unique values
    // Start at 1 because nums[0] is always included as the first unique
    for (int j = 1; j < nums.size(); j++) {

        // Is nums[j] different from the last unique element we wrote (nums[i])?
        if (nums[j] != nums[i]) {

            // Found a new unique value!
            // ++i advances i FIRST, then we assign: nums[i] = nums[j]
            // (this is "pre-increment" — different from i++ which would use old i)
            nums[++i] = nums[j];
        }
        // If nums[j] == nums[i]: it's a duplicate, skip it (j advances, i stays)
    }

    // The unique region is indices 0 to i (inclusive)
    // Length = i + 1 (because arrays are 0-indexed)
    return i + 1;
}

int main() {
    vector<int> nums = {1, 1, 2, 2, 3};
    int k = removeDuplicates(nums);
    cout << k << endl;  // 3

    // First k elements of nums are now {1, 2, 3, ...}
    for (int i = 0; i < k; i++) cout << nums[i] << " ";
    cout << endl;  // 1 2 3

    return 0;
}`,
              expectedOutput: `3
5`,
            },
          ],
          hints: [
            'Because the array is sorted, duplicates are always adjacent.',
            'Use two pointers: slow for the write position, fast for reading.',
            'You modify the array in-place; the return value is the new length.',
          ],
          solution: `int removeDuplicates(vector<int>& nums) {
    if (nums.empty()) return 0;
    int i = 0;
    for (int j = 1; j < (int)nums.size(); j++)
        if (nums[j] != nums[i]) nums[++i] = nums[j];
    return i + 1;
}`,
        },
        {
          id: 'left-rotate-by-one',
          slug: 'left-rotate-by-one',
          title: 'Left Rotate Array by One',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Array Manipulation',
          conceptsRequired: ['arrays'],
          approaches: [
            {
              name: 'Save First Element and Shift',
              intuition: 'Store the first element, shift all others one position left, then place the stored value at the end.',
              steps: [
                'Store temp = arr[0].',
                'Loop i from 0 to n-2: arr[i] = arr[i+1].',
                'Set arr[n-1] = temp.',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `void leftRotateByOne(vector<int>& arr) {
    int n = arr.size();
    int temp = arr[0];
    for (int i = 0; i < n - 1; i++) arr[i] = arr[i + 1];
    arr[n - 1] = temp;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// void = the function returns nothing (modifies arr in-place)
// Left rotate by 1: {1,2,3,4,5} → {2,3,4,5,1}
void leftRotateByOne(vector<int>& arr) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {1, 2, 3, 4, 5};
    leftRotateByOne(test1);
    for (int x : test1) cout << x << " ";
    cout << endl;  // Expected: 2 3 4 5 1

    vector<int> test2 = {9, 8, 7};
    leftRotateByOne(test2);
    for (int x : test2) cout << x << " ";
    cout << endl;  // Expected: 8 7 9

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

// void means this function returns nothing — it modifies arr directly
void leftRotateByOne(vector<int>& arr) {

    // arr.size() returns the number of elements (type: size_t = unsigned integer)
    // We store it in int n for convenience
    int n = arr.size();

    // Save the first element before we overwrite it
    // If we don't save it, it gets lost when we do arr[0] = arr[1]
    int temp = arr[0];

    // Shift every element one step to the LEFT
    // arr[0] gets arr[1], arr[1] gets arr[2], ..., arr[n-2] gets arr[n-1]
    // We stop at i < n-1 because arr[n-1] is filled from temp, not from arr[n]
    for (int i = 0; i < n - 1; i++) {
        arr[i] = arr[i + 1];  // shift element at position i+1 to position i
    }

    // Place the saved first element at the last position
    // This completes the rotation
    arr[n - 1] = temp;
}

int main() {
    vector<int> arr = {1, 2, 3, 4, 5};
    leftRotateByOne(arr);
    for (int x : arr) cout << x << " ";  // 2 3 4 5 1
    cout << endl;

    return 0;
}`,
              expectedOutput: `2 3 4 5 1
8 7 9 `,
            },
          ],
          hints: [
            'Save the first element before overwriting it.',
            'Shift every element one step to the left.',
            'Place the saved element at the last index.',
          ],
          solution: `void leftRotateByOne(vector<int>& arr) {
    int n = arr.size(), temp = arr[0];
    for (int i = 0; i < n - 1; i++) arr[i] = arr[i + 1];
    arr[n - 1] = temp;
}`,
        },
        {
          id: 'left-rotate-k-places',
          slug: 'left-rotate-k-places',
          title: 'Left Rotate Array by K Places',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Reversal Algorithm',
          conceptsRequired: ['arrays', 'reversal trick'],
          leetcodeUrl: 'https://leetcode.com/problems/rotate-array/',
          approaches: [
            {
              name: 'Three Reversals',
              intuition: 'Reversing the first k elements, then the remaining n-k elements, then the whole array produces a left rotation by k. This avoids extra space.',
              steps: [
                'Normalize k = k % n.',
                'Reverse arr[0..k-1].',
                'Reverse arr[k..n-1].',
                'Reverse the entire array arr[0..n-1].',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `void leftRotateK(vector<int>& arr, int k) {
    int n = arr.size();
    k %= n;
    reverse(arr.begin(), arr.begin() + k);
    reverse(arr.begin() + k, arr.end());
    reverse(arr.begin(), arr.end());
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// reverse(start, end) is a built-in function that reverses elements in range [start, end)
// arr.begin() points to arr[0], arr.end() points PAST the last element
void leftRotateK(vector<int>& arr, int k) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {1, 2, 3, 4, 5};
    leftRotateK(test1, 2);
    for (int x : test1) cout << x << " ";
    cout << endl;  // Expected: 3 4 5 1 2

    vector<int> test2 = {1, 2, 3};
    leftRotateK(test2, 7);  // 7 % 3 = 1
    for (int x : test2) cout << x << " ";
    cout << endl;  // Expected: 2 3 1

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

void leftRotateK(vector<int>& arr, int k) {

    int n = arr.size();

    // If k = 7 and n = 3, rotating 7 times = rotating 1 time (7 % 3 = 1)
    // % is the modulo operator — gives the remainder
    k %= n;

    // The THREE REVERSAL TRICK — mathematical insight:
    // To left rotate by k:
    // Step 1: reverse the first k elements      {1,2} → {2,1}
    // Step 2: reverse the remaining n-k elements {3,4,5} → {5,4,3}
    // Step 3: reverse the entire array           {2,1,5,4,3} → {3,4,5,1,2} ✓

    // arr.begin() = iterator (pointer) to first element
    // arr.begin() + k = iterator to element at index k
    // arr.end() = iterator to ONE PAST the last element
    reverse(arr.begin(), arr.begin() + k);  // reverse first k elements
    reverse(arr.begin() + k, arr.end());    // reverse rest of array
    reverse(arr.begin(), arr.end());         // reverse entire array
}

int main() {
    vector<int> arr = {1, 2, 3, 4, 5};
    leftRotateK(arr, 2);
    for (int x : arr) cout << x << " ";  // 3 4 5 1 2
    cout << endl;

    return 0;
}`,
              expectedOutput: `3 4 5 1 2
2 3 1 `,
            },
            {
              name: 'Extra Array Copy',
              intuition: 'Copy the first k elements to a temporary array, shift left by k, then append the saved elements. Simple but uses O(k) space.',
              steps: [
                'Copy arr[0..k-1] into temp.',
                'Shift arr[k..n-1] to arr[0..n-k-1].',
                'Copy temp back to arr[n-k..n-1].',
              ],
              complexity: { time: 'O(N)', space: 'O(K)' },
              code: `void leftRotateK(vector<int>& arr, int k) {
    int n = arr.size(); k %= n;
    vector<int> temp(arr.begin(), arr.begin() + k);
    for (int i = k; i < n; i++) arr[i - k] = arr[i];
    for (int i = 0; i < k; i++) arr[n - k + i] = temp[i];
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// This approach uses an extra temporary array to save the first k elements
void leftRotateK(vector<int>& arr, int k) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {1, 2, 3, 4, 5};
    leftRotateK(test1, 2);
    for (int x : test1) cout << x << " ";
    cout << endl;  // Expected: 3 4 5 1 2

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

void leftRotateK(vector<int>& arr, int k) {

    int n = arr.size();
    k %= n;  // handle k >= n (e.g., k=7, n=3 → k=1)

    // Create a temporary vector to store the first k elements
    // vector<int> temp(arr.begin(), arr.begin() + k) creates a new vector
    // initialized with elements from index 0 to k-1
    // This is like: temp = {arr[0], arr[1], ..., arr[k-1]}
    vector<int> temp(arr.begin(), arr.begin() + k);

    // Shift elements from index k onwards to the left by k positions
    // arr[k] goes to arr[0], arr[k+1] goes to arr[1], etc.
    for (int i = k; i < n; i++) {
        arr[i - k] = arr[i];
    }

    // Copy the saved first-k elements to the END of the array
    // arr[n-k] gets temp[0], arr[n-k+1] gets temp[1], etc.
    for (int i = 0; i < k; i++) {
        arr[n - k + i] = temp[i];
    }
}`,
              expectedOutput: `3 4 5 1 2
`,
            },
          ],
          hints: [
            'Always reduce k modulo n to handle k >= n.',
            'The reversal trick (reverse prefix, suffix, whole) is the O(1) space classic.',
            'Left rotation by k is equivalent to right rotation by n-k.',
          ],
          solution: `void leftRotateK(vector<int>& arr, int k) {
    int n = arr.size(); k %= n;
    reverse(arr.begin(), arr.begin() + k);
    reverse(arr.begin() + k, arr.end());
    reverse(arr.begin(), arr.end());
}`,
        },
        {
          id: 'move-zeros-end',
          slug: 'move-zeros-end',
          title: 'Move All Zeros to End',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Two Pointers',
          conceptsRequired: ['arrays', 'two pointers'],
          leetcodeUrl: 'https://leetcode.com/problems/move-zeroes/',
          approaches: [
            {
              name: 'Two-Pointer Swap',
              intuition: 'Maintain a pointer j that tracks the next position to place a non-zero element. Swap arr[i] and arr[j] whenever arr[i] is non-zero.',
              steps: [
                'Initialize j = 0.',
                'Loop i from 0 to n-1.',
                '  If arr[i] != 0: swap(arr[i], arr[j]); j++.',
                'All zeros are naturally pushed to the end.',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `void moveZeroes(vector<int>& nums) {
    int j = 0;
    for (int i = 0; i < nums.size(); i++)
        if (nums[i] != 0) swap(nums[i], nums[j++]);
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// swap(a, b) swaps values of a and b — built-in C++ function
// Goal: move all zeros to end while keeping non-zero order intact
void moveZeroes(vector<int>& nums) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {0, 1, 0, 3, 12};
    moveZeroes(test1);
    for (int x : test1) cout << x << " ";
    cout << endl;  // Expected: 1 3 12 0 0

    vector<int> test2 = {0, 0, 1};
    moveZeroes(test2);
    for (int x : test2) cout << x << " ";
    cout << endl;  // Expected: 1 0 0

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

void moveZeroes(vector<int>& nums) {

    // j = "write position" — where the next non-zero element should go
    // Think of j as the boundary: everything before j is non-zero
    int j = 0;

    // i scans every element from left to right
    for (int i = 0; i < nums.size(); i++) {

        if (nums[i] != 0) {
            // Found a non-zero element!
            // swap(nums[i], nums[j]) exchanges the values at positions i and j
            // This moves the non-zero to position j, and any zero at j goes to i
            // j++ increments j AFTER the swap (post-increment)
            swap(nums[i], nums[j++]);
        }
        // If nums[i] == 0: skip it, j doesn't move, i moves forward
    }

    // After the loop: all non-zeros are packed at the front (indices 0..j-1)
    // All zeros are at the back (indices j..n-1)
}

int main() {
    vector<int> nums = {0, 1, 0, 3, 12};
    moveZeroes(nums);
    for (int x : nums) cout << x << " ";  // 1 3 12 0 0
    cout << endl;

    return 0;
}`,
              expectedOutput: `1 3 12 0 0
1 0 0 `,
            },
          ],
          hints: [
            'Think of keeping a write pointer that only advances on non-zero elements.',
            'Swapping preserves relative order of non-zero elements.',
            'This runs in O(N) with O(1) space — no extra array needed.',
          ],
          solution: `void moveZeroes(vector<int>& nums) {
    int j = 0;
    for (int i = 0; i < (int)nums.size(); i++)
        if (nums[i]) swap(nums[i], nums[j++]);
}`,
        },
        {
          id: 'linear-search',
          slug: 'linear-search',
          title: 'Linear Search',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Linear Scan',
          conceptsRequired: ['arrays'],
          approaches: [
            {
              name: 'Sequential Search',
              intuition: 'Scan each element from left to right. The first match returns its index; if no match, return -1.',
              steps: [
                'Loop i from 0 to n-1.',
                'If arr[i] == target, return i.',
                'After loop, return -1.',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++)
        if (arr[i] == target) return i;
    return -1;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// Returns the INDEX where target is found, or -1 if not found
int linearSearch(vector<int>& arr, int target) {
    // Write your solution here

}

int main() {
    vector<int> arr = {4, 2, 7, 1, 9, 3};

    cout << linearSearch(arr, 7) << endl;   // Expected: 2 (index of 7)
    cout << linearSearch(arr, 5) << endl;   // Expected: -1 (5 not in array)
    cout << linearSearch(arr, 4) << endl;   // Expected: 0 (index of 4)

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

// int target = the value we're searching for (passed by value, not reference)
// Returning int: either the index (0, 1, 2...) or -1 if not found
int linearSearch(vector<int>& arr, int target) {

    // Check each element one by one from left to right
    // i goes from 0 (first index) to arr.size()-1 (last index)
    for (int i = 0; i < arr.size(); i++) {

        // arr[i] accesses the element at position i
        // == is equality check (= is assignment, == is comparison)
        if (arr[i] == target) {
            return i;  // Found it! Return the index immediately (early exit)
        }
    }

    // If we reach here, target was not found in the array
    // Convention: return -1 to signal "not found"
    // (using -1 because valid indices are always >= 0)
    return -1;
}

int main() {
    vector<int> arr = {4, 2, 7, 1, 9, 3};
    cout << linearSearch(arr, 7) << endl;   // 2
    cout << linearSearch(arr, 5) << endl;   // -1

    return 0;
}`,
              expectedOutput: `2
-1
0`,
            },
          ],
          hints: [
            'No assumptions on the array order are needed.',
            'Return early as soon as the target is found.',
            'Worst case is O(N) when the element is at the end or absent.',
          ],
          solution: `int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < (int)arr.size(); i++)
        if (arr[i] == target) return i;
    return -1;
}`,
        },
        {
          id: 'union-sorted-arrays',
          slug: 'union-sorted-arrays',
          title: 'Union of Two Sorted Arrays',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Two Pointers / Merge',
          conceptsRequired: ['arrays', 'sorting', 'two pointers'],
          approaches: [
            {
              name: 'Two-Pointer Merge',
              intuition: 'Like merge in merge sort but skip duplicates. Compare front elements of both arrays; add the smaller (if not a duplicate of the last added) and advance that pointer.',
              steps: [
                'i = 0, j = 0, result = [].',
                'While i < m and j < n:',
                '  Compare arr1[i] and arr2[j]. Add the smaller if not duplicate of last added.',
                '  Advance the corresponding pointer.',
                'Drain remaining elements from either array, skipping duplicates.',
              ],
              complexity: { time: 'O(M+N)', space: 'O(M+N)' },
              code: `vector<int> unionSorted(vector<int>& a, vector<int>& b) {
    vector<int> res;
    int i = 0, j = 0;
    auto add = [&](int x){ if (res.empty() || res.back() != x) res.push_back(x); };
    while (i < a.size() && j < b.size()) {
        if (a[i] <= b[j]) add(a[i++]);
        else add(b[j++]);
    }
    while (i < a.size()) add(a[i++]);
    while (j < b.size()) add(b[j++]);
    return res;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// Returns a new sorted vector with all unique elements from both arrays
// Both input arrays are already sorted
vector<int> unionSorted(vector<int>& a, vector<int>& b) {
    // Write your solution here

}

int main() {
    vector<int> a = {1, 2, 4, 5};
    vector<int> b = {2, 3, 5, 6};
    vector<int> res = unionSorted(a, b);
    for (int x : res) cout << x << " ";
    cout << endl;  // Expected: 1 2 3 4 5 6

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

vector<int> unionSorted(vector<int>& a, vector<int>& b) {

    // res will hold the final union (sorted, no duplicates)
    vector<int> res;

    // Two pointers: i scans array a, j scans array b
    int i = 0, j = 0;

    // Lambda function (anonymous function) to add x to res only if not duplicate
    // [&] means "capture all local variables by reference" (can use res, i, j inside)
    // res.empty() = true if res has no elements yet
    // res.back() = last element of res
    auto add = [&](int x) {
        if (res.empty() || res.back() != x)  // only add if not a duplicate
            res.push_back(x);  // push_back adds x to the END of res
    };

    // Compare front elements of both arrays
    // Pick the smaller one, add to result, advance that pointer
    while (i < a.size() && j < b.size()) {
        if (a[i] <= b[j]) add(a[i++]);  // a[i] is smaller (or equal): add it, advance i
        else               add(b[j++]);  // b[j] is smaller: add it, advance j
    }

    // One array might have leftover elements — drain them
    while (i < a.size()) add(a[i++]);  // drain remaining elements of a
    while (j < b.size()) add(b[j++]);  // drain remaining elements of b

    return res;
}

int main() {
    vector<int> a = {1, 2, 4, 5};
    vector<int> b = {2, 3, 5, 6};
    vector<int> res = unionSorted(a, b);
    for (int x : res) cout << x << " ";  // 1 2 3 4 5 6
    cout << endl;

    return 0;
}`,
              expectedOutput: `1 2 3 4 5 6 `,
            },
          ],
          hints: [
            'Both arrays are already sorted — use the two-pointer merge technique.',
            'Skip duplicates by comparing each candidate with the last element added to result.',
            'Remember to drain whichever array still has remaining elements after the main loop.',
          ],
          solution: `vector<int> unionSorted(vector<int>& a, vector<int>& b) {
    vector<int> res; int i = 0, j = 0;
    auto add = [&](int x){ if (res.empty() || res.back() != x) res.push_back(x); };
    while (i < (int)a.size() && j < (int)b.size())
        a[i] <= b[j] ? add(a[i++]) : add(b[j++]);
    while (i < (int)a.size()) add(a[i++]);
    while (j < (int)b.size()) add(b[j++]);
    return res;
}`,
        },
        {
          id: 'find-missing-number',
          slug: 'find-missing-number',
          title: 'Find Missing Number in 1..N',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Math / XOR',
          conceptsRequired: ['arrays', 'math', 'XOR'],
          leetcodeUrl: 'https://leetcode.com/problems/missing-number/',
          approaches: [
            {
              name: 'Summation Formula',
              intuition: 'Sum of 1..N is N*(N+1)/2. Subtract the actual array sum to get the missing number.',
              steps: [
                'Compute expected = n*(n+1)/2.',
                'Compute actual = sum of all array elements.',
                'Return expected - actual.',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `int missingNumber(vector<int>& nums) {
    int n = nums.size();
    int expected = n * (n + 1) / 2;
    int actual = 0;
    for (int x : nums) actual += x;
    return expected - actual;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// Array has n-1 elements from range [0..n], find the missing one
// n * (n+1) / 2 = sum of 0+1+2+...+n (Gauss formula)
int missingNumber(vector<int>& nums) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {3, 0, 1};
    cout << missingNumber(test1) << endl;  // Expected: 2

    vector<int> test2 = {0, 1};
    cout << missingNumber(test2) << endl;  // Expected: 2

    vector<int> test3 = {9,6,4,2,3,5,7,0,1};
    cout << missingNumber(test3) << endl;  // Expected: 8

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

int missingNumber(vector<int>& nums) {

    // nums.size() returns how many elements are in the array
    // If the array has n-1 elements from range [0..n], n = nums.size()
    int n = nums.size();

    // Gauss formula: sum of 0+1+2+...+n = n*(n+1)/2
    // This is the sum if NO element was missing
    int expected = n * (n + 1) / 2;

    // Calculate the actual sum of what we have
    int actual = 0;
    for (int x : nums) actual += x;  // add each element to running total

    // The difference = the missing number
    // If expected = 15 and actual = 12, then 3 is missing
    return expected - actual;
}

int main() {
    vector<int> nums = {3, 0, 1};
    cout << missingNumber(nums) << endl;  // 2

    return 0;
}`,
              expectedOutput: `2
2
8`,
            },
            {
              name: 'XOR Trick',
              intuition: 'XOR all indices 0..N with all array values. Each number that appears in both cancels out, leaving the missing number.',
              steps: [
                'xorAll = 0.',
                'For i from 0 to n: xorAll ^= i.',
                'For each x in nums: xorAll ^= x.',
                'Return xorAll.',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `int missingNumber(vector<int>& nums) {
    int xorAll = 0, n = nums.size();
    for (int i = 0; i <= n; i++) xorAll ^= i;
    for (int x : nums) xorAll ^= x;
    return xorAll;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// XOR trick: x ^ x = 0, x ^ 0 = x
// XOR all numbers 0..n with all array elements
// Pairs cancel out, leaving the missing number
int missingNumber(vector<int>& nums) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {3, 0, 1};
    cout << missingNumber(test1) << endl;  // Expected: 2

    vector<int> test2 = {9,6,4,2,3,5,7,0,1};
    cout << missingNumber(test2) << endl;  // Expected: 8

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

int missingNumber(vector<int>& nums) {

    // xorAll will accumulate XOR of everything
    int xorAll = 0;
    int n = nums.size();

    // XOR properties you must know:
    //   a ^ a = 0   (any number XOR itself = 0)
    //   a ^ 0 = a   (any number XOR 0 = itself)
    //   XOR is commutative and associative (order doesn't matter)

    // Step 1: XOR all numbers from 0 to n (the "complete" set)
    // i <= n because the missing number could be n itself
    for (int i = 0; i <= n; i++) {
        xorAll ^= i;  // ^= means XOR and assign (xorAll = xorAll ^ i)
    }

    // Step 2: XOR with all numbers we actually have
    // Each number present in nums appears once in step 1 and once here
    // They cancel: 3^3=0, 0^0=0, 1^1=0
    // Only the missing number (appears only in step 1) survives
    for (int x : nums) {
        xorAll ^= x;
    }

    // xorAll now holds only the missing number
    return xorAll;
}`,
              expectedOutput: `2
8`,
            },
          ],
          hints: [
            'The expected sum of 1..N is N*(N+1)/2; subtract the actual sum.',
            'Alternatively, XOR all values from 0 to N with all array elements.',
            'The summation approach can overflow for large N; use long long or prefer XOR.',
          ],
          solution: `int missingNumber(vector<int>& nums) {
    int n = nums.size(), xorAll = 0;
    for (int i = 0; i <= n; i++) xorAll ^= i;
    for (int x : nums) xorAll ^= x;
    return xorAll;
}`,
        },
        {
          id: 'max-consecutive-ones',
          slug: 'max-consecutive-ones',
          title: 'Maximum Consecutive Ones',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Linear Scan / Counting',
          conceptsRequired: ['arrays'],
          leetcodeUrl: 'https://leetcode.com/problems/max-consecutive-ones/',
          approaches: [
            {
              name: 'Running Counter',
              intuition: 'Count consecutive 1s with a running variable. Reset to 0 on seeing a 0. Track the global maximum.',
              steps: [
                'Initialize count = 0, maxCount = 0.',
                'For each element x:',
                '  If x == 1: count++, update maxCount = max(maxCount, count).',
                '  Else: count = 0.',
                'Return maxCount.',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `int findMaxConsecutiveOnes(vector<int>& nums) {
    int count = 0, maxCount = 0;
    for (int x : nums) {
        if (x == 1) maxCount = max(maxCount, ++count);
        else count = 0;
    }
    return maxCount;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// max(a, b) returns the larger of a and b — built-in function
// count tracks current streak, maxCount tracks best streak seen
int findMaxConsecutiveOnes(vector<int>& nums) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {1, 1, 0, 1, 1, 1};
    cout << findMaxConsecutiveOnes(test1) << endl;  // Expected: 3

    vector<int> test2 = {1, 0, 1, 1, 0, 1};
    cout << findMaxConsecutiveOnes(test2) << endl;  // Expected: 2

    vector<int> test3 = {0, 0, 0};
    cout << findMaxConsecutiveOnes(test3) << endl;  // Expected: 0

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

int findMaxConsecutiveOnes(vector<int>& nums) {

    int count = 0;     // current streak of 1s (resets on 0)
    int maxCount = 0;  // best streak seen so far

    // Range-based for loop: x takes each value in nums one by one
    for (int x : nums) {

        if (x == 1) {
            // We're in a streak — increment count
            // ++count is pre-increment: increment THEN use the value
            // max(maxCount, ++count) = pick larger of current max and new count
            maxCount = max(maxCount, ++count);
        } else {
            // Encountered a 0 — streak breaks, reset count to 0
            count = 0;
        }
    }

    // maxCount holds the length of the longest 1-streak
    return maxCount;
}

int main() {
    vector<int> nums = {1, 1, 0, 1, 1, 1};
    cout << findMaxConsecutiveOnes(nums) << endl;  // 3

    return 0;
}`,
              expectedOutput: `3
2
0`,
            },
          ],
          hints: [
            'Reset your counter every time you see a 0.',
            'Update the global max before or after incrementing.',
            'Edge case: all zeros → answer is 0.',
          ],
          solution: `int findMaxConsecutiveOnes(vector<int>& nums) {
    int count = 0, res = 0;
    for (int x : nums) res = max(res, x ? ++count : (count = 0));
    return res;
}`,
        },
        {
          id: 'single-number',
          slug: 'single-number',
          title: 'Single Number (XOR)',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Bit Manipulation / XOR',
          conceptsRequired: ['arrays', 'XOR'],
          leetcodeUrl: 'https://leetcode.com/problems/single-number/',
          approaches: [
            {
              name: 'XOR All Elements',
              intuition: 'XOR is self-inverse: a^a = 0 and a^0 = a. XORing all elements cancels every duplicated number, leaving only the unique one.',
              steps: [
                'Initialize result = 0.',
                'For each x in nums: result ^= x.',
                'Return result.',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `int singleNumber(vector<int>& nums) {
    int res = 0;
    for (int x : nums) res ^= x;
    return res;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// ^ is the XOR (exclusive OR) operator
// Key property: a ^ a = 0, a ^ 0 = a
// So duplicates cancel each other, leaving only the unique element
int singleNumber(vector<int>& nums) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {2, 2, 1};
    cout << singleNumber(test1) << endl;  // Expected: 1

    vector<int> test2 = {4, 1, 2, 1, 2};
    cout << singleNumber(test2) << endl;  // Expected: 4

    vector<int> test3 = {1};
    cout << singleNumber(test3) << endl;  // Expected: 1

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

int singleNumber(vector<int>& nums) {

    // res accumulates the XOR of all elements
    // Start with 0 because: res ^ nums[0] = nums[0] (XOR with 0 gives itself)
    int res = 0;

    for (int x : nums) {
        // ^ is XOR: "exclusive or"
        // For bits: 0^0=0, 1^1=0, 0^1=1, 1^0=1
        // So: same numbers XOR to 0, different XOR to non-zero
        //
        // Example with {4, 1, 2, 1, 2}:
        // res = 0 ^ 4 = 4
        // res = 4 ^ 1 = 5
        // res = 5 ^ 2 = 7
        // res = 7 ^ 1 = 6   (1 appeared again, cancels with earlier 1: 4^5=1, 1^1=0, so effectively)
        // res = 6 ^ 2 = 4   (2 appeared again, cancels with earlier 2)
        // Final: 4 — the unique element!
        res ^= x;  // res = res XOR x
    }

    return res;  // only the non-paired element remains
}

int main() {
    vector<int> test1 = {2, 2, 1};
    cout << singleNumber(test1) << endl;  // 1

    vector<int> test2 = {4, 1, 2, 1, 2};
    cout << singleNumber(test2) << endl;  // 4

    return 0;
}`,
              expectedOutput: `1
4
1`,
            },
          ],
          hints: [
            'XOR of a number with itself is 0; XOR with 0 is the number itself.',
            'Order does not matter in XOR — pairs always cancel.',
            'This runs in O(N) time and O(1) space, which is optimal.',
          ],
          solution: `int singleNumber(vector<int>& nums) {
    int res = 0;
    for (int x : nums) res ^= x;
    return res;
}`,
        },
        {
          id: 'longest-subarray-sum-k-positive',
          slug: 'longest-subarray-sum-k-positive',
          title: 'Longest Subarray with Sum K (Positives Only)',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Sliding Window',
          conceptsRequired: ['arrays', 'sliding window'],
          approaches: [
            {
              name: 'Variable-Size Sliding Window',
              intuition: 'For non-negative arrays, a sliding window works because adding an element never decreases the sum, and removing elements from the left monotonically decreases the sum.',
              steps: [
                'left = 0, currentSum = 0, maxLen = 0.',
                'For right from 0 to n-1:',
                '  currentSum += arr[right].',
                '  While currentSum > k: currentSum -= arr[left++].',
                '  If currentSum == k: maxLen = max(maxLen, right - left + 1).',
                'Return maxLen.',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `int longestSubarraySumK(vector<int>& arr, int k) {
    int left = 0, sum = 0, maxLen = 0;
    for (int right = 0; right < arr.size(); right++) {
        sum += arr[right];
        while (sum > k) sum -= arr[left++];
        if (sum == k) maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// Sliding window: maintain a [left, right] window with current sum
// Expand right to grow the window, shrink from left when sum > k
// Only works when ALL elements are NON-NEGATIVE
int longestSubarraySumK(vector<int>& arr, int k) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {1, 2, 3, 1, 1, 1, 1};
    cout << longestSubarraySumK(test1, 3) << endl;  // Expected: 4 (1+1+1+1=4? No, 1+1+1=3 len 3)
    // Wait: subarray [1,1,1] at end has sum 3, len 3. [1,2] has sum 3, len 2. Answer: 3.

    vector<int> test2 = {1, 0, 1, 1, 0};
    cout << longestSubarraySumK(test2, 2) << endl;  // Expected: 5 (whole array: 1+0+1+1+0=3... )
    // [1,0,1] = 2 (len 3), [0,1,1,0] = 2 (len 4). Answer: 4

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

int longestSubarraySumK(vector<int>& arr, int k) {

    // Two pointers defining our current window [left, right]
    int left = 0;
    int sum = 0;      // sum of elements in current window
    int maxLen = 0;   // length of longest valid window found so far

    // right expands the window one element at a time
    for (int right = 0; right < arr.size(); right++) {

        // Add arr[right] to our window's sum
        sum += arr[right];

        // If sum exceeds k, shrink window from the left
        // left++ advances left pointer AND moves past that element
        // We keep shrinking until sum <= k (or window becomes empty)
        while (sum > k) {
            sum -= arr[left];  // remove left element from sum
            left++;            // shrink window from left
        }

        // Now sum <= k. If sum == k, this window is a candidate.
        if (sum == k) {
            // right - left + 1 = length of current window
            // +1 because both endpoints are inclusive (e.g., [2,4] has length 3)
            maxLen = max(maxLen, right - left + 1);
        }
    }

    return maxLen;
}`,
              expectedOutput: `3
4`,
            },
          ],
          hints: [
            'Since all values are positive, shrinking the window from the left decreases the sum.',
            'Expand the right boundary every iteration; shrink the left boundary while sum exceeds k.',
            'Check for sum == k after each adjustment.',
          ],
          solution: `int longestSubarraySumK(vector<int>& arr, int k) {
    int left = 0, sum = 0, maxLen = 0;
    for (int right = 0; right < (int)arr.size(); right++) {
        sum += arr[right];
        while (sum > k) sum -= arr[left++];
        if (sum == k) maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
        },
        {
          id: 'longest-subarray-sum-k',
          slug: 'longest-subarray-sum-k',
          title: 'Longest Subarray with Sum K (With Negatives)',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Prefix Sum + Hashing',
          conceptsRequired: ['arrays', 'prefix sum', 'hash map'],
          approaches: [
            {
              name: 'Prefix Sum with Hash Map',
              intuition: 'Track prefix sums. If prefix[j] - prefix[i] == k, then subarray (i+1..j) has sum k. Store the first occurrence index of each prefix sum to maximize length.',
              steps: [
                'Create a map prefixIndex. Set prefixIndex[0] = -1.',
                'Maintain prefixSum = 0, maxLen = 0.',
                'For right from 0 to n-1:',
                '  prefixSum += arr[right].',
                '  If prefixSum - k exists in map: maxLen = max(maxLen, right - map[prefixSum-k]).',
                '  If prefixSum not in map: map[prefixSum] = right. (store first occurrence only)',
                'Return maxLen.',
              ],
              complexity: { time: 'O(N)', space: 'O(N)' },
              code: `int longestSubarrayK(vector<int>& arr, int k) {
    unordered_map<int,int> mp;
    mp[0] = -1;
    int prefixSum = 0, maxLen = 0;
    for (int i = 0; i < arr.size(); i++) {
        prefixSum += arr[i];
        if (mp.count(prefixSum - k))
            maxLen = max(maxLen, i - mp[prefixSum - k]);
        if (!mp.count(prefixSum)) mp[prefixSum] = i;
    }
    return maxLen;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// unordered_map<int,int> mp — a hash map storing (prefixSum → earliest index)
// mp.count(key) returns 1 if key exists in map, 0 if not
// Use prefix sums: sum(i..j) = prefixSum[j] - prefixSum[i-1]
int longestSubarrayK(vector<int>& arr, int k) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {-1, 1, 1};
    cout << longestSubarrayK(test1, 1) << endl;  // Expected: 3

    vector<int> test2 = {10, 5, 2, 7, 1, 9};
    cout << longestSubarrayK(test2, 15) << endl;  // Expected: 4

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

int longestSubarrayK(vector<int>& arr, int k) {

    // unordered_map = hash map (O(1) average lookup/insert)
    // Key: prefix sum value, Value: the EARLIEST index where this prefix sum occurred
    // We store earliest index because we want the LONGEST subarray
    unordered_map<int, int> mp;

    // Prefix sum at index -1 is 0 (no elements yet)
    // This handles subarrays starting from index 0
    // e.g., if prefixSum at index 3 is k, then subarray [0..3] has sum k
    //        prefixSum - k = 0, which we stored at index -1, so length = 3 - (-1) = 4
    mp[0] = -1;

    int prefixSum = 0;  // running prefix sum
    int maxLen = 0;

    for (int i = 0; i < arr.size(); i++) {

        prefixSum += arr[i];  // add current element to prefix sum

        // If prefixSum - k exists in map at index j:
        // then subarray from (j+1) to i has sum = prefixSum - (prefixSum - k) = k
        // Length of that subarray = i - j
        if (mp.count(prefixSum - k)) {
            maxLen = max(maxLen, i - mp[prefixSum - k]);
        }

        // Store this prefix sum if NOT already in map
        // We only store the FIRST occurrence to maximize subarray length
        // (if we update with later indices, we'd get shorter subarrays)
        if (!mp.count(prefixSum)) {
            mp[prefixSum] = i;
        }
    }

    return maxLen;
}`,
              expectedOutput: `3
4`,
            },
          ],
          hints: [
            'Sliding window fails with negatives because adding an element could decrease the sum.',
            'Use prefix sums: subarray sum from i+1 to j = prefixSum[j] - prefixSum[i].',
            'Store only the FIRST occurrence of each prefix sum to get the longest subarray.',
          ],
          solution: `int longestSubarrayK(vector<int>& arr, int k) {
    unordered_map<int,int> mp; mp[0] = -1;
    int ps = 0, res = 0;
    for (int i = 0; i < (int)arr.size(); i++) {
        ps += arr[i];
        if (mp.count(ps - k)) res = max(res, i - mp[ps - k]);
        if (!mp.count(ps)) mp[ps] = i;
    }
    return res;
}`,
        },
      ],
    },
    {
      id: 'medium-array-problems',
      title: 'Medium Array Problems',
      topics: [
        {
          id: 'two-sum',
          slug: 'two-sum',
          title: 'Two Sum',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Hashing',
          conceptsRequired: ['arrays', 'hash map'],
          leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
          approaches: [
            {
              name: 'Hash Map (One Pass)',
              intuition: 'For each element x, check if target - x is already in the hash map. If yes, we found the pair. Otherwise, store x with its index.',
              steps: [
                'Create an empty map: value → index.',
                'For each index i and value nums[i]:',
                '  complement = target - nums[i].',
                '  If complement is in map: return {map[complement], i}.',
                '  Else: map[nums[i]] = i.',
              ],
              complexity: { time: 'O(N)', space: 'O(N)' },
              code: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int,int> mp;
    for (int i = 0; i < nums.size(); i++) {
        int comp = target - nums[i];
        if (mp.count(comp)) return {mp[comp], i};
        mp[nums[i]] = i;
    }
    return {};
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// Returns a vector of TWO indices {i, j} such that nums[i] + nums[j] == target
// vector<int> as return type = we're returning a list of integers
vector<int> twoSum(vector<int>& nums, int target) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {2, 7, 11, 15};
    vector<int> r1 = twoSum(test1, 9);
    cout << r1[0] << " " << r1[1] << endl;  // Expected: 0 1

    vector<int> test2 = {3, 2, 4};
    vector<int> r2 = twoSum(test2, 6);
    cout << r2[0] << " " << r2[1] << endl;  // Expected: 1 2

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

// Returns pair of indices as a vector {i, j}
vector<int> twoSum(vector<int>& nums, int target) {

    // unordered_map<int, int> maps each VALUE to its INDEX
    // e.g., if nums[3] = 7, store mp[7] = 3
    unordered_map<int, int> mp;  // value → index

    for (int i = 0; i < nums.size(); i++) {

        // We need: nums[i] + nums[j] = target
        // So: nums[j] = target - nums[i]  ← this is the "complement"
        int comp = target - nums[i];

        // mp.count(comp) = 1 if comp exists in map, 0 if not
        // If complement already in map → we found the pair!
        if (mp.count(comp)) {
            // Return indices as a vector literal {mp[comp], i}
            // mp[comp] = index of the complement, i = current index
            return {mp[comp], i};
        }

        // Complement not found yet — store current element for future lookups
        mp[nums[i]] = i;  // remember: value nums[i] is at index i
    }

    return {};  // empty vector = no solution (problem guarantees one exists)
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    vector<int> res = twoSum(nums, 9);
    cout << res[0] << " " << res[1] << endl;  // 0 1

    return 0;
}`,
              expectedOutput: `0 1
1 2`,
            },
          ],
          hints: [
            'For each element, you need to find its complement (target - element) in the array.',
            'A hash map lets you look up the complement in O(1).',
            'Store index as the value in the map so you can return the pair of indices.',
          ],
          solution: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int,int> mp;
    for (int i = 0; i < (int)nums.size(); i++) {
        int c = target - nums[i];
        if (mp.count(c)) return {mp[c], i};
        mp[nums[i]] = i;
    }
    return {};
}`,
        },
        {
          id: 'sort-012',
          slug: 'sort-012',
          title: 'Sort Array of 0s, 1s, and 2s',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Dutch National Flag',
          conceptsRequired: ['arrays', 'three pointers'],
          leetcodeUrl: 'https://leetcode.com/problems/sort-colors/',
          approaches: [
            {
              name: 'Dutch National Flag Algorithm',
              intuition: 'Maintain three regions: [0..low-1] = 0s, [low..mid-1] = 1s, [high+1..n-1] = 2s, [mid..high] = unsorted. Process the unsorted region with pointer mid.',
              steps: [
                'low = 0, mid = 0, high = n-1.',
                'While mid <= high:',
                '  If arr[mid] == 0: swap(arr[low], arr[mid]); low++; mid++.',
                '  If arr[mid] == 1: mid++.',
                '  If arr[mid] == 2: swap(arr[mid], arr[high]); high--. (do NOT increment mid)',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `void sortColors(vector<int>& nums) {
    int low = 0, mid = 0, high = nums.size() - 1;
    while (mid <= high) {
        if (nums[mid] == 0) swap(nums[low++], nums[mid++]);
        else if (nums[mid] == 1) mid++;
        else swap(nums[mid], nums[high--]);
    }
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// Three pointer approach:
// low  = boundary of 0-region (everything before low is 0)
// mid  = current element being processed
// high = boundary of 2-region (everything after high is 2)
void sortColors(vector<int>& nums) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {2, 0, 2, 1, 1, 0};
    sortColors(test1);
    for (int x : test1) cout << x << " ";
    cout << endl;  // Expected: 0 0 1 1 2 2

    vector<int> test2 = {2, 0, 1};
    sortColors(test2);
    for (int x : test2) cout << x << " ";
    cout << endl;  // Expected: 0 1 2

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

void sortColors(vector<int>& nums) {

    // Three pointers divide the array into regions:
    // [0 .. low-1]  → all 0s (confirmed)
    // [low .. mid-1] → all 1s (confirmed)
    // [mid .. high]  → unknown (to be processed)
    // [high+1 .. n-1] → all 2s (confirmed)
    int low = 0;
    int mid = 0;
    int high = nums.size() - 1;

    // Process until mid crosses high (unknown region is empty)
    while (mid <= high) {

        if (nums[mid] == 0) {
            // Current element is 0 → belongs in 0-region
            // Swap with low boundary, then advance BOTH low and mid
            // (we know nums[low] was a 1 because it was in the 1-region,
            //  so after swap, nums[mid] = 1, which is already processed)
            swap(nums[low++], nums[mid++]);
        }
        else if (nums[mid] == 1) {
            // Current element is 1 → already in the right region
            // Just advance mid
            mid++;
        }
        else {
            // nums[mid] == 2 → belongs in 2-region
            // Swap with high boundary, then shrink high
            // IMPORTANT: do NOT advance mid here!
            // The element swapped from high is UNKNOWN (could be 0, 1, or 2)
            // mid needs to re-examine it in the next iteration
            swap(nums[mid], nums[high--]);
        }
    }
}

int main() {
    vector<int> nums = {2, 0, 2, 1, 1, 0};
    sortColors(nums);
    for (int x : nums) cout << x << " ";  // 0 0 1 1 2 2
    cout << endl;

    return 0;
}`,
              expectedOutput: `0 0 1 1 2 2
0 1 2 `,
            },
          ],
          hints: [
            'Dutch National Flag: maintain three pointers for three regions.',
            'When swapping with high, do not advance mid — the swapped element is unknown.',
            'When swapping with low, advance both low and mid since we know low is now a 0.',
          ],
          solution: `void sortColors(vector<int>& nums) {
    int lo = 0, mid = 0, hi = (int)nums.size() - 1;
    while (mid <= hi) {
        if (nums[mid] == 0) swap(nums[lo++], nums[mid++]);
        else if (nums[mid] == 1) mid++;
        else swap(nums[mid], nums[hi--]);
    }
}`,
        },
        {
          id: 'majority-element-1',
          slug: 'majority-element-1',
          title: 'Majority Element (> N/2 times)',
          type: 'problem',
          difficulty: 'easy',
          pattern: "Boyer-Moore Voting",
          conceptsRequired: ['arrays', 'voting algorithm'],
          leetcodeUrl: 'https://leetcode.com/problems/majority-element/',
          approaches: [
            {
              name: "Boyer-Moore Voting Algorithm",
              intuition: 'Pair up different elements and cancel them. The element that survives is the majority candidate. Since the majority element appears > N/2 times it can never be completely cancelled.',
              steps: [
                'candidate = nums[0], count = 1.',
                'For i from 1 to n-1:',
                '  If count == 0: candidate = nums[i], count = 1.',
                '  Else if nums[i] == candidate: count++.',
                '  Else: count--.',
                'Return candidate (guaranteed to be the majority).',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `int majorityElement(vector<int>& nums) {
    int candidate = nums[0], count = 1;
    for (int i = 1; i < nums.size(); i++) {
        if (count == 0) { candidate = nums[i]; count = 1; }
        else if (nums[i] == candidate) count++;
        else count--;
    }
    return candidate;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// Boyer-Moore Voting: think of it as voting
// Candidate gains a vote when it's seen, loses a vote when something else is seen
// Majority element always survives because it has more votes than everything else combined
int majorityElement(vector<int>& nums) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {3, 2, 3};
    cout << majorityElement(test1) << endl;  // Expected: 3

    vector<int> test2 = {2, 2, 1, 1, 1, 2, 2};
    cout << majorityElement(test2) << endl;  // Expected: 2

    vector<int> test3 = {1};
    cout << majorityElement(test3) << endl;  // Expected: 1

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

int majorityElement(vector<int>& nums) {

    // Start with first element as our initial candidate
    int candidate = nums[0];
    int count = 1;  // how many net "votes" our candidate has

    // Start from index 1 (we already used nums[0] as initial candidate)
    for (int i = 1; i < nums.size(); i++) {

        if (count == 0) {
            // Our candidate was completely cancelled out
            // Start fresh with the current element as the new candidate
            candidate = nums[i];
            count = 1;
        }
        else if (nums[i] == candidate) {
            // Same as current candidate → it gains a vote
            count++;
        }
        else {
            // Different from candidate → they cancel each other (both lose 1 vote)
            count--;
        }
    }

    // The surviving candidate is the majority element
    // WHY? Majority appears > n/2 times, so it can never be fully cancelled
    // Even if every other element votes against it, majority still wins
    return candidate;
}

int main() {
    vector<int> nums = {3, 2, 3};
    cout << majorityElement(nums) << endl;  // 3

    vector<int> nums2 = {2, 2, 1, 1, 1, 2, 2};
    cout << majorityElement(nums2) << endl;  // 2

    return 0;
}`,
              expectedOutput: `3
2
1`,
            },
          ],
          hints: [
            'The majority element appears more than N/2 times, so it cannot be eliminated.',
            "Boyer-Moore voting: cancel one occurrence of a different element with one occurrence of the candidate.",
            'The final candidate is always the majority element when a majority is guaranteed to exist.',
          ],
          solution: `int majorityElement(vector<int>& nums) {
    int cand = nums[0], cnt = 1;
    for (int i = 1; i < (int)nums.size(); i++) {
        if (!cnt) { cand = nums[i]; cnt = 1; }
        else cnt += (nums[i] == cand) ? 1 : -1;
    }
    return cand;
}`,
        },
        {
          id: 'kadanes-algorithm',
          slug: 'kadanes-algorithm',
          title: "Kadane's Algorithm — Maximum Subarray Sum",
          type: 'problem',
          difficulty: 'medium',
          pattern: "Kadane's / DP",
          conceptsRequired: ['arrays', 'dynamic programming'],
          leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/',
          approaches: [
            {
              name: "Kadane's Algorithm",
              intuition: 'Maintain a running sum. If the running sum becomes negative, it is always better to start fresh from the next element. Track the maximum seen so far.',
              steps: [
                'currentSum = nums[0], maxSum = nums[0].',
                'For i from 1 to n-1:',
                '  currentSum = max(nums[i], currentSum + nums[i]).',
                '  maxSum = max(maxSum, currentSum).',
                'Return maxSum.',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `int maxSubArray(vector<int>& nums) {
    int cur = nums[0], best = nums[0];
    for (int i = 1; i < nums.size(); i++) {
        cur = max(nums[i], cur + nums[i]);
        best = max(best, cur);
    }
    return best;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// Kadane's: at each position, decide — extend current subarray or start fresh?
// If cur + nums[i] < nums[i], current subarray is a burden → start fresh
int maxSubArray(vector<int>& nums) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    cout << maxSubArray(test1) << endl;  // Expected: 6 ([4,-1,2,1])

    vector<int> test2 = {1};
    cout << maxSubArray(test2) << endl;  // Expected: 1

    vector<int> test3 = {-3, -2, -1};
    cout << maxSubArray(test3) << endl;  // Expected: -1

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

int maxSubArray(vector<int>& nums) {

    // cur = max subarray sum ENDING at the current position
    // best = global maximum subarray sum seen so far
    // Both start at nums[0] to handle all-negative arrays correctly
    int cur = nums[0];
    int best = nums[0];

    // Start from index 1 (nums[0] is already our initial subarray)
    for (int i = 1; i < nums.size(); i++) {

        // KEY DECISION: should we extend the existing subarray or start fresh?
        // Option A: extend → cur + nums[i]
        // Option B: start fresh → nums[i]  (abandon the previous subarray)
        //
        // If cur is negative, adding it to nums[i] makes things worse
        // So when cur < 0, starting fresh (just nums[i]) is always better
        // max() automatically makes this choice
        cur = max(nums[i], cur + nums[i]);

        // Update global best
        best = max(best, cur);
    }

    return best;
}

int main() {
    vector<int> nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    cout << maxSubArray(nums) << endl;  // 6

    return 0;
}`,
              expectedOutput: `6
1
-1`,
            },
          ],
          hints: [
            'A negative prefix sum only hurts any subarray starting after it — reset to 0 when current sum goes negative.',
            'Initialize with nums[0], not 0, to handle all-negative arrays.',
            "This is essentially the DP recurrence: dp[i] = max(nums[i], dp[i-1] + nums[i]).",
          ],
          solution: `int maxSubArray(vector<int>& nums) {
    int cur = nums[0], best = nums[0];
    for (int i = 1; i < (int)nums.size(); i++) {
        cur = max(nums[i], cur + nums[i]);
        best = max(best, cur);
    }
    return best;
}`,
        },
        {
          id: 'max-subarray-print',
          slug: 'max-subarray-print',
          title: 'Print the Maximum Subarray',
          type: 'problem',
          difficulty: 'medium',
          pattern: "Kadane's with Tracking",
          conceptsRequired: ['arrays', "Kadane's algorithm"],
          approaches: [
            {
              name: "Kadane's with Index Tracking",
              intuition: "Extend Kadane's to remember start and end indices of the current and best subarray.",
              steps: [
                'Track start, end, tempStart indices.',
                'When cur + nums[i] < nums[i]: reset tempStart = i.',
                'When maxSum updates: record start = tempStart, end = i.',
                'Print arr[start..end].',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `vector<int> maxSubarrayPrint(vector<int>& nums) {
    int n = nums.size();
    int cur = nums[0], best = nums[0];
    int start = 0, end = 0, tempStart = 0;
    for (int i = 1; i < n; i++) {
        if (nums[i] > cur + nums[i]) { cur = nums[i]; tempStart = i; }
        else cur += nums[i];
        if (cur > best) { best = cur; start = tempStart; end = i; }
    }
    return vector<int>(nums.begin() + start, nums.begin() + end + 1);
}`,
            },
          ],
          hints: [
            'Use a tempStart pointer that resets whenever starting fresh is better.',
            'Update the global start/end only when a new maximum is found.',
            'The subarray is nums[start..end] inclusive.',
          ],
          solution: `vector<int> maxSubarrayPrint(vector<int>& nums) {
    int cur = nums[0], best = nums[0], s = 0, e = 0, ts = 0;
    for (int i = 1; i < (int)nums.size(); i++) {
        if (nums[i] > cur + nums[i]) { cur = nums[i]; ts = i; }
        else cur += nums[i];
        if (cur > best) { best = cur; s = ts; e = i; }
    }
    return {nums.begin() + s, nums.begin() + e + 1};
}`,
        },
        {
          id: 'stock-buy-sell',
          slug: 'stock-buy-sell',
          title: 'Best Time to Buy and Sell Stock (1 Transaction)',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Greedy / Linear Scan',
          conceptsRequired: ['arrays', 'greedy'],
          leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
          approaches: [
            {
              name: 'Track Minimum and Max Profit',
              intuition: 'For each day, the best profit selling on that day is prices[i] - minSoFar. Update minSoFar as we go.',
              steps: [
                'minPrice = INT_MAX, maxProfit = 0.',
                'For each price p:',
                '  minPrice = min(minPrice, p).',
                '  maxProfit = max(maxProfit, p - minPrice).',
                'Return maxProfit.',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `int maxProfit(vector<int>& prices) {
    int minPrice = INT_MAX, maxProfit = 0;
    for (int p : prices) {
        minPrice = min(minPrice, p);
        maxProfit = max(maxProfit, p - minPrice);
    }
    return maxProfit;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// INT_MAX = largest possible int = 2,147,483,647
// We use it so that the first price always becomes minPrice
int maxProfit(vector<int>& prices) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {7, 1, 5, 3, 6, 4};
    cout << maxProfit(test1) << endl;  // Expected: 5 (buy at 1, sell at 6)

    vector<int> test2 = {7, 6, 4, 3, 1};
    cout << maxProfit(test2) << endl;  // Expected: 0 (prices only fall, no profit)

    vector<int> test3 = {2, 4, 1};
    cout << maxProfit(test3) << endl;  // Expected: 2 (buy at 2, sell at 4)

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

int maxProfit(vector<int>& prices) {

    // Track the minimum price seen so far (the cheapest "buy" opportunity)
    // INT_MAX = 2,147,483,647: ensures the very first price becomes minPrice
    int minPrice = INT_MAX;

    // Track the best profit we could have made
    // 0 means "don't trade at all" — we can always choose not to buy
    int maxProfit = 0;

    // Scan prices left to right (day by day)
    for (int p : prices) {

        // Update minimum price seen so far
        // min(a, b) returns the smaller of a and b
        minPrice = min(minPrice, p);

        // What profit could we make selling TODAY?
        // p - minPrice = today's price minus cheapest buy price (before today)
        // This is always valid because minPrice was recorded BEFORE current day
        maxProfit = max(maxProfit, p - minPrice);
    }

    // maxProfit is 0 if prices only decreased (no profitable trade exists)
    return maxProfit;
}

int main() {
    vector<int> prices = {7, 1, 5, 3, 6, 4};
    cout << maxProfit(prices) << endl;  // 5

    return 0;
}`,
              expectedOutput: `5
0
2`,
            },
          ],
          hints: [
            'Buy at the cheapest price seen so far.',
            'On each day, compute the profit if you sold today.',
            'You must buy before you sell — tracking minimum from the left handles this.',
          ],
          solution: `int maxProfit(vector<int>& prices) {
    int lo = INT_MAX, best = 0;
    for (int p : prices) { lo = min(lo, p); best = max(best, p - lo); }
    return best;
}`,
        },
        {
          id: 'rearrange-by-sign',
          slug: 'rearrange-by-sign',
          title: 'Rearrange Array Elements by Sign',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Two Pointers',
          conceptsRequired: ['arrays', 'two pointers'],
          leetcodeUrl: 'https://leetcode.com/problems/rearrange-array-elements-by-sign/',
          approaches: [
            {
              name: 'Separate and Interleave',
              intuition: 'Use two pointers (posIdx, negIdx) for even and odd positions in the result array. Positive numbers go to even indices (0,2,4,...), negatives to odd indices.',
              steps: [
                'Create result array of size n.',
                'posIdx = 0, negIdx = 1.',
                'For each x in nums:',
                '  If x > 0: result[posIdx] = x; posIdx += 2.',
                '  Else: result[negIdx] = x; negIdx += 2.',
                'Return result.',
              ],
              complexity: { time: 'O(N)', space: 'O(N)' },
              code: `vector<int> rearrangeArray(vector<int>& nums) {
    int n = nums.size();
    vector<int> res(n);
    int pos = 0, neg = 1;
    for (int x : nums) {
        if (x > 0) { res[pos] = x; pos += 2; }
        else { res[neg] = x; neg += 2; }
    }
    return res;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// Place positives at even indices (0,2,4,...) and negatives at odd indices (1,3,5,...)
// Array is guaranteed to have equal counts of positives and negatives
vector<int> rearrangeArray(vector<int>& nums) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {3, 1, -2, -5, 2, -4};
    vector<int> r1 = rearrangeArray(test1);
    for (int x : r1) cout << x << " ";
    cout << endl;  // Expected: 3 -2 1 -5 2 -4 (pos, neg alternating)

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

vector<int> rearrangeArray(vector<int>& nums) {

    int n = nums.size();

    // Create a result array of same size, initially all zeros
    // vector<int> res(n) creates a vector of n zeros
    vector<int> res(n);

    // pos = next available even index (for positives): 0, 2, 4, ...
    // neg = next available odd  index (for negatives): 1, 3, 5, ...
    int pos = 0;
    int neg = 1;

    // Scan through each element and place it at the right position
    for (int x : nums) {

        if (x > 0) {
            res[pos] = x;  // place positive at current even index
            pos += 2;      // advance to next even index (skip odd)
        } else {
            res[neg] = x;  // place negative at current odd index
            neg += 2;      // advance to next odd index (skip even)
        }
    }

    return res;  // res now alternates: positive, negative, positive, negative, ...
}

int main() {
    vector<int> nums = {3, 1, -2, -5, 2, -4};
    vector<int> res = rearrangeArray(nums);
    for (int x : res) cout << x << " ";
    cout << endl;

    return 0;
}`,
              expectedOutput: `3 -2 1 -5 2 -4 `,
            },
          ],
          hints: [
            'Equal counts of positives and negatives simplifies this: place positives at even indices, negatives at odd indices.',
            'Use two separate index pointers advancing by 2.',
            'This achieves O(N) time and O(N) space.',
          ],
          solution: `vector<int> rearrangeArray(vector<int>& nums) {
    int n = nums.size(); vector<int> res(n); int p = 0, q = 1;
    for (int x : nums) { if (x > 0) { res[p] = x; p += 2; } else { res[q] = x; q += 2; } }
    return res;
}`,
        },
        {
          id: 'next-permutation',
          slug: 'next-permutation',
          title: 'Next Permutation',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Array / Greedy',
          conceptsRequired: ['arrays', 'permutations'],
          leetcodeUrl: 'https://leetcode.com/problems/next-permutation/',
          approaches: [
            {
              name: 'STL-Equivalent 3-Step Algorithm',
              intuition: 'Find the rightmost "dip" (where arr[i] < arr[i+1]), swap it with the smallest element to its right that is still larger, then reverse the suffix to get the lexicographically smallest suffix.',
              steps: [
                'Find the largest index i such that nums[i] < nums[i+1]. If none, the array is the last permutation — reverse everything.',
                'Find the largest index j > i such that nums[j] > nums[i].',
                'Swap nums[i] and nums[j].',
                'Reverse the subarray from i+1 to end.',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `void nextPermutation(vector<int>& nums) {
    int n = nums.size(), i = n - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) i--;
    if (i >= 0) {
        int j = n - 1;
        while (nums[j] <= nums[i]) j--;
        swap(nums[i], nums[j]);
    }
    reverse(nums.begin() + i + 1, nums.end());
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// Next permutation: rearrange nums to the lexicographically next greater permutation
// If no greater permutation exists (already largest), rearrange to smallest (sorted)
void nextPermutation(vector<int>& nums) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {1, 2, 3};
    nextPermutation(test1);
    for (int x : test1) cout << x << " ";
    cout << endl;  // Expected: 1 3 2

    vector<int> test2 = {3, 2, 1};  // already largest
    nextPermutation(test2);
    for (int x : test2) cout << x << " ";
    cout << endl;  // Expected: 1 2 3 (wraps to smallest)

    vector<int> test3 = {1, 1, 5};
    nextPermutation(test3);
    for (int x : test3) cout << x << " ";
    cout << endl;  // Expected: 1 5 1

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

void nextPermutation(vector<int>& nums) {

    int n = nums.size();

    // STEP 1: Find the "pivot" — the rightmost position where nums[i] < nums[i+1]
    // This is the first position from the right that breaks descending order
    // Everything to the right of i is in DESCENDING order (already the largest arrangement)
    int i = n - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) {
        i--;  // scan left until we find a "dip"
    }

    // i == -1 means the array is already in descending order → it's the LAST permutation
    // Skip step 2 and just reverse everything to get the first (smallest) permutation
    if (i >= 0) {

        // STEP 2: Find the smallest element to the right of i that is still > nums[i]
        // Since the suffix is sorted in descending order, we scan from the right
        int j = n - 1;
        while (nums[j] <= nums[i]) {
            j--;  // find first element from right that is strictly greater than nums[i]
        }

        // Swap nums[i] with nums[j] to make the number just slightly larger
        swap(nums[i], nums[j]);
    }

    // STEP 3: Reverse the suffix starting at i+1
    // After the swap, suffix is still in descending order
    // Reversing it gives the SMALLEST possible suffix arrangement
    // This ensures we get the NEXT permutation (not a larger jump)
    reverse(nums.begin() + i + 1, nums.end());
}

int main() {
    vector<int> nums = {1, 2, 3};
    nextPermutation(nums);
    for (int x : nums) cout << x << " ";  // 1 3 2
    cout << endl;

    return 0;
}`,
              expectedOutput: `1 3 2
1 2 3
1 5 1 `,
            },
          ],
          hints: [
            'Scan from the right to find the first element that breaks descending order.',
            'Swap it with the smallest element to its right that is still greater.',
            'Reverse the suffix to get the smallest possible suffix arrangement.',
          ],
          solution: `void nextPermutation(vector<int>& nums) {
    int n = nums.size(), i = n - 2;
    while (i >= 0 && nums[i] >= nums[i+1]) i--;
    if (i >= 0) { int j = n-1; while (nums[j] <= nums[i]) j--; swap(nums[i], nums[j]); }
    reverse(nums.begin() + i + 1, nums.end());
}`,
        },
        {
          id: 'leaders-in-array',
          slug: 'leaders-in-array',
          title: 'Leaders in an Array',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Right-to-Left Scan',
          conceptsRequired: ['arrays'],
          approaches: [
            {
              name: 'Scan from Right',
              intuition: 'An element is a leader if it is greater than all elements to its right. Scan from right, tracking the running maximum. Each element that exceeds the running maximum is a leader.',
              steps: [
                'Start from the rightmost element (always a leader).',
                'Maintain maxRight = arr[n-1], result = {arr[n-1]}.',
                'For i from n-2 to 0:',
                '  If arr[i] >= maxRight: result.push_back(arr[i]); maxRight = arr[i].',
                'Reverse result and return.',
              ],
              complexity: { time: 'O(N)', space: 'O(1) extra' },
              code: `vector<int> leaders(vector<int>& arr) {
    int n = arr.size();
    vector<int> res;
    int maxRight = arr[n - 1];
    res.push_back(maxRight);
    for (int i = n - 2; i >= 0; i--) {
        if (arr[i] >= maxRight) {
            maxRight = arr[i];
            res.push_back(arr[i]);
        }
    }
    reverse(res.begin(), res.end());
    return res;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// A leader is an element greater than ALL elements to its right
// The rightmost element is always a leader (nothing to its right)
vector<int> leaders(vector<int>& arr) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {16, 17, 4, 3, 5, 2};
    vector<int> r1 = leaders(test1);
    for (int x : r1) cout << x << " ";
    cout << endl;  // Expected: 17 5 2

    vector<int> test2 = {1, 2, 3, 4, 5};
    vector<int> r2 = leaders(test2);
    for (int x : r2) cout << x << " ";
    cout << endl;  // Expected: 5

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

vector<int> leaders(vector<int>& arr) {

    int n = arr.size();
    vector<int> res;  // will hold leaders (added right-to-left initially)

    // Rightmost element is ALWAYS a leader — nothing to its right
    int maxRight = arr[n - 1];
    res.push_back(maxRight);

    // Scan from second-to-last going LEFT
    for (int i = n - 2; i >= 0; i--) {

        // arr[i] is a leader if it is >= maxRight
        // maxRight = maximum element seen so far from the right
        if (arr[i] >= maxRight) {
            maxRight = arr[i];      // arr[i] is now the new rightmost maximum
            res.push_back(arr[i]);  // it's a leader, add to result
        }
        // if arr[i] < maxRight → NOT a leader, skip
    }

    // We added leaders from right-to-left, so reverse to restore left-to-right order
    // reverse() modifies the vector in-place between .begin() and .end()
    reverse(res.begin(), res.end());

    return res;
}

int main() {
    vector<int> arr = {16, 17, 4, 3, 5, 2};
    vector<int> res = leaders(arr);
    for (int x : res) cout << x << " ";  // 17 5 2
    cout << endl;

    return 0;
}`,
              expectedOutput: `17 5 2
5 `,
            },
          ],
          hints: [
            'The rightmost element is always a leader.',
            'Scan from right to left, tracking the maximum seen so far.',
            'Any element greater than or equal to maxRight from its right is a leader.',
          ],
          solution: `vector<int> leaders(vector<int>& arr) {
    int n = arr.size(); vector<int> res; int mr = arr[n-1];
    res.push_back(mr);
    for (int i = n-2; i >= 0; i--) if (arr[i] >= mr) { mr = arr[i]; res.push_back(mr); }
    reverse(res.begin(), res.end());
    return res;
}`,
        },
        {
          id: 'longest-consecutive-sequence',
          slug: 'longest-consecutive-sequence',
          title: 'Longest Consecutive Sequence',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Hashing',
          conceptsRequired: ['arrays', 'hash set'],
          leetcodeUrl: 'https://leetcode.com/problems/longest-consecutive-sequence/',
          approaches: [
            {
              name: 'Hash Set with Sequence Start Detection',
              intuition: 'Insert all numbers into a set. For each number that has no left neighbor (x-1 not in set), try to extend the sequence rightward. This ensures each sequence is counted exactly once.',
              steps: [
                'Insert all elements into an unordered_set.',
                'For each x in the set, if x-1 is NOT in set (x is a sequence start):',
                '  Count consecutive: while x++ is in set, increment length.',
                '  Update maxLen.',
                'Return maxLen.',
              ],
              complexity: { time: 'O(N)', space: 'O(N)' },
              code: `int longestConsecutive(vector<int>& nums) {
    unordered_set<int> st(nums.begin(), nums.end());
    int maxLen = 0;
    for (int x : st) {
        if (!st.count(x - 1)) {
            int cur = x, len = 1;
            while (st.count(cur + 1)) { cur++; len++; }
            maxLen = max(maxLen, len);
        }
    }
    return maxLen;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// unordered_set<int> = hash set (O(1) lookup, no duplicates, no order)
// st.count(x) returns 1 if x is in set, 0 if not
int longestConsecutive(vector<int>& nums) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {100, 4, 200, 1, 3, 2};
    cout << longestConsecutive(test1) << endl;  // Expected: 4 (1,2,3,4)

    vector<int> test2 = {0, 3, 7, 2, 5, 8, 4, 6, 0, 1};
    cout << longestConsecutive(test2) << endl;  // Expected: 9 (0..8)

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

int longestConsecutive(vector<int>& nums) {

    // Insert ALL elements into a hash set for O(1) lookup
    // unordered_set automatically removes duplicates
    // Initializer: st(nums.begin(), nums.end()) copies the entire vector into the set
    unordered_set<int> st(nums.begin(), nums.end());

    int maxLen = 0;

    // For each number in the set, check if it could be the START of a sequence
    for (int x : st) {

        // A number x is a sequence start ONLY if (x-1) is NOT in the set
        // If x-1 exists, then x is in the MIDDLE of a sequence, not the start
        // We skip it to avoid redundant counting
        // !st.count(x-1) = "x-1 is NOT in the set"
        if (!st.count(x - 1)) {

            // x is a sequence start! Now extend rightward as far as possible
            int cur = x;   // current number in sequence
            int len = 1;   // length of current sequence (starting with x itself)

            // Keep extending: check if cur+1 exists in set
            while (st.count(cur + 1)) {
                cur++;   // move to next number
                len++;   // sequence gets longer
            }

            // Update maximum length
            maxLen = max(maxLen, len);
        }
    }

    return maxLen;
}

int main() {
    vector<int> nums = {100, 4, 200, 1, 3, 2};
    cout << longestConsecutive(nums) << endl;  // 4

    return 0;
}`,
              expectedOutput: `4
9`,
            },
          ],
          hints: [
            'Put all numbers in a hash set for O(1) lookup.',
            'Only start counting from a number that has no predecessor (x-1 not in set).',
            'This prevents re-counting from the middle of sequences, keeping the total work O(N).',
          ],
          solution: `int longestConsecutive(vector<int>& nums) {
    unordered_set<int> st(nums.begin(), nums.end()); int res = 0;
    for (int x : st) if (!st.count(x-1)) { int c = x, l = 1; while (st.count(++c)) l++; res = max(res, l); }
    return res;
}`,
        },
        {
          id: 'set-matrix-zeroes',
          slug: 'set-matrix-zeroes',
          title: 'Set Matrix Zeroes',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Matrix / In-place Marking',
          conceptsRequired: ['arrays', 'matrix', 'in-place'],
          leetcodeUrl: 'https://leetcode.com/problems/set-matrix-zeroes/',
          approaches: [
            {
              name: 'Use First Row and Column as Markers',
              intuition: 'Use the first row and first column of the matrix itself as markers for which rows/columns should be zeroed, avoiding extra space.',
              steps: [
                'Check if row 0 or col 0 originally contains a zero (store flags).',
                'For each (i,j) with i>0 and j>0: if matrix[i][j]==0, set matrix[i][0]=0 and matrix[0][j]=0.',
                'For each (i,j) with i>0 and j>0: if matrix[i][0]==0 or matrix[0][j]==0, set matrix[i][j]=0.',
                'Handle row 0 and col 0 separately using the stored flags.',
              ],
              complexity: { time: 'O(M*N)', space: 'O(1)' },
              code: `void setZeroes(vector<vector<int>>& matrix) {
    int m = matrix.size(), n = matrix[0].size();
    bool row0 = false, col0 = false;
    for (int j = 0; j < n; j++) if (matrix[0][j] == 0) row0 = true;
    for (int i = 0; i < m; i++) if (matrix[i][0] == 0) col0 = true;
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            if (matrix[i][j] == 0) { matrix[i][0] = 0; matrix[0][j] = 0; }
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            if (matrix[i][0] == 0 || matrix[0][j] == 0) matrix[i][j] = 0;
    if (row0) for (int j = 0; j < n; j++) matrix[0][j] = 0;
    if (col0) for (int i = 0; i < m; i++) matrix[i][0] = 0;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// vector<vector<int>>& = 2D matrix passed by reference (no copy, any changes affect original)
// Goal: if any cell is 0, set its entire row and column to 0 — in-place, O(1) extra space
void setZeroes(vector<vector<int>>& matrix) {
    // Write your solution here

}

int main() {
    vector<vector<int>> mat = {{1,1,1},{1,0,1},{1,1,1}};
    setZeroes(mat);
    for (auto& row : mat) {
        for (int x : row) cout << x << " ";
        cout << endl;
    }
    // Expected:
    // 1 0 1
    // 0 0 0
    // 1 0 1

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

void setZeroes(vector<vector<int>>& matrix) {

    int m = matrix.size();     // number of rows
    int n = matrix[0].size();  // number of columns

    // Flags to remember whether the FIRST ROW or FIRST COLUMN itself contains a 0
    // We need separate flags because we'll reuse them as markers
    bool row0 = false, col0 = false;

    // Check if first row has any 0
    for (int j = 0; j < n; j++) if (matrix[0][j] == 0) row0 = true;

    // Check if first column has any 0
    for (int i = 0; i < m; i++) if (matrix[i][0] == 0) col0 = true;

    // PASS 1: Use first row and first column as markers
    // For every 0 at (i,j) with i>0,j>0:
    //   mark matrix[i][0] = 0  (this row needs to be zeroed)
    //   mark matrix[0][j] = 0  (this column needs to be zeroed)
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            if (matrix[i][j] == 0) {
                matrix[i][0] = 0;  // row marker
                matrix[0][j] = 0;  // col marker
            }
        }
    }

    // PASS 2: Actually zero out cells (excluding first row and col)
    // If row marker is 0 OR col marker is 0 → zero this cell
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            if (matrix[i][0] == 0 || matrix[0][j] == 0) {
                matrix[i][j] = 0;
            }
        }
    }

    // Handle first row: if it originally had a 0, zero the entire first row
    if (row0) for (int j = 0; j < n; j++) matrix[0][j] = 0;

    // Handle first col: if it originally had a 0, zero the entire first column
    if (col0) for (int i = 0; i < m; i++) matrix[i][0] = 0;
}

int main() {
    vector<vector<int>> mat = {{1,1,1},{1,0,1},{1,1,1}};
    setZeroes(mat);
    for (auto& row : mat) {
        for (int x : row) cout << x << " ";
        cout << endl;
    }
    return 0;
}`,
              expectedOutput: `1 0 1
0 0 0
1 0 1 `,
            },
          ],
          hints: [
            'Naively scanning and zeroing simultaneously will wrongly zero elements.',
            'Use a two-pass approach: first mark which rows/columns need zeroing, then zero them.',
            'Use the first row and column as O(1) auxiliary space to avoid extra arrays.',
          ],
          solution: `void setZeroes(vector<vector<int>>& m) {
    int R = m.size(), C = m[0].size(); bool r0=false, c0=false;
    for (int j=0;j<C;j++) if(!m[0][j]) r0=true;
    for (int i=0;i<R;i++) if(!m[i][0]) c0=true;
    for (int i=1;i<R;i++) for (int j=1;j<C;j++) if(!m[i][j]){m[i][0]=0;m[0][j]=0;}
    for (int i=1;i<R;i++) for (int j=1;j<C;j++) if(!m[i][0]||!m[0][j]) m[i][j]=0;
    if(r0) for(int j=0;j<C;j++) m[0][j]=0;
    if(c0) for(int i=0;i<R;i++) m[i][0]=0;
}`,
        },
        {
          id: 'rotate-matrix-90',
          slug: 'rotate-matrix-90',
          title: 'Rotate Matrix by 90 Degrees',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Matrix / Transpose',
          conceptsRequired: ['arrays', 'matrix', 'in-place'],
          leetcodeUrl: 'https://leetcode.com/problems/rotate-image/',
          approaches: [
            {
              name: 'Transpose then Reverse Rows',
              intuition: 'A 90-degree clockwise rotation equals transposing the matrix (swap matrix[i][j] with matrix[j][i]) and then reversing each row.',
              steps: [
                'Transpose: for i in 0..n-1, for j in i+1..n-1: swap(matrix[i][j], matrix[j][i]).',
                'Reverse each row: for each row, call reverse(row.begin(), row.end()).',
              ],
              complexity: { time: 'O(N²)', space: 'O(1)' },
              code: `void rotate(vector<vector<int>>& matrix) {
    int n = matrix.size();
    // Transpose
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            swap(matrix[i][j], matrix[j][i]);
    // Reverse each row
    for (auto& row : matrix)
        reverse(row.begin(), row.end());
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// Rotate matrix 90 degrees clockwise in-place
// Trick: transpose (swap across diagonal) then reverse each row
void rotate(vector<vector<int>>& matrix) {
    // Write your solution here

}

int main() {
    vector<vector<int>> mat = {{1,2,3},{4,5,6},{7,8,9}};
    rotate(mat);
    for (auto& row : mat) {
        for (int x : row) cout << x << " ";
        cout << endl;
    }
    // Expected:
    // 7 4 1
    // 8 5 2
    // 9 6 3

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

void rotate(vector<vector<int>>& matrix) {

    int n = matrix.size();  // matrix is n×n (square)

    // STEP 1: Transpose — swap matrix[i][j] with matrix[j][i]
    // Only iterate over the UPPER TRIANGLE (j starts from i+1)
    // If we used j from 0..n, each pair would be swapped TWICE (back to original)
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            swap(matrix[i][j], matrix[j][i]);
            // swap() exchanges two values. Built-in from <algorithm>
        }
    }

    // STEP 2: Reverse each row
    // After transpose, reversing each row gives 90-degree clockwise rotation
    // auto& row means: row is a REFERENCE to each row vector (no copy made)
    for (auto& row : matrix) {
        reverse(row.begin(), row.end());
        // reverse() reverses elements between two iterators (pointers to start and end)
    }
}

int main() {
    vector<vector<int>> mat = {{1,2,3},{4,5,6},{7,8,9}};
    rotate(mat);
    for (auto& row : mat) {
        for (int x : row) cout << x << " ";
        cout << endl;
    }
    return 0;
}`,
              expectedOutput: `7 4 1
8 5 2
9 6 3 `,
            },
          ],
          hints: [
            'Clockwise 90 degrees = transpose + reverse each row.',
            'Counter-clockwise 90 degrees = transpose + reverse each column.',
            'Transpose only needs to iterate over the upper triangle (j > i) to avoid double-swapping.',
          ],
          solution: `void rotate(vector<vector<int>>& mat) {
    int n = mat.size();
    for (int i=0;i<n;i++) for (int j=i+1;j<n;j++) swap(mat[i][j],mat[j][i]);
    for (auto& row : mat) reverse(row.begin(), row.end());
}`,
        },
        {
          id: 'spiral-matrix',
          slug: 'spiral-matrix',
          title: 'Spiral Matrix',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Matrix / Simulation',
          conceptsRequired: ['arrays', 'matrix'],
          leetcodeUrl: 'https://leetcode.com/problems/spiral-matrix/',
          approaches: [
            {
              name: 'Layer Boundaries Simulation',
              intuition: 'Maintain four boundaries: top, bottom, left, right. Traverse the outermost layer in spiral order, then shrink the boundaries inward.',
              steps: [
                'Initialize top=0, bottom=m-1, left=0, right=n-1.',
                'While top <= bottom and left <= right:',
                '  Traverse left→right along top row; top++.',
                '  Traverse top→bottom along right col; right--.',
                '  If top <= bottom: traverse right→left along bottom row; bottom--.',
                '  If left <= right: traverse bottom→top along left col; left++.',
              ],
              complexity: { time: 'O(M*N)', space: 'O(1) extra' },
              code: `vector<int> spiralOrder(vector<vector<int>>& matrix) {
    vector<int> res;
    int top = 0, bottom = matrix.size()-1, left = 0, right = matrix[0].size()-1;
    while (top <= bottom && left <= right) {
        for (int j = left; j <= right; j++) res.push_back(matrix[top][j]); top++;
        for (int i = top; i <= bottom; i++) res.push_back(matrix[i][right]); right--;
        if (top <= bottom) { for (int j = right; j >= left; j--) res.push_back(matrix[bottom][j]); bottom--; }
        if (left <= right) { for (int i = bottom; i >= top; i--) res.push_back(matrix[i][left]); left++; }
    }
    return res;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// Traverse matrix in spiral order: right → down → left → up → repeat
// Use 4 boundary variables: top, bottom, left, right
vector<int> spiralOrder(vector<vector<int>>& matrix) {
    // Write your solution here

}

int main() {
    vector<vector<int>> mat = {{1,2,3},{4,5,6},{7,8,9}};
    vector<int> res = spiralOrder(mat);
    for (int x : res) cout << x << " ";
    cout << endl;  // Expected: 1 2 3 6 9 8 7 4 5

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

vector<int> spiralOrder(vector<vector<int>>& matrix) {

    vector<int> res;

    // 4 boundary pointers that shrink inward after each pass
    int top = 0;
    int bottom = matrix.size() - 1;     // last row index
    int left = 0;
    int right = matrix[0].size() - 1;   // last column index

    while (top <= bottom && left <= right) {

        // Move RIGHT across the top row
        for (int j = left; j <= right; j++) res.push_back(matrix[top][j]);
        top++;  // top row is done, shrink boundary inward

        // Move DOWN along the right column
        for (int i = top; i <= bottom; i++) res.push_back(matrix[i][right]);
        right--;  // right column is done, shrink boundary inward

        // Move LEFT across the bottom row (only if there's still a bottom row)
        if (top <= bottom) {
            for (int j = right; j >= left; j--) res.push_back(matrix[bottom][j]);
            bottom--;  // bottom row is done, shrink boundary inward
        }

        // Move UP along the left column (only if there's still a left column)
        if (left <= right) {
            for (int i = bottom; i >= top; i--) res.push_back(matrix[i][left]);
            left++;  // left column is done, shrink boundary inward
        }
    }

    return res;
}

int main() {
    vector<vector<int>> mat = {{1,2,3},{4,5,6},{7,8,9}};
    vector<int> res = spiralOrder(mat);
    for (int x : res) cout << x << " ";  // 1 2 3 6 9 8 7 4 5
    cout << endl;
    return 0;
}`,
              expectedOutput: `1 2 3 6 9 8 7 4 5 `,
            },
          ],
          hints: [
            'Use four boundary variables: top, bottom, left, right.',
            'After each directional pass, shrink the corresponding boundary.',
            'Always check boundary conditions before traversing bottom and left passes to handle non-square matrices.',
          ],
          solution: `vector<int> spiralOrder(vector<vector<int>>& mat) {
    vector<int> res; int t=0,b=mat.size()-1,l=0,r=mat[0].size()-1;
    while(t<=b&&l<=r){
        for(int j=l;j<=r;j++) res.push_back(mat[t][j]); t++;
        for(int i=t;i<=b;i++) res.push_back(mat[i][r]); r--;
        if(t<=b){for(int j=r;j>=l;j--) res.push_back(mat[b][j]); b--;}
        if(l<=r){for(int i=b;i>=t;i--) res.push_back(mat[i][l]); l++;}
    }
    return res;
}`,
        },
        {
          id: 'count-subarrays-sum',
          slug: 'count-subarrays-sum',
          title: 'Count Subarrays with Given Sum',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Prefix Sum + Hashing',
          conceptsRequired: ['arrays', 'prefix sum', 'hash map'],
          leetcodeUrl: 'https://leetcode.com/problems/subarray-sum-equals-k/',
          approaches: [
            {
              name: 'Prefix Sum with Frequency Map',
              intuition: 'If prefixSum[j] - prefixSum[i] = k, then subarray [i+1..j] sums to k. Count how many previous prefix sums equal (currentPrefixSum - k).',
              steps: [
                'Map: prefixCount = {0: 1}.',
                'prefixSum = 0, count = 0.',
                'For each x in nums:',
                '  prefixSum += x.',
                '  count += prefixCount[prefixSum - k].',
                '  prefixCount[prefixSum]++.',
                'Return count.',
              ],
              complexity: { time: 'O(N)', space: 'O(N)' },
              code: `int subarraySum(vector<int>& nums, int k) {
    unordered_map<int,int> mp;
    mp[0] = 1;
    int ps = 0, count = 0;
    for (int x : nums) {
        ps += x;
        count += mp[ps - k];
        mp[ps]++;
    }
    return count;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// mp[prefixSum] = how many times this prefix sum has occurred
// If prefixSum - k was seen before, those previous positions form subarrays with sum k
int subarraySum(vector<int>& nums, int k) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {1, 1, 1};
    cout << subarraySum(test1, 2) << endl;  // Expected: 2 ([1,1] at start, [1,1] at end)

    vector<int> test2 = {1, 2, 3};
    cout << subarraySum(test2, 3) << endl;  // Expected: 2 ([3] and [1,2])

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

int subarraySum(vector<int>& nums, int k) {

    // mp stores: prefix_sum → how many times this prefix sum has appeared
    unordered_map<int, int> mp;

    // Initialize: prefix sum of 0 has appeared 1 time (before the array starts)
    // This handles subarrays starting from index 0
    // e.g., if ps[3] = k, then subarray [0..3] has sum k
    //        ps[3] - k = 0, which appeared 1 time → count += 1 ✓
    mp[0] = 1;

    int ps = 0;      // running prefix sum
    int count = 0;   // number of subarrays with sum exactly k

    for (int x : nums) {

        ps += x;  // extend prefix sum by current element

        // KEY INSIGHT: if (ps - k) was seen before at index j,
        // then subarray (j+1..current) has sum = ps - (ps-k) = k
        // mp[ps - k] = how many such subarrays end here
        // mp[ps - k] returns 0 if key doesn't exist (default for int in map)
        count += mp[ps - k];

        // Record current prefix sum (increment its count)
        // We add AFTER checking to avoid using the current index as both endpoints
        mp[ps]++;
    }

    return count;
}

int main() {
    vector<int> nums = {1, 1, 1};
    cout << subarraySum(nums, 2) << endl;  // 2

    return 0;
}`,
              expectedOutput: `2
2`,
            },
          ],
          hints: [
            'Use prefix sums and a frequency map.',
            'Initialize the map with {0:1} to handle subarrays starting from index 0.',
            'For each new prefix sum, add the frequency of (prefixSum - k) to the answer.',
          ],
          solution: `int subarraySum(vector<int>& nums, int k) {
    unordered_map<int,int> mp; mp[0]=1; int ps=0,cnt=0;
    for (int x:nums){ps+=x;cnt+=mp[ps-k];mp[ps]++;}
    return cnt;
}`,
        },
      ],
    },
    {
      id: 'hard-array-problems',
      title: 'Hard Array Problems',
      topics: [
        {
          id: 'pascals-triangle',
          slug: 'pascals-triangle',
          title: "Pascal's Triangle",
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Math / DP',
          conceptsRequired: ['arrays', 'combinatorics'],
          leetcodeUrl: 'https://leetcode.com/problems/pascals-triangle/',
          approaches: [
            {
              name: 'Row-by-Row Construction',
              intuition: "Each row is built from the previous: element[j] = prev[j-1] + prev[j]. Edges are always 1.",
              steps: [
                'Start with [[1]].',
                'For each new row r from 1 to numRows-1:',
                '  Build row starting and ending with 1.',
                '  For j from 1 to r-1: row[j] = prev[j-1] + prev[j].',
                '  Append row to result.',
              ],
              complexity: { time: 'O(N²)', space: 'O(N²)' },
              code: `vector<vector<int>> generate(int numRows) {
    vector<vector<int>> res = {{1}};
    for (int i = 1; i < numRows; i++) {
        vector<int> row = {1};
        for (int j = 1; j < i; j++)
            row.push_back(res[i-1][j-1] + res[i-1][j]);
        row.push_back(1);
        res.push_back(row);
    }
    return res;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// Pascal's Triangle: each element = sum of the two elements above it
// Every row starts and ends with 1
// vector<vector<int>> = a 2D array (vector of vectors)
vector<vector<int>> generate(int numRows) {
    // Write your solution here

}

int main() {
    vector<vector<int>> res = generate(5);
    for (auto& row : res) {
        for (int x : row) cout << x << " ";
        cout << endl;
    }
    // Expected:
    // 1
    // 1 1
    // 1 2 1
    // 1 3 3 1
    // 1 4 6 4 1

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> generate(int numRows) {

    // Start with the first row: just [1]
    // {{1}} is an initializer list creating a 2D vector with one row [1]
    vector<vector<int>> res = {{1}};

    // Build each row from row 1 onwards (row 0 is already in res)
    for (int i = 1; i < numRows; i++) {

        // Every row starts with 1
        vector<int> row = {1};

        // Fill interior elements (positions 1 to i-1)
        // Interior element j = prev_row[j-1] + prev_row[j]
        for (int j = 1; j < i; j++) {
            // res[i-1] = previous row
            // res[i-1][j-1] = element to the upper-left
            // res[i-1][j]   = element to the upper-right
            row.push_back(res[i-1][j-1] + res[i-1][j]);
        }

        // Every row ends with 1
        row.push_back(1);

        // Append this row to result
        res.push_back(row);
    }

    return res;
}

int main() {
    auto res = generate(5);
    for (auto& row : res) {
        for (int x : row) cout << x << " ";
        cout << endl;
    }
    return 0;
}`,
              expectedOutput: `1
1 1
1 2 1
1 3 3 1
1 4 6 4 1 `,
            },
          ],
          hints: [
            'Each interior element is the sum of the two elements directly above it.',
            'Every row begins and ends with 1.',
            'To get just the Nth row efficiently, use C(n,0), C(n,1), ..., C(n,n) with the multiplicative formula.',
          ],
          solution: `vector<vector<int>> generate(int n) {
    vector<vector<int>> res={{1}};
    for(int i=1;i<n;i++){
        vector<int> row={1};
        for(int j=1;j<i;j++) row.push_back(res[i-1][j-1]+res[i-1][j]);
        row.push_back(1); res.push_back(row);
    }
    return res;
}`,
        },
        {
          id: 'majority-element-2',
          slug: 'majority-element-2',
          title: 'Majority Element II (> N/3 times)',
          type: 'problem',
          difficulty: 'medium',
          pattern: "Boyer-Moore Voting (Extended)",
          conceptsRequired: ['arrays', 'voting algorithm'],
          leetcodeUrl: 'https://leetcode.com/problems/majority-element-ii/',
          approaches: [
            {
              name: "Extended Boyer-Moore Voting",
              intuition: 'There can be at most 2 elements appearing more than N/3 times. Use two candidates with two counters. Run a second verification pass to confirm both candidates.',
              steps: [
                'Maintain candidate1, candidate2, count1=0, count2=0.',
                'For each x: if x==cand1 count1++, else if x==cand2 count2++, else if count1==0 cand1=x,count1=1, else if count2==0 cand2=x,count2=1, else count1--,count2--.',
                'Verification pass: count actual occurrences of cand1 and cand2.',
                'Add to result if count > n/3.',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `vector<int> majorityElement(vector<int>& nums) {
    int c1 = 0, c2 = 0, cand1 = INT_MIN, cand2 = INT_MIN;
    for (int x : nums) {
        if (x == cand1) c1++;
        else if (x == cand2) c2++;
        else if (c1 == 0) { cand1 = x; c1 = 1; }
        else if (c2 == 0) { cand2 = x; c2 = 1; }
        else { c1--; c2--; }
    }
    c1 = c2 = 0;
    for (int x : nums) { if (x == cand1) c1++; else if (x == cand2) c2++; }
    vector<int> res;
    int n = nums.size();
    if (c1 > n/3) res.push_back(cand1);
    if (c2 > n/3) res.push_back(cand2);
    return res;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// Find ALL elements appearing more than n/3 times
// At most 2 such elements can exist (since 3 * (n/3+1) > n)
// INT_MIN = -2147483648 = smallest possible int, used as "no candidate yet"
vector<int> majorityElement(vector<int>& nums) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {3, 2, 3};
    vector<int> r1 = majorityElement(test1);
    for (int x : r1) cout << x << " ";
    cout << endl;  // Expected: 3

    vector<int> test2 = {1, 1, 1, 3, 3, 2, 2, 2};
    vector<int> r2 = majorityElement(test2);
    for (int x : r2) cout << x << " ";
    cout << endl;  // Expected: 1 2 (both appear >2 times in array of size 8)

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

vector<int> majorityElement(vector<int>& nums) {

    // Two candidate tracking — extended Boyer-Moore Voting
    // INT_MIN used as sentinel "no candidate set yet" (smallest int value)
    int c1 = 0, c2 = 0;
    int cand1 = INT_MIN, cand2 = INT_MIN;

    // PASS 1: Find the two potential majority candidates
    for (int x : nums) {
        if (x == cand1)       c1++;          // x matches candidate 1 → boost its count
        else if (x == cand2)  c2++;          // x matches candidate 2 → boost its count
        else if (c1 == 0) { cand1 = x; c1 = 1; }   // slot 1 is empty → assign x
        else if (c2 == 0) { cand2 = x; c2 = 1; }   // slot 2 is empty → assign x
        else { c1--; c2--; }  // x is a different element → cancel one count from each
    }

    // PASS 2: Verify — the first pass only FINDS candidates, not confirms them
    // Re-count how many times each candidate actually appears
    c1 = c2 = 0;
    for (int x : nums) {
        if (x == cand1) c1++;
        else if (x == cand2) c2++;
    }

    vector<int> res;
    int n = nums.size();

    // Only include if count is strictly greater than n/3
    if (c1 > n / 3) res.push_back(cand1);
    if (c2 > n / 3) res.push_back(cand2);

    return res;
}

int main() {
    vector<int> nums = {1, 1, 1, 3, 3, 2, 2, 2};
    auto res = majorityElement(nums);
    for (int x : res) cout << x << " ";  // 1 2
    cout << endl;
    return 0;
}`,
              expectedOutput: `3
1 2 `,
            },
          ],
          hints: [
            'At most 2 elements can appear more than N/3 times.',
            'Use two Boyer-Moore candidates simultaneously.',
            'Always verify candidates in a second pass — the first pass only finds potential candidates.',
          ],
          solution: `vector<int> majorityElement(vector<int>& nums) {
    int c1=0,c2=0,x1=INT_MIN,x2=INT_MIN;
    for(int x:nums){if(x==x1)c1++;else if(x==x2)c2++;else if(!c1){x1=x;c1=1;}else if(!c2){x2=x;c2=1;}else{c1--;c2--;}}
    c1=c2=0; for(int x:nums){if(x==x1)c1++;else if(x==x2)c2++;}
    vector<int> res; int n=nums.size(); if(c1>n/3)res.push_back(x1); if(c2>n/3)res.push_back(x2); return res;
}`,
        },
        {
          id: 'three-sum',
          slug: 'three-sum',
          title: '3Sum — Find All Triplets Summing to Zero',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Sort + Two Pointers',
          conceptsRequired: ['arrays', 'sorting', 'two pointers'],
          leetcodeUrl: 'https://leetcode.com/problems/3sum/',
          approaches: [
            {
              name: 'Sort + Two Pointer',
              intuition: 'Sort the array. Fix one element and use two pointers on the remaining portion to find pairs summing to -nums[i]. Skip duplicates to avoid repeated triplets.',
              steps: [
                'Sort nums.',
                'For i from 0 to n-3 (skip duplicates: if i>0 && nums[i]==nums[i-1] continue):',
                '  lo = i+1, hi = n-1.',
                '  While lo < hi:',
                '    sum = nums[i] + nums[lo] + nums[hi].',
                '    If sum == 0: add triplet, skip duplicates for lo and hi, advance both.',
                '    If sum < 0: lo++. If sum > 0: hi--.',
              ],
              complexity: { time: 'O(N²)', space: 'O(1) extra' },
              code: `vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> res;
    int n = nums.size();
    for (int i = 0; i < n - 2; i++) {
        if (i > 0 && nums[i] == nums[i-1]) continue;
        int lo = i + 1, hi = n - 1;
        while (lo < hi) {
            int s = nums[i] + nums[lo] + nums[hi];
            if (s == 0) {
                res.push_back({nums[i], nums[lo], nums[hi]});
                while (lo < hi && nums[lo] == nums[lo+1]) lo++;
                while (lo < hi && nums[hi] == nums[hi-1]) hi--;
                lo++; hi--;
            } else if (s < 0) lo++;
            else hi--;
        }
    }
    return res;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// Find all unique triplets [a, b, c] where a + b + c = 0
// sort() first, then fix one element and use two pointers for the rest
// vector<vector<int>> = 2D array (list of triplets)
vector<vector<int>> threeSum(vector<int>& nums) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {-1, 0, 1, 2, -1, -4};
    vector<vector<int>> r1 = threeSum(test1);
    for (auto& t : r1) cout << t[0] << " " << t[1] << " " << t[2] << endl;
    // Expected: -1 -1 2 and -1 0 1

    cout << "---" << endl;
    vector<int> test2 = {0, 0, 0};
    vector<vector<int>> r2 = threeSum(test2);
    for (auto& t : r2) cout << t[0] << " " << t[1] << " " << t[2] << endl;
    // Expected: 0 0 0

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> threeSum(vector<int>& nums) {

    // Sort so duplicates are adjacent and two-pointer works correctly
    sort(nums.begin(), nums.end());

    vector<vector<int>> res;  // result: list of triplets
    int n = nums.size();

    // Fix the first element of the triplet
    for (int i = 0; i < n - 2; i++) {

        // Skip duplicate values for i (avoid duplicate triplets)
        // Only skip when i > 0 (first occurrence is always considered)
        if (i > 0 && nums[i] == nums[i - 1]) continue;

        // Two-pointer search for the other two elements
        int lo = i + 1;   // left pointer: just after i
        int hi = n - 1;   // right pointer: end of array

        while (lo < hi) {
            int s = nums[i] + nums[lo] + nums[hi];  // sum of 3 elements

            if (s == 0) {
                // Found a valid triplet — add it to result
                // {a, b, c} creates a vector<int> inline
                res.push_back({nums[i], nums[lo], nums[hi]});

                // Skip duplicates for lo (skip consecutive equal values)
                while (lo < hi && nums[lo] == nums[lo + 1]) lo++;

                // Skip duplicates for hi (skip consecutive equal values)
                while (lo < hi && nums[hi] == nums[hi - 1]) hi--;

                // Move both pointers inward to find next triplet
                lo++;
                hi--;

            } else if (s < 0) {
                lo++;  // sum too small → move left pointer right to increase sum

            } else {
                hi--;  // sum too big → move right pointer left to decrease sum
            }
        }
    }

    return res;
}

int main() {
    vector<int> nums = {-1, 0, 1, 2, -1, -4};
    auto res = threeSum(nums);
    for (auto& t : res) cout << t[0] << " " << t[1] << " " << t[2] << endl;
    return 0;
}`,
              expectedOutput: `-1 -1 2
-1 0 1
---
0 0 0`,
            },
          ],
          hints: [
            'Sort first; it makes duplicate skipping and two-pointer both work.',
            'Fix the first element and apply two-sum with two pointers on the rest.',
            'Skip duplicates at all three levels (i, lo, hi) to avoid repeat triplets.',
          ],
          solution: `vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(),nums.end()); vector<vector<int>> res; int n=nums.size();
    for(int i=0;i<n-2;i++){
        if(i&&nums[i]==nums[i-1])continue;
        int l=i+1,r=n-1;
        while(l<r){int s=nums[i]+nums[l]+nums[r];if(!s){res.push_back({nums[i],nums[l],nums[r]});while(l<r&&nums[l]==nums[l+1])l++;while(l<r&&nums[r]==nums[r-1])r--;l++;r--;}else if(s<0)l++;else r--;}
    }
    return res;
}`,
        },
        {
          id: 'four-sum',
          slug: 'four-sum',
          title: '4Sum — Find All Quadruplets',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Sort + Two Pointers',
          conceptsRequired: ['arrays', 'sorting', 'two pointers'],
          leetcodeUrl: 'https://leetcode.com/problems/4sum/',
          approaches: [
            {
              name: 'Sort + Nested Two Pointers',
              intuition: 'Extend 3Sum. Fix two elements with nested loops (i, j), then apply two-pointer search on the remaining portion. Careful duplicate skipping at all levels.',
              steps: [
                'Sort nums.',
                'For i from 0 to n-3:',
                '  Skip duplicate i. For j from i+1 to n-2:',
                '    Skip duplicate j. lo = j+1, hi = n-1.',
                '    While lo < hi: compute sum. Handle == target (add, skip dups, advance), < target (lo++), > target (hi--).',
              ],
              complexity: { time: 'O(N³)', space: 'O(1) extra' },
              code: `vector<vector<int>> fourSum(vector<int>& nums, int target) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> res; int n = nums.size();
    for (int i = 0; i < n-3; i++) {
        if (i && nums[i] == nums[i-1]) continue;
        for (int j = i+1; j < n-2; j++) {
            if (j > i+1 && nums[j] == nums[j-1]) continue;
            int lo = j+1, hi = n-1;
            while (lo < hi) {
                long long s = (long long)nums[i]+nums[j]+nums[lo]+nums[hi];
                if (s == target) {
                    res.push_back({nums[i],nums[j],nums[lo],nums[hi]});
                    while (lo<hi && nums[lo]==nums[lo+1]) lo++;
                    while (lo<hi && nums[hi]==nums[hi-1]) hi--;
                    lo++; hi--;
                } else if (s < target) lo++;
                else hi--;
            }
        }
    }
    return res;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// Find all unique quadruplets [a,b,c,d] where a+b+c+d == target
// long long = 64-bit integer (larger range than int, avoids overflow for large values)
vector<vector<int>> fourSum(vector<int>& nums, int target) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {1, 0, -1, 0, -2, 2};
    vector<vector<int>> r1 = fourSum(test1, 0);
    for (auto& q : r1) cout << q[0]<<" "<<q[1]<<" "<<q[2]<<" "<<q[3] << endl;
    // Expected: -2 -1 1 2 and -2 0 0 2 and -1 0 0 1

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> fourSum(vector<int>& nums, int target) {

    // Sort so duplicates are adjacent, enabling skip and two-pointer
    sort(nums.begin(), nums.end());

    vector<vector<int>> res;
    int n = nums.size();

    // Fix first element with outer loop
    for (int i = 0; i < n - 3; i++) {

        // Skip duplicate first elements
        if (i && nums[i] == nums[i - 1]) continue;

        // Fix second element with inner loop
        for (int j = i + 1; j < n - 2; j++) {

            // Skip duplicate second elements (but only from the second occurrence)
            // j > i+1 means we're past the first pick for this j slot
            if (j > i + 1 && nums[j] == nums[j - 1]) continue;

            // Two pointers for third and fourth elements
            int lo = j + 1;
            int hi = n - 1;

            while (lo < hi) {
                // Use long long to avoid overflow: (long long)nums[i] casts first element to 64-bit
                // Without this, four large ints might overflow 32-bit int
                long long s = (long long)nums[i] + nums[j] + nums[lo] + nums[hi];

                if (s == target) {
                    res.push_back({nums[i], nums[j], nums[lo], nums[hi]});
                    // Skip duplicates for lo and hi
                    while (lo < hi && nums[lo] == nums[lo + 1]) lo++;
                    while (lo < hi && nums[hi] == nums[hi - 1]) hi--;
                    lo++;
                    hi--;
                } else if (s < target) {
                    lo++;  // sum too small → increase lo
                } else {
                    hi--;  // sum too large → decrease hi
                }
            }
        }
    }

    return res;
}

int main() {
    vector<int> nums = {1, 0, -1, 0, -2, 2};
    auto res = fourSum(nums, 0);
    for (auto& q : res) cout << q[0]<<" "<<q[1]<<" "<<q[2]<<" "<<q[3] << endl;
    return 0;
}`,
              expectedOutput: `-2 -1 1 2
-2 0 0 2
-1 0 0 1`,
            },
          ],
          hints: [
            'Sort the array first, then use a nested loop for the first two elements.',
            'Use two pointers for the last two elements inside the nested loops.',
            'Use long long for the sum to avoid integer overflow with large values.',
          ],
          solution: `vector<vector<int>> fourSum(vector<int>& nums, int t) {
    sort(nums.begin(),nums.end()); vector<vector<int>> res; int n=nums.size();
    for(int i=0;i<n-3;i++){if(i&&nums[i]==nums[i-1])continue;for(int j=i+1;j<n-2;j++){if(j>i+1&&nums[j]==nums[j-1])continue;int l=j+1,r=n-1;while(l<r){long long s=(long long)nums[i]+nums[j]+nums[l]+nums[r];if(s==t){res.push_back({nums[i],nums[j],nums[l],nums[r]});while(l<r&&nums[l]==nums[l+1])l++;while(l<r&&nums[r]==nums[r-1])r--;l++;r--;}else if(s<t)l++;else r--;}}}return res;
}`,
        },
        {
          id: 'largest-subarray-sum-zero',
          slug: 'largest-subarray-sum-zero',
          title: 'Largest Subarray with Sum 0',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Prefix Sum + Hashing',
          conceptsRequired: ['arrays', 'prefix sum', 'hash map'],
          approaches: [
            {
              name: 'Prefix Sum First Occurrence',
              intuition: 'If prefix[j] == prefix[i], the subarray (i+1..j) has sum 0. Store the first occurrence of each prefix sum and compute the maximum span.',
              steps: [
                'Map prefixIndex = {0: -1}.',
                'prefixSum = 0, maxLen = 0.',
                'For each i: prefixSum += arr[i]. If in map: maxLen = max(maxLen, i - map[prefixSum]). Else: map[prefixSum] = i.',
                'Return maxLen.',
              ],
              complexity: { time: 'O(N)', space: 'O(N)' },
              code: `int maxLenZeroSum(vector<int>& arr) {
    unordered_map<int,int> mp;
    mp[0] = -1;
    int ps = 0, maxLen = 0;
    for (int i = 0; i < arr.size(); i++) {
        ps += arr[i];
        if (mp.count(ps)) maxLen = max(maxLen, i - mp[ps]);
        else mp[ps] = i;
    }
    return maxLen;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// Find length of longest subarray with sum exactly 0
// Key insight: if prefix[j] == prefix[i], then sum of arr[i+1..j] == 0
// mp[sum] = FIRST index where this sum occurred (to maximize length)
int maxLenZeroSum(vector<int>& arr) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {15, -2, 2, -8, 1, 7, 10, 23};
    cout << maxLenZeroSum(test1) << endl;  // Expected: 5 (from index 1 to 5: -2,2,-8,1,7)

    vector<int> test2 = {1, 2, 3};
    cout << maxLenZeroSum(test2) << endl;  // Expected: 0 (no subarray sums to 0)

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

int maxLenZeroSum(vector<int>& arr) {

    // mp maps: prefix_sum → first index where this sum was seen
    unordered_map<int, int> mp;

    // Initialize: sum 0 was "seen" at index -1 (before array starts)
    // This handles subarrays from index 0 (e.g., arr[0..j] has sum 0)
    mp[0] = -1;

    int ps = 0;       // running prefix sum
    int maxLen = 0;   // answer

    for (int i = 0; i < (int)arr.size(); i++) {

        ps += arr[i];  // extend prefix sum to index i

        // If ps was seen before at index mp[ps],
        // then subarray (mp[ps]+1 .. i) has sum = ps - ps = 0
        // Its length = i - mp[ps]
        if (mp.count(ps)) {
            maxLen = max(maxLen, i - mp[ps]);
            // Do NOT update mp[ps] — we want the FIRST occurrence to maximize length
        } else {
            // First time seeing this prefix sum — record its index
            mp[ps] = i;
        }
    }

    return maxLen;
}

int main() {
    vector<int> arr = {15, -2, 2, -8, 1, 7, 10, 23};
    cout << maxLenZeroSum(arr) << endl;  // 5
    return 0;
}`,
              expectedOutput: `5
0`,
            },
          ],
          hints: [
            'Same prefix sum at two indices means sum-zero subarray between them.',
            'Store only the FIRST occurrence to maximize subarray length.',
            'Initialize map with {0: -1} to handle subarrays from index 0.',
          ],
          solution: `int maxLenZeroSum(vector<int>& arr) {
    unordered_map<int,int> mp; mp[0]=-1; int ps=0,res=0;
    for(int i=0;i<(int)arr.size();i++){ps+=arr[i];if(mp.count(ps))res=max(res,i-mp[ps]);else mp[ps]=i;}
    return res;
}`,
        },
        {
          id: 'count-subarrays-xor-k',
          slug: 'count-subarrays-xor-k',
          title: 'Count Subarrays with XOR = K',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Prefix XOR + Hashing',
          conceptsRequired: ['arrays', 'prefix XOR', 'hash map', 'bit manipulation'],
          approaches: [
            {
              name: 'Prefix XOR Frequency Map',
              intuition: 'Analogous to subarray sum = k but with XOR. If prefixXOR[j] ^ prefixXOR[i] == k, then XOR of subarray [i+1..j] == k. Use a XOR property: prefixXOR[i] = prefixXOR[j] ^ k.',
              steps: [
                'Map xorCount = {0: 1}.',
                'prefixXOR = 0, count = 0.',
                'For each x: prefixXOR ^= x. count += xorCount[prefixXOR ^ k]. xorCount[prefixXOR]++.',
                'Return count.',
              ],
              complexity: { time: 'O(N)', space: 'O(N)' },
              code: `int countSubarraysXorK(vector<int>& arr, int k) {
    unordered_map<int,int> mp;
    mp[0] = 1;
    int prefXOR = 0, count = 0;
    for (int x : arr) {
        prefXOR ^= x;
        count += mp[prefXOR ^ k];
        mp[prefXOR]++;
    }
    return count;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// Count subarrays whose XOR equals k
// XOR property: a ^ b = c implies a = b ^ c and b = a ^ c
// prefXOR[j] ^ prefXOR[i] = k implies prefXOR[i] = prefXOR[j] ^ k
int countSubarraysXorK(vector<int>& arr, int k) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {4, 2, 2, 6, 4};
    cout << countSubarraysXorK(test1, 6) << endl;  // Expected: 4

    vector<int> test2 = {5, 6, 7, 8, 9};
    cout << countSubarraysXorK(test2, 5) << endl;  // Expected: 2

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

int countSubarraysXorK(vector<int>& arr, int k) {

    // mp maps: prefix_XOR → how many times it has appeared
    unordered_map<int, int> mp;

    // XOR of empty prefix = 0, appears 1 time (before array starts)
    // Handles subarrays starting from index 0
    mp[0] = 1;

    int prefXOR = 0;  // running prefix XOR (XOR of arr[0..i])
    int count = 0;    // answer

    for (int x : arr) {

        prefXOR ^= x;  // extend prefix XOR: ^= means XOR-assign (prefXOR = prefXOR ^ x)

        // If we want subarray XOR to equal k:
        // prefXOR[j] ^ prefXOR[i] = k
        // So prefXOR[i] = prefXOR[j] ^ k (XOR both sides by k)
        // Count how many previous prefix XORs equal (prefXOR ^ k)
        count += mp[prefXOR ^ k];  // mp[key] returns 0 if key not in map

        // Record this prefix XOR
        mp[prefXOR]++;
    }

    return count;
}

int main() {
    vector<int> arr = {4, 2, 2, 6, 4};
    cout << countSubarraysXorK(arr, 6) << endl;  // 4
    return 0;
}`,
              expectedOutput: `4
2`,
            },
          ],
          hints: [
            'Prefix XOR works just like prefix sum, but with ^ instead of +.',
            'Subarray [i+1..j] has XOR k iff prefixXOR[j] ^ prefixXOR[i] == k, i.e., prefixXOR[i] == prefixXOR[j] ^ k.',
            'Initialize the map with {0:1} to count subarrays starting from index 0.',
          ],
          solution: `int countXorK(vector<int>& arr, int k) {
    unordered_map<int,int> mp; mp[0]=1; int px=0,cnt=0;
    for(int x:arr){px^=x;cnt+=mp[px^k];mp[px]++;}
    return cnt;
}`,
        },
        {
          id: 'merge-overlapping-intervals',
          slug: 'merge-overlapping-intervals',
          title: 'Merge Overlapping Intervals',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Sorting + Greedy',
          conceptsRequired: ['arrays', 'sorting', 'intervals'],
          leetcodeUrl: 'https://leetcode.com/problems/merge-intervals/',
          approaches: [
            {
              name: 'Sort by Start, Greedy Merge',
              intuition: 'After sorting by start time, intervals that can be merged are always adjacent. Walk through and greedily extend the current interval or start a new one.',
              steps: [
                'Sort intervals by start time.',
                'Initialize result with intervals[0].',
                'For each subsequent interval [s, e]:',
                '  If s <= result.back()[1]: merge by updating end = max(end, e).',
                '  Else: push new interval.',
                'Return result.',
              ],
              complexity: { time: 'O(N log N)', space: 'O(N)' },
              code: `vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> res = {intervals[0]};
    for (int i = 1; i < intervals.size(); i++) {
        if (intervals[i][0] <= res.back()[1])
            res.back()[1] = max(res.back()[1], intervals[i][1]);
        else res.push_back(intervals[i]);
    }
    return res;
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// Merge overlapping intervals and return non-overlapping result
// res.back() = the LAST element in the result vector
// res.back()[1] = the END of the last interval
vector<vector<int>> merge(vector<vector<int>>& intervals) {
    // Write your solution here

}

int main() {
    vector<vector<int>> test1 = {{1,3},{2,6},{8,10},{15,18}};
    vector<vector<int>> r1 = merge(test1);
    for (auto& iv : r1) cout << "[" << iv[0] << "," << iv[1] << "] ";
    cout << endl;  // Expected: [1,6] [8,10] [15,18]

    vector<vector<int>> test2 = {{1,4},{4,5}};
    vector<vector<int>> r2 = merge(test2);
    for (auto& iv : r2) cout << "[" << iv[0] << "," << iv[1] << "] ";
    cout << endl;  // Expected: [1,5]

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> merge(vector<vector<int>>& intervals) {

    // Sort by start time: overlapping intervals will now be adjacent
    // sort() with no comparator sorts vectors lexicographically (by first element first)
    sort(intervals.begin(), intervals.end());

    // Initialize result with the first interval
    vector<vector<int>> res = {intervals[0]};

    for (int i = 1; i < (int)intervals.size(); i++) {

        // res.back() = the LAST interval currently in our result
        // res.back()[0] = its start, res.back()[1] = its end

        // Current interval starts BEFORE or AT the end of the last merged interval
        // → They OVERLAP, so merge them
        if (intervals[i][0] <= res.back()[1]) {
            // Extend the end of the last interval if needed
            // max() because the new interval might be entirely inside the last one
            res.back()[1] = max(res.back()[1], intervals[i][1]);

        } else {
            // No overlap — start a new interval in the result
            res.push_back(intervals[i]);
        }
    }

    return res;
}

int main() {
    vector<vector<int>> intervals = {{1,3},{2,6},{8,10},{15,18}};
    auto res = merge(intervals);
    for (auto& iv : res) cout << "[" << iv[0] << "," << iv[1] << "] ";
    cout << endl;
    return 0;
}`,
              expectedOutput: `[1,6] [8,10] [15,18]
[1,5] `,
            },
          ],
          hints: [
            'Sort by start time so overlapping intervals are adjacent.',
            'Two intervals overlap if the next start is <= current end.',
            'When merging, take the maximum of the two end times.',
          ],
          solution: `vector<vector<int>> merge(vector<vector<int>>& iv) {
    sort(iv.begin(),iv.end()); vector<vector<int>> res={iv[0]};
    for(int i=1;i<(int)iv.size();i++) if(iv[i][0]<=res.back()[1])res.back()[1]=max(res.back()[1],iv[i][1]);else res.push_back(iv[i]);
    return res;
}`,
        },
        {
          id: 'merge-sorted-no-extra-space',
          slug: 'merge-sorted-no-extra-space',
          title: 'Merge Two Sorted Arrays Without Extra Space',
          type: 'problem',
          difficulty: 'hard',
          pattern: 'Gap Method / Shell Sort Idea',
          conceptsRequired: ['arrays', 'sorting'],
          leetcodeUrl: 'https://leetcode.com/problems/merge-sorted-array/',
          approaches: [
            {
              name: 'Gap Method (Shell Sort Approach)',
              intuition: 'Treat both arrays as a single virtual array of size m+n. Apply Shell Sort logic: compare elements at gap distance and swap if out of order. Halve the gap each iteration.',
              steps: [
                'gap = ceil((m+n)/2).',
                'While gap > 0:',
                '  Compare pairs (i, i+gap) across both arrays. Swap if needed.',
                '  gap = gap == 1 ? 0 : ceil(gap/2).',
              ],
              complexity: { time: 'O((M+N) log(M+N))', space: 'O(1)' },
              code: `void merge(vector<int>& a, int m, vector<int>& b, int n) {
    int gap = (m + n + 1) / 2;
    while (gap > 0) {
        int i = 0, j = gap;
        while (j < m + n) {
            int ai = i < m ? a[i] : b[i - m];
            int bj = j < m ? a[j] : b[j - m];
            if (ai > bj) {
                if (i < m && j < m) swap(a[i], a[j]);
                else if (i < m) swap(a[i], b[j - m]);
                else swap(b[i - m], b[j - m]);
            }
            i++; j++;
        }
        gap = gap == 1 ? 0 : (gap + 1) / 2;
    }
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// Merge two sorted arrays WITHOUT extra space — in-place using Shell Sort gap technique
// Treat both arrays as a single virtual array of size m+n
// Shrink gap each pass: gap = ceil(gap/2) until gap == 1, then set to 0 and stop
void mergeNoSpace(vector<int>& a, int m, vector<int>& b, int n) {
    // Write your solution here

}

int main() {
    vector<int> a = {1, 3, 5, 7};
    vector<int> b = {0, 2, 6, 8, 9};
    mergeNoSpace(a, 4, b, 5);
    for (int x : a) cout << x << " ";
    cout << endl;  // Expected: 0 1 2 3
    for (int x : b) cout << x << " ";
    cout << endl;  // Expected: 5 6 7 8 9

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

void mergeNoSpace(vector<int>& a, int m, vector<int>& b, int n) {

    // Treat both arrays as ONE virtual array of size m+n
    // Index 0..m-1 → a[0..m-1]
    // Index m..m+n-1 → b[0..n-1]
    // We use Shell Sort's gap technique to sort this virtual array

    int gap = (m + n + 1) / 2;  // starting gap = ceil((m+n)/2)

    while (gap > 0) {

        // Compare every pair (i, i+gap) in the virtual array and swap if needed
        int i = 0, j = gap;  // i is left pointer, j = i + gap

        while (j < m + n) {

            // Get the actual value at virtual index i
            // If i < m → it's in array a; else it's in array b at position i-m
            int ai = i < m ? a[i] : b[i - m];

            // Get the actual value at virtual index j (same logic)
            int bj = j < m ? a[j] : b[j - m];

            // If out of order, swap them in the correct array
            if (ai > bj) {
                if (i < m && j < m)     swap(a[i], a[j]);          // both in a
                else if (i < m)         swap(a[i], b[j - m]);      // i in a, j in b
                else                    swap(b[i - m], b[j - m]);  // both in b
            }

            i++;
            j++;
        }

        // Halve the gap (round up): (gap+1)/2 = ceil(gap/2)
        // Special case: when gap == 1, next would be 1 again → stop by setting to 0
        gap = (gap == 1) ? 0 : (gap + 1) / 2;
    }
}

int main() {
    vector<int> a = {1, 3, 5, 7};
    vector<int> b = {0, 2, 6, 8, 9};
    mergeNoSpace(a, 4, b, 5);
    for (int x : a) cout << x << " "; cout << endl;  // 0 1 2 3
    for (int x : b) cout << x << " "; cout << endl;  // 5 6 7 8 9
    return 0;
}`,
              expectedOutput: `0 1 2 3
5 6 7 8 9 `,
            },
          ],
          hints: [
            'Think of both arrays as one virtual array.',
            'Use the Shell Sort gap technique: compare and swap elements at each gap distance.',
            'Halve the gap (rounding up) each iteration until gap reaches 1.',
          ],
          solution: `void mergeNoSpace(vector<int>& a, int m, vector<int>& b, int n) {
    auto get=[&](int i)->int&{return i<m?a[i]:b[i-m];};
    for(int g=(m+n+1)/2;g>0;g=(g==1?0:(g+1)/2)){for(int i=0,j=g;j<m+n;i++,j++) if(get(i)>get(j))swap(get(i),get(j));}
}`,
        },
        {
          id: 'find-repeating-missing',
          slug: 'find-repeating-missing',
          title: 'Find the Repeating and Missing Number',
          type: 'problem',
          difficulty: 'hard',
          pattern: 'Math / XOR',
          conceptsRequired: ['arrays', 'math', 'XOR'],
          approaches: [
            {
              name: 'XOR + Bit Partitioning',
              intuition: 'XOR all array elements and 1..N. Result is repeating^missing. Use a set bit to split numbers into two groups and XOR each group separately to isolate the two values. Then verify.',
              steps: [
                'XOR all elements and all 1..N to get x = repeating ^ missing.',
                'Find any set bit in x (use x & (-x)).',
                'Partition elements (and 1..N) into two groups based on that bit; XOR each group to get two candidates a, b.',
                'Check: count occurrences of a in array. If count==2, a is repeating, b is missing. Else vice versa.',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `pair<int,int> findMissingRepeating(vector<int>& arr) {
    int n = arr.size();
    int xorAll = 0;
    for (int x : arr) xorAll ^= x;
    for (int i = 1; i <= n; i++) xorAll ^= i;
    int bit = xorAll & (-xorAll);
    int a = 0, b = 0;
    for (int x : arr) { if (x & bit) a ^= x; else b ^= x; }
    for (int i = 1; i <= n; i++) { if (i & bit) a ^= i; else b ^= i; }
    int countA = 0;
    for (int x : arr) if (x == a) countA++;
    if (countA == 2) return {a, b}; // a repeating, b missing
    return {b, a};
}`,
              starterCode: `#include <bits/stdc++.h>
using namespace std;

// Array contains 1..N but one number is repeated and one is missing
// pair<int,int> = a pair of two ints: {repeating, missing}
// XOR trick: a ^ a = 0, a ^ 0 = a (any number XORed with itself cancels out)
// xorAll & (-xorAll) = isolates the rightmost set bit
pair<int,int> findMissingRepeating(vector<int>& arr) {
    // Write your solution here

}

int main() {
    vector<int> test1 = {3, 1, 2, 5, 3};  // 3 repeats, 4 is missing
    auto [rep, miss] = findMissingRepeating(test1);
    cout << "Repeating: " << rep << ", Missing: " << miss << endl;
    // Expected: Repeating: 3, Missing: 4

    return 0;
}`,
              solutionWithComments: `#include <bits/stdc++.h>
using namespace std;

// Returns {repeating, missing}
pair<int,int> findMissingRepeating(vector<int>& arr) {

    int n = arr.size();

    // STEP 1: XOR all array elements AND all numbers 1..n
    // In a perfect [1..n] array, every number would cancel out → xorAll = 0
    // Since one is repeated (appears twice) and one is missing:
    // xorAll = repeating ^ repeating ^ missing (one extra repeating, one missing)
    //        = 0 ^ missing ^ repeating  (repeating cancels once, missing remains)
    //        = repeating ^ missing
    int xorAll = 0;
    for (int x : arr) xorAll ^= x;
    for (int i = 1; i <= n; i++) xorAll ^= i;

    // STEP 2: Find any bit that DIFFERS between repeating and missing
    // xorAll & (-xorAll) isolates the RIGHTMOST set bit
    // -xorAll in two's complement = flip all bits and add 1 → rightmost set bit stays
    int bit = xorAll & (-xorAll);

    // STEP 3: Partition all numbers (from array and from 1..n) into two groups:
    // Group A: numbers with this bit SET
    // Group B: numbers with this bit CLEAR
    // Each group's XOR gives one of the two candidates (repeating or missing)
    int a = 0, b = 0;
    for (int x : arr) { if (x & bit) a ^= x; else b ^= x; }
    for (int i = 1; i <= n; i++) { if (i & bit) a ^= i; else b ^= i; }

    // STEP 4: Verify which is repeating (appears twice) and which is missing
    int countA = 0;
    for (int x : arr) if (x == a) countA++;

    if (countA == 2) return {a, b};  // a appears twice → a is repeating, b is missing
    return {b, a};                   // b appears twice → b is repeating, a is missing
}

int main() {
    vector<int> arr = {3, 1, 2, 5, 3};
    auto [rep, miss] = findMissingRepeating(arr);
    cout << "Repeating: " << rep << ", Missing: " << miss << endl;
    return 0;
}`,
              expectedOutput: `Repeating: 3, Missing: 4`,
            },
          ],
          hints: [
            'XOR all elements with 1..N; the result is repeating XOR missing.',
            'Use any set bit of the XOR result to separate the two distinct values.',
            'After finding the two candidates, count occurrences to determine which is repeating.',
          ],
          solution: `pair<int,int> findRepMiss(vector<int>& arr) {
    int n=arr.size(),xr=0;
    for(int x:arr)xr^=x; for(int i=1;i<=n;i++)xr^=i;
    int bit=xr&(-xr),a=0,b=0;
    for(int x:arr)(x&bit)?a^=x:b^=x; for(int i=1;i<=n;i++)(i&bit)?a^=i:b^=i;
    int ca=0; for(int x:arr)if(x==a)ca++;
    return ca==2?make_pair(a,b):make_pair(b,a);
}`,
        },
        {
          id: 'count-inversions',
          slug: 'count-inversions',
          title: 'Count Inversions Using Merge Sort',
          type: 'problem',
          difficulty: 'hard',
          pattern: 'Divide and Conquer / Merge Sort',
          conceptsRequired: ['arrays', 'merge sort', 'divide and conquer'],
          approaches: [
            {
              name: 'Modified Merge Sort',
              intuition: 'During the merge step, whenever an element from the right half is placed before an element from the left half, all remaining left-half elements form inversions with it.',
              steps: [
                'Divide array into two halves.',
                'Recursively count inversions in left and right halves.',
                'During merge: when right[j] < left[i], all elements left[i..mid] form inversions with right[j]. Add (mid - i + 1) to count.',
                'Merge and return total count.',
              ],
              complexity: { time: 'O(N log N)', space: 'O(N)' },
              code: `long long mergeCount(vector<int>& arr, int l, int r) {
    if (l >= r) return 0;
    int mid = (l + r) / 2;
    long long cnt = mergeCount(arr, l, mid) + mergeCount(arr, mid+1, r);
    vector<int> tmp;
    int i = l, j = mid + 1;
    while (i <= mid && j <= r) {
        if (arr[i] <= arr[j]) tmp.push_back(arr[i++]);
        else { cnt += (mid - i + 1); tmp.push_back(arr[j++]); }
    }
    while (i <= mid) tmp.push_back(arr[i++]);
    while (j <= r) tmp.push_back(arr[j++]);
    for (int k = l; k <= r; k++) arr[k] = tmp[k - l];
    return cnt;
}

long long countInversions(vector<int>& arr) {
    return mergeCount(arr, 0, arr.size() - 1);
}`,
            },
          ],
          hints: [
            'Inversions can be counted during the merge step of merge sort.',
            'When right[j] is placed before left[i], it forms inversions with all left[i..mid].',
            'Use long long for the count as it can exceed int range.',
          ],
          solution: `long long merge_(vector<int>&a,int l,int r){
    if(l>=r)return 0; int m=(l+r)/2; long long c=merge_(a,l,m)+merge_(a,m+1,r);
    vector<int>tmp; int i=l,j=m+1;
    while(i<=m&&j<=r){if(a[i]<=a[j])tmp.push_back(a[i++]);else{c+=m-i+1;tmp.push_back(a[j++]);}}
    while(i<=m)tmp.push_back(a[i++]);while(j<=r)tmp.push_back(a[j++]);
    for(int k=l;k<=r;k++)a[k]=tmp[k-l]; return c;
}
long long countInversions(vector<int>& arr){return merge_(arr,0,arr.size()-1);}`,
        },
        {
          id: 'reverse-pairs',
          slug: 'reverse-pairs',
          title: 'Reverse Pairs (i < j and arr[i] > 2*arr[j])',
          type: 'problem',
          difficulty: 'hard',
          pattern: 'Divide and Conquer / Merge Sort',
          conceptsRequired: ['arrays', 'merge sort', 'divide and conquer'],
          leetcodeUrl: 'https://leetcode.com/problems/reverse-pairs/',
          approaches: [
            {
              name: 'Modified Merge Sort',
              intuition: 'Count reverse pairs during merge sort. Before merging, count pairs from left and right halves: for each element in the left, count elements in the sorted right that satisfy arr[i] > 2*arr[j] using two pointers.',
              steps: [
                'Recursively sort and count pairs in left and right halves.',
                'Before merging: use two pointers (i over left, j over right). For each left[i], advance j while arr[i] > 2*arr[j]; count += j - (mid+1).',
                'Merge the two sorted halves normally.',
              ],
              complexity: { time: 'O(N log N)', space: 'O(N)' },
              code: `long long mergeRP(vector<int>& arr, int l, int r) {
    if (l >= r) return 0;
    int mid = (l + r) / 2;
    long long cnt = mergeRP(arr, l, mid) + mergeRP(arr, mid+1, r);
    // Count reverse pairs
    int j = mid + 1;
    for (int i = l; i <= mid; i++) {
        while (j <= r && (long long)arr[i] > 2LL * arr[j]) j++;
        cnt += (j - (mid + 1));
    }
    // Merge
    vector<int> tmp;
    int a = l, b = mid + 1;
    while (a <= mid && b <= r)
        tmp.push_back(arr[a] <= arr[b] ? arr[a++] : arr[b++]);
    while (a <= mid) tmp.push_back(arr[a++]);
    while (b <= r) tmp.push_back(arr[b++]);
    for (int k = l; k <= r; k++) arr[k] = tmp[k - l];
    return cnt;
}

int reversePairs(vector<int>& nums) {
    return mergeRP(nums, 0, nums.size() - 1);
}`,
            },
          ],
          hints: [
            'Extend merge sort: count pairs before the actual merge step.',
            'Both halves are sorted before counting, enabling two-pointer counting.',
            'Use 2LL to avoid overflow when multiplying arr[j] by 2.',
          ],
          solution: `long long mrp(vector<int>&a,int l,int r){
    if(l>=r)return 0; int m=(l+r)/2; long long c=mrp(a,l,m)+mrp(a,m+1,r);
    int j=m+1; for(int i=l;i<=m;i++){while(j<=r&&(long long)a[i]>2LL*a[j])j++;c+=j-(m+1);}
    vector<int>t; int p=l,q=m+1; while(p<=m&&q<=r)t.push_back(a[p]<=a[q]?a[p++]:a[q++]);
    while(p<=m)t.push_back(a[p++]);while(q<=r)t.push_back(a[q++]);for(int k=l;k<=r;k++)a[k]=t[k-l];return c;
}
int reversePairs(vector<int>&nums){return mrp(nums,0,nums.size()-1);}`,
        },
        {
          id: 'max-product-subarray',
          slug: 'max-product-subarray',
          title: 'Maximum Product Subarray',
          type: 'problem',
          difficulty: 'medium',
          pattern: "Kadane's Variant / DP",
          conceptsRequired: ['arrays', 'dynamic programming'],
          leetcodeUrl: 'https://leetcode.com/problems/maximum-product-subarray/',
          approaches: [
            {
              name: 'Track Min and Max Product',
              intuition: 'A negative number can turn the minimum product into the maximum. Track both the current minimum and maximum product ending at each position.',
              steps: [
                'curMax = nums[0], curMin = nums[0], result = nums[0].',
                'For i from 1 to n-1:',
                '  temp = curMax.',
                '  curMax = max({nums[i], curMax*nums[i], curMin*nums[i]}).',
                '  curMin = min({nums[i], temp*nums[i], curMin*nums[i]}).',
                '  result = max(result, curMax).',
              ],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `int maxProduct(vector<int>& nums) {
    int curMax = nums[0], curMin = nums[0], res = nums[0];
    for (int i = 1; i < nums.size(); i++) {
        int tmp = curMax;
        curMax = max({nums[i], curMax * nums[i], curMin * nums[i]});
        curMin = min({nums[i], tmp * nums[i], curMin * nums[i]});
        res = max(res, curMax);
    }
    return res;
}`,
            },
          ],
          hints: [
            'Track both maximum and minimum product — a negative times a negative can give the maximum.',
            'At each step, the new max can come from: nums[i], max*nums[i], or min*nums[i].',
            'Save the old curMax before updating, as curMin needs it.',
          ],
          solution: `int maxProduct(vector<int>& nums) {
    int mx=nums[0],mn=nums[0],res=nums[0];
    for(int i=1;i<(int)nums.size();i++){
        int t=mx; mx=max({nums[i],mx*nums[i],mn*nums[i]}); mn=min({nums[i],t*nums[i],mn*nums[i]}); res=max(res,mx);
    }
    return res;
}`,
        },
      ],
    },
  ],
};
