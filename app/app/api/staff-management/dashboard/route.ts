
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const headersList = headers()
    
    const hotel = await prisma.hotel.findFirst()
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
    }

    const today = new Date()
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
    
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    // Total staff metrics
    const [totalStaff, activeStaff, departments] = await Promise.all([
      prisma.staff.count({
        where: { hotel_id: hotel.id }
      }),
      prisma.staff.count({
        where: { hotel_id: hotel.id, is_active: true }
      }),
      prisma.staff.groupBy({
        by: ['department'],
        where: { hotel_id: hotel.id, is_active: true },
        _count: { id: true }
      })
    ])

    // Attendance metrics for today
    const todayAttendance = await prisma.staffAttendance.findMany({
      where: {
        hotel_id: hotel.id,
        attendance_date: {
          gte: startOfToday,
          lt: endOfToday
        }
      }
    })

    const presentCount = todayAttendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length
    const attendanceRate = activeStaff > 0 ? Math.round((presentCount / activeStaff) * 100) : 0

    // Scheduled shifts for today
    const todaySchedules = await prisma.staffSchedule.count({
      where: {
        hotel_id: hotel.id,
        schedule_date: {
          gte: startOfToday,
          lt: endOfToday
        }
      }
    })

    // Evaluations this month
    const monthEvaluations = await prisma.staffEvaluation.count({
      where: {
        hotel_id: hotel.id,
        evaluation_date: { gte: startOfMonth }
      }
    })

    // Recent evaluations
    const recentEvaluations = await prisma.staffEvaluation.findMany({
      where: { hotel_id: hotel.id },
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
      },
      orderBy: { evaluation_date: 'desc' },
      take: 5
    })

    // Attendance summary by department
    const weekAttendance = await prisma.staffAttendance.findMany({
      where: {
        hotel_id: hotel.id,
        attendance_date: { gte: startOfWeek }
      },
      include: {
        staff: {
          select: { department: true }
        }
      }
    })

    const attendanceByDept = weekAttendance.reduce((acc: any, record) => {
      const dept = record.staff.department
      if (!acc[dept]) {
        acc[dept] = { present: 0, total: 0 }
      }
      acc[dept].total++
      if (record.status === 'PRESENT' || record.status === 'LATE') {
        acc[dept].present++
      }
      return acc
    }, {})

    return NextResponse.json({
      metrics: {
        total_staff: totalStaff,
        active_staff: activeStaff,
        attendance_rate: attendanceRate,
        scheduled_today: todaySchedules,
        evaluations_this_month: monthEvaluations
      },
      departments,
      attendance_by_department: attendanceByDept,
      recent_evaluations: recentEvaluations,
      today_attendance: {
        total: todayAttendance.length,
        present: presentCount,
        absent: todayAttendance.filter(a => a.status === 'ABSENT').length,
        late: todayAttendance.filter(a => a.status === 'LATE').length,
        on_leave: todayAttendance.filter(a => ['SICK_LEAVE', 'VACATION', 'PERSONAL_LEAVE'].includes(a.status)).length
      }
    })

  } catch (error) {
    console.error('Error fetching staff management dashboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
