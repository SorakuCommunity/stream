# Soraku Anime Streaming

Web streaming anime menggunakan Laravel + Inertia.js + React.

## Stack (Sesuai Prompt)

| Komponen | Status | Versi |
|----------|--------|-------|
| Backend | ✅ Laravel 13 | PHP 8.3+ |
| Frontend | ✅ React 18 | 18.3.1 |
| Inertia.js | ✅ | 3.0.3 |
| Vite | ✅ | 8.0.0 |
| TailwindCSS | ✅ | 4.0.0 |
| Vidstack | ✅ | 0.6.15 |
| API | ✅ | apistreams.vercel.app/v1 |

## Cara Menjalankan

### Prerequisites
- PHP 8.2+
- Node.js 18+
- Composer

### Setup

```bash
# 1. Clone/Masuk ke folder project
cd /home/riu/Projects/Stream

# 2. Install dependencies PHP
composer install

# 3. Install dependencies Node.js
npm install

# 4. Generate app key (jika belum ada)
php artisan key:generate
```

### Menjalankan Development

```bash
# Terminal 1: Jalankan Vite dev server
npm run dev

# Terminal 2: Jalankan Laravel server
php artisan serve
```

Akses: http://localhost:8000

### Mode Production

```bash
# Build assets
npm run build

# Jalankan server
php artisan serve
```

## Routes

| Route | Deskripsi |
|-------|-----------|
| `/` | Home (trending, recent) |
| `/search?q=` | Search page |
| `/anime/:id` | Anime details |
| `/watch/:episodeId` | Video player |
| `/schedule` | Anime schedule |
| `/profile` | User profile |

## Environment Variables

```env
NEXT_PUBLIC_API_URL=https://apistreams.vercel.app/v1
```

## Struktur Folder

```
stream/
├── app/
│   └── Services/
│       └── AnimeApiService.php    # API Service
├── resources/
│   └── js/
│       ├── components/
│       │   └── Layout.jsx         # Main layout
│       └── pages/
│           ├── Home.jsx           # Homepage
│           ├── Search.jsx         # Search
│           ├── AnimeDetail.jsx    # Detail anime
│           ├── Watch.jsx          # Video player
│           ├── Schedule.jsx      # Jadwal
│           └── Profile.jsx       # Profil user
├── routes/
│   └── web.php                    # Route definitions
└── config/
    └── services.php               # API config
```

## Catatan

- Vidstack player tersedia tapi perlu diimplementasikan dengan API video sebenarnya
- Data menggunakan dummy data jika API tidak tersedia
- Untuk production ke Laravel Cloud, lihat dokumentasi Laravel Cloud