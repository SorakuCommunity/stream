"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Info, ChevronLeft, ChevronRight, Star, Tv2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Anime } from "@/types";

interface HeroBannerProps { animes: Anime[]; }

function timeUntil(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  if (d > 0) return `${d}h ${h}j`;
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}j ${m}m`;
}

export function HeroBanner({ animes }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransit] = useState(false);

  const go = useCallback((next: number) => {
    if (transitioning) return;
    setTransit(true);
    setTimeout(() => { setCurrent(next); setTransit(false); }, 300);
  }, [transitioning]);

  useEffect(() => {
    if (animes.length <= 1) return;
    const t = setInterval(() => go((current + 1) % animes.length), 7000);
    return () => clearInterval(t);
  }, [current, animes.length, go]);

  if (!animes.length) return null;
  const anime = animes[current];
  const title = anime.title.english || anime.title.romaji;
  const airing = anime.nextAiringEpisode;

  return (
    <div
      className="relative w-full mb-8 overflow-hidden"
      style={{ borderRadius: "var(--radius-xl)", height: "clamp(300px, 44vw, 520px)" }}
    >
      {/* Background image */}
      {anime.bannerImage && (
        <Image
          key={anime.id}
          src={anime.bannerImage}
          alt={title}
          fill priority sizes="100vw"
          className={cn("object-cover transition-all duration-500", transitioning ? "opacity-0 scale-105" : "opacity-100 scale-100")}
        />
      )}

      {/* Layered gradient overlays for cinematic feel */}
      <div className="absolute inset-0" style={{
        background: `
          linear-gradient(to right, rgba(9,9,12,0.97) 0%, rgba(9,9,12,0.75) 35%, rgba(9,9,12,0.2) 65%, transparent 85%),
          linear-gradient(to top, rgba(9,9,12,0.9) 0%, transparent 55%)
        `,
      }} />

      {/* Accent color tint from cover image */}
      {anime.coverImage.color && (
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 70% 50%, ${anime.coverImage.color}44, transparent 70%)` }}
        />
      )}

      {/* Top badges */}
      <div className="absolute top-5 left-5 z-10 flex items-center gap-2">
        {airing && (
          <span className="soraku-badge soraku-badge-live flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            Ep {airing.episode} — {timeUntil(airing.timeUntilAiring)} lagi
          </span>
        )}
        {anime.format && (
          <span className="soraku-badge soraku-badge-glass">{anime.format}</span>
        )}
      </div>

      {/* Episode counter top right */}
      {anime.episodes && airing && (
        <div className="absolute top-5 right-5 z-10">
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.8)",
              fontFamily: "var(--font-display)",
            }}
          >
            {airing.episode - 1} / {anime.episodes}
          </span>
        </div>
      )}

      {/* Main content */}
      <div className="absolute inset-0 flex items-end p-6 sm:p-10">
        <div
          className={cn("max-w-xl transition-all duration-300", transitioning ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0")}
        >
          {/* Season / year */}
          <p
            className="text-[0.7rem] font-700 uppercase tracking-[0.14em] mb-2"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--accent)" }}
          >
            {anime.season} {anime.seasonYear}
          </p>

          {/* Title */}
          <h1
            className="font-900 mb-3 leading-[1.1]"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)",
              color: "#fff",
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            }}
          >
            {title}
          </h1>

          {/* Meta row */}
          <div className="flex items-center flex-wrap gap-3 mb-4">
            {anime.averageScore && (
              <div className="flex items-center gap-1">
                <Star size={12} fill="#facc15" stroke="none" />
                <span className="text-xs font-700" style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#facc15" }}>
                  {(anime.averageScore / 10).toFixed(1)}
                </span>
              </div>
            )}
            {anime.episodes && (
              <div className="flex items-center gap-1">
                <Tv2 size={11} style={{ color: "rgba(255,255,255,0.5)" }} />
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {anime.episodes} ep
                </span>
              </div>
            )}
            {anime.status && (
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                {anime.status === "RELEASING" ? "Sedang Tayang" : anime.status === "FINISHED" ? "Selesai" : anime.status}
              </span>
            )}
          </div>

          {/* Genre pills */}
          {anime.genres && anime.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {anime.genres.slice(0, 4).map((g) => (
                <span
                  key={g}
                  className="text-[0.68rem] px-2.5 py-0.5 rounded-full font-600"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <Link
              href={`/watch/${anime.id}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-700 text-sm transition-all hover:scale-105"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                background: "var(--accent)",
                color: "#fff",
                boxShadow: "0 4px 24px rgba(var(--accent-rgb),0.5)",
              }}
            >
              <Play size={15} fill="white" stroke="none" />
              TONTON
            </Link>
            <Link
              href={`/anime/${anime.id}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-700 text-sm transition-all hover:scale-105"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              <Info size={14} />
              DETAIL
            </Link>
          </div>
        </div>
      </div>

      {/* Cover image floating on right (Miruro style) */}
      <div
        className={cn(
          "absolute bottom-6 right-6 hidden lg:block transition-all duration-300",
          transitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
        )}
      >
        <Image
          src={anime.coverImage.large || anime.coverImage.medium || ""}
          alt={title}
          width={100}
          height={140}
          className="rounded-xl object-cover shadow-2xl"
          style={{
            boxShadow: `0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)`,
          }}
        />
      </div>

      {/* Prev/Next arrows */}
      {animes.length > 1 && (
        <>
          <button
            onClick={() => go((current - 1 + animes.length) % animes.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full transition-all hover:scale-110"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => go((current + 1) % animes.length)}
            className="absolute right-[120px] lg:right-36 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full transition-all hover:scale-110"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }}
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Progress dots */}
      {animes.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
          {animes.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="rounded-full transition-all"
              style={{
                width: i === current ? "20px" : "6px",
                height: "6px",
                background: i === current ? "var(--accent)" : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
