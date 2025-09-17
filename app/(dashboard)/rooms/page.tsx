'use client'

import { useEffect, useState } from 'react'

interface Room {
  id: string
  number: string
  type: string
  floor: string
  status: string
  price: number
  capacity: number
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRooms = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/rooms')
      if (!response.ok) {
        throw new Error('Failed to fetch rooms')
      }
      
      const data = await response.json()
      setRooms(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'occupied': return 'bg-red-100 text-red-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      case 'cleaning': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Rooms</h1>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white border rounded-lg p-4">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
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
          <h1 className="text-3xl font-bold">Rooms</h1>
          <button 
            onClick={fetchRooms} 
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
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Rooms</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Add Room
        </button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Room {room.number}</h3>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.status)}`}>
                {room.status}
              </span>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Type:</strong> {room.type}</p>
              <p><strong>Floor:</strong> {room.floor}</p>
              <p><strong>Capacity:</strong> {room.capacity} guests</p>
              <p><strong>Price:</strong> ${room.price}/night</p>
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors">
                View
              </button>
              <button className="flex-1 px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Rooms</h3>
          <p className="text-2xl font-bold text-gray-900">{rooms.length}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Available</h3>
          <p className="text-2xl font-bold text-green-600">
            {rooms.filter(r => r.status === 'available').length}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Occupied</h3>
          <p className="text-2xl font-bold text-red-600">
            {rooms.filter(r => r.status === 'occupied').length}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Maintenance</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {rooms.filter(r => r.status === 'maintenance').length}
          </p>
        </div>
      </div>
    </div>
  )
}