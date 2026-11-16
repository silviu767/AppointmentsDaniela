import { createContext, useContext, useState, type ReactNode } from 'react'
import {
  type Lang,
  LOCALE_MAP,
  translations,
  translateServiceName,
  translateServiceDesc,
  translateCategory,
} from '../locales/serviceTranslator'

export {
  type Lang,
  LOCALE_MAP,
  translations,
  translateServiceName,
  translateServiceDesc,
  translateCategory,
}

interface LanguageContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: (typeof translations)['ro']
  locale: string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const LANG_STORAGE_KEY = 'dn_site_lang'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY)
    if (saved === 'ro' || saved === 'fr' || saved === 'en' || saved === 'ru') {
      return saved
    }
    return 'ro'
  })

  const setLang = (l: Lang) => {
    localStorage.setItem(LANG_STORAGE_KEY, l)
    setLangState(l)
  }

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        t: translations[lang],
        locale: LOCALE_MAP[lang],
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
