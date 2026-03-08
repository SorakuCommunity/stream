# 📋 Soraku Stream — CHANGELOG & ROADMAP

> Inspirasi: **Miruro** (UI terbaik) + **1anime.app** (fitur terkaya) + **Kuudere.to** (komunitas)  
> Stack: Next.js 16, TailwindCSS 4, Supabase, Consumet API, AniList GraphQL  
> Deploy: Vercel → https://stream.soraku.id

---

## ✅ v0.1.0 — "Foundation" *(COMPLETED)*

### 🔧 Build & Infrastructure
- [x] Setup Next.js 16 App Router + TailwindCSS v4 + TypeScript strict
- [x] Fix `@tailwindcss/postcss` missing dari devDependencies (Vercel build error)
- [x] Fix `cookiesToSet` implicit `any` type di Supabase server client
- [x] Fix `useSearchParams()` harus wrapped `<Suspense>` di `/search` page (Next.js 15+)
- [x] Fix `sourceType` + `language` props stale di VideoPlayer interface
- [x] Add `idMal` field ke type `Anime` untuk Aniskip support
- [x] Add `idMal` ke AniList GraphQL query di watch page + search
- [x] Remove unused `useSearchParams` import dari Navbar (TS strict)
- [x] `.npmrc` dengan `legacy-peer-deps=true`
- [x] Prisma Transaction Pooler config (`port 6543` + `directUrl`)

### 🎨 Design System
- [x] **Outfit** (display) + **DM Sans** (body) — Google Fonts
- [x] Deep dark tokens: `#0a0a0c` bg, refined border/hover states
- [x] CSS variables: `--font-display`, `--font-body`, `--accent-rgb`, `--radius`, `--radius-lg`, `--radius-xl`
- [x] Utility classes: `.soraku-badge`, `.soraku-badge-accent`, `.soraku-section-title` (accent bar kiri)
- [x] `.soraku-glass` (backdrop blur card), `.soraku-btn-ghost`, `.soraku-card` with hover shadow
- [x] `.scroll-row` (horizontal scroll tanpa scrollbar)
- [x] Animations: `fadeUp`, `scaleIn`, `slideDown` (improved cubic-bezier)

### 🧭 Navbar
- [x] Expand-in-place animated search bar (keyboard shortcut `/`)
- [x] Logo dengan accent dot indicator
- [x] Active link pills dengan background card
- [x] Mobile compact icon nav (Compass + Calendar)
- [x] Scrolled state border glow separator
- [x] Mobile search overlay backdrop blur
- [x] Hapus `useSearchParams` dari Navbar (moved to SearchContent)

### 🏠 Homepage
- [x] **Hero Banner** — cinematic dual-gradient + noise texture overlay
  - Thumbnail strip sidebar (desktop, klik langsung)
  - Smooth fade transition antar slide + auto-advance 6 detik
  - Pill meta badges (format, season/year, score)
  - Progress dots dengan active = pill shape
- [x] **3 Section** — Trending / Sedang Tayang / Skor Tertinggi
- [x] Section title dengan **left accent bar** (Miruro signature)
- [x] "Lihat semua" dengan ChevronRight

### 🃏 AnimeCard
- [x] Smooth scale cover + gradient overlay on hover
- [x] Title slide-up reveal animation
- [x] Blur-backdrop score badge (merah/kuning/hijau berdasarkan nilai)
- [x] Blur-backdrop format badge
- [x] Airing countdown badge dengan warna accent
- [x] Title hover color → accent

### 📺 Watch Page — Miruro Layout
- [x] **Theater Mode** — player full-width, sidebar tersembunyi
- [x] Theater mode episode strip (horizontal scroll di bawah player)
- [x] **Sub/Dub toggle** — pill buttons di controls bar
- [x] **Episode sidebar** — list/grid view toggle
- [x] Paginated episode list (50 per page) dengan prev/next
- [x] Auto-scroll active episode ke viewport
- [x] Anime info card (cover, title, meta badges, genres, studio, description)
- [x] Genre tag → link `/search?genre=...`
- [x] Download + Share (copy link) buttons

### 🎬 VideoPlayer
- [x] **Multi-source** — AnimeKai / Gogoanime / HiAnime (Zoro)
- [x] **Sub/Dub** — lang prop, append `-dub` suffix ke episode ID
- [x] **Theater Mode** toggle button (Lucide `Theater` icon)
- [x] **Screenshot** — canvas capture, auto-download PNG dengan timestamp
- [x] **Playback Speed** — 0.25× sampai 2× (8 pilihan)
- [x] **Quality selector** — ganti kualitas dengan position restore
- [x] **Settings panel** dengan 4 tab: Player / Server / Kualitas / Speed
- [x] **Aniskip** — auto-skip intro/outro + manual button
- [x] Progress bar click-to-seek + hover expand (h-1 → h-2)
- [x] Error state dengan quick-switch provider buttons
- [x] Screenshot toast notification
- [x] Speed badge indicator (muncul kalau bukan 1×)
- [x] Title bar dengan lang indicator (SUB kuning = DUB, putih = SUB)
- [x] HLS.js custom player, no vidstack dependency
- [x] Safari native HLS fallback

### 🔍 Search Page
- [x] Suspense boundary fix untuk `useSearchParams`
- [x] `_SearchContent.tsx` terpisah sebagai client component
- [x] Genre + Sort filter
- [x] Infinite scroll / Muat Lebih Banyak
- [x] Font + heading dengan design system baru

### 📅 Schedule Page
- [x] Weekly airing schedule dari AniList
- [x] Group per hari dalam seminggu
- [x] Link langsung ke watch page

### 👟 Footer
- [x] 2-column link groups (Platform + Komunitas)
- [x] Brand description + disclaimer konten
- [x] Discord + GitHub social icons

### 🔐 Auth
- [x] AniList OAuth 2.0
- [x] Discord OAuth (via Supabase)
- [x] Email + Password (Supabase Auth)
- [x] Login page (3 provider picker + email form)
- [x] OAuth callback route handler

---

## 🔜 v0.1.1 — "Polish & Fixes" *(NEXT)*

- [ ] **Anime Info/Detail page** (`/anime/[id]`) — sebelum watch, tampilkan synopsis + pilih episode
- [ ] **Continue Watching** — simpan timestamp ke localStorage, resume saat buka lagi
- [ ] **Playback position restore** — kalau refresh di tengah episode, kembali ke posisi terakhir
- [ ] Fix episode fetch: fallback ke Gogoanime/Zoro jika AnimeKai tidak ada hasil
- [ ] Loading skeleton untuk watch page yang lebih mirip Miruro
- [ ] 404 page custom dengan Soraku branding
- [ ] Keyboard shortcuts: Space (play/pause), Arrow keys (seek ±10s), F (fullscreen), T (theater)
- [ ] Mobile swipe gesture untuk prev/next episode

---

## 🔜 v0.2.0 — "User Features" *(PLANNED)*

- [ ] **User Profile page** (`/profile`)
  - [ ] Avatar dari AniList/Discord
  - [ ] Watch history (tampil per anime)
  - [ ] Watchlist / Bookmark
  - [ ] AniList sync status + last synced time
- [ ] **AniList Auto-Sync** — update progress ke AniList saat episode selesai
- [ ] **Watch History** — persist ke Supabase untuk logged-in users
- [ ] **Watchlist / Bookmark** — simpan anime, kelola list
- [ ] **Notification bell** — episode baru dari anime yang di-follow (Miruro v0.9.1 feature)
- [ ] **PWA support** — installable ke home screen, service worker
- [ ] Middleware route protection (profile, watchlist — perlu login)

---

## 🔜 v0.2.5 — "Discovery" *(PLANNED)*

- [ ] **Discover page** (`/discover`) — filter rich seperti 1anime.app
  - [ ] Filter: genre, tahun, season, skor, format, status
  - [ ] Sort: trending / populer / terbaru / alfabetis
  - [ ] Grid infinite scroll
- [ ] **Search page improvements** — hasil lebih kaya, preview hover card
- [ ] **Seasonal anime page** — grouped by season/year
- [ ] **Related anime** di watch page (rekomendasi dari AniList)
- [ ] Genre badge jadi link di homepage sections

---

## 🔜 v0.3.0 — "Social" *(PLANNED)*

- [ ] **News page** (`/news`) — agregasi berita anime dari AniNews/MAL News (dari 1anime.app)
- [ ] **Source label badge** — tag AnimeKai / Gogoanime / HiAnime di episode
- [ ] **Episode comments** (Disqus atau Supabase realtime)
- [ ] **Ratings & reactions** per episode
- [ ] **Watch Room** — nonton bareng dengan sync player (Soraku-exclusive, dari Kuudere.to)
  - [ ] Room code system
  - [ ] Discord VC sync optional

---

## 🔜 v0.4.0 — "Content Expansion" *(PLANNED)*

- [ ] **Manga reader** (`/manga/[id]`) — dari 1anime.app V2
  - [ ] MangaDex API integration
  - [ ] Page-by-page + scroll mode
- [ ] **Admin panel** — manage users, roles, reports
- [ ] **Role system** live (OWNER/MANAGER/ADMIN/AGENSI/PREMIUM/DONATE/USER)
- [ ] **Premium badge** di profil user

---

## 🔜 v0.5.0 — "AI & Intelligence" *(FUTURE)*

- [ ] **Sora AI** — personal anime assistant (dari 1anime.app Mei AI concept)
  - [ ] Rekomendasi berdasarkan watch history
  - [ ] Tanya-jawab seputar anime (synopsis, karakter, trivia)
  - [ ] Powered by Claude API
- [ ] **Smart recommendations** di homepage (personalized berdasarkan genre favorit)

---

## 🔜 v1.0.0 — "Stable" *(LONG TERM)*

- [ ] **Nonton Bareng Events** terjadwal (terintegrasi dengan Discord events Soraku)
- [ ] **Premium tiers** — akses fitur eksklusif
- [ ] **Mobile app** (PWA mature atau React Native)
- [ ] Analytics dashboard untuk OWNER/MANAGER
- [ ] Full i18n (EN + ID)

---

## 📊 Feature Comparison

| Fitur                  | Kuudere | Miruro | 1anime | **Soraku v0.1** |
|------------------------|:-------:|:------:|:------:|:---------------:|
| UI/UX Quality          | ⭐⭐⭐  | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Theater Mode           | ❌      | ✅     | ✅     | ✅              |
| Screenshot             | ❌      | ✅     | ❌     | ✅              |
| Speed Control          | ❌      | ✅     | ✅     | ✅              |
| Multi-Server           | ✅      | ✅     | ✅     | ✅ (3 server)   |
| Sub/Dub Toggle         | ✅      | ✅     | ✅     | ✅              |
| Auto-Skip Intro/Outro  | ✅      | ✅     | ✅     | ✅ (Aniskip)    |
| Auto-Next Episode      | ❌      | ✅     | ✅     | ✅              |
| AniList Login          | ❌      | ✅     | ✅     | ✅              |
| Discord Login          | ❌      | ❌     | ❌     | ✅ (EXCLUSIVE)  |
| Episode Grid/List View | ❌      | ❌     | ❌     | ✅ (EXCLUSIVE)  |
| Episode Pagination     | ❌      | ❌     | ❌     | ✅ (EXCLUSIVE)  |
| Zero Ads               | ✅      | ✅     | ✅     | ✅              |
| Watch Room             | ✅      | ❌     | ❌     | 🔜 v0.3.0      |
| AI Assistant           | ❌      | ❌     | ✅     | 🔜 v0.5.0      |
| News Page              | ❌      | ❌     | ✅     | 🔜 v0.3.0      |
| Manga Reader           | ❌      | ❌     | ✅     | 🔜 v0.4.0      |
| PWA                    | ❌      | ❌     | ❌     | 🔜 v0.2.0      |
| Watch History          | ❌      | ✅     | ✅     | 🔜 v0.2.0      |
| Open Source            | Partial | ✅     | ✅     | ✅              |

---

*Last updated: Maret 2026 — Soraku Community*
