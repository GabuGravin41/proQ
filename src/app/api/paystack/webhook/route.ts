import { NextRequest, NextResponse } from 'next/server';
import { verifyPaystackWebhookSignature } from '@/lib/paystack';
import { executeQuery, isDbConfigured } from '@/db';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-paystack-signature') || '';

    if (!verifyPaystackWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    console.log(`[Paystack Webhook] Event received: ${event.event}`);

    if (event.event === 'charge.success') {
      const data = event.data;
      const reference = data.reference;
      const planId = data.metadata?.plan_id || 'pro';
      const userId = data.metadata?.user_id;
      const amount = data.amount / 100;
      const channel = data.channel; // mpesa or card

      if (isDbConfigured) {
        // Record transaction
        await executeQuery(
          `INSERT INTO mpesa_transactions (
            id, user_id, phone_number, amount, plan_id,
            merchant_request_id, checkout_request_id, mpesa_receipt_number,
            result_code, result_desc, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, 'Paystack Success', 'completed')
          ON CONFLICT (checkout_request_id) DO UPDATE SET status = 'completed'`,
          [
            `tx-${Date.now()}`,
            userId && userId !== 'guest' ? userId : null,
            data.customer?.phone || data.metadata?.phone || '',
            amount,
            planId,
            reference,
            reference,
            data.id?.toString() || reference,
          ]
        ).catch(err => console.error('Error logging Paystack tx in DB:', err));

        // Upgrade user
        if (userId && userId !== 'guest') {
          await executeQuery(
            `UPDATE users SET plan_tier = $1, role = 'subscriber', updated_at = NOW() WHERE id = $2`,
            [planId, userId]
          );
        }
      }
    }

    return NextResponse.json({ status: true, message: 'Webhook processed' });
  } catch (error: any) {
    console.error('Paystack Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
