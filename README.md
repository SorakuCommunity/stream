<div align="center">

# 🌌 Soraku Stream

**Platform streaming anime komunitas — oleh Soraku Community**

[![Version](https://img.shields.io/badge/version-0.1.0-blue?style=flat-square)](https://github.com/SorakuCommunity/stream)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Discord](https://img.shields.io/badge/Discord-Soraku-5865F2?style=flat-square&logo=discord)](https://discord.gg/soraku)

</div>

---

## ✨ Stack

| Layer | Teknologi |
|---|---|
| Framework | **Next.js 16** App Router |
| Language | TypeScript (Strict) |
| Styling | **TailwindCSS 4** |
| UI | **shadcn/ui** + Radix + Lucide |
| Auth | **Supabase Auth** (AniList, Discord, Email) |
| Database | **Supabase PostgreSQL** + **Prisma ORM** |
| Anime Data | **AniList GraphQL** |
| Video | **HLS.js** custom player |
| Deployment | **Vercel** |

## 🚀 Setup

```bash
git clone https://github.com/SorakuCommunity/stream.git
cd stream
npm install
cp .env.example .env.local
npm run dev
```

## 🔐 Auth Providers

- **AniList** — OAuth 2.0, auto-sync anime list
- **Discord** — via Supabase OAuth
- **Email + Password** — via Supabase Auth

## 🗺️ Roadmap

```
v0.1.0  ✅  Foundation — Next.js 16, streaming, 3 auth, Indonesian UI
v0.2.0  🔲  Jadwal, Berita, Profil lengkap, AniList sync
v0.3.0  🔲  Watch Rooms (Discord VC sync)
v0.4.0  🔲  Komentar episode + reaksi
v1.0.0  🔲  Premium access, Nonton Bareng Events
```

---

<div align="center">

Dibuat dengan ❤️ oleh **Soraku Community**

*"Sora" — Langit tanpa batas, milik kita bersama.*

</div>
