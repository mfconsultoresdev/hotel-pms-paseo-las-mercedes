
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

    // Get total products count
    const totalProducts = await prisma.inventoryProduct.count({
      where: { hotel_id: hotelId, is_active: true }
    });

    // Get low stock items
    const lowStockItems = await prisma.inventoryProduct.count({
      where: {
        hotel_id: hotelId,
        is_active: true,
        OR: [
          { current_stock: { lte: prisma.inventoryProduct.fields.minimum_stock } },
          { needs_reorder: true }
        ]
      }
    });

    // Get total inventory value
    const inventoryValue = await prisma.inventoryProduct.aggregate({
      where: { hotel_id: hotelId, is_active: true },
      _sum: {
        current_stock: true
      }
    });

    // Get pending purchase orders
    const pendingPOs = await prisma.purchaseOrder.count({
      where: {
        hotel_id: hotelId,
        status: { in: ['DRAFT', 'SENT', 'CONFIRMED'] }
      }
    });

    // Get recent stock movements
    const recentMovements = await prisma.stockMovement.findMany({
      where: { hotel_id: hotelId },
      orderBy: { created_at: 'desc' },
      take: 10,
      include: {
        product: {
          select: { name: true, sku: true }
        }
      }
    });

    // Get products by category
    const productsByCategory = await prisma.inventoryProduct.groupBy({
      by: ['product_type'],
      where: { hotel_id: hotelId, is_active: true },
      _count: { id: true }
    });

    // Get top suppliers
    const topSuppliers = await prisma.supplier.findMany({
      where: { hotel_id: hotelId, is_active: true },
      take: 5,
      orderBy: { rating: 'desc' },
      select: {
        id: true,
        name: true,
        rating: true,
        _count: {
          select: { products: true, purchase_orders: true }
        }
      }
    });

    // Get low stock products details
    const lowStockProducts = await prisma.inventoryProduct.findMany({
      where: {
        hotel_id: hotelId,
        is_active: true,
        current_stock: { lte: prisma.inventoryProduct.fields.reorder_point }
      },
      take: 10,
      orderBy: { current_stock: 'asc' },
      select: {
        id: true,
        name: true,
        sku: true,
        current_stock: true,
        minimum_stock: true,
        reorder_point: true,
        unit_type: true
      }
    });

    return NextResponse.json({
      stats: {
        totalProducts,
        lowStockItems,
        inventoryValue: inventoryValue._sum.current_stock || 0,
        pendingPOs
      },
      recentMovements,
      productsByCategory,
      topSuppliers,
      lowStockProducts
    });

  } catch (error) {
    console.error('Error fetching inventory dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory dashboard data' },
      { status: 500 }
    );
  }
}
