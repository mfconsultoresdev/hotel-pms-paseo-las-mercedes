

import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    message: 'Webhook de Stripe en desarrollo',
    timestamp: new Date().toISOString(),
    status: 'ok'
  });
}
