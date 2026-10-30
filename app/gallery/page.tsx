'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Car, Heart, Wrench, ArrowRight } from 'lucide-react'

export default function GalleryPage() {
  const [builds, setBuilds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        setBuilds(data)
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold">Enthusiast Community</span>
          <h1 className="text-3xl font-black text-white mt-1">VEHICLE BUILD GALLERY</h1>
          <p className="text-sm text-zinc-400 mt-1">Get inspired by real enthusiast builds featuring exact wheel dimensions, offsets, and suspension setups.</p>
        </div>

        {loading ? (
          <div className="text-center py-24 text-zinc-500">Loading build gallery...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {builds.map(build => (
              <div key={build.id} className="bg-[#12141c] border border-zinc-800/80 rounded-3xl overflow-hidden group">
                <div className="relative h-80 overflow-hidden bg-zinc-900">
                  <img src={build.imageUrl} alt={build.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-white flex items-center gap-1.5 shadow-lg">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> {build.likesCount}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-medium text-white">
                    Owner: {build.ownerName}
                  </div>
                </div>

                <div className="p-8 space-y-4">
                  <div>
                    <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">{build.carDetails}</span>
                    <h3 className="text-xl font-bold text-white mt-1">{build.title}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-[#1a1d28] p-4 rounded-2xl border border-zinc-800 text-xs">
                    <div>
                      <span className="text-zinc-500 block uppercase font-semibold mb-1">Wheel Setup</span>
                      <strong className="text-white block">{build.wheelSetup}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 block uppercase font-semibold mb-1">Tyre Setup</span>
                      <strong className="text-white block">{build.tyreSetup}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 block uppercase font-semibold mb-1">Suspension</span>
                      <strong className="text-white block">{build.suspension}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 block uppercase font-semibold mb-1">Stance</span>
                      <strong className="text-white block">{build.stance}</strong>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <a href="/builder" className="px-6 py-3 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2">
                      Shop This Setup <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
