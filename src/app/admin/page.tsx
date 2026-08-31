'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  Activity, Server, Database, Bell, CheckCircle2, AlertTriangle,
  RefreshCw, Send, ShieldCheck, ArrowUpRight, Cpu, Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface IngestionSource {
  name: string;
  type: 'Central OCDS' | 'e-GP Crawler' | 'Direct Institution' | 'County Portal';
  url: string;
  status: 'healthy' | 'syncing' | 'degraded';
  lastSync: string;
  tendersCount: number;
  errorRate: string;
}

const ingestionSources: IngestionSource[] = [
  { name: 'PPIP OCDS Portal (tenders.go.ke)', type: 'Central OCDS', url: 'https://tenders.go.ke', status: 'healthy', lastSync: '12 min ago', tendersCount: 1420, errorRate: '0.0%' },
  { name: 'e-GP Kenya System (egpkenya.go.ke)', type: 'e-GP Crawler', url: 'https://egpkenya.go.ke', status: 'healthy', lastSync: '18 min ago', tendersCount: 980, errorRate: '0.2%' },
  { name: 'Alliance High School Procurement', type: 'Direct Institution', url: 'https://alliancehighschool.ac.ke', status: 'healthy', lastSync: '35 min ago', tendersCount: 14, errorRate: '0.0%' },
  { name: 'Kenya Airports Authority (KAA)', type: 'Direct Institution', url: 'https://kaa.go.ke', status: 'healthy', lastSync: '45 min ago', tendersCount: 47, errorRate: '0.0%' },
  { name: 'Nairobi City County Portal', type: 'County Portal', url: 'https://nairobi.go.ke', status: 'healthy', lastSync: '1 hour ago', tendersCount: 128, errorRate: '0.0%' },
  { name: 'Kiambu County Government', type: 'County Portal', url: 'https://kiambu.go.ke', status: 'healthy', lastSync: '1 hour ago', tendersCount: 95, errorRate: '0.0%' },
  { name: 'Turkana County Government', type: 'County Portal', url: 'https://turkana.go.ke', status: 'healthy', lastSync: '2 hours ago', tendersCount: 62, errorRate: '0.0%' },
];

const dispatchChannels = [
  { name: 'Telegram Bot Engine (@TenderIQBot)', status: 'Active', latency: '210ms', queued: 0, sentToday: 1420, successRate: '99.8%' },
  { name: 'WhatsApp Business API Gateway', status: 'Active', latency: '480ms', queued: 2, sentToday: 890, successRate: '99.4%' },
  { name: 'Resend Serverless Email (Morning Digest)', status: 'Active', latency: '320ms', queued: 0, sentToday: 3120, successRate: '100.0%' },
  { name: 'SMS Gateway (AfricasTalking)', status: 'Standby', latency: '590ms', queued: 0, sentToday: 145, successRate: '98.9%' },
];

export default function AdminDashboardPage() {
  const [syncing, setSyncing] = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const [purging, setPurging] = useState(false);

  const handleTriggerSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/cron/sync-tenders');
      const data = await res.json();
      setSyncing(false);
      toast.success(data.message || 'Scraper sync completed successfully');
    } catch (e) {
      setSyncing(false);
      toast.error('Sync failed');
    }
  };

  const handleLifecycleSync = async () => {
    setPurging(true);
    try {
      const res = await fetch('/api/cron/lifecycle-sync');
      const data = await res.json();
      setPurging(false);
      toast.success(data.message || '30-Day lifecycle sync completed');
    } catch (e) {
      setPurging(false);
      toast.error('Lifecycle sync failed');
    }
  };

  const handleTestDispatch = async () => {
    setDispatching(true);
    try {
      const res = await fetch('/api/notifications/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenderId: 'tender-004', mode: 'instant' }),
      });
      const data = await res.json();
      setDispatching(false);
      toast.success(data.message || 'Test notification dispatched');
    } catch (e) {
      setDispatching(false);
      toast.error('Dispatch failed');
    }
  };

  return (
    <AppLayout>
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={24} className="text-primary" />
              <h1 className="text-2xl font-extrabold text-foreground">Scraper & Radar Control Hub</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                System Admin
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Live crawler ingestion pipelines, Neon serverless pool health, and proactive notification queue.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleTriggerSync}
              disabled={syncing}
              className="btn-primary text-xs py-2 gap-2"
            >
              <RefreshCw size={13} className={syncing ? 'animate-spin' : ''} />
              {syncing ? 'Syncing...' : 'Trigger Ingestion'}
            </button>
            <button
              onClick={handleLifecycleSync}
              disabled={purging}
              className="btn-secondary text-xs py-2 gap-2 text-warning hover:border-warning/40"
            >
              <Clock size={13} className={purging ? 'animate-spin' : ''} />
              {purging ? 'Purging...' : 'Run 30-Day Purge'}
            </button>
            <button
              onClick={handleTestDispatch}
              disabled={dispatching}
              className="btn-secondary text-xs py-2 gap-2"
            >
              <Send size={13} className={dispatching ? 'animate-spin' : ''} />
              {dispatching ? 'Sending...' : 'Test Dispatch'}
            </button>
          </div>
        </div>

        {/* Global Pipeline Health Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Ingested Tenders', value: '4,218', sub: 'Across 7 active crawlers', icon: Database, color: 'text-primary', bg: 'bg-secondary' },
            { label: 'Neon Serverless Pool', value: 'Healthy (0.8s)', sub: 'Scale-to-zero active', icon: Cpu, color: 'text-success', bg: 'bg-success-bg' },
            { label: 'Dispatch Success Rate', value: '99.8%', sub: '5,575 alerts sent today', icon: Bell, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Ingestion Crawl Frequency', value: 'Every 6 Hours', sub: 'Vercel Serverless Cron', icon: Clock, color: 'text-accent', bg: 'bg-warning-bg' },
          ].map((metric, i) => {
            const { icon: Icon } = metric;
            return (
              <div key={i} className="card p-4 flex items-start gap-3">
                <div className={`p-2.5 rounded-xl ${metric.bg} shrink-0`}>
                  <Icon size={20} className={metric.color} />
                </div>
                <div>
                  <p className="section-label">{metric.label}</p>
                  <p className={`text-2xl font-black font-tabular mt-0.5 ${metric.color}`}>{metric.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{metric.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ingestion Pipelines Table */}
        <div className="card p-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Server size={16} className="text-primary" />
                Live Ingestion Crawlers
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Continuously scrapes PPIP, e-GP Kenya, county portals, and institutional noticeboards
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-success-bg text-success flex items-center gap-1">
              <CheckCircle2 size={12} /> All Crawlers Operational
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground uppercase font-semibold">
                  <th className="text-left py-2.5 pr-3">Crawler Source</th>
                  <th className="text-left py-2.5 px-3">Type</th>
                  <th className="text-left py-2.5 px-3">Status</th>
                  <th className="text-right py-2.5 px-3 font-tabular">Active Tenders</th>
                  <th className="text-left py-2.5 px-3">Last Sync</th>
                  <th className="text-right py-2.5 pl-3">Error Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ingestionSources.map((source, i) => (
                  <tr key={i} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 pr-3">
                      <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-primary flex items-center gap-1">
                        {source.name}
                        <ArrowUpRight size={12} className="text-muted-foreground" />
                      </a>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground font-medium">
                        {source.type}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-xs text-success font-medium">
                        <span className="w-2 h-2 rounded-full bg-success" />
                        Operational
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-tabular font-bold text-foreground">
                      {source.tendersCount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-xs text-muted-foreground">
                      {source.lastSync}
                    </td>
                    <td className="py-3 pl-3 text-right font-tabular text-xs text-muted-foreground">
                      {source.errorRate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dispatch Notification Channels */}
        <div className="card p-5">
          <div className="mb-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Bell size={16} className="text-primary" />
              Proactive Alert Dispatch Gateways
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Outbound alert delivery performance for $\ge 85\%$ Hot Fit notifications and daily 07:00 EAT morning digests
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dispatchChannels.map((ch, i) => (
              <div key={i} className="p-4 rounded-xl border border-border bg-muted/40 flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-foreground">{ch.name}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1.5">
                    <span>Latency: <strong className="text-foreground">{ch.latency}</strong></span>
                    <span>·</span>
                    <span>Sent Today: <strong className="text-foreground font-tabular">{ch.sentToday.toLocaleString()}</strong></span>
                    <span>·</span>
                    <span>Success: <strong className="text-success font-tabular">{ch.successRate}</strong></span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-success-bg text-success">
                  {ch.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
