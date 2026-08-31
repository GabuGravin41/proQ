import React from 'react';
import { Tender } from '@/lib/tenderData';
import { Database, AlertTriangle, TrendingUp, Layers } from 'lucide-react';

interface StatsBarProps {
  tenders: Tender[];
}

function formatKES(value: number): string {
  if (value >= 1_000_000_000) return `KES ${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `KES ${(value / 1_000_000).toFixed(0)}M`;
  return `KES ${value.toLocaleString()}`;
}

export default function StatsBar({ tenders }: StatsBarProps) {
  const activeTenders = tenders.filter(t => t.status === 'active' || t.status === 'closing-soon');
  const closingToday = tenders.filter(t => t.daysRemaining <= 1);
  const hotFit = tenders.filter(t => t.matchScore !== null && t.matchScore >= 85);
  const totalValue = tenders.reduce((sum, t) => sum + (t.estimatedValue ?? 0), 0);

  const stats = [
    {
      id: 'stat-active',
      label: 'Active Tenders',
      value: activeTenders.length.toString(),
      sub: 'Across all sources',
      Icon: Database,
      color: 'text-primary',
      bgColor: 'bg-secondary',
    },
    {
      id: 'stat-closing',
      label: 'Closing Today',
      value: closingToday.length.toString(),
      sub: 'Requires immediate action',
      Icon: AlertTriangle,
      color: 'text-danger',
      bgColor: 'bg-danger-bg',
    },
    {
      id: 'stat-hot',
      label: 'Hot Fit ≥85%',
      value: hotFit.length.toString(),
      sub: 'AI-matched to your profile',
      Icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success-bg',
    },
    {
      id: 'stat-value',
      label: 'Total Value Indexed',
      value: formatKES(totalValue),
      sub: 'Active procurement pipeline',
      Icon: Layers,
      color: 'text-accent',
      bgColor: 'bg-warning-bg',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {stats.map((stat) => {
        const { Icon } = stat;
        return (
          <div key={stat.id} className="card p-4 flex items-start gap-3">
            <div className={`p-2 rounded-lg ${stat.bgColor} shrink-0`}>
              <Icon size={18} className={stat.color} />
            </div>
            <div className="min-w-0">
              <p className="section-label truncate">{stat.label}</p>
              <p className={`text-xl font-bold font-tabular mt-0.5 ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{stat.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
