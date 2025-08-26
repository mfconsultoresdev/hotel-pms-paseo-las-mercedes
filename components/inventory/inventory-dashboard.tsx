'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Building2, 
  Truck, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InventoryDashboardProps {
  hotelId: string;
}

interface InventorySummary {
  totalItems: number;
  lowStockItems: number;
  criticalItems: number;
  totalValue: number;
}

interface InventoryCategory {
  id: string;
  name: string;
  color: string;
  _count: {
    items: number;
  };
}

interface InventoryMovement {
  id: string;
  movement_type: string;
  quantity: number;
  total_value: number;
  created_at: string;
  item: {
    name: string;
    sku: string;
  };
  staff: {
    first_name: string;
    last_name: string;
  };
}

export default function InventoryDashboard({ hotelId }: InventoryDashboardProps) {
  const [summary, setSummary] = useState<InventorySummary | null>(null);
  const [categories, setCategories] = useState<InventoryCategory[]>([]);
  const [recentMovements, setRecentMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inventory');
      if (response.ok) {
        const data = await response.json();
        setSummary(data.summary);
        setCategories(data.categories);
        setRecentMovements(data.recentMovements);
      }
    } catch (error) {
      console.error('Error fetching inventory dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'IN':
        return 'bg-green-100 text-green-800';
      case 'OUT':
        return 'bg-red-100 text-red-800';
      case 'TRANSFER':
        return 'bg-blue-100 text-blue-800';
      case 'ADJUSTMENT':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMovementTypeIcon = (type: string) => {
    switch (type) {
      case 'IN':
        return '↗️';
      case 'OUT':
        return '↘️';
      case 'TRANSFER':
        return '↔️';
      case 'ADJUSTMENT':
        return '⚖️';
      default:
        return '📦';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario del Hotel</h1>
          <p className="text-muted-foreground">
            Gestión completa de inventario, activos y proveedores
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Item
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalItems || 0}</div>
            <p className="text-xs text-muted-foreground">
              Items en inventario
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {summary?.lowStockItems || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Requieren reorden
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {summary?.criticalItems || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Necesitan atención inmediata
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${(summary?.totalValue || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor del inventario
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
          <TabsTrigger value="movements">Movimientos</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Categories Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Categorías de Inventario
                </CardTitle>
                <CardDescription>
                  Distribución de items por categoría
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color || '#6b7280' }}
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <Badge variant="secondary">
                      {category._count.items} items
                    </Badge>
                  </div>
                ))}
                {categories.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No hay categorías configuradas
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recent Movements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Movimientos Recientes
                </CardTitle>
                <CardDescription>
                  Últimas transacciones de inventario
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentMovements.map((movement) => (
                  <div key={movement.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getMovementTypeIcon(movement.movement_type)}</span>
                      <div>
                        <p className="font-medium text-sm">{movement.item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {movement.staff.first_name} {movement.staff.last_name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getMovementTypeColor(movement.movement_type)}>
                        {movement.movement_type}
                      </Badge>
                      <p className="text-sm font-medium">
                        {movement.quantity} x ${movement.total_value}
                      </p>
                    </div>
                  </div>
                ))}
                {recentMovements.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No hay movimientos recientes
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Categorías</CardTitle>
              <CardDescription>
                Organiza tu inventario en categorías lógicas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Buscar categorías..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="active">Activas</SelectItem>
                    <SelectItem value="inactive">Inactivas</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Categoría
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories
                  .filter(cat => 
                    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (selectedCategory === 'all' || 
                     (selectedCategory === 'active' && cat._count.items > 0) ||
                     (selectedCategory === 'inactive' && cat._count.items === 0))
                  )
                  .map((category) => (
                    <Card key={category.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color || '#6b7280' }}
                          />
                          <Badge variant="outline">
                            {category._count.items} items
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Categoría de inventario
                        </p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Movimientos</CardTitle>
              <CardDescription>
                Registro completo de transacciones de inventario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMovements.map((movement) => (
                  <div key={movement.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <span className="text-2xl">{getMovementTypeIcon(movement.movement_type)}</span>
                        <Badge className={`mt-1 ${getMovementTypeColor(movement.movement_type)}`}>
                          {movement.movement_type}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-medium">{movement.item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          SKU: {movement.item.sku}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Por: {movement.staff.first_name} {movement.staff.last_name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        Cantidad: {movement.quantity}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Valor: ${movement.total_value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(movement.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Alertas del Sistema
              </CardTitle>
              <CardDescription>
                Notificaciones importantes sobre tu inventario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {summary?.lowStockItems && summary.lowStockItems > 0 && (
                  <div className="flex items-center gap-3 p-4 border border-orange-200 rounded-lg bg-orange-50">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <div>
                      <h4 className="font-medium text-orange-800">
                        {summary.lowStockItems} items con stock bajo
                      </h4>
                      <p className="text-sm text-orange-600">
                        Revisa estos items y considera hacer un reorden
                      </p>
                    </div>
                    <Button size="sm" variant="outline" className="ml-auto">
                      Ver Items
                    </Button>
                  </div>
                )}

                {summary?.criticalItems && summary.criticalItems > 0 && (
                  <div className="flex items-center gap-3 p-4 border border-red-200 rounded-lg bg-red-50">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium text-red-800">
                        {summary.criticalItems} items críticos
                      </p>
                      <p className="text-sm text-red-600">
                        Stock muy bajo - requiere atención inmediata
                      </p>
                    </div>
                  </div>
                )}

                {(!summary?.lowStockItems || summary.lowStockItems === 0) && 
                 (!summary?.criticalItems || summary.criticalItems === 0) && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-green-800 mb-2">
                      ¡Todo en orden!
                    </h3>
                    <p className="text-green-600">
                      No hay alertas pendientes en tu inventario
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
