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
  if (d > 0) return `${d}h ${h}j lagi`;
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}j ${m}m lagi`;
}

export function AnimeCard({ anime, className }: AnimeCardProps) {
  const title = anime.title.english || anime.title.romaji;
  const imageUrl = anime.coverImage.large || anime.coverImage.medium;

  return (
    <Link
      href={`/watch/${anime.id}`}
      className={cn(
        "group block relative rounded-lg overflow-hidden",
        "transition-transform duration-200 hover:scale-[1.03] hover:z-10",
        className
      )}
    >
      {/* Cover image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 20vw, 14vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            style={{
              backgroundColor: anime.coverImage.color ?? "var(--bg-card)",
            }}
          />
        ) : (
          <div className="w-full h-full skeleton" />
        )}

        {/* Score badge */}
        {anime.averageScore && (
          <div
            className="absolute top-1.5 left-1.5 text-xs font-bold px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: "rgba(0,0,0,0.75)",
              color:
                anime.averageScore >= 75
                  ? "#4ade80"
                  : anime.averageScore >= 60
                  ? "#facc15"
                  : "#f87171",
            }}
          >
            ★ {(anime.averageScore / 10).toFixed(1)}
          </div>
        )}

        {/* Format badge */}
        {anime.format && (
          <div
            className="absolute top-1.5 right-1.5 text-xs font-bold px-1.5 py-0.5 rounded"
            style={{ backgroundColor: "rgba(0,0,0,0.75)", color: "#e8e8e8" }}
          >
            {anime.format === "TV" ? "TV" : anime.format}
          </div>
        )}

        {/* Airing countdown */}
        {anime.nextAiringEpisode && (
          <div
            className="absolute bottom-0 left-0 right-0 text-xs px-2 py-1 text-center"
            style={{ backgroundColor: "rgba(108,140,255,0.85)", color: "#fff" }}
          >
            Ep {anime.nextAiringEpisode.episode} —{" "}
            {formatCountdown(anime.nextAiringEpisode.timeUntilAiring)}
          </div>
        )}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)",
          }}
        >
          <p className="text-white text-xs font-medium p-2 line-clamp-2">
            {title}
          </p>
        </div>
      </div>

      {/* Title below card */}
      <div className="mt-1.5 px-0.5">
        <p
          className="text-xs font-medium line-clamp-2 leading-snug"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </p>
        {anime.episodes && (
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {anime.episodes} episode
          </p>
        )}
      </div>
    </Link>
  );
}

// Skeleton loading card
export function AnimeCardSkeleton() {
  return (
    <div>
      <div className="aspect-[3/4] w-full skeleton rounded-lg" />
      <div className="mt-1.5 space-y-1">
        <div className="skeleton h-3 w-4/5 rounded" />
        <div className="skeleton h-2.5 w-1/2 rounded" />
      </div>
    </div>
  );
}
