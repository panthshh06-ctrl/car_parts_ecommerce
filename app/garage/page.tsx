'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Car, Wrench, Trash2, Plus, ArrowRight } from 'lucide-react'

export default function GaragePage() {
  const [garage, setGarage] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Demo user garage fetch
    fetch('/api/vehicles')
      .then(res => res.json())
      .then(data => {
        // mock garage items from seeded demo user
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-[#090a0f] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold">Enthusiast Profile</span>
            <h1 className="text-3xl font-black text-white mt-1">MY VIRTUAL GARAGE</h1>
            <p className="text-sm text-zinc-400 mt-1">Save your vehicles to instantly check fitment across all wheels and tyres.</p>
          </div>
          <a href="/builder" className="mt-4 sm:mt-0 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30">
            <Plus className="w-4 h-4" /> Add Vehicle to Garage
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#12141c] border border-zinc-800/80 rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">Primary Vehicle</span>
              <button className="text-zinc-500 hover:text-rose-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">2024 BMW 330i M-Sport</h3>
              <p className="text-xs text-zinc-400 mt-1">G20 Generation • 2.0L Turbo I4 • RWD • Bolt Pattern: 5x112</p>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-[#1a1d28] p-4 rounded-2xl border border-zinc-800 text-xs">
              <div><strong className="text-zinc-400">OEM Wheels:</strong> 18&quot; × 8.0&quot;</div>
              <div><strong className="text-zinc-400">OEM Tyres:</strong> 225/45R18</div>
              <div><strong className="text-zinc-400">Centre Bore:</strong> 66.6 mm</div>
              <div><strong className="text-zinc-400">Offset Range:</strong> +25 to +42</div>
            </div>

            <div className="pt-2 flex gap-3">
              <a href="/builder" className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider text-center transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2">
                Build Package <ArrowRight className="w-4 h-4" />
              </a>
              <a href="/wheels" className="px-6 py-3 rounded-xl bg-[#1a1d28] hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider text-center transition-colors border border-zinc-700">
                Shop Compatible Wheels
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
