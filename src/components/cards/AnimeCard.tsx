"use client";

import Link from "next/link";
import Image from "next/image";
import { Play, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Anime } from "@/types";

interface AnimeCardProps {
  anime: Anime;
  className?: string;
  progress?: number; // 0-100 for continue watching
  lastEp?: number;
}

function formatCountdown(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  if (d > 0) return `${d}h ${h}j`;
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}j ${m}m`;
  return `${m}m lagi`;
}

export function AnimeCard({ anime, className, progress, lastEp }: AnimeCardProps) {
  const title = anime.title.english || anime.title.romaji;
  const imageUrl = anime.coverImage.large ?? anime.coverImage.medium;
  const score = anime.averageScore ? (anime.averageScore / 10).toFixed(1) : null;
  const scoreColor =
    !anime.averageScore ? "#aaa"
    : anime.averageScore >= 75 ? "#4ade80"
    : anime.averageScore >= 60 ? "#facc15"
    : "#f87171";

  return (
    <Link href={`/watch/${anime.id}`} className={cn("group block relative", className)}>
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
            sizes="(max-width: 640px) 42vw, (max-width: 1024px) 22vw, 15vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            style={{ backgroundColor: anime.coverImage.color ?? "var(--bg-card)" }}
          />
        ) : (
          <div className="w-full h-full skeleton" />
        )}

        {/* Hover overlay gradient */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.1) 70%, transparent 100%)" }}
        />

        {/* Play button — center, appears on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 pointer-events-none">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center shadow-2xl"
            style={{ backgroundColor: "var(--accent)", boxShadow: "0 4px 24px rgba(var(--accent-rgb),0.5)" }}
          >
            <Play size={18} fill="white" strokeWidth={0} className="translate-x-0.5" />
          </div>
        </div>

        {/* Score badge — top left */}
        {score && (
          <div
            className="absolute top-2 left-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[0.67rem] font-bold"
            style={{
              backgroundColor: "rgba(0,0,0,0.72)",
              backdropFilter: "blur(6px)",
              color: scoreColor,
              fontFamily: "var(--font-display)",
            }}
          >
            <Star size={8} fill={scoreColor} strokeWidth={0} />
            {score}
          </div>
        )}

        {/* Format badge — top right */}
        {anime.format && (
          <div
            className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[0.62rem] font-bold uppercase"
            style={{
              backgroundColor: "rgba(0,0,0,0.72)",
              backdropFilter: "blur(6px)",
              color: "rgba(255,255,255,0.75)",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.03em",
            }}
          >
            {anime.format === "TV_SHORT" ? "Short" : anime.format}
          </div>
        )}

        {/* Airing next episode */}
        {anime.nextAiringEpisode && (
          <div
            className="absolute bottom-0 left-0 right-0 py-1 text-center text-[0.67rem] font-semibold"
            style={{
              background: "linear-gradient(to top, rgba(var(--accent-rgb),0.92), rgba(var(--accent-rgb),0.6))",
              color: "#fff",
              fontFamily: "var(--font-display)",
              backdropFilter: "blur(4px)",
            }}
          >
            Ep {anime.nextAiringEpisode.episode} · {formatCountdown(anime.nextAiringEpisode.timeUntilAiring)}
          </div>
        )}

        {/* Last ep label for continue watching */}
        {lastEp !== undefined && !anime.nextAiringEpisode && (
          <div
            className="absolute bottom-0 left-0 right-0 p-2 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
          >
            <p className="text-[0.68rem]" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body)" }}>
              Ep {lastEp} terakhir
            </p>
          </div>
        )}

        {/* Progress bar */}
        {progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
            <div
              className="h-full"
              style={{ width: `${progress}%`, backgroundColor: "var(--accent)" }}
            />
          </div>
        )}
      </div>

      {/* Title below */}
      <div className="mt-2 px-0.5">
        <p
          className="text-xs font-semibold line-clamp-2 leading-snug transition-colors group-hover:text-[var(--accent)]"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
        >
          {title}
        </p>
        <p className="text-[0.7rem] mt-0.5 flex items-center gap-1.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
          {anime.seasonYear && <span>{anime.seasonYear}</span>}
          {anime.episodes && (
            <>
              {anime.seasonYear && <span style={{ opacity: 0.4 }}>·</span>}
              <span>{anime.episodes} ep</span>
            </>
          )}
        </p>
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
