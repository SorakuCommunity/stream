# 📋 Soraku Stream — CHANGELOG & ROADMAP

> Inspirasi: **Miruro** (UI terbaik) + **1anime.app** (fitur terkaya) + **Kuudere.to** (komunitas)  
> Stack: Next.js 16, TailwindCSS 4, Supabase, Consumet API, AniList GraphQL  
> Deploy: Vercel → https://stream.soraku.id

---

## ✅ v0.1.0 — "Foundation + Glass UI" *(IN PROGRESS)*

### 🔧 Build & Infrastructure
- [x] Setup Next.js 16 App Router + TailwindCSS v4 + TypeScript strict
- [x] Fix `@tailwindcss/postcss` missing
- [x] Fix `cookiesToSet` implicit `any` type
- [x] Fix `useSearchParams()` Suspense boundary
- [x] Fix `sourceType` + `language` props
- [x] Add `idMal` ke type `Anime` + AniList GraphQL
- [x] Remove unused imports
- [x] `.npmrc` dengan `legacy-peer-deps=true`
- [x] Remove `@types/hls.js` (tidak ada di npm)
- [x] Prisma Transaction Pooler config

### 🎨 Design System v2 — Glass Morphism
- [x] **Outfit** (display) + **DM Sans** (body) — Google Fonts
- [x] Deep dark tokens: `#09090c` bg, refined border/hover
- [x] CSS variables lengkap dengan `--glass-bg`, `--glass-border`
- [x] `.soraku-glass`, `.soraku-glass-sm`, `.soraku-glass-strong`
- [x] `.soraku-card-glass` — glass card dengan glow hover
- [x] `.soraku-btn-glass` — glass button
- [x] `.soraku-badge-glass`, `.soraku-badge-live` (pulsing glow)
- [x] `.glow-accent` — accent glow utility
- [x] Animations: `fadeUp`, `scaleIn`, `slideDown`, `floatUp`, `pulseGlow`

### 🧭 Navbar — Glass Premium
- [x] Glass morphism blur(24px) + saturate(200%)
- [x] Logo glow on hover
- [x] Search bar dengan glass border + accent glow ring
- [x] Active link pill dengan glass background
- [x] Bell notification icon
- [x] Profile avatar button (glass circle)
- [x] Keyboard shortcut `/` untuk search
- [x] Scrolled state: border glow + shadow

### 🏠 Homepage — Cinematic
- [x] **Hero Banner** — full cinematic gradients + noise
  - Cover image floating kanan (Miruro style)
  - Airing badge live pulsing
  - Genre pills glass
  - TONTON + DETAIL buttons (rounded-full glass)
  - Progress dots animasi lebar
  - Smooth scale transition
- [x] **Genre scroll tabs** — glass pill buttons
- [x] **Community bar** — glass card dengan emoji avatar
- [x] **NEWEST / POPULAR / TOP RATED** — glass tab switcher
- [x] **Anime grid** 3→4→5→6→7 columns responsive

### 📄 Anime Info/Detail `/anime/[id]`
- [x] Banner cinematic + accent color tint
- [x] Cover image glass shadow (floating)
- [x] Badges: format, status (live pulse), tahun, score
- [x] Action buttons: TONTON (accent) + Daftar (glass) + AniList + MAL
- [x] Stats grid — glass cards 3→5 columns
- [x] Tab bar: Overview / Karakter / Artwork / Episode
  - Overview: sinopsis expandable + trailer + related
  - Karakter: glass character cards (char + VA side by side)
  - Artwork: masonry layout
  - Episode: redirect to watch
- [x] Info sidebar glass card (format, status, durasi, studio, skor)
- [x] Recommendations grid 3→7 columns

### 📺 Watch Page
- [x] Player dengan border-radius + box-shadow dramatis
- [x] Controls row — glass container
- [x] Sub/Dub toggle glass pill
- [x] Provider switcher glass pill (AK/GG/HI)
- [x] Theater Mode toggle
- [x] Download + Share (copy link) buttons
- [x] Anime info card bawah player (cover + genres + desc)
- [x] Episode sidebar — glass container
  - List/Grid view toggle
  - Pagination 50/page
  - Active episode: left border accent
  - Theater mode episode strip

### 🎬 VideoPlayer
- [x] Multi-source: AnimeKai / Gogoanime / HiAnime
- [x] **Subtitle / Terjemahan** panel — pilih track subtitle
  - **Auto-select Indonesian subtitle** jika tersedia
  - Inject `<track>` element ke video
  - Panel menampilkan label "Indonesia 🇮🇩" untuk ID subtitle
- [x] Settings panels: Player / Server / Kualitas / Kecepatan / Subtitle
- [x] Aniskip auto-skip intro/outro
- [x] Screenshot + download PNG
- [x] Playback speed 0.25×–2×
- [x] Quality selector + position restore
- [x] Progress bar seek
- [x] Skip button Bahasa Indonesia ("Lewati Opening" / "Lewati Ending")
- [x] Theater Mode toggle
- [x] Error state dengan quick-switch server
- [x] Controls semua teks Bahasa Indonesia

### 📅 Schedule Page
- [x] Glass cards per hari (7 hari mulai hari ini)
- [x] "Hari ini" live badge pulsing
- [x] Cover image + episode + waktu airing
- [x] Scrollable per card (max-h)

### 👟 Footer
- [x] Brand + description
- [x] Glass social icons
- [x] Link groups: Navigasi + Komunitas
- [x] "● LIVE" badge di bottom bar

### 🔐 Auth
- [x] AniList OAuth 2.0
- [x] Discord OAuth (via Supabase)
- [x] Email + Password

---

## 🔜 v0.1.0 — Sisa yang Belum Dikerjakan

- [ ] **Custom 404 page** — Soraku branding
- [ ] **Keyboard shortcuts** — Space, Arrow keys, F (fullscreen), T (theater)
- [ ] **Continue Watching** di homepage — localStorage
- [ ] **Playback position restore** — resume ke posisi terakhir
- [ ] **Loading skeleton** watch page yang lebih mirip Miruro
- [ ] **Episode fetch fallback** — auto-coba Gogoanime/Zoro jika AnimeKai gagal
- [ ] **Mobile swipe gesture** — swipe episode prev/next
- [ ] **Anime card hover preview** — mini info card saat hover (desktop)

---

## 🔜 v0.2.0 — "User Features" *(PLANNED)*

- [ ] **User Profile page** (`/profile`)
- [ ] **AniList Auto-Sync** — update progress ke AniList
- [ ] **Watch History** — persist ke Supabase
- [ ] **Watchlist** — simpan anime
- [ ] **Notification bell** — episode baru
- [ ] **PWA support**
- [ ] Middleware route protection

---

## 🔜 v0.2.5 — "Discovery" *(PLANNED)*

- [ ] **Discover page** (`/discover`) — filter rich
- [ ] **Seasonal anime page**
- [ ] **Search improvements** — hover preview card

---

## 🔜 v0.3.0 — "Social" *(PLANNED)*

- [ ] **News page** (`/news`)
- [ ] **Episode comments** (Supabase realtime)
- [ ] **Watch Room** — nonton bareng (SORAKU EXCLUSIVE)

---

## 🔜 v0.4.0 — "Content Expansion" *(PLANNED)*

- [ ] **Manga reader** (`/manga/[id]`) — MangaDex API
- [ ] **Admin panel** — manage users, roles
- [ ] **Role system** live

---

## 🔜 v0.5.0 — "AI" *(FUTURE)*

- [ ] **Sora AI** — personal anime assistant (Claude API)

---

## 📊 Feature Comparison

| Fitur                  | Kuudere | Miruro | 1anime | **Soraku v0.1** |
|------------------------|:-------:|:------:|:------:|:---------------:|
| UI/UX Quality          | ⭐⭐⭐  | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Glass Morphism UI      | ❌      | ✅     | ❌     | ✅              |
| Anime Info Page        | ✅      | ✅     | ✅     | ✅              |
| YouTube Trailer        | ✅      | ✅     | ✅     | ✅              |
| Genre Filter Tabs      | ❌      | ✅     | ✅     | ✅              |
| Theater Mode           | ❌      | ✅     | ✅     | ✅              |
| Screenshot             | ❌      | ✅     | ❌     | ✅              |
| Speed Control          | ❌      | ✅     | ✅     | ✅              |
| Multi-Server           | ✅      | ✅     | ✅     | ✅ (3 server)   |
| Sub/Dub Toggle         | ✅      | ✅     | ✅     | ✅              |
| Indonesian Subtitle    | ❌      | ❌     | ❌     | ✅ (EXCLUSIVE)  |
| Auto-Skip Intro/Outro  | ✅      | ✅     | ✅     | ✅ (Aniskip)    |
| Skip Teks Indonesia    | ❌      | ❌     | ❌     | ✅ (EXCLUSIVE)  |
| AniList Login          | ❌      | ✅     | ✅     | ✅              |
| Discord Login          | ❌      | ❌     | ❌     | ✅ (EXCLUSIVE)  |
| Episode Grid/List View | ❌      | ❌     | ❌     | ✅ (EXCLUSIVE)  |
| Episode Pagination     | ❌      | ❌     | ❌     | ✅ (EXCLUSIVE)  |
| Watch Room             | ✅      | ❌     | ❌     | 🔜 v0.3.0      |
| AI Assistant           | ❌      | ❌     | ✅     | 🔜 v0.5.0      |

---

*Last updated: Maret 2026 — Soraku Community*
