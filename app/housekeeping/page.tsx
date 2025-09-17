'use client'

import { useState, useEffect } from 'react'
import { 
  ClipboardList, 
  Users, 
  Package, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  BarChart3,
  Plus
} from 'lucide-react'
import Link from 'next/link'

interface DashboardData {
  task_stats: {
    total: number
    completed: number
    pending: number
    in_progress: number
    high_priority: number
    completion_rate: number
  }
  room_stats: Array<{
    status: string
    count: number
  }>
  staff_stats: {
    on_duty: number
    present_today: number
    availability_rate: number
  }
  supply_stats: {
    low_stock_count: number
  }
  performance: {
    avg_completion_time: number
    weekly_trend: Array<{
      day: string
      date: string
      completed: number
      pending: number
    }>
  }
}

export default function HousekeepingPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const dummyData: DashboardData = {
        task_stats: {
          total: 45,
          completed: 32,
          pending: 8,
          in_progress: 5,
          high_priority: 3,
          completion_rate: 71
        },
        room_stats: [
          { status: 'clean', count: 25 },
          { status: 'dirty', count: 8 },
          { status: 'out_of_order', count: 2 },
          { status: 'maintenance', count: 1 }
        ],
        staff_stats: {
          on_duty: 8,
          present_today: 10,
          availability_rate: 80
        },
        supply_stats: {
          low_stock_count: 3
        },
        performance: {
          avg_completion_time: 45,
          weekly_trend: [
            { day: 'Lun', date: '2024-07-22', completed: 28, pending: 12 },
            { day: 'Mar', date: '2024-07-23', completed: 31, pending: 9 },
            { day: 'Mié', date: '2024-07-24', completed: 29, pending: 11 },
            { day: 'Jue', date: '2024-07-25', completed: 32, pending: 8 },
            { day: 'Vie', date: '2024-07-26', completed: 30, pending: 10 }
          ]
        }
      }
      
      setDashboardData(dummyData)
    } catch (error) {
      setError('Error al cargar los datos del dashboard')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clean': return 'bg-green-100 text-green-800'
      case 'dirty': return 'bg-red-100 text-red-800'
      case 'out_of_order': return 'bg-yellow-100 text-yellow-800'
      case 'maintenance': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'clean': return 'Limpia'
      case 'dirty': return 'Sucia'
      case 'out_of_order': return 'Fuera de Servicio'
      case 'maintenance': return 'Mantenimiento'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Cargando dashboard...</span>
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
        <h1 className="text-2xl font-bold mb-2">Dashboard de Limpieza</h1>
        <p className="text-gray-600">Gestión y monitoreo de tareas de limpieza</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Resumen
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tasks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tareas
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'rooms'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Habitaciones
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'performance'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Rendimiento
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && dashboardData && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ClipboardList className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tareas</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.task_stats.total}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.task_stats.completed}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.task_stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tasa de Completado</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.task_stats.completion_rate}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Room Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Estado de Habitaciones</h2>
              <div className="space-y-3">
                {dashboardData.room_stats.map((room) => (
                  <div key={room.status} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">{getStatusLabel(room.status)}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold">{room.count}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                        {room.count} habitaciones
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Personal</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">En Servicio</span>
                  <span className="text-lg font-bold text-green-600">{dashboardData.staff_stats.on_duty}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Presentes Hoy</span>
                  <span className="text-lg font-bold">{dashboardData.staff_stats.present_today}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Tasa de Disponibilidad</span>
                  <span className="text-lg font-bold text-blue-600">{dashboardData.staff_stats.availability_rate}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/housekeeping/tasks/new"
                className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-5 w-5 mr-3 text-blue-600" />
                <div>
                  <h3 className="font-medium">Nueva Tarea</h3>
                  <p className="text-sm text-gray-500">Crear tarea de limpieza</p>
                </div>
              </Link>

              <Link
                href="/housekeeping/staff"
                className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="h-5 w-5 mr-3 text-green-600" />
                <div>
                  <h3 className="font-medium">Gestionar Personal</h3>
                  <p className="text-sm text-gray-500">Ver y asignar personal</p>
                </div>
              </Link>

              <Link
                href="/housekeeping/supplies"
                className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Package className="h-5 w-5 mr-3 text-purple-600" />
                <div>
                  <h3 className="font-medium">Inventario</h3>
                  <p className="text-sm text-gray-500">Gestionar suministros</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Tareas de Limpieza</h2>
          <p className="text-gray-600">Gestión de tareas de limpieza y mantenimiento</p>
          <div className="mt-4">
            <Link
              href="/housekeeping/tasks"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Ver Todas las Tareas
            </Link>
          </div>
        </div>
      )}

      {/* Rooms Tab */}
      {activeTab === 'rooms' && (
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Estado de Habitaciones</h2>
          <p className="text-gray-600">Monitoreo del estado de todas las habitaciones</p>
          <div className="mt-4">
            <Link
              href="/housekeeping/rooms"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Ver Estado de Habitaciones
            </Link>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && dashboardData && (
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Métricas de Rendimiento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Tiempo Promedio de Completado</h3>
                <p className="text-2xl font-bold text-blue-600">{dashboardData.performance.avg_completion_time} min</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Tareas de Alta Prioridad</h3>
                <p className="text-2xl font-bold text-red-600">{dashboardData.task_stats.high_priority}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Tendencia Semanal</h2>
            <div className="space-y-3">
              {dashboardData.performance.weekly_trend.map((day) => (
                <div key={day.date} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{day.day} {day.date}</span>
                  <div className="flex space-x-4">
                    <span className="text-sm text-green-600">{day.completed} completadas</span>
                    <span className="text-sm text-yellow-600">{day.pending} pendientes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}