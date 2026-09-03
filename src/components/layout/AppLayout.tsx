import React from 'react';
import Topbar from './Topbar';
import Link from 'next/link';
import AITenderCopilotModal from '@/components/ai/AITenderCopilotModal';

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
      
      {/* Global AI Tender Copilot Floating Button & Modal */}
      <AITenderCopilotModal />

      <footer className="border-t border-border bg-card py-5">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 2xl:px-16 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-foreground">pro<span className="text-primary">Q</span> Kenya</span>
            <span>·</span>
            <span>Public Procurement Intelligence & AI Bidding Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/landing" className="hover:text-primary transition-colors">Platform Overview</Link>
            <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
