import { NextRequest, NextResponse } from 'next/server'

// GET - Obtener mensajes automatizados
export async function GET(request: NextRequest) {
  try {
    // Simulate API response without database dependency
    const dummyData = {
      automated_messages: [
        {
          id: '1',
          name: 'Bienvenida al Hotel',
          type: 'WELCOME',
          trigger_event: 'CHECK_IN',
          is_active: true,
          subject: 'Bienvenido a Hotel Paseo Las Mercedes',
          content: 'Estimado huésped, le damos la bienvenida a nuestro hotel. Esperamos que disfrute su estadía.',
          created_at: '2024-07-01T00:00:00Z',
          updated_at: '2024-07-26T00:00:00Z'
        },
        {
          id: '2',
          name: 'Recordatorio de Check-out',
          type: 'CHECKOUT_REMINDER',
          trigger_event: 'CHECKOUT_24H',
          is_active: true,
          subject: 'Recordatorio de Check-out',
          content: 'Le recordamos que su check-out es mañana. Si necesita extender su estadía, contacte a recepción.',
          created_at: '2024-07-01T00:00:00Z',
          updated_at: '2024-07-26T00:00:00Z'
        }
      ],
      summary: {
        total_messages: 2,
        active_messages: 2,
        inactive_messages: 0,
        by_type: {
          welcome: 1,
          checkout_reminder: 1,
          promotion: 0,
          survey: 0
        }
      }
    }

    return NextResponse.json(dummyData)

  } catch (error) {
    console.error('Error obteniendo mensajes automatizados:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear mensaje automatizado
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, trigger_event, subject, content, is_active } = body

    if (!name || !type || !trigger_event || !subject || !content) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    // Simulate creation without database dependency
    const dummyResponse = {
      success: true,
      automated_message: {
        id: Date.now().toString(),
        name,
        type,
        trigger_event,
        subject,
        content,
        is_active: is_active !== false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      message: 'Mensaje automatizado creado exitosamente'
    }

    return NextResponse.json(dummyResponse)

  } catch (error) {
    console.error('Error creando mensaje automatizado:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}