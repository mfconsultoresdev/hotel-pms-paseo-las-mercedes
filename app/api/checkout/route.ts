import { NextRequest, NextResponse } from 'next/server'

// GET - Obtener check-outs
export async function GET(request: NextRequest) {
  try {
    // Simulate API response without database dependency
    const dummyData = {
      checkouts: [
        {
          id: '1',
          reservation_id: 'res-001',
          guest_id: 'guest-001',
          room_id: 'room-305',
          check_out_time: '2024-07-30T11:00:00Z',
          status: 'COMPLETED',
          total_charges: 450.00,
          total_payments: 450.00,
          balance: 0.00,
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
          },
          charges: [
            {
              id: '1',
              description: 'Habitación 4 noches',
              amount: 400.00,
              category: 'ROOM'
            },
            {
              id: '2',
              description: 'Servicio de habitación',
              amount: 50.00,
              category: 'SERVICE'
            }
          ],
          payments: [
            {
              id: '1',
              amount: 450.00,
              payment_method: 'CREDIT_CARD',
              payment_date: '2024-07-30T10:30:00Z',
              status: 'COMPLETED'
            }
          ]
        }
      ],
      summary: {
        total_checkouts: 1,
        completed_today: 1,
        pending_today: 0,
        total_revenue: 450.00,
        by_status: {
          completed: 1,
          pending: 0,
          cancelled: 0
        }
      }
    }

    return NextResponse.json(dummyData)

  } catch (error) {
    console.error('Error obteniendo check-outs:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Procesar check-out
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reservation_id, guest_id, room_id, final_bill, notes } = body

    if (!reservation_id || !guest_id || !room_id) {
      return NextResponse.json(
        { error: 'ID de reservación, huésped y habitación son requeridos' },
        { status: 400 }
      )
    }

    // Simulate check-out processing without database dependency
    const dummyResponse = {
      success: true,
      checkout: {
        id: Date.now().toString(),
        reservation_id,
        guest_id,
        room_id,
        check_out_time: new Date().toISOString(),
        status: 'COMPLETED',
        total_charges: final_bill?.total_charges || 0,
        total_payments: final_bill?.total_payments || 0,
        balance: final_bill?.balance || 0,
        notes,
        processed_by: 'user-001'
      },
      message: 'Check-out procesado exitosamente'
    }

    return NextResponse.json(dummyResponse)

  } catch (error) {
    console.error('Error procesando check-out:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}