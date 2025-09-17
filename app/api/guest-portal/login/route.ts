import { NextRequest, NextResponse } from 'next/server'

// POST - Login del portal de huéspedes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, reservationNumber } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Simulate authentication without database dependency
    const dummyAuthResponse = {
      success: true,
      user: {
        id: 'guest-001',
        email: email,
        first_name: 'Juan',
        last_name: 'Pérez',
        phone: '+1234567890',
        date_of_birth: '1990-01-15',
        nationality: 'Venezolano',
        id_type: 'PASSPORT',
        id_number: 'AB123456',
        address: 'Caracas, Venezuela',
        emergency_contact: 'María Pérez',
        emergency_phone: '+1234567891',
        preferences: {
          language: 'es',
          currency: 'USD',
          newsletter: true,
          sms_notifications: true,
          email_notifications: true
        },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-07-26T10:00:00Z'
      },
      reservations: [
        {
          id: 'reservation-001',
          confirmation_number: 'RES-2024-001',
          check_in_date: '2024-07-26',
          check_out_date: '2024-07-30',
          status: 'CONFIRMED',
          room_type: 'STANDARD',
          room_number: '305',
          total_amount: 400.00,
          payment_status: 'PAID',
          guest_count: 2,
          special_requests: 'Cama king size, vista al mar'
        }
      ],
      token: 'dummy-jwt-token-for-guest-portal',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      message: 'Login exitoso'
    }

    return NextResponse.json(dummyAuthResponse)

  } catch (error) {
    console.error('Error en login del portal de huéspedes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET - Verificar estado de autenticación
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      )
    }

    // Simulate token validation without database dependency
    const dummyValidationResponse = {
      success: true,
      user: {
        id: 'guest-001',
        email: 'guest@example.com',
        first_name: 'Juan',
        last_name: 'Pérez',
        is_authenticated: true
      },
      message: 'Token válido'
    }

    return NextResponse.json(dummyValidationResponse)

  } catch (error) {
    console.error('Error validando token:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}