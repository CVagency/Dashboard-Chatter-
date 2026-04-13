'use client'
import { useState } from 'react'
import { useStore, calcSalary, getPrimesNet, getLastQualScore, fmtShort, fmt, avatarColor, initials } from '@/lib/store'
import { MONTHS, MONTH_NAMES } from '@/lib/types'

export default function Dashboard() {
  const [month, setMonth] = useState('4-2026')
  const { chatters, performances, primes, qualites } = useStore()
  const perfs = performances.filter(p => p.month === month)
  const totalCA = perfs.reduce((acc, p) => acc + p.revealCA + p.inflowCA * p.eurUsd, 0)
  const totalSalaires = perfs.reduce((acc, p) => acc + calcSalary(p).total, 0)
  const primesNet = getPrimesNet(primes, null, month)
  const ranked = [...perfs].sort((a, b) => calcSalary(b).total - calcSalary(a).total)

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <span className="text-sm text-gray-500">Période</span>
        <select value={month} onChange={e => setMonth(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none">
          {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'CA total agence', value: fmtShort(totalCA), sub: 'Reveal + Inflow' },
          { label: 'Salaires à verser', value: fmtShort(totalSalaires), sub: `${perfs.length} chatter(s)` },
          { label: 'Chatters actifs', value: String(chatters.length), sub: 'total' },
          { label: 'Primes nettes', value: fmtShort(primesNet), sub: 'ce mois' },
        ].map(m => (
          <div key={m.label} className="bg-white border border-gray-100 rounded-xl p-4">
            <div className="text-xs text-gray-400 mb-1">{m.label}</div>
            <div className="text-xl font-semibold">{m.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Classement — {MONTH_NAMES[month]}</div>
        {ranked.length === 0 ? (
          <div className="text-sm text-gray-400 py-4 text-center">Aucune donnée pour ce mois</div>
        ) : ranked.map((p, i) => {
          const c = chatters.find(c => c.id === p.chatterId)
          if (!c) return null
          const s = calcSalary(p)
          const qs = getLastQualScore(qualites, c.id)
          const pm = getPrimesNet(primes, c.id, month)
          return (
            <div key={p.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
              <span className="text-sm font-medium text-gray-300 w-5">{i + 1}</span>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${avatarColor(c.id)}`}>{initials(c.name)}</div>
              <div className="flex-1">
                <div className="text-sm font-medium">{c.name}</div>
                <div className="text-xs text-gray-400">{c.platforms}</div>
              </div>
              <div className="text-right">
                {qs !== null && (
                  <div className={`text-xs font-medium px-2 py-0.5 rounded-md mb-1 inline-block ${qs >= 80 ? 'bg-green-50 text-green-700' : qs >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>{qs}/100</div>
                )}
                <div className="text-sm font-semibold">{fmt(s.total + pm)}</div>
                <div className="text-xs text-gray-400">commission</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
