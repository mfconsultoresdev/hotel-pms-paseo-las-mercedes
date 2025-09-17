'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Settings, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Car,
  Coffee,
  Utensils,
  Waves,
  Shirt,
  Wrench
} from 'lucide-react'

interface Service {
  id: string
  name: string
  description?: string
  category: string
  price_usd: number
  is_active: boolean
}

interface ServiceRequest {
  id: string
  quantity: number
  notes?: string
  requested_time: string
  completed_time?: string
  status: string
  priority: string
  total_amount?: number
  guest: {
    first_name: string
    last_name: string
    room_number: string
  }
  service: {
    name: string
    category: string
  }
}

const categoryIcons: Record<string, any> = {
  TRANSPORTATION: Car,
  FOOD_BEVERAGE: Coffee,
  RESTAURANT: Utensils,
  SPA: Waves,
  LAUNDRY: Shirt,
  MAINTENANCE: Wrench,
  OTHER: Settings
}

const categoryLabels: Record<string, string> = {
  TRANSPORTATION: 'Transporte',
  FOOD_BEVERAGE: 'Alimentos y Bebidas',
  RESTAURANT: 'Restaurante',
  SPA: 'Spa y Bienestar',
  LAUNDRY: 'Lavandería',
  MAINTENANCE: 'Mantenimiento',
  OTHER: 'Otros'
}

const statusLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  IN_PROGRESS: 'En Progreso',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado'
}

const priorityLabels: Record<string, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  URGENT: 'Urgente'
}

export default function ServicesPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [activeTab, setActiveTab] = useState('services')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    category: '',
    price_usd: 0,
    is_active: true
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const dummyServices: Service[] = [
        {
          id: '1',
          name: 'Servicio de Transporte al Aeropuerto',
          description: 'Transporte privado al aeropuerto con chofer profesional',
          category: 'TRANSPORTATION',
          price_usd: 25.00,
          is_active: true
        },
        {
          id: '2',
          name: 'Desayuno a la Habitación',
          description: 'Desayuno continental servido en la habitación',
          category: 'FOOD_BEVERAGE',
          price_usd: 15.00,
          is_active: true
        },
        {
          id: '3',
          name: 'Masaje Relajante',
          description: 'Masaje de 60 minutos en el spa del hotel',
          category: 'SPA',
          price_usd: 80.00,
          is_active: true
        },
        {
          id: '4',
          name: 'Lavandería Express',
          description: 'Servicio de lavandería en 4 horas',
          category: 'LAUNDRY',
          price_usd: 12.00,
          is_active: true
        }
      ]

      const dummyRequests: ServiceRequest[] = [
        {
          id: '1',
          quantity: 1,
          notes: 'Transporte al aeropuerto a las 14:00',
          requested_time: '2024-07-26 10:00:00',
          status: 'PENDING',
          priority: 'HIGH',
          total_amount: 25.00,
          guest: {
            first_name: 'Juan',
            last_name: 'Pérez',
            room_number: '305'
          },
          service: {
            name: 'Servicio de Transporte al Aeropuerto',
            category: 'TRANSPORTATION'
          }
        },
        {
          id: '2',
          quantity: 2,
          notes: 'Desayuno para dos personas',
          requested_time: '2024-07-26 08:00:00',
          completed_time: '2024-07-26 08:30:00',
          status: 'COMPLETED',
          priority: 'MEDIUM',
          total_amount: 30.00,
          guest: {
            first_name: 'María',
            last_name: 'García',
            room_number: '201'
          },
          service: {
            name: 'Desayuno a la Habitación',
            category: 'FOOD_BEVERAGE'
          }
        },
        {
          id: '3',
          quantity: 1,
          notes: 'Masaje de relajación',
          requested_time: '2024-07-26 11:00:00',
          status: 'IN_PROGRESS',
          priority: 'LOW',
          total_amount: 80.00,
          guest: {
            first_name: 'Carlos',
            last_name: 'López',
            room_number: '405'
          },
          service: {
            name: 'Masaje Relajante',
            category: 'SPA'
          }
        }
      ]
      
      setServices(dummyServices)
      setServiceRequests(dummyRequests)
    } catch (error) {
      setError('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const filteredRequests = serviceRequests.filter(request => {
    const matchesSearch = request.service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${request.guest.first_name} ${request.guest.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category] || Settings
    return <IconComponent className="h-5 w-5" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'URGENT': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCreateService = () => {
    if (!newService.name || !newService.category || newService.price_usd <= 0) {
      alert('Por favor, complete todos los campos requeridos')
      return
    }
    
    const service: Service = {
      id: Date.now().toString(),
      ...newService
    }
    
    setServices([...services, service])
    setNewService({
      name: '',
      description: '',
      category: '',
      price_usd: 0,
      is_active: true
    })
    setShowCreateForm(false)
    alert('Servicio creado exitosamente')
  }

  const pendingRequests = serviceRequests.filter(r => r.status === 'PENDING').length
  const inProgressRequests = serviceRequests.filter(r => r.status === 'IN_PROGRESS').length
  const completedRequests = serviceRequests.filter(r => r.status === 'COMPLETED').length

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Cargando servicios...</span>
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
              <AlertCircle className="h-5 w-5 text-red-400" />
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
            <h1 className="text-2xl font-bold mb-2">Gestión de Servicios</h1>
            <p className="text-gray-600">Administración de servicios y solicitudes de huéspedes</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Servicio
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Servicios</p>
              <p className="text-2xl font-bold text-gray-900">{services.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{pendingRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Progreso</p>
              <p className="text-2xl font-bold text-gray-900">{inProgressRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completados</p>
              <p className="text-2xl font-bold text-gray-900">{completedRequests}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('services')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'services'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Servicios
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Solicitudes
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <input
              type="text"
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {activeTab === 'services' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas</option>
                <option value="TRANSPORTATION">Transporte</option>
                <option value="FOOD_BEVERAGE">Alimentos y Bebidas</option>
                <option value="RESTAURANT">Restaurante</option>
                <option value="SPA">Spa y Bienestar</option>
                <option value="LAUNDRY">Lavandería</option>
                <option value="MAINTENANCE">Mantenimiento</option>
                <option value="OTHER">Otros</option>
              </select>
            </div>
          )}
          
          {activeTab === 'requests' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos</option>
                <option value="PENDING">Pendiente</option>
                <option value="CONFIRMED">Confirmado</option>
                <option value="IN_PROGRESS">En Progreso</option>
                <option value="COMPLETED">Completado</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>
          )}
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterCategory('all')
                setFilterStatus('all')
              }}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    {getCategoryIcon(service.category)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{service.name}</h3>
                    <span className="text-sm text-gray-600">{categoryLabels[service.category]}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${service.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {service.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              {service.description && (
                <p className="text-gray-600 mb-4">{service.description}</p>
              )}

              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600">{formatCurrency(service.price_usd)}</span>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition-colors text-sm">
                    Editar
                  </button>
                  <button className={`py-1 px-3 rounded-md transition-colors text-sm ${service.is_active ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                    {service.is_active ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    {getCategoryIcon(request.service.category)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{request.service.name}</h3>
                    <p className="text-sm text-gray-600">
                      Huésped: {request.guest.first_name} {request.guest.last_name} - Habitación {request.guest.room_number}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {statusLabels[request.status]}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                    {priorityLabels[request.priority]}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-gray-500">Cantidad:</span>
                  <p className="font-semibold">{request.quantity}</p>
                </div>
                <div>
                  <span className="text-gray-500">Solicitado:</span>
                  <p className="font-semibold">{formatDateTime(request.requested_time)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Total:</span>
                  <p className="font-semibold text-green-600">{formatCurrency(request.total_amount || 0)}</p>
                </div>
                {request.completed_time && (
                  <div>
                    <span className="text-gray-500">Completado:</span>
                    <p className="font-semibold">{formatDateTime(request.completed_time)}</p>
                  </div>
                )}
              </div>

              {request.notes && (
                <div className="mb-4">
                  <span className="text-gray-500">Notas:</span>
                  <p className="text-gray-800">{request.notes}</p>
                </div>
              )}

              <div className="flex space-x-2">
                {request.status === 'PENDING' && (
                  <button className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                    Confirmar
                  </button>
                )}
                {request.status === 'CONFIRMED' && (
                  <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    Iniciar
                  </button>
                )}
                {request.status === 'IN_PROGRESS' && (
                  <button className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
                    Completar
                  </button>
                )}
                <button className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors">
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredServices.length === 0 && activeTab === 'services' && (
        <div className="text-center py-12">
          <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron servicios</h3>
          <p className="text-gray-600">No hay servicios que coincidan con los filtros aplicados.</p>
        </div>
      )}

      {filteredRequests.length === 0 && activeTab === 'requests' && (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron solicitudes</h3>
          <p className="text-gray-600">No hay solicitudes que coincidan con los filtros aplicados.</p>
        </div>
      )}

      {/* Create Service Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Crear Nuevo Servicio</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Servicio</label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Servicio de Transporte"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Descripción del servicio"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <select
                  value={newService.category}
                  onChange={(e) => setNewService({...newService, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="TRANSPORTATION">Transporte</option>
                  <option value="FOOD_BEVERAGE">Alimentos y Bebidas</option>
                  <option value="RESTAURANT">Restaurante</option>
                  <option value="SPA">Spa y Bienestar</option>
                  <option value="LAUNDRY">Lavandería</option>
                  <option value="MAINTENANCE">Mantenimiento</option>
                  <option value="OTHER">Otros</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newService.price_usd}
                  onChange={(e) => setNewService({...newService, price_usd: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateService}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Crear Servicio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}