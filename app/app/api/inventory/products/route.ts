
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

    // Filters
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {
      hotel_id: hotelId
    };

    if (category) {
      where.category_id = category;
    }

    if (type) {
      where.product_type = type;
    }

    if (status === 'low_stock') {
      where.current_stock = { lte: prisma.inventoryProduct.fields.reorder_point };
    } else if (status === 'out_of_stock') {
      where.current_stock = 0;
    } else if (status === 'active') {
      where.is_active = true;
    } else if (status === 'inactive') {
      where.is_active = false;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const products = await prisma.inventoryProduct.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true, code: true }
        },
        supplier: {
          select: { id: true, name: true, code: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(products);

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
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

    const product = await prisma.inventoryProduct.create({
      data: {
        ...data,
        hotel_id: hotelId,
        created_by: userId
      },
      include: {
        category: true,
        supplier: true
      }
    });

    // Create initial stock movement if initial stock > 0
    if (data.current_stock && data.current_stock > 0) {
      await prisma.stockMovement.create({
        data: {
          hotel_id: hotelId,
          product_id: product.id,
          movement_type: 'IN',
          quantity: data.current_stock,
          previous_stock: 0,
          new_stock: data.current_stock,
          unit_cost: data.cost_price,
          total_value: data.current_stock * data.cost_price,
          reference_type: 'ADJUSTMENT',
          reason: 'Initial stock',
          created_by: userId
        }
      });
    }

    return NextResponse.json(product);

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
