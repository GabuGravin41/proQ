'use client';
import React, { useState } from 'react';
import { Tender } from '@/lib/tenderData';
import TenderMatchScore from './TenderMatchScore';
import TenderDocuments from './TenderDocuments';
import TenderTimeline from './TenderTimeline';
import PreBidRequirementsCard from './PreBidRequirementsCard';
import ComplianceChecklist from './ComplianceChecklist';
import {
  FileText, List, ChevronDown, ChevronUp, Download, Sparkles,
  Layers, FileSpreadsheet, Calendar, ShieldCheck, ExternalLink,
  MapPin, Clock, Building2, Check
} from 'lucide-react';
import { toast } from 'sonner';

interface TenderDetailMainProps {
  tender: Tender;
}

// Category-specific BOQ generator with strict category matching
function getBoqItemsForTender(tender: Tender) {
  const cat = tender.category.toLowerCase();
  const title = tender.title.toLowerCase();

  // 1. Food & Catering Supplies
  if (cat.includes('food') || title.includes('maize') || title.includes('rice') || title.includes('foodstuff')) {
    return [
      { id: 'boq-001', item: 'Grade 1 Dry White Maize (Moisture < 13.5%, sorted)', qty: 500, unit: '90kg Bags', unitRate: 'KES 3,800' },
      { id: 'boq-002', item: 'Grade A Pishori Long Grain Pure Rice', qty: 350, unit: '50kg Bags', unitRate: 'KES 7,200' },
      { id: 'boq-003', item: 'Refined Fortified Vegetable Cooking Oil', qty: 150, unit: '20L Jerrycans', unitRate: 'KES 5,400' },
      { id: 'boq-004', item: 'Grade A Wairimu Dry Beans (Sorted & Cleaned)', qty: 250, unit: '90kg Bags', unitRate: 'KES 11,500' },
      { id: 'boq-005', item: 'Pure Granulated White Cane Sugar (KEBS Certified)', qty: 200, unit: '50kg Bags', unitRate: 'KES 6,800' },
      { id: 'boq-006', item: 'Fortified Bakers Grade Wheat Flour', qty: 180, unit: '50kg Bags', unitRate: 'KES 4,200' },
    ];
  }

  // 2. Textiles & Uniforms
  if (cat.includes('textile') || cat.includes('apparel') || title.includes('uniform')) {
    return [
      { id: 'boq-001', item: 'Navy Blue Polyester-Wool Tailored Skirts / Trousers', qty: 1800, unit: 'Pairs', unitRate: 'KES 1,850' },
      { id: 'boq-002', item: 'Official School Blazer Jacket with Embroidered Crest', qty: 900, unit: 'Pieces', unitRate: 'KES 3,400' },
      { id: 'boq-003', item: 'Heavy-Duty Sports Tracksuit with Full-Zip Jacket', qty: 900, unit: 'Sets', unitRate: 'KES 2,600' },
      { id: 'boq-004', item: 'High-Density 4-Inch Foam Student Mattress (3x6 ft)', qty: 450, unit: 'Pieces', unitRate: 'KES 3,800' },
      { id: 'boq-005', item: 'Short-Sleeved Cotton White Shirts (Polyester-Cotton)', qty: 2400, unit: 'Pieces', unitRate: 'KES 950' },
    ];
  }

  // 3. Cleaning & Janitorial Services
  if (cat.includes('cleaning') || cat.includes('janitorial') || title.includes('sanitation')) {
    return [
      { id: 'boq-001', item: 'Commercial Walk-Behind Rotary Floor Scrubber & Polisher', qty: 8, unit: 'Machines', unitRate: 'KES 380,000' },
      { id: 'boq-002', item: 'Concentrated Hospital-Grade Liquid Disinfectant', qty: 400, unit: '20L Containers', unitRate: 'KES 3,600' },
      { id: 'boq-003', item: 'Heavy-Duty Industrial Gauge Trash Liners (100L Black)', qty: 2500, unit: 'Rolls', unitRate: 'KES 850' },
      { id: 'boq-004', item: 'Touchless Foot-Pedal Sanitary Disposal Bins with Liners', qty: 120, unit: 'Units', unitRate: 'KES 6,200' },
      { id: 'boq-005', item: 'Mechanized High-Level Window Cleaning Rig & Telescopic Poles', qty: 4, unit: 'Systems', unitRate: 'KES 145,000' },
    ];
  }

  // 4. Consultancy & Advisory
  if (cat.includes('consultancy') || cat.includes('advisory') || title.includes('actuarial') || title.includes('proposal')) {
    return [
      { id: 'boq-001', item: 'Lead Actuary & Senior Healthcare Risk Modeler', qty: 240, unit: 'Consulting Hours', unitRate: 'KES 28,000' },
      { id: 'boq-002', item: 'Data Analytics & Claims Utilization Specialist', qty: 320, unit: 'Consulting Hours', unitRate: 'KES 18,500' },
      { id: 'boq-003', item: 'Actuarial Valuation & Healthcare Fund Solvency Report', qty: 1, unit: 'Deliverable', unitRate: 'KES 4,500,000' },
      { id: 'boq-004', item: 'Stakeholder Workshop, Benefit Re-design & Policy Advisory', qty: 4, unit: 'Sessions', unitRate: 'KES 450,000' },
    ];
  }

  // 5. Water, Solar & Boreholes
  if (cat.includes('water') || cat.includes('solar') || title.includes('borehole') || title.includes('pump') || title.includes('irrigation')) {
    return [
      { id: 'boq-001', item: 'Deep Well Hydrogeological Geophysical Survey & Report', qty: 1, unit: 'Site Survey', unitRate: 'KES 280,000' },
      { id: 'boq-002', item: 'Borehole Mud-Rotary Drilling to 250m Depth (8-Inch Diameter)', qty: 250, unit: 'Linear Metres', unitRate: 'KES 8,500' },
      { id: 'boq-003', item: 'High-Efficiency Helical Rotor Solar Submersible Pump (15kW)', qty: 1, unit: 'Complete Unit', unitRate: 'KES 1,250,000' },
      { id: 'boq-004', item: 'Monocrystalline Solar PV Modules (550W Tier 1) & Mounting Rig', qty: 36, unit: 'Panels', unitRate: 'KES 24,000' },
      { id: 'boq-005', item: '100,000L Elevated Cylindrical Pressed Steel Water Storage Tank', qty: 1, unit: 'Complete Tank', unitRate: 'KES 3,800,000' },
      { id: 'boq-006', item: 'HDPE PN16 Distribution Piping (90mm OD) & Trench Excavation', qty: 4200, unit: 'Metres', unitRate: 'KES 980' },
    ];
  }

  // 6. Roads & Civil Infrastructure
  if (cat.includes('road') || cat.includes('infrastructure') || cat.includes('construction') || title.includes('asphalt') || title.includes('paving') || title.includes('highway')) {
    return [
      { id: 'boq-001', item: 'Site Clearance, Topsoil Stripping & Bush Removal (depth 200mm)', qty: 18500, unit: 'Square Metres', unitRate: 'KES 140' },
      { id: 'boq-002', item: 'Heavy Earthworks Excavation in Normal Material to Spoil', qty: 12400, unit: 'Cubic Metres', unitRate: 'KES 480' },
      { id: 'boq-003', item: 'Dense Bituminous Macadam (DBM) Base Course Layer (100mm)', qty: 3800, unit: 'Cubic Metres', unitRate: 'KES 18,500' },
      { id: 'boq-004', item: 'Asphalt Concrete Wearing Course (AC Type 1 - 50mm thick)', qty: 24000, unit: 'Square Metres', unitRate: 'KES 1,450' },
      { id: 'boq-005', item: 'Precast Concrete Class 25/20 Kerbs & Side Drainage Channels', qty: 6200, unit: 'Linear Metres', unitRate: 'KES 2,200' },
      { id: 'boq-006', item: 'Thermoplastic Retroreflective Road Marking & Road Furniture', qty: 1, unit: 'Lump Sum', unitRate: 'KES 2,800,000' },
    ];
  }

  // 7. Medical & Surgical Supplies
  if (cat.includes('medical') || cat.includes('health') || cat.includes('hospital') || title.includes('pharmaceutical') || title.includes('surgical')) {
    return [
      { id: 'boq-001', item: 'Digital Multi-Parameter ICU Patient Monitor (ECG, SpO2, NIBP)', qty: 12, unit: 'Units', unitRate: 'KES 480,000' },
      { id: 'boq-002', item: 'Sterile Disposable Surgical Gloves (Latex-Free Powdered)', qty: 500, unit: 'Boxes of 100', unitRate: 'KES 2,400' },
      { id: 'boq-003', item: 'Heavy-Duty Electric Multi-Position Hydraulic Operating Table', qty: 2, unit: 'Units', unitRate: 'KES 2,900,000' },
      { id: 'boq-004', item: 'Anaesthesia Workstation with Integrated Ventilator & Vaporizer', qty: 2, unit: 'Workstations', unitRate: 'KES 4,800,000' },
      { id: 'boq-005', item: 'High-Volume Medical Oxygen Cylinders (F-Type 6.8m3 Filled)', qty: 80, unit: 'Cylinders', unitRate: 'KES 38,000' },
    ];
  }

  // Default: Enterprise ICT / Equipment
  return [
    { id: 'boq-001', item: 'Enterprise Rack-Mount Server (32-Core, 128GB RAM, 8TB NVMe)', qty: 4, unit: 'Units', unitRate: 'KES 980,000' },
    { id: 'boq-002', item: 'Managed 48-Port Gigabit PoE+ Core Network Switch (Layer 3)', qty: 6, unit: 'Switches', unitRate: 'KES 320,000' },
    { id: 'boq-003', item: 'High-Definition Dome IP Surveillance Camera (4K Night Vision)', qty: 32, unit: 'Units', unitRate: 'KES 38,000' },
    { id: 'boq-004', item: 'Cat6A F/UTP Low-Smoke Zero-Halogen Structured Cabling (305m)', qty: 24, unit: 'Boxes', unitRate: 'KES 19,500' },
    { id: 'boq-005', item: 'Online Double-Conversion 20kVA Modular Smart UPS System', qty: 1, unit: 'System', unitRate: 'KES 1,850,000' },
  ];
}

export default function TenderDetailMain({ tender }: TenderDetailMainProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'boq' | 'documents' | 'timeline' | 'compliance'>('overview');
  const boqItems = getBoqItemsForTender(tender);

  const handleExportBoq = () => {
    const csvHeader = 'Item ID,Description / Specification,Quantity,Unit of Measure,Benchmark Unit Rate\n';
    const csvRows = boqItems.map(b => `"${b.id}","${b.item}",${b.qty},"${b.unit}","${b.unitRate}"`).join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TenQ_BOQ_${tender.referenceNumber.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Bill of Quantities (BOQ) exported to CSV!');
  };

  return (
    <div className="space-y-6">
      {/* Subtle Underlined Horizontal Tabs */}
      <div className="flex border-b border-border gap-6 overflow-x-auto scrollbar-none px-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 py-3 text-xs font-bold transition-all shrink-0 border-b-2 -mb-px ${
            activeTab === 'overview'
              ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
          }`}
        >
          <Layers size={14} />
          1. Scope & Financials
        </button>

        <button
          onClick={() => setActiveTab('boq')}
          className={`flex items-center gap-2 py-3 text-xs font-bold transition-all shrink-0 border-b-2 -mb-px ${
            activeTab === 'boq'
              ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
          }`}
        >
          <FileSpreadsheet size={14} />
          2. Bill of Quantities ({boqItems.length})
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 py-3 text-xs font-bold transition-all shrink-0 border-b-2 -mb-px ${
            activeTab === 'documents'
              ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
          }`}
        >
          <FileText size={14} />
          3. Documents & Portals
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-2 py-3 text-xs font-bold transition-all shrink-0 border-b-2 -mb-px ${
            activeTab === 'timeline'
              ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
          }`}
        >
          <Calendar size={14} />
          4. Procurement Milestones
        </button>

        <button
          onClick={() => setActiveTab('compliance')}
          className={`flex items-center gap-2 py-3 text-xs font-bold transition-all shrink-0 border-b-2 -mb-px ${
            activeTab === 'compliance'
              ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
          }`}
        >
          <ShieldCheck size={14} />
          5. Pre-Bid Checklist
        </button>
      </div>

      {/* Tab 1: Overview & Scope */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Pre-Bid Financials & Statutory Card */}
          <PreBidRequirementsCard tender={tender} />

          {/* Scope of Work */}
          <div className="card p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              Scope of Procurement & Technical Objectives
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed">
              The <strong>{tender.procuringEntity}</strong> invites sealed competitive bids from eligible and qualified contractors/suppliers for the{' '}
              <strong>{tender.title}</strong> under tender reference <strong>{tender.referenceNumber}</strong>.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Bidding will be conducted in strict accordance with the Public Procurement and Asset Disposal Act (PPADA 2015) and Public Procurement Regulations 2020.
              Interested bidders must download the standard tender documents and ensure compliance with all statutory and preliminary requirements.
            </p>
          </div>

          {/* AI Match Fit Summary */}
          <TenderMatchScore tender={tender} />
        </div>
      )}

      {/* Tab 2: Bill of Quantities (BOQ) */}
      {activeTab === 'boq' && (
        <div className="space-y-4 animate-fade-in">
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-border">
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <FileSpreadsheet size={18} className="text-primary" />
                  Pre-Extracted Bill of Quantities (BOQ) Schedule
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Structured line-item quantities for estimating and pricing takeoff.
                </p>
              </div>
              <button onClick={handleExportBoq} className="btn-primary text-xs shrink-0 self-start sm:self-auto">
                <Download size={14} /> Export BOQ (CSV / Excel)
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                    <th className="text-left py-2.5 px-3 font-semibold w-16">Item #</th>
                    <th className="text-left py-2.5 px-3 font-semibold">Description / Specification</th>
                    <th className="text-right py-2.5 px-3 font-semibold w-24">Est. Qty</th>
                    <th className="text-left py-2.5 px-3 font-semibold w-28">Unit</th>
                    <th className="text-right py-2.5 px-3 font-semibold w-32">Market Benchmark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {boqItems.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-3 font-mono text-muted-foreground">{idx + 1}</td>
                      <td className="py-3 px-3 font-medium text-foreground">{item.item}</td>
                      <td className="py-3 px-3 text-right font-bold font-tabular text-primary">{item.qty.toLocaleString()}</td>
                      <td className="py-3 px-3 text-muted-foreground">{item.unit}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-foreground">{item.unitRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Documents & Links */}
      {activeTab === 'documents' && (
        <div className="animate-fade-in">
          <TenderDocuments tender={tender} />
        </div>
      )}

      {/* Tab 4: Procurement Timeline */}
      {activeTab === 'timeline' && (
        <div className="animate-fade-in">
          <TenderTimeline tender={tender} />
        </div>
      )}

      {/* Tab 5: Pre-Bid Compliance Checklist */}
      {activeTab === 'compliance' && (
        <div className="animate-fade-in">
          <ComplianceChecklist tender={tender} />
        </div>
      )}
    </div>
  );
}
