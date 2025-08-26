import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Package, AlertTriangle } from 'lucide-react';

export default function InventoryItemsPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Items de Inventario</h1>
          <p className="text-muted-foreground">
            Gestiona todos los items de tu inventario hotelero
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Item
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar items..."
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="limpieza">Limpieza</SelectItem>
                <SelectItem value="ropa">Ropa de Cama</SelectItem>
                <SelectItem value="amenidades">Amenidades</SelectItem>
                <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Proveedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los proveedores</SelectItem>
                <SelectItem value="supplier1">Proveedor 1</SelectItem>
                <SelectItem value="supplier2">Proveedor 2</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="ok">Stock OK</SelectItem>
                <SelectItem value="low">Stock Bajo</SelectItem>
                <SelectItem value="critical">Crítico</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              +12% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">23</div>
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
            <div className="text-2xl font-bold text-red-600">7</div>
            <p className="text-xs text-muted-foreground">
              Necesitan atención
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$45,230</div>
            <p className="text-xs text-muted-foreground">
              Valor del inventario
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Items</CardTitle>
          <CardDescription>
            Todos los items de inventario con su información detallada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Item</th>
                  <th className="text-left p-2">SKU</th>
                  <th className="text-left p-2">Categoría</th>
                  <th className="text-left p-2">Stock</th>
                  <th className="text-left p-2">Precio</th>
                  <th className="text-left p-2">Estado</th>
                  <th className="text-left p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {/* Sample data - will be replaced with real data */}
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <div>
                      <div className="font-medium">Jabón de Baño Premium</div>
                      <div className="text-sm text-muted-foreground">Proveedor: CleanCo</div>
                    </div>
                  </td>
                  <td className="p-2">JB-001</td>
                  <td className="p-2">
                    <Badge variant="outline">Amenidades</Badge>
                  </td>
                  <td className="p-2">
                    <div>
                      <div className="font-medium">150</div>
                      <div className="text-sm text-muted-foreground">Min: 50</div>
                    </div>
                  </td>
                  <td className="p-2">$2.50</td>
                  <td className="p-2">
                    <Badge className="bg-green-100 text-green-800">OK</Badge>
                  </td>
                  <td className="p-2">
                    <Button variant="outline" size="sm">Editar</Button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <div>
                      <div className="font-medium">Sábanas de Algodón</div>
                      <div className="text-sm text-muted-foreground">Proveedor: TextilePro</div>
                    </div>
                  </td>
                  <td className="p-2">SB-002</td>
                  <td className="p-2">
                    <Badge variant="outline">Ropa de Cama</Badge>
                  </td>
                  <td className="p-2">
                    <div>
                      <div className="font-medium">25</div>
                      <div className="text-sm text-muted-foreground">Min: 30</div>
                    </div>
                  </td>
                  <td className="p-2">$15.00</td>
                  <td className="p-2">
                    <Badge className="bg-orange-100 text-orange-800">Bajo</Badge>
                  </td>
                  <td className="p-2">
                    <Button variant="outline" size="sm">Editar</Button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <div>
                      <div className="font-medium">Detergente Industrial</div>
                      <div className="text-sm text-muted-foreground">Proveedor: CleanCo</div>
                    </div>
                  </td>
                  <td className="p-2">DT-003</td>
                  <td className="p-2">
                    <Badge variant="outline">Limpieza</Badge>
                  </td>
                  <td className="p-2">
                    <div>
                      <div className="font-medium">5</div>
                      <div className="text-sm text-muted-foreground">Min: 20</div>
                    </div>
                  </td>
                  <td className="p-2">$8.75</td>
                  <td className="p-2">
                    <Badge className="bg-red-100 text-red-800">Crítico</Badge>
                  </td>
                  <td className="p-2">
                    <Button variant="outline" size="sm">Editar</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

