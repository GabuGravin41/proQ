import { NextRequest, NextResponse } from 'next/server';
import { sendStkPush, formatKenyanPhone } from '@/lib/mpesa';
import { executeQuery, isDbConfigured } from '@/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, amount, planId, userId } = body;

    if (!phone || !amount) {
      return NextResponse.json(
        { success: false, error: 'Phone number and amount are required' },
        { status: 400 }
      );
    }

    const formattedPhone = formatKenyanPhone(phone);
    const planName = planId === 'enterprise' ? 'Enterprise' : 'Pro';

    const response = await sendStkPush({
      phone: formattedPhone,
      amount: Number(amount),
      accountReference: `TIQ-${planName}`,
      transactionDesc: `TenderIQ ${planName}`,
    });

    if (response.ResponseCode === '0') {
      // Save pending transaction if DB is configured
      if (isDbConfigured) {
        await executeQuery(
          `INSERT INTO mpesa_transactions (
            id, user_id, phone_number, amount, plan_id,
            merchant_request_id, checkout_request_id, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')`,
          [
            `tx-${Date.now()}`,
            userId || null,
            formattedPhone,
            Number(amount),
            planId || 'pro',
            response.MerchantRequestID,
            response.CheckoutRequestID,
          ]
        ).catch(err => console.error('Failed to log M-Pesa tx in DB:', err));
      }

      return NextResponse.json({
        success: true,
        message: response.CustomerMessage || 'STK Push sent to phone',
        checkoutRequestId: response.CheckoutRequestID,
        merchantRequestId: response.MerchantRequestID,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: response.ResponseDescription || 'Failed to initiate STK Push',
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('STK Push Route Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
