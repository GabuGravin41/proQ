'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Tender } from '@/lib/tenderData';
import StatusBadge from '@/components/ui/StatusBadge';
import AGPOBadge from '@/components/ui/AGPOBadge';
import SourceBadge from '@/components/ui/SourceBadge';
import { Archive, MapPin, Building2, Calendar, FileText, Search, Filter } from 'lucide-react';

function formatKES(value: number | null): string {
  if (value === null) return 'Undisclosed';
  if (value >= 1_000_000_000) return `KES ${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `KES ${(value / 1_000_000).toFixed(1)}M`;
  return `KES ${value.toLocaleString()}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Simulate archived/closed tenders
const archivedTenders: Tender[] = [
  {
    id: 'arch-001',
    referenceNumber: 'MOH/PROC/EQUIP/2026/031',
    title: 'Supply of Diagnostic Imaging Equipment — CT Scanners and MRI Machines',
    procuringEntity: 'Ministry of Health',
    entityType: 'Ministry',
    county: 'National',
    procurementMethod: 'Open International Tender',
    agpoCategory: 'Open',
    estimatedValue: 285000000,
    closingDate: '2026-07-30',
    closingTime: '12:00 EAT',
    publishedDate: '2026-07-01',
    status: 'closed',
    source: 'PPIP',
    daysRemaining: -32,
    documentUrl: 'https://tenders.go.ke/docs/MOH-EQUIP-2026-031.pdf',
    documentAvailable: true,
    matchScore: null,
    matchReasons: [],
    description: 'Ministry of Health sought supply and installation of CT scanners and MRI machines for 8 county referral hospitals under the Universal Health Coverage programme.',
    submissionVenue: 'e-GP',
    egpLink: 'https://egpkenya.go.ke/tender/MOH-EQUIP-2026-031',
    category: 'Healthcare & Medical',
  },
  {
    id: 'arch-002',
    referenceNumber: 'KURA/PROC/ROAD/2026/019',
    title: 'Rehabilitation of Mombasa-Nairobi Highway — Section 3 (Mtito Andei to Sultan Hamud)',
    procuringEntity: 'Kenya Urban Roads Authority',
    entityType: 'Parastatal',
    county: 'Makueni',
    procurementMethod: 'Open International Tender',
    agpoCategory: 'Open',
    estimatedValue: 4200000000,
    closingDate: '2026-08-10',
    closingTime: '14:00 EAT',
    publishedDate: '2026-07-05',
    status: 'closed',
    source: 'e-GP',
    daysRemaining: -21,
    documentUrl: 'https://egpkenya.go.ke/docs/KURA-ROAD-2026-019.pdf',
    documentAvailable: true,
    matchScore: null,
    matchReasons: [],
    description: 'KURA sought a qualified contractor for full rehabilitation of 87km of the Mombasa-Nairobi highway including pavement reconstruction, drainage, and road safety infrastructure.',
    submissionVenue: 'e-GP',
    egpLink: 'https://egpkenya.go.ke/tender/KURA-ROAD-2026-019',
    category: 'Roads & Infrastructure',
  },
  {
    id: 'arch-003',
    referenceNumber: 'KNEC/PROC/ICT/2026/008',
    title: 'Supply and Deployment of Computer-Based Testing Infrastructure for KCSE 2026',
    procuringEntity: 'Kenya National Examinations Council',
    entityType: 'Parastatal',
    county: 'National',
    procurementMethod: 'Restricted Tender',
    agpoCategory: 'Open',
    estimatedValue: 62000000,
    closingDate: '2026-08-05',
    closingTime: '10:00 EAT',
    publishedDate: '2026-07-10',
    status: 'awarded',
    source: 'PPIP',
    daysRemaining: -26,
    documentUrl: 'https://tenders.go.ke/docs/KNEC-ICT-2026-008.pdf',
    documentAvailable: true,
    matchScore: 78,
    matchReasons: ['ICT hardware supply match', 'Education sector match'],
    description: 'KNEC required supply and deployment of 12,000 tablets, secure testing software, and network infrastructure for the pilot computer-based KCSE examination programme.',
    submissionVenue: 'Physical',
    physicalAddress: 'KNEC Headquarters, Upper Hill Road, Nairobi',
    category: 'ICT & Software',
  },
  {
    id: 'arch-004',
    referenceNumber: 'NEMA/PROC/CONS/2026/044',
    title: 'Environmental Impact Assessment Consultancy Services — Lamu Coal Power Plant',
    procuringEntity: 'National Environment Management Authority',
    entityType: 'Parastatal',
    county: 'Lamu',
    procurementMethod: 'Request for Quotation',
    agpoCategory: 'Open',
    estimatedValue: 8500000,
    closingDate: '2026-08-15',
    closingTime: '12:00 EAT',
    publishedDate: '2026-07-20',
    status: 'cancelled',
    source: 'Institutional',
    daysRemaining: -16,
    documentUrl: null,
    documentAvailable: false,
    matchScore: null,
    matchReasons: [],
    description: 'NEMA required consultancy services for a comprehensive Environmental and Social Impact Assessment for the proposed Lamu coal power plant project. Cancelled following policy review.',
    submissionVenue: 'Physical',
    physicalAddress: 'NEMA Headquarters, Upperhill, Nairobi',
    category: 'Consultancy',
  },
  {
    id: 'arch-005',
    referenceNumber: 'KIRDI/PROC/LAB/2026/022',
    title: 'Supply of Industrial Research Laboratory Equipment and Analytical Instruments',
    procuringEntity: 'Kenya Industrial Research & Development Institute',
    entityType: 'Parastatal',
    county: 'Nairobi',
    procurementMethod: 'Open National Tender',
    agpoCategory: 'Women',
    estimatedValue: 14200000,
    closingDate: '2026-08-20',
    closingTime: '12:00 EAT',
    publishedDate: '2026-07-25',
    status: 'closed',
    source: 'PPIP',
    daysRemaining: -11,
    documentUrl: 'https://tenders.go.ke/docs/KIRDI-LAB-2026-022.pdf',
    documentAvailable: true,
    matchScore: null,
    matchReasons: [],
    description: 'KIRDI required supply of gas chromatographs, mass spectrometers, and industrial testing equipment for the Nairobi research centre.',
    submissionVenue: 'e-GP',
    egpLink: 'https://egpkenya.go.ke/tender/KIRDI-LAB-2026-022',
    category: 'Laboratory & Medical',
  },
];

export default function ArchivePage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'closed' | 'awarded' | 'cancelled'>('all');

  const filtered = archivedTenders.filter(t => {
    const matchesSearch = !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.procuringEntity.toLowerCase().includes(search.toLowerCase()) ||
      t.referenceNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
            <Archive size={24} className="text-muted-foreground" />
            Archive
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Closed, awarded, and cancelled tenders — historical procurement record
          </p>
        </div>
        <Link href="/" className="btn-secondary text-xs py-1.5">
          ← Active Tenders
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search archived tenders..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-base pl-9 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-muted-foreground" />
          {(['all', 'closed', 'awarded', 'cancelled'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                statusFilter === s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-secondary'
              }`}
            >
              {s === 'all' ? `All (${archivedTenders.length})` : s}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Closed', count: archivedTenders.filter(t => t.status === 'closed').length, color: 'text-muted-foreground' },
          { label: 'Awarded', count: archivedTenders.filter(t => t.status === 'awarded').length, color: 'text-secondary-foreground' },
          { label: 'Cancelled', count: archivedTenders.filter(t => t.status === 'cancelled').length, color: 'text-danger' },
        ].map((s, i) => (
          <div key={i} className="card p-3 text-center">
            <p className={`text-xl font-extrabold font-tabular ${s.color}`}>{s.count}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No archived tenders match your search.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(tender => (
            <div key={tender.id} className="card p-4 opacity-90 hover:opacity-100 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <StatusBadge status={tender.status} />
                    <SourceBadge source={tender.source} />
                    <AGPOBadge category={tender.agpoCategory} />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-0.5">
                    {tender.title}
                  </h3>
                  <p className="text-xs font-mono text-muted-foreground mb-2">{tender.referenceNumber}</p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building2 size={11} />
                      <span className="font-medium text-foreground/70">{tender.procuringEntity}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />
                      {tender.county}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      Closed {formatDate(tender.closingDate)}
                    </span>
                    <span className="font-bold font-tabular text-foreground/70">{formatKES(tender.estimatedValue)}</span>
                  </div>

                  {tender.matchScore !== null && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs font-semibold">
                      Was {tender.matchScore}% match
                    </div>
                  )}
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  <Link href="/tender-detail" className="btn-secondary text-xs py-1.5 px-3">
                    View Record
                  </Link>
                  {tender.documentAvailable && (
                    <a
                      href={tender.documentUrl ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-xs py-1.5 px-3"
                    >
                      <FileText size={12} />
                      Docs
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
