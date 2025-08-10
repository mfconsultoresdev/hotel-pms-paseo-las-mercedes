
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  UserCheck,
  UserX,
  Calendar,
  Users,
  BedDouble,
  ShoppingCart,
  Zap
} from "lucide-react"

export function QuickActions() {
  const router = useRouter()

  const actions = [
    {
      title: "Nueva Reserva",
      description: "Crear reserva rápida",
      icon: Calendar,
      color: "bg-blue-600 hover:bg-blue-700",
      onClick: () => router.push('/reservations/new')
    },
    {
      title: "Check-in",
      description: "Procesar llegada",
      icon: UserCheck,
      color: "bg-green-600 hover:bg-green-700",
      onClick: () => router.push('/checkin')
    },
    {
      title: "Check-out",
      description: "Procesar salida",
      icon: UserX,
      color: "bg-orange-600 hover:bg-orange-700",
      onClick: () => router.push('/checkout')
    },
    {
      title: "Ver Habitaciones",
      description: "Estado actual",
      icon: BedDouble,
      color: "bg-purple-600 hover:bg-purple-700",
      onClick: () => router.push('/rooms')
    },
    {
      title: "Nuevo Huésped",
      description: "Registrar cliente",
      icon: Users,
      color: "bg-indigo-600 hover:bg-indigo-700",
      onClick: () => router.push('/guests/new')
    },
    {
      title: "POS",
      description: "Punto de venta",
      icon: ShoppingCart,
      color: "bg-emerald-600 hover:bg-emerald-700",
      onClick: () => router.push('/pos')
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Acciones Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              className={`${action.color} text-white justify-start h-auto p-4`}
              variant="default"
            >
              <div className="flex items-center space-x-3 w-full">
                <action.icon className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
