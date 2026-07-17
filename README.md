<<<<<<< HEAD
# ElSeyOn — Agency Landing Page

Same pattern as the Threadsmith build: everything you'll usually touch is
in **one file**, `src/App.jsx`, in a clearly labeled section at the top.
=======
# Threadsmith — Landing Page

There are two pages here, each in its own file:

- **`src/App.jsx`** — the public landing page. Edit `WHATSAPP_NUMBER` and
  `FALLBACK_PRODUCTS` here if needed.
- **`src/Admin.jsx`** — the password-protected page at `/admin` where the
  client manages products directly (see below).

Everything else (`main.jsx`, config files) is plumbing you shouldn't need
to open.
>>>>>>> cda789b876409e0cfc4bbd7d03c93bc27bca7df5

## Run it

```bash
npm install
npm run dev
```

<<<<<<< HEAD
## Editing

Open `src/App.jsx`. Section 1 at the top has:
- `WHATSAPP_NUMBER`, `PHONE_1`, `PHONE_2`, `EMAIL`, `LOCATION`
- `SERVICES` — one object per service card
- `PORTFOLIO` — one object per project; add a real `url` once each site is live

Section 2 has the four brand colors — change any of them and the whole
site re-colors.

## Design notes

The visual language leans into "Digital Business Architect" literally:
- **Dimension lines** (`DimensionLine`) — tick, line, tick with a label,
  like a measurement on a technical drawing — used as section dividers
  instead of a plain line
- **Blueprint grid** (`BlueprintGrid`) — faint graph-paper lines behind the hero
- **Spec cards** (`SpecCard`) — service cards with architectural corner
  brackets instead of a plain border, each tagged `SPEC_01` through `SPEC_06`
  like an engineering spec sheet

## Deploy
=======
Open the link it prints (usually `http://localhost:5173`).

## Making changes

Open `src/App.jsx`. The top of the file is split into numbered sections
with comments — you only ever need section **1**:

- **`WHATSAPP_NUMBER`** — the client's WhatsApp number (digits only, with
  country code, e.g. `233501234567`)
- **`PRODUCTS`** — one object per shirt. Copy an existing one, paste it into
  the array, and edit the fields (name, price, image link, sizes, colors).
- **`FAQS`** — the questions at the bottom of the page.

Save the file and the browser updates automatically — no restart needed.

## If something breaks

Because it's one file, the error message in your terminal or browser
console will point at a specific line inside `App.jsx` — just scroll to
that line number. There's no hunting across multiple component files.

Common mistakes:
- Forgetting a comma between products in the `PRODUCTS` array
- An image link that's broken or private (test it by pasting it into a browser tab first)
- Missing a closing curly brace `}` after adding a new product

## Going live
>>>>>>> cda789b876409e0cfc4bbd7d03c93bc27bca7df5

```bash
npm run build
```

<<<<<<< HEAD
Push to GitHub, connect on Vercel — same flow as the Threadsmith project.

## Before going live
- [ ] Add the real deployed URL for Riche's Collection to `PORTFOLIO`
- [ ] Add more portfolio entries as you ship more client sites
- [ ] Double-check `WHATSAPP_NUMBER` is correct and active
- [ ] **Once you have a live domain**, open `index.html` and fill in the
      commented-out `og:url` and absolute `og:image` lines — WhatsApp and
      other apps need a full `https://...` URL to reliably show the link
      preview image, a relative path only works once deployed with a known domain
=======
Then drag the generated `dist` folder onto **netlify.com/drop** — that's it,
no account or config needed for a one-off deploy. For something you'll keep
updating, push the folder to GitHub and connect it on Vercel or Netlify instead.

## Letting the client update products themselves (Admin page)

There's a hidden page at **`/admin`** where the client can add, edit, and
delete products directly on the website — no spreadsheet, no code.

### 1. Create the database (one-time, ~5 minutes)
1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New Query**, paste the contents of `supabase-schema.sql`
   from this folder, and click **Run**. This creates the `products` table
   and adds two sample products to start with.
3. In **Project Settings → API**, copy the **Project URL** and the
   **anon public** key.

### 2. Connect the app
1. Copy `.env.example` to a new file named `.env`.
2. Paste in the Supabase URL and anon key from step 1.
3. Set `VITE_ADMIN_PASSWORD` to whatever password the client will use to
   log into `/admin`.
4. Restart `npm run dev` (or redeploy, if it's already live).

### 3. Using it
- **Live site:** `yoursite.com`
- **Admin page:** `yoursite.com/admin`

The client opens `/admin`, enters the password, and can add a new shirt,
edit a price, or delete a sold-out item — changes appear on the live site
immediately. A few fields worth knowing about:

- **Photo** — either paste an image URL, or click **Upload a photo** to
  pick one straight from a phone or computer. Both fill the same field, so
  it doesn't matter which the client uses. Uploaded photos are stored in a
  Supabase Storage bucket called `product-images` (created automatically by
  `supabase-schema.sql`).
- **Subcategory** — a free-text tag like "Formal", "Casual", or "Business",
  shown next to the subheading on each product card. There's no fixed list —
  type whatever the client calls their own styles.
- **In stock** — a checkbox. Unchecking it puts a red "Out of stock" badge
  on the card, grays out the photo, and disables the order button so
  customers can't order something that isn't available.

The public page also has filter tabs (All / Long-sleeve / Short-sleeve)
above the collection so shoppers can narrow down what they're browsing.

**If you already ran `supabase-schema.sql` before photo upload was added**,
just re-run it — the bucket-creation part uses `on conflict do nothing`, so
it's safe to run again without duplicating your products.

### A note on security
The password on `/admin` stops casual visitors from finding the page and
poking around, but it isn't full account security — someone determined
enough, digging through the site's code, could technically find a way to
write to the database directly without knowing the password. For a small
shop's product catalog, that's a reasonable tradeoff for how simple this
setup is. If the client ever handles something more sensitive than "which
shirts are for sale," ask and I can upgrade this to real Supabase
authentication (proper login accounts instead of one shared password).

### If Supabase isn't connected yet
The live site automatically falls back to the sample products in
`FALLBACK_PRODUCTS` inside `App.jsx`, and `/admin` will tell you Supabase
needs to be set up first — so nothing breaks in the meantime.
>>>>>>> cda789b876409e0cfc4bbd7d03c93bc27bca7df5
