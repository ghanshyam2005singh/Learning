import DSASidebar from '@/components/dsa/DSASidebar';
import { getDSASections } from '@/lib/dsa';

export default function DSALayout({ children }: { children: React.ReactNode }) {
  const sections = getDSASections();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <DSASidebar sections={sections} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
