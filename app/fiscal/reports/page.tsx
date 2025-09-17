'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Calendar, Download, FileText, Calculator, TrendingUp, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface FiscalSummary {
  period: {
    type: string
    year: number
    month?: number
    startDate: string
    endDate: string
  }
  totals: {
    total_invoices: number
    gross_revenue: number
    net_revenue: number
    total_iva: number
    total_municipal_tax: number
    total_service_tax: number
    total_discounts: number
    total_payments: number
    outstanding_balance: number
  }
  by_currency: Record<string, any>
  by_tax_rate: Record<string, any>
  by_payment_method: Record<string, any>
  daily_breakdown: any[]
}

export default function FiscalReportsPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [reportType, setReportType] = useState('monthly')
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [fiscalData, setFiscalData] = useState<FiscalSummary | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('summary')

  useEffect(() => {
    if (reportType === 'monthly') {
      const start = new Date(year, month - 1, 1)
      const end = new Date(year, month, 0)
      setStartDate(start.toISOString().split('T')[0])
      setEndDate(end.toISOString().split('T')[0])
    }
  }, [reportType, year, month])

  useEffect(() => {
    if (startDate && endDate) {
      fetchFiscalReport()
    }
  }, [startDate, endDate])

  const fetchFiscalReport = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const dummyData: FiscalSummary = {
        period: {
          type: reportType,
          year,
          month: reportType === 'monthly' ? month : undefined,
          startDate,
          endDate
        },
        totals: {
          total_invoices: 156,
          gross_revenue: 45250.00,
          net_revenue: 38000.00,
          total_iva: 7240.00,
          total_municipal_tax: 452.50,
          total_service_tax: 678.75,
          total_discounts: 1280.75,
          total_payments: 43500.00,
          outstanding_balance: 1750.00
        },
        by_currency: {
          USD: { invoices: 120, amount: 35000.00 },
          EUR: { invoices: 25, amount: 8500.00 },
          COP: { invoices: 11, amount: 1750.00 }
        },
        by_tax_rate: {
          '0%': { invoices: 15, amount: 2500.00 },
          '16%': { invoices: 125, amount: 38000.00 },
          '19%': { invoices: 16, amount: 4750.00 }
        },
        by_payment_method: {
          'cash': { invoices: 45, amount: 12500.00 },
          'card': { invoices: 78, amount: 24500.00 },
          'transfer': { invoices: 33, amount: 8250.00 }
        },
        daily_breakdown: [
          { date: '2024-07-01', invoices: 8, revenue: 2850.00 },
          { date: '2024-07-02', invoices: 12, revenue: 4200.00 },
          { date: '2024-07-03', invoices: 6, revenue: 2100.00 },
          { date: '2024-07-04', invoices: 15, revenue: 5250.00 },
          { date: '2024-07-05', invoices: 9, revenue: 3150.00 }
        ]
      }
      
      setFiscalData(dummyData)
    } catch (error) {
      setError('Error al generar el reporte fiscal')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateReport = () => {
    fetchFiscalReport()
  }

  const handleDownloadReport = (format: string) => {
    if (!fiscalData) return
    
    // Simulate download
    const filename = `reporte_fiscal_${fiscalData.period.startDate}_${fiscalData.period.endDate}.${format}`
    alert(`Descargando reporte en formato ${format.toUpperCase()}: ${filename}`)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es })
  }

  const getMonthName = (monthNumber: number) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]
    return months[monthNumber - 1]
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Generando reporte fiscal...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Reportes Fiscales</h1>
        <p className="text-gray-600">Generar reportes fiscales y declaraciones de impuestos</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filtros de Reporte */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Configuración del Reporte
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Reporte</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="monthly">Mensual</option>
              <option value="quarterly">Trimestral</option>
              <option value="yearly">Anual</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              min="2020"
              max="2030"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {reportType === 'monthly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mes</label>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {getMonthName(i + 1)}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {reportType === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
        </div>
        
        <div className="mt-4">
          <button
            onClick={handleGenerateReport}
            disabled={loading || !startDate || !endDate}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            Generar Reporte
          </button>
        </div>
      </div>

      {fiscalData && (
        <>
          {/* Resumen del Período */}
          <div className="bg-white border rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Resumen del Período
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownloadReport('pdf')}
                  className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </button>
                <button
                  onClick={() => handleDownloadReport('excel')}
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-600">Total Facturas</h3>
                <p className="text-2xl font-bold text-blue-900">{fiscalData.totals.total_invoices}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-600">Ingresos Brutos</h3>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(fiscalData.totals.gross_revenue)}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-purple-600">Ingresos Netos</h3>
                <p className="text-2xl font-bold text-purple-900">{formatCurrency(fiscalData.totals.net_revenue)}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-orange-600">IVA Total</h3>
                <p className="text-2xl font-bold text-orange-900">{formatCurrency(fiscalData.totals.total_iva)}</p>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600">Impuesto Municipal</h3>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(fiscalData.totals.total_municipal_tax)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600">Impuesto de Servicio</h3>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(fiscalData.totals.total_service_tax)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600">Total Descuentos</h3>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(fiscalData.totals.total_discounts)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600">Saldo Pendiente</h3>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(fiscalData.totals.outstanding_balance)}</p>
              </div>
            </div>
          </div>

          {/* Tabs de Análisis */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'summary'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Resumen
                </button>
                <button
                  onClick={() => setActiveTab('currency')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'currency'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Por Moneda
                </button>
                <button
                  onClick={() => setActiveTab('tax')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'tax'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Por Tasa de Impuesto
                </button>
                <button
                  onClick={() => setActiveTab('payment')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'payment'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Por Método de Pago
                </button>
                <button
                  onClick={() => setActiveTab('daily')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'daily'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Desglose Diario
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'summary' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Resumen General</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Período</h4>
                      <p className="text-sm text-gray-600">
                        {formatDate(fiscalData.period.startDate)} - {formatDate(fiscalData.period.endDate)}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Tipo de Reporte</h4>
                      <p className="text-sm text-gray-600 capitalize">{fiscalData.period.type}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'currency' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Análisis por Moneda</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moneda</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facturas</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries(fiscalData.by_currency).map(([currency, data]) => (
                          <tr key={currency}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{currency}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.invoices}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(data.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'tax' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Análisis por Tasa de Impuesto</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasa</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facturas</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries(fiscalData.by_tax_rate).map(([rate, data]) => (
                          <tr key={rate}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.invoices}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(data.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Análisis por Método de Pago</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facturas</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries(fiscalData.by_payment_method).map(([method, data]) => (
                          <tr key={method}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{method}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.invoices}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(data.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'daily' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Desglose Diario</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facturas</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingresos</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {fiscalData.daily_breakdown.map((day, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatDate(day.date)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.invoices}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(day.revenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}