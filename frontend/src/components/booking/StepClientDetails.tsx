import { Link } from 'react-router-dom'
import type { Service, Slot, User } from '../../types'
import { useLanguage, translateServiceName } from '../../context/LanguageContext'
import { formatPrice, formatSlotTime } from './bookingUtils'

interface StepClientDetailsProps {
  selectedService: Service
  selectedSlot: Slot
  selectedDateLabel: string
  user: User | null
  authMode: 'login' | 'register'
  setAuthMode: (mode: 'login' | 'register') => void
  firstName: string
  setFirstName: (v: string) => void
  lastName: string
  setLastName: (v: string) => void
  phone: string
  setPhone: (v: string) => void
  email: string
  setEmail: (v: string) => void
  password: string
  setPassword: (v: string) => void
  notes: string
  setNotes: (v: string) => void
  honeypot: string
  setHoneypot: (v: string) => void
  submitting: boolean
  onBack: () => void
  onClearError: () => void
  onConfirm: () => void
}

export function StepClientDetails({
  selectedService,
  selectedSlot,
  selectedDateLabel,
  user,
  authMode,
  setAuthMode,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  phone,
  setPhone,
  email,
  setEmail,
  password,
  setPassword,
  notes,
  setNotes,
  honeypot,
  setHoneypot,
  submitting,
  onBack,
  onClearError,
  onConfirm,
}: StepClientDetailsProps) {
  const { lang, t } = useLanguage()
  const b = t.booking

  return (
    <div>
      <button type="button" className="btn-back" onClick={onBack}>
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
                onClearError()
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
                onClearError()
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
        onClick={onConfirm}
      >
        {submitting ? b.submittingBtn : b.confirmBtn}
      </button>
    </div>
  )
}
