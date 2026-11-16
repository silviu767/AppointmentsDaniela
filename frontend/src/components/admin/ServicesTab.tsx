import { useState, type FormEvent } from 'react'
import type { AdminService } from '../../types'

interface ServicesTabProps {
  services: AdminService[]
  onSaveService: (
    editingId: number | null,
    payload: {
      name: string
      description: string | null
      duration_minutes: number
      price: number
      is_active: boolean
    }
  ) => Promise<void>
  onToggleActive: (service: AdminService) => Promise<void>
}

export function ServicesTab({ services, onSaveService, onToggleActive }: ServicesTabProps) {
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<AdminService | null>(null)
  const [svcName, setSvcName] = useState('')
  const [svcDesc, setSvcDesc] = useState('')
  const [svcDuration, setSvcDuration] = useState('60')
  const [svcPrice, setSvcPrice] = useState('30')
  const [svcActive, setSvcActive] = useState(true)

  const openCreate = () => {
    setEditingService(null)
    setSvcName('')
    setSvcDesc('')
    setSvcDuration('60')
    setSvcPrice('30')
    setSvcActive(true)
    setShowModal(true)
  }

  const openEdit = (svc: AdminService) => {
    setEditingService(svc)
    setSvcName(svc.name)
    setSvcDesc(svc.description || '')
    setSvcDuration(String(svc.duration_minutes))
    setSvcPrice(String(svc.price))
    setSvcActive(svc.is_active)
    setShowModal(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await onSaveService(editingService ? editingService.service_id : null, {
      name: svcName.trim(),
      description: svcDesc.trim() || null,
      duration_minutes: Number(svcDuration),
      price: Number(svcPrice),
      is_active: svcActive,
    })
    setShowModal(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 400 }}>
          Administrare Servicii
        </h2>
        <button
          type="button"
          className="btn-complete"
          style={{ borderRadius: '10px' }}
          onClick={openCreate}
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
              <button type="button" className="setup-btn" onClick={() => openEdit(s)}>
                Editează
              </button>
              <button
                type="button"
                className={s.is_active ? 'btn-cancel' : 'btn-confirm'}
                onClick={() => onToggleActive(s)}
              >
                {s.is_active ? 'Dezactivează' : 'Activează'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>{editingService ? 'Editează serviciul' : 'Adaugă serviciu nou'}</h3>
            <p>Configurează detaliile serviciului afișat pe site.</p>
            <form onSubmit={handleSubmit}>
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
                <textarea rows={3} value={svcDesc} onChange={(e) => setSvcDesc(e.target.value)} />
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
                  onClick={() => setShowModal(false)}
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
    </div>
  )
}
