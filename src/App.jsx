import React, { useState, useEffect } from 'react'
import { ShoppingBag, MessageCircle, ArrowDown, Plus } from 'lucide-react'
import { supabase, supabaseConfigured } from './supabaseClient'

/* =========================================================================
   1. EDIT THESE — the only things you'll usually need to change
   ========================================================================= */

// The client's WhatsApp number, digits only, with country code (no + or spaces).
const WHATSAPP_NUMBER = '233500000000'

// Used only if Supabase isn't set up yet, or can't be reached — so the site
// never breaks. Once Supabase is connected, real products (added from
// /admin) replace this automatically.
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: 'The Oxford',
    category: 'long-sleeve',
    subcategory: 'Formal',
    subheading: 'Sharp tailoring, all day',
    price: 350,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Sky Blue', hex: '#A9C4D8' },
      { name: 'White', hex: '#F7F5EF' },
      { name: 'Navy Blue', hex: '#22314A' },
    ],
    inStock: true,
  },
  {
    id: 2,
    name: 'The Linen',
    category: 'short-sleeve',
    subcategory: 'Casual',
    subheading: 'Casual comfort, redefined',
    price: 280,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800',
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Olive Green', hex: '#5C6B4F' },
      { name: 'Soft Sand', hex: '#D9C5A0' },
      { name: 'White', hex: '#F7F5EF' },
    ],
    inStock: false,
  },
  {
    id: 3,
    name: 'The Poplin',
    category: 'long-sleeve',
    subcategory: 'Business Casual',
    subheading: 'Crisp, clean, versatile',
    price: 320,
    image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=800',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'White', hex: '#F7F5EF' },
      { name: 'Navy Blue', hex: '#22314A' },
      { name: 'Black', hex: '#1C1A17' },
    ],
    inStock: true,
  },
]

// The three FAQ answers at the bottom of the page.
const FAQS = [
  {
    q: 'How do I find my size?',
    a: "Measure a shirt you already own, laid flat: chest, shoulder width, and sleeve length. Send us the numbers on WhatsApp and we'll match you to a size.",
  },
  {
    q: 'Can I exchange for a different size?',
    a: 'Unworn shirts with tags attached can be exchanged within 7 days of delivery.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Most orders within Accra arrive in 1–2 business days. Other regions typically take 3–5 business days.',
  },
]

// Maps a color name to a swatch color. Checked first, so these exact names
// always render correctly. Anything NOT in this list falls through to being
// tried as a plain CSS color name (see colorHex below) — which is why
// ordinary names like Red, Brown, Yellow, Green, Blue, Orange, Pink, Gray,
// Purple, etc. already work without needing an entry here.
const COLOR_HEX = {
  'Sky Blue': '#A9C4D8',
  'Navy Blue': '#22314A',
  'Olive Green': '#5C6B4F',
  'Soft Sand': '#D9C5A0',
  'Charcoal': '#3A3733',
  'Burgundy': '#5E2A2A',
}

function colorHex(name) {
  const trimmed = (name || '').trim()
  if (!trimmed) return '#8C6D3F'
  if (trimmed.startsWith('#')) return trimmed // a hex code was typed directly, e.g. "#27500A"
  if (COLOR_HEX[trimmed]) return COLOR_HEX[trimmed] // a known fashion name
  return trimmed.toLowerCase().replace(/\s+/g, '') // try it as a plain CSS color name
}

// Turns one row from the Supabase "products" table into the shape the
// page renders. Sizes and colors are stored as slash-separated text
// (e.g. "S/M/L/XL"), the same format the admin page writes.
function shapeProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    subcategory: row.subcategory,
    subheading: row.subheading,
    price: row.price,
    image: row.image,
    sizes: row.sizes ? row.sizes.split('/').map((s) => s.trim()) : ['M', 'L'],
    colors: row.colors
      ? row.colors.split('/').map((c) => c.trim()).map((c) => ({ name: c, hex: colorHex(c) }))
      : [{ name: 'Black', hex: colorHex('Black') }],
    inStock: row.in_stock !== false, // treat missing/null as in stock
  }
}

/* =========================================================================
   2. COLORS — change these two lines and the whole page re-colors
   ========================================================================= */

const INK = '#1C1A17'   // near-black, used for dark sections and text
const BONE = '#F1ECE0'  // warm off-white, the page background
const BRASS = '#B08D57' // the accent color, used on buttons

/* =========================================================================
   3. ONE REUSABLE PIECE — a stitched line, used as a divider everywhere.
      (This is the only "helper" in the file — everything else is inline
      below so you can read the page top to bottom.)
   ========================================================================= */
function StitchLine({ className = '', color = INK }) {
  return (
    <div
      className={className}
      style={{
        height: 1,
        opacity: 0.3,
        backgroundImage: `repeating-linear-gradient(90deg, ${color} 0, ${color} 6px, transparent 6px, transparent 12px)`,
      }}
    />
  )
}

/* =========================================================================
   4. THE PAGE
   ========================================================================= */
export default function App() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS)
  const [loading, setLoading] = useState(supabaseConfigured)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    if (!supabaseConfigured) return // no database connected yet — just use the fallback list above

    supabase
      .from('products')
      .select('*')
      .order('id')
      .then(({ data, error }) => {
        if (error) {
          console.error('Could not load products, showing fallback products instead:', error.message)
          return
        }
        if (data && data.length > 0) setProducts(data.map(shapeProduct))
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ backgroundColor: BONE, color: INK }} className="min-h-screen font-sans">

      {/* ---------- NAV BAR ---------- */}
      <nav className="sticky top-0 z-20 backdrop-blur-md border-b border-black/10 px-6 py-3 flex justify-between items-center"
           style={{ backgroundColor: `${BONE}E6` }}>
        <span className="text-lg tracking-wide" style={{ fontFamily: 'Fraunces, serif' }}>Riche's Collection</span>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-sm"
          style={{ backgroundColor: INK, color: BONE }}
        >
          <MessageCircle size={14} />
          Talk to us
        </a>
      </nav>

      {/* ---------- HERO ---------- */}
      <header className="px-6 pt-16 pb-14 text-center" style={{ backgroundColor: INK, color: BONE }}>
        <span className="text-[11px] uppercase tracking-[0.25em]" style={{ color: BRASS, fontFamily: 'IBM Plex Mono, monospace' }}>
          This is the home of a Gentle Man, Grab your fit
        </span>

        <h1 className="mt-6 text-5xl sm:text-6xl leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 500 }}>
          Riche's Collection.
          <br />
          <em style={{ color: BRASS }}>Worn well.</em>
        </h1>

        <p className="mt-6 max-w-lg mx-auto text-base font-light leading-relaxed" style={{ color: `${BONE}B3` }}>
          Long-sleeve and short-sleeve shirts, hand-finished from breathable
          premium cloth and tailored to sit right at the shoulder, cuff, and collar.
          Here is a Home of quality
        </p>

        <a
          href="#collection"
          className="mt-9 inline-flex items-center gap-2 px-8 py-4 font-semibold text-sm rounded-sm"
          style={{ backgroundColor: BRASS, color: INK }}
        >
          See the Collection
          <ArrowDown size={16} />
        </a>
      </header>

      {/* ---------- PRODUCT COLLECTION ---------- */}
      <section id="collection" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[11px] uppercase tracking-[0.25em]" style={{ color: BRASS, fontFamily: 'IBM Plex Mono, monospace' }}>
              The Collection
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl" style={{ fontFamily: 'Fraunces, serif' }}>
              Look Smart. Every occasion.
            </h2>
            <StitchLine className="w-16 mx-auto mt-5" />

            {/* filter tabs */}
            <div className="flex justify-center gap-2 mt-8 rounded-md p-1.5 max-w-sm mx-auto" style={{ backgroundColor: '#E7DFCE' }}>
              {['all', 'long-sleeve', 'short-sleeve'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className="flex-1 py-2 px-3 rounded-sm text-[11px] font-semibold uppercase tracking-wider transition-colors"
                  style={{
                    fontFamily: 'IBM Plex Mono, monospace',
                    backgroundColor: activeFilter === tab ? '#FAF7EF' : 'transparent',
                    color: activeFilter === tab ? INK : 'rgba(28,26,23,0.5)',
                  }}
                >
                  {tab === 'all' ? 'All' : tab.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="text-center text-black/40 text-sm">Loading the collection…</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products
                .filter((p) => activeFilter === 'all' || p.category === activeFilter)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="px-6 py-20" style={{ backgroundColor: INK, color: BONE }}>
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[11px] uppercase tracking-[0.25em]" style={{ color: BRASS, fontFamily: 'IBM Plex Mono, monospace' }}>
              Sizing &amp; FAQ
            </span>
            <h2 className="mt-3 text-3xl" style={{ fontFamily: 'Fraunces, serif' }}>Before you order</h2>
          </div>
          <FaqList />
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="py-8 px-6 text-center text-xs" style={{ backgroundColor: '#E7DFCE', color: `${INK}99` }}>
        &copy; {new Date().getFullYear()} Riche's Collection. All rights reserved.
      </footer>
    </div>
  )
}

/* =========================================================================
   5. THE PRODUCT CARD — one card per shirt: image, price, colors, sizes,
      and the "Order via WhatsApp" button.

   `product.colors` always arrives here as an array of { name, hex } —
   either from FALLBACK_PRODUCTS above, or from shapeProduct() turning the
   Supabase row's slash-separated text into the same shape. So this
   component never needs to parse a raw string itself.
   ========================================================================= */
function ProductCard({ product }) {
  const [size, setSize] = useState('')
  const [color, setColor] = useState(product.colors[0]?.name || '')

  const outOfStock = product.inStock === false

  const handleOrder = () => {
    if (!size || outOfStock) return
    const message = `Hello! I'd like to order:
- Product: ${product.name}
- Size: ${size}
- Color: ${color}
- Price: GHS ${Number(product.price).toFixed(2)}

Please confirm and share payment details.`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div
      className="rounded-md overflow-hidden flex flex-col relative border border-black/10"
      style={{ backgroundColor: '#FAF7EF', opacity: outOfStock ? 0.7 : 1 }}
    >
      {/* image */}
      <div className="h-72 overflow-hidden relative bg-black/5">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-top"
          style={{ filter: outOfStock ? 'grayscale(0.6)' : 'none' }}
        />
        <span
          className="absolute bottom-3 right-3 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-sm"
          style={{ backgroundColor: `${INK}E6`, color: BONE, fontFamily: 'IBM Plex Mono, monospace' }}
        >
          {product.category}
        </span>
        <span
          className="absolute top-3 left-3 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-sm font-semibold"
          style={outOfStock
            ? { backgroundColor: '#F7C1C1', color: '#791F1F' }
            : { backgroundColor: '#C0DD97', color: '#27500A' }}
        >
          {outOfStock ? 'Out of stock' : 'In stock'}
        </span>
      </div>

      {/* details */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl leading-tight" style={{ fontFamily: 'Fraunces, serif' }}>{product.name}</h3>
              <p className="text-[11px] mt-1 uppercase tracking-widest text-black/45" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                {product.subcategory ? `${product.subcategory} — ` : ''}{product.subheading}
              </p>
            </div>
            <p className="text-lg whitespace-nowrap pt-1" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
              GHS {Number(product.price).toFixed(2)}
            </p>
          </div>

          <StitchLine className="my-4" />

          {/* colors */}
          {product.colors.length > 0 && (
            <div className="mb-4">
              <span className="text-[10px] uppercase tracking-widest text-black/45 block mb-2" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                Cloth — <span className="font-semibold text-black/80">{color}</span>
              </span>
              <div className="flex gap-2.5 flex-wrap">
                {product.colors.map((c) => {
                  const isSelected = color === c.name
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setColor(c.name)}
                      title={c.name}
                      className="w-9 h-9 rounded-full border transition-all duration-150 flex items-center justify-center"
                      style={{
                        backgroundColor: c.hex,
                        borderColor: isSelected ? INK : 'rgba(0,0,0,0.15)',
                        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                        boxShadow: isSelected ? '0 0 0 2px rgba(0,0,0,0.1)' : 'none',
                      }}
                    >
                      {isSelected && (
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor: c.hex.toLowerCase() === 'white' || c.hex === '#ffffff' ? '#000' : '#fff',
                          }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* sizes */}
          {product.sizes.length > 0 && (
            <div className="mb-5">
              <span className="text-[10px] uppercase tracking-widest text-black/45 block mb-2" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                Size
              </span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className="w-9 h-9 text-xs font-medium rounded-sm border flex items-center justify-center"
                    style={{
                      fontFamily: 'IBM Plex Mono, monospace',
                      backgroundColor: size === s ? INK : 'transparent',
                      borderColor: size === s ? INK : 'rgba(0,0,0,0.2)',
                      color: size === s ? BONE : 'rgba(0,0,0,0.7)',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* order button */}
        <button
          onClick={handleOrder}
          disabled={!size || outOfStock}
          className="w-full py-3 font-semibold text-sm rounded-sm flex items-center justify-center gap-2"
          style={{
            backgroundColor: !outOfStock && size ? BRASS : 'rgba(0,0,0,0.12)',
            color: !outOfStock && size ? INK : 'rgba(0,0,0,0.4)',
            cursor: !outOfStock && size ? 'pointer' : 'not-allowed',
          }}
        >
          <ShoppingBag size={16} />
          {outOfStock ? 'Out of stock' : size ? 'Order via WhatsApp' : 'Select a size'}
        </button>
      </div>
    </div>
  )
}

/* =========================================================================
   6. THE FAQ LIST — click a question to expand its answer.
   ========================================================================= */
function FaqList() {
  const [open, setOpen] = useState(0)

  return (
    <div>
      {FAQS.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q}>
            <button onClick={() => setOpen(isOpen ? -1 : i)} className="w-full flex items-center justify-between py-4 text-left">
              <span style={{ fontFamily: 'Fraunces, serif' }} className="text-base">{item.q}</span>
              <Plus size={16} style={{ color: BRASS, transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {isOpen && <p className="text-sm pb-5 pr-6" style={{ color: `${BONE}A6` }}>{item.a}</p>}
            <StitchLine color={BONE} />
          </div>
        )
      })}
    </div>
  )
}
