import type { DSASection } from '@/types/dsa';

export const linkedListSection: DSASection = {
  id: 'linked-list',
  slug: 'linked-list',
  title: 'Learn LinkedList',
  description: 'From basic node operations to advanced techniques — tortoise-hare, reversal, cycle detection, merging, and flattening.',
  icon: '↔',
  color: 'from-rose-500 to-pink-600',
  subsections: [
    {
      id: 'learn-1d-ll',
      title: 'Learn 1D Linked List',
      topics: [
        {
          id: 'll-intro',
          slug: 'll-intro',
          title: 'Introduction to Linked Lists',
          type: 'lesson',
          difficulty: 'easy',
          introduction: 'A linked list is a linear data structure where elements (nodes) are stored in separate memory locations, each holding data and a pointer to the next node. Unlike arrays, linked lists allow O(1) insertion and deletion at known positions without shifting elements.',
          theory: `A singly linked list node has two fields: data and next pointer.

Head pointer: points to the first node.
Tail: last node with next = nullptr.

Advantages over arrays:
- Dynamic size — no fixed allocation
- O(1) insert/delete at head
- No memory waste from pre-allocation

Disadvantages:
- O(N) access (no random access)
- Extra memory for pointer storage
- Poor cache locality

Types:
1. Singly Linked List — next pointer only
2. Doubly Linked List — prev and next pointers
3. Circular Linked List — tail points to head`,
          codeExamples: [
            {
              title: 'Linked List Node Definition and Basic Operations',
              language: 'cpp',
              code: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int v) : val(v), next(nullptr) {}
};

// Create list from vector
ListNode* createList(vector<int>& arr) {
    if (arr.empty()) return nullptr;
    ListNode* head = new ListNode(arr[0]);
    ListNode* curr = head;
    for (int i = 1; i < arr.size(); i++) {
        curr->next = new ListNode(arr[i]);
        curr = curr->next;
    }
    return head;
}

// Print list
void printList(ListNode* head) {
    while (head) {
        cout << head->val;
        if (head->next) cout << " -> ";
        head = head->next;
    }
    cout << endl;
}`,
              explanation: 'Standard node definition and helper functions used throughout all LL problems.',
            },
          ],
          keyTakeaways: [
            'Linked lists excel at frequent insertions/deletions at the front.',
            'Always handle the nullptr (empty list) case.',
            'Traversal is O(N) — there is no random access.',
          ],
          revisionNotes: ['Node = data + next pointer', 'Head = first node, next of last = nullptr', 'O(1) insert at head, O(N) access by index'],
        },
        {
          id: 'll-insert-head',
          slug: 'll-insert-head',
          title: 'Insert a Node at the Head',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Linked List Manipulation',
          conceptsRequired: ['linked list', 'pointers'],
          approaches: [
            {
              name: 'Create New Node and Update Head',
              intuition: 'Create a new node, point its next to the current head, and update head to the new node.',
              steps: ['Create node with val.', 'newNode->next = head.', 'head = newNode.', 'Return new head.'],
              complexity: { time: 'O(1)', space: 'O(1)' },
              code: `ListNode* insertHead(ListNode* head, int val) {
    ListNode* node = new ListNode(val);
    node->next = head;
    return node;
}`,
            },
          ],
          hints: ['Set the new node next to the old head before updating head.', 'Return the new node as the new head.', 'This is O(1) — the key advantage of linked lists over arrays for front insertion.'],
          solution: `ListNode* insertHead(ListNode* head, int val){ListNode* n=new ListNode(val);n->next=head;return n;}`,
        },
        {
          id: 'll-delete-head',
          slug: 'll-delete-head',
          title: 'Delete the Head Node',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Linked List Manipulation',
          conceptsRequired: ['linked list', 'pointers'],
          approaches: [
            {
              name: 'Advance Head and Free',
              intuition: 'Store the current head, advance head to head->next, delete the old head, return new head.',
              steps: ['If head is null: return null.', 'temp = head. head = head->next. delete temp. Return head.'],
              complexity: { time: 'O(1)', space: 'O(1)' },
              code: `ListNode* deleteHead(ListNode* head) {
    if (!head) return nullptr;
    ListNode* temp = head;
    head = head->next;
    delete temp;
    return head;
}`,
            },
          ],
          hints: ['Always check for empty list first.', 'Save the old head before advancing.', 'Free memory to avoid leaks (important in C++).'],
          solution: `ListNode* deleteHead(ListNode* head){if(!head)return nullptr;auto t=head;head=head->next;delete t;return head;}`,
        },
        {
          id: 'll-length',
          slug: 'll-length',
          title: 'Find Length of Linked List',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Linear Traversal',
          conceptsRequired: ['linked list'],
          approaches: [
            {
              name: 'Count While Traversing',
              intuition: 'Walk the list from head to null, counting nodes.',
              steps: ['count = 0, curr = head.', 'While curr != null: count++, curr = curr->next.', 'Return count.'],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `int length(ListNode* head) {
    int count = 0;
    while (head) { count++; head = head->next; }
    return count;
}`,
            },
          ],
          hints: ['Simply count nodes during a single traversal.', 'Length requires visiting every node — O(N) is optimal.', 'Handle empty list (returns 0).'],
          solution: `int length(ListNode* h){int c=0;while(h){c++;h=h->next;}return c;}`,
        },
        {
          id: 'll-search',
          slug: 'll-search',
          title: 'Search a Node in Linked List',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Linear Search',
          conceptsRequired: ['linked list'],
          approaches: [
            {
              name: 'Linear Traversal with Comparison',
              intuition: 'Walk the list; return true as soon as the target value is found.',
              steps: ['curr = head.', 'While curr != null: if curr->val == target return true. curr = curr->next.', 'Return false.'],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `bool search(ListNode* head, int target) {
    while (head) {
        if (head->val == target) return true;
        head = head->next;
    }
    return false;
}`,
            },
          ],
          hints: ['No binary search here — linked lists lack random access.', 'Return early on finding the target.', 'Return false after full traversal without finding target.'],
          solution: `bool search(ListNode* h,int t){while(h){if(h->val==t)return true;h=h->next;}return false;}`,
        },
      ],
    },
    {
      id: 'learn-dll',
      title: 'Learn Doubly Linked List',
      topics: [
        {
          id: 'dll-intro',
          slug: 'dll-intro',
          title: 'Introduction to Doubly Linked List',
          type: 'lesson',
          difficulty: 'easy',
          introduction: 'A doubly linked list (DLL) has nodes with both a next pointer and a prev pointer, allowing bidirectional traversal.',
          theory: `DLL Node: val, prev, next.

Advantages over SLL:
- Bidirectional traversal
- O(1) deletion given a pointer (no need to track previous)
- Easier to implement certain algorithms (e.g., LRU cache)

Disadvantages:
- Extra space for prev pointer
- More complex insertion/deletion logic (must maintain both pointers)

Operations:
- Insert at head: set new->next=head, head->prev=new, update head
- Delete head: head=head->next, head->prev=null`,
          codeExamples: [
            {
              title: 'DLL Node Definition',
              language: 'cpp',
              code: `struct DLLNode {
    int val;
    DLLNode* prev;
    DLLNode* next;
    DLLNode(int v) : val(v), prev(nullptr), next(nullptr) {}
};`,
            },
          ],
          keyTakeaways: ['DLL allows O(1) deletion with only a node pointer.', 'Both prev and next must be updated on every insertion/deletion.', 'DLL is the backbone of LRU/LFU cache implementations.'],
          revisionNotes: ['Node has prev and next pointers', 'Head->prev = nullptr, Tail->next = nullptr', 'Both pointers must be updated on modification'],
        },
        {
          id: 'dll-insert-head',
          slug: 'dll-insert-head',
          title: 'Insert at Head of DLL',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'DLL Manipulation',
          conceptsRequired: ['doubly linked list', 'pointers'],
          approaches: [
            {
              name: 'Update Both Prev and Next',
              intuition: 'Create new node, link its next to old head, update old head prev to new node, update head.',
              steps: ['newNode->next = head.', 'If head != null: head->prev = newNode.', 'head = newNode.'],
              complexity: { time: 'O(1)', space: 'O(1)' },
              code: `DLLNode* insertHead(DLLNode* head, int val) {
    DLLNode* node = new DLLNode(val);
    node->next = head;
    if (head) head->prev = node;
    return node;
}`,
            },
          ],
          hints: ['Link new node forward before updating old head backward.', 'Check if old head is null before setting its prev.', 'Return new node as the new head.'],
          solution: `DLLNode* insertHead(DLLNode* head,int v){DLLNode* n=new DLLNode(v);n->next=head;if(head)head->prev=n;return n;}`,
        },
        {
          id: 'dll-delete-head',
          slug: 'dll-delete-head',
          title: 'Delete Head of DLL',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'DLL Manipulation',
          conceptsRequired: ['doubly linked list', 'pointers'],
          approaches: [
            {
              name: 'Advance Head and Nullify Prev',
              intuition: 'Move head to next node, nullify its prev pointer, delete old head.',
              steps: ['If head null: return null.', 'temp = head. head = head->next. If head: head->prev = null. Delete temp. Return head.'],
              complexity: { time: 'O(1)', space: 'O(1)' },
              code: `DLLNode* deleteHead(DLLNode* head) {
    if (!head) return nullptr;
    DLLNode* temp = head;
    head = head->next;
    if (head) head->prev = nullptr;
    delete temp;
    return head;
}`,
            },
          ],
          hints: ['Set the new head prev to nullptr.', 'Free memory of deleted node.', 'Handle the case where the list had only one node.'],
          solution: `DLLNode* deleteHead(DLLNode* h){if(!h)return nullptr;auto t=h;h=h->next;if(h)h->prev=nullptr;delete t;return h;}`,
        },
        {
          id: 'dll-reverse',
          slug: 'dll-reverse',
          title: 'Reverse a Doubly Linked List',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'DLL Manipulation',
          conceptsRequired: ['doubly linked list', 'pointers'],
          approaches: [
            {
              name: 'Swap Prev and Next for Every Node',
              intuition: 'For each node, swap its prev and next pointers. The old tail becomes the new head.',
              steps: ['curr = head.', 'For each node: swap(curr->prev, curr->next). Move curr to curr->prev (was next before swap).', 'Update head to the last node visited.'],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `DLLNode* reverseDLL(DLLNode* head) {
    DLLNode* curr = head, *temp = nullptr;
    while (curr) {
        swap(curr->prev, curr->next);
        temp = curr;
        curr = curr->prev; // was next before swap
    }
    return temp; // temp is the new head
}`,
            },
          ],
          hints: ['Swap prev and next pointers at each node.', 'After swapping, the old next is now prev — use prev to advance.', 'The last node visited (temp) becomes the new head.'],
          solution: `DLLNode* reverseDLL(DLLNode* h){DLLNode* c=h,*t=nullptr;while(c){swap(c->prev,c->next);t=c;c=c->prev;}return t;}`,
        },
      ],
    },
    {
      id: 'medium-ll',
      title: 'Medium Problems of LL',
      topics: [
        {
          id: 'll-middle',
          slug: 'll-middle',
          title: 'Middle of Linked List (Tortoise and Hare)',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Fast & Slow Pointers',
          conceptsRequired: ['linked list', 'two pointers'],
          leetcodeUrl: 'https://leetcode.com/problems/middle-of-the-linked-list/',
          approaches: [
            {
              name: 'Floyd Tortoise and Hare',
              intuition: 'Move slow by 1 and fast by 2. When fast reaches the end, slow is at the middle.',
              steps: ['slow = head, fast = head.', 'While fast && fast->next: slow=slow->next, fast=fast->next->next.', 'Return slow.'],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `ListNode* middleNode(ListNode* head) {
    ListNode* slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}`,
            },
          ],
          hints: ['Slow pointer moves 1 step, fast pointer moves 2 steps.', 'When fast reaches null or last node, slow is at the middle.', 'For even-length lists, this gives the second middle node.'],
          solution: `ListNode* middleNode(ListNode* h){ListNode* s=h,*f=h;while(f&&f->next){s=s->next;f=f->next->next;}return s;}`,
        },
        {
          id: 'll-reverse-iterative',
          slug: 'll-reverse-iterative',
          title: 'Reverse Linked List (Iterative)',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Three Pointers',
          conceptsRequired: ['linked list', 'pointers'],
          leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/',
          approaches: [
            {
              name: 'Three-Pointer Iterative Reversal',
              intuition: 'Maintain prev, curr, and next. For each node, reverse the link (curr->next = prev), then advance all pointers.',
              steps: ['prev = null, curr = head.', 'While curr: next = curr->next. curr->next = prev. prev = curr. curr = next.', 'Return prev (new head).'],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr, *curr = head;
    while (curr) {
        ListNode* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
            },
          ],
          hints: ['Save next before overwriting it.', 'Redirect current node backward (curr->next = prev).', 'Advance all three pointers before moving to next iteration.'],
          solution: `ListNode* reverseList(ListNode* h){ListNode* p=nullptr,*c=h;while(c){auto n=c->next;c->next=p;p=c;c=n;}return p;}`,
        },
        {
          id: 'll-reverse-recursive',
          slug: 'll-reverse-recursive',
          title: 'Reverse Linked List (Recursive)',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Recursion',
          conceptsRequired: ['linked list', 'recursion'],
          leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/',
          approaches: [
            {
              name: 'Recursive Tail-Fix',
              intuition: 'Recurse to the end of the list. On returning, fix each link: make head->next->next point back to head, nullify head->next.',
              steps: ['Base: if head or head->next is null, return head.', 'newHead = reverseList(head->next).', 'head->next->next = head. head->next = nullptr.', 'Return newHead.'],
              complexity: { time: 'O(N)', space: 'O(N) recursion stack' },
              code: `ListNode* reverseList(ListNode* head) {
    if (!head || !head->next) return head;
    ListNode* newHead = reverseList(head->next);
    head->next->next = head;
    head->next = nullptr;
    return newHead;
}`,
            },
          ],
          hints: ['Recurse all the way to the last node first.', 'On the way back, fix each link to point backward.', 'Nullify head->next to avoid cycles.'],
          solution: `ListNode* reverseList(ListNode* h){if(!h||!h->next)return h;auto nh=reverseList(h->next);h->next->next=h;h->next=nullptr;return nh;}`,
        },
        {
          id: 'll-detect-cycle',
          slug: 'll-detect-cycle',
          title: 'Detect Cycle in Linked List',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Fast & Slow Pointers',
          conceptsRequired: ['linked list', 'two pointers'],
          leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/',
          approaches: [
            {
              name: "Floyd's Cycle Detection",
              intuition: 'If a cycle exists, fast and slow will eventually meet inside the cycle. If no cycle, fast reaches null first.',
              steps: ['slow = head, fast = head.', 'While fast && fast->next: slow=slow->next, fast=fast->next->next. If slow==fast: return true.', 'Return false.'],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `bool hasCycle(ListNode* head) {
    ListNode* slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`,
            },
          ],
          hints: ['Slow moves 1 step, fast moves 2. In a cycle they must meet.', 'If fast reaches null, there is no cycle.', 'Mathematical proof: when they meet, the distance from head to cycle start equals the distance from meeting point to cycle start.'],
          solution: `bool hasCycle(ListNode* h){ListNode* s=h,*f=h;while(f&&f->next){s=s->next;f=f->next->next;if(s==f)return true;}return false;}`,
        },
        {
          id: 'll-cycle-start',
          slug: 'll-cycle-start',
          title: 'Find Start of Cycle in Linked List',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Fast & Slow Pointers',
          conceptsRequired: ['linked list', 'two pointers', 'math'],
          leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle-ii/',
          approaches: [
            {
              name: "Floyd's Algorithm - Phase 2",
              intuition: 'After slow and fast meet inside the cycle, reset one pointer to head. Move both one step at a time — they meet at the cycle start. Proof: distance from head to cycle_start == distance from meeting_point to cycle_start.',
              steps: ['Phase 1: detect meeting point using slow/fast.', 'Phase 2: reset one pointer to head. Move both 1 step until they meet. Meeting point = cycle start.'],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `ListNode* detectCycle(ListNode* head) {
    ListNode* slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {
            slow = head;
            while (slow != fast) { slow = slow->next; fast = fast->next; }
            return slow;
        }
    }
    return nullptr;
}`,
            },
          ],
          hints: ['First find the meeting point (phase 1 of Floyd).', 'Then reset one pointer to head and move both at speed 1.', 'They will meet exactly at the cycle start.'],
          solution: `ListNode* detectCycle(ListNode* h){ListNode* s=h,*f=h;while(f&&f->next){s=s->next;f=f->next->next;if(s==f){s=h;while(s!=f){s=s->next;f=f->next;}return s;}}return nullptr;}`,
        },
        {
          id: 'll-loop-length',
          slug: 'll-loop-length',
          title: 'Find Length of Loop in Linked List',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Fast & Slow Pointers',
          conceptsRequired: ['linked list', 'two pointers'],
          approaches: [
            {
              name: 'Meet Inside Loop, Count Loop Length',
              intuition: 'After finding the meeting point via Floyd, keep one pointer fixed and count steps until the other returns to the same point.',
              steps: ['Find meeting point via Floyd.', 'Hold slow fixed. Move fast one step at a time, counting.', 'When fast returns to slow, count = loop length.'],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `int loopLength(ListNode* head) {
    ListNode* slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {
            int count = 1;
            fast = fast->next;
            while (slow != fast) { fast = fast->next; count++; }
            return count;
        }
    }
    return 0;
}`,
            },
          ],
          hints: ['Use Floyd to find any point inside the loop.', 'Keep one pointer fixed, advance the other and count steps until they meet again.', 'Count = loop length.'],
          solution: `int loopLength(ListNode* h){ListNode* s=h,*f=h;while(f&&f->next){s=s->next;f=f->next->next;if(s==f){int c=1;f=f->next;while(s!=f){f=f->next;c++;}return c;}}return 0;}`,
        },
        {
          id: 'll-palindrome',
          slug: 'll-palindrome',
          title: 'Check Palindrome Linked List',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Fast & Slow + Reversal',
          conceptsRequired: ['linked list', 'two pointers', 'reversal'],
          leetcodeUrl: 'https://leetcode.com/problems/palindrome-linked-list/',
          approaches: [
            {
              name: 'Find Middle, Reverse Second Half, Compare',
              intuition: 'Find the middle of the list using slow/fast. Reverse the second half. Compare the two halves node by node.',
              steps: ['Find middle with slow/fast.', 'Reverse from slow (second half).', 'Compare head... with reversed second half.', 'Return true if all match.'],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `bool isPalindrome(ListNode* head) {
    ListNode* slow = head, *fast = head;
    while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }
    // Reverse second half
    ListNode* prev = nullptr, *curr = slow;
    while (curr) { auto next = curr->next; curr->next = prev; prev = curr; curr = next; }
    // Compare
    ListNode* left = head, *right = prev;
    while (right) {
        if (left->val != right->val) return false;
        left = left->next; right = right->next;
    }
    return true;
}`,
            },
          ],
          hints: ['Find the middle, then reverse the second half in-place.', 'Compare the original first half with the reversed second half.', 'The second half may be shorter for odd-length lists — compare until right is null.'],
          solution: `bool isPalindrome(ListNode* h){ListNode* s=h,*f=h;while(f&&f->next){s=s->next;f=f->next->next;}ListNode* p=nullptr,*c=s;while(c){auto n=c->next;c->next=p;p=c;c=n;}ListNode* l=h,*r=p;while(r){if(l->val!=r->val)return false;l=l->next;r=r->next;}return true;}`,
        },
        {
          id: 'll-segregate-odd-even',
          slug: 'll-segregate-odd-even',
          title: 'Odd Even Linked List',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Two Pointer Partitioning',
          conceptsRequired: ['linked list', 'pointers'],
          leetcodeUrl: 'https://leetcode.com/problems/odd-even-linked-list/',
          approaches: [
            {
              name: 'Separate into Two Lists, Connect',
              intuition: 'Maintain two separate chains: one for odd-indexed nodes and one for even-indexed nodes. Connect odd chain end to even chain start.',
              steps: ['odd=head, even=head->next, evenHead=even.', 'While even && even->next: odd->next=even->next; odd=odd->next; even->next=odd->next; even=even->next.', 'odd->next=evenHead.'],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `ListNode* oddEvenList(ListNode* head) {
    if (!head || !head->next) return head;
    ListNode* odd = head, *even = head->next, *evenHead = even;
    while (even && even->next) {
        odd->next = even->next;
        odd = odd->next;
        even->next = odd->next;
        even = even->next;
    }
    odd->next = evenHead;
    return head;
}`,
            },
          ],
          hints: ['Maintain two pointers for odd and even chains.', 'Connect each odd node to the next odd, each even to the next even.', 'Connect the tail of the odd chain to the head of the even chain.'],
          solution: `ListNode* oddEvenList(ListNode* h){if(!h||!h->next)return h;ListNode* o=h,*e=h->next,*eh=e;while(e&&e->next){o->next=e->next;o=o->next;e->next=o->next;e=e->next;}o->next=eh;return h;}`,
        },
        {
          id: 'll-remove-nth-back',
          slug: 'll-remove-nth-back',
          title: 'Remove Nth Node from End of List',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Fast & Slow Pointers',
          conceptsRequired: ['linked list', 'two pointers'],
          leetcodeUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',
          approaches: [
            {
              name: 'Two Pointers with N Gap',
              intuition: 'Advance fast pointer n+1 steps ahead. Then advance both slow and fast together until fast is null. Slow is now just before the node to delete.',
              steps: ['Use dummy node before head.', 'fast = dummy. Advance fast n+1 times.', 'Advance slow and fast together until fast is null.', 'slow->next = slow->next->next.'],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `ListNode* removeNthFromEnd(ListNode* head, int n) {
    ListNode dummy(0);
    dummy.next = head;
    ListNode* slow = &dummy, *fast = &dummy;
    for (int i = 0; i <= n; i++) fast = fast->next;
    while (fast) { slow = slow->next; fast = fast->next; }
    ListNode* del = slow->next;
    slow->next = slow->next->next;
    delete del;
    return dummy.next;
}`,
            },
          ],
          hints: ['Use a dummy node to simplify edge cases (removing the head).', 'Advance fast n+1 steps (not n) so slow stops just before the target.', 'When fast is null, slow->next is the node to remove.'],
          solution: `ListNode* removeNthFromEnd(ListNode* h,int n){ListNode d(0);d.next=h;auto s=&d,f=&d;for(int i=0;i<=n;i++)f=f->next;while(f){s=s->next;f=f->next;}auto t=s->next;s->next=s->next->next;delete t;return d.next;}`,
        },
        {
          id: 'll-delete-middle',
          slug: 'll-delete-middle',
          title: 'Delete the Middle Node',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Fast & Slow Pointers',
          conceptsRequired: ['linked list', 'two pointers'],
          leetcodeUrl: 'https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/',
          approaches: [
            {
              name: 'Find Node Before Middle, Skip It',
              intuition: 'Find the node just before the middle using slow/fast. Then skip the middle node.',
              steps: ['Use dummy->head. slow=dummy, fast=head.', 'While fast && fast->next: slow=slow->next, fast=fast->next->next.', 'slow->next = slow->next->next.'],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `ListNode* deleteMiddle(ListNode* head) {
    if (!head || !head->next) return nullptr;
    ListNode dummy(0);
    dummy.next = head;
    ListNode* slow = &dummy, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    slow->next = slow->next->next;
    return dummy.next;
}`,
            },
          ],
          hints: ['Use a dummy node before head so slow starts before head.', 'When fast reaches end, slow is just before the middle.', 'Skip the middle by setting slow->next = slow->next->next.'],
          solution: `ListNode* deleteMiddle(ListNode* h){if(!h||!h->next)return nullptr;ListNode d(0);d.next=h;auto s=&d,f=h;while(f&&f->next){s=s->next;f=f->next->next;}s->next=s->next->next;return d.next;}`,
        },
        {
          id: 'll-sort',
          slug: 'll-sort',
          title: 'Sort Linked List (Merge Sort)',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Merge Sort',
          conceptsRequired: ['linked list', 'divide and conquer', 'merge sort'],
          leetcodeUrl: 'https://leetcode.com/problems/sort-list/',
          approaches: [
            {
              name: 'Merge Sort on Linked List',
              intuition: 'Find the middle, split into two halves, recursively sort each, then merge the two sorted halves.',
              steps: ['Base case: 0 or 1 node.', 'Find middle, split list at middle.', 'Recursively sort left and right.', 'Merge sorted halves.'],
              complexity: { time: 'O(N log N)', space: 'O(log N) stack' },
              code: `ListNode* merge(ListNode* l1, ListNode* l2) {
    ListNode dummy(0); ListNode* cur = &dummy;
    while (l1 && l2) {
        if (l1->val <= l2->val) { cur->next = l1; l1 = l1->next; }
        else { cur->next = l2; l2 = l2->next; }
        cur = cur->next;
    }
    cur->next = l1 ? l1 : l2;
    return dummy.next;
}

ListNode* sortList(ListNode* head) {
    if (!head || !head->next) return head;
    ListNode* slow = head, *fast = head->next;
    while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }
    ListNode* mid = slow->next;
    slow->next = nullptr;
    return merge(sortList(head), sortList(mid));
}`,
            },
          ],
          hints: ['Split using slow/fast (fast starts at head->next to get correct split for even length).', 'Merge is the standard merge of two sorted lists.', 'This achieves O(N log N) time with O(log N) space for recursion.'],
          solution: `ListNode* sortList(ListNode* h){if(!h||!h->next)return h;ListNode* s=h,*f=h->next;while(f&&f->next){s=s->next;f=f->next->next;}auto m=s->next;s->next=nullptr;auto merge=[](auto& self,ListNode* a,ListNode* b)->ListNode*{ListNode d(0);auto c=&d;while(a&&b){if(a->val<=b->val){c->next=a;a=a->next;}else{c->next=b;b=b->next;}c=c->next;}c->next=a?a:b;return d.next;};return merge(merge,sortList(h),sortList(m));}`,
        },
        {
          id: 'll-sort-012',
          slug: 'll-sort-012',
          title: 'Sort a Linked List of 0s, 1s, and 2s',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Three Separate Lists',
          conceptsRequired: ['linked list'],
          approaches: [
            {
              name: 'Collect into Three Lists, Reconnect',
              intuition: 'Create three dummy heads for 0s, 1s, and 2s. Traverse the list, appending each node to its corresponding list. Connect the three lists.',
              steps: ['Three dummy nodes: d0, d1, d2.', 'Traverse original list, appending to appropriate list.', 'Connect: d0_tail->next=d1.next, d1_tail->next=d2.next. d2_tail->next=null.', 'Return d0.next.'],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `ListNode* sortList012(ListNode* head) {
    ListNode d0(0), d1(0), d2(0);
    ListNode *t0 = &d0, *t1 = &d1, *t2 = &d2;
    while (head) {
        if (head->val == 0) { t0->next = head; t0 = t0->next; }
        else if (head->val == 1) { t1->next = head; t1 = t1->next; }
        else { t2->next = head; t2 = t2->next; }
        head = head->next;
    }
    t2->next = nullptr;
    t1->next = d2.next;
    t0->next = d1.next;
    return d0.next;
}`,
            },
          ],
          hints: ['Create three separate chains for 0s, 1s, and 2s.', 'Traverse and append each node to its chain.', 'Connect the chains and terminate the last with null.'],
          solution: `ListNode* sortList012(ListNode* h){ListNode d0(0),d1(0),d2(0);auto t0=&d0,t1=&d1,t2=&d2;while(h){if(!h->val){t0->next=h;t0=t0->next;}else if(h->val==1){t1->next=h;t1=t1->next;}else{t2->next=h;t2=t2->next;}h=h->next;}t2->next=nullptr;t1->next=d2.next;t0->next=d1.next;return d0.next;}`,
        },
        {
          id: 'll-intersection',
          slug: 'll-intersection',
          title: 'Intersection Point of Two Linked Lists',
          type: 'problem',
          difficulty: 'easy',
          pattern: 'Two Pointers',
          conceptsRequired: ['linked list', 'two pointers'],
          leetcodeUrl: 'https://leetcode.com/problems/intersection-of-two-linked-lists/',
          approaches: [
            {
              name: 'Two Pointers with Cross-Swap',
              intuition: 'Pointer a traverses list A then B; pointer b traverses B then A. They meet at the intersection after traveling the same total distance.',
              steps: ['a = headA, b = headB.', 'While a != b: a = a ? a->next : headB. b = b ? b->next : headA.', 'Return a.'],
              complexity: { time: 'O(M+N)', space: 'O(1)' },
              code: `ListNode* getIntersectionNode(ListNode* headA, ListNode* headB) {
    ListNode* a = headA, *b = headB;
    while (a != b) {
        a = a ? a->next : headB;
        b = b ? b->next : headA;
    }
    return a;
}`,
            },
          ],
          hints: ['Both pointers travel M+N total distance before meeting at the intersection (or both reach null simultaneously).', 'When a pointer reaches null, redirect it to the other list head.', 'They meet at the intersection or both become null if no intersection.'],
          solution: `ListNode* getIntersectionNode(ListNode* a,ListNode* b){auto p=a,q=b;while(p!=q){p=p?p->next:b;q=q?q->next:a;}return p;}`,
        },
        {
          id: 'll-add-one',
          slug: 'll-add-one',
          title: 'Add 1 to a Number Represented as Linked List',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Recursion / Reversal',
          conceptsRequired: ['linked list', 'recursion'],
          approaches: [
            {
              name: 'Reverse, Add, Reverse Back',
              intuition: 'Reverse the list, add 1 with carry propagation (like grade school addition), then reverse again.',
              steps: ['Reverse the list.', 'Add 1: carry = 1. For each node: sum = val + carry. Update val = sum%10. carry = sum/10.', 'If carry remains: add new node at end.', 'Reverse back.'],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `ListNode* addOne(ListNode* head) {
    // Reverse
    ListNode* prev = nullptr, *curr = head;
    while (curr) { auto n = curr->next; curr->next = prev; prev = curr; curr = n; }
    head = prev;
    // Add 1
    int carry = 1; curr = head;
    while (curr && carry) {
        int sum = curr->val + carry;
        curr->val = sum % 10;
        carry = sum / 10;
        if (!curr->next && carry) { curr->next = new ListNode(carry); carry = 0; }
        curr = curr->next;
    }
    // Reverse back
    prev = nullptr; curr = head;
    while (curr) { auto n = curr->next; curr->next = prev; prev = curr; curr = n; }
    return prev;
}`,
            },
          ],
          hints: ['Reverse the list to process least significant digit first.', 'Add 1 with carry propagation like standard addition.', 'Reverse again to restore the original order.'],
          solution: `ListNode* addOne(ListNode* h){auto rev=[](ListNode* x){ListNode* p=nullptr;while(x){auto n=x->next;x->next=p;p=x;x=n;}return p;};h=rev(h);int c=1;auto cur=h;while(cur&&c){int s=cur->val+c;cur->val=s%10;c=s/10;if(!cur->next&&c){cur->next=new ListNode(c);c=0;}cur=cur->next;}return rev(h);}`,
        },
        {
          id: 'll-add-two-numbers',
          slug: 'll-add-two-numbers',
          title: 'Add Two Numbers (as Linked Lists)',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Simulation / Carry Propagation',
          conceptsRequired: ['linked list', 'math'],
          leetcodeUrl: 'https://leetcode.com/problems/add-two-numbers/',
          approaches: [
            {
              name: 'Simultaneous Traversal with Carry',
              intuition: 'Both lists store digits in reverse order. Traverse simultaneously, summing digits and propagating carry. Create result nodes.',
              steps: ['carry = 0, dummy head.', 'While l1 || l2 || carry: sum = carry + (l1?l1->val:0) + (l2?l2->val:0). Create node with sum%10. carry = sum/10.', 'Return dummy->next.'],
              complexity: { time: 'O(max(M,N))', space: 'O(max(M,N))' },
              code: `ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    ListNode dummy(0);
    ListNode* cur = &dummy;
    int carry = 0;
    while (l1 || l2 || carry) {
        int sum = carry;
        if (l1) { sum += l1->val; l1 = l1->next; }
        if (l2) { sum += l2->val; l2 = l2->next; }
        cur->next = new ListNode(sum % 10);
        cur = cur->next;
        carry = sum / 10;
    }
    return dummy.next;
}`,
            },
          ],
          hints: ['Lists are already in reverse order — process from head (least significant digit).', 'Sum both current digits plus carry. New digit = sum%10, new carry = sum/10.', 'Continue while either list has remaining nodes or carry is non-zero.'],
          solution: `ListNode* addTwoNumbers(ListNode* l1,ListNode* l2){ListNode d(0);auto c=&d;int carry=0;while(l1||l2||carry){int s=carry;if(l1){s+=l1->val;l1=l1->next;}if(l2){s+=l2->val;l2=l2->next;}c->next=new ListNode(s%10);c=c->next;carry=s/10;}return d.next;}`,
        },
      ],
    },
    {
      id: 'medium-dll',
      title: 'Medium Problems of DLL',
      topics: [
        {
          id: 'dll-delete-all-key',
          slug: 'dll-delete-all-key',
          title: 'Delete All Occurrences of a Key in DLL',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'DLL Traversal',
          conceptsRequired: ['doubly linked list', 'pointers'],
          approaches: [
            {
              name: 'Traverse and Relink',
              intuition: 'Walk through the DLL. When a node with the key is found, relink prev and next around it and delete it.',
              steps: ['curr = head.', 'While curr: if curr->val==key: fix prev/next links. delete curr. Else: move to next.', 'Handle head update.'],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `DLLNode* deleteAllKey(DLLNode* head, int key) {
    DLLNode* curr = head;
    while (curr) {
        if (curr->val == key) {
            if (curr->prev) curr->prev->next = curr->next;
            else head = curr->next;
            if (curr->next) curr->next->prev = curr->prev;
            DLLNode* del = curr;
            curr = curr->next;
            delete del;
        } else curr = curr->next;
    }
    return head;
}`,
            },
          ],
          hints: ['Handle head deletion separately (update head pointer).', 'Relink both prev and next pointers around the deleted node.', 'Advance curr before deleting to avoid use-after-free.'],
          solution: `DLLNode* deleteAllKey(DLLNode* h,int k){auto c=h;while(c){if(c->val==k){if(c->prev)c->prev->next=c->next;else h=c->next;if(c->next)c->next->prev=c->prev;auto d=c;c=c->next;delete d;}else c=c->next;}return h;}`,
        },
        {
          id: 'dll-pairs-given-sum',
          slug: 'dll-pairs-given-sum',
          title: 'Find All Pairs with Given Sum in DLL',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Two Pointers on DLL',
          conceptsRequired: ['doubly linked list', 'two pointers'],
          approaches: [
            {
              name: 'Two Pointers (Head and Tail)',
              intuition: 'Since DLL allows backward traversal, use two pointers starting at head and tail. Move them inward based on the sum comparison.',
              steps: ['left=head, find tail (right).', 'While left != right and left->prev != right: sum=left->val+right->val.', 'If sum==target: record pair, left++, right--. If sum<target: left++. Else: right--.'],
              complexity: { time: 'O(N)', space: 'O(1) extra' },
              code: `vector<pair<int,int>> pairsWithSum(DLLNode* head, int target) {
    DLLNode* right = head;
    while (right->next) right = right->next;
    DLLNode* left = head;
    vector<pair<int,int>> res;
    while (left != right && left->prev != right) {
        int s = left->val + right->val;
        if (s == target) { res.push_back({left->val, right->val}); left = left->next; right = right->prev; }
        else if (s < target) left = left->next;
        else right = right->prev;
    }
    return res;
}`,
            },
          ],
          hints: ['DLL allows starting one pointer at the tail (use prev pointers).', 'Move left right when sum is too small, move right left when too large.', 'Stop when pointers meet or cross.'],
          solution: `vector<pair<int,int>> pairsWithSum(DLLNode* h,int t){auto r=h;while(r->next)r=r->next;auto l=h;vector<pair<int,int>>res;while(l!=r&&l->prev!=r){int s=l->val+r->val;if(s==t){res.push_back({l->val,r->val});l=l->next;r=r->prev;}else if(s<t)l=l->next;else r=r->prev;}return res;}`,
        },
        {
          id: 'dll-remove-duplicates',
          slug: 'dll-remove-duplicates',
          title: 'Remove Duplicates from Sorted DLL',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'DLL Traversal',
          conceptsRequired: ['doubly linked list', 'pointers'],
          approaches: [
            {
              name: 'Traverse and Skip Duplicates',
              intuition: 'Since the DLL is sorted, duplicates are adjacent. For each node, skip all following nodes with the same value.',
              steps: ['curr = head.', 'While curr: while curr->next && curr->next->val == curr->val: remove curr->next.', 'Move curr to next.'],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `DLLNode* removeDups(DLLNode* head) {
    DLLNode* curr = head;
    while (curr) {
        while (curr->next && curr->next->val == curr->val) {
            DLLNode* dup = curr->next;
            curr->next = dup->next;
            if (dup->next) dup->next->prev = curr;
            delete dup;
        }
        curr = curr->next;
    }
    return head;
}`,
            },
          ],
          hints: ['Sorted DLL: duplicates are always adjacent.', 'For each node, remove all immediately following nodes with the same value.', 'Update both next and prev pointers when removing.'],
          solution: `DLLNode* removeDups(DLLNode* h){auto c=h;while(c){while(c->next&&c->next->val==c->val){auto d=c->next;c->next=d->next;if(d->next)d->next->prev=c;delete d;}c=c->next;}return h;}`,
        },
      ],
    },
    {
      id: 'hard-ll',
      title: 'Hard Problems of LL',
      topics: [
        {
          id: 'll-reverse-k-group',
          slug: 'll-reverse-k-group',
          title: 'Reverse Nodes in K-Group',
          type: 'problem',
          difficulty: 'hard',
          pattern: 'Linked List Manipulation',
          conceptsRequired: ['linked list', 'recursion', 'reversal'],
          leetcodeUrl: 'https://leetcode.com/problems/reverse-nodes-in-k-group/',
          approaches: [
            {
              name: 'Iterative Group Reversal',
              intuition: 'Process the list k nodes at a time. For each group: check if k nodes remain, reverse the group, reconnect to the result chain.',
              steps: ['Use dummy node. For each group: check k nodes exist. Reverse group. Reconnect. Move to next group.'],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `ListNode* reverseKGroup(ListNode* head, int k) {
    ListNode dummy(0);
    dummy.next = head;
    ListNode* groupPrev = &dummy;
    while (true) {
        // Check k nodes exist
        ListNode* kth = groupPrev;
        for (int i = 0; i < k; i++) { kth = kth->next; if (!kth) return dummy.next; }
        ListNode* groupNext = kth->next;
        // Reverse group
        ListNode* prev = groupNext, *curr = groupPrev->next;
        while (curr != groupNext) {
            ListNode* next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
        }
        ListNode* tmp = groupPrev->next;
        groupPrev->next = kth;
        groupPrev = tmp;
    }
}`,
            },
          ],
          hints: ['First verify at least k nodes remain before reversing.', 'After reversing a group, the old head becomes the new tail of that group.', 'Track groupPrev to connect consecutive reversed groups.'],
          solution: `ListNode* reverseKGroup(ListNode* h,int k){ListNode d(0);d.next=h;auto gp=&d;while(true){auto kth=gp;for(int i=0;i<k;i++){kth=kth->next;if(!kth)return d.next;}auto gn=kth->next,p=gn,c=gp->next;while(c!=gn){auto n=c->next;c->next=p;p=c;c=n;}auto t=gp->next;gp->next=kth;gp=t;}}`,
        },
        {
          id: 'll-rotate',
          slug: 'll-rotate',
          title: 'Rotate a Linked List',
          type: 'problem',
          difficulty: 'medium',
          pattern: 'Circular List Trick',
          conceptsRequired: ['linked list'],
          leetcodeUrl: 'https://leetcode.com/problems/rotate-list/',
          approaches: [
            {
              name: 'Find Length, Connect Tail to Head, Rebreak',
              intuition: 'Rotating right by k is the same as making the (n-k)th node the new tail and (n-k+1)th node the new head. Connect tail to head, find the new break point.',
              steps: ['Find length n and tail.', 'k = k % n. If k==0: return head.', 'Connect tail->next = head (circular).', 'Find new tail at position n-k. New head = new tail->next. Break.'],
              complexity: { time: 'O(N)', space: 'O(1)' },
              code: `ListNode* rotateRight(ListNode* head, int k) {
    if (!head || !head->next || k == 0) return head;
    int n = 1; ListNode* tail = head;
    while (tail->next) { tail = tail->next; n++; }
    k %= n; if (k == 0) return head;
    tail->next = head;
    int stepsToNewTail = n - k - 1;
    ListNode* newTail = head;
    for (int i = 0; i < stepsToNewTail; i++) newTail = newTail->next;
    ListNode* newHead = newTail->next;
    newTail->next = nullptr;
    return newHead;
}`,
            },
          ],
          hints: ['Reduce k modulo n to handle large k.', 'Make the list circular, then find the new head position.', 'New tail is at index n-k-1 (0-indexed).'],
          solution: `ListNode* rotateRight(ListNode* h,int k){if(!h||!h->next||!k)return h;int n=1;auto t=h;while(t->next){t=t->next;n++;}k%=n;if(!k)return h;t->next=h;auto nt=h;for(int i=0;i<n-k-1;i++)nt=nt->next;auto nh=nt->next;nt->next=nullptr;return nh;}`,
        },
        {
          id: 'll-flatten',
          slug: 'll-flatten',
          title: 'Flatten a Multilevel Linked List',
          type: 'problem',
          difficulty: 'hard',
          pattern: 'DFS / Recursion',
          conceptsRequired: ['linked list', 'recursion'],
          leetcodeUrl: 'https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/',
          approaches: [
            {
              name: 'DFS Inline Flattening',
              intuition: 'When a node has a child, flatten the child list and insert it between the current node and its next. Recursively flatten.',
              steps: ['For each node: if child exists: flatten child. Connect current->next = child. Set child->prev. Find child tail. Connect tail->next = old next.', 'Continue traversal.'],
              complexity: { time: 'O(N)', space: 'O(depth) recursion' },
              code: `// Using the LeetCode multilevel DLL node
struct Node { int val; Node* prev; Node* next; Node* child; };

Node* flatten(Node* head) {
    Node* curr = head;
    while (curr) {
        if (curr->child) {
            Node* child = curr->child;
            Node* next = curr->next;
            curr->next = child;
            child->prev = curr;
            curr->child = nullptr;
            // Find tail of child list
            Node* tail = child;
            while (tail->next) tail = tail->next;
            tail->next = next;
            if (next) next->prev = tail;
        }
        curr = curr->next;
    }
    return head;
}`,
            },
          ],
          hints: ['When a child is found, splice the entire child list between current and next.', 'Find the tail of the child list to reconnect to the original next.', 'Nullify the child pointer after flattening.'],
          solution: `Node* flatten(Node* h){auto c=h;while(c){if(c->child){auto ch=c->child,nx=c->next;c->next=ch;ch->prev=c;c->child=nullptr;auto t=ch;while(t->next)t=t->next;t->next=nx;if(nx)nx->prev=t;}c=c->next;}return h;}`,
        },
        {
          id: 'll-clone-random',
          slug: 'll-clone-random',
          title: 'Clone Linked List with Random Pointer',
          type: 'problem',
          difficulty: 'hard',
          pattern: 'Interleaving / Hash Map',
          conceptsRequired: ['linked list', 'hashing', 'pointers'],
          leetcodeUrl: 'https://leetcode.com/problems/copy-list-with-random-pointer/',
          approaches: [
            {
              name: 'Interleave Original and Clone Nodes',
              intuition: 'Insert a clone of each node right after it in the original list. Set random pointers using the interleaved structure. Finally separate the two lists.',
              steps: ['Pass 1: insert clone after each original. Clone[i] = orig[i]->next.', 'Pass 2: clone->random = original->random->next (if random exists).', 'Pass 3: separate the two lists.'],
              complexity: { time: 'O(N)', space: 'O(1) extra' },
              code: `struct Node { int val; Node* next; Node* random; };

Node* copyRandomList(Node* head) {
    if (!head) return nullptr;
    // Insert clones
    Node* curr = head;
    while (curr) {
        Node* clone = new Node{curr->val};
        clone->next = curr->next;
        curr->next = clone;
        curr = clone->next;
    }
    // Set random pointers
    curr = head;
    while (curr) {
        if (curr->random) curr->next->random = curr->random->next;
        curr = curr->next->next;
    }
    // Separate lists
    Node dummy(0); Node* cloneCurr = &dummy;
    curr = head;
    while (curr) {
        cloneCurr->next = curr->next;
        curr->next = curr->next->next;
        cloneCurr = cloneCurr->next;
        curr = curr->next;
    }
    return dummy.next;
}`,
            },
          ],
          hints: ['Interleaving avoids extra hash map space: clone[i] is always original[i]->next.', 'Set random of clone: clone->random = original->random->next.', 'Carefully separate the two interleaved lists in the final pass.'],
          solution: `Node* copyRandomList(Node* h){if(!h)return nullptr;auto c=h;while(c){auto cl=new Node{c->val};cl->next=c->next;c->next=cl;c=cl->next;}c=h;while(c){if(c->random)c->next->random=c->random->next;c=c->next->next;}Node d{0};auto cc=&d;c=h;while(c){cc->next=c->next;c->next=c->next->next;cc=cc->next;c=c->next;}return d.next;}`,
        },
      ],
    },
  ],
};
