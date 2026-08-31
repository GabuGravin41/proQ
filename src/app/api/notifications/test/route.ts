import { NextRequest, NextResponse } from 'next/server';
import {
  sendWhatsAppNotification,
  sendSmsNotification,
  formatTenderAlertMessage,
} from '@/lib/notifications';
import { mockTenders } from '@/lib/tenders';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, channel } = body;

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    const sampleTender = mockTenders[0]; // KeNHA Highway tender
    const message = formatTenderAlertMessage({
      recipientPhone: phone,
      recipientName: 'Valued Contractor',
      tenderId: sampleTender.id,
      tenderTitle: sampleTender.title,
      procuringEntity: sampleTender.procuringEntity,
      referenceNumber: sampleTender.referenceNumber,
      matchScore: 94,
      daysLeft: 28,
      estimatedValue: sampleTender.estimatedValue,
      county: sampleTender.county,
      portalUrl: sampleTender.portalUrl || sampleTender.sourceUrl,
    });

    let result;
    if (channel === 'sms') {
      result = await sendSmsNotification(phone, `TenderIQ Test: High Match (94%) from ${sampleTender.procuringEntity}. View: https://tenderiq.co.ke/tender/${sampleTender.id}`);
    } else {
      result = await sendWhatsAppNotification(phone, message);
    }

    return NextResponse.json({
      success: result.success,
      channel: channel || 'whatsapp',
      messageId: result.messageId,
      preview: message,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
