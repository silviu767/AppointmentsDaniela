import type { Review } from '../../types'
import { resolveImageUrl } from '../../api/client'

interface ReviewsTabProps {
  reviews: Review[]
  onUpdateStatus: (reviewId: number, status: 'approved' | 'rejected') => void
}

export function ReviewsTab({ reviews, onUpdateStatus }: ReviewsTabProps) {
  return (
    <div>
      <h2
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '28px',
          fontWeight: 400,
          marginBottom: '20px',
        }}
      >
        Moderare Recenzii
      </h2>

      {reviews.length === 0 ? (
        <div className="empty-state">
          <p>Nicio recenzie primită încă.</p>
        </div>
      ) : (
        <div className="cards-list">
          {reviews.map((rev) => (
            <div key={rev.review_id} className="prog-card">
              <div className="prog-info">
                <div className="prog-top">
                  <span className="prog-name" style={{ color: '#f6b800' }}>
                    {'★'.repeat(rev.rating) + '☆'.repeat(Math.max(0, 5 - rev.rating))}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>
                    {rev.client_name || `Programare #${rev.appointment_id}`}
                  </span>
                  <span
                    className={`status-pill ${
                      rev.status === 'approved'
                        ? 'pill-confirmed'
                        : rev.status === 'rejected'
                          ? 'pill-no_show'
                          : 'pill-pending'
                    }`}
                  >
                    {rev.status === 'approved'
                      ? 'Aprobată'
                      : rev.status === 'rejected'
                        ? 'Respinsă'
                        : 'În așteptare'}
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-mid)', marginTop: '4px' }}>
                  "{rev.comment || 'Fără comentariu text'}"
                </p>
                {rev.photos && rev.photos.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                    {rev.photos.map((p) => (
                      <a
                        key={p.photo_id}
                        href={resolveImageUrl(p.image_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={resolveImageUrl(p.image_url)}
                          alt="Recenzie"
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                          }}
                        />
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div className="prog-actions">
                {rev.status !== 'approved' && (
                  <button
                    type="button"
                    className="btn-confirm"
                    onClick={() => onUpdateStatus(rev.review_id, 'approved')}
                  >
                    Aprobă
                  </button>
                )}
                {rev.status !== 'rejected' && (
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => onUpdateStatus(rev.review_id, 'rejected')}
                  >
                    Respinge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
