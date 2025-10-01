'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Plus, FileText, Package } from 'lucide-react';
import PurchaseOrderFormDialog from '@/components/inventory/purchase-order-form-dialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const response = await fetch(`/api/inventory/purchase-orders?${params}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    fetchOrders();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: any }> = {
      DRAFT: { label: 'Borrador', variant: 'secondary' },
      SENT: { label: 'Enviada', variant: 'default' },
      CONFIRMED: { label: 'Confirmada', variant: 'outline' },
      RECEIVED: { label: 'Recibida', variant: 'default' },
      CANCELLED: { label: 'Cancelada', variant: 'destructive' }
    };

    const config = statusConfig[status] || { label: status, variant: 'secondary' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
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
          <h1 className="text-3xl font-bold">Órdenes de Compra</h1>
          <p className="text-muted-foreground">Gestión de órdenes de compra</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Orden
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="DRAFT">Borrador</SelectItem>
                <SelectItem value="SENT">Enviada</SelectItem>
                <SelectItem value="CONFIRMED">Confirmada</SelectItem>
                <SelectItem value="RECEIVED">Recibida</SelectItem>
                <SelectItem value="CANCELLED">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Órdenes ({orders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Cargando órdenes...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No se encontraron órdenes</p>
              <Button className="mt-4" onClick={() => setFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Primera Orden
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Número</th>
                    <th className="text-left p-3 font-semibold">Proveedor</th>
                    <th className="text-left p-3 font-semibold">Fecha</th>
                    <th className="text-left p-3 font-semibold">Entrega Esperada</th>
                    <th className="text-left p-3 font-semibold">Items</th>
                    <th className="text-left p-3 font-semibold">Total</th>
                    <th className="text-left p-3 font-semibold">Términos</th>
                    <th className="text-left p-3 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono font-medium">{order.order_number}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{order.supplier?.name || '-'}</div>
                          <div className="text-sm text-muted-foreground">
                            {order.supplier?.code || ''}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        {format(new Date(order.order_date), 'dd MMM yyyy', { locale: es })}
                      </td>
                      <td className="p-3">
                        {order.expected_delivery_date
                          ? format(new Date(order.expected_delivery_date), 'dd MMM yyyy', { locale: es })
                          : '-'}
                      </td>
                      <td className="p-3">
                        <span className="font-medium">{order.items?.length || 0}</span>
                        <span className="text-sm text-muted-foreground"> items</span>
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="font-semibold">${order.total_amount.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">
                            + ${order.tax_amount.toFixed(2)} IVA
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        {getPaymentTermsLabel(order.payment_terms)}
                      </td>
                      <td className="p-3">
                        {getStatusBadge(order.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <PurchaseOrderFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
