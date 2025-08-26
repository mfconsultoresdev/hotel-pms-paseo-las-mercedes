import { 
  OTAConfig, 
  OTAReservation, 
  OTAInventory, 
  OTARateUpdate,
  OTASyncRequest, 
  OTASyncResponse 
} from './types';

export class BookingComIntegration {
  private config: OTAConfig;
  private baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: OTAConfig) {
    this.config = config;
    this.baseUrl = config.isTestMode 
      ? 'https://distribution-xml.booking.com/2.4/json' 
      : 'https://distribution-xml.booking.com/2.4/json';
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${this.config.apiKey}:${this.config.secretKey || ''}`).toString('base64')}`,
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: this.config.apiKey,
          client_secret: this.config.secretKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`Booking.com OAuth failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // 1 minute buffer

      return this.accessToken || '';
    } catch (error) {
      console.error('Booking.com access token retrieval failed:', error);
      throw new Error('Failed to get Booking.com access token');
    }
  }

  async syncReservations(request: OTASyncRequest): Promise<OTASyncResponse> {
    try {
      const accessToken = await this.getAccessToken();
      const startDate = request.startDate || new Date().toISOString().split('T')[0];
      const endDate = request.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const response = await fetch(`${this.baseUrl}/reservations/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hotel_id: this.config.hotelId,
          arrival_date: startDate,
          departure_date: endDate,
          status: 'all',
        }),
      });

      if (!response.ok) {
        throw new Error(`Booking.com reservations sync failed: ${response.statusText}`);
      }

      const data = await response.json();
      const reservations = this.mapBookingReservations(data.reservations || []);

      return {
        success: true,
        data: reservations,
        message: `Successfully synced ${reservations.length} reservations from Booking.com`,
        syncTimestamp: new Date(),
        recordsProcessed: reservations.length,
      };
    } catch (error) {
      console.error('Booking.com reservations sync failed:', error);
      return {
        success: false,
        message: 'Failed to sync reservations from Booking.com',
        error: error instanceof Error ? error.message : 'Unknown error',
        syncTimestamp: new Date(),
        recordsProcessed: 0,
      };
    }
  }

  async syncInventory(request: OTASyncRequest): Promise<OTASyncResponse> {
    try {
      const accessToken = await this.getAccessToken();
      const startDate = request.startDate || new Date().toISOString().split('T')[0];
      const endDate = request.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const response = await fetch(`${this.baseUrl}/inventory/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hotel_id: this.config.hotelId,
          start_date: startDate,
          end_date: endDate,
          room_ids: request.roomIds || [],
        }),
      });

      if (!response.ok) {
        throw new Error(`Booking.com inventory sync failed: ${response.statusText}`);
      }

      const data = await response.json();
      const inventory = this.mapBookingInventory(data.inventory || []);

      return {
        success: true,
        data: inventory,
        message: `Successfully synced inventory from Booking.com`,
        syncTimestamp: new Date(),
        recordsProcessed: inventory.length,
      };
    } catch (error) {
      console.error('Booking.com inventory sync failed:', error);
      return {
        success: false,
        message: 'Failed to sync inventory from Booking.com',
        error: error instanceof Error ? error.message : 'Unknown error',
        syncTimestamp: new Date(),
        recordsProcessed: 0,
      };
    }
  }

  async updateRates(rateUpdates: OTARateUpdate[]): Promise<OTASyncResponse> {
    try {
      const accessToken = await this.getAccessToken();

      const rateData = rateUpdates.map(rate => ({
        room_id: rate.roomId,
        date: rate.date,
        rate: rate.rate,
        currency: rate.currency,
        availability: rate.availability,
        restrictions: rate.restrictions || [],
      }));

      const response = await fetch(`${this.baseUrl}/rates/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rateData),
      });

      if (!response.ok) {
        throw new Error(`Booking.com rates update failed: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: data,
        message: `Successfully updated ${rateUpdates.length} rates on Booking.com`,
        syncTimestamp: new Date(),
        recordsProcessed: rateUpdates.length,
      };
    } catch (error) {
      console.error('Booking.com rates update failed:', error);
      return {
        success: false,
        message: 'Failed to update rates on Booking.com',
        error: error instanceof Error ? error.message : 'Unknown error',
        syncTimestamp: new Date(),
        recordsProcessed: 0,
      };
    }
  }

  async updateInventory(inventoryData: OTAInventory[]): Promise<OTASyncResponse> {
    try {
      const accessToken = await this.getAccessToken();

      // Transform inventory data for Booking.com API
      const transformedData = {
        hotel_id: this.config.hotelId,
        inventory: inventoryData,
      };

      const response = await fetch(`${this.baseUrl}/inventory/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) {
        throw new Error(`Booking.com inventory update failed: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: data,
        message: `Successfully updated inventory on Booking.com`,
        syncTimestamp: new Date(),
        recordsProcessed: inventoryData.length,
      };
    } catch (error) {
      console.error('Booking.com inventory update failed:', error);
      return {
        success: false,
        message: 'Failed to update inventory on Booking.com',
        error: error instanceof Error ? error.message : 'Unknown error',
        syncTimestamp: new Date(),
        recordsProcessed: 0,
      };
    }
  }

  async confirmReservation(reservationId: string): Promise<OTASyncResponse> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.baseUrl}/reservations/${reservationId}/confirm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Booking.com reservation confirmation failed: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: data,
        message: 'Reservation confirmed on Booking.com',
        syncTimestamp: new Date(),
        recordsProcessed: 1,
      };
    } catch (error) {
      console.error('Booking.com reservation confirmation failed:', error);
      return {
        success: false,
        message: 'Failed to confirm reservation on Booking.com',
        error: error instanceof Error ? error.message : 'Unknown error',
        syncTimestamp: new Date(),
        recordsProcessed: 0,
      };
    }
  }

  async cancelReservation(reservationId: string, reason?: string): Promise<OTASyncResponse> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.baseUrl}/reservations/${reservationId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: reason || 'Cancelled by hotel',
        }),
      });

      if (!response.ok) {
        throw new Error(`Booking.com reservation cancellation failed: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: data,
        message: 'Reservation cancelled on Booking.com',
        syncTimestamp: new Date(),
        recordsProcessed: 1,
      };
    } catch (error) {
      console.error('Booking.com reservation cancellation failed:', error);
      return {
        success: false,
        message: 'Failed to cancel reservation on Booking.com',
        error: error instanceof Error ? error.message : 'Unknown error',
        syncTimestamp: new Date(),
        recordsProcessed: 0,
      };
    }
  }

  async getReservationDetails(reservationId: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.baseUrl}/reservations/${reservationId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Booking.com reservation retrieval failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Booking.com reservation retrieval failed:', error);
      return null;
    }
  }

  private mapBookingReservations(bookingReservations: any[]): OTAReservation[] {
    return bookingReservations.map(booking => ({
      id: `booking-${booking.reservation_id}`,
      otaReservationId: booking.reservation_id,
      otaProvider: 'booking.com',
      guestName: `${booking.guest.first_name} ${booking.guest.last_name}`,
      guestEmail: booking.guest.email,
      guestPhone: booking.guest.phone,
      checkIn: new Date(booking.arrival_date),
      checkOut: new Date(booking.departure_date),
      roomId: booking.room_id,
      roomType: booking.room_type,
      adults: booking.guests.adults,
      children: booking.guests.children,
      totalAmount: parseFloat(booking.total_price.amount),
      currency: booking.total_price.currency,
      status: this.mapBookingStatus(booking.status),
      specialRequests: booking.special_requests,
      createdAt: new Date(booking.created_at),
      updatedAt: new Date(booking.updated_at),
    }));
  }

  private mapBookingInventory(bookingInventory: any[]): OTAInventory[] {
    return bookingInventory.map(inv => ({
      roomId: inv.room_id,
      date: inv.date,
      available: inv.available,
      price: parseFloat(inv.price.amount),
      currency: inv.price.currency,
      restrictions: inv.restrictions || [],
      lastUpdated: new Date(),
    }));
  }

  private mapBookingStatus(bookingStatus: string): OTAReservation['status'] {
    const statusMap: Record<string, OTAReservation['status']> = {
      'confirmed': 'confirmed',
      'pending': 'pending',
      'cancelled': 'cancelled',
      'modified': 'modified',
      'no_show': 'cancelled',
    };
    return statusMap[bookingStatus] || 'pending';
  }

  async testConnection(): Promise<{ success: boolean; message: string; error?: string }> {
    try {
      const accessToken = await this.getAccessToken();
      
      // Test with a simple API call
      const response = await fetch(`${this.baseUrl}/hotels/${this.config.hotelId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Booking.com connection test successful',
        };
      } else {
        return {
          success: false,
          message: 'Booking.com connection test failed',
          error: response.statusText,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Booking.com connection test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  getSupportedFeatures(): string[] {
    return [
      'reservations_sync',
      'inventory_sync',
      'rates_update',
      'reservation_confirmation',
      'reservation_cancellation',
      'real_time_availability',
      'guest_communication',
    ];
  }
}
