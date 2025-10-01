
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.hotelId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hotelId = session.user.hotelId;

    const suppliers = await prisma.supplier.findMany({
      where: { hotel_id: hotelId },
      include: {
        _count: {
          select: {
            products: true,
            purchase_orders: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(suppliers);

  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suppliers' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.hotelId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hotelId = session.user.hotelId;
    const userId = session.user.id;
    const data = await request.json();

    const supplier = await prisma.supplier.create({
      data: {
        ...data,
        hotel_id: hotelId,
        created_by: userId
      }
    });

    return NextResponse.json(supplier);

  } catch (error) {
    console.error('Error creating supplier:', error);
    return NextResponse.json(
      { error: 'Failed to create supplier' },
      { status: 500 }
    );
  }
}
