import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Métricas del sistema en desarrollo',
    timestamp: new Date().toISOString(),
    status: 'ok'
  });
}
