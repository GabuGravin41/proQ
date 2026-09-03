'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/authContext';
import { searchTendersWithAI, explainTenderWithAI, AIMatchResult, TenderAIMetadata } from '@/lib/tenderMetadata';
import {
  Sparkles, X, Search, Mic, MicOff, AlertTriangle, CheckCircle2,
  ExternalLink, Building2, MapPin, Clock, ArrowRight, ShieldAlert,
  ChevronRight, FileText, Send, RefreshCw, BadgeCheck
} from 'lucide-react';
import Link from 'next/link';

export default function AITenderCopilotModal() {
  const { user, isSubscriber } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'explain'>('search');
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<AIMatchResult[]>([]);
  const [selectedTender, setSelectedTender] = useState<TenderAIMetadata | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize with recommendations based on user profile
  useEffect(() => {
    if (isOpen && matches.length === 0) {
      runSearch('');
    }
  }, [isOpen]);

  const runSearch = (searchQuery: string) => {
    setLoading(true);
    setTimeout(() => {
      const results = searchTendersWithAI({
        userPrompt: searchQuery,
        profile: {
          capabilities: user?.capabilities,
          targetSectors: user?.targetSectors,
          targetCounties: user?.targetCounties,
          minBudget: user?.minBudget,
          maxBudget: user?.maxBudget,
          agpoStatus: user?.agpoStatus,
        },
        limit: 15,
      });
      setMatches(results);
      setLoading(false);
    }, 150);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  const handleQuickPrompt = (prompt: string) => {
    setQuery(prompt);
    runSearch(prompt);
  };

  const handleExplain = (tenderId: string) => {
    const explanation = explainTenderWithAI(tenderId);
    if (explanation) {
      setSelectedTender(explanation);
      setActiveTab('explain');
    }
  };

  // Web Speech API Voice Search
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-KE';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        runSearch(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } else {
      alert('Speech recognition is not supported by your current browser.');
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-elevated hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all group"
        aria-label="Open proQ AI Tender Copilot"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
        </span>
        <Sparkles size={16} className="text-accent group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">AI Bidding Copilot</span>
        <span className="sm:hidden">AI Copilot</span>
      </button>

      {/* Modal / Drawer Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          <div
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full max-w-3xl bg-card border border-border rounded-2xl shadow-modal flex flex-col max-h-[90vh] overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:px-6 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                  <Sparkles size={18} className="text-accent" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-foreground">proQ AI Bidding Copilot</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent">
                      Smart Assistant
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Matches company profile, explains tender requirements & shields against disqualification
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-border bg-card px-4 sm:px-6 gap-6 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('search')}
                className={`py-3 border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'search'
                    ? 'border-emerald-600 text-emerald-700 font-bold'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Search size={14} />
                Find Matching Tenders
              </button>
              <button
                onClick={() => {
                  if (selectedTender) setActiveTab('explain');
                  else if (matches.length > 0) handleExplain(matches[0].metadata.id);
                }}
                className={`py-3 border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'explain'
                    ? 'border-emerald-600 text-emerald-700 font-bold'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <ShieldAlert size={14} />
                Tender Breakdown & Watch-Outs
                {selectedTender && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary">
                    Selected
                  </span>
                )}
              </button>
            </div>

            {/* Tab 1: AI Search & Profile Matching */}
            {activeTab === 'search' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {/* Profile Context Banner */}
                <div className="p-3 rounded-xl border border-border bg-muted/30 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">Bidding Profile:</span>
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                      {user?.company || 'Standard Profile'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
                      AGPO: {user?.agpoStatus || 'Open'}
                    </span>
                  </div>
                  <Link
                    href="/capability-profile"
                    onClick={() => setIsOpen(false)}
                    className="text-primary hover:underline text-[11px] font-medium"
                  >
                    Edit Preferences →
                  </Link>
                </div>

                {/* Natural Language Search Input */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="relative flex items-center">
                    <Search size={16} className="absolute left-3 text-muted-foreground" />
                    <input
                      type="text"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder="Ask AI: e.g. Solar water pumping tenders in Northern Kenya under 40M closing soon..."
                      className="w-full pl-9 pr-20 py-2.5 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <div className="absolute right-2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={toggleListening}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isListening ? 'bg-danger text-white animate-pulse' : 'text-muted-foreground hover:bg-muted'
                        }`}
                        title={isListening ? 'Listening...' : 'Voice Search'}
                      >
                        {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                      </button>
                      <button
                        type="submit"
                        className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        title="Run AI Search"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                </form>

                {/* Quick Prompts */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-semibold text-muted-foreground">Quick queries:</span>
                  {[
                    'AGPO Youth opportunities closing this month',
                    'Roads & Civil Works in Western Kenya',
                    'Solar & Water borehole supply',
                    'ICT & Cloud software tenders',
                  ].map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="text-[10px] px-2 py-1 rounded-full border border-border bg-card hover:bg-muted text-foreground transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                {/* Matches List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      {loading ? 'Analyzing 500 notices...' : `AI Matched Tenders (${matches.length})`}
                    </span>
                    {loading && <RefreshCw size={12} className="animate-spin text-muted-foreground" />}
                  </div>

                  {matches.map(({ metadata, matchScore, matchReasons, badge }) => {
                    const badgeClass =
                      badge === 'Hot Fit'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : badge === 'High Fit'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200';

                    return (
                      <div
                        key={metadata.id}
                        className="p-3.5 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-card transition-all"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}>
                              {badge} ({matchScore}%)
                            </span>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground">
                              {metadata.category}
                            </span>
                            <span className="text-[10px] font-semibold text-primary">
                              {metadata.intelligence.agpoType}
                            </span>
                          </div>
                          <span className="text-[11px] font-medium text-danger whitespace-nowrap">
                            {metadata.liveCountdown}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-foreground leading-snug line-clamp-2 mb-1.5">
                          {metadata.title}
                        </h4>

                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-2 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Building2 size={12} /> {metadata.procuringEntity}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} /> {metadata.county} County
                          </span>
                          <span className="font-semibold text-foreground">
                            {metadata.estimatedValue ? `KES ${(metadata.estimatedValue).toLocaleString()}` : 'Undisclosed'}
                          </span>
                        </div>

                        {/* Match Reasons */}
                        {matchReasons.length > 0 && (
                          <div className="mb-2.5 p-2 rounded-lg bg-muted/40 text-[11px] text-muted-foreground space-y-0.5">
                            {matchReasons.slice(0, 2).map((r, i) => (
                              <div key={i} className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                                <BadgeCheck size={11} className="shrink-0" />
                                <span>{r}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-1 border-t border-border">
                          <button
                            onClick={() => handleExplain(metadata.id)}
                            className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1"
                          >
                            <ShieldAlert size={13} />
                            Explain Tender & Watch-Outs →
                          </button>
                          <Link
                            href={`/tender/${metadata.id}`}
                            onClick={() => setIsOpen(false)}
                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                          >
                            View Workspace <ChevronRight size={13} />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Deep Tender Breakdown & Disqualification Watch-Outs */}
            {activeTab === 'explain' && selectedTender && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                {/* Tender Header Banner */}
                <div className="p-4 rounded-xl border border-border bg-muted/30">
                  <div className="flex items-center justify-between gap-2 mb-1 text-[11px]">
                    <span className="font-semibold text-primary">{selectedTender.referenceNumber}</span>
                    <span className="font-bold text-danger">{selectedTender.liveCountdown}</span>
                  </div>
                  <h3 className="font-bold text-sm text-foreground mb-2 leading-snug">
                    {selectedTender.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    <span>{selectedTender.procuringEntity}</span>
                    <span>•</span>
                    <span>{selectedTender.county} County</span>
                    <span>•</span>
                    <span className="font-bold text-foreground">
                      {selectedTender.estimatedValue ? `KES ${(selectedTender.estimatedValue).toLocaleString()}` : 'Undisclosed'}
                    </span>
                  </div>
                </div>

                {/* 1. Executive Summary */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-1.5 flex items-center gap-1.5">
                    <FileText size={14} className="text-primary" />
                    AI Executive Scope Summary
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed p-3 rounded-xl bg-card border border-border">
                    {selectedTender.aiExecutiveSummary}
                  </p>
                </div>

                {/* 2. Preliminary Disqualification Shield & Watch-Outs */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-danger mb-1.5 flex items-center gap-1.5">
                    <ShieldAlert size={14} className="text-danger" />
                    Critical Watch-Outs & Disqualification Hazards
                  </h4>
                  <div className="p-3.5 rounded-xl border border-danger/30 bg-danger-bg/40 space-y-2">
                    {selectedTender.intelligence.keyRisks.map((risk, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-danger font-medium leading-relaxed">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5 text-danger" />
                        <span>{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Mandatory Statutory Documents Required */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    Mandatory Statutory Checklist (Preliminary Stage)
                  </h4>
                  <div className="p-3 rounded-xl border border-border bg-card space-y-1.5">
                    {selectedTender.intelligence.mandatoryDocuments.map((doc, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Application Venue & Steps */}
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-foreground">
                        Submission Portal: {selectedTender.applicationGuidance.portalName}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        Deadline: {selectedTender.applicationGuidance.hardDeadline}
                      </p>
                    </div>
                    <a
                      href={selectedTender.applicationGuidance.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-xs px-3.5 py-1.5 shadow-sm flex items-center gap-1.5 shrink-0"
                    >
                      Open Portal <ExternalLink size={13} />
                    </a>
                  </div>

                  <div className="text-[11px] text-muted-foreground space-y-1 pt-1 border-t border-primary/10">
                    <span className="font-semibold text-foreground">Application Process:</span>
                    {selectedTender.applicationGuidance.submissionSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="font-bold text-primary">{idx + 1}.</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setActiveTab('search')}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    ← Back to Matched Tenders
                  </button>
                  <Link
                    href={`/tender/${selectedTender.id}`}
                    onClick={() => setIsOpen(false)}
                    className="btn-secondary text-xs px-4 py-2"
                  >
                    Open Full BOQ & Workspace
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
