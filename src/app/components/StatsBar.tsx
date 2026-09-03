import React from 'react';
import { Tender } from '@/lib/tenderData';
import { calculatePlatformStats } from '@/lib/stats';
import { Database, AlertTriangle, Sparkles, Layers, ShieldCheck } from 'lucide-react';

interface StatsBarProps {
  tenders: Tender[];
}

export default function StatsBar({ tenders }: StatsBarProps) {
  const stats = calculatePlatformStats(tenders);

  const statItems = [
    {
      id: 'stat-active',
      label: 'Live Active Tenders',
      value: `${stats.totalActive.toLocaleString()}`,
      sub: `Across ${stats.countiesCovered} counties & state entities`,
      Icon: Database,
      color: 'text-primary',
      bgColor: 'bg-primary/10 border-primary/20',
    },
    {
      id: 'stat-value',
      label: 'Total Pipeline Value',
      value: stats.formattedTotalValue,
      sub: 'Verified public procurement budget',
      Icon: Layers,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/30',
    },
    {
      id: 'stat-agpo',
      label: 'AGPO 30% Reserved',
      value: `${stats.agpoTendersCount} Notices`,
      sub: 'Youth, Women & PWD schemes',
      Icon: ShieldCheck,
      color: 'text-accent',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/30',
    },
    {
      id: 'stat-closing',
      label: 'Closing Soon (< 7 Days)',
      value: `${stats.closingSoon} Urgent`,
      sub: 'Action required for bid prep',
      Icon: AlertTriangle,
      color: 'text-danger',
      bgColor: 'bg-danger-bg border-danger/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {statItems.map((stat) => {
        const { Icon } = stat;
        return (
          <div key={stat.id} className="card p-4 flex items-start gap-3 border shadow-sm">
            <div className={`p-2.5 rounded-xl border ${stat.bgColor} shrink-0`}>
              <Icon size={18} className={stat.color} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground truncate">{stat.label}</p>
              <p className={`text-xl font-extrabold font-tabular mt-0.5 ${stat.color}`}>{stat.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{stat.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
