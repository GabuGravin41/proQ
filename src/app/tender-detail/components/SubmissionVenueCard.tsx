'use client';
import React from 'react';
import { Tender } from '@/lib/tenderData';
import { ExternalLink, MapPin, Clock, Monitor, AlertTriangle, Search } from 'lucide-react';
import { toast } from 'sonner';

interface SubmissionVenueCardProps {
  tender: Tender;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function SubmissionVenueCard({ tender }: SubmissionVenueCardProps) {
  const isElectronic = tender.submissionVenue === 'e-GP';

  return (
    <div className="card p-5 space-y-4">
      <h2 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-2">
        {isElectronic ? <Monitor size={15} className="text-primary" /> : <MapPin size={15} className="text-primary" />}
        Submission Details
      </h2>

      {/* IFMIS / E-GP LOCATOR (Always visible because many PPIP physicals have IFMIS components) */}
      <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-3">
        <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
          <Monitor size={14} />
          e-GP / IFMIS Portal Search
        </h3>
        <p className="text-xs text-emerald-700 dark:text-emerald-500 leading-relaxed">
          Bidding for this tender may require submission via the official Treasury IFMIS Supplier Portal. Use the Reference Number to locate the Negotiation Number online.
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between bg-white dark:bg-black/40 p-2 rounded border border-emerald-100 dark:border-emerald-900/50">
             <span className="text-xs font-mono text-muted-foreground break-all">{tender.referenceNumber}</span>
             <button onClick={() => { navigator.clipboard.writeText(tender.referenceNumber); toast.success('Reference copied'); }} className="text-xs text-emerald-600 hover:underline px-2 font-medium">Copy</button>
          </div>
          <a
            href="https://supplier.treasury.go.ke/iri/portal"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full justify-center text-sm py-2 bg-[#16A34A] hover:bg-[#15803D] shadow-sm"
          >
            <Search size={13} />
            Search & Apply on IFMIS
          </a>
        </div>
      </div>

      {isElectronic ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary border border-secondary-foreground/20">
            <Monitor size={14} className="text-secondary-foreground shrink-0" />
            <div>
              <p className="text-xs font-bold text-secondary-foreground">Electronic Submission Verified</p>
              <p className="text-xs text-secondary-foreground/70">Mandatory e-GP Kenya</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <Clock size={12} className="text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Deadline</p>
                <p className="text-muted-foreground">{formatDate(tender.closingDate)} at {tender.closingTime}</p>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-warning-bg border border-warning/20">
            <div className="flex items-start gap-1.5">
              <AlertTriangle size={12} className="text-warning mt-0.5 shrink-0" />
              <p className="text-xs text-warning">
                Register on IFMIS at least 3 business days before the deadline to avoid system lock-out.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-warning-bg border border-warning/20">
            <MapPin size={14} className="text-warning shrink-0" />
            <div>
              <p className="text-xs font-bold text-warning">Physical Tender Box Backup</p>
              <p className="text-xs text-warning/70">If e-GP is unavailable, drop manual bids here</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <MapPin size={12} className="text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Drop-off Address</p>
                <p className="text-muted-foreground leading-relaxed">{tender.physicalAddress}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock size={12} className="text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Submission Deadline</p>
                <p className="text-muted-foreground">{formatDate(tender.closingDate)} at {tender.closingTime}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
