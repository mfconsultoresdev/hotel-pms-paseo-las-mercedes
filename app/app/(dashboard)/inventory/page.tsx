'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Package,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Plus
} from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
  stats: {
    totalProducts: number;
    lowStockItems: number;
    inventoryValue: number;
    pendingPOs: number;
  };
  recentMovements: any[];
  productsByCategory: any[];
  topSuppliers: any[];
  lowStockProducts: any[];
}

export default function InventoryPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/inventory/dashboard');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sistema de Inventario</h1>
          <p className="text-muted-foreground">Gestión de productos, proveedores y compras</p>
        </div>
        <div className="flex gap-2">
          <Link href="/inventory/products">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ver Productos
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">Productos activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{data?.stats.lowStockItems || 0}</div>
            <p className="text-xs text-muted-foreground">Requieren reorden</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Inventario</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(data?.stats.inventoryValue || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Valor total en stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órdenes Pendientes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats.pendingPOs || 0}</div>
            <p className="text-xs text-muted-foreground">Órdenes de compra</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="lowstock">Stock Bajo</TabsTrigger>
          <TabsTrigger value="movements">Movimientos Recientes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Productos por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data?.productsByCategory && data.productsByCategory.length > 0 ? (
                  data.productsByCategory.map((cat: any) => (
                    <div key={cat.product_type} className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">
                        {cat.product_type.replace(/_/g, ' ').toLowerCase()}
                      </span>
                      <span className="text-sm text-muted-foreground">{cat._count.id} productos</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No hay productos registrados</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lowstock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Productos con Stock Bajo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data?.lowStockProducts && data.lowStockProducts.length > 0 ? (
                  data.lowStockProducts.map((product: any) => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {product.current_stock} {product.unit_type}
                        </p>
                        <p className="text-xs text-orange-500">
                          Mínimo: {product.minimum_stock}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No hay productos con stock bajo</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Movimientos Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data?.recentMovements && data.recentMovements.length > 0 ? (
                  data.recentMovements.map((movement: any) => (
                    <div
                      key={movement.id}
                      className="flex justify-between items-center p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        {movement.movement_type === 'IN' ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium">{movement.product.name}</p>
                          <p className="text-sm text-muted-foreground">{movement.movement_type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{movement.quantity}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(movement.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No hay movimientos recientes</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/inventory/products">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center justify-center p-6">
              <Package className="h-8 w-8 mr-3 text-primary" />
              <div>
                <p className="font-semibold">Gestionar Productos</p>
                <p className="text-sm text-muted-foreground">Ver todos los productos</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/inventory/suppliers">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center justify-center p-6">
              <ShoppingCart className="h-8 w-8 mr-3 text-primary" />
              <div>
                <p className="font-semibold">Proveedores</p>
                <p className="text-sm text-muted-foreground">Gestionar proveedores</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/inventory/purchase-orders">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center justify-center p-6">
              <DollarSign className="h-8 w-8 mr-3 text-primary" />
              <div>
                <p className="font-semibold">Órdenes de Compra</p>
                <p className="text-sm text-muted-foreground">Ver órdenes</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
