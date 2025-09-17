import { NextRequest, NextResponse } from 'next/server'

// GET - Obtener comunicaciones
export async function GET(request: NextRequest) {
  try {
    // Simulate API response without database dependency
    const dummyData = {
      communications: [
        {
          id: '1',
          type: 'MESSAGE',
          subject: 'Bienvenido al Hotel',
          content: 'Estimado huésped, le damos la bienvenida a Hotel Paseo Las Mercedes. Esperamos que disfrute su estadía.',
          sender_id: 'hotel-001',
          recipient_id: 'guest-001',
          recipient_type: 'GUEST',
          status: 'SENT',
          priority: 'NORMAL',
          created_at: '2024-07-26T10:00:00Z',
          read_at: null,
          guest: {
            id: 'guest-001',
            first_name: 'Juan',
            last_name: 'Pérez',
            room_number: '305'
          },
          sender: {
            id: 'hotel-001',
            name: 'Hotel Paseo Las Mercedes',
            type: 'HOTEL'
          }
        },
        {
          id: '2',
          type: 'NOTIFICATION',
          subject: 'Recordatorio de Check-out',
          content: 'Le recordamos que su check-out es mañana a las 11:00 AM.',
          sender_id: 'system-001',
          recipient_id: 'guest-001',
          recipient_type: 'GUEST',
          status: 'DELIVERED',
          priority: 'HIGH',
          created_at: '2024-07-26T09:00:00Z',
          read_at: '2024-07-26T09:15:00Z',
          guest: {
            id: 'guest-001',
            first_name: 'Juan',
            last_name: 'Pérez',
            room_number: '305'
          },
          sender: {
            id: 'system-001',
            name: 'Sistema Automatizado',
            type: 'SYSTEM'
          }
        }
      ],
      summary: {
        total_communications: 2,
        unread_count: 1,
        by_type: {
          message: 1,
          notification: 1,
          alert: 0,
          promotion: 0
        },
        by_status: {
          sent: 1,
          delivered: 1,
          read: 1,
          failed: 0
        }
      }
    }

    return NextResponse.json(dummyData)

  } catch (error) {
    console.error('Error obteniendo comunicaciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Enviar comunicación
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, subject, content, recipient_id, recipient_type, priority } = body

    if (!type || !subject || !content || !recipient_id || !recipient_type) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    // Simulate creation without database dependency
    const dummyResponse = {
      success: true,
      communication: {
        id: Date.now().toString(),
        type,
        subject,
        content,
        recipient_id,
        recipient_type,
        priority: priority || 'NORMAL',
        status: 'SENT',
        created_at: new Date().toISOString(),
        read_at: null
      },
      message: 'Comunicación enviada exitosamente'
    }

    return NextResponse.json(dummyResponse)

  } catch (error) {
    console.error('Error enviando comunicación:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}