'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Tender } from '@/lib/tenderData';
import StatusBadge from '@/components/ui/StatusBadge';
import SourceBadge from '@/components/ui/SourceBadge';
import AGPOBadge from '@/components/ui/AGPOBadge';
import {
  ChevronLeft, Clock, MapPin, Building2, Calendar,
  Bookmark, BookmarkCheck, Share2, Printer, AlertTriangle, ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface TenderDetailHeaderProps {
  tender: Tender;
}

function formatKES(value: number | null): string {
  if (value === null) return 'Undisclosed';
  if (value >= 1_000_000_000) return `KES ${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `KES ${(value / 1_000_000).toFixed(1)}M`;
  return `KES ${value.toLocaleString()}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function TenderDetailHeader({ tender }: TenderDetailHeaderProps) {
  const [bookmarked, setBookmarked] = useState(false);

  const handleShare = () => {
    toast.success('Tender link copied to clipboard');
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ChevronLeft size={14} />
          Tender Search
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-xs">{tender.referenceNumber}</span>
      </div>

      {/* Urgency banner */}
      {tender.daysRemaining <= 3 && (
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl mb-4 border ${
          tender.daysRemaining <= 1
            ? 'bg-danger-bg border-danger/30 text-danger' :'bg-warning-bg border-warning/30 text-warning'
        }`}>
          <AlertTriangle size={15} className="shrink-0" />
          <span className="text-sm font-semibold">
            {tender.daysRemaining <= 1
              ? `This tender closes TODAY at ${tender.closingTime} — take action now`
              : `Closing in ${tender.daysRemaining} days — ${tender.closingTime} on ${formatDate(tender.closingDate)}`
            }
          </span>
        </div>
      )}

      {/* Main header card */}
      <div className="card p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              <StatusBadge status={tender.status} />
              <SourceBadge source={tender.source} />
              <AGPOBadge category={tender.agpoCategory} />
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border">
                {tender.category}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-snug mb-2">
              {tender.title}
            </h1>

            <p className="text-sm font-mono text-muted-foreground mb-4">{tender.referenceNumber}</p>

            {/* Meta grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              <MetaItem
                icon={Building2}
                label="Procuring Entity"
                value={tender.procuringEntity}
                sub={tender.entityType}
              />
              <MetaItem
                icon={MapPin}
                label="County"
                value={`${tender.county} County`}
                sub={tender.procurementMethod}
              />
              <MetaItem
                icon={Calendar}
                label="Closing Date"
                value={formatDate(tender.closingDate)}
                sub={tender.closingTime}
                valueClass={tender.daysRemaining <= 3 ? 'text-danger' : undefined}
              />
              <MetaItem
                icon={Clock}
                label="Days Remaining"
                value={tender.daysRemaining <= 0 ? 'Closed' : `${tender.daysRemaining} days`}
                sub={`Published ${formatDate(tender.publishedDate)}`}
                valueClass={
                  tender.daysRemaining <= 1 ? 'text-danger' :
                  tender.daysRemaining <= 3 ? 'text-warning': 'text-success'
                }
              />
            </div>
          </div>

          {/* Right side: value + actions */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 shrink-0">
            <div className="text-right">
              <p className="text-xs text-muted-foreground section-label">Estimated Value</p>
              <p className="text-2xl font-bold text-foreground font-tabular mt-1">
                {formatKES(tender.estimatedValue)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { setBookmarked(!bookmarked); toast.success(bookmarked ? 'Removed from watchlist' : 'Added to watchlist'); }}
                className={`p-2 rounded-lg border transition-all duration-150 ${bookmarked ? 'border-primary bg-secondary text-primary' : 'border-border hover:bg-muted text-muted-foreground'}`}
                title={bookmarked ? 'Remove from watchlist' : 'Save to watchlist'}
              >
                {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-all duration-150"
                title="Share tender"
              >
                <Share2 size={16} />
              </button>
              <button
                onClick={() => window.print()}
                className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-all duration-150"
                title="Print tender details"
              >
                <Printer size={16} />
              </button>
            </div>

            <a
              href={tender.egpLink || "https://supplier.treasury.go.ke/iri/portal"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm px-4 py-2 whitespace-nowrap shadow-sm bg-[#16A34A] hover:bg-[#15803D]"
            >
              <ExternalLink size={14} />
              Apply via e-GP (IFMIS)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaItem({
  icon: Icon,
  label,
  value,
  sub,
  valueClass,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/50 border border-border">
      <div className="p-1.5 rounded-md bg-card border border-border shrink-0 mt-0.5">
        <Icon size={13} className="text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className={`text-sm font-semibold truncate mt-0.5 ${valueClass ?? 'text-foreground'}`}>{value}</p>
        {sub && <p className="text-xs text-muted-foreground truncate">{sub}</p>}
      </div>
    </div>
  );
}
