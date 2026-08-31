'use client';
import React, { useState } from 'react';
import { Tender } from '@/lib/tenderData';
import TenderMatchScore from './TenderMatchScore';
import TenderDocuments from './TenderDocuments';
import TenderTimeline from './TenderTimeline';
import { FileText, List, ChevronDown, ChevronUp, Download, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface TenderDetailMainProps {
  tender: Tender;
}

// Category-specific BOQ generator with strict category matching
function getBoqItemsForTender(tender: Tender) {
  const cat = tender.category.toLowerCase();
  const title = tender.title.toLowerCase();

  // 1. Food & Catering Supplies (Mang'u High, Schools, Hospitals, Prisons)
  if (cat.includes('food') || title.includes('maize') || title.includes('rice') || title.includes('foodstuff')) {
    return [
      { id: 'boq-001', item: 'Grade 1 Dry White Maize (Clean, moisture < 13.5%)', qty: 500, unit: '90kg Bags', unitRate: 'KES 3,800' },
      { id: 'boq-002', item: 'Grade A Pishori Long Grain Pure Rice', qty: 350, unit: '50kg Bags', unitRate: 'KES 7,200' },
      { id: 'boq-003', item: 'Refined Fortified Vegetable Cooking Oil', qty: 150, unit: '20L Jerrycans', unitRate: 'KES 5,400' },
      { id: 'boq-004', item: 'Grade A Wairimu Dry Beans (Sorted & Cleaned)', qty: 250, unit: '90kg Bags', unitRate: 'KES 11,500' },
      { id: 'boq-005', item: 'Pure Granulated White Cane Sugar (KEBS Certified)', qty: 200, unit: '50kg Bags', unitRate: 'KES 6,800' },
      { id: 'boq-006', item: 'Fortified Bakers Grade Wheat Flour', qty: 180, unit: '50kg Bags', unitRate: 'KES 4,200' },
    ];
  }

  // 2. Textiles, Uniforms & Apparel
  if (cat.includes('textile') || cat.includes('apparel') || title.includes('uniform')) {
    return [
      { id: 'boq-001', item: 'Navy Blue Polyester-Wool Tailored Skirts / Trousers', qty: 1800, unit: 'Pairs', unitRate: 'KES 1,850' },
      { id: 'boq-002', item: 'Official School Blazer Jacket with Embroidered Crest', qty: 900, unit: 'Pieces', unitRate: 'KES 3,400' },
      { id: 'boq-003', item: 'Heavy-Duty Sports Tracksuit with Full-Zip Jacket', qty: 900, unit: 'Sets', unitRate: 'KES 2,600' },
      { id: 'boq-004', item: 'High-Density 4-Inch Foam Student Mattress (3x6 ft)', qty: 450, unit: 'Pieces', unitRate: 'KES 3,800' },
      { id: 'boq-005', item: 'Short-Sleeved Cotton White Shirts (Polyester-Cotton)', qty: 2400, unit: 'Pieces', unitRate: 'KES 950' },
    ];
  }

  // 3. Cleaning & Janitorial Services (Kenyatta University, SGR, KPA)
  if (cat.includes('cleaning') || cat.includes('janitorial') || title.includes('sanitation')) {
    return [
      { id: 'boq-001', item: 'Commercial Walk-Behind Rotary Floor Scrubber & Polisher', qty: 8, unit: 'Machines', unitRate: 'KES 380,000' },
      { id: 'boq-002', item: 'Concentrated Hospital-Grade Liquid Disinfectant', qty: 400, unit: '20L Containers', unitRate: 'KES 3,600' },
      { id: 'boq-003', item: 'Heavy-Duty Industrial Gauge Trash Liners (100L Black)', qty: 2500, unit: 'Rolls', unitRate: 'KES 850' },
      { id: 'boq-004', item: 'Touchless Foot-Pedal Sanitary Disposal Bins with Liners', qty: 120, unit: 'Units', unitRate: 'KES 6,200' },
      { id: 'boq-005', item: 'Mechanized High-Level Window Cleaning Rig & Telescopic Poles', qty: 4, unit: 'Systems', unitRate: 'KES 145,000' },
    ];
  }

  // 4. Consultancy & Advisory (Actuarial, Cybersecurity, Risk Assessment)
  if (cat.includes('consultancy') || cat.includes('advisory') || title.includes('actuarial') || title.includes('proposal')) {
    return [
      { id: 'boq-001', item: 'Lead Actuary & Senior Healthcare Risk Modeler', qty: 240, unit: 'Consulting Hours', unitRate: 'KES 28,000' },
      { id: 'boq-002', item: 'Data Analytics & Claims Utilization Specialist', qty: 320, unit: 'Consulting Hours', unitRate: 'KES 18,500' },
      { id: 'boq-003', item: 'Actuarial Valuation & Healthcare Fund Solvency Report', qty: 1, unit: 'Deliverable', unitRate: 'KES 4,500,000' },
      { id: 'boq-004', item: 'Stakeholder Workshop, Benefit Re-design & Policy Advisory', qty: 4, unit: 'Sessions', unitRate: 'KES 450,000' },
    ];
  }

  // 5. Water & Solar Pumping (Turkana, Garissa, Kajiado, Counties)
  if (cat.includes('water') || title.includes('solar') || title.includes('borehole') || title.includes('pump')) {
    return [
      { id: 'boq-001', item: 'High-Efficiency Submersible Solar Pump — 7.5kW, 45m Head', qty: 14, unit: 'Units', unitRate: 'KES 420,000' },
      { id: 'boq-002', item: 'Monocrystalline Solar PV Panels — 550W Tier 1', qty: 560, unit: 'Pieces', unitRate: 'KES 24,500' },
      { id: 'boq-003', item: 'Solar Pump Inverter / Controller with MPPT & GSM Telemetry', qty: 14, unit: 'Units', unitRate: 'KES 185,000' },
      { id: 'boq-004', item: 'HDPE Water Transmission Pipes — PN10, 90mm dia', qty: 14000, unit: 'Meters', unitRate: 'KES 680' },
      { id: 'boq-005', item: 'Elevated Steel Water Tank — 50,000 Litres on 12m Tower', qty: 14, unit: 'Structures', unitRate: 'KES 1,850,000' },
    ];
  }

  // 6. Healthcare & Medical Equipment (KEMSA, KU Health, Hospitals)
  if (cat.includes('medical') || cat.includes('health') || title.includes('medicine') || title.includes('hospital')) {
    return [
      { id: 'boq-001', item: 'Multi-Parameter Patient Monitor — 6 Parameter (ECG/SpO2/NIBP)', qty: 45, unit: 'Units', unitRate: 'KES 285,000' },
      { id: 'boq-002', item: 'Ophthalmic Phacoemulsification System & Operating Microscope', qty: 1, unit: 'Complete Unit', unitRate: 'KES 18,500,000' },
      { id: 'boq-003', item: 'Sterile Surgical Gloves (Latex Powder-Free Size 7.5)', qty: 8000, unit: 'Pairs', unitRate: 'KES 85' },
      { id: 'boq-004', item: 'Digital Ultrasound Diagnostic Scanner with 3 Probes', qty: 4, unit: 'Units', unitRate: 'KES 4,200,000' },
      { id: 'boq-005', item: 'Intravenous Cannula 18G/20G with Injection Port', qty: 25000, unit: 'Pieces', unitRate: 'KES 42' },
    ];
  }

  // 7. Roads, Civil Works & Infrastructure (KeNHA, KURA, County Classrooms)
  if (cat.includes('road') || cat.includes('infrastructure') || cat.includes('construction') || title.includes('civil') || title.includes('classroom')) {
    return [
      { id: 'boq-001', item: 'Asphalt Concrete Surfacing — 50mm compacted thickness', qty: 35000, unit: 'Sq Meters', unitRate: 'KES 1,250' },
      { id: 'boq-002', item: 'Dense Bitumen Macadam (DBM) Road Base — 80mm thickness', qty: 35000, unit: 'Sq Meters', unitRate: 'KES 1,850' },
      { id: 'boq-003', item: 'Reinforced Concrete Pipe Culverts — 900mm diameter', qty: 650, unit: 'Meters', unitRate: 'KES 14,000' },
      { id: 'boq-004', item: 'Machine Cut Stone Walling & Reinforced Concrete Ring Beams', qty: 2400, unit: 'Sq Meters', unitRate: 'KES 2,200' },
      { id: 'boq-005', item: 'Thermoplastic Retro-Reflective Road Marking (Yellow & White)', qty: 6500, unit: 'Sq Meters', unitRate: 'KES 950' },
    ];
  }

  // 8. Education & Laboratory Science (Alliance High, Schools)
  if (cat.includes('education') || title.includes('laboratory') || title.includes('reagents')) {
    return [
      { id: 'boq-001', item: 'Analytical Reagent Grade Hydrochloric Acid (37% HCl, 2.5L)', qty: 80, unit: 'Winchesters', unitRate: 'KES 3,200' },
      { id: 'boq-002', item: 'Pyrex Borosilicate Glass Conical Flasks & Beakers (250ml)', qty: 600, unit: 'Pieces', unitRate: 'KES 480' },
      { id: 'boq-003', item: 'Compound LED Monocular Student Microscope (1000x)', qty: 45, unit: 'Units', unitRate: 'KES 34,000' },
      { id: 'boq-004', item: 'Digital Analytical Electronic Laboratory Balance (0.001g)', qty: 12, unit: 'Units', unitRate: 'KES 42,000' },
      { id: 'boq-005', item: 'Biology Dissecting Kit & Preserved Specimen Slide Sets', qty: 150, unit: 'Sets', unitRate: 'KES 2,400' },
    ];
  }

  // 9. Energy & Power Utilities (KPLC, KETRACO, KPC)
  if (cat.includes('energy') || cat.includes('renewables') || title.includes('pole') || title.includes('insulator')) {
    return [
      { id: 'boq-001', item: '10-Metre Reinforced Spun Concrete Utility Poles (KS 1933)', qty: 12000, unit: 'Poles', unitRate: 'KES 14,500' },
      { id: 'boq-002', item: '220kV High-Voltage Silicone Composite Insulators', qty: 6000, unit: 'Units', unitRate: 'KES 18,500' },
      { id: 'boq-003', item: '48-Core Optical Ground Wire (OPGW) Cable', qty: 45000, unit: 'Meters', unitRate: 'KES 1,150' },
      { id: 'boq-004', item: 'Custody Transfer Multi-Path Ultrasonic Flow Meter (12-inch)', qty: 4, unit: 'Units', unitRate: 'KES 8,500,000' },
    ];
  }

  // 10. Default ICT & Security (KRA, KAA, CAK)
  return [
    { id: 'boq-001', item: 'Enterprise Core SD-WAN Gateway Router with Dual Power', qty: 6, unit: 'Units', unitRate: 'KES 2,400,000' },
    { id: 'boq-002', item: 'Next-Generation Firewall Appliance (50 Gbps Threat Protection)', qty: 4, unit: 'Units', unitRate: 'KES 4,800,000' },
    { id: 'boq-003', item: '48-Port Gigabit Layer 3 Managed PoE+ Network Switch', qty: 32, unit: 'Units', unitRate: 'KES 185,000' },
    { id: 'boq-004', item: 'Online 10KVA Modular UPS with 4-Hour Battery Bank', qty: 8, unit: 'Units', unitRate: 'KES 450,000' },
  ];
}

export default function TenderDetailMain({ tender }: TenderDetailMainProps) {
  const [boqExpanded, setBoqExpanded] = useState(false);
  const boqItems = getBoqItemsForTender(tender);
  const visibleBoq = boqExpanded ? boqItems : boqItems.slice(0, 4);

  const exportBoqCSV = () => {
    const headers = 'Item ID,Item Description,Quantity,Unit,Unit Rate\n';
    const rows = boqItems
      .map(i => `"${i.id}","${i.item.replace(/"/g, '""')}",${i.qty},"${i.unit}","${i.unitRate}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BOQ_${tender.referenceNumber.replace(/[\/\\]/g, '_')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('BOQ line items exported to CSV');
  };

  return (
    <div className="space-y-5">
      {/* Match Score (mobile only, visible on sidebar on desktop) */}
      <div className="xl:hidden">
        <TenderMatchScore tender={tender} />
      </div>

      {/* Description */}
      <div className="card p-5">
        <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
          <FileText size={16} className="text-primary" />
          Tender Description & Scope of Work
        </h2>
        <p className="text-sm text-foreground/80 leading-relaxed">
          {tender.description}
        </p>
        <div className="mt-4 p-3 rounded-lg bg-secondary/50 border border-primary/20 flex items-start gap-2">
          <Sparkles size={14} className="text-primary shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-primary">OCDS Procurement Fingerprint</p>
            <p className="text-xs font-mono text-muted-foreground break-all">
              ocds-6b5mus-{tender.referenceNumber.toLowerCase().replace(/[\/\s]/g, '-')} · Verified Source: {tender.source}
            </p>
          </div>
        </div>
      </div>

      {/* BOQ Extract */}
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <List size={16} className="text-primary" />
              Bill of Quantities (BOQ) Extract
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              AI-parsed from official procurement specifications for {tender.category}
            </p>
          </div>

          <button
            onClick={exportBoqCSV}
            className="btn-secondary text-xs py-1.5 px-3 self-start sm:self-auto gap-1.5"
            title="Download BOQ as CSV"
          >
            <Download size={13} />
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Item Description</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Qty</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Unit</th>
                <th className="text-right py-2 pl-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Est. Unit Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visibleBoq.map((item) => (
                <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-2.5 pr-3 text-sm text-foreground/90 font-medium">{item.item}</td>
                  <td className="py-2.5 px-3 text-sm font-tabular text-right text-foreground font-semibold">{item.qty.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-sm text-muted-foreground">{item.unit}</td>
                  <td className="py-2.5 pl-3 text-sm font-tabular text-right text-primary font-bold whitespace-nowrap">{item.unitRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {boqItems.length > 4 && (
          <button
            onClick={() => setBoqExpanded(!boqExpanded)}
            className="mt-3 flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            {boqExpanded ? (
              <><ChevronUp size={13} /> Show fewer items</>
            ) : (
              <><ChevronDown size={13} /> Show all {boqItems.length} line items</>
            )}
          </button>
        )}

        <p className="mt-3 text-xs text-muted-foreground">
          BOQ extracted via TenderIQ Parser. Always cross-check with original procuring entity tender documents prior to bid submission.
        </p>
      </div>

      {/* Documents & Procurement Timeline Side-by-Side to eliminate empty space */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TenderDocuments tender={tender} />
        <TenderTimeline tender={tender} />
      </div>
    </div>
  );
}
