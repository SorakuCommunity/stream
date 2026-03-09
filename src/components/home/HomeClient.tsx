"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimeCard, AnimeCardSkeleton } from "@/components/cards/AnimeCard";
import type { Anime } from "@/types";

const GENRES = [
  "Action","Adventure","Comedy","Drama","Fantasy",
  "Horror","Mecha","Music","Mystery","Psychological",
  "Romance","Sci-Fi","Shounen","Shoujo","Slice of Life",
  "Sports","Supernatural","Thriller",
];

type Tab = "NEWEST" | "POPULAR" | "TOP RATED";
const PER_PAGE = 18;

interface HomeClientProps {
  newest:   Anime[];
  popular:  Anime[];
  topRated: Anime[];
}

export function HomeClient({ newest, popular, topRated }: HomeClientProps) {
  const [tab,         setTab]         = useState<Tab>("NEWEST");
  const [page,        setPage]        = useState(0);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const genreRef = useRef<HTMLDivElement>(null);

  const map: Record<Tab, Anime[]> = { NEWEST: newest, POPULAR: popular, "TOP RATED": topRated };
  const raw        = map[tab];
  const filtered   = activeGenre ? raw.filter((a) => a.genres?.includes(activeGenre)) : raw;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage   = Math.min(page, totalPages - 1);
  const slice      = filtered.slice(safePage * PER_PAGE, (safePage + 1) * PER_PAGE);

  function changeTab(t: Tab) { setTab(t); setPage(0); }
  function changeGenre(g: string | null) { setActiveGenre(g); setPage(0); }
  function scrollGenre(dir: "l" | "r") {
    genreRef.current?.scrollBy({ left: dir === "l" ? -200 : 200, behavior: "smooth" });
  }

  return (
    <section>
      {/* ── Genre bar ───────────────────────────── */}
      <div className="relative flex items-center gap-2 mb-5">
        <button
          onClick={() => scrollGenre("l")}
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
        >
          <ChevronLeft size={13} />
        </button>

        <div
          ref={genreRef}
          className="flex-1 flex items-center gap-1.5 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {/* "Semua" pill */}
          <button
            onClick={() => changeGenre(null)}
            className="shrink-0 px-3.5 py-1 rounded-full text-xs font-700 transition-all"
            style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              background: activeGenre === null ? "var(--accent)" : "var(--bg-card)",
              color:      activeGenre === null ? "#fff"          : "var(--text-muted)",
              border:     activeGenre === null ? "1px solid transparent" : "1px solid var(--border)",
            }}
          >
            Semua
          </button>

          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => changeGenre(g === activeGenre ? null : g)}
              className="shrink-0 px-3.5 py-1 rounded-full text-xs font-700 transition-all"
              style={{
                fontFamily: "var(--font-display)", fontWeight: 700,
                background: activeGenre === g ? "var(--accent)" : "var(--bg-card)",
                color:      activeGenre === g ? "#fff"          : "var(--text-muted)",
                border:     activeGenre === g ? "1px solid transparent" : "1px solid var(--border)",
              }}
            >
              {g}
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollGenre("r")}
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
        >
          <ChevronRight size={13} />
        </button>
      </div>

      {/* ── Community banner ────────────────────── */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-2xl mb-6"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🌸</span>
          <div>
            <p className="text-sm font-700" style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-primary)" }}>
              Suka situsnya?
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Bergabung di Discord komunitas Soraku
            </p>
          </div>
        </div>
        <Link
          href="https://discord.gg/soraku"
          target="_blank" rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-700 transition-all hover:scale-105"
          style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            background: "#5865f2", color: "#fff",
            boxShadow: "0 4px 16px rgba(88,101,242,0.35)",
          }}
        >
          Discord
        </Link>
      </div>

      {/* ── Tab switcher + pagination ────────────── */}
      <div className="flex items-center justify-between mb-5">
        <div
          className="flex items-center gap-0.5 p-1 rounded-xl"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          {(["NEWEST", "POPULAR", "TOP RATED"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => changeTab(t)}
              className="px-3.5 py-1.5 rounded-lg text-[0.7rem] font-800 uppercase tracking-wider transition-all"
              style={{
                fontFamily: "var(--font-display)", fontWeight: 800,
                background: tab === t ? "var(--accent)" : "transparent",
                color:      tab === t ? "#fff"          : "var(--text-muted)",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className="w-7 h-7 flex items-center justify-center rounded-full transition-all disabled:opacity-30"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
            >
              <ChevronLeft size={13} />
            </button>
            <span className="text-xs font-700 tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-muted)" }}>
              {safePage + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
              className="w-7 h-7 flex items-center justify-center rounded-full transition-all disabled:opacity-30"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
            >
              <ChevronRight size={13} />
            </button>
          </div>
        )}
      </div>

      {/* ── Anime grid ──────────────────────────── */}
      {slice.length === 0 ? (
        <p className="text-center py-16 text-sm" style={{ color: "var(--text-muted)" }}>
          Tidak ada anime untuk genre ini.
        </p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
          {slice.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}
    </section>
  );
}
