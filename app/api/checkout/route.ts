
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json({
      message: 'API de checkout en desarrollo',
      timestamp: new Date().toISOString(),
      status: 'ok'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error en la API' },
      { status: 500 }
    );
  }
}
