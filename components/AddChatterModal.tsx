'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { X } from 'lucide-react'

export default function AddChatterModal({ onClose }: { onClose: () => void }) {
  const { addChatter } = useStore()
  const [name, setName] = useState('')
  const [platforms, setPlatforms] = useState<'Reveal + Inflow' | 'Reveal only' | 'Inflow only'>('Reveal + Inflow')
  const [rPct, setRPct] = useState('25')
  const [iPct, setIPct] = useState('25')

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div className="text-base font-semibold">Nouveau chatter</div>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-600"><X size={16} /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Nom</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ex: Cédric" autoFocus onKeyDown={e => { if (e.key === 'Enter' && name.trim()) { addChatter({ name: name.trim(), platforms, revealPct: parseFloat(rPct) || 25, inflowPct: parseFloat(iPct) || 25 }); onClose() } }}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Plateformes</label>
            <select value={platforms} onChange={e => setPlatforms(e.target.value as typeof platforms)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
              <option value="Reveal + Inflow">Reveal + Inflow</option>
              <option value="Reveal only">Reveal uniquement</option>
              <option value="Inflow only">Inflow uniquement</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">% Reveal</label>
              <input type="number" value={rPct} onChange={e => setRPct(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">% Inflow</label>
              <input type="number" value={iPct} onChange={e => setIPct(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none" />
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={() => { if (!name.trim()) return; addChatter({ name: name.trim(), platforms, revealPct: parseFloat(rPct) || 25, inflowPct: parseFloat(iPct) || 25 }); onClose() }}
            className="flex-1 text-sm font-medium bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800">Ajouter</button>
          <button onClick={onClose} className="flex-1 text-sm font-medium border border-gray-200 py-2.5 rounded-lg hover:bg-gray-50">Annuler</button>
        </div>
      </div>
    </div>
  )
}
