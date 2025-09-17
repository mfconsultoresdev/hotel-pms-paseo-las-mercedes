'use client'

import { useState, useEffect } from 'react'
import { Loader2, Plus, Edit, Trash2, MessageSquare, Users, Settings, Eye } from 'lucide-react'

interface MessageTemplate {
  id: string
  name: string
  category: string
  type: string
  subject: string
  content: string
  variables?: any
  language: string
  is_active: boolean
  is_automatic: boolean
  trigger_event?: string
  send_delay_hours: number
  created_at: string
  updated_at: string
}

export default function CommunicationTemplatesPage() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null)
  const [processing, setProcessing] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    type: '',
    subject: '',
    content: '',
    language: 'es',
    is_active: true,
    is_automatic: false,
    trigger_event: '',
    send_delay_hours: 0
  })

  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'welcome', label: 'Bienvenida' },
    { value: 'reservation', label: 'Reservación' },
    { value: 'checkin', label: 'Check-in' },
    { value: 'checkout', label: 'Check-out' },
    { value: 'promotional', label: 'Promocional' },
    { value: 'reminder', label: 'Recordatorio' },
    { value: 'support', label: 'Soporte' }
  ]

  const types = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'push', label: 'Push Notification' },
    { value: 'whatsapp', label: 'WhatsApp' }
  ]

  const triggerEvents = [
    { value: '', label: 'Sin evento automático' },
    { value: 'reservation_created', label: 'Reservación creada' },
    { value: 'checkin_completed', label: 'Check-in completado' },
    { value: 'checkout_completed', label: 'Check-out completado' },
    { value: 'payment_received', label: 'Pago recibido' },
    { value: 'booking_reminder', label: 'Recordatorio de reservación' }
  ]

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const dummyTemplates: MessageTemplate[] = [
        {
          id: '1',
          name: 'Bienvenida - Email',
          category: 'welcome',
          type: 'email',
          subject: '¡Bienvenido a Hotel Paseo Las Mercedes!',
          content: 'Estimado/a {{guest_name}},\n\n¡Bienvenido/a a Hotel Paseo Las Mercedes!\n\nEsperamos que su estancia sea placentera. Si necesita algo, no dude en contactarnos.\n\nSaludos cordiales,\nEl equipo del hotel',
          language: 'es',
          is_active: true,
          is_automatic: true,
          trigger_event: 'checkin_completed',
          send_delay_hours: 0,
          created_at: '2024-07-01',
          updated_at: '2024-07-01'
        },
        {
          id: '2',
          name: 'Confirmación de Reservación',
          category: 'reservation',
          type: 'email',
          subject: 'Confirmación de su reservación #{{reservation_number}}',
          content: 'Estimado/a {{guest_name}},\n\nSu reservación ha sido confirmada:\n\n- Fecha de llegada: {{checkin_date}}\n- Fecha de salida: {{checkout_date}}\n- Habitación: {{room_number}}\n- Total: ${{total_amount}}\n\n¡Esperamos verlo/a pronto!\n\nSaludos,\nHotel Paseo Las Mercedes',
          language: 'es',
          is_active: true,
          is_automatic: true,
          trigger_event: 'reservation_created',
          send_delay_hours: 0,
          created_at: '2024-07-01',
          updated_at: '2024-07-01'
        },
        {
          id: '3',
          name: 'Recordatorio de Check-out',
          category: 'reminder',
          type: 'sms',
          subject: 'Recordatorio de check-out',
          content: 'Estimado/a {{guest_name}}, le recordamos que su check-out es mañana a las 11:00 AM. Habitación {{room_number}}.',
          language: 'es',
          is_active: true,
          is_automatic: true,
          trigger_event: 'booking_reminder',
          send_delay_hours: 24,
          created_at: '2024-07-01',
          updated_at: '2024-07-01'
        }
      ]
      
      setTemplates(dummyTemplates)
    } catch (error) {
      setError('Error al cargar las plantillas')
    } finally {
      setLoading(false)
    }
  }

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory
    const matchesType = filterType === 'all' || template.type === filterType
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesType && matchesSearch
  })

  const handleCreateTemplate = async () => {
    try {
      setProcessing(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newTemplate: MessageTemplate = {
        id: Date.now().toString(),
        ...formData,
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0]
      }
      
      setTemplates([...templates, newTemplate])
      setShowCreateModal(false)
      resetForm()
      
      alert('Plantilla creada exitosamente!')
    } catch (error) {
      setError('Error al crear la plantilla')
    } finally {
      setProcessing(false)
    }
  }

  const handleEditTemplate = async () => {
    if (!editingTemplate) return
    
    try {
      setProcessing(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedTemplate = {
        ...editingTemplate,
        ...formData,
        updated_at: new Date().toISOString().split('T')[0]
      }
      
      setTemplates(templates.map(t => t.id === editingTemplate.id ? updatedTemplate : t))
      setShowEditModal(false)
      setEditingTemplate(null)
      resetForm()
      
      alert('Plantilla actualizada exitosamente!')
    } catch (error) {
      setError('Error al actualizar la plantilla')
    } finally {
      setProcessing(false)
    }
  }

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta plantilla?')) return
    
    try {
      setProcessing(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setTemplates(templates.filter(t => t.id !== id))
      alert('Plantilla eliminada exitosamente!')
    } catch (error) {
      setError('Error al eliminar la plantilla')
    } finally {
      setProcessing(false)
    }
  }

  const handleEditClick = (template: MessageTemplate) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      category: template.category,
      type: template.type,
      subject: template.subject,
      content: template.content,
      language: template.language,
      is_active: template.is_active,
      is_automatic: template.is_automatic,
      trigger_event: template.trigger_event || '',
      send_delay_hours: template.send_delay_hours
    })
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      type: '',
      subject: '',
      content: '',
      language: 'es',
      is_active: true,
      is_automatic: false,
      trigger_event: '',
      send_delay_hours: 0
    })
  }

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.value === category)?.label || category
  }

  const getTypeLabel = (type: string) => {
    return types.find(t => t.value === type)?.label || type
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-100 text-blue-800'
      case 'sms': return 'bg-green-100 text-green-800'
      case 'whatsapp': return 'bg-green-100 text-green-800'
      case 'push': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Cargando plantillas...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Plantillas de Comunicación</h1>
        <p className="text-gray-600">Gestionar plantillas de mensajes automáticos y manuales</p>
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

      {/* Filtros y Búsqueda */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <input
              type="text"
              placeholder="Buscar plantillas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {types.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Plantilla
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Plantillas */}
      <div className="bg-white border rounded-lg overflow-hidden">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No hay plantillas que coincidan con los filtros</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Automático</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{template.name}</div>
                        <div className="text-sm text-gray-500">{template.subject}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {getCategoryLabel(template.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(template.type)}`}>
                        {getTypeLabel(template.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(template.is_active)}`}>
                        {template.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {template.is_automatic ? 'Sí' : 'No'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(template)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Crear/Editar */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {showCreateModal ? 'Crear Nueva Plantilla' : 'Editar Plantilla'}
              </h3>
              
              <form onSubmit={(e) => { e.preventDefault(); showCreateModal ? handleCreateTemplate() : handleEditTemplate() }}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre*</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nombre de la plantilla"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Categoría*</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Seleccionar categoría</option>
                        {categories.filter(c => c.value !== 'all').map(category => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo*</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Seleccionar tipo</option>
                        {types.filter(t => t.value !== 'all').map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Idioma*</label>
                      <select
                        value={formData.language}
                        onChange={(e) => setFormData({...formData, language: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Asunto*</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Asunto del mensaje"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contenido*</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      required
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contenido del mensaje. Use {{variable}} para variables dinámicas."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Evento Automático</label>
                      <select
                        value={formData.trigger_event}
                        onChange={(e) => setFormData({...formData, trigger_event: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {triggerEvents.map(event => (
                          <option key={event.value} value={event.value}>
                            {event.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Retraso (horas)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.send_delay_hours}
                        onChange={(e) => setFormData({...formData, send_delay_hours: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Activo</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_automatic}
                        onChange={(e) => setFormData({...formData, is_automatic: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Automático</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      setShowEditModal(false)
                      setEditingTemplate(null)
                      resetForm()
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                  >
                    {processing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {showCreateModal ? 'Crear' : 'Actualizar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}