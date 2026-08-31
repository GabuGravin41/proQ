'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Bell, SlidersHorizontal, X, Mic, MicOff, Volume2 } from 'lucide-react';
import { FilterState } from './TenderSearchPage';
import { toast } from 'sonner';

interface TenderSearchHeaderProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: FilterState[keyof FilterState]) => void;
  onSemanticToggle: () => void;
  onSaveSearch: () => void;
  activeFilterCount: number;
  onToggleMobileFilters: () => void;
}

export default function TenderSearchHeader({
  filters,
  onFilterChange,
  onSemanticToggle,
  onSaveSearch,
  activeFilterCount,
  onToggleMobileFilters,
}: TenderSearchHeaderProps) {
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API support
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-KE,en-US,en-GB';

        recognition.onstart = () => {
          setIsListening(true);
          toast.info('🎙️ Listening... Speak your tender search query');
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            onFilterChange('query', transcript);
            toast.success(`Voice captured: "${transcript}"`);
          }
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.log('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            toast.error('Microphone permission was denied.');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setSpeechSupported(false);
      }
    }
  }, [onFilterChange]);

  const handleToggleVoice = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        // If already started or browser state issue, restart
        recognitionRef.current.stop();
        setTimeout(() => recognitionRef.current?.start(), 200);
      }
    } else {
      // Graceful fallback for non-supported browsers / sandbox
      const sampleQueries = [
        'Solar water pumping boreholes in Turkana',
        'Road maintenance asphalt paving KeNHA',
        'Hospital surgical equipment Coast General',
        'School laboratory chemicals Alliance High',
      ];
      const randomQuery = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
      onFilterChange('query', randomQuery);
      toast.success(`Voice AI Simulated: "${randomQuery}"`);
    }
  };

  return (
    <div className="card p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input with Voice Mic */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={filters.query}
            onChange={e => onFilterChange('query', e.target.value)}
            placeholder={
              isListening
                ? 'Listening... Speak your tender requirements now...'
                : filters.semanticMode
                ? 'Describe your business or capability — e.g. "solar water pump installation arid counties"'
                : 'Search by title, entity, reference number, or category...'
            }
            className={`input-base pl-9 pr-20 h-10 transition-all ${
              isListening ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : ''
            }`}
          />

          {/* Right Icons: Clear & Voice Mic */}
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {filters.query && (
              <button
                onClick={() => onFilterChange('query', '')}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}

            {/* Voice Speech-to-Text Button */}
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs font-semibold ${
                isListening
                  ? 'bg-danger text-white animate-pulse shadow-sm'
                  : 'text-muted-foreground hover:text-primary hover:bg-secondary'
              }`}
              title={isListening ? 'Stop listening' : 'Voice Search (Speech-to-Text AI)'}
            >
              {isListening ? (
                <>
                  <MicOff size={14} className="text-white" />
                  <span className="text-[10px] hidden md:inline font-bold">Listening</span>
                </>
              ) : (
                <Mic size={15} />
              )}
            </button>
          </div>
        </div>

        {/* AI Semantic Toggle */}
        <button
          onClick={onSemanticToggle}
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-all duration-150 shrink-0
            ${filters.semanticMode
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
            }
          `}
        >
          <Sparkles size={15} />
          AI Search
          {!filters.semanticMode && (
            <span className="px-1.5 py-0.5 rounded text-xs bg-accent text-accent-foreground font-bold">
              PRO
            </span>
          )}
        </button>

        {/* Save Search */}
        <button
          onClick={onSaveSearch}
          className="btn-secondary shrink-0 h-10"
          title="Save search as alert"
        >
          <Bell size={15} />
          <span className="hidden sm:inline">Save Alert</span>
        </button>

        {/* Mobile filter toggle */}
        <button
          onClick={onToggleMobileFilters}
          className="lg:hidden btn-secondary h-10 shrink-0 relative"
        >
          <SlidersHorizontal size={15} />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Voice Listening Feedback Banner */}
      {isListening && (
        <div className="mt-2.5 p-2 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-between text-xs text-primary animate-slide-up">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-danger animate-ping" />
            <span className="font-semibold">Voice Speech-to-Text Active:</span>
            <span>Speak naturally (e.g. &ldquo;Boreholes in Turkana&rdquo; or &ldquo;Hospital equipment in Mombasa&rdquo;)</span>
          </div>
          <button
            onClick={handleToggleVoice}
            className="text-[11px] font-bold text-danger hover:underline ml-2 shrink-0"
          >
            Done Speaking
          </button>
        </div>
      )}
    </div>
  );
}
