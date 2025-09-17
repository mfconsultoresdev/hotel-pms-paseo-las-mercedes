import { NextRequest, NextResponse } from 'next/server'

// GET - Obtener cuentas por cobrar
export async function GET(request: NextRequest) {
  try {
    // Simulate API response without database dependency
    const dummyData = {
      accounts_receivable: [
        {
          id: '1',
          invoice_number: 'INV-001',
          total_amount: 150.00,
          outstanding_balance: 150.00,
          total_paid: 0.00,
          days_overdue: 5,
          aging_category: '1-30_DAYS',
          risk_level: 'LOW',
          due_date: '2024-07-21',
          guest: {
            id: '1',
            first_name: 'Juan',
            last_name: 'Pérez',
            email: 'juan.perez@email.com',
            phone: '+57 300 123 4567',
            document_number: '12345678',
            document_type: 'CC',
            vip_status: 'REGULAR'
          },
          reservation: {
            id: '1',
            reservation_number: 'RES-001',
            check_in_date: '2024-07-15',
            check_out_date: '2024-07-20',
            room: {
              room_number: '305',
              room_type: {
                name: 'Suite Deluxe'
              }
            }
          },
          payments: []
        }
      ],
      summary: {
        total_invoices: 1,
        total_outstanding: 150.00,
        by_aging: {
          current: 0,
          days_1_30: 150.00,
          days_31_60: 0,
          days_61_90: 0,
          over_90_days: 0
        },
        by_risk_level: {
          none: 0,
          low: 150.00,
          medium: 0,
          high: 0
        }
      },
      pagination: {
        total: 1,
        limit: 50,
        offset: 0,
        hasMore: false
      }
    }

    return NextResponse.json(dummyData)

  } catch (error) {
    console.error('Error obteniendo cuentas por cobrar:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear plan de pago o acción de cobranza
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { invoice_id, action_type, notes } = body

    if (!invoice_id || !action_type) {
      return NextResponse.json(
        { error: 'ID de factura y tipo de acción requeridos' },
        { status: 400 }
      )
    }

    // Simulate creation without database dependency
    const dummyResponse = {
      success: true,
      collection_action: {
        id: '1',
        invoice_id,
        action_type,
        action_date: new Date().toISOString(),
        notes,
        status: 'PENDING'
      },
      message: `Acción de cobranza ${action_type} creada exitosamente`
    }

    return NextResponse.json(dummyResponse)

  } catch (error) {
    console.error('Error creando acción de cobranza:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}