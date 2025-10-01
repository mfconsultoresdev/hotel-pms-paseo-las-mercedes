"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Schedule {
  id: string
  schedule_date: string
  shift_start: string
  shift_end: string
  schedule_type: string
  status: string
  staff: {
    employee_number: string
    first_name: string
    last_name: string
    department: string
    position: string
  }
}

const DEPT_LABELS: Record<string, string> = {
  'ALL': 'Todos',
  'FRONT_DESK': 'Recepción',
  'HOUSEKEEPING': 'Limpieza',
  'MAINTENANCE': 'Mantenimiento',
  'SECURITY': 'Seguridad',
  'ADMINISTRATION': 'Administración',
  'RESTAURANT': 'Restaurante'
}

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [departmentFilter, setDepartmentFilter] = useState("ALL")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchSchedules()
  }, [departmentFilter, selectedDate])

  const fetchSchedules = async () => {
    try {
      const startDate = selectedDate
      const endDate = new Date(selectedDate)
      endDate.setDate(endDate.getDate() + 7)
      
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate.toISOString().split('T')[0],
        department: departmentFilter
      })
      
      const response = await fetch(`/api/staff-management/schedules?${params}`)
      if (response.ok) {
        const data = await response.json()
        setSchedules(data.schedules)
      }
    } catch (error) {
      console.error('Error fetching schedules:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return <div className="p-6"><div className="animate-pulse space-y-4"><div className="h-64 bg-gray-200 rounded"></div></div></div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Horarios</h1>
          <p className="text-gray-600">Programa y gestiona los turnos del personal</p>
        </div>
        <Button><Calendar className="h-4 w-4 mr-2" />Nuevo Horario</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border rounded-md"
            />
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(DEPT_LABELS).map(dept => (
                  <SelectItem key={dept} value={dept}>{DEPT_LABELS[dept]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Horarios ({schedules.length})</CardTitle>
          <CardDescription>Turnos programados</CardDescription>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay horarios programados</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Horario</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>
                      <div>
                        <div className="font-semibold">
                          {schedule.staff.first_name} {schedule.staff.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {schedule.staff.position}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge>{DEPT_LABELS[schedule.staff.department]}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(schedule.schedule_date).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{formatTime(schedule.shift_start)} - {formatTime(schedule.shift_end)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{schedule.schedule_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={schedule.status === 'SCHEDULED' ? 'default' : 'secondary'}>
                        {schedule.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
