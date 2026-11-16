import type { Service, Slot } from '../../types'
import { useLanguage, translateServiceName } from '../../context/LanguageContext'
import { dateKey, formatPrice, formatSlotTime } from './bookingUtils'

interface StepDateAndSlotProps {
  selectedService: Service
  calAn: number
  calLuna: number
  selectedDateKey: string | null
  selectedDateLabel: string
  slots: Slot[]
  loadingSlots: boolean
  selectedSlot: Slot | null
  onBack: () => void
  onChangeMonth: (dir: number) => void
  onSelectDay: (key: string, dayNum: number) => void
  onSelectSlot: (slot: Slot) => void
}

export function StepDateAndSlot({
  selectedService,
  calAn,
  calLuna,
  selectedDateKey,
  selectedDateLabel,
  slots,
  loadingSlots,
  selectedSlot,
  onBack,
  onChangeMonth,
  onSelectDay,
  onSelectSlot,
}: StepDateAndSlotProps) {
  const { lang, t } = useLanguage()
  const b = t.booking
  const azi = new Date()

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
                if (!isPast) onSelectDay(key, z)
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
    <div>
      <button type="button" className="btn-back" onClick={onBack}>
        {b.back}
      </button>
      <h2>{b.step2Title}</h2>
      <p className="pg-card-sub">
        {b.selectedServiceLabel}{' '}
        <strong style={{ color: 'var(--roz)' }}>{translateServiceName(selectedService.name, lang)}</strong> (
        {selectedService.duration_minutes} {t.home.minutes} · {formatPrice(selectedService.price)})
      </p>

      <div className="cal-nav">
        <button type="button" onClick={() => onChangeMonth(-1)}>
          ←
        </button>
        <span>
          {b.months[calLuna]} {calAn}
        </span>
        <button type="button" onClick={() => onChangeMonth(1)}>
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
                    onClick={() => onSelectSlot(slot)}
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
  )
}
