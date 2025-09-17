import { NextRequest, NextResponse } from 'next/server'

// GET - Obtener registros de asistencia
export async function GET(request: NextRequest) {
  try {
    // Simulate API response without database dependency
    const dummyData = {
      attendance_records: [
        {
          id: '1',
          staff_id: '1',
          date: '2024-07-26',
          check_in_time: '08:00:00',
          check_out_time: '17:00:00',
          hours_worked: 9,
          status: 'PRESENT',
          staff: {
            id: '1',
            employee_number: 'EMP001',
            first_name: 'María',
            last_name: 'García',
            department: 'Housekeeping',
            position: 'Supervisora'
          }
        }
      ],
      summary: {
        total_staff: 1,
        present_today: 1,
        absent_today: 0,
        late_arrivals: 0
      }
    }

    return NextResponse.json(dummyData)

  } catch (error) {
    console.error('Error obteniendo registros de asistencia:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Registrar entrada o salida
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { staff_id, action_type } = body

    if (!staff_id || !action_type) {
      return NextResponse.json(
        { error: 'ID de empleado y tipo de acción requeridos' },
        { status: 400 }
      )
    }

    // Simulate creation without database dependency
    const dummyResponse = {
      success: true,
      attendance_record: {
        id: '1',
        staff_id,
        action_type,
        timestamp: new Date().toISOString(),
        status: action_type === 'CHECK_IN' ? 'PRESENT' : 'CHECKED_OUT'
      },
      message: `Registro de ${action_type} creado exitosamente`
    }

    return NextResponse.json(dummyResponse)

  } catch (error) {
    console.error('Error registrando asistencia:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}