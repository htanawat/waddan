# วัดด่าน พระราม 3 — Wat Dan Rama III

> เว็บไซต์อย่างเป็นทางการของวัดด่าน พระราม 3 — วัดเก่าแก่ริมฝั่งแม่น้ำเจ้าพระยา สร้างในสมัยอยุธยาตอนปลาย

A bilingual (Thai/English) heritage landing page for **Wat Dan Rama III**, a historic Buddhist temple on the Chao Phraya River in Bangkok. Built with React 18, a custom Thai-themed design system, cinematic scroll effects, and a built-in Thai-language text-to-speech reader for articles.

---

## ✨ Highlights

| | |
| --- | --- |
| 🪷 **Cinematic Thai aesthetic** | Custom heritage palette (deep temple red, saffron gold, parchment cream, dark teak) + Taviraj/Prompt typography |
| 🎬 **Scroll choreography** | Slim gold scroll-progress bar, drifting lai-thai ornaments with parallax, hero text fade-on-scroll, section reveal-on-scroll |
| 🎠 **Custom 16:9 highlight carousel** | Crossfade slides, glass counter "01 / 05", round chevron arrows, expanding pill indicators |
| 🔊 **Thai TTS for every article** | Built on `react-speech-kit` (Web Speech API) — auto-picks the best Thai female voice (Kanya / Premwadee / Pattara …), chunks long content, with Play / Pause / Stop / loading state |
| 📱 **Mobile-first responsive** | Verified at 320 / 360 / 375 / 414 px — collapsible card sections, edge-to-edge gallery modal, hamburger menu |
| ♿ **Accessibility** | Skip-to-main-content link, visible focus rings on every interactive surface, `aria-live` on caption changes, full `prefers-reduced-motion` opt-out |

---

## 🗺️ Pages & routes

| Route | Component | Purpose |
| --- | --- | --- |
| `/` | [`Main`](src/App.jsx) | Landing page (Hero, Highlights, About, News & Events, Dharma Reflections, Contact) |
| `/activities/:timestamp` | [`ContentServices`](src/components/ContentService.jsx) | Article detail for a news / event |
| `/media/:timestamp` | [`ContentServices`](src/components/ContentService.jsx) | Article detail for a dharma reflection |
| `/admin` | [`Admin`](src/components/Admin.jsx) | Content editing panel |

In-page anchors: `#home`, `#aboutus`, `#features`, `#activities`, `#media`, `#contact`. The nav intercepts same-page links and uses `scrollIntoView({ behavior: "smooth" })`; cross-page links (e.g. clicking "ติดต่อสอบถาม" from `/media/…`) navigate to `/#contact` and an `App.jsx` mount-effect scrolls to the section once it hydrates.

---

## 🧱 Tech stack

- **React 18.3** + **react-router-dom 6.28** + **react-bootstrap 2.10** (Bootstrap 5)
- **react-speech-kit 3** — Web Speech wrapper for the article reader
- **react-scripts 5** (Create React App tooling)
- **Custom CSS** in [`public/css/style.css`](public/css/style.css) (~3 000 lines, design tokens at `:root`)
- **Google Fonts**: [Taviraj](https://fonts.google.com/specimen/Taviraj) (display), [Prompt](https://fonts.google.com/specimen/Prompt) (body), [Noto Serif Thai](https://fonts.google.com/specimen/Noto+Serif+Thai)
- **Local fonts** in `public/fonts/`: Charm (decorative Thai), ChakraPetch, Taviraj
- **Node ≥ 22** (`.nvmrc` pins to `22`)

---

## 🚀 Getting started

```bash
nvm use            # reads .nvmrc → 22
npm install
npm run start      # dev server on http://localhost:3000
```

The dev script sets `NODE_OPTIONS=--openssl-legacy-provider` for compatibility with Node 22 + react-scripts 5.

### Build & deploy

```bash
npm run build      # outputs to ./build-prod
npm run deploy     # build + sync to S3 + CloudFront invalidation (requires AWS CLI + `pave` profile)
```

### Tests

```bash
npm run test
```

---

## 🗃️ Project structure

```
src/
├── App.jsx                    # Routes, skip-link, scroll FX layer, hash-on-mount
├── components/
│   ├── navigation.jsx         # Glass nav, scroll-aware, hamburger ≤900px
│   ├── header.jsx             # Hero with kranok corners + ken-burns image + scroll cue
│   ├── features.jsx           # Custom 16:9 highlight carousel (.hl-* CSS namespace)
│   ├── about.jsx              # รู้จักวัดด่าน — image + text two-column
│   ├── services.jsx           # ข่าวและกิจกรรม section (uses CardGrid)
│   ├── media.jsx              # สื่อธรรม section (uses CardGrid)
│   ├── contact.jsx            # Contact card + framed map + cinematic footer
│   ├── ContentService.jsx     # Article detail (hero, breadcrumb, body, TTS bar, gallery, modal)
│   ├── CardGrid.jsx           # Shared featured + grid + skeleton + show-all toggle
│   ├── BackToTop.jsx          # Fixed gold pill, fades in past 480 px scroll
│   ├── ScrollFxLayer.jsx      # Progress bar + drifting lai-thai motifs
│   ├── icons.jsx              # SVG icon set (Lotus, Kranok, Chevrons, Phone, Pin…)
│   ├── useReveal.js           # IntersectionObserver → .is-in-view on .reveal sections
│   ├── useScrollFx.js         # rAF-throttled scroll → CSS vars + parallax transforms
│   └── useArticleTTS.js       # Thai TTS hook, chunker, voice picker
└── data/
    └── data.json              # Hero title fallback
public/
├── css/style.css              # All site styles + design tokens (--thai-* CSS variables)
├── fonts/                     # Local font files (Charm, ChakraPetch, Taviraj)
├── img/                       # Hero, about, carousel, portfolio images
└── index.html                 # Google Fonts preload, Font Awesome, root mount
```

---

## 🎨 Design system

### Color tokens — defined at `:root` in `public/css/style.css`

| Token | Hex | Use |
| --- | --- | --- |
| `--thai-red-deep` | `#5C1310` | Headings, primary text on cream |
| `--thai-red-soft` | `#A7261D` | Eyebrows, accents, label color |
| `--thai-red` | `#8B1A14` | Primary button base |
| `--thai-gold-bright` | `#E6BC4A` | Title shimmer, active indicators |
| `--thai-gold` | `#C9962B` | Borders, ornament strokes |
| `--thai-gold-soft` | `#F2D27A` | Highlights, brand sub-text |
| `--thai-saffron` | `#E08A1E` | Optional accent |
| `--thai-cream` | `#FBF4E6` | Card backgrounds, light section |
| `--thai-ivory` | `#F5E9D2` | Subtle surfaces |
| `--thai-teak` | `#3E2A14` | Dark sections (Media), footer |
| `--thai-teak-soft` | `#5A3F1F` | Mid-dark gradient |
| `--paper` | `#FBF7EE` | Page background |
| `--ink`, `--ink-soft` | `#2A1B0E`, `#5A4632` | Body text |

### Typography

| Use | Font | Weight | Notes |
| --- | --- | --- | --- |
| Display / hero / section titles | **Taviraj** | 700 / 800 | Elegant Thai-Latin serif (locally bundled + Google Fonts) |
| Body text, UI | **Prompt** | 300 / 400 / 500 / 600 / 700 | Modern Thai sans (Google Fonts) |
| Decorative accents | **Charm** | 400 / 700 | Thai script-style display (locally bundled) |
| Optional fallback | **Noto Serif Thai** | 400 / 700 | Heading fallback |

Mobile-friendly font sizes scale with `clamp()` (e.g. hero title `clamp(56px, 11vw, 168px)`).

### Motion language

| Token | Use |
| --- | --- |
| `cubic-bezier(0.2, 0.7, 0.2, 1)` | Standard ease (entries, hovers) |
| 220 ms | Micro-interactions (button hover) |
| 320 – 800 ms | Component reveals, image scale |
| 6.5 s | Highlight carousel auto-advance |
| 36 s | Hero ken-burns loop |

All scroll-coupled animations and reveals respect `prefers-reduced-motion`.

---

## 🔊 Article text-to-speech

Every article on `/activities/:id` and `/media/:id` shows a "ฟังบทความ" bar above the body. It is powered by [`useArticleTTS`](src/components/useArticleTTS.js), a thin wrapper around `react-speech-kit`'s `useSpeechSynthesis`.

Features beyond the library:

- **State machine** — `idle → loading → playing → paused → idle`.
- **Robust chunking** ([`chunkTextForSpeech`](src/components/useArticleTTS.js)): splits on real sentence boundaries first, then word boundaries (Thai uses spaces between phrases), capping each utterance at ~200 chars to dodge the silent-truncation bug present in Chrome's Web Speech engine.
- **Thai female voice priority**: hint list `Kanya` (macOS) → `Premwadee` (Google / Android) → `Pattara` / `Achara` (Windows) → `Noppawan` / `Sarinrat` → any voice tagged "female" → first available `th-*` voice.
- **Pause / resume** via raw `window.speechSynthesis.pause()` / `resume()` (the library does not expose these).
- **Auto-cancel on unmount** or when the article text changes.

---

## ☁️ API

The site fetches dynamic content (highlights, news / events, dharma reflections, about copy, contacts) from a serverless API at `https://sycl7h5b43.execute-api.ap-southeast-1.amazonaws.com`.

| Endpoint | Returns |
| --- | --- |
| `GET /admin/contents?type=highlight` | Homepage carousel slides |
| `GET /admin/contents?type=activity` | News & events list |
| `GET /admin/contents?type=media` | Dharma reflections list |
| `GET /content?type=activity&id=…` | Single news article |
| `GET /content?type=media&id=…` | Single dharma article |
| `GET /content?type=about&id=…` | About-section copy |
| `GET /content?type=contact&id=…` | Contact phone numbers |

Each content item carries `data.title`, `data.caption`, `data.titleImageURL`, `data.contents` (array of HTML strings) and `data.contentImageURLs` (gallery).

The Admin route (`/admin`) is the editing UI for these endpoints.

---

## 🧪 Browser & device support

- **Browsers**: Chrome / Safari / Firefox / Edge — modern evergreen builds.
- **Mobile**: verified on viewports 320 / 360 / 375 / 414 px. The drifting lai-thai ornaments are hidden ≤1100 px (no margin space); the progress bar and hero fade work everywhere.
- **A11y**: skip-link is the first Tab stop; reduced-motion users get instant transitions; focus rings on every interactive surface.
- **Performance**: images use `loading="lazy"` (eager only for the hero / first card) and explicit `width` / `height` to keep CLS < 0.1; Taviraj 700 is preloaded to eliminate hero-title FOUT.

---

## 🗒️ Notable engineering decisions

- `body { overflow-x: clip }` — never `html { overflow-x: hidden }`. The latter establishes a separate scroll container and breaks `window.scrollY`.
- The legacy Bootstrap 3 stylesheet (`public/css/bootstrap.css`) is no longer linked from `index.html`. The npm-imported Bootstrap 5 in `App.jsx` is sufficient. (The BS3 `.modal { opacity: 0 }` rule was overriding `.modal.show` from BS5 and silently broke the gallery modal.)
- The `smooth-scroll` library is no longer initialised — native CSS `scroll-behavior: smooth` and explicit `scrollIntoView` calls replaced it for instant click response.
- The `radium` package was removed; the navigation now uses plain `style` props + CSS classes.

---

## 📜 Credits

- **Original landing-page template** by [Issaaf Kattan](https://github.com/issaafalkattan/React-Landing-Page-Template) (free CSS lineage).
- **Heavy redesign + Thai heritage system + scroll FX + TTS** for วัดด่าน พระราม 3.
- **Site design credit**: ธนาวัฒน์ ฮ้อศิริมานนท์.

This repository serves the temple's public website.
