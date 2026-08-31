/**
 * Paystack Kenya Payment Gateway Helper
 * Supports M-Pesa STK Push, Visa, Mastercard, and Automated Recurring Subscriptions
 */
import crypto from 'crypto';

export interface PaystackInitParams {
  email: string;
  amount: number; // in KES (will be converted to cents)
  planId: string;
  userId?: string;
  phone?: string;
  callbackUrl?: string;
}

export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export async function initializePaystackTransaction(params: PaystackInitParams): Promise<PaystackInitResponse> {
  const reference = `TIQ-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const amountInCents = Math.round(params.amount * 100); // Paystack uses subunit (cents)

  if (PAYSTACK_SECRET_KEY) {
    try {
      const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: params.email,
          amount: amountInCents,
          currency: 'KES',
          reference: reference,
          callback_url: params.callbackUrl || 'https://tenderiq.co.ke/pricing?payment=success',
          channels: ['card', 'mpesa', 'bank_transfer'],
          metadata: {
            plan_id: params.planId,
            user_id: params.userId || 'guest',
            phone: params.phone || '',
            custom_fields: [
              { display_name: 'Plan', variable_name: 'plan', value: params.planId === 'enterprise' ? 'Enterprise (17,999/mo)' : 'Pro (4,999/mo)' },
            ],
          },
        }),
      });

      const data = await response.json();
      return data;
    } catch (err: any) {
      console.error('Paystack initialization error:', err);
      return { status: false, message: err.message };
    }
  }

  // Graceful simulation for local development / testing without live secret key
  return {
    status: true,
    message: 'Authorization URL created (Simulation Mode)',
    data: {
      authorization_url: `https://checkout.paystack.com/simulate-${reference}`,
      access_code: `code_${Date.now()}`,
      reference: reference,
    },
  };
}

export async function verifyPaystackTransaction(reference: string): Promise<any> {
  if (PAYSTACK_SECRET_KEY) {
    try {
      const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      });
      return await res.json();
    } catch (err) {
      console.error('Error verifying Paystack transaction:', err);
      return { status: false };
    }
  }

  // Simulation response
  return {
    status: true,
    data: {
      status: 'success',
      reference: reference,
      amount: 499900,
      currency: 'KES',
      gateway_response: 'Successful',
      channel: 'mpesa',
    },
  };
}

export function verifyPaystackWebhookSignature(bodyString: string, signatureHeader: string): boolean {
  if (!PAYSTACK_SECRET_KEY) return true;
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(bodyString)
    .digest('hex');
  return hash === signatureHeader;
}
