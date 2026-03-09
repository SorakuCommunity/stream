"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimeCard } from "@/components/cards/AnimeCard";
import { cn } from "@/lib/utils";
import type { Anime } from "@/types";

const GENRES = [
  "Action","Adventure","Comedy","Drama","Fantasy",
  "Horror","Mecha","Music","Mystery","Psychological",
  "Romance","Sci-Fi","Shoujo","Shounen","Slice of Life",
  "Sports","Supernatural","Thriller",
];

type Tab = "NEWEST" | "POPULAR" | "TOP RATED";
interface HomeClientProps { newest: Anime[]; popular: Anime[]; topRated: Anime[]; }
const PER_PAGE = 21;

export function HomeClient({ newest, popular, topRated }: HomeClientProps) {
  const [activeTab,   setActiveTab]   = useState<Tab>("NEWEST");
  const [tabPage,     setTabPage]     = useState(0);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const genreRef = useRef<HTMLDivElement>(null);

  const dataMap: Record<Tab, Anime[]> = { NEWEST: newest, POPULAR: popular, "TOP RATED": topRated };
  const data       = dataMap[activeTab];
  const totalPages = Math.ceil(data.length / PER_PAGE);
  const slice      = data.slice(tabPage * PER_PAGE, (tabPage + 1) * PER_PAGE);
  const filtered   = activeGenre ? slice.filter((a) => a.genres?.includes(activeGenre)) : slice;

  const scrollGenre = (dir: "left" | "right") => {
    genreRef.current?.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };
  const handleTab = (tab: Tab) => { setActiveTab(tab); setTabPage(0); };

  return (
    <div>
      {/* ── Genre scroll tabs ── */}
      <div className="relative flex items-center gap-2 mb-6">
        <button
          onClick={() => scrollGenre("left")}
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-all hover:scale-110"
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "blur(8px)",
            border: "1px solid var(--glass-border)",
            color: "var(--text-muted)",
          }}
        >
          <ChevronLeft size={13} />
        </button>

        <div
          ref={genreRef}
          className="flex-1 flex items-center gap-1.5 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <button
            onClick={() => setActiveGenre(null)}
            className="shrink-0 px-3 py-1.5 rounded-full text-[0.72rem] font-700 transition-all"
            style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              background: activeGenre === null ? "var(--accent)" : "var(--glass-bg)",
              backdropFilter: "blur(8px)",
              color: activeGenre === null ? "#fff" : "var(--text-muted)",
              border: activeGenre === null ? "1px solid transparent" : "1px solid var(--glass-border)",
            }}
          >
            Semua
          </button>
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGenre(g === activeGenre ? null : g)}
              className="shrink-0 px-3 py-1.5 rounded-full text-[0.72rem] font-700 transition-all hover:scale-105"
              style={{
                fontFamily: "var(--font-display)", fontWeight: 700,
                background: activeGenre === g ? "var(--accent)" : "var(--glass-bg)",
                backdropFilter: "blur(8px)",
                color: activeGenre === g ? "#fff" : "var(--text-muted)",
                border: activeGenre === g ? "1px solid transparent" : "1px solid var(--glass-border)",
              }}
            >
              {g}
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollGenre("right")}
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-all hover:scale-110"
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "blur(8px)",
            border: "1px solid var(--glass-border)",
            color: "var(--text-muted)",
          }}
        >
          <ChevronRight size={13} />
        </button>
      </div>

      {/* ── Community bar ── */}
      <div
        className="flex items-center justify-between px-4 py-3.5 rounded-2xl mb-6"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-base"
            style={{ background: "linear-gradient(135deg, #7b9fff, #a78bfa)", boxShadow: "0 4px 14px rgba(123,159,255,0.4)" }}
          >
            🌸
          </div>
          <div>
            <p className="text-sm font-700" style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-primary)" }}>
              Suka Situsnya?
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Bergabung di Discord komunitas Soraku
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {[
            { href: "https://discord.gg/soraku", emoji: "💬", label: "Discord" },
            { href: "https://github.com/SorakuCommunity", emoji: "⚙️", label: "GitHub" },
          ].map(({ href, emoji, label }) => (
            <Link
              key={href}
              href={href}
              target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-xl text-sm transition-all hover:scale-110"
              style={{
                background: "var(--bg-hover)",
                border: "1px solid var(--border)",
              }}
              title={label}
            >
              {emoji}
            </Link>
          ))}
        </div>
      </div>

      {/* ── NEWEST / POPULAR / TOP RATED ── */}
      <div className="flex items-center justify-between mb-5">
        <div
          className="flex items-center gap-0.5 p-1 rounded-xl"
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "blur(10px)",
            border: "1px solid var(--glass-border)",
          }}
        >
          {(["NEWEST", "POPULAR", "TOP RATED"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTab(tab)}
              className="px-3.5 py-1.5 rounded-lg text-[0.72rem] font-800 uppercase tracking-wider transition-all"
              style={{
                fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "0.05em",
                background: activeTab === tab ? "var(--accent)" : "transparent",
                color: activeTab === tab ? "#fff" : "var(--text-muted)",
                boxShadow: activeTab === tab ? "0 2px 10px rgba(var(--accent-rgb),0.4)" : "none",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTabPage((p) => Math.max(0, p - 1))}
              disabled={tabPage === 0}
              className="w-7 h-7 flex items-center justify-center rounded-full transition-all disabled:opacity-30 hover:scale-110"
              style={{ background: "var(--glass-bg)", backdropFilter: "blur(8px)", border: "1px solid var(--glass-border)", color: "var(--text-muted)" }}
            >
              <ChevronLeft size={13} />
            </button>
            <span className="text-xs font-700 tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-muted)" }}>
              {tabPage + 1} / {totalPages}
            </span>
            <button
              onClick={() => setTabPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={tabPage >= totalPages - 1}
              className="w-7 h-7 flex items-center justify-center rounded-full transition-all disabled:opacity-30 hover:scale-110"
              style={{ background: "var(--glass-bg)", backdropFilter: "blur(8px)", border: "1px solid var(--glass-border)", color: "var(--text-muted)" }}
            >
              <ChevronRight size={13} />
            </button>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>
          Tidak ada anime untuk genre ini.
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4">
          {filtered.map((anime) => <AnimeCard key={anime.id} anime={anime} />)}
        </div>
      )}
    </div>
  );
}
