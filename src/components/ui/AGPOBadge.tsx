import React from 'react';

export type AGPOCategory = 'Youth' | 'Women' | 'PWD' | 'Open' | 'Special Groups';

interface AGPOBadgeProps {
  category: AGPOCategory;
  className?: string;
}

const agpoConfig: Record<AGPOCategory, { className: string; label: string; tooltip: string }> = {
  'Youth': {
    className: 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
    label: 'AGPO: Youth',
    tooltip: 'Reserved for Youth-owned enterprises (Ages 18–35) under PPADA Section 157',
  },
  'Women': {
    className: 'bg-pink-50 text-pink-700 border border-pink-200 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800',
    label: 'AGPO: Women',
    tooltip: 'Reserved for Women-owned businesses under the 30% statutory AGPO scheme',
  },
  'PWD': {
    className: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    label: 'AGPO: PWD',
    tooltip: 'Reserved for Persons with Disability enterprises',
  },
  'Open': {
    className: 'bg-muted text-muted-foreground border border-border',
    label: 'Open Tender',
    tooltip: 'Open competitive bidding for all registered contractors and suppliers',
  },
  'Special Groups': {
    className: 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800',
    label: 'AGPO: Special Groups',
    tooltip: 'Reserved affirmative procurement for Youth, Women & PWD',
  },
};

export default function AGPOBadge({ category, className = '' }: AGPOBadgeProps) {
  const config = agpoConfig[category] || agpoConfig['Open'];

  return (
    <span
      title={config.tooltip}
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
}
