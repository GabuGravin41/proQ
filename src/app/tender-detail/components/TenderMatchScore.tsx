'use client';
import React from 'react';
import { Tender } from '@/lib/tenderData';
import MatchScoreChart from './MatchScoreChart';
import { TrendingUp, Check, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface TenderMatchScoreProps {
  tender: Tender;
}

export default function TenderMatchScore({ tender }: TenderMatchScoreProps) {
  if (tender.matchScore === null) {
    return (
      <div className="card p-5 bg-gradient-to-br from-secondary/50 to-card border-primary/20">
        <div className="flex items-center gap-2 mb-2 text-primary font-bold text-sm">
          <TrendingUp size={16} />
          AI Capability Matching
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Unlock your personalized 0–100% fit score and sub-dimension analysis for this tender.
        </p>
        <Link href="/pricing" className="btn-primary w-full justify-center text-xs py-2">
          Upgrade to Pro
        </Link>
      </div>
    );
  }

  const isHot = tender.matchScore >= 85;
  const isHigh = tender.matchScore >= 70 && tender.matchScore < 85;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <TrendingUp size={16} className={isHot ? 'text-danger' : 'text-primary'} />
            Capability Fit Score
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Matched to your company profile</p>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
          isHot ? 'bg-danger-bg text-danger' : isHigh ? 'bg-warning-bg text-warning' : 'bg-muted text-muted-foreground'
        }`}>
          {isHot ? '🔥 Hot Fit' : isHigh ? '⚡ High Fit' : 'Moderate Fit'}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-4 p-3 rounded-xl bg-muted/40">
        <MatchScoreChart score={tender.matchScore} />
        <div>
          <div className="text-2xl font-black text-foreground font-tabular">
            {tender.matchScore}%
          </div>
          <p className="text-xs text-muted-foreground">Overall Confidence</p>
        </div>
      </div>

      {tender.matchReasons.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Why this matches</p>
          <ul className="space-y-1.5">
            {tender.matchReasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-foreground/85">
                <Check size={13} className="text-success mt-0.5 shrink-0" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
