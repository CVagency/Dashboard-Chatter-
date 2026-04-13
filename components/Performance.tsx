'use client'
import { useState, useEffect } from 'react'
import { useStore, calcSalary, fmt } from '@/lib/store'
import { QUALITE_CRITERES, MONTHS, WEEKS } from '@/lib/types'
import { Check, X } from 'lucide-react'
import type { Performance as PerfType } from '@/lib/types'

export default function Performance() {
  const { chatters, savePerformance, saveQualite } = useStore()
  const [pc, setPc] = useState('')
  const [pm, setPm] = useState('4-2026')
  const [rCA, setRCA] = useState('')
  const [rPct, setRPct] = useState('')
  const [iCA, setICA] = useState('')
  const [iPct, setIPct] = useState('')
  const [eur, setEur] = useState('0.92')
  const [perfSaved, setPerfSaved] = useState(false)
  const [qc, setQc] = useState('')
  const [qw, setQw] = useState('S15')
  const [checks, setChecks] = useState<Record<string, boolean | null>>({})
  const [qualSaved, setQualSaved] = useState(false)

  useEffect(() => {
    if (chatters.length > 0) { setPc(String(chatters[0].id)); setQc(String(chatters[0].id)) }
  }, [chatters])

  useEffect(() => {
    const c = chatters.find(c => c.id === parseInt(pc))
    if (c) { setRPct(String(c.revealPct)); setIPct(String(c.inflowPct)) }
  }, [pc, chatters])

  const preview = (() => {
    const p: PerfType = { id: '', chatterId: 0, month: '', revealCA: parseFloat(rCA) || 0, revealPct: parseFloat(rPct) || 0, inflowCA: parseFloat(iCA) || 0, inflowPct: parseFloat(iPct) || 0, eurUsd: parseFloat(eur) || 0.92 }
    if (p.revealCA === 0 && p.inflowCA === 0) return null
    return calcSalary(p)
  })()

  const qualScore = QUALITE_CRITERES.reduce((acc, c) => acc + (checks[c.id] === true ? c.weight : 0), 0)

  return (
    <div className="space-y-5">
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Saisir données du mois</div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Chatter</label>
            <select value={pc} onChange={e => setPc(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
              {chatters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Mois</label>
            <select value={pm} onChange={e => setPm(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
              {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
        </div>
        <div className="text-xs font-semibold text-gray-400 mb-2">Reveal <span className="font-normal">(TVA déjà déduite)</span></div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">CA Reveal (€)</label>
            <input type="number" value={rCA} onChange={e => setRCA(e.target.value)} placeholder="1685.15" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">% commission</label>
            <input type="number" value={rPct} onChange={e => setRPct(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none" />
          </div>
        </div>
        <div className="text-xs font-semibold text-gray-400 mb-2">Inflow / OnlyFans <span className="font-normal">(montant brut $)</span></div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">CA Inflow ($)</label>
            <input type="number" value={iCA} onChange={e => setICA(e.target.value)} placeholder="800" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">% commission</label>
            <input type="number" value={iPct} onChange={e => setIPct(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Taux EUR/USD</label>
            <input type="number" value={eur} onChange={e => setEur(e.target.value)} step="0.001" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none" />
          </div>
        </div>
        {preview && (
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Aperçu du calcul</div>
            <div className="space-y-1.5">
              {[['Reveal net (−18%)', fmt(preview.revealNet)], ['Commission Reveal', fmt(preview.revealCom)], ['Inflow net (−20%) en €', fmt(preview.inflowNet)], ['Commission Inflow', fmt(preview.inflowCom)]].map(([l, v]) => (
                <div key={l} className="flex justify-between text-sm"><span className="text-gray-400">{l}</span><span>{v}</span></div>
              ))}
              <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-200">
                <span>Salaire total</span><span className="text-blue-600">{fmt(preview.total)}</span>
              </div>
            </div>
          </div>
        )}
        <button onClick={() => {
          if (!pc) return
          savePerformance({ chatterId: parseInt(pc), month: pm, revealCA: parseFloat(rCA) || 0, revealPct: parseFloat(rPct) || 0, inflowCA: parseFloat(iCA) || 0, inflowPct: parseFloat(iPct) || 0, eurUsd: parseFloat(eur) || 0.92 })
          setPerfSaved(true); setTimeout(() => setPerfSaved(false), 2000)
          setRCA(''); setICA('')
        }} className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${perfSaved ? 'bg-green-600 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
          {perfSaved ? '✓ Enregistré' : 'Enregistrer'}
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Évaluation qualité</div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Chatter</label>
            <select value={qc} onChange={e => setQc(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
              {chatters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Semaine</label>
            <select value={qw} onChange={e => setQw(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
              {WEEKS.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
            </select>
          </div>
        </div>
        <div className="space-y-1 mb-4">
          {QUALITE_CRITERES.map(c => (
            <div key={c.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <div>
                <div className="text-sm">{c.label}</div>
                <div className="text-xs text-gray-400">{c.weight} pts</div>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => setChecks(p => ({ ...p, [c.id]: true }))}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${checks[c.id] === true ? 'bg-green-100 text-green-700' : 'border border-gray-200 text-gray-300 hover:text-gray-500'}`}>
                  <Check size={14} />
                </button>
                <button onClick={() => setChecks(p => ({ ...p, [c.id]: false }))}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${checks[c.id] === false ? 'bg-red-100 text-red-600' : 'border border-gray-200 text-gray-300 hover:text-gray-500'}`}>
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1.5">
            <div className={`h-full rounded-full transition-all duration-300 ${qualScore >= 80 ? 'bg-green-500' : qualScore >= 50 ? 'bg-amber-500' : 'bg-red-400'}`} style={{ width: `${qualScore}%` }} />
          </div>
          <div className="text-xs text-gray-400">Score : <span className="font-semibold text-gray-700">{qualScore}/100</span></div>
        </div>
        <button onClick={() => {
          if (!qc) return
          saveQualite({ chatterId: parseInt(qc), week: qw, score: qualScore })
          setChecks({}); setQualSaved(true); setTimeout(() => setQualSaved(false), 2000)
        }} className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${qualSaved ? 'bg-green-600 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
          {qualSaved ? '✓ Enregistré' : 'Enregistrer évaluation'}
        </button>
      </div>
    </div>
  )
}
