'use client'

import { useState, useEffect } from 'react'
import { UserX, Clock, BedDouble, Users, DollarSign, Key } from 'lucide-react'

interface Guest {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
}

interface Room {
  id: string
  room_number: string
  status: string
  room_type: {
    name: string
  }
}

interface Reservation {
  id: string
  reservation_number: string
  check_in_date: string
  check_out_date: string
  adults: number
  children: number
  nights: number
  total_amount: number
  status: string
  guest: Guest
  room: Room
}

interface Charge {
  id: string
  description: string
  amount: number
  date: string
  category: string
}

export default function CheckOutPage() {
  const [pendingCheckOuts, setPendingCheckOuts] = useState<Reservation[]>([])
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [checkOutData, setCheckOutData] = useState({
    room_key_returned: false,
    minibar_checked: false,
    damages_inspected: false,
    final_bill_verified: false,
    feedback_collected: false,
    departure_time: new Date().toISOString().slice(0, 16),
    notes: '',
    feedback: ''
  })

  const [charges, setCharges] = useState<Charge[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [tax, setTax] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchPendingCheckOuts()
  }, [])

  useEffect(() => {
    if (selectedReservation) {
      fetchCharges()
    }
  }, [selectedReservation])

  useEffect(() => {
    calculateTotals()
  }, [charges, selectedReservation])

  const fetchPendingCheckOuts = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const dummyData: Reservation[] = [
        {
          id: '1',
          reservation_number: 'RES-001',
          check_in_date: '2024-07-22',
          check_out_date: '2024-07-25',
          adults: 2,
          children: 1,
          nights: 3,
          total_amount: 450.00,
          status: 'checked_in',
          guest: {
            id: '1',
            first_name: 'Juan',
            last_name: 'Pérez',
            email: 'juan@example.com',
            phone: '+1234567890'
          },
          room: {
            id: '1',
            room_number: '101',
            status: 'occupied',
            room_type: {
              name: 'Habitación Doble'
            }
          }
        },
        {
          id: '2',
          reservation_number: 'RES-002',
          check_in_date: '2024-07-23',
          check_out_date: '2024-07-25',
          adults: 1,
          children: 0,
          nights: 2,
          total_amount: 280.00,
          status: 'checked_in',
          guest: {
            id: '2',
            first_name: 'María',
            last_name: 'García',
            email: 'maria@example.com',
            phone: '+1234567891'
          },
          room: {
            id: '2',
            room_number: '205',
            status: 'occupied',
            room_type: {
              name: 'Habitación Individual'
            }
          }
        }
      ]
      
      setPendingCheckOuts(dummyData)
    } catch (error) {
      setError('Error al cargar las reservaciones pendientes')
    } finally {
      setLoading(false)
    }
  }

  const fetchCharges = async () => {
    if (!selectedReservation) return
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const dummyCharges: Charge[] = [
        {
          id: '1',
          description: 'Habitación - 3 noches',
          amount: selectedReservation.total_amount,
          date: selectedReservation.check_in_date,
          category: 'room'
        },
        {
          id: '2',
          description: 'Minibar - Bebidas',
          amount: 25.50,
          date: '2024-07-24',
          category: 'minibar'
        },
        {
          id: '3',
          description: 'Servicio a la habitación',
          amount: 35.00,
          date: '2024-07-24',
          category: 'service'
        }
      ]
      
      setCharges(dummyCharges)
    } catch (error) {
      setError('Error al cargar los cargos')
    }
  }

  const calculateTotals = () => {
    const subtotalAmount = charges.reduce((sum, charge) => sum + charge.amount, 0)
    const taxAmount = subtotalAmount * 0.16 // 16% tax
    const totalAmount = subtotalAmount + taxAmount
    
    setSubtotal(subtotalAmount)
    setTax(taxAmount)
    setTotal(totalAmount)
  }

  const handleCheckOut = async () => {
    if (!selectedReservation) return
    
    try {
      setProcessing(true)
      setError(null)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSuccess(`Check-out completado para ${selectedReservation.guest.first_name} ${selectedReservation.guest.last_name}`)
      
      // Remove from pending list
      setPendingCheckOuts(prev => prev.filter(r => r.id !== selectedReservation.id))
      setSelectedReservation(null)
      setCharges([])
      setCheckOutData({
        room_key_returned: false,
        minibar_checked: false,
        damages_inspected: false,
        final_bill_verified: false,
        feedback_collected: false,
        departure_time: new Date().toISOString().slice(0, 16),
        notes: '',
        feedback: ''
      })
      
    } catch (error) {
      setError('Error al procesar el check-out')
    } finally {
      setProcessing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked_in': return 'bg-blue-100 text-blue-800'
      case 'checked_out': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Check-out de Huéspedes</h1>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Cargando reservaciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Check-out de Huéspedes</h1>
        <p className="text-gray-600">Procesar check-outs pendientes para hoy</p>
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
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de Check-outs Pendientes */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Check-outs Pendientes ({pendingCheckOuts.length})
          </h2>
          
          {pendingCheckOuts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <UserX className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No hay check-outs pendientes para hoy</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingCheckOuts.map((reservation) => (
                <div
                  key={reservation.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedReservation?.id === reservation.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedReservation(reservation)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">
                        {reservation.guest.first_name} {reservation.guest.last_name}
                      </h3>
                      <p className="text-sm text-gray-600">{reservation.reservation_number}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                      {reservation.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <BedDouble className="h-4 w-4 mr-2 text-gray-400" />
                      <span>Habitación {reservation.room.room_number}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{reservation.adults + reservation.children} huéspedes</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Check-in: {formatDate(reservation.check_in_date)}</p>
                    <p>Check-out: {formatDate(reservation.check_out_date)}</p>
                    <p className="font-medium">Total: ${reservation.total_amount.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detalles del Check-out */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <UserX className="h-5 w-5 mr-2" />
            Detalles del Check-out
          </h2>
          
          {!selectedReservation ? (
            <div className="text-center py-8 text-gray-500">
              <UserX className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Selecciona una reservación para procesar el check-out</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Información de la Reservación */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-3">Información de la Reservación</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Huésped:</span>
                    <p className="font-medium">{selectedReservation.guest.first_name} {selectedReservation.guest.last_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">{selectedReservation.guest.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Teléfono:</span>
                    <p className="font-medium">{selectedReservation.guest.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Habitación:</span>
                    <p className="font-medium">{selectedReservation.room.room_number} - {selectedReservation.room.room_type.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Noches:</span>
                    <p className="font-medium">{selectedReservation.nights}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Check-out:</span>
                    <p className="font-medium">{formatDate(selectedReservation.check_out_date)}</p>
                  </div>
                </div>
              </div>

              {/* Factura Final */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Factura Final
                </h3>
                
                <div className="space-y-2 text-sm">
                  {charges.map((charge) => (
                    <div key={charge.id} className="flex justify-between">
                      <span>{charge.description}</span>
                      <span>${charge.amount.toFixed(2)}</span>
                    </div>
                  ))}
                  
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Impuestos (16%):</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checklist de Check-out */}
              <div>
                <h3 className="font-medium mb-3">Checklist de Check-out</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={checkOutData.room_key_returned}
                      onChange={(e) => setCheckOutData({...checkOutData, room_key_returned: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm">Llave de habitación devuelta</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={checkOutData.minibar_checked}
                      onChange={(e) => setCheckOutData({...checkOutData, minibar_checked: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm">Minibar verificado</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={checkOutData.damages_inspected}
                      onChange={(e) => setCheckOutData({...checkOutData, damages_inspected: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm">Inspección de daños completada</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={checkOutData.final_bill_verified}
                      onChange={(e) => setCheckOutData({...checkOutData, final_bill_verified: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm">Factura final verificada</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={checkOutData.feedback_collected}
                      onChange={(e) => setCheckOutData({...checkOutData, feedback_collected: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm">Feedback recopilado</span>
                  </label>
                </div>
              </div>

              {/* Hora de Salida */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora de Salida*
                </label>
                <input
                  type="datetime-local"
                  value={checkOutData.departure_time}
                  onChange={(e) => setCheckOutData({...checkOutData, departure_time: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas del Check-out
                </label>
                <textarea
                  value={checkOutData.notes}
                  onChange={(e) => setCheckOutData({...checkOutData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Notas adicionales del check-out..."
                />
              </div>

              {/* Feedback del Huésped */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback del Huésped
                </label>
                <textarea
                  value={checkOutData.feedback}
                  onChange={(e) => setCheckOutData({...checkOutData, feedback: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Comentarios del huésped sobre su estancia..."
                />
              </div>

              {/* Botón de Check-out */}
              <button
                onClick={handleCheckOut}
                disabled={processing || !checkOutData.room_key_returned || !checkOutData.final_bill_verified}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Procesando Check-out...
                  </>
                ) : (
                  <>
                    <UserX className="h-4 w-4 mr-2" />
                    Completar Check-out
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}