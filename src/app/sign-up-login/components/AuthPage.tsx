'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import AppLogo from '@/components/ui/AppLogo';
import { Sparkles, Bell, TrendingUp, Shield } from 'lucide-react';

const stats = [
  { id: 'stat-tenders', value: '500+', label: 'Active tenders indexed' },
  { id: 'stat-value', value: 'KES 26.4B', label: 'Total pipeline value' },
  { id: 'stat-entities', value: '312', label: 'Procuring entities tracked' },
  { id: 'stat-daily', value: '94', label: 'New tenders today' },
];

const proFeatures = [
  { icon: Sparkles, label: 'AI Semantic Search', desc: 'Find tenders by describing your business capabilities' },
  { icon: TrendingUp, label: 'Match Scoring', desc: 'Personalised 0–100% fit score per tender' },
  { icon: Bell, label: 'Proactive Alerts', desc: 'Instant WhatsApp, Telegram & Email notifications' },
  { icon: Shield, label: 'Statutory Pre-Bid Checklist', desc: 'KRA, CR12, NCA & AGPO eligibility validation' },
];

function AuthFormContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';
  const [tab, setTab] = useState<'login' | 'signup'>(initialTab);

  useEffect(() => {
    const requestedTab = searchParams.get('tab');
    if (requestedTab === 'signup' || requestedTab === 'login') {
      setTab(requestedTab);
    }
  }, [searchParams]);

  return (
    <div className="w-full max-w-md">
      {/* Tab switcher */}
      <div className="flex rounded-xl border border-border bg-muted p-1 mb-6">
        <button
          onClick={() => setTab('login')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            tab === 'login' ? 'bg-card text-foreground shadow-card' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setTab('signup')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            tab === 'signup' ? 'bg-card text-foreground shadow-card' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Forms */}
      {tab === 'login' ? (
        <LoginForm onSwitchToSignup={() => setTab('signup')} />
      ) : (
        <SignupForm onSwitchToLogin={() => setTab('login')} />
      )}
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] bg-primary flex-col justify-between p-10 xl:p-14 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-white" />
          <div className="absolute bottom-32 left-8 w-40 h-40 rounded-full bg-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <AppLogo size={44} />
            <span className="text-2xl font-extrabold text-white tracking-tight">TenderIQ</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
            Kenya&apos;s most complete procurement intelligence platform
          </h1>
          <p className="text-white/80 text-base leading-relaxed mb-10">
            Discover every public tender from PPIP, e-GP Kenya, county governments, universities, and national schools — with AI-powered match scoring so you never miss the right opportunity.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-10">
            {stats.map(stat => (
              <div key={stat.id} className="bg-white/10 rounded-xl p-4 border border-white/20">
                <p className="text-xl font-bold text-white font-tabular">{stat.value}</p>
                <p className="text-xs text-white/70 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Pro features */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Pro Features</p>
            {proFeatures.map((feat) => {
              const { icon: Icon } = feat;
              return (
                <div key={`auth-feat-${feat.label}`} className="flex items-start gap-3">
                  <div className="p-1.5 rounded-md bg-white/15 shrink-0">
                    <Icon size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{feat.label}</p>
                    <p className="text-xs text-white/60">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-white/50">
            Data sourced from PPIP (tenders.go.ke/tenders), e-GP Kenya, and official institutional noticeboards. Protected under Kenya Data Protection Act 2019.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <AppLogo size={36} />
          <span className="text-xl font-bold text-primary">TenderIQ</span>
        </div>

        <Suspense fallback={<div className="w-full max-w-md p-8 text-center text-muted-foreground">Loading form...</div>}>
          <AuthFormContent />
        </Suspense>
      </div>
    </div>
  );
}
