import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Building2, Star, Phone, Mail, Globe } from 'lucide-react';

export default function SuppliersPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proveedores</h1>
          <p className="text-muted-foreground">
            Gestiona proveedores y relaciones comerciales
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Proveedor
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
                placeholder="Buscar proveedores..."
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Preferidos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="preferred">Preferidos</SelectItem>
                <SelectItem value="regular">Regulares</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los ratings</SelectItem>
                <SelectItem value="5">5 estrellas</SelectItem>
                <SelectItem value="4">4+ estrellas</SelectItem>
                <SelectItem value="3">3+ estrellas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proveedores</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              Proveedores registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proveedores Activos</CardTitle>
            <Building2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">25</div>
            <p className="text-xs text-muted-foreground">
              Con relaciones activas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proveedores Preferidos</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">8</div>
            <p className="text-xs text-muted-foreground">
              Con rating alto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órdenes Este Mes</CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">156</div>
            <p className="text-xs text-muted-foreground">
              Órdenes de compra
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample Supplier Cards */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">CleanCo Supplies</CardTitle>
                <CardDescription>Suministros de Limpieza</CardDescription>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">4.8</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>contact@cleanco.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>www.cleanco.com</span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center mb-2">
                <Badge className="bg-green-100 text-green-800">Activo</Badge>
                <Badge className="bg-yellow-100 text-yellow-800">Preferido</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <div>Términos: Net 30</div>
                <div>Límite de crédito: $25,000</div>
                <div>Total items: 45</div>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">Ver Detalles</Button>
                <Button variant="outline" size="sm" className="flex-1">Nueva Orden</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">TextilePro</CardTitle>
                <CardDescription>Ropa de Cama y Textiles</CardDescription>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">4.6</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>+1 (555) 987-6543</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>sales@textilepro.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>www.textilepro.com</span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center mb-2">
                <Badge className="bg-green-100 text-green-800">Activo</Badge>
                <Badge variant="outline">Regular</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <div>Términos: Net 45</div>
                <div>Límite de crédito: $15,000</div>
                <div>Total items: 23</div>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">Ver Detalles</Button>
                <Button variant="outline" size="sm" className="flex-1">Nueva Orden</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">TechEquip Solutions</CardTitle>
                <CardDescription>Equipamiento Tecnológico</CardDescription>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">4.9</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>+1 (555) 456-7890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>info@techequip.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>www.techequip.com</span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center mb-2">
                <Badge className="bg-green-100 text-green-800">Activo</Badge>
                <Badge className="bg-yellow-100 text-yellow-800">Preferido</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <div>Términos: Net 30</div>
                <div>Límite de crédito: $50,000</div>
                <div>Total items: 67</div>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">Ver Detalles</Button>
                <Button variant="outline" size="sm" className="flex-1">Nueva Orden</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">FoodService Pro</CardTitle>
                <CardDescription>Suministros de Cocina</CardDescription>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">4.4</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>+1 (555) 321-0987</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>orders@foodservicepro.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>www.foodservicepro.com</span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center mb-2">
                <Badge className="bg-green-100 text-green-800">Activo</Badge>
                <Badge variant="outline">Regular</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <div>Términos: Net 30</div>
                <div>Límite de crédito: $20,000</div>
                <div>Total items: 34</div>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">Ver Detalles</Button>
                <Button variant="outline" size="sm" className="flex-1">Nueva Orden</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Maintenance Plus</CardTitle>
                <CardDescription>Herramientas y Repuestos</CardDescription>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">4.7</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>+1 (555) 654-3210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>service@maintenanceplus.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>www.maintenanceplus.com</span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center mb-2">
                <Badge className="bg-green-100 text-green-800">Activo</Badge>
                <Badge className="bg-yellow-100 text-yellow-800">Preferido</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <div>Términos: Net 30</div>
                <div>Límite de crédito: $30,000</div>
                <div>Total items: 89</div>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">Ver Detalles</Button>
                <Button variant="outline" size="sm" className="flex-1">Nueva Orden</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Office Supplies Co</CardTitle>
                <CardDescription>Suministros de Oficina</CardDescription>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">4.3</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>+1 (555) 789-0123</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>sales@officesupplies.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>www.officesupplies.com</span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center mb-2">
                <Badge className="bg-green-100 text-green-800">Activo</Badge>
                <Badge variant="outline">Regular</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <div>Términos: Net 30</div>
                <div>Límite de crédito: $10,000</div>
                <div>Total items: 56</div>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">Ver Detalles</Button>
                <Button variant="outline" size="sm" className="flex-1">Nueva Orden</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

