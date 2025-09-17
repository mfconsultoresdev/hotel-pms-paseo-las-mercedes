import { NextRequest, NextResponse } from 'next/server'

// GET - Obtener check-ins
export async function GET(request: NextRequest) {
  try {
    // Simulate API response without database dependency
    const dummyData = {
      checkins: [
        {
          id: '1',
          reservation_id: 'res-001',
          guest_id: 'guest-001',
          room_id: 'room-305',
          check_in_time: '2024-07-26T14:00:00Z',
          status: 'COMPLETED',
          guest: {
            id: 'guest-001',
            first_name: 'Juan',
            last_name: 'Pérez',
            email: 'juan.perez@email.com',
            phone: '+57 300 123 4567',
            document_number: '12345678',
            document_type: 'CC'
          },
          reservation: {
            id: 'res-001',
            reservation_number: 'RES-001',
            check_in_date: '2024-07-26',
            check_out_date: '2024-07-30',
            room: {
              room_number: '305',
              room_type: {
                name: 'Suite Deluxe'
              }
            }
          },
          room: {
            room_number: '305',
            floor: '3',
            room_type: {
              name: 'Suite Deluxe'
            }
          }
        }
      ],
      summary: {
        total_checkins: 1,
        completed_today: 1,
        pending_today: 0,
        by_status: {
          completed: 1,
          pending: 0,
          cancelled: 0
        }
      }
    }

    return NextResponse.json(dummyData)

  } catch (error) {
    console.error('Error obteniendo check-ins:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Procesar check-in
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reservation_id, guest_id, room_id, notes } = body

    if (!reservation_id || !guest_id || !room_id) {
      return NextResponse.json(
        { error: 'ID de reservación, huésped y habitación son requeridos' },
        { status: 400 }
      )
    }

    // Simulate check-in processing without database dependency
    const dummyResponse = {
      success: true,
      checkin: {
        id: Date.now().toString(),
        reservation_id,
        guest_id,
        room_id,
        check_in_time: new Date().toISOString(),
        status: 'COMPLETED',
        notes,
        processed_by: 'user-001'
      },
      message: 'Check-in procesado exitosamente'
    }

    return NextResponse.json(dummyResponse)

  } catch (error) {
    console.error('Error procesando check-in:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}