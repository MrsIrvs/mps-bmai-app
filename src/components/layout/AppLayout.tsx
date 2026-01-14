import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { sidebarOpen } = useApp();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <main
        className={cn(
          'flex-1 overflow-auto transition-all duration-300',
          'lg:ml-0'
        )}
      >
        {children}
      </main>
    </div>
  );
}
