"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, X, Clock } from "lucide-react";

export interface WatchHistoryEntry {
  animeId: number;
  animeTitle: string;
  coverImage: string;
  coverColor?: string;
  episodeNumber: number;
  episodeId: string;
  progress: number; // 0-100
  timestamp: number; // ms
}

const STORAGE_KEY = "soraku_watch_history";

export function saveWatchHistory(entry: WatchHistoryEntry) {
  try {
    const existing = loadWatchHistory();
    const filtered = existing.filter((e) => e.animeId !== entry.animeId);
    const updated = [entry, ...filtered].slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

export function loadWatchHistory(): WatchHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function removeFromHistory(animeId: number) {
  try {
    const existing = loadWatchHistory().filter((e) => e.animeId !== animeId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {}
}

// ─── Component ───────────────────────────────────────────────────────────────
export function ContinueWatching() {
  const [history, setHistory] = useState<WatchHistoryEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHistory(loadWatchHistory());
  }, []);

  const remove = (id: number) => {
    removeFromHistory(id);
    setHistory((h) => h.filter((e) => e.animeId !== id));
  };

  if (!mounted || history.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="soraku-section-title">
          <Clock size={14} style={{ color: "var(--accent)" }} />
          Lanjut Nonton
        </h2>
        <button
          onClick={() => { localStorage.removeItem(STORAGE_KEY); setHistory([]); }}
          className="text-xs transition-colors hover:text-[var(--accent)]"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          Hapus semua
        </button>
      </div>

      <div className="scroll-row">
        {history.slice(0, 12).map((item) => (
          <div key={item.animeId} className="group relative shrink-0" style={{ width: "clamp(120px, 14vw, 160px)" }}>
            {/* Card */}
            <Link href={`/watch/${item.animeId}`}>
              <div className="relative overflow-hidden" style={{ aspectRatio: "3/4", borderRadius: "var(--radius-lg)" }}>
                <Image
                  src={item.coverImage}
                  alt={item.animeTitle}
                  fill
                  sizes="160px"
                  className="object-cover transition-transform duration-400 group-hover:scale-[1.05]"
                  style={{ backgroundColor: item.coverColor ?? "var(--bg-card)" }}
                />

                {/* Overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 50%, transparent 80%)" }}
                />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--accent)", boxShadow: "0 4px 20px rgba(var(--accent-rgb),0.5)" }}
                  >
                    <Play size={16} fill="white" strokeWidth={0} className="translate-x-0.5" />
                  </div>
                </div>

                {/* Ep label */}
                <div
                  className="absolute bottom-2 left-2 right-2 text-[0.68rem] font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-display)" }}
                >
                  Ep {item.episodeNumber}
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                  <div className="h-full transition-all" style={{ width: `${item.progress}%`, backgroundColor: "var(--accent)" }} />
                </div>
              </div>
            </Link>

            {/* Remove button */}
            <button
              onClick={() => remove(item.animeId)}
              className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-10"
              style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
              title="Hapus dari riwayat"
            >
              <X size={10} style={{ color: "rgba(255,255,255,0.85)" }} />
            </button>

            {/* Title */}
            <div className="mt-2 px-0.5">
              <p
                className="text-xs font-semibold line-clamp-2 leading-snug"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
              >
                {item.animeTitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
