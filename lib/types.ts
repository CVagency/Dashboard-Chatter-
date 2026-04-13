export interface Chatter {
  id: number
  name: string
  platforms: 'Reveal + Inflow' | 'Reveal only' | 'Inflow only'
  revealPct: number
  inflowPct: number
}

export interface Performance {
  id: string
  chatterId: number
  month: string
  revealCA: number
  revealPct: number
  inflowCA: number
  inflowPct: number
  eurUsd: number
}

export interface QualiteEval {
  id: string
  chatterId: number
  week: string
  score: number
}

export interface PrimeSanction {
  id: string
  chatterId: number
  type: 'prime' | 'sanction'
  amount: number
  month: string
  reason: string
  date: string
}

export const QUALITE_CRITERES = [
  { id: 'upsell', label: 'Tentatives upsell PPV', weight: 20 },
  { id: 'reponse', label: 'Temps de réponse < 15 min', weight: 20 },
  { id: 'script', label: 'Respect du script', weight: 20 },
  { id: 'ppv', label: 'PPV envoyés (quota atteint)', weight: 20 },
  { id: 'comportement', label: 'Comportement & sérieux', weight: 20 },
]

export const MONTHS = [
  { value: '4-2026', label: 'Avril 2026' },
  { value: '3-2026', label: 'Mars 2026' },
  { value: '2-2026', label: 'Février 2026' },
  { value: '1-2026', label: 'Janvier 2026' },
]

export const WEEKS = [
  { value: 'S15', label: 'Semaine 15 (7–13 avr)' },
  { value: 'S14', label: 'Semaine 14 (31 mar–6 avr)' },
  { value: 'S13', label: 'Semaine 13 (24–30 mar)' },
]

export const MONTH_NAMES: Record<string, string> = {
  '1-2026': 'Janvier 2026', '2-2026': 'Février 2026',
  '3-2026': 'Mars 2026', '4-2026': 'Avril 2026',
}
