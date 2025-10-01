'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Star, Edit, Building2 } from 'lucide-react';
import SupplierFormDialog from '@/components/inventory/supplier-form-dialog';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    filterSuppliers();
  }, [searchTerm, suppliers]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inventory/suppliers');
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data);
        setFilteredSuppliers(data);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSuppliers = () => {
    if (!searchTerm) {
      setFilteredSuppliers(suppliers);
      return;
    }

    const filtered = suppliers.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSuppliers(filtered);
  };

  const handleEdit = (supplier: any) => {
    setSelectedSupplier(supplier);
    setFormOpen(true);
  };

  const handleNew = () => {
    setSelectedSupplier(null);
    setFormOpen(true);
  };

  const handleSuccess = () => {
    fetchSuppliers();
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getPaymentTermsLabel = (terms: string) => {
    const labels: Record<string, string> = {
      IMMEDIATE: 'Inmediato',
      NET_15: '15 días',
      NET_30: '30 días',
      NET_45: '45 días',
      NET_60: '60 días',
      NET_90: '90 días'
    };
    return labels[terms] || terms;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Proveedores</h1>
          <p className="text-muted-foreground">Gestión de proveedores</p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Proveedor
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Proveedores ({filteredSuppliers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Cargando proveedores...</p>
            </div>
          ) : filteredSuppliers.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No se encontraron proveedores</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Código</th>
                    <th className="text-left p-3 font-semibold">Nombre</th>
                    <th className="text-left p-3 font-semibold">Contacto</th>
                    <th className="text-left p-3 font-semibold">Email</th>
                    <th className="text-left p-3 font-semibold">Teléfono</th>
                    <th className="text-left p-3 font-semibold">Términos</th>
                    <th className="text-left p-3 font-semibold">Calificación</th>
                    <th className="text-left p-3 font-semibold">Productos</th>
                    <th className="text-center p-3 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSuppliers.map((supplier) => (
                    <tr key={supplier.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-mono text-sm">{supplier.code}</td>
                      <td className="p-3">
                        <span className="font-medium">{supplier.name}</span>
                        {supplier.city && (
                          <div className="text-sm text-muted-foreground">
                            {supplier.city}
                          </div>
                        )}
                      </td>
                      <td className="p-3">{supplier.contact_name || '-'}</td>
                      <td className="p-3 text-sm">{supplier.email || '-'}</td>
                      <td className="p-3 text-sm">{supplier.phone || '-'}</td>
                      <td className="p-3">
                        {getPaymentTermsLabel(supplier.payment_terms)}
                      </td>
                      <td className="p-3">
                        {renderStars(supplier.rating)}
                      </td>
                      <td className="p-3">
                        <span className="text-sm font-medium">
                          {supplier._count?.products || 0}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(supplier)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <SupplierFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        supplier={selectedSupplier}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
