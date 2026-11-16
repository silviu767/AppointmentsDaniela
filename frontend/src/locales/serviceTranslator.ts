import { ro } from './ro'
import { fr } from './fr'
import { en } from './en'
import { ru } from './ru'

export type Lang = 'ro' | 'fr' | 'en' | 'ru'

export const LOCALE_MAP: Record<Lang, string> = {
  ro: 'ro-RO',
  fr: 'fr-FR',
  en: 'en-US',
  ru: 'ru-RU',
}

export const translations = {
  ro,
  fr,
  en,
  ru,
}

function normalizeRo(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/ă/g, 'a')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/ș/g, 's')
    .replace(/ş/g, 's')
    .replace(/ț/g, 't')
    .replace(/ţ/g, 't')
    .replace(/\s+/g, ' ')
}

const EXACT_TEXT_MAP: Record<string, Record<Lang, string>> = {
  manichiura: {
    ro: 'Manichiură',
    fr: 'Manucure',
    en: 'Manicure',
    ru: 'Маникюр',
  },
  pedichiura: {
    ro: 'Pedichiură',
    fr: 'Pédicure',
    en: 'Pedicure',
    ru: 'Педикюр',
  },
  'manichiura + pedichiura': {
    ro: 'Manichiură + Pedichiură',
    fr: 'Manucure + Pédicure',
    en: 'Manicure + Pedicure',
    ru: 'Маникюр + Педикюр',
  },
  'manichiura si pedichiura': {
    ro: 'Manichiură și Pedichiură',
    fr: 'Manucure et Pédicure',
    en: 'Manicure & Pedicure',
    ru: 'Маникюр и Педикюр',
  },
  'manichiura franceza': {
    ro: 'Manichiură franceză',
    fr: 'French manucure',
    en: 'French manicure',
    ru: 'Французский маникюр',
  },
  'manichiura ruseasca': {
    ro: 'Manichiură rusească',
    fr: 'Manucure russe',
    en: 'Russian manicure',
    ru: 'Русский аппаратный маникюр',
  },
  'pedichiura profesionalista': {
    ro: 'Pedichiură profesională',
    fr: 'Pédicure professionnelle',
    en: 'Professional pedicure',
    ru: 'Профессиональный педикюр',
  },
  'pedichiura profesionala': {
    ro: 'Pedichiură profesională',
    fr: 'Pédicure professionnelle',
    en: 'Professional pedicure',
    ru: 'Профессиональный педикюр',
  },
  'set complet dintre manichiura si pedichiura': {
    ro: 'Set complet de manichiură și pedichiură',
    fr: 'Forfait complet manucure et pédicure',
    en: 'Complete manicure and pedicure set',
    ru: 'Полный комплекс маникюра и педикюра',
  },
  'manichiura combinata': {
    ro: 'Manichiură Combinată',
    fr: 'Manucure Combinée',
    en: 'Combined Manicure',
    ru: 'Комбинированный маникюр',
  },
  'alungire unghii gel': {
    ro: 'Alungire Unghii Gel',
    fr: 'Rallongement Gel',
    en: 'Gel Nail Extensions',
    ru: 'Наращивание ногтей гелем',
  },
  'alungire unghii': {
    ro: 'Alungire Unghii',
    fr: 'Rallongement des ongles',
    en: 'Nail Extensions',
    ru: 'Наращивание ногтей',
  },
  'intretinere unghii': {
    ro: 'Întreținere Unghii',
    fr: 'Remplissage Gel',
    en: 'Nail Refill & Maintenance',
    ru: 'Коррекция ногтей',
  },
  'intretinere gel': {
    ro: 'Întreținere Gel',
    fr: 'Remplissage Gel',
    en: 'Gel Refill',
    ru: 'Коррекция геля',
  },
  'oja semipermanenta': {
    ro: 'Ojă Semipermanentă',
    fr: 'Vernis Semi-permanent',
    en: 'Gel Polish Manicure',
    ru: 'Покрытие гель-лаком',
  },
  'indepartare + manichiura': {
    ro: 'Îndepărtare + Manichiură',
    fr: 'Dépose + Manucure',
    en: 'Removal + Manicure',
    ru: 'Снятие + Маникюр',
  },
  'manichiura clasica': {
    ro: 'Manichiură Clasică',
    fr: 'Manucure Classique',
    en: 'Classic Manicure',
    ru: 'Классический маникюр',
  },
  'manichiura cu gel': {
    ro: 'Manichiură cu Gel',
    fr: 'Manucure Gel',
    en: 'Gel Manicure',
    ru: 'Гелевый маникюр',
  },
  'constructie gel': {
    ro: 'Construcție Gel',
    fr: 'Pose complète en gel',
    en: 'Full Gel Sculpting',
    ru: 'Моделирование ногтей гелем',
  },
  'ingrijire completa si relaxanta cu produse de calitate premium. include fisuire, cuticule si lac.': {
    ro: 'Îngrijire completă și relaxantă cu produse de calitate premium. Include fișuire, cuticule și lac.',
    fr: 'Soin complet et relaxant avec des produits premium. Inclut limage, soin des cuticules et vernis.',
    en: 'Complete, relaxing nail care with premium products. Includes shaping, cuticle care, and polish.',
    ru: 'Комплексный уход с материалами премиум-класса. Включает опил формы, обработку кутикулы и покрытие.',
  },
  'durabilitate si eleganta. gel de calitate superioara cu finisaj impecabil — unghii de vis.': {
    ro: 'Durabilitate și eleganță. Gel de calitate superioară cu finisaj impecabil — unghii de vis.',
    fr: 'Durabilité et élégance. Gel de qualité supérieure au fini impeccable.',
    en: 'Durability and elegance. Superior quality gel with a flawless finish.',
    ru: 'Прочность и элегантность. Гель высшего качества с безупречным покрытием.',
  },
  'mentinerea formei si aspectului unghiilor intre sesiuni. eficienta maxima, timp optim.': {
    ro: 'Menținerea formei și aspectului unghiilor între sesiuni. Eficiență maximă, timp optim.',
    fr: 'Entretien de la forme et de la tenue de vos ongles entre deux séances.',
    en: 'Maintain the shape and strength of your nails between appointments.',
    ru: 'Поддержание формы и идеального вида ногтей между процедурами.',
  },
  'culoare vibranta cu durabilitate extinsa. fara uscare indelungata, rezultat instant perfect.': {
    ro: 'Culoare vibrantă cu durabilitate extinsă. Fără uscare îndelungată, rezultat instant perfect.',
    fr: 'Couleur éclatante et tenue longue durée. Résultat impeccable immédiat.',
    en: 'Vibrant color with extended wear. Instant, flawless shine with zero drying wait.',
    ru: 'Насыщенный цвет и стойкость до нескольких недель. Идеальный результат сразу после процедуры.',
  },
  'indepartare sigura urmata de manichiura completa. tot ce ai nevoie intr-o singura vizita.': {
    ro: 'Îndepărtare sigură urmată de manichiură completă. Tot ce ai nevoie într-o singură vizită.',
    fr: 'Dépose douce suivie d’une manucure complète en une seule visite.',
    en: 'Safe product removal followed by a complete manicure in a single visit.',
    ru: 'Бережное снятие покрытия и полный гигиенический маникюр за один визит.',
  },
}

const PHRASE_REPLACEMENTS: Array<{
  pattern: RegExp
  fr: string
  en: string
  ru: string
}> = [
  { pattern: /manichiur[aă]\s+francez[aă]/gi, fr: 'French manucure', en: 'French manicure', ru: 'Французский маникюр' },
  { pattern: /manichiur[aă]\s+ruseasc[aă]/gi, fr: 'Manucure russe', en: 'Russian manicure', ru: 'Русский маникюр' },
  { pattern: /manichiur[aă]\s+combinat[aă]/gi, fr: 'Manucure combinée', en: 'Combined manicure', ru: 'Комбинированный маникюр' },
  { pattern: /manichiur[aă]\s+clasic[aă]/gi, fr: 'Manucure classique', en: 'Classic manicure', ru: 'Классический маникюр' },
  { pattern: /pedichiur[aă]\s+profesional(ist)?[aă]/gi, fr: 'Pédicure professionnelle', en: 'Professional pedicure', ru: 'Профессиональный педикюр' },
  { pattern: /set\s+complet\s+dintre/gi, fr: 'Forfait complet', en: 'Complete set of', ru: 'Полный комплекс:' },
  { pattern: /set\s+complet/gi, fr: 'Forfait complet', en: 'Complete set', ru: 'Полный комплекс' },
  { pattern: /[îi]ndep[aă]rtare/gi, fr: 'Dépose', en: 'Removal', ru: 'Снятие' },
  { pattern: /[îi]ntre[tț]inere/gi, fr: 'Remplissage', en: 'Refill', ru: 'Коррекция' },
  { pattern: /alungire\s+unghii/gi, fr: 'Rallongement des ongles', en: 'Nail extensions', ru: 'Наращивание ногтей' },
  { pattern: /alungire/gi, fr: 'Rallongement', en: 'Extensions', ru: 'Наращивание' },
  { pattern: /construc[tț]ie/gi, fr: 'Pose complète', en: 'Sculpting', ru: 'Моделирование' },
  { pattern: /oj[aă]\s+semipermanent[aă]/gi, fr: 'Vernis semi-permanent', en: 'Gel polish', ru: 'Покрытие гель-лаком' },
  { pattern: /semipermanent[aă]?/gi, fr: 'Semi-permanent', en: 'Gel polish', ru: 'Гель-лак' },
  { pattern: /manichiur[aă]/gi, fr: 'Manucure', en: 'Manicure', ru: 'Маникюр' },
  { pattern: /pedichiur[aă]/gi, fr: 'Pédicure', en: 'Pedicure', ru: 'Педикюр' },
  { pattern: /unghii/gi, fr: 'ongles', en: 'nails', ru: 'ногтей' },
  { pattern: /gel/gi, fr: 'gel', en: 'gel', ru: 'гель' },
  { pattern: /\bsi\b|\bși\b/gi, fr: 'et', en: 'and', ru: 'и' },
  { pattern: /\bcu\b/gi, fr: 'avec', en: 'with', ru: 'с' },
  { pattern: /profesional(ist)?[aă]/gi, fr: 'professionnelle', en: 'professional', ru: 'профессиональный' },
  { pattern: /francez[aă]/gi, fr: 'French', en: 'French', ru: 'французский' },
  { pattern: /ruseasc[aă]/gi, fr: 'russe', en: 'Russian', ru: 'русский' },
]

function translateDynamicText(text: string, lang: Lang): string {
  const norm = normalizeRo(text)
  if (EXACT_TEXT_MAP[norm]) {
    return EXACT_TEXT_MAP[norm][lang]
  }
  if (lang === 'ro') return text

  let result = text
  for (const item of PHRASE_REPLACEMENTS) {
    result = result.replace(item.pattern, item[lang])
  }
  return result.charAt(0).toUpperCase() + result.slice(1)
}

export function translateServiceName(name: string, lang: Lang): string {
  if (!name) return ''
  return translateDynamicText(name, lang)
}

export function translateServiceDesc(desc: string | null | undefined, lang: Lang): string | null {
  if (!desc) return null
  if (desc.trim().toLowerCase() === 'string') return null
  return translateDynamicText(desc, lang)
}

export function translateCategory(name: string, index: number, lang: Lang): string {
  const lower = normalizeRo(name)
  const cats = translations[lang].categories
  if (lower.includes('manichiur') && lower.includes('pedichiur')) {
    return cats.package
  }
  if (lower.includes('pedichiur')) {
    return cats.pedicure
  }
  if (lower.includes('alungire') || lower.includes('extension') || lower.includes('rallongement')) {
    return cats.extension
  }
  if (lower.includes('intretinere') || lower.includes('remplissage')) {
    return cats.maintenance
  }
  if (lower.includes('semipermanent') || lower.includes('semi-permanent')) {
    return cats.semipermanent
  }
  if (lower.includes('indepartare') || lower.includes('+')) {
    return cats.package
  }
  if (lower.includes('manichiur') || lower.includes('manucur')) {
    return cats.manicure
  }
  const list = [cats.manicure, cats.extension, cats.maintenance, cats.semipermanent, cats.package]
  return list[index % list.length]
}
