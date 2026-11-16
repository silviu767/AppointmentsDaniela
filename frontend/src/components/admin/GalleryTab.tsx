import type { Photo } from '../../types'
import { resolveImageUrl } from '../../api/client'

interface GalleryTabProps {
  galleryPhotos: Photo[]
  onUploadPhoto: (file: File) => void
  onDeletePhoto: (photoId: number) => void
}

export function GalleryTab({ galleryPhotos, onUploadPhoto, onDeletePhoto }: GalleryTabProps) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 400 }}>
          Galerie Portofoliu
        </h2>
        <label className="btn-complete" style={{ borderRadius: '10px', cursor: 'pointer' }}>
          + Încarcă fotografie în galerie
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onUploadPhoto(f)
            }}
          />
        </label>
      </div>

      {galleryPhotos.length === 0 ? (
        <div className="empty-state">
          <p>Nu există fotografii încărcate în galerie.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          {galleryPhotos.map((photo) => (
            <div
              key={photo.photo_id}
              style={{
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                overflow: 'hidden',
              }}
            >
              <img
                src={resolveImageUrl(photo.image_url)}
                alt="Galerie"
                style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
              />
              <div
                style={{
                  padding: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>Poza #{photo.photo_id}</span>
                <button
                  type="button"
                  className="btn-cancel"
                  style={{ padding: '5px 12px', fontSize: '12px' }}
                  onClick={() => onDeletePhoto(photo.photo_id)}
                >
                  Șterge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
