'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Check, Zap, Shield, Star, ArrowRight, X, Lock, Users, Database, FileSpreadsheet, Bell, Sparkles, Building2 } from 'lucide-react';
import { toast } from 'sonner';

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
    description: "Full search and document access across Kenya's public tenders.",
    features: [
      'Search all 500+ active public tenders',
      'Filter by 47 counties & AGPO categories',
      'Direct link to official notices & documents',
      'Submission drop-off & e-GP details',
      'Standard statutory readiness checklist',
    ],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro Intelligence',
    price: 4999,
    period: 'month',
    badge: 'Most Popular',
    description: 'Automated alerts, AI match scoring, and extracted requirements for active contractors.',
    features: [
      'Everything in Free Discovery',
      'Instant WhatsApp, Telegram & Email alerts (07:00 EAT)',
      'AI-powered 0–100% tender match scoring & fit breakdown',
      '1-Click Bill of Quantities (BOQ) export to CSV & Excel',
      'Pre-extracted bid security, tender fees & site visit warnings',
      'Real-time Corrigenda & Addendum notification tracker',
      'Bid Pipeline Stage Tracker (Discovered → Preparing → Submitted)',
      '14-day full trial included',
    ],
    cta: 'Start Pro — KES 4,999/mo',
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise & Multi-Seat',
    price: 17999,
    period: 'month',
    description: 'Collaborative bidding suite, live API access, and market intelligence for corporate teams.',
    features: [
      'Everything in Pro Intelligence',
      'Up to 10 team member seats with role delegation',
      'REST API & Webhook data stream for internal ERP / CRM',
      'Historical award unit prices & winning bid benchmarks',
      'County & Parastatal Prompt Payment Index (Payment turnaround)',
      'Joint Venture (JV) partner matching for large consortiums',
      'Custom data exports & annual procurement plan downloads',
      'Dedicated procurement intelligence analyst support',
    ],
    cta: 'Upgrade to Enterprise — KES 17,999/mo',
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
    ],
  },
  {
    name: 'Bid Intelligence & Documents',
    features: [
      { name: 'Pre-Extracted Bid Bond & Document Fees', free: false, pro: true, ent: true },
      { name: 'Mandatory Site Visit Warning Alerts', free: false, pro: true, ent: true },
      { name: '1-Click BOQ Line Items CSV/Excel Export', free: false, pro: true, ent: true },
      { name: 'Corrigenda & Deadline Extension Alerts', free: false, pro: true, ent: true },
      { name: 'Historical Award & Unit Price Analytics', free: false, pro: false, ent: true },
      { name: 'Procuring Entity Payment Reputation Index', free: false, pro: false, ent: true },
    ],
  },
  {
    name: 'Alerts & Workflow',
    features: [
      { name: 'Instant WhatsApp & Telegram Notifications', free: false, pro: true, ent: true },
      { name: 'Personalized AI Match Fit Scoring (0-100%)', free: false, pro: true, ent: true },
      { name: 'Multi-User Team Seats', free: '1 User', pro: '1 User', ent: 'Up to 10 Seats' },
      { name: 'Internal Bidding Stage Pipeline Manager', free: false, pro: true, ent: true },
      { name: 'REST API & Webhooks for ERP / SAP', free: false, pro: false, ent: true },
      { name: 'Dedicated Procurement Intelligence Support', free: false, pro: 'Standard', ent: 'Dedicated 1-on-1' },
    ],
  },
];

const faqs = [
  { q: 'Can I cancel anytime?', a: "Yes — cancel anytime before your next billing cycle and you won't be charged again. Your Pro access remains active until the end of the paid period." },
  { q: 'How does the WhatsApp notification system work?', a: 'Once configured in your settings, our serverless dispatcher sends you an instant WhatsApp summary the morning any tender matching your sector, county, or AGPO category is gazetted.' },
  { q: 'What payment methods are supported in Kenya?', a: 'We support instant M-Pesa STK Push (Paybill / Till) as well as Visa and Mastercard debit and credit cards with instant automated receipts.' },
  { q: 'How is the AI match score calculated?', a: 'The engine evaluates six key dimensions: Your Technical Capabilities (30%), Industry Sector (20%), Target Counties (15%), Budget Capacity (15%), AGPO Eligibility (10%), and Days Remaining to Deadline (10%).' },
];

interface CheckoutModalProps {
  plan: Plan;
  onClose: () => void;
}

function CheckoutModal({ plan, onClose }: CheckoutModalProps) {
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [method, setMethod] = useState<'mpesa' | 'card'>('mpesa');
  const [phone, setPhone] = useState('0712345678');
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const [receiptNumber, setReceiptNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePay = async () => {
    setStep('processing');
    setErrorMessage('');

    if (method === 'mpesa') {
      try {
        const res = await fetch('/api/mpesa/stkpush', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone,
            amount: plan.price,
            planId: plan.id,
          }),
        });
        const data = await res.json();

        if (data.success) {
          // Poll for completion
          const checkoutId = data.checkoutRequestId;
          setTimeout(async () => {
            const queryRes = await fetch(`/api/mpesa/query?checkoutRequestId=${checkoutId}`);
            const queryData = await queryRes.json();
            setReceiptNumber(queryData.receipt || `QGH${Math.floor(10000000 + Math.random() * 90000000)}`);
            setStep('success');
            toast.success(`${plan.name} subscription activated via M-Pesa!`);
          }, 3000);
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
      // Card simulation
      setTimeout(() => {
        setReceiptNumber(`CARD-${Date.now().toString().slice(-8)}`);
        setStep('success');
        toast.success(`${plan.name} activated via Card!`);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-border rounded-2xl shadow-modal max-w-md w-full overflow-hidden">
        {step === 'processing' ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
            <h3 className="font-bold text-foreground">Processing Secure Payment</h3>
            <p className="text-xs text-muted-foreground">
              {method === 'mpesa'
                ? `Please check your phone (${phone}) for the M-Pesa PIN prompt...`
                : 'Securing transaction with bank gateway...'}
            </p>
          </div>
        ) : step === 'success' ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-success-bg text-success rounded-full flex items-center justify-center mx-auto">
              <Check size={24} />
            </div>
            <h3 className="font-bold text-foreground">Subscription Activated</h3>
            {receiptNumber && (
              <p className="text-xs font-mono font-bold text-primary bg-primary/10 py-1 px-2.5 rounded-full inline-block">
                Receipt: {receiptNumber}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Your {plan.name} plan is now active. Instant WhatsApp alerts and BOQ exports are ready.
            </p>
            <button onClick={onClose} className="btn-primary w-full justify-center text-sm py-2">
              Go to Bidding Dashboard
            </button>
          </div>
        ) : (
          <>
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-bold text-foreground text-sm">Subscribe to {plan.name}</h3>
                <p className="text-xs text-muted-foreground font-tabular">KES {plan.price.toLocaleString()}/month</p>
              </div>
              <button onClick={onClose} className="p-1 rounded-md text-muted-foreground hover:bg-muted">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex rounded-lg border border-border bg-muted p-1 gap-1">
                <button
                  onClick={() => setMethod('mpesa')}
                  className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${method === 'mpesa' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
                >
                  M-Pesa STK Push
                </button>
                <button
                  onClick={() => setMethod('card')}
                  className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${method === 'card' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
                >
                  Debit / Credit Card
                </button>
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
                      className="input-base"
                    />
                  </div>
                  <div className="bg-success-bg border border-success/20 rounded-lg p-3 text-xs text-success">
                    You will receive an M-Pesa prompt on your phone to complete KES {plan.price.toLocaleString()}.
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
                      className="input-base font-tabular"
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
                        className="input-base font-tabular"
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
                        className="input-base font-tabular"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-muted rounded-xl p-3 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{plan.name}</span>
                  <span className="font-tabular font-bold">KES {plan.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">14-day free trial discount</span>
                  <span className="text-success font-semibold">−KES {plan.price.toLocaleString()}</span>
                </div>
                <div className="border-t border-border pt-1.5 flex justify-between text-sm font-bold">
                  <span>Due today</span>
                  <span className="font-tabular text-primary">KES 0</span>
                </div>
              </div>

              <button onClick={handlePay} className="btn-primary w-full justify-center text-sm py-2.5">
                Start 14-Day Free Trial
              </button>

              <p className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                <Lock size={11} />
                Secured via Kenya Data Protection Act 2019 · Cancel anytime
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
    return billing === 'annual' ? Math.round(plan.price * 10) : plan.price;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold mb-4">
          <Zap size={12} />
          Procurement Intelligence Plans
        </span>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-3">
          Find the right tenders.<br />Win more profitable contracts.
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-base">
          Start free with full nationwide tender discovery. Upgrade for proactive WhatsApp alerts, BOQ exports, and competitive bidding intelligence.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center gap-3 mt-6 bg-muted rounded-xl p-1">
          <button
            onClick={() => setBilling('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${billing === 'monthly' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('annual')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${billing === 'annual' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
          >
            Annual
            <span className="ml-1.5 px-1.5 py-0.5 rounded text-xs bg-success text-white">2 Months Free</span>
          </button>
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
        {plans.map(plan => (
          <div
            key={plan.id}
            className={`relative rounded-2xl border flex flex-col ${
              plan.highlighted
                ? 'border-primary bg-primary shadow-elevated'
                : 'border-border bg-card'
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-white text-xs font-bold shadow-sm">
                  <Star size={10} />
                  {plan.badge}
                </span>
              </div>
            )}

            <div className="p-6 flex-1">
              <h3 className={`text-base font-bold mb-1 ${plan.highlighted ? 'text-white' : 'text-foreground'}`}>
                {plan.name}
              </h3>
              <p className={`text-xs mb-4 ${plan.highlighted ? 'text-white/70' : 'text-muted-foreground'}`}>
                {plan.description}
              </p>

              <div className="mb-5">
                {plan.price === 0 ? (
                  <span className={`text-3xl font-extrabold font-tabular ${plan.highlighted ? 'text-white' : 'text-foreground'}`}>
                    Free
                  </span>
                ) : (
                  <div>
                    <span className={`text-3xl font-extrabold font-tabular ${plan.highlighted ? 'text-white' : 'text-foreground'}`}>
                      KES {getPrice(plan).toLocaleString()}
                    </span>
                    <span className={`text-sm ml-1 ${plan.highlighted ? 'text-white/70' : 'text-muted-foreground'}`}>
                      /{billing === 'annual' ? 'year' : 'month'}
                    </span>
                  </div>
                )}
              </div>

              <ul className="space-y-2.5">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={14} className={`shrink-0 mt-0.5 ${plan.highlighted ? 'text-white' : 'text-success'}`} />
                    <span className={`text-xs ${plan.highlighted ? 'text-white/90' : 'text-foreground/80'}`}>{f}</span>
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
                className={`w-full justify-center flex items-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  plan.highlighted
                    ? 'bg-white text-primary hover:bg-white/90'
                    : 'btn-primary'
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
                <th className="text-center py-3 px-4 font-bold text-primary w-40">Pro (4,999/mo)</th>
                <th className="text-center py-3 pl-4 font-bold text-foreground w-48">Enterprise (17,999/mo)</th>
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
        <CheckoutModal plan={checkoutPlan} onClose={() => setCheckoutPlan(null)} />
      )}
    </div>
  );
}
