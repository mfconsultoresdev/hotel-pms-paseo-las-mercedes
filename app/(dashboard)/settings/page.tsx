'use client'

import { useState, useEffect } from 'react'
import { Building, Settings, Users, DollarSign, Bell } from 'lucide-react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('hotel')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [hotelSettings, setHotelSettings] = useState({
    name: 'Hotel Paseo Las Mercedes',
    address: '',
    phone: '',
    email: '',
    description: '',
    tax_id: '',
    logo_url: '',
    default_currency: 'USD'
  })

  const [systemSettings, setSystemSettings] = useState({
    check_in_time: '15:00',
    check_out_time: '11:00',
    max_advance_booking_days: 365,
    allow_same_day_booking: true,
    require_cc_for_booking: false,
    auto_assign_rooms: false,
    send_confirmation_emails: true,
    send_reminder_emails: true,
    default_language: 'es'
  })

  const [billingSettings, setBillingSettings] = useState({
    tax_rate: 16,
    currency_rates: {
      usd_to_eur: 0.85,
      usd_to_usdt: 1.00,
      usd_to_bnb: 0.0025,
      usd_to_etc: 0.035
    },
    payment_methods: {
      cash: true,
      credit_card: true,
      bank_transfer: true,
      crypto: false
    }
  })

  const handleHotelSave = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess('Configuración del hotel guardada exitosamente')
    } catch (error) {
      setError('Error al guardar la configuración del hotel')
    } finally {
      setLoading(false)
    }
  }

  const handleSystemSave = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess('Configuración del sistema guardada exitosamente')
    } catch (error) {
      setError('Error al guardar la configuración del sistema')
    } finally {
      setLoading(false)
    }
  }

  const handleBillingSave = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess('Configuración de facturación guardada exitosamente')
    } catch (error) {
      setError('Error al guardar la configuración de facturación')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'hotel', label: 'Hotel', icon: Building },
    { id: 'system', label: 'Sistema', icon: Settings },
    { id: 'billing', label: 'Facturación', icon: DollarSign },
    { id: 'notifications', label: 'Notificaciones', icon: Bell }
  ]

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-gray-500">Administrar la configuración del sistema</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM16.707 7.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Hotel Settings */}
      {activeTab === 'hotel' && (
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Configuración del Hotel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Hotel
              </label>
              <input
                type="text"
                value={hotelSettings.name}
                onChange={(e) => setHotelSettings({...hotelSettings, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={hotelSettings.phone}
                onChange={(e) => setHotelSettings({...hotelSettings, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={hotelSettings.email}
                onChange={(e) => setHotelSettings({...hotelSettings, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RIF/Tax ID
              </label>
              <input
                type="text"
                value={hotelSettings.tax_id}
                onChange={(e) => setHotelSettings({...hotelSettings, tax_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <input
                type="text"
                value={hotelSettings.address}
                onChange={(e) => setHotelSettings({...hotelSettings, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={hotelSettings.description}
                onChange={(e) => setHotelSettings({...hotelSettings, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleHotelSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      )}

      {/* System Settings */}
      {activeTab === 'system' && (
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Configuración del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de Check-in
              </label>
              <input
                type="time"
                value={systemSettings.check_in_time}
                onChange={(e) => setSystemSettings({...systemSettings, check_in_time: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de Check-out
              </label>
              <input
                type="time"
                value={systemSettings.check_out_time}
                onChange={(e) => setSystemSettings({...systemSettings, check_out_time: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Máximo días de anticipación
              </label>
              <input
                type="number"
                value={systemSettings.max_advance_booking_days}
                onChange={(e) => setSystemSettings({...systemSettings, max_advance_booking_days: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idioma por defecto
              </label>
              <select
                value={systemSettings.default_language}
                onChange={(e) => setSystemSettings({...systemSettings, default_language: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <h3 className="text-md font-medium">Opciones del Sistema</h3>
            <div className="space-y-3">
              {[
                { key: 'allow_same_day_booking', label: 'Permitir reservas del mismo día' },
                { key: 'require_cc_for_booking', label: 'Requerir tarjeta de crédito para reservar' },
                { key: 'auto_assign_rooms', label: 'Asignación automática de habitaciones' },
                { key: 'send_confirmation_emails', label: 'Enviar emails de confirmación' },
                { key: 'send_reminder_emails', label: 'Enviar emails de recordatorio' }
              ].map((option) => (
                <div key={option.key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{option.label}</span>
                  <input
                    type="checkbox"
                    checked={systemSettings[option.key as keyof typeof systemSettings] as boolean}
                    onChange={(e) => setSystemSettings({...systemSettings, [option.key]: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSystemSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      )}

      {/* Billing Settings */}
      {activeTab === 'billing' && (
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Configuración de Facturación</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tasa de Impuesto (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={billingSettings.tax_rate}
                onChange={(e) => setBillingSettings({...billingSettings, tax_rate: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moneda por defecto
              </label>
              <select
                value={hotelSettings.default_currency}
                onChange={(e) => setHotelSettings({...hotelSettings, default_currency: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="USDT">USDT</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-medium mb-4">Métodos de Pago</h3>
            <div className="space-y-3">
              {[
                { key: 'cash', label: 'Efectivo' },
                { key: 'credit_card', label: 'Tarjeta de Crédito' },
                { key: 'bank_transfer', label: 'Transferencia Bancaria' },
                { key: 'crypto', label: 'Criptomonedas' }
              ].map((method) => (
                <div key={method.key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{method.label}</span>
                  <input
                    type="checkbox"
                    checked={billingSettings.payment_methods[method.key as keyof typeof billingSettings.payment_methods]}
                    onChange={(e) => setBillingSettings({
                      ...billingSettings,
                      payment_methods: {
                        ...billingSettings.payment_methods,
                        [method.key]: e.target.checked
                      }
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleBillingSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      )}

      {/* Notifications Settings */}
      {activeTab === 'notifications' && (
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Configuración de Notificaciones</h2>
          <p className="text-gray-500">Configuración de notificaciones en desarrollo...</p>
        </div>
      )}
    </div>
  )
}