"use client"

import { useState, useEffect } from "react"
import { Plus, Calendar, Clock, Filter, Users, Building } from "lucide-react"

interface Schedule {
  id: string
  schedule_date: string
  shift_start: string
  shift_end: string
  break_start?: string
  break_end?: string
  schedule_type: string
  status: string
  scheduled_hours: number
  break_minutes: number
  assigned_areas?: string
  special_tasks?: string
  notes?: string
  staff: {
    id: string
    employee_number: string
    first_name: string
    last_name: string
    department: string
    position: string
    shift_type: string
  }
  hotel: {
    name: string
    address: string
  }
}

const scheduleTypeLabels: Record<string, string> = {
  REGULAR: 'Regular',
  OVERTIME: 'Horas Extra',
  HOLIDAY: 'Festivo',
  WEEKEND: 'Fin de Semana',
  EMERGENCY: 'Emergencia',
  TRAINING: 'Capacitación'
}

const statusLabels: Record<string, string> = {
  SCHEDULED: 'Programado',
  CONFIRMED: 'Confirmado',
  IN_PROGRESS: 'En Progreso',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
  ABSENT: 'Ausente'
}

export default function SchedulesPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterDate, setFilterDate] = useState('')

  useEffect(() => {
    fetchSchedules()
  }, [])

  const fetchSchedules = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const dummySchedules: Schedule[] = [
        {
          id: '1',
          schedule_date: '2024-07-26',
          shift_start: '08:00',
          shift_end: '16:00',
          break_start: '12:00',
          break_end: '13:00',
          schedule_type: 'REGULAR',
          status: 'CONFIRMED',
          scheduled_hours: 8,
          break_minutes: 60,
          assigned_areas: 'Pisos 1-3, Recepción',
          special_tasks: 'Capacitación de nuevo personal',
          notes: 'Revisar inventario de suministros',
          staff: {
            id: '1',
            employee_number: 'EMP001',
            first_name: 'María',
            last_name: 'García',
            department: 'Housekeeping',
            position: 'Supervisora',
            shift_type: 'DAY'
          },
          hotel: {
            name: 'Hotel Paseo Las Mercedes',
            address: 'Av. Principal #123, Ciudad'
          }
        },
        {
          id: '2',
          schedule_date: '2024-07-26',
          shift_start: '16:00',
          shift_end: '00:00',
          schedule_type: 'REGULAR',
          status: 'IN_PROGRESS',
          scheduled_hours: 8,
          break_minutes: 30,
          assigned_areas: 'Pisos 4-6, Mantenimiento',
          staff: {
            id: '2',
            employee_number: 'EMP002',
            first_name: 'Carlos',
            last_name: 'López',
            department: 'Housekeeping',
            position: 'Asistente',
            shift_type: 'NIGHT'
          },
          hotel: {
            name: 'Hotel Paseo Las Mercedes',
            address: 'Av. Principal #123, Ciudad'
          }
        },
        {
          id: '3',
          schedule_date: '2024-07-27',
          shift_start: '06:00',
          shift_end: '14:00',
          schedule_type: 'WEEKEND',
          status: 'SCHEDULED',
          scheduled_hours: 8,
          break_minutes: 60,
          assigned_areas: 'Todo el hotel',
          special_tasks: 'Limpieza profunda de fin de semana',
          staff: {
            id: '3',
            employee_number: 'EMP003',
            first_name: 'Ana',
            last_name: 'Rodríguez',
            department: 'Housekeeping',
            position: 'Auxiliar',
            shift_type: 'DAY'
          },
          hotel: {
            name: 'Hotel Paseo Las Mercedes',
            address: 'Av. Principal #123, Ciudad'
          }
        }
      ]
      
      setSchedules(dummySchedules)
    } catch (error) {
      setError('Error al cargar los horarios')
    } finally {
      setLoading(false)
    }
  }

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = `${schedule.staff.first_name} ${schedule.staff.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.staff.employee_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.assigned_areas?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || schedule.status === filterStatus
    const matchesDepartment = filterDepartment === 'all' || schedule.staff.department === filterDepartment
    const matchesDate = !filterDate || schedule.schedule_date === filterDate
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesDate
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800'
      case 'CONFIRMED': return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED': return 'bg-gray-100 text-gray-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      case 'ABSENT': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getScheduleTypeColor = (type: string) => {
    switch (type) {
      case 'REGULAR': return 'bg-green-100 text-green-800'
      case 'OVERTIME': return 'bg-orange-100 text-orange-800'
      case 'HOLIDAY': return 'bg-purple-100 text-purple-800'
      case 'WEEKEND': return 'bg-blue-100 text-blue-800'
      case 'EMERGENCY': return 'bg-red-100 text-red-800'
      case 'TRAINING': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const scheduledCount = schedules.filter(s => s.status === 'SCHEDULED').length
  const confirmedCount = schedules.filter(s => s.status === 'CONFIRMED').length
  const inProgressCount = schedules.filter(s => s.status === 'IN_PROGRESS').length
  const completedCount = schedules.filter(s => s.status === 'COMPLETED').length

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Cargando horarios...</span>
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
              <Calendar className="h-5 w-5 text-red-400" />
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
            <h1 className="text-2xl font-bold mb-2">Gestión de Horarios</h1>
            <p className="text-gray-600">Programación y seguimiento de turnos del personal</p>
          </div>
          <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Horario
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Programados</p>
              <p className="text-2xl font-bold text-gray-900">{scheduledCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmados</p>
              <p className="text-2xl font-bold text-gray-900">{confirmedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Progreso</p>
              <p className="text-2xl font-bold text-gray-900">{inProgressCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Building className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completados</p>
              <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <input
              type="text"
              placeholder="Buscar empleados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="SCHEDULED">Programado</option>
              <option value="CONFIRMED">Confirmado</option>
              <option value="IN_PROGRESS">En Progreso</option>
              <option value="COMPLETED">Completado</option>
              <option value="CANCELLED">Cancelado</option>
              <option value="ABSENT">Ausente</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="Housekeeping">Limpieza</option>
              <option value="Reception">Recepción</option>
              <option value="Maintenance">Mantenimiento</option>
              <option value="Kitchen">Cocina</option>
              <option value="Security">Seguridad</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterStatus('all')
                setFilterDepartment('all')
                setFilterDate('')
              }}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* Schedules List */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empleado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Áreas Asignadas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSchedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-blue-600">
                          {getInitials(schedule.staff.first_name, schedule.staff.last_name)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {schedule.staff.first_name} {schedule.staff.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {schedule.staff.employee_number} • {schedule.staff.position}
                        </div>
                        <div className="text-xs text-gray-400">
                          {schedule.staff.department}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(schedule.schedule_date)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {schedule.shift_type} Shift
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {schedule.shift_start} - {schedule.shift_end}
                    </div>
                    <div className="text-xs text-gray-500">
                      {schedule.scheduled_hours}h ({schedule.break_minutes}min descanso)
                    </div>
                    {schedule.break_start && schedule.break_end && (
                      <div className="text-xs text-blue-600">
                        Descanso: {schedule.break_start} - {schedule.break_end}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScheduleTypeColor(schedule.schedule_type)}`}>
                      {scheduleTypeLabels[schedule.schedule_type]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                      {statusLabels[schedule.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {schedule.assigned_areas || 'No especificado'}
                    </div>
                    {schedule.special_tasks && (
                      <div className="text-xs text-blue-600 mt-1">
                        ✨ {schedule.special_tasks}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        Editar
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Confirmar
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Cancelar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredSchedules.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron horarios</h3>
          <p className="text-gray-600">No hay horarios que coincidan con los filtros aplicados.</p>
        </div>
      )}

      {/* Schedule Details Modal would go here */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-blue-400 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              Total de Horarios: {schedules.length}
            </h3>
            <p className="text-sm text-blue-700">
              {scheduledCount} programados, {confirmedCount} confirmados, {inProgressCount} en progreso, {completedCount} completados
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}