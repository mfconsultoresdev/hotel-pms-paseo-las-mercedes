'use client'

import { useState, useEffect } from 'react'
import { 
  Package, 
  Search,
  Plus,
  AlertTriangle,
  Truck,
  Edit,
  TrendingDown,
  TrendingUp,
  Box,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'

interface Supply {
  id: string
  name: string
  description: string
  category: string
  unit_type: string
  current_stock: number
  minimum_stock: number
  maximum_stock: number
  unit_cost: number
  supplier_name: string
  supplier_contact: string
  brand: string
  is_active: boolean
  needs_reorder: boolean
  storage_location: string
  created_at: string
}

const categoryLabels: Record<string, string> = {
  CLEANING: 'Productos de Limpieza',
  LINENS: 'Ropa de Cama y Toallas',
  AMENITIES: 'Amenidades',
  MAINTENANCE: 'Mantenimiento',
  OTHER: 'Otros'
}

export default function HousekeepingSuppliesPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [supplies, setSupplies] = useState<Supply[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStock, setFilterStock] = useState('all')

  useEffect(() => {
    fetchSupplies()
  }, [])

  const fetchSupplies = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const dummySupplies: Supply[] = [
        {
          id: '1',
          name: 'Detergente Multiuso',
          description: 'Detergente concentrado para limpieza general',
          category: 'CLEANING',
          unit_type: 'litro',
          current_stock: 15,
          minimum_stock: 20,
          maximum_stock: 50,
          unit_cost: 8500,
          supplier_name: 'Productos Químicos S.A.',
          supplier_contact: '+57 300 123 4567',
          brand: 'CleanPro',
          is_active: true,
          needs_reorder: true,
          storage_location: 'Almacén A - Estante 1',
          created_at: '2024-07-01'
        },
        {
          id: '2',
          name: 'Toallas de Baño',
          description: 'Toallas blancas de algodón 100%',
          category: 'LINENS',
          unit_type: 'unidad',
          current_stock: 45,
          minimum_stock: 30,
          maximum_stock: 100,
          unit_cost: 25000,
          supplier_name: 'Textiles del Norte',
          supplier_contact: '+57 300 234 5678',
          brand: 'SoftTouch',
          is_active: true,
          needs_reorder: false,
          storage_location: 'Almacén B - Estante 3',
          created_at: '2024-07-02'
        },
        {
          id: '3',
          name: 'Shampoo de Amenidades',
          description: 'Shampoo para huéspedes en botella pequeña',
          category: 'AMENITIES',
          unit_type: 'botella',
          current_stock: 8,
          minimum_stock: 25,
          maximum_stock: 80,
          unit_cost: 3200,
          supplier_name: 'Amenidades Premium',
          supplier_contact: '+57 300 345 6789',
          brand: 'LuxuryCare',
          is_active: true,
          needs_reorder: true,
          storage_location: 'Almacén A - Estante 2',
          created_at: '2024-07-03'
        },
        {
          id: '4',
          name: 'Bombillas LED',
          description: 'Bombillas LED 9W para habitaciones',
          category: 'MAINTENANCE',
          unit_type: 'unidad',
          current_stock: 35,
          minimum_stock: 20,
          maximum_stock: 60,
          unit_cost: 15000,
          supplier_name: 'Iluminación Total',
          supplier_contact: '+57 300 456 7890',
          brand: 'BrightLED',
          is_active: true,
          needs_reorder: false,
          storage_location: 'Almacén C - Estante 1',
          created_at: '2024-07-04'
        }
      ]
      
      setSupplies(dummySupplies)
    } catch (error) {
      setError('Error al cargar los suministros')
    } finally {
      setLoading(false)
    }
  }

  const filteredSupplies = supplies.filter(supply => {
    const matchesSearch = supply.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supply.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supply.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || supply.category === filterCategory
    const matchesStock = filterStock === 'all' || 
                        (filterStock === 'low' && supply.needs_reorder) ||
                        (filterStock === 'normal' && !supply.needs_reorder)
    
    return matchesSearch && matchesCategory && matchesStock
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'CLEANING': return 'bg-blue-100 text-blue-800'
      case 'LINENS': return 'bg-green-100 text-green-800'
      case 'AMENITIES': return 'bg-purple-100 text-purple-800'
      case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStockStatusColor = (supply: Supply) => {
    if (supply.needs_reorder) return 'bg-red-100 text-red-800'
    if (supply.current_stock <= supply.minimum_stock * 1.2) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getStockStatusLabel = (supply: Supply) => {
    if (supply.needs_reorder) return 'Bajo Stock'
    if (supply.current_stock <= supply.minimum_stock * 1.2) return 'Stock Medio'
    return 'Stock Adecuado'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount)
  }

  const totalValue = supplies.reduce((sum, supply) => sum + (supply.current_stock * supply.unit_cost), 0)
  const lowStockCount = supplies.filter(s => s.needs_reorder).length

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Cargando suministros...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Gestión de Suministros</h1>
            <p className="text-gray-600">Control de inventario de productos de limpieza y amenidades</p>
          </div>
          <Link
            href="/housekeeping/supplies/new"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Suministro
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Productos</p>
              <p className="text-2xl font-bold text-gray-900">{supplies.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bajo Stock</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Box className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categorías</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(supplies.map(s => s.category)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas</option>
              <option value="CLEANING">Productos de Limpieza</option>
              <option value="LINENS">Ropa de Cama y Toallas</option>
              <option value="AMENITIES">Amenidades</option>
              <option value="MAINTENANCE">Mantenimiento</option>
              <option value="OTHER">Otros</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado de Stock</label>
            <select
              value={filterStock}
              onChange={(e) => setFilterStock(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="low">Bajo Stock</option>
              <option value="normal">Stock Normal</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterCategory('all')
                setFilterStock('all')
              }}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Supplies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSupplies.map((supply) => (
          <div key={supply.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold">{supply.name}</h3>
                  <p className="text-sm text-gray-600">{supply.brand}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(supply.category)}`}>
                    {categoryLabels[supply.category]}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(supply)}`}>
                  {getStockStatusLabel(supply)}
                </span>
                {supply.needs_reorder && (
                  <Truck className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <p className="text-sm text-gray-600">{supply.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Stock Actual:</span>
                  <p className="font-semibold">{supply.current_stock} {supply.unit_type}</p>
                </div>
                <div>
                  <span className="text-gray-500">Stock Mínimo:</span>
                  <p className="font-semibold">{supply.minimum_stock} {supply.unit_type}</p>
                </div>
                <div>
                  <span className="text-gray-500">Precio Unitario:</span>
                  <p className="font-semibold">{formatCurrency(supply.unit_cost)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Ubicación:</span>
                  <p className="font-semibold text-xs">{supply.storage_location}</p>
                </div>
              </div>
            </div>

            {/* Stock Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Stock Actual</span>
                <span>{Math.round((supply.current_stock / supply.maximum_stock) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    supply.needs_reorder ? 'bg-red-500' : 
                    supply.current_stock <= supply.minimum_stock * 1.2 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((supply.current_stock / supply.maximum_stock) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Supplier Info */}
            <div className="mb-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Proveedor</h4>
              <p className="text-sm text-gray-600">{supply.supplier_name}</p>
              <p className="text-xs text-gray-500">{supply.supplier_contact}</p>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Link
                href={`/housekeeping/supplies/${supply.id}`}
                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors text-center text-sm flex items-center justify-center"
              >
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Link>
              {supply.needs_reorder && (
                <Link
                  href={`/housekeeping/supplies/${supply.id}/reorder`}
                  className="flex-1 bg-orange-600 text-white py-2 px-3 rounded-md hover:bg-orange-700 transition-colors text-center text-sm flex items-center justify-center"
                >
                  <Truck className="h-4 w-4 mr-1" />
                  Reordenar
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredSupplies.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron suministros</h3>
          <p className="text-gray-600">No hay productos que coincidan con los filtros aplicados.</p>
        </div>
      )}

      {/* Low Stock Alert */}
      {lowStockCount > 0 && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Alert: {lowStockCount} producto{lowStockCount > 1 ? 's' : ''} con stock bajo
              </h3>
              <p className="text-sm text-red-700">
                Se recomienda realizar pedidos de reabastecimiento para estos productos.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}