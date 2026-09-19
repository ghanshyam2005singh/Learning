import type { DSASection } from '@/types/dsa';

export const stringsSection: DSASection = {
  id: 'strings-basic',
  slug: 'strings-basic',
  title: 'Strings [Basic and Medium]',
  description: 'String manipulation problems covering character frequency, sliding window, palindromes, and classic string algorithms.',
  icon: '"',
  color: 'from-teal-500 to-cyan-600',
  subsections: [
    {
      id: 'strings-theory',
      title: 'Theory',
      topics: [
        {
          id: 'strings-basic-theory',
          slug: 'strings-basic-theory',
          title: 'Strings — Theory (Read This First)',
          type: 'lesson',
          difficulty: 'easy',
          introduction: `\`std::string\` in C++ behaves a lot like a \`vector<char>\` — a **contiguous, indexable sequence of characters**, so most array techniques (two pointers, sliding window, prefix sums) apply to strings exactly the same way. The difference is convenience: strings support \`+\` concatenation, \`==\` comparison, and substring extraction directly. Why this matters: a huge fraction of "hard" string problems are really an array technique wearing a string costume. Real-world usage: text search (Ctrl+F), autocomplete, DNA sequence matching, log parsing, and compiler tokenizing are all built on these exact primitives.`,
          theory: `**Core syntax reference:**\n- \`s.size()\` / \`s.length()\` — number of characters (identical, either works).\n- \`s[i]\` — character at index i (0-based), no bounds checking; \`s.at(i)\` is the same but throws on out-of-range.\n- \`s.substr(start, len)\` — returns a **new** string of len characters from start; omit len to go to the end. Each call allocates — avoid in tight loops.\n- \`s + t\` / \`s += t\` — concatenation, also allocates a new string.\n- \`s == t\`, \`s < t\` — == is exact equality; < is lexicographic (dictionary) order, character by character.\n- \`s.find(t)\` — index of the first occurrence of t in s, or the special constant \`string::npos\` if not found (never compare its result to -1 — npos is a huge unsigned value, not -1).\n- \`reverse(s.begin(), s.end())\` and \`sort(s.begin(), s.end())\` — in-place, from \`<algorithm>\`.\n- \`s[i] - '0'\` — converts a digit character like '7' to the integer 7, because digit characters '0'-'9' have consecutive character codes.\n- \`s.push_back(c)\` / \`s += c\` — append one character.\n- \`to_string(n)\` / \`stoi(s)\` — number ↔ string conversions.\n\n**Recurring string-problem flavors:**\n1. **Pattern matching** — does needle appear inside haystack? Brute force is O(n·m): try every starting position, compare characters until mismatch or full match.\n2. **Palindrome checks** — two pointers from both ends, moving inward, comparing as they go.\n3. **Anagram/frequency problems** — same characters, different order; use a fixed 26-size counter array (or hash map) — increment for one string, decrement for the other, valid if all counts return to zero.\n4. **Substring/window problems** — longest/shortest substring satisfying a condition; this is sliding window (see the Sliding Window theory) wearing a string costume.\n5. **Parsing/building** — converting between string and number representations, splitting on delimiters.\n\n**Why brute-force substring search is O(n·m):** for each of the (n - m + 1) possible starting positions, you may compare up to m characters before a mismatch. For very large inputs, KMP or Rabin-Karp bring this down to O(n + m), but brute force is the correct first tool and usually fits within typical constraints.`,
          codeExamples: [
            { title: 'Simple: check palindrome', language: 'cpp', code: `bool isPalindrome(string s) {\n    int left = 0, right = (int)s.size() - 1;\n    while (left < right) {\n        if (s[left] != s[right]) return false;\n        left++; right--;\n    }\n    return true;\n}`, explanation: 'Classic two-pointer opposite-ends pattern applied directly to a string.' },
            { title: 'Practical: anagram check with a frequency counter', language: 'cpp', code: `bool isAnagram(string s, string t) {\n    if (s.size() != t.size()) return false;\n    vector<int> count(26, 0);\n    for (char c : s) count[c - 'a']++;      // 'a'-'a'=0 ... 'z'-'a'=25, maps letters to indices 0-25\n    for (char c : t) count[c - 'a']--;\n    for (int c : count) if (c != 0) return false;\n    return true;\n}`, explanation: 'One counter array shared by both strings — if they are true anagrams, every count returns exactly to zero.' },
            { title: 'Industry-style: brute-force substring search (LeetCode 28 shape)', language: 'cpp', code: `int strStr(string haystack, string needle) {\n    int n = haystack.size(), m = needle.size();\n    for (int i = 0; i <= n - m; i++) {\n        int j = 0;\n        while (j < m && haystack[i + j] == needle[j]) j++;\n        if (j == m) return i;   // matched all of needle\n    }\n    return -1;\n}`, explanation: 'This is the same core loop used inside real text-search / log-scanning tools before they graduate to KMP/Rabin-Karp for very large inputs.', dryRun: 'haystack="sadbutsad", needle="sad" -> i=0: compare s,a,d all match, j reaches 3==m -> return 0' },
          ],
          commonMistakes: [
            'Indexing s[i] without checking i < s.size() first — out-of-bounds access on std::string is undefined behavior.',
            'Calling .substr() repeatedly inside a loop — each call allocates a new string, turning an O(n) algorithm into O(n^2).',
            's.size() - 1 on an empty string underflows (size_t is unsigned) to a huge number — guard empty strings first.',
            'Comparing s.find(t) to -1 instead of string::npos — find never returns -1.',
            'Forgetting case sensitivity: \'A\' != \'a\' — lowercase everything first if the problem is case-insensitive.',
          ],
          revisionNotes: [
            'std::string ≈ vector<char> — array techniques (two pointer, sliding window, prefix sum) apply directly.',
            'substr/concatenation allocate — avoid in hot loops; prefer index-based comparisons.',
            'string::npos, not -1, is what .find() returns on failure.',
            'Brute-force substring search: O(n*m); KMP/Rabin-Karp: O(n+m) for large inputs.',
          ],
          interviewQuestions: [
            { question: 'Why is calling .substr() inside a loop a performance red flag?', answer: 'Each call to .substr() allocates and copies a brand-new string of the requested length. If done once per iteration of an O(n) loop, and each substring can be up to O(n) long, the total work becomes O(n^2) instead of O(n) — often the actual cause of a "TLE" (time limit exceeded) on string problems that look O(n) at a glance.', difficulty: 'medium' },
            { question: 'How would you check if two strings are anagrams without extra space proportional to the alphabet?', answer: 'Sort both strings and compare for equality (O(n log n) time, O(1) extra space beyond the sort itself) — a valid alternative to the O(n) frequency-counter approach when minimizing auxiliary space matters more than time.', difficulty: 'easy' },
          ],
          keyTakeaways: ['A string is an indexable char sequence — reuse two-pointer and sliding-window thinking directly.', 'Prefer index math over repeated substr()/concatenation in performance-sensitive loops.'],
        },
      ],
    },
    {
      id: 'basic-string-problems',
      title: 'Basic/Easy String Problems',
      topics: [
        {
          id: 'remove-outer-parentheses',
          slug: 'remove-outer-parentheses',
          title: 'Remove Outermost Parentheses',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Stack / Counter',
          conceptsRequired: ['strings', 'stack'],
          leetcodeUrl: 'https://leetcode.com/problems/remove-outermost-parentheses/',
          approaches: [
            {
              name: 'Depth Counter',
              intuition: 'Track nesting depth. When depth > 0, the character is not an outermost parenthesis — include it. Increment depth on ( and decrement on ) after checking.',
              steps: ['depth = 0, result = "".', 'For each char c: if c==(: if depth>0 append; depth++. If c==): depth--; if depth>0 append.'],
              complexity: { time: 'O(N)', space: 'O(N)' },
              code: `string removeOuterParentheses(string s) {
    string res;
    int depth = 0;
    for (char c : s) {
        if (c == '(') { if (depth > 0) res += c; depth++; }
        else { depth--; if (depth > 0) res += c; }
    }
    return res;
}`,
            },
          ],
          hints: ['Track depth: ( increments, ) decrements.', 'Only add characters when depth > 0 (not the outermost).', 'For (, check depth before incrementing. For ), check depth after decrementing.'],
          solution: `string removeOuterParentheses(string s){string r;int d=0;for(char c:s){if(c=='('){if(d>0)r+=c;d++;}else{d--;if(d>0)r+=c;}}return r;}`,
        },
        {
          id: 'reverse-words-palindrome',
          slug: 'reverse-words-palindrome',
          title: 'Reverse Words in a String / Check Palindrome',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Two Pointers / String Processing',
          conceptsRequired: ['strings', 'two pointers'],
          leetcodeUrl: 'https://leetcode.com/problems/reverse-words-in-a-string/',
          approaches: [
            {
              name: 'Split, Reverse, Join',
              intuition: 'Extract words (skip extra spaces), reverse the word order, join with single spaces.',
              steps: ['Use stringstream to extract words.', 'Reverse the word vector.', 'Join with spaces.'],
              complexity: { time: 'O(N)', space: 'O(N)' },
              code: `string reverseWords(string s) {
    istringstream iss(s);
    vector<string> words;
    string word;
    while (iss >> word) words.push_back(word);
    reverse(words.begin(), words.end());
    string res;
    for (int i = 0; i < words.size(); i++) {
        if (i) res += ' ';
        res += words[i];
    }
    return res;
}`,
            },
          ],
          hints: ['Use stringstream to handle multiple spaces easily.', 'Reverse the word list after extracting individual words.', 'Reconstruct with single spaces between words.'],
          solution: `string reverseWords(string s){istringstream iss(s);vector<string>w;string t;while(iss>>t)w.push_back(t);reverse(w.begin(),w.end());string r;for(int i=0;i<(int)w.size();i++){if(i)r+=' ';r+=w[i];}return r;}`,
        },
        {
          id: 'largest-odd-string',
          slug: 'largest-odd-string',
          title: 'Largest Odd Number in a String',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Greedy / String',
          conceptsRequired: ['strings', 'greedy'],
          leetcodeUrl: 'https://leetcode.com/problems/largest-odd-number-in-string/',
          approaches: [
            {
              name: 'Scan from Right for Odd Digit',
              intuition: 'A number is odd iff its last digit is odd. Find the rightmost odd digit and return the prefix up to that position.',
              steps: ['Scan from right.', 'If s[i] is an odd digit (i%2!=0): return s[0..i].', 'Return "".'],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `string largestOddNumber(string num) {
    for (int i = num.size() - 1; i >= 0; i--)
        if ((num[i] - '0') % 2 == 1) return num.substr(0, i + 1);
    return "";
}`,
            },
          ],
          hints: ['A number is odd iff its last digit is odd.', 'Scan from right to find the rightmost odd digit.', 'Return the prefix ending at that digit.'],
          solution: `string largestOddNumber(string n){for(int i=n.size()-1;i>=0;i--)if((n[i]-'0')%2)return n.substr(0,i+1);return "";}`,
        },
        {
          id: 'longest-common-prefix',
          slug: 'longest-common-prefix',
          title: 'Longest Common Prefix',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'String',
          conceptsRequired: ['strings'],
          leetcodeUrl: 'https://leetcode.com/problems/longest-common-prefix/',
          approaches: [
            {
              name: 'Vertical Scanning',
              intuition: 'Compare characters column by column. Stop when mismatch found or any string ends.',
              steps: ['For each position i of strs[0]: compare strs[0][i] with strs[j][i] for all j.', 'If mismatch or out of bounds: return strs[0][0..i-1].'],
              complexity: { time: 'O(S) where S = total chars', space: 'O(1)' },
              code: `string longestCommonPrefix(vector<string>& strs) {
    if (strs.empty()) return "";
    for (int i = 0; i < strs[0].size(); i++)
        for (int j = 1; j < strs.size(); j++)
            if (i >= strs[j].size() || strs[j][i] != strs[0][i])
                return strs[0].substr(0, i);
    return strs[0];
}`,
            },
          ],
          hints: ['Compare character by character across all strings simultaneously.', 'Stop at the first mismatch in any string.', 'Return the prefix of the first string up to (not including) the mismatch.'],
          solution: `string longestCommonPrefix(vector<string>&s){if(s.empty())return"";for(int i=0;i<(int)s[0].size();i++)for(int j=1;j<(int)s.size();j++)if(i>=(int)s[j].size()||s[j][i]!=s[0][i])return s[0].substr(0,i);return s[0];}`,
        },
        {
          id: 'isomorphic-strings',
          slug: 'isomorphic-strings',
          title: 'Isomorphic Strings',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Hashing',
          conceptsRequired: ['strings', 'hash map'],
          leetcodeUrl: 'https://leetcode.com/problems/isomorphic-strings/',
          approaches: [
            {
              name: 'Bidirectional Character Mapping',
              intuition: 'Maintain two maps: s→t and t→s. For each pair (s[i], t[i]), check consistency both ways.',
              steps: ['For each i: if s[i] already maps to a different t[i]: return false. If t[i] already maps to a different s[i]: return false.', 'Update both maps. Return true.'],
              complexity: { time: 'O(N)', space: 'O(1) (max 256 chars)' },
              code: `bool isIsomorphic(string s, string t) {
    unordered_map<char,char> st, ts;
    for (int i = 0; i < s.size(); i++) {
        if (st.count(s[i]) && st[s[i]] != t[i]) return false;
        if (ts.count(t[i]) && ts[t[i]] != s[i]) return false;
        st[s[i]] = t[i];
        ts[t[i]] = s[i];
    }
    return true;
}`,
            },
          ],
          hints: ['Maintain two maps: one for s→t and one for t→s.', 'Both mappings must be consistent — one-to-one correspondence.', 'Two different characters in s cannot map to the same character in t.'],
          solution: `bool isIsomorphic(string s,string t){unordered_map<char,char>st,ts;for(int i=0;i<(int)s.size();i++){if(st.count(s[i])&&st[s[i]]!=t[i])return false;if(ts.count(t[i])&&ts[t[i]]!=s[i])return false;st[s[i]]=t[i];ts[t[i]]=s[i];}return true;}`,
        },
        {
          id: 'rotate-string',
          slug: 'rotate-string',
          title: 'Rotate String',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'String / Pattern Matching',
          conceptsRequired: ['strings'],
          leetcodeUrl: 'https://leetcode.com/problems/rotate-string/',
          approaches: [
            {
              name: 'Double Concatenation',
              intuition: 'All rotations of s appear as substrings of s+s. Check if goal is a substring of s+s.',
              steps: ['If len(s) != len(goal): return false.', 'Return (s+s).find(goal) != string::npos.'],
              complexity: { time: 'O(N²) naive, O(N) with KMP', space: 'O(N)' },
              code: `bool rotateString(string s, string goal) {
    if (s.size() != goal.size()) return false;
    return (s + s).find(goal) != string::npos;
}`,
            },
          ],
          hints: ['Any rotation of s is a substring of s+s.', 'Check if goal appears in the doubled string.', 'Lengths must match first.'],
          solution: `bool rotateString(string s,string g){return s.size()==g.size()&&(s+s).find(g)!=string::npos;}`,
        },
        {
          id: 'check-anagram',
          slug: 'check-anagram',
          title: 'Check if Two Strings are Anagrams',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Frequency Count',
          conceptsRequired: ['strings', 'hashing'],
          leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/',
          approaches: [
            {
              name: 'Frequency Array',
              intuition: 'Count character frequencies in s, decrement for t. If any frequency is non-zero at the end, not anagrams.',
              steps: ['If lengths differ: return false.', 'freq[26] array: increment for s, decrement for t.', 'If all freq[i]==0: anagram.'],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `bool isAnagram(string s, string t) {
    if (s.size() != t.size()) return false;
    int freq[26] = {};
    for (char c : s) freq[c - 'a']++;
    for (char c : t) freq[c - 'a']--;
    for (int f : freq) if (f != 0) return false;
    return true;
}`,
            },
          ],
          hints: ['Anagrams have identical character frequency distributions.', 'Use a size-26 array for lowercase letters.', 'Alternatively, sort both strings and compare — O(N log N).'],
          solution: `bool isAnagram(string s,string t){if(s.size()!=t.size())return false;int f[26]={};for(char c:s)f[c-'a']++;for(char c:t)f[c-'a']--;for(int x:f)if(x)return false;return true;}`,
        },
      ],
    },
    {
      id: 'medium-string-problems',
      title: 'Medium String Problems',
      topics: [
        {
          id: 'sort-chars-by-frequency',
          slug: 'sort-chars-by-frequency',
          title: 'Sort Characters by Frequency',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Frequency Count + Sorting',
          conceptsRequired: ['strings', 'hashing', 'sorting'],
          leetcodeUrl: 'https://leetcode.com/problems/sort-characters-by-frequency/',
          approaches: [
            {
              name: 'Frequency Map + Bucket Sort',
              intuition: 'Count character frequencies, then sort characters by frequency in descending order, and rebuild the string.',
              steps: ['Count frequency of each character.', 'Create list of (freq, char) pairs. Sort descending by freq.', 'Append each character freq times to the result.'],
              complexity: { time: 'O(N + K log K) where K=distinct chars', space: 'O(N)' },
              code: `string frequencySort(string s) {
    unordered_map<char,int> freq;
    for (char c : s) freq[c]++;
    vector<pair<int,char>> v;
    for (auto& [c, f] : freq) v.push_back({f, c});
    sort(v.rbegin(), v.rend());
    string res;
    for (auto& [f, c] : v) res += string(f, c);
    return res;
}`,
            },
          ],
          hints: ['Count frequencies first.', 'Sort the distinct characters by frequency descending.', 'Rebuild string by repeating each character its frequency times.'],
          solution: `string frequencySort(string s){unordered_map<char,int>f;for(char c:s)f[c]++;vector<pair<int,char>>v;for(auto&[c,x]:f)v.push_back({x,c});sort(v.rbegin(),v.rend());string r;for(auto&[x,c]:v)r+=string(x,c);return r;}`,
        },
        {
          id: 'max-nesting-depth',
          slug: 'max-nesting-depth',
          title: 'Maximum Nesting Depth of Parentheses',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Stack / Counter',
          conceptsRequired: ['strings'],
          leetcodeUrl: 'https://leetcode.com/problems/maximum-nesting-depth-of-the-parentheses/',
          approaches: [
            {
              name: 'Depth Counter',
              intuition: 'Track current depth. Record maximum depth seen.',
              steps: ['depth=0, maxDepth=0.', 'For ( : depth++, maxDepth=max(maxDepth,depth). For ) : depth--.'],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `int maxDepth(string s) {
    int depth = 0, maxD = 0;
    for (char c : s) {
        if (c == '(') maxD = max(maxD, ++depth);
        else if (c == ')') depth--;
    }
    return maxD;
}`,
            },
          ],
          hints: ['Track current depth with a counter.', 'Update max depth whenever depth increases.', 'Decrement depth on closing parenthesis.'],
          solution: `int maxDepth(string s){int d=0,mx=0;for(char c:s){if(c=='(')mx=max(mx,++d);else if(c==')')d--;}return mx;}`,
        },
        {
          id: 'roman-to-integer',
          slug: 'roman-to-integer',
          title: 'Roman to Integer',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'String / Greedy',
          conceptsRequired: ['strings', 'hash map'],
          leetcodeUrl: 'https://leetcode.com/problems/roman-to-integer/',
          approaches: [
            {
              name: 'Right-to-Left Scan with Subtraction Rule',
              intuition: 'Scan right to left. If current value < previous value (e.g., I before V), subtract it. Otherwise add it.',
              steps: ['Map each Roman symbol to its value.', 'Scan from right. If val[s[i]] < val[s[i+1]]: subtract. Else: add.', 'Return total.'],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `int romanToInt(string s) {
    unordered_map<char,int> val = {{'I',1},{'V',5},{'X',10},{'L',50},{'C',100},{'D',500},{'M',1000}};
    int res = val[s.back()];
    for (int i = s.size() - 2; i >= 0; i--) {
        if (val[s[i]] < val[s[i+1]]) res -= val[s[i]];
        else res += val[s[i]];
    }
    return res;
}`,
            },
          ],
          hints: ['If a smaller value precedes a larger value (e.g., IV), subtract it.', 'Scan right to left so you always know the "next" value.', 'Start the total with the last character value.'],
          solution: `int romanToInt(string s){unordered_map<char,int>v={{'I',1},{'V',5},{'X',10},{'L',50},{'C',100},{'D',500},{'M',1000}};int r=v[s.back()];for(int i=s.size()-2;i>=0;i--)v[s[i]]<v[s[i+1]]?r-=v[s[i]]:r+=v[s[i]];return r;}`,
        },
        {
          id: 'string-to-atoi',
          slug: 'string-to-atoi',
          title: 'String to Integer (atoi)',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'String Parsing',
          conceptsRequired: ['strings', 'math'],
          leetcodeUrl: 'https://leetcode.com/problems/string-to-integer-atoi/',
          approaches: [
            {
              name: 'Careful State Machine',
              intuition: 'Skip leading whitespace, handle optional sign, read digits, clamp to INT_MIN/INT_MAX on overflow.',
              steps: ['Skip leading spaces.', 'Read optional + or -.', 'Read digits, building number (check overflow before adding each digit).', 'Return sign * min(number, INT_MAX).'],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `int myAtoi(string s) {
    int i = 0, n = s.size(), sign = 1;
    long res = 0;
    while (i < n && s[i] == ' ') i++;
    if (i < n && (s[i] == '+' || s[i] == '-')) {
        if (s[i] == '-') sign = -1;
        i++;
    }
    while (i < n && isdigit(s[i])) {
        res = res * 10 + (s[i++] - '0');
        if (res * sign > INT_MAX) return INT_MAX;
        if (res * sign < INT_MIN) return INT_MIN;
    }
    return sign * res;
}`,
            },
          ],
          hints: ['Follow 4 steps: skip spaces, read sign, read digits, clamp.', 'Use long long to detect overflow before it happens.', 'Stop as soon as a non-digit is encountered.'],
          solution: `int myAtoi(string s){int i=0,n=s.size(),sign=1;long r=0;while(i<n&&s[i]==' ')i++;if(i<n&&(s[i]=='+'||s[i]=='-')){if(s[i]=='-')sign=-1;i++;}while(i<n&&isdigit(s[i])){r=r*10+(s[i++]-'0');if(r*sign>INT_MAX)return INT_MAX;if(r*sign<(long)INT_MIN)return INT_MIN;}return sign*r;}`,
        },
        {
          id: 'count-substrings',
          slug: 'count-substrings',
          title: 'Count Palindromic Substrings',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Expand Around Center',
          conceptsRequired: ['strings', 'two pointers'],
          leetcodeUrl: 'https://leetcode.com/problems/palindromic-substrings/',
          approaches: [
            {
              name: 'Expand Around Center',
              intuition: 'Every palindrome has a center. Expand from each possible center (2n-1 centers for odd and even length palindromes) and count valid palindromes.',
              steps: ['For each center (odd: i,i and even: i,i+1): expand while chars match.', 'Count each valid expansion.'],
              complexity: { time: 'O(N²)', space: 'O(1)' },
              code: `int countSubstrings(string s) {
    int n = s.size(), count = 0;
    auto expand = [&](int l, int r) {
        while (l >= 0 && r < n && s[l] == s[r]) { count++; l--; r++; }
    };
    for (int i = 0; i < n; i++) { expand(i, i); expand(i, i+1); }
    return count;
}`,
            },
          ],
          hints: ['There are 2n-1 possible palindrome centers (n odd, n-1 even).', 'Expand from each center while characters match.', 'Each valid expansion contributes 1 to the count.'],
          solution: `int countSubstrings(string s){int n=s.size(),cnt=0;auto ex=[&](int l,int r){while(l>=0&&r<n&&s[l]==s[r]){cnt++;l--;r++;}};for(int i=0;i<n;i++){ex(i,i);ex(i,i+1);}return cnt;}`,
        },
        {
          id: 'longest-palindromic-substring',
          slug: 'longest-palindromic-substring',
          title: 'Longest Palindromic Substring',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Expand Around Center',
          conceptsRequired: ['strings', 'two pointers', 'dynamic programming'],
          leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-substring/',
          approaches: [
            {
              name: 'Expand Around Center',
              intuition: 'For each center, expand outward while characters match. Track the start and length of the longest palindrome found.',
              steps: ['For each center (2n-1 total): expand until mismatch.', 'If this palindrome length > best: update start and maxLen.', 'Return s.substr(start, maxLen).'],
              complexity: { time: 'O(N²)', space: 'O(1)' },
              code: `string longestPalindrome(string s) {
    int n = s.size(), start = 0, maxLen = 1;
    auto expand = [&](int l, int r) {
        while (l >= 0 && r < n && s[l] == s[r]) { l--; r++; }
        if (r - l - 1 > maxLen) { maxLen = r - l - 1; start = l + 1; }
    };
    for (int i = 0; i < n; i++) { expand(i, i); expand(i, i+1); }
    return s.substr(start, maxLen);
}`,
            },
          ],
          hints: ['Expand from every possible center.', 'After the while loop, l and r are one step past the palindrome boundaries.', 'Length = r - l - 1, start = l + 1.'],
          solution: `string longestPalindrome(string s){int n=s.size(),st=0,ml=1;auto ex=[&](int l,int r){while(l>=0&&r<n&&s[l]==s[r]){l--;r++;}if(r-l-1>ml){ml=r-l-1;st=l+1;}};for(int i=0;i<n;i++){ex(i,i);ex(i,i+1);}return s.substr(st,ml);}`,
        },
        {
          id: 'sum-beauty-substrings',
          slug: 'sum-beauty-substrings',
          title: 'Sum of Beauty of All Substrings',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Frequency Count',
          conceptsRequired: ['strings', 'hashing'],
          leetcodeUrl: 'https://leetcode.com/problems/sum-of-beauty-of-all-substrings/',
          approaches: [
            {
              name: 'Fixed Left, Expand Right with Frequency Array',
              intuition: 'Fix left boundary. Expand right boundary and maintain frequency array. Beauty = max_freq - min_freq.',
              steps: ['For each left i: reset freq array.', 'For right j from i to n-1: update freq[s[j]-a].', 'Compute max and min frequency. Add max-min to total.'],
              complexity: { time: 'O(N² * 26)', space: 'O(26)' },
              code: `int beautySum(string s) {
    int n = s.size(), res = 0;
    for (int i = 0; i < n; i++) {
        int freq[26] = {};
        for (int j = i; j < n; j++) {
            freq[s[j] - 'a']++;
            int maxF = *max_element(freq, freq + 26);
            int minF = INT_MAX;
            for (int f : freq) if (f > 0) minF = min(minF, f);
            res += maxF - minF;
        }
    }
    return res;
}`,
            },
          ],
          hints: ['Fix the left index and expand right, maintaining a frequency array.', 'Beauty = max_frequency - min_frequency (counting only present characters).', 'O(N²) substrings × O(26) for min/max = O(26N²) — acceptable.'],
          solution: `int beautySum(string s){int n=s.size(),res=0;for(int i=0;i<n;i++){int f[26]={};for(int j=i;j<n;j++){f[s[j]-'a']++;int mx=*max_element(f,f+26),mn=INT_MAX;for(int x:f)if(x)mn=min(mn,x);res+=mx-mn;}}return res;}`,
        },
        {
          id: 'reverse-every-word',
          slug: 'reverse-every-word',
          title: 'Reverse Each Word in a String',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'String Processing',
          conceptsRequired: ['strings'],
          approaches: [
            {
              name: 'Two-Pointer Word Reversal',
              intuition: 'Find the boundaries of each word and reverse the characters within each word in-place.',
              steps: ['Track start of each word.', 'On space or end: reverse s[start..i-1]. Reset start.'],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `string reverseEachWord(string s) {
    int n = s.size(), start = 0;
    for (int i = 0; i <= n; i++) {
        if (i == n || s[i] == ' ') {
            reverse(s.begin() + start, s.begin() + i);
            start = i + 1;
        }
    }
    return s;
}`,
            },
          ],
          hints: ['Find word boundaries by looking for spaces.', 'Reverse characters within each word boundary in-place.', 'Handle the last word (no trailing space) by reversing when i == n.'],
          solution: `string reverseEachWord(string s){int n=s.size(),st=0;for(int i=0;i<=n;i++)if(i==n||s[i]==' '){reverse(s.begin()+st,s.begin()+i);st=i+1;}return s;}`,
        },
      ],
    },
  ],
};
