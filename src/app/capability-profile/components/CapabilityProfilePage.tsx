'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { kenyaCounties } from '@/lib/tenderData';
import { Check, Plus, X, Save, Info, TrendingUp, MapPin, Briefcase, DollarSign, Shield } from 'lucide-react';
import { toast } from 'sonner';

const SECTORS = ['Education', 'Healthcare', 'County Government', 'Parastatals', 'Ministry', 'University', 'Roads & Infrastructure', 'Energy & Renewables', 'ICT & Technology', 'Agriculture', 'Water & Sanitation', 'Security & Surveillance'];
const AGPO_OPTIONS = ['None', 'Youth', 'Women', 'PWD'] as const;

type AGPOStatus = typeof AGPO_OPTIONS[number];

interface ProfileState {
  capabilities: string[];
  targetSectors: string[];
  targetCounties: string[];
  minBudget: string;
  maxBudget: string;
  agpoStatus: AGPOStatus;
  companyDescription: string;
}

function TagInput({ tags, onAdd, onRemove, placeholder }: {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onAdd(trimmed);
      setInput('');
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
            {tag}
            <button onClick={() => onRemove(tag)} className="hover:text-danger transition-colors">
              <X size={11} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
          placeholder={placeholder}
          className="input-base text-sm flex-1"
        />
        <button onClick={handleAdd} className="btn-secondary px-3 py-2">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

function MultiSelect({ options, selected, onToggle }: {
  options: string[];
  selected: string[];
  onToggle: (opt: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const isSelected = selected.includes(opt);
        return (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              isSelected
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-foreground border-border hover:bg-muted'
            }`}
          >
            {isSelected && <Check size={10} className="inline mr-1" />}
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function CapabilityProfilePage() {
  const [profile, setProfile] = useState<ProfileState>({
    capabilities: ['Solar water pumping', 'IoT sensors', 'Borehole drilling', 'CCTV installation', 'Biometric systems'],
    targetSectors: ['Parastatals', 'County Government', 'Education'],
    targetCounties: ['Kiambu', 'Nairobi', 'Nakuru', 'Turkana', 'National'],
    minBudget: '5000000',
    maxBudget: '100000000',
    agpoStatus: 'Youth',
    companyDescription: 'We install solar-powered water pumps and IoT sensors in arid counties, and provide CCTV and biometric security systems for public institutions.',
  });

  const [saved, setSaved] = useState(false);

  const updateProfile = (key: keyof ProfileState, value: string | string[]) => {
    setProfile(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const toggleSector = (sector: string) => {
    const next = profile.targetSectors.includes(sector)
      ? profile.targetSectors.filter(s => s !== sector)
      : [...profile.targetSectors, sector];
    updateProfile('targetSectors', next);
  };

  const toggleCounty = (county: string) => {
    const next = profile.targetCounties.includes(county)
      ? profile.targetCounties.filter(c => c !== county)
      : [...profile.targetCounties, county];
    updateProfile('targetCounties', next);
  };

  const handleSave = () => {
    setSaved(true);
    toast.success('Capability profile saved — AI matching will update on next tender scan');
  };

  const formatKES = (val: string) => {
    const n = parseInt(val);
    if (isNaN(n)) return '';
    if (n >= 1_000_000_000) return `KES ${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `KES ${(n / 1_000_000).toFixed(0)}M`;
    return `KES ${n.toLocaleString()}`;
  };

  // Score preview
  const completionFactors = [
    !!profile.companyDescription,
    profile.capabilities.length > 0,
    profile.targetSectors.length > 0,
    profile.targetCounties.length > 0,
    !!profile.minBudget && !!profile.maxBudget,
    profile.agpoStatus !== 'None',
  ];
  const completionPct = Math.round((completionFactors.filter(Boolean).length / completionFactors.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Capability Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your business profile to power AI match scoring and proactive alerts.
          </p>
        </div>
        <button onClick={handleSave} className={`btn-primary gap-2 ${saved ? 'bg-success' : ''}`}>
          {saved ? <Check size={14} /> : <Save size={14} />}
          {saved ? 'Saved' : 'Save Profile'}
        </button>
      </div>

      {/* Completion indicator */}
      <div className="card p-4 mb-6 flex items-center gap-4">
        <div className="relative w-14 h-14 shrink-0">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="22" fill="none" stroke="var(--muted)" strokeWidth="5" />
            <circle
              cx="28" cy="28" r="22" fill="none"
              stroke={completionPct === 100 ? 'var(--success)' : 'var(--primary)'}
              strokeWidth="5"
              strokeDasharray={`${2 * Math.PI * 22}`}
              strokeDashoffset={`${2 * Math.PI * 22 * (1 - completionPct / 100)}`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">{completionPct}%</span>
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">Profile Completeness</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {completionPct < 100
              ? 'Complete your profile to maximise AI match accuracy and alert relevance.'
              : 'Your profile is fully configured. AI matching is running at full accuracy.'}
          </p>
        </div>
        <div className="ml-auto">
          <Link href="/my-matches" className="btn-secondary text-xs py-1.5">
            <TrendingUp size={13} />
            View Matches
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {/* Company description */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase size={16} className="text-primary" />
            <h3 className="text-sm font-bold text-foreground">Business Description</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <Info size={11} />
            Describe what your business does in natural language — this powers semantic search matching.
          </p>
          <textarea
            value={profile.companyDescription}
            onChange={e => updateProfile('companyDescription', e.target.value)}
            rows={3}
            placeholder="e.g. We install solar-powered water pumps and IoT sensors in arid counties..."
            className="input-base text-sm resize-none"
          />
        </div>

        {/* Capabilities */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-primary" />
            <h3 className="text-sm font-bold text-foreground">Core Capabilities</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Add specific services, products, or skills your company offers. These are weighted at 30% in the match score.
          </p>
          <TagInput
            tags={profile.capabilities}
            onAdd={tag => updateProfile('capabilities', [...profile.capabilities, tag])}
            onRemove={tag => updateProfile('capabilities', profile.capabilities.filter(c => c !== tag))}
            placeholder="e.g. Solar water pumping, CCTV installation..."
          />
        </div>

        {/* Target sectors */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase size={16} className="text-primary" />
            <h3 className="text-sm font-bold text-foreground">Target Sectors</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Select the procurement sectors you want to target. Weighted at 20% in match scoring.
          </p>
          <MultiSelect options={SECTORS} selected={profile.targetSectors} onToggle={toggleSector} />
        </div>

        {/* Target counties */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-primary" />
            <h3 className="text-sm font-bold text-foreground">Target Counties</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Select counties where you can deliver services. Weighted at 15% in match scoring.
          </p>
          <MultiSelect options={kenyaCounties} selected={profile.targetCounties} onToggle={toggleCounty} />
        </div>

        {/* Budget range */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign size={16} className="text-primary" />
            <h3 className="text-sm font-bold text-foreground">Contract Budget Range (KES)</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Set your preferred contract value range. Weighted at 15% in match scoring.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Minimum</label>
              <input
                type="number"
                value={profile.minBudget}
                onChange={e => updateProfile('minBudget', e.target.value)}
                placeholder="e.g. 1000000"
                className="input-base text-sm font-tabular"
              />
              {profile.minBudget && (
                <p className="text-xs text-muted-foreground mt-1">{formatKES(profile.minBudget)}</p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Maximum</label>
              <input
                type="number"
                value={profile.maxBudget}
                onChange={e => updateProfile('maxBudget', e.target.value)}
                placeholder="e.g. 100000000"
                className="input-base text-sm font-tabular"
              />
              {profile.maxBudget && (
                <p className="text-xs text-muted-foreground mt-1">{formatKES(profile.maxBudget)}</p>
              )}
            </div>
          </div>
        </div>

        {/* AGPO status */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} className="text-primary" />
            <h3 className="text-sm font-bold text-foreground">AGPO Registration Status</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Your AGPO certification determines eligibility for reserved procurement categories. Weighted at 10% in match scoring.
          </p>
          <div className="flex flex-wrap gap-2">
            {AGPO_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => updateProfile('agpoStatus', opt)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                  profile.agpoStatus === opt
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-foreground border-border hover:bg-muted'
                }`}
              >
                {profile.agpoStatus === opt && <Check size={12} className="inline mr-1.5" />}
                {opt === 'None' ? 'No AGPO (Open)' : `${opt} Enterprise`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom save */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Profile changes take effect on the next tender ingestion cycle (every 6 hours).
        </p>
        <button onClick={handleSave} className={`btn-primary gap-2 ${saved ? 'bg-success' : ''}`}>
          {saved ? <Check size={14} /> : <Save size={14} />}
          {saved ? 'Saved' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}
