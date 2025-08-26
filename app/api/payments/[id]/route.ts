

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    return NextResponse.json({
      message: 'API de pagos por ID en desarrollo',
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    return NextResponse.json({
      message: 'API de pagos por ID en desarrollo',
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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    return NextResponse.json({
      message: 'API de pagos por ID en desarrollo',
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
