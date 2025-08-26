import React from 'react';
import InventoryDashboard from '@/components/inventory/inventory-dashboard';

export default function InventoryPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <InventoryDashboard hotelId="default" />
    </div>
  );
}

