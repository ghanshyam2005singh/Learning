import type { DSASection } from '@/types/dsa';

const makeProb = (id: string, title: string, diff: 'easy'|'medium'|'hard', pattern: string, approaches: string, hints: string[], leetcode?: string) => ({
  id, slug: id, title, type: 'problem' as const, difficulty: diff,
  pattern,
  approaches: [{ name: 'Optimal', intuition: approaches, steps: [], complexity: { time: 'O(N)', space: 'O(N)' }, code: '' }],
  hints,
  solution: '',
  ...(leetcode ? { leetcodeUrl: leetcode } : {}),
  keyTakeaways: [],
});

export const stacksQueuesSection: DSASection = {
  id: 'stacks-queues', slug: 'stacks-queues',
  title: 'Stack and Queues [Learning, Pre-In-Post-fix, Monotonic Stack, Implementation]',
  description: 'Master stack and queue internals, expression conversion, monotonic stacks, and advanced cache implementations.',
  icon: '⟂', color: 'from-slate-500 to-gray-600',
  subsections: [
    {
      id: 'sq-learning', title: 'Learning',
      topics: [
        { id:'stack-array', slug:'stack-array', title:'Implement Stack using Arrays', type:'lesson', difficulty:'easy', introduction:'A stack is a LIFO structure. Implement using an array with a top pointer.', theory:'Push: arr[++top]=val. Pop: return arr[top--]. Peek: arr[top]. Empty: top==-1. Overflow: top==MAX-1.', codeExamples:[{title:'Array Stack',language:'cpp',code:`class Stack {\n    int arr[1000], top = -1;\npublic:\n    void push(int x) { arr[++top] = x; }\n    int pop() { return arr[top--]; }\n    int peek() { return arr[top]; }\n    bool empty() { return top == -1; }\n};`}], keyTakeaways:['top=-1 for empty. Push=++top. Pop=top--.'] },
        { id:'queue-array', slug:'queue-array', title:'Implement Queue using Arrays', type:'lesson', difficulty:'easy', introduction:'A queue is FIFO. Use front and rear pointers. Circular array avoids wasted space.', theory:'Enqueue: arr[++rear]=val. Dequeue: return arr[front++]. Circular: use % SIZE. Front==rear+1 (circular) means full.', codeExamples:[{title:'Circular Queue',language:'cpp',code:`class Queue {\n    int arr[1000], front=0, rear=-1, sz=0;\npublic:\n    void enqueue(int x){arr[++rear%1000]=x;sz++;}\n    int dequeue(){sz--;return arr[front++%1000];}\n    bool empty(){return sz==0;}\n};`}], keyTakeaways:['FIFO. Circular array prevents wasted space.'] },
        makeProb('stack-using-queue','Implement Stack using Queue','easy','Stack/Queue','Use two queues. For push: enqueue to q2, move all q1 to q2, swap. Top is always at front.',['Use 2 queues','Move all elements to make new element at front','Each push is O(N)'],'https://leetcode.com/problems/implement-stack-using-queues/'),
        makeProb('queue-using-stack','Implement Queue using Stack','easy','Stack/Queue','Use 2 stacks. Push to s1. For pop/peek: if s2 empty, move all s1 to s2. Pop from s2.',['Use 2 stacks s1 (inbox) and s2 (outbox)','Move s1→s2 when s2 is empty','Amortized O(1) per operation'],'https://leetcode.com/problems/implement-queue-using-stacks/'),
        { id:'stack-ll', slug:'stack-ll', title:'Implement Stack using LinkedList', type:'lesson', difficulty:'easy', introduction:'Using a linked list, both push and pop are O(1) by inserting/removing at the head.', theory:'Push = insert at head. Pop = remove head. No size limit (dynamic). Uses more memory per element due to node overhead.', codeExamples:[{title:'LL Stack',language:'cpp',code:`struct Node { int val; Node* next; };\nclass Stack {\n    Node* head = nullptr;\npublic:\n    void push(int x) { head = new Node{x, head}; }\n    int pop() { int v=head->val; Node*t=head; head=head->next; delete t; return v; }\n};`}], keyTakeaways:['LL stack: push/pop at head = O(1). No overflow.'] },
        { id:'queue-ll', slug:'queue-ll', title:'Implement Queue using LinkedList', type:'lesson', difficulty:'easy', introduction:'Using a linked list with head (front) and tail (rear) pointers, enqueue and dequeue are both O(1).', theory:'Enqueue: add to tail. Dequeue: remove from head. Maintain both head and tail pointers.', codeExamples:[{title:'LL Queue',language:'cpp',code:`class Queue {\n    Node *head=nullptr, *tail=nullptr;\npublic:\n    void enqueue(int x){\n        Node* n=new Node{x,nullptr};\n        if(!tail){head=tail=n;return;}\n        tail->next=n; tail=n;\n    }\n    int dequeue(){int v=head->val;Node*t=head;head=head->next;if(!head)tail=nullptr;delete t;return v;}\n};`}], keyTakeaways:['LL queue: enqueue at tail, dequeue from head — both O(1).'] },
        makeProb('balanced-parentheses','Balanced Parentheses','easy','Stack','Push opening brackets. On closing bracket, check top of stack matches. Empty at end = balanced.',['Push ( [ { onto stack','On closing, check top matches','If stack empty at end → balanced'],'https://leetcode.com/problems/valid-parentheses/'),
        makeProb('min-stack','Implement Min Stack','hard','Stack','Use two stacks: main stack and min-stack. Push to both; min-stack only pushes if new val <= current min.',['Maintain a parallel min-stack','On push: if val <= minStack.top(), push to minStack too','On pop: if val == minStack.top(), pop minStack too'],'https://leetcode.com/problems/min-stack/'),
      ],
    },
    {
      id: 'prefix-infix-postfix', title: 'Prefix, Infix, PostFix Conversion Problems',
      topics: [
        { id:'infix-to-postfix', slug:'infix-to-postfix', title:'Infix to Postfix Conversion', type:'problem', difficulty:'medium', pattern:'Stack',
          problemStatement:'Convert an infix expression (e.g., "a+b*c") to postfix (e.g., "abc*+").',
          examples:[{input:'"a+b*c"', output:'"abc*+"'}],
          approaches:[{name:'Shunting-yard algorithm',intuition:'Operands go directly to output. Operators go to stack (pop higher/equal precedence first). Parentheses control grouping.',steps:['For each token','If operand: output','If (: push','If ): pop to ) and discard parens','If operator: pop higher/equal precedence, then push'],complexity:{time:'O(N)',space:'O(N)'},code:`string toPostfix(string s) {\n    stack<char> st;\n    string out;\n    auto prec = [](char c) {\n        if (c=='^') return 3;\n        if (c=='*'||c=='/') return 2;\n        if (c=='+'||c=='-') return 1;\n        return 0;\n    };\n    for (char c : s) {\n        if (isalnum(c)) { out += c; }\n        else if (c == '(') { st.push(c); }\n        else if (c == ')') {\n            while (st.top() != '(') { out += st.top(); st.pop(); }\n            st.pop();\n        } else {\n            while (!st.empty() && prec(st.top()) >= prec(c)) { out += st.top(); st.pop(); }\n            st.push(c);\n        }\n    }\n    while (!st.empty()) { out += st.top(); st.pop(); }\n    return out;\n}`}],
          hints:['Operands go directly to output.','Pop stack when stack top has higher or equal precedence.','Parentheses: push ( and pop until ( on )'],
          solution:'// Shunting-yard as above', keyTakeaways:['Shunting-yard: operators to stack, operands to output, precedence controls popping.'] },
        makeProb('prefix-to-infix','Prefix to Infix','medium','Stack','Scan right to left. Operand → push. Operator → pop 2 operands, form (op1 op op2), push.',['Scan right to left for prefix','Operands: push','Operators: pop 2, form "(a op b)", push result']),
        makeProb('prefix-to-postfix','Prefix to Postfix','medium','Stack','Scan right to left. Operand → push. Operator → pop 2, form "AB op", push.',['Scan right to left','Operands push','Operator: pop a and b, push a+b+op']),
        makeProb('postfix-to-prefix','Postfix to Prefix','medium','Stack','Scan left to right. Operand → push. Operator → pop 2, form "op a b", push.',['Scan left to right','Operand: push','Operator: pop a,b; push op+b+a (note order)']),
        makeProb('postfix-to-infix','Postfix to Infix','easy','Stack','Scan left to right. Operand → push. Operator → pop 2, form "(a op b)", push.',['Scan left to right','Operand: push','Operator: pop a,b; push (b op a)']),
        makeProb('infix-to-prefix','Infix to Prefix','medium','Stack','Reverse infix. Swap ( and ). Convert to postfix. Reverse result.',['Reverse the infix expression','Swap ( with ) and vice versa','Apply infix-to-postfix, then reverse the output']),
      ],
    },
    {
      id: 'monotonic-stack', title: 'Monotonic Stack/Queue Problems [VVV. Imp]',
      topics: [
        makeProb('next-greater-element','Next Greater Element','medium','Monotonic Stack (Decreasing)','Maintain decreasing monotonic stack. When current > stack top, top found its NGE.',['Maintain decreasing stack','When arr[i] > stack.top(), pop: NGE of top is arr[i]','Push current index'],'https://leetcode.com/problems/next-greater-element-i/'),
        makeProb('next-greater-element-2','Next Greater Element II (Circular)','medium','Monotonic Stack','Same as NGE but circular. Iterate 2n times using i%n.',['Iterate 2*n times (for circularity)','Use index i%n to access array','Same decreasing stack logic'],'https://leetcode.com/problems/next-greater-element-ii/'),
        makeProb('next-smaller-element','Next Smaller Element','medium','Monotonic Stack (Increasing)','Maintain increasing stack. When current < stack.top(), pop: NSE of top is current.',['Maintain increasing stack (instead of decreasing)','When arr[i] < top, pop: arr[i] is NSE of top','Default NSE = -1 if stack not emptied']),
        makeProb('greater-elements-right','Count of Greater Elements to Right','easy','Monotonic Stack','For each element, count elements to its right that are greater. NGE-based or merge sort.',['NGE approach: modify next-greater to count','Merge sort approach O(N log N)','BIT/Segment tree approach also works']),
        makeProb('trapping-rainwater','Trapping Rainwater','hard','Monotonic Stack / Two Pointer','Water at i = min(maxLeft[i], maxRight[i]) - height[i]. Precompute with prefix/suffix arrays.',['Water trapped at each index = min(maxLeft, maxRight) - height','Precompute leftMax and rightMax arrays','Two pointer O(1) space: left and right pointers'],'https://leetcode.com/problems/trapping-rain-water/'),
        makeProb('sum-subarray-minimums','Sum of Subarray Minimums','medium','Monotonic Stack','For each element, find how many subarrays it is the minimum of using NSE and PSE.',['Find Previous Smaller Element (PSE) and Next Smaller Element (NSE)','Element a[i] is min of (i-PSE[i]) * (NSE[i]-i) subarrays','Multiply count by value, sum all'],'https://leetcode.com/problems/sum-of-subarray-minimums/'),
        makeProb('asteroid-collision','Asteroid Collision','medium','Stack Simulation','Positive asteroids move right, negative move left. Collision when negative follows positive on stack.',['Positive: push to stack','Negative: while stack top is positive, compare sizes','If stack empty or top negative: push current'],'https://leetcode.com/problems/asteroid-collision/'),
        makeProb('sum-subarray-ranges','Sum of Subarray Ranges','medium','Monotonic Stack','Range = max-min for each subarray. Sum ranges = sum of all subarray maxes - sum of all subarray mins.',['Sum of ranges = sum(subarray maxes) - sum(subarray mins)','Each can be computed with monotonic stack (like subarray minimums)','Total O(N) solution'],'https://leetcode.com/problems/sum-of-subarray-ranges/'),
        makeProb('remove-k-digits','Remove K Digits to Get Smallest Number','medium','Monotonic Stack (Increasing)','Maintain increasing stack. Pop when current digit < top (greedy: remove larger early digits).',['Maintain increasing monotonic stack','When digit < stack top, pop (remove larger digit)','Remove remaining if k > 0 at end'],'https://leetcode.com/problems/remove-k-digits/'),
        { id:'largest-rectangle-histogram', slug:'largest-rectangle-histogram', title:'Largest Rectangle in a Histogram', type:'problem', difficulty:'hard', pattern:'Monotonic Stack',
          problemStatement:'Find the largest rectangle that can be formed in a histogram.',
          examples:[{input:'heights=[2,1,5,6,2,3]', output:'10', explanation:'Rectangle using bars of height 5 and 6.'}],
          approaches:[{name:'Monotonic Stack (PSE + NSE)',intuition:'For each bar, find how far left and right it can extend (using PSE and NSE). Width * height gives area.',steps:['Find PSE[i] = index of previous smaller bar','Find NSE[i] = index of next smaller bar','Area[i] = height[i] * (NSE[i] - PSE[i] - 1)','Return max area'],complexity:{time:'O(N)',space:'O(N)'},code:`int largestRectangle(vector<int>& h) {\n    int n = h.size();\n    vector<int> PSE(n), NSE(n);\n    stack<int> st;\n    for (int i = 0; i < n; i++) {\n        while (!st.empty() && h[st.top()] >= h[i]) st.pop();\n        PSE[i] = st.empty() ? -1 : st.top();\n        st.push(i);\n    }\n    while (!st.empty()) st.pop();\n    for (int i = n-1; i >= 0; i--) {\n        while (!st.empty() && h[st.top()] >= h[i]) st.pop();\n        NSE[i] = st.empty() ? n : st.top();\n        st.push(i);\n    }\n    int ans = 0;\n    for (int i = 0; i < n; i++)\n        ans = max(ans, h[i] * (NSE[i] - PSE[i] - 1));\n    return ans;\n}`}],
          hints:['For each bar, find how far left and right it can extend as the shortest bar.','Use PSE (previous smaller) and NSE (next smaller) stacks.','Area = height * (NSE - PSE - 1).'],
          solution:'// PSE + NSE monotonic stack as above', leetcodeUrl:'https://leetcode.com/problems/largest-rectangle-in-histogram/', keyTakeaways:['Histogram: for each bar, extend using PSE and NSE. Classic monotonic stack problem.'] },
        makeProb('max-rectangle-1s','Maximum Rectangle of all 1s (Histogram approach)','hard','Monotonic Stack','Treat each row as a histogram base. For each row, compute cumulative heights and apply largest rectangle in histogram.',['Build histogram row by row (if cell==1, height++, else height=0)','Apply largest-rectangle-in-histogram on each row','O(M*N) overall'],'https://leetcode.com/problems/maximal-rectangle/'),
      ],
    },
    {
      id: 'sq-implementation', title: 'Implementation Problems',
      topics: [
        makeProb('sliding-window-maximum','Sliding Window Maximum','hard','Monotonic Deque','Maintain a decreasing deque of indices. Front is always the max. Remove elements outside the window.',['Use deque of indices (decreasing)','Remove front if out of window','Remove from back while back < current','Front is always the max in window'],'https://leetcode.com/problems/sliding-window-maximum/'),
        makeProb('stock-span','Stock Span Problem','hard','Monotonic Stack','Span = number of consecutive days before today with price <= today. Use decreasing stack of prices.',['Monotonic decreasing stack of (price, span)','When current >= stack.top().price, pop and accumulate span','Push current with accumulated span']),
        makeProb('celebrity-problem','Celebrity Problem','hard','Stack Elimination','A celebrity knows nobody but is known by everyone. Eliminate non-celebrities using stack.',['Push all n people to stack','Pop two: if a knows b, a is not celeb; else b is not celeb','Verify remaining candidate']),
        makeProb('lru-cache','LRU Cache','medium','HashMap + Doubly Linked List','HashMap for O(1) access. DLL for O(1) LRU eviction. Most recently used at head.',['Use HashMap<key, DLL_node> for O(1) lookup','DLL maintains access order (most recent at head)','On get/put: move node to head. On overflow: remove tail.'],'https://leetcode.com/problems/lru-cache/'),
        makeProb('lfu-cache','LFU Cache','hard','HashMap + MinHeap or Multiple DLLs','Track frequency of each key. On eviction, remove key with lowest frequency (LRU among ties).',['HashMap<key,{val,freq}>. HashMap<freq,DLL of keys>','Track minFreq','On access: move from freq list to freq+1 list'],'https://leetcode.com/problems/lfu-cache/'),
      ],
    },
  ],
};
