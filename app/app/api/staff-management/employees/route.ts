
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const headersList = headers()
    
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const hotel = await prisma.hotel.findFirst()
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
    }

    const where: any = { hotel_id: hotel.id }
    
    if (department && department !== 'ALL') {
      where.department = department
    }
    
    if (status === 'active') {
      where.is_active = true
    } else if (status === 'inactive') {
      where.is_active = false
    }
    
    if (search) {
      where.OR = [
        { first_name: { contains: search, mode: 'insensitive' } },
        { last_name: { contains: search, mode: 'insensitive' } },
        { employee_number: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    const skip = (page - 1) * limit

    const [employees, total] = await Promise.all([
      prisma.staff.findMany({
        where,
        include: {
          user: true,
          _count: {
            select: {
              attendance: true,
              schedules: true,
              evaluations: true
            }
          }
        },
        orderBy: [
          { department: 'asc' },
          { last_name: 'asc' }
        ],
        skip,
        take: limit
      }),
      prisma.staff.count({ where })
    ])

    return NextResponse.json({
      employees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
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
      employee_number,
      first_name,
      last_name,
      email,
      phone,
      department,
      position,
      employment_type = 'FULL_TIME',
      shift_type = 'DAY',
      salary_type = 'HOURLY',
      base_salary,
      hire_date,
      emergency_contact,
      emergency_phone,
      date_of_birth,
      address,
      city,
      state,
      postal_code,
      id_document,
      tax_id,
      notes
    } = body

    if (!employee_number || !first_name || !last_name || !department || !position || !hire_date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const employee = await prisma.staff.create({
      data: {
        hotel_id: hotel.id,
        employee_number,
        first_name,
        last_name,
        email,
        phone,
        department,
        position,
        employment_type,
        shift_type,
        salary_type,
        base_salary: base_salary ? parseFloat(base_salary) : null,
        hire_date: new Date(hire_date),
        emergency_contact,
        emergency_phone,
        date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
        address,
        city,
        state,
        postal_code,
        id_document,
        tax_id,
        notes,
        is_active: true,
        can_login: false,
        access_level: 'BASIC',
        created_by: 'system'
      },
      include: {
        _count: {
          select: {
            attendance: true,
            schedules: true,
            evaluations: true
          }
        }
      }
    })

    return NextResponse.json(employee, { status: 201 })

  } catch (error: any) {
    console.error('Error creating employee:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Employee with this information already exists' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    )
  }
}
