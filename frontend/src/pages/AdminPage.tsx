import { useEffect, useState, type FormEvent } from 'react'
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
  resolveImageUrl,
} from '../api/client'
import type {
  Appointment,
  AdminService,
  WorkingHour,
  BlockedPeriod,
  Photo,
  Review,
} from '../types'

const DAYS_RO = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică']

const STATUS_LABELS: Record<string, string> = {
  pending: 'În așteptare',
  confirmed: 'Confirmată',
  completed: 'Finalizată',
  cancelled_by_admin: 'Anulată (Admin)',
  cancelled_by_client: 'Anulată (Client)',
  no_show: 'Neprezentare',
}

function formatDateTime(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleString('ro-RO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Europe/Paris',
    })
  } catch {
    return iso
  }
}

function isSameDayParis(iso: string): boolean {
  try {
    const d = new Date(iso).toLocaleDateString('en-CA', { timeZone: 'Europe/Paris' })
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Paris' })
    return d === today
  } catch {
    return false
  }
}

export function AdminPage() {
  const { user, token, loading: authLoading, logout } = useAuth()
  const navigate = useNavigate()

  // Tabs
  const [activeTab, setActiveTab] = useState<
    'appointments' | 'services' | 'schedule' | 'gallery' | 'reviews'
  >('appointments')

  // Data States
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [services, setServices] = useState<AdminService[]>([])
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([])
  const [blockedPeriods, setBlockedPeriods] = useState<BlockedPeriod[]>([])
  const [galleryPhotos, setGalleryPhotos] = useState<Photo[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loadingData, setLoadingData] = useState(false)

  // Filters & Toast
  const [appFilter, setAppFilter] = useState<string>('toate')
  const [toast, setToast] = useState<{ msg: string; type: 'green' | 'red' | '' } | null>(null)

  // Modals
  const [showNewAppModal, setShowNewAppModal] = useState(false)
  const [newAppFirstName, setNewAppFirstName] = useState('')
  const [newAppLastName, setNewAppLastName] = useState('')
  const [newAppPhone, setNewAppPhone] = useState('')
  const [newAppEmail, setNewAppEmail] = useState('')
  const [newAppServiceId, setNewAppServiceId] = useState<number>(0)
  const [newAppStartsAt, setNewAppStartsAt] = useState('')
  const [newAppNotes, setNewAppNotes] = useState('')

  // Service Form
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [editingService, setEditingService] = useState<AdminService | null>(null)
  const [svcName, setSvcName] = useState('')
  const [svcDesc, setSvcDesc] = useState('')
  const [svcDuration, setSvcDuration] = useState('60')
  const [svcPrice, setSvcPrice] = useState('30')
  const [svcActive, setSvcActive] = useState(true)

  // Schedule Forms
  const [whDay, setWhDay] = useState<number>(0)
  const [whStart, setWhStart] = useState('09:00')
  const [whEnd, setWhEnd] = useState('19:00')

  const [bpStart, setBpStart] = useState('')
  const [bpEnd, setBpEnd] = useState('')
  const [bpReason, setBpReason] = useState('')

  // Redirect non-admins to /autentificare or /contul-meu
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/autentificare', { replace: true })
      } else if (user.role !== 'admin') {
        navigate('/contul-meu', { replace: true })
      }
    }
  }, [authLoading, user, navigate])

  const showToastMsg = (msg: string, type: 'green' | 'red' | '' = '') => {
    setToast({ msg, type })
    setTimeout(() => {
      setToast(null)
    }, 3500)
  }

  const loadAllAdminData = async () => {
    if (!token || user?.role !== 'admin') return
    setLoadingData(true)
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
      if (svcs.length > 0 && newAppServiceId === 0) {
        setNewAppServiceId(svcs[0].service_id)
      }
      setWorkingHours(whs)
      setBlockedPeriods(bps)
      setGalleryPhotos(photos)
      setReviews(revs)
    } catch (err: unknown) {
      showToastMsg(err instanceof Error ? err.message : 'Eroare la încărcarea datelor', 'red')
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    if (token && user?.role === 'admin') {
      loadAllAdminData()
    }
  }, [token, user?.role])

  // ===== HANDLERS FOR APPOINTMENTS =====
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

  const handleCreateAdminAppointment = async (e: FormEvent) => {
    e.preventDefault()
    if (!token) return
    try {
      // Send naive datetime string so backend interprets it directly in salon timezone (Europe/Paris)
      const naiveStartsAt = newAppStartsAt.length === 16 ? `${newAppStartsAt}:00` : newAppStartsAt
      await adminCreateAppointment(token, {
        first_name: newAppFirstName.trim(),
        last_name: newAppLastName.trim(),
        phone: newAppPhone.trim() || null,
        email: newAppEmail.trim() || null,
        service_id: Number(newAppServiceId),
        starts_at: naiveStartsAt,
        notes: newAppNotes.trim() || undefined,
      })
      showToastMsg('Programarea a fost adăugată!', 'green')
      setShowNewAppModal(false)
      setNewAppFirstName('')
      setNewAppLastName('')
      setNewAppPhone('')
      setNewAppEmail('')
      setNewAppStartsAt('')
      setNewAppNotes('')
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
    } catch (err: unknown) {
      showToastMsg(err instanceof Error ? err.message : 'Eroare la încărcarea pozei', 'red')
    }
  }

  // ===== HANDLERS FOR SERVICES =====
  const openCreateService = () => {
    setEditingService(null)
    setSvcName('')
    setSvcDesc('')
    setSvcDuration('60')
    setSvcPrice('30')
    setSvcActive(true)
    setShowServiceModal(true)
  }

  const openEditService = (svc: AdminService) => {
    setEditingService(svc)
    setSvcName(svc.name)
    setSvcDesc(svc.description || '')
    setSvcDuration(String(svc.duration_minutes))
    setSvcPrice(String(svc.price))
    setSvcActive(svc.is_active)
    setShowServiceModal(true)
  }

  const handleSaveService = async (e: FormEvent) => {
    e.preventDefault()
    if (!token) return
    try {
      if (editingService) {
        await adminUpdateService(token, editingService.service_id, {
          name: svcName.trim(),
          description: svcDesc.trim() || null,
          duration_minutes: Number(svcDuration),
          price: Number(svcPrice),
          is_active: svcActive,
        })
        showToastMsg('Serviciu actualizat!', 'green')
      } else {
        await adminCreateService(token, {
          name: svcName.trim(),
          description: svcDesc.trim() || null,
          duration_minutes: Number(svcDuration),
          price: Number(svcPrice),
          is_active: svcActive,
        })
        showToastMsg('Serviciu nou creat!', 'green')
      }
      setShowServiceModal(false)
      loadAllAdminData()
    } catch (err: unknown) {
      showToastMsg(err instanceof Error ? err.message : 'Eroare la salvarea serviciului', 'red')
    }
  }

  // ===== HANDLERS FOR SCHEDULE =====
  const handleAddWorkingHour = async (e: FormEvent) => {
    e.preventDefault()
    if (!token) return
    try {
      await adminCreateWorkingHour(token, {
        day_of_week: Number(whDay),
        starts_at: whStart,
        ends_at: whEnd,
      })
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

  const handleAddBlockedPeriod = async (e: FormEvent) => {
    e.preventDefault()
    if (!token) return
    try {
      // Send naive datetime strings so backend interprets them directly in salon timezone (Europe/Paris)
      const naiveStart = bpStart.length === 16 ? `${bpStart}:00` : bpStart
      const naiveEnd = bpEnd.length === 16 ? `${bpEnd}:00` : bpEnd
      await adminCreateBlockedPeriod(token, {
        starts_at: naiveStart,
        ends_at: naiveEnd,
        reason: bpReason.trim() || null,
      })
      showToastMsg('Perioadă blocată adăugată!', 'green')
      setBpStart('')
      setBpEnd('')
      setBpReason('')
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

  // ===== HANDLERS FOR GALLERY & REVIEWS =====
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
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length
  const todayCount = appointments.filter((a) => isSameDayParis(a.starts_at)).length
  const pendingReviewsCount = reviews.filter((r) => r.status === 'pending').length

  const filteredAppointments = appointments.filter((a) => {
    if (appFilter === 'toate') return true
    if (appFilter === 'azi') return isSameDayParis(a.starts_at)
    if (appFilter === 'anulate') {
      return ['cancelled_by_admin', 'cancelled_by_client', 'no_show'].includes(a.status)
    }
    return a.status === appFilter
  })

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
        {/* TAB 1: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <>
            <div className="stats-row">
              <div className="stat-card">
                <div className="s-num">{appointments.length}</div>
                <div className="s-label">Total</div>
              </div>
              <div className="stat-card">
                <div className="s-num">{pendingCount}</div>
                <div className="s-label">În așteptare</div>
              </div>
              <div className="stat-card">
                <div className="s-num">{confirmedCount}</div>
                <div className="s-label">Confirmate</div>
              </div>
              <div className="stat-card">
                <div className="s-num">{todayCount}</div>
                <div className="s-label">Azi</div>
              </div>
            </div>

            <div className="filters-row">
              {[
                { key: 'toate', label: 'Toate' },
                { key: 'pending', label: 'În așteptare' },
                { key: 'confirmed', label: 'Confirmate' },
                { key: 'completed', label: 'Finalizate' },
                { key: 'anulate', label: 'Anulate / Neprezentări' },
                { key: 'azi', label: 'Azi' },
              ].map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={`filter-btn ${appFilter === f.key ? 'active' : ''}`}
                  onClick={() => setAppFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}

              <button
                type="button"
                className="btn-complete"
                style={{ marginLeft: 'auto', borderRadius: '10px' }}
                onClick={() => setShowNewAppModal(true)}
              >
                + Programare manuală
              </button>
            </div>

            {loadingData ? (
              <div className="empty-state">
                <p>Se încarcă programările...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="empty-state">
                <p>Nicio programare în această categorie.</p>
              </div>
            ) : (
              <div className="cards-list">
                {filteredAppointments.map((p) => {
                  const svc = servicesMap[p.service_id]
                  const clientFullName = p.user
                    ? `${p.user.first_name} ${p.user.last_name}`
                    : `Client #${p.user_id}`
                  return (
                    <div key={p.appointment_id} className={`prog-card status-${p.status}`}>
                      <div className="prog-info">
                        <div className="prog-top">
                          <span className="prog-name">{clientFullName}</span>
                          {p.user?.phone && <span className="prog-tel">{p.user.phone}</span>}
                          {p.user?.email && (
                            <span style={{ fontSize: '12.5px', color: 'var(--text-light)' }}>{p.user.email}</span>
                          )}
                          <span className="prog-tel" style={{ fontWeight: 500 }}>
                            {Number(p.price_at_booking).toFixed(0)}€
                          </span>
                          <span className={`status-pill pill-${p.status}`}>
                            {STATUS_LABELS[p.status] || p.status}
                          </span>
                        </div>
                        <div className="prog-details">
                          <span>Serviciu: {svc ? svc.name : `#${p.service_id}`}</span>
                          <span>Data: {formatDateTime(p.starts_at)}</span>
                          {p.notes && <span>Notă: {p.notes}</span>}
                        </div>
                      </div>

                      <div className="prog-actions">
                        {p.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              className="btn-confirm"
                              onClick={() => handleStatusChange(p.appointment_id, 'confirmed')}
                            >
                              Confirmă
                            </button>
                            <button
                              type="button"
                              className="btn-cancel"
                              onClick={() => handleStatusChange(p.appointment_id, 'cancelled_by_admin')}
                            >
                              Anulează
                            </button>
                          </>
                        )}

                        {p.status === 'confirmed' && (
                          <>
                            <button
                              type="button"
                              className="btn-complete"
                              onClick={() => handleStatusChange(p.appointment_id, 'completed')}
                            >
                              Finalizează
                            </button>
                            <button
                              type="button"
                              className="btn-cancel"
                              onClick={() => handleStatusChange(p.appointment_id, 'no_show')}
                            >
                              Neprezentare
                            </button>
                            <button
                              type="button"
                              className="btn-cancel"
                              onClick={() => handleStatusChange(p.appointment_id, 'cancelled_by_admin')}
                            >
                              Anulează
                            </button>
                          </>
                        )}

                        <label
                          className="setup-btn"
                          style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                        >
                          Atașează poză
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const f = e.target.files?.[0]
                              if (f) handleUploadWorkPhoto(p.appointment_id, f)
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* TAB 2: SERVICES */}
        {activeTab === 'services' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 400 }}>
                Administrare Servicii
              </h2>
              <button
                type="button"
                className="btn-complete"
                style={{ borderRadius: '10px' }}
                onClick={openCreateService}
              >
                + Adaugă serviciu nou
              </button>
            </div>

            <div className="cards-list">
              {services.map((s) => (
                <div
                  key={s.service_id}
                  className="prog-card"
                  style={{ opacity: s.is_active ? 1 : 0.6 }}
                >
                  <div className="prog-info">
                    <div className="prog-top">
                      <span className="prog-name">{s.name}</span>
                      <span className="prog-tel">{Number(s.price).toFixed(0)}€</span>
                      <span className={`status-pill ${s.is_active ? 'pill-confirmed' : 'pill-no_show'}`}>
                        {s.is_active ? 'Activ' : 'Inactiv'}
                      </span>
                    </div>
                    <div className="prog-details">
                      <span>Durată: {s.duration_minutes} minute</span>
                      {s.description && <span>{s.description}</span>}
                    </div>
                  </div>
                  <div className="prog-actions">
                    <button type="button" className="setup-btn" onClick={() => openEditService(s)}>
                      Editează
                    </button>
                    <button
                      type="button"
                      className={s.is_active ? 'btn-cancel' : 'btn-confirm'}
                      onClick={() =>
                        adminUpdateService(token!, s.service_id, { is_active: !s.is_active }).then(() =>
                          loadAllAdminData()
                        )
                      }
                    >
                      {s.is_active ? 'Dezactivează' : 'Activează'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: WORKING HOURS & BLOCKED PERIODS */}
        {activeTab === 'schedule' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {/* WORKING HOURS */}
            <div
              style={{
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: '18px',
                padding: '28px',
              }}
            >
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', marginBottom: '16px' }}>
                Program săptămânal de lucru
              </h3>

              <form onSubmit={handleAddWorkingHour} style={{ marginBottom: '24px' }}>
                <div className="form-camp">
                  <label>Ziua săptămânii</label>
                  <select value={whDay} onChange={(e) => setWhDay(Number(e.target.value))}>
                    {DAYS_RO.map((dayName, idx) => (
                      <option key={dayName} value={idx}>
                        {dayName}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-camp">
                    <label>De la ora</label>
                    <input type="time" required value={whStart} onChange={(e) => setWhStart(e.target.value)} />
                  </div>
                  <div className="form-camp">
                    <label>Până la ora</label>
                    <input type="time" required value={whEnd} onChange={(e) => setWhEnd(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="btn-complete" style={{ width: '100%', borderRadius: '10px', padding: '12px' }}>
                  + Adaugă interval de lucru
                </button>
              </form>

              <div className="cards-list">
                {workingHours.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>Niciun interval configurat.</p>
                ) : (
                  workingHours.map((wh) => (
                    <div
                      key={wh.working_hour_id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: 'var(--cream)',
                        borderRadius: '10px',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '14px' }}>{DAYS_RO[wh.day_of_week]}</strong>
                        <span style={{ fontSize: '13px', color: 'var(--text-mid)', marginLeft: '10px' }}>
                          {wh.starts_at.slice(0, 5)} — {wh.ends_at.slice(0, 5)}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn-cancel"
                        style={{ padding: '4px 10px', fontSize: '11px' }}
                        onClick={() => handleDeleteWorkingHour(wh.working_hour_id)}
                      >
                        Șterge
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* BLOCKED PERIODS */}
            <div
              style={{
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: '18px',
                padding: '28px',
              }}
            >
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', marginBottom: '16px' }}>
                Perioade blocate / Concedii
              </h3>

              <form onSubmit={handleAddBlockedPeriod} style={{ marginBottom: '24px' }}>
                <div className="form-camp">
                  <label>Început blocare (ora salonului)</label>
                  <input
                    type="datetime-local"
                    required
                    value={bpStart}
                    onChange={(e) => setBpStart(e.target.value)}
                  />
                </div>
                <div className="form-camp">
                  <label>Sfârșit blocare (ora salonului)</label>
                  <input
                    type="datetime-local"
                    required
                    value={bpEnd}
                    onChange={(e) => setBpEnd(e.target.value)}
                  />
                </div>
                <div className="form-camp">
                  <label>Motiv (opțional)</label>
                  <input
                    type="text"
                    placeholder="ex: Concediu / Pauză"
                    value={bpReason}
                    onChange={(e) => setBpReason(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn-complete" style={{ width: '100%', borderRadius: '10px', padding: '12px' }}>
                  + Blochează intervalul
                </button>
              </form>

              <div className="cards-list">
                {blockedPeriods.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>Nicio perioadă blocată.</p>
                ) : (
                  blockedPeriods.map((bp) => (
                    <div
                      key={bp.period_id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: 'var(--cream)',
                        borderRadius: '10px',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div style={{ fontSize: '13px' }}>
                        <div>
                          <strong>{formatDateTime(bp.starts_at)}</strong> →{' '}
                          <strong>{formatDateTime(bp.ends_at)}</strong>
                        </div>
                        {bp.reason && <div style={{ color: 'var(--roz)', marginTop: '2px' }}>{bp.reason}</div>}
                      </div>
                      <button
                        type="button"
                        className="btn-cancel"
                        style={{ padding: '4px 10px', fontSize: '11px' }}
                        onClick={() => handleDeleteBlockedPeriod(bp.period_id)}
                      >
                        Șterge
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GALLERY */}
        {activeTab === 'gallery' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 400 }}>
                Galerie Portofoliu
              </h2>
              <label className="btn-complete" style={{ borderRadius: '10px', cursor: 'pointer' }}>
                + Încarcă fotografie în galerie
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleUploadGalleryPhoto(f)
                  }}
                />
              </label>
            </div>

            {galleryPhotos.length === 0 ? (
              <div className="empty-state">
                <p>Nu există fotografii încărcate în galerie.</p>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '16px',
                }}
              >
                {galleryPhotos.map((photo) => (
                  <div
                    key={photo.photo_id}
                    style={{
                      background: 'white',
                      border: '1px solid var(--border)',
                      borderRadius: '14px',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={resolveImageUrl(photo.image_url)}
                      alt="Galerie"
                      style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                    />
                    <div
                      style={{
                        padding: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>Poza #{photo.photo_id}</span>
                      <button
                        type="button"
                        className="btn-cancel"
                        style={{ padding: '5px 12px', fontSize: '12px' }}
                        onClick={() => handleDeletePhoto(photo.photo_id)}
                      >
                        Șterge
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: REVIEWS */}
        {activeTab === 'reviews' && (
          <div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '28px',
                fontWeight: 400,
                marginBottom: '20px',
              }}
            >
              Moderare Recenzii
            </h2>

            {reviews.length === 0 ? (
              <div className="empty-state">
                <p>Nicio recenzie primită încă.</p>
              </div>
            ) : (
              <div className="cards-list">
                {reviews.map((rev) => (
                  <div key={rev.review_id} className="prog-card">
                    <div className="prog-info">
                      <div className="prog-top">
                        <span className="prog-name" style={{ color: '#f6b800' }}>
                          {'★'.repeat(rev.rating) + '☆'.repeat(Math.max(0, 5 - rev.rating))}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>
                          {rev.client_name || `Programare #${rev.appointment_id}`}
                        </span>
                        <span
                          className={`status-pill ${
                            rev.status === 'approved'
                              ? 'pill-confirmed'
                              : rev.status === 'rejected'
                                ? 'pill-no_show'
                                : 'pill-pending'
                          }`}
                        >
                          {rev.status === 'approved'
                            ? 'Aprobată'
                            : rev.status === 'rejected'
                              ? 'Respinsă'
                              : 'În așteptare'}
                        </span>
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--text-mid)', marginTop: '4px' }}>
                        "{rev.comment || 'Fără comentariu text'}"
                      </p>
                      {rev.photos && rev.photos.length > 0 && (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                          {rev.photos.map((p) => (
                            <a
                              key={p.photo_id}
                              href={resolveImageUrl(p.image_url)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={resolveImageUrl(p.image_url)}
                                alt="Recenzie"
                                style={{
                                  width: '60px',
                                  height: '60px',
                                  objectFit: 'cover',
                                  borderRadius: '8px',
                                  border: '1px solid var(--border)',
                                }}
                              />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="prog-actions">
                      {rev.status !== 'approved' && (
                        <button
                          type="button"
                          className="btn-confirm"
                          onClick={() => handleReviewStatus(rev.review_id, 'approved')}
                        >
                          Aprobă
                        </button>
                      )}
                      {rev.status !== 'rejected' && (
                        <button
                          type="button"
                          className="btn-cancel"
                          onClick={() => handleReviewStatus(rev.review_id, 'rejected')}
                        >
                          Respinge
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: NEW MANUAL APPOINTMENT */}
      {showNewAppModal && (
        <div className="modal-overlay" onClick={() => setShowNewAppModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Programare manuală</h3>
            <p>Adaugă o programare telefonică sau directă în agendă.</p>
            <form onSubmit={handleCreateAdminAppointment}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-camp">
                  <label>Prenume clientă</label>
                  <input
                    type="text"
                    required
                    value={newAppFirstName}
                    onChange={(e) => setNewAppFirstName(e.target.value)}
                  />
                </div>
                <div className="form-camp">
                  <label>Nume clientă</label>
                  <input
                    type="text"
                    required
                    value={newAppLastName}
                    onChange={(e) => setNewAppLastName(e.target.value)}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-camp">
                  <label>Telefon (opțional)</label>
                  <input
                    type="tel"
                    placeholder="ex: +33 6 12 34 56 78"
                    value={newAppPhone}
                    onChange={(e) => setNewAppPhone(e.target.value)}
                  />
                </div>
                <div className="form-camp">
                  <label>Email (opțional)</label>
                  <input
                    type="email"
                    placeholder="ex: clienta@email.com"
                    value={newAppEmail}
                    onChange={(e) => setNewAppEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-camp">
                <label>Serviciu</label>
                <select
                  value={newAppServiceId}
                  onChange={(e) => setNewAppServiceId(Number(e.target.value))}
                >
                  {services
                    .filter((s) => s.is_active)
                    .map((s) => (
                      <option key={s.service_id} value={s.service_id}>
                        {s.name} ({s.duration_minutes} min · {Number(s.price).toFixed(0)}€)
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-camp">
                <label>Data și ora (ora salonului)</label>
                <input
                  type="datetime-local"
                  required
                  value={newAppStartsAt}
                  onChange={(e) => setNewAppStartsAt(e.target.value)}
                />
              </div>
              <div className="form-camp">
                <label>Observații (opțional)</label>
                <input
                  type="text"
                  value={newAppNotes}
                  onChange={(e) => setNewAppNotes(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  className="setup-btn"
                  style={{ flex: 1, padding: '12px', borderRadius: '10px' }}
                  onClick={() => setShowNewAppModal(false)}
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  className="btn-confirma"
                  style={{ flex: 1, marginTop: 0, padding: '12px' }}
                >
                  Salvează
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT SERVICE */}
      {showServiceModal && (
        <div className="modal-overlay" onClick={() => setShowServiceModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>{editingService ? 'Editează serviciul' : 'Adaugă serviciu nou'}</h3>
            <p>Configurează detaliile serviciului afișat pe site.</p>
            <form onSubmit={handleSaveService}>
              <div className="form-camp">
                <label>Denumire serviciu</label>
                <input
                  type="text"
                  required
                  value={svcName}
                  onChange={(e) => setSvcName(e.target.value)}
                />
              </div>
              <div className="form-camp">
                <label>Descriere</label>
                <textarea
                  rows={3}
                  value={svcDesc}
                  onChange={(e) => setSvcDesc(e.target.value)}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-camp">
                  <label>Durată (minute)</label>
                  <input
                    type="number"
                    min={10}
                    required
                    value={svcDuration}
                    onChange={(e) => setSvcDuration(e.target.value)}
                  />
                </div>
                <div className="form-camp">
                  <label>Preț (€)</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    required
                    value={svcPrice}
                    onChange={(e) => setSvcPrice(e.target.value)}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="svcActiveChk"
                  checked={svcActive}
                  onChange={(e) => setSvcActive(e.target.checked)}
                />
                <label htmlFor="svcActiveChk" style={{ fontSize: '14px', cursor: 'pointer' }}>
                  Serviciu activ (disponibil pentru programări)
                </label>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="setup-btn"
                  style={{ flex: 1, padding: '12px', borderRadius: '10px' }}
                  onClick={() => setShowServiceModal(false)}
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  className="btn-confirma"
                  style={{ flex: 1, marginTop: 0, padding: '12px' }}
                >
                  Salvează
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST */}
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
