'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search, Sparkles, Bell, Shield, ArrowRight, Check,
  Building2, MapPin, TrendingUp, Zap, Clock, FileSpreadsheet, Mic, ChevronRight
} from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';

export default function LandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
  };

  const samplePrompts = [
    'Solar water pumping boreholes in Turkana',
    'Road construction asphalt works KeNHA',
    'Hospital surgical equipment Coast General',
    'Laboratory chemicals Alliance High School',
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-border bg-gradient-to-b from-primary/5 via-transparent to-transparent">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            500+ Verified Public Tenders · KES 24.7B Pipeline across 47 Counties
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight sm:leading-none mb-6">
            Find the Right Tenders.<br />
            <span className="text-primary">Win More Public Contracts.</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            proQ continuously tracks and verifies notices from PPIP, e-GP Kenya, county governments, and parastatals — delivering instant 07:00 AM WhatsApp alerts and pre-extracted BOQs straight to your team.
          </p>

          {/* Interactive Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-4">
            <div className="relative flex items-center bg-card border-2 border-primary/30 rounded-2xl shadow-elevated p-1.5 focus-within:border-primary transition-all">
              <Search size={20} className="text-muted-foreground ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search tenders, entities, or sectors (e.g. 'Solar boreholes Turkana')..."
                className="w-full bg-transparent border-none px-3 py-2 text-sm focus:outline-none text-foreground placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="btn-primary rounded-xl px-5 py-2.5 text-sm font-bold shrink-0 flex items-center gap-1.5"
              >
                Search Live
                <ArrowRight size={15} />
              </button>
            </div>
          </form>

          {/* Quick Prompts */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground max-w-2xl mx-auto">
            <span className="font-semibold text-foreground/80">Trending searches:</span>
            {samplePrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => router.push(`/?q=${encodeURIComponent(prompt)}`)}
                className="px-2.5 py-1 rounded-full bg-muted hover:bg-secondary text-foreground text-[11px] transition-colors border border-border"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="border-b border-border bg-card py-8">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-extrabold text-primary font-tabular">500+</p>
            <p className="text-xs text-muted-foreground mt-1">Verified Active Tenders</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-foreground font-tabular">KES 24.7B</p>
            <p className="text-xs text-muted-foreground mt-1">Total Pipeline Value</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-emerald-600 font-tabular">224 Lots</p>
            <p className="text-xs text-muted-foreground mt-1">AGPO Reserved (Youth/Women/PWD)</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-foreground font-tabular">47 Counties</p>
            <p className="text-xs text-muted-foreground mt-1">Monitored Nationwide</p>
          </div>
        </div>
      </section>

      {/* 3 Step Workflow */}
      <section className="py-16 lg:py-24 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">How proQ Accelerates Your Bidding</h2>
            <p className="text-sm text-muted-foreground">
              Everything you need to discover high-value procurement opportunities before competitors:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center">
                1
              </div>
              <h3 className="text-base font-bold text-foreground">Set Your Bidding Profile</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Specify your target sectors (Roads, Water, Medical, ICT, Food), operating counties, budget capacity, and AGPO category.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center">
                2
              </div>
              <h3 className="text-base font-bold text-foreground">Instant Morning WhatsApp Alerts</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Receive notifications at 07:00 AM EAT whenever a tender with $\ge 85\%$ match score is published, giving your team 14–30 days to prepare.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center">
                3
              </div>
              <h3 className="text-base font-bold text-foreground">Export Pre-Extracted BOQs</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Download structured Bill of Quantities in Excel, view tender fees, bid bonds, and mandatory site visit dates without scanning 100-page PDFs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-16 bg-primary text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold mb-4">Start Discovering Kenya&apos;s Public Tenders Today</h2>
          <p className="text-white/80 max-w-xl mx-auto text-sm mb-8">
            Join Kenyan contractors and suppliers using proQ to stay ahead of tender closing deadlines.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/" className="bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-all text-sm">
              Explore 500+ Live Tenders
            </Link>
            <Link href="/sign-up-login?tab=signup" className="border border-white/30 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition-all text-sm">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
