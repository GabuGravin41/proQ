'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { mockTenders, Tender } from '@/lib/tenderData';
import StatusBadge from '@/components/ui/StatusBadge';
import AGPOBadge from '@/components/ui/AGPOBadge';
import {
  Flame, TrendingUp, MapPin, Building2, Clock,
  ChevronDown, ChevronUp, Bookmark, BookmarkCheck,
  Lock, ArrowRight, Bell, Filter
} from 'lucide-react';
import { toast } from 'sonner';

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

const hotFitTenders = mockTenders.filter(t => t.matchScore !== null && t.matchScore >= 85);
const goodFitTenders = mockTenders.filter(t => t.matchScore !== null && t.matchScore >= 70 && t.matchScore < 85);

interface MatchCardProps {
  tender: Tender;
  tier: 'hot' | 'good';
}

function MatchCard({ tender, tier }: MatchCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? 'Removed from saved tenders' : 'Saved to watchlist');
  };

  const scoreColor = tier === 'hot' ? 'text-danger' : 'text-accent';
  const scoreBg = tier === 'hot' ? 'bg-danger-bg border-danger/20' : 'bg-warning-bg border-warning/20';
  const scoreBar = tier === 'hot' ? 'bg-danger' : 'bg-accent';
  const tierIcon = tier === 'hot' ? <Flame size={13} className="text-danger" /> : <TrendingUp size={13} className="text-accent" />;
  const tierLabel = tier === 'hot' ? 'Hot Fit' : 'Good Fit';

  return (
    <div className="card hover:shadow-elevated transition-all duration-200">
      <div className="p-4">
        {/* Tier badge + score */}
        <div className={`flex items-center justify-between px-3 py-2 rounded-lg border mb-3 ${scoreBg}`}>
          <div className="flex items-center gap-1.5">
            {tierIcon}
            <span className={`text-xs font-bold ${scoreColor}`}>{tierLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${scoreBar}`}
                style={{ width: `${tender.matchScore}%` }}
              />
            </div>
            <span className={`text-sm font-extrabold font-tabular ${scoreColor}`}>{tender.matchScore}%</span>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <StatusBadge status={tender.status} />
              <AGPOBadge category={tender.agpoCategory} />
            </div>
            <Link href={`/tender/${tender.id}`}>
              <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                {tender.title}
              </h3>
            </Link>
            <p className="text-xs font-mono text-muted-foreground mt-0.5">{tender.referenceNumber}</p>
          </div>
          <button
            onClick={handleBookmark}
            className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary transition-all"
          >
            {bookmarked ? <BookmarkCheck size={16} className="text-primary" /> : <Bookmark size={16} />}
          </button>
        </div>

        {/* Meta */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Building2 size={11} className="shrink-0" />
            <span className="font-medium text-foreground/80 truncate">{tender.procuringEntity}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin size={11} />{tender.county}</span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              <span className={tender.daysRemaining <= 3 ? 'text-warning font-semibold' : ''}>
                {tender.daysRemaining}d left · {formatDate(tender.closingDate)}
              </span>
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Est. Value</span>
            <span className="font-bold font-tabular text-foreground">{formatKES(tender.estimatedValue)}</span>
          </div>
        </div>

        {/* Match reasons toggle */}
        {tender.matchReasons.length > 0 && (
          <div className="border-t border-border pt-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-between w-full text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              <span>Why this matches your profile ({tender.matchReasons.length} reasons)</span>
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            {expanded && (
              <ul className="mt-2 space-y-1.5 animate-slide-up">
                {tender.matchReasons.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                    {reason}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-3 pt-3 border-t border-border">
          <Link href={`/tender/${tender.id}`} className="flex-1 btn-primary justify-center text-xs py-1.5">
            View Details
          </Link>
          <button className="btn-secondary text-xs py-1.5 px-3">
            <Bell size={13} />
            Alert
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyMatchesPage() {
  const [activeTab, setActiveTab] = useState<'hot' | 'good' | 'all'>('hot');
  const isSubscriber = true; // Simulate subscriber view

  const displayTenders = activeTab === 'hot' ? hotFitTenders
    : activeTab === 'good' ? goodFitTenders
    : [...hotFitTenders, ...goodFitTenders];

  if (!isSubscriber) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
          <Lock size={28} className="text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Pro Feature</h2>
        <p className="text-muted-foreground mb-6">
          My Matches Dashboard is available to Pro subscribers. Upgrade to see tenders scored against your capability profile.
        </p>
        <Link href="/pricing" className="btn-primary">
          View Pricing Plans <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">My Matches</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tenders scored against your capability profile · Updated continuously
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/capability-profile" className="btn-secondary text-xs py-1.5">
            <Filter size={13} />
            Edit Profile
          </Link>
          <Link href="/notification-preferences" className="btn-secondary text-xs py-1.5">
            <Bell size={13} />
            Alert Settings
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Hot Fit (≥85%)', value: hotFitTenders.length.toString(), color: 'text-danger', bg: 'bg-danger-bg', icon: <Flame size={16} className="text-danger" /> },
          { label: 'Good Fit (70–84%)', value: goodFitTenders.length.toString(), color: 'text-accent', bg: 'bg-warning-bg', icon: <TrendingUp size={16} className="text-accent" /> },
          { label: 'Avg Match Score', value: `${Math.round([...hotFitTenders, ...goodFitTenders].reduce((s, t) => s + (t.matchScore ?? 0), 0) / ([...hotFitTenders, ...goodFitTenders].length || 1))}%`, color: 'text-primary', bg: 'bg-secondary', icon: <TrendingUp size={16} className="text-primary" /> },
          { label: 'Total Pipeline', value: 'KES 162M+', color: 'text-success', bg: 'bg-success-bg', icon: <TrendingUp size={16} className="text-success" /> },
        ].map((stat, i) => (
          <div key={i} className={`card p-3 flex items-center gap-3 ${stat.bg}`}>
            {stat.icon}
            <div>
              <p className={`text-lg font-extrabold font-tabular ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-muted rounded-xl p-1 w-fit mb-6">
        {([
          { id: 'hot', label: `🔥 Hot Fit (${hotFitTenders.length})` },
          { id: 'good', label: `📈 Good Fit (${goodFitTenders.length})` },
          { id: 'all', label: `All Matches (${hotFitTenders.length + goodFitTenders.length})` },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {displayTenders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No matches in this category yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Update your capability profile to improve match quality.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayTenders.map(tender => (
            <MatchCard
              key={tender.id}
              tender={tender}
              tier={tender.matchScore !== null && tender.matchScore >= 85 ? 'hot' : 'good'}
            />
          ))}
        </div>
      )}
    </div>
  );
}
