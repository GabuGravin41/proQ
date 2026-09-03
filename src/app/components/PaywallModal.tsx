'use client';
import React from 'react';
import { X, Sparkles, Bell, FileSpreadsheet, Shield, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PaywallModalProps {
  open: boolean;
  feature: string;
  onClose: () => void;
}

const proFeatures = [
  { icon: FileSpreadsheet, label: 'Full BOQ Line-Item Schedules', desc: 'Pre-extracted quantities, units & benchmark rate takeoffs in Excel/CSV' },
  { icon: Shield, label: 'Official Tender Documents & Addenda', desc: 'Download verified specs, bid bond requirements & evaluation matrices' },
  { icon: Bell, label: 'Real-time WhatsApp & Email Alerts', desc: 'Daily 07:00 AM EAT morning alerts tailored to your sector & county' },
  { icon: Sparkles, label: 'AI Bid Strategist & Disqualification Shield', desc: 'Section 74/79 compliance checks & bid security hazard alerts' },
  { icon: Zap, label: 'Direct e-GP Kenya Deep Links', desc: '1-click routing into official procurement submission portals' },
];

export default function PaywallModal({ open, feature, onClose }: PaywallModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative bg-card rounded-2xl shadow-modal border border-border w-full max-w-lg animate-scale-in overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-md text-muted-foreground hover:bg-muted transition-all z-10"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-border bg-gradient-to-br from-emerald-500/10 via-card to-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
              Q
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">Upgrade to proQ Pro</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Instant M-Pesa
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{feature} requires an active Pro subscription</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-border/60">
            <div className="p-3 rounded-xl bg-card border border-border/80">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Weekly Pass</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold text-foreground font-tabular">KES 499</span>
                <span className="text-[11px] text-muted-foreground">/wk</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Ideal for single tender bids</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-500/30 relative">
              <span className="absolute -top-2 right-2 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-600 text-white">
                Best Value
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-800 dark:text-emerald-300">Monthly Pro</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400 font-tabular">KES 1,499</span>
                <span className="text-[11px] text-muted-foreground">/mo</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Unlimited alerts & BOQ exports</p>
            </div>
          </div>
        </div>

        {/* Features list */}
        <div className="p-6 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Pro Member Unlocks</p>
          {proFeatures.map((feat) => {
            const { icon: Icon } = feat;
            return (
              <div key={`paywall-feat-${feat.label}`} className="flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 shrink-0 mt-0.5">
                  <Icon size={13} />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{feat.label}</p>
                  <p className="text-[11px] text-muted-foreground leading-snug">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="p-6 pt-0 flex flex-col gap-2">
          <Link
            href="/pricing"
            onClick={onClose}
            className="btn-primary w-full justify-center py-2.5 text-xs font-bold flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-sm"
          >
            <span>Activate via M-Pesa STK Push</span>
            <ArrowRight size={14} />
          </Link>
          <button
            onClick={onClose}
            className="btn-ghost w-full justify-center text-xs text-muted-foreground py-2"
          >
            Continue browsing free tender summaries
          </button>
          <p className="text-center text-[10px] text-muted-foreground">
            Instant automated M-Pesa receipt · No credit card required · Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
