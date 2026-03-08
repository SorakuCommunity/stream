"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Info, ChevronLeft, ChevronRight, Star, Tv2, Clock, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Anime } from "@/types";

interface HeroBannerProps { animes: Anime[]; }

export function HeroBanner({ animes }: HeroBannerProps) {
  const [current, setCurrent]       = useState(0);
  const [transitioning, setTransit] = useState(false);

  const go = useCallback((next: number) => {
    if (transitioning) return;
    setTransit(true);
    setTimeout(() => { setCurrent(next); setTransit(false); }, 250);
  }, [transitioning]);

  useEffect(() => {
    if (animes.length <= 1) return;
    const t = setInterval(() => go((current + 1) % animes.length), 6000);
    return () => clearInterval(t);
  }, [current, animes.length, go]);

  if (!animes.length) return null;
  const anime = animes[current];
  const title = anime.title.english || anime.title.romaji;
  const airing = anime.nextAiringEpisode;
  const airingEp = airing?.episode;
  const totalEp  = anime.episodes;

  return (
    <div
      className="relative w-full mb-6 overflow-hidden"
      style={{ borderRadius: "var(--radius-xl)", height: "clamp(300px, 42vw, 500px)" }}
    >
      {anime.bannerImage && (
        <Image
          key={anime.id}
          src={anime.bannerImage}
          alt={title}
          fill priority
          sizes="100vw"
          className={cn("object-cover transition-opacity duration-300", transitioning ? "opacity-0" : "opacity-100")}
        />
      )}

      <div className="absolute inset-0" style={{
        background: `
          linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.65) 42%, rgba(0,0,0,0.15) 70%, transparent 100%),
          linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)
        `,
      }} />

      {/* Airing badge - top left */}
      {airing && airingEp && (
        <div className="absolute top-4 left-4 z-10">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{
              backgroundColor: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              fontFamily: "var(--font-display)",
            }}>
            <Clock size={11} className="shrink-0" style={{ color: "var(--accent)" }} />
            Ep {airingEp} Airing Now
          </span>
        </div>
      )}

      {/* Episode counter - top right */}
      {airingEp && totalEp && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold"
            style={{
              backgroundColor: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.85)",
              fontFamily: "var(--font-display)",
            }}>
            {airingEp} / {totalEp}
          </span>
        </div>
      )}

      <div className="absolute inset-0 flex items-end pb-8 px-6 sm:px-10">
        <div className={cn(
          "max-w-lg transition-all duration-300",
          transitioning ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
        )}>
          {/* Meta row - TV · 12 · ★81 · 24 mins */}
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            {anime.format && (
              <span className="flex items-center gap-1 text-xs font-semibold text-white/70"
                style={{ fontFamily: "var(--font-display)" }}>
                <Tv2 size={11} /> {anime.format}
              </span>
            )}
            {anime.episodes && (
              <span className="flex items-center gap-1 text-xs font-semibold text-white/70"
                style={{ fontFamily: "var(--font-display)" }}>
                <Layers size={11} /> {anime.episodes}
              </span>
            )}
            {anime.averageScore && (
              <span className="flex items-center gap-1 text-xs font-semibold"
                style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}>
                <Star size={11} fill="currentColor" /> {anime.averageScore}
              </span>
            )}
          </div>

          {/* Title — accent/gold color */}
          <h1 className="text-2xl sm:text-3xl font-black mb-3 leading-tight line-clamp-2"
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.03em",
              color: "var(--accent)",
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            }}>
            {title}
          </h1>

          {/* Genre pills */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {anime.genres?.slice(0, 3).map((g) => (
              <span key={g} className="text-xs px-3 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: "var(--font-body)",
                  backdropFilter: "blur(6px)",
                }}>
                {g}
              </span>
            ))}
          </div>

          {/* CTA buttons - Miruro style: outlined, wide, rounded-full */}
          <div className="flex items-center gap-2.5">
            <Link href={`/watch/${anime.id}`}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1.5px solid rgba(255,255,255,0.3)",
                color: "#fff",
                fontFamily: "var(--font-display)",
                backdropFilter: "blur(8px)",
                minWidth: "140px",
              }}>
              <Play size={14} fill="currentColor" /> WATCH NOW
            </Link>
            <Link href={`/anime/${anime.id}`}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1.5px solid rgba(255,255,255,0.3)",
                color: "#fff",
                fontFamily: "var(--font-display)",
                backdropFilter: "blur(8px)",
                minWidth: "120px",
              }}>
              <Info size={14} /> DETAILS
            </Link>
          </div>
        </div>
      </div>

      {/* Nav arrows */}
      {animes.length > 1 && (
        <>
          <button onClick={() => go((current - 1 + animes.length) % animes.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all hover:scale-110 active:scale-95"
            style={{ backgroundColor: "rgba(0,0,0,0.45)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => go((current + 1) % animes.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all hover:scale-110 active:scale-95"
            style={{ backgroundColor: "rgba(0,0,0,0.45)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-4 right-5 flex items-center gap-1.5">
            {animes.map((_, i) => (
              <button key={i} onClick={() => go(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? "20px" : "6px",
                  height: "6px",
                  backgroundColor: i === current ? "var(--accent)" : "rgba(255,255,255,0.3)",
                }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
