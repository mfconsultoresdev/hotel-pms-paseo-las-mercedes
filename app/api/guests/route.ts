import { NextRequest, NextResponse } from 'next/server'

// GET - Obtener huéspedes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const status = searchParams.get('status')

    // Simulate API response without database dependency
    const dummyData = {
      guests: [
        {
          id: 'guest-001',
          first_name: 'Juan',
          last_name: 'Pérez',
          email: 'juan.perez@email.com',
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
          status: 'ACTIVE',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-07-26T10:00:00Z',
          current_reservation: {
            id: 'reservation-001',
            room_number: '305',
            check_in_date: '2024-07-26',
            check_out_date: '2024-07-30',
            status: 'CHECKED_IN'
          }
        },
        {
          id: 'guest-002',
          first_name: 'María',
          last_name: 'González',
          email: 'maria.gonzalez@email.com',
          phone: '+1234567892',
          date_of_birth: '1985-03-22',
          nationality: 'Colombiana',
          id_type: 'ID_CARD',
          id_number: 'CC12345678',
          address: 'Bogotá, Colombia',
          emergency_contact: 'Carlos González',
          emergency_phone: '+1234567893',
          preferences: {
            language: 'es',
            currency: 'USD',
            newsletter: false,
            sms_notifications: true,
            email_notifications: false
          },
          status: 'ACTIVE',
          created_at: '2024-02-15T00:00:00Z',
          updated_at: '2024-07-25T14:30:00Z',
          current_reservation: {
            id: 'reservation-002',
            room_number: '201',
            check_in_date: '2024-07-25',
            check_out_date: '2024-07-28',
            status: 'CHECKED_IN'
          }
        },
        {
          id: 'guest-003',
          first_name: 'Carlos',
          last_name: 'Rodríguez',
          email: 'carlos.rodriguez@email.com',
          phone: '+1234567894',
          date_of_birth: '1978-07-10',
          nationality: 'Mexicano',
          id_type: 'PASSPORT',
          id_number: 'MX987654321',
          address: 'Ciudad de México, México',
          emergency_contact: 'Ana Rodríguez',
          emergency_phone: '+1234567895',
          preferences: {
            language: 'es',
            currency: 'USD',
            newsletter: true,
            sms_notifications: false,
            email_notifications: true
          },
          status: 'ACTIVE',
          created_at: '2024-03-10T00:00:00Z',
          updated_at: '2024-07-24T09:15:00Z',
          current_reservation: null
        }
      ],
      pagination: {
        page,
        limit,
        total: 3,
        total_pages: 1,
        has_next: false,
        has_prev: false
      },
      summary: {
        total_guests: 3,
        active_guests: 3,
        inactive_guests: 0,
        checked_in_guests: 2,
        with_reservations: 2
      },
      filters_applied: {
        search,
        status
      }
    }

    return NextResponse.json(dummyData)

  } catch (error) {
    console.error('Error obteniendo huéspedes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear huésped
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      first_name, 
      last_name, 
      email, 
      phone, 
      date_of_birth, 
      nationality, 
      id_type, 
      id_number, 
      address,
      emergency_contact,
      emergency_phone,
      preferences 
    } = body

    if (!first_name || !last_name || !email) {
      return NextResponse.json(
        { error: 'Nombre, apellido y email son requeridos' },
        { status: 400 }
      )
    }

    // Simulate creation without database dependency
    const dummyResponse = {
      success: true,
      guest: {
        id: `guest-${Date.now()}`,
        first_name,
        last_name,
        email,
        phone: phone || null,
        date_of_birth: date_of_birth || null,
        nationality: nationality || null,
        id_type: id_type || null,
        id_number: id_number || null,
        address: address || null,
        emergency_contact: emergency_contact || null,
        emergency_phone: emergency_phone || null,
        preferences: preferences || {
          language: 'es',
          currency: 'USD',
          newsletter: false,
          sms_notifications: false,
          email_notifications: true
        },
        status: 'ACTIVE',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      message: 'Huésped creado exitosamente'
    }

    return NextResponse.json(dummyResponse)

  } catch (error) {
    console.error('Error creando huésped:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}