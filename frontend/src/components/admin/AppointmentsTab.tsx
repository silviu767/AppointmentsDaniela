import type { Appointment, AdminService } from '../../types'
import { resolveImageUrl } from '../../api/client'
import { STATUS_LABELS, formatDateTime, isSameDayParis } from './adminUtils'

interface AppointmentsTabProps {
  appointments: Appointment[]
  servicesMap: Record<number, AdminService>
  loadingData: boolean
  appFilter: string
  setAppFilter: (filter: string) => void
  onOpenNewAppModal: () => void
  onStatusChange: (
    appointmentId: number,
    status: 'confirmed' | 'cancelled_by_admin' | 'no_show' | 'completed'
  ) => void
  onUploadWorkPhoto: (appointmentId: number, file: File) => void
}

export function AppointmentsTab({
  appointments,
  servicesMap,
  loadingData,
  appFilter,
  setAppFilter,
  onOpenNewAppModal,
  onStatusChange,
  onUploadWorkPhoto,
}: AppointmentsTabProps) {
  const pendingCount = appointments.filter((a) => a.status === 'pending').length
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length
  const todayCount = appointments.filter((a) => isSameDayParis(a.starts_at)).length

  const filteredAppointments = appointments.filter((a) => {
    if (appFilter === 'toate') return true
    if (appFilter === 'azi') return isSameDayParis(a.starts_at)
    if (appFilter === 'anulate') {
      return ['cancelled_by_admin', 'cancelled_by_client', 'no_show'].includes(a.status)
    }
    return a.status === appFilter
  })

  return (
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
          onClick={onOpenNewAppModal}
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
                  {p.photos && p.photos.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                      {p.photos.map((ph) => (
                        <a
                          key={ph.photo_id}
                          href={resolveImageUrl(ph.image_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={resolveImageUrl(ph.image_url)}
                            alt="Lucrare"
                            style={{
                              width: '54px',
                              height: '54px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '1px solid var(--border-mid)',
                            }}
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <div className="prog-actions">
                  {p.status === 'pending' && (
                    <>
                      <button
                        type="button"
                        className="btn-confirm"
                        onClick={() => onStatusChange(p.appointment_id, 'confirmed')}
                      >
                        Confirmă
                      </button>
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => onStatusChange(p.appointment_id, 'cancelled_by_admin')}
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
                        onClick={() => onStatusChange(p.appointment_id, 'completed')}
                      >
                        Finalizează
                      </button>
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => onStatusChange(p.appointment_id, 'no_show')}
                      >
                        Neprezentare
                      </button>
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => onStatusChange(p.appointment_id, 'cancelled_by_admin')}
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
                        if (f) onUploadWorkPhoto(p.appointment_id, f)
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
  )
}
