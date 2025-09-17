'use client'

import { useState } from 'react'
import { Loader2, Key, MessageSquare, Wifi, Phone, MapPin, Clock } from 'lucide-react'

interface GuestSession {
  guest: {
    id: string
    first_name: string
    last_name: string
    email?: string
  }
  reservation: {
    id: string
    reservation_number: string
    check_in_date: string
    check_out_date: string
    room: {
      room_number: string
      room_type: {
        name: string
        amenities: any
      }
    }
  }
  hotel: {
    name: string
    address: string
    phone: string
    email: string
  }
  messages?: any[]
}

export default function GuestPortalPage() {
  const [reservationCode, setReservationCode] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [guestSession, setGuestSession] = useState<GuestSession | null>(null)
  const [activeTab, setActiveTab] = useState('info')

  const handleLogin = async () => {
    if (!reservationCode.trim()) {
      alert('Por favor ingrese el código de reservación')
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const dummySession: GuestSession = {
        guest: {
          id: '1',
          first_name: 'Juan',
          last_name: 'Pérez',
          email: 'juan@example.com'
        },
        reservation: {
          id: '1',
          reservation_number: reservationCode,
          check_in_date: '2024-07-25',
          check_out_date: '2024-07-28',
          room: {
            room_number: '101',
            room_type: {
              name: 'Habitación Doble',
              amenities: {
                wifi: true,
                tv: true,
                minibar: true,
                balcony: true,
                ocean_view: false
              }
            }
          }
        },
        hotel: {
          name: 'Hotel Paseo Las Mercedes',
          address: 'Calle Principal #123, Cartagena, Colombia',
          phone: '+57 5 123-4567',
          email: 'info@hotelpaseolasmercedes.com'
        },
        messages: [
          {
            id: '1',
            type: 'welcome',
            title: 'Bienvenido',
            content: '¡Bienvenido a Hotel Paseo Las Mercedes! Esperamos que disfrute su estancia.',
            timestamp: '2024-07-25T10:00:00Z',
            read: false
          },
          {
            id: '2',
            type: 'service',
            title: 'Servicio a la Habitación',
            content: 'Nuestro servicio a la habitación está disponible 24/7. Marque el 9 para solicitar.',
            timestamp: '2024-07-25T11:00:00Z',
            read: true
          }
        ]
      }
      
      setGuestSession(dummySession)
    } catch (error) {
      alert('Error al acceder al portal. Verifique el código de reservación.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setGuestSession(null)
    setReservationCode('')
    setGuestEmail('')
    setActiveTab('info')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!guestSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Portal del Huésped</h1>
              <p className="text-gray-600">Acceda a su información de reservación</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleLogin() }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Reservación
                </label>
                <input
                  type="text"
                  value={reservationCode}
                  onChange={(e) => setReservationCode(e.target.value)}
                  placeholder="Ingrese su código de reservación"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (opcional)
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="su@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Accediendo...
                  </>
                ) : (
                  'Acceder al Portal'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                ¿Necesita ayuda? Contacte a{' '}
                <a href="mailto:info@hotelpaseolasmercedes.com" className="text-blue-600 hover:text-blue-800">
                  recepción
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Bienvenido, {guestSession.guest.first_name}
              </h1>
              <p className="text-sm text-gray-600">
                Reservación #{guestSession.reservation.reservation_number}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'info'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Información
            </button>
            <button
              onClick={() => setActiveTab('amenities')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'amenities'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Servicios
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'messages'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mensajes
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'contact'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Contacto
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Reservación Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Información de Reservación
              </h2>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Número de Reservación:</span>
                  <p className="text-lg font-semibold">{guestSession.reservation.reservation_number}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Fecha de Llegada:</span>
                  <p className="text-lg">{formatDate(guestSession.reservation.check_in_date)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Fecha de Salida:</span>
                  <p className="text-lg">{formatDate(guestSession.reservation.check_out_date)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Habitación:</span>
                  <p className="text-lg font-semibold text-blue-600">
                    {guestSession.reservation.room.room_number} - {guestSession.reservation.room.room_type.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Huésped Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Información del Huésped</h2>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Nombre:</span>
                  <p className="text-lg">{guestSession.guest.first_name} {guestSession.guest.last_name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Email:</span>
                  <p className="text-lg">{guestSession.guest.email || 'No proporcionado'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Estado:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Activo
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'amenities' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-6">Servicios y Amenidades</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Wifi className="h-6 w-6 text-green-500" />
                <div>
                  <h3 className="font-medium">WiFi Gratuito</h3>
                  <p className="text-sm text-gray-500">Internet de alta velocidad</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-6 w-6 text-blue-500" />
                <div>
                  <h3 className="font-medium">Servicio a la Habitación</h3>
                  <p className="text-sm text-gray-500">Disponible 24/7</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-6 w-6 text-red-500" />
                <div>
                  <h3 className="font-medium">Ubicación Céntrica</h3>
                  <p className="text-sm text-gray-500">Cerca de atracciones</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Mensajes
            </h2>
            <div className="space-y-4">
              {guestSession.messages?.map((message) => (
                <div key={message.id} className={`border rounded-lg p-4 ${!message.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{message.title}</h3>
                      <p className="text-gray-600 mt-1">{message.content}</p>
                      <p className="text-xs text-gray-400 mt-2">{formatTime(message.timestamp)}</p>
                    </div>
                    {!message.read && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Nuevo
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-6">Información de Contacto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Hotel Paseo Las Mercedes</h3>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {guestSession.hotel.address}
                  </p>
                  <p className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {guestSession.hotel.phone}
                  </p>
                  <p className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-gray-400" />
                    {guestSession.hotel.email}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3">Servicios de Emergencia</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Recepción:</strong> Marque 0 desde su habitación
                  </p>
                  <p className="text-sm">
                    <strong>Emergencias:</strong> Marque 911
                  </p>
                  <p className="text-sm">
                    <strong>Servicio a la Habitación:</strong> Marque 9
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}