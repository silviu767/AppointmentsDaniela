import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { user, loading: authLoading, login, register } = useAuth()
  const { t } = useLanguage()
  const a = t.auth
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/contul-meu', { replace: true })
      }
    }
  }, [authLoading, user, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'login') {
        const u = await login(email.trim(), password)
        if (u.role === 'admin') {
          navigate('/admin', { replace: true })
        } else {
          navigate('/contul-meu', { replace: true })
        }
      } else {
        if (!firstName.trim() || !lastName.trim()) {
          throw new Error(a.errName)
        }
        if (password.length < 8) {
          throw new Error(a.errPass)
        }
        const u = await register({
          email: email.trim(),
          password,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim() || undefined,
        })
        if (u.role === 'admin') {
          navigate('/admin', { replace: true })
        } else {
          navigate('/contul-meu', { replace: true })
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="booking-page">
      <Header />

      <main className="pg-wrap" style={{ maxWidth: '520px' }}>
        <div className="pg-hero">
          <div className="pg-eyebrow">
            <span className="eyebrow-line"></span>
            <span>{a.eyebrow}</span>
          </div>
          <h1 className="pg-titlu">
            {mode === 'login' ? (
              <>
                {a.welcomeBack1}
                <br />
                <em>{a.welcomeBack2}</em>
              </>
            ) : (
              <>
                {a.createAccount1}
                <br />
                <em>{a.createAccount2}</em>
              </>
            )}
          </h1>
          <p className="pg-sub">{a.subtitle}</p>
        </div>

        <div className="pg-card">
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '28px',
              background: 'var(--cream)',
              padding: '6px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode('login')
                setError(null)
              }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13.5px',
                fontWeight: 500,
                background: mode === 'login' ? 'var(--roz)' : 'transparent',
                color: mode === 'login' ? 'white' : 'var(--text-mid)',
                transition: 'all 0.2s',
              }}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register')
                setError(null)
              }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13.5px',
                fontWeight: 500,
                background: mode === 'register' ? 'var(--roz)' : 'transparent',
                color: mode === 'register' ? 'white' : 'var(--text-mid)',
                transition: 'all 0.2s',
              }}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div
              style={{
                background: 'var(--red-pale)',
                border: '1px solid var(--red-border)',
                color: 'var(--red)',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '13.5px',
                marginBottom: '20px',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-camp">
                    <label>{a.firstName}</label>
                    <input
                      type="text"
                      required
                      placeholder={t.booking.firstNamePlaceholder}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="form-camp">
                    <label>{a.lastName}</label>
                    <input
                      type="text"
                      required
                      placeholder={t.booking.lastNamePlaceholder}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-camp">
                  <label>{a.phoneOptional}</label>
                  <input
                    type="tel"
                    placeholder={t.booking.phonePlaceholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="form-camp">
              <label>{a.email}</label>
              <input
                type="email"
                required
                placeholder={t.booking.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-camp">
              <label>
                {a.password} {mode === 'register' ? a.min8Chars : ''}
              </label>
              <input
                type="password"
                required
                minLength={mode === 'register' ? 8 : 1}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-confirma" disabled={loading}>
              {loading ? a.processing : mode === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          </form>
        </div>
      </main>

      <Footer minimal />
    </div>
  )
}
