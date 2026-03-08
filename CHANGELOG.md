# 📋 Soraku Stream — CHANGELOG & ROADMAP

> Inspirasi: **Miruro** (UI terbaik) + **1anime.app** (fitur terkaya) + **Kuudere.to** (komunitas)  
> Stack: Next.js 16, TailwindCSS 4, Supabase, Consumet API, AniList GraphQL  
> Deploy: Vercel → https://stream.soraku.id

---

## ✅ v0.1.0 — "Foundation + Miruro UI" *(IN PROGRESS)*

### 🔧 Build & Infrastructure
- [x] Setup Next.js 16 App Router + TailwindCSS v4 + TypeScript strict
- [x] Fix `@tailwindcss/postcss` missing dari devDependencies (Vercel build error)
- [x] Fix `cookiesToSet` implicit `any` type di Supabase server client
- [x] Fix `useSearchParams()` harus wrapped `<Suspense>` di `/search` page
- [x] Fix `sourceType` + `language` props stale di VideoPlayer interface
- [x] Add `idMal` field ke type `Anime` untuk Aniskip support
- [x] Add `idMal` ke AniList GraphQL query di watch page + search
- [x] Remove unused `useSearchParams` import dari Navbar
- [x] `.npmrc` dengan `legacy-peer-deps=true`
- [x] Prisma Transaction Pooler config

### 🎨 Design System
- [x] **Outfit** (display) + **DM Sans** (body) — Google Fonts
- [x] Deep dark tokens: `#0a0a0c` bg, refined border/hover states
- [x] CSS variables: `--font-display`, `--font-body`, `--accent-rgb`, `--radius`, `--radius-lg`, `--radius-xl`
- [x] Utility classes: `.soraku-badge`, `.soraku-badge-accent`, `.soraku-section-title`
- [x] `.soraku-glass`, `.soraku-btn-ghost`, `.soraku-card` with hover shadow
- [x] `.scroll-row` (horizontal scroll tanpa scrollbar)
- [x] Animations: `fadeUp`, `scaleIn`, `slideDown`

### 🧭 Navbar — Miruro Match
- [x] Expand-in-place animated search bar (keyboard shortcut `/`)
- [x] Logo dengan accent dot indicator
- [x] Active link pills dengan background card
- [x] Mobile compact icon nav
- [x] Scrolled state border glow separator
- [x] **[NEW]** Inbox icon (Miruro-style) di kanan navbar
- [x] **[NEW]** User/profile icon di kanan navbar
- [x] Hapus `useSearchParams` dari Navbar

### 🏠 Homepage — Miruro Match *(UPDATED)*
- [x] **Hero Banner** — cinematic gradient + noise texture
  - **[NEW]** "Ep X Airing Now" badge dengan clock icon — top left (persis Miruro)
  - **[NEW]** Episode counter "X / Y" badge — top right (persis Miruro)
  - **[NEW]** Meta row: TV · 12 · ★81 — icon + value horizontal (persis Miruro)
  - **[NEW]** Title warna accent/gold (bukan putih) — persis Miruro
  - **[NEW]** Genre pills blur glass dibawah title
  - **[NEW]** CTA buttons: WATCH NOW + DETAILS, outlined rounded-full (persis Miruro)
  - Smooth fade transition + auto-advance 6s + progress dots
- [x] **[NEW] Genre scroll tabs** — horizontal scroll dengan arrow prev/next (persis Miruro)
- [x] **[NEW] Social/community bar** — "Love the Site? Join Soraku Discord" dengan Reddit/Discord/X icons
- [x] **[NEW] NEWEST / POPULAR / TOP RATED tab switcher** — client-side tabs (persis Miruro)
  - Pagination arrows `< 1 >` di kanan tab bar
  - 7-column anime grid (lebih dense dari sebelumnya)
  - Genre filter apply ke tab aktif

### 📄 Anime Info/Detail Page `/anime/[id]` — **[NEW, MIRURO MATCH]**
- [x] **Banner image** full-width dengan gradient overlay fade ke bg
- [x] **Cover image overlay** — posisi bottom-left banner, shadow
- [x] **Badge pills** — format (TV), tahun, status (Airing/Finished), score %
- [x] **Action buttons**: ▶ WATCH + [+] Add to List + AniList (biru) + MAL (biru tua)
- [x] **Stats grid** — Episodes · Duration · Season · Studio · Country
- [x] **Tab bar** — Overview / Characters / Artwork / Episodes
  - **Overview**: sinopsis + YouTube trailer embed + related anime + genre tags + score sidebar
  - **Characters**: grid karakter + voice actor Jepang
  - **Artwork**: banner + cover + character images grid
  - **Episodes**: redirect ke watch page
- [x] **Recommendations** grid di bawah Overview

### 📺 Watch Page — Miruro Layout
- [x] Theater Mode (full-width player, sidebar hidden)
- [x] Theater episode strip (horizontal scroll di bawah)
- [x] Sub/Dub toggle pill buttons
- [x] Episode sidebar — list/grid view toggle
- [x] Paginated episode list (50/page)
- [x] Auto-scroll active episode ke viewport
- [x] Anime info card (cover, title, meta, genres, studio, description)
- [x] Genre tag → link `/search?genre=...`
- [x] Download + Share (copy link) buttons

### 🎬 VideoPlayer
- [x] Multi-source: AnimeKai / Gogoanime / HiAnime
- [x] Sub/Dub lang prop
- [x] Theater Mode toggle
- [x] **Screenshot** — canvas PNG download dengan timestamp
- [x] **Playback Speed** — 0.25× sampai 2×
- [x] Quality selector dengan position restore
- [x] Settings panel 4 tab: Player / Server / Kualitas / Speed
- [x] Aniskip auto-skip intro/outro
- [x] Progress bar click-to-seek + hover expand
- [x] Error state dengan quick-switch provider buttons

### 🔍 Search Page
- [x] Suspense boundary fix
- [x] Genre + Sort filter
- [x] Infinite scroll / Muat Lebih Banyak

### 📅 Schedule Page
- [x] Weekly airing schedule dari AniList
- [x] Group per hari

### 👟 Footer
- [x] 2-column link groups
- [x] Brand + disclaimer

### 🔐 Auth
- [x] AniList OAuth 2.0
- [x] Discord OAuth (via Supabase)
- [x] Email + Password
- [x] Login page + OAuth callback

---

## 🔜 v0.1.0 — Sisa yang Belum Dikerjakan

- [ ] **Custom 404 page** — dengan Soraku branding + "Kembali ke Beranda" button
- [ ] **Keyboard shortcuts** — Space (play/pause), Arrow keys (seek ±10s), F (fullscreen), T (theater)
- [ ] **Continue Watching** di homepage — section baru di bawah Hero, simpan ke localStorage
- [ ] **Playback position restore** — resume ke posisi terakhir saat refresh episode
- [ ] **Loading skeleton** di watch page yang lebih mirip Miruro (cover/title shimmer)
- [ ] **Episode fetch fallback** — jika AnimeKai tidak ada hasil, otomatis coba Gogoanime/Zoro
- [ ] **Mobile swipe gesture** — swipe left/right untuk prev/next episode di watch page
- [ ] **Miruro anime card hover** — preview mini info card muncul saat hover (desktop)

---

## 🔜 v0.2.0 — "User Features" *(PLANNED)*

- [ ] **User Profile page** (`/profile`)
  - [ ] Avatar dari AniList/Discord
  - [ ] Watch history per anime
  - [ ] Watchlist / Bookmark
  - [ ] AniList sync status
- [ ] **AniList Auto-Sync** — update progress ke AniList saat episode selesai
- [ ] **Watch History** — persist ke Supabase untuk logged-in users
- [ ] **Watchlist** — simpan anime, kelola list
- [ ] **Notification bell** — episode baru dari anime yang di-follow
- [ ] **PWA support** — installable ke home screen
- [ ] Middleware route protection

---

## 🔜 v0.2.5 — "Discovery" *(PLANNED)*

- [ ] **Discover page** (`/discover`) — filter rich
  - [ ] Filter: genre, tahun, season, skor, format, status
  - [ ] Sort: trending / populer / terbaru / alfabetis
  - [ ] Grid infinite scroll
- [ ] **Search improvements** — hover preview card
- [ ] **Seasonal anime page**
- [ ] **Related anime** di watch page

---

## 🔜 v0.3.0 — "Social" *(PLANNED)*

- [ ] **News page** (`/news`) — agregasi berita anime
- [ ] **Episode comments** (Supabase realtime)
- [ ] **Ratings & reactions** per episode
- [ ] **Watch Room** — nonton bareng dengan sync player (SORAKU EXCLUSIVE)
  - [ ] Room code system
  - [ ] Discord VC sync optional

---

## 🔜 v0.4.0 — "Content Expansion" *(PLANNED)*

- [ ] **Manga reader** (`/manga/[id]`) — MangaDex API
- [ ] **Admin panel** — manage users, roles, reports
- [ ] **Role system** live (OWNER/MANAGER/ADMIN/AGENSI/PREMIUM/DONATE/USER)

---

## 🔜 v0.5.0 — "AI" *(FUTURE)*

- [ ] **Sora AI** — personal anime assistant powered by Claude API
  - [ ] Rekomendasi berdasarkan watch history
  - [ ] Tanya-jawab seputar anime

---

## 📊 Feature Comparison

| Fitur                  | Kuudere | Miruro | 1anime | **Soraku v0.1** |
|------------------------|:-------:|:------:|:------:|:---------------:|
| UI/UX Quality          | ⭐⭐⭐  | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Anime Info Page        | ✅      | ✅     | ✅     | ✅              |
| YouTube Trailer        | ✅      | ✅     | ✅     | ✅              |
| Genre Filter Tabs      | ❌      | ✅     | ✅     | ✅              |
| Theater Mode           | ❌      | ✅     | ✅     | ✅              |
| Screenshot             | ❌      | ✅     | ❌     | ✅              |
| Speed Control          | ❌      | ✅     | ✅     | ✅              |
| Multi-Server           | ✅      | ✅     | ✅     | ✅ (3 server)   |
| Sub/Dub Toggle         | ✅      | ✅     | ✅     | ✅              |
| Auto-Skip Intro/Outro  | ✅      | ✅     | ✅     | ✅ (Aniskip)    |
| AniList Login          | ❌      | ✅     | ✅     | ✅              |
| Discord Login          | ❌      | ❌     | ❌     | ✅ (EXCLUSIVE)  |
| Episode Grid/List View | ❌      | ❌     | ❌     | ✅ (EXCLUSIVE)  |
| Episode Pagination     | ❌      | ❌     | ❌     | ✅ (EXCLUSIVE)  |
| NEWEST/POPULAR/TOPRATED| ✅      | ✅     | ✅     | ✅              |
| Characters Tab         | ✅      | ✅     | ✅     | ✅              |
| Recommendations        | ✅      | ✅     | ✅     | ✅              |
| Watch Room             | ✅      | ❌     | ❌     | 🔜 v0.3.0      |
| AI Assistant           | ❌      | ❌     | ✅     | 🔜 v0.5.0      |
| PWA                    | ❌      | ❌     | ❌     | 🔜 v0.2.0      |

---

*Last updated: Maret 2026 — Soraku Community*
