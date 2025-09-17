'use client'

import { useState, useEffect } from 'react'
import { 
  ClipboardList, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  User,
  Calendar,
  Home,
  Edit,
  Play,
  Pause,
  CheckCheck
} from 'lucide-react'
import Link from 'next/link'

interface Task {
  id: string
  task_type: string
  priority: string
  status: string
  description: string
  estimated_duration: number
  actual_duration: number
  created_at: string
  assigned_date: string
  started_date: string
  completed_date: string
  room: {
    room_number: string
    room_type: {
      name: string
    }
    floor: {
      name: string
    }
  }
  assigned_staff: {
    id: string
    user: {
      first_name: string
      last_name: string
    }
  }
}

const taskTypeLabels: Record<string, string> = {
  CLEANING: 'Limpieza',
  MAINTENANCE: 'Mantenimiento',
  INSPECTION: 'Inspección',
  DEEP_CLEANING: 'Limpieza Profunda',
  SETUP: 'Configuración',
  OTHER: 'Otro'
}

const priorityLabels: Record<string, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  URGENT: 'Urgente'
}

const statusLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En Progreso',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada'
}

export default function HousekeepingTasksPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterTaskType, setFilterTaskType] = useState('all')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const dummyTasks: Task[] = [
        {
          id: '1',
          task_type: 'CLEANING',
          priority: 'HIGH',
          status: 'PENDING',
          description: 'Limpieza completa de habitación 305 después del check-out',
          estimated_duration: 45,
          actual_duration: 0,
          created_at: '2024-07-26 08:00:00',
          assigned_date: '2024-07-26 08:15:00',
          started_date: '',
          completed_date: '',
          room: {
            room_number: '305',
            room_type: { name: 'Suite Deluxe' },
            floor: { name: 'Piso 3' }
          },
          assigned_staff: {
            id: '1',
            user: { first_name: 'María', last_name: 'García' }
          }
        },
        {
          id: '2',
          task_type: 'MAINTENANCE',
          priority: 'URGENT',
          status: 'IN_PROGRESS',
          description: 'Reparar grifo que gotea en habitación 201',
          estimated_duration: 30,
          actual_duration: 15,
          created_at: '2024-07-26 07:30:00',
          assigned_date: '2024-07-26 07:45:00',
          started_date: '2024-07-26 08:00:00',
          completed_date: '',
          room: {
            room_number: '201',
            room_type: { name: 'Habitación Estándar' },
            floor: { name: 'Piso 2' }
          },
          assigned_staff: {
            id: '2',
            user: { first_name: 'Carlos', last_name: 'López' }
          }
        },
        {
          id: '3',
          task_type: 'INSPECTION',
          priority: 'MEDIUM',
          status: 'COMPLETED',
          description: 'Inspección de seguridad en habitaciones del piso 1',
          estimated_duration: 60,
          actual_duration: 55,
          created_at: '2024-07-26 06:00:00',
          assigned_date: '2024-07-26 06:15:00',
          started_date: '2024-07-26 06:30:00',
          completed_date: '2024-07-26 07:25:00',
          room: {
            room_number: '101-110',
            room_type: { name: 'Múltiples Habitaciones' },
            floor: { name: 'Piso 1' }
          },
          assigned_staff: {
            id: '1',
            user: { first_name: 'María', last_name: 'García' }
          }
        },
        {
          id: '4',
          task_type: 'DEEP_CLEANING',
          priority: 'MEDIUM',
          status: 'PENDING',
          description: 'Limpieza profunda de habitación 405 - mantenimiento semanal',
          estimated_duration: 90,
          actual_duration: 0,
          created_at: '2024-07-26 09:00:00',
          assigned_date: '2024-07-26 09:15:00',
          started_date: '',
          completed_date: '',
          room: {
            room_number: '405',
            room_type: { name: 'Suite Presidencial' },
            floor: { name: 'Piso 4' }
          },
          assigned_staff: {
            id: '3',
            user: { first_name: 'Ana', last_name: 'Rodríguez' }
          }
        }
      ]
      
      setTasks(dummyTasks)
    } catch (error) {
      setError('Error al cargar las tareas')
    } finally {
      setLoading(false)
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${task.assigned_staff.user.first_name} ${task.assigned_staff.user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    const matchesTaskType = filterTaskType === 'all' || task.task_type === filterTaskType
    
    return matchesSearch && matchesStatus && matchesPriority && matchesTaskType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
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

  const getTaskTypeColor = (taskType: string) => {
    switch (taskType) {
      case 'CLEANING': return 'bg-blue-100 text-blue-800'
      case 'MAINTENANCE': return 'bg-purple-100 text-purple-800'
      case 'INSPECTION': return 'bg-green-100 text-green-800'
      case 'DEEP_CLEANING': return 'bg-indigo-100 text-indigo-800'
      case 'SETUP': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDuration = (minutes: number) => {
    if (minutes === 0) return '0 min'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return 'N/A'
    return new Date(dateTime).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getProgressPercentage = (task: Task) => {
    if (task.status === 'COMPLETED') return 100
    if (task.status === 'IN_PROGRESS' && task.actual_duration > 0) {
      return Math.min((task.actual_duration / task.estimated_duration) * 100, 95)
    }
    return 0
  }

  const pendingTasks = tasks.filter(t => t.status === 'PENDING').length
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length
  const urgentTasks = tasks.filter(t => t.priority === 'URGENT').length

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Cargando tareas...</span>
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
            <h1 className="text-2xl font-bold mb-2">Tareas de Limpieza</h1>
            <p className="text-gray-600">Gestión y seguimiento de tareas de housekeeping</p>
          </div>
          <Link
            href="/housekeeping/tasks/new"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Tarea
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{pendingTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Play className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Progreso</p>
              <p className="text-2xl font-bold text-gray-900">{inProgressTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completadas</p>
              <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Urgentes</p>
              <p className="text-2xl font-bold text-gray-900">{urgentTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="PENDING">Pendiente</option>
              <option value="IN_PROGRESS">En Progreso</option>
              <option value="COMPLETED">Completada</option>
              <option value="CANCELLED">Cancelada</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas</option>
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
              <option value="URGENT">Urgente</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              value={filterTaskType}
              onChange={(e) => setFilterTaskType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="CLEANING">Limpieza</option>
              <option value="MAINTENANCE">Mantenimiento</option>
              <option value="INSPECTION">Inspección</option>
              <option value="DEEP_CLEANING">Limpieza Profunda</option>
              <option value="SETUP">Configuración</option>
              <option value="OTHER">Otro</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterStatus('all')
                setFilterPriority('all')
                setFilterTaskType('all')
              }}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div key={task.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <ClipboardList className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{task.description}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Home className="h-4 w-4 mr-1" />
                      Habitación {task.room.room_number}
                    </span>
                    <span className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {task.assigned_staff.user.first_name} {task.assigned_staff.user.last_name}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDateTime(task.assigned_date)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {statusLabels[task.status]}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {priorityLabels[task.priority]}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskTypeColor(task.task_type)}`}>
                    {taskTypeLabels[task.task_type]}
                  </span>
                </div>
                <div className="flex space-x-2">
                  {task.status === 'PENDING' && (
                    <button className="bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 transition-colors text-sm flex items-center">
                      <Play className="h-4 w-4 mr-1" />
                      Iniciar
                    </button>
                  )}
                  {task.status === 'IN_PROGRESS' && (
                    <button className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Completar
                    </button>
                  )}
                  <Link
                    href={`/housekeeping/tasks/${task.id}`}
                    className="bg-gray-600 text-white py-1 px-3 rounded-md hover:bg-gray-700 transition-colors text-sm flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Link>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {task.status === 'IN_PROGRESS' && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progreso</span>
                  <span>{Math.round(getProgressPercentage(task))}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(task)}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Task Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Duración Estimada:</span>
                <p className="font-semibold">{formatDuration(task.estimated_duration)}</p>
              </div>
              <div>
                <span className="text-gray-500">Duración Real:</span>
                <p className="font-semibold">{formatDuration(task.actual_duration)}</p>
              </div>
              <div>
                <span className="text-gray-500">Tipo de Habitación:</span>
                <p className="font-semibold">{task.room.room_type.name}</p>
              </div>
              <div>
                <span className="text-gray-500">Piso:</span>
                <p className="font-semibold">{task.room.floor.name}</p>
              </div>
            </div>

            {/* Timeline */}
            {task.status !== 'PENDING' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Cronología</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Asignada:</span>
                    <span>{formatDateTime(task.assigned_date)}</span>
                  </div>
                  {task.started_date && (
                    <div className="flex justify-between">
                      <span>Iniciada:</span>
                      <span>{formatDateTime(task.started_date)}</span>
                    </div>
                  )}
                  {task.completed_date && (
                    <div className="flex justify-between">
                      <span>Completada:</span>
                      <span>{formatDateTime(task.completed_date)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron tareas</h3>
          <p className="text-gray-600">No hay tareas que coincidan con los filtros aplicados.</p>
        </div>
      )}
    </div>
  )
}