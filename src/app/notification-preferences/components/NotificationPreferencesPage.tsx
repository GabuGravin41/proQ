'use client';
import React, { useState } from 'react';
import { Mail, MessageCircle, Phone, Zap, Clock, Check, Info } from 'lucide-react';
import { toast } from 'sonner';

interface ToggleProps {
  enabled: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

function Toggle({ enabled, onChange, disabled }: ToggleProps) {
  return (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        enabled ? 'bg-primary' : 'bg-muted-foreground/30'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

interface ChannelRowProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  children?: React.ReactNode;
  proOnly?: boolean;
  isSubscriber?: boolean;
}

function ChannelRow({ icon, label, description, enabled, onToggle, children, proOnly, isSubscriber }: ChannelRowProps) {
  const locked = proOnly && !isSubscriber;
  return (
    <div className={`card p-4 ${locked ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 rounded-lg bg-muted shrink-0">{icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">{label}</p>
              {proOnly && (
                <span className="px-1.5 py-0.5 rounded text-xs font-semibold bg-accent/10 text-accent">Pro</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
        </div>
        <Toggle enabled={enabled && !locked} onChange={onToggle} disabled={locked} />
      </div>
      {enabled && !locked && children && (
        <div className="mt-3 pt-3 border-t border-border animate-slide-up">
          {children}
        </div>
      )}
    </div>
  );
}

export default function NotificationPreferencesPage() {
  const isSubscriber = true; // Simulate subscriber

  const [prefs, setPrefs] = useState({
    email: true,
    whatsapp: true,
    telegram: true,
    sms: false,
    realTime: true,
    digest: false,
    hotFitOnly: false,
    digestTime: '07:00',
    whatsappNumber: '+254712345678',
    telegramHandle: '@kipchoge_ruto',
    smsNumber: '',
    emailAddress: 'kipchoge.ruto@buildright.co.ke',
  });

  const update = (key: keyof typeof prefs, value: boolean | string) => {
    setPrefs(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast.success('Notification preferences saved successfully');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Notification Preferences</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Control how and when TenderIQ alerts you about new matching opportunities.
        </p>
      </div>

      {/* Delivery mode */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Alert Delivery Mode</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => { update('realTime', true); update('digest', false); }}
            className={`p-4 rounded-xl border text-left transition-all ${
              prefs.realTime ? 'border-primary bg-secondary' : 'border-border bg-card hover:bg-muted'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Zap size={16} className={prefs.realTime ? 'text-primary' : 'text-muted-foreground'} />
              <span className="text-sm font-bold text-foreground">Real-Time Alerts</span>
              {prefs.realTime && <Check size={14} className="text-primary ml-auto" />}
            </div>
            <p className="text-xs text-muted-foreground">
              Instant notification when a tender scores ≥85% (Hot Fit). Best for high-priority opportunities.
            </p>
          </button>

          <button
            onClick={() => { update('digest', true); update('realTime', false); }}
            className={`p-4 rounded-xl border text-left transition-all ${
              prefs.digest ? 'border-primary bg-secondary' : 'border-border bg-card hover:bg-muted'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Clock size={16} className={prefs.digest ? 'text-primary' : 'text-muted-foreground'} />
              <span className="text-sm font-bold text-foreground">Daily Digest</span>
              {prefs.digest && <Check size={14} className="text-primary ml-auto" />}
            </div>
            <p className="text-xs text-muted-foreground">
              Morning summary at 07:00 EAT with all Good Fit (70–84%) and Hot Fit tenders from the past 24 hours.
            </p>
          </button>
        </div>

        {prefs.digest && (
          <div className="mt-3 flex items-center gap-3 p-3 bg-muted rounded-xl animate-slide-up">
            <Clock size={14} className="text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground">Digest delivery time:</span>
            <select
              value={prefs.digestTime}
              onChange={e => update('digestTime', e.target.value)}
              className="input-base text-xs py-1 w-auto"
            >
              {['06:00', '07:00', '08:00', '09:00', '18:00', '20:00'].map(t => (
                <option key={t} value={t}>{t} EAT</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Channels */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Notification Channels</h2>
        <div className="space-y-3">
          <ChannelRow
            icon={<Mail size={16} className="text-primary" />}
            label="Email"
            description="Receive alerts and digests to your registered email address."
            enabled={prefs.email}
            onToggle={v => update('email', v)}
          >
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Email address</label>
              <input
                type="email"
                value={prefs.emailAddress}
                onChange={e => update('emailAddress', e.target.value)}
                className="input-base text-xs"
              />
            </div>
          </ChannelRow>

          <ChannelRow
            icon={<MessageCircle size={16} className="text-success" />}
            label="WhatsApp"
            description="Instant WhatsApp messages for Hot Fit alerts (≥85% match score)."
            enabled={prefs.whatsapp}
            onToggle={v => update('whatsapp', v)}
            proOnly
            isSubscriber={isSubscriber}
          >
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">WhatsApp number (with country code)</label>
              <input
                type="tel"
                value={prefs.whatsappNumber}
                onChange={e => update('whatsappNumber', e.target.value)}
                placeholder="+254 7XX XXX XXX"
                className="input-base text-xs"
              />
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Info size={11} />
                You must have opted in to receive WhatsApp messages from TenderIQ.
              </p>
            </div>
          </ChannelRow>

          <ChannelRow
            icon={<MessageCircle size={16} className="text-primary" />}
            label="Telegram"
            description="Receive tender alerts via your Telegram account."
            enabled={prefs.telegram}
            onToggle={v => update('telegram', v)}
            proOnly
            isSubscriber={isSubscriber}
          >
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Telegram handle</label>
              <input
                type="text"
                value={prefs.telegramHandle}
                onChange={e => update('telegramHandle', e.target.value)}
                placeholder="@your_handle"
                className="input-base text-xs"
              />
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Info size={11} />
                Start a conversation with @TenderIQBot on Telegram to activate.
              </p>
            </div>
          </ChannelRow>

          <ChannelRow
            icon={<Phone size={16} className="text-warning" />}
            label="SMS"
            description="Text message alerts for critical Hot Fit tenders."
            enabled={prefs.sms}
            onToggle={v => update('sms', v)}
            proOnly
            isSubscriber={isSubscriber}
          >
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">SMS number (with country code)</label>
              <input
                type="tel"
                value={prefs.smsNumber}
                onChange={e => update('smsNumber', e.target.value)}
                placeholder="+254 7XX XXX XXX"
                className="input-base text-xs"
              />
            </div>
          </ChannelRow>
        </div>
      </div>

      {/* Filter preferences */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Alert Filters</h2>
        <div className="card p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Hot Fit only (≥85%)</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Only alert me for tenders scoring 85% or above. Reduces noise for high-volume profiles.
            </p>
          </div>
          <Toggle enabled={prefs.hotFitOnly} onChange={v => update('hotFitOnly', v)} />
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Changes are saved to your account profile.</p>
        <button onClick={handleSave} className="btn-primary">
          <Check size={14} />
          Save Preferences
        </button>
      </div>
    </div>
  );
}
