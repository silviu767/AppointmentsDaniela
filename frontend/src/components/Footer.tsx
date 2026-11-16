import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export function Footer({ minimal = false }: { minimal?: boolean }) {
  const { t } = useLanguage()

  if (minimal) {
    return (
      <footer id="contact" style={{ padding: '28px 60px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="footer-bottom" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
          <p>© 2026 Daniela's Nails. {t.footer.rights}</p>
          <Link to="/" className="footer-cta">
            {t.footer.backHome}
          </Link>
        </div>
      </footer>
    )
  }

  return (
    <footer id="contact">
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" className="logo-link">
            <svg width="160" height="65" viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg">
              <text
                x="340"
                y="155"
                textAnchor="middle"
                fontFamily="'Dancing Script', cursive"
                fontSize="160"
                fontWeight="600"
                fill="#b87a8a"
              >
                Daniela's
              </text>
              <text
                x="340"
                y="240"
                textAnchor="middle"
                fontFamily="'Cormorant Garamond', Georgia, serif"
                fontSize="80"
                fontWeight="250"
                letterSpacing="14"
                fill="#c9a0aa"
              >
                NAILS
              </text>
            </svg>
          </Link>
          <p>{t.footer.brandDesc}</p>
          <div className="footer-social">
            <a
              href="https://www.instagram.com/nailsnice060?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="13" cy="5" r="0.8" fill="currentColor" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/share/1AJrKdV7f8/?mibextid=wwXIfr"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M12 2h-2a4 4 0 00-4 4v2H4v3h2v6h3v-6h2l1-3h-3V6a1 1 0 011-1h2V2z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h5>{t.footer.navigation}</h5>
            <a href="/#servicii">{t.nav.services}</a>
            <a href="/#galerie">{t.nav.gallery}</a>
            <Link to="/programare">{t.footer.onlineBooking}</Link>
            <Link to="/autentificare">Log In / Sign Up</Link>
          </div>

          <div className="footer-col">
            <h5>{t.footer.schedule}</h5>
            <p>{t.footer.monSat}</p>
            <p>09:00 — 19:00</p>
            <p>{t.footer.sunClosed}</p>
          </div>

          <div className="footer-col">
            <h5>{t.footer.contactLocation}</h5>
            <p>{t.footer.cityCountry}</p>
            <a href="https://wa.me/33600000000" target="_blank" rel="noopener noreferrer">
              {t.footer.whatsappPhone}
            </a>
            <a href="mailto:tatarusilviu44@gmail.com">tatarusilviu44@gmail.com</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © 2026 Daniela's Nails. {t.footer.rights} ·{' '}
          <Link
            to="/privacy"
            style={{ color: 'var(--text-light)', textDecoration: 'none', fontSize: '13px' }}
          >
            {t.footer.privacy}
          </Link>
        </p>
        <Link to="/programare" className="footer-cta">
          {t.footer.bookCta}
        </Link>
      </div>
    </footer>
  )
}
