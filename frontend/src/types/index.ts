export interface Service {
  service_id: number
  name: string
  description: string | null
  duration_minutes: number
  price: string
  image_url: string | null
}

export interface AdminService extends Service {
  is_active: boolean
}

export interface Photo {
  photo_id: number
  appointment_id: number | null
  kind: 'gallery' | 'work' | string
  image_url: string
  created_at: string
}

export interface Review {
  review_id: number
  appointment_id: number
  rating: number
  comment: string | null
  status: 'pending' | 'approved' | 'rejected' | string
  created_at: string
  client_name?: string | null
  photos: Photo[]
}

export interface User {
  user_id: number
  email: string | null
  phone: string | null
  first_name: string
  last_name: string
  role: 'client' | 'admin' | string
  email_verified: boolean
  created_at: string
}

export interface AppointmentClient {
  user_id: number
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface Slot {
  starts_at: string
  ends_at: string
}

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled_by_admin'
  | 'cancelled_by_client'
  | 'no_show'
  | 'completed'

export interface Appointment {
  appointment_id: number
  user_id: number
  service_id: number
  starts_at: string
  ends_at: string
  price_at_booking: string
  status: AppointmentStatus | string
  notes: string | null
  created_at: string
  user?: AppointmentClient | null
}

export interface WorkingHour {
  working_hour_id: number
  day_of_week: number
  starts_at: string
  ends_at: string
}

export interface BlockedPeriod {
  period_id: number
  starts_at: string
  ends_at: string
  reason: string | null
  created_at: string
}
