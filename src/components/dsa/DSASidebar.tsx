'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { DSASection } from '@/types/dsa';

interface Props {
  sections: DSASection[];
}

function toRoman(n: number): string {
  const vals = [10, 9, 5, 4, 1];
  const syms = ['X', 'IX', 'V', 'IV', 'I'];
  let result = '';
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { result += syms[i]; n -= vals[i]; }
  }
  return result;
}

function SectionItem({ section, index, isOpen, onToggle }: {
  section: DSASection;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const topics = section.topics ?? section.subsections?.flatMap((s) => s.topics) ?? [];
  const hasActiveChild = topics.some((t) => pathname === `/dsa/topic/${t.slug}`);

  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
          hasActiveChild || isOpen
            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        <span className="flex items-center gap-2 min-w-0">
          <span className="shrink-0 font-mono text-[10px] text-gray-400 dark:text-gray-500 w-6 text-right">
            {toRoman(index)}.
          </span>
          <span className="truncate">{section.title}</span>
        </span>
        <svg
          className={`w-4 h-4 shrink-0 transition-transform ml-1 ${isOpen ? 'rotate-90' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-1 ml-3 space-y-0.5">
          {(() => {
            let counter = 0;
            if (section.subsections) {
              return section.subsections.map((sub) => (
                <div key={sub.id}>
                  <p className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {sub.title}
                  </p>
                  {sub.topics.map((topic) => (
                    <TopicLink key={topic.id} num={++counter} slug={topic.slug} title={topic.title} type={topic.type} difficulty={topic.difficulty} />
                  ))}
                </div>
              ));
            }
            return section.topics?.map((topic) => (
              <TopicLink key={topic.id} num={++counter} slug={topic.slug} title={topic.title} type={topic.type} difficulty={topic.difficulty} />
            ));
          })()}
        </div>
      )}
    </div>
  );
}

function TopicLink({ num, slug, title, type, difficulty }: { num: number; slug: string; title: string; type: string; difficulty: string }) {
  const pathname = usePathname();
  const isActive = pathname === `/dsa/topic/${slug}`;

  const badge = type === 'lesson'
    ? <span className="ml-auto shrink-0 text-blue-500 dark:text-blue-400 font-bold">A</span>
    : <span className={`ml-auto shrink-0 font-medium ${
        difficulty === 'easy' ? 'text-green-500' : difficulty === 'medium' ? 'text-yellow-500' : 'text-red-500'
      }`}>
        {difficulty === 'easy' ? 'E' : difficulty === 'medium' ? 'M' : 'H'}
      </span>;

  return (
    <Link
      href={`/dsa/topic/${slug}`}
      className={`block px-3 py-1.5 rounded text-xs transition-colors ${
        isActive
          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200 font-medium'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
      }`}
    >
      <span className="flex items-center gap-1.5">
        <span className="shrink-0 w-5 text-right font-mono text-[10px] text-gray-500 dark:text-gray-600">{num}.</span>
        <span className="truncate">{title}</span>
        {badge}
      </span>
    </Link>
  );
}

export default function DSASidebar({ sections }: Props) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    const set = new Set<string>();
    for (const s of sections) {
      const topics = s.topics ?? s.subsections?.flatMap((sub) => sub.topics) ?? [];
      if (topics.some((t) => pathname === `/dsa/topic/${t.slug}`)) {
        set.add(s.id);
      }
    }
    return set;
  });

  function toggle(id: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <aside className="w-72 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <img src="/favicon.ico" alt="Logo" className="w-7 h-7 rounded-lg" />
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-sm">DSA Mastery</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Striver A2Z Sheet</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        <Link
          href="/dsa"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            pathname === '/dsa'
              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-medium'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Overview
        </Link>

        {sections.map((section, i) => (
          <SectionItem
            key={section.id}
            index={i + 1}
            section={section}
            isOpen={openSections.has(section.id)}
            onToggle={() => toggle(section.id)}
          />
        ))}
      </nav>

      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 shrink-0">
        <Link
          href="/"
          className="text-[11px] text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition-colors flex items-center gap-1.5"
        >
          ← Back to Home
        </Link>
      </div>
    </aside>
  );
}
