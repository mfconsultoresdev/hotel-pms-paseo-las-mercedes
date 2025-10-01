
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const headersList = headers()
    
    const { searchParams } = new URL(request.url)
    const staffId = searchParams.get('staff_id')
    const year = searchParams.get('year')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    const hotel = await prisma.hotel.findFirst()
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
    }

    const where: any = { hotel_id: hotel.id }
    
    if (staffId) {
      where.staff_id = staffId
    }
    
    if (year) {
      const startOfYear = new Date(`${year}-01-01`)
      const endOfYear = new Date(`${parseInt(year) + 1}-01-01`)
      where.evaluation_date = {
        gte: startOfYear,
        lt: endOfYear
      }
    }

    const skip = (page - 1) * limit

    const [evaluations, total] = await Promise.all([
      prisma.staffEvaluation.findMany({
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
              employment_type: true
            }
          }
        },
        orderBy: { evaluation_date: 'desc' },
        skip,
        take: limit
      }),
      prisma.staffEvaluation.count({ where })
    ])

    return NextResponse.json({
      evaluations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching evaluations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch evaluations' },
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
      evaluation_period_start,
      evaluation_period_end,
      evaluation_type = 'PERFORMANCE',
      evaluator_id,
      evaluator_name,
      overall_rating,
      punctuality,
      quality_of_work,
      teamwork,
      communication,
      initiative,
      reliability,
      customer_service,
      strengths,
      areas_improvement,
      goals_objectives,
      training_needs,
      recommendation,
      salary_adjustment,
      promotion_eligible,
      next_review_date,
      action_plan
    } = body

    if (!staff_id || !evaluation_period_start || !evaluation_period_end || !evaluator_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const evaluation = await prisma.staffEvaluation.create({
      data: {
        hotel_id: hotel.id,
        staff_id,
        evaluation_period_start: new Date(evaluation_period_start),
        evaluation_period_end: new Date(evaluation_period_end),
        evaluation_date: new Date(),
        evaluation_type,
        evaluator_id: evaluator_id || 'system',
        evaluator_name,
        overall_rating: overall_rating ? parseFloat(overall_rating) : null,
        punctuality: punctuality ? parseInt(punctuality) : null,
        quality_of_work: quality_of_work ? parseInt(quality_of_work) : null,
        teamwork: teamwork ? parseInt(teamwork) : null,
        communication: communication ? parseInt(communication) : null,
        initiative: initiative ? parseInt(initiative) : null,
        reliability: reliability ? parseInt(reliability) : null,
        customer_service: customer_service ? parseInt(customer_service) : null,
        strengths,
        areas_improvement,
        goals_objectives,
        training_needs,
        recommendation,
        salary_adjustment: salary_adjustment ? parseFloat(salary_adjustment) : null,
        promotion_eligible: promotion_eligible || false,
        next_review_date: next_review_date ? new Date(next_review_date) : null,
        action_plan,
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

    return NextResponse.json(evaluation, { status: 201 })

  } catch (error) {
    console.error('Error creating evaluation:', error)
    return NextResponse.json(
      { error: 'Failed to create evaluation' },
      { status: 500 }
    )
  }
}
