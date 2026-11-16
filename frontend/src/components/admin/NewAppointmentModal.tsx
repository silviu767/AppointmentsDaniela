import { useState, type FormEvent } from 'react'
import type { AdminService } from '../../types'

interface NewAppointmentModalProps {
  services: AdminService[]
  defaultServiceId: number
  onClose: () => void
  onSubmit: (data: {
    first_name: string
    last_name: string
    phone?: string | null
    email?: string | null
    service_id: number
    starts_at: string
    notes?: string
  }) => Promise<void>
}

export function NewAppointmentModal({
  services,
  defaultServiceId,
  onClose,
  onSubmit,
}: NewAppointmentModalProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [serviceId, setServiceId] = useState<number>(defaultServiceId)
  const [startsAt, setStartsAt] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const naiveStartsAt = startsAt.length === 16 ? `${startsAt}:00` : startsAt
    await onSubmit({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: phone.trim() || null,
      email: email.trim() || null,
      service_id: Number(serviceId),
      starts_at: naiveStartsAt,
      notes: notes.trim() || undefined,
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>Programare manuală</h3>
        <p>Adaugă o programare telefonică sau directă în agendă.</p>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-camp">
              <label>Prenume clientă</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-camp">
              <label>Nume clientă</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-camp">
              <label>Telefon (opțional)</label>
              <input
                type="tel"
                placeholder="ex: +33 6 12 34 56 78"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-camp">
              <label>Email (opțional)</label>
              <input
                type="email"
                placeholder="ex: clienta@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="form-camp">
            <label>Serviciu</label>
            <select value={serviceId} onChange={(e) => setServiceId(Number(e.target.value))}>
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
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
            />
          </div>
          <div className="form-camp">
            <label>Observații (opțional)</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button
              type="button"
              className="setup-btn"
              style={{ flex: 1, padding: '12px', borderRadius: '10px' }}
              onClick={onClose}
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
  )
}
