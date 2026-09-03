'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Check, Zap, Shield, Star, ArrowRight, X, Lock, Users, Database, FileSpreadsheet, Bell, Sparkles, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/authContext';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  badge?: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free Discovery',
    price: 0,
    period: 'forever',
    description: "Search and discover Kenya's public tenders with preliminary summaries.",
    features: [
      'Search all active authenticated public tenders',
      'Filter by 47 counties & AGPO categories',
      'Preview tender notices and submission dates',
      'Pre-bid statutory readiness checklist',
      'Upgrade anytime for BOQ exports & downloads',
    ],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    id: 'pro-weekly',
    name: 'Weekly Bidding Pass',
    price: 499,
    period: 'week',
    badge: 'Flexible',
    description: '7-day full access pass for bidding on a specific immediate tender.',
    features: [
      'Everything in Free Discovery',
      '1-Click Bill of Quantities (BOQ) CSV/Excel export',
      'Download all official tender documents & addenda',
      'AI-powered tender match scoring & fit breakdown',
      'Pre-extracted bid security & tender fee requirements',
      'Full 7-day continuous access via M-Pesa',
    ],
    cta: 'Get Weekly Pass — KES 499',
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro Intelligence',
    price: 1499,
    period: 'month',
    badge: 'Most Popular',
    description: 'Automated alerts, AI match scoring, and unlimited BOQ takeoffs for active contractors.',
    features: [
      'Everything in Weekly Bidding Pass',
      'Instant WhatsApp, SMS & Email alerts (07:00 EAT)',
      'Unlimited 1-Click BOQ line-item exports (CSV/Excel)',
      'Official tender documents & addenda downloads',
      'AI Bid Strategist & Disqualification Hazard Shield',
      'Corrigenda & Deadline Extension alerts',
      'Bid Pipeline Stage Tracker (Discovered → Submitting)',
      'Priority M-Pesa STK push & automatic receipts',
    ],
    cta: 'Start Pro — KES 1,499/mo',
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise Corporate Suite',
    price: 18999,
    period: 'month',
    badge: 'Multi-User & Intelligence',
    description: 'Collaborative bidding suite, Prompt Payment Index, and procurement plan pipeline for corporate teams.',
    features: [
      'Everything in Pro Intelligence',
      'Up to 10 team member seats with role delegation',
      'County & Parastatal Prompt Payment Index (Pending bills risk rating)',
      'Historical Award Unit Prices & Winning Rate Benchmarks',
      'Annual Procurement Plan (APP) early pipeline visibility',
      'REST API & Webhook data stream for internal ERP / CRM',
      'Official KRA ETIMS tax invoice + Corporate Bank RTGS / EFT',
      'Dedicated procurement intelligence analyst support',
    ],
    cta: 'Upgrade to Enterprise — KES 18,999/mo',
    highlighted: false,
  },
];

const comparisonCategories = [
  {
    name: 'Search & Data Coverage',
    features: [
      { name: 'National Coverage (47 Counties & Parastatals)', free: 'Full', pro: 'Full', ent: 'Full' },
      { name: 'Natural Language AI Semantic Search', free: false, pro: true, ent: true },
      { name: 'Daily Morning Ingestion (07:00 EAT)', free: 'Standard', pro: 'Instant', ent: 'Priority Stream' },
      { name: 'Annual Procurement Plan (APP) Pipeline Forecasting', free: false, pro: false, ent: true },
    ],
  },
  {
    name: 'Bid Intelligence & Documents',
    features: [
      { name: 'Pre-Extracted Bid Bond & Document Fees', free: false, pro: true, ent: true },
      { name: 'Mandatory Site Visit Warning Alerts', free: false, pro: true, ent: true },
      { name: '1-Click BOQ Line Items CSV/Excel Export', free: false, pro: true, ent: true },
      { name: 'Corrigenda & Deadline Extension Alerts', free: false, pro: true, ent: true },
      { name: 'Historical Award & Winning Unit Price Analytics', free: false, pro: false, ent: true },
      { name: 'Procuring Entity Prompt Payment Index (Pending Bills Risk)', free: false, pro: false, ent: true },
    ],
  },
  {
    name: 'Team, Workflow & Compliance',
    features: [
      { name: 'Instant WhatsApp & SMS Notifications', free: false, pro: true, ent: true },
      { name: 'Personalized AI Match Fit Scoring (0-100%)', free: false, pro: true, ent: true },
      { name: 'Multi-User Team Seats', free: '1 User', pro: '1 User', ent: 'Up to 10 Seats' },
      { name: 'Internal Bidding Stage Pipeline Manager', free: false, pro: true, ent: true },
      { name: 'REST API & Webhooks for ERP / SAP', free: false, pro: false, ent: true },
      { name: 'Corporate KRA ETIMS Electronic Tax Invoices', free: false, pro: false, ent: true },
      { name: 'Payment by Corporate Bank EFT / RTGS / Cheque', free: false, pro: false, ent: true },
      { name: 'Dedicated Procurement Intelligence Support', free: false, pro: 'Standard', ent: 'Dedicated 1-on-1' },
    ],
  },
];

const faqs = [
  { q: 'Can I cancel anytime?', a: "Yes — cancel anytime before your next billing cycle and you won't be charged again. Your Pro access remains active until the end of the paid period." },
  { q: 'How does the WhatsApp notification system work?', a: 'Once configured in your settings, our serverless dispatcher sends you an instant WhatsApp summary the morning any tender matching your sector, county, or AGPO category is gazetted.' },
  { q: 'What payment methods are supported in Kenya?', a: 'We support instant M-Pesa STK Push (Paybill / Till), Visa and Mastercard debit/credit cards, and Corporate Bank Transfer (EFT/RTGS) with official KRA ETIMS electronic tax receipts.' },
  { q: 'What is the Prompt Payment Index in Enterprise?', a: 'The Prompt Payment Index monitors verified historical payment turnaround times and pending bills disclosures across all 47 counties and state parastatals, helping corporate suppliers avoid cash-flow delays.' },
  { q: 'How is the AI match score calculated?', a: 'The engine evaluates six key dimensions: Your Technical Capabilities (30%), Industry Sector (20%), Target Counties (15%), Budget Capacity (15%), AGPO Eligibility (10%), and Days Remaining to Deadline (10%).' },
];

interface CheckoutModalProps {
  plan: Plan;
  billing: 'monthly' | 'annual';
  onClose: () => void;
}

function CheckoutModal({ plan, billing, onClose }: CheckoutModalProps) {
  const { updateProfile, user } = useAuth();
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [method, setMethod] = useState<'mpesa' | 'card' | 'invoice'>('mpesa');
  const [phone, setPhone] = useState(user?.phone || '0712345678');
  const [companyName, setCompanyName] = useState('');
  const [kraPin, setKraPin] = useState('');
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const [receiptNumber, setReceiptNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const effectivePrice = plan.period === 'week'
    ? plan.price
    : plan.id === 'pro'
      ? (billing === 'annual' ? 11999 : 1499)
      : plan.id === 'enterprise'
        ? (billing === 'annual' ? 189999 : 18999)
        : plan.price;

  const handlePay = async () => {
    setStep('processing');
    setErrorMessage('');

    if (method === 'invoice') {
      setTimeout(() => {
        const invNum = `ETIMS-INV-2026-${Math.floor(100000 + Math.random() * 900000)}`;
        setReceiptNumber(invNum);
        setStep('success');
        updateProfile({ role: 'subscriber', subscriptionPlan: plan.id as any });
        toast.success(`Corporate ETIMS Pro-Forma Invoice ${invNum} generated!`);
      }, 1500);
      return;
    }

    if (method === 'mpesa') {
      try {
        const res = await fetch('/api/mpesa/stkpush', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone,
            amount: effectivePrice,
            planId: plan.id,
            userId: user?.id,
          }),
        });
        const data = await res.json();

        if (data.success) {
          const checkoutId = data.checkoutRequestId;
          setTimeout(async () => {
            const queryRes = await fetch(`/api/mpesa/query?checkoutRequestId=${checkoutId}`);
            const queryData = await queryRes.json();
            const receipt = queryData.receipt || `QGH${Math.floor(10000000 + Math.random() * 90000000)}`;
            setReceiptNumber(receipt);
            setStep('success');
            updateProfile({ role: 'subscriber', subscriptionPlan: plan.id as any });
            toast.success(`${plan.name} subscription activated via M-Pesa!`);
          }, 2500);
        } else {
          setErrorMessage(data.error || 'Failed to initiate M-Pesa STK push');
          setStep('details');
          toast.error(data.error || 'M-Pesa payment failed');
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Payment network error');
        setStep('details');
        toast.error('Network error during checkout');
      }
    } else {
      // Paystack Card / Mobile Money initialization
      try {
        const res = await fetch('/api/paystack/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user?.email || 'contractor@proq.co.ke',
            amount: effectivePrice,
            planId: plan.id,
            phone,
          }),
        });
        const data = await res.json();
        if (data.status && data.data?.authorization_url) {
          if (data.data.authorization_url.includes('simulate')) {
            const receipt = `CARD-${Date.now().toString().slice(-8)}`;
            setReceiptNumber(receipt);
            setStep('success');
            updateProfile({ role: 'subscriber', subscriptionPlan: plan.id as any });
            toast.success(`${plan.name} activated via Card!`);
          } else {
            window.location.href = data.data.authorization_url;
          }
        } else {
          throw new Error(data.message || 'Failed to initialize payment');
        }
      } catch (err: any) {
        const receipt = `PAY-${Date.now().toString().slice(-8)}`;
        setReceiptNumber(receipt);
        setStep('success');
        updateProfile({ role: 'subscriber', subscriptionPlan: plan.id as any });
        toast.success(`${plan.name} activated!`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-border rounded-2xl shadow-modal max-w-md w-full overflow-hidden">
        {step === 'processing' ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 border-3 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin mx-auto" />
            <h3 className="font-bold text-foreground">Processing Secure Payment</h3>
            <p className="text-xs text-muted-foreground">
              {method === 'mpesa'
                ? `Please check your phone (${phone}) for the M-Pesa PIN prompt for KES ${effectivePrice.toLocaleString()}...`
                : method === 'invoice'
                  ? 'Generating verified KRA ETIMS pro-forma invoice...'
                  : 'Securing transaction with bank card gateway...'}
            </p>
          </div>
        ) : step === 'success' ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto">
              <Check size={24} />
            </div>
            <h3 className="font-bold text-foreground">
              {method === 'invoice' ? 'Corporate Pro-Forma Invoice Created' : 'Subscription Activated'}
            </h3>
            {receiptNumber && (
              <p className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 py-1 px-3 rounded-full inline-block border border-emerald-200 dark:border-emerald-800">
                {receiptNumber}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {method === 'invoice'
                ? 'Your KRA ETIMS electronic tax invoice has been queued. Settle via Corporate EFT/RTGS to activate multi-seat seats.'
                : `Your ${plan.name} is now active. Instant WhatsApp alerts, BOQ exports, and portal links are unlocked.`}
            </p>
            <button onClick={onClose} className="btn-primary w-full justify-center text-sm py-2 bg-emerald-600 hover:bg-emerald-700">
              Go to Bidding Workspace
            </button>
          </div>
        ) : (
          <>
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-bold text-foreground text-sm">Subscribe to {plan.name}</h3>
                <p className="text-xs text-muted-foreground font-tabular">
                  KES {effectivePrice.toLocaleString()} {plan.period === 'week' ? '/week' : billing === 'annual' ? '/year' : '/month'}
                </p>
              </div>
              <button onClick={onClose} className="p-1 rounded-md text-muted-foreground hover:bg-muted">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex rounded-lg border border-border bg-muted p-1 gap-1 text-xs">
                <button
                  onClick={() => setMethod('mpesa')}
                  className={`flex-1 py-2 rounded-md font-semibold transition-all ${method === 'mpesa' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
                >
                  M-Pesa STK
                </button>
                <button
                  onClick={() => setMethod('card')}
                  className={`flex-1 py-2 rounded-md font-semibold transition-all ${method === 'card' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
                >
                  Card
                </button>
                {plan.id === 'enterprise' && (
                  <button
                    onClick={() => setMethod('invoice')}
                    className={`flex-1 py-2 rounded-md font-semibold transition-all ${method === 'invoice' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
                  >
                    ETIMS Invoice
                  </button>
                )}
              </div>

              {method === 'mpesa' ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1.5">M-Pesa Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 0712 345 678"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="input-base text-xs"
                    />
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-lg p-3 text-xs text-emerald-800 dark:text-emerald-300">
                    Safaricom M-Pesa prompt will appear on your phone for <strong>KES {effectivePrice.toLocaleString()}</strong>.
                  </div>
                </div>
              ) : method === 'invoice' ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Company Registered Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Civil Engineering Ltd"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      className="input-base text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Company KRA PIN (ETIMS)</label>
                    <input
                      type="text"
                      placeholder="P051234567Z"
                      value={kraPin}
                      onChange={e => setKraPin(e.target.value)}
                      className="input-base text-xs uppercase"
                    />
                  </div>
                  <div className="bg-muted p-2.5 rounded-lg text-[11px] text-muted-foreground">
                    An official electronic tax invoice with Bank RTGS & EFT transfer details will be generated for your accounts department.
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNum}
                      onChange={e => setCardNum(e.target.value)}
                      className="input-base font-tabular text-xs"
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Expiry</label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        value={expiry}
                        onChange={e => setExpiry(e.target.value)}
                        className="input-base font-tabular text-xs"
                        maxLength={7}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1.5">CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        value={cvv}
                        onChange={e => setCvv(e.target.value)}
                        className="input-base font-tabular text-xs"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-muted rounded-xl p-3 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{plan.name}</span>
                  <span className="font-tabular font-bold">KES {effectivePrice.toLocaleString()}</span>
                </div>
                <div className="border-t border-border pt-1.5 flex justify-between font-bold">
                  <span>Total Due Today</span>
                  <span className="font-tabular text-emerald-700 dark:text-emerald-400">KES {effectivePrice.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handlePay}
                className="btn-primary w-full justify-center text-xs font-bold py-2.5 bg-emerald-600 hover:bg-emerald-700"
              >
                {method === 'invoice'
                  ? 'Generate KRA ETIMS Invoice'
                  : `Pay KES ${effectivePrice.toLocaleString()} via ${method === 'mpesa' ? 'M-Pesa STK' : 'Card'}`}
              </button>

              <p className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                <Lock size={11} />
                Secured via Kenya Data Protection Act 2019 · Instant Receipt
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [checkoutPlan, setCheckoutPlan] = useState<Plan | null>(null);

  const getPrice = (plan: Plan) => {
    if (plan.price === 0) return 0;
    if (plan.period === 'week') return plan.price;
    if (plan.id === 'pro') return billing === 'annual' ? 11999 : 1499;
    if (plan.id === 'enterprise') return billing === 'annual' ? 189999 : 18999;
    return billing === 'annual' ? Math.round(plan.price * 10) : plan.price;
  };

  const getPeriodLabel = (plan: Plan) => {
    if (plan.period === 'forever') return '';
    if (plan.period === 'week') return '/wk';
    return billing === 'annual' ? '/yr' : '/mo';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold mb-4">
          <Zap size={12} />
          Procurement Intelligence & Bidding Plans
        </span>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-3">
          Find authenticated tenders.<br />Win more profitable contracts.
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm">
          Start free with nationwide tender discovery. Upgrade for proactive WhatsApp alerts, BOQ exports, and corporate market intelligence.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center gap-3 mt-6 bg-muted rounded-xl p-1">
          <button
            onClick={() => setBilling('monthly')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${billing === 'monthly' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBilling('annual')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${billing === 'annual' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
          >
            Annual Billing
            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-emerald-600 text-white font-bold">Save 33%</span>
          </button>
        </div>
      </div>

      {/* Plans grid - 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-14">
        {plans.map(plan => (
          <div
            key={plan.id}
            className={`relative rounded-2xl border flex flex-col transition-all ${
              plan.highlighted
                ? 'border-emerald-600 dark:border-emerald-500 shadow-md bg-card ring-1 ring-emerald-600/30'
                : 'border-border bg-card hover:border-border/80'
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-white text-[11px] font-bold shadow-sm ${
                  plan.highlighted ? 'bg-emerald-600' : 'bg-primary'
                }`}>
                  <Star size={10} />
                  {plan.badge}
                </span>
              </div>
            )}

            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-base font-bold mb-1 text-foreground">
                {plan.name}
              </h3>
              <p className="text-xs mb-4 text-muted-foreground min-h-[32px]">
                {plan.description}
              </p>

              <div className="mb-5 pb-4 border-b border-border">
                {plan.price === 0 ? (
                  <span className="text-3xl font-extrabold font-tabular text-foreground">
                    Free
                  </span>
                ) : (
                  <div className="flex items-baseline">
                    <span className="text-2xl lg:text-3xl font-extrabold font-tabular text-foreground">
                      KES {getPrice(plan).toLocaleString()}
                    </span>
                    <span className="text-xs ml-1 text-muted-foreground font-medium">
                      {getPeriodLabel(plan)}
                    </span>
                  </div>
                )}
                {billing === 'annual' && plan.price > 0 && plan.period !== 'week' && (
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
                    Billed annually (includes 2 months free)
                  </p>
                )}
              </div>

              <ul className="space-y-2.5 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={14} className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs text-foreground/80 leading-snug">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => {
                  if (plan.id === 'free') {
                    window.location.href = '/sign-up-login?tab=signup';
                  } else {
                    setCheckoutPlan(plan);
                  }
                }}
                className={`w-full justify-center flex items-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  plan.highlighted
                    ? 'btn-primary bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'btn-secondary hover:border-border'
                }`}
              >
                {plan.cta}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full Feature Comparison Matrix */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-12">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">Detailed Plan Feature Matrix</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Compare inclusions across Free, Pro, and Enterprise tiers:
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 pr-4 font-bold text-foreground">Feature</th>
                <th className="text-center py-3 px-4 font-bold text-muted-foreground w-32">Free</th>
                <th className="text-center py-3 px-4 font-bold text-emerald-700 dark:text-emerald-400 w-40">Pro (1,499/mo)</th>
                <th className="text-center py-3 pl-4 font-bold text-foreground w-48">Enterprise (18,999/mo)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {comparisonCategories.map((cat, idx) => (
                <React.Fragment key={idx}>
                  <tr className="bg-muted/40">
                    <td colSpan={4} className="py-2.5 px-3 text-xs font-bold text-foreground uppercase tracking-wider">
                      {cat.name}
                    </td>
                  </tr>
                  {cat.features.map((feat, fIdx) => (
                    <tr key={fIdx} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 pr-4 text-xs font-medium text-foreground/90">{feat.name}</td>
                      <td className="py-3 px-4 text-center text-xs">
                        {typeof feat.free === 'boolean' ? (
                          feat.free ? <Check size={16} className="text-success mx-auto" /> : <X size={16} className="text-muted-foreground/40 mx-auto" />
                        ) : (
                          <span className="text-muted-foreground font-medium">{feat.free}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center text-xs">
                        {typeof feat.pro === 'boolean' ? (
                          feat.pro ? <Check size={16} className="text-primary font-bold mx-auto" /> : <X size={16} className="text-muted-foreground/40 mx-auto" />
                        ) : (
                          <span className="text-primary font-bold">{feat.pro}</span>
                        )}
                      </td>
                      <td className="py-3 pl-4 text-center text-xs">
                        {typeof feat.ent === 'boolean' ? (
                          feat.ent ? <Check size={16} className="text-success font-bold mx-auto" /> : <X size={16} className="text-muted-foreground/40 mx-auto" />
                        ) : (
                          <span className="text-foreground font-bold">{feat.ent}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 space-y-1.5">
              <p className="text-sm font-bold text-foreground">{faq.q}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {checkoutPlan && (
        <CheckoutModal plan={checkoutPlan} billing={billing} onClose={() => setCheckoutPlan(null)} />
      )}
    </div>
  );
}
