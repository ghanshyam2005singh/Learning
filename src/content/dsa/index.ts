import { cppBasicsSection } from './sections/01-cpp-basics';
import { logicalThinkingSection } from './sections/02-logical-thinking';
import { patternsSection } from './sections/03-patterns';
import { stlSection } from './sections/04-stl';
import { mathsSection } from './sections/05-maths';
import { basicRecursionSection as recursionSection } from './sections/06-recursion';
import { hashingSection } from './sections/07-hashing';
import { sortingSection } from './sections/08-sorting';
import { arraysSection } from './sections/09-arrays';
import { binarySearchSection } from './sections/10-binary-search';
import { stringsSection } from './sections/11-strings';
import { linkedListSection } from './sections/12-linked-list';
import { recursionAdvancedSection } from './sections/13-recursion-advanced';
import { bitManipulationSection } from './sections/14-bit-manipulation';
import { stacksQueuesSection } from './sections/15-stacks-queues';
import { slidingWindowSection } from './sections/16-sliding-window';
import { heapsSection } from './sections/17-heaps';
import { greedySection } from './sections/18-greedy';
import { treesSection } from './sections/19-trees';
import { bstSection } from './sections/20-bst';
import { graphsSection } from './sections/21-graphs';
import { dpSection } from './sections/22-dp';
import { triesSection } from './sections/23-tries';
import { stringsHardSection } from './sections/24-strings-hard';
import type { DSASection } from '@/types/dsa';

export const dsaSections: DSASection[] = [
  cppBasicsSection,
  logicalThinkingSection,
  patternsSection,
  stlSection,
  mathsSection,
  recursionSection,
  hashingSection,
  sortingSection,
  arraysSection,
  binarySearchSection,
  stringsSection,
  linkedListSection,
  recursionAdvancedSection,
  bitManipulationSection,
  stacksQueuesSection,
  slidingWindowSection,
  heapsSection,
  greedySection,
  treesSection,
  bstSection,
  graphsSection,
  dpSection,
  triesSection,
  stringsHardSection,
];
