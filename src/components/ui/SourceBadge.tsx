import React from 'react';

export type TenderSource =
  | 'PPIP'
  | 'e-GP'
  | 'e-GP Kenya'
  | 'Institutional'
  | 'Institutional Noticeboard'
  | 'County'
  | 'County Portal';

interface SourceBadgeProps {
  source: string;
  className?: string;
}

const sourceConfig: Record<string, { className: string; label: string; tooltip: string }> = {
  'PPIP': {
    className: 'bg-info-bg text-info border border-info/20',
    label: 'PPIP National Portal',
    tooltip: 'Published on the central Public Procurement Information Portal (tenders.go.ke/tenders)',
  },
  'e-GP': {
    className: 'bg-secondary text-secondary-foreground border border-secondary-foreground/20',
    label: 'e-GP Digital Portal',
    tooltip: 'Electronic procurement tender submitted online via e-GP Kenya (egpkenya.go.ke)',
  },
  'e-GP Kenya': {
    className: 'bg-secondary text-secondary-foreground border border-secondary-foreground/20',
    label: 'e-GP Digital Portal',
    tooltip: 'Electronic procurement tender submitted online via e-GP Kenya (egpkenya.go.ke)',
  },
  'Institutional': {
    className: 'bg-warning-bg text-warning border border-warning/20',
    label: 'Direct Noticeboard',
    tooltip: 'Published on the official school, university, or parastatal website / noticeboard',
  },
  'Institutional Noticeboard': {
    className: 'bg-warning-bg text-warning border border-warning/20',
    label: 'Direct Noticeboard',
    tooltip: 'Published on the official school, university, or parastatal website / noticeboard',
  },
  'County': {
    className: 'bg-success-bg text-success border border-success/20',
    label: 'County Government',
    tooltip: 'Published by the respective County Government Procurement Directorate',
  },
  'County Portal': {
    className: 'bg-success-bg text-success border border-success/20',
    label: 'County Government',
    tooltip: 'Published by the respective County Government Procurement Directorate',
  },
};

export default function SourceBadge({ source, className = '' }: SourceBadgeProps) {
  const config = sourceConfig[source] || {
    className: 'bg-muted text-muted-foreground border border-border',
    label: source,
    tooltip: 'Procurement opportunity',
  };

  return (
    <span
      title={config.tooltip}
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
}
