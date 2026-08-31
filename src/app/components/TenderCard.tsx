'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Tender } from '@/lib/tenderData';
import StatusBadge from '@/components/ui/StatusBadge';
import SourceBadge from '@/components/ui/SourceBadge';
import AGPOBadge from '@/components/ui/AGPOBadge';
import {
  MapPin, Building2, Clock, FileText, Bookmark,
  ExternalLink, TrendingUp, AlertTriangle, Lock, BookmarkCheck
} from 'lucide-react';
import { toast } from 'sonner';

interface TenderCardProps {
  tender: Tender;
  onMatchScoreClick: () => void;
}

function formatKES(value: number | null): string {
  if (value === null) return 'Undisclosed';
  if (value >= 1_000_000_000) return `KES ${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `KES ${(value / 1_000_000).toFixed(1)}M`;
  return `KES ${value.toLocaleString()}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function TenderCard({ tender, onMatchScoreClick }: TenderCardProps) {
  const [bookmarked, setBookmarked] = useState(false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? 'Removed from saved tenders' : 'Tender saved to your watchlist');
  };

  const urgencyBorder = tender.daysRemaining <= 1
    ? 'border-l-4 border-l-danger'
    : tender.daysRemaining <= 3
    ? 'border-l-4 border-l-warning' :'';

  const matchColor =
    tender.matchScore !== null && tender.matchScore >= 85
      ? 'text-success'
      : tender.matchScore !== null && tender.matchScore >= 70
      ? 'text-accent' :'text-muted-foreground';

  return (
    <div className={`card ${urgencyBorder} group hover:shadow-elevated transition-all duration-200 flex flex-col`}>
      {/* Top urgency banner */}
      {tender.daysRemaining <= 1 && (
        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-danger-bg border-b border-danger/20 rounded-t-xl">
          <AlertTriangle size={12} className="text-danger" />
          <span className="text-xs font-semibold text-danger">Closes Today — {tender.closingTime}</span>
        </div>
      )}
      {tender.daysRemaining <= 3 && tender.daysRemaining > 1 && (
        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-warning-bg border-b border-warning/20 rounded-t-xl">
          <AlertTriangle size={12} className="text-warning" />
          <span className="text-xs font-semibold text-warning">Closing in {tender.daysRemaining} days</span>
        </div>
      )}

      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <StatusBadge status={tender.status} />
              <SourceBadge source={tender.source} />
              <AGPOBadge category={tender.agpoCategory} />
            </div>
            <Link href={`/tender/${tender.id}`}>
              <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                {tender.title}
              </h3>
            </Link>
          </div>

          <button
            onClick={handleBookmark}
            className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-150"
            title={bookmarked ? 'Remove bookmark' : 'Save tender'}
          >
            {bookmarked
              ? <BookmarkCheck size={16} className="text-primary" />
              : <Bookmark size={16} />
            }
          </button>
        </div>

        {/* Reference number */}
        <p className="text-xs font-mono text-muted-foreground -mt-1">{tender.referenceNumber}</p>

        {/* Meta info */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Building2 size={12} className="shrink-0" />
            <span className="truncate font-medium text-foreground/80">{tender.procuringEntity}</span>
            <span className="shrink-0 px-1 py-0.5 rounded text-xs bg-muted text-muted-foreground">
              {tender.entityType}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin size={12} className="shrink-0" />
            <span>{tender.county} County</span>
            <span className="mx-1">·</span>
            <span className="truncate">{tender.procurementMethod}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <Clock size={12} className="shrink-0 text-muted-foreground" />
            <span className={`font-semibold font-tabular ${
              tender.daysRemaining <= 1 ? 'text-danger' :
              tender.daysRemaining <= 3 ? 'text-warning': 'text-foreground'
            }`}>
              {tender.daysRemaining <= 0
                ? 'Closed'
                : tender.daysRemaining === 1
                ? 'Closes today'
                : `${tender.daysRemaining} days remaining`
              }
            </span>
            <span className="text-muted-foreground">— {formatDate(tender.closingDate)}</span>
          </div>
        </div>

        {/* Value + Category row */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Est. Value</p>
            <p className={`text-sm font-bold font-tabular ${tender.estimatedValue ? 'text-foreground' : 'text-muted-foreground'}`}>
              {formatKES(tender.estimatedValue)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-muted-foreground">Category</p>
            <p className="text-xs font-medium text-foreground/80 max-w-[120px] truncate">{tender.category}</p>
          </div>
        </div>

        {/* Match Score */}
        {tender.matchScore !== null ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success-bg border border-success/20">
            <TrendingUp size={13} className="text-success shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-success">AI Match Score</span>
                <span className={`text-sm font-bold font-tabular ${matchColor}`}>{tender.matchScore}%</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-success/20">
                <div
                  className="h-full rounded-full bg-success transition-all duration-500"
                  style={{ width: `${tender.matchScore}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={onMatchScoreClick}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border border-border hover:bg-secondary hover:border-primary/20 transition-all duration-150 text-left w-full"
          >
            <Lock size={13} className="text-muted-foreground shrink-0" />
            <div>
              <span className="text-xs font-medium text-muted-foreground">Unlock AI Match Score</span>
              <span className="text-xs text-muted-foreground/70 block">Upgrade to see your fit for this tender</span>
            </div>
          </button>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 mt-auto pt-1">
          <Link
            href={`/tender/${tender.id}`}
            className="flex-1 btn-primary justify-center text-xs py-1.5"
          >
            View Details
          </Link>

          {tender.documentAvailable ? (
            <a
              href={tender.documentUrl ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs py-1.5 px-3"
              title="Access tender documents"
            >
              <FileText size={13} />
              Docs
            </a>
          ) : (
            <button
              className="btn-secondary text-xs py-1.5 px-3 opacity-50 cursor-not-allowed"
              disabled
              title="Documents not yet available"
            >
              <FileText size={13} />
              N/A
            </button>
          )}

          {tender.submissionVenue === 'e-GP' && tender.egpLink && (
            <a
              href={tender.egpLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs py-1.5 px-3"
              title="Open in e-GP Kenya"
            >
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
