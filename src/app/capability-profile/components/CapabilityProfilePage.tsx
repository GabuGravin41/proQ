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
  { id: 'roads', label: 'Roads & Civil Works', icon: HardHat, desc: 'Paving, culverts, earthworks, bridges' },
  { id: 'water', label: 'Water & Solar Boreholes', icon: Droplets, desc: 'Pumps, pipelines, drilling, irrigation' },
  { id: 'health', label: 'Healthcare & Medical', icon: Stethoscope, desc: 'Pharmaceuticals, surgical gear, PPE' },
  { id: 'ict', label: 'ICT & Enterprise Tech', icon: Laptop, desc: 'Software, networking, hardware, CCTV' },
  { id: 'agriculture', label: 'Agriculture & Agro-Supply', icon: Wheat, desc: 'Fertilizers, seeds, farm machinery' },
  { id: 'food', label: 'Food & Catering Supplies', icon: Utensils, desc: 'Dry cereals, meat, vegetables, sugar' },
  { id: 'cleaning', label: 'Cleaning & Janitorial', icon: Brush, desc: 'Sanitation, garbage collection, fumigation' },
  { id: 'security', label: 'Security & Surveillance', icon: LockKeyhole, desc: 'Guarding services, biometric access' },
  { id: 'education', label: 'Educational & Lab Supplies', icon: Building2, desc: 'Lab chemicals, desks, textbooks' },
  { id: 'consulting', label: 'Consultancy & Advisory', icon: Briefcase, desc: 'Feasibility, audit, legal, risk studies' },
];

const REGION_PRESETS = [
  { label: 'All 47 Counties (Nationwide)', counties: kenyaCounties },
  { label: 'Nairobi Metropolitan', counties: ['Nairobi', 'Kiambu', 'Machakos', 'Kajiado'] },
  { label: 'Coast Region', counties: ['Mombasa', 'Kilifi', 'Kwale', 'Taita Taveta', 'Lamu', 'Tana River'] },
  { label: 'Rift Valley', counties: ['Nakuru', 'Uasin Gishu', 'Kajiado', 'Bomet', 'Kericho', 'Narok', 'Baringo', 'Nandi'] },
  { label: 'Central Kenya', counties: ['Kiambu', 'Nyeri', 'Murang\'a', 'Kirinyaga', 'Nyandarua'] },
  { label: 'Western & Nyanza', counties: ['Kisumu', 'Kakamega', 'Bungoma', 'Kisii', 'Homa Bay', 'Migori', 'Siaya', 'Busia'] },
  { label: 'Northern & ASAL', counties: ['Turkana', 'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Samburu'] },
];

const BUDGET_PRESETS = [
  { label: 'Under KES 5M (SME & AGPO)', min: '0', max: '5000000' },
  { label: 'KES 5M – KES 25M (Standard Contracts)', min: '5000000', max: '25000000' },
  { label: 'KES 25M – KES 100M (Mid-Scale Enterprise)', min: '25000000', max: '100000000' },
  { label: 'Above KES 100M (Large Infrastructure & PPP)', min: '100000000', max: '2000000000' },
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
    toast.success('Bidding capability profile saved! AI Match Radar updated.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">AI Match Radar & Bidding Profile</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure your target sectors, operating regions, and capacity to receive 07:00 AM WhatsApp alerts.
          </p>
        </div>
        <button onClick={handleSave} className="btn-primary shrink-0 self-start sm:self-auto">
          <Save size={15} /> Save Radar Settings
        </button>
      </div>

      {/* Horizontal Tabs */}
      <div className="flex border-b border-border bg-card rounded-t-xl p-1 gap-1 mb-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('sectors')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
            activeTab === 'sectors'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <Briefcase size={14} />
          1. Industry Sectors ({selectedSectors.length})
        </button>

        <button
          onClick={() => setActiveTab('counties')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
            activeTab === 'counties'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <MapPin size={14} />
          2. Target Counties ({selectedCounties.length})
        </button>

        <button
          onClick={() => setActiveTab('budget')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
            activeTab === 'budget'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <DollarSign size={14} />
          3. Budget & AGPO Preference
        </button>
      </div>

      {/* Tab 1: Industry Sectors */}
      {activeTab === 'sectors' && (
        <div className="space-y-6 animate-fade-in">
          <div className="card p-6">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-foreground">Select Your Core Supply Sectors</h2>
              <p className="text-xs text-muted-foreground">
                Click any sector to toggle on/off. TenQ will automatically match relevant procurement notices.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PREDEFINED_SECTORS.map((sector) => {
                const Icon = sector.icon;
                const isSelected = selectedSectors.includes(sector.label);
                return (
                  <div
                    key={sector.id}
                    onClick={() => toggleSector(sector.label)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border bg-card hover:bg-muted/60'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {sector.label}
                        </p>
                        {isSelected && <Check size={14} className="text-primary shrink-0" />}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{sector.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Optional Niche Keywords */}
          <div className="card p-6">
            <h2 className="text-sm font-bold text-foreground mb-1">Optional Niche Keywords</h2>
            <p className="text-xs text-muted-foreground mb-3">
              Add specific products, machinery models, or specialized services (optional):
            </p>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {customKeywords.map(kw => (
                <span key={kw} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
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
                placeholder="e.g. hemodialysis, grader, asphalt..."
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
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted hover:bg-secondary text-foreground hover:text-primary transition-all border border-border"
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
                          ? 'bg-primary text-primary-foreground border-primary'
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
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    minBudget === preset.min && maxBudget === preset.max
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border bg-card hover:bg-muted text-foreground'
                  }`}
                >
                  {preset.label}
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
                { id: 'None', label: 'None (Standard)' },
                { id: 'Youth', label: 'Youth (18–35)' },
                { id: 'Women', label: 'Women-Owned' },
                { id: 'PWD', label: 'PWD Enterprise' },
              ].map(agpo => (
                <button
                  key={agpo.id}
                  onClick={() => setAgpoCategory(agpo.id as any)}
                  className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                    agpoCategory === agpo.id
                      ? 'border-primary bg-primary text-white shadow-sm'
                      : 'border-border bg-card hover:bg-muted text-foreground'
                  }`}
                >
                  {agpo.label}
                </button>
              ))}
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
          <Save size={14} /> Save & Recalculate Matches
        </button>
      </div>
    </div>
  );
}
