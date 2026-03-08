"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { AnimeCard } from "@/components/cards/AnimeCard";
import { cn } from "@/lib/utils";
import type { Anime } from "@/types";

const GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy",
  "Horror", "Mecha", "Music", "Mystery", "Psychological",
  "Romance", "Sci-Fi", "Shoujo", "Shounen", "Slice of Life",
  "Sports", "Supernatural", "Thriller",
];

type Tab = "NEWEST" | "POPULAR" | "TOP RATED";

interface HomeClientProps {
  newest:   Anime[];
  popular:  Anime[];
  topRated: Anime[];
}

const PER_PAGE = 14;

export function HomeClient({ newest, popular, topRated }: HomeClientProps) {
  const [activeTab,   setActiveTab]   = useState<Tab>("NEWEST");
  const [tabPage,     setTabPage]     = useState(0);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const genreRef = useRef<HTMLDivElement>(null);

  const dataMap: Record<Tab, Anime[]> = { NEWEST: newest, POPULAR: popular, "TOP RATED": topRated };
  const data      = dataMap[activeTab];
  const totalPages = Math.ceil(data.length / PER_PAGE);
  const slice      = data.slice(tabPage * PER_PAGE, (tabPage + 1) * PER_PAGE);

  const filtered = activeGenre
    ? slice.filter((a) => a.genres?.includes(activeGenre))
    : slice;

  const scrollGenre = (dir: "left" | "right") => {
    const el = genreRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  const handleTab = (tab: Tab) => {
    setActiveTab(tab);
    setTabPage(0);
  };

  return (
    <div>
      {/* ── Genre scroll tabs ── */}
      <div className="relative flex items-center gap-2 mb-6">
        <button onClick={() => scrollGenre("left")}
          className="shrink-0 p-1.5 rounded-full transition-colors hover:text-white"
          style={{ color: "var(--text-muted)", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <ChevronLeft size={14} />
        </button>

        <div ref={genreRef}
          className="flex-1 flex items-center gap-2 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {/* All */}
          <button
            onClick={() => setActiveGenre(null)}
            className="shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all"
            style={{
              fontFamily: "var(--font-display)",
              backgroundColor: activeGenre === null ? "var(--accent)" : "var(--bg-card)",
              color: activeGenre === null ? "#fff" : "var(--text-muted)",
              border: `1px solid ${activeGenre === null ? "transparent" : "var(--border)"}`,
            }}>
            All
          </button>
          {GENRES.map((g) => (
            <button key={g}
              onClick={() => setActiveGenre(g === activeGenre ? null : g)}
              className="shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all"
              style={{
                fontFamily: "var(--font-display)",
                backgroundColor: activeGenre === g ? "var(--accent)" : "var(--bg-card)",
                color: activeGenre === g ? "#fff" : "var(--text-muted)",
                border: `1px solid ${activeGenre === g ? "transparent" : "var(--border)"}`,
              }}>
              {g}
            </button>
          ))}
        </div>

        <button onClick={() => scrollGenre("right")}
          className="shrink-0 p-1.5 rounded-full transition-colors hover:text-white"
          style={{ color: "var(--text-muted)", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* ── Social / community bar ── */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-6"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
        }}>
        <div className="flex items-center gap-3">
          {/* Avatar stack */}
          <div className="flex -space-x-2">
            {["/soraku-logo.png"].map((src, i) => (
              <div key={i} className="w-8 h-8 rounded-full overflow-hidden"
                style={{ border: "2px solid var(--bg-card)", backgroundColor: "var(--bg-hover)" }}>
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
              Love the Site?
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
              Join komunitas Soraku di Discord
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="https://discord.gg/soraku" target="_blank" rel="noopener noreferrer"
            className="p-2 rounded-lg transition-colors hover:text-white"
            style={{ backgroundColor: "var(--bg-hover)", color: "var(--text-muted)" }}
            title="Discord">
            <MessageSquare size={16} />
          </Link>
          {/* Reddit icon via SVG */}
          <Link href="https://reddit.com/r/soraku" target="_blank" rel="noopener noreferrer"
            className="p-2 rounded-lg transition-colors hover:text-white"
            style={{ backgroundColor: "var(--bg-hover)", color: "var(--text-muted)" }}
            title="Reddit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
            </svg>
          </Link>
          {/* X/Twitter */}
          <Link href="https://x.com/soraku" target="_blank" rel="noopener noreferrer"
            className="p-2 rounded-lg transition-colors hover:text-white"
            style={{ backgroundColor: "var(--bg-hover)", color: "var(--text-muted)" }}
            title="Twitter/X">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* ── NEWEST / POPULAR / TOP RATED tabs ── */}
      <div className="flex items-center justify-between mb-4">
        {/* Tab buttons */}
        <div className="flex items-center gap-0 p-1 rounded-xl"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
          {(["NEWEST", "POPULAR", "TOP RATED"] as Tab[]).map((tab) => (
            <button key={tab} onClick={() => handleTab(tab)}
              className="px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all"
              style={{
                fontFamily: "var(--font-display)",
                backgroundColor: activeTab === tab ? "var(--accent)" : "transparent",
                color: activeTab === tab ? "#fff" : "var(--text-muted)",
                letterSpacing: "0.05em",
              }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button onClick={() => setTabPage((p) => Math.max(0, p - 1))} disabled={tabPage === 0}
              className="p-1.5 rounded-full transition-all disabled:opacity-30 hover:scale-110"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs font-bold tabular-nums"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}>
              {tabPage + 1}
            </span>
            <button onClick={() => setTabPage((p) => Math.min(totalPages - 1, p + 1))} disabled={tabPage >= totalPages - 1}
              className="p-1.5 rounded-full transition-all disabled:opacity-30 hover:scale-110"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Anime grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
          Tidak ada anime untuk genre ini.
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
          {filtered.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}
    </div>
  );
}
