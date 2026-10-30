'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, Car, Disc, ShoppingBag, ShieldCheck, Plus, Trash2, Edit3,
  RefreshCw, X, ChevronDown, ChevronRight, AlertTriangle, Package,
  TrendingUp, Users, CheckCircle, Clock, LogOut, Wrench
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Stats {
  totalOrders: number
  totalWheels: number
  totalTyres: number
  totalVehicleVariants: number
  totalManufacturers: number
  totalRevenue: number
  pendingOrders: number
}

// ─── Reusable Modal ───────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#12141c] border border-zinc-700 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <h3 className="text-lg font-black text-white">{title}</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ─── Form Field ───────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full bg-[#1a1d28] border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
const selectCls = `${inputCls} cursor-pointer`

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    PROCESSING: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    SHIPPED: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    DELIVERED: 'bg-green-500/15 text-green-400 border-green-500/30',
    CANCELLED: 'bg-red-500/15 text-red-400 border-red-500/30',
  }
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${colors[status] || 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
      {status}
    </span>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-[#1a1d28] border border-zinc-800 rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs text-zinc-400 uppercase font-semibold tracking-wide">{label}</p>
        <p className="text-2xl font-black text-white mt-0.5">{value}</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VEHICLES TAB
// ═══════════════════════════════════════════════════════════════════════════════
function VehiclesTab() {
  const [manufacturers, setManufacturers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [modal, setModal] = useState<null | 'manufacturer' | 'model' | 'generation' | 'variant'>(null)
  const [selectedParent, setSelectedParent] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Record<string, string>>({})
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/vehicles')
    const data = await res.json()
    setManufacturers(data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const openModal = (type: typeof modal, parent: any = null) => {
    setModal(type)
    setSelectedParent(parent)
    setForm({})
    setMsg('')
  }

  const save = async () => {
    setSaving(true)
    setMsg('')
    try {
      const res = await fetch('/api/admin/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: modal, data: { ...form, ...selectedParent } }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setModal(null)
      load()
    } catch (e: any) {
      setMsg(e.message)
    }
    setSaving(false)
  }

  const del = async (type: string, id: string) => {
    if (!confirm('Delete this entry and all its children? This cannot be undone.')) return
    await fetch(`/api/admin/vehicles?type=${type}&id=${id}`, { method: 'DELETE' })
    load()
  }

  const f = (k: string) => (e: any) => setForm(prev => ({ ...prev, [k]: e.target.value }))

  if (loading) return <div className="text-center py-20 text-zinc-500">Loading vehicles…</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-white">Vehicle Database</h3>
        <button onClick={() => openModal('manufacturer')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase transition-all">
          <Plus className="w-4 h-4" /> Add Manufacturer
        </button>
      </div>

      <div className="space-y-3">
        {manufacturers.length === 0 && <p className="text-zinc-500 text-sm text-center py-12">No manufacturers yet. Add one to get started.</p>}
        {manufacturers.map(mfr => (
          <div key={mfr.id} className="border border-zinc-800 rounded-2xl overflow-hidden">
            {/* Manufacturer Row */}
            <div className="flex items-center justify-between px-5 py-4 bg-[#1a1d28] cursor-pointer" onClick={() => toggle(mfr.id)}>
              <div className="flex items-center gap-3">
                {expanded.has(mfr.id) ? <ChevronDown className="w-4 h-4 text-zinc-400" /> : <ChevronRight className="w-4 h-4 text-zinc-400" />}
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <Car className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{mfr.name}</p>
                  <p className="text-[10px] text-zinc-500">{mfr.country || 'Unknown'} · {mfr.models?.length || 0} models</p>
                </div>
              </div>
              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <button onClick={() => openModal('model', { manufacturerId: mfr.id })} className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1.5">
                  <Plus className="w-3 h-3" /> Model
                </button>
                <button onClick={() => del('manufacturer', mfr.id)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Models */}
            {expanded.has(mfr.id) && (
              <div className="px-4 pb-4 pt-2 space-y-2 bg-[#12141c]">
                {mfr.models?.map((mdl: any) => (
                  <div key={mdl.id} className="border border-zinc-800/60 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-[#16182a] cursor-pointer" onClick={() => toggle(mdl.id)}>
                      <div className="flex items-center gap-2">
                        {expanded.has(mdl.id) ? <ChevronDown className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />}
                        <span className="text-sm font-semibold text-zinc-200">{mdl.name}</span>
                        <span className="text-[10px] text-zinc-500">{mdl.generations?.length || 0} generations</span>
                      </div>
                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <button onClick={() => openModal('generation', { modelId: mdl.id })} className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-semibold flex items-center gap-1">
                          <Plus className="w-3 h-3" /> Gen
                        </button>
                        <button onClick={() => del('model', mdl.id)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Generations */}
                    {expanded.has(mdl.id) && (
                      <div className="px-4 pb-3 pt-2 space-y-1.5 bg-[#12141c]">
                        {mdl.generations?.map((gen: any) => (
                          <div key={gen.id} className="border border-zinc-800/40 rounded-lg overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-2.5 bg-[#14162a] cursor-pointer" onClick={() => toggle(gen.id)}>
                              <div className="flex items-center gap-2">
                                {expanded.has(gen.id) ? <ChevronDown className="w-3 h-3 text-zinc-600" /> : <ChevronRight className="w-3 h-3 text-zinc-600" />}
                                <span className="text-xs font-semibold text-zinc-300">{gen.name} ({gen.startYear}–{gen.endYear || 'present'})</span>
                                <span className="text-[10px] text-zinc-600">{gen.variants?.length || 0} variants</span>
                              </div>
                              <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                                <button onClick={() => openModal('variant', { generationId: gen.id })} className="px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] font-semibold flex items-center gap-1">
                                  <Plus className="w-2.5 h-2.5" /> Variant
                                </button>
                                <button onClick={() => del('generation', gen.id)} className="p-1 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400">
                                  <Trash2 className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>

                            {/* Variants */}
                            {expanded.has(gen.id) && gen.variants?.length > 0 && (
                              <div className="px-3 pb-2 pt-1 space-y-1 bg-[#0f1020]">
                                {gen.variants.map((v: any) => (
                                  <div key={v.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#1a1d28] border border-zinc-800/40">
                                    <div>
                                      <p className="text-[11px] font-semibold text-zinc-200">{v.name}</p>
                                      <p className="text-[10px] text-zinc-600">{v.bodyType} · {v.engine} · {v.boltPattern}</p>
                                    </div>
                                    <button onClick={() => del('variant', v.id)} className="p-1 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400">
                                      <Trash2 className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <Modal title={`Add ${modal.charAt(0).toUpperCase() + modal.slice(1)}`} onClose={() => setModal(null)}>
          <div className="space-y-4">
            {modal === 'manufacturer' && <>
              <Field label="Brand Name *"><input className={inputCls} placeholder="e.g. Toyota" onChange={f('name')} /></Field>
              <Field label="Country"><input className={inputCls} placeholder="e.g. Japan" onChange={f('country')} /></Field>
              <Field label="Logo URL"><input className={inputCls} placeholder="https://…" onChange={f('logoUrl')} /></Field>
            </>}
            {modal === 'model' && <>
              <Field label="Model Name *"><input className={inputCls} placeholder="e.g. Supra" onChange={f('name')} /></Field>
            </>}
            {modal === 'generation' && <>
              <Field label="Generation Name *"><input className={inputCls} placeholder="e.g. A90 / Mk5" onChange={f('name')} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Start Year *"><input className={inputCls} type="number" placeholder="2019" onChange={f('startYear')} /></Field>
                <Field label="End Year"><input className={inputCls} type="number" placeholder="Present" onChange={f('endYear')} /></Field>
              </div>
            </>}
            {modal === 'variant' && <>
              <Field label="Variant Name *"><input className={inputCls} placeholder="e.g. 3.0 Twin-Turbo RWD" onChange={f('name')} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Body Type *"><select className={selectCls} onChange={f('bodyType')}><option value="">Select…</option>{['Coupe','Sedan','Hatchback','SUV','Wagon','Convertible','Pickup'].map(t=><option key={t}>{t}</option>)}</select></Field>
                <Field label="Drive Type *"><select className={selectCls} onChange={f('driveType')}><option value="">Select…</option>{['RWD','FWD','AWD','4WD'].map(t=><option key={t}>{t}</option>)}</select></Field>
              </div>
              <Field label="Engine *"><input className={inputCls} placeholder="e.g. 3.0L Twin-Turbo I6" onChange={f('engine')} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="OEM Wheel Dia (in) *"><input className={inputCls} type="number" step="0.5" placeholder="19" onChange={f('oemWheelDiam')} /></Field>
                <Field label="OEM Wheel Width (in) *"><input className={inputCls} type="number" step="0.5" placeholder="8.5" onChange={f('oemWheelWidth')} /></Field>
              </div>
              <Field label="OEM Tyre Size *"><input className={inputCls} placeholder="255/35R19" onChange={f('oemTyreSize')} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Bolt Pattern *"><input className={inputCls} placeholder="5x114.3" onChange={f('boltPattern')} /></Field>
                <Field label="Centre Bore (mm) *"><input className={inputCls} type="number" step="0.1" placeholder="60.1" onChange={f('centreBore')} /></Field>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="OEM Offset *"><input className={inputCls} type="number" placeholder="35" onChange={f('oemOffset')} /></Field>
                <Field label="Min Offset *"><input className={inputCls} type="number" placeholder="20" onChange={f('minOffset')} /></Field>
                <Field label="Max Offset *"><input className={inputCls} type="number" placeholder="45" onChange={f('maxOffset')} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Min Width (in) *"><input className={inputCls} type="number" step="0.5" placeholder="7.5" onChange={f('minWidth')} /></Field>
                <Field label="Max Width (in) *"><input className={inputCls} type="number" step="0.5" placeholder="10" onChange={f('maxWidth')} /></Field>
              </div>
            </>}

            {msg && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5 text-sm text-red-400">{msg}</div>}

            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-semibold hover:border-zinc-600 transition-colors">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all disabled:opacity-60">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// WHEELS TAB
// ═══════════════════════════════════════════════════════════════════════════════
function WheelsTab() {
  const [wheels, setWheels] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<null | 'brand' | 'wheel' | 'variant' | 'stock'>(null)
  const [selected, setSelected] = useState<any>(null)
  const [form, setForm] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/wheels')
    const data = await res.json()
    setWheels(data.wheels || [])
    setBrands(data.brands || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const openModal = (type: typeof modal, parent: any = null) => {
    setModal(type); setSelected(parent); setForm({}); setMsg('')
  }

  const save = async () => {
    setSaving(true); setMsg('')
    try {
      const method = modal === 'stock' ? 'PATCH' : 'POST'
      const body = modal === 'stock'
        ? { type: 'wheelVariant', id: selected.id, data: form }
        : { type: modal, data: { ...form, ...selected } }
      const res = await fetch('/api/admin/wheels', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setModal(null); load()
    } catch (e: any) { setMsg(e.message) }
    setSaving(false)
  }

  const del = async (type: string, id: string) => {
    if (!confirm('Delete this item?')) return
    await fetch(`/api/admin/wheels?type=${type}&id=${id}`, { method: 'DELETE' })
    load()
  }

  const f = (k: string) => (e: any) => setForm(prev => ({ ...prev, [k]: e.target.value }))

  if (loading) return <div className="text-center py-20 text-zinc-500">Loading wheels…</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-white">Wheels Inventory</h3>
        <div className="flex gap-2">
          <button onClick={() => openModal('brand')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold uppercase transition-all">
            <Plus className="w-4 h-4" /> Brand
          </button>
          <button onClick={() => openModal('wheel')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase transition-all">
            <Plus className="w-4 h-4" /> Add Wheel
          </button>
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div className="mb-6">
          <p className="text-xs text-zinc-500 uppercase font-semibold tracking-wider mb-3">Wheel Brands ({brands.length})</p>
          <div className="flex flex-wrap gap-2">
            {brands.map((b: any) => (
              <span key={b.id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1d28] border border-zinc-800 text-xs text-zinc-300 font-medium">
                {b.name}
                <button onClick={() => del('brand', b.id)} className="text-red-500 hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#1a1d28] border-b border-zinc-800">
              <th className="text-left px-5 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Wheel</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Brand</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Type</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Variants</th>
              <th className="text-right px-5 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {wheels.length === 0 && (
              <tr><td colSpan={5} className="text-center py-12 text-zinc-600">No wheels found</td></tr>
            )}
            {wheels.map((w: any) => (
              <tr key={w.id} className="hover:bg-[#1a1d28]/50 transition-colors">
                <td className="px-5 py-4 font-semibold text-white">{w.modelName}</td>
                <td className="px-4 py-4 text-zinc-400">{w.brand?.name}</td>
                <td className="px-4 py-4 text-zinc-400 text-xs">{w.construction} · {w.material}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 text-xs">{w.variants?.length || 0}</span>
                    <button onClick={() => openModal('variant', { wheelId: w.id })} className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] font-semibold flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Add
                    </button>
                    {w.variants?.[0] && (
                      <button onClick={() => openModal('stock', w.variants[0])} className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] font-semibold flex items-center gap-1">
                        <Edit3 className="w-3 h-3" /> Stock
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <button onClick={() => del('wheel', w.id)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {modal && (
        <Modal title={modal === 'brand' ? 'Add Wheel Brand' : modal === 'wheel' ? 'Add Wheel' : modal === 'variant' ? 'Add Wheel Variant' : 'Update Stock & Price'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            {modal === 'brand' && <>
              <Field label="Brand Name *"><input className={inputCls} placeholder="e.g. Enkei" onChange={f('name')} /></Field>
              <Field label="Logo URL"><input className={inputCls} placeholder="https://…" onChange={f('logoUrl')} /></Field>
            </>}
            {modal === 'wheel' && <>
              <Field label="Brand *">
                <select className={selectCls} onChange={f('brandId')}>
                  <option value="">Select brand…</option>
                  {brands.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </Field>
              <Field label="Model Name *"><input className={inputCls} placeholder="e.g. RPF1" onChange={f('modelName')} /></Field>
              <Field label="Description"><textarea className={inputCls} placeholder="Optional description" rows={2} onChange={f('description')} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Construction *"><select className={selectCls} onChange={f('construction')}><option value="">Select…</option>{['Flow Formed','Cast','Forged','Monoblock'].map(t=><option key={t}>{t}</option>)}</select></Field>
                <Field label="Material *"><select className={selectCls} onChange={f('material')}><option value="">Select…</option>{['Aluminium Alloy','Steel','Carbon Fibre'].map(t=><option key={t}>{t}</option>)}</select></Field>
              </div>
              <Field label="Image URL"><input className={inputCls} placeholder="https://images.unsplash.com/…" onChange={f('imageUrl')} /></Field>
            </>}
            {modal === 'variant' && <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Diameter (in) *"><input className={inputCls} type="number" step="0.5" placeholder="18" onChange={f('diameter')} /></Field>
                <Field label="Width (in) *"><input className={inputCls} type="number" step="0.5" placeholder="8.5" onChange={f('width')} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Offset (ET) *"><input className={inputCls} type="number" placeholder="35" onChange={f('offset')} /></Field>
                <Field label="Centre Bore (mm) *"><input className={inputCls} type="number" step="0.1" placeholder="73.1" onChange={f('centreBore')} /></Field>
              </div>
              <Field label="Bolt Pattern *"><input className={inputCls} placeholder="5x114.3" onChange={f('boltPattern')} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Finish *"><input className={inputCls} placeholder="Matte Bronze" onChange={f('finish')} /></Field>
                <Field label="Color *"><input className={inputCls} placeholder="Bronze" onChange={f('color')} /></Field>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Weight (kg) *"><input className={inputCls} type="number" step="0.1" placeholder="7.2" onChange={f('weightKg')} /></Field>
                <Field label="Load Rating (kg) *"><input className={inputCls} type="number" placeholder="750" onChange={f('loadRatingKg')} /></Field>
                <Field label="Price (₹) *"><input className={inputCls} type="number" placeholder="28500" onChange={f('price')} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Stock Qty *"><input className={inputCls} type="number" placeholder="10" onChange={f('stockQty')} /></Field>
                <Field label="SKU *"><input className={inputCls} placeholder="WHL-001-18-8.5" onChange={f('sku')} /></Field>
              </div>
            </>}
            {modal === 'stock' && <>
              <div className="bg-[#1a1d28] rounded-xl p-4 border border-zinc-800 mb-2">
                <p className="text-xs text-zinc-500">Editing variant SKU: <span className="text-zinc-300 font-mono">{selected?.sku}</span></p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="New Price (₹)"><input className={inputCls} type="number" defaultValue={selected?.price} onChange={f('price')} /></Field>
                <Field label="New Stock Qty"><input className={inputCls} type="number" defaultValue={selected?.stockQty} onChange={f('stockQty')} /></Field>
              </div>
            </>}

            {msg && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5 text-sm text-red-400">{msg}</div>}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-semibold hover:border-zinc-600 transition-colors">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all disabled:opacity-60">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TYRES TAB
// ═══════════════════════════════════════════════════════════════════════════════
function TyresTab() {
  const [tyres, setTyres] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<null | 'brand' | 'tyre' | 'variant' | 'stock'>(null)
  const [selected, setSelected] = useState<any>(null)
  const [form, setForm] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/tyres')
    const data = await res.json()
    setTyres(data.tyres || [])
    setBrands(data.brands || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const openModal = (type: typeof modal, parent: any = null) => {
    setModal(type); setSelected(parent); setForm({}); setMsg('')
  }

  const save = async () => {
    setSaving(true); setMsg('')
    try {
      const method = modal === 'stock' ? 'PATCH' : 'POST'
      const body = modal === 'stock'
        ? { type: 'tyreVariant', id: selected.id, data: form }
        : { type: modal, data: { ...form, ...selected } }
      const res = await fetch('/api/admin/tyres', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setModal(null); load()
    } catch (e: any) { setMsg(e.message) }
    setSaving(false)
  }

  const del = async (type: string, id: string) => {
    if (!confirm('Delete this item?')) return
    await fetch(`/api/admin/tyres?type=${type}&id=${id}`, { method: 'DELETE' })
    load()
  }

  const f = (k: string) => (e: any) => setForm(prev => ({ ...prev, [k]: e.target.value }))

  if (loading) return <div className="text-center py-20 text-zinc-500">Loading tyres…</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-white">Tyres Inventory</h3>
        <div className="flex gap-2">
          <button onClick={() => openModal('brand')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold uppercase transition-all">
            <Plus className="w-4 h-4" /> Brand
          </button>
          <button onClick={() => openModal('tyre')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase transition-all">
            <Plus className="w-4 h-4" /> Add Tyre
          </button>
        </div>
      </div>

      {brands.length > 0 && (
        <div className="mb-6">
          <p className="text-xs text-zinc-500 uppercase font-semibold tracking-wider mb-3">Tyre Brands ({brands.length})</p>
          <div className="flex flex-wrap gap-2">
            {brands.map((b: any) => (
              <span key={b.id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1d28] border border-zinc-800 text-xs text-zinc-300 font-medium">
                {b.name}
                <button onClick={() => del('brand', b.id)} className="text-red-500 hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#1a1d28] border-b border-zinc-800">
              <th className="text-left px-5 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Tyre</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Brand</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Category</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Season</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Variants</th>
              <th className="text-right px-5 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {tyres.length === 0 && (
              <tr><td colSpan={6} className="text-center py-12 text-zinc-600">No tyres found</td></tr>
            )}
            {tyres.map((t: any) => (
              <tr key={t.id} className="hover:bg-[#1a1d28]/50 transition-colors">
                <td className="px-5 py-4 font-semibold text-white">{t.modelName}</td>
                <td className="px-4 py-4 text-zinc-400">{t.brand?.name}</td>
                <td className="px-4 py-4 text-zinc-400 text-xs">{t.category}</td>
                <td className="px-4 py-4 text-zinc-400 text-xs">{t.season}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 text-xs">{t.variants?.length || 0}</span>
                    <button onClick={() => openModal('variant', { tyreId: t.id })} className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] font-semibold flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Add
                    </button>
                    {t.variants?.[0] && (
                      <button onClick={() => openModal('stock', t.variants[0])} className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] font-semibold flex items-center gap-1">
                        <Edit3 className="w-3 h-3" /> Stock
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <button onClick={() => del('tyre', t.id)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === 'brand' ? 'Add Tyre Brand' : modal === 'tyre' ? 'Add Tyre' : modal === 'variant' ? 'Add Tyre Variant' : 'Update Stock & Price'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            {modal === 'brand' && <>
              <Field label="Brand Name *"><input className={inputCls} placeholder="e.g. Michelin" onChange={f('name')} /></Field>
            </>}
            {modal === 'tyre' && <>
              <Field label="Brand *">
                <select className={selectCls} onChange={f('brandId')}>
                  <option value="">Select brand…</option>
                  {brands.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </Field>
              <Field label="Model Name *"><input className={inputCls} placeholder="e.g. Pilot Sport 4S" onChange={f('modelName')} /></Field>
              <Field label="Description"><textarea className={inputCls} placeholder="Optional description" rows={2} onChange={f('description')} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Category *">
                  <select className={selectCls} onChange={f('category')}>
                    <option value="">Select…</option>
                    {['Performance','Sport','Touring','Off-Road','Economy','Winter'].map(c=><option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Season *">
                  <select className={selectCls} onChange={f('season')}>
                    <option value="">Select…</option>
                    {['Summer','All-Season','Winter','All-Weather'].map(s=><option key={s}>{s}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Image URL"><input className={inputCls} placeholder="https://…" onChange={f('imageUrl')} /></Field>
            </>}
            {modal === 'variant' && <>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Width (mm) *"><input className={inputCls} type="number" placeholder="255" onChange={f('width')} /></Field>
                <Field label="Aspect Ratio *"><input className={inputCls} type="number" placeholder="35" onChange={f('aspectRatio')} /></Field>
                <Field label="Rim Dia (in) *"><input className={inputCls} type="number" step="0.5" placeholder="19" onChange={f('rimDiameter')} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Load Index *"><input className={inputCls} type="number" placeholder="98" onChange={f('loadIndex')} /></Field>
                <Field label="Speed Rating *"><input className={inputCls} placeholder="Y" onChange={f('speedRating')} /></Field>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Wet Grip *">
                  <select className={selectCls} onChange={f('wetGrip')}>
                    <option value="">Select…</option>
                    {['A','B','C','D','E'].map(g=><option key={g}>{g}</option>)}
                  </select>
                </Field>
                <Field label="Dry Perf (1-10) *"><input className={inputCls} type="number" step="0.1" min="1" max="10" placeholder="9.2" onChange={f('dryPerformance')} /></Field>
                <Field label="Comfort (1-10) *"><input className={inputCls} type="number" step="0.1" min="1" max="10" placeholder="7.5" onChange={f('comfortRating')} /></Field>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Treadwear *"><input className={inputCls} type="number" placeholder="280" onChange={f('treadwear')} /></Field>
                <Field label="Price (₹) *"><input className={inputCls} type="number" placeholder="15000" onChange={f('price')} /></Field>
                <Field label="Stock Qty *"><input className={inputCls} type="number" placeholder="20" onChange={f('stockQty')} /></Field>
              </div>
              <Field label="SKU *"><input className={inputCls} placeholder="TYR-001-255-35-19" onChange={f('sku')} /></Field>
            </>}
            {modal === 'stock' && <>
              <div className="bg-[#1a1d28] rounded-xl p-4 border border-zinc-800 mb-2">
                <p className="text-xs text-zinc-500">Editing variant SKU: <span className="text-zinc-300 font-mono">{selected?.sku}</span></p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="New Price (₹)"><input className={inputCls} type="number" defaultValue={selected?.price} onChange={f('price')} /></Field>
                <Field label="New Stock Qty"><input className={inputCls} type="number" defaultValue={selected?.stockQty} onChange={f('stockQty')} /></Field>
              </div>
            </>}

            {msg && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5 text-sm text-red-400">{msg}</div>}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-semibold hover:border-zinc-600 transition-colors">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all disabled:opacity-60">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ORDERS TAB
// ═══════════════════════════════════════════════════════════════════════════════
function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<any>(null)
  const [form, setForm] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/orders')
    const data = await res.json()
    setOrders(data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const save = async () => {
    setSaving(true)
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: modal.id, ...form }),
    })
    setSaving(false)
    setModal(null)
    load()
  }

  const f = (k: string) => (e: any) => setForm(prev => ({ ...prev, [k]: e.target.value }))

  if (loading) return <div className="text-center py-20 text-zinc-500">Loading orders…</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-white">Orders</h3>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold uppercase transition-all">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#1a1d28] border-b border-zinc-800">
              <th className="text-left px-5 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Order ID</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Customer</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Amount</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Items</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Date</th>
              <th className="text-right px-5 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {orders.length === 0 && (
              <tr><td colSpan={7} className="text-center py-12 text-zinc-600">No orders found</td></tr>
            )}
            {orders.map((o: any) => (
              <tr key={o.id} className="hover:bg-[#1a1d28]/50 transition-colors">
                <td className="px-5 py-4 font-mono text-[11px] text-zinc-400">#{o.id.slice(-8).toUpperCase()}</td>
                <td className="px-4 py-4">
                  <p className="font-semibold text-white text-sm">{o.user?.name || 'Guest'}</p>
                  <p className="text-[10px] text-zinc-500">{o.user?.email}</p>
                </td>
                <td className="px-4 py-4 font-bold text-white">₹{o.totalAmount?.toLocaleString()}</td>
                <td className="px-4 py-4 text-zinc-400 text-xs">{o.items?.length || 0} items</td>
                <td className="px-4 py-4"><StatusBadge status={o.status} /></td>
                <td className="px-4 py-4 text-zinc-500 text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="px-5 py-4 text-right">
                  <button onClick={() => { setModal(o); setForm({ status: o.status, trackingNumber: o.trackingNumber || '' }) }} className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 ml-auto">
                    <Edit3 className="w-3 h-3" /> Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={`Update Order #${modal.id.slice(-8).toUpperCase()}`} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div className="bg-[#1a1d28] rounded-xl p-4 border border-zinc-800 text-xs space-y-1">
              <p className="text-zinc-500">Customer: <span className="text-zinc-300">{modal.user?.name} ({modal.user?.email})</span></p>
              <p className="text-zinc-500">Amount: <span className="text-white font-bold">₹{modal.totalAmount?.toLocaleString()}</span></p>
              <p className="text-zinc-500">Address: <span className="text-zinc-300">{modal.shippingAddress}</span></p>
            </div>
            <Field label="Order Status">
              <select className={selectCls} value={form.status} onChange={f('status')}>
                {['PENDING','PROCESSING','SHIPPED','DELIVERED','CANCELLED'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Tracking Number">
              <input className={inputCls} value={form.trackingNumber} placeholder="e.g. DTDC12345678IN" onChange={f('trackingNumber')} />
            </Field>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-semibold hover:border-zinc-600">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold disabled:opacity-60">
                {saving ? 'Saving…' : 'Update Order'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// OVERVIEW TAB
// ═══════════════════════════════════════════════════════════════════════════════
function OverviewTab() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(d => { setData(d); setLoading(false) })
  }, [])

  if (loading) return <div className="text-center py-20 text-zinc-500">Loading dashboard…</div>
  if (!data) return null

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="Total Revenue" value={`₹${(data.stats.totalRevenue || 0).toLocaleString()}`} color="bg-green-500/15 text-green-400" />
        <StatCard icon={ShoppingBag} label="Total Orders" value={data.stats.totalOrders} color="bg-blue-500/15 text-blue-400" />
        <StatCard icon={Clock} label="Pending Orders" value={data.stats.pendingOrders} color="bg-yellow-500/15 text-yellow-400" />
        <StatCard icon={Car} label="Vehicle Variants" value={data.stats.totalVehicleVariants} color="bg-purple-500/15 text-purple-400" />
        <StatCard icon={Disc} label="Wheel Models" value={data.stats.totalWheels} color="bg-indigo-500/15 text-indigo-400" />
        <StatCard icon={Package} label="Tyre Models" value={data.stats.totalTyres} color="bg-pink-500/15 text-pink-400" />
        <StatCard icon={Users} label="Manufacturers" value={data.stats.totalManufacturers} color="bg-cyan-500/15 text-cyan-400" />
        <StatCard icon={CheckCircle} label="Delivered" value={data.recentOrders?.filter((o:any)=>o.status==='DELIVERED').length || 0} color="bg-emerald-500/15 text-emerald-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div>
          <h4 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Recent Orders</h4>
          <div className="space-y-2">
            {data.recentOrders?.length === 0 && <p className="text-zinc-600 text-sm">No orders yet</p>}
            {data.recentOrders?.map((o: any) => (
              <div key={o.id} className="flex items-center justify-between px-4 py-3 bg-[#1a1d28] rounded-xl border border-zinc-800">
                <div>
                  <p className="text-xs font-bold text-white">#{o.id.slice(-8).toUpperCase()}</p>
                  <p className="text-[10px] text-zinc-500">{o.user?.name || 'Guest'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">₹{o.totalAmount?.toLocaleString()}</p>
                  <StatusBadge status={o.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div>
          <h4 className="text-sm font-black text-white mb-4 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" /> Low Stock Alerts
          </h4>
          <div className="space-y-2">
            {(data.lowStockWheels?.length === 0 && data.lowStockTyres?.length === 0) && (
              <p className="text-zinc-600 text-sm">All stock levels healthy ✓</p>
            )}
            {data.lowStockWheels?.map((v: any) => (
              <div key={v.id} className="flex items-center justify-between px-4 py-3 bg-yellow-500/5 rounded-xl border border-yellow-500/20">
                <div>
                  <p className="text-xs font-bold text-white">{v.wheel?.brand?.name} {v.wheel?.modelName}</p>
                  <p className="text-[10px] text-zinc-500 font-mono">{v.sku}</p>
                </div>
                <span className="text-yellow-400 font-black text-lg">{v.stockQty}</span>
              </div>
            ))}
            {data.lowStockTyres?.map((v: any) => (
              <div key={v.id} className="flex items-center justify-between px-4 py-3 bg-yellow-500/5 rounded-xl border border-yellow-500/20">
                <div>
                  <p className="text-xs font-bold text-white">{v.tyre?.brand?.name} {v.tyre?.modelName}</p>
                  <p className="text-[10px] text-zinc-500 font-mono">{v.sku}</p>
                </div>
                <span className="text-yellow-400 font-black text-lg">{v.stockQty}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ADMIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'vehicles', label: 'Vehicles', icon: Car },
  { id: 'wheels', label: 'Wheels', icon: Disc },
  { id: 'tyres', label: 'Tyres', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
]

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('apexfitment_admin') === 'true'
    if (!isAdmin) {
      router.replace('/admin/login')
    } else {
      setAuthed(true)
    }
  }, [router])

  const logout = () => {
    sessionStorage.removeItem('apexfitment_admin')
    router.push('/admin/login')
  }

  if (authed === null) {
    return <div className="min-h-screen bg-[#090a0f] flex items-center justify-center text-zinc-500">Checking authentication…</div>
  }

  return (
    <div className="min-h-screen bg-[#090a0f] text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#090a0f]/95 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Disc className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black tracking-wider text-white">APEX<span className="text-blue-500">FITMENT</span></span>
            </Link>
            <span className="hidden sm:block px-2.5 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-wider">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              <Wrench className="w-3.5 h-3.5" /> View Site
            </Link>
            <button onClick={logout} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-xs font-semibold transition-all">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-56 shrink-0">
          <div className="bg-[#12141c] border border-zinc-800/80 rounded-2xl p-3 space-y-1 sticky top-24">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-3 pt-1 pb-2">Navigation</p>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-zinc-400 hover:bg-[#1a1d28] hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                {tab.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-[#12141c] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 min-h-[600px]">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'vehicles' && <VehiclesTab />}
          {activeTab === 'wheels' && <WheelsTab />}
          {activeTab === 'tyres' && <TyresTab />}
          {activeTab === 'orders' && <OrdersTab />}
        </main>
      </div>
    </div>
  )
}
