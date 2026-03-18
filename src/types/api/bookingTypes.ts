export interface BookingDetail {
  id: number | string;
  booking_id?: number | string;
  guest?: string;
  guest_name?: string;
  source: string;
  source_type: string;
  listing_title: string;
  start_date: string;
  end_date: string;
  calendar_end_date?: string; // Critical for the new UI
  checkIn?: string;
  checkOut?: string;
  amount?: number;
  rate?: number;
  [key: string]: any; // Catch-all for extra API fields
}

export interface RawBookingData {
  // Scenario A: Daily Calendar data
  calender_date?: string;
  rate?: number;
  bookings?: BookingDetail[];
  listing_image?: string;
  
  // Scenario B: Range Data (Directly at root)
  id?: number | string;
  start_date?: string;
  end_date?: string;
  calendar_end_date?: string;
  listing_title?: string;
  listing_desc?: string;
  source?: string;
  source_type?: string;
}