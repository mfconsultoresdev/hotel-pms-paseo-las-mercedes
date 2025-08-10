
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Obtener tarea específica
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const task = await prisma.housekeepingTask.findFirst({
      where: {
        id: params.id,
        hotel_id: session.user?.hotelId
      },
      include: {
        room: {
          include: {
            room_type: true,
            floor: true
          }
        },
        reservation: {
          include: {
            guest: true
          }
        },
        task_items: {
          orderBy: { created_at: 'asc' }
        },
        supply_usage: {
          include: {
            supply: true,
            staff: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        },
        room_inspections: {
          orderBy: { inspection_date: 'desc' }
        }
      }
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Tarea no encontrada' },
        { status: 404 }
      )
    }

    // Get assigned staff info
    let assignedStaff = null
    if (task.assigned_to) {
      const user = await prisma.user.findUnique({
        where: { id: task.assigned_to },
        include: {
          housekeeping_staff: true
        }
      })
      if (user) {
        assignedStaff = {
          id: user.id,
          name: user.name,
          email: user.email,
          employee_code: user.housekeeping_staff?.employee_code,
          skill_level: user.housekeeping_staff?.skill_level
        }
      }
    }

    return NextResponse.json({
      success: true,
      task: {
        ...task,
        assigned_staff: assignedStaff
      }
    })

  } catch (error) {
    console.error('Error fetching housekeeping task:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar tarea
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      status,
      assigned_to,
      priority,
      description,
      special_instructions,
      estimated_duration,
      actual_duration,
      inspection_status,
      inspection_notes
    } = body

    // Verify task exists and belongs to hotel
    const existingTask = await prisma.housekeepingTask.findFirst({
      where: {
        id: params.id,
        hotel_id: session.user?.hotelId
      }
    })

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Tarea no encontrada' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {
      updated_by: session.user?.id
    }

    if (status !== undefined) {
      updateData.status = status
      
      // Set dates based on status
      if (status === 'IN_PROGRESS' && !existingTask.started_date) {
        updateData.started_date = new Date()
      }
      
      if (status === 'COMPLETED' && !existingTask.completed_date) {
        updateData.completed_date = new Date()
      }
    }

    if (assigned_to !== undefined) {
      updateData.assigned_to = assigned_to
      if (assigned_to && !existingTask.assigned_date) {
        updateData.assigned_date = new Date()
      }
    }

    if (priority !== undefined) updateData.priority = priority
    if (description !== undefined) updateData.description = description
    if (special_instructions !== undefined) updateData.special_instructions = special_instructions
    if (estimated_duration !== undefined) updateData.estimated_duration = estimated_duration
    if (actual_duration !== undefined) updateData.actual_duration = actual_duration
    if (inspection_status !== undefined) updateData.inspection_status = inspection_status
    if (inspection_notes !== undefined) updateData.inspection_notes = inspection_notes

    const task = await prisma.housekeepingTask.update({
      where: { id: params.id },
      data: updateData,
      include: {
        room: {
          include: {
            room_type: true,
            floor: true
          }
        },
        reservation: {
          include: {
            guest: true
          }
        },
        task_items: {
          orderBy: { created_at: 'asc' }
        }
      }
    })

    // Update room status based on task completion
    if (status === 'COMPLETED' && existingTask.task_type === 'CHECKOUT_CLEANING') {
      await prisma.room.update({
        where: { id: existingTask.room_id },
        data: { 
          status: 'AVAILABLE',
          last_cleaned: new Date()
        }
      })
    }

    return NextResponse.json({
      success: true,
      task
    })

  } catch (error) {
    console.error('Error updating housekeeping task:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar tarea
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Verify task exists and belongs to hotel
    const task = await prisma.housekeepingTask.findFirst({
      where: {
        id: params.id,
        hotel_id: session.user?.hotelId
      }
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Tarea no encontrada' },
        { status: 404 }
      )
    }

    // Don't delete completed tasks
    if (task.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'No se pueden eliminar tareas completadas' },
        { status: 400 }
      )
    }

    await prisma.housekeepingTask.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Tarea eliminada exitosamente'
    })

  } catch (error) {
    console.error('Error deleting housekeeping task:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

