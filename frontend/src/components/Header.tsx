import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage, type Lang } from '../context/LanguageContext'

const LANGS: { code: Lang; label: string; full: string }[] = [
  { code: 'ro', label: 'RO', full: 'Română' },
  { code: 'fr', label: 'FR', full: 'Français' },
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'ru', label: 'RU', full: 'Русский' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const { user, logout } = useAuth()
  const { lang, setLang, t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const closeMobile = () => setMobileOpen(false)

  const handleSectionClick = (hash: string) => {
    closeMobile()
    const el = document.querySelector(hash)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else if (location.pathname !== '/') {
      navigate('/' + hash)
    }
  }

  return (
    <>
      <header id="header" className={scrolled ? 'scrolled' : ''}>
        <Link to="/" className="logo-link" onClick={closeMobile}>
          <svg className="header-logo-svg" viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg">
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

        <nav>
          {location.pathname !== '/' && <Link to="/">{t.nav.home}</Link>}
          <button type="button" className="nav-link-btn" onClick={() => handleSectionClick('#servicii')}>
            {t.nav.services}
          </button>
          <button type="button" className="nav-link-btn" onClick={() => handleSectionClick('#galerie')}>
            {t.nav.gallery}
          </button>
          <button type="button" className="nav-link-btn" onClick={() => handleSectionClick('#contact')}>
            {t.nav.contact}
          </button>

          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link
                  to="/admin"
                  className="nav-user-pill"
                  style={{ background: '#1a1a1a', color: '#fff', borderColor: '#1a1a1a' }}
                >
                  <span>{t.nav.adminPanel}</span>
                </Link>
              ) : (
                <Link to="/contul-meu" className="nav-user-pill">
                  <span>{t.nav.myAccount}</span>
                </Link>
              )}
              <button
                type="button"
                className="nav-link-btn"
                onClick={() => {
                  logout()
                  navigate('/')
                }}
              >
                {t.nav.logout}
              </button>
            </>
          ) : (
            <Link to="/autentificare">{t.nav.login}</Link>
          )}

          {/* LANGUAGE DROPDOWN BUTTON */}
          <div ref={dropdownRef} style={{ position: 'relative', flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen((prev) => !prev)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'white',
                border: '1px solid var(--border-mid)',
                borderRadius: '8px',
                padding: '7px 12px',
                fontSize: '12.5px',
                fontWeight: 500,
                color: 'var(--text)',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{lang.toUpperCase()}</span>
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                style={{
                  transform: langDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {langDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  background: 'white',
                  border: '1px solid var(--border-mid)',
                  borderRadius: '10px',
                  boxShadow: 'var(--shadow-md)',
                  padding: '6px',
                  minWidth: '130px',
                  zIndex: 600,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}
              >
                {LANGS.map((item) => {
                  const isActive = lang === item.code
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        setLang(item.code)
                        setLangDropdownOpen(false)
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '8px 12px',
                        border: 'none',
                        borderRadius: '6px',
                        background: isActive ? 'var(--roz-pale)' : 'transparent',
                        color: isActive ? 'var(--roz)' : 'var(--text)',
                        fontSize: '13px',
                        fontWeight: isActive ? 500 : 400,
                        fontFamily: "'DM Sans', sans-serif",
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <span>{item.full}</span>
                      <span style={{ fontSize: '11px', opacity: 0.75 }}>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {location.pathname !== '/programare' && (
            <Link to="/programare" className="nav-cta">
              <span>{t.nav.book}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 7h10M8 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          )}
        </nav>

        <button
          className="menu-toggle"
          id="menuToggle"
          aria-label="Meniu"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <span
            style={{
              transform: mobileOpen ? 'rotate(45deg) translate(4px, 4px)' : '',
            }}
          ></span>
          <span
            style={{
              transform: mobileOpen ? 'rotate(-45deg) translate(4px, -4px)' : '',
            }}
          ></span>
        </button>
      </header>

      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`} id="mobileMenu">
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '14px 24px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--cream)',
          }}
        >
          {LANGS.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => {
                setLang(item.code)
                closeMobile()
              }}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-mid)',
                fontSize: '12px',
                fontWeight: 500,
                background: lang === item.code ? 'var(--roz)' : 'white',
                color: lang === item.code ? 'white' : 'var(--text)',
                textAlign: 'center',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {location.pathname !== '/' && (
          <Link to="/" onClick={closeMobile}>
            {t.nav.home}
          </Link>
        )}
        <button type="button" onClick={() => handleSectionClick('#servicii')}>
          {t.nav.services}
        </button>
        <button type="button" onClick={() => handleSectionClick('#galerie')}>
          {t.nav.gallery}
        </button>
        <button type="button" onClick={() => handleSectionClick('#contact')}>
          {t.nav.contact}
        </button>
        {user ? (
          <>
            {user.role === 'admin' ? (
              <Link to="/admin" onClick={closeMobile}>
                {t.nav.adminPanel}
              </Link>
            ) : (
              <Link to="/contul-meu" onClick={closeMobile}>
                {t.nav.myAccount}
              </Link>
            )}
            <button
              type="button"
              onClick={() => {
                logout()
                closeMobile()
                navigate('/')
              }}
            >
              {t.nav.logout}
            </button>
          </>
        ) : (
          <Link to="/autentificare" onClick={closeMobile}>
            Log In / Sign Up
          </Link>
        )}
        <Link to="/programare" className="mobile-cta" onClick={closeMobile}>
          {t.nav.bookNow}
        </Link>
      </div>
    </>
  )
}
