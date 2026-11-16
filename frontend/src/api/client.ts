import type {
  Service,
  AdminService,
  Photo,
  Review,
  Slot,
  User,
  TokenResponse,
  Appointment,
  WorkingHour,
  BlockedPeriod,
} from '../types'

export const BACKEND_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:8000'
export const API_BASE_URL = `${BACKEND_ORIGIN}/api`

export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${BACKEND_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`
}

async function handleResponse<T>(response: Response, fallbackMsg: string): Promise<T> {
  if (!response.ok) {
    let detail = fallbackMsg
    try {
      const data = await response.json()
      if (typeof data?.detail === 'string') {
        detail = data.detail
      } else if (Array.isArray(data?.detail) && data.detail[0]?.msg) {
        detail = data.detail[0].msg
      }
    } catch {
      // ignore json parse errors
    }
    throw new Error(detail)
  }
  if (response.status === 204) {
    return undefined as T
  }
  return response.json()
}

// ===== PUBLIC ENDPOINTS =====

export async function getServices(): Promise<Service[]> {
  const res = await fetch(`${API_BASE_URL}/services`)
  return handleResponse<Service[]>(res, 'Nu am putut încărca serviciile')
}

export async function getPhotos(): Promise<Photo[]> {
  const res = await fetch(`${API_BASE_URL}/photos`)
  return handleResponse<Photo[]>(res, 'Nu am putut încărca pozele')
}

export async function getApprovedReviews(): Promise<Review[]> {
  const res = await fetch(`${API_BASE_URL}/reviews`)
  return handleResponse<Review[]>(res, 'Nu am putut încărca recenziile')
}

export async function getAvailableSlots(serviceId: number, targetDate: string): Promise<Slot[]> {
  const res = await fetch(
    `${API_BASE_URL}/slots?service_id=${encodeURIComponent(serviceId)}&target_date=${encodeURIComponent(targetDate)}`
  )
  return handleResponse<Slot[]>(res, 'Nu am putut încărca orele disponibile')
}

// ===== AUTH & USERS =====

export async function loginUser(email: string, password: string): Promise<TokenResponse> {
  const res = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return handleResponse<TokenResponse>(res, 'Email sau parolă incorectă')
}

export async function registerUser(userData: {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
}): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  })
  return handleResponse<User>(res, 'Înregistrarea a eșuat. Verifică datele introduse.')
}

export async function getCurrentUser(token: string): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return handleResponse<User>(res, 'Sesiune expirată')
}

// ===== CLIENT APPOINTMENTS, PHOTOS & REVIEWS =====

export async function createAppointment(
  token: string,
  service_id: number,
  starts_at: string,
  notes?: string
): Promise<Appointment> {
  const res = await fetch(`${API_BASE_URL}/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ service_id, starts_at, notes: notes || null }),
  })
  return handleResponse<Appointment>(res, 'Nu am putut salva programarea')
}

export async function getMyAppointments(token: string): Promise<Appointment[]> {
  const res = await fetch(`${API_BASE_URL}/appointments/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return handleResponse<Appointment[]>(res, 'Nu am putut încărca programările tale')
}

export async function cancelMyAppointment(token: string, appointmentId: number): Promise<Appointment> {
  const res = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/cancel`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  return handleResponse<Appointment>(res, 'Nu am putut anula programarea')
}

export async function getAppointmentPhotos(token: string, appointmentId: number): Promise<Photo[]> {
  const res = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/photos`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return handleResponse<Photo[]>(res, 'Nu am putut încărca pozele programării')
}

export async function uploadClientAppointmentPhoto(
  token: string,
  appointmentId: number,
  file: File
): Promise<Photo> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/photos`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  return handleResponse<Photo>(res, 'Nu am putut încărca poza')
}

export async function createReview(
  token: string,
  appointment_id: number,
  rating: number,
  comment?: string
): Promise<Review> {
  const res = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ appointment_id, rating, comment: comment || null }),
  })
  return handleResponse<Review>(res, 'Nu am putut trimite recenzia')
}

// ===== ADMIN ENDPOINTS =====

export async function adminGetAllAppointments(token: string): Promise<Appointment[]> {
  const res = await fetch(`${API_BASE_URL}/admin/appointments`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return handleResponse<Appointment[]>(res, 'Nu am putut încărca programările')
}

export async function adminUpdateAppointmentStatus(
  token: string,
  appointmentId: number,
  status: 'confirmed' | 'cancelled_by_admin' | 'no_show' | 'completed'
): Promise<Appointment> {
  const res = await fetch(`${API_BASE_URL}/admin/appointments/${appointmentId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  })
  return handleResponse<Appointment>(res, 'Nu am putut actualiza statusul programării')
}

export async function adminCreateAppointment(
  token: string,
  data: {
    first_name: string
    last_name: string
    phone?: string | null
    email?: string | null
    service_id: number
    starts_at: string
    notes?: string
  }
): Promise<Appointment> {
  const res = await fetch(`${API_BASE_URL}/admin/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  return handleResponse<Appointment>(res, 'Nu am putut crea programarea')
}

export async function adminGetAllServices(token: string): Promise<AdminService[]> {
  const res = await fetch(`${API_BASE_URL}/admin/services`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return handleResponse<AdminService[]>(res, 'Nu am putut încărca serviciile')
}

export async function adminCreateService(
  token: string,
  data: {
    name: string
    description?: string | null
    duration_minutes: number
    price: number | string
    image_url?: string | null
    is_active?: boolean
  }
): Promise<AdminService> {
  const res = await fetch(`${API_BASE_URL}/admin/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  return handleResponse<AdminService>(res, 'Nu am putut crea serviciul')
}

export async function adminUpdateService(
  token: string,
  serviceId: number,
  data: {
    name?: string
    description?: string | null
    duration_minutes?: number
    price?: number | string
    image_url?: string | null
    is_active?: boolean
  }
): Promise<AdminService> {
  const res = await fetch(`${API_BASE_URL}/admin/services/${serviceId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  return handleResponse<AdminService>(res, 'Nu am putut actualiza serviciul')
}

export async function adminGetWorkingHours(token: string): Promise<WorkingHour[]> {
  const res = await fetch(`${API_BASE_URL}/admin/working-hours`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return handleResponse<WorkingHour[]>(res, 'Nu am putut încărca programul de lucru')
}

export async function adminCreateWorkingHour(
  token: string,
  data: { day_of_week: number; starts_at: string; ends_at: string }
): Promise<WorkingHour> {
  const res = await fetch(`${API_BASE_URL}/admin/working-hours`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  return handleResponse<WorkingHour>(res, 'Nu am putut adăuga intervalul de lucru')
}

export async function adminDeleteWorkingHour(token: string, workingHourId: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/working-hours/${workingHourId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  return handleResponse<void>(res, 'Nu am putut șterge intervalul de lucru')
}

export async function adminGetBlockedPeriods(token: string): Promise<BlockedPeriod[]> {
  const res = await fetch(`${API_BASE_URL}/admin/blocked-periods`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return handleResponse<BlockedPeriod[]>(res, 'Nu am putut încărca perioadele blocate')
}

export async function adminCreateBlockedPeriod(
  token: string,
  data: { starts_at: string; ends_at: string; reason?: string | null }
): Promise<BlockedPeriod> {
  const res = await fetch(`${API_BASE_URL}/admin/blocked-periods`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  return handleResponse<BlockedPeriod>(res, 'Nu am putut adăuga perioada blocată')
}

export async function adminDeleteBlockedPeriod(token: string, periodId: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/blocked-periods/${periodId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  return handleResponse<void>(res, 'Nu am putut șterge perioada blocată')
}

export async function adminUploadPhoto(
  token: string,
  file: File,
  kind: 'gallery' | 'work',
  appointmentId?: number | null
): Promise<Photo> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('kind', kind)
  if (appointmentId !== undefined && appointmentId !== null) {
    formData.append('appointment_id', String(appointmentId))
  }
  const res = await fetch(`${API_BASE_URL}/admin/photos`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  return handleResponse<Photo>(res, 'Nu am putut încărca fotografia')
}

export async function adminDeletePhoto(token: string, photoId: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/photos/${photoId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  return handleResponse<void>(res, 'Nu am putut șterge fotografia')
}

export async function adminGetAllReviews(token: string): Promise<Review[]> {
  const res = await fetch(`${API_BASE_URL}/admin/reviews`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return handleResponse<Review[]>(res, 'Nu am putut încărca recenziile')
}

export async function adminUpdateReviewStatus(
  token: string,
  reviewId: number,
  status: 'approved' | 'rejected'
): Promise<Review> {
  const res = await fetch(`${API_BASE_URL}/admin/reviews/${reviewId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  })
  return handleResponse<Review>(res, 'Nu am putut actualiza statusul recenziei')
}
