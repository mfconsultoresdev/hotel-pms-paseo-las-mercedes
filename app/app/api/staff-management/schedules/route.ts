
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const headersList = headers()
    
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const staffId = searchParams.get('staff_id')
    const department = searchParams.get('department')
    
    const hotel = await prisma.hotel.findFirst()
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
    }

    const where: any = { hotel_id: hotel.id }
    
    if (startDate && endDate) {
      where.schedule_date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }
    
    if (staffId) {
      where.staff_id = staffId
    }
    
    if (department && department !== 'ALL') {
      where.staff = {
        department
      }
    }

    const schedules = await prisma.staffSchedule.findMany({
      where,
      include: {
        staff: {
          select: {
            id: true,
            employee_number: true,
            first_name: true,
            last_name: true,
            department: true,
            position: true,
            shift_type: true
          }
        }
      },
      orderBy: [
        { schedule_date: 'asc' },
        { shift_start: 'asc' }
      ]
    })

    return NextResponse.json({ schedules })

  } catch (error) {
    console.error('Error fetching schedules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const hotel = await prisma.hotel.findFirst()
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
    }

    const {
      staff_id,
      schedule_date,
      shift_start,
      shift_end,
      break_start,
      break_end,
      schedule_type = 'REGULAR',
      break_minutes = 30,
      assigned_areas,
      special_tasks,
      notes
    } = body

    if (!staff_id || !schedule_date || !shift_start || !shift_end) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const shiftStartTime = new Date(shift_start)
    const shiftEndTime = new Date(shift_end)
    const scheduledHours = (shiftEndTime.getTime() - shiftStartTime.getTime()) / (1000 * 60 * 60) - (break_minutes / 60)

    const schedule = await prisma.staffSchedule.create({
      data: {
        hotel_id: hotel.id,
        staff_id,
        schedule_date: new Date(schedule_date),
        shift_start: shiftStartTime,
        shift_end: shiftEndTime,
        break_start: break_start ? new Date(break_start) : null,
        break_end: break_end ? new Date(break_end) : null,
        schedule_type,
        scheduled_hours: parseFloat(scheduledHours.toFixed(2)),
        break_minutes,
        assigned_areas,
        special_tasks,
        notes,
        status: 'SCHEDULED',
        created_by: 'system'
      },
      include: {
        staff: {
          select: {
            employee_number: true,
            first_name: true,
            last_name: true,
            department: true,
            position: true
          }
        }
      }
    })

    return NextResponse.json(schedule, { status: 201 })

  } catch (error: any) {
    console.error('Error creating schedule:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Schedule already exists for this staff member on this date' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create schedule' },
      { status: 500 }
    )
  }
}
