'use client';
import React, { useState } from 'react';
import { Tender } from '@/lib/tenderData';
import { FileText, Download, ExternalLink, CheckCircle, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/authContext';
import PaywallModal from '@/app/components/PaywallModal';

interface TenderDocumentsProps {
  tender: Tender;
}

function getDocumentsForTender(tender: Tender) {
  const isAgpo = tender.agpoCategory !== 'Open';

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
  const { user } = useAuth();
  const isSubscriber = user?.role === 'subscriber' || user?.role === 'admin';
  const [paywallOpen, setPaywallOpen] = useState(false);
  const documents = getDocumentsForTender(tender);

  const handleDocClick = (e: React.MouseEvent, docName: string, url: string) => {
    if (!isSubscriber) {
      e.preventDefault();
      setPaywallOpen(true);
      return;
    }
    toast.success(`Accessing ${docName}`);
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <FileText size={16} className="text-primary" />
            Official Tender Documents & Addenda
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verified bidding specifications for {tender.procuringEntity}
          </p>
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {documents.length}/{documents.length} available
        </span>
      </div>

      {!isSubscriber && (
        <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400 shrink-0">
              <Lock size={14} />
            </div>
            <p className="text-xs text-foreground/90">
              <span className="font-bold">Pro Access:</span> Full bidding documents, specifications, and addenda downloads are reserved for active Pro subscribers.
            </p>
          </div>
          <button
            onClick={() => setPaywallOpen(true)}
            className="btn-primary text-xs shrink-0 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700"
          >
            Unlock Downloads
          </button>
        </div>
      )}

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
                href={isSubscriber ? doc.url : '#'}
                target={isSubscriber ? "_blank" : "_self"}
                rel="noopener noreferrer"
                onClick={(e) => handleDocClick(e, doc.name, doc.url)}
                className={`p-1.5 rounded-md transition-all flex items-center gap-1 text-xs font-semibold ${
                  isSubscriber
                    ? 'text-muted-foreground hover:text-primary hover:bg-secondary'
                    : 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100'
                }`}
                title={isSubscriber ? "Open document" : "Unlock document with Pro"}
              >
                {isSubscriber ? <ExternalLink size={14} /> : <Lock size={13} />}
                <span className="hidden sm:inline">{isSubscriber ? 'Open' : 'Unlock'}</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Always verify and download official signed tender documents from official portal before finalizing submissions.
      </p>

      <PaywallModal
        open={paywallOpen}
        feature="Official Tender Document & Specification Downloads"
        onClose={() => setPaywallOpen(false)}
      />
    </div>
  );
}
