import Link from 'next/link';
import { tracks } from '@/content/tracks';
import type { Track } from '@/types';

function TrackCard({ track }: { track: Track }) {
  const card = (
    <div
      className={`group relative h-full rounded-2xl border transition-all duration-300 overflow-hidden ${
        track.available
          ? 'border-slate-700/60 hover:border-violet-500/60 bg-slate-900/60 hover:bg-slate-900 cursor-pointer'
          : 'border-slate-800/40 bg-slate-900/20 opacity-50 cursor-not-allowed'
      }`}
    >
      {/* Gradient glow on hover */}
      {track.available && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-violet-600/5 to-transparent" />
      )}

      <div className="p-5">
        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold bg-gradient-to-br ${track.color} text-white mb-4 shadow-lg`}>
          {track.icon}
        </div>

        {/* Name + badge */}
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-slate-100 group-hover:text-white transition-colors">{track.name}</h3>
          {!track.available && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-500">Soon</span>
          )}
          {track.available && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-400">Live</span>
          )}
        </div>

        <p className="text-xs text-slate-500 leading-relaxed mb-4">{track.description}</p>

        {track.available && track.lessonCount && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600">{track.lessonCount}+ lessons</span>
            <span className="text-xs text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">Start →</span>
          </div>
        )}
      </div>
    </div>
  );

  if (track.available) {
    return <Link href={`/${track.id}`} className="block h-full">{card}</Link>;
  }
  return card;
}

// Tracks shown in the numbered roadmap on the home page (in order)
const ROADMAP_IDS = [
  'javascript', 'typescript', 'react', 'databases', 'nodejs',
  'nextjs', 'webdev', 'devops', 'system-design', 'dsa',
  'placement', 'behavioral', 'ai-engineering',
];

export default function HomePage() {
  const roadmapTracks = ROADMAP_IDS
    .map((id) => tracks.find((t) => t.id === id))
    .filter(Boolean) as typeof tracks;
  const supplementaryTracks = tracks.filter((t) => !ROADMAP_IDS.includes(t.id));
  const firstTrack = roadmapTracks[0];

  const stats = [
    { label: 'Lessons', value: '400+' },
    { label: 'Challenges', value: '50+' },
    { label: 'Projects', value: '20+' },
    { label: 'Interview Q&A', value: '200+' },
  ];

  const features = [
    {
      icon: '⚡',
      title: 'Run Code in Browser',
      desc: 'Monaco editor (VS Code engine) with live output. Write code, see results instantly.',
    },
    {
      icon: '🎯',
      title: 'Interview Ready',
      desc: 'Every topic includes beginner → advanced questions with detailed answers and follow-ups.',
    },
    {
      icon: '🛠',
      title: 'Build Real Projects',
      desc: 'Code along side-by-side while building real projects — from Todo apps to JWT auth.',
    },
    {
      icon: '📊',
      title: 'Track Progress',
      desc: 'Mark lessons complete. Progress saved locally — picks up where you left off.',
    },
    {
      icon: '📋',
      title: 'Quick Revision',
      desc: 'Cheat sheets and revision cards for every topic. Perfect for interview day.',
    },
    {
      icon: '🚀',
      title: 'Structured Path',
      desc: 'Carefully ordered from zero to advanced. Follow the roadmap or jump to any topic.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#050508] selection:bg-violet-500/30">
      {/* Dot grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #1e1b4b 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.25,
        }}
      />

      {/* Gradient orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-violet-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/60 bg-[#050508]/80 backdrop-blur-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/20">
              <img src="/favicon.ico" alt="Logo" className="w-8 h-8" />
            </div>
            <span className="font-bold text-base text-white tracking-tight">Learning</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-slate-500">
            <a href="#tracks" className="hover:text-slate-200 transition-colors">Tracks</a>
            <a href="#features" className="hover:text-slate-200 transition-colors">Features</a>
            <a href="https://github.com" className="hover:text-slate-200 transition-colors">GitHub</a>
          </nav>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <section className="pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Your personal developer learning platform
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-5 leading-[1.1] tracking-tight">
            Learn. Build.{' '}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Get hired.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
            A structured roadmap from JavaScript fundamentals to AI Engineering — with lessons, projects, challenges, and interview prep.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/javascript"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all shadow-xl shadow-violet-600/25 hover:shadow-violet-500/30 hover:-translate-y-0.5"
            >
              Start the Roadmap →
            </Link>
            <Link
              href="#roadmap"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-200 font-semibold text-sm transition-all"
            >
              View Roadmap
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="text-center p-4 rounded-xl bg-slate-900/50 border border-slate-800/60">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Roadmap */}
        <section id="roadmap" className="mb-20 scroll-mt-20">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">The Roadmap</h2>
            <p className="text-slate-500 text-sm sm:text-base">
              13 tracks in the order they build on each other. Start at 1, end at 13.
            </p>
          </div>

          {/* Numbered list for roadmap tracks */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {roadmapTracks.map((track, i) => (
              <Link
                key={track.id}
                href={`/${track.id}`}
                className="group flex items-start gap-4 p-5 sm:p-6 rounded-2xl bg-slate-900/50 border border-slate-800/60 hover:border-violet-500/40 hover:bg-slate-900 transition-all"
              >
                {/* Step number */}
                <span className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold bg-slate-800 text-slate-500 group-hover:bg-violet-500/20 group-hover:text-violet-400 transition-colors mt-0.5">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  {/* Icon + name */}
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className={`inline-flex w-8 h-8 rounded-lg items-center justify-center text-sm font-bold bg-linear-to-br ${track.color} text-white shrink-0`}>
                      {track.icon}
                    </span>
                    <span className="font-semibold text-slate-100 group-hover:text-white text-base truncate transition-colors">
                      {track.name}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{track.description}</p>
                  {track.lessonCount && (
                    <span className="inline-block mt-2.5 text-xs text-slate-600 group-hover:text-violet-400 transition-colors font-medium">
                      {track.lessonCount}+ lessons →
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Supplementary tracks */}
          {supplementaryTracks.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-4">Supplementary</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {supplementaryTracks.map((track) => (
                  <TrackCard key={track.id} track={track} />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Features */}
        <section id="features" className="mb-24 scroll-mt-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Everything You Need</h2>
            <p className="text-slate-500 text-sm sm:text-base">Built for developers who want to learn deeply, not just follow tutorials.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:border-slate-700/80 transition-colors">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-slate-100 mb-1.5 text-sm">{f.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-800/60 py-8 text-center text-xs text-slate-600">
        <p>Learning Platform — Built by <a href="https://ghanshyam-singh.me" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300">Ghanshyam Singh</a>.</p>
      </footer>
    </div>
  );
}
