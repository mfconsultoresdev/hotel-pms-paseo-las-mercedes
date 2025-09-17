import { NextRequest, NextResponse } from 'next/server'

// GET - Obtener comunicación específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Simulate API response without database dependency
    const dummyData = {
      id,
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
      },
      attachments: [],
      replies: []
    }

    return NextResponse.json(dummyData)

  } catch (error) {
    console.error('Error obteniendo comunicación:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar comunicación
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { subject, content, priority, status } = body

    // Simulate update without database dependency
    const dummyResponse = {
      success: true,
      communication: {
        id,
        subject,
        content,
        priority,
        status,
        updated_at: new Date().toISOString()
      },
      message: 'Comunicación actualizada exitosamente'
    }

    return NextResponse.json(dummyResponse)

  } catch (error) {
    console.error('Error actualizando comunicación:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar comunicación
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Simulate deletion without database dependency
    const dummyResponse = {
      success: true,
      message: `Comunicación ${id} eliminada exitosamente`
    }

    return NextResponse.json(dummyResponse)

  } catch (error) {
    console.error('Error eliminando comunicación:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}