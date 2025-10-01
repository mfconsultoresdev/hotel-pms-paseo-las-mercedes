
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const headersList = headers()
    
    const employee = await prisma.staff.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        hotel: {
          select: {
            id: true,
            name: true
          }
        },
        attendance: {
          orderBy: { attendance_date: 'desc' },
          take: 10
        },
        schedules: {
          where: {
            schedule_date: {
              gte: new Date()
            }
          },
          orderBy: { schedule_date: 'asc' },
          take: 10
        },
        evaluations: {
          orderBy: { evaluation_date: 'desc' },
          take: 5
        },
        _count: {
          select: {
            attendance: true,
            schedules: true,
            evaluations: true,
            time_entries: true
          }
        }
      }
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(employee)

  } catch (error) {
    console.error('Error fetching employee:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employee' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const employee = await prisma.staff.findUnique({
      where: { id: params.id }
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    const {
      first_name,
      last_name,
      email,
      phone,
      department,
      position,
      employment_type,
      shift_type,
      salary_type,
      base_salary,
      emergency_contact,
      emergency_phone,
      address,
      city,
      state,
      postal_code,
      is_active,
      can_login,
      access_level,
      notes,
      termination_date
    } = body

    const updatedEmployee = await prisma.staff.update({
      where: { id: params.id },
      data: {
        ...(first_name && { first_name }),
        ...(last_name && { last_name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(department && { department }),
        ...(position && { position }),
        ...(employment_type && { employment_type }),
        ...(shift_type && { shift_type }),
        ...(salary_type && { salary_type }),
        ...(base_salary !== undefined && { base_salary: base_salary ? parseFloat(base_salary) : null }),
        ...(emergency_contact !== undefined && { emergency_contact }),
        ...(emergency_phone !== undefined && { emergency_phone }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(postal_code !== undefined && { postal_code }),
        ...(is_active !== undefined && { is_active }),
        ...(can_login !== undefined && { can_login }),
        ...(access_level && { access_level }),
        ...(notes !== undefined && { notes }),
        ...(termination_date && { termination_date: new Date(termination_date) }),
        updated_by: 'system',
        updated_at: new Date()
      },
      include: {
        user: true,
        _count: {
          select: {
            attendance: true,
            schedules: true,
            evaluations: true
          }
        }
      }
    })

    return NextResponse.json(updatedEmployee)

  } catch (error: any) {
    console.error('Error updating employee:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Employee with this information already exists' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update employee' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await prisma.staff.findUnique({
      where: { id: params.id }
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    // Soft delete - just mark as inactive
    await prisma.staff.update({
      where: { id: params.id },
      data: {
        is_active: false,
        termination_date: new Date(),
        updated_by: 'system'
      }
    })

    return NextResponse.json({ message: 'Employee deactivated successfully' })

  } catch (error) {
    console.error('Error deleting employee:', error)
    return NextResponse.json(
      { error: 'Failed to delete employee' },
      { status: 500 }
    )
  }
}
