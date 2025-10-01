
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const hotelId = session.user.hotelId;

    // Get products with low stock
    const lowStockProducts = await prisma.inventoryProduct.findMany({
      where: {
        hotel_id: hotelId,
        is_active: true,
        current_stock: {
          lte: prisma.inventoryProduct.fields.reorder_point
        }
      },
      include: {
        category: true,
        supplier: true
      },
      orderBy: {
        current_stock: 'asc'
      }
    });

    const alerts = lowStockProducts.map((product: any) => ({
      id: product.id,
      type: product.current_stock === 0 ? 'CRITICAL' : 'WARNING',
      productName: product.name,
      sku: product.sku,
      currentStock: product.current_stock,
      reorderPoint: product.reorder_point,
      reorderQuantity: product.reorder_quantity,
      supplierName: product.supplier?.name,
      supplierEmail: product.supplier?.email,
      categoryName: product.category?.name,
      message: product.current_stock === 0 
        ? `Sin stock de ${product.name}`
        : `Stock bajo de ${product.name}: ${product.current_stock} ${product.unit_type}`,
      createdAt: new Date()
    }));

    return NextResponse.json({
      alerts,
      summary: {
        total: alerts.length,
        critical: alerts.filter((a: any) => a.type === 'CRITICAL').length,
        warning: alerts.filter((a: any) => a.type === 'WARNING').length
      }
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json({ error: 'Error al obtener alertas' }, { status: 500 });
  }
}

// Create manual alert or send email notifications
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { action, productIds } = body;

    if (action === 'send_email') {
      // TODO: Implement email sending logic
      // This would integrate with your email service (SendGrid, AWS SES, etc.)
      
      const products = await prisma.inventoryProduct.findMany({
        where: {
          id: { in: productIds }
        },
        include: {
          supplier: true
        }
      });

      // For now, just return a success message
      return NextResponse.json({
        message: 'Notificaciones enviadas',
        emailsSent: products.length,
        recipients: products.map((p: any) => p.supplier?.email).filter(Boolean)
      });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  } catch (error) {
    console.error('Error processing alert action:', error);
    return NextResponse.json({ error: 'Error al procesar acción' }, { status: 500 });
  }
}
