# 📋 Soraku Stream — CHANGELOG & ROADMAP

> Inspirasi: **Miruro** (UI terbaik) + **1anime.app** (fitur terkaya) + **Kuudere.to** (komunitas)  
> Stack: Next.js 16, TailwindCSS 4, Supabase, Consumet API, AniList GraphQL  
> Deploy: Vercel → https://stream.soraku.id

---

## ✅ v0.1.0 — "Foundation + Glass UI" *(COMPLETE)*

### 🔧 Build & Infrastructure
- [x] Next.js 16 App Router + TailwindCSS v4 + TypeScript strict
- [x] Fix semua Vercel build errors (`@types/hls.js`, `cookiesToSet`, Suspense, `.npmrc`)
- [x] Prisma Transaction Pooler config

### 🎨 Design System — Glass Morphism
- [x] Deep dark: `#09090c`, glass tokens: `--glass-bg`, `--glass-border`
- [x] `soraku-glass`, `soraku-card-glass`, `soraku-btn-glass`
- [x] `soraku-badge-live` (pulsing glow), `glow-accent`
- [x] Animations: `fadeUp`, `scaleIn`, `slideDown`, `floatUp`, `pulseGlow`
- [x] **Outfit** (display) + **DM Sans** (body)

### 🧭 Navbar
- [x] Glass blur(24px) saturate(200%) + scroll shadow
- [x] Logo glow on hover + accent dot
- [x] Animated search bar + `/` keyboard shortcut
- [x] Active link glass pill
- [x] Bell + profile glass button

### 🏠 Homepage
- [x] Hero: cinematic gradient, cover float kanan, genre glass pills, progress dots
- [x] Genre scroll tabs: glass pills + arrows
- [x] Community bar: glass card
- [x] NEWEST/POPULAR/TOP RATED: glass tab switcher + pagination
- [x] **Continue Watching**: localStorage, progress bar, remove button

### 🃏 Anime Card
- [x] Play overlay + score badge glass
- [x] Airing countdown bar
- [x] **Hover preview card** (desktop): banner + genres + "Tonton Sekarang"

### 📄 Anime Detail `/anime/[id]`
- [x] Cinematic banner + color tint
- [x] Cover float glass shadow
- [x] Badges: format, status live pulse, tahun, score
- [x] Stats grid: glass cards
- [x] Tab: Overview / Karakter / Artwork / Episode
- [x] Info sidebar glass card
- [x] Recommendations grid

### 📺 Watch Page
- [x] Player shadow dramatis + rounded-xl
- [x] Controls row: glass container
- [x] Sub/Dub + Provider glass pill toggle
- [x] Episode sidebar: glass, list/grid view, pagination
- [x] Theater mode + strip
- [x] Anime info card bawah player
- [x] **Continue Watching save** otomatis saat mulai episode
- [x] **Mobile swipe gesture**: swipe kiri/kanan → prev/next episode

### 🎬 VideoPlayer
- [x] Multi-source: AnimeKai / Gogoanime / HiAnime
- [x] **Episode fetch fallback** — auto-coba server lain jika gagal
- [x] **Keyboard shortcuts**:
  - `Space`/`K` — play/pause
  - `←` / `→` — mundur/maju 10 detik
  - `↑` / `↓` — volume naik/turun
  - `F` — fullscreen
  - `T` — theater mode
  - `M` — mute
  - `N` / `P` — next/prev episode
- [x] **OSD flash message** untuk setiap aksi keyboard
- [x] **Playback position restore** — resume otomatis dari posisi terakhir
- [x] Subtitle panel: auto-select Indonesian 🇮🇩
- [x] Aniskip: "Lewati Opening / Lewati Ending"
- [x] Screenshot, speed, quality, settings panel
- [x] Error state + quick-switch server

### 📅 Schedule Page
- [x] Glass cards per hari (mulai hari ini)
- [x] Live badge pulsing (hari ini)
- [x] Jam tayang + episode + cover

### 🚫 Custom 404 Page
- [x] Floating logo + glow animasi
- [x] 404 gradient text besar
- [x] Glass card: "Beranda" + "Cari Anime" + "Kembali"
- [x] Soraku version badge

### 👟 Footer
- [x] Glass social icons (Discord, GitHub)
- [x] Link groups: Navigasi + Komunitas
- [x] LIVE badge + copyright

### 🔐 Auth
- [x] AniList OAuth 2.0
- [x] Discord OAuth (via Supabase)
- [x] Email + Password

---

## 🔜 v0.2.0 — "User Features" *(PLANNED)*

- [ ] **User Profile page** (`/profile`) — avatar, watch history, watchlist, AniList stats
- [ ] **AniList Auto-Sync** — update progress otomatis ke AniList saat episode selesai
- [ ] **Watch History** — persist ke Supabase untuk user login
- [ ] **Watchlist** — bookmark anime, kelola list
- [ ] **Notification bell** — episode baru dari anime yang di-follow
- [ ] **PWA support** — installable ke home screen
- [ ] Middleware route protection (role-based)

---

## 🔜 v0.2.5 — "Discovery" *(PLANNED)*

- [ ] **Discover page** (`/discover`) — filter genre, tahun, season, skor, format
- [ ] **Seasonal anime page**
- [ ] **Search improvement** — hasil lebih kaya + suggest

---

## 🔜 v0.3.0 — "Social" *(PLANNED)*

- [ ] **News page** (`/news`) — agregasi berita anime
- [ ] **Episode comments** (Supabase realtime)
- [ ] **Watch Room** — nonton bareng dengan sync player (SORAKU EXCLUSIVE)
  - Room code system
  - Discord VC sync optional

---

## 🔜 v0.4.0 — "Content Expansion" *(PLANNED)*

- [ ] **Manga reader** (`/manga/[id]`) — MangaDex API
- [ ] **Admin panel** — manage users, roles, reports
- [ ] **Role system** live (OWNER/MANAGER/ADMIN/AGENSI/PREMIUM/DONATE/USER)

---

## 🔜 v0.5.0 — "AI" *(FUTURE)*

- [ ] **Sora AI** — personal anime assistant (Claude API)
  - Rekomendasi berdasarkan watch history
  - Tanya-jawab seputar anime

---

## 📊 Feature Comparison

| Fitur                    | Kuudere | Miruro | 1anime | **Soraku v0.1** |
|--------------------------|:-------:|:------:|:------:|:---------------:|
| UI/UX Quality            | ⭐⭐⭐  | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Glass Morphism UI        | ❌      | ✅     | ❌     | ✅              |
| Anime Card Hover Preview | ❌      | ✅     | ❌     | ✅ (EXCLUSIVE)  |
| Continue Watching        | ✅      | ✅     | ✅     | ✅              |
| Playback Resume          | ✅      | ✅     | ✅     | ✅              |
| Keyboard Shortcuts       | ❌      | ✅     | ✅     | ✅ (Lengkap)    |
| Episode Fetch Fallback   | ✅      | ✅     | ✅     | ✅ (Auto)       |
| Mobile Swipe Episode     | ❌      | ❌     | ❌     | ✅ (EXCLUSIVE)  |
| OSD Flash Message        | ❌      | ❌     | ❌     | ✅ (EXCLUSIVE)  |
| Indonesian Subtitle      | ❌      | ❌     | ❌     | ✅ (EXCLUSIVE)  |
| Custom 404 Page          | ✅      | ✅     | ✅     | ✅ (Glass)      |
| Auto-Skip Intro/Outro    | ✅      | ✅     | ✅     | ✅ (Aniskip)    |
| AniList Login            | ❌      | ✅     | ✅     | ✅              |
| Discord Login            | ❌      | ❌     | ❌     | ✅ (EXCLUSIVE)  |
| Theater Mode             | ❌      | ✅     | ✅     | ✅              |
| Episode Grid/List        | ❌      | ❌     | ❌     | ✅ (EXCLUSIVE)  |
| Watch Room               | ✅      | ❌     | ❌     | 🔜 v0.3.0      |
| AI Assistant             | ❌      | ❌     | ✅     | 🔜 v0.5.0      |

---

*Last updated: Maret 2026 — Soraku Community*
