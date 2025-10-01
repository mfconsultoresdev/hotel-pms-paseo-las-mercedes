
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
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'rotation';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let start = startDate ? new Date(startDate) : new Date();
    start.setDate(start.getDate() - 30); // Default last 30 days

    let end = endDate ? new Date(endDate) : new Date();

    switch (reportType) {
      case 'rotation':
        return await getRotationReport(hotelId, start, end);
      case 'consumption':
        return await getConsumptionReport(hotelId, start, end);
      case 'stock_value':
        return await getStockValueReport(hotelId);
      case 'low_stock':
        return await getLowStockReport(hotelId);
      case 'projections':
        return await getProjectionsReport(hotelId);
      default:
        return NextResponse.json({ error: 'Tipo de reporte no válido' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Error al generar reporte' }, { status: 500 });
  }
}

async function getRotationReport(hotelId: string, startDate: Date, endDate: Date) {
  // Get stock movements within date range
  const movements = await prisma.stockMovement.findMany({
    where: {
      hotel_id: hotelId,
      movement_date: {
        gte: startDate,
        lte: endDate
      },
      movement_type: 'OUT'
    },
    include: {
      product: {
        include: {
          category: true
        }
      }
    }
  });

  // Calculate rotation by product
  const rotationByProduct = movements.reduce((acc: Record<string, any>, mov: any) => {
    const productId = mov.product_id;
    if (!acc[productId]) {
      acc[productId] = {
        product: mov.product,
        totalOut: 0,
        totalValue: 0,
        movements: 0
      };
    }
    acc[productId].totalOut += mov.quantity;
    acc[productId].totalValue += mov.value || 0;
    acc[productId].movements += 1;
    return acc;
  }, {});

  const report = Object.values(rotationByProduct).sort((a: any, b: any) => (b as any).totalOut - (a as any).totalOut);

  return NextResponse.json({
    reportType: 'rotation',
    dateRange: { start: startDate, end: endDate },
    data: report,
    summary: {
      totalProducts: report.length,
      totalMovements: movements.length,
      totalValue: movements.reduce((sum: number, m: any) => sum + (m.value || 0), 0)
    }
  });
}

async function getConsumptionReport(hotelId: string, startDate: Date, endDate: Date) {
  const consumptions = await prisma.consumptionRecord.findMany({
    where: {
      hotel_id: hotelId,
      consumption_date: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      product: {
        include: {
          category: true
        }
      }
    }
  });

  // Group by product
  const byProduct = consumptions.reduce((acc: Record<string, any>, cons: any) => {
    const productId = cons.product_id;
    if (!acc[productId]) {
      acc[productId] = {
        product: cons.product,
        totalQuantity: 0,
        totalCost: 0,
        totalRevenue: 0,
        count: 0
      };
    }
    acc[productId].totalQuantity += cons.quantity;
    acc[productId].totalCost += cons.unit_cost * cons.quantity;
    acc[productId].totalRevenue += cons.billable_amount || 0;
    acc[productId].count += 1;
    return acc;
  }, {});

  // Group by category
  const byCategory = consumptions.reduce((acc: Record<string, any>, cons: any) => {
    const categoryName = cons.product?.category?.name || 'Sin categoría';
    if (!acc[categoryName]) {
      acc[categoryName] = {
        category: categoryName,
        totalCost: 0,
        totalRevenue: 0,
        count: 0
      };
    }
    acc[categoryName].totalCost += cons.unit_cost * cons.quantity;
    acc[categoryName].totalRevenue += cons.billable_amount || 0;
    acc[categoryName].count += 1;
    return acc;
  }, {});

  return NextResponse.json({
    reportType: 'consumption',
    dateRange: { start: startDate, end: endDate },
    byProduct: Object.values(byProduct),
    byCategory: Object.values(byCategory),
    summary: {
      totalConsumptions: consumptions.length,
      totalCost: consumptions.reduce((sum: number, c: any) => sum + (c.unit_cost * c.quantity), 0),
      totalRevenue: consumptions.reduce((sum: number, c: any) => sum + (c.billable_amount || 0), 0)
    }
  });
}

async function getStockValueReport(hotelId: string) {
  const products = await prisma.inventoryProduct.findMany({
    where: {
      hotel_id: hotelId,
      is_active: true
    },
    include: {
      category: true,
      supplier: true
    }
  });

  // Calculate total value by category
  const byCategory = products.reduce((acc: Record<string, any>, prod: any) => {
    const categoryName = prod.category?.name || 'Sin categoría';
    if (!acc[categoryName]) {
      acc[categoryName] = {
        category: categoryName,
        totalValue: 0,
        totalItems: 0,
        products: []
      };
    }
    const value = prod.current_stock * prod.cost_price;
    acc[categoryName].totalValue += value;
    acc[categoryName].totalItems += 1;
    acc[categoryName].products.push({
      name: prod.name,
      sku: prod.sku,
      stock: prod.current_stock,
      unitPrice: prod.cost_price,
      totalValue: value
    });
    return acc;
  }, {});

  const totalValue = products.reduce((sum: number, p: any) => sum + (p.current_stock * p.cost_price), 0);

  return NextResponse.json({
    reportType: 'stock_value',
    generatedAt: new Date(),
    byCategory: Object.values(byCategory),
    topProducts: products
      .map((p: any) => ({
        name: p.name,
        sku: p.sku,
        stock: p.current_stock,
        unitPrice: p.cost_price,
        totalValue: p.current_stock * p.cost_price
      }))
      .sort((a: any, b: any) => b.totalValue - a.totalValue)
      .slice(0, 10),
    summary: {
      totalProducts: products.length,
      totalValue: totalValue
    }
  });
}

async function getLowStockReport(hotelId: string) {
  const products = await prisma.inventoryProduct.findMany({
    where: {
      hotel_id: hotelId,
      is_active: true,
      OR: [
        {
          current_stock: {
            lte: prisma.inventoryProduct.fields.reorder_point
          }
        }
      ]
    },
    include: {
      category: true,
      supplier: true
    },
    orderBy: {
      current_stock: 'asc'
    }
  });

  const criticalStock = products.filter((p: any) => p.current_stock === 0);
  const lowStock = products.filter((p: any) => p.current_stock > 0 && p.current_stock <= p.reorder_point);

  return NextResponse.json({
    reportType: 'low_stock',
    generatedAt: new Date(),
    criticalStock: criticalStock.map((p: any) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      currentStock: p.current_stock,
      reorderPoint: p.reorder_point,
      reorderQuantity: p.reorder_quantity,
      supplier: p.supplier?.name,
      category: p.category?.name
    })),
    lowStock: lowStock.map((p: any) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      currentStock: p.current_stock,
      reorderPoint: p.reorder_point,
      reorderQuantity: p.reorder_quantity,
      supplier: p.supplier?.name,
      category: p.category?.name
    })),
    summary: {
      totalCritical: criticalStock.length,
      totalLow: lowStock.length,
      totalAffected: products.length
    }
  });
}

async function getProjectionsReport(hotelId: string) {
  // Get consumption data from last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const consumptions = await prisma.consumptionRecord.findMany({
    where: {
      hotel_id: hotelId,
      consumption_date: {
        gte: thirtyDaysAgo
      }
    },
    include: {
      product: true
    }
  });

  // Calculate daily average consumption per product
  const consumptionByProduct = consumptions.reduce((acc: Record<string, any>, cons: any) => {
    const productId = cons.product_id;
    if (!acc[productId]) {
      acc[productId] = {
        product: cons.product,
        totalQuantity: 0,
        occurrences: 0
      };
    }
    acc[productId].totalQuantity += cons.quantity;
    acc[productId].occurrences += 1;
    return acc;
  }, {});

  // Get current stock for all products
  const products = await prisma.inventoryProduct.findMany({
    where: {
      hotel_id: hotelId,
      is_active: true
    },
    include: {
      category: true
    }
  });

  // Calculate projections
  const projections = products.map((product: any) => {
    const consumption = consumptionByProduct[product.id];
    const dailyAverage = consumption ? consumption.totalQuantity / 30 : 0;
    const daysUntilReorder = dailyAverage > 0 
      ? Math.floor((product.current_stock - product.reorder_point) / dailyAverage)
      : 999;
    const daysUntilEmpty = dailyAverage > 0 
      ? Math.floor(product.current_stock / dailyAverage)
      : 999;

    return {
      name: product.name,
      sku: product.sku,
      currentStock: product.current_stock,
      reorderPoint: product.reorder_point,
      dailyAverage: dailyAverage,
      daysUntilReorder: daysUntilReorder,
      daysUntilEmpty: daysUntilEmpty,
      projectedReorderDate: dailyAverage > 0 && daysUntilReorder > 0
        ? new Date(Date.now() + daysUntilReorder * 24 * 60 * 60 * 1000)
        : null,
      category: product.category?.name || 'Sin categoría'
    };
  });

  // Sort by urgency (days until reorder)
  projections.sort((a: any, b: any) => a.daysUntilReorder - b.daysUntilReorder);

  return NextResponse.json({
    reportType: 'projections',
    generatedAt: new Date(),
    analysisperiod: '30 días',
    projections: projections,
    urgentReorders: projections.filter((p: any) => p.daysUntilReorder <= 7 && p.daysUntilReorder > 0),
    summary: {
      totalProducts: projections.length,
      urgentReorders: projections.filter((p: any) => p.daysUntilReorder <= 7 && p.daysUntilReorder > 0).length
    }
  });
}
