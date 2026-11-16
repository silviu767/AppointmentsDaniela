import { useState, type FormEvent } from 'react'
import type { WorkingHour, BlockedPeriod } from '../../types'
import { DAYS_RO, formatDateTime } from './adminUtils'

interface ScheduleTabProps {
  workingHours: WorkingHour[]
  blockedPeriods: BlockedPeriod[]
  onAddWorkingHour: (day_of_week: number, starts_at: string, ends_at: string) => Promise<void>
  onDeleteWorkingHour: (id: number) => Promise<void>
  onAddBlockedPeriod: (starts_at: string, ends_at: string, reason: string | null) => Promise<void>
  onDeleteBlockedPeriod: (id: number) => Promise<void>
}

export function ScheduleTab({
  workingHours,
  blockedPeriods,
  onAddWorkingHour,
  onDeleteWorkingHour,
  onAddBlockedPeriod,
  onDeleteBlockedPeriod,
}: ScheduleTabProps) {
  const [whDay, setWhDay] = useState<number>(0)
  const [whStart, setWhStart] = useState('09:00')
  const [whEnd, setWhEnd] = useState('19:00')

  const [bpStart, setBpStart] = useState('')
  const [bpEnd, setBpEnd] = useState('')
  const [bpReason, setBpReason] = useState('')

  const handleWhSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await onAddWorkingHour(Number(whDay), whStart, whEnd)
  }

  const handleBpSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const naiveStart = bpStart.length === 16 ? `${bpStart}:00` : bpStart
    const naiveEnd = bpEnd.length === 16 ? `${bpEnd}:00` : bpEnd
    await onAddBlockedPeriod(naiveStart, naiveEnd, bpReason.trim() || null)
    setBpStart('')
    setBpEnd('')
    setBpReason('')
  }

  return (
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

        <form onSubmit={handleWhSubmit} style={{ marginBottom: '24px' }}>
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
                  onClick={() => onDeleteWorkingHour(wh.working_hour_id)}
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

        <form onSubmit={handleBpSubmit} style={{ marginBottom: '24px' }}>
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
                  onClick={() => onDeleteBlockedPeriod(bp.period_id)}
                >
                  Șterge
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
