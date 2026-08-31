'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { kenyaCounties } from '@/lib/tenderData';
import {
  Check, Plus, X, Save, Info, TrendingUp, MapPin, Briefcase, DollarSign,
  Shield, Sparkles, Building2, Droplets, HardHat, Stethoscope, Laptop,
  Wheat, Utensils, Brush, LockKeyhole, Layers, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

const PREDEFINED_SECTORS = [
  {
    id: 'roads',
    label: 'Roads & Civil Works',
    icon: HardHat,
    desc: 'Paving, culverts, earthworks, bridges',
    colorClasses: 'text-amber-700 bg-amber-50 border-amber-300 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-700',
    selectedBorder: 'border-amber-500 ring-1 ring-amber-500/20 bg-amber-50/10',
    checkBg: 'bg-amber-600 text-white',
  },
  {
    id: 'water',
    label: 'Water & Solar Boreholes',
    icon: Droplets,
    desc: 'Pumps, pipelines, drilling, irrigation',
    colorClasses: 'text-sky-700 bg-sky-50 border-sky-300 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-700',
    selectedBorder: 'border-sky-500 ring-1 ring-sky-500/20 bg-sky-50/10',
    checkBg: 'bg-sky-600 text-white',
  },
  {
    id: 'health',
    label: 'Healthcare & Medical',
    icon: Stethoscope,
    desc: 'Pharmaceuticals, surgical gear, PPE',
    colorClasses: 'text-emerald-700 bg-emerald-50 border-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-700',
    selectedBorder: 'border-emerald-500 ring-1 ring-emerald-500/20 bg-emerald-50/10',
    checkBg: 'bg-emerald-600 text-white',
  },
  {
    id: 'ict',
    label: 'ICT & Enterprise Tech',
    icon: Laptop,
    desc: 'Software, networking, hardware, CCTV',
    colorClasses: 'text-indigo-700 bg-indigo-50 border-indigo-300 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-700',
    selectedBorder: 'border-indigo-500 ring-1 ring-indigo-500/20 bg-indigo-50/10',
    checkBg: 'bg-indigo-600 text-white',
  },
  {
    id: 'agriculture',
    label: 'Agriculture & Agro-Supply',
    icon: Wheat,
    desc: 'Fertilizers, seeds, farm machinery',
    colorClasses: 'text-lime-800 bg-lime-50 border-lime-300 dark:bg-lime-950/30 dark:text-lime-300 dark:border-lime-700',
    selectedBorder: 'border-lime-600 ring-1 ring-lime-600/20 bg-lime-50/10',
    checkBg: 'bg-lime-700 text-white',
  },
  {
    id: 'food',
    label: 'Food & Catering Supplies',
    icon: Utensils,
    desc: 'Dry cereals, meat, vegetables, sugar',
    colorClasses: 'text-orange-700 bg-orange-50 border-orange-300 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-700',
    selectedBorder: 'border-orange-500 ring-1 ring-orange-500/20 bg-orange-50/10',
    checkBg: 'bg-orange-600 text-white',
  },
  {
    id: 'cleaning',
    label: 'Cleaning & Janitorial',
    icon: Brush,
    desc: 'Sanitation, garbage collection, fumigation',
    colorClasses: 'text-teal-700 bg-teal-50 border-teal-300 dark:bg-teal-950/30 dark:text-teal-300 dark:border-teal-700',
    selectedBorder: 'border-teal-500 ring-1 ring-teal-500/20 bg-teal-50/10',
    checkBg: 'bg-teal-600 text-white',
  },
  {
    id: 'security',
    label: 'Security & Surveillance',
    icon: LockKeyhole,
    desc: 'Guarding services, biometric access',
    colorClasses: 'text-violet-700 bg-violet-50 border-violet-300 dark:bg-violet-950/30 dark:text-violet-300 dark:border-violet-700',
    selectedBorder: 'border-violet-500 ring-1 ring-violet-500/20 bg-violet-50/10',
    checkBg: 'bg-violet-600 text-white',
  },
  {
    id: 'education',
    label: 'Educational & Lab Supplies',
    icon: Building2,
    desc: 'Lab chemicals, desks, textbooks',
    colorClasses: 'text-fuchsia-700 bg-fuchsia-50 border-fuchsia-300 dark:bg-fuchsia-950/30 dark:text-fuchsia-300 dark:border-fuchsia-700',
    selectedBorder: 'border-fuchsia-500 ring-1 ring-fuchsia-500/20 bg-fuchsia-50/10',
    checkBg: 'bg-fuchsia-600 text-white',
  },
  {
    id: 'consulting',
    label: 'Consultancy & Advisory',
    icon: Briefcase,
    desc: 'Feasibility, audit, legal, risk studies',
    colorClasses: 'text-rose-700 bg-rose-50 border-rose-300 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-700',
    selectedBorder: 'border-rose-500 ring-1 ring-rose-500/20 bg-rose-50/10',
    checkBg: 'bg-rose-600 text-white',
  },
];

const REGION_PRESETS = [
  { label: 'All 47 Counties (Nationwide)', counties: kenyaCounties, badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { label: 'Nairobi Metropolitan', counties: ['Nairobi', 'Kiambu', 'Machakos', 'Kajiado'], badgeColor: 'bg-amber-100 text-amber-800 border-amber-200' },
  { label: 'Coast Region', counties: ['Mombasa', 'Kilifi', 'Kwale', 'Taita Taveta', 'Lamu', 'Tana River'], badgeColor: 'bg-sky-100 text-sky-800 border-sky-200' },
  { label: 'Rift Valley', counties: ['Nakuru', 'Uasin Gishu', 'Kajiado', 'Bomet', 'Kericho', 'Narok', 'Baringo', 'Nandi'], badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { label: 'Central Kenya', counties: ['Kiambu', 'Nyeri', 'Murang\'a', 'Kirinyaga', 'Nyandarua'], badgeColor: 'bg-teal-100 text-teal-800 border-teal-200' },
  { label: 'Western & Nyanza', counties: ['Kisumu', 'Kakamega', 'Bungoma', 'Kisii', 'Homa Bay', 'Migori', 'Siaya', 'Busia'], badgeColor: 'bg-violet-100 text-violet-800 border-violet-200' },
  { label: 'Northern & ASAL', counties: ['Turkana', 'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Samburu'], badgeColor: 'bg-orange-100 text-orange-800 border-orange-200' },
];

const BUDGET_PRESETS = [
  { label: 'Under KES 5M (SME & AGPO)', min: '0', max: '5000000', tag: 'Micro / SME' },
  { label: 'KES 5M – KES 25M (Standard Contracts)', min: '5000000', max: '25000000', tag: 'Standard' },
  { label: 'KES 25M – KES 100M (Mid-Scale Enterprise)', min: '25000000', max: '100000000', tag: 'Commercial' },
  { label: 'Above KES 100M (Major Infrastructure & PPP)', min: '100000000', max: '2000000000', tag: 'Mega Project' },
];

export default function CapabilityProfilePage() {
  const [activeTab, setActiveTab] = useState<'sectors' | 'counties' | 'budget'>('sectors');
  const [selectedSectors, setSelectedSectors] = useState<string[]>([
    'Roads & Civil Works',
    'Water & Solar Boreholes',
    'ICT & Enterprise Tech',
  ]);
  const [selectedCounties, setSelectedCounties] = useState<string[]>([
    'Nairobi',
    'Kiambu',
    'Nakuru',
    'Turkana',
  ]);
  const [minBudget, setMinBudget] = useState('0');
  const [maxBudget, setMaxBudget] = useState('100000000');
  const [agpoCategory, setAgpoCategory] = useState<'None' | 'Youth' | 'Women' | 'PWD'>('Youth');
  const [ncaCategory, setNcaCategory] = useState('NCA 2 — Roadworks & Civil');
  const [customKeywords, setCustomKeywords] = useState<string[]>(['solar pump', 'paving', 'CCTV']);
  const [keywordInput, setKeywordInput] = useState('');

  const toggleSector = (sectorLabel: string) => {
    setSelectedSectors(prev =>
      prev.includes(sectorLabel)
        ? prev.filter(s => s !== sectorLabel)
        : [...prev, sectorLabel]
    );
  };

  const toggleCounty = (county: string) => {
    setSelectedCounties(prev =>
      prev.includes(county)
        ? prev.filter(c => c !== county)
        : [...prev, county]
    );
  };

  const applyCountyPreset = (counties: string[]) => {
    if (selectedCounties.length === counties.length) {
      setSelectedCounties([]);
    } else {
      setSelectedCounties(counties);
    }
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !customKeywords.includes(keywordInput.trim())) {
      setCustomKeywords(prev => [...prev, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setCustomKeywords(prev => prev.filter(k => k !== kw));
  };

  const handleSave = () => {
    toast.success('Bidding preferences saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Bidding Preferences & Alerts</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Choose your supply sectors, operating counties, and budget to receive tailored tender alerts.
          </p>
        </div>
        <button onClick={handleSave} className="btn-primary shrink-0 self-start sm:self-auto">
          <Save size={15} /> Save Preferences
        </button>
      </div>

      {/* Fresh Emerald Underlined Horizontal Tabs */}
      <div className="flex border-b border-border gap-6 mb-6 overflow-x-auto scrollbar-none px-1">
        <button
          onClick={() => setActiveTab('sectors')}
          className={`flex items-center gap-2 py-3 text-xs font-bold transition-all shrink-0 border-b-2 -mb-px ${
            activeTab === 'sectors'
              ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
          }`}
        >
          <Briefcase size={14} />
          1. Industry Sectors ({selectedSectors.length})
        </button>

        <button
          onClick={() => setActiveTab('counties')}
          className={`flex items-center gap-2 py-3 text-xs font-bold transition-all shrink-0 border-b-2 -mb-px ${
            activeTab === 'counties'
              ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
          }`}
        >
          <MapPin size={14} />
          2. Target Counties ({selectedCounties.length})
        </button>

        <button
          onClick={() => setActiveTab('budget')}
          className={`flex items-center gap-2 py-3 text-xs font-bold transition-all shrink-0 border-b-2 -mb-px ${
            activeTab === 'budget'
              ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
          }`}
        >
          <DollarSign size={14} />
          3. Budget & AGPO Preference
        </button>
      </div>

      {/* Tab 1: Industry Sectors with Distinct Color Coding */}
      {activeTab === 'sectors' && (
        <div className="space-y-6 animate-fade-in">
          <div className="card p-6">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-foreground">Select Your Core Supply Sectors</h2>
              <p className="text-xs text-muted-foreground">
                Click any sector to toggle on/off. proQ will automatically match relevant procurement notices.
              </p>
            </div>

            {/* Scrollable Container on Mobile & Desktop */}
            <div className="max-h-[360px] sm:max-h-[400px] overflow-y-auto pr-1.5 scrollbar-thin">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-1">
                {PREDEFINED_SECTORS.map((sector) => {
                  const Icon = sector.icon;
                  const isSelected = selectedSectors.includes(sector.label);
                  return (
                    <div
                      key={sector.id}
                      onClick={() => toggleSector(sector.label)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? sector.selectedBorder
                          : 'border-border bg-card hover:bg-muted/50'
                      }`}
                    >
                      {/* Domain-specific distinct color avatar */}
                      <div className={`p-2 rounded-xl shrink-0 transition-all border ${
                        isSelected ? sector.colorClasses : 'bg-muted text-muted-foreground border-border'
                      }`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-xs font-bold ${isSelected ? 'text-foreground font-extrabold' : 'text-muted-foreground'}`}>
                            {sector.label}
                          </p>
                          {isSelected ? (
                            <span className={`w-4 h-4 rounded-full ${sector.checkBg} flex items-center justify-center text-[10px]`}>
                              <Check size={10} />
                            </span>
                          ) : (
                            <span className="w-4 h-4 rounded-full border border-border" />
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{sector.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Optional Niche Keywords */}
          <div className="card p-6">
            <h2 className="text-sm font-bold text-foreground mb-1">Optional Niche Keywords</h2>
            <p className="text-xs text-muted-foreground mb-3">
              Add specific products, machinery models, or specialized items (optional):
            </p>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {customKeywords.map(kw => (
                <span key={kw} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
                  {kw}
                  <button onClick={() => handleRemoveKeyword(kw)} className="hover:text-danger">
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={keywordInput}
                onChange={e => setKeywordInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                placeholder="e.g. hemodialysis, motor grader, asphalt..."
                className="input-base text-xs"
              />
              <button onClick={handleAddKeyword} className="btn-secondary px-3 text-xs shrink-0">
                <Plus size={14} /> Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Target Counties */}
      {activeTab === 'counties' && (
        <div className="space-y-6 animate-fade-in">
          <div className="card p-6">
            <h2 className="text-sm font-bold text-foreground mb-1">Quick Regional Presets</h2>
            <p className="text-xs text-muted-foreground mb-3">
              1-Click selection to configure your geographical bidding zone:
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {REGION_PRESETS.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => applyCountyPreset(preset.counties)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${preset.badgeColor} hover:opacity-90 active:scale-95`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Individual Counties ({selectedCounties.length} Selected)
                </h3>
                <button
                  onClick={() => setSelectedCounties([])}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  Clear All
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-72 overflow-y-auto pr-1">
                {kenyaCounties.map(county => {
                  const isSelected = selectedCounties.includes(county);
                  return (
                    <button
                      key={county}
                      onClick={() => toggleCounty(county)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm hover:opacity-90'
                          : 'bg-card text-foreground border-border hover:bg-muted'
                      }`}
                    >
                      {isSelected && <Check size={11} className="inline mr-1" />}
                      {county}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Budget & AGPO */}
      {activeTab === 'budget' && (
        <div className="space-y-6 animate-fade-in">
          <div className="card p-6 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-foreground">Target Budget Capacity</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Filters out tenders that are either too small or exceed your current bank guarantee limits:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BUDGET_PRESETS.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setMinBudget(preset.min);
                    setMaxBudget(preset.max);
                    toast.info(`Budget set to ${preset.label}`);
                  }}
                  className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                    minBudget === preset.min && maxBudget === preset.max
                      ? 'border-primary bg-secondary text-secondary-foreground ring-1 ring-primary'
                      : 'border-border bg-card hover:bg-muted text-foreground'
                  }`}
                >
                  <span>{preset.label}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted font-bold text-muted-foreground">
                    {preset.tag}
                  </span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Min Contract (KES)</label>
                <input
                  type="number"
                  value={minBudget}
                  onChange={e => setMinBudget(e.target.value)}
                  className="input-base text-xs font-tabular"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Max Contract (KES)</label>
                <input
                  type="number"
                  value={maxBudget}
                  onChange={e => setMaxBudget(e.target.value)}
                  className="input-base text-xs font-tabular"
                />
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-foreground">AGPO Preference Scheme</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Automatically matches legally reserved 30% government procurement tenders:
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'None', label: 'None (Standard)', sub: 'Open competitive' },
                { id: 'Youth', label: 'Youth (18–35)', sub: 'AGPO 30% quota' },
                { id: 'Women', label: 'Women-Owned', sub: 'AGPO 30% quota' },
                { id: 'PWD', label: 'PWD Enterprise', sub: 'AGPO 30% quota' },
              ].map(agpo => {
                const isSelected = agpoCategory === agpo.id;
                return (
                  <button
                    key={agpo.id}
                    onClick={() => setAgpoCategory(agpo.id as any)}
                    className={`p-3.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary shadow-sm font-bold'
                        : 'border-border bg-card hover:bg-muted text-foreground font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={isSelected ? 'text-primary' : 'text-foreground'}>{agpo.label}</span>
                      {isSelected ? (
                        <span className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">
                          <Check size={10} />
                        </span>
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-border" />
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-normal">{agpo.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-8 p-4 rounded-xl bg-card border border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Ready to save your preferences? Click save to recalculate all 500 fit scores.
        </span>
        <button onClick={handleSave} className="btn-primary text-xs">
          <Save size={14} /> Save Preferences
        </button>
      </div>
    </div>
  );
}
