import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Award } from 'lucide-react';

export type TenderStatus = 'active' | 'closing-soon' | 'closed' | 'cancelled' | 'awarded';

interface StatusBadgeProps {
  status: TenderStatus;
  className?: string;
}

const statusConfig: Record<TenderStatus, {
  label: string;
  className: string;
  Icon: React.ElementType;
}> = {
  'active': {
    label: 'Active',
    className: 'badge-active',
    Icon: CheckCircle,
  },
  'closing-soon': {
    label: 'Closing Soon',
    className: 'badge-closing-soon',
    Icon: AlertTriangle,
  },
  'closed': {
    label: 'Closed',
    className: 'badge-closed',
    Icon: XCircle,
  },
  'cancelled': {
    label: 'Cancelled',
    className: 'badge-cancelled',
    Icon: XCircle,
  },
  'awarded': {
    label: 'Awarded',
    className: 'badge-awarded',
    Icon: Award,
  },
};

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const { Icon } = config;
  return (
    <span className={`${config.className} ${className}`}>
      <Icon size={10} />
      {config.label}
    </span>
  );
}
