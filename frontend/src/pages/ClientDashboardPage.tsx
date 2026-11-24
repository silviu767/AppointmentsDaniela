import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { useLanguage, translateServiceName } from '../context/LanguageContext'
import {
  getMyAppointments,
  cancelMyAppointment,
  getServices,
  createReview,
  getAppointmentPhotos,
  uploadClientAppointmentPhoto,
  resolveImageUrl,
} from '../api/client'
import type { Appointment, Service, Photo } from '../types'
import { ReviewModal } from '../components/client/ReviewModal'

export function ClientDashboardPage() {
  const { user, token, loading: authLoading } = useAuth()
  const { lang, t, locale } = useLanguage()
  const c = t.client
  const navigate = useNavigate()

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [servicesMap, setServicesMap] = useState<Record<number, Service>>({})
  const [photosByApp, setPhotosByApp] = useState<Record<number, Photo[]>>({})
  const [reviewedApps, setReviewedApps] = useState<Record<number, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<{ text: string; type: 'ok' | 'err' } | null>(null)

  // Review modal state
  const [reviewAppId, setReviewAppId] = useState<number | null>(null)
  const [rating, setRating] = useState<number>(5)
  const [comment, setComment] = useState<string>('')
  const [reviewPhotoFile, setReviewPhotoFile] = useState<File | null>(null)
  const [reviewModalErr, setReviewModalErr] = useState<string | null>(null)
  const [submittingReview, setSubmittingReview] = useState(false)

  function formatDateTime(iso: string) {
    try {
      const d = new Date(iso)
      return d.toLocaleString(locale, {
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

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/autentificare', { replace: true })
      } else if (user.role === 'admin') {
        navigate('/admin', { replace: true })
      }
    }
  }, [authLoading, user, navigate])

  const loadData = useCallback(async () => {
    if (!token) return
    try {
      const [apps, svcs] = await Promise.all([getMyAppointments(token), getServices()])
      const map: Record<number, Service> = {}
      svcs.forEach((s) => {
        map[s.service_id] = s
      })
      setServicesMap(map)
      setAppointments(apps)

      const photoEntries: Record<number, Photo[]> = {}
      await Promise.all(
        apps.map(async (a) => {
          try {
            const p = await getAppointmentPhotos(token, a.appointment_id)
            photoEntries[a.appointment_id] = p
          } catch {
            photoEntries[a.appointment_id] = []
          }
        })
      )
      setPhotosByApp(photoEntries)
    } catch (err: unknown) {
      setFeedback({
        text: err instanceof Error ? err.message : 'Error',
        type: 'err',
      })
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token && user?.role !== 'admin') {
      void Promise.resolve().then(() => loadData())
    }
  }, [token, user?.role, loadData])

  const handleCancel = async (appointmentId: number) => {
    if (!token) return
    if (!window.confirm(c.cancelConfirm)) {
      return
    }
    setFeedback(null)
    try {
      await cancelMyAppointment(token, appointmentId)
      setFeedback({ text: c.cancelSuccess, type: 'ok' })
      loadData()
    } catch (err: unknown) {
      setFeedback({
        text: err instanceof Error ? err.message : 'Error',
        type: 'err',
      })
    }
  }

  const handleUploadPhoto = async (appointmentId: number, file: File) => {
    if (!token) return
    setFeedback(null)
    try {
      await uploadClientAppointmentPhoto(token, appointmentId, file)
      setFeedback({ text: c.photoUploadedSuccess, type: 'ok' })
      const updated = await getAppointmentPhotos(token, appointmentId)
      setPhotosByApp((prev) => ({ ...prev, [appointmentId]: updated }))
    } catch (err: unknown) {
      setFeedback({
        text: err instanceof Error ? err.message : 'Error',
        type: 'err',
      })
    }
  }

  const handleReviewSubmit = async () => {
    if (!token || !reviewAppId) return
    setSubmittingReview(true)
    setReviewModalErr(null)
    setFeedback(null)
    try {
      if (reviewPhotoFile) {
        await uploadClientAppointmentPhoto(token, reviewAppId, reviewPhotoFile)
      }
      await createReview(token, reviewAppId, rating, comment.trim() || undefined)

      const updatedPhotos = await getAppointmentPhotos(token, reviewAppId)
      setPhotosByApp((prev) => ({ ...prev, [reviewAppId]: updatedPhotos }))
      setReviewedApps((prev) => ({ ...prev, [reviewAppId]: true }))

      setReviewAppId(null)
      setComment('')
      setRating(5)
      setReviewPhotoFile(null)

      setFeedback({
        text: c.reviewConfirmSuccess,
        type: 'ok',
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error'
      if (msg.toLowerCase().includes('exista deja')) {
        setReviewedApps((prev) => ({ ...prev, [reviewAppId]: true }))
      }
      setReviewModalErr(msg)
    } finally {
      setSubmittingReview(false)
    }
  }

  if (authLoading || !user || user.role === 'admin') {
    return (
      <div className="booking-page">
        <Header />
        <main className="pg-wrap">
          <p className="loading-text">{c.loadingAccount}</p>
        </main>
      </div>
    )
  }

  const statusMap = c.status as Record<string, string>

  return (
    <div className="booking-page">
      <Header />

      <main className="pg-wrap" style={{ maxWidth: '880px' }}>
        <div className="pg-hero">
          <div className="pg-eyebrow">
            <span className="eyebrow-line"></span>
            <span>{c.eyebrow}</span>
          </div>
          <h1 className="pg-titlu">
            {c.hello} <em>{user.first_name}</em>
          </h1>
          <p className="pg-sub">
            {user.email} {user.phone ? `· ${user.phone}` : ''}
          </p>
        </div>

        {feedback && (
          <div
            style={{
              background: feedback.type === 'ok' ? 'var(--green-pale)' : 'var(--red-pale)',
              border: `1px solid ${feedback.type === 'ok' ? 'var(--green-border)' : 'var(--red-border)'}`,
              color: feedback.type === 'ok' ? 'var(--green)' : 'var(--red)',
              padding: '14px 20px',
              borderRadius: '14px',
              fontSize: '14px',
              marginBottom: '24px',
              fontWeight: 500,
            }}
          >
            {feedback.text}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '30px', fontWeight: 400 }}>
            {c.myAppointments}
          </h2>
          <Link to="/programare" className="btn-book" style={{ padding: '10px 22px', fontSize: '13.5px', minWidth: 'auto' }}>
            {c.newBooking}
          </Link>
        </div>

        {loading ? (
          <div className="empty-state">
            <p>{c.loadingAppointments}</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <p style={{ marginBottom: '20px' }}>{c.noAppointments}</p>
            <Link to="/programare" className="btn-book">
              {c.bookFirstVisit}
            </Link>
          </div>
        ) : (
          <div className="cards-list">
            {appointments.map((app) => {
              const svc = servicesMap[app.service_id]
              const photos = photosByApp[app.appointment_id] || app.photos || []
              const alreadyReviewed = Boolean(app.has_review || reviewedApps[app.appointment_id])
              return (
                <div key={app.appointment_id} className={`prog-card status-${app.status}`}>
                  <div className="prog-info">
                    <div className="prog-top">
                      <span className="prog-name">
                        {svc ? translateServiceName(svc.name, lang) : `${c.serviceFallback} #${app.service_id}`}
                      </span>
                      <span className="prog-tel">{Number(app.price_at_booking).toFixed(0)}€</span>
                      <span className={`status-pill pill-${app.status}`}>
                        {statusMap[app.status] || app.status}
                      </span>
                    </div>
                    <div className="prog-details">
                      <span>
                        {c.dateLabel} {formatDateTime(app.starts_at)}
                      </span>
                      {app.notes && (
                        <span>
                          {c.noteLabel} {app.notes}
                        </span>
                      )}
                    </div>

                    {photos.length > 0 && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                        {photos.map((p) => (
                          <a
                            key={p.photo_id}
                            href={resolveImageUrl(p.image_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={resolveImageUrl(p.image_url)}
                              alt="Daniela's Nails"
                              style={{
                                width: '64px',
                                height: '64px',
                                objectFit: 'cover',
                                borderRadius: '10px',
                                border: '1px solid var(--border-mid)',
                              }}
                            />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="prog-actions">
                    {(app.status === 'pending' || app.status === 'confirmed') && (
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => handleCancel(app.appointment_id)}
                      >
                        {c.cancelBtn}
                      </button>
                    )}

                    {app.status === 'completed' && (
                      <>
                        {alreadyReviewed ? (
                          <span className="status-pill pill-confirmed">{c.reviewSentBadge}</span>
                        ) : (
                          <button
                            type="button"
                            className="btn-complete"
                            onClick={() => {
                              setReviewAppId(app.appointment_id)
                              setRating(5)
                              setComment('')
                              setReviewPhotoFile(null)
                              setReviewModalErr(null)
                            }}
                          >
                            {c.leaveReviewBtn}
                          </button>
                        )}
                        <label
                          className="setup-btn"
                          style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          {c.uploadPhotoBtn}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const f = e.target.files?.[0]
                              if (f) handleUploadPhoto(app.appointment_id, f)
                            }}
                          />
                        </label>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {reviewAppId !== null && (
        <ReviewModal
          rating={rating}
          setRating={setRating}
          comment={comment}
          setComment={setComment}
          setReviewPhotoFile={setReviewPhotoFile}
          reviewModalErr={reviewModalErr}
          submittingReview={submittingReview}
          onClose={() => setReviewAppId(null)}
          onSubmit={handleReviewSubmit}
        />
      )}

      <Footer minimal />
    </div>
  )
}
