'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Bed, 
  Calendar, 
  Users, 
  CreditCard, 
  Settings, 
  Menu,
  LogOut,
  Hotel,
  BarChart3,
  ShoppingCart,
  FileText,
  AlertTriangle,
  Calculator
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

interface SidebarNavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
}

const sidebarNavItems: SidebarNavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Resumen general del hotel'
  },
  {
    title: 'Habitaciones',
    href: '/rooms',
    icon: Bed,
    description: 'Gestión de habitaciones y estados'
  },
  {
    title: 'Reservas',
    href: '/reservations',
    icon: Calendar,
    description: 'Sistema de reservas'
  },
  {
    title: 'Huéspedes',
    href: '/guests',
    icon: Users,
    description: 'Base de datos de huéspedes'
  },
  {
    title: 'Facturación',
    href: '/billing',
    icon: CreditCard,
    description: 'Facturación y pagos'
  },
  {
    title: 'POS/Ventas',
    href: '/pos',
    icon: ShoppingCart,
    description: 'Punto de venta integrado'
  },
  {
    title: 'Cuentas x Cobrar',
    href: '/accounts-receivable',
    icon: AlertTriangle,
    description: 'Gestión de cobranza'
  },
  {
    title: 'Reportes Fiscales',
    href: '/fiscal/reports',
    icon: Calculator,
    description: 'Reportes para SENIAT'
  },
  {
    title: 'Reportes',
    href: '/reports',
    icon: BarChart3,
    description: 'Reportes y analytics'
  },
  {
    title: 'Configuración',
    href: '/settings',
    icon: Settings,
    description: 'Configuración del sistema'
  }
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden w-64 overflow-y-auto border-r bg-white lg:block">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center gap-2 border-b p-6">
            <Hotel className="h-6 w-6" />
            <div>
              <h2 className="text-lg font-semibold">Hotel PMS</h2>
              <p className="text-sm text-gray-500">Paseo Las Mercedes</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {sidebarNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <div>
                    <div>{item.title}</div>
                    <div className="text-xs text-gray-500">
                      {item.description}
                    </div>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">
                  {session?.user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-gray-900">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session?.user?.email}
                </p>
              </div>
              <button
                onClick={() => signOut()}
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center gap-2 border-b p-6">
            <Hotel className="h-6 w-6" />
            <div>
              <h2 className="text-lg font-semibold">Hotel PMS</h2>
              <p className="text-sm text-gray-500">Paseo Las Mercedes</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {sidebarNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <div>
                    <div>{item.title}</div>
                    <div className="text-xs text-gray-500">
                      {item.description}
                    </div>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="border-b bg-white p-4 lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              >
                <Menu className="h-4 w-4" />
              </button>
              <div>
                <h1 className="text-lg font-semibold">Hotel PMS</h1>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}