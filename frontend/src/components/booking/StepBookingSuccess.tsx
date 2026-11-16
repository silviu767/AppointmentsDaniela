import { Link } from 'react-router-dom'
import type { Service, Slot } from '../../types'
import { useLanguage, translateServiceName } from '../../context/LanguageContext'
import { formatPrice, formatSlotTime } from './bookingUtils'

interface StepBookingSuccessProps {
  selectedService: Service
  selectedSlot: Slot
  selectedDateLabel: string
  clientDisplayName: string
  onReset: () => void
}

export function StepBookingSuccess({
  selectedService,
  selectedSlot,
  selectedDateLabel,
  clientDisplayName,
  onReset,
}: StepBookingSuccessProps) {
  const { lang, t } = useLanguage()
  const b = t.booking

  return (
    <div className="success-wrap">
      <div className="success-icon">✓</div>
      <h2>{b.step4Title}</h2>
      <p>
        {b.thankYou} <strong style={{ color: 'var(--roz)' }}>{clientDisplayName}</strong>!
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
          onClick={onReset}
        >
          {b.bookAnother}
        </button>
      </div>
    </div>
  )
}
