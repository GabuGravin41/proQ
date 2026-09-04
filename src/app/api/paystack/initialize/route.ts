import { NextRequest, NextResponse } from 'next/server';
import { initializePaystackTransaction } from '@/lib/paystack';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, amount, planId, phone, userId } = body;

    if (!email || !amount) {
      return NextResponse.json(
        { success: false, error: 'Email and amount are required' },
        { status: 400 }
      );
    }

    const result = await initializePaystackTransaction({
      email,
      amount: Number(amount),
      planId: planId || 'pro',
      phone: phone || '',
      userId: userId || 'guest',
      callbackUrl: `${req.nextUrl.origin}/pricing?payment=success`,
    });

    if (result.status && result.data) {
      return NextResponse.json({
        success: true,
        authorizationUrl: result.data.authorization_url,
        accessCode: result.data.access_code,
        reference: result.data.reference,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.message || 'Payment initialization failed' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Paystack Init Route Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
