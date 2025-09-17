'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  FileText, 
  Calendar,
  Phone,
  Mail,
  CreditCard,
  TrendingDown,
  AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface AccountReceivable {
  id: string
  invoice_number: string
  total_amount: number
  outstanding_balance: number
  total_paid: number
  days_overdue: number
  aging_category: string
  risk_level: string
  due_date?: string
  invoice_date: string
  currency: string
  payment_status: string
  guest?: {
    first_name: string
    last_name: string
    email?: string
    phone?: string
    document_number?: string
    vip_status: boolean
  }
  reservation?: {
    id: string
    check_in_date: string
    check_out_date: string
  }
}

export default function AccountsReceivablePage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [accounts, setAccounts] = useState<AccountReceivable[]>([])
  const [filteredAccounts, setFilteredAccounts] = useState<AccountReceivable[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedRisk, setSelectedRisk] = useState('all')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAccountsReceivable()
  }, [])

  useEffect(() => {
    filterAccounts()
  }, [accounts, searchTerm, selectedStatus, selectedRisk])

  const fetchAccountsReceivable = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/accounts-receivable')
      if (!response.ok) {
        throw new Error('Failed to fetch accounts receivable')
      }
      
      const data = await response.json()
      setAccounts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const filterAccounts = () => {
    let filtered = accounts

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(account =>
        account.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.guest?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.guest?.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.guest?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(account => account.payment_status === selectedStatus)
    }

    // Risk filter
    if (selectedRisk !== 'all') {
      filtered = filtered.filter(account => account.risk_level === selectedRisk)
    }

    setFilteredAccounts(filtered)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'partial': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAgingCategory = (days: number) => {
    if (days <= 30) return 'current'
    if (days <= 60) return '31-60'
    if (days <= 90) return '61-90'
    return 'over_90'
  }

  const calculateSummary = () => {
    const totalOutstanding = accounts.reduce((sum, account) => sum + account.outstanding_balance, 0)
    const totalOverdue = accounts.filter(a => a.days_overdue > 0).reduce((sum, account) => sum + account.outstanding_balance, 0)
    const highRiskCount = accounts.filter(a => a.risk_level === 'high').length
    const overdueCount = accounts.filter(a => a.days_overdue > 0).length

    return {
      totalOutstanding,
      totalOverdue,
      highRiskCount,
      overdueCount,
      totalAccounts: accounts.length
    }
  }

  const summary = calculateSummary()

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Cargando cuentas por cobrar...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
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
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Cuentas por Cobrar</h1>
        <p className="text-gray-500">Gestión de cobranza y seguimiento de pagos</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total por Cobrar</p>
              <p className="text-2xl font-bold">${summary.totalOutstanding.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Vencido</p>
              <p className="text-2xl font-bold">${summary.totalOverdue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center">
            <TrendingDown className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Alto Riesgo</p>
              <p className="text-2xl font-bold">{summary.highRiskCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Vencidas</p>
              <p className="text-2xl font-bold">{summary.overdueCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Cuentas</p>
              <p className="text-2xl font-bold">{summary.totalAccounts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Buscar por factura, huésped..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="partial">Parcial</option>
              <option value="paid">Pagado</option>
              <option value="overdue">Vencido</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Riesgo
            </label>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los riesgos</option>
              <option value="high">Alto</option>
              <option value="medium">Medio</option>
              <option value="low">Bajo</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedStatus('all')
                setSelectedRisk('all')
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Resumen
          </button>
          <button
            onClick={() => setActiveTab('overdue')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overdue'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Vencidas
          </button>
          <button
            onClick={() => setActiveTab('high-risk')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'high-risk'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Alto Riesgo
          </button>
        </nav>
      </div>

      {/* Accounts Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        {filteredAccounts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No se encontraron cuentas por cobrar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Factura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Huésped
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo Pendiente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Días Vencido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Riesgo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {account.invoice_number}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(account.invoice_date), 'dd/MM/yyyy', { locale: es })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {account.guest?.first_name} {account.guest?.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {account.guest?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${account.total_amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${account.outstanding_balance.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        account.days_overdue > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {account.days_overdue > 0 ? `${account.days_overdue} días` : 'Al día'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(account.payment_status)}`}>
                        {account.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(account.risk_level)}`}>
                        {account.risk_level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Ver
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Cobrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}