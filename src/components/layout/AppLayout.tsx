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

      <footer className="border-t border-border bg-card/80 py-8">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 2xl:px-16 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-foreground text-sm">pro<span className="text-emerald-600 dark:text-emerald-400">Q</span> Kenya</span>
              <span>·</span>
              <span>National Procurement Intelligence & AI Bidding Copilot</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <Link href="/landing" className="hover:text-foreground transition-colors">Platform Overview</Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing & M-Pesa Plans</Link>
              <Link href="/notification-preferences" className="hover:text-foreground transition-colors">Alert Settings</Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>

          {/* Mandatory PPADA 2015 Statutory Disclaimer */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border/80 text-[11px] leading-relaxed text-muted-foreground space-y-2">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              <span>Statutory Non-Government Legal Notice (PPADA 2015 & Article 35)</span>
            </div>
            <p>
              <strong>proQ Kenya</strong> is an independent, private procurement analytics and tender preparation platform. proQ is <strong>NOT</strong> an official state corporation, agency, or department of the Government of Kenya, and is <strong>NOT</strong> affiliated with, endorsed by, or operated on behalf of the Public Procurement Regulatory Authority (PPRA), the Public Procurement Information Portal (PPIP), the e-GP Kenya system, or the National Treasury.
            </p>
            <p>
              All tender notices, reference codes, closing dates, and procurement metadata indexed on this service are gathered from publicly accessible gazettes and statutory disclosures under Article 35 (Access to Information) of the Constitution of Kenya and Section 67 of the Public Procurement and Asset Disposal Act (PPADA 2015). Official bid submissions, mandatory security deposits, and contract awards are strictly executed by procuring entities through official government portals.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted-foreground/80 pt-2 border-t border-border/40">
            <p>© 2026 proQ Kenya. All rights reserved. Registered under Kenya Laws.</p>
            <p>Built for Kenyan contractors, MSMEs, and AGPO youth, women & PWD enterprises.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
