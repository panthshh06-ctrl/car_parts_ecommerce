'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ShoppingCart, Trash2, ShieldCheck, Truck, RefreshCw, CreditCard, ChevronRight } from 'lucide-react'

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cart')
      .then(res => res.json())
      .then(data => {
        setCartItems(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const removeItem = (id: string) => {
    fetch(`/api/cart?id=${id}`, { method: 'DELETE' })
      .then(() => setCartItems(items => items.filter(i => i.id !== id)))
  }

  const subtotal = cartItems.reduce((acc, item) => {
    let price = 0
    if (item.type === 'PACKAGE') {
      price = (item.wheelVariant.price * 4) + (item.tyreVariant.price * 4)
    } else if (item.type === 'WHEEL_SET') {
      price = item.wheelVariant.price * 4
    } else if (item.type === 'TYRE_SET') {
      price = item.tyreVariant.price * 4
    }
    return acc + price
  }, 0)

  return (
    <div className="min-h-screen bg-[#090a0f] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-black text-white mb-8">SHOPPING CART</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            {loading ? (
              <div className="text-center py-12 text-zinc-500">Loading cart...</div>
            ) : cartItems.length === 0 ? (
              <div className="bg-[#12141c] border border-zinc-800 rounded-3xl p-12 text-center space-y-4">
                <ShoppingCart className="w-12 h-12 text-zinc-700 mx-auto" />
                <h3 className="text-xl font-bold text-white">Your cart is empty.</h3>
                <p className="text-sm text-zinc-400">Ready to build your dream setup? Launch the configurator to start.</p>
                <a href="/builder" className="inline-block px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider">Launch Package Builder</a>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="bg-[#12141c] border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 relative group">
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="absolute top-4 right-4 p-2 text-zinc-600 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="w-full sm:w-32 h-32 bg-zinc-900 rounded-xl overflow-hidden shrink-0">
                    <img src={item.wheelVariant?.wheel?.imageUrl || item.tyreVariant?.tyre?.imageUrl} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">
                        {item.type === 'PACKAGE' ? 'Wheel + Tyre Package' : item.type === 'WHEEL_SET' ? 'Wheel Set (4)' : 'Tyre Set (4)'}
                      </span>
                      {item.mountedBalanced && <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Mounted & Balanced</span>}
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {item.type === 'PACKAGE' 
                        ? `${item.wheelVariant.wheel.brand.name} ${item.wheelVariant.wheel.modelName} + ${item.tyreVariant.tyre.brand.name} ${item.tyreVariant.tyre.modelName}`
                        : item.type === 'WHEEL_SET' ? `${item.wheelVariant.wheel.brand.name} ${item.wheelVariant.wheel.modelName}` : `${item.tyreVariant.tyre.brand.name} ${item.tyreVariant.tyre.modelName}`
                      }
                    </h3>
                    <p className="text-xs text-zinc-400">
                      {item.wheelVariant ? `${item.wheelVariant.diameter}" × ${item.wheelVariant.width}" Offset +${item.wheelVariant.offset}` : ''}
                      {item.tyreVariant ? ` • ${item.tyreVariant.width}/${item.tyreVariant.aspectRatio} R${item.tyreVariant.rimDiameter}` : ''}
                    </p>
                    <div className="pt-2 text-lg font-black text-white">
                      ₹{(item.type === 'PACKAGE' ? (item.wheelVariant.price * 4) + (item.tyreVariant.price * 4) : item.type === 'WHEEL_SET' ? item.wheelVariant.price * 4 : item.tyreVariant.price * 4).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#12141c] border border-zinc-800 rounded-3xl p-8 space-y-6">
              <h3 className="text-xl font-bold text-white">Order Summary</h3>
              
              <div className="space-y-3 text-sm text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-emerald-400 uppercase font-bold text-xs">Calculated at Checkout</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax</span>
                  <span className="text-white">₹0</span>
                </div>
                <div className="pt-3 border-t border-zinc-800 flex justify-between">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-2xl font-black text-blue-400">₹{subtotal.toLocaleString()}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className={`w-full py-4 rounded-xl text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all ${cartItems.length > 0 ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30' : 'bg-zinc-800 text-zinc-500 pointer-events-none shadow-none'}`}
                aria-disabled={cartItems.length === 0}
              >
                Proceed to Checkout <ChevronRight className="w-4 h-4" />
              </Link>

              <div className="space-y-4 pt-6 border-t border-zinc-800">
                <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Secure Checkout
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  <Truck className="w-4 h-4 text-blue-400" /> Free Shipping on Packages
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
