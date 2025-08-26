import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Building2, AlertTriangle, Wrench, DollarSign } from 'lucide-react';

export default function AssetsPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activos Fijos</h1>
          <p className="text-muted-foreground">
            Gestiona equipamiento, mobiliario y activos del hotel
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Activo
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
                placeholder="Buscar activos..."
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="equipment">Equipamiento</SelectItem>
                <SelectItem value="furniture">Mobiliario</SelectItem>
                <SelectItem value="electronics">Electrónicos</SelectItem>
                <SelectItem value="vehicles">Vehículos</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="maintenance">En Mantenimiento</SelectItem>
                <SelectItem value="retired">Retirado</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Condición" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las condiciones</SelectItem>
                <SelectItem value="excellent">Excelente</SelectItem>
                <SelectItem value="good">Buena</SelectItem>
                <SelectItem value="fair">Regular</SelectItem>
                <SelectItem value="poor">Mala</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Ubicación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las ubicaciones</SelectItem>
                <SelectItem value="lobby">Lobby</SelectItem>
                <SelectItem value="rooms">Habitaciones</SelectItem>
                <SelectItem value="kitchen">Cocina</SelectItem>
                <SelectItem value="maintenance">Mantenimiento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activos</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">
              Activos registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Mantenimiento</CardTitle>
            <Wrench className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">12</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mantenimiento Próximo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">8</div>
            <p className="text-xs text-muted-foreground">
              En los próximos 7 días
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$125,450</div>
            <p className="text-xs text-muted-foreground">
              Valor de los activos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample Asset Cards */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Aire Acondicionado Central</CardTitle>
                <CardDescription>Equipamiento HVAC</CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800">Activo</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Tag:</span> AC-001
              </div>
              <div>
                <span className="font-medium">Ubicación:</span> Techo
              </div>
              <div>
                <span className="font-medium">Condición:</span> 
                <Badge variant="outline" className="ml-1">Buena</Badge>
              </div>
              <div>
                <span className="font-medium">Valor:</span> $8,500
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Próximo mantenimiento: 15 días
                </span>
                <Button variant="outline" size="sm">Ver Detalles</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Mesa de Recepción</CardTitle>
                <CardDescription>Mobiliario de Lobby</CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800">Activo</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Tag:</span> MR-002
              </div>
              <div>
                <span className="font-medium">Ubicación:</span> Lobby
              </div>
              <div>
                <span className="font-medium">Condición:</span> 
                <Badge variant="outline" className="ml-1">Excelente</Badge>
              </div>
              <div>
                <span className="font-medium">Valor:</span> $2,300
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Asignado a: Recepción
                </span>
                <Button variant="outline" size="sm">Ver Detalles</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Lavadora Industrial</CardTitle>
                <CardDescription>Equipamiento de Lavandería</CardDescription>
              </div>
              <Badge className="bg-orange-100 text-orange-800">Mantenimiento</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Tag:</span> LI-003
              </div>
              <div>
                <span className="font-medium">Ubicación:</span> Lavandería
              </div>
              <div>
                <span className="font-medium">Condición:</span> 
                <Badge variant="outline" className="ml-1">Regular</Badge>
              </div>
              <div>
                <span className="font-medium">Valor:</span> $12,000
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-orange-600 font-medium">
                  En mantenimiento desde: 2 días
                </span>
                <Button variant="outline" size="sm">Ver Detalles</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Sistema de Seguridad</CardTitle>
                <CardDescription>Electrónicos de Seguridad</CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800">Activo</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Tag:</span> SS-004
              </div>
              <div>
                <span className="font-medium">Ubicación:</span> Oficina Seguridad
              </div>
              <div>
                <span className="font-medium">Condición:</span> 
                <Badge variant="outline" className="ml-1">Buena</Badge>
              </div>
              <div>
                <span className="font-medium">Valor:</span> $15,750
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Próximo mantenimiento: 45 días
                </span>
                <Button variant="outline" size="sm">Ver Detalles</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Cocina Industrial</CardTitle>
                <CardDescription>Equipamiento de Cocina</CardDescription>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Mantenimiento Próximo</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Tag:</span> CI-005
              </div>
              <div>
                <span className="font-medium">Ubicación:</span> Cocina Principal
              </div>
              <div>
                <span className="font-medium">Condición:</span> 
                <Badge variant="outline" className="ml-1">Buena</Badge>
              </div>
              <div>
                <span className="font-medium">Valor:</span> $28,500
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-yellow-600 font-medium">
                  Mantenimiento en: 3 días
                </span>
                <Button variant="outline" size="sm">Ver Detalles</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Vehículo de Servicio</CardTitle>
                <CardDescription>Vehículo de Mantenimiento</CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800">Activo</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Tag:</span> VS-006
              </div>
              <div>
                <span className="font-medium">Ubicación:</span> Estacionamiento
              </div>
              <div>
                <span className="font-medium">Condición:</span> 
                <Badge variant="outline" className="ml-1">Excelente</Badge>
              </div>
              <div>
                <span className="font-medium">Valor:</span> $35,000
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Asignado a: Mantenimiento
                </span>
                <Button variant="outline" size="sm">Ver Detalles</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

