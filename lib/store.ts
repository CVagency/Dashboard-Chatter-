'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Chatter, Performance, QualiteEval, PrimeSanction } from './types'

interface Store {
  chatters: Chatter[]
  performances: Performance[]
  qualites: QualiteEval[]
  primes: PrimeSanction[]
  nextId: number
  addChatter: (c: Omit<Chatter, 'id'>) => void
  removeChatter: (id: number) => void
  savePerformance: (p: Omit<Performance, 'id'>) => void
  saveQualite: (q: Omit<QualiteEval, 'id'>) => void
  addPrime: (p: Omit<PrimeSanction, 'id'>) => void
  removePrime: (id: string) => void
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      chatters: [
        { id: 1, name: 'Cédric', platforms: 'Reveal + Inflow', revealPct: 25, inflowPct: 25 },
        { id: 2, name: 'Mahery', platforms: 'Reveal + Inflow', revealPct: 30, inflowPct: 30 },
      ],
      performances: [
        { id: 'p1', chatterId: 1, month: '4-2026', revealCA: 1685.15, revealPct: 25, inflowCA: 800, inflowPct: 25, eurUsd: 0.92 },
        { id: 'p2', chatterId: 2, month: '4-2026', revealCA: 2100, revealPct: 30, inflowCA: 1200, inflowPct: 30, eurUsd: 0.92 },
      ],
      qualites: [],
      primes: [],
      nextId: 3,
      addChatter: (c) => set((s) => ({
        chatters: [...s.chatters, { ...c, id: s.nextId }],
        nextId: s.nextId + 1,
      })),
      removeChatter: (id) => set((s) => ({ chatters: s.chatters.filter(c => c.id !== id) })),
      savePerformance: (p) => set((s) => {
        const i = s.performances.findIndex(x => x.chatterId === p.chatterId && x.month === p.month)
        const entry = { ...p, id: `p-${Date.now()}` }
        if (i >= 0) { const arr = [...s.performances]; arr[i] = entry; return { performances: arr } }
        return { performances: [...s.performances, entry] }
      }),
      saveQualite: (q) => set((s) => ({ qualites: [...s.qualites, { ...q, id: `q-${Date.now()}` }] })),
      addPrime: (p) => set((s) => ({ primes: [...s.primes, { ...p, id: `pr-${Date.now()}` }] })),
      removePrime: (id) => set((s) => ({ primes: s.primes.filter(p => p.id !== id) })),
    }),
    { name: 'cvagency-crm' }
  )
)

export function calcSalary(p: Performance) {
  const revealNet = p.revealCA * 0.82
  const revealCom = revealNet * (p.revealPct / 100)
  const inflowNet = p.inflowCA * 0.80 * p.eurUsd
  const inflowCom = inflowNet * (p.inflowPct / 100)
  return { revealNet, revealCom, inflowNet, inflowCom, total: revealCom + inflowCom }
}

export function getPrimesNet(primes: PrimeSanction[], chatterId: number | null, month: string) {
  return primes
    .filter(p => (chatterId === null || p.chatterId === chatterId) && p.month === month)
    .reduce((acc, p) => acc + (p.type === 'prime' ? p.amount : -p.amount), 0)
}

export function getLastQualScore(qualites: QualiteEval[], chatterId: number): number | null {
  const evals = qualites.filter(q => q.chatterId === chatterId)
  return evals.length === 0 ? null : evals[evals.length - 1].score
}

export const fmt = (n: number) => n.toFixed(2) + ' €'
export const fmtShort = (n: number) => Math.round(n).toLocaleString('fr-FR') + ' €'
export const initials = (name: string) => name.slice(0, 2).toUpperCase()
export const avatarColor = (id: number) => {
  const colors = ['bg-blue-100 text-blue-700', 'bg-teal-100 text-teal-700', 'bg-orange-100 text-orange-700', 'bg-purple-100 text-purple-700']
  return colors[(id - 1) % colors.length]
}
