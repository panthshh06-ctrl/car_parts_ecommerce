'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import VehicleSelector from '@/components/VehicleSelector'
import { Disc, ShieldCheck, Wrench, ArrowRight, Star, CheckCircle2, ChevronRight } from 'lucide-react'

export default function Home() {
  const [wheels, setWheels] = useState<any[]>([])
  const [gallery, setGallery] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/wheels')
      .then(res => res.json())
      .then(data => setWheels(data.slice(0, 4)))
      .catch(err => console.error(err))

    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => setGallery(data.slice(0, 2)))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="min-h-screen bg-[#090a0f] text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden border-b border-zinc-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#090a0f] to-[#090a0f] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wider uppercase">
                <ShieldCheck className="w-4 h-4" /> 100% Fitment Guaranteed Database
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-none">
                FIND THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">PERFECT FIT.</span>
              </h1>
              
              <p className="text-lg text-zinc-300 max-w-xl font-normal leading-relaxed">
                Wheels. Tyres. Your Car. One Perfect Setup. Precision-engineered fitment verification for car enthusiasts who demand flawless stance.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link 
                  href="/wheels" 
                  className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-blue-600/30 flex items-center gap-3"
                >
                  Find Wheels For My Car <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  href="/builder" 
                  className="px-8 py-4 rounded-xl bg-[#161923] hover:bg-[#1e2230] border border-zinc-700 text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-3"
                >
                  <Wrench className="w-4 h-4 text-blue-400" /> Build Wheel + Tyre Package
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-zinc-800/80">
                <div>
                  <span className="block text-2xl font-black text-white">10,000+</span>
                  <span className="text-xs text-zinc-400">Vehicle Configurations</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-white">50+</span>
                  <span className="text-xs text-zinc-400">Elite Wheel Brands</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-white">100%</span>
                  <span className="text-xs text-zinc-400">Fitment Confidence</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80" 
                  alt="Car with custom aftermarket wheels" 
                  className="w-full h-[460px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">Featured Setup</span>
                    <h3 className="text-lg font-bold text-white">BMW G20 on Enkei RPF1 Matte Bronze</h3>
                  </div>
                  <Link href="/gallery" className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Selector Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VehicleSelector />
      </section>

      {/* Trending Wheels Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase">High Performance Catalog</span>
            <h2 className="text-3xl font-black text-white mt-1">TRENDING WHEEL SETS</h2>
          </div>
          <Link href="/wheels" className="mt-4 sm:mt-0 text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 uppercase tracking-wider">
            Explore All Wheels <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wheels.map((wheel) => {
            const variant = wheel.variants[0]
            return (
              <div key={wheel.id} className="bg-[#12141c] border border-zinc-800/80 rounded-2xl p-5 hover:border-zinc-700 transition-all group flex flex-col justify-between">
                <div>
                  <div className="relative rounded-xl overflow-hidden bg-zinc-900 mb-4 h-48">
                    <img src={wheel.imageUrl} alt={wheel.modelName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white">
                      {wheel.brand.name}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base">{wheel.brand.name} {wheel.modelName}</h3>
                  <p className="text-xs text-zinc-400 mt-1">{wheel.construction} • {variant ? `${variant.diameter}" × ${variant.width}" (+${variant.offset})` : ''}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase font-medium">Starting At</span>
                    <span className="text-lg font-bold text-white">₹{variant?.price?.toLocaleString() || '28,500'}</span>
                  </div>
                  <Link href={`/wheels`} className="px-4 py-2 rounded-xl bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600 text-blue-400 hover:text-white text-xs font-semibold transition-all">
                    Check Fitment
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Package Builder Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900/40 via-[#12141c] to-indigo-950/40 border border-blue-500/30 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <Wrench className="w-4 h-4" /> Wheel + Tyre Packages
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">BUILD YOUR COMPLETE SETUP</h2>
            <p className="text-sm text-zinc-300">
              Select your vehicle, choose matching aftermarket wheels, pick performance tyres guaranteed to fit, and get them shipped mounted and balanced right to your door.
            </p>
            <div className="pt-4">
              <Link href="/builder" className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all inline-flex items-center gap-3">
                Launch Package Builder <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Builds Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase">Enthusiast Community</span>
            <h2 className="text-3xl font-black text-white mt-1">FEATURED VEHICLE GALLERY</h2>
          </div>
          <Link href="/gallery" className="mt-4 sm:mt-0 text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 uppercase tracking-wider">
            View All Builds <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {gallery.map(build => (
            <div key={build.id} className="bg-[#12141c] border border-zinc-800/80 rounded-2xl overflow-hidden group">
              <div className="relative h-64 overflow-hidden">
                <img src={build.imageUrl} alt={build.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1">
                  ♥ {build.likesCount}
                </div>
              </div>
              <div className="p-6 space-y-3">
                <span className="text-xs text-blue-400 uppercase font-semibold">{build.carDetails}</span>
                <h3 className="text-lg font-bold text-white">{build.title}</h3>
                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400 pt-2 border-t border-zinc-800/80">
                  <div><strong className="text-white">Wheels:</strong> {build.wheelSetup}</div>
                  <div><strong className="text-white">Tyres:</strong> {build.tyreSetup}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
