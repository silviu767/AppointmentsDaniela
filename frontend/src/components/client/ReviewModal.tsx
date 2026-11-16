import { useLanguage } from '../../context/LanguageContext'

interface ReviewModalProps {
  rating: number
  setRating: (v: number) => void
  comment: string
  setComment: (v: string) => void
  setReviewPhotoFile: (file: File | null) => void
  reviewModalErr: string | null
  submittingReview: boolean
  onClose: () => void
  onSubmit: () => void
}

export function ReviewModal({
  rating,
  setRating,
  comment,
  setComment,
  setReviewPhotoFile,
  reviewModalErr,
  submittingReview,
  onClose,
  onSubmit,
}: ReviewModalProps) {
  const { t } = useLanguage()
  const c = t.client

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>{c.modalTitle}</h3>
        <p>{c.modalSub}</p>

        {reviewModalErr && (
          <div
            style={{
              background: 'var(--red-pale)',
              border: '1px solid var(--red-border)',
              color: 'var(--red)',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              marginBottom: '16px',
            }}
          >
            {reviewModalErr}
          </div>
        )}

        <div className="form-camp">
          <label>
            {c.ratingLabel} ({rating} {c.outOf5})
          </label>
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                style={{
                  fontSize: '26px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: star <= rating ? '#f6b800' : '#ddd',
                }}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="form-camp">
          <label>{c.commentLabel}</label>
          <textarea
            rows={4}
            placeholder={c.commentPlaceholder}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className="form-camp">
          <label>{c.attachPhotoLabel}</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setReviewPhotoFile(e.target.files?.[0] || null)}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <button
            type="button"
            className="setup-btn"
            style={{ flex: 1, padding: '12px', borderRadius: '10px' }}
            onClick={onClose}
          >
            {c.cancelModalBtn}
          </button>
          <button
            type="button"
            className="btn-confirma"
            style={{ flex: 1, marginTop: 0, padding: '12px' }}
            disabled={submittingReview}
            onClick={onSubmit}
          >
            {submittingReview ? c.submittingReviewBtn : c.submitReviewBtn}
          </button>
        </div>
      </div>
    </div>
  )
}
