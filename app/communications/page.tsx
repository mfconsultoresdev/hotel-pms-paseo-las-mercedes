'use client'

import { useState, useEffect } from 'react'
import { Mail, Phone, MessageSquare, Send, Clock, Check, X } from 'lucide-react'

interface Communication {
  id: string
  type: 'email' | 'sms' | 'call'
  recipient: string
  subject: string
  content: string
  status: 'sent' | 'pending' | 'failed'
  created_at: string
  sent_at?: string
}

export default function CommunicationsPage() {
  const [communications, setCommunications] = useState<Communication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    fetchCommunications()
  }, [])

  const fetchCommunications = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      setCommunications([
        {
          id: '1',
          type: 'email',
          recipient: 'guest@example.com',
          subject: 'Confirmación de Reserva',
          content: 'Su reserva ha sido confirmada...',
          status: 'sent',
          created_at: '2024-01-15T10:30:00Z',
          sent_at: '2024-01-15T10:31:00Z'
        },
        {
          id: '2',
          type: 'sms',
          recipient: '+1234567890',
          subject: 'Recordatorio de Check-in',
          content: 'Recordatorio: su check-in es mañana...',
          status: 'pending',
          created_at: '2024-01-16T14:20:00Z'
        },
        {
          id: '3',
          type: 'call',
          recipient: '+1234567890',
          subject: 'Consulta sobre servicios',
          content: 'Llamada realizada para consultar servicios adicionales...',
          status: 'sent',
          created_at: '2024-01-16T16:45:00Z',
          sent_at: '2024-01-16T16:50:00Z'
        }
      ])
    } catch (err) {
      setError('Error al cargar las comunicaciones')
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />
      case 'sms': return <MessageSquare className="h-4 w-4" />
      case 'call': return <Phone className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-100 text-blue-800'
      case 'sms': return 'bg-green-100 text-green-800'
      case 'call': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Check className="h-4 w-4 text-green-600" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'failed': return <X className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent': return 'Enviado'
      case 'pending': return 'Pendiente'
      case 'failed': return 'Fallido'
      default: return status
    }
  }

  const filteredCommunications = communications.filter(comm => {
    if (activeTab === 'all') return true
    return comm.status === activeTab
  })

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Cargando comunicaciones...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
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
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <MessageSquare className="h-8 w-8 mr-2" />
            Comunicaciones
          </h1>
          <p className="text-gray-500">Gestión de mensajes y notificaciones</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
          <Send className="h-4 w-4 mr-2" />
          Nueva Comunicación
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sent'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Enviadas
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pending'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setActiveTab('failed')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'failed'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Fallidas
          </button>
        </nav>
      </div>

      {/* Communications List */}
      <div className="bg-white border rounded-lg overflow-hidden">
        {filteredCommunications.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No hay comunicaciones disponibles</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredCommunications.map((comm) => (
              <div key={comm.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(comm.type)}`}>
                        {getTypeIcon(comm.type)}
                        <span className="ml-1 capitalize">{comm.type}</span>
                      </span>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(comm.status)}
                        <span className="text-sm text-gray-600">{getStatusText(comm.status)}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {comm.subject}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Para:</span> {comm.recipient}
                    </p>
                    
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {comm.content}
                    </p>
                    
                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                      <span>Creación: {new Date(comm.created_at).toLocaleString()}</span>
                      {comm.sent_at && (
                        <span>Enviado: {new Date(comm.sent_at).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}