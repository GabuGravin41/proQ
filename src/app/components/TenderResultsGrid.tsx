'use client';
import React, { useState } from 'react';
import { Tender } from '@/lib/tenderData';
import TenderCard from './TenderCard';
import { ArrowUpDown, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

interface TenderResultsGridProps {
  tenders: Tender[];
  isLoading: boolean;
  sortBy: string;
  onSortChange: (v: 'closing-date' | 'match-score' | 'value' | 'published-date') => void;
  onMatchScoreClick: () => void;
}

const ITEMS_PER_PAGE_OPTIONS = [6, 12, 24];

export default function TenderResultsGrid({
  tenders,
  isLoading,
  sortBy,
  onSortChange,
  onMatchScoreClick,
}: TenderResultsGridProps) {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const totalPages = Math.ceil(tenders.length / itemsPerPage);
  const paginated = tenders.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const sortOptions: { value: 'closing-date' | 'match-score' | 'value' | 'published-date'; label: string }[] = [
    { value: 'closing-date', label: 'Closing Date' },
    { value: 'match-score', label: 'Match Score' },
    { value: 'value', label: 'Estimated Value' },
    { value: 'published-date', label: 'Published Date' },
  ];

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-40 animate-shimmer rounded" />
          <div className="h-8 w-48 animate-shimmer rounded-lg" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`skeleton-${i + 1}`} className="card p-4 space-y-3">
              <div className="h-4 w-3/4 animate-shimmer rounded" />
              <div className="h-3 w-1/2 animate-shimmer rounded" />
              <div className="h-3 w-full animate-shimmer rounded" />
              <div className="flex gap-2">
                <div className="h-5 w-16 animate-shimmer rounded-full" />
                <div className="h-5 w-16 animate-shimmer rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Results header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-sm font-semibold text-foreground font-tabular">{tenders.length}</span>
          <span className="text-sm text-muted-foreground ml-1">
            {tenders.length === 1 ? 'tender found' : 'tenders found'}
          </span>
          <span className="text-xs text-muted-foreground ml-2">
            · Updated 2 min ago
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown size={13} className="text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground shrink-0">Sort by:</span>
          <select
            value={sortBy}
            onChange={e => {
              onSortChange(e.target.value as 'closing-date' | 'match-score' | 'value' | 'published-date');
              setPage(1);
            }}
            className="input-base h-8 text-xs w-auto pr-7"
          >
            {sortOptions.map(opt => (
              <option key={`sort-${opt.value}`} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Empty state */}
      {tenders.length === 0 && (
        <div className="card flex flex-col items-center justify-center py-16 px-8 text-center">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
            <Inbox size={26} className="text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">No tenders match your filters</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Try adjusting your search query, removing county or AGPO filters, or broadening the value range.
          </p>
        </div>
      )}

      {/* Tender grid */}
      {tenders.length > 0 && (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
            {paginated.map(tender => (
              <TenderCard
                key={tender.id}
                tender={tender}
                onMatchScoreClick={onMatchScoreClick}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Show</span>
                <select
                  value={itemsPerPage}
                  onChange={e => { setItemsPerPage(Number(e.target.value)); setPage(1); }}
                  className="input-base h-7 text-xs w-auto"
                >
                  {ITEMS_PER_PAGE_OPTIONS.map(n => (
                    <option key={`per-page-${n}`} value={n}>{n} per page</option>
                  ))}
                </select>
                <span>of {tenders.length} tenders</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-md border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={14} />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={`page-${pageNum}`}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 rounded-md text-xs font-medium transition-all ${
                        page === pageNum
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-border hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-md border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
