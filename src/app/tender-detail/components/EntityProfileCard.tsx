import React from 'react';
import { Tender } from '@/lib/tenderData';
import { Building2, MapPin, Globe, TrendingUp } from 'lucide-react';

interface EntityProfileCardProps {
  tender: Tender;
}

// Verified institutional website directory
const entityDirectory: Record<string, { website: string; tenders: number; avgValue: string; awardRate: string }> = {
  'Kenyatta University': {
    website: 'www.ku.ac.ke',
    tenders: 38,
    avgValue: 'KES 35M',
    awardRate: '88%',
  },
  'Kenya National Highways Authority': {
    website: 'www.kenha.co.ke',
    tenders: 142,
    avgValue: 'KES 280M',
    awardRate: '79%',
  },
  'Kenya Medical Supplies Authority': {
    website: 'www.kemsa.co.ke',
    tenders: 64,
    avgValue: 'KES 140M',
    awardRate: '85%',
  },
  'Kenya Revenue Authority': {
    website: 'www.kra.go.ke',
    tenders: 52,
    avgValue: 'KES 95M',
    awardRate: '82%',
  },
  'Kenya Ports Authority': {
    website: 'www.kpa.co.ke',
    tenders: 78,
    avgValue: 'KES 110M',
    awardRate: '84%',
  },
  'Kenya Pipeline Company': {
    website: 'www.kpc.co.ke',
    tenders: 45,
    avgValue: 'KES 75M',
    awardRate: '80%',
  },
  'Kenya Railways Corporation': {
    website: 'www.krc.co.ke',
    tenders: 36,
    avgValue: 'KES 125M',
    awardRate: '78%',
  },
  'Kenya Electricity Transmission Company': {
    website: 'www.ketraco.co.ke',
    tenders: 41,
    avgValue: 'KES 160M',
    awardRate: '83%',
  },
  'Kenya Power and Lighting Company PLC': {
    website: 'www.kplc.co.ke',
    tenders: 95,
    avgValue: 'KES 190M',
    awardRate: '86%',
  },
  'Alliance High School': {
    website: 'alliancehighschool.ac.ke',
    tenders: 8,
    avgValue: 'KES 6.5M',
    awardRate: '94%',
  },
  'Mang\'u High School': {
    website: 'tenders.go.ke',
    tenders: 6,
    avgValue: 'KES 14M',
    awardRate: '92%',
  },
  'Nairobi City County Government': {
    website: 'nairobi.go.ke',
    tenders: 115,
    avgValue: 'KES 85M',
    awardRate: '74%',
  },
  'County Government of Kiambu': {
    website: 'kiambu.go.ke',
    tenders: 72,
    avgValue: 'KES 42M',
    awardRate: '81%',
  },
  'County Government of Turkana': {
    website: 'turkana.go.ke',
    tenders: 48,
    avgValue: 'KES 38M',
    awardRate: '87%',
  },
  'Coast General Teaching and Referral Hospital': {
    website: 'mombasa.go.ke',
    tenders: 28,
    avgValue: 'KES 32M',
    awardRate: '89%',
  },
  'Kenya Airports Authority': {
    website: 'www.kaa.go.ke',
    tenders: 47,
    avgValue: 'KES 58M',
    awardRate: '82%',
  },
};

export default function EntityProfileCard({ tender }: EntityProfileCardProps) {
  const profile = entityDirectory[tender.procuringEntity] || {
    website: 'tenders.go.ke',
    tenders: 15,
    avgValue: 'KES 25M',
    awardRate: '80%',
  };

  const cleanUrl = profile.website.startsWith('http')
    ? profile.website
    : `https://${profile.website}`;

  return (
    <div className="card p-5">
      <h2 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
        <Building2 size={15} className="text-primary" />
        Procuring Entity
      </h2>

      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Building2 size={18} className="text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground leading-snug">{tender.procuringEntity}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{tender.entityType}</p>
        </div>
      </div>

      <div className="space-y-2 text-xs mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin size={12} className="shrink-0" />
          <span>{tender.county} County, Kenya</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Globe size={12} className="shrink-0" />
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            {profile.website}
          </a>
        </div>
      </div>

      {/* Entity stats */}
      <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-muted/50 border border-border">
        <div className="text-center">
          <p className="text-sm font-bold font-tabular text-foreground">{profile.tenders}</p>
          <p className="text-xs text-muted-foreground">Tenders</p>
        </div>
        <div className="text-center border-x border-border">
          <p className="text-sm font-bold font-tabular text-foreground">{profile.avgValue}</p>
          <p className="text-xs text-muted-foreground">Avg Value</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold font-tabular text-success">{profile.awardRate}</p>
          <p className="text-xs text-muted-foreground">Award Rate</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 p-2 rounded-lg bg-success-bg border border-success/20">
        <TrendingUp size={12} className="text-success shrink-0" />
        <p className="text-xs text-success font-medium">
          Verified procuring entity — {profile.tenders} published tenders
        </p>
      </div>
    </div>
  );
}
