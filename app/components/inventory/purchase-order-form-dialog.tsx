
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
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface PurchaseOrderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function PurchaseOrderFormDialog({ open, onOpenChange, onSuccess }: PurchaseOrderFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    supplier_id: '',
    expected_delivery_date: '',
    payment_terms: 'NET_30',
    notes: '',
    shipping_address: '',
    status: 'DRAFT'
  });
  const [items, setItems] = useState<any[]>([
    { product_id: '', quantity: 0, unit_price: 0, tax_rate: 16 }
  ]);

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
  }, []);

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

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/inventory/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addItem = () => {
    setItems([...items, { product_id: '', quantity: 0, unit_price: 0, tax_rate: 16 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-fill price when product is selected
    if (field === 'product_id') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].unit_price = product.cost_price;
      }
    }
    
    setItems(newItems);
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalTax = 0;

    items.forEach(item => {
      const itemSubtotal = item.quantity * item.unit_price;
      const itemTax = itemSubtotal * (item.tax_rate / 100);
      subtotal += itemSubtotal;
      totalTax += itemTax;
    });

    return {
      subtotal,
      totalTax,
      total: subtotal + totalTax
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0 || items.some(item => !item.product_id || item.quantity <= 0)) {
      toast.error('Debe agregar al menos un producto con cantidad válida');
      return;
    }

    setLoading(true);

    try {
      const totals = calculateTotals();
      
      const response = await fetch('/api/inventory/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: items,
          subtotal: totals.subtotal,
          tax_amount: totals.totalTax,
          total_amount: totals.total
        })
      });

      if (response.ok) {
        toast.success('Orden de compra creada');
        onSuccess();
        onOpenChange(false);
        resetForm();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al crear orden');
      }
    } catch (error) {
      console.error('Error creating purchase order:', error);
      toast.error('Error al crear orden de compra');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      supplier_id: '',
      expected_delivery_date: '',
      payment_terms: 'NET_30',
      notes: '',
      shipping_address: '',
      status: 'DRAFT'
    });
    setItems([{ product_id: '', quantity: 0, unit_price: 0, tax_rate: 16 }]);
  };

  const totals = calculateTotals();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Orden de Compra</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Información del Proveedor */}
            <div className="col-span-2">
              <h3 className="text-lg font-semibold mb-3">Información de la Orden</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Proveedor *</Label>
              <Select
                value={formData.supplier_id}
                onValueChange={(value) => setFormData({ ...formData, supplier_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((sup) => (
                    <SelectItem key={sup.id} value={sup.id}>
                      {sup.name} ({sup.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expected_delivery_date">Fecha de Entrega Esperada</Label>
              <Input
                id="expected_delivery_date"
                type="date"
                value={formData.expected_delivery_date}
                onChange={(e) => setFormData({ ...formData, expected_delivery_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_terms">Términos de Pago</Label>
              <Select
                value={formData.payment_terms}
                onValueChange={(value) => setFormData({ ...formData, payment_terms: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IMMEDIATE">Inmediato</SelectItem>
                  <SelectItem value="NET_15">15 días</SelectItem>
                  <SelectItem value="NET_30">30 días</SelectItem>
                  <SelectItem value="NET_45">45 días</SelectItem>
                  <SelectItem value="NET_60">60 días</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Borrador</SelectItem>
                  <SelectItem value="SENT">Enviada</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="shipping_address">Dirección de Envío</Label>
              <Textarea
                id="shipping_address"
                value={formData.shipping_address}
                onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                rows={2}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
              />
            </div>
          </div>

          {/* Items de la Orden */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Productos</h3>
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Producto
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3">Producto</th>
                    <th className="text-left p-3 w-24">Cantidad</th>
                    <th className="text-left p-3 w-32">Precio Unit.</th>
                    <th className="text-left p-3 w-24">IVA %</th>
                    <th className="text-right p-3 w-32">Subtotal</th>
                    <th className="w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => {
                    const subtotal = item.quantity * item.unit_price;
                    return (
                      <tr key={index} className="border-b">
                        <td className="p-3">
                          <Select
                            value={item.product_id}
                            onValueChange={(value) => updateItem(index, 'product_id', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((prod) => (
                                <SelectItem key={prod.id} value={prod.id}>
                                  {prod.name} ({prod.sku})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            step="0.01"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            step="0.01"
                            value={item.unit_price}
                            onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            step="0.01"
                            value={item.tax_rate}
                            onChange={(e) => updateItem(index, 'tax_rate', parseFloat(e.target.value) || 0)}
                          />
                        </td>
                        <td className="p-3 text-right">
                          ${subtotal.toFixed(2)}
                        </td>
                        <td className="p-3 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                            disabled={items.length === 1}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-muted font-semibold">
                  <tr>
                    <td colSpan={4} className="p-3 text-right">Subtotal:</td>
                    <td className="p-3 text-right">${totals.subtotal.toFixed(2)}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="p-3 text-right">IVA:</td>
                    <td className="p-3 text-right">${totals.totalTax.toFixed(2)}</td>
                    <td></td>
                  </tr>
                  <tr className="text-lg">
                    <td colSpan={4} className="p-3 text-right">Total:</td>
                    <td className="p-3 text-right">${totals.total.toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear Orden
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
