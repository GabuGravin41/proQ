import React from 'react';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import { Shield, AlertTriangle, Scale, FileCheck, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | proQ Kenya',
  description: 'Terms of Service, Public Procurement Disclaimers, and Limitation of Liability for proQ Kenya platform.',
};

export default function TermsPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft size={14} /> Back to proQ
          </Link>
          <div className="flex items-center gap-2.5 mb-2">
            <Scale size={24} className="text-primary" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">Terms of Service</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Effective Date: September 2026 · Version 1.2 · Applicable to all users in Kenya and internationally
          </p>
        </div>

        {/* Highlighted Procurement Disclaimer */}
        <div className="p-4 sm:p-5 rounded-2xl border border-warning/40 bg-warning-bg/50 space-y-2">
          <div className="flex items-center gap-2 text-warning font-bold text-sm">
            <AlertTriangle size={18} className="shrink-0" />
            <span>Important Public Procurement Notice & Legal Disclaimer</span>
          </div>
          <p className="text-xs text-foreground/80 leading-relaxed">
            <strong>proQ Kenya</strong> is an independent intelligence and bid advisory platform. We aggregate publicly published procurement notices from the Public Procurement Information Portal (PPIP), e-GP Kenya, county governments, and state parastatals. <strong>proQ Kenya is not a government agency</strong>, not affiliated with the National Treasury or PPRA, and does not award government tenders. Contractors must always verify official tender documents, addenda, and submission venues on the designated procuring entity’s official portal before bidding.
          </p>
        </div>

        <div className="space-y-6 text-xs text-muted-foreground leading-relaxed divide-y divide-border">
          {/* Section 1 */}
          <div className="pt-4 space-y-2">
            <h2 className="text-sm font-bold text-foreground">1. Acceptance of Terms & Eligibility</h2>
            <p>
              By creating an account, browsing tenders, or using the proQ AI Bidding Copilot, you agree to be bound by these Terms of Service. If you are using the platform on behalf of a company or legal entity (such as a contractor registered with the National Construction Authority or AGPO enterprise), you represent that you have legal authority to bind that entity.
            </p>
          </div>

          {/* Section 2 */}
          <div className="pt-4 space-y-2">
            <h2 className="text-sm font-bold text-foreground">2. Procurement Data Accuracy & Independent Verification</h2>
            <p>
              While proQ Kenya employs automated verification pipelines to maintain accurate tender closing dates, reference numbers, and preliminary compliance criteria, procuring entities frequently issue <strong>addenda, deadline extensions, or cancellations</strong>.
            </p>
            <p>
              You acknowledge that it is your sole professional responsibility as a bidder to cross-reference tender numbers, submission venues (e-GP vs. Physical Tender Box), and closing times directly with the procuring entity before submitting your bid bond and tender proposals.
            </p>
          </div>

          {/* Section 3 */}
          <div className="pt-4 space-y-2">
            <h2 className="text-sm font-bold text-foreground">3. AI Copilot, Match Scores & BOQ Takeoffs</h2>
            <p>
              proQ Kenya provides automated Bill of Quantities (BOQ) takeoff tables, preliminary disqualification shields, and AI match scores. These tools are provided strictly as <strong>decision-support aids</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Match scores reflect statistical capability alignment and do not guarantee shortlisting or tender award.</li>
              <li>BOQ quantities and unit takeoff estimates should be inspected and priced by a qualified Quantity Surveyor or Estimator.</li>
              <li>Preliminary disqualification warnings (e.g., 150-day bid bond validity) are based on standard PPADA 2015 regulations and entity tender documents.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="pt-4 space-y-2">
            <h2 className="text-sm font-bold text-foreground">4. Subscription Plans, M-Pesa & Card Billing</h2>
            <p>
              Paid plans (Pro at KES 4,999/month, Enterprise at KES 17,999/month) provide expanded access to WhatsApp dispatch, unlimited BOQ exports, and AI analysis.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Payments are securely processed via <strong>Paystack Kenya</strong> using M-Pesa STK Push or Visa/Mastercard debit cards.</li>
              <li>Subscriptions renew monthly unless cancelled before the renewal date through your Account Settings.</li>
              <li>All subscription fees are denominated in Kenya Shillings (KES) inclusive of applicable taxes.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="pt-4 space-y-2">
            <h2 className="text-sm font-bold text-foreground">5. Limitation of Legal Liability</h2>
            <p>
              To the fullest extent permitted under the laws of Kenya, proQ Kenya, its operators, officers, and developers shall not be liable for:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Any disqualified bids, lost tenders, or unsuccessful tender submissions.</li>
              <li>Delays or downtime caused by government procurement portals (PPIP, e-GP Kenya), telecommunications carriers, or WhatsApp API outages.</li>
              <li>Financial losses resulting from pricing decisions, bid bonds, or bank guarantees procured by your firm.</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="pt-4 space-y-2">
            <h2 className="text-sm font-bold text-foreground">6. Governing Law & Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the <strong>Republic of Kenya</strong>. Any disputes arising from or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts sitting in Nairobi, Kenya.
            </p>
          </div>

          {/* Section 7 */}
          <div className="pt-4 space-y-2">
            <h2 className="text-sm font-bold text-foreground">7. Contact & Legal Enquiries</h2>
            <p>
              For legal questions, procurement notice corrections, or compliance notices, contact our legal desk at <a href="mailto:legal@proq.co.ke" className="text-primary underline">legal@proq.co.ke</a> or call our support line.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
