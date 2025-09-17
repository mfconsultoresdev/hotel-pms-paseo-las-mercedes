import { NextRequest, NextResponse } from 'next/server'

// GET - Obtener registro de asistencia específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Simulate API response without database dependency
    const dummyData = {
      id,
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

    return NextResponse.json(dummyData)

  } catch (error) {
    console.error('Error obteniendo registro de asistencia:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar registro de asistencia
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { check_in_time, check_out_time, status } = body

    // Simulate update without database dependency
    const dummyResponse = {
      success: true,
      attendance_record: {
        id,
        check_in_time,
        check_out_time,
        status,
        updated_at: new Date().toISOString()
      },
      message: 'Registro de asistencia actualizado exitosamente'
    }

    return NextResponse.json(dummyResponse)

  } catch (error) {
    console.error('Error actualizando registro de asistencia:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar registro de asistencia
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Simulate deletion without database dependency
    const dummyResponse = {
      success: true,
      message: `Registro de asistencia ${id} eliminado exitosamente`
    }

    return NextResponse.json(dummyResponse)

  } catch (error) {
    console.error('Error eliminando registro de asistencia:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}