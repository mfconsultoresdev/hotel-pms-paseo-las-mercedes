
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST - Process check-out
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { reservationId, charges, notes, roomCondition, keyCardsReturned } = await request.json()

    if (!reservationId) {
      return NextResponse.json(
        { error: 'ID de reservación requerido' },
        { status: 400 }
      )
    }

    // Find the reservation
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { 
        guest: true,
        room: true
      }
    })

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservación no encontrada' },
        { status: 404 }
      )
    }

    // Check if already checked out
    if (reservation.status === 'CHECKED_OUT') {
      return NextResponse.json(
        { error: 'El huésped ya hizo check-out' },
        { status: 400 }
      )
    }

    // Calculate final charges
    const totalCharges = charges || Number(reservation.total_amount)

    // Update reservation status
    await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        status: 'CHECKED_OUT',
        actual_check_out: new Date(),
        total_amount: totalCharges,
        notes: notes || reservation.notes
      }
    })

    // Update room status based on condition
    let roomStatus = 'OUT_OF_ORDER'
    if (roomCondition === 'clean') {
      roomStatus = 'AVAILABLE'
    } else if (roomCondition === 'needs_cleaning') {
      roomStatus = 'OUT_OF_ORDER'
    } else if (roomCondition === 'maintenance_required') {
      roomStatus = 'MAINTENANCE'
    }

    await prisma.room.update({
      where: { id: reservation.room_id },
      data: { status: roomStatus }
    })

    // Create check-out record
    const checkOutRecord = await prisma.checkOut.create({
      data: {
        hotel_id: reservation.hotel_id,
        reservation_id: reservationId,
        guest_id: reservation.guest_id,
        room_id: reservation.room_id,
        check_out_time: new Date(),
        total_charges: totalCharges,
        key_cards_returned: keyCardsReturned || true,
        room_condition: roomCondition || 'needs_cleaning',
        notes: notes || '',
        checked_out_by: session.user?.email || 'system'
      }
    })

    return NextResponse.json({
      success: true,
      checkOut: checkOutRecord,
      totalCharges: totalCharges,
      message: 'Check-out procesado exitosamente'
    })

  } catch (error) {
    console.error('Error en check-out:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET - Get pending check-outs
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const pendingCheckOuts = await prisma.reservation.findMany({
      where: {
        check_out_date: {
          gte: today,
          lt: tomorrow
        },
        status: 'CHECKED_IN'
      },
      include: {
        guest: true,
        room: true
      },
      orderBy: {
        check_out_date: 'asc'
      }
    })

    return NextResponse.json({ checkOuts: pendingCheckOuts })

  } catch (error) {
    console.error('Error obteniendo check-outs pendientes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
