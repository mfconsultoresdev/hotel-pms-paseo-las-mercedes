import { NextRequest, NextResponse } from 'next/server'

// GET - Obtener datos del dashboard
export async function GET(request: NextRequest) {
  try {
    // Simulate API response without database dependency
    const dummyData = {
      hotel_stats: {
        total_rooms: 50,
        occupied_rooms: 35,
        available_rooms: 15,
        maintenance_rooms: 2,
        occupancy_rate: 70
      },
      guest_stats: {
        total_guests: 87,
        checked_in: 35,
        checked_out: 52,
        new_arrivals_today: 12,
        departures_today: 8
      },
      revenue_stats: {
        today_revenue: 2450.00,
        monthly_revenue: 45680.00,
        yearly_revenue: 487500.00,
        average_daily_rate: 120.00,
        revenue_per_available_room: 84.00
      },
      reservation_stats: {
        total_reservations: 156,
        confirmed_reservations: 142,
        pending_reservations: 8,
        cancelled_reservations: 6,
        no_show_reservations: 3
      },
      service_stats: {
        total_services: 89,
        completed_services: 76,
        pending_services: 8,
        in_progress_services: 5,
        service_rating: 4.8
      },
      housekeeping_stats: {
        total_tasks: 45,
        completed_tasks: 32,
        pending_tasks: 8,
        in_progress_tasks: 5,
        completion_rate: 71
      },
      recent_activities: [
        {
          id: '1',
          type: 'CHECK_IN',
          description: 'Juan Pérez se registró en la habitación 305',
          timestamp: '2024-07-26T14:30:00Z',
          user: 'Recepción'
        },
        {
          id: '2',
          type: 'SERVICE_REQUEST',
          description: 'Solicitud de servicio de habitación - Habitación 201',
          timestamp: '2024-07-26T14:15:00Z',
          user: 'Sistema'
        },
        {
          id: '3',
          type: 'PAYMENT',
          description: 'Pago procesado - $150.00 - Habitación 305',
          timestamp: '2024-07-26T13:45:00Z',
          user: 'Sistema'
        },
        {
          id: '4',
          type: 'MAINTENANCE',
          description: 'Tarea de mantenimiento completada - Habitación 102',
          timestamp: '2024-07-26T13:20:00Z',
          user: 'Mantenimiento'
        }
      ],
      alerts: [
        {
          id: '1',
          type: 'WARNING',
          title: 'Stock bajo de suministros',
          message: 'Detergente multiuso necesita reabastecimiento',
          priority: 'MEDIUM',
          timestamp: '2024-07-26T10:00:00Z'
        },
        {
          id: '2',
          type: 'INFO',
          title: 'Nueva reservación',
          message: 'Reservación confirmada para habitación 405',
          priority: 'LOW',
          timestamp: '2024-07-26T09:30:00Z'
        }
      ],
      charts_data: {
        occupancy_trend: [
          { date: '2024-07-20', occupancy: 65 },
          { date: '2024-07-21', occupancy: 70 },
          { date: '2024-07-22', occupancy: 68 },
          { date: '2024-07-23', occupancy: 72 },
          { date: '2024-07-24', occupancy: 75 },
          { date: '2024-07-25', occupancy: 73 },
          { date: '2024-07-26', occupancy: 70 }
        ],
        revenue_trend: [
          { date: '2024-07-20', revenue: 2100 },
          { date: '2024-07-21', revenue: 2300 },
          { date: '2024-07-22', revenue: 2200 },
          { date: '2024-07-23', revenue: 2400 },
          { date: '2024-07-24', revenue: 2500 },
          { date: '2024-07-25', revenue: 2350 },
          { date: '2024-07-26', revenue: 2450 }
        ]
      }
    }

    return NextResponse.json(dummyData)

  } catch (error) {
    console.error('Error obteniendo datos del dashboard:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}