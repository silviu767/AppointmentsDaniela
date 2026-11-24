import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  adminGetAllAppointments,
  adminUpdateAppointmentStatus,
  adminCreateAppointment,
  adminGetAllServices,
  adminCreateService,
  adminUpdateService,
  adminGetWorkingHours,
  adminCreateWorkingHour,
  adminDeleteWorkingHour,
  adminGetBlockedPeriods,
  adminCreateBlockedPeriod,
  adminDeleteBlockedPeriod,
  adminUploadPhoto,
  adminDeletePhoto,
  adminGetAllReviews,
  adminUpdateReviewStatus,
  getPhotos,
} from '../api/client'
import type {
  Appointment,
  AdminService,
  WorkingHour,
  BlockedPeriod,
  Photo,
  Review,
} from '../types'
import { STATUS_LABELS } from '../components/admin/adminUtils'
import { AppointmentsTab } from '../components/admin/AppointmentsTab'
import { NewAppointmentModal } from '../components/admin/NewAppointmentModal'
import { ServicesTab } from '../components/admin/ServicesTab'
import { ScheduleTab } from '../components/admin/ScheduleTab'
import { GalleryTab } from '../components/admin/GalleryTab'
import { ReviewsTab } from '../components/admin/ReviewsTab'

export function AdminPage() {
  const { user, token, loading: authLoading, logout } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<
    'appointments' | 'services' | 'schedule' | 'gallery' | 'reviews'
  >('appointments')

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [services, setServices] = useState<AdminService[]>([])
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([])
  const [blockedPeriods, setBlockedPeriods] = useState<BlockedPeriod[]>([])
  const [galleryPhotos, setGalleryPhotos] = useState<Photo[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const [appFilter, setAppFilter] = useState<string>('toate')
  const [toast, setToast] = useState<{ msg: string; type: 'green' | 'red' | '' } | null>(null)
  const [showNewAppModal, setShowNewAppModal] = useState(false)

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/autentificare', { replace: true })
      } else if (user.role !== 'admin') {
        navigate('/contul-meu', { replace: true })
      }
    }
  }, [authLoading, user, navigate])

  const showToastMsg = useCallback((msg: string, type: 'green' | 'red' | '' = '') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const loadAllAdminData = useCallback(async () => {
    if (!token || user?.role !== 'admin') return
    try {
      const [apps, svcs, whs, bps, photos, revs] = await Promise.all([
        adminGetAllAppointments(token),
        adminGetAllServices(token),
        adminGetWorkingHours(token),
        adminGetBlockedPeriods(token),
        getPhotos(),
        adminGetAllReviews(token),
      ])
      setAppointments(apps)
      setServices(svcs)
      setWorkingHours(whs)
      setBlockedPeriods(bps)
      setGalleryPhotos(photos)
      setReviews(revs)
    } catch (err: unknown) {
      showToastMsg(err instanceof Error ? err.message : 'Eroare la încărcarea datelor', 'red')
    } finally {
      setLoadingData(false)
    }
  }, [token, user?.role, showToastMsg])

  useEffect(() => {
    if (token && user?.role === 'admin') {
      void Promise.resolve().then(() => loadAllAdminData())
    }
  }, [token, user?.role, loadAllAdminData])

  // ===== HANDLERS =====
  const handleStatusChange = async (
    appointmentId: number,
    status: 'confirmed' | 'cancelled_by_admin' | 'no_show' | 'completed'
  ) => {
    if (!token) return
    try {
      const updated = await adminUpdateAppointmentStatus(token, appointmentId, status)
      setAppointments((prev) =>
        prev.map((a) => (a.appointment_id === appointmentId ? updated : a))
      )
      showToastMsg(`Status actualizat: ${STATUS_LABELS[status]}`, 'green')
    } catch (err: unknown) {
      showToastMsg(err instanceof Error ? err.message : 'Eroare la actualizarea statusului', 'red')
    }
  }

  const handleCreateAdminAppointment = async (payload: {
    first_name: string
    last_name: string
    phone?: string | null
    email?: string | null
    service_id: number
    starts_at: string
    notes?: string
  }) => {
    if (!token) return
    try {
      await adminCreateAppointment(token, payload)
      showToastMsg('Programarea a fost adăugată!', 'green')
      setShowNewAppModal(false)
      loadAllAdminData()
    } catch (err: unknown) {
      showToastMsg(err instanceof Error ? err.message : 'Eroare la crearea programării', 'red')
    }
  }

  const handleUploadWorkPhoto = async (appointmentId: number, file: File) => {
    if (!token) return
    try {
      await adminUploadPhoto(token, file, 'work', appointmentId)
      showToastMsg('Poza lucrării a fost atașată programării!', 'green')
      loadAllAdminData()
    } catch (err: unknown) {
      showToastMsg(err instanceof Error ? err.message : 'Eroare la încărcarea pozei', 'red')
    }
  }

  const handleSaveService = async (
    editingId: number | null,
    payload: {
      name: string
      description: string | null
      duration_minutes: number
      price: number
      is_active: boolean
    }
  ) => {
    if (!token) return
    try {
      if (editingId !== null) {
        await adminUpdateService(token, editingId, payload)
        showToastMsg('Serviciu actualizat!', 'green')
      } else {
        await adminCreateService(token, payload)
        showToastMsg('Serviciu nou creat!', 'green')
      }
      loadAllAdminData()
    } catch (err: unknown) {
      showToastMsg(err instanceof Error ? err.message : 'Eroare la salvarea serviciului', 'red')
    }
  }

  const handleToggleServiceActive = async (svc: AdminService) => {
    if (!token) return
    try {
      await adminUpdateService(token, svc.service_id, { is_active: !svc.is_active })
      loadAllAdminData()
    } catch (err: unknown) {
      showToastMsg(err instanceof Error ? err.message : 'Eroare la actualizarea serviciului', 'red')
    }
  }

  const handleAddWorkingHour = async (day_of_week: number, starts_at: string, ends_at: string) => {
    if (!token) return
    try {
      await adminCreateWorkingHour(token, { day_of_week, starts_at, ends_at })
      showToastMsg('Interval de lucru adăugat!', 'green')
      loadAllAdminData()
    } catch (err: unknown) {
      showToastMsg(err instanceof Error ? err.message : 'Eroare la adăugarea intervalului', 'red')
    }
  }

  const handleDeleteWorkingHour = async (id: number) => {
    if (!token) return
    try {
      await adminDeleteWorkingHour(token, id)
      showToastMsg('Interval șters.', 'green')
      loadAllAdminData()
    } catch (err: unknown) {
      showToastMsg(err instanceof Error ? err.message : 'Eroare la ștergere', 'red')
    }
  }

  const handleAddBlockedPeriod = async (
    starts_at: string,
    ends_at: string,
    reason: string | null
  ) => {
    if (!token) return
    try {
      await adminCreateBlockedPeriod(token, { starts_at, ends_at, reason })
      showToastMsg('Perioadă blocată adăugată!', 'green')
      loadAllAdminData()
    } catch (err: unknown) {
      showToastMsg(err instanceof Error ? err.message : 'Eroare la blocarea perioadei', 'red')
    }
  }

  const handleDeleteBlockedPeriod = async (id: number) => {
    if (!token) return
    try {
      await adminDeleteBlockedPeriod(token, id)
      showToastMsg('Perioadă blocată ștearsă.', 'green')
      loadAllAdminData()
    } catch (err: unknown) {
      showToastMsg(err instanceof Error ? err.message : 'Eroare la ștergere', 'red')
    }
  }

  const handleUploadGalleryPhoto = async (file: File) => {
    if (!token) return
    try {
      await adminUploadPhoto(token, file, 'gallery')
      showToastMsg('Fotografie adăugată în galerie!', 'green')
      loadAllAdminData()
    } catch (err: unknown) {
      showToastMsg(err instanceof Error ? err.message : 'Eroare la încărcarea fotografiei', 'red')
    }
  }

  const handleDeletePhoto = async (photoId: number) => {
    if (!token) return
    if (!window.confirm('Sigur vrei să ștergi această fotografie?')) return
    try {
      await adminDeletePhoto(token, photoId)
      showToastMsg('Fotografie ștearsă.', 'green')
      loadAllAdminData()
    } catch (err: unknown) {
      showToastMsg(err instanceof Error ? err.message : 'Eroare la ștergerea fotografiei', 'red')
    }
  }

  const handleReviewStatus = async (reviewId: number, status: 'approved' | 'rejected') => {
    if (!token) return
    try {
      await adminUpdateReviewStatus(token, reviewId, status)
      showToastMsg(status === 'approved' ? 'Recenzie aprobată!' : 'Recenzie respinsă.', 'green')
      loadAllAdminData()
    } catch (err: unknown) {
      showToastMsg(err instanceof Error ? err.message : 'Eroare la actualizarea recenziei', 'red')
    }
  }

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)', padding: '60px' }}>
        <p className="loading-text">Se verifică permisiunile...</p>
      </div>
    )
  }

  const servicesMap: Record<number, AdminService> = {}
  services.forEach((s) => {
    servicesMap[s.service_id] = s
  })

  const pendingCount = appointments.filter((a) => a.status === 'pending').length
  const pendingReviewsCount = reviews.filter((r) => r.status === 'pending').length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      {/* TOPBAR */}
      <div className="topbar">
        <div className="topbar-left">
          <span className="topbar-title">Daniela's Nails · Admin</span>
          {pendingCount > 0 && <span className="topbar-badge">{pendingCount} în așteptare</span>}
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`filter-btn ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            Programări ({appointments.length})
          </button>
          <button
            type="button"
            className={`filter-btn ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            Servicii ({services.length})
          </button>
          <button
            type="button"
            className={`filter-btn ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            Program & Blocări
          </button>
          <button
            type="button"
            className={`filter-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            Galerie ({galleryPhotos.length})
          </button>
          <button
            type="button"
            className={`filter-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Recenzii ({reviews.length}{pendingReviewsCount > 0 ? ` · ${pendingReviewsCount} noi` : ''})
          </button>
        </div>

        <div className="topbar-right">
          <button type="button" className="refresh-btn" onClick={loadAllAdminData}>
            Actualizează
          </button>
          <Link to="/" className="setup-btn">
            Vezi site-ul
          </Link>
          <button
            type="button"
            className="logout-btn"
            onClick={() => {
              logout()
              navigate('/')
            }}
          >
            Ieși
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="admin-content">
        {activeTab === 'appointments' && (
          <AppointmentsTab
            appointments={appointments}
            servicesMap={servicesMap}
            loadingData={loadingData}
            appFilter={appFilter}
            setAppFilter={setAppFilter}
            onOpenNewAppModal={() => setShowNewAppModal(true)}
            onStatusChange={handleStatusChange}
            onUploadWorkPhoto={handleUploadWorkPhoto}
          />
        )}

        {activeTab === 'services' && (
          <ServicesTab
            services={services}
            onSaveService={handleSaveService}
            onToggleActive={handleToggleServiceActive}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleTab
            workingHours={workingHours}
            blockedPeriods={blockedPeriods}
            onAddWorkingHour={handleAddWorkingHour}
            onDeleteWorkingHour={handleDeleteWorkingHour}
            onAddBlockedPeriod={handleAddBlockedPeriod}
            onDeleteBlockedPeriod={handleDeleteBlockedPeriod}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryTab
            galleryPhotos={galleryPhotos}
            onUploadPhoto={handleUploadGalleryPhoto}
            onDeletePhoto={handleDeletePhoto}
          />
        )}

        {activeTab === 'reviews' && (
          <ReviewsTab reviews={reviews} onUpdateStatus={handleReviewStatus} />
        )}
      </div>

      {showNewAppModal && (
        <NewAppointmentModal
          services={services}
          defaultServiceId={services[0]?.service_id || 0}
          onClose={() => setShowNewAppModal(false)}
          onSubmit={handleCreateAdminAppointment}
        />
      )}

      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background:
              toast.type === 'green' ? 'var(--green)' : toast.type === 'red' ? 'var(--red)' : 'var(--text)',
            color: 'white',
            padding: '13px 20px',
            borderRadius: '12px',
            fontSize: '13px',
            zIndex: 999,
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {toast.msg}
        </div>
      )}
    </div>
  )
}
