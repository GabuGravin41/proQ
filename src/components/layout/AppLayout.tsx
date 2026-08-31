import React from 'react';
import Topbar from './Topbar';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function AppLayout({ children, className = '' }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Topbar />
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      <footer className="border-t border-border bg-card py-4">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 2xl:px-16 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© 2026 TenderIQ · Kenya Procurement Intelligence Platform</span>
          <span className="flex items-center gap-3">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Data Sources</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
