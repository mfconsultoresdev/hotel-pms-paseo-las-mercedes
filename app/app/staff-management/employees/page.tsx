"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Employee {
  id: string
  employee_number: string
  first_name: string
  last_name: string
  email?: string
  department: string
  position: string
  employment_type: string
  is_active: boolean
}

const DEPARTMENTS = ['ALL', 'FRONT_DESK', 'HOUSEKEEPING', 'MAINTENANCE', 'SECURITY', 'ADMINISTRATION', 'RESTAURANT']
const DEPT_LABELS: Record<string, string> = {
  'ALL': 'Todos',
  'FRONT_DESK': 'Recepción',
  'HOUSEKEEPING': 'Limpieza',
  'MAINTENANCE': 'Mantenimiento',
  'SECURITY': 'Seguridad',
  'ADMINISTRATION': 'Administración',
  'RESTAURANT': 'Restaurante'
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("ALL")

  useEffect(() => {
    fetchEmployees()
  }, [departmentFilter, searchTerm])

  const fetchEmployees = async () => {
    try {
      const params = new URLSearchParams({
        department: departmentFilter,
        status: 'active',
        search: searchTerm,
        limit: '50'
      })
      const response = await fetch(`/api/staff-management/employees?${params}`)
      if (response.ok) {
        const data = await response.json()
        setEmployees(data.employees)
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDeptColor = (dept: string) => {
    const colors: Record<string, string> = {
      'FRONT_DESK': 'bg-blue-100 text-blue-800',
      'HOUSEKEEPING': 'bg-green-100 text-green-800',
      'MAINTENANCE': 'bg-orange-100 text-orange-800',
      'SECURITY': 'bg-red-100 text-red-800',
      'ADMINISTRATION': 'bg-purple-100 text-purple-800',
      'RESTAURANT': 'bg-yellow-100 text-yellow-800'
    }
    return colors[dept] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return <div className="p-6"><div className="animate-pulse space-y-4"><div className="h-64 bg-gray-200 rounded"></div></div></div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Empleados</h1>
          <p className="text-gray-600">Administra todo el personal del hotel</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />Nuevo Empleado</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Buscar empleados..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map(dept => (
                  <SelectItem key={dept} value={dept}>{DEPT_LABELS[dept]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Empleados ({employees.length})</CardTitle>
          <CardDescription>Lista completa del personal</CardDescription>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron empleados</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Posición</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{emp.first_name[0]}{emp.last_name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{emp.first_name} {emp.last_name}</div>
                          <div className="text-sm text-gray-500">#{emp.employee_number}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getDeptColor(emp.department)}>{DEPT_LABELS[emp.department]}</Badge>
                    </TableCell>
                    <TableCell>{emp.position}</TableCell>
                    <TableCell>{emp.employment_type}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${emp.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span>{emp.is_active ? 'Activo' : 'Inactivo'}</span>
                      </div>
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
