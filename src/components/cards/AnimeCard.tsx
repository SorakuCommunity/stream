"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Play } from "lucide-react";
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
  const img = anime.coverImage.large || anime.coverImage.medium;
  const score = anime.averageScore ? (anime.averageScore / 10).toFixed(1) : null;

  return (
    <Link
      href={`/anime/${anime.id}`}
      className={cn("group block relative", className)}
    >
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

        {/* Gradient overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "linear-gradient(to top, rgba(9,9,12,0.95) 0%, rgba(9,9,12,0.4) 50%, transparent 100%)" }}
        />

        {/* Score badge */}
        {score && (
          <div
            className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-lg"
            style={{
              background: "rgba(9,9,12,0.75)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Star size={9} fill="#facc15" stroke="none" />
            <span className="text-[0.65rem] font-700 text-yellow-300" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
              {score}
            </span>
          </div>
        )}

        {/* Format badge */}
        {anime.format && anime.format !== "TV" && (
          <div
            className="absolute top-2 right-2 px-1.5 py-0.5 rounded-lg"
            style={{
              background: "rgba(9,9,12,0.75)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <span className="text-[0.6rem] font-700 text-white/70" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
              {anime.format}
            </span>
          </div>
        )}

        {/* Airing badge */}
        {anime.nextAiringEpisode && (
          <div
            className="absolute bottom-0 left-0 right-0 px-2 py-1.5"
            style={{
              background: "linear-gradient(to top, rgba(var(--accent-rgb),0.9), rgba(var(--accent-rgb),0.6))",
            }}
          >
            <span className="text-[0.62rem] font-700 text-white block text-center" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Ep {anime.nextAiringEpisode.episode} — {countdown(anime.nextAiringEpisode.timeUntilAiring)}
            </span>
          </div>
        )}

        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
            style={{
              background: "rgba(var(--accent-rgb),0.9)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 20px rgba(var(--accent-rgb),0.5)",
            }}
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
          <p className="text-[0.65rem] mt-0.5" style={{ color: "var(--text-muted)" }}>
            {anime.episodes} ep
          </p>
        )}
      </div>
    </Link>
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
