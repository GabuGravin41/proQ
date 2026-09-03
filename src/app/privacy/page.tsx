import React from 'react';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import { ShieldCheck, Lock, ArrowLeft, Eye, Database, Smartphone } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | proQ Kenya',
  description: 'Privacy Policy and Data Protection compliance under the Kenya Data Protection Act 2019 for proQ Kenya.',
};

export default function PrivacyPolicyPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft size={14} /> Back to proQ
          </Link>
          <div className="flex items-center gap-2.5 mb-2">
            <ShieldCheck size={24} className="text-emerald-600" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">Privacy Policy</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Last Updated: September 2026 · Compliant with the Kenya Data Protection Act (KDPA) 2019
          </p>
        </div>

        {/* Highlight Card */}
        <div className="p-4 sm:p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800/40 space-y-2">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
            <Lock size={18} className="shrink-0" />
            <span>Our Commitment to Contractor Data Privacy</span>
          </div>
          <p className="text-xs text-foreground/80 leading-relaxed">
            At <strong>proQ Kenya</strong>, we recognize that your bidding preferences, target counties, and company capabilities are confidential commercial assets. We do not sell your personal or company data to third parties, competitors, or marketing brokers.
          </p>
        </div>

        <div className="space-y-6 text-xs text-muted-foreground leading-relaxed divide-y divide-border">
          {/* Section 1 */}
          <div className="pt-4 space-y-2">
            <h2 className="text-sm font-bold text-foreground">1. Data Controller Information</h2>
            <p>
              proQ Kenya operates as the Data Controller under the <strong>Kenya Data Protection Act, 2019</strong>. For all data privacy matters, you can reach our Data Protection Officer at <a href="mailto:privacy@proq.co.ke" className="text-primary underline">privacy@proq.co.ke</a>.
            </p>
          </div>

          {/* Section 2 */}
          <div className="pt-4 space-y-2">
            <h2 className="text-sm font-bold text-foreground">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account Credentials</strong>: Full name, business email address, encrypted password.</li>
              <li><strong>Company & Bidding Profile</strong>: Company name, target procurement sectors, target counties, budget thresholds, and AGPO category (Youth, Women, PWD, or None).</li>
              <li><strong>Communication Details</strong>: Mobile phone number for 07:00 AM WhatsApp/SMS alert dispatch.</li>
              <li><strong>Payment Information</strong>: M-Pesa phone numbers and transaction receipts. <em>Note: Credit/debit card numbers are processed directly by Paystack Kenya and are never stored on our servers.</em></li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="pt-4 space-y-2">
            <h2 className="text-sm font-bold text-foreground">3. How We Use Your Data</h2>
            <p>We process your data strictly for legitimate operational purposes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Delivering daily 07:00 AM WhatsApp and SMS notifications for matching procurement notices.</li>
              <li>Powering the AI Bidding Copilot to evaluate tender compliance against your specific company capacity.</li>
              <li>Processing monthly subscription renewals via Paystack and Daraja M-Pesa APIs.</li>
              <li>Monitoring platform stability and preventing fraudulent access.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="pt-4 space-y-2">
            <h2 className="text-sm font-bold text-foreground">4. Third-Party Sub-Processors</h2>
            <p>We only partner with established, compliant infrastructure providers:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Paystack Payments Limited</strong>: PCI-DSS Level 1 payment gateway for M-Pesa STK Push and card billing.</li>
              <li><strong>Meta Platforms (WhatsApp Cloud API)</strong>: End-to-end encrypted notification dispatch.</li>
              <li><strong>Africa&apos;s Talking</strong>: Licensed Kenyan telecommunications aggregator for SMS alerts.</li>
              <li><strong>Neon Database Inc.</strong>: Encrypted-at-rest PostgreSQL cloud database.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="pt-4 space-y-2">
            <h2 className="text-sm font-bold text-foreground">5. Your Rights Under Kenyan Law</h2>
            <p>In accordance with Section 26 of the Kenya Data Protection Act 2019, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Request a copy of all personal data held about you.</li>
              <li>Correct or update inaccurate or outdated bidding profile information.</li>
              <li>Withdraw consent for WhatsApp or SMS alerts at any time in Notification Preferences.</li>
              <li>Request complete deletion of your account and associated history (&quot;Right to be Forgotten&quot;).</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="pt-4 space-y-2">
            <h2 className="text-sm font-bold text-foreground">6. Data Security Measures</h2>
            <p>
              All traffic between your browser and proQ Kenya is encrypted using TLS 1.3 encryption. Internal database connections enforce SSL certificate verification, and user passwords are treated with cryptographic salting and hashing.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
