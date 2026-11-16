import type { Service } from '../../types'
import { useLanguage, translateServiceName } from '../../context/LanguageContext'
import { formatPrice } from './bookingUtils'

interface StepServiceSelectProps {
  services: Service[]
  loading: boolean
  onSelectService: (service: Service) => void
}

export function StepServiceSelect({
  services,
  loading,
  onSelectService,
}: StepServiceSelectProps) {
  const { lang, t } = useLanguage()
  const b = t.booking

  return (
    <div>
      <h2>{b.step1Title}</h2>
      <p className="pg-card-sub">{b.step1Sub}</p>

      {loading ? (
        <p className="loading-text">{b.loadingServices}</p>
      ) : services.length === 0 ? (
        <p className="loading-text">{b.noActiveServices}</p>
      ) : (
        <div className="servicii-list">
          {services.map((s) => (
            <div
              key={s.service_id}
              className="svc-item"
              onClick={() => onSelectService(s)}
            >
              <div className="svc-info">
                <span className="svc-nome">{translateServiceName(s.name, lang)}</span>
                <span className="svc-dur">
                  {s.duration_minutes} {t.home.minutes}
                </span>
              </div>
              <span className="svc-price">{formatPrice(s.price)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
