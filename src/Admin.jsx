import React, { useState, useEffect } from 'react'
import { Trash2, Plus, Save } from 'lucide-react'
import { supabase, supabaseConfigured } from './supabaseClient'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'changeme'

const INK = '#1C1A17'
const BONE = '#F1ECE0'
const BRASS = '#B08D57'

const BLANK_PRODUCT = {
  name: '', category: 'long-sleeve', subcategory: '', subheading: '', price: '', image: '', sizes: '', colors: '', in_stock: true,
}

// Uploads a photo to the "product-images" bucket and returns its public URL.
// Used by both the "add product" form and the edit rows below.
async function uploadImage(file) {
  const ext = file.name.split('.').pop()
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('product-images').upload(path, file)
  if (error) throw error
  const { data } = supabase.storage.from('product-images').getPublicUrl(path)
  return data.publicUrl
}

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem('threadsmith-admin') === 'true')
  const [passwordInput, setPasswordInput] = useState('')
  const [loginError, setLoginError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem('threadsmith-admin', 'true')
      setLoggedIn(true)
    } else {
      setLoginError('Wrong password — try again.')
    }
  }

  if (!supabaseConfigured) {
    return (
      <Centered>
        <p className="text-sm max-w-sm text-center" style={{ color: INK }}>
          The admin page needs Supabase set up first. Follow the "Connect Supabase"
          section in the README, then reload this page.
        </p>
      </Centered>
    )
  }

  if (!loggedIn) {
    return (
      <Centered>
        <form onSubmit={handleLogin} className="w-full max-w-xs">
          <h1 className="text-2xl mb-6 text-center" style={{ fontFamily: 'Fraunces, serif', color: INK }}>
            Threadsmith Admin
          </h1>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full px-4 py-3 rounded-sm border border-black/15 mb-3"
          />
          {loginError && <p className="text-sm text-red-700 mb-3">{loginError}</p>}
          <button
            type="submit"
            className="w-full py-3 font-semibold text-sm rounded-sm"
            style={{ backgroundColor: BRASS, color: INK }}
          >
            Log in
          </button>
        </form>
      </Centered>
    )
  }

  return <ProductManager />
}

function Centered({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: BONE }}>
      {children}
    </div>
  )
}

function ProductManager() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState(BLANK_PRODUCT)
  const [saving, setSaving] = useState(false)
  const [draftUploading, setDraftUploading] = useState(false)
  const [rowUploadingId, setRowUploadingId] = useState(null)

  const loadProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('products').select('*').order('id')
    if (!error) setProducts(data)
    setLoading(false)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const addProduct = async (e) => {
    e.preventDefault()
    if (!draft.image) {
      alert('Add a photo first — paste a URL or upload one.')
      return
    }
    setSaving(true)
    const { error } = await supabase.from('products').insert([
      { ...draft, price: parseFloat(draft.price) || 0 },
    ])
    setSaving(false)
    if (error) {
      alert('Could not save: ' + error.message)
      return
    }
    setDraft(BLANK_PRODUCT)
    loadProducts()
  }

  const updateField = (id, field, value) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const handleDraftUpload = async (file) => {
    setDraftUploading(true)
    try {
      const url = await uploadImage(file)
      setDraft((d) => ({ ...d, image: url }))
    } catch (err) {
      alert('Could not upload photo: ' + err.message)
    } finally {
      setDraftUploading(false)
    }
  }

  const handleRowUpload = async (id, file) => {
    setRowUploadingId(id)
    try {
      const url = await uploadImage(file)
      updateField(id, 'image', url)
    } catch (err) {
      alert('Could not upload photo: ' + err.message)
    } finally {
      setRowUploadingId(null)
    }
  }

  const saveRow = async (product) => {
    const { error } = await supabase
      .from('products')
      .update({ ...product, price: parseFloat(product.price) || 0 })
      .eq('id', product.id)
    if (error) alert('Could not save: ' + error.message)
  }

  const deleteRow = async (id) => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      alert('Could not delete: ' + error.message)
      return
    }
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div style={{ backgroundColor: BONE, minHeight: '100vh' }} className="px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl" style={{ fontFamily: 'Fraunces, serif', color: INK }}>
            Manage Products
          </h1>
          <a href="/" className="text-xs underline" style={{ color: INK }}>View live site →</a>
        </div>

        {/* Add new product */}
        <form onSubmit={addProduct} className="bg-white/60 border border-black/10 rounded-md p-6 mb-10">
          <h2 className="text-sm font-semibold mb-4 uppercase tracking-wide" style={{ color: INK }}>
            Add a new product
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <input required placeholder="Name (e.g. The Oxford)" value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="px-3 py-2 rounded-sm border border-black/15" />

            <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              className="px-3 py-2 rounded-sm border border-black/15">
              <option value="long-sleeve">Long-sleeve</option>
              <option value="short-sleeve">Short-sleeve</option>
            </select>

            <input placeholder="Subcategory (e.g. Formal, Casual, Business)" value={draft.subcategory}
              onChange={(e) => setDraft({ ...draft, subcategory: e.target.value })}
              className="px-3 py-2 rounded-sm border border-black/15" />

            <input placeholder="Subheading (e.g. Sharp tailoring, all day)" value={draft.subheading}
              onChange={(e) => setDraft({ ...draft, subheading: e.target.value })}
              className="px-3 py-2 rounded-sm border border-black/15 sm:col-span-2" />

            <input required type="number" step="0.01" placeholder="Price (GHS)" value={draft.price}
              onChange={(e) => setDraft({ ...draft, price: e.target.value })}
              className="px-3 py-2 rounded-sm border border-black/15" />

            <ImageField
              value={draft.image}
              onChange={(v) => setDraft({ ...draft, image: v })}
              uploading={draftUploading}
              onFileSelect={handleDraftUpload}
            />

            <input required placeholder="Sizes, slash-separated (S/M/L/XL)" value={draft.sizes}
              onChange={(e) => setDraft({ ...draft, sizes: e.target.value })}
              className="px-3 py-2 rounded-sm border border-black/15" />

            <input required placeholder="Colors, slash-separated (White/Navy Blue)" value={draft.colors}
              onChange={(e) => setDraft({ ...draft, colors: e.target.value })}
              className="px-3 py-2 rounded-sm border border-black/15" />

            <label className="flex items-center gap-2 text-sm px-1 sm:col-span-2" style={{ color: INK }}>
              <input type="checkbox" checked={draft.in_stock}
                onChange={(e) => setDraft({ ...draft, in_stock: e.target.checked })} />
              In stock
            </label>
          </div>
          <button type="submit" disabled={saving}
            className="mt-4 flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-sm"
            style={{ backgroundColor: BRASS, color: INK }}>
            <Plus size={16} /> {saving ? 'Adding…' : 'Add product'}
          </button>
        </form>

        {/* Existing products */}
        {loading ? (
          <p className="text-sm" style={{ color: INK }}>Loading…</p>
        ) : (
          <div className="space-y-4">
            {products.map((p) => (
              <div key={p.id} className="bg-white/60 border border-black/10 rounded-md p-5">
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Name" value={p.name} onChange={(v) => updateField(p.id, 'name', v)} />
                  <Field label="Subcategory" value={p.subcategory} onChange={(v) => updateField(p.id, 'subcategory', v)} />
                  <Field label="Subheading" value={p.subheading} onChange={(v) => updateField(p.id, 'subheading', v)} />
                  <Field label="Price (GHS)" type="number" value={p.price} onChange={(v) => updateField(p.id, 'price', v)} />
                  <ImageField
                    value={p.image}
                    onChange={(v) => updateField(p.id, 'image', v)}
                    uploading={rowUploadingId === p.id}
                    onFileSelect={(file) => handleRowUpload(p.id, file)}
                  />
                  <Field label="Sizes" value={p.sizes} onChange={(v) => updateField(p.id, 'sizes', v)} />
                  <Field label="Colors" value={p.colors} onChange={(v) => updateField(p.id, 'colors', v)} />
                </div>
                <label className="flex items-center gap-2 text-sm mt-3" style={{ color: INK }}>
                  <input type="checkbox" checked={p.in_stock !== false}
                    onChange={(e) => updateField(p.id, 'in_stock', e.target.checked)} />
                  In stock
                </label>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => saveRow(p)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-sm"
                    style={{ backgroundColor: INK, color: BONE }}>
                    <Save size={14} /> Save
                  </button>
                  <button onClick={() => deleteRow(p.id)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-sm border border-red-800/30 text-red-800">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <label className="text-xs">
      <span className="block mb-1 text-black/50 uppercase tracking-wide">{label}</span>
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-sm border border-black/15 text-sm"
      />
    </label>
  )
}

// Photo field: a thumbnail preview, a plain URL input (for when the client
// already has a link), and an "Upload a photo" button (for when the photo
// is only on their phone) — either one fills the same field.
function ImageField({ value, onChange, uploading, onFileSelect }) {
  return (
    <div className="sm:col-span-2">
      <span className="block mb-1 text-xs text-black/50 uppercase tracking-wide">Photo</span>
      <div className="flex items-start gap-3">
        {value && (
          <img src={value} alt="" className="w-14 h-14 object-cover rounded-sm border border-black/10 shrink-0" />
        )}
        <div className="flex-1 space-y-2">
          <input
            type="text"
            placeholder="Paste an image URL"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 rounded-sm border border-black/15 text-sm"
          />
          <label
            className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-sm border border-black/15 cursor-pointer"
            style={{ color: INK }}
          >
            {uploading ? 'Uploading…' : 'Upload a photo'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) onFileSelect(file)
                e.target.value = '' // lets the same file be picked again later if needed
              }}
            />
          </label>
        </div>
      </div>
    </div>
  )
}
