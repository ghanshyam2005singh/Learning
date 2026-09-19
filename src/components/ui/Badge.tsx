import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'outline';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
        {
          'bg-slate-800 text-slate-300 border-slate-700': variant === 'default',
          'bg-green-500/10 text-green-400 border-green-500/20': variant === 'beginner',
          'bg-yellow-500/10 text-yellow-400 border-yellow-500/20': variant === 'intermediate',
          'bg-orange-500/10 text-orange-400 border-orange-500/20': variant === 'advanced',
          'bg-red-500/10 text-red-400 border-red-500/20': variant === 'expert',
          'bg-transparent text-slate-400 border-slate-700': variant === 'outline',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
