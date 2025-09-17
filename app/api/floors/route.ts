import { NextRequest, NextResponse } from 'next/server'

// GET - Obtener pisos
export async function GET(request: NextRequest) {
  try {
    // Simulate API response without database dependency
    const dummyData = {
      floors: [
        {
          id: 'floor-1',
          floor_number: 1,
          name: 'Planta Baja',
          description: 'Recepción, restaurante y servicios principales',
          total_rooms: 10,
          available_rooms: 3,
          occupied_rooms: 6,
          maintenance_rooms: 1,
          room_types: ['STANDARD', 'SUITE'],
          amenities: ['Elevator', 'Restaurant', 'Reception'],
          status: 'ACTIVE',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-07-26T10:00:00Z'
        },
        {
          id: 'floor-2',
          floor_number: 2,
          name: 'Segundo Piso',
          description: 'Habitaciones estándar y suites',
          total_rooms: 15,
          available_rooms: 8,
          occupied_rooms: 6,
          maintenance_rooms: 1,
          room_types: ['STANDARD', 'DELUXE', 'SUITE'],
          amenities: ['Elevator', 'Vending Machine'],
          status: 'ACTIVE',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-07-26T10:00:00Z'
        },
        {
          id: 'floor-3',
          floor_number: 3,
          name: 'Tercer Piso',
          description: 'Habitaciones premium y suites ejecutivas',
          total_rooms: 12,
          available_rooms: 4,
          occupied_rooms: 7,
          maintenance_rooms: 1,
          room_types: ['DELUXE', 'SUITE', 'PRESIDENTIAL'],
          amenities: ['Elevator', 'Executive Lounge'],
          status: 'ACTIVE',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-07-26T10:00:00Z'
        },
        {
          id: 'floor-4',
          floor_number: 4,
          name: 'Cuarto Piso',
          description: 'Habitaciones familiares y suites',
          total_rooms: 8,
          available_rooms: 2,
          occupied_rooms: 5,
          maintenance_rooms: 1,
          room_types: ['FAMILY', 'SUITE'],
          amenities: ['Elevator', 'Playground'],
          status: 'ACTIVE',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-07-26T10:00:00Z'
        }
      ],
      summary: {
        total_floors: 4,
        total_rooms: 45,
        available_rooms: 17,
        occupied_rooms: 24,
        maintenance_rooms: 4,
        occupancy_rate: 58.5
      }
    }

    return NextResponse.json(dummyData)

  } catch (error) {
    console.error('Error obteniendo pisos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear piso
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { floor_number, name, description, room_types, amenities } = body

    if (!floor_number || !name) {
      return NextResponse.json(
        { error: 'Número de piso y nombre son requeridos' },
        { status: 400 }
      )
    }

    // Simulate creation without database dependency
    const dummyResponse = {
      success: true,
      floor: {
        id: `floor-${Date.now()}`,
        floor_number,
        name,
        description: description || '',
        total_rooms: 0,
        available_rooms: 0,
        occupied_rooms: 0,
        maintenance_rooms: 0,
        room_types: room_types || [],
        amenities: amenities || [],
        status: 'ACTIVE',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      message: 'Piso creado exitosamente'
    }

    return NextResponse.json(dummyResponse)

  } catch (error) {
    console.error('Error creando piso:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}