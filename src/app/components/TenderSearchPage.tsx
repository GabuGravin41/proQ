'use client';
import React, { useState, useMemo } from 'react';
import { mockTenders, Tender } from '@/lib/tenderData';
import TenderSearchHeader from './TenderSearchHeader';
import TenderFilters from './TenderFilters';
import TenderResultsGrid from './TenderResultsGrid';
import PaywallModal from './PaywallModal';
import StatsBar from './StatsBar';
import { useAuth } from '@/lib/authContext';
import { Sparkles } from 'lucide-react';

export interface FilterState {
  query: string;
  semanticMode: boolean;
  counties: string[];
  methods: string[];
  agpoCategories: string[];
  entityTypes: string[];
  categories: string[];
  valueMin: string;
  valueMax: string;
  status: string[];
  sources: string[];
  sortBy: 'closing-date' | 'match-score' | 'value' | 'published-date';
}

const defaultFilters: FilterState = {
  query: '',
  semanticMode: false,
  counties: [],
  methods: [],
  agpoCategories: [],
  entityTypes: [],
  categories: [],
  valueMin: '',
  valueMax: '',
  status: [],
  sources: [],
  sortBy: 'closing-date',
};

// Natural language semantic matcher
function calculateSemanticMatch(tender: Tender, queryText: string): { score: number; reasons: string[] } {
  if (!queryText.trim()) return { score: tender.matchScore ?? 75, reasons: tender.matchReasons };

  const tokens = queryText.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  let matchedTokens = 0;
  const reasons: string[] = [];

  const textToSearch = `${tender.title} ${tender.description} ${tender.category} ${tender.procuringEntity} ${tender.county} ${tender.agpoCategory}`.toLowerCase();

  tokens.forEach(token => {
    if (textToSearch.includes(token)) {
      matchedTokens++;
      if (tender.category.toLowerCase().includes(token)) {
        reasons.push(`Strong category correlation with "${token}"`);
      } else if (tender.county.toLowerCase().includes(token)) {
        reasons.push(`Target geographical match in ${tender.county} County`);
      } else if (tender.title.toLowerCase().includes(token)) {
        reasons.push(`Direct specification match for "${token}"`);
      }
    }
  });

  const ratio = tokens.length > 0 ? matchedTokens / tokens.length : 0.5;
  const dynamicScore = Math.min(99, Math.max(45, Math.round(50 + ratio * 49)));

  if (reasons.length === 0 && ratio > 0) {
    reasons.push(`Relevant keyword alignment with your search query`);
  }

  return { score: dynamicScore, reasons };
}

import { enrichTenderWithLiveStatus } from '@/lib/dateUtils';

export default function TenderSearchPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState<string>('AI Semantic Search');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSemanticToggle = () => {
    if (!filters.semanticMode) {
      if (user?.role === 'subscriber' || user?.role === 'admin') {
        setFilters(prev => ({ ...prev, semanticMode: true }));
      } else {
        setPaywallFeature('AI Semantic Search & Matching');
        setPaywallOpen(true);
      }
    } else {
      setFilters(prev => ({ ...prev, semanticMode: false }));
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: FilterState[keyof FilterState]) => {
    setIsLoading(true);
    setFilters(prev => ({ ...prev, [key]: value }));
    setTimeout(() => setIsLoading(false), 200);
  };

  const handleSaveSearch = () => {
    if (user?.role === 'subscriber' || user?.role === 'admin') {
      window.location.href = '/notification-preferences';
    } else {
      setPaywallFeature('Saved Searches & Automated Alerts');
      setPaywallOpen(true);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    setFilters(prev => ({ ...prev, query: promptText, semanticMode: true }));
  };

  const filteredTenders = useMemo(() => {
    let result = mockTenders.map(t => enrichTenderWithLiveStatus(t));

    if (filters.semanticMode && filters.query.trim()) {
      // Dynamic semantic scoring & sorting
      result = result.map(t => {
        const { score, reasons } = calculateSemanticMatch(t, filters.query);
        return {
          ...t,
          matchScore: score,
          matchReasons: reasons.length > 0 ? reasons : t.matchReasons,
        };
      });
      result.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
    } else if (filters.query.trim()) {
      const q = filters.query.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.procuringEntity.toLowerCase().includes(q) ||
        t.referenceNumber.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.county.toLowerCase().includes(q)
      );
    }

    if (filters.counties.length > 0) {
      result = result.filter(t => 
        filters.counties.some(c => 
          c.toLowerCase() === (t.county || '').toLowerCase() ||
          (t.county || '').toLowerCase().includes(c.toLowerCase())
        )
      );
    }
    if (filters.methods.length > 0) {
      result = result.filter(t => filters.methods.includes(t.procurementMethod));
    }
    if (filters.agpoCategories.length > 0) {
      result = result.filter(t => {
        if (filters.agpoCategories.includes('Special Groups') && (t.agpoCategory === 'Youth' || t.agpoCategory === 'Women' || t.agpoCategory === 'PWD')) {
          return true;
        }
        return filters.agpoCategories.includes(t.agpoCategory);
      });
    }
    if (filters.entityTypes.length > 0) {
      result = result.filter(t => filters.entityTypes.includes(t.entityType));
    }
    if (filters.categories.length > 0) {
      result = result.filter(t => 
        filters.categories.some(cat => 
          cat.toLowerCase() === (t.category || '').toLowerCase() ||
          (t.category || '').toLowerCase().includes(cat.toLowerCase())
        )
      );
    }
    if (filters.status.length > 0) {
      result = result.filter(t => filters.status.includes(t.status));
    }
    if (filters.sources.length > 0) {
      result = result.filter(t => 
        filters.sources.some(s => {
          const sLower = s.toLowerCase();
          const tLower = (t.source || '').toLowerCase();
          return tLower.includes(sLower) || sLower.includes(tLower);
        })
      );
    }
    if (filters.valueMin) {
      result = result.filter(t => t.estimatedValue !== null && t.estimatedValue >= Number(filters.valueMin) * 1000000);
    }
    if (filters.valueMax) {
      result = result.filter(t => t.estimatedValue !== null && t.estimatedValue <= Number(filters.valueMax) * 1000000);
    }

    if (!filters.semanticMode) {
      result.sort((a, b) => {
        if (filters.sortBy === 'closing-date') return a.daysRemaining - b.daysRemaining;
        if (filters.sortBy === 'match-score') return (b.matchScore ?? 0) - (a.matchScore ?? 0);
        if (filters.sortBy === 'value') return (b.estimatedValue ?? 0) - (a.estimatedValue ?? 0);
        if (filters.sortBy === 'published-date') return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
        return 0;
      });
    }

    return result;
  }, [filters]);

  const activeFilterCount = [
    filters.counties.length,
    filters.methods.length,
    filters.agpoCategories.length,
    filters.entityTypes.length,
    filters.categories.length,
    filters.status.length,
    filters.sources.length,
    filters.valueMin ? 1 : 0,
    filters.valueMax ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 2xl:px-16 py-6">
      {/* Stats Bar */}
      <StatsBar tenders={mockTenders} />

      {/* Search Header */}
      <TenderSearchHeader
        filters={filters}
        onFilterChange={handleFilterChange}
        onSemanticToggle={handleSemanticToggle}
        onSaveSearch={handleSaveSearch}
        activeFilterCount={activeFilterCount}
        onToggleMobileFilters={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Quick Prompt Ideas */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-muted-foreground shrink-0 flex items-center gap-1 font-medium">
          <Sparkles size={12} className="text-primary" /> Try searching:
        </span>
        {[
          'Solar water pumps Turkana county',
          'IP CCTV security system KAA',
          'Hospital patient monitors Nairobi',
          'Alliance High school lab chemicals',
          'Road construction asphalt works',
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickPrompt(prompt)}
            className="px-2.5 py-1 rounded-full bg-secondary/80 hover:bg-secondary text-secondary-foreground shrink-0 transition-colors border border-primary/20"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="mt-6 flex gap-6">
        {/* Filters Sidebar */}
        <aside className={`
          ${sidebarOpen ? 'fixed inset-0 z-30 flex' : 'hidden'}
          lg:relative lg:flex lg:inset-auto lg:z-auto
          lg:w-64 xl:w-72 shrink-0
        `}>
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="absolute inset-0 bg-foreground/20 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <div className={`
            ${sidebarOpen ? 'relative z-10 ml-auto w-80 h-full overflow-y-auto' : ''}
            lg:w-full lg:h-auto lg:overflow-visible
            bg-card border border-border rounded-xl shadow-card p-4
          `}>
            <TenderFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <TenderResultsGrid
            tenders={filteredTenders}
            isLoading={isLoading}
            sortBy={filters.sortBy}
            onSortChange={(v) => handleFilterChange('sortBy', v)}
            onMatchScoreClick={() => {
              setPaywallFeature('AI Match Scoring');
              setPaywallOpen(true);
            }}
          />
        </div>
      </div>

      <PaywallModal
        open={paywallOpen}
        feature={paywallFeature}
        onClose={() => setPaywallOpen(false)}
      />
    </div>
  );
}
