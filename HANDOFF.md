# 🤝 HANDOFF — Soraku Stream v0.1.0 (Next.js)

> Sesi ini: Rebuild dari Vite → **Next.js 16 App Router** dengan stack Kaizo.
> Push sudah berhasil ke: https://github.com/SorakuCommunity/stream

---

## ✅ Selesai di Sesi Ini

### Stack Baru
- [x] Next.js 16.1.6 App Router
- [x] TypeScript Strict Mode
- [x] TailwindCSS 4 (bukan styled-components)
- [x] Radix UI + Lucide Icons
- [x] Supabase Auth client/server
- [x] Prisma schema (User, WatchHistory, Watchlist, UserRole)
- [x] HLS.js custom video player

### Halaman
- [x] `/` — Home (SSR, Hero banner + Trending + Sedang Tayang)
- [x] `/watch/[id]` — Player + episode list + info anime
- [x] `/search` — Filter genre/sort + infinite scroll
- [x] `/schedule` — Jadwal mingguan (AniList)
- [x] `/about` — Tentang Soraku Community
- [x] `/auth/login` — 3 provider login (AniList, Discord, Email)
- [x] `/auth/callback` — OAuth handler

### Komponen
- [x] Navbar (search, theme toggle, logo Soraku)
- [x] Footer (Soraku Community)
- [x] AnimeCard + Skeleton
- [x] AnimeSection
- [x] HeroBanner (carousel)
- [x] VideoPlayer (HLS.js, kontrol Bahasa Indonesia)

### Aset
- [x] `public/soraku-logo.png` — mascot sticker (image 2)
- [x] `public/soraku-logo-back.png` — mascot hoodie back (image 1)

---

## ❗ Perlu Dilanjutkan Sesi Berikutnya

### 1. Setup Supabase (PRIORITAS)
```
1. Buat project Supabase: https://supabase.com
2. Enable providers di Auth > Providers:
   - Discord OAuth
   - Email (sudah default)
3. Tambah file .env.local:
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
4. Jalankan: npm run db:push (setelah isi DATABASE_URL)
```

### 2. Setup AniList OAuth
```
1. Daftar di: https://anilist.co/settings/developer
2. Buat new client, set redirect URI:
   https://stream.soraku.id/auth/callback (production)
   http://localhost:3000/auth/callback (dev)
3. Isi .env.local:
   NEXT_PUBLIC_ANILIST_CLIENT_ID=...
   ANILIST_CLIENT_SECRET=...
   NEXT_PUBLIC_ANILIST_REDIRECT_URI=...
```

### 3. Setup Consumet API (Video Sources)
```
Deploy sendiri: https://github.com/consumet/api.consumet.org
Atau gunakan public: https://consumet-api.vercel.app
Isi .env.local:
  NEXT_PUBLIC_CONSUMET_API_URL=https://...
```

### 4. Vercel Deployment
```
1. Push ke GitHub sudah ✅
2. Import di: https://vercel.com/new
3. Pilih repo SorakuCommunity/stream
4. Tambah semua env variables
5. Deploy!
```

### 5. Halaman yang Belum Ada
- `/profile` — halaman profil user + AniList sync
- `/pptos` — Privacy Policy & Terms of Service
- `/404` — Halaman tidak ditemukan custom

### 6. shadcn/ui Setup
```bash
npx shadcn@latest init
npx shadcn@latest add button card input dialog
```

---

## 📦 Cara Clone & Lanjutkan

```bash
git clone https://github.com/SorakuCommunity/stream.git
cd stream
npm install
cp .env.example .env.local
# Isi .env.local
npm run dev
```

---

*Handoff dibuat: Maret 2026 — Soraku Stream v0.1.0 (Next.js 16)*
