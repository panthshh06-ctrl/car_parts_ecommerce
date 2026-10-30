'tsx'
import Link from 'next/link'
import { Disc, ShoppingCart, Heart, Wrench, Car, Calculator, ShieldCheck, User } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#090a0f]/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Disc className="w-6 h-6 text-white animate-spin-slow" />
          </div>
          <div>
            <span className="text-xl font-black tracking-wider text-white">APEX<span className="text-blue-500">FITMENT</span></span>
            <span className="block text-[10px] tracking-widest text-zinc-400 font-semibold uppercase">Wheels • Tyres • Packages</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-300">
          <Link href="/wheels" className="hover:text-white transition-colors">Shop Wheels</Link>
          <Link href="/tyres" className="hover:text-white transition-colors">Shop Tyres</Link>
          <Link href="/builder" className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-blue-400 font-semibold">
            <Wrench className="w-4 h-4" /> Package Builder
          </Link>
          <Link href="/gallery" className="hover:text-white transition-colors">Vehicle Gallery</Link>
          <Link href="/calculators" className="hover:text-white transition-colors flex items-center gap-1">
            <Calculator className="w-4 h-4" /> Calculators
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Link href="/garage" className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-medium transition-all">
            <Car className="w-4 h-4 text-blue-400" /> My Garage
          </Link>
          
          <Link href="/cart" className="relative p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
              1
            </span>
          </Link>

          <Link href="/admin" className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all" title="Admin Dashboard">
            <ShieldCheck className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
