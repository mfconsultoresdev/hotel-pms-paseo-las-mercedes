
"use client"

import { useState, useEffect } from "react"
import { Users, Calendar, CheckCircle, FileText, TrendingUp, UserCheck, Clock, Award } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DashboardData {
  metrics: {
    total_staff: number
    active_staff: number
    attendance_rate: number
    scheduled_today: number
    evaluations_this_month: number
  }
  departments: Array<{
    department: string
    _count: { id: number }
  }>
  attendance_by_department: Record<string, { present: number; total: number }>
  recent_evaluations: Array<{
    id: string
    evaluation_date: string
    evaluation_type: string
    overall_rating: number | null
    staff: {
      employee_number: string
      first_name: string
      last_name: string
      department: string
      position: string
    }
  }>
  today_attendance: {
    total: number
    present: number
    absent: number
    late: number
    on_leave: number
  }
}

const DEPARTMENT_LABELS: Record<string, string> = {
  'FRONT_DESK': 'Recepción',
  'HOUSEKEEPING': 'Limpieza',
  'MAINTENANCE': 'Mantenimiento',
  'SECURITY': 'Seguridad',
  'ADMINISTRATION': 'Administración',
  'RESTAURANT': 'Restaurante'
}

const EVALUATION_TYPE_LABELS: Record<string, string> = {
  'PERFORMANCE': 'Desempeño',
  'PROBATIONARY': 'Probatorio',
  'ANNUAL': 'Anual',
  'DISCIPLINARY': 'Disciplinario'
}

export default function StaffManagementDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/staff-management/dashboard')
      if (response.ok) {
        const dashboardData = await response.json()
        setData(dashboardData)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      'FRONT_DESK': 'bg-blue-100 text-blue-800',
      'HOUSEKEEPING': 'bg-green-100 text-green-800',
      'MAINTENANCE': 'bg-orange-100 text-orange-800',
      'SECURITY': 'bg-red-100 text-red-800',
      'ADMINISTRATION': 'bg-purple-100 text-purple-800',
      'RESTAURANT': 'bg-yellow-100 text-yellow-800'
    }
    return colors[department] || 'bg-gray-100 text-gray-800'
  }

  const getRatingColor = (rating: number | null) => {
    if (!rating) return 'text-gray-500'
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 3.5) return 'text-blue-600'
    if (rating >= 2.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-red-600">Error al cargar los datos del dashboard</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Personal</h1>
          <p className="text-gray-600">Panel de control completo del personal del hotel</p>
        </div>
        <div className="flex gap-2">
          <Link href="/staff-management/employees">
            <Button>
              <Users className="h-4 w-4 mr-2" />
              Empleados
            </Button>
          </Link>
          <Link href="/staff-management/schedules">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Horarios
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Personal</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.total_staff}</div>
            <p className="text-xs text-muted-foreground">
              {data.metrics.active_staff} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asistencia</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.attendance_rate}%</div>
            <p className="text-xs text-muted-foreground">
              Tasa de asistencia hoy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turnos Hoy</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.scheduled_today}</div>
            <p className="text-xs text-muted-foreground">
              Horarios programados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evaluaciones</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.evaluations_this_month}</div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presente Hoy</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.today_attendance.present}</div>
            <p className="text-xs text-muted-foreground">
              de {data.today_attendance.total} registros
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Departments Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Personal por Departamento</CardTitle>
            <CardDescription>Distribución de empleados activos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.departments.map((dept) => {
                const attendance = data.attendance_by_department[dept.department] || { present: 0, total: 0 }
                const attendanceRate = attendance.total > 0 
                  ? Math.round((attendance.present / attendance.total) * 100)
                  : 0

                return (
                  <div key={dept.department} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={getDepartmentColor(dept.department)}>
                          {DEPARTMENT_LABELS[dept.department] || dept.department}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {dept._count.id} empleados
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {attendanceRate}% presente esta semana
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${attendanceRate}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Today's Attendance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Asistencia Hoy</CardTitle>
            <CardDescription>Estado actual de la asistencia del personal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Presente</p>
                    <p className="text-2xl font-bold text-green-600">{data.today_attendance.present}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tarde</p>
                    <p className="text-2xl font-bold text-yellow-600">{data.today_attendance.late}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ausente</p>
                    <p className="text-2xl font-bold text-red-600">{data.today_attendance.absent}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Licencia</p>
                    <p className="text-2xl font-bold text-blue-600">{data.today_attendance.on_leave}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Evaluations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Evaluaciones Recientes</CardTitle>
            <CardDescription>Últimas evaluaciones de desempeño realizadas</CardDescription>
          </div>
          <Link href="/staff-management/evaluations">
            <Button variant="outline" size="sm">
              Ver Todas
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {data.recent_evaluations.length === 0 ? (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay evaluaciones recientes</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Calificación</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recent_evaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {evaluation.staff.first_name} {evaluation.staff.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          #{evaluation.staff.employee_number}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getDepartmentColor(evaluation.staff.department)}>
                        {DEPARTMENT_LABELS[evaluation.staff.department]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {EVALUATION_TYPE_LABELS[evaluation.evaluation_type]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className={`text-lg font-bold ${getRatingColor(evaluation.overall_rating)}`}>
                          {evaluation.overall_rating?.toFixed(1) || 'N/A'}
                        </span>
                        {evaluation.overall_rating && (
                          <span className="text-sm text-gray-500">/5.0</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(evaluation.evaluation_date).toLocaleDateString('es-ES')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/staff-management/employees">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Gestionar Empleados</h3>
                  <p className="text-sm text-gray-600">Ver, agregar y editar personal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/staff-management/schedules">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Programar Horarios</h3>
                  <p className="text-sm text-gray-600">Crear y gestionar turnos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/staff-management/evaluations">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Evaluaciones</h3>
                  <p className="text-sm text-gray-600">Revisar desempeño del personal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
