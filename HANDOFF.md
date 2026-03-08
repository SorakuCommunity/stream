# 🤝 HANDOFF — Soraku Stream v0.1.0
> Last updated: fix Vercel build error + AnimeKai + Prisma pooler
> Repo: https://github.com/SorakuCommunity/stream

---

## ✅ Fix yang Dilakukan di Sesi Ini

### Build Error Vercel — RESOLVED ✅
- **Root cause:** `@vidstack/react@next` butuh `@types/react ^18`, kita pakai React 19
- **Fix:** Hapus `@vidstack/react` sepenuhnya — player sudah 100% custom HLS.js, tidak ada dependency ke vidstack
- **Safety net:** Tambah `.npmrc` dengan `legacy-peer-deps=true`

### Prisma Transaction Pooler — CONFIGURED ✅
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")   // Transaction Pooler port 6543
  directUrl = env("DIRECT_URL")     // Direct port 5432 (hanya migrate)
}
```

### Video Source — AnimeKai ✅
- `VideoPlayer.tsx`: fetch dari `/anime/animekai/watch/{id}`
- `WatchClient.tsx`: episode list dari `/anime/animekai/info/{id}`

---

## 🔧 Setup Lengkap yang Harus Dilakukan Riu

### 1. Environment Variables di Vercel

Masukkan semua ini di **Vercel → Project → Settings → Environment Variables**:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://hgxvsllcwqhcehkbikis.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=(dari Supabase dashboard)
SUPABASE_SERVICE_ROLE_KEY=(dari Supabase dashboard)

# Database — Transaction Pooler (port 6543) untuk Vercel
DATABASE_URL=postgresql://postgres.hgxvsllcwqhcehkbikis:PASSWORD@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1

# Database — Direct (port 5432) hanya untuk migrate
DIRECT_URL=postgresql://postgres:PASSWORD@db.hgxvsllcwqhcehkbikis.supabase.co:5432/postgres

# AniList OAuth
NEXT_PUBLIC_ANILIST_CLIENT_ID=(dari anilist.co/settings/developer)
ANILIST_CLIENT_SECRET=(dari anilist.co/settings/developer)
NEXT_PUBLIC_ANILIST_REDIRECT_URI=https://stream.soraku.id/auth/callback

# Consumet (self-host dulu ke Vercel)
NEXT_PUBLIC_CONSUMET_API_URL=https://your-consumet.vercel.app

# App URL
NEXT_PUBLIC_APP_URL=https://stream.soraku.id
```

---

### 2. Deploy Consumet API ke Vercel (5 menit)

```
1. Buka: https://github.com/consumet/api.consumet.org
2. Klik tombol "Deploy to Vercel" di README
3. Login Vercel → Deploy
4. Copy URL hasil deploy (contoh: soraku-consumet.vercel.app)
5. Masukkan ke env: NEXT_PUBLIC_CONSUMET_API_URL=https://soraku-consumet.vercel.app
```

Endpoint yang dipakai Soraku Stream:
```
GET /anime/animekai/{query}          → search anime
GET /anime/animekai/info/{id}        → detail + episode list
GET /anime/animekai/watch/{ep-id}    → HLS video source
```

---

### 3. Setup Supabase Auth

```
Supabase Dashboard → Authentication → Providers:
✅ Email — aktifkan (default sudah on)
✅ Discord — aktifkan, masukkan Discord App credentials
   (buat di: https://discord.com/developers/applications)
   Redirect URL: https://hgxvsllcwqhcehkbikis.supabase.co/auth/v1/callback
```

---

### 4. Setup AniList OAuth

```
1. Buka: https://anilist.co/settings/developer
2. Klik "Create new client"
3. Set redirect URI: https://stream.soraku.id/auth/callback
4. Copy Client ID dan Client Secret ke env variables
```

---

### 5. Push Prisma Schema ke Database

Setelah env variables diisi:
```bash
# Clone repo
git clone https://github.com/SorakuCommunity/stream.git
cd stream
npm install

# Buat .env.local dan isi DATABASE_URL + DIRECT_URL
cp .env.example .env.local

# Push schema ke Supabase
npx prisma db push
# atau:
npx prisma migrate dev --name init
```

---

## 📁 Struktur File Penting

```
stream/
├── .npmrc                          ← legacy-peer-deps=true (fix Vercel)
├── prisma/schema.prisma            ← User, WatchHistory, Watchlist, UserRole
├── src/
│   ├── app/
│   │   ├── layout.tsx              ← ThemeProvider, Navbar, Footer
│   │   ├── page.tsx                ← Home (SSR, AniList trending)
│   │   ├── watch/[id]/
│   │   │   ├── page.tsx            ← Server component, metadata
│   │   │   └── WatchClient.tsx     ← Episode list (AnimeKai)
│   │   ├── (public)/
│   │   │   ├── search/page.tsx     ← Filter genre/sort
│   │   │   ├── schedule/page.tsx   ← Jadwal mingguan AniList
│   │   │   └── about/page.tsx      ← Tentang Soraku
│   │   └── auth/
│   │       ├── login/page.tsx      ← 3 provider login
│   │       └── callback/route.ts   ← OAuth handler
│   ├── components/
│   │   ├── player/VideoPlayer.tsx  ← HLS.js custom (AnimeKai source)
│   │   ├── navigation/Navbar.tsx   ← Logo Soraku, search, theme
│   │   ├── navigation/Footer.tsx   ← Soraku Community
│   │   ├── cards/AnimeCard.tsx     ← Card anime + skeleton
│   │   └── home/
│   │       ├── HeroBanner.tsx      ← Carousel banner
│   │       └── AnimeSection.tsx    ← Grid section
│   └── lib/
│       ├── supabase/client.ts      ← Browser client
│       ├── supabase/server.ts      ← Server client
│       └── anilist/queries.ts      ← GraphQL queries
```

---

## 🔜 Yang Belum Ada (Sesi Selanjutnya)

- [ ] `/profile` — halaman profil user + AniList sync stats
- [ ] `/pptos` — Privacy Policy & Terms of Service
- [ ] Halaman 404 custom
- [ ] shadcn/ui components (`npx shadcn@latest init`)
- [ ] Middleware untuk route protection (role-based)
- [ ] AniList sync write-back (update progress ke AniList)

---

*Handoff updated: Maret 2026 — Fix Vercel build + AnimeKai + Prisma Pooler*
