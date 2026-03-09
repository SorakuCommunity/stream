"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, X, Clock } from "lucide-react";

export interface WatchProgress {
  animeId: number;
  animeTitle: string;
  coverImage: string;
  episodeId: string;
  episodeNumber: number;
  currentTime: number;
  duration: number;
  updatedAt: number;
}

const KEY = "soraku_watch_progress";

export function getWatchProgress(): WatchProgress[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch { return []; }
}

export function saveWatchProgress(p: WatchProgress) {
  if (typeof window === "undefined") return;
  const list = getWatchProgress().filter((x) => x.animeId !== p.animeId);
  list.unshift(p);
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 10)));
}

export function removeWatchProgress(animeId: number) {
  if (typeof window === "undefined") return;
  const list = getWatchProgress().filter((x) => x.animeId !== animeId);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function ContinueWatching() {
  const [items, setItems] = useState<WatchProgress[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(getWatchProgress());
  }, []);

  const remove = (id: number) => {
    removeWatchProgress(id);
    setItems((p) => p.filter((x) => x.animeId !== id));
  };

  if (!mounted || items.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="soraku-section-title mb-5">
        <Clock size={14} style={{ color: "var(--accent)" }} />
        Lanjutkan Menonton
      </h2>

      <div className="scroll-row">
        {items.map((item) => {
          const pct = item.duration > 0 ? (item.currentTime / item.duration) * 100 : 0;
          return (
            <div
              key={item.animeId}
              className="group relative shrink-0 rounded-2xl overflow-hidden transition-all hover:-translate-y-1"
              style={{
                width: "clamp(140px, 22vw, 180px)",
                background: "var(--glass-bg)",
                backdropFilter: "blur(16px)",
                border: "1px solid var(--glass-border)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              {/* Cover */}
              <div className="relative w-full aspect-[3/4] overflow-hidden">
                <Image
                  src={item.coverImage}
                  alt={item.animeTitle}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(9,9,12,0.95) 0%, transparent 55%)" }}
                />
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: "rgba(255,255,255,0.15)" }}>
                  <div
                    className="h-full transition-all"
                    style={{ width: `${pct}%`, background: "var(--accent)" }}
                  />
                </div>
                {/* Play button */}
                <Link
                  href={`/watch/${item.animeId}?ep=${item.episodeId}&t=${Math.floor(item.currentTime)}`}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center"
                    style={{
                      background: "rgba(var(--accent-rgb),0.9)",
                      boxShadow: "0 4px 20px rgba(var(--accent-rgb),0.5)",
                    }}
                  >
                    <Play size={18} fill="white" stroke="none" />
                  </div>
                </Link>
                {/* Remove button */}
                <button
                  onClick={() => remove(item.animeId)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(0,0,0,0.6)", color: "rgba(255,255,255,0.7)" }}
                >
                  <X size={11} />
                </button>
              </div>

              {/* Info */}
              <div className="p-2.5">
                <p
                  className="text-[0.72rem] font-700 line-clamp-2 leading-snug mb-1"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-primary)" }}
                >
                  {item.animeTitle}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[0.65rem]" style={{ color: "var(--text-muted)" }}>
                    Ep {item.episodeNumber}
                  </span>
                  <span
                    className="text-[0.62rem] font-700"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--accent)" }}
                  >
                    {Math.round(pct)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
