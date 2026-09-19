import type { DSASection } from '@/types/dsa';

export const binarySearchSection: DSASection = {
  id: 'binary-search',
  slug: 'binary-search',
  title: 'Binary Search [1D, 2D Arrays, Search Space]',
  description: 'Master binary search from classic array search to answer-space problems and 2D matrix search.',
  icon: '🔍',
  color: 'from-indigo-500 to-blue-600',
  subsections: [
    {
      id: 'bs-theory',
      title: 'Theory',
      topics: [
        {
          id: 'binary-search-theory',
          slug: 'binary-search-theory',
          title: 'Binary Search — Theory (Read This First)',
          type: 'lesson',
          difficulty: 'easy',
          introduction: `Binary search finds a value (or a boundary) inside a **sorted** collection by repeatedly cutting the search space **in half** — check the middle, decide which half must contain the answer, discard the other half, repeat. Why it exists: linear search wastes the fact that the data is sorted; binary search is O(log n) instead of O(n) — for a billion elements that's ~30 steps instead of a billion. Real-world usage: database index lookups, "jump to word starting with..." in a dictionary app, git bisect (binary-searching commit history for the one that introduced a bug), and any "find the minimum/maximum X such that condition(X) holds" optimization problem.`,
          theory: `**The one template to learn deeply and reuse everywhere:**\n\`\`\`cpp\nint lo = 0, hi = n - 1;      // inclusive bounds: answer could be anywhere in [lo, hi]\nint ans = -1;\n\nwhile (lo <= hi) {\n    int mid = lo + (hi - lo) / 2;      // see below for why NOT (lo+hi)/2\n\n    if (check(mid)) {                  // mid satisfies our condition\n        ans = mid;\n        hi = mid - 1;                   // keep searching left for an earlier/better answer\n    } else {\n        lo = mid + 1;                   // discard the left half\n    }\n}\n\`\`\`\n**Syntax explained token by token:**\n- \`while (lo <= hi)\` — keep going while the range [lo,hi] still contains at least one index; stop when it's empty (lo > hi).\n- \`int mid = lo + (hi - lo) / 2;\` — NOT \`(lo + hi) / 2\`, because if lo and hi are both large, \`lo + hi\` can overflow a 32-bit int even though the true midpoint is small. \`(hi - lo)\` is always a small range size, so no overflow risk.\n- \`/\` truncates toward zero for ints, so mid always rounds down toward lo.\n- \`hi = mid - 1\` / \`lo = mid + 1\` — after checking mid, never check it again; move strictly past it. Forgetting the ±1 (writing \`hi = mid\`) is the #1 cause of infinite loops in binary search.\n- \`check(mid)\` is the only part that changes per problem — it can be \`arr[mid] == target\`, \`arr[mid] >= target\`, or a custom \`feasible(mid)\` function.\n\n**When to reach for it:** the array is sorted (or sortable), OR the problem describes "find the minimum/maximum X such that some yes/no condition flips exactly once as X increases" — this is called **binary search on the answer** and needs no actual array, just a monotonic condition over a range of candidate answers.\n\n**Binary search on the answer template** (e.g. "minimum eating speed to finish bananas in H hours"):\n\`\`\`cpp\nint lo = minPossibleAnswer, hi = maxPossibleAnswer, ans = hi;\nwhile (lo <= hi) {\n    int mid = lo + (hi - lo) / 2;\n    if (feasible(mid)) { ans = mid; hi = mid - 1; }   // mid works, try smaller\n    else lo = mid + 1;                                  // mid doesn't work, need bigger\n}\n\`\`\`\nRequirement: \`feasible()\` must be monotonic (once true, stays true as mid keeps increasing, or vice versa) — if it flips back and forth, binary search does not apply.`,
          codeExamples: [
            { title: 'Simple: exact value search', language: 'cpp', code: `int search(vector<int>& nums, int target) {\n    int lo = 0, hi = (int)nums.size() - 1;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (nums[mid] == target) return mid;\n        else if (nums[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}`, explanation: 'The textbook template — three-way branch on ==, <, >.' },
            { title: 'Practical: first position >= target (lower bound)', language: 'cpp', code: `int lowerBound(vector<int>& nums, int target) {\n    int lo = 0, hi = (int)nums.size() - 1, ans = nums.size();\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (nums[mid] >= target) { ans = mid; hi = mid - 1; }   // candidate, but look further left\n        else lo = mid + 1;\n    }\n    return ans;\n}`, explanation: 'Used to build "find first/last occurrence" and "insert position" problems.', dryRun: 'nums=[1,3,5,7,9,11], target=7 -> mid=5(11)no, mid=2(5)no->lo=3, mid=4(9)yes ans=4 hi=3, mid=3(7)yes ans=3 hi=2 -> loop ends, ans=3' },
            { title: 'Industry-style: binary search on the answer (rate limiting / capacity planning)', language: 'cpp', code: `// "Minimum server capacity so all requests finish within T minutes" — same shape as Koko Eating Bananas\nbool feasible(int capacity, vector<int>& jobs, int T) {\n    int timeNeeded = 0;\n    for (int job : jobs) timeNeeded += (job + capacity - 1) / capacity;  // ceil division\n    return timeNeeded <= T;\n}\nint minCapacity(vector<int>& jobs, int T) {\n    int lo = 1, hi = *max_element(jobs.begin(), jobs.end()), ans = hi;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (feasible(mid, jobs, T)) { ans = mid; hi = mid - 1; }\n        else lo = mid + 1;\n    }\n    return ans;\n}`, explanation: 'Capacity-planning/throughput problems in real systems are frequently solved by binary searching over a range of possible capacities and checking feasibility at each guess.' },
          ],
          commonMistakes: [
            'Writing (lo + hi) / 2 instead of lo + (hi - lo) / 2 — silent overflow bug on large ranges.',
            'Running binary search on unsorted data — it does not crash, it just silently returns wrong answers.',
            'Writing hi = mid or lo = mid instead of mid ± 1 in a branch that must strictly shrink the range — causes an infinite loop.',
            'Mixing up a while(lo <= hi) template with a while(lo < hi) template copied from elsewhere — their boundary-update rules differ; pick one and be consistent.',
            'Forgetting edge cases: empty array, target smaller/larger than every element, single-element array.',
          ],
          revisionNotes: [
            'lo + (hi - lo) / 2 avoids overflow — never (lo + hi) / 2.',
            'while (lo <= hi), and every branch must move a bound strictly past mid (mid±1).',
            'Binary search on the answer: same template, replace arr[mid] with a monotonic feasible(mid).',
            'Time: O(log n). Space: O(1) iterative.',
          ],
          interviewQuestions: [
            { question: 'Why is lo + (hi - lo) / 2 preferred over (lo + hi) / 2?', answer: '(lo + hi) can overflow a 32-bit int if both are large, even though the true midpoint is a small, valid number — because addition happens before division. lo + (hi - lo) / 2 never adds two large numbers together since (hi - lo) is bounded by the (small) size of the remaining range, so it avoids overflow while computing the same midpoint.', difficulty: 'medium' },
            { question: 'What condition must a problem satisfy for "binary search on the answer" to be valid, even without a sorted array?', answer: 'The feasibility check over the candidate answers must be monotonic — as the candidate value increases, the yes/no answer to "does this work" must flip at most once (either false→true or true→false) and never oscillate. That single flip point is exactly what binary search locates in O(log(range)) checks.', difficulty: 'medium' },
          ],
          keyTakeaways: ['One template (inclusive lo/hi, mid ± 1 updates) solves nearly every binary search variant.', 'Binary search on the answer only needs a monotonic feasible() function, not a sorted array.'],
        },
      ],
    },
    {
      id: 'bs-1d',
      title: 'BS on 1D Arrays',
      topics: [
        {
          id: 'search-x-sorted',
          slug: 'search-x-sorted',
          title: 'Binary Search — Search X in Sorted Array',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Binary Search',
          conceptsRequired: ['arrays', 'binary search'],
          leetcodeUrl: 'https://leetcode.com/problems/binary-search/',
          approaches: [
            {
              name: 'Classic Binary Search',
              intuition: 'Compare the target with the middle element. If equal, found. If less, search left half. If greater, search right half. Repeat.',
              steps: ['lo=0, hi=n-1.', 'While lo<=hi: mid=(lo+hi)/2.', 'If arr[mid]==target return mid.', 'If arr[mid]<target: lo=mid+1. Else: hi=mid-1.', 'Return -1.'],
              complexity: { time: 'O(log N)', space: 'O(1)' },
              code: `int search(vector<int>& nums, int target) {
    int lo = 0, hi = nums.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
            },
          ],
          hints: ['Use lo + (hi-lo)/2 to avoid integer overflow.', 'The search space halves each iteration, giving O(log N).', 'Always include both lo and hi in the search range (lo <= hi).'],
          solution: `int search(vector<int>& nums, int target) { int lo=0,hi=nums.size()-1; while(lo<=hi){int m=lo+(hi-lo)/2;if(nums[m]==target)return m;nums[m]<target?lo=m+1:hi=m-1;} return -1; }`,
        },
        {
          id: 'lower-bound',
          slug: 'lower-bound',
          title: 'Lower Bound',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Binary Search',
          conceptsRequired: ['arrays', 'binary search'],
          approaches: [
            {
              name: 'Binary Search for First >= target',
              intuition: 'Lower bound is the first index where arr[index] >= target. Binary search maintaining ans = hi+1 as default.',
              steps: ['ans = n (default: not found).', 'While lo <= hi: if arr[mid] >= target: ans=mid, hi=mid-1. Else: lo=mid+1.', 'Return ans.'],
              complexity: { time: 'O(log N)', space: 'O(1)' },
              code: `int lowerBound(vector<int>& arr, int target) {
    int lo = 0, hi = arr.size() - 1, ans = arr.size();
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] >= target) { ans = mid; hi = mid - 1; }
        else lo = mid + 1;
    }
    return ans;
}`,
            },
          ],
          hints: ['Lower bound = first position where arr[i] >= target.', 'Keep updating ans whenever condition is met, then shrink the window left.', 'Default answer is n (beyond the array) when target is larger than all elements.'],
          solution: `int lowerBound(vector<int>& a, int t){int lo=0,hi=a.size()-1,ans=a.size();while(lo<=hi){int m=lo+(hi-lo)/2;if(a[m]>=t){ans=m;hi=m-1;}else lo=m+1;}return ans;}`,
        },
        {
          id: 'upper-bound',
          slug: 'upper-bound',
          title: 'Upper Bound',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Binary Search',
          conceptsRequired: ['arrays', 'binary search'],
          approaches: [
            {
              name: 'Binary Search for First > target',
              intuition: 'Upper bound is the first index where arr[index] > target.',
              steps: ['ans = n.', 'While lo <= hi: if arr[mid] > target: ans=mid, hi=mid-1. Else: lo=mid+1.', 'Return ans.'],
              complexity: { time: 'O(log N)', space: 'O(1)' },
              code: `int upperBound(vector<int>& arr, int target) {
    int lo = 0, hi = arr.size() - 1, ans = arr.size();
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] > target) { ans = mid; hi = mid - 1; }
        else lo = mid + 1;
    }
    return ans;
}`,
            },
          ],
          hints: ['Upper bound = first position where arr[i] > target (strictly greater).', 'The only difference from lower bound is the condition: > instead of >=.', 'Elements in [lower_bound, upper_bound) are equal to target.'],
          solution: `int upperBound(vector<int>&a,int t){int lo=0,hi=a.size()-1,ans=a.size();while(lo<=hi){int m=lo+(hi-lo)/2;if(a[m]>t){ans=m;hi=m-1;}else lo=m+1;}return ans;}`,
        },
        {
          id: 'search-insert-position',
          slug: 'search-insert-position',
          title: 'Search Insert Position',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Binary Search / Lower Bound',
          conceptsRequired: ['arrays', 'binary search'],
          leetcodeUrl: 'https://leetcode.com/problems/search-insert-position/',
          approaches: [
            {
              name: 'Lower Bound',
              intuition: 'The insert position is the lower bound of target — first index where arr[i] >= target.',
              steps: ['Standard lower bound binary search.', 'Return the first index where arr[mid] >= target.'],
              complexity: { time: 'O(log N)', space: 'O(1)' },
              code: `int searchInsert(vector<int>& nums, int target) {
    int lo = 0, hi = nums.size() - 1, ans = nums.size();
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] >= target) { ans = mid; hi = mid - 1; }
        else lo = mid + 1;
    }
    return ans;
}`,
            },
          ],
          hints: ['This is exactly the lower bound problem.', 'If target exists, return its index. If not, return where it would be inserted.', 'The answer is the first index where nums[i] >= target.'],
          solution: `int searchInsert(vector<int>&a,int t){int lo=0,hi=a.size()-1,ans=a.size();while(lo<=hi){int m=lo+(hi-lo)/2;if(a[m]>=t){ans=m;hi=m-1;}else lo=m+1;}return ans;}`,
        },
        {
          id: 'floor-and-ceil',
          slug: 'floor-and-ceil',
          title: 'Floor and Ceil in Sorted Array',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Binary Search',
          conceptsRequired: ['arrays', 'binary search'],
          approaches: [
            {
              name: 'Two Separate Binary Searches',
              intuition: 'Floor = largest element <= target (search from right). Ceil = smallest element >= target (lower bound).',
              steps: ['For floor: track ans when arr[mid] <= target, move right.', 'For ceil: track ans when arr[mid] >= target, move left.'],
              complexity: { time: 'O(log N)', space: 'O(1)' },
              code: `pair<int,int> floorCeil(vector<int>& arr, int target) {
    int lo = 0, hi = arr.size() - 1, floor = -1, ceil = -1;
    // Floor
    int l = lo, r = hi;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (arr[mid] <= target) { floor = arr[mid]; l = mid + 1; }
        else r = mid - 1;
    }
    // Ceil
    l = lo; r = hi;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (arr[mid] >= target) { ceil = arr[mid]; r = mid - 1; }
        else l = mid + 1;
    }
    return {floor, ceil};
}`,
            },
          ],
          hints: ['Floor is the largest value <= target; ceil is the smallest value >= target.', 'Run two independent binary searches.', 'Floor moves the window right when condition is met; ceil moves left.'],
          solution: `pair<int,int> floorCeil(vector<int>&a,int t){int l=0,r=a.size()-1,fl=-1,cl=-1;while(l<=r){int m=l+(r-l)/2;if(a[m]<=t){fl=a[m];l=m+1;}else r=m-1;}l=0;r=a.size()-1;while(l<=r){int m=l+(r-l)/2;if(a[m]>=t){cl=a[m];r=m-1;}else l=m+1;}return{fl,cl};}`,
        },
        {
          id: 'first-last-occurrence',
          slug: 'first-last-occurrence',
          title: 'First and Last Occurrence of Element',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Binary Search',
          conceptsRequired: ['arrays', 'binary search'],
          leetcodeUrl: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/',
          approaches: [
            {
              name: 'Two Binary Searches',
              intuition: 'For first occurrence: when found, store index and search left. For last occurrence: when found, store index and search right.',
              steps: ['First occurrence: on match, ans=mid, hi=mid-1.', 'Last occurrence: on match, ans=mid, lo=mid+1.'],
              complexity: { time: 'O(log N)', space: 'O(1)' },
              code: `vector<int> searchRange(vector<int>& nums, int target) {
    auto find = [&](bool first) {
        int lo = 0, hi = nums.size() - 1, ans = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) {
                ans = mid;
                if (first) hi = mid - 1; else lo = mid + 1;
            } else if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return ans;
    };
    return {find(true), find(false)};
}`,
            },
          ],
          hints: ['Run two binary searches: one biased left (first), one biased right (last).', 'On finding the target, do not stop — narrow the window further.', 'First: narrow right (hi=mid-1). Last: narrow left (lo=mid+1).'],
          solution: `vector<int> searchRange(vector<int>&a,int t){auto f=[&](bool first){int lo=0,hi=a.size()-1,ans=-1;while(lo<=hi){int m=lo+(hi-lo)/2;if(a[m]==t){ans=m;first?hi=m-1:lo=m+1;}else if(a[m]<t)lo=m+1;else hi=m-1;}return ans;};return{f(true),f(false)};}`,
        },
        {
          id: 'count-occurrences',
          slug: 'count-occurrences',
          title: 'Count Occurrences in Sorted Array',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Binary Search',
          conceptsRequired: ['arrays', 'binary search'],
          approaches: [
            {
              name: 'Upper Bound - Lower Bound',
              intuition: 'Count = upperBound(target) - lowerBound(target). This gives the number of elements equal to target in O(log N).',
              steps: ['Find lower bound (first >= target).', 'Find upper bound (first > target).', 'Return upperBound - lowerBound.'],
              complexity: { time: 'O(log N)', space: 'O(1)' },
              code: `int countOccurrences(vector<int>& arr, int target) {
    auto lb = lower_bound(arr.begin(), arr.end(), target);
    auto ub = upper_bound(arr.begin(), arr.end(), target);
    return ub - lb;
}`,
            },
          ],
          hints: ['Count = last_occurrence - first_occurrence + 1.', 'Equivalently: upper_bound - lower_bound.', 'Both bounds can be found with binary search in O(log N) each.'],
          solution: `int countOcc(vector<int>&a,int t){return upper_bound(a.begin(),a.end(),t)-lower_bound(a.begin(),a.end(),t);}`,
        },
        {
          id: 'search-rotated-1',
          slug: 'search-rotated-1',
          title: 'Search in Rotated Sorted Array (No Duplicates)',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Binary Search on Rotated Array',
          conceptsRequired: ['arrays', 'binary search'],
          leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
          approaches: [
            {
              name: 'Identify Sorted Half',
              intuition: 'In a rotated array, at least one half of any midpoint split is always sorted. Determine which half is sorted, check if target lies in it, and narrow accordingly.',
              steps: ['If arr[lo] <= arr[mid]: left half is sorted.', '  If target in [arr[lo], arr[mid]]: hi=mid-1. Else: lo=mid+1.', 'Else: right half is sorted.', '  If target in (arr[mid], arr[hi]]: lo=mid+1. Else: hi=mid-1.'],
              complexity: { time: 'O(log N)', space: 'O(1)' },
              code: `int search(vector<int>& nums, int target) {
    int lo = 0, hi = nums.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[lo] <= nums[mid]) {
            if (target >= nums[lo] && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {
            if (target > nums[mid] && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}`,
            },
          ],
          hints: ['One of the two halves is always sorted after a rotation.', 'Check if the left half is sorted: arr[lo] <= arr[mid].', 'If target falls in the sorted half, search there; otherwise search the other half.'],
          solution: `int search(vector<int>&a,int t){int lo=0,hi=a.size()-1;while(lo<=hi){int m=lo+(hi-lo)/2;if(a[m]==t)return m;if(a[lo]<=a[m]){if(t>=a[lo]&&t<a[m])hi=m-1;else lo=m+1;}else{if(t>a[m]&&t<=a[hi])lo=m+1;else hi=m-1;}}return -1;}`,
        },
        {
          id: 'search-rotated-2',
          slug: 'search-rotated-2',
          title: 'Search in Rotated Sorted Array II (With Duplicates)',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Binary Search on Rotated Array',
          conceptsRequired: ['arrays', 'binary search'],
          leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array-ii/',
          approaches: [
            {
              name: 'Handle Ambiguity with lo++, hi--',
              intuition: 'Duplicates cause ambiguity when arr[lo]==arr[mid]==arr[hi]. In this case, shrink both boundaries by 1 to resolve the ambiguity.',
              steps: ['Same as no-duplicates version.', 'Add: if arr[lo]==arr[mid]==arr[hi]: lo++; hi--; continue.'],
              complexity: { time: 'O(log N) average, O(N) worst', space: 'O(1)' },
              code: `bool search(vector<int>& nums, int target) {
    int lo = 0, hi = nums.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return true;
        if (nums[lo] == nums[mid] && nums[mid] == nums[hi]) { lo++; hi--; continue; }
        if (nums[lo] <= nums[mid]) {
            if (target >= nums[lo] && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {
            if (target > nums[mid] && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return false;
}`,
            },
          ],
          hints: ['Duplicates break the "one half is always sorted" invariant.', 'When arr[lo] == arr[mid] == arr[hi], cannot determine sorted half — increment lo and decrement hi.', 'Worst case degenerates to O(N) when all elements are the same.'],
          solution: `bool search(vector<int>&a,int t){int lo=0,hi=a.size()-1;while(lo<=hi){int m=lo+(hi-lo)/2;if(a[m]==t)return true;if(a[lo]==a[m]&&a[m]==a[hi]){lo++;hi--;continue;}if(a[lo]<=a[m]){if(t>=a[lo]&&t<a[m])hi=m-1;else lo=m+1;}else{if(t>a[m]&&t<=a[hi])lo=m+1;else hi=m-1;}}return false;}`,
        },
        {
          id: 'find-min-rotated',
          slug: 'find-min-rotated',
          title: 'Find Minimum in Rotated Sorted Array',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Binary Search on Rotated Array',
          conceptsRequired: ['arrays', 'binary search'],
          leetcodeUrl: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
          approaches: [
            {
              name: 'Binary Search — Eliminate Sorted Half',
              intuition: 'The minimum is at the rotation point. If left half is sorted, the minimum of the left half is arr[lo] but the overall minimum might be in the right. If right half is sorted, right side minimum is arr[mid] but we keep searching left.',
              steps: ['ans = INT_MAX.', 'While lo<=hi: if arr[lo]<=arr[hi]: ans=min(ans,arr[lo]); break.', 'mid=lo+(hi-lo)/2.', 'If arr[lo]<=arr[mid]: left sorted, ans=min(ans,arr[lo]); lo=mid+1. Else: right sorted, ans=min(ans,arr[mid]); hi=mid-1.'],
              complexity: { time: 'O(log N)', space: 'O(1)' },
              code: `int findMin(vector<int>& nums) {
    int lo = 0, hi = nums.size() - 1, ans = INT_MAX;
    while (lo <= hi) {
        if (nums[lo] <= nums[hi]) { ans = min(ans, nums[lo]); break; }
        int mid = lo + (hi - lo) / 2;
        if (nums[lo] <= nums[mid]) { ans = min(ans, nums[lo]); lo = mid + 1; }
        else { ans = min(ans, nums[mid]); hi = mid - 1; }
    }
    return ans;
}`,
            },
          ],
          hints: ['If the current segment is not rotated (arr[lo] <= arr[hi]), the minimum is arr[lo].', 'The minimum always lies in the unsorted half.', 'Track the candidate minimum whenever a sorted portion is found.'],
          solution: `int findMin(vector<int>&a){int lo=0,hi=a.size()-1,ans=INT_MAX;while(lo<=hi){if(a[lo]<=a[hi]){ans=min(ans,a[lo]);break;}int m=lo+(hi-lo)/2;if(a[lo]<=a[m]){ans=min(ans,a[lo]);lo=m+1;}else{ans=min(ans,a[m]);hi=m-1;}}return ans;}`,
        },
        {
          id: 'count-rotations',
          slug: 'count-rotations',
          title: 'Count Rotations in Rotated Sorted Array',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Binary Search on Rotated Array',
          conceptsRequired: ['arrays', 'binary search'],
          approaches: [
            {
              name: 'Find Index of Minimum Element',
              intuition: 'The number of rotations equals the index of the minimum element. Find it with binary search.',
              steps: ['Find the index of the minimum element (same as findMin but return index).', 'Return that index.'],
              complexity: { time: 'O(log N)', space: 'O(1)' },
              code: `int countRotations(vector<int>& arr) {
    int lo = 0, hi = arr.size() - 1, idx = 0;
    while (lo <= hi) {
        if (arr[lo] <= arr[hi]) { if (arr[lo] < arr[idx]) idx = lo; break; }
        int mid = lo + (hi - lo) / 2;
        if (arr[lo] <= arr[mid]) { if (arr[lo] < arr[idx]) idx = lo; lo = mid + 1; }
        else { if (arr[mid] < arr[idx]) idx = mid; hi = mid - 1; }
    }
    return idx;
}`,
            },
          ],
          hints: ['The rotation count equals the index of the minimum element.', 'Use the same binary search as findMin but return the index.', 'For 0 rotations, the array is fully sorted and the minimum is at index 0.'],
          solution: `int countRotations(vector<int>&a){int lo=0,hi=a.size()-1,mi=0;while(lo<=hi){if(a[lo]<=a[hi]){if(a[lo]<a[mi])mi=lo;break;}int m=lo+(hi-lo)/2;if(a[lo]<=a[m]){if(a[lo]<a[mi])mi=lo;lo=m+1;}else{if(a[m]<a[mi])mi=m;hi=m-1;}}return mi;}`,
        },
        {
          id: 'single-element-sorted',
          slug: 'single-element-sorted',
          title: 'Single Element in a Sorted Array',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Binary Search / XOR',
          conceptsRequired: ['arrays', 'binary search', 'bit manipulation'],
          leetcodeUrl: 'https://leetcode.com/problems/single-element-in-a-sorted-array/',
          approaches: [
            {
              name: 'Binary Search on Pair Index',
              intuition: 'Before the single element, pairs occupy (even,odd) index positions. After it, pairs occupy (odd,even). Use this to determine which side the single element is on.',
              steps: ['lo=0, hi=n-2 (work on even indices).', 'mid = lo+(hi-lo)/2. Make mid even if odd.', 'If arr[mid]==arr[mid+1]: single is to the right, lo=mid+2.', 'Else: single is at mid or left, hi=mid.', 'Return arr[lo].'],
              complexity: { time: 'O(log N)', space: 'O(1)' },
              code: `int singleNonDuplicate(vector<int>& nums) {
    int lo = 0, hi = nums.size() - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (mid % 2 == 1) mid--;
        if (nums[mid] == nums[mid + 1]) lo = mid + 2;
        else hi = mid;
    }
    return nums[lo];
}`,
            },
          ],
          hints: ['Before the single element: pair at even index pairs with index+1.', 'After the single element: pair at even index pairs with index-1.', 'Adjust mid to always be even to check which side the single element is on.'],
          solution: `int singleNonDuplicate(vector<int>&a){int lo=0,hi=a.size()-1;while(lo<hi){int m=lo+(hi-lo)/2;if(m%2)m--;if(a[m]==a[m+1])lo=m+2;else hi=m;}return a[lo];}`,
        },
        {
          id: 'find-peak-element',
          slug: 'find-peak-element',
          title: 'Find Peak Element',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Binary Search',
          conceptsRequired: ['arrays', 'binary search'],
          leetcodeUrl: 'https://leetcode.com/problems/find-peak-element/',
          approaches: [
            {
              name: 'Binary Search — Follow the Slope',
              intuition: 'If arr[mid] < arr[mid+1], the peak is to the right (ascending slope leads to a peak). Otherwise it is to the left or at mid.',
              steps: ['lo=0, hi=n-1.', 'While lo<hi: mid=lo+(hi-lo)/2.', 'If arr[mid]<arr[mid+1]: lo=mid+1. Else: hi=mid.', 'Return lo.'],
              complexity: { time: 'O(log N)', space: 'O(1)' },
              code: `int findPeakElement(vector<int>& nums) {
    int lo = 0, hi = nums.size() - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] < nums[mid + 1]) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
            },
          ],
          hints: ['If the slope is rising at mid (arr[mid] < arr[mid+1]), the peak must be to the right.', 'If falling, the peak is at mid or to the left.', 'The boundary condition guarantees a peak always exists (imaginary -inf at both ends).'],
          solution: `int findPeakElement(vector<int>&a){int lo=0,hi=a.size()-1;while(lo<hi){int m=lo+(hi-lo)/2;if(a[m]<a[m+1])lo=m+1;else hi=m;}return lo;}`,
        },
      ],
    },
    {
      id: 'bs-on-answers',
      title: 'BS on Answers (Search Space)',
      topics: [
        {
          id: 'sqrt-number',
          slug: 'sqrt-number',
          title: 'Square Root of a Number',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Binary Search on Answer',
          conceptsRequired: ['binary search', 'math'],
          leetcodeUrl: 'https://leetcode.com/problems/sqrtx/',
          approaches: [
            {
              name: 'Binary Search on [1..x]',
              intuition: 'The answer lies in [0..x]. Binary search: if mid*mid <= x, candidate is valid (store it, search right). If mid*mid > x, search left.',
              steps: ['lo=0, hi=x, ans=0.', 'While lo<=hi: mid=lo+(hi-lo)/2.', 'If mid*mid<=x: ans=mid; lo=mid+1. Else: hi=mid-1.', 'Return ans.'],
              complexity: { time: 'O(log N)', space: 'O(1)' },
              code: `int mySqrt(int x) {
    long lo = 0, hi = x, ans = 0;
    while (lo <= hi) {
        long mid = lo + (hi - lo) / 2;
        if (mid * mid <= x) { ans = mid; lo = mid + 1; }
        else hi = mid - 1;
    }
    return ans;
}`,
            },
          ],
          hints: ['Search for the largest integer whose square is <= x.', 'Use long to avoid overflow when computing mid*mid.', 'The search space is [0, x].'],
          solution: `int mySqrt(int x){long lo=0,hi=x,ans=0;while(lo<=hi){long m=lo+(hi-lo)/2;if(m*m<=x){ans=m;lo=m+1;}else hi=m-1;}return ans;}`,
        },
        {
          id: 'nth-root',
          slug: 'nth-root',
          title: 'Nth Root of a Number',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Binary Search on Answer',
          conceptsRequired: ['binary search', 'math'],
          approaches: [
            {
              name: 'Binary Search on [1..m]',
              intuition: 'Binary search on potential answer. Compute mid^n and compare with m. Avoid overflow by checking during multiplication.',
              steps: ['lo=1, hi=m.', 'mid^n < m: lo=mid+1. mid^n == m: return mid. mid^n > m: hi=mid-1.', 'Return -1 if no exact integer root.'],
              complexity: { time: 'O(N log M)', space: 'O(1)' },
              code: `// Returns -1 if no exact integer nth root exists
int nthRoot(int n, long long m) {
    auto power = [&](long long base, int exp, long long limit) -> long long {
        long long res = 1;
        for (int i = 0; i < exp; i++) {
            res *= base;
            if (res > limit) return limit + 1;
        }
        return res;
    };
    long long lo = 1, hi = m;
    while (lo <= hi) {
        long long mid = lo + (hi - lo) / 2;
        long long val = power(mid, n, m);
        if (val == m) return mid;
        else if (val < m) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
            },
          ],
          hints: ['Search space is [1..m]. For each candidate mid, check if mid^n == m.', 'Use a safe power function that returns early to avoid overflow.', 'If mid^n < m search right; if > m search left; if == m return mid.'],
          solution: `int nthRoot(int n,long long m){auto pw=[&](long long b,int e,long long lim)->long long{long long r=1;for(int i=0;i<e;i++){r*=b;if(r>lim)return lim+1;}return r;};long long lo=1,hi=m;while(lo<=hi){long long mid=lo+(hi-lo)/2;long long v=pw(mid,n,m);if(v==m)return mid;else if(v<m)lo=mid+1;else hi=mid-1;}return -1;}`,
        },
        {
          id: 'koko-eating-bananas',
          slug: 'koko-eating-bananas',
          title: 'Koko Eating Bananas',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Binary Search on Answer',
          conceptsRequired: ['binary search', 'arrays'],
          leetcodeUrl: 'https://leetcode.com/problems/koko-eating-bananas/',
          approaches: [
            {
              name: 'Binary Search on Eating Speed',
              intuition: 'The answer (speed k) lies between 1 and max(piles). For a given k, we can compute the total hours. Binary search for the minimum k where total hours <= h.',
              steps: ['lo=1, hi=max(piles).', 'For each mid: compute total hours = sum(ceil(pile/mid)) for all piles.', 'If hours<=h: valid speed, try smaller (hi=mid-1). Else: lo=mid+1.', 'Return lo.'],
              complexity: { time: 'O(N log(max_pile))', space: 'O(1)' },
              code: `int minEatingSpeed(vector<int>& piles, int h) {
    int lo = 1, hi = *max_element(piles.begin(), piles.end());
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        long long hours = 0;
        for (int p : piles) hours += (p + mid - 1) / mid;
        if (hours <= h) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
            },
          ],
          hints: ['Binary search on the answer: the eating speed k.', 'The feasibility check: for speed k, hours = sum(ceil(pile/k)).', 'If feasible, try a smaller speed (search left). Otherwise search right.'],
          solution: `int minEatingSpeed(vector<int>&p,int h){int lo=1,hi=*max_element(p.begin(),p.end());while(lo<hi){int m=lo+(hi-lo)/2;long long hr=0;for(int x:p)hr+=(x+m-1)/m;if(hr<=h)hi=m;else lo=m+1;}return lo;}`,
        },
        {
          id: 'min-days-bouquets',
          slug: 'min-days-bouquets',
          title: 'Minimum Days to Make M Bouquets',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Binary Search on Answer',
          conceptsRequired: ['binary search', 'arrays'],
          leetcodeUrl: 'https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/',
          approaches: [
            {
              name: 'Binary Search on Days',
              intuition: 'Binary search on the number of days. For a given day d, check if we can make m bouquets of k consecutive bloomed flowers.',
              steps: ['lo=min(bloomDay), hi=max(bloomDay).', 'For each mid: count consecutive flowers bloomed by day mid. Count complete bouquets.', 'If bouquets>=m: try fewer days (hi=mid-1). Else: lo=mid+1.'],
              complexity: { time: 'O(N log(max_day))', space: 'O(1)' },
              code: `int minDays(vector<int>& bloomDay, int m, int k) {
    long long need = (long long)m * k;
    if (need > bloomDay.size()) return -1;
    auto canMake = [&](int day) {
        int bouquets = 0, consecutive = 0;
        for (int d : bloomDay) {
            if (d <= day) { if (++consecutive == k) { bouquets++; consecutive = 0; } }
            else consecutive = 0;
        }
        return bouquets >= m;
    };
    int lo = *min_element(bloomDay.begin(), bloomDay.end());
    int hi = *max_element(bloomDay.begin(), bloomDay.end());
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (canMake(mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
            },
          ],
          hints: ['If total flowers n < m*k, it is impossible — return -1.', 'Binary search on the number of days between min and max of bloomDay.', 'For a given day, greedily count complete bouquets of k consecutive bloomed flowers.'],
          solution: `int minDays(vector<int>&bd,int m,int k){if((long long)m*k>bd.size())return -1;auto ok=[&](int d){int b=0,c=0;for(int x:bd){if(x<=d){if(++c==k){b++;c=0;}}else c=0;}return b>=m;};int lo=*min_element(bd.begin(),bd.end()),hi=*max_element(bd.begin(),bd.end());while(lo<hi){int mid=lo+(hi-lo)/2;ok(mid)?hi=mid:lo=mid+1;}return lo;}`,
        },
        {
          id: 'smallest-divisor',
          slug: 'smallest-divisor',
          title: 'Find the Smallest Divisor Given a Threshold',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Binary Search on Answer',
          conceptsRequired: ['binary search', 'arrays', 'math'],
          leetcodeUrl: 'https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/',
          approaches: [
            {
              name: 'Binary Search on Divisor',
              intuition: 'Binary search on the divisor from 1 to max(nums). For a given divisor d, the sum is sum(ceil(num/d)). Find the smallest d where this sum <= threshold.',
              steps: ['lo=1, hi=max(nums).', 'For each mid: sum=sum(ceil(n/mid)).', 'If sum<=threshold: hi=mid. Else: lo=mid+1.', 'Return lo.'],
              complexity: { time: 'O(N log(max_val))', space: 'O(1)' },
              code: `int smallestDivisor(vector<int>& nums, int threshold) {
    int lo = 1, hi = *max_element(nums.begin(), nums.end());
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        int sum = 0;
        for (int x : nums) sum += (x + mid - 1) / mid;
        if (sum <= threshold) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
            },
          ],
          hints: ['Binary search on the divisor value.', 'For divisor d, the sum = sum(ceil(nums[i]/d)).', 'Smaller divisor → larger sum. Find minimum divisor where sum <= threshold.'],
          solution: `int smallestDivisor(vector<int>&a,int t){int lo=1,hi=*max_element(a.begin(),a.end());while(lo<hi){int m=lo+(hi-lo)/2,s=0;for(int x:a)s+=(x+m-1)/m;s<=t?hi=m:lo=m+1;}return lo;}`,
        },
        {
          id: 'capacity-ship-packages',
          slug: 'capacity-ship-packages',
          title: 'Capacity to Ship Packages Within D Days',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Binary Search on Answer',
          conceptsRequired: ['binary search', 'arrays'],
          leetcodeUrl: 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/',
          approaches: [
            {
              name: 'Binary Search on Capacity',
              intuition: 'The minimum capacity must be at least max(weights) and at most sum(weights). Binary search for the minimum capacity that allows shipping in <= d days.',
              steps: ['lo=max(weights), hi=sum(weights).', 'For each mid capacity: simulate shipping days needed.', 'If days<=d: hi=mid. Else: lo=mid+1.'],
              complexity: { time: 'O(N log(sum))', space: 'O(1)' },
              code: `int shipWithinDays(vector<int>& weights, int days) {
    int lo = *max_element(weights.begin(), weights.end());
    int hi = accumulate(weights.begin(), weights.end(), 0);
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2, d = 1, cur = 0;
        for (int w : weights) {
            if (cur + w > mid) { d++; cur = 0; }
            cur += w;
        }
        if (d <= days) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
            },
          ],
          hints: ['Lower bound of capacity = max single weight (must carry each package).', 'Upper bound = total weight (ship all in 1 day).', 'For a given capacity, greedily compute days needed.'],
          solution: `int shipWithinDays(vector<int>&w,int d){int lo=*max_element(w.begin(),w.end()),hi=accumulate(w.begin(),w.end(),0);while(lo<hi){int m=lo+(hi-lo)/2,days=1,cur=0;for(int x:w){if(cur+x>m){days++;cur=0;}cur+=x;}days<=d?hi=m:lo=m+1;}return lo;}`,
        },
        {
          id: 'kth-missing-positive',
          slug: 'kth-missing-positive',
          title: 'Kth Missing Positive Number',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Binary Search',
          conceptsRequired: ['arrays', 'binary search', 'math'],
          leetcodeUrl: 'https://leetcode.com/problems/kth-missing-positive-number/',
          approaches: [
            {
              name: 'Binary Search on Index',
              intuition: 'At index i, the number of missing positives is arr[i] - (i+1). Binary search for the first index where missing count >= k, then derive the kth missing.',
              steps: ['lo=0, hi=n-1.', 'While lo<=hi: missing = arr[mid]-(mid+1).', 'If missing<k: lo=mid+1. Else: hi=mid-1.', 'Answer = lo+k (lo elements are less than answer, k more needed).'],
              complexity: { time: 'O(log N)', space: 'O(1)' },
              code: `int findKthPositive(vector<int>& arr, int k) {
    int lo = 0, hi = arr.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] - (mid + 1) < k) lo = mid + 1;
        else hi = mid - 1;
    }
    return lo + k;
}`,
            },
          ],
          hints: ['At index i (0-based), missing count = arr[i] - (i+1).', 'Binary search for the insertion point where missing count first reaches k.', 'Answer = lo + k where lo is the result index after binary search.'],
          solution: `int findKthPositive(vector<int>&a,int k){int lo=0,hi=a.size()-1;while(lo<=hi){int m=lo+(hi-lo)/2;if(a[m]-(m+1)<k)lo=m+1;else hi=m-1;}return lo+k;}`,
        },
        {
          id: 'aggressive-cows',
          slug: 'aggressive-cows',
          title: 'Aggressive Cows (Maximize Minimum Distance)',
          type: 'problem',
          difficulty: 'hard',
          pattern: 'Binary Search on Answer',
          conceptsRequired: ['binary search', 'arrays', 'greedy'],
          approaches: [
            {
              name: 'Binary Search on Minimum Distance',
              intuition: 'Binary search on the minimum distance between any two cows. For a given distance d, greedily place cows: place first cow at stall[0], then the next cow at the first stall at least d away.',
              steps: ['Sort stalls. lo=1, hi=stalls[n-1]-stalls[0].', 'For each mid: greedily place cows. If we can place all k cows: hi=mid-1 (try larger distance: ans=mid). Else: lo=mid+1.'],
              complexity: { time: 'O(N log N + N log(max_dist))', space: 'O(1)' },
              code: `int aggressiveCows(vector<int>& stalls, int k) {
    sort(stalls.begin(), stalls.end());
    int n = stalls.size();
    auto canPlace = [&](int minDist) {
        int count = 1, last = stalls[0];
        for (int i = 1; i < n; i++) {
            if (stalls[i] - last >= minDist) { count++; last = stalls[i]; }
        }
        return count >= k;
    };
    int lo = 1, hi = stalls[n-1] - stalls[0], ans = 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (canPlace(mid)) { ans = mid; lo = mid + 1; }
        else hi = mid - 1;
    }
    return ans;
}`,
            },
          ],
          hints: ['Sort the stalls first.', 'Binary search on the answer: minimum distance between cows.', 'Feasibility: greedily place cows maintaining at least the minimum distance.'],
          solution: `int aggressiveCows(vector<int>&s,int k){sort(s.begin(),s.end());int n=s.size();auto ok=[&](int d){int c=1,last=s[0];for(int i=1;i<n;i++)if(s[i]-last>=d){c++;last=s[i];}return c>=k;};int lo=1,hi=s[n-1]-s[0],ans=1;while(lo<=hi){int m=lo+(hi-lo)/2;if(ok(m)){ans=m;lo=m+1;}else hi=m-1;}return ans;}`,
        },
        {
          id: 'book-allocation',
          slug: 'book-allocation',
          title: 'Book Allocation Problem',
          type: 'problem',
          difficulty: 'hard',
          pattern: 'Binary Search on Answer',
          conceptsRequired: ['binary search', 'arrays', 'greedy'],
          approaches: [
            {
              name: 'Binary Search on Maximum Pages',
              intuition: 'Binary search on the maximum pages a student can read. For a given max, greedily assign books to students. Find the minimum such max.',
              steps: ['lo=max(pages), hi=sum(pages).', 'For each mid: greedily assign; count students needed.', 'If students<=k: hi=mid (feasible, try smaller). Else: lo=mid+1.'],
              complexity: { time: 'O(N log(sum))', space: 'O(1)' },
              code: `int allocateBooks(vector<int>& pages, int k) {
    if (k > pages.size()) return -1;
    int lo = *max_element(pages.begin(), pages.end());
    int hi = accumulate(pages.begin(), pages.end(), 0);
    int ans = hi;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2, students = 1, curPages = 0;
        for (int p : pages) {
            if (curPages + p > mid) { students++; curPages = 0; }
            curPages += p;
        }
        if (students <= k) { ans = mid; hi = mid - 1; }
        else lo = mid + 1;
    }
    return ans;
}`,
            },
          ],
          hints: ['Binary search on the answer: maximum pages allocated to a student.', 'The lower bound is max(pages) — each student must read at least the largest book.', 'For a given limit, greedily assign consecutive books to minimize students used.'],
          solution: `int allocateBooks(vector<int>&p,int k){if(k>(int)p.size())return -1;int lo=*max_element(p.begin(),p.end()),hi=accumulate(p.begin(),p.end(),0),ans=hi;while(lo<=hi){int m=lo+(hi-lo)/2,s=1,c=0;for(int x:p){if(c+x>m){s++;c=0;}c+=x;}if(s<=k){ans=m;hi=m-1;}else lo=m+1;}return ans;}`,
        },
        {
          id: 'split-array-largest-sum',
          slug: 'split-array-largest-sum',
          title: 'Split Array Largest Sum',
          type: 'problem',
          difficulty: 'hard',
          pattern: 'Binary Search on Answer',
          conceptsRequired: ['binary search', 'arrays', 'DP'],
          leetcodeUrl: 'https://leetcode.com/problems/split-array-largest-sum/',
          approaches: [
            {
              name: 'Binary Search on the Largest Sum',
              intuition: 'Same as book allocation. Binary search on the largest subarray sum. For a given candidate, check if the array can be split into at most k subarrays each with sum <= candidate.',
              steps: ['lo=max(nums), hi=sum(nums).', 'For mid: count splits needed. If splits<=k: hi=mid. Else: lo=mid+1.'],
              complexity: { time: 'O(N log(sum))', space: 'O(1)' },
              code: `int splitArray(vector<int>& nums, int k) {
    int lo = *max_element(nums.begin(), nums.end());
    int hi = accumulate(nums.begin(), nums.end(), 0);
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2, parts = 1, cur = 0;
        for (int x : nums) {
            if (cur + x > mid) { parts++; cur = 0; }
            cur += x;
        }
        if (parts <= k) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
            },
          ],
          hints: ['Minimize the maximum subarray sum — binary search on the answer.', 'For a given maximum allowed sum, greedily split into minimum parts.', 'This is identical to the book allocation / painters partition problem.'],
          solution: `int splitArray(vector<int>&a,int k){int lo=*max_element(a.begin(),a.end()),hi=accumulate(a.begin(),a.end(),0);while(lo<hi){int m=lo+(hi-lo)/2,p=1,c=0;for(int x:a){if(c+x>m){p++;c=0;}c+=x;}p<=k?hi=m:lo=m+1;}return lo;}`,
        },
        {
          id: 'painters-partition',
          slug: 'painters-partition',
          title: "Painter's Partition Problem",
          type: 'problem',
          difficulty: 'hard',
          pattern: 'Binary Search on Answer',
          conceptsRequired: ['binary search', 'arrays', 'greedy'],
          approaches: [
            {
              name: 'Binary Search on Maximum Time',
              intuition: 'Same structure as book allocation — minimize the maximum work assigned to any painter. Binary search on the answer.',
              steps: ['lo=max(boards), hi=sum(boards).', 'Check: can k painters finish in mid time?', 'Greedy: assign boards greedily, count painters needed.'],
              complexity: { time: 'O(N log(sum))', space: 'O(1)' },
              code: `int paintersPartition(vector<int>& boards, int k) {
    int lo = *max_element(boards.begin(), boards.end());
    int hi = accumulate(boards.begin(), boards.end(), 0);
    int ans = hi;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2, painters = 1, cur = 0;
        for (int b : boards) {
            if (cur + b > mid) { painters++; cur = 0; }
            cur += b;
        }
        if (painters <= k) { ans = mid; hi = mid - 1; }
        else lo = mid + 1;
    }
    return ans;
}`,
            },
          ],
          hints: ['Painters partition = book allocation with different variable names.', 'Binary search on maximum time (maximum sum of any contiguous segment).', 'Feasibility: greedily assign boards, count painters needed.'],
          solution: `int paintersPartition(vector<int>&b,int k){int lo=*max_element(b.begin(),b.end()),hi=accumulate(b.begin(),b.end(),0),ans=hi;while(lo<=hi){int m=lo+(hi-lo)/2,p=1,c=0;for(int x:b){if(c+x>m){p++;c=0;}c+=x;}if(p<=k){ans=m;hi=m-1;}else lo=m+1;}return ans;}`,
        },
        {
          id: 'minimize-max-gas-station',
          slug: 'minimize-max-gas-station',
          title: 'Minimize Maximum Distance Between Gas Stations',
          type: 'problem',
          difficulty: 'hard',
          pattern: 'Binary Search on Answer (floating point)',
          conceptsRequired: ['binary search', 'arrays', 'greedy', 'math'],
          approaches: [
            {
              name: 'Binary Search on Distance (Double)',
              intuition: 'Binary search on the answer (a real number: maximum gap). For a given gap d, check if we can add at most k stations such that no gap exceeds d.',
              steps: ['lo=0, hi=max gap between consecutive stations.', 'For mid: count stations needed = sum(floor((stations[i+1]-stations[i])/mid)) for each gap.', 'If count<=k: hi=mid. Else: lo=mid. Stop when hi-lo < 1e-6.'],
              complexity: { time: 'O(N log(1/epsilon))', space: 'O(1)' },
              code: `double minimiseMaxDistance(vector<int>& arr, int k) {
    int n = arr.size();
    double lo = 0, hi = 0;
    for (int i = 1; i < n; i++) hi = max(hi, (double)(arr[i] - arr[i-1]));
    for (int iter = 0; iter < 100; iter++) {
        double mid = (lo + hi) / 2;
        int cnt = 0;
        for (int i = 1; i < n; i++)
            cnt += (int)((arr[i] - arr[i-1]) / mid);
        if (cnt <= k) hi = mid;
        else lo = mid;
    }
    return hi;
}`,
            },
          ],
          hints: ['Binary search on a real-valued answer using 100 iterations for precision.', 'For a given max gap d, stations needed in gap g = floor(g/d).', 'Total stations needed <= k means d is feasible.'],
          solution: `double minimiseMaxDistance(vector<int>&a,int k){int n=a.size();double lo=0,hi=0;for(int i=1;i<n;i++)hi=max(hi,(double)(a[i]-a[i-1]));for(int i=0;i<100;i++){double mid=(lo+hi)/2;int c=0;for(int j=1;j<n;j++)c+=(int)((a[j]-a[j-1])/mid);c<=k?hi=mid:lo=mid;}return hi;}`,
        },
        {
          id: 'median-two-sorted-arrays',
          slug: 'median-two-sorted-arrays',
          title: 'Median of Two Sorted Arrays',
          type: 'problem',
          difficulty: 'hard',
          pattern: 'Binary Search on Partition',
          conceptsRequired: ['arrays', 'binary search', 'math'],
          leetcodeUrl: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
          approaches: [
            {
              name: 'Binary Search on Smaller Array Partition',
              intuition: 'Partition both arrays such that the left halves combined form the smaller half of the merged array. Binary search on the partition index in the smaller array.',
              steps: ['Ensure a is the smaller array (swap if needed).', 'Binary search on the cut in a: lo=0, hi=m.', 'cut1 = mid, cut2 = (m+n+1)/2 - cut1.', 'Compute l1,l2 (left sides) and r1,r2 (right sides).', 'If l1<=r2 && l2<=r1: found partition. Compute median.', 'If l1>r2: lo=mid+1 (move cut right). Else: hi=mid-1.'],
              complexity: { time: 'O(log(min(M,N)))', space: 'O(1)' },
              code: `double findMedianSortedArrays(vector<int>& a, vector<int>& b) {
    if (a.size() > b.size()) return findMedianSortedArrays(b, a);
    int m = a.size(), n = b.size();
    int lo = 0, hi = m;
    while (lo <= hi) {
        int c1 = (lo + hi) / 2, c2 = (m + n + 1) / 2 - c1;
        int l1 = c1 ? a[c1-1] : INT_MIN, l2 = c2 ? b[c2-1] : INT_MIN;
        int r1 = c1 < m ? a[c1] : INT_MAX, r2 = c2 < n ? b[c2] : INT_MAX;
        if (l1 <= r2 && l2 <= r1) {
            if ((m + n) % 2 == 0) return (max(l1,l2) + min(r1,r2)) / 2.0;
            return max(l1, l2);
        }
        if (l1 > r2) hi = c1 - 1;
        else lo = c1 + 1;
    }
    return 0.0;
}`,
            },
          ],
          hints: ['Binary search on the partition of the smaller array.', 'A valid partition satisfies: max(left_a) <= min(right_b) AND max(left_b) <= min(right_a).', 'Use INT_MIN/INT_MAX as sentinels for out-of-bounds partitions.'],
          solution: `double findMedianSortedArrays(vector<int>&a,vector<int>&b){if(a.size()>b.size())return findMedianSortedArrays(b,a);int m=a.size(),n=b.size(),lo=0,hi=m;while(lo<=hi){int c1=(lo+hi)/2,c2=(m+n+1)/2-c1,l1=c1?a[c1-1]:INT_MIN,l2=c2?b[c2-1]:INT_MIN,r1=c1<m?a[c1]:INT_MAX,r2=c2<n?b[c2]:INT_MAX;if(l1<=r2&&l2<=r1)return(m+n)%2?(double)max(l1,l2):(max(l1,l2)+min(r1,r2))/2.0;l1>r2?hi=c1-1:lo=c1+1;}return 0;}`,
        },
        {
          id: 'kth-element-two-sorted',
          slug: 'kth-element-two-sorted',
          title: 'Kth Element of Two Sorted Arrays',
          type: 'problem',
          difficulty: 'hard',
          pattern: 'Binary Search on Partition',
          conceptsRequired: ['arrays', 'binary search'],
          approaches: [
            {
              name: 'Binary Search on Partition',
              intuition: 'Similar to median but find the kth element. Partition such that exactly k elements are in the left half combined.',
              steps: ['Ensure a is smaller. Binary search cut1 in a.', 'cut2 = k - cut1.', 'Valid partition: l1<=r2 and l2<=r1. Answer = max(l1, l2).'],
              complexity: { time: 'O(log(min(M,N)))', space: 'O(1)' },
              code: `int kthElement(vector<int>& a, vector<int>& b, int k) {
    if (a.size() > b.size()) return kthElement(b, a, k);
    int m = a.size(), n = b.size();
    int lo = max(0, k-n), hi = min(k, m);
    while (lo <= hi) {
        int c1 = (lo + hi) / 2, c2 = k - c1;
        int l1 = c1 ? a[c1-1] : INT_MIN, l2 = c2 ? b[c2-1] : INT_MIN;
        int r1 = c1 < m ? a[c1] : INT_MAX, r2 = c2 < n ? b[c2] : INT_MAX;
        if (l1 <= r2 && l2 <= r1) return max(l1, l2);
        if (l1 > r2) hi = c1 - 1;
        else lo = c1 + 1;
    }
    return -1;
}`,
            },
          ],
          hints: ['Binary search on partition in smaller array; cut2 = k - cut1.', 'Valid partition: max(left) <= min(right) for both arrays cross-compared.', 'Answer is max(l1, l2) — the largest element in the combined left half.'],
          solution: `int kthElement(vector<int>&a,vector<int>&b,int k){if(a.size()>b.size())return kthElement(b,a,k);int m=a.size(),n=b.size(),lo=max(0,k-n),hi=min(k,m);while(lo<=hi){int c1=(lo+hi)/2,c2=k-c1,l1=c1?a[c1-1]:INT_MIN,l2=c2?b[c2-1]:INT_MIN,r1=c1<m?a[c1]:INT_MAX,r2=c2<n?b[c2]:INT_MAX;if(l1<=r2&&l2<=r1)return max(l1,l2);l1>r2?hi=c1-1:lo=c1+1;}return -1;}`,
        },
      ],
    },
    {
      id: 'bs-2d',
      title: 'BS on 2D Arrays',
      topics: [
        {
          id: 'row-max-ones',
          slug: 'row-max-ones',
          title: 'Row with Maximum Number of 1s',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Binary Search on Each Row',
          conceptsRequired: ['arrays', 'binary search', 'matrix'],
          approaches: [
            {
              name: 'Binary Search Per Row',
              intuition: 'Each row is sorted. Use lower_bound to find the first 1 in each row. The count of 1s = n - first_one_index.',
              steps: ['For each row: use lower_bound to find position of first 1.', 'Count 1s = n - position. Track max count and corresponding row index.'],
              complexity: { time: 'O(M log N)', space: 'O(1)' },
              code: `int rowWithMax1s(vector<vector<int>>& mat) {
    int m = mat.size(), n = mat[0].size();
    int maxOnes = 0, rowIdx = -1;
    for (int i = 0; i < m; i++) {
        int pos = lower_bound(mat[i].begin(), mat[i].end(), 1) - mat[i].begin();
        int ones = n - pos;
        if (ones > maxOnes) { maxOnes = ones; rowIdx = i; }
    }
    return rowIdx;
}`,
            },
          ],
          hints: ['Each row is sorted (0s before 1s), so use binary search to find the first 1.', 'Count of 1s in row i = n - (index of first 1).', 'Track the row with the maximum count.'],
          solution: `int rowWithMax1s(vector<vector<int>>&m){int R=m.size(),C=m[0].size(),best=0,idx=-1;for(int i=0;i<R;i++){int p=lower_bound(m[i].begin(),m[i].end(),1)-m[i].begin(),ones=C-p;if(ones>best){best=ones;idx=i;}}return idx;}`,
        },
        {
          id: 'search-2d-matrix-1',
          slug: 'search-2d-matrix-1',
          title: 'Search a 2D Matrix (Rows and Columns Sorted, Rows Continuous)',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Binary Search on Flattened Matrix',
          conceptsRequired: ['arrays', 'binary search', 'matrix'],
          leetcodeUrl: 'https://leetcode.com/problems/search-a-2d-matrix/',
          approaches: [
            {
              name: 'Treat as 1D Sorted Array',
              intuition: 'The matrix rows concatenated form a sorted array of m*n elements. Binary search on indices 0..m*n-1 and convert mid to (mid/n, mid%n).',
              steps: ['lo=0, hi=m*n-1.', 'mid = lo+(hi-lo)/2. row=mid/n, col=mid%n.', 'Compare mat[row][col] with target. Standard binary search.'],
              complexity: { time: 'O(log(M*N))', space: 'O(1)' },
              code: `bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int m = matrix.size(), n = matrix[0].size();
    int lo = 0, hi = m * n - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        int val = matrix[mid / n][mid % n];
        if (val == target) return true;
        else if (val < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return false;
}`,
            },
          ],
          hints: ['The matrix is essentially a sorted 1D array laid out in 2D.', 'Map 1D index to 2D: row = index/cols, col = index%cols.', 'Standard binary search on the flattened index.'],
          solution: `bool searchMatrix(vector<vector<int>>&mat,int t){int m=mat.size(),n=mat[0].size(),lo=0,hi=m*n-1;while(lo<=hi){int mid=lo+(hi-lo)/2,v=mat[mid/n][mid%n];if(v==t)return true;v<t?lo=mid+1:hi=mid-1;}return false;}`,
        },
        {
          id: 'search-2d-matrix-2',
          slug: 'search-2d-matrix-2',
          title: 'Search a 2D Matrix II (Rows and Columns Individually Sorted)',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Staircase Search',
          conceptsRequired: ['arrays', 'matrix', 'binary search'],
          leetcodeUrl: 'https://leetcode.com/problems/search-a-2d-matrix-ii/',
          approaches: [
            {
              name: 'Start from Top-Right Corner',
              intuition: 'Start at top-right. If current > target, move left (eliminates column). If current < target, move down (eliminates row). If equal, found.',
              steps: ['row=0, col=n-1.', 'While row<m and col>=0: compare mat[row][col] with target.', 'If equal: return true. If greater: col--. If less: row++.', 'Return false.'],
              complexity: { time: 'O(M+N)', space: 'O(1)' },
              code: `bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int row = 0, col = matrix[0].size() - 1;
    while (row < matrix.size() && col >= 0) {
        if (matrix[row][col] == target) return true;
        else if (matrix[row][col] > target) col--;
        else row++;
    }
    return false;
}`,
            },
          ],
          hints: ['Start from the top-right corner — it has a unique elimination property.', 'If current > target: the entire column below is too large (move left).', 'If current < target: the entire row to the left is too small (move down).'],
          solution: `bool searchMatrix(vector<vector<int>>&m,int t){int r=0,c=m[0].size()-1;while(r<(int)m.size()&&c>=0){if(m[r][c]==t)return true;m[r][c]>t?c--:r++;}return false;}`,
        },
        {
          id: 'peak-element-2d',
          slug: 'peak-element-2d',
          title: 'Find Peak Element in 2D Matrix',
          type: 'problem',
          difficulty: 'hard',
          pattern: 'Binary Search on Columns',
          conceptsRequired: ['arrays', 'binary search', 'matrix'],
          leetcodeUrl: 'https://leetcode.com/problems/find-a-peak-element-ii/',
          approaches: [
            {
              name: 'Binary Search on Columns — Find Column Max',
              intuition: 'Binary search on mid column. Find the row with maximum element in that column. If it is greater than both neighbors, it is a 2D peak. Otherwise move toward the larger neighbor.',
              steps: ['lo=0, hi=n-1 (columns).', 'mid = column. Find maxRow = row with max element in column mid.', 'If mat[maxRow][mid] is greater than mat[maxRow][mid-1] and mat[maxRow][mid+1]: return [maxRow, mid].', 'Else if left neighbor is larger: hi=mid-1. Else: lo=mid+1.'],
              complexity: { time: 'O(M log N)', space: 'O(1)' },
              code: `vector<int> findPeakGrid(vector<vector<int>>& mat) {
    int m = mat.size(), n = mat[0].size();
    int lo = 0, hi = n - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        int maxRow = 0;
        for (int i = 1; i < m; i++)
            if (mat[i][mid] > mat[maxRow][mid]) maxRow = i;
        bool leftBig = mid > 0 && mat[maxRow][mid-1] > mat[maxRow][mid];
        bool rightBig = mid < n-1 && mat[maxRow][mid+1] > mat[maxRow][mid];
        if (!leftBig && !rightBig) return {maxRow, mid};
        else if (leftBig) hi = mid - 1;
        else lo = mid + 1;
    }
    return {-1, -1};
}`,
            },
          ],
          hints: ['Binary search on columns, not rows.', 'For each candidate column, find the row with the maximum value in that column.', 'Move toward the larger horizontal neighbor to guarantee finding a 2D peak.'],
          solution: `vector<int> findPeakGrid(vector<vector<int>>&m){int R=m.size(),C=m[0].size(),lo=0,hi=C-1;while(lo<=hi){int mid=lo+(hi-lo)/2,mr=0;for(int i=1;i<R;i++)if(m[i][mid]>m[mr][mid])mr=i;bool l=mid>0&&m[mr][mid-1]>m[mr][mid],r=mid<C-1&&m[mr][mid+1]>m[mr][mid];if(!l&&!r)return{mr,mid};else if(l)hi=mid-1;else lo=mid+1;}return{-1,-1};}`,
        },
        {
          id: 'matrix-median',
          slug: 'matrix-median',
          title: 'Median of a Row-Wise Sorted Matrix',
          type: 'problem',
          difficulty: 'hard',
          pattern: 'Binary Search on Value',
          conceptsRequired: ['arrays', 'binary search', 'matrix'],
          approaches: [
            {
              name: 'Binary Search on Value with Count',
              intuition: 'Binary search on the answer value. For a given value v, count elements <= v across all rows using upper_bound. The median is the smallest v where count >= (m*n+1)/2.',
              steps: ['lo=min of all first elements, hi=max of all last elements.', 'For mid: count = sum of upper_bound(row, mid) for each row.', 'If count >= required: hi=mid-1. Else: lo=mid+1.', 'Return lo.'],
              complexity: { time: 'O(M log N log(max-min))', space: 'O(1)' },
              code: `int matrixMedian(vector<vector<int>>& mat) {
    int m = mat.size(), n = mat[0].size();
    int required = (m * n + 1) / 2;
    int lo = INT_MAX, hi = INT_MIN;
    for (auto& row : mat) { lo = min(lo, row[0]); hi = max(hi, row[n-1]); }
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2, cnt = 0;
        for (auto& row : mat)
            cnt += upper_bound(row.begin(), row.end(), mid) - row.begin();
        if (cnt >= required) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
            },
          ],
          hints: ['Binary search on the actual value, not the index.', 'Count elements <= mid using upper_bound on each sorted row.', 'Find the smallest value v where at least (m*n+1)/2 elements are <= v.'],
          solution: `int matrixMedian(vector<vector<int>>&mat){int m=mat.size(),n=mat[0].size(),req=(m*n+1)/2,lo=INT_MAX,hi=INT_MIN;for(auto&r:mat){lo=min(lo,r[0]);hi=max(hi,r[n-1]);}while(lo<hi){int mid=lo+(hi-lo)/2,cnt=0;for(auto&r:mat)cnt+=upper_bound(r.begin(),r.end(),mid)-r.begin();cnt>=req?hi=mid:lo=mid+1;}return lo;}`,
        },
      ],
    },
  ],
};
