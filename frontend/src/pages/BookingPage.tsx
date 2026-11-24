import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { getServices, getAvailableSlots, createAppointment } from '../api/client'
import type { Service, Slot } from '../types'
import { StepServiceSelect } from '../components/booking/StepServiceSelect'
import { StepDateAndSlot } from '../components/booking/StepDateAndSlot'
import { StepClientDetails } from '../components/booking/StepClientDetails'
import { StepBookingSuccess } from '../components/booking/StepBookingSuccess'

export function BookingPage() {
  const [searchParams] = useSearchParams()
  const preselectedId = searchParams.get('service_id')

  const { user, token, login, register } = useAuth()
  const { t } = useLanguage()
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
    let cancelled = false
    getServices()
      .then((data) => {
        if (cancelled) return
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
        if (!cancelled) {
          setErrorMsg(err.message || b.noActiveServices)
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingServices(false)
      })
    return () => {
      cancelled = true
    }
  }, [preselectedId, b.noActiveServices])

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

      await createAppointment(
        activeToken,
        selectedService.service_id,
        selectedSlot.starts_at,
        notes.trim() || undefined
      )
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

          {pas === 1 && (
            <StepServiceSelect
              services={services}
              loading={loadingServices}
              onSelectService={(s) => {
                setSelectedService(s)
                setSelectedDateKey(null)
                setSelectedDayNum(null)
                setSelectedSlot(null)
                setErrorMsg(null)
                setPas(2)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          )}

          {pas === 2 && selectedService && (
            <StepDateAndSlot
              selectedService={selectedService}
              calAn={calAn}
              calLuna={calLuna}
              selectedDateKey={selectedDateKey}
              selectedDateLabel={selectedDateLabel}
              slots={slots}
              loadingSlots={loadingSlots}
              selectedSlot={selectedSlot}
              onBack={() => {
                setPas(1)
                setErrorMsg(null)
              }}
              onChangeMonth={schimbaLuna}
              onSelectDay={handleSelectZi}
              onSelectSlot={(slot) => {
                setSelectedSlot(slot)
                setErrorMsg(null)
                setTimeout(() => {
                  setPas(3)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }, 200)
              }}
            />
          )}

          {pas === 3 && selectedService && selectedSlot && (
            <StepClientDetails
              selectedService={selectedService}
              selectedSlot={selectedSlot}
              selectedDateLabel={selectedDateLabel}
              user={user}
              authMode={authMode}
              setAuthMode={setAuthMode}
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              phone={phone}
              setPhone={setPhone}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              notes={notes}
              setNotes={setNotes}
              honeypot={honeypot}
              setHoneypot={setHoneypot}
              submitting={submitting}
              onBack={() => {
                setPas(2)
                setErrorMsg(null)
              }}
              onClearError={() => setErrorMsg(null)}
              onConfirm={handleConfirmBooking}
            />
          )}

          {pas === 4 && selectedService && selectedSlot && (
            <StepBookingSuccess
              selectedService={selectedService}
              selectedSlot={selectedSlot}
              selectedDateLabel={selectedDateLabel}
              clientDisplayName={user?.first_name || firstName}
              onReset={resetApp}
            />
          )}
        </div>
      </main>

      <Footer minimal />
    </div>
  )
}
