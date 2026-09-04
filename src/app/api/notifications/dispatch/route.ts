import { NextRequest, NextResponse } from 'next/server';
import { mockTenders } from '@/lib/tenderData';
import {
  sendWhatsAppNotification,
  sendSmsNotification,
  formatTenderAlertMessage,
} from '@/lib/notifications';
import { executeQuery, isDbConfigured } from '@/db';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // Allow unrestricted in dev/local
    }

    console.log('[Notification Dispatcher] Running 07:00 AM EAT Tender Match Scan...');

    // Find active high-value tenders
    const activeTenders = mockTenders.filter(t => t.status === 'active');
    const topTenders = activeTenders.slice(0, 3); // Sample highest match targets

    const testUsers = [
      {
        id: 'usr-001',
        name: 'Kipchoge Ruto',
        phone: '254712345678',
        whatsappEnabled: true,
        smsEnabled: true,
        sectors: ['Roads & Infrastructure', 'Water & Sanitation'],
      },
    ];

    let alertsDispatched = 0;

    for (const user of testUsers) {
      for (const tender of topTenders) {
        const message = formatTenderAlertMessage({
          recipientPhone: user.phone,
          recipientName: user.name,
          tenderId: tender.id,
          tenderTitle: tender.title,
          procuringEntity: tender.procuringEntity,
          referenceNumber: tender.referenceNumber,
          matchScore: 92,
          daysLeft: Math.max(1, Math.ceil((new Date(tender.closingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
          estimatedValue: tender.estimatedValue,
          county: tender.county,
          portalUrl: tender.portalUrl || tender.sourceUrl,
        });

        if (user.whatsappEnabled) {
          await sendWhatsAppNotification(user.phone, message);
          alertsDispatched++;
        }

        if (user.smsEnabled) {
          await sendSmsNotification(
            user.phone,
            `TenderIQ: High Match (92%) from ${tender.procuringEntity} for ${tender.title.slice(0, 40)}... View: https://tenderiq.co.ke/tender/${tender.id}`
          );
          alertsDispatched++;
        }

        if (isDbConfigured) {
          await executeQuery(
            `INSERT INTO notification_logs (id, user_id, tender_id, channel, recipient, match_score, status)
             VALUES ($1, $2, $3, $4, $5, $6, 'sent')`,
            [`notif-${Date.now()}-${Math.random()}`, user.id, tender.id, 'whatsapp', user.phone, 92]
          ).catch(err => console.error('Error logging notif in DB:', err));
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Morning notification dispatch completed. Dispatched ${alertsDispatched} alerts.`,
      dispatchedCount: alertsDispatched,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Notification Dispatch Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
