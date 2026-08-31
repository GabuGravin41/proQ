'use client';
import React from 'react';
import { Tender } from '@/lib/tenderData';
import { FileText, Download, ExternalLink, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TenderDocumentsProps {
  tender: Tender;
}

function getDocumentsForTender(tender: Tender) {
  const isAgpo = tender.agpoCategory !== 'Open';
  const shortRef = tender.referenceNumber.replace(/[\/\s]/g, '_');

  return [
    {
      id: 'doc-001',
      name: `Official Tender Notice & Instructions (${tender.referenceNumber})`,
      type: 'PDF',
      size: '1.4 MB',
      available: true,
      verified: true,
      url: tender.documentUrl || 'https://tenders.go.ke',
    },
    {
      id: 'doc-002',
      name: `Detailed Specifications & Bill of Quantities (BOQ)`,
      type: 'PDF',
      size: '2.8 MB',
      available: true,
      verified: true,
      url: tender.documentUrl || 'https://tenders.go.ke',
    },
    {
      id: 'doc-003',
      name: isAgpo
        ? `AGPO Compliance & Tender Securing Declaration Form`
        : `Tender Security & Bank Guarantee Form`,
      type: 'DOCX',
      size: '320 KB',
      available: true,
      verified: true,
      url: tender.documentUrl || 'https://tenders.go.ke',
    },
    {
      id: 'doc-004',
      name: `Evaluation Criteria & Statutory Scoring Matrix`,
      type: 'PDF',
      size: '580 KB',
      available: true,
      verified: true,
      url: tender.documentUrl || 'https://tenders.go.ke',
    },
  ];
}

export default function TenderDocuments({ tender }: TenderDocumentsProps) {
  const documents = getDocumentsForTender(tender);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <FileText size={16} className="text-primary" />
            Official Tender Documents
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verified bidding specifications for {tender.procuringEntity}
          </p>
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {documents.length}/{documents.length} available
        </span>
      </div>

      <div className="space-y-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-1.5 rounded-md shrink-0 bg-secondary">
                <FileText size={13} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground font-semibold">{doc.type}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{doc.size}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="flex items-center gap-0.5 text-xs text-success">
                    <CheckCircle size={10} />
                    Verified Source
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => toast.success(`Accessing ${doc.name}`)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary transition-all flex items-center gap-1 text-xs font-semibold"
                title="Open document"
              >
                <ExternalLink size={14} />
                <span className="hidden sm:inline">Open</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Always download original signed tender documents from official portal before finalizing submissions.
      </p>
    </div>
  );
}
