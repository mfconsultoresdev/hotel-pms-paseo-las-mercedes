'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Room {
  id: string
  room_number: string
  room_type: {
    name: string
    base_rate_usd: number
  }
}

interface Guest {
  id: string
  first_name: string
  last_name: string
  email: string
}

export default function NewReservationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [rooms, setRooms] = useState<Room[]>([])
  const [guests, setGuests] = useState<Guest[]>([])
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    room_id: '',
    guest_id: '',
    check_in_date: '',
    check_out_date: '',
    adults: 1,
    children: 0,
    currency: 'USD',
    special_requests: '',
    notes: ''
  })

  useEffect(() => {
    fetchRooms()
    fetchGuests()
  }, [])

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms')
      if (response.ok) {
        const data = await response.json()
        setRooms(data.rooms?.filter((room: Room) => room.id) || [])
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
      setError('Error al cargar las habitaciones')
    }
  }

  const fetchGuests = async () => {
    try {
      const response = await fetch('/api/guests')
      if (response.ok) {
        const data = await response.json()
        setGuests(data.guests?.filter((guest: Guest) => guest.id) || [])
      }
    } catch (error) {
      console.error('Error fetching guests:', error)
      setError('Error al cargar los huéspedes')
    }
  }

  const calculateNights = () => {
    if (formData.check_in_date && formData.check_out_date) {
      const checkIn = new Date(formData.check_in_date)
      const checkOut = new Date(formData.check_out_date)
      const diffTime = checkOut.getTime() - checkIn.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return Math.max(0, diffDays)
    }
    return 0
  }

  const getSelectedRoom = () => {
    return rooms.find(room => room.id === formData.room_id)
  }

  const calculateTotal = () => {
    const nights = calculateNights()
    const room = getSelectedRoom()
    if (room && nights > 0) {
      return nights * room.room_type.base_rate_usd
    }
    return 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const nights = calculateNights()
    const room = getSelectedRoom()
    
    if (!room) {
      setError('Debe seleccionar una habitación')
      setLoading(false)
      return
    }

    if (nights <= 0) {
      setError('Las fechas de check-in y check-out son inválidas')
      setLoading(false)
      return
    }

    try {
      const reservationData = {
        ...formData,
        nights,
        room_rate: room.room_type.base_rate_usd,
        total_amount: calculateTotal(),
        taxes: 0,
        discounts: 0
      }

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData)
      })

      if (response.ok) {
        alert('Reserva creada exitosamente')
        router.push('/reservations')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear la reserva')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al crear la reserva')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Nueva Reserva</h1>
        <p className="text-gray-500">Crear una nueva reserva en el sistema</p>
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

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información de la Reserva */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Información de la Reserva</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="guest_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Huésped*
                </label>
                <select
                  id="guest_id"
                  value={formData.guest_id}
                  onChange={(e) => setFormData({...formData, guest_id: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar huésped</option>
                  {guests.map((guest) => (
                    <option key={guest.id} value={guest.id}>
                      {guest.first_name} {guest.last_name} {guest.email && `(${guest.email})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="room_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Habitación*
                </label>
                <select
                  id="room_id"
                  value={formData.room_id}
                  onChange={(e) => setFormData({...formData, room_id: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar habitación</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      Habitación {room.room_number} - {room.room_type.name} (${room.room_type.base_rate_usd}/noche)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="check_in_date" className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in*
                  </label>
                  <input
                    id="check_in_date"
                    type="date"
                    value={formData.check_in_date}
                    onChange={(e) => setFormData({...formData, check_in_date: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="check_out_date" className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out*
                  </label>
                  <input
                    id="check_out_date"
                    type="date"
                    value={formData.check_out_date}
                    onChange={(e) => setFormData({...formData, check_out_date: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-2">
                    Adultos
                  </label>
                  <input
                    id="adults"
                    type="number"
                    min="1"
                    value={formData.adults}
                    onChange={(e) => setFormData({...formData, adults: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="children" className="block text-sm font-medium text-gray-700 mb-2">
                    Niños
                  </label>
                  <input
                    id="children"
                    type="number"
                    min="0"
                    value={formData.children}
                    onChange={(e) => setFormData({...formData, children: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Resumen de Costos */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Resumen de Costos</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Noches:</span>
                  <span className="font-semibold">{calculateNights()}</span>
                </div>
                {getSelectedRoom() && (
                  <div className="flex justify-between">
                    <span>Tarifa por noche:</span>
                    <span className="font-semibold">${getSelectedRoom()?.room_type.base_rate_usd}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                  Moneda
                </label>
                <select
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({...formData, currency: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="USDT">USDT</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Solicitudes Especiales */}
        <div className="bg-white border rounded-lg p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">Solicitudes Especiales</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="special_requests" className="block text-sm font-medium text-gray-700 mb-2">
                Solicitudes Especiales
              </label>
              <textarea
                id="special_requests"
                placeholder="Cama extra, vista al mar, piso alto, etc."
                value={formData.special_requests}
                onChange={(e) => setFormData({...formData, special_requests: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notas Internas
              </label>
              <textarea
                id="notes"
                placeholder="Notas para el personal del hotel..."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => router.push('/reservations')}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creando...' : 'Crear Reserva'}
          </button>
        </div>
      </form>
    </div>
  )
}