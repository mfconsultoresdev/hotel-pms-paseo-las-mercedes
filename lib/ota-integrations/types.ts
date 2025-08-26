export interface OTAConfig {
  provider: 'booking' | 'expedia' | 'airbnb' | 'hotels' | 'tripadvisor';
  isActive: boolean;
  isTestMode: boolean;
  apiKey: string;
  secretKey?: string;
  hotelId: string;
  endpoint: string;
  credentials: Record<string, any>;
  syncInterval: number; // minutes
  lastSync?: Date;
}

export interface OTARoom {
  id: string;
  otaRoomId: string;
  name: string;
  description: string;
  capacity: number;
  amenities: string[];
  images: string[];
  pricing: {
    baseRate: number;
    currency: string;
    taxes: number;
    fees: number;
  };
  availability: {
    totalRooms: number;
    availableRooms: number;
    blockedRooms: number;
  };
}

export interface OTAInventory {
  roomId: string;
  date: string;
  available: number;
  price: number;
  currency: string;
  restrictions?: string[];
  lastUpdated: Date;
}

export interface OTAReservation {
  id: string;
  otaReservationId: string;
  otaProvider: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: Date;
  checkOut: Date;
  roomId: string;
  roomType: string;
  adults: number;
  children: number;
  totalAmount: number;
  currency: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'modified';
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OTASyncRequest {
  type: 'inventory' | 'reservations' | 'rates' | 'availability';
  startDate?: string;
  endDate?: string;
  roomIds?: string[];
}

export interface OTASyncResponse {
  success: boolean;
  data?: any;
  message: string;
  error?: string;
  syncTimestamp: Date;
  recordsProcessed: number;
}

export interface OTARateUpdate {
  roomId: string;
  date: string;
  rate: number;
  currency: string;
  availability: number;
  restrictions?: string[];
}

export interface OTAInventoryUpdate {
  roomId: string;
  date: string;
  available: number;
  blocked: number;
  outOfOrder: number;
}

export interface OTAMessage {
  id: string;
  type: 'inquiry' | 'modification' | 'cancellation' | 'confirmation';
  subject: string;
  content: string;
  from: string;
  to: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface OTAPerformanceMetrics {
  provider: string;
  period: string;
  totalBookings: number;
  totalRevenue: number;
  averageRate: number;
  occupancyRate: number;
  cancellationRate: number;
  conversionRate: number;
  commissionPaid: number;
  netRevenue: number;
}

export interface OTACalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'reservation' | 'block' | 'maintenance' | 'event';
  roomId?: string;
  description?: string;
  color?: string;
  allDay: boolean;
}

export interface OTANotification {
  id: string;
  type: 'reservation' | 'modification' | 'cancellation' | 'inquiry' | 'system';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  actionRequired: boolean;
  actionUrl?: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface OTASettings {
  autoSync: boolean;
  syncInterval: number;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    webhook: boolean;
  };
  autoConfirm: boolean;
  autoUpdateRates: boolean;
  autoUpdateInventory: boolean;
  commissionRates: Record<string, number>;
  cancellationPolicies: Record<string, string>;
  checkInTime: string;
  checkOutTime: string;
  timezone: string;
}

