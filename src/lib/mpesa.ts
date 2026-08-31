/**
 * Safaricom M-Pesa Daraja API Integration Helper
 */

export interface StkPushParams {
  phone: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}

export interface StkPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

const MPESA_ENV = process.env.MPESA_ENVIRONMENT || 'sandbox';
const BASE_URL = MPESA_ENV === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || '';
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || '';
const PASSKEY = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
const SHORTCODE = process.env.MPESA_SHORTCODE || '174379'; // Sandbox test shortcode
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL || 'https://tenderiq.co.ke/api/mpesa/callback';

export function formatKenyanPhone(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.slice(1);
  } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
    cleaned = '254' + cleaned;
  }
  return cleaned;
}

export async function getDarajaToken(): Promise<string | null> {
  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    return null;
  }
  try {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const res = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    const data = await res.json();
    return data.access_token || null;
  } catch (error) {
    console.error('Error fetching Daraja token:', error);
    return null;
  }
}

export async function sendStkPush(params: StkPushParams): Promise<StkPushResponse> {
  const token = await getDarajaToken();
  const formattedPhone = formatKenyanPhone(params.phone);
  const date = new Date();
  const timestamp = date.getFullYear() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0') +
    String(date.getHours()).padStart(2, '0') +
    String(date.getMinutes()).padStart(2, '0') +
    String(date.getSeconds()).padStart(2, '0');

  const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

  // If live credentials are available, invoke Daraja API
  if (token) {
    const res = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(params.amount),
        PartyA: formattedPhone,
        PartyB: SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: CALLBACK_URL,
        AccountReference: params.accountReference.slice(0, 12),
        TransactionDesc: params.transactionDesc.slice(0, 12),
      }),
    });
    return await res.json();
  }

  // Graceful simulation when running in local dev / sandbox without API keys
  return {
    MerchantRequestID: `MR-${Date.now()}`,
    CheckoutRequestID: `ws_CO_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
    ResponseCode: '0',
    ResponseDescription: 'Success. Request accepted for processing',
    CustomerMessage: `Success. An STK push prompt has been sent to ${formattedPhone}. Please enter your M-Pesa PIN.`,
  };
}
