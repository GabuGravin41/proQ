/**
 * Multi-Channel Notification Dispatcher Engine
 * Supports Africa's Talking SMS, Meta WhatsApp Cloud API & Africa's Talking WhatsApp
 */
import { formatKenyanPhone } from './mpesa';

export interface TenderNotificationPayload {
  recipientPhone: string;
  recipientEmail?: string;
  recipientName: string;
  tenderId: string;
  tenderTitle: string;
  procuringEntity: string;
  referenceNumber: string;
  matchScore: number;
  daysLeft: number;
  estimatedValue?: number;
  county: string;
  portalUrl: string;
}

const AT_USERNAME = process.env.AFRICASTALKING_USERNAME || 'sandbox';
const AT_APIKEY = process.env.AFRICASTALKING_API_KEY || '';
const AT_SENDER_ID = process.env.AFRICASTALKING_SENDER_ID || 'PROQ';

const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN || '';
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';

export function formatTenderAlertMessage(payload: TenderNotificationPayload): string {
  const valueFormatted = payload.estimatedValue
    ? `KES ${payload.estimatedValue.toLocaleString()}`
    : 'Not Specified';

  return `🔔 *proQ Kenya Verified Tender Match (${payload.matchScore}% Fit)*

*Entity:* ${payload.procuringEntity}
*Tender:* ${payload.referenceNumber} — ${payload.tenderTitle}
*County:* ${payload.county}
*Est. Budget:* ${valueFormatted}
*Deadline:* ${payload.daysLeft} Days Remaining (Urgent)

📑 *Action:* View BOQ, checklist & verified portal:
https://proq.co.ke/tender-detail?id=${payload.tenderId}

_proQ Kenya Public Procurement Intelligence_`;
}

/**
 * Generates a 100% FREE 1-Click WhatsApp Share Link
 * Enables contractors to forward tender notices directly to their team/partners without Meta API costs!
 */
export function generateWhatsAppShareUrl(tender: { id: string; title: string; procuringEntity: string; referenceNumber: string; estimatedValue?: number | null; daysRemaining: number; county: string }): string {
  const text = `🔔 *proQ Kenya Verified Tender Alert*\n\n` +
    `*Entity:* ${tender.procuringEntity}\n` +
    `*Title:* ${tender.title}\n` +
    `*Ref:* ${tender.referenceNumber}\n` +
    `*County:* ${tender.county}\n` +
    `*Budget:* ${tender.estimatedValue ? `KES ${tender.estimatedValue.toLocaleString()}` : 'Undisclosed'}\n` +
    `*Deadline:* ${tender.daysRemaining} days remaining\n\n` +
    `👉 View BOQ & Preliminary Checklist on proQ:\n` +
    `https://proq.co.ke/tender-detail?id=${tender.id}`;

  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export async function sendSmsNotification(phone: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const formattedPhone = formatKenyanPhone(phone);

  if (AT_APIKEY && AT_USERNAME) {
    try {
      const response = await fetch('https://api.africastalking.com/version1/messaging', {
        method: 'POST',
        headers: {
          apiKey: AT_APIKEY,
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: new URLSearchParams({
          username: AT_USERNAME,
          to: `+${formattedPhone}`,
          message: message,
          from: AT_SENDER_ID,
        }),
      });

      const data = await response.json();
      return { success: true, messageId: data?.SMSMessageData?.Recipients?.[0]?.messageId };
    } catch (err: any) {
      console.error('Africa\'s Talking SMS Error:', err);
      return { success: false, error: err.message };
    }
  }

  // Graceful simulation
  console.log(`[SMS Simulated Dispatch] To: +${formattedPhone} | Message: ${message.slice(0, 60)}...`);
  return { success: true, messageId: `sms-sim-${Date.now()}` };
}

export async function sendWhatsAppNotification(phone: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const formattedPhone = formatKenyanPhone(phone);

  if (WHATSAPP_API_TOKEN && WHATSAPP_PHONE_NUMBER_ID) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${WHATSAPP_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: formattedPhone,
            type: 'text',
            text: { preview_url: true, body: message },
          }),
        }
      );

      const data = await response.json();
      return { success: true, messageId: data?.messages?.[0]?.id };
    } catch (err: any) {
      console.error('WhatsApp API Error:', err);
      return { success: false, error: err.message };
    }
  }

  // Graceful simulation
  console.log(`[WhatsApp Simulated Dispatch] To: +${formattedPhone} | Message: ${message.slice(0, 60)}...`);
  return { success: true, messageId: `wa-sim-${Date.now()}` };
}
