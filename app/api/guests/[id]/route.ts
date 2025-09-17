import { NextRequest, NextResponse } from 'next/server'

// GET - Obtener huésped específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Simulate API response without database dependency
    const dummyData = {
      guest: {
        id,
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
        updated_at: '2024-07-26T10:00:00Z'
      },
      reservations: [
        {
          id: 'reservation-001',
          confirmation_number: 'RES-2024-001',
          check_in_date: '2024-07-26',
          check_out_date: '2024-07-30',
          status: 'CHECKED_IN',
          room_type: 'STANDARD',
          room_number: '305',
          total_amount: 400.00,
          payment_status: 'PAID',
          guest_count: 2,
          special_requests: 'Cama king size, vista al mar',
          created_at: '2024-07-20T10:00:00Z'
        },
        {
          id: 'reservation-002',
          confirmation_number: 'RES-2024-002',
          check_in_date: '2024-08-15',
          check_out_date: '2024-08-20',
          status: 'CONFIRMED',
          room_type: 'DELUXE',
          room_number: '405',
          total_amount: 600.00,
          payment_status: 'PENDING',
          guest_count: 2,
          special_requests: 'Habitación en piso alto',
          created_at: '2024-07-25T14:30:00Z'
        }
      ],
      communications: [
        {
          id: 'comm-001',
          type: 'SERVICE_REQUEST',
          subject: 'Solicitud de servicio de habitación',
          content: 'Necesito toallas adicionales',
          status: 'COMPLETED',
          created_at: '2024-07-26T10:00:00Z',
          response: 'Toallas entregadas a las 10:30 AM'
        },
        {
          id: 'comm-002',
          type: 'QUESTION',
          subject: 'Horarios del restaurante',
          content: '¿Cuáles son los horarios de desayuno?',
          status: 'COMPLETED',
          created_at: '2024-07-26T09:00:00Z',
          response: 'Desayuno de 7:00 AM a 10:00 AM'
        }
      ],
      services: [
        {
          id: 'service-001',
          name: 'Servicio de habitación',
          description: 'Limpieza y organización de la habitación',
          price: 25.00,
          status: 'COMPLETED',
          requested_at: '2024-07-26T10:00:00Z',
          completed_at: '2024-07-26T11:00:00Z'
        },
        {
          id: 'service-002',
          name: 'Toallas adicionales',
          description: 'Entrega de toallas extras',
          price: 0.00,
          status: 'COMPLETED',
          requested_at: '2024-07-26T10:15:00Z',
          completed_at: '2024-07-26T10:30:00Z'
        }
      ],
      billing: {
        total_spent: 425.00,
        pending_amount: 600.00,
        invoices: [
          {
            id: 'invoice-001',
            invoice_number: 'FACT-2024-001',
            amount: 425.00,
            status: 'PAID',
            issue_date: '2024-07-26',
            payment_date: '2024-07-26'
          }
        ]
      }
    }

    return NextResponse.json(dummyData)

  } catch (error) {
    console.error('Error obteniendo huésped:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar huésped
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
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

    // Simulate update without database dependency
    const dummyResponse = {
      success: true,
      guest: {
        id,
        first_name: first_name || 'Juan',
        last_name: last_name || 'Pérez',
        email: email || 'juan.perez@email.com',
        phone: phone || '+1234567890',
        date_of_birth: date_of_birth || '1990-01-15',
        nationality: nationality || 'Venezolano',
        id_type: id_type || 'PASSPORT',
        id_number: id_number || 'AB123456',
        address: address || 'Caracas, Venezuela',
        emergency_contact: emergency_contact || 'María Pérez',
        emergency_phone: emergency_phone || '+1234567891',
        preferences: preferences || {
          language: 'es',
          currency: 'USD',
          newsletter: true,
          sms_notifications: true,
          email_notifications: true
        },
        status: 'ACTIVE',
        updated_at: new Date().toISOString()
      },
      message: 'Huésped actualizado exitosamente'
    }

    return NextResponse.json(dummyResponse)

  } catch (error) {
    console.error('Error actualizando huésped:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar huésped
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Simulate deletion without database dependency
    const dummyResponse = {
      success: true,
      message: `Huésped ${id} eliminado exitosamente`
    }

    return NextResponse.json(dummyResponse)

  } catch (error) {
    console.error('Error eliminando huésped:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}