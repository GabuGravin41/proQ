import React from 'react';
import { Tender } from '@/lib/tenderData';
import Link from 'next/link';
import StatusBadge from '@/components/ui/StatusBadge';
import SourceBadge from '@/components/ui/SourceBadge';
import { Clock, MapPin } from 'lucide-react';

interface RelatedTendersProps {
  tenders: Tender[];
}

function formatKES(value: number | null): string {
  if (value === null) return 'Undisclosed';
  if (value >= 1_000_000) return `KES ${(value / 1_000_000).toFixed(1)}M`;
  return `KES ${value.toLocaleString()}`;
}

export default function RelatedTenders({ tenders }: RelatedTendersProps) {
  if (tenders.length === 0) return null;

  return (
    <div>
      <h2 className="text-base font-bold text-foreground mb-4">Related Tenders</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {tenders.map((tender) => (
          <div key={tender.id} className="card p-4 hover:shadow-elevated transition-all duration-200">
            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
              <StatusBadge status={tender.status} />
              <SourceBadge source={tender.source} />
            </div>
            <Link href={`/tender/${tender.id}`}>
              <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 hover:text-primary transition-colors cursor-pointer mb-2">
                {tender.title}
              </h3>
            </Link>
            <p className="text-xs text-muted-foreground mb-3">{tender.procuringEntity}</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin size={11} />
                <span>{tender.county}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Clock size={11} className="text-muted-foreground" />
                <span className={`font-medium font-tabular ${
                  tender.daysRemaining <= 3 ? 'text-warning' : 'text-foreground'
                }`}>
                  {tender.daysRemaining} days
                </span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-xs font-bold font-tabular text-foreground">{formatKES(tender.estimatedValue)}</span>
              <Link href={`/tender/${tender.id}`} className="text-xs font-semibold text-primary hover:underline">
                View →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
