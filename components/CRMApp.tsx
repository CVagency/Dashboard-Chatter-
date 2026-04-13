'use client'
import { useState } from 'react'
import Dashboard from './Dashboard'
import Chatters from './Chatters'
import Performance from './Performance'
import Primes from './Primes'
import AddChatterModal from './AddChatterModal'

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'chatters', label: 'Chatters' },
  { id: 'performance', label: 'Performance' },
  { id: 'primes', label: 'Primes & sanctions' },
]

export default function CRMApp() {
  const [tab, setTab] = useState('dashboard')
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-base font-semibold">CRM Chatter</div>
            <div className="text-xs text-gray-400 mt-0.5">CVagency</div>
          </div>
          <button onClick={() => setShowModal(true)} className="text-xs font-medium bg-gray-900 text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            + Ajouter chatter
          </button>
        </div>
      </div>
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="max-w-5xl mx-auto flex">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-6">
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'chatters' && <Chatters />}
        {tab === 'performance' && <Performance />}
        {tab === 'primes' && <Primes />}
      </div>
      {showModal && <AddChatterModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
