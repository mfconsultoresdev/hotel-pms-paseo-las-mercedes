"use client"

import { useState, useEffect } from "react"
import { Award, Plus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Evaluation {
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
}

const EVAL_TYPES: Record<string, string> = {
  'PERFORMANCE': 'Desempeño',
  'PROBATIONARY': 'Probatorio',
  'ANNUAL': 'Anual',
  'DISCIPLINARY': 'Disciplinario'
}

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString())

  useEffect(() => {
    fetchEvaluations()
  }, [yearFilter])

  const fetchEvaluations = async () => {
    try {
      const params = new URLSearchParams({
        year: yearFilter,
        limit: '50'
      })
      
      const response = await fetch(`/api/staff-management/evaluations?${params}`)
      if (response.ok) {
        const data = await response.json()
        setEvaluations(data.evaluations)
      }
    } catch (error) {
      console.error('Error fetching evaluations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRatingColor = (rating: number | null) => {
    if (!rating) return 'text-gray-500'
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 3.5) return 'text-blue-600'
    if (rating >= 2.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return <div className="p-6"><div className="animate-pulse space-y-4"><div className="h-64 bg-gray-200 rounded"></div></div></div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Evaluaciones de Desempeño</h1>
          <p className="text-gray-600">Gestiona las evaluaciones del personal</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />Nueva Evaluación</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evaluaciones ({evaluations.length})</CardTitle>
          <CardDescription>Historial de evaluaciones de desempeño</CardDescription>
        </CardHeader>
        <CardContent>
          {evaluations.length === 0 ? (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay evaluaciones registradas</p>
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
                {evaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell>
                      <div>
                        <div className="font-semibold">
                          {evaluation.staff.first_name} {evaluation.staff.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          #{evaluation.staff.employee_number} - {evaluation.staff.position}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge>{evaluation.staff.department}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{EVAL_TYPES[evaluation.evaluation_type]}</Badge>
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
    </div>
  )
}
