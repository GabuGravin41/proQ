'use client';
import React from 'react';
import { Tender } from '@/lib/tenderData';
import { ExternalLink, MapPin, Clock, Monitor, AlertTriangle } from 'lucide-react';
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
    <div className="card p-5">
      <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
        {isElectronic ? <Monitor size={15} className="text-primary" /> : <MapPin size={15} className="text-primary" />}
        Submission Venue
      </h2>

      {isElectronic ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary border border-secondary-foreground/20">
            <Monitor size={14} className="text-secondary-foreground shrink-0" />
            <div>
              <p className="text-xs font-bold text-secondary-foreground">Electronic Submission</p>
              <p className="text-xs text-secondary-foreground/70">via e-GP Kenya Portal</p>
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
            <div className="flex items-start gap-2">
              <ExternalLink size={12} className="text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Portal Reference</p>
                <p className="text-muted-foreground font-mono break-all">{tender.referenceNumber}</p>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-warning-bg border border-warning/20">
            <div className="flex items-start gap-1.5">
              <AlertTriangle size={12} className="text-warning mt-0.5 shrink-0" />
              <p className="text-xs text-warning">
                Register on e-GP Kenya at least 3 business days before the deadline to avoid system lock-out.
              </p>
            </div>
          </div>

          {tender.egpLink && (
            <a
              href={tender.egpLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center text-sm py-2"
            >
              <ExternalLink size={13} />
              Open in e-GP Kenya
            </a>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-warning-bg border border-warning/20">
            <MapPin size={14} className="text-warning shrink-0" />
            <div>
              <p className="text-xs font-bold text-warning">Physical Tender Box</p>
              <p className="text-xs text-warning/70">Manual submission required</p>
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

          <div className="p-2.5 rounded-lg bg-danger-bg border border-danger/20">
            <div className="flex items-start gap-1.5">
              <AlertTriangle size={12} className="text-danger mt-0.5 shrink-0" />
              <p className="text-xs text-danger">
                Late physical submissions are rejected without exception. Allow travel time.
              </p>
            </div>
          </div>

          <button
            onClick={() => toast.info('Opening Google Maps directions...')}
            className="btn-secondary w-full justify-center text-sm py-2"
          >
            <MapPin size={13} />
            Get Directions
          </button>
        </div>
      )}
    </div>
  );
}
