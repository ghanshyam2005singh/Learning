'use client';

import { useState } from 'react';
import Link from 'next/link';

const notes = [
  { title: '1. What is Cloud Computing', file: '01 - What is cloud computing.pdf', icon: 'CL' },
  { title: '2. AWS Overview', file: '02 - What is AWS An Overview.pdf', icon: 'AW' },
  { title: '3. AWS IAM', file: '03 - What is AWS IAM.pdf', icon: 'IM' },
  { title: '4. AWS EC2', file: '04 - AWS EC2.pdf', icon: 'EC' },
  { title: '5. AWS EBS', file: '05 - AWS EBS.pdf', icon: 'EB' },
  { title: '6. AWS AMI', file: '06 - AWS AMI.pdf', icon: 'AM' },
  { title: '7. ELB & Auto Scaling', file: '07 - ELB & ASG.pdf', icon: 'LB' },
  { title: '8. AWS S3', file: '08 - AWS S3.pdf', icon: 'S3' },
  { title: '9. AWS RDS', file: '09 - AWS RDS.pdf', icon: 'RD' },
  { title: '10. AWS DynamoDB', file: '10 - AWS DynamoDB.pdf', icon: 'DY' },
  { title: '11. AWS Lambda', file: '11 - AWS Lamda.pdf', icon: 'FN' },
  { title: '12. AWS CloudFormation', file: '12 - AWS CloudFormation.pdf', icon: 'CF' },
  { title: '13. AWS Route 53', file: '13 - AWS 53 Route.pdf', icon: 'R5' },
  { title: '14. AWS CloudFront', file: '14 - AWS CloudFront.pdf', icon: 'CD' },
  { title: '15. Virtualization', file: 'What is Virtualization.pdf', icon: 'VM' },
  { title: '16. AWS ECS', file: 'AWS ECS.pdf', icon: 'CS' },
  { title: '17. AWS EKS', file: 'AWS EKS.pdf', icon: 'K8' },
  { title: '18. AWS Amplify', file: 'AWS Amplify.pdf', icon: 'AP' },
];

export default function AWSPage() {
  const [selected, setSelected] = useState<(typeof notes)[0] | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors">
              Home
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300 text-sm">AWS Notes</span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xl font-bold mb-4">
            AW
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">AWS Notes</h1>
          <p className="text-slate-400 text-lg">
            Core AWS services explained — click any topic to read the notes.
          </p>
          <Link
            href="/aws/interview"
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            Interview Questions →
          </Link>
        </div>

        <div className={`flex gap-6 ${selected ? 'items-start' : ''}`}>
          {/* Notes grid */}
          <div className={`${selected ? 'w-72 shrink-0' : 'w-full'}`}>
            <div className={`grid gap-3 ${selected ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'}`}>
              {notes.map((note) => (
                <button
                  key={note.file}
                  onClick={() => setSelected(selected?.file === note.file ? null : note)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    selected?.file === note.file
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-slate-800 bg-slate-900 hover:border-orange-500/50 hover:bg-slate-800'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold mb-3">
                    {note.icon}
                  </div>
                  <p className="text-sm font-medium text-white leading-snug">{note.title}</p>
                </button>
              ))}
            </div>
          </div>

          {/* PDF viewer */}
          {selected && (
            <div className="flex-1 min-w-0">
              <div className="sticky top-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-white">{selected.title}</h2>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-slate-400 hover:text-white text-xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <iframe
                  src={`/aws-notes/${encodeURIComponent(selected.file)}`}
                  className="w-full rounded-xl border border-slate-700"
                  style={{ height: 'calc(100vh - 160px)' }}
                  title={selected.title}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
