'use client';
import React, { use } from 'react';
import AppLayout from '@/components/AppLayout';
import { mockTenders } from '@/lib/tenderData';
import TenderDetailHeader from '@/app/tender-detail/components/TenderDetailHeader';
import TenderDetailMain from '@/app/tender-detail/components/TenderDetailMain';
import TenderDetailSidebar from '@/app/tender-detail/components/TenderDetailSidebar';
import RelatedTenders from '@/app/tender-detail/components/RelatedTenders';
import Link from 'next/link';
import { ArrowLeft, Inbox } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DynamicTenderPage({ params }: PageProps) {
  const { id } = use(params);

  // Look up tender by ID from repository
  const tender = mockTenders.find(t => t.id.toLowerCase() === id.toLowerCase()) || mockTenders[0];

  if (!tender) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Inbox size={28} className="text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Tender Notice Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The tender with ID <span className="font-mono text-primary">{id}</span> could not be located in the PPIP/e-GP index.
          </p>
          <Link href="/" className="btn-primary">
            <ArrowLeft size={14} /> Back to Tender Search
          </Link>
        </div>
      </AppLayout>
    );
  }

  // Related tenders in same county or category
  const relatedTenders = mockTenders
    .filter(t => t.id !== tender.id && (t.county === tender.county || t.category === tender.category))
    .slice(0, 4);

  return (
    <AppLayout>
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 2xl:px-16 py-6">
        <TenderDetailHeader tender={tender} />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main content (8 columns on desktop) */}
          <div className="lg:col-span-8 space-y-6">
            <TenderDetailMain tender={tender} />
          </div>

          {/* Sidebar (4 columns on desktop) */}
          <div className="lg:col-span-4 space-y-4">
            <TenderDetailSidebar tender={tender} />
          </div>
        </div>

        {/* Related tenders */}
        <div className="mt-8">
          <RelatedTenders tenders={relatedTenders} />
        </div>
      </div>
    </AppLayout>
  );
}
