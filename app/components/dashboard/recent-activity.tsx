
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  DollarSign, 
  CreditCard, 
  ShoppingCart, 
  RefreshCw, 
  TrendingUp,
  User,
  Bed
} from "lucide-react"

interface Transaction {
  id: string
  type: string
  description: string
  amount: number
  currency: string
  created_at: string
  guest_name: string | null
  room_number: string | null
  service_name: string | null
}

interface RecentActivityProps {
  transactions: Transaction[]
}

export function RecentActivity({ transactions }: RecentActivityProps) {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'ROOM_CHARGE':
        return Bed
      case 'SERVICE_CHARGE':
        return ShoppingCart
      case 'PAYMENT':
        return CreditCard
      case 'REFUND':
        return RefreshCw
      default:
        return DollarSign
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'ROOM_CHARGE':
        return 'text-blue-600 bg-blue-50'
      case 'SERVICE_CHARGE':
        return 'text-purple-600 bg-purple-50'
      case 'PAYMENT':
        return 'text-green-600 bg-green-50'
      case 'REFUND':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'ROOM_CHARGE':
        return 'Cargo Habitación'
      case 'SERVICE_CHARGE':
        return 'Cargo Servicio'
      case 'PAYMENT':
        return 'Pago'
      case 'REFUND':
        return 'Reembolso'
      case 'ADJUSTMENT':
        return 'Ajuste'
      default:
        return type
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Actividad Reciente
        </CardTitle>
        <CardDescription>
          Últimas transacciones del día
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions && transactions.length > 0 ? (
            transactions.map((transaction) => {
              const Icon = getTransactionIcon(transaction.type)
              const colorClasses = getTransactionColor(transaction.type)
              
              return (
                <div
                  key={transaction.id}
                  className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${colorClasses}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        
                        <div className="mt-1 space-y-1">
                          {transaction.guest_name && (
                            <div className="flex items-center text-xs text-gray-600">
                              <User className="h-3 w-3 mr-1" />
                              {transaction.guest_name}
                            </div>
                          )}
                          
                          {transaction.room_number && (
                            <div className="flex items-center text-xs text-gray-600">
                              <Bed className="h-3 w-3 mr-1" />
                              Hab. {transaction.room_number}
                            </div>
                          )}
                          
                          {transaction.service_name && (
                            <div className="flex items-center text-xs text-gray-600">
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              {transaction.service_name}
                            </div>
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(transaction.created_at).toLocaleString('es-VE')}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          transaction.type === 'REFUND' ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {transaction.type === 'REFUND' ? '-' : '+'}${transaction.amount.toFixed(2)}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(transaction.type)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No hay transacciones recientes</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
