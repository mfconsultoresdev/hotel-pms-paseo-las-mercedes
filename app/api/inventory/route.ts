import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/inventory - Get inventory dashboard data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { hotel: true }
    });

    if (!user?.hotel_id) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }

    // Get inventory summary data
    const [
      totalItems,
      lowStockItems,
      criticalItems,
      totalValue,
      categories,
      recentMovements
    ] = await Promise.all([
      // Total inventory items
      prisma.inventoryItem.count({
        where: { hotel_id: user.hotel_id, is_active: true }
      }),
      
      // Items below minimum stock
      prisma.inventoryItem.count({
        where: {
          hotel_id: user.hotel_id,
          is_active: true,
          current_stock: { lt: prisma.inventoryItem.fields.min_stock }
        }
      }),
      
      // Critical items
      prisma.inventoryItem.count({
        where: {
          hotel_id: user.hotel_id,
          is_active: true,
          is_critical: true
        }
      }),
      
      // Total inventory value
      prisma.inventoryItem.aggregate({
        where: { hotel_id: user.hotel_id, is_active: true },
        _sum: { total_value: true }
      }),
      
      // Categories with item counts
      prisma.inventoryCategory.findMany({
        where: { hotel_id: user.hotel_id, is_active: true },
        include: {
          _count: { select: { items: true } }
        },
        orderBy: { sort_order: 'asc' }
      }),
      
      // Recent inventory movements
      prisma.inventoryMovement.findMany({
        where: { hotel_id: user.hotel_id },
        include: {
          item: { select: { name: true, sku: true } },
          staff: { select: { first_name: true, last_name: true } }
        },
        orderBy: { created_at: 'desc' },
        take: 10
      })
    ]);

    const dashboardData = {
      summary: {
        totalItems,
        lowStockItems,
        criticalItems,
        totalValue: totalValue._sum.total_value || 0
      },
      categories,
      recentMovements
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching inventory dashboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/inventory - Create new inventory item
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { hotel: true }
    });

    if (!user?.hotel_id) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      name,
      description,
      sku,
      barcode,
      unit,
      size,
      brand,
      model,
      category_id,
      supplier_id,
      min_stock,
      max_stock,
      reorder_point,
      unit_cost,
      storage_location,
      storage_area,
      is_critical
    } = body;

    // Validate required fields
    if (!name || !unit || !unit_cost) {
      return NextResponse.json(
        { error: 'Name, unit, and unit cost are required' },
        { status: 400 }
      );
    }

    // Check if SKU already exists
    if (sku) {
      const existingItem = await prisma.inventoryItem.findFirst({
        where: {
          hotel_id: user.hotel_id,
          sku: sku
        }
      });

      if (existingItem) {
        return NextResponse.json(
          { error: 'SKU already exists' },
          { status: 400 }
        );
      }
    }

    // Create inventory item
    const inventoryItem = await prisma.inventoryItem.create({
      data: {
        hotel_id: user.hotel_id,
        name,
        description,
        sku,
        barcode,
        unit,
        size,
        brand,
        model,
        category_id: category_id || null,
        supplier_id: supplier_id || null,
        min_stock: min_stock || 0,
        max_stock: max_stock || 0,
        reorder_point: reorder_point || 0,
        unit_cost,
        total_value: 0, // Will be calculated based on current stock
        storage_location,
        storage_area,
        is_critical: is_critical || false,
        created_by: user.id,
        updated_by: user.id
      }
    });

    return NextResponse.json(inventoryItem, { status: 201 });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

