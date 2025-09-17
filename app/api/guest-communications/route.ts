import { NextRequest, NextResponse } from 'next/server'

// GET - Obtener comunicaciones de huéspedes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const guestId = searchParams.get('guestId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    // Simulate API response without database dependency
    const dummyData = {
      communications: [
        {
          id: '1',
          guest_id: 'guest-001',
          guest_name: 'Juan Pérez',
          room_number: '305',
          type: 'SERVICE_REQUEST',
          subject: 'Solicitud de servicio de habitación',
          content: 'Necesito toallas adicionales y limpieza del baño',
          priority: 'MEDIUM',
          status: 'PENDING',
          created_at: '2024-07-26T14:30:00Z',
          updated_at: '2024-07-26T14:30:00Z',
          assigned_to: 'housekeeping-001',
          response: null,
          response_at: null
        },
        {
          id: '2',
          guest_id: 'guest-002',
          guest_name: 'María González',
          room_number: '201',
          type: 'COMPLAINT',
          subject: 'Problema con el aire acondicionado',
          content: 'El aire acondicionado no funciona correctamente en mi habitación',
          priority: 'HIGH',
          status: 'IN_PROGRESS',
          created_at: '2024-07-26T13:15:00Z',
          updated_at: '2024-07-26T13:45:00Z',
          assigned_to: 'maintenance-001',
          response: 'Hemos enviado un técnico para revisar el sistema de aire acondicionado',
          response_at: '2024-07-26T13:45:00Z'
        },
        {
          id: '3',
          guest_id: 'guest-003',
          guest_name: 'Carlos Rodríguez',
          room_number: '102',
          type: 'COMPLIMENT',
          subject: 'Excelente servicio',
          content: 'Quiero felicitar al personal por su excelente atención',
          priority: 'LOW',
          status: 'COMPLETED',
          created_at: '2024-07-26T12:00:00Z',
          updated_at: '2024-07-26T12:30:00Z',
          assigned_to: 'management-001',
          response: 'Muchas gracias por sus comentarios. Los compartiremos con todo el equipo',
          response_at: '2024-07-26T12:30:00Z'
        },
        {
          id: '4',
          guest_id: 'guest-004',
          guest_name: 'Ana Martínez',
          room_number: '405',
          type: 'QUESTION',
          subject: 'Horarios del restaurante',
          content: '¿Cuáles son los horarios de desayuno?',
          priority: 'LOW',
          status: 'COMPLETED',
          created_at: '2024-07-26T11:30:00Z',
          updated_at: '2024-07-26T11:35:00Z',
          assigned_to: 'reception-001',
          response: 'El desayuno se sirve de 7:00 AM a 10:00 AM en el restaurante principal',
          response_at: '2024-07-26T11:35:00Z'
        }
      ],
      summary: {
        total_communications: 4,
        by_status: {
          pending: 1,
          in_progress: 1,
          completed: 2,
          cancelled: 0
        },
        by_type: {
          service_request: 1,
          complaint: 1,
          compliment: 1,
          question: 1,
          feedback: 0
        },
        by_priority: {
          low: 2,
          medium: 1,
          high: 1,
          urgent: 0
        }
      },
      filters_applied: {
        guest_id: guestId,
        status,
        type
      }
    }

    return NextResponse.json(dummyData)

  } catch (error) {
    console.error('Error obteniendo comunicaciones de huéspedes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear comunicación de huésped
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { guest_id, type, subject, content, priority } = body

    if (!guest_id || !type || !subject || !content) {
      return NextResponse.json(
        { error: 'ID de huésped, tipo, asunto y contenido son requeridos' },
        { status: 400 }
      )
    }

    // Simulate creation without database dependency
    const dummyResponse = {
      success: true,
      communication: {
        id: `comm-${Date.now()}`,
        guest_id,
        type,
        subject,
        content,
        priority: priority || 'MEDIUM',
        status: 'PENDING',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        assigned_to: null,
        response: null,
        response_at: null
      },
      message: 'Comunicación de huésped creada exitosamente'
    }

    return NextResponse.json(dummyResponse)

  } catch (error) {
    console.error('Error creando comunicación de huésped:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}