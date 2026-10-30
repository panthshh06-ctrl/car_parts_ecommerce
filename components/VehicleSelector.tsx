'use client'

import { useState, useEffect } from 'react'
import { Car, CheckCircle2, ShieldCheck, ChevronRight, Sliders, AlertTriangle } from 'lucide-react'

export default function VehicleSelector() {
  const [manufacturers, setManufacturers] = useState<any[]>([])
  const [selectedManufacturer, setSelectedManufacturer] = useState<any>(null)
  const [selectedModel, setSelectedModel] = useState<any>(null)
  const [selectedGeneration, setSelectedGeneration] = useState<any>(null)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [fitmentResult, setFitmentResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/vehicles')
      .then(res => res.json())
      .then(data => setManufacturers(data))
      .catch(err => console.error(err))
  }, [])

  const handleSelectManufacturer = (m: any) => {
    setSelectedManufacturer(m)
    setSelectedModel(null)
    setSelectedGeneration(null)
    setSelectedVariant(null)
    setFitmentResult(null)
  }

  const handleSelectModel = (model: any) => {
    setSelectedModel(model)
    setSelectedGeneration(null)
    setSelectedVariant(null)
    setFitmentResult(null)
  }

  const handleSelectGeneration = (gen: any) => {
    setSelectedGeneration(gen)
    setSelectedVariant(null)
    setFitmentResult(null)
  }

  const handleSelectVariant = async (variant: any) => {
    setSelectedVariant(variant)
    setLoading(true)
    try {
      const res = await fetch(`/api/vehicles?variantId=${variant.id}`)
      const data = await res.json()
      setFitmentResult(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#12141c] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
          <Car className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-wide">FIND WHAT FITS YOUR CAR</h3>
          <p className="text-xs text-zinc-400">Select your exact vehicle configuration to unlock precise fitment specs.</p>
        </div>
      </div>

      {/* Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Make */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">1. Make</label>
          <select 
            className="w-full bg-[#1a1d28] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            onChange={(e) => {
              const m = manufacturers.find(x => x.id === e.target.value)
              handleSelectManufacturer(m)
            }}
            value={selectedManufacturer?.id || ''}
          >
            <option value="">Select Manufacturer</option>
            {manufacturers.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Model */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">2. Model</label>
          <select 
            className="w-full bg-[#1a1d28] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
            disabled={!selectedManufacturer}
            onChange={(e) => {
              const model = selectedManufacturer?.models.find((x: any) => x.id === e.target.value)
              handleSelectModel(model)
            }}
            value={selectedModel?.id || ''}
          >
            <option value="">Select Model</option>
            {selectedManufacturer?.models?.map((model: any) => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>
        </div>

        {/* Generation / Year */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">3. Generation / Year</label>
          <select 
            className="w-full bg-[#1a1d28] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
            disabled={!selectedModel}
            onChange={(e) => {
              const gen = selectedModel?.generations.find((x: any) => x.id === e.target.value)
              handleSelectGeneration(gen)
            }}
            value={selectedGeneration?.id || ''}
          >
            <option value="">Select Generation</option>
            {selectedModel?.generations?.map((gen: any) => (
              <option key={gen.id} value={gen.id}>{gen.name}</option>
            ))}
          </select>
        </div>

        {/* Variant / Trim */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">4. Variant / Trim</label>
          <select 
            className="w-full bg-[#1a1d28] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
            disabled={!selectedGeneration}
            onChange={(e) => {
              const variant = selectedGeneration?.variants.find((x: any) => x.id === e.target.value)
              handleSelectVariant(variant)
            }}
            value={selectedVariant?.id || ''}
          >
            <option value="">Select Variant</option>
            {selectedGeneration?.variants?.map((v: any) => (
              <option key={v.id} value={v.id}>{v.name} ({v.engine})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Fitment Specifications Result Display */}
      {loading && (
        <div className="text-center py-12 text-zinc-400 text-sm animate-pulse">
          Calculating precision fitment parameters & clearance data...
        </div>
      )}

      {fitmentResult && !loading && (
        <div className="mt-8 border-t border-zinc-800/80 pt-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold">Vehicle Confirmed</span>
              <h4 className="text-lg font-bold text-white">
                {selectedManufacturer.name} {selectedModel.name} {selectedVariant.name}
              </h4>
            </div>
            <div className="mt-3 sm:mt-0 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-emerald-400 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4" /> Fitment Database Verified
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#1a1d28] p-4 rounded-xl border border-zinc-800/80">
              <span className="block text-[11px] text-zinc-400 uppercase font-semibold">OEM Wheel Size</span>
              <span className="text-base font-bold text-white mt-1 block">{fitmentResult.oemWheelDiam}" × {fitmentResult.oemWheelWidth}"</span>
            </div>
            <div className="bg-[#1a1d28] p-4 rounded-xl border border-zinc-800/80">
              <span className="block text-[11px] text-zinc-400 uppercase font-semibold">OEM Tyre Size</span>
              <span className="text-base font-bold text-white mt-1 block">{fitmentResult.oemTyreSize}</span>
            </div>
            <div className="bg-[#1a1d28] p-4 rounded-xl border border-zinc-800/80">
              <span className="block text-[11px] text-zinc-400 uppercase font-semibold">Bolt Pattern (PCD)</span>
              <span className="text-base font-bold text-white mt-1 block">{fitmentResult.boltPattern}</span>
            </div>
            <div className="bg-[#1a1d28] p-4 rounded-xl border border-zinc-800/80">
              <span className="block text-[11px] text-zinc-400 uppercase font-semibold">Centre Bore</span>
              <span className="text-base font-bold text-white mt-1 block">{fitmentResult.centreBore} mm</span>
            </div>
            <div className="bg-[#1a1d28] p-4 rounded-xl border border-zinc-800/80">
              <span className="block text-[11px] text-zinc-400 uppercase font-semibold">OEM Offset Range</span>
              <span className="text-base font-bold text-white mt-1 block">+{fitmentResult.oemOffset}</span>
            </div>
            <div className="bg-[#1a1d28] p-4 rounded-xl border border-zinc-800/80">
              <span className="block text-[11px] text-zinc-400 uppercase font-semibold">Compatible Widths</span>
              <span className="text-base font-bold text-white mt-1 block">{fitmentResult.minWidth}" – {fitmentResult.maxWidth}"</span>
            </div>
            <div className="bg-[#1a1d28] p-4 rounded-xl border border-zinc-800/80">
              <span className="block text-[11px] text-zinc-400 uppercase font-semibold">Recommended Offset</span>
              <span className="text-base font-bold text-blue-400 mt-1 block">+{fitmentResult.fitments[0]?.recommendedOffset || fitmentResult.oemOffset}</span>
            </div>
            <div className="bg-[#1a1d28] p-4 rounded-xl border border-zinc-800/80">
              <span className="block text-[11px] text-zinc-400 uppercase font-semibold">Drive & Body</span>
              <span className="text-base font-bold text-white mt-1 block">{fitmentResult.driveType} • {fitmentResult.bodyType}</span>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <a 
              href={`/builder?variantId=${fitmentResult.id}`}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              Build Complete Package for this Car <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
