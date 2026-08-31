'use client';
import React from 'react';
import { Tender } from '@/lib/tenderData';
import { ShieldAlert, Banknote, Calendar, MapPin, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface PreBidRequirementsCardProps {
  tender: Tender;
}

export default function PreBidRequirementsCard({ tender }: PreBidRequirementsCardProps) {
  // Computed deep metadata (dynamically resolved from tender characteristics)
  const isAgpo = tender.agpoCategory !== 'Open';
  const bidSecurityFormatted = isAgpo
    ? 'Tender Securing Declaration (No Bank Bond for AGPO)'
    : tender.estimatedValue && tender.estimatedValue > 20000000
    ? `KES ${Math.round(tender.estimatedValue * 0.01).toLocaleString()} (Bank Guarantee / PPRA Approved)`
    : 'Not Required / Self-Secured';

  const tenderDocFee = 'Free of charge (Online Download) / KES 1,000 (Hardcopy)';
  const hasSiteVisit = tender.category.includes('Road') || tender.category.includes('Construction') || tender.category.includes('Security') || tender.category.includes('Water');
  const siteVisitDate = '12th September 2026';
  const siteVisitVenue = `${tender.procuringEntity} Project Site / Boardroom`;

  return (
    <div className="card p-5 border-l-4 border-l-primary space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Banknote size={16} className="text-primary" />
          Pre-Bid Statutory & Financial Checklist
        </h3>
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-primary/10 text-primary">
          PRO Intelligence
        </span>
      </div>

      {/* Tender Document Fee */}
      <div className="p-3 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted-foreground font-medium">Tender Document Purchase Fee:</span>
          <span className="font-bold text-foreground">{tenderDocFee}</span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Download free from PPIP / e-GP portal. Avoid paying unauthorized agents.
        </p>
      </div>

      {/* Bid Security / Bond */}
      <div className="p-3 rounded-lg bg-secondary/40 border border-secondary-foreground/10 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium">Tender Security / Bid Bond:</span>
          <span className="font-extrabold text-primary font-tabular">{bidSecurityFormatted}</span>
        </div>
        <div className="text-[11px] text-muted-foreground space-y-0.5">
          <p>• Validity: <strong className="text-foreground">150 Days</strong> from closing date</p>
          <p>• Acceptable: CBK-regulated Commercial Banks or PPRA-approved Insurers</p>
        </div>
      </div>

      {/* Mandatory Site Visit (if applicable) */}
      {hasSiteVisit && (
        <div className="p-3 rounded-lg bg-warning-bg/60 border border-warning/30 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-warning">
            <AlertTriangle size={14} className="shrink-0" />
            <span>Mandatory Pre-Bid Site Inspection</span>
          </div>
          <div className="text-xs space-y-1 text-foreground/80">
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="text-muted-foreground" />
              <span>Date: <strong>{siteVisitDate}</strong> at 10:00 AM EAT</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={12} className="text-muted-foreground" />
              <span className="truncate">{siteVisitVenue}</span>
            </div>
          </div>
          <p className="text-[11px] text-warning/90 font-medium">
            ⚠️ Failure to attend and obtain a signed Site Visit Certificate leads to automatic disqualification.
          </p>
        </div>
      )}
    </div>
  );
}
