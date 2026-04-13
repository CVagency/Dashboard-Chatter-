'use client'
import { useState } from 'react'
import { useStore, calcSalary, getPrimesNet, getLastQualScore, fmt, avatarColor, initials } from '@/lib/store'
import { ChevronRight, ArrowLeft, Trash2 } from 'lucide-react'
import { MONTH_NAMES } from '@/lib/types'

export default function Chatters() {
  const [selected, setSelected] = useState<number | null>(null)
  const { chatters, performances, primes, qualites, removeChatter } = useStore()

  if (selected !== null) {
    const c = chatters.find(c => c.id === selected)
    if (!c) { setSelected(null); return null }
    const perfs = performances.filter(p => p.chatterId === c.id)
    return (
      <div>
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-5">
          <ArrowLeft size={14} /> Retour
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold ${avatarColor(c.id)}`}>{initials(c.name)}</div>
          <div>
            <div className="text-lg font-semibold">{c.name}</div>
            <div className="text-sm text-gray-400">{c.platforms} · Reveal {c.revealPct}% / Inflow {c.inflowPct}%</div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Commissions par mois</div>
          {perfs.length === 0 ? <div className="text-sm text-gray-400">Aucune donnée</div> : perfs.map(p => {
            const s = calcSalary(p)
            const pm = getPrimesNet(primes, c.id, p.month)
            return (
              <div key={p.id} className="mb-5 pb-5 border-b border-gray-50 last:border-0">
                <div className="text-xs font-semibold text-gray-500 mb-3">{MONTH_NAMES[p.month] || p.month}</div>
                <div className="space-y-1.5">
                  {[
                    ['CA Reveal', fmt(p.revealCA)],
                    ['Reveal net (−18%)', fmt(s.revealNet)],
                    [`Commission Reveal (${p.revealPct}%)`, fmt(s.revealCom)],
                    ['Inflow net OF (−20%) en €', fmt(s.inflowNet)],
                    [`Commission Inflow (${p.inflowPct}%)`, fmt(s.inflowCom)],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-gray-400">{label}</span><span>{val}</span>
                    </div>
                  ))}
                  {pm !== 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Primes / sanctions</span>
                      <span className={pm > 0 ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>{pm > 0 ? '+' : ''}{fmt(pm)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-100">
                    <span>Total à verser</span>
                    <span className="text-blue-600">{fmt(s.total + pm)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <button onClick={() => { removeChatter(c.id); setSelected(null) }} className="mt-4 flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600">
          <Trash2 size={12} /> Supprimer ce chatter
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Équipe active</div>
      {chatters.length === 0 ? (
        <div className="text-sm text-gray-400 py-4 text-center">Aucun chatter</div>
      ) : chatters.map(c => {
        const perf = performances.find(p => p.chatterId === c.id && p.month === '4-2026')
        const salary = perf ? fmt(calcSalary(perf).total) : '—'
        const qs = getLastQualScore(qualites, c.id)
        return (
          <div key={c.id} onClick={() => setSelected(c.id)}
            className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded-lg">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${avatarColor(c.id)}`}>{initials(c.name)}</div>
            <div className="flex-1">
              <div className="text-sm font-medium">{c.name}</div>
              <div className="text-xs text-gray-400">{c.platforms} · {c.revealPct}% / {c.inflowPct}%</div>
              {qs !== null && (
                <span className={`mt-1 inline-block text-xs font-medium px-2 py-0.5 rounded-md ${qs >= 80 ? 'bg-green-50 text-green-700' : qs >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                  Qualité {qs}/100
                </span>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-semibold">{salary}</div>
              <div className="text-xs text-gray-400">avr. 2026</div>
            </div>
            <ChevronRight size={14} className="text-gray-300" />
          </div>
        )
      })}
    </div>
  )
}
