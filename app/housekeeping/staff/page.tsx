'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  User,
  Clock,
  TrendingUp,
  Search,
  Plus,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Star
} from 'lucide-react'
import Link from 'next/link'

interface StaffMember {
  id: string
  employee_code: string
  shift_start: string
  shift_end: string
  skill_level: string
  is_active: boolean
  is_available: boolean
  current_location: string
  tasks_completed: number
  quality_rating: number
  user: {
    id: string
    name: string
    first_name: string
    last_name: string
    email: string
    phone: string
    position: string
  }
  performance_metrics: {
    total_tasks: number
    completed_tasks: number
    completion_rate: number
    avg_task_time: number
    quality_score: number
  }
}

export default function HousekeepingStaffPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterSkill, setFilterSkill] = useState('all')

  useEffect(() => {
    fetchStaffMembers()
  }, [])

  const fetchStaffMembers = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const dummyStaff: StaffMember[] = [
        {
          id: '1',
          employee_code: 'HK001',
          shift_start: '08:00',
          shift_end: '16:00',
          skill_level: 'senior',
          is_active: true,
          is_available: true,
          current_location: 'Piso 2',
          tasks_completed: 15,
          quality_rating: 4.8,
          user: {
            id: '1',
            name: 'María García',
            first_name: 'María',
            last_name: 'García',
            email: 'maria.garcia@hotel.com',
            phone: '+57 300 123 4567',
            position: 'Supervisora de Limpieza'
          },
          performance_metrics: {
            total_tasks: 20,
            completed_tasks: 18,
            completion_rate: 90,
            avg_task_time: 35,
            quality_score: 4.8
          }
        },
        {
          id: '2',
          employee_code: 'HK002',
          shift_start: '16:00',
          shift_end: '00:00',
          skill_level: 'intermediate',
          is_active: true,
          is_available: true,
          current_location: 'Piso 1',
          tasks_completed: 12,
          quality_rating: 4.5,
          user: {
            id: '2',
            name: 'Carlos López',
            first_name: 'Carlos',
            last_name: 'López',
            email: 'carlos.lopez@hotel.com',
            phone: '+57 300 234 5678',
            position: 'Asistente de Limpieza'
          },
          performance_metrics: {
            total_tasks: 15,
            completed_tasks: 12,
            completion_rate: 80,
            avg_task_time: 42,
            quality_score: 4.5
          }
        },
        {
          id: '3',
          employee_code: 'HK003',
          shift_start: '06:00',
          shift_end: '14:00',
          skill_level: 'junior',
          is_active: true,
          is_available: false,
          current_location: 'En descanso',
          tasks_completed: 8,
          quality_rating: 4.2,
          user: {
            id: '3',
            name: 'Ana Rodríguez',
            first_name: 'Ana',
            last_name: 'Rodríguez',
            email: 'ana.rodriguez@hotel.com',
            phone: '+57 300 345 6789',
            position: 'Auxiliar de Limpieza'
          },
          performance_metrics: {
            total_tasks: 10,
            completed_tasks: 8,
            completion_rate: 80,
            avg_task_time: 48,
            quality_score: 4.2
          }
        }
      ]
      
      setStaffMembers(dummyStaff)
    } catch (error) {
      setError('Error al cargar el personal')
    } finally {
      setLoading(false)
    }
  }

  const filteredStaff = staffMembers.filter(member => {
    const matchesSearch = member.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.employee_code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'available' && member.is_available) ||
                         (filterStatus === 'unavailable' && !member.is_available)
    const matchesSkill = filterSkill === 'all' || member.skill_level === filterSkill
    
    return matchesSearch && matchesStatus && matchesSkill
  })

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'senior': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'junior': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSkillLevelLabel = (level: string) => {
    switch (level) {
      case 'senior': return 'Senior'
      case 'intermediate': return 'Intermedio'
      case 'junior': return 'Junior'
      default: return level
    }
  }

  const getAvailabilityColor = (isAvailable: boolean) => {
    return isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Cargando personal...</span>
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
            <h1 className="text-2xl font-bold mb-2">Personal de Limpieza</h1>
            <p className="text-gray-600">Gestión y monitoreo del personal de limpieza</p>
          </div>
          <Link
            href="/housekeeping/staff/new"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Personal
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o código..."
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
              <option value="available">Disponible</option>
              <option value="unavailable">No Disponible</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Habilidad</label>
            <select
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="senior">Senior</option>
              <option value="intermediate">Intermedio</option>
              <option value="junior">Junior</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterStatus('all')
                setFilterSkill('all')
              }}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((member) => (
          <div key={member.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold">{member.user.name}</h3>
                  <p className="text-sm text-gray-600">{member.user.position}</p>
                  <p className="text-xs text-gray-500">{member.employee_code}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(member.is_available)}`}>
                  {member.is_available ? 'Disponible' : 'No Disponible'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(member.skill_level)}`}>
                  {getSkillLevelLabel(member.skill_level)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>{member.shift_start} - {member.shift_end}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{member.current_location}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>{member.tasks_completed} tareas completadas</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Star className="h-4 w-4 mr-2" />
                <span>Calificación: {member.quality_rating}/5</span>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Rendimiento</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Tasa de Completado:</span>
                  <p className="font-semibold text-green-600">{member.performance_metrics.completion_rate}%</p>
                </div>
                <div>
                  <span className="text-gray-500">Tiempo Promedio:</span>
                  <p className="font-semibold text-blue-600">{member.performance_metrics.avg_task_time} min</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Link
                  href={`/housekeeping/staff/${member.id}`}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors text-center text-sm"
                >
                  Ver Detalles
                </Link>
                <Link
                  href={`/housekeeping/staff/${member.id}/tasks`}
                  className="flex-1 bg-green-600 text-white py-2 px-3 rounded-md hover:bg-green-700 transition-colors text-center text-sm"
                >
                  Asignar Tareas
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <a href={`tel:${member.user.phone}`} className="flex items-center hover:text-blue-600">
                  <Phone className="h-4 w-4 mr-1" />
                  Llamar
                </a>
                <a href={`mailto:${member.user.email}`} className="flex items-center hover:text-blue-600">
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontró personal</h3>
          <p className="text-gray-600">No hay miembros del personal que coincidan con los filtros aplicados.</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Personal</p>
              <p className="text-2xl font-bold text-gray-900">{staffMembers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Disponibles</p>
              <p className="text-2xl font-bold text-gray-900">
                {staffMembers.filter(m => m.is_available).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Promedio Calificación</p>
              <p className="text-2xl font-bold text-gray-900">
                {(staffMembers.reduce((sum, m) => sum + m.quality_rating, 0) / staffMembers.length).toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tiempo Promedio</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(staffMembers.reduce((sum, m) => sum + m.performance_metrics.avg_task_time, 0) / staffMembers.length)} min
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}