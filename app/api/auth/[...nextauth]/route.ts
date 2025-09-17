import { NextRequest, NextResponse } from 'next/server'

// GET - Handle authentication requests
export async function GET(request: NextRequest) {
  try {
    // Simulate authentication response without NextAuth dependency
    const dummyResponse = {
      success: true,
      message: 'Authentication endpoint available',
      providers: ['credentials']
    }

    return NextResponse.json(dummyResponse)

  } catch (error) {
    console.error('Error en autenticación:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Handle authentication requests
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Simulate authentication without NextAuth dependency
    if (email && password) {
      const dummyResponse = {
        success: true,
        user: {
          id: '1',
          email,
          name: 'Usuario Demo',
          hotelId: '1'
        },
        message: 'Autenticación exitosa'
      }

      return NextResponse.json(dummyResponse)
    } else {
      return NextResponse.json(
        { error: 'Credenciales requeridas' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error en autenticación:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}