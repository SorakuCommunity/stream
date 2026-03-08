"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Anime } from "@/types";

interface AnimeCardProps {
  anime: Anime;
  className?: string;
}

function formatCountdown(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  if (d > 0) return `${d}h ${h}j`;
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}j ${m}m`;
  return `${m}m lagi`;
}

export function AnimeCard({ anime, className }: AnimeCardProps) {
  const title = anime.title.english || anime.title.romaji;
  const imageUrl = anime.coverImage.large ?? anime.coverImage.medium;
  const score = anime.averageScore ? (anime.averageScore / 10).toFixed(1) : null;

  return (
    <Link
      href={`/watch/${anime.id}`}
      className={cn("group block relative", className)}
    >
      {/* Cover */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "3/4", borderRadius: "var(--radius-lg)" }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 20vw, 14vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.07]"
            style={{ backgroundColor: anime.coverImage.color ?? "var(--bg-card)" }}
          />
        ) : (
          <div className="w-full h-full skeleton" />
        )}

        {/* Gradient base */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 45%, transparent 75%)" }}
        />

        {/* Score badge */}
        {score && (
          <div
            className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[0.68rem] font-bold transition-opacity"
            style={{
              backgroundColor: "rgba(0,0,0,0.72)",
              color: anime.averageScore! >= 75 ? "#4ade80" : anime.averageScore! >= 60 ? "#facc15" : "#f87171",
              fontFamily: "var(--font-display)",
              backdropFilter: "blur(4px)",
            }}
          >
            ★ {score}
          </div>
        )}

        {/* Format badge */}
        {anime.format && (
          <div
            className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[0.65rem] font-bold"
            style={{
              backgroundColor: "rgba(0,0,0,0.72)",
              color: "#ddd",
              fontFamily: "var(--font-display)",
              backdropFilter: "blur(4px)",
            }}
          >
            {anime.format}
          </div>
        )}

        {/* Airing badge */}
        {anime.nextAiringEpisode && (
          <div
            className="absolute bottom-0 left-0 right-0 px-2 py-1 text-center text-[0.68rem] font-semibold"
            style={{
              background: "linear-gradient(to top, rgba(var(--accent-rgb),0.95), rgba(var(--accent-rgb),0.7))",
              color: "#fff",
              fontFamily: "var(--font-display)",
              backdropFilter: "blur(4px)",
            }}
          >
            Ep {anime.nextAiringEpisode.episode} · {formatCountdown(anime.nextAiringEpisode.timeUntilAiring)}
          </div>
        )}

        {/* Hover title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
          <p className="text-white text-xs font-medium line-clamp-2 leading-snug"
            style={{ fontFamily: "var(--font-display)" }}>
            {title}
          </p>
        </div>
      </div>

      {/* Title below */}
      <div className="mt-2 px-0.5">
        <p
          className="text-xs font-semibold line-clamp-2 leading-snug transition-colors group-hover:text-[var(--accent)]"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
        >
          {title}
        </p>
        {anime.episodes && (
          <p className="text-[0.7rem] mt-0.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
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
      <div className="skeleton w-full" style={{ aspectRatio: "3/4", borderRadius: "var(--radius-lg)" }} />
      <div className="mt-2 space-y-1.5 px-0.5">
        <div className="skeleton h-3 w-4/5 rounded" />
        <div className="skeleton h-2.5 w-2/5 rounded" />
      </div>
    </div>
  );
}
