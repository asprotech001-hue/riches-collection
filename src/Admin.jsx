import React, { useState, useEffect } from 'react'
import { Trash2, Plus, Save, Check, ExternalLink } from 'lucide-react'
import { supabase, supabaseConfigured } from './supabaseClient'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'changeme'

const INK = '#1C1A17'
const BONE = '#F1ECE0'
const BRASS = '#B08D57'

const BLANK_PRODUCT = {
  name: '', 
  category: 'long-sleeve', 
  subcategory: '', 
  subheading: '', 
  price: '', 
  image: '', 
  sizes: '', 
  colors: '', 
  in_stock: true,
}

// Compresses an image file in the browser using HTML Canvas and returns a Blob
function compressImage(file, maxDimension = 1200, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => {
        let width = img.width
        let height = img.height

        // Calculate new dimensions while maintaining aspect ratio
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          } else {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        // Convert canvas back to JPEG Blob with custom quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
              const compressedFile = new File([blob], `${nameWithoutExt}.jpg`, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              reject(new Error('Canvas to Blob conversion failed'))
            }
          },
          'image/jpeg',
          quality
        )
      }
      img.onerror = (err) => reject(err)
    }
    reader.onerror = (err) => reject(err)
  })
}

// Updated upload function that compresses first
async function uploadImage(file) {
  const compressedFile = await compressImage(file, 1200, 0.75)
  const ext = 'jpg' 
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  
  const { error } = await supabase.storage
    .from('riches-collection')
    .upload(path, compressedFile)
    
  if (error) throw error
  
  const { data } = supabase.storage
    .from('riches-collection')
    .getPublicUrl(path)
    
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
        <p className="text-sm max-w-sm text-center font-medium" style={{ color: INK }}>
          The admin page needs Supabase set up first. Follow the "Connect Supabase"
          section in the README, then reload this page.
        </p>
      </Centered>
    )
  }

  if (!loggedIn) {
    return (
      <Centered>
        <form onSubmit={handleLogin} className="w-full max-w-xs bg-white p-8 rounded-md border border-black/5 shadow-sm">
          <h1 className="text-2xl mb-6 text-center font-serif" style={{ color: INK }}>
            Riche Admin
          </h1>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full px-4 py-3 rounded-sm border border-black/15 mb-3 text-sm focus:outline-none focus:border-black"
          />
          {loginError && <p className="text-xs text-red-700 mb-3 font-medium">{loginError}</p>}
          <button
            type="submit"
            className="w-full py-3 font-semibold text-sm rounded-sm transition-opacity hover:opacity-90"
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
  
  // Track save success per product row
  const [savedRowIds, setSavedRowIds] = useState(new Set())

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
      
    if (error) {
      alert('Could not save: ' + error.message)
    } else {
      // Show temporary "Saved" tick icon
      setSavedRowIds((prev) => new Set([...prev, product.id]))
      setTimeout(() => {
        setSavedRowIds((prev) => {
          const updated = new Set(prev)
          updated.delete(product.id)
          return updated
        })
      }, 2000)
    }
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
    <div style={{ backgroundColor: BONE, minHeight: '100vh' }} className="px-6 py-10 text-sm">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-serif" style={{ color: INK }}>
            Manage Products
          </h1>
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-xs underline flex items-center gap-1" style={{ color: INK }}>
            View live site <ExternalLink size={12} />
          </a>
        </div>

        {/* Add new product */}
        <form onSubmit={addProduct} className="bg-white/60 border border-black/10 rounded-md p-6 mb-10 shadow-sm">
          <h2 className="text-xs font-semibold mb-4 uppercase tracking-wider" style={{ color: INK }}>
            Add a new product
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <input required placeholder="Name (e.g. The Oxford)" value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="px-3 py-2 rounded-sm border border-black/15 text-sm bg-white focus:outline-none focus:border-black" />

            <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              className="px-3 py-2 rounded-sm border border-black/15 text-sm bg-white focus:outline-none focus:border-black">
              <option value="long-sleeve">Long-sleeve</option>
              <option value="short-sleeve">Short-sleeve</option>
            </select>

            <input placeholder="Subcategory (e.g. Formal, Casual, Business)" value={draft.subcategory}
              onChange={(e) => setDraft({ ...draft, subcategory: e.target.value })}
              className="px-3 py-2 rounded-sm border border-black/15 text-sm bg-white focus:outline-none focus:border-black" />

            <input placeholder="Subheading (e.g. Sharp tailoring, all day)" value={draft.subheading}
              onChange={(e) => setDraft({ ...draft, subheading: e.target.value })}
              className="px-3 py-2 rounded-sm border border-black/15 text-sm bg-white sm:col-span-2 focus:outline-none focus:border-black" />

            <input required type="number" step="0.01" placeholder="Price (GHS)" value={draft.price}
              onChange={(e) => setDraft({ ...draft, price: e.target.value })}
              className="px-3 py-2 rounded-sm border border-black/15 text-sm bg-white focus:outline-none focus:border-black" />

            <ImageField
              value={draft.image}
              onChange={(v) => setDraft({ ...draft, image: v })}
              uploading={draftUploading}
              onFileSelect={handleDraftUpload}
            />

            <input required placeholder="Sizes, slash-separated (S/M/L/XL)" value={draft.sizes}
              onChange={(e) => setDraft({ ...draft, sizes: e.target.value })}
              className="px-3 py-2 rounded-sm border border-black/15 text-sm bg-white focus:outline-none focus:border-black" />

            <input required placeholder="Colors, slash-separated (White/Navy Blue)" value={draft.colors}
              onChange={(e) => setDraft({ ...draft, colors: e.target.value })}
              className="px-3 py-2 rounded-sm border border-black/15 text-sm bg-white focus:outline-none focus:border-black" />

            <label className="flex items-center gap-2 text-sm px-1 sm:col-span-2 select-none cursor-pointer" style={{ color: INK }}>
              <input type="checkbox" checked={draft.in_stock}
                onChange={(e) => setDraft({ ...draft, in_stock: e.target.checked })} />
              In stock
            </label>
          </div>
          <button type="submit" disabled={saving}
            className="mt-4 flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: BRASS, color: INK }}>
            <Plus size={14} /> {saving ? 'Adding…' : 'Add product'}
          </button>
        </form>

        {/* Existing products */}
        {loading ? (
          <p className="text-sm font-medium" style={{ color: INK }}>Loading collection…</p>
        ) : (
          <div className="space-y-4">
            {products.map((p) => (
              <div key={p.id} className="bg-white/60 border border-black/10 rounded-md p-5 shadow-sm">
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Name" value={p.name} onChange={(v) => updateField(p.id, 'name', v)} />
                  
                  {/* Category Field added to rows to enable editing existing entries */}
                  <label className="text-xs">
                    <span className="block mb-1 text-black/50 uppercase tracking-wide">Category</span>
                    <select 
                      value={p.category || 'long-sleeve'} 
                      onChange={(e) => updateField(p.id, 'category', e.target.value)}
                      className="w-full px-3 py-2 rounded-sm border border-black/15 text-sm bg-white focus:outline-none focus:border-black"
                    >
                      <option value="long-sleeve">Long-sleeve</option>
                      <option value="short-sleeve">Short-sleeve</option>
                    </select>
                  </label>

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
                
                <label className="flex items-center gap-2 text-sm mt-3 select-none cursor-pointer" style={{ color: INK }}>
                  <input type="checkbox" checked={p.in_stock !== false}
                    onChange={(e) => updateField(p.id, 'in_stock', e.target.checked)} />
                  In stock
                </label>
                
                <div className="flex gap-3 mt-4">
                  <button onClick={() => saveRow(p)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-sm transition-opacity hover:opacity-90"
                    style={{ backgroundColor: INK, color: BONE }}>
                    {savedRowIds.has(p.id) ? (
                      <>
                        <Check size={14} className="text-green-400" /> Saved!
                      </>
                    ) : (
                      <>
                        <Save size={14} /> Save
                      </>
                    )}
                  </button>
                  <button onClick={() => deleteRow(p.id)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-sm border border-red-800/30 text-red-800 hover:bg-red-50/50 transition-colors">
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
        className="w-full px-3 py-2 rounded-sm border border-black/15 text-sm bg-white focus:outline-none focus:border-black"
      />
    </label>
  )
}

function ImageField({ value, onChange, uploading, onFileSelect }) {
  return (
    <div className="sm:col-span-2">
      <span className="block mb-1 text-xs text-black/50 uppercase tracking-wide">Photo</span>
      <div className="flex items-start gap-3">
        {value && (
          <img src={value} alt="Preview" className="w-14 h-14 object-cover rounded-sm border border-black/10 shrink-0" />
        )}
        <div className="flex-1 space-y-2">
          <input
            type="text"
            placeholder="Paste an image URL"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 rounded-sm border border-black/15 text-sm bg-white focus:outline-none focus:border-black"
          />
          <label
            className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-sm border border-black/15 cursor-pointer bg-white hover:bg-black/5 transition-colors"
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
                e.target.value = ''
              }}
            />
          </label>
        </div>
      </div>
    </div>
  )
}