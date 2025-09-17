'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, CreditCard, DollarSign, Receipt, Check } from 'lucide-react'
import Link from 'next/link'

interface Invoice {
  id: string
  invoice_number: string
  total_amount: number
  currency: string
  guest?: {
    first_name: string
    last_name: string
    email: string
  }
  payments: Array<{
    amount: number
    status: string
  }>
}

interface PaymentMethod {
  id: string
  name: string
  type: string
  code: string
  fee_type: string
  fee_amount: number
  fee_percentage: number
  min_amount?: number
  max_amount?: number
  description: string
  is_active: boolean
}

export default function NewPaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const invoiceId = searchParams.get('invoice_id')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  
  const [formData, setFormData] = useState({
    payment_method_id: '',
    amount: 0,
    reference: '',
    notes: '',
    payment_date: new Date().toISOString().split('T')[0],
    processed_by: ''
  })

  const [processingFee, setProcessingFee] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice()
    }
    fetchPaymentMethods()
  }, [invoiceId])

  useEffect(() => {
    calculateTotals()
  }, [formData.amount, formData.payment_method_id, paymentMethods])

  const fetchInvoice = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setInvoice({
        id: invoiceId!,
        invoice_number: 'INV-2024-001',
        total_amount: 250.00,
        currency: 'USD',
        guest: {
          first_name: 'Juan',
          last_name: 'Pérez',
          email: 'juan@example.com'
        },
        payments: [
          { amount: 50.00, status: 'completed' }
        ]
      })
    } catch (error) {
      setError('Error al cargar la factura')
    }
  }

  const fetchPaymentMethods = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setPaymentMethods([
        {
          id: '1',
          name: 'Efectivo',
          type: 'cash',
          code: 'CASH',
          fee_type: 'none',
          fee_amount: 0,
          fee_percentage: 0,
          description: 'Pago en efectivo',
          is_active: true
        },
        {
          id: '2',
          name: 'Tarjeta de Crédito',
          type: 'card',
          code: 'CREDIT_CARD',
          fee_type: 'percentage',
          fee_amount: 0,
          fee_percentage: 3.5,
          min_amount: 1,
          max_amount: 10000,
          description: 'Pago con tarjeta de crédito',
          is_active: true
        },
        {
          id: '3',
          name: 'Transferencia Bancaria',
          type: 'bank_transfer',
          code: 'BANK_TRANSFER',
          fee_type: 'fixed',
          fee_amount: 5.00,
          fee_percentage: 0,
          min_amount: 10,
          description: 'Transferencia bancaria',
          is_active: true
        }
      ])
    } catch (error) {
      setError('Error al cargar métodos de pago')
    }
  }

  const calculateTotals = () => {
    const selectedMethod = paymentMethods.find(method => method.id === formData.payment_method_id)
    if (!selectedMethod) {
      setProcessingFee(0)
      setTotalAmount(formData.amount)
      return
    }

    let fee = 0
    if (selectedMethod.fee_type === 'percentage') {
      fee = (formData.amount * selectedMethod.fee_percentage) / 100
    } else if (selectedMethod.fee_type === 'fixed') {
      fee = selectedMethod.fee_amount
    }

    setProcessingFee(fee)
    setTotalAmount(formData.amount + fee)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const paymentData = {
        ...formData,
        invoice_id: invoiceId,
        processing_fee: processingFee,
        total_amount: totalAmount,
        status: 'pending'
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSuccess('Pago procesado exitosamente!')
      setTimeout(() => {
        router.push('/billing')
      }, 2000)
    } catch (error) {
      setError('Error al procesar el pago')
    } finally {
      setLoading(false)
    }
  }

  const getRemainingAmount = () => {
    if (!invoice) return 0
    const paidAmount = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0)
    return invoice.total_amount - paidAmount
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Link href="/billing" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Facturación
        </Link>
        <h1 className="text-3xl font-bold">Registrar Nuevo Pago</h1>
        <p className="text-gray-500">Procesar un pago para una factura existente</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información de la Factura */}
        {invoice && (
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-lg p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Receipt className="h-5 w-5 mr-2" />
                Información de la Factura
              </h2>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Número:</span>
                  <p className="font-medium">{invoice.invoice_number}</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500">Huésped:</span>
                  <p className="font-medium">{invoice.guest?.first_name} {invoice.guest?.last_name}</p>
                  <p className="text-sm text-gray-500">{invoice.guest?.email}</p>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Factura:</span>
                    <span className="font-bold">${invoice.total_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Pagado:</span>
                    <span>${invoice.payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium">Pendiente:</span>
                    <span className="font-bold text-red-600">${getRemainingAmount().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Formulario de Pago */}
        <div className="lg:col-span-2">
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Detalles del Pago
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de Pago*
                  </label>
                  <select
                    value={formData.payment_method_id}
                    onChange={(e) => setFormData({...formData, payment_method_id: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar método</option>
                    {paymentMethods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.name} - {method.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto del Pago*
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={getRemainingAmount()}
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Máximo: ${getRemainingAmount().toFixed(2)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referencia/Número de Transacción
                  </label>
                  <input
                    type="text"
                    value={formData.reference}
                    onChange={(e) => setFormData({...formData, reference: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Número de referencia o transacción"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha del Pago*
                  </label>
                  <input
                    type="date"
                    value={formData.payment_date}
                    onChange={(e) => setFormData({...formData, payment_date: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Notas adicionales sobre el pago..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Procesado por
                </label>
                <input
                  type="text"
                  value={formData.processed_by}
                  onChange={(e) => setFormData({...formData, processed_by: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del empleado que procesó el pago"
                />
              </div>

              {/* Resumen del Pago */}
              {formData.amount > 0 && (
                <div className="bg-gray-50 border rounded-lg p-4">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Resumen del Pago
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monto del pago:</span>
                      <span>${formData.amount.toFixed(2)}</span>
                    </div>
                    
                    {processingFee > 0 && (
                      <div className="flex justify-between">
                        <span>Comisión de procesamiento:</span>
                        <span>${processingFee.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total a procesar:</span>
                        <span>${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading || !formData.payment_method_id || formData.amount <= 0}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Procesando...' : 'Procesar Pago'}
                </button>
                
                <Link
                  href="/billing"
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-center block"
                >
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}