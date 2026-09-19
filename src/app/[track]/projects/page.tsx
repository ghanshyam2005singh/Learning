import Link from 'next/link';
import { getProjects } from '@/lib/content';
import { Badge } from '@/components/ui/Badge';
import { notFound } from 'next/navigation';

export default async function ProjectsPage({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  const projects = getProjects(track);
  if (!projects.length) notFound();

  const grouped = projects.reduce((acc, p) => {
    const key = p.difficulty;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {} as Record<string, typeof projects>);

  const order = ['beginner', 'intermediate', 'advanced', 'expert'];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
        <p className="text-slate-400">Build real projects from scratch. Step-by-step guides with hints and solutions.</p>
      </div>

      {order.filter(o => grouped[o]).map((level) => (
        <div key={level} className="mb-10">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">{level}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {grouped[level].map((project) => (
              <Link
                key={project.id}
                href={`/${track}/projects/${project.slug}`}
                className="group p-5 bg-slate-900/40 border border-slate-800/60 hover:border-slate-600 rounded-xl transition-all hover:bg-slate-900/70"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-100 group-hover:text-white">{project.title}</h3>
                  <Badge variant={project.difficulty}>{project.difficulty}</Badge>
                </div>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">{tech}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>⏱ {project.estimatedTime}</span>
                  <span>{project.steps.length} steps →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
