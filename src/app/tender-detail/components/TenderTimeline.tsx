'use client';
import React from 'react';
import { Tender } from '@/lib/tenderData';
import { Clock } from 'lucide-react';

interface TenderTimelineProps {
  tender: Tender;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function TenderTimeline({ tender }: TenderTimelineProps) {
  const publishedDate = tender.publishedDate || '2026-08-20';
  const closingDate = tender.closingDate || '2026-09-25';
  const isEgp = tender.submissionVenue === 'e-GP';

  // Compute intermediate milestones relative to published & closing date
  const pubTime = new Date(publishedDate).getTime();
  const closeTime = new Date(closingDate).getTime();
  const diffTime = closeTime - pubTime;

  const siteVisitDate = new Date(pubTime + diffTime * 0.4).toISOString().split('T')[0];
  const clarificationDeadline = new Date(pubTime + diffTime * 0.65).toISOString().split('T')[0];
  const awardDate = new Date(closeTime + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const timelineEvents = [
    {
      id: 'tl-001',
      date: publishedDate,
      label: 'Tender Published',
      desc: `Advertised via ${tender.source} (${tender.referenceNumber})`,
      status: 'done',
    },
    {
      id: 'tl-002',
      date: siteVisitDate,
      label: 'Pre-Bid & Site Inspection',
      desc: `Briefing conference at ${tender.procuringEntity} offices / site`,
      status: 'upcoming',
    },
    {
      id: 'tl-003',
      date: clarificationDeadline,
      label: 'Clarification Deadline',
      desc: `Submit inquiries to Supply Chain Directorate before this date`,
      status: 'upcoming',
    },
    {
      id: 'tl-004',
      date: closingDate,
      label: `Bid Submission Deadline (${tender.closingTime})`,
      desc: isEgp
        ? 'Digital electronic submission strictly via e-GP Kenya portal'
        : `Deposit sealed hardcopy tender envelopes into ${tender.procuringEntity} Tender Box`,
      status: 'deadline',
    },
    {
      id: 'tl-005',
      date: closingDate,
      label: 'Public Bid Opening',
      desc: 'Immediate public tender opening in presence of bidders / representatives',
      status: 'upcoming',
    },
    {
      id: 'tl-006',
      date: awardDate,
      label: 'Expected Notification of Award',
      desc: 'Technical & financial evaluation outcome under PPADA 2015 statutory timelines',
      status: 'future',
    },
  ];

  return (
    <div className="card p-5">
      <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-5">
        <Clock size={16} className="text-primary" />
        Procurement Milestones & Statutory Timeline
      </h2>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-3.5 top-2 bottom-2 w-px bg-border" />

        <div className="space-y-4">
          {timelineEvents.map((event) => {
            const dotClass =
              event.status === 'done'
                ? 'bg-success border-success'
                : event.status === 'deadline'
                ? 'bg-danger border-danger'
                : event.status === 'future'
                ? 'bg-muted border-border'
                : 'bg-primary border-primary';

            const labelClass =
              event.status === 'done'
                ? 'text-muted-foreground line-through'
                : event.status === 'deadline'
                ? 'text-danger font-bold'
                : 'text-foreground font-semibold';

            return (
              <div key={event.id} className="flex items-start gap-4 pl-1">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 z-10 ${dotClass}`}
                >
                  {event.status === 'done' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <p className={`text-sm ${labelClass}`}>{event.label}</p>
                    <span className="text-xs font-mono text-muted-foreground shrink-0">
                      {formatDate(event.date)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{event.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
