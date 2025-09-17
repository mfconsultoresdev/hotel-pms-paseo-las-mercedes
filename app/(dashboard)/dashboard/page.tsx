'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface DashboardData {
  totalRooms: number
  occupiedRooms: number
  availableRooms: number
  totalGuests: number
  checkInsToday: number
  checkOutsToday: number
  revenue: number
  occupancyRate: number
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/dashboard')
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      
      const data = await response.json()
      setDashboardData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button 
            onClick={fetchDashboardData} 
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Retry
          </button>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
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
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {session?.user?.name || 'User'}
          </p>
        </div>
        <button 
          onClick={fetchDashboardData} 
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Rooms</h3>
          <p className="text-2xl font-bold">{dashboardData?.totalRooms || 0}</p>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Occupied Rooms</h3>
          <p className="text-2xl font-bold text-orange-600">{dashboardData?.occupiedRooms || 0}</p>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Available Rooms</h3>
          <p className="text-2xl font-bold text-green-600">{dashboardData?.availableRooms || 0}</p>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Occupancy Rate</h3>
          <p className="text-2xl font-bold text-blue-600">{dashboardData?.occupancyRate?.toFixed(1) || 0}%</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Check-ins Today</h3>
          <p className="text-2xl font-bold">{dashboardData?.checkInsToday || 0}</p>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Check-outs Today</h3>
          <p className="text-2xl font-bold">{dashboardData?.checkOutsToday || 0}</p>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">${dashboardData?.revenue?.toLocaleString() || 0}</p>
        </div>
      </div>
    </div>
  )
}