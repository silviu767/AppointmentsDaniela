import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { useLanguage } from '../context/LanguageContext'

export function PrivacyPage() {
  const { t } = useLanguage()
  const p = t.privacy

  return (
    <div className="privacy-page">
      <Header />

      <main className="privacy-wrap">
        <div className="privacy-hero">
          <div className="privacy-eyebrow">
            <span className="line"></span>
            <span>{p.eyebrow}</span>
          </div>
          <h1>
            {p.titleLine1}
            <br />
            <em>{p.titleLine2}</em>
          </h1>
          <p className="privacy-date">{p.updated}</p>
        </div>

        <div className="privacy-content">
          <h2>{p.s1Title}</h2>
          <p>{p.s1Text}</p>
          <div className="privacy-highlight">
            <strong>{p.dpoLabel}</strong> Daniela Stavinschi
            <br />
            <strong>Email:</strong>{' '}
            <a href="mailto:tatarusilviu44@gmail.com">tatarusilviu44@gmail.com</a>
          </div>

          <h2>{p.s2Title}</h2>
          <p>{p.s2Intro}</p>
          <ul>
            <li>{p.s2Item1}</li>
            <li>{p.s2Item2}</li>
            <li>{p.s2Item3}</li>
          </ul>
          <p>{p.s2Outro}</p>

          <h2>{p.s3Title}</h2>
          <p>{p.s3Intro}</p>
          <ul>
            <li>{p.s3Item1}</li>
            <li>{p.s3Item2}</li>
            <li>{p.s3Item3}</li>
          </ul>

          <h2>{p.s4Title}</h2>
          <p>{p.s4Text}</p>

          <h2>{p.s5Title}</h2>
          <p>{p.s5Text1}</p>
          <p>{p.s5Text2}</p>

          <h2>{p.s6Title}</h2>
          <p>{p.s6Text}</p>

          <h2>{p.s7Title}</h2>
          <p>{p.s7Intro}</p>
          <ul>
            {p.s7Items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h2>{p.s8Title}</h2>
          <p>{p.s8Intro}</p>
          <ul>
            {p.s8Items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h2>{p.s9Title}</h2>
          <p>{p.s9Intro}</p>
          <div className="privacy-contact-box">
            <strong>Daniela Stavinschi — Daniela's Nails</strong>
            <a href="mailto:tatarusilviu44@gmail.com">tatarusilviu44@gmail.com</a>
          </div>
        </div>

        <Link to="/" className="back-btn">
          {p.backSite}
        </Link>
      </main>

      <Footer minimal />
    </div>
  )
}
