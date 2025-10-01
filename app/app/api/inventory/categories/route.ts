
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

    const categories = await prisma.inventoryCategory.findMany({
      where: { hotel_id: hotelId },
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { display_order: 'asc' }
    });

    return NextResponse.json(categories);

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
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

    const category = await prisma.inventoryCategory.create({
      data: {
        ...data,
        hotel_id: hotelId,
        created_by: userId
      }
    });

    return NextResponse.json(category);

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
