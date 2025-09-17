'use client'

import { useState, useEffect } from 'react'
import { Users, Plus, Eye, Edit, Phone, Mail, Calendar } from 'lucide-react'

interface StaffMember {
  id: string
  employee_number: string
  first_name: string
  last_name: string
  email: string
  phone: string
  department: string
  position: string
  hire_date: string
  is_active: boolean
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      setStaff([
        {
          id: '1',
          employee_number: 'EMP001',
          first_name: 'Ana',
          last_name: 'García',
          email: 'ana.garcia@hotel.com',
          phone: '+1234567890',
          department: 'Recepción',
          position: 'Recepcionista',
          hire_date: '2023-01-15',
          is_active: true
        },
        {
          id: '2',
          employee_number: 'EMP002',
          first_name: 'Carlos',
          last_name: 'López',
          email: 'carlos.lopez@hotel.com',
          phone: '+1234567891',
          department: 'Housekeeping',
          position: 'Supervisor',
          hire_date: '2023-02-20',
          is_active: true
        },
        {
          id: '3',
          employee_number: 'EMP003',
          first_name: 'María',
          last_name: 'Rodríguez',
          email: 'maria.rodriguez@hotel.com',
          phone: '+1234567892',
          department: 'Mantenimiento',
          position: 'Técnico',
          hire_date: '2023-03-10',
          is_active: false
        }
      ])
    } catch (err) {
      setError('Error al cargar el personal')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Cargando personal...</div>
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
            <Users className="h-8 w-8 mr-2" />
            Personal
          </h1>
          <p className="text-gray-500">Gestión del personal del hotel</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Personal
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => (
          <div key={member.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-lg font-semibold text-blue-600">
                    {member.first_name[0]}{member.last_name[0]}
                  </span>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {member.first_name} {member.last_name}
                  </h3>
                  <p className="text-sm text-gray-600">{member.employee_number}</p>
                </div>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                member.is_active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {member.is_active ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium w-20">Departamento:</span>
                <span>{member.department}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium w-20">Posición:</span>
                <span>{member.position}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(member.hire_date).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                <span>{member.phone}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm">
                <Eye className="h-4 w-4 mr-1" />
                Ver
              </button>
              <button className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm">
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Personal</h3>
          <p className="text-2xl font-bold">{staff.length}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Activos</h3>
          <p className="text-2xl font-bold text-green-600">
            {staff.filter(s => s.is_active).length}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Departamentos</h3>
          <p className="text-2xl font-bold">
            {new Set(staff.map(s => s.department)).size}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Promedio Antigüedad</h3>
          <p className="text-2xl font-bold">2.5 años</p>
        </div>
      </div>
    </div>
  )
}