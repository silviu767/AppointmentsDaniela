import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { useLanguage, translateServiceName } from '../context/LanguageContext'
import { getServices, getAvailableSlots, createAppointment } from '../api/client'
import type { Service, Slot } from '../types'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function dateKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function formatPrice(price: string | number): string {
  const num = Number(price)
  if (Number.isNaN(num)) return `${price}€`
  return Number.isInteger(num) ? `${num}€` : `${num.toFixed(0)}€`
}

function formatSlotTime(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Europe/Paris',
    })
  } catch {
    return iso.slice(11, 16)
  }
}

export function BookingPage() {
  const [searchParams] = useSearchParams()
  const preselectedId = searchParams.get('service_id')

  const { user, token, login, register } = useAuth()
  const { lang, t } = useLanguage()
  const b = t.booking

  const [pas, setPas] = useState<number>(1)
  const [services, setServices] = useState<Service[]>([])
  const [loadingServices, setLoadingServices] = useState<boolean>(true)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const azi = new Date()
  const [calAn, setCalAn] = useState<number>(azi.getFullYear())
  const [calLuna, setCalLuna] = useState<number>(azi.getMonth())

  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null)
  const [selectedDayNum, setSelectedDayNum] = useState<number | null>(null)
  const [slots, setSlots] = useState<Slot[]>([])
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  // Step 3 Auth / Booking state
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [notes, setNotes] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    setLoadingServices(true)
    getServices()
      .then((data) => {
        setServices(data)
        if (preselectedId) {
          const found = data.find((s) => String(s.service_id) === preselectedId)
          if (found) {
            setSelectedService(found)
            setPas(2)
          }
        }
      })
      .catch((err) => {
        setErrorMsg(err.message || b.noActiveServices)
      })
      .finally(() => setLoadingServices(false))
  }, [preselectedId])

  const schimbaLuna = (dir: number) => {
    let newLuna = calLuna + dir
    let newAn = calAn
    if (newLuna < 0) {
      newLuna = 11
      newAn--
    }
    if (newLuna > 11) {
      newLuna = 0
      newAn++
    }
    setCalLuna(newLuna)
    setCalAn(newAn)
  }

  const selectedDateLabel =
    selectedDayNum !== null ? `${selectedDayNum} ${b.months[calLuna]} ${calAn}` : ''

  const handleSelectZi = async (key: string, ziNr: number) => {
    if (!selectedService) return
    setSelectedDateKey(key)
    setSelectedDayNum(ziNr)
    setSelectedSlot(null)
    setLoadingSlots(true)
    setErrorMsg(null)
    try {
      const available = await getAvailableSlots(selectedService.service_id, key)
      setSlots(available)
    } catch (err: unknown) {
      setSlots([])
      setErrorMsg(err instanceof Error ? err.message : b.noSlots)
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedSlot) return
    if (honeypot.trim() !== '') {
      setPas(4)
      return
    }

    setErrorMsg(null)
    setSubmitting(true)

    try {
      let activeToken = token
      if (!user || !activeToken) {
        if (authMode === 'register') {
          if (!firstName.trim() || !lastName.trim()) {
            throw new Error(b.errName)
          }
          if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            throw new Error(b.errEmail)
          }
          if (password.length < 8) {
            throw new Error(b.errPass)
          }
          await register({
            email: email.trim(),
            password,
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone.trim() || undefined,
          })
          activeToken = localStorage.getItem('dn_auth_token')
        } else {
          if (!email.trim() || !password) {
            throw new Error(b.errLoginFields)
          }
          await login(email.trim(), password)
          activeToken = localStorage.getItem('dn_auth_token')
        }
      }

      if (!activeToken) {
        throw new Error(b.errAuthFailed)
      }

      await createAppointment(activeToken, selectedService.service_id, selectedSlot.starts_at, notes.trim() || undefined)
      setPas(4)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : b.errAuthFailed)
    } finally {
      setSubmitting(false)
    }
  }

  const resetApp = () => {
    setPas(1)
    setSelectedService(null)
    setSelectedDateKey(null)
    setSelectedDayNum(null)
    setSelectedSlot(null)
    setNotes('')
    setErrorMsg(null)
  }

  const renderCalendarDays = () => {
    let start = new Date(calAn, calLuna, 1).getDay()
    if (start === 0) start = 7
    const emptyCells = Array.from({ length: start - 1 }, (_, i) => i)
    const zileInLuna = new Date(calAn, calLuna + 1, 0).getDate()
    const aziDate = new Date(azi.getFullYear(), azi.getMonth(), azi.getDate())

    const days = Array.from({ length: zileInLuna }, (_, i) => i + 1)

    return (
      <>
        {b.daysShort.map((z) => (
          <div key={z} className="day-name">
            {z}
          </div>
        ))}
        {emptyCells.map((i) => (
          <div key={`empty-${i}`} className="day empty"></div>
        ))}
        {days.map((z) => {
          const data = new Date(calAn, calLuna, z)
          const key = dateKey(data)
          const isPast = data < aziDate
          const isToday = data.toDateString() === azi.toDateString()
          const isSelected = selectedDateKey === key

          return (
            <div
              key={key}
              className={`day ${isPast ? 'past' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => {
                if (!isPast) handleSelectZi(key, z)
              }}
            >
              {z}
            </div>
          )
        })}
      </>
    )
  }

  return (
    <div className="booking-page">
      <Header />

      <main className="pg-wrap">
        <div className="pg-hero">
          <div className="pg-eyebrow">
            <span className="eyebrow-line"></span>
            <span>{b.eyebrow}</span>
          </div>
          <h1 className="pg-titlu">
            {b.titleLine1}
            <br />
            <em>{b.titleLine2}</em>
          </h1>
          <p className="pg-sub">{b.subtitle}</p>
        </div>

        {/* Progress Bar */}
        <div className="steps-bar">
          {b.steps.map((label, i) => {
            const nr = i + 1
            const isDone = nr < pas
            const isActiv = nr === pas
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
                <div className="step-dot">
                  <div className={`step-circle ${isDone ? 'done' : isActiv ? 'activ' : ''}`}>
                    {isDone ? '✓' : nr}
                  </div>
                  <div className={`step-label ${isActiv ? 'activ' : ''}`}>{label}</div>
                </div>
                {i < b.steps.length - 1 && <div className={`step-line ${isDone ? 'done' : ''}`}></div>}
              </div>
            )
          })}
        </div>

        {/* Dynamic Content Card */}
        <div className="pg-card">
          {errorMsg && (
            <div
              style={{
                background: 'var(--red-pale)',
                border: '1px solid var(--red-border)',
                color: 'var(--red)',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '13.5px',
                marginBottom: '20px',
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* STEP 1: SERVICIU */}
          {pas === 1 && (
            <div>
              <h2>{b.step1Title}</h2>
              <p className="pg-card-sub">{b.step1Sub}</p>

              {loadingServices ? (
                <p className="loading-text">{b.loadingServices}</p>
              ) : services.length === 0 ? (
                <p className="loading-text">{b.noActiveServices}</p>
              ) : (
                <div className="servicii-list">
                  {services.map((s) => (
                    <div
                      key={s.service_id}
                      className="svc-item"
                      onClick={() => {
                        setSelectedService(s)
                        setSelectedDateKey(null)
                        setSelectedDayNum(null)
                        setSelectedSlot(null)
                        setErrorMsg(null)
                        setPas(2)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                    >
                      <div className="svc-info">
                        <span className="svc-nome">{translateServiceName(s.name, lang)}</span>
                        <span className="svc-dur">
                          {s.duration_minutes} {t.home.minutes}
                        </span>
                      </div>
                      <span className="svc-price">{formatPrice(s.price)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: CALENDAR & SLOTS */}
          {pas === 2 && selectedService && (
            <div>
              <button
                type="button"
                className="btn-back"
                onClick={() => {
                  setPas(1)
                  setErrorMsg(null)
                }}
              >
                {b.back}
              </button>
              <h2>{b.step2Title}</h2>
              <p className="pg-card-sub">
                {b.selectedServiceLabel}{' '}
                <strong style={{ color: 'var(--roz)' }}>{translateServiceName(selectedService.name, lang)}</strong> (
                {selectedService.duration_minutes} {t.home.minutes} · {formatPrice(selectedService.price)})
              </p>

              <div className="cal-nav">
                <button type="button" onClick={() => schimbaLuna(-1)}>
                  ←
                </button>
                <span>
                  {b.months[calLuna]} {calAn}
                </span>
                <button type="button" onClick={() => schimbaLuna(1)}>
                  →
                </button>
              </div>

              <div className="cal-grid">{renderCalendarDays()}</div>

              {selectedDateKey && (
                <div className="ore-section">
                  <h3>{b.chooseHour}</h3>
                  <p className="ore-titlu">
                    {b.availableHoursFor} {selectedDateLabel}
                  </p>

                  {loadingSlots ? (
                    <p className="loading-text">{b.loadingSlots}</p>
                  ) : slots.length === 0 ? (
                    <p className="loading-text">{b.noSlots}</p>
                  ) : (
                    <div className="ore-grid">
                      {slots.map((slot) => {
                        const label = formatSlotTime(slot.starts_at)
                        const isSel = selectedSlot?.starts_at === slot.starts_at
                        return (
                          <button
                            type="button"
                            key={slot.starts_at}
                            className={`ora-btn ${isSel ? 'selected' : ''}`}
                            onClick={() => {
                              setSelectedSlot(slot)
                              setErrorMsg(null)
                              setTimeout(() => {
                                setPas(3)
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                              }, 200)
                            }}
                          >
                            {label}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: DATELE TALE & AUTENTIFICARE */}
          {pas === 3 && selectedService && selectedSlot && (
            <div>
              <button
                type="button"
                className="btn-back"
                onClick={() => {
                  setPas(2)
                  setErrorMsg(null)
                }}
              >
                {b.back}
              </button>
              <h2>{b.step3Title}</h2>
              <p className="pg-card-sub">{b.step3Sub}</p>

              <div className="rezumat-box">
                <strong>{translateServiceName(selectedService.name, lang)}</strong> ·{' '}
                {formatPrice(selectedService.price)} ({selectedService.duration_minutes} {t.home.minutes})
                <br />
                {b.dateLabel} {selectedDateLabel} {b.atHour} <strong>{formatSlotTime(selectedSlot.starts_at)}</strong>
              </div>

              {user ? (
                <div
                  style={{
                    background: 'var(--roz-pale)',
                    border: '1px solid var(--border-mid)',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    marginBottom: '22px',
                    fontSize: '14px',
                  }}
                >
                  {b.loggedInAs}{' '}
                  <strong style={{ color: 'var(--roz)' }}>
                    {user.first_name} {user.last_name}
                  </strong>{' '}
                  ({user.email})
                </div>
              ) : (
                <div style={{ marginBottom: '24px' }}>
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      marginBottom: '20px',
                      background: 'var(--cream)',
                      padding: '6px',
                      borderRadius: '10px',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('register')
                        setErrorMsg(null)
                      }}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 500,
                        background: authMode === 'register' ? 'var(--roz)' : 'transparent',
                        color: authMode === 'register' ? 'white' : 'var(--text-mid)',
                        transition: 'all 0.2s',
                      }}
                    >
                      Sign Up
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login')
                        setErrorMsg(null)
                      }}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 500,
                        background: authMode === 'login' ? 'var(--roz)' : 'transparent',
                        color: authMode === 'login' ? 'white' : 'var(--text-mid)',
                        transition: 'all 0.2s',
                      }}
                    >
                      Log In
                    </button>
                  </div>

                  {authMode === 'register' && (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="form-camp">
                          <label>{b.firstName}</label>
                          <input
                            type="text"
                            placeholder={b.firstNamePlaceholder}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>
                        <div className="form-camp">
                          <label>{b.lastName}</label>
                          <input
                            type="text"
                            placeholder={b.lastNamePlaceholder}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="form-camp">
                        <label>{b.phone}</label>
                        <input
                          type="tel"
                          placeholder={b.phonePlaceholder}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  <div className="form-camp">
                    <label>{b.email}</label>
                    <input
                      type="email"
                      placeholder={b.emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-camp">
                    <label>
                      {b.password} {authMode === 'register' ? b.min8Chars : ''}
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="form-camp">
                <label>{b.notes}</label>
                <input
                  type="text"
                  placeholder={b.notesPlaceholder}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Honeypot */}
              <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <p
                className="privacy-notice"
                style={{ fontSize: '12px', color: '#999', marginTop: '16px', lineHeight: 1.6 }}
              >
                {b.privacyPrefix}
                <Link to="/privacy" target="_blank" style={{ color: 'var(--roz)', textDecoration: 'underline' }}>
                  {b.privacyLink}
                </Link>
                {b.privacySuffix}
              </p>

              <button
                type="button"
                className="btn-confirma"
                disabled={submitting}
                onClick={handleConfirmBooking}
              >
                {submitting ? b.submittingBtn : b.confirmBtn}
              </button>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {pas === 4 && selectedService && selectedSlot && (
            <div className="success-wrap">
              <div className="success-icon">✓</div>
              <h2>{b.step4Title}</h2>
              <p>
                {b.thankYou} <strong style={{ color: 'var(--roz)' }}>{user?.first_name || firstName}</strong>!
                <br />
                {b.confirmSoon}
                <br />
                <span style={{ fontSize: '13px', color: '#888' }}>{b.trackStatus}</span>
              </p>
              <div className="rezumat-box" style={{ textAlign: 'left' }}>
                <strong>{translateServiceName(selectedService.name, lang)}</strong> ·{' '}
                {formatPrice(selectedService.price)}
                <br />
                {b.dateLabel} {selectedDateLabel} {b.atHour} <strong>{formatSlotTime(selectedSlot.starts_at)}</strong>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <Link
                  to="/contul-meu"
                  className="btn-confirma"
                  style={{ maxWidth: '300px', textDecoration: 'none', textAlign: 'center' }}
                >
                  {b.viewMyBookings}
                </Link>
                <button
                  type="button"
                  className="btn-back"
                  style={{ margin: 0 }}
                  onClick={resetApp}
                >
                  {b.bookAnother}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer minimal />
    </div>
  )
}
