'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Search, CheckCircle2, ShoppingCart, Wrench } from 'lucide-react'

export default function TyresPage() {
  const [tyres, setTyres] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [season, setSeason] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTyres()
  }, [search, category, season])

  const fetchTyres = () => {
    setLoading(true)
    let url = '/api/tyres?'
    if (search) url += `search=${encodeURIComponent(search)}&`
    if (category) url += `category=${encodeURIComponent(category)}&`
    if (season) url += `season=${encodeURIComponent(season)}&`

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setTyres(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  const addToCart = (variant: any) => {
    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'TYRE_SET', tyreVariantId: variant.id, quantity: 4 })
    })
      .then(res => res.json())
      .then(data => alert('Added set of 4 tyres to cart!'))
      .catch(err => console.error(err))
  }

  return (
    <div className="min-h-screen bg-[#090a0f] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold">Catalog</span>
          <h1 className="text-3xl font-black text-white mt-1">PERFORMANCE TYRES</h1>
          <p className="text-sm text-zinc-400 mt-1">Explore maximum grip summer, track, and all-season tyres engineered for precise handling.</p>
        </div>

        {/* Filters Bar */}
        <div className="bg-[#12141c] border border-zinc-800/80 rounded-2xl p-4 sm:p-6 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search brand, model (e.g. Pilot Sport)..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#1a1d28] border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-4 w-full sm:w-auto">
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)}
              className="bg-[#1a1d28] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">All Categories</option>
              <option value="Performance">Performance</option>
              <option value="Track/Competition">Track / Competition</option>
              <option value="Touring">Touring</option>
            </select>

            <select 
              value={season} 
              onChange={e => setSeason(e.target.value)}
              className="bg-[#1a1d28] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">All Seasons</option>
              <option value="Summer">Summer</option>
              <option value="All-Season">All-Season</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-24 text-zinc-500">Loading tyre database...</div>
        ) : tyres.length === 0 ? (
          <div className="text-center py-24 text-zinc-500">No tyres match your filters.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tyres.map(tyre => {
              const variant = tyre.variants[0] || {}
              return (
                <div key={tyre.id} className="bg-[#12141c] border border-zinc-800/80 rounded-2xl overflow-hidden group flex flex-col justify-between">
                  <div>
                    <div className="relative h-60 bg-zinc-900 overflow-hidden">
                      <img src={tyre.imageUrl} alt={tyre.modelName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-white">
                        {tyre.brand.name}
                      </span>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-400 font-semibold uppercase">{tyre.category}</span>
                        <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {tyre.season}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white">{tyre.brand.name} {tyre.modelName}</h3>
                      <p className="text-xs text-zinc-400 line-clamp-2">{tyre.description}</p>

                      <div className="bg-[#1a1d28] p-3 rounded-xl border border-zinc-800/80 grid grid-cols-2 gap-2 text-xs">
                        <div><strong className="text-zinc-400">Size:</strong> {variant.width}/{variant.aspectRatio} R{variant.rimDiameter}</div>
                        <div><strong className="text-zinc-400">Rating:</strong> {variant.loadIndex}{variant.speedRating}</div>
                        <div><strong className="text-zinc-400">Wet Grip:</strong> {variant.wetGrip}</div>
                        <div><strong className="text-zinc-400">Dry Score:</strong> {variant.dryPerformance}/10</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex items-center justify-between border-t border-zinc-800/80 mt-4">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase block">Set of 4 Price</span>
                      <span className="text-xl font-bold text-white">₹{(variant.price * 4).toLocaleString()}</span>
                    </div>
                    <button onClick={() => addToCart(variant)} className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" /> Add Set
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
