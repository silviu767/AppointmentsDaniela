import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { getServices, getPhotos, getApprovedReviews, resolveImageUrl } from '../api/client'
import {
  useLanguage,
  translateServiceName,
  translateServiceDesc,
  translateCategory,
} from '../context/LanguageContext'
import type { Service, Photo, Review } from '../types'

const FALLBACK_GALLERY = [
  { id: 1, className: 'gi-1', label: 'Nail Art Floral' },
  { id: 2, className: 'gi-2', label: 'French Gel' },
  { id: 3, className: 'gi-3', label: 'Ombre Effect' },
  { id: 4, className: 'gi-4', label: 'Classic Pink' },
  { id: 5, className: 'gi-5', label: 'Marble Design' },
  { id: 6, className: 'gi-6', label: 'Crystal Tips' },
]

function formatPrice(price: string | number): string {
  const num = Number(price)
  if (Number.isNaN(num)) return `${price}€`
  return Number.isInteger(num) ? `${num}€` : `${num.toFixed(0)}€`
}

export function HomePage() {
  const { lang, t, locale } = useLanguage()
  const [services, setServices] = useState<Service[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [visibleReviewsCount, setVisibleReviewsCount] = useState<number>(3)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    getServices()
      .then((data) => {
        if (data) setServices(data)
      })
      .catch(() => {})

    getPhotos()
      .then((data) => {
        if (data) setPhotos(data)
      })
      .catch(() => {})

    getApprovedReviews()
      .then((data) => {
        if (data) setReviews(data)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
      }
    }
  }, [location.hash])

  const marqueeItems =
    services.length > 0
      ? [...services, ...services, ...services, ...services].map((s) =>
          translateServiceName(s.name, lang)
        )
      : []

  const displayedPhotos = photos.slice(0, 6)
  const visibleReviews = reviews.slice(0, visibleReviewsCount)

  return (
    <div>
      <Header />

      {/* HERO */}
      <section id="hero">
        <div className="hero-noise"></div>
        <div className="hero-left">
          <h1>
            {t.hero.titleLine1}
            <br />
            <em>{t.hero.titleLine2}</em>
          </h1>
          <div className="hero-actions">
            <Link to="/programare" className="btn-book">
              {t.hero.bookBtn}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <a href="#servicii" className="btn-discover">
              {t.hero.discoverBtn}
            </a>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-img-frame">
            <div className="frame-accent top-left"></div>
            <div className="frame-accent bottom-right"></div>
            <div className="hero-img-inner">
              <div className="hero-img-placeholder">
                <div className="nail-art">
                  <div className="nail n1"></div>
                  <div className="nail n2"></div>
                  <div className="nail n3"></div>
                  <div className="nail n4"></div>
                  <div className="nail n5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE CU SERVICIILE DIN BAZA DE DATE */}
      {marqueeItems.length > 0 && (
        <div className="marquee-wrap">
          <div className="marquee-track">
            {marqueeItems.map((name, idx) => (
              <span key={`${name}-${idx}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '40px' }}>
                <span>{name}</span>
                <span className="dot">◆</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* SERVICII */}
      <section id="servicii">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">
              <span className="tag-line"></span>
              <span>{t.home.servicesTag}</span>
            </div>
          </div>

          {services.length === 0 ? (
            <p className="loading-text">{t.home.noServices}</p>
          ) : (
            <div className="services-layout">
              {services.map((svc, idx) => {
                const translatedName = translateServiceName(svc.name, lang)
                const translatedDesc = translateServiceDesc(svc.description, lang)
                return (
                  <div key={svc.service_id} className="svc-card">
                    <div className="svc-top">
                      <div className="svc-category">{translateCategory(svc.name, idx, lang)}</div>
                      <div className="svc-price-tag">{formatPrice(svc.price)}</div>
                    </div>
                    <h3>{translatedName}</h3>
                    {translatedDesc && <p>{translatedDesc}</p>}
                    <div className="svc-meta">
                      <span className="svc-time">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
                          <path d="M7 4v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                        {svc.duration_minutes} {t.home.minutes}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="svc-link"
                      onClick={() => navigate(`/programare?service_id=${svc.service_id}`)}
                    >
                      {t.home.bookService}
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M2 7h10M8 3l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* GALERIE */}
      <section id="galerie">
        <div className="container">
          <div className="section-header centered">
            <div className="section-tag">
              <span className="tag-line"></span>
              <span>{t.home.portfolioTag}</span>
            </div>
            <h2>
              {t.home.galleryTitleLine1}
              <br />
              <em>{t.home.galleryTitleLine2}</em>
            </h2>
          </div>

          <div className="gallery-grid">
            {displayedPhotos.length > 0
              ? displayedPhotos.map((photo, idx) => (
                  <div
                    key={photo.photo_id}
                    className={`g-item gi-${(idx % 6) + 1}`}
                    style={
                      displayedPhotos.length < 6 && idx === displayedPhotos.length - 1
                        ? { gridColumn: '1 / -1' }
                        : undefined
                    }
                  >
                    <img src={resolveImageUrl(photo.image_url)} alt="Daniela's Nails" loading="lazy" />
                    <div className="g-overlay">
                      <span>Daniela's Nails</span>
                    </div>
                  </div>
                ))
              : FALLBACK_GALLERY.map((item, idx) => (
                  <div key={item.id} className={`g-item ${item.className}`}>
                    <div className="g-overlay">
                      <span>{t.home.galleryItems[idx] || item.label}</span>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* RECENZII REALE APROBATE */}
      {reviews.length > 0 && (
        <section id="testimoniale">
          <div className="container">
            <div className="section-tag centered-tag">
              <span className="tag-line"></span>
              <span>{t.home.reviewsTag}</span>
            </div>
            <div className="testimonials-grid">
              {visibleReviews.map((rev) => {
                const authorName = rev.client_name || t.home.clientFallback
                return (
                  <div key={rev.review_id} className="testimonial">
                    <div className="stars">{'★'.repeat(rev.rating) + '☆'.repeat(Math.max(0, 5 - rev.rating))}</div>
                    {rev.comment && <p>"{rev.comment}"</p>}
                    {rev.photos && rev.photos.length > 0 && (
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
                        {rev.photos.map((p) => (
                          <a
                            key={p.photo_id}
                            href={resolveImageUrl(p.image_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={resolveImageUrl(p.image_url)}
                              alt="Daniela's Nails"
                              style={{
                                width: '64px',
                                height: '64px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                              }}
                            />
                          </a>
                        ))}
                      </div>
                    )}
                    <div className="testimonial-author">
                      <div className="author-avatar">{authorName[0]?.toUpperCase() || 'C'}</div>
                      <div>
                        <strong>{authorName}</strong>
                        <span>
                          {new Date(rev.created_at).toLocaleDateString(locale, {
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {reviews.length > 3 && (
              <div style={{ textAlign: 'center', marginTop: '36px' }}>
                {visibleReviewsCount < reviews.length ? (
                  <button
                    type="button"
                    className="btn-back"
                    style={{ margin: 0 }}
                    onClick={() => setVisibleReviewsCount((prev) => prev + 3)}
                  >
                    {t.home.loadMoreReviews} ({reviews.length - visibleReviewsCount} {t.home.remaining})
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-back"
                    style={{ margin: 0 }}
                    onClick={() => setVisibleReviewsCount(3)}
                  >
                    {t.home.collapseReviews}
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section id="cta">
        <div className="cta-content">
          <div className="cta-tag">{t.home.ctaTag}</div>
          <h2>
            {t.home.ctaTitleLine1}
            <br />
            <em>{t.home.ctaTitleLine2}</em>
          </h2>
          <p>{t.home.ctaDesc}</p>
          <Link to="/programare" className="btn-cta-main">
            {t.home.ctaBtn}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M3 9h12M10 4l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
        <div className="cta-decor">
          <div className="cta-circle cc1"></div>
          <div className="cta-circle cc2"></div>
          <div className="cta-circle cc3"></div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
