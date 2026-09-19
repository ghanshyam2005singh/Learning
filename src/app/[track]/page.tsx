import Link from 'next/link';
import { getLessons, getChallenges, getProjects, getInterviewQuestions } from '@/lib/content';
import { notFound } from 'next/navigation';

const TRACK_META: Record<string, { name: string; icon: string; color: string }> = {
  javascript:       { name: 'JavaScript',                  icon: 'JS',  color: 'from-yellow-500 to-amber-500'   },
  typescript:       { name: 'TypeScript',                  icon: 'TS',  color: 'from-blue-500 to-blue-600'      },
  react:            { name: 'React',                       icon: 'RE',  color: 'from-cyan-500 to-sky-500'       },
  databases:        { name: 'Databases',                   icon: 'DB',  color: 'from-sky-500 to-blue-600'       },
  nodejs:           { name: 'Node.js',                     icon: 'ND',  color: 'from-green-600 to-emerald-600'  },
  nextjs:           { name: 'Next.js',                     icon: 'NX',  color: 'from-gray-700 to-gray-900'      },
  webdev:           { name: 'Web Development',             icon: 'WD',  color: 'from-pink-500 to-rose-600'      },
  devops:           { name: 'DevOps',                      icon: 'DO',  color: 'from-orange-500 to-amber-600'   },
  'system-design':  { name: 'System Design',               icon: 'SD',  color: 'from-teal-500 to-cyan-600'      },
  dsa:              { name: 'DSA',                         icon: 'DS',  color: 'from-violet-500 to-purple-600'  },
  aws:              { name: 'AWS Notes',                   icon: 'AW',  color: 'from-orange-400 to-amber-500'   },
  placement:        { name: 'Placement & Interview Prep',  icon: 'PL',  color: 'from-indigo-500 to-violet-600'  },
  behavioral:       { name: 'Behavioral Interviews',       icon: 'BEH', color: 'from-cyan-500 to-blue-500'      },
  'ai-engineering': { name: 'AI Engineering Fundamentals', icon: 'AI',  color: 'from-purple-500 to-pink-500'    },
};

export default async function TrackOverviewPage({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  const meta = TRACK_META[track];
  if (!meta) notFound();

  const lessons = getLessons(track);
  const challenges = getChallenges(track);
  const projects = getProjects(track);
  const interviewQuestions = getInterviewQuestions(track);
  const firstLesson = lessons[0];

  const sections = [
    { href: `/${track}/lessons`, icon: '📚', label: 'Lessons', count: lessons.length, desc: 'From basics to advanced' },
    { href: `/${track}/practice`, icon: '⚡', label: 'Challenges', count: challenges.length, desc: 'Coding challenges' },
    ...(projects.length > 0 ? [{ href: `/${track}/projects`, icon: '🛠', label: 'Projects', count: projects.length, desc: 'Build real things' }] : []),
    { href: `/${track}/interview`, icon: '🎯', label: 'Interview', count: interviewQuestions.length, desc: 'Q&A with answers' },
    { href: `/${track}/revision`, icon: '📋', label: 'Revision', count: '5', desc: 'Quick cheat sheets' },
    { href: `/${track}/playground`, icon: '▶', label: 'Playground', count: '∞', desc: 'Free code editor' },
  ];

  return (
    <div>
      {/* Hero */}
      <div className="mb-10">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-white text-xl font-bold mb-5`}>
          {meta.icon}
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">{meta.name} Track</h1>
        <p className="text-slate-400 text-lg max-w-xl">
          Everything you need to master {meta.name} — from your first variable to advanced patterns and interview prep.
        </p>

        {firstLesson && (
          <div className="flex items-center gap-3 mt-6">
            <Link
              href={`/${track}/lessons/${firstLesson.slug}`}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-violet-500/20"
            >
              Start Learning →
            </Link>
            <Link
              href={`/${track}/lessons`}
              className="px-6 py-3 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-xl transition-colors"
            >
              View All Lessons
            </Link>
          </div>
        )}
      </div>

      {/* Sections grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group bg-slate-900/50 border border-slate-800/60 hover:border-slate-700 rounded-xl p-5 transition-all hover:bg-slate-900"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              <span className="text-2xl font-bold text-white">{s.count}</span>
            </div>
            <h3 className="font-semibold text-slate-100 group-hover:text-white">{s.label}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{s.desc}</p>
          </Link>
        ))}
      </div>

      {/* Lesson categories preview */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">What You Will Learn</h2>
        {Array.from(new Set(lessons.map((l) => l.category))).map((cat) => {
          const catLessons = lessons.filter((l) => l.category === cat);
          return (
            <div key={cat} className="mb-4 p-4 bg-slate-900/40 border border-slate-800/60 rounded-xl">
              <h3 className="font-semibold text-slate-200 mb-2">{cat}</h3>
              <div className="flex flex-wrap gap-2">
                {catLessons.map((l) => (
                  <Link
                    key={l.id}
                    href={`/${track}/lessons/${l.slug}`}
                    className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-colors"
                  >
                    {l.title}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
