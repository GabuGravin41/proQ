'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/authContext';
import AppLogo from '@/components/ui/AppLogo';
import { explainTenderWithAI, AIMatchResult, TenderAIMetadata } from '@/lib/tenderMetadata';
import {
  X, Send, Mic, MicOff, AlertTriangle, CheckCircle2,
  ExternalLink, Building2, MapPin, Clock, ArrowRight, ShieldAlert,
  ChevronRight, FileText, RotateCcw, Sparkles
} from 'lucide-react';
import Link from 'next/link';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedTenders?: AIMatchResult[];
  clarifyingOptions?: string[];
}

export default function AITenderCopilotModal() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTender, setSelectedTender] = useState<TenderAIMetadata | null>(null);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Conversation history
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Initialize initial greeting when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialGreeting: ChatMessage = {
        id: 'msg-welcome',
        sender: 'ai',
        text: `Habari! I am your **proQ AI Procurement Advisor**.\n\nMost contractors don't start with a tender reference number—they have a business, a crew, and capital. Tell me what you supply or build in your own words, and I'll help clarify your requirements and pinpoint the exact active tenders you can win.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        clarifyingOptions: [
          'AGPO Youth road maintenance under KES 25M',
          'We supply medical reagents & PPE',
          'Solar community boreholes in ASAL counties',
          'ICT hardware & software supply in Nairobi'
        ]
      };
      setMessages([initialGreeting]);
    }
  }, [isOpen]);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  // Send message to AI
  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputQuery).trim();
    if (!prompt || loading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await fetch('/api/ai/tender-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          message: prompt,
          history,
          profile: {
            capabilities: user?.capabilities,
            targetSectors: user?.targetSectors,
            targetCounties: user?.targetCounties,
            minBudget: user?.minBudget,
            maxBudget: user?.maxBudget,
            agpoStatus: user?.agpoStatus,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedTenders: data.suggestedTenders || [],
          clarifyingOptions: data.clarifyingOptions || [],
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error(data.error || 'Failed to generate response');
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: 'I ran into a temporary hiccup scanning the tender database. Please try rephrasing or tap one of the suggested categories.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        clarifyingOptions: [
          'Show AGPO Youth tenders',
          'Roads & Civil Works',
          'Water & Sanitation'
        ]
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    setSelectedTender(null);
    setInputQuery('');
  };

  // Inspect pre-bid breakdown for a tender
  const handleInspectTender = (tenderId: string) => {
    const detail = explainTenderWithAI(tenderId);
    if (detail) {
      setSelectedTender(detail);
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
        setInputQuery(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  return (
    <>
      {/* Floating Trigger Button with Official proQ Logo */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-card border-2 border-primary/30 hover:border-primary text-foreground font-bold text-xs shadow-modal hover:shadow-elevated hover:scale-105 active:scale-95 transition-all group"
        aria-label="Open proQ AI Advisor"
      >
        <AppLogo size={22} />
        <span className="font-extrabold text-foreground tracking-tight text-xs">
          pro<span className="text-primary">Q</span> Advisor
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      </button>

      {/* Main Conversational Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full max-w-3xl bg-card border border-border rounded-2xl shadow-modal flex flex-col h-[680px] max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/40 shrink-0">
              <div className="flex items-center gap-3">
                <AppLogo size={28} />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-foreground tracking-tight">
                      pro<span className="text-primary">Q</span> AI Advisor
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      3,000 Live Notices
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Conversational procurement matching & disqualification protection
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleResetChat}
                  title="Reset conversation"
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-xs flex items-center gap-1"
                >
                  <RotateCcw size={14} />
                  <span className="hidden sm:inline text-[11px]">New Chat</span>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Conversation Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {/* Message Bubble */}
                  <div
                    className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground font-medium rounded-tr-none'
                        : 'bg-muted/50 border border-border text-foreground rounded-tl-none space-y-3'
                    }`}
                  >
                    <div className="whitespace-pre-line">
                      {msg.text}
                    </div>

                    {/* Clarifying Clickable Options */}
                    {msg.clarifyingOptions && msg.clarifyingOptions.length > 0 && (
                      <div className="pt-2 border-t border-border/50">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                          Suggested Options & Next Steps:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.clarifyingOptions.map((opt, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(opt)}
                              className="text-left px-2.5 py-1.5 rounded-lg bg-card hover:bg-secondary text-foreground text-[11px] font-medium border border-border/70 hover:border-primary/50 transition-all flex items-center gap-1.5"
                            >
                              <span>{opt}</span>
                              <ArrowRight size={11} className="text-primary shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Inline Matched Tender Cards */}
                    {msg.suggestedTenders && msg.suggestedTenders.length > 0 && (
                      <div className="pt-2 border-t border-border/50 space-y-2">
                        <p className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-emerald-600" />
                          Matched Opportunities ({msg.suggestedTenders.length}):
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {msg.suggestedTenders.map((result) => (
                            <div
                              key={result.metadata.id}
                              className="p-3 rounded-xl bg-card border border-border hover:border-primary/40 transition-all space-y-1.5 shadow-sm"
                            >
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className="font-mono text-[10px] text-muted-foreground font-bold">
                                  {result.metadata.referenceNumber}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    result.badge === 'Hot Fit'
                                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
                                      : 'bg-primary/10 text-primary'
                                  }`}>
                                    {result.badge} ({result.matchScore}%)
                                  </span>
                                  {result.metadata.intelligence.isAgpoReserved && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                                      AGPO {result.metadata.intelligence.agpoType}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <h4 className="font-bold text-foreground text-xs leading-snug line-clamp-2">
                                {result.metadata.title}
                              </h4>

                              <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap pt-0.5">
                                <span className="flex items-center gap-1">
                                  <Building2 size={12} />
                                  {result.metadata.procuringEntity}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin size={12} />
                                  {result.metadata.county}
                                </span>
                                <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                                  <Clock size={12} />
                                  {result.metadata.liveCountdown}
                                </span>
                              </div>

                              <div className="pt-2 flex items-center justify-between border-t border-border/40 text-[11px]">
                                <span className="font-extrabold text-foreground font-tabular">
                                  {result.metadata.estimatedValue
                                    ? `KES ${(result.metadata.estimatedValue).toLocaleString()}`
                                    : 'Undisclosed'}
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleInspectTender(result.metadata.id)}
                                    className="px-2 py-1 rounded-md bg-secondary hover:bg-muted text-foreground text-[11px] font-semibold flex items-center gap-1"
                                  >
                                    <ShieldAlert size={12} className="text-primary" />
                                    Pre-Bid Check
                                  </button>
                                  <Link
                                    href={`/tender-detail?id=${result.metadata.id}`}
                                    onClick={() => setIsOpen(false)}
                                    className="px-2 py-1 rounded-md bg-primary text-primary-foreground text-[11px] font-semibold flex items-center gap-1"
                                  >
                                    View Tender
                                    <ExternalLink size={11} />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-muted-foreground mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {/* Typing Indicator */}
              {loading && (
                <div className="flex items-start gap-2.5">
                  <div className="p-3 rounded-2xl rounded-tl-none bg-muted/60 border border-border flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    <span className="text-xs text-muted-foreground font-medium">
                      proQ Advisor is analyzing 3,000 public tenders...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 sm:p-4 border-t border-border bg-card shrink-0 space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="relative flex items-center bg-muted/40 border border-border rounded-xl focus-within:border-primary focus-within:bg-card transition-all p-1"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Describe your business, ask for tenders, or ask a pre-bid compliance question..."
                  className="w-full bg-transparent px-3 py-2 text-xs focus:outline-none text-foreground placeholder:text-muted-foreground"
                />

                <div className="flex items-center gap-1 mr-1">
                  {/* Voice Button */}
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`p-2 rounded-lg transition-colors ${
                      isListening
                        ? 'bg-danger text-danger-foreground animate-pulse'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    title={isListening ? 'Listening...' : 'Dictate by voice'}
                  >
                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!inputQuery.trim() || loading}
                    className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-all"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </form>

              <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1">
                <span>Direct analysis from PPIP, e-GP Kenya & all 47 counties</span>
                <span>Press Enter to chat</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pre-Bid Inspection Drawer Modal */}
      {selectedTender && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-modal overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-4 border-b border-border bg-muted/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert size={18} className="text-primary" />
                <h3 className="font-bold text-sm text-foreground">Pre-Bid Disqualification Audit</h3>
              </div>
              <button
                onClick={() => setSelectedTender(null)}
                className="p-1 rounded-md text-muted-foreground hover:bg-muted"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <span className="font-mono text-[10px] text-muted-foreground font-bold">
                  {selectedTender.referenceNumber}
                </span>
                <h4 className="font-bold text-sm text-foreground mt-0.5">
                  {selectedTender.title}
                </h4>
                <p className="text-muted-foreground mt-1">
                  Procuring Entity: <strong className="text-foreground">{selectedTender.procuringEntity}</strong> ({selectedTender.county} County)
                </p>
              </div>

              {/* Critical Alerts */}
              <div className="p-3.5 rounded-xl bg-danger-bg border border-danger/30 space-y-2">
                <h5 className="font-bold text-danger flex items-center gap-1.5 text-xs">
                  <AlertTriangle size={14} />
                  Top Preliminary Disqualification Hazards:
                </h5>
                <ul className="list-disc pl-5 space-y-1 text-danger font-medium text-[11px]">
                  <li>
                    Bid Bond Validity: Must be valid for <strong>{selectedTender.intelligence.bidBondValidityDays} days</strong> from opening. Shorter validity results in immediate disqualification.
                  </li>
                  {selectedTender.intelligence.siteVisitRequired && (
                    <li>
                      Mandatory Site Visit Certificate required: You must physically attend with the county/agency engineer.
                    </li>
                  )}
                  {selectedTender.intelligence.isAgpoReserved && (
                    <li>
                      AGPO Reserved ({selectedTender.intelligence.agpoType}): Must attach a valid National Treasury certificate and signed Tender Securing Declaration Form.
                    </li>
                  )}
                </ul>
              </div>

              {/* Mandatory Checklist */}
              <div className="space-y-2">
                <h5 className="font-bold text-foreground text-xs">
                  Statutory Preliminary Evaluation Checklist:
                </h5>
                <div className="space-y-1.5">
                  {selectedTender.intelligence.mandatoryDocuments.map((doc, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-muted/40 border border-border/60">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-[11px] text-foreground">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-card flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                Deadline: {selectedTender.liveCountdown}
              </span>
              <Link
                href={`/tender-detail?id=${selectedTender.id}`}
                onClick={() => {
                  setSelectedTender(null);
                  setIsOpen(false);
                }}
                className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
              >
                Open Full Tender Workspace
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
