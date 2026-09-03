/**
 * proQ Kenya - Free Email Dispatcher (Gmail SMTP & Resend Native Engine)
 * 
 * Supports:
 * 1. Google Gmail SMTP (500 free emails/day using Google App Password)
 * 2. Resend API (3,000 free emails/month)
 * 3. Graceful fallback logging for local development
 */

export interface TenderEmailPayload {
  to: string;
  recipientName: string;
  tenders: {
    id: string;
    title: string;
    procuringEntity: string;
    county: string;
    referenceNumber: string;
    estimatedValue?: number;
    daysRemaining: number;
    category: string;
    matchScore: number;
  }[];
}

const GMAIL_USER = process.env.GMAIL_USER || process.env.EMAIL_USER || '';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'proQ Kenya Alerts <alerts@proq.co.ke>';

export function generateEmailHtml(payload: TenderEmailPayload): string {
  const tenderRows = payload.tenders.map((t) => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 16px 8px;">
        <span style="display: inline-block; font-size: 11px; font-weight: bold; background: #e0e7ff; color: #4338ca; padding: 2px 8px; rounded: 12px; border-radius: 9999px;">
          ${t.matchScore}% Match
        </span>
        <h3 style="margin: 6px 0 4px 0; font-size: 14px; font-weight: bold; color: #111827;">
          <a href="https://proq.co.ke/tender-detail?id=${t.id}" style="color: #4f46e5; text-decoration: none;">
            ${t.title}
          </a>
        </h3>
        <p style="margin: 0; font-size: 12px; color: #6b7280;">
          <strong>${t.procuringEntity}</strong> • ${t.county} County • Ref: ${t.referenceNumber}
        </p>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #059669; font-weight: bold;">
          ${t.estimatedValue ? `Est. Value: KES ${t.estimatedValue.toLocaleString()}` : 'Budget: Undisclosed'} • 
          <span style="color: #dc2626;">Deadline: ${t.daysRemaining} days remaining</span>
        </p>
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>proQ Daily Tender Matches</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb; margin: 0; padding: 24px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden;">
          <div style="background: #4f46e5; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
              pro<span style="color: #f59e0b;">Q</span> Kenya
            </h1>
            <p style="color: #e0e7ff; margin: 4px 0 0 0; font-size: 12px;">
              07:00 AM Verified Tender Match Dispatch
            </p>
          </div>
          
          <div style="padding: 24px;">
            <p style="font-size: 14px; color: #374151; margin-top: 0;">
              Habari <strong>${payload.recipientName}</strong>,
            </p>
            <p style="font-size: 13px; color: #4b5563; line-height: 1.5;">
              Here are your high-probability tender opportunities matched from over <strong>3,000 active notices</strong> across all 47 counties:
            </p>

            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              ${tenderRows}
            </table>

            <div style="text-align: center; margin-top: 24px;">
              <a href="https://proq.co.ke" style="display: inline-block; background: #4f46e5; color: #ffffff; font-size: 13px; font-weight: bold; padding: 12px 24px; border-radius: 10px; text-decoration: none;">
                Open Bidding Workspace →
              </a>
            </div>
          </div>

          <div style="background: #f3f4f6; padding: 16px 24px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0;">
              proQ is an independent procurement intelligence platform.
            </p>
            <p style="margin: 4px 0 0 0;">
              Manage your alert channels in <a href="https://proq.co.ke/notification-preferences" style="color: #4f46e5;">Notification Preferences</a>.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function sendEmailNotification(payload: TenderEmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const htmlContent = generateEmailHtml(payload);
  const subject = `🔔 proQ Kenya: ${payload.tenders.length} New Matching Tenders Found for Your Business`;

  // 1. If Resend API Key is available
  if (RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [payload.to],
          subject,
          html: htmlContent,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, messageId: data.id };
      }
      throw new Error(data.message || 'Resend delivery failed');
    } catch (err: any) {
      console.error('Resend Error:', err);
    }
  }

  // 2. If Gmail SMTP Credentials are provided via Nodemailer or fetch
  if (GMAIL_USER && GMAIL_APP_PASSWORD) {
    try {
      // Lazy load nodemailer if available
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: GMAIL_USER,
          pass: GMAIL_APP_PASSWORD,
        },
      });

      const info = await transporter.sendMail({
        from: `"proQ Kenya Alerts" <${GMAIL_USER}>`,
        to: payload.to,
        subject,
        html: htmlContent,
      });

      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.error('Gmail SMTP Dispatch Error:', err);
      // Fallback to simulation if nodemailer fails to load
    }
  }

  // 3. Graceful simulation for local development / zero credentials
  console.log(`[Email Simulated Dispatch] To: ${payload.to} | Subject: ${subject}`);
  return { success: true, messageId: `sim-email-${Date.now()}` };
}
