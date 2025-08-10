
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BedDouble, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  UserCheck, 
  UserX,
  Clock
} from "lucide-react"

interface MetricsCardsProps {
  metrics: {
    totalRooms: number
    occupiedRooms: number
    availableRooms: number
    occupancyRate: number
    todayArrivals: number
    todayDepartures: number
    pendingCheckIns: number
    todayRevenue: number
  }
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    {
      title: "Ocupación",
      value: `${metrics.occupancyRate.toFixed(1)}%`,
      description: `${metrics.occupiedRooms}/${metrics.totalRooms} habitaciones`,
      icon: BedDouble,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: metrics.occupancyRate > 75 ? "high" : metrics.occupancyRate > 50 ? "medium" : "low"
    },
    {
      title: "Habitaciones Disponibles",
      value: metrics.availableRooms.toString(),
      description: "Listas para ocupar",
      icon: BedDouble,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Llegadas Hoy",
      value: metrics.todayArrivals.toString(),
      description: "Check-ins programados",
      icon: UserCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Salidas Hoy", 
      value: metrics.todayDepartures.toString(),
      description: "Check-outs programados",
      icon: UserX,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Check-ins Pendientes",
      value: metrics.pendingCheckIns.toString(),
      description: "Requieren atención",
      icon: Clock,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Ingresos del Día",
      value: `$${metrics.todayRevenue.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`,
      description: "USD acumulados hoy",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {card.value}
            </div>
            <p className="text-xs text-gray-500 flex items-center">
              {card.description}
              {card.trend && (
                <Badge 
                  variant={card.trend === 'high' ? 'default' : card.trend === 'medium' ? 'secondary' : 'outline'} 
                  className="ml-2"
                >
                  {card.trend === 'high' ? 'Alta' : card.trend === 'medium' ? 'Media' : 'Baja'}
                </Badge>
              )}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
