'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  User, Mail, Lock, CreditCard, Bell, Shield,
  Check, ChevronRight, AlertTriangle, LogOut, Trash2, Building2, Phone,
  FileCheck, LockKeyhole, BadgeCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/authContext';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">{title}</h2>
      <div className="card divide-y divide-border">{children}</div>
    </div>
  );
}

interface RowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
  badge?: string;
}

function Row({ icon, label, value, href, onClick, danger, badge }: RowProps) {
  const content = (
    <div className={`flex items-center justify-between px-4 py-3.5 hover:bg-muted transition-colors cursor-pointer ${danger ? 'hover:bg-danger-bg' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-md ${danger ? 'bg-danger-bg' : 'bg-muted'}`}>
          <span className={danger ? 'text-danger' : 'text-muted-foreground'}>{icon}</span>
        </div>
        <div>
          <p className={`text-sm font-medium ${danger ? 'text-danger' : 'text-foreground'}`}>{label}</p>
          {value && <p className="text-xs text-muted-foreground mt-0.5">{value}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-success-bg text-success">{badge}</span>
        )}
        <ChevronRight size={15} className="text-muted-foreground" />
      </div>
    </div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  if (onClick) return <button onClick={onClick} className="w-full text-left">{content}</button>;
  return content;
}

export default function AccountSettingsPage() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name ?? 'Kipchoge Ruto');
  const [email] = useState(user?.email ?? 'kipchoge.ruto@buildright.co.ke');
  const [company, setCompany] = useState('BuildRight Infrastructure Ltd');
  const [phone, setPhone] = useState('+254 712 345 678');
  const [agpoCategory, setAgpoCategory] = useState<'None' | 'Youth' | 'Women' | 'PWD'>('Youth');
  const [ncaCategory, setNcaCategory] = useState('NCA 2 — Roadworks & Civil');
  const [editingProfile, setEditingProfile] = useState(false);

  const handleSaveProfile = () => {
    setEditingProfile(false);
    toast.success('Bidding profile & alert preferences updated');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Account & Alert Preferences</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your personal contact details, WhatsApp alert channels, and bidding match preferences.
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="p-4 rounded-xl bg-secondary/50 border border-primary/20 mb-6 flex items-start gap-3">
        <LockKeyhole size={18} className="text-primary shrink-0 mt-0.5" />
        <div className="text-xs text-foreground/80">
          <p className="font-bold text-primary mb-0.5">🔒 Privacy & Data Protection</p>
          <p className="text-muted-foreground leading-relaxed">
            TenderIQ never asks for or stores sensitive government passwords, KRA iTax logins, e-GP credentials, or bank accounts.
            Your alert preferences and match history are strictly private to you.
          </p>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="card p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 text-primary font-extrabold text-xl flex items-center justify-center shrink-0">
            {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground truncate">{name}</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                {user?.role === 'subscriber' ? 'Pro Member' : user?.role === 'admin' ? 'Admin' : 'Free Explorer'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
            <p className="text-xs font-medium text-foreground mt-0.5 flex items-center gap-1.5">
              <Building2 size={12} className="text-muted-foreground" />
              {company}
            </p>
          </div>
        </div>

        <button
          onClick={() => setEditingProfile(!editingProfile)}
          className="btn-secondary text-xs py-1.5 self-start sm:self-auto"
        >
          {editingProfile ? 'Cancel' : 'Edit Contact & Preferences'}
        </button>
      </div>

      {editingProfile && (
        <div className="card p-5 mb-8 space-y-4 animate-slide-up">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Shield size={16} className="text-primary" />
            Edit Profile Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input-base text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">WhatsApp / Phone (For Alerts)</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+254 7XX XXX XXX"
                className="input-base text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Company / Business Name</label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="input-base text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">AGPO Eligibility Status</label>
              <select
                value={agpoCategory}
                onChange={e => setAgpoCategory(e.target.value as any)}
                className="input-base text-sm"
              >
                <option value="None">None (Standard Open Bidding)</option>
                <option value="Youth">Youth Enterprise (Under 35)</option>
                <option value="Women">Women-Owned Enterprise</option>
                <option value="PWD">Persons with Disability (PWD)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">NCA Contractor Category (Optional)</label>
            <select
              value={ncaCategory}
              onChange={e => setNcaCategory(e.target.value)}
              className="input-base text-sm"
            >
              <option value="General Supplier / Service Provider">General Supplier / Service Provider</option>
              <option value="NCA 1 — Building & Civil (Unlimited)">NCA 1 — Building & Civil (Unlimited)</option>
              <option value="NCA 2 — Roadworks & Civil">NCA 2 — Roadworks & Civil</option>
              <option value="NCA 3 — General Building Works">NCA 3 — General Building Works</option>
              <option value="NCA 4 — Electrical & Telecommunications">NCA 4 — Electrical & Telecommunications</option>
              <option value="NCA 5-8 — Small Works & Maintenance">NCA 5-8 — Small Works & Maintenance</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setEditingProfile(false)} className="btn-ghost text-xs">
              Cancel
            </button>
            <button onClick={handleSaveProfile} className="btn-primary text-xs">
              <Check size={14} /> Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Bidding Preferences Summary */}
      <Section title="Bidding & Match Preferences">
        <div className="px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-md bg-muted">
              <FileCheck size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">AGPO Status</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {agpoCategory !== 'None' ? `${agpoCategory} Preference Scheme` : 'Standard Open Bidding'}
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
            {agpoCategory !== 'None' ? `${agpoCategory} Match Active` : 'Open'}
          </span>
        </div>

        <div className="px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-md bg-muted">
              <BadgeCheck size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Technical Category</p>
              <p className="text-xs text-muted-foreground mt-0.5">{ncaCategory}</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-success-bg text-success">
            Configured
          </span>
        </div>
      </Section>

      {/* Subscription & Billing */}
      <Section title="Subscription & Billing">
        <Row
          icon={<CreditCard size={16} />}
          label="Current Plan"
          value={user?.role === 'subscriber' ? 'Pro Plan — KES 4,999/mo (Active)' : 'Free Explorer Tier'}
          badge={user?.role === 'subscriber' ? 'Active' : undefined}
          href="/pricing"
        />
        <Row
          icon={<CreditCard size={16} />}
          label="M-Pesa / Billing Settings"
          value="Paybill / Till integration active"
          href="/pricing"
        />
      </Section>

      {/* Notification Channels */}
      <Section title="Alert Channels & Dispatch">
        <Row
          icon={<Bell size={16} />}
          label="Notification Preferences"
          value="Configure WhatsApp, Telegram & Email alert thresholds"
          href="/notification-preferences"
        />
        <Row
          icon={<Phone size={16} />}
          label="WhatsApp Instant Alerts"
          value={`Direct alerts sent to ${phone}`}
          href="/notification-preferences"
        />
      </Section>

      {/* Security */}
      <Section title="Account Security">
        <Row
          icon={<Lock size={16} />}
          label="Password & Security"
          value="Last updated 14 days ago"
          onClick={() => toast.info('Password reset link sent to your email')}
        />
      </Section>

      {/* Danger Zone */}
      <Section title="Danger Zone">
        <Row
          icon={<LogOut size={16} />}
          label="Sign Out"
          onClick={logout}
          danger
        />
        <Row
          icon={<Trash2 size={16} />}
          label="Delete Account"
          value="Permanently delete all alert preferences and match history"
          onClick={() => toast.error('Please contact support@tenderiq.co.ke to delete an account')}
          danger
        />
      </Section>
    </div>
  );
}
