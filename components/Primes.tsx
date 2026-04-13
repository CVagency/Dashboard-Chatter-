'use client'
import { useState, useEffect } from 'react'
import { useStore, fmt } from '@/lib/store'
import { MONTHS, MONTH_NAMES } from '@/lib/types'
import { Trash2 } from 'lucide-react'

export default function Primes() {
  const { chatters, primes, addPrime, removePrime } = useStore()
  const [chatter, setChatter] = useState('')
  const [type, setType] = useState<'prime' | 'sanction'>('prime')
  const [amount, setAmount] = useState('')
  const [month, setMonth] = useState('4-2026')
  const [reason, setReason] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => { if (chatters.length > 0) setChatter(String(chatters[0].id)) }, [chatters])

  return (
    <div className="space-y-5">
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Ajouter prime / sanction</div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Chatter</label>
            <select value={chatter} onChange={e => setChatter(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
              {chatters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Type</label>
            <select value={type} onChange={e => setType(e.target.value as 'prime' | 'sanction')} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
              <option value="prime">Prime</option>
              <option value="sanction">Sanction</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Montant (€)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="50" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Mois impacté</label>
            <select value={month} onChange={e => setMonth(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
              {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-1.5 font-medium">Motif</label>
          <input type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="ex: Excellent taux de déblocage" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none" />
        </div>
        <button onClick={() => {
          if (!chatter || !amount || !reason) return
          addPrime({ chatterId: parseInt(chatter), type, amount: parseFloat(amount), month, reason, date: new Date().toLocaleDateString('fr-FR') })
          setAmount(''); setReason(''); setSaved(true); setTimeout(() => setSaved(false), 2000)
        }} className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${saved ? 'bg-green-600 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
          {saved ? '✓ Ajouté' : 'Ajouter'}
        </button>
      </div>
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Historique</div>
        {primes.length === 0 ? <div className="text-sm text-gray-400 py-4 text-center">Aucun enregistrement</div>
          : [...primes].reverse().map(p => {
            const c = chatters.find(c => c.id === p.chatterId)
            return (
              <div key={p.id} className="flex items-start justify-between py-3 border-b border-gray-50 last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{c?.name || '?'}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${p.type === 'prime' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {p.type === 'prime' ? '+' : '−'}{fmt(p.amount)}
                    </span>
                    <span className="text-xs text-gray-400">{MONTH_NAMES[p.month] || p.month}</span>
                  </div>
                  <div className="text-xs text-gray-400">{p.reason}</div>
                </div>
                <div className="flex items-center gap-3 ml-3">
                  <span className="text-xs text-gray-300">{p.date}</span>
                  <button onClick={() => removePrime(p.id)} className="text-gray-200 hover:text-red-400"><Trash2 size={12} /></button>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
