"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Play } from "lucide-react";
import type { Anime } from "@/types";

interface Props { anime: Anime; }

function fmtCountdown(s: number): string {
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}h ${h}j`;
  if (h > 0) return `${h}j ${m}m`;
  return `${m}m`;
}

export function AnimeCard({ anime }: Props) {
  const title  = anime.title.english || anime.title.romaji;
  const img    = anime.coverImage.large || anime.coverImage.medium;
  const score  = anime.averageScore ? (anime.averageScore / 10).toFixed(1) : null;
  const airing = anime.nextAiringEpisode;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/anime/${anime.id}`}>
        {/* Cover */}
        <div
          className="relative w-full overflow-hidden mb-2"
          style={{ aspectRatio: "2/3", borderRadius: "var(--radius-lg)" }}
        >
          {img ? (
            <Image
              src={img} alt={title} fill
              sizes="(max-width:640px) 33vw,(max-width:1024px) 20vw,15vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundColor: anime.coverImage.color ?? "var(--bg-card)" }}
            />
          ) : (
            <div className="w-full h-full skeleton" />
          )}

          {/* Gradient on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 55%)" }}
          />

          {/* Score */}
          {score && (
            <div
              className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5"
              style={{
                borderRadius: "8px",
                background: "rgba(0,0,0,0.72)",
                backdropFilter: "blur(6px)",
              }}
            >
              <Star size={9} fill="#facc15" stroke="none" />
              <span
                className="text-[0.62rem] font-700"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#facc15" }}
              >
                {score}
              </span>
            </div>
          )}

          {/* Format badge (non-TV) */}
          {anime.format && anime.format !== "TV" && (
            <div
              className="absolute top-2 right-2 px-1.5 py-0.5"
              style={{
                borderRadius: "8px",
                background: "rgba(0,0,0,0.72)",
                backdropFilter: "blur(6px)",
              }}
            >
              <span
                className="text-[0.6rem] font-700"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "rgba(255,255,255,0.7)" }}
              >
                {anime.format}
              </span>
            </div>
          )}

          {/* Airing banner */}
          {airing && (
            <div
              className="absolute bottom-0 left-0 right-0 px-2 py-1.5 text-center"
              style={{ background: "linear-gradient(to top, rgba(var(--accent-rgb),0.9), rgba(var(--accent-rgb),0.5))" }}
            >
              <span
                className="text-[0.6rem] font-700 text-white block"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
              >
                Ep {airing.episode} · {fmtCountdown(airing.timeUntilAiring)}
              </span>
            </div>
          )}

          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(var(--accent-rgb),0.9)",
                boxShadow: "0 4px 20px rgba(var(--accent-rgb),0.5)",
              }}
            >
              <Play size={16} fill="white" stroke="none" />
            </div>
          </div>
        </div>

        {/* Title + ep count */}
        <p
          className="text-[0.75rem] font-600 line-clamp-2 leading-snug transition-colors group-hover:text-[var(--accent)]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text-primary)" }}
        >
          {title}
        </p>
        {(anime.episodes || anime.seasonYear) && !airing && (
          <p className="text-[0.65rem] mt-0.5" style={{ color: "var(--text-muted)" }}>
            {anime.seasonYear && <span>{anime.seasonYear}</span>}
            {anime.episodes && anime.seasonYear && " · "}
            {anime.episodes && <span>{anime.episodes} ep</span>}
          </p>
        )}
      </Link>

      {/* Hover preview — desktop only */}
      {hovered && (
        <div
          className="absolute left-[calc(100%+10px)] top-0 z-50 w-56 rounded-2xl overflow-hidden hidden lg:block pointer-events-none"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-strong)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            animation: "scaleIn 0.18s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          {/* Banner */}
          <div className="relative w-full h-28 overflow-hidden">
            <Image
              src={anime.bannerImage ?? img ?? ""}
              alt={title} fill
              className="object-cover"
              style={{ backgroundColor: anime.coverImage.color ?? "var(--bg-card)" }}
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to bottom, transparent 40%, var(--bg-secondary) 100%)" }}
            />
          </div>

          <div className="px-3 pb-3 -mt-2 relative">
            <p
              className="text-sm font-700 mb-2 line-clamp-2 leading-snug"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-primary)" }}
            >
              {title}
            </p>

            {/* Score + meta */}
            <div className="flex items-center gap-3 mb-2.5">
              {score && (
                <span className="flex items-center gap-1 text-xs">
                  <Star size={10} fill="#facc15" stroke="none" />
                  <span style={{ color: "#facc15", fontFamily: "var(--font-display)", fontWeight: 700 }}>{score}</span>
                </span>
              )}
              {anime.format && (
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{anime.format}</span>
              )}
              {anime.episodes && (
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{anime.episodes} ep</span>
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
                      background: "var(--bg-hover)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            <Link
              href={`/watch/${anime.id}`}
              className="pointer-events-auto flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-700 transition-opacity hover:opacity-90"
              style={{
                fontFamily: "var(--font-display)", fontWeight: 700,
                background: "var(--accent)", color: "#fff",
              }}
            >
              <Play size={11} fill="white" stroke="none" />
              Tonton
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
      <div className="w-full skeleton mb-2" style={{ aspectRatio: "2/3", borderRadius: "var(--radius-lg)" }} />
      <div className="skeleton h-3 w-full rounded mb-1" />
      <div className="skeleton h-2.5 w-3/5 rounded" />
    </div>
  );
}
