import React from 'react';
import { mockTenders } from '@/lib/tenderData';
import TenderDetailHeader from './TenderDetailHeader';
import TenderDetailMain from './TenderDetailMain';
import TenderDetailSidebar from './TenderDetailSidebar';
import RelatedTenders from './RelatedTenders';

// Use the first tender (CCTV - highest match score) as the detail view
const tender = mockTenders?.find(t => t?.id === 'tender-004') ?? mockTenders?.[0];
const relatedTenders = mockTenders?.filter(t => t?.id !== tender?.id && (t?.county === tender?.county || t?.category === tender?.category))?.slice(0, 4);

export default function TenderDetailPage() {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 2xl:px-16 py-6">
      <TenderDetailHeader tender={tender} />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Main content — 2 cols on lg, 3 cols on xl */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
          <TenderDetailMain tender={tender} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 xl:col-span-1 space-y-4">
          <TenderDetailSidebar tender={tender} />
        </div>
      </div>

      {/* Related tenders */}
      <div className="mt-8">
        <RelatedTenders tenders={relatedTenders} />
      </div>
    </div>
  );
}
