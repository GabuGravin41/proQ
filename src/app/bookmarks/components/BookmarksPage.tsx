'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { mockTenders } from '@/lib/tenderData';
import StatusBadge from '@/components/ui/StatusBadge';
import AGPOBadge from '@/components/ui/AGPOBadge';
import { BookmarkCheck, Trash2, MapPin, Building2, Clock, FileText, ExternalLink, Search } from 'lucide-react';
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

// Simulate pre-bookmarked tenders
const initialBookmarks = ['tender-001', 'tender-002', 'tender-004', 'tender-007', 'tender-012'];

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<string[]>(initialBookmarks);
  const [search, setSearch] = useState('');

  const bookmarkedTenders = mockTenders.filter(t => bookmarks.includes(t.id));
  const filtered = bookmarkedTenders.filter(t =>
    !search || t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.procuringEntity.toLowerCase().includes(search.toLowerCase())
  );

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b !== id));
    toast.success('Removed from saved tenders');
  };

  const clearAll = () => {
    setBookmarks([]);
    toast.success('All saved tenders cleared');
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
            <BookmarkCheck size={24} className="text-primary" />
            Saved Tenders
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {bookmarks.length} tender{bookmarks.length !== 1 ? 's' : ''} saved to your watchlist
          </p>
        </div>
        {bookmarks.length > 0 && (
          <button
            onClick={clearAll}
            className="btn-secondary text-xs py-1.5 text-danger border-danger/30 hover:bg-danger-bg"
          >
            <Trash2 size={13} />
            Clear All
          </button>
        )}
      </div>

      {/* Search */}
      {bookmarks.length > 0 && (
        <div className="relative mb-5 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search saved tenders..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-base pl-9 text-sm"
          />
        </div>
      )}

      {/* Empty state */}
      {bookmarks.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <BookmarkCheck size={28} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">No saved tenders</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Bookmark tenders from the search page to track them here.
          </p>
          <Link href="/" className="btn-primary">Browse Tenders</Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No saved tenders match your search.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(tender => (
            <div key={tender.id} className="card p-4 hover:shadow-elevated transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <StatusBadge status={tender.status} />
                    <AGPOBadge category={tender.agpoCategory} />
                    {tender.daysRemaining <= 3 && tender.daysRemaining > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-warning-bg text-warning">
                        Closing in {tender.daysRemaining}d
                      </span>
                    )}
                  </div>
                  <Link href={`/tender/${tender.id}`}>
                    <h3 className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 cursor-pointer">
                      {tender.title}
                    </h3>
                  </Link>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5 mb-2">{tender.referenceNumber}</p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building2 size={11} />
                      <span className="font-medium text-foreground/80">{tender.procuringEntity}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />
                      {tender.county}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {tender.daysRemaining <= 0 ? 'Closed' : `${tender.daysRemaining}d left`} · {formatDate(tender.closingDate)}
                    </span>
                    <span className="font-bold font-tabular text-foreground">{formatKES(tender.estimatedValue)}</span>
                  </div>

                  {tender.matchScore !== null && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-success-bg text-success text-xs font-semibold">
                      AI Match: {tender.matchScore}%
                    </div>
                  )}
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  <Link href={`/tender/${tender.id}`} className="btn-primary text-xs py-1.5 px-3">
                    View
                  </Link>
                  {tender.documentAvailable && (
                    <a
                      href={tender.documentUrl ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-xs py-1.5 px-3"
                    >
                      <FileText size={12} />
                      Docs
                    </a>
                  )}
                  {tender.submissionVenue === 'e-GP' && tender.egpLink && (
                    <a
                      href={tender.egpLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-xs py-1.5 px-3"
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                  <button
                    onClick={() => removeBookmark(tender.id)}
                    className="btn-secondary text-xs py-1.5 px-3 text-danger border-danger/20 hover:bg-danger-bg"
                    title="Remove bookmark"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
