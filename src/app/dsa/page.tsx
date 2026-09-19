import Link from 'next/link';
import { getDSASections, getDSAStats } from '@/lib/dsa';

export default function DSAOverviewPage() {
  const sections = getDSASections();
  const stats = getDSAStats();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🧠</span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">DSA Mastery</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
          Complete Data Structures & Algorithms course following Striver A2Z DSA Sheet.
          Theory-first approach with multiple solution strategies and interview Q&amp;A.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Sections', value: stats.sections, icon: '📚' },
          { label: 'Total Topics', value: stats.totalTopics, icon: '🎯' },
          { label: 'Lessons', value: stats.lessons, icon: '📖' },
          { label: 'Problems', value: stats.problems, icon: '⚡' },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section, idx) => {
          const topics = section.topics ?? section.subsections?.flatMap((s) => s.topics) ?? [];
          const easy = topics.filter((t) => t.difficulty === 'easy').length;
          const medium = topics.filter((t) => t.difficulty === 'medium').length;
          const hard = topics.filter((t) => t.difficulty === 'hard').length;
          const firstTopic = topics[0];

          return (
            <Link
              key={section.id}
              href={firstTopic ? `/dsa/topic/${firstTopic.slug}` : '/dsa'}
              className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                  {section.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">#{String(idx + 1).padStart(2, '0')}</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate text-sm">
                      {section.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{section.description}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-gray-500 dark:text-gray-400">{topics.length} topics</span>
                    {easy > 0 && <span className="text-green-600 dark:text-green-400">{easy}E</span>}
                    {medium > 0 && <span className="text-yellow-600 dark:text-yellow-400">{medium}M</span>}
                    {hard > 0 && <span className="text-red-600 dark:text-red-400">{hard}H</span>}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
