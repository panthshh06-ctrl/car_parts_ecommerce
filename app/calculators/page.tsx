'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Calculator, Disc, Sliders, BookOpen } from 'lucide-react'

export default function CalculatorsPage() {
  // Offset Calculator state
  const [currWidth, setCurrWidth] = useState(8.0)
  const [currOffset, setCurrOffset] = useState(35)
  const [newWidth, setNewWidth] = useState(9.0)
  const [newOffset, setNewOffset] = useState(30)

  // Calculations for offset (in mm):
  // Inner clearance change = ((newWidth - currWidth) * 25.4 / 2) + (currOffset - newOffset)
  // Outer poke change = ((newWidth - currWidth) * 25.4 / 2) - (currOffset - newOffset)
  const widthDiffMm = ((newWidth - currWidth) * 25.4) / 2
  const innerClearance = widthDiffMm + (currOffset - newOffset)
  const outerPoke = widthDiffMm - (currOffset - newOffset)

  return (
    <div className="min-h-screen bg-[#090a0f] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <div>
          <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold">Engineering Tools</span>
          <h1 className="text-3xl font-black text-white mt-1">AUTOMOTIVE CALCULATORS & FITMENT GUIDE</h1>
          <p className="text-sm text-zinc-400 mt-1">Precise calculation tools and beginner-friendly guides to master wheel fitment.</p>
        </div>

        {/* Wheel Offset Calculator */}
        <div className="bg-[#12141c] border border-zinc-800/80 rounded-3xl p-8 space-y-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Wheel Offset & Stance Calculator</h3>
              <p className="text-xs text-zinc-400">Compare your current wheel setup against a new prospective wheel width and offset.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="space-y-6 bg-[#1a1d28] p-6 rounded-2xl border border-zinc-800">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider text-blue-400">Current Setup</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Width (inches)</label>
                  <input type="number" step="0.5" value={currWidth} onChange={e => setCurrWidth(parseFloat(e.target.value) || 0)} className="w-full bg-[#12141c] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Offset (mm)</label>
                  <input type="number" value={currOffset} onChange={e => setCurrOffset(parseInt(e.target.value) || 0)} className="w-full bg-[#12141c] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>

              <h4 className="font-bold text-white text-sm uppercase tracking-wider text-blue-400 pt-4 border-t border-zinc-800">New Setup</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Width (inches)</label>
                  <input type="number" step="0.5" value={newWidth} onChange={e => setNewWidth(parseFloat(e.target.value) || 0)} className="w-full bg-[#12141c] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Offset (mm)</label>
                  <input type="number" value={newOffset} onChange={e => setNewOffset(parseInt(e.target.value) || 0)} className="w-full bg-[#12141c] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-[#1a1d28] p-6 rounded-2xl border border-zinc-800 flex flex-col justify-between space-y-6">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider text-blue-400">Fitment Output Analysis</h4>
              
              <div className="space-y-4">
                <div className="bg-[#12141c] p-4 rounded-xl border border-zinc-800">
                  <span className="text-xs text-zinc-400 block uppercase font-medium">Inner Clearance Difference</span>
                  <span className="text-xl font-black text-white mt-1 block">
                    {innerClearance > 0 ? `+${innerClearance.toFixed(1)} mm` : `${innerClearance.toFixed(1)} mm`}
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-0.5 block">
                    {innerClearance < 0 ? '⚠️ Wheel will sit closer to suspension/struts by this amount.' : '✓ More inner room away from suspension.'}
                  </span>
                </div>

                <div className="bg-[#12141c] p-4 rounded-xl border border-zinc-800">
                  <span className="text-xs text-zinc-400 block uppercase font-medium">Outer Poke / Fender Difference</span>
                  <span className="text-xl font-black text-blue-400 mt-1 block">
                    {outerPoke > 0 ? `+${outerPoke.toFixed(1)} mm` : `${outerPoke.toFixed(1)} mm`}
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-0.5 block">
                    {outerPoke > 0 ? 'Wheel will stick out further toward the fender edge.' : 'Wheel will tuck inward relative to current.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fitment Glossary Guide */}
        <div className="bg-[#12141c] border border-zinc-800/80 rounded-3xl p-8 space-y-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Wheel & Tyre Fitment Glossary</h3>
              <p className="text-xs text-zinc-400">Beginner-friendly explanations of core technical terms.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1a1d28] p-6 rounded-2xl border border-zinc-800 space-y-2">
              <h4 className="font-bold text-white text-base">PCD (Bolt Pattern)</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">The diameter of an imaginary circle drawn through the center of your bolt holes (e.g., 5×114.3 means 5 bolts on a 114.3mm circle). Must match your car precisely.</p>
            </div>
            <div className="bg-[#1a1d28] p-6 rounded-2xl border border-zinc-800 space-y-2">
              <h4 className="font-bold text-white text-base">Wheel Offset (ET)</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">The distance from the hub mounting surface to the true centerline of the wheel (measured in mm). Lower offset pushes the wheel outward; higher offset tucks it inward.</p>
            </div>
            <div className="bg-[#1a1d28] p-6 rounded-2xl border border-zinc-800 space-y-2">
              <h4 className="font-bold text-white text-base">Centre Bore</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">The central hole in the wheel that centers it precisely on your vehicle hub. Hubcentric rings are used if the wheel bore is larger than your car hub.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
