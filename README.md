# ElSeyOn — Agency Landing Page

Same pattern as the Threadsmith build: everything you'll usually touch is
in **one file**, `src/App.jsx`, in a clearly labeled section at the top.

## Run it

```bash
npm install
npm run dev
```

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

```bash
npm run build
```

Push to GitHub, connect on Vercel — same flow as the Threadsmith project.

## Before going live
- [ ] Add the real deployed URL for Riche's Collection to `PORTFOLIO`
- [ ] Add more portfolio entries as you ship more client sites
- [ ] Double-check `WHATSAPP_NUMBER` is correct and active
- [ ] **Once you have a live domain**, open `index.html` and fill in the
      commented-out `og:url` and absolute `og:image` lines — WhatsApp and
      other apps need a full `https://...` URL to reliably show the link
      preview image, a relative path only works once deployed with a known domain
