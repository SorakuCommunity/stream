"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Play, Tv2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Anime } from "@/types";

interface AnimeCardProps { anime: Anime; className?: string; }

function countdown(s: number): string {
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  if (d > 0) return `${d}h ${h}j`;
  const m = Math.floor((s % 3600) / 60);
  return `${h}j ${m}m`;
}

export function AnimeCard({ anime, className }: AnimeCardProps) {
  const title = anime.title.english || anime.title.romaji;
  const img   = anime.coverImage.large || anime.coverImage.medium;
  const score = anime.averageScore ? (anime.averageScore / 10).toFixed(1) : null;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={cn("group block relative", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/anime/${anime.id}`}>
        {/* Cover */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl">
          {img ? (
            <Image
              src={img}
              alt={title}
              fill
              sizes="(max-width: 640px) 40vw, (max-width: 1024px) 20vw, 14vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundColor: anime.coverImage.color ?? "var(--bg-card)" }}
            />
          ) : (
            <div className="w-full h-full skeleton" />
          )}

          {/* Hover gradient */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "linear-gradient(to top, rgba(9,9,12,0.95) 0%, rgba(9,9,12,0.4) 50%, transparent 100%)" }}
          />

          {/* Score badge */}
          {score && (
            <div
              className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-lg"
              style={{ background: "rgba(9,9,12,0.75)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <Star size={9} fill="#facc15" stroke="none" />
              <span className="text-[0.65rem] font-700 text-yellow-300" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>{score}</span>
            </div>
          )}

          {/* Format badge */}
          {anime.format && anime.format !== "TV" && (
            <div
              className="absolute top-2 right-2 px-1.5 py-0.5 rounded-lg"
              style={{ background: "rgba(9,9,12,0.75)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <span className="text-[0.6rem] font-700 text-white/70" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>{anime.format}</span>
            </div>
          )}

          {/* Airing bar */}
          {anime.nextAiringEpisode && (
            <div
              className="absolute bottom-0 left-0 right-0 px-2 py-1.5"
              style={{ background: "linear-gradient(to top, rgba(var(--accent-rgb),0.92), rgba(var(--accent-rgb),0.6))" }}
            >
              <span className="text-[0.62rem] font-700 text-white block text-center" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                Ep {anime.nextAiringEpisode.episode} · {countdown(anime.nextAiringEpisode.timeUntilAiring)}
              </span>
            </div>
          )}

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ background: "rgba(var(--accent-rgb),0.9)", backdropFilter: "blur(8px)", boxShadow: "0 4px 20px rgba(var(--accent-rgb),0.5)" }}
            >
              <Play size={16} fill="white" stroke="none" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mt-2 px-0.5">
          <p
            className="text-xs font-600 line-clamp-2 leading-snug transition-colors group-hover:text-[var(--accent)]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text-primary)" }}
          >
            {title}
          </p>
          {anime.episodes && !anime.nextAiringEpisode && (
            <p className="text-[0.65rem] mt-0.5" style={{ color: "var(--text-muted)" }}>{anime.episodes} ep</p>
          )}
        </div>
      </Link>

      {/* Hover preview card — desktop only */}
      {hovered && (
        <div
          className="absolute left-[calc(100%+8px)] top-0 z-50 w-52 rounded-2xl overflow-hidden hidden lg:block animate-scale-in"
          style={{
            background: "rgba(14,14,20,0.96)",
            backdropFilter: "blur(24px) saturate(200%)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          {/* Banner or cover */}
          {(anime.bannerImage || img) && (
            <div className="relative w-full h-28 overflow-hidden">
              <Image
                src={anime.bannerImage ?? img ?? ""}
                alt={title}
                fill
                className="object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(14,14,20,0.98) 100%)" }}
              />
            </div>
          )}

          <div className="p-3 -mt-3 relative">
            <p
              className="text-sm font-700 mb-2 line-clamp-2 leading-snug"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#fff" }}
            >
              {title}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2.5">
              {score && (
                <span className="flex items-center gap-1 text-xs">
                  <Star size={10} fill="#facc15" stroke="none" />
                  <span style={{ color: "#facc15", fontFamily: "var(--font-display)", fontWeight: 700 }}>{score}</span>
                </span>
              )}
              {anime.episodes && (
                <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <Tv2 size={10} />{anime.episodes} ep
                </span>
              )}
              {anime.format && (
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{anime.format}</span>
              )}
            </div>

            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {anime.genres.slice(0, 3).map((g) => (
                  <span
                    key={g}
                    className="text-[0.6rem] px-2 py-0.5 rounded-full font-600"
                    style={{
                      fontFamily: "var(--font-display)", fontWeight: 600,
                      background: "rgba(var(--accent-rgb),0.15)",
                      color: "var(--accent)",
                      border: "1px solid rgba(var(--accent-rgb),0.2)",
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* CTA */}
            <Link
              href={`/watch/${anime.id}`}
              className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-700 transition-all hover:opacity-90"
              style={{
                fontFamily: "var(--font-display)", fontWeight: 700,
                background: "var(--accent)",
                color: "#fff",
                boxShadow: "0 4px 16px rgba(var(--accent-rgb),0.4)",
              }}
            >
              <Play size={12} fill="white" stroke="none" />
              Tonton Sekarang
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export function AnimeCardSkeleton() {
  return (
    <div>
      <div className="aspect-[3/4] w-full skeleton rounded-xl" />
      <div className="mt-2 space-y-1.5">
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-2.5 w-3/5 rounded" />
      </div>
    </div>
  );
}
