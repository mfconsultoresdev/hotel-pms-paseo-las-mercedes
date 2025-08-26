export interface TourismServiceConfig {
  provider: 'amadeus' | 'sabre' | 'travelport' | 'booking' | 'expedia' | 'local';
  isActive: boolean;
  isTestMode: boolean;
  apiKey: string;
  secretKey?: string;
  endpoint: string;
  credentials: Record<string, any>;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  lastSync?: Date;
}

export interface FlightSearchRequest {
  origin: string; // Airport code
  destination: string; // Airport code
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
  currency?: string;
  maxResults?: number;
}

export interface FlightOffer {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: Date;
  arrivalTime: Date;
  duration: number; // minutes
  stops: number;
  cabinClass: string;
  price: {
    amount: number;
    currency: string;
    basePrice: number;
    taxes: number;
    fees: number;
  };
  segments: FlightSegment[];
  baggage: {
    carryOn: number;
    checked: number;
  };
  refundable: boolean;
  changeable: boolean;
  lastTicketingDate: Date;
  availableSeats: number;
}

export interface FlightSegment {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: Date;
  arrivalTime: Date;
  duration: number;
  aircraft: string;
  cabinClass: string;
  operatingAirline?: string;
}

export interface HotelSearchRequest {
  location: string; // City, address, or coordinates
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  rooms: number;
  currency?: string;
  maxResults?: number;
  amenities?: string[];
  starRating?: number[];
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface HotelOffer {
  id: string;
  name: string;
  chain: string;
  rating: number;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  amenities: string[];
  images: string[];
  rooms: HotelRoom[];
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    children: boolean;
    pets: boolean;
    smoking: boolean;
  };
  reviews: {
    averageRating: number;
    totalReviews: number;
    categories: Record<string, number>;
  };
}

export interface HotelRoom {
  id: string;
  type: string;
  description: string;
  capacity: {
    adults: number;
    children: number;
    maxOccupancy: number;
  };
  amenities: string[];
  images: string[];
  price: {
    amount: number;
    currency: string;
    basePrice: number;
    taxes: number;
    fees: number;
    total: number;
  };
  availability: {
    available: number;
    total: number;
  };
  cancellationPolicy: string;
  mealPlan?: string;
}

export interface CarRentalRequest {
  location: string; // City or airport code
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
  age: number;
  currency?: string;
  maxResults?: number;
}

export interface CarRentalOffer {
  id: string;
  company: string;
  location: string;
  vehicle: {
    type: string;
    category: string;
    make: string;
    model: string;
    year: number;
    transmission: 'automatic' | 'manual';
    fuelType: string;
    seats: number;
    doors: number;
    airConditioning: boolean;
  };
  price: {
    amount: number;
    currency: string;
    basePrice: number;
    taxes: number;
    fees: number;
    total: number;
    perDay: number;
  };
  availability: {
    available: boolean;
    quantity: number;
  };
  included: string[];
  excluded: string[];
  requirements: string[];
  insurance: {
    included: boolean;
    options: Array<{
      type: string;
      price: number;
      description: string;
    }>;
  };
}

export interface ActivitySearchRequest {
  location: string;
  date: string;
  participants: number;
  category?: string;
  duration?: number; // hours
  priceRange?: {
    min: number;
    max: number;
  };
  currency?: string;
  maxResults?: number;
}

export interface ActivityOffer {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  duration: number; // hours
  maxParticipants: number;
  minAge?: number;
  difficulty?: 'easy' | 'moderate' | 'difficult';
  included: string[];
  excluded: string[];
  whatToBring: string[];
  images: string[];
  price: {
    amount: number;
    currency: string;
    perPerson: boolean;
    childrenDiscount?: number;
  };
  availability: {
    available: boolean;
    availableDates: Date[];
    timeSlots: string[];
  };
  reviews: {
    averageRating: number;
    totalReviews: number;
    recentReviews: Array<{
      rating: number;
      comment: string;
      author: string;
      date: Date;
    }>;
  };
  cancellationPolicy: string;
  meetingPoint: string;
  languages: string[];
}

export interface TransferRequest {
  from: string; // Location or address
  to: string; // Location or address
  date: string;
  time: string;
  passengers: number;
  luggage: number;
  vehicleType?: 'shared' | 'private' | 'luxury';
  currency?: string;
}

export interface TransferOffer {
  id: string;
  company: string;
  vehicleType: string;
  vehicle: {
    make: string;
    model: string;
    capacity: number;
    luggageCapacity: number;
    amenities: string[];
  };
  pickup: {
    location: string;
    time: string;
    instructions?: string;
  };
  dropoff: {
    location: string;
    estimatedTime: string;
    instructions?: string;
  };
  duration: number; // minutes
  price: {
    amount: number;
    currency: string;
    perPerson: boolean;
    childrenDiscount?: number;
  };
  included: string[];
  excluded: string[];
  cancellationPolicy: string;
  confirmationRequired: boolean;
}

export interface BookingRequest {
  serviceType: 'flight' | 'hotel' | 'car' | 'activity' | 'transfer';
  offerId: string;
  passengers: Array<{
    type: 'adult' | 'child' | 'infant';
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    passportNumber?: string;
    nationality?: string;
  }>;
  contact: {
    email: string;
    phone: string;
    address?: string;
  };
  specialRequests?: string;
  insurance?: boolean;
  currency: string;
}

export interface BookingResponse {
  success: boolean;
  bookingId?: string;
  confirmationNumber?: string;
  status: 'confirmed' | 'pending' | 'failed';
  message: string;
  error?: string;
  totalAmount: number;
  currency: string;
  paymentRequired: boolean;
  paymentUrl?: string;
  cancellationPolicy: string;
  terms: string;
  metadata?: Record<string, any>;
}

export interface BookingStatus {
  bookingId: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'failed';
  lastUpdated: Date;
  details: Record<string, any>;
  cancellationDeadline?: Date;
  refundAmount?: number;
  refundCurrency?: string;
}

export interface TourismServiceStats {
  provider: string;
  period: string;
  totalSearches: number;
  totalBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  conversionRate: number;
  popularDestinations: Array<{
    location: string;
    searches: number;
    bookings: number;
  }>;
  popularServices: Array<{
    service: string;
    searches: number;
    bookings: number;
  }>;
}

export interface TourismServiceSettings {
  defaultCurrency: string;
  defaultLanguage: string;
  autoBooking: boolean;
  requireConfirmation: boolean;
  cancellationWindow: number; // hours
  refundPolicy: string;
  commissionRates: Record<string, number>;
  partnerCredentials: Record<string, any>;
  webhookUrl?: string;
  notificationSettings: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

