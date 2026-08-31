'use client';
import React from 'react';
import { X, Sparkles, Bell, TrendingUp, Shield, Zap, Check } from 'lucide-react';
import Link from 'next/link';

interface PaywallModalProps {
  open: boolean;
  feature: string;
  onClose: () => void;
}

const proFeatures = [
  { icon: Sparkles, label: 'AI Semantic Search', desc: 'Describe your business in natural language' },
  { icon: TrendingUp, label: 'Match Scoring (0–100%)', desc: 'Personalised fit score for every tender' },
  { icon: Bell, label: 'Real-time Alerts', desc: 'WhatsApp, Telegram, SMS, Email dispatch' },
  { icon: Shield, label: 'Compliance Checklist', desc: 'KRA, CR12, AGPO, NCA pre-bid checklist' },
  { icon: Zap, label: 'Submission Routing', desc: 'Direct deep-links into e-GP Kenya' },
];

export default function PaywallModal({ open, feature, onClose }: PaywallModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card rounded-2xl shadow-modal border border-border w-full max-w-md animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-md text-muted-foreground hover:bg-muted transition-all"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Upgrade to TenderIQ Pro</h2>
              <p className="text-xs text-muted-foreground">{feature} requires a Pro subscription</p>
            </div>
          </div>

          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-3xl font-bold text-foreground font-tabular">KES 2,499</span>
            <span className="text-sm text-muted-foreground">/month</span>
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-success-bg text-success font-semibold">Save 40% annually</span>
          </div>
        </div>

        {/* Features list */}
        <div className="p-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">What you get</p>
          {proFeatures.map((feat) => {
            const { icon: Icon } = feat;
            return (
              <div key={`paywall-feat-${feat.label}`} className="flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-success-bg shrink-0 mt-0.5">
                  <Check size={12} className="text-success" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{feat.label}</p>
                  <p className="text-xs text-muted-foreground">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="p-6 pt-0 flex flex-col gap-2">
          <Link
            href="/sign-up-login"
            className="btn-primary w-full justify-center py-2.5 text-sm"
          >
            <Sparkles size={15} />
            Start 14-Day Free Trial
          </Link>
          <button
            onClick={onClose}
            className="btn-ghost w-full justify-center text-xs text-muted-foreground"
          >
            Continue with free access
          </button>
          <p className="text-center text-xs text-muted-foreground mt-1">
            No credit card required · Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
