'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Project } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { CodeBlock } from '@/components/lesson/CodeBlock';
import { ProjectCodingPane } from '@/components/projects/ProjectCodingPane';

type Tab = 'guide' | 'code';

export function ProjectPageClient({ project, track }: { project: Project; track: string }) {
  const [tab, setTab] = useState<Tab>('guide');
  const [openStep, setOpenStep] = useState<number | null>(0);
  const [openQ, setOpenQ] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto">
      <Link href={`/${track}/projects`} className="text-sm text-slate-500 hover:text-slate-300 mb-5 inline-block transition-colors">
        ← All Projects
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant={project.difficulty}>{project.difficulty}</Badge>
          <span className="text-xs text-slate-500">⏱ {project.estimatedTime}</span>
          <span className="text-xs text-slate-600">|</span>
          <span className="text-xs text-slate-500">{project.steps.length} steps</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{project.title}</h1>
        <p className="text-slate-400 leading-relaxed text-sm sm:text-base">{project.description}</p>
      </div>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-2 mb-6">
        {project.techStack.map((t) => (
          <span key={t} className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">{t}</span>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 p-1 bg-slate-900/60 border border-slate-700/60 rounded-xl w-fit">
        <button
          onClick={() => setTab('guide')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'guide'
              ? 'bg-slate-800 text-slate-100 shadow-sm'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          📖 Guide
        </button>
        <button
          onClick={() => setTab('code')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'code'
              ? 'bg-violet-600 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          ⚡ Code Along
        </button>
      </div>

      {tab === 'guide' ? (
        <>
          {/* Features */}
          <div className="mb-6 p-5 bg-slate-900/50 border border-slate-700/60 rounded-xl">
            <h2 className="font-semibold text-slate-100 mb-3 text-sm">What You Will Build</h2>
            <ul className="space-y-1.5">
              {project.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Folder structure */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white mb-3">Folder Structure</h2>
            <pre className="bg-[#0d1117] border border-slate-700/60 rounded-xl p-4 text-sm text-slate-300 font-mono overflow-x-auto leading-relaxed">
              {project.folderStructure}
            </pre>
          </div>

          {/* Steps */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4">Step-by-Step Guide</h2>
            <div className="space-y-2">
              {project.steps.map((step, i) => (
                <div key={i} className="border border-slate-700/60 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenStep(openStep === i ? null : i)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-800/40 transition-colors"
                  >
                    <span className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-medium text-slate-100 text-sm">{step.title}</span>
                    <span className="ml-auto text-slate-500 text-xs">{openStep === i ? '▲' : '▼'}</span>
                  </button>
                  {openStep === i && (
                    <div className="border-t border-slate-700/60 px-4 py-4 space-y-3">
                      <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                      {step.code && (
                        <CodeBlock example={{ title: `Step ${i + 1} Code`, code: step.code }} />
                      )}
                      {step.hint && (
                        <p className="text-yellow-400 text-xs">💡 {step.hint}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Interview questions */}
          {project.interviewQuestions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-white mb-4">Interview Questions</h2>
              <div className="space-y-2">
                {project.interviewQuestions.map((q, i) => (
                  <div key={i} className="border border-slate-700/60 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenQ(openQ === i ? null : i)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-1 mr-3">
                        <Badge variant={q.difficulty}>{q.difficulty}</Badge>
                        <span className="text-sm text-slate-200 leading-snug">{q.question}</span>
                      </div>
                      <span className="text-slate-500 flex-shrink-0">{openQ === i ? '▲' : '▼'}</span>
                    </button>
                    {openQ === i && (
                      <div className="px-4 py-4 border-t border-slate-700/60 bg-slate-900/40">
                        <p className="text-slate-300 text-sm leading-relaxed">{q.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Code Along tab */
        <div className="rounded-xl border border-slate-700/60 overflow-hidden" style={{ height: '620px' }}>
          <ProjectCodingPane project={project} />
        </div>
      )}
    </div>
  );
}
