'use client'

import { useState } from 'react'
import { ShoppingCart, Plus, Minus, CreditCard, DollarSign, Receipt, Calculator, Trash2 } from 'lucide-react'

interface POSItem {
  id: string
  name: string
  price: number
  category: string
  stock: number
}

export default function POSPage() {
  const [cart, setCart] = useState<Array<POSItem & { quantity: number }>>([])
  const [loading, setLoading] = useState(false)

  const sampleItems: POSItem[] = [
    { id: '1', name: 'Agua', price: 2.50, category: 'Bebidas', stock: 50 },
    { id: '2', name: 'Refresco', price: 3.00, category: 'Bebidas', stock: 30 },
    { id: '3', name: 'Cerveza', price: 4.50, category: 'Bebidas', stock: 20 },
    { id: '4', name: 'Snack', price: 5.00, category: 'Comida', stock: 25 },
  ]

  const addToCart = (item: POSItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id)
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ))
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
    } else {
      setCart(cart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ))
    }
  }

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleCheckout = async () => {
    setLoading(true)
    try {
      // Simulate checkout process
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Venta procesada exitosamente!')
      setCart([])
    } catch (error) {
      alert('Error al procesar la venta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <ShoppingCart className="h-8 w-8 mr-2" />
          Punto de Venta (POS)
        </h1>
        <p className="text-gray-500">Sistema de ventas integrado</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productos */}
        <div className="lg:col-span-2">
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Productos Disponibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{item.name}</h3>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">Stock: {item.stock}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">${item.price}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Carrito */}
        <div>
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Receipt className="h-5 w-5 mr-2" />
              Carrito de Compras
            </h2>
            
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">El carrito está vacío</p>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-3">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">${item.price} c/u</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-xl font-bold">${getTotal().toFixed(2)}</span>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <CreditCard className="h-4 w-4 mr-2" />
                    )}
                    {loading ? 'Procesando...' : 'Procesar Venta'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}