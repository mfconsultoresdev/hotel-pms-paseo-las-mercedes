
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: any;
  onSuccess: () => void;
}

export default function ProductFormDialog({ open, onOpenChange, product, onSuccess }: ProductFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    barcode: '',
    category_id: '',
    supplier_id: '',
    type: 'AMENITY',
    unit_type: 'UNIT',
    current_stock: 0,
    minimum_stock: 0,
    reorder_point: 0,
    reorder_quantity: 0,
    cost_price: 0,
    selling_price: 0,
    storage_location: '',
    shelf_life_days: 0,
    is_active: true
  });

  useEffect(() => {
    fetchCategories();
    fetchSuppliers();
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        sku: product.sku || '',
        barcode: product.barcode || '',
        category_id: product.category_id || '',
        supplier_id: product.supplier_id || '',
        type: product.type || 'AMENITY',
        unit_type: product.unit_type || 'UNIT',
        current_stock: product.current_stock || 0,
        minimum_stock: product.minimum_stock || 0,
        reorder_point: product.reorder_point || 0,
        reorder_quantity: product.reorder_quantity || 0,
        cost_price: product.cost_price || 0,
        selling_price: product.selling_price || 0,
        storage_location: product.storage_location || '',
        shelf_life_days: product.shelf_life_days || 0,
        is_active: product.is_active ?? true
      });
    }
  }, [product]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/inventory/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/inventory/suppliers');
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = product 
        ? `/api/inventory/products/${product.id}` 
        : '/api/inventory/products';
      
      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(product ? 'Producto actualizado' : 'Producto creado');
        onSuccess();
        onOpenChange(false);
        resetForm();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al guardar producto');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Error al guardar producto');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      sku: '',
      barcode: '',
      category_id: '',
      supplier_id: '',
      type: 'AMENITY',
      unit_type: 'UNIT',
      current_stock: 0,
      minimum_stock: 0,
      reorder_point: 0,
      reorder_quantity: 0,
      cost_price: 0,
      selling_price: 0,
      storage_location: '',
      shelf_life_days: 0,
      is_active: true
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Información Básica */}
            <div className="col-span-2">
              <h3 className="text-lg font-semibold mb-3">Información Básica</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="barcode">Código de Barras</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storage_location">Ubicación de Almacenamiento</Label>
              <Input
                id="storage_location"
                value={formData.storage_location}
                onChange={(e) => setFormData({ ...formData, storage_location: e.target.value })}
              />
            </div>

            {/* Clasificación */}
            <div className="col-span-2">
              <h3 className="text-lg font-semibold mb-3 mt-4">Clasificación</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Proveedor *</Label>
              <Select
                value={formData.supplier_id}
                onValueChange={(value) => setFormData({ ...formData, supplier_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((sup) => (
                    <SelectItem key={sup.id} value={sup.id}>
                      {sup.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Producto *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AMENITY">Amenidad</SelectItem>
                  <SelectItem value="FOOD">Alimento</SelectItem>
                  <SelectItem value="BEVERAGE">Bebida</SelectItem>
                  <SelectItem value="CLEANING">Limpieza</SelectItem>
                  <SelectItem value="MAINTENANCE">Mantenimiento</SelectItem>
                  <SelectItem value="EQUIPMENT">Equipamiento</SelectItem>
                  <SelectItem value="OTHER">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit_type">Unidad de Medida *</Label>
              <Select
                value={formData.unit_type}
                onValueChange={(value) => setFormData({ ...formData, unit_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UNIT">Unidad</SelectItem>
                  <SelectItem value="KG">Kilogramo</SelectItem>
                  <SelectItem value="LITER">Litro</SelectItem>
                  <SelectItem value="BOX">Caja</SelectItem>
                  <SelectItem value="PACK">Paquete</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Control de Stock */}
            <div className="col-span-2">
              <h3 className="text-lg font-semibold mb-3 mt-4">Control de Stock</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_stock">Stock Actual</Label>
              <Input
                id="current_stock"
                type="number"
                step="0.01"
                value={formData.current_stock}
                onChange={(e) => setFormData({ ...formData, current_stock: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimum_stock">Stock Mínimo</Label>
              <Input
                id="minimum_stock"
                type="number"
                step="0.01"
                value={formData.minimum_stock}
                onChange={(e) => setFormData({ ...formData, minimum_stock: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reorder_point">Punto de Reorden</Label>
              <Input
                id="reorder_point"
                type="number"
                step="0.01"
                value={formData.reorder_point}
                onChange={(e) => setFormData({ ...formData, reorder_point: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reorder_quantity">Cantidad de Reorden</Label>
              <Input
                id="reorder_quantity"
                type="number"
                step="0.01"
                value={formData.reorder_quantity}
                onChange={(e) => setFormData({ ...formData, reorder_quantity: parseFloat(e.target.value) || 0 })}
              />
            </div>

            {/* Precios */}
            <div className="col-span-2">
              <h3 className="text-lg font-semibold mb-3 mt-4">Precios</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost_price">Precio de Costo</Label>
              <Input
                id="cost_price"
                type="number"
                step="0.01"
                value={formData.cost_price}
                onChange={(e) => setFormData({ ...formData, cost_price: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="selling_price">Precio de Venta</Label>
              <Input
                id="selling_price"
                type="number"
                step="0.01"
                value={formData.selling_price}
                onChange={(e) => setFormData({ ...formData, selling_price: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shelf_life_days">Vida Útil (días)</Label>
              <Input
                id="shelf_life_days"
                type="number"
                value={formData.shelf_life_days}
                onChange={(e) => setFormData({ ...formData, shelf_life_days: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {product ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
