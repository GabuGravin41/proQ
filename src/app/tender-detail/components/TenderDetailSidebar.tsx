'use client';
import React from 'react';
import { Tender } from '@/lib/tenderData';
import TenderMatchScore from './TenderMatchScore';
import ComplianceChecklist from './ComplianceChecklist';
import SubmissionVenueCard from './SubmissionVenueCard';
import EntityProfileCard from './EntityProfileCard';
import PreBidRequirementsCard from './PreBidRequirementsCard';

interface TenderDetailSidebarProps {
  tender: Tender;
}

export default function TenderDetailSidebar({ tender }: TenderDetailSidebarProps) {
  return (
    <div className="space-y-4">
      {/* Match score — only visible on xl+ (hidden in main on xl) */}
      <div className="hidden xl:block">
        <TenderMatchScore tender={tender} />
      </div>

      {/* Pre-bid requirements (Fees, Bond, Site Visit) */}
      <PreBidRequirementsCard tender={tender} />

      {/* Submission venue */}
      <SubmissionVenueCard tender={tender} />

      {/* Compliance checklist */}
      <ComplianceChecklist tender={tender} />

      {/* Entity profile */}
      <EntityProfileCard tender={tender} />
    </div>
  );
}
