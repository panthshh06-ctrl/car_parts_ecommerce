'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Car, Disc, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, ShoppingCart, Wrench } from 'lucide-react'

export default function PackageBuilderPage() {
  const [step, setStep] = useState(1)
  const [manufacturers, setManufacturers] = useState<any[]>([])
  const [selectedManufacturer, setSelectedManufacturer] = useState<any>(null)
  const [selectedModel, setSelectedModel] = useState<any>(null)
  const [selectedGeneration, setSelectedGeneration] = useState<any>(null)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)

  const [wheels, setWheels] = useState<any[]>([])
  const [selectedWheelVariant, setSelectedWheelVariant] = useState<any>(null)

  const [tyres, setTyres] = useState<any[]>([])
  const [selectedTyreVariant, setSelectedTyreVariant] = useState<any>(null)

  const [fitmentResult, setFitmentResult] = useState<any>(null)
  const [loadingFitment, setLoadingFitment] = useState(false)

  useEffect(() => {
    fetch('/api/vehicles')
      .then(res => res.json())
      .then(data => setManufacturers(data))
      .catch(err => console.error(err))

    fetch('/api/wheels')
      .then(res => res.json())
      .then(data => setWheels(data))
      .catch(err => console.error(err))

    fetch('/api/tyres')
      .then(res => res.json())
      .then(data => setTyres(data))
      .catch(err => console.error(err))
  }, [])

  const checkFitment = async (variant: any, wheelVar: any, tyreVar?: any) => {
    setLoadingFitment(true)
    try {
      const res = await fetch('/api/fitment/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: variant.id,
          wheelVariantId: wheelVar.id,
          tyreVariantId: tyreVar?.id
        })
      })
      const data = await res.json()
      setFitmentResult(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingFitment(false)
    }
  }

  const handleAddToCart = () => {
    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'PACKAGE',
        wheelVariantId: selectedWheelVariant.id,
        tyreVariantId: selectedTyreVariant?.id,
        quantity: 1,
        mountedBalanced: true
      })
    })
      .then(res => res.json())
      .then(data => {
        alert('Complete Wheel + Tyre Package added to cart successfully!')
      })
      .catch(err => console.error(err))
  }

  const wheelTotal = selectedWheelVariant ? selectedWheelVariant.price * 4 : 0
  const tyreTotal = selectedTyreVariant ? selectedTyreVariant.price * 4 : 0
  const packageTotal = wheelTotal + tyreTotal

  return (
    <div className="min-h-screen bg-[#090a0f] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold">Interactive Configurator</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">BUILD YOUR SETUP</h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl mx-auto">Select your vehicle, choose custom wheels and compatible tyres with real-time fitment verification.</p>
        </div>

        {/* Steps Header */}
        <div className="grid grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto">
          {[
            { num: 1, title: 'Select Vehicle', active: step === 1, done: step > 1 },
            { num: 2, title: 'Choose Wheel', active: step === 2, done: step > 2 },
            { num: 3, title: 'Choose Tyre', active: step === 3, done: step > 3 },
            { num: 4, title: 'Package Summary', active: step === 4, done: step > 4 },
          ].map(s => (
            <div key={s.num} className={`p-4 rounded-2xl border text-center transition-all ${s.active ? 'bg-blue-600/10 border-blue-500 text-white' : s.done ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-[#12141c] border-zinc-800 text-zinc-500'}`}>
              <span className="block text-xs font-bold uppercase tracking-wider">Step {s.num}</span>
              <span className="text-xs font-semibold mt-1 block">{s.title}</span>
            </div>
          ))}
        </div>

        {/* STEP 1: SELECT VEHICLE */}
        {step === 1 && (
          <div className="bg-[#12141c] border border-zinc-800/80 rounded-3xl p-8 max-w-3xl mx-auto space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-400" /> Select Your Vehicle Configuration
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Manufacturer</label>
                <select 
                  className="w-full bg-[#1a1d28] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  onChange={e => {
                    const m = manufacturers.find(x => x.id === e.target.value)
                    setSelectedManufacturer(m)
                    setSelectedModel(null)
                    setSelectedGeneration(null)
                    setSelectedVariant(null)
                  }}
                  value={selectedManufacturer?.id || ''}
                >
                  <option value="">Select Manufacturer</option>
                  {manufacturers.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Model</label>
                <select 
                  className="w-full bg-[#1a1d28] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  disabled={!selectedManufacturer}
                  onChange={e => {
                    const model = selectedManufacturer?.models.find((x: any) => x.id === e.target.value)
                    setSelectedModel(model)
                    setSelectedGeneration(null)
                    setSelectedVariant(null)
                  }}
                  value={selectedModel?.id || ''}
                >
                  <option value="">Select Model</option>
                  {selectedManufacturer?.models?.map((model: any) => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Generation / Year</label>
                <select 
                  className="w-full bg-[#1a1d28] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  disabled={!selectedModel}
                  onChange={e => {
                    const gen = selectedModel?.generations.find((x: any) => x.id === e.target.value)
                    setSelectedGeneration(gen)
                    setSelectedVariant(null)
                  }}
                  value={selectedGeneration?.id || ''}
                >
                  <option value="">Select Generation</option>
                  {selectedModel?.generations?.map((gen: any) => (
                    <option key={gen.id} value={gen.id}>{gen.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Variant / Trim</label>
                <select 
                  className="w-full bg-[#1a1d28] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  disabled={!selectedGeneration}
                  onChange={e => {
                    const variant = selectedGeneration?.variants.find((x: any) => x.id === e.target.value)
                    setSelectedVariant(variant)
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

            <div className="pt-4 flex justify-end">
              <button 
                disabled={!selectedVariant}
                onClick={() => setStep(2)}
                className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-600/30"
              >
                Proceed to Wheel Selection <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT WHEEL */}
        {step === 2 && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between bg-[#12141c] border border-zinc-800/80 p-4 rounded-2xl">
              <span className="text-xs text-zinc-400">Selected Vehicle: <strong className="text-white">{selectedManufacturer.name} {selectedModel.name} {selectedVariant.name}</strong></span>
              <button onClick={() => setStep(1)} className="text-xs text-blue-400 hover:underline">Change Vehicle</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wheels.map(wheel => {
                const variant = wheel.variants[0]
                const isSelected = selectedWheelVariant?.id === variant?.id
                return (
                  <div key={wheel.id} className={`bg-[#12141c] border rounded-2xl p-5 flex flex-col justify-between transition-all ${isSelected ? 'border-blue-500 bg-blue-600/10 shadow-xl shadow-blue-500/20' : 'border-zinc-800/80'}`}>
                    <div>
                      <div className="h-44 bg-zinc-900 rounded-xl overflow-hidden mb-4">
                        <img src={wheel.imageUrl} alt={wheel.modelName} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="font-bold text-white text-base">{wheel.brand.name} {wheel.modelName}</h4>
                      <p className="text-xs text-zinc-400 mt-1">{variant?.diameter}&quot; × {variant?.width}&quot; • Offset +{variant?.offset} • {variant?.boltPattern}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-zinc-400 block uppercase">Set of 4</span>
                        <span className="text-lg font-bold text-white">₹{(variant?.price * 4).toLocaleString()}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedWheelVariant(variant)
                          checkFitment(selectedVariant, variant)
                          setStep(3)
                        }}
                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center gap-2"
                      >
                        Select Wheel <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* STEP 3: SELECT TYRE */}
        {step === 3 && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between bg-[#12141c] border border-zinc-800/80 p-4 rounded-2xl">
              <span className="text-xs text-zinc-400">Selected Wheel: <strong className="text-white">{selectedWheelVariant.wheel?.modelName} ({selectedWheelVariant.diameter}&quot; × {selectedWheelVariant.width}&quot;)</strong></span>
              <button onClick={() => setStep(2)} className="text-xs text-blue-400 hover:underline">Change Wheel</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tyres.map(tyre => {
                const variant = tyre.variants[0]
                const isSelected = selectedTyreVariant?.id === variant?.id
                return (
                  <div key={tyre.id} className={`bg-[#12141c] border rounded-2xl p-5 flex flex-col justify-between transition-all ${isSelected ? 'border-blue-500 bg-blue-600/10' : 'border-zinc-800/80'}`}>
                    <div>
                      <div className="h-44 bg-zinc-900 rounded-xl overflow-hidden mb-4">
                        <img src={tyre.imageUrl} alt={tyre.modelName} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="font-bold text-white text-base">{tyre.brand.name} {tyre.modelName}</h4>
                      <p className="text-xs text-zinc-400 mt-1">{variant?.width}/{variant?.aspectRatio} R{variant?.rimDiameter} • {tyre.category} • {tyre.season}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-zinc-400 block uppercase">Set of 4</span>
                        <span className="text-lg font-bold text-white">₹{(variant?.price * 4).toLocaleString()}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedTyreVariant(variant)
                          checkFitment(selectedVariant, selectedWheelVariant, variant)
                          setStep(4)
                        }}
                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center gap-2"
                      >
                        Select Tyre <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* STEP 4: PACKAGE SUMMARY & FITMENT VALIDATION */}
        {step === 4 && (
          <div className="max-w-3xl mx-auto bg-[#12141c] border border-zinc-800/80 rounded-3xl p-8 space-y-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold">Package Complete</span>
                <h3 className="text-2xl font-black text-white mt-1">YOUR CUSTOM SETUP SUMMARY</h3>
              </div>
              {fitmentResult && (
                <div className={`px-4 py-2 rounded-full border text-xs font-bold flex items-center gap-2 ${fitmentResult.status === 'DIRECT_FIT' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
                  {fitmentResult.status === 'DIRECT_FIT' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  {fitmentResult.status === 'DIRECT_FIT' ? '✓ DIRECT FIT (Guaranteed)' : '⚠️ MODIFIED FIT'}
                </div>
              )}
            </div>

            {/* Fitment Notes */}
            {fitmentResult?.reasons?.length > 0 && (
              <div className="bg-[#1a1d28] border border-zinc-800 p-4 rounded-2xl space-y-2">
                <span className="text-xs font-semibold uppercase text-blue-400">Fitment Engine Analysis</span>
                {fitmentResult.reasons.map((r: string, idx: number) => (
                  <p key={idx} className="text-xs text-zinc-300">• {r}</p>
                ))}
              </div>
            )}

            {/* Items breakdown */}
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#1a1d28] p-4 rounded-2xl">
                <div>
                  <span className="text-xs text-blue-400 uppercase font-semibold">Wheels (Set of 4)</span>
                  <h4 className="text-base font-bold text-white">{selectedWheelVariant.wheel?.modelName} ({selectedWheelVariant.diameter}&quot; × {selectedWheelVariant.width}&quot; +{selectedWheelVariant.offset})</h4>
                </div>
                <span className="text-base font-bold text-white">₹{wheelTotal.toLocaleString()}</span>
              </div>

              {selectedTyreVariant && (
                <div className="flex items-center justify-between bg-[#1a1d28] p-4 rounded-2xl">
                  <div>
                    <span className="text-xs text-blue-400 uppercase font-semibold">Tyres (Set of 4)</span>
                    <h4 className="text-base font-bold text-white">{selectedTyreVariant.tyre?.modelName} ({selectedTyreVariant.width}/{selectedTyreVariant.aspectRatio} R{selectedTyreVariant.rimDiameter})</h4>
                  </div>
                  <span className="text-base font-bold text-white">₹{tyreTotal.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-blue-900/30 to-indigo-950/30 border border-blue-500/30 p-6 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Mounted, Balanced & Shipped Ready</span>
                <span className="text-2xl font-black text-white block mt-1">₹{packageTotal.toLocaleString()}</span>
              </div>
              <button 
                onClick={handleAddToCart}
                className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all"
              >
                <ShoppingCart className="w-4 h-4" /> Add Complete Set To Cart
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
