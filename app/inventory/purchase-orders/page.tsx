import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, FileText, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function PurchaseOrdersPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Órdenes de Compra</h1>
          <p className="text-muted-foreground">
            Gestiona todas las órdenes de compra del hotel
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Orden
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar órdenes..."
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="draft">Borrador</SelectItem>
                <SelectItem value="submitted">Enviada</SelectItem>
                <SelectItem value="approved">Aprobada</SelectItem>
                <SelectItem value="ordered">Ordenada</SelectItem>
                <SelectItem value="received">Recibida</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Proveedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los proveedores</SelectItem>
                <SelectItem value="cleanco">CleanCo Supplies</SelectItem>
                <SelectItem value="textilepro">TextilePro</SelectItem>
                <SelectItem value="techequip">TechEquip Solutions</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Fecha Desde" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 días</SelectItem>
                <SelectItem value="30">Últimos 30 días</SelectItem>
                <SelectItem value="90">Últimos 90 días</SelectItem>
                <SelectItem value="custom">Personalizada</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar Por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Fecha</SelectItem>
                <SelectItem value="amount">Monto</SelectItem>
                <SelectItem value="status">Estado</SelectItem>
                <SelectItem value="supplier">Proveedor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Órdenes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">23</div>
            <p className="text-xs text-muted-foreground">
              Por aprobar/ordenar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Tránsito</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">18</div>
            <p className="text-xs text-muted-foreground">
              Ordenadas, por recibir
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$45,230</div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Órdenes de Compra</CardTitle>
          <CardDescription>
            Todas las órdenes de compra con su estado actual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Número PO</th>
                  <th className="text-left p-2">Proveedor</th>
                  <th className="text-left p-2">Fecha</th>
                  <th className="text-left p-2">Items</th>
                  <th className="text-left p-2">Total</th>
                  <th className="text-left p-2">Estado</th>
                  <th className="text-left p-2">Aprobación</th>
                  <th className="text-left p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {/* Sample data - will be replaced with real data */}
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <div className="font-medium">PO-1734567890-ABC12</div>
                    <div className="text-sm text-muted-foreground">Creada por: Admin</div>
                  </td>
                  <td className="p-2">
                    <div className="font-medium">CleanCo Supplies</div>
                    <div className="text-sm text-muted-foreground">Suministros de Limpieza</div>
                  </td>
                  <td className="p-2">
                    <div className="font-medium">15 Ago 2025</div>
                    <div className="text-sm text-muted-foreground">Entrega: 22 Ago</div>
                  </td>
                  <td className="p-2">
                    <div className="font-medium">8 items</div>
                    <div className="text-sm text-muted-foreground">Detergente, Jabón, etc.</div>
                  </td>
                  <td className="p-2">
                    <div className="font-medium">$1,250.00</div>
                    <div className="text-sm text-muted-foreground">Net 30</div>
                  </td>
                  <td className="p-2">
                    <Badge className="bg-green-100 text-green-800">Ordenada</Badge>
                  </td>
                  <td className="p-2">
                    <Badge className="bg-green-100 text-green-800">Aprobada</Badge>
                  </td>
                  <td className="p-2">
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">Ver</Button>
                      <Button variant="outline" size="sm">Recibir</Button>
                    </div>
                  </td>
                </tr>

                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <div className="font-medium">PO-1734567891-DEF34</div>
                    <div className="text-sm text-muted-foreground">Creada por: Manager</div>
                  </td>
                  <td className="p-2">
                    <div className="font-medium">TextilePro</div>
                    <div className="text-sm text-muted-foreground">Ropa de Cama</div>
                  </td>
                  <td className="p-2">
                    <div className="font-medium">14 Ago 2025</div>
                    <div className="text-sm text-muted-foreground">Entrega: 28 Ago</div>
                  </td>
                  <td className="p-2">
                    <div className="font-medium">5 items</div>
                    <div className="text-sm text-muted-foreground">Sábanas, Toallas, etc.</div>
                  </td>
                  <td className="p-2">
                    <div className="font-medium">$2,800.00</div>
                    <div className="text-sm text-muted-foreground">Net 45</div>
                  </td>
                  <td className="p-2">
                    <Badge className="bg-yellow-100 text-yellow-800">Enviada</Badge>
                  </td>
                  <td className="p-2">
                    <Badge className="bg-orange-100 text-orange-800">Pendiente</Badge>
                  </td>
                  <td className="p-2">
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">Ver</Button>
                      <Button variant="outline" size="sm">Aprobar</Button>
                    </div>
                  </td>
                </tr>

                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <div className="font-medium">PO-1734567892-GHI56</div>
                    <div className="text-sm text-muted-foreground">Creada por: Admin</div>
                  </td>
                  <td className="p-2">
                    <div className="font-medium">TechEquip Solutions</div>
                    <div className="text-sm text-muted-foreground">Equipamiento</div>
                  </td>
                  <td className="p-2">
                    <div className="font-medium">13 Ago 2025</div>
                    <div className="text-sm text-muted-foreground">Entrega: 20 Ago</div>
                  </td>
                  <td className="p-2">
                    <div className="font-medium">3 items</div>
                    <div className="text-sm text-muted-foreground">Tablets, Cámaras</div>
                  </td>
                  <td className="p-2">
                    <div className="font-medium">$8,500.00</div>
                    <div className="text-sm text-muted-foreground">Net 30</div>
                  </td>
                  <td className="p-2">
                    <Badge className="bg-blue-100 text-blue-800">Recibida</Badge>
                  </td>
                  <td className="p-2">
                    <Badge className="bg-green-100 text-green-800">Aprobada</Badge>
                  </td>
                  <td className="p-2">
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">Ver</Button>
                      <Button variant="outline" size="sm">Facturar</Button>
                    </div>
                  </td>
                </tr>

                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <div className="font-medium">PO-1734567893-JKL78</div>
                    <div className="text-sm text-muted-foreground">Creada por: Manager</div>
                  </td>
                  <td className="p-2">
                    <div className="font-medium">FoodService Pro</div>
                    <div className="text-sm text-muted-foreground">Suministros Cocina</div>
                  </td>
                  <td className="p-2">
                    <div className="font-medium">12 Ago 2025</div>
                    <div className="text-sm text-muted-foreground">Entrega: 25 Ago</div>
                  </td>
                  <td className="p-2">
                    <div className="font-medium">12 items</div>
                    <div className="text-sm text-muted-foreground">Utensilios, Vajilla</div>
                  </td>
                  <td className="p-2">
                    <div className="font-medium">$3,200.00</div>
                    <div className="text-sm text-muted-foreground">Net 30</div>
                  </td>
                  <td className="p-2">
                    <Badge className="bg-gray-100 text-gray-800">Borrador</Badge>
                  </td>
                  <td className="p-2">
                    <Badge className="bg-gray-100 text-gray-800">No Aplicable</Badge>
                  </td>
                  <td className="p-2">
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">Editar</Button>
                      <Button variant="outline" size="sm">Enviar</Button>
                    </div>
                  </td>
                </tr>

                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <div className="font-medium">PO-1734567894-MNO90</div>
                    <div className="text-sm text-muted-foreground">Creada por: Admin</div>
                  </td>
                  <td className="p-2">
                    <div className="font-medium">Maintenance Plus</div>
                    <div className="text-sm text-muted-foreground">Herramientas</div>
                  </td>
                  <td className="p-2">
                    <div className="font-medium">11 Ago 2025</div>
                    <div className="text-sm text-muted-foreground">Entrega: 18 Ago</div>
                  </td>
                  <td className="p-2">
                    <div className="font-medium">7 items</div>
                    <div className="text-sm text-muted-foreground">Herramientas, Repuestos</div>
                  </td>
                  <td className="p-2">
                    <div className="font-medium">$1,800.00</div>
                    <div className="text-sm text-muted-foreground">Net 30</div>
                  </td>
                  <td className="p-2">
                    <Badge className="bg-red-100 text-red-800">Cancelada</Badge>
                  </td>
                  <td className="p-2">
                    <Badge className="bg-red-100 text-red-800">Rechazada</Badge>
                  </td>
                  <td className="p-2">
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">Ver</Button>
                      <Button variant="outline" size="sm">Reactivar</Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>
            Últimas acciones en órdenes de compra
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Orden PO-1734567890-ABC12 recibida</p>
                <p className="text-sm text-muted-foreground">
                  CleanCo Supplies - 8 items recibidos por Admin
                </p>
              </div>
              <span className="text-sm text-muted-foreground">Hace 2 horas</span>
            </div>

            <div className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Nueva orden PO-1734567895-PQR12 creada</p>
                <p className="text-sm text-muted-foreground">
                  Office Supplies Co - 15 items por Manager
                </p>
              </div>
              <span className="text-sm text-muted-foreground">Hace 4 horas</span>
            </div>

            <div className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Orden PO-1734567891-DEF34 enviada para aprobación</p>
                <p className="text-sm text-muted-foreground">
                  TextilePro - Pendiente de aprobación por Admin
                </p>
              </div>
              <span className="text-sm text-muted-foreground">Hace 6 horas</span>
            </div>

            <div className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Orden PO-1734567892-GHI56 aprobada</p>
                <p className="text-sm text-muted-foreground">
                  TechEquip Solutions - Aprobada por Admin
                </p>
              </div>
              <span className="text-sm text-muted-foreground">Hace 1 día</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

