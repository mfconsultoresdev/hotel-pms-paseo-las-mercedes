
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { BedDouble, RefreshCw, Building, Eye } from "lucide-react"

interface RoomsData {
  floorStats: Array<{
    floor_number: number
    total: number
    available: number
    occupied: number
    cleaning: number
    maintenance: number
  }>
  roomTypeStats: Array<{
    room_type: string
    total: number
    available: number
    occupied: number
  }>
}

export function RoomsOverview() {
  const router = useRouter()
  const [data, setData] = useState<RoomsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRoomsData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/rooms/overview')
      
      if (!response.ok) {
        throw new Error('Error al cargar datos de habitaciones')
      }
      
      const roomsData = await response.json()
      setData(roomsData)
    } catch (err) {
      console.error('Rooms overview error:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoomsData()
  }, [])

  const getStatusColor = (status: string, count: number, total: number) => {
    if (count === 0) return 'bg-gray-100'
    
    switch (status) {
      case 'available':
        return 'bg-green-500'
      case 'occupied':
        return 'bg-red-500'
      case 'cleaning':
        return 'bg-yellow-500'
      case 'maintenance':
        return 'bg-orange-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vista General de Habitaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BedDouble className="h-5 w-5" />
            Vista General de Habitaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <BedDouble className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>{error}</p>
            <Button
              onClick={fetchRoomsData}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Por Pisos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Estado por Pisos
          </CardTitle>
          <Button
            onClick={() => router.push('/rooms')}
            variant="outline"
            size="sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Todas
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.floorStats?.map((floor) => (
              <div key={floor.floor_number} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Piso {floor.floor_number}
                  </span>
                  <span className="text-xs text-gray-500">
                    {floor.total} habitaciones
                  </span>
                </div>
                
                <div className="flex rounded-lg overflow-hidden h-3">
                  {floor.available > 0 && (
                    <div
                      className="bg-green-500"
                      style={{ width: `${(floor.available / floor.total) * 100}%` }}
                      title={`${floor.available} disponibles`}
                    />
                  )}
                  {floor.occupied > 0 && (
                    <div
                      className="bg-red-500"
                      style={{ width: `${(floor.occupied / floor.total) * 100}%` }}
                      title={`${floor.occupied} ocupadas`}
                    />
                  )}
                  {floor.cleaning > 0 && (
                    <div
                      className="bg-yellow-500"
                      style={{ width: `${(floor.cleaning / floor.total) * 100}%` }}
                      title={`${floor.cleaning} limpieza`}
                    />
                  )}
                  {floor.maintenance > 0 && (
                    <div
                      className="bg-orange-500"
                      style={{ width: `${(floor.maintenance / floor.total) * 100}%` }}
                      title={`${floor.maintenance} mantenimiento`}
                    />
                  )}
                </div>
                
                <div className="flex justify-between text-xs text-gray-600">
                  <span className="text-green-600">{floor.available} Disp.</span>
                  <span className="text-red-600">{floor.occupied} Ocup.</span>
                  <span className="text-yellow-600">{floor.cleaning} Limp.</span>
                  <span className="text-orange-600">{floor.maintenance} Mant.</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Por Tipo de Habitación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BedDouble className="h-5 w-5" />
            Estado por Tipo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.roomTypeStats?.map((type) => {
              const occupancyRate = type.total > 0 ? (type.occupied / type.total) * 100 : 0
              
              return (
                <div key={type.room_type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {type.room_type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {occupancyRate.toFixed(1)}% ocupación
                    </span>
                  </div>
                  
                  <div className="flex rounded-lg overflow-hidden h-3">
                    <div
                      className="bg-red-500"
                      style={{ width: `${occupancyRate}%` }}
                    />
                    <div
                      className="bg-green-500"
                      style={{ width: `${100 - occupancyRate}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-600">
                    <span className="text-green-600">{type.available} disponibles</span>
                    <span className="text-red-600">{type.occupied} ocupadas</span>
                    <span className="text-gray-500">{type.total} total</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Ocupada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Limpieza</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span>Mantenimiento</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
