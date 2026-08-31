'use client';
import React, { useState } from 'react';
import { Tender } from '@/lib/tenderData';
import { Shield, CheckSquare, Square, ExternalLink, Info } from 'lucide-react';

interface ComplianceChecklistProps {
  tender: Tender;
}

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  mandatory: boolean;
  link?: string;
  linkLabel?: string;
}

const baseChecklist: ChecklistItem[] = [
  {
    id: 'check-kra',
    label: 'KRA Tax Compliance Certificate',
    description: 'Valid TCC from Kenya Revenue Authority. Verify via iTax portal.',
    mandatory: true,
    link: 'https://itax.kra.go.ke',
    linkLabel: 'iTax Portal',
  },
  {
    id: 'check-cr12',
    label: 'CR12 / Business Registration',
    description: 'Certificate of Incorporation and CR12 from Registrar of Companies.',
    mandatory: true,
    link: 'https://ecitizen.go.ke',
    linkLabel: 'eCitizen Portal',
  },
  {
    id: 'check-nca',
    label: 'NCA Contractor Registration',
    description: 'National Construction Authority registration — Category NCA 1–3 required for this tender.',
    mandatory: true,
    link: 'https://nca.go.ke',
    linkLabel: 'NCA Kenya',
  },
  {
    id: 'check-bid-security',
    label: 'Bid Security — KES 1,460,000',
    description: '2% of estimated contract value. Bank guarantee or bid bond from approved financial institution.',
    mandatory: true,
  },
  {
    id: 'check-agpo',
    label: 'AGPO Certificate (if applicable)',
    description: 'Youth, Women, or PWD certificate from Access to Government Procurement Opportunities.',
    mandatory: false,
    link: 'https://agpo.go.ke',
    linkLabel: 'AGPO Portal',
  },
  {
    id: 'check-iso',
    label: 'ISO 9001:2015 Certification',
    description: 'Quality management system certificate required for system integration works.',
    mandatory: true,
  },
  {
    id: 'check-audited',
    label: 'Audited Financial Statements',
    description: 'Last 3 years audited accounts demonstrating annual turnover ≥ KES 50M.',
    mandatory: true,
  },
  {
    id: 'check-experience',
    label: 'Relevant Experience — 3 Similar Projects',
    description: 'Completion certificates for at least 3 comparable CCTV/security projects in last 5 years.',
    mandatory: true,
  },
];

export default function ComplianceChecklist({ tender: _tender }: ComplianceChecklistProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [showInfo, setShowInfo] = useState<string | null>(null);

  const toggleCheck = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checked).filter(Boolean).length;
  const mandatoryCount = baseChecklist.filter(i => i.mandatory).length;
  const mandatoryDone = baseChecklist.filter(i => i.mandatory && checked[i.id]).length;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Shield size={15} className="text-primary" />
          Pre-Bid Compliance
        </h2>
        <span className="text-xs font-tabular text-muted-foreground">
          {completedCount}/{baseChecklist.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${(completedCount / baseChecklist.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {mandatoryDone}/{mandatoryCount} mandatory items ready
        </p>
      </div>

      <div className="space-y-2">
        {baseChecklist.map((item) => (
          <div key={item.id} className="group">
            <div
              className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all duration-150 ${
                checked[item.id]
                  ? 'bg-success-bg border-success/20' :'border-border hover:bg-muted/40'
              }`}
              onClick={() => toggleCheck(item.id)}
            >
              <div className="shrink-0 mt-0.5">
                {checked[item.id] ? (
                  <CheckSquare size={15} className="text-success" />
                ) : (
                  <Square size={15} className="text-muted-foreground group-hover:text-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-xs font-semibold ${checked[item.id] ? 'text-success line-through' : 'text-foreground'}`}>
                    {item.label}
                  </span>
                  {item.mandatory && (
                    <span className="text-xs px-1 py-0.5 rounded bg-danger-bg text-danger font-bold">Required</span>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setShowInfo(showInfo === item.id ? null : item.id); }}
                className="p-0.5 text-muted-foreground hover:text-foreground shrink-0"
              >
                <Info size={12} />
              </button>
            </div>
            {showInfo === item.id && (
              <div className="mt-1 ml-8 p-2.5 rounded-lg bg-muted/50 border border-border animate-fade-in">
                <p className="text-xs text-muted-foreground">{item.description}</p>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-1.5 text-xs text-primary hover:underline font-medium"
                  >
                    <ExternalLink size={10} />
                    {item.linkLabel}
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
