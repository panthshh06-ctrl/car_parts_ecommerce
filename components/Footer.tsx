import Link from 'next/link'
import { Disc, ShieldCheck, Truck, RefreshCw, Headphones } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#050608] border-t border-zinc-800/80 text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center">
                <Disc className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black tracking-wider text-white">APEX<span className="text-blue-500">FITMENT</span></span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The ultimate precision fitment database and e-commerce platform for automotive wheels, tyres, and custom packages. Guaranteed flush fitment.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">Shop Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/wheels" className="hover:text-white transition-colors">Aftermarket Wheels</Link></li>
              <li><Link href="/tyres" className="hover:text-white transition-colors">Performance Tyres</Link></li>
              <li><Link href="/builder" className="hover:text-white transition-colors">Wheel + Tyre Packages</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition-colors">Build Gallery</Link></li>
              <li className="pt-2"><Link href="/admin/login" className="text-zinc-600 hover:text-blue-400 transition-colors flex items-center gap-1">🔒 Admin Login</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">Fitment Tools</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/calculators" className="hover:text-white transition-colors">Wheel Offset Calculator</Link></li>
              <li><Link href="/calculators" className="hover:text-white transition-colors">Tyre Size Comparison</Link></li>
              <li><Link href="/calculators" className="hover:text-white transition-colors">Fitment Glossary</Link></li>
              <li><Link href="/garage" className="hover:text-white transition-colors">My Virtual Garage</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">Enthusiast Newsletter</h4>
            <p className="text-xs text-zinc-400 mb-3">Get elite fitment guides, exclusive wheel drops, and track day alerts.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Enter your email" className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 flex-1" />
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg text-xs transition-colors">Join</button>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500">
          <p>© 2026 Apex Fitment Technologies Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-zinc-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-zinc-400 cursor-pointer">Fitment Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
