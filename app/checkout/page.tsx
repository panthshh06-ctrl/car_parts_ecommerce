'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, ChevronRight, CreditCard, LockKeyhole, PackageCheck, ShieldCheck, Truck } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

type CartItem = {
  id: string
  type: 'PACKAGE' | 'WHEEL_SET' | 'TYRE_SET'
  mountedBalanced: boolean
  wheelVariant?: {
    price: number
    diameter: number
    width: number
    offset: number
    wheel: { imageUrl: string; modelName: string; brand: { name: string } }
  }
  tyreVariant?: {
    price: number
    width: number
    aspectRatio: number
    rimDiameter: number
    tyre: { imageUrl: string; modelName: string; brand: { name: string } }
  }
}

function itemTitle(item: CartItem) {
  if (item.type === 'PACKAGE') return `${item.wheelVariant?.wheel.brand.name} ${item.wheelVariant?.wheel.modelName} + ${item.tyreVariant?.tyre.brand.name} ${item.tyreVariant?.tyre.modelName}`
  if (item.type === 'WHEEL_SET') return `${item.wheelVariant?.wheel.brand.name} ${item.wheelVariant?.wheel.modelName}`
  return `${item.tyreVariant?.tyre.brand.name} ${item.tyreVariant?.tyre.modelName}`
}

function itemPrice(item: CartItem) {
  if (item.type === 'PACKAGE') return (item.wheelVariant?.price ?? 0) * 4 + (item.tyreVariant?.price ?? 0) * 4
  if (item.type === 'WHEEL_SET') return (item.wheelVariant?.price ?? 0) * 4
  return (item.tyreVariant?.price ?? 0) * 4
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetch('/api/cart')
      .then(async response => {
        if (!response.ok) throw new Error('Unable to load your cart.')
        return response.json()
      })
      .then(data => setCartItems(data))
      .catch(() => setError('Unable to load your cart. Please return to the cart and try again.'))
      .finally(() => setLoading(false))
  }, [])

  const subtotal = useMemo(() => cartItems.reduce((total, item) => total + itemPrice(item), 0), [cartItems])
  const shipping = cartItems.some(item => item.type === 'PACKAGE') ? 0 : subtotal > 0 ? 999 : 0
  const total = subtotal + shipping

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (cartItems.length > 0) setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#090a0f] text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {submitted ? (
          <section className="max-w-2xl mx-auto py-12 text-center">
            <div className="bg-[#12141c] border border-emerald-500/30 rounded-3xl p-10 sm:p-14 space-y-6">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-400">Demo order confirmed</p>
              <h1 className="text-3xl font-black">YOUR SETUP IS RESERVED</h1>
              <p className="text-sm leading-6 text-zinc-400">This is a demonstration checkout. No payment was processed, no order was created, and your cart remains unchanged.</p>
              <Link href="/cart" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-black text-xs uppercase tracking-wider transition-colors">
                Return to Cart <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
              <div>
                <Link href="/cart" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors mb-5">
                  <ArrowLeft className="w-4 h-4" /> Back to Cart
                </Link>
                <p className="text-[10px] uppercase font-bold tracking-[0.25em] text-blue-400 mb-2">Secure demo checkout</p>
                <h1 className="text-3xl font-black">COMPLETE YOUR BUILD</h1>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold"><ShieldCheck className="w-4 h-4" /> No real payment is processed</div>
            </div>

            {loading ? (
              <div className="py-20 text-center text-zinc-500">Loading checkout...</div>
            ) : error ? (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 text-rose-300">{error}</div>
            ) : cartItems.length === 0 ? (
              <div className="bg-[#12141c] border border-zinc-800 rounded-3xl p-12 text-center space-y-5">
                <PackageCheck className="w-12 h-12 text-zinc-700 mx-auto" />
                <h2 className="text-xl font-bold">YOUR CART IS EMPTY</h2>
                <p className="text-sm text-zinc-400">Add a wheel, tyre, or complete package before checking out.</p>
                <Link href="/builder" className="inline-flex px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-black uppercase tracking-wider">Build a Package</Link>
              </div>
            ) : (
              <form onSubmit={submitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-7 space-y-6">
                  <section className="bg-[#12141c] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
                    <div><p className="text-[10px] uppercase font-bold tracking-widest text-blue-400 mb-1">Step 1</p><h2 className="text-xl font-bold">Contact Details</h2></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input required name="firstName" placeholder="First name" className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-blue-500" />
                      <input required name="lastName" placeholder="Last name" className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-blue-500" />
                      <input required type="email" name="email" placeholder="Email address" className="sm:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-blue-500" />
                      <input required name="phone" placeholder="Phone number" className="sm:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-blue-500" />
                    </div>
                  </section>

                  <section className="bg-[#12141c] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
                    <div><p className="text-[10px] uppercase font-bold tracking-widest text-blue-400 mb-1">Step 2</p><h2 className="text-xl font-bold">Delivery Address</h2></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input required name="address" placeholder="Street address" className="sm:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-blue-500" />
                      <input required name="city" placeholder="City" className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-blue-500" />
                      <input required name="postcode" placeholder="Postal code" className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-blue-500" />
                    </div>
                  </section>

                  <section className="bg-[#12141c] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
                    <div><p className="text-[10px] uppercase font-bold tracking-widest text-blue-400 mb-1">Step 3</p><h2 className="text-xl font-bold">Payment</h2></div>
                    <div className="flex items-center gap-3 border border-blue-500 bg-blue-500/10 rounded-xl p-4 text-sm"><CreditCard className="w-5 h-5 text-blue-400" /><div><p className="font-bold">Demo Card Payment</p><p className="text-xs text-zinc-400">Use any sample details. Nothing is charged or saved.</p></div></div>
                    <input required name="cardNumber" inputMode="numeric" placeholder="Card number" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-blue-500" />
                    <div className="grid grid-cols-2 gap-4"><input required name="expiry" placeholder="MM / YY" className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-blue-500" /><input required name="cvv" inputMode="numeric" placeholder="CVV" className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-blue-500" /></div>
                  </section>
                </div>

                <aside className="lg:col-span-5 lg:sticky lg:top-28 bg-[#12141c] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
                  <h2 className="text-xl font-bold">Order Summary</h2>
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                    {cartItems.map(item => <div key={item.id} className="flex gap-3"><img src={item.wheelVariant?.wheel.imageUrl || item.tyreVariant?.tyre.imageUrl} alt="" className="w-14 h-14 rounded-lg object-cover bg-zinc-900" /><div className="min-w-0 flex-1"><p className="text-xs font-bold text-white line-clamp-2">{itemTitle(item)}</p><p className="text-[10px] uppercase tracking-wider text-zinc-500 mt-1">{item.type === 'PACKAGE' ? 'Wheel + Tyre Package' : item.type === 'WHEEL_SET' ? 'Wheel Set (4)' : 'Tyre Set (4)'}</p></div><span className="text-xs font-bold whitespace-nowrap">₹{itemPrice(item).toLocaleString()}</span></div>)}
                  </div>
                  <div className="border-t border-zinc-800 pt-5 space-y-3 text-sm text-zinc-400"><div className="flex justify-between"><span>Subtotal</span><span className="text-white">₹{subtotal.toLocaleString()}</span></div><div className="flex justify-between"><span>Shipping</span><span className={shipping === 0 ? 'text-emerald-400 font-bold text-xs uppercase' : 'text-white'}>{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString()}`}</span></div><div className="flex justify-between border-t border-zinc-800 pt-4"><span className="text-lg font-bold text-white">Total</span><span className="text-2xl font-black text-blue-400">₹{total.toLocaleString()}</span></div></div>
                  <button type="submit" className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 flex justify-center items-center gap-2 transition-colors"><LockKeyhole className="w-4 h-4" /> Place Demo Order</button>
                  <div className="flex gap-3 text-[10px] leading-5 uppercase tracking-wider font-bold text-zinc-500"><Truck className="w-4 h-4 text-blue-400 shrink-0" /> Package orders include free shipping. This checkout is for demonstration only.</div>
                </aside>
              </form>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
