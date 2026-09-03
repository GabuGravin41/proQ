'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X, RotateCcw } from 'lucide-react';
import { FilterState } from './TenderSearchPage';
import { kenyaCounties, procurementMethods, entityTypes, tenderCategories } from '@/lib/tenderData';

interface TenderFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: FilterState[keyof FilterState]) => void;
  onClose?: () => void;
}

const agpoOptions = ['Open', 'Youth', 'Women', 'PWD', 'Special Groups'];
const statusOptions = ['active', 'closing-soon', 'closed', 'cancelled', 'awarded'];
const sourceOptions = ['PPIP', 'e-GP', 'Institutional', 'County'];

export default function TenderFilters({ filters, onFilterChange, onClose }: TenderFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    status: true,
    category: true,
    county: true,
    agpo: true,
    source: true,
    method: false,
    entity: false,
    value: false,
  });

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    const current = filters[key] as string[];
    const updated = current.includes(value)
      ? current.filter(x => x !== value)
      : [...current, value];
    onFilterChange(key, updated);
  };

  const clearAllFilters = () => {
    onFilterChange('counties', []);
    onFilterChange('methods', []);
    onFilterChange('agpoCategories', []);
    onFilterChange('entityTypes', []);
    onFilterChange('categories', []);
    onFilterChange('status', []);
    onFilterChange('sources', []);
    onFilterChange('valueMin', '');
    onFilterChange('valueMax', '');
  };

  const totalActive = [
    filters.counties.length,
    filters.methods.length,
    filters.agpoCategories.length,
    filters.entityTypes.length,
    filters.categories.length,
    filters.status.length,
    filters.sources.length,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <span className="text-sm font-semibold text-foreground">Filters</span>
        <div className="flex items-center gap-2">
          {totalActive > 0 && (
            <button
              onClick={clearAllFilters}
              className="btn-ghost text-xs text-danger hover:text-danger px-2 py-1"
            >
              <RotateCcw size={11} />
              Clear all
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded hover:bg-muted"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Status */}
      <FilterSection
        title="Status"
        count={filters.status.length}
        expanded={expandedSections.status}
        onToggle={() => toggleSection('status')}
      >
        {statusOptions.map(s => (
          <CheckboxItem
            key={`filter-status-${s}`}
            label={s === 'closing-soon' ? 'Closing Soon' : s.charAt(0).toUpperCase() + s.slice(1)}
            checked={filters.status.includes(s)}
            onChange={() => toggleArrayFilter('status', s)}
          />
        ))}
      </FilterSection>

      {/* County */}
      <FilterSection
        title="County"
        count={filters.counties.length}
        expanded={expandedSections.county}
        onToggle={() => toggleSection('county')}
      >
        <div className="max-h-48 overflow-y-auto scrollbar-thin space-y-0.5">
          {kenyaCounties.map(c => (
            <CheckboxItem
              key={`filter-county-${c}`}
              label={c}
              checked={filters.counties.includes(c)}
              onChange={() => toggleArrayFilter('counties', c)}
            />
          ))}
        </div>
      </FilterSection>

      {/* AGPO Category */}
      <FilterSection
        title="AGPO Category"
        count={filters.agpoCategories.length}
        expanded={expandedSections.agpo}
        onToggle={() => toggleSection('agpo')}
      >
        {agpoOptions.map(a => (
          <CheckboxItem
            key={`filter-agpo-${a}`}
            label={a}
            checked={filters.agpoCategories.includes(a)}
            onChange={() => toggleArrayFilter('agpoCategories', a)}
          />
        ))}
      </FilterSection>

      {/* Procurement Method */}
      <FilterSection
        title="Procurement Method"
        count={filters.methods.length}
        expanded={expandedSections.method}
        onToggle={() => toggleSection('method')}
      >
        {procurementMethods.map(m => (
          <CheckboxItem
            key={`filter-method-${m}`}
            label={m}
            checked={filters.methods.includes(m)}
            onChange={() => toggleArrayFilter('methods', m)}
          />
        ))}
      </FilterSection>

      {/* Entity Type */}
      <FilterSection
        title="Entity Type"
        count={filters.entityTypes.length}
        expanded={expandedSections.entity}
        onToggle={() => toggleSection('entity')}
      >
        {entityTypes.map(e => (
          <CheckboxItem
            key={`filter-entity-${e}`}
            label={e}
            checked={filters.entityTypes.includes(e)}
            onChange={() => toggleArrayFilter('entityTypes', e)}
          />
        ))}
      </FilterSection>

      {/* Category */}
      <FilterSection
        title="Category"
        count={filters.categories.length}
        expanded={expandedSections.category}
        onToggle={() => toggleSection('category')}
      >
        <div className="max-h-40 overflow-y-auto scrollbar-thin space-y-0.5">
          {tenderCategories.map(cat => (
            <CheckboxItem
              key={`filter-cat-${cat}`}
              label={cat}
              checked={filters.categories.includes(cat)}
              onChange={() => toggleArrayFilter('categories', cat)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Value Range */}
      <FilterSection
        title="Estimated Value (KES M)"
        count={(filters.valueMin ? 1 : 0) + (filters.valueMax ? 1 : 0)}
        expanded={expandedSections.value}
        onToggle={() => toggleSection('value')}
      >
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={filters.valueMin}
            onChange={e => onFilterChange('valueMin', e.target.value)}
            className="input-base text-xs h-8 w-full"
          />
          <span className="text-muted-foreground text-xs shrink-0">to</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.valueMax}
            onChange={e => onFilterChange('valueMax', e.target.value)}
            className="input-base text-xs h-8 w-full"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">Enter values in millions KES</p>
      </FilterSection>

      {/* Source */}
      <FilterSection
        title="Data Source"
        count={filters.sources.length}
        expanded={expandedSections.source}
        onToggle={() => toggleSection('source')}
      >
        {sourceOptions.map(s => (
          <CheckboxItem
            key={`filter-source-${s}`}
            label={s}
            checked={filters.sources.includes(s)}
            onChange={() => toggleArrayFilter('sources', s)}
          />
        ))}
      </FilterSection>
    </div>
  );
}

function FilterSection({
  title,
  count,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  count: number;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2.5 px-1 text-left hover:bg-muted/50 rounded-md transition-colors"
      >
        <span className="text-sm font-medium text-foreground flex items-center gap-2">
          {title}
          {count > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold leading-none">
              {count}
            </span>
          )}
        </span>
        {expanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
      </button>
      {expanded && (
        <div className="pb-3 px-1 space-y-0.5">
          {children}
        </div>
      )}
    </div>
  );
}

function CheckboxItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 py-1 px-1 rounded cursor-pointer hover:bg-muted/50 transition-colors group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-3.5 h-3.5 rounded border-border accent-primary cursor-pointer"
      />
      <span className={`text-sm transition-colors ${checked ? 'text-foreground font-medium' : 'text-muted-foreground group-hover:text-foreground'}`}>
        {label}
      </span>
    </label>
  );
}
