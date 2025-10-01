
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

    const { searchParams } = new URL(request.url);
    const hotelId = session.user.hotelId;
    const status = searchParams.get('status');

    const where: any = { hotel_id: hotelId };

    if (status) {
      where.status = status;
    }

    const purchaseOrders = await prisma.purchaseOrder.findMany({
      where,
      include: {
        supplier: {
          select: { id: true, name: true, code: true }
        },
        items: {
          include: {
            product: {
              select: { id: true, name: true, sku: true }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json(purchaseOrders);

  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchase orders' },
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

    // Generate PO number
    const lastPO = await prisma.purchaseOrder.findFirst({
      where: { hotel_id: hotelId },
      orderBy: { created_at: 'desc' }
    });

    let poNumber = 'PO-0001';
    if (lastPO?.po_number) {
      const lastNumber = parseInt(lastPO.po_number.split('-')[1]);
      poNumber = `PO-${String(lastNumber + 1).padStart(4, '0')}`;
    }

    const { items, ...poData } = data;

    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        ...poData,
        po_number: poNumber,
        hotel_id: hotelId,
        created_by: userId,
        items: {
          create: items?.map((item: any, index: number) => ({
            ...item,
            line_number: index + 1
          })) || []
        }
      },
      include: {
        supplier: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    return NextResponse.json(purchaseOrder);

  } catch (error) {
    console.error('Error creating purchase order:', error);
    return NextResponse.json(
      { error: 'Failed to create purchase order' },
      { status: 500 }
    );
  }
}
