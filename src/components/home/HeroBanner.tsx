"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Info, ChevronLeft, ChevronRight, Star, Tv2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Anime } from "@/types";

interface HeroBannerProps { animes: Anime[]; }

export function HeroBanner({ animes }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const go = useCallback((next: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(next);
      setTransitioning(false);
    }, 200);
  }, [transitioning]);

  // Auto-advance every 6 s
  useEffect(() => {
    if (animes.length <= 1) return;
    const t = setInterval(() => {
      go((current + 1) % animes.length);
    }, 6000);
    return () => clearInterval(t);
  }, [current, animes.length, go]);

  if (!animes.length) return null;
  const anime = animes[current];
  const title = anime.title.english || anime.title.romaji;

  return (
    <div
      className="relative w-full mb-10 overflow-hidden"
      style={{ borderRadius: "var(--radius-xl)", height: "clamp(240px, 38vw, 460px)" }}
    >
      {/* Background image */}
      {anime.bannerImage && (
        <Image
          key={anime.id}
          src={anime.bannerImage}
          alt={title}
          fill
          priority
          sizes="100vw"
          className={cn(
            "object-cover transition-opacity duration-300",
            transitioning ? "opacity-0" : "opacity-100"
          )}
        />
      )}

      {/* Cinematic gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.15) 75%, transparent 100%),
            linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 45%)
          `,
        }}
      />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "150px",
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex items-end p-6 sm:p-10">
        <div className={cn("max-w-xl transition-all duration-300", transitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0")}>
          {/* Meta badges */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {anime.format && (
              <span className="soraku-badge">
                <Tv2 size={9} /> {anime.format}
              </span>
            )}
            {anime.season && (
              <span className="soraku-badge">
                {anime.season} {anime.seasonYear}
              </span>
            )}
            {anime.averageScore && (
              <span className="soraku-badge soraku-badge-accent">
                <Star size={9} fill="currentColor" />
                {(anime.averageScore / 10).toFixed(1)}
              </span>
            )}
          </div>

          {/* Title */}
          <h1
            className="text-2xl sm:text-[2rem] font-bold mb-3 leading-tight text-white line-clamp-2"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}
          >
            {title}
          </h1>

          {/* Stats */}
          {(anime.episodes || anime.status) && (
            <p className="text-sm mb-4 opacity-70 text-white"
              style={{ fontFamily: "var(--font-body)" }}>
              {anime.episodes && `${anime.episodes} episode`}
              {anime.episodes && anime.status && " · "}
              {anime.status && anime.status.replace(/_/g, " ")}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <Link
              href={`/watch/${anime.id}`}
              className="soraku-btn soraku-btn-accent gap-2 px-5 py-2.5"
              style={{ fontSize: "0.8125rem" }}
            >
              <Play size={15} fill="currentColor" />
              Tonton Sekarang
            </Link>
            <Link
              href={`/watch/${anime.id}`}
              className="soraku-btn gap-2 py-2.5"
              style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}
            >
              <Info size={15} />
              Detail
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      {animes.length > 1 && (
        <>
          <button
            onClick={() => go((current - 1 + animes.length) % animes.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all hover:scale-110 active:scale-95"
            style={{ backgroundColor: "rgba(0,0,0,0.45)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => go((current + 1) % animes.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all hover:scale-110 active:scale-95"
            style={{ backgroundColor: "rgba(0,0,0,0.45)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
          >
            <ChevronRight size={18} />
          </button>

          {/* Progress dots */}
          <div className="absolute bottom-5 right-6 flex items-center gap-1.5">
            {animes.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? "20px" : "6px",
                  height: "6px",
                  backgroundColor: i === current ? "var(--accent)" : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Thumbnail strip — right side */}
      {animes.length > 1 && (
        <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2">
          {animes.slice(0, 4).map((a, i) => (
            <button
              key={a.id}
              onClick={() => go(i)}
              className={cn(
                "relative w-12 h-16 overflow-hidden rounded-lg transition-all duration-200",
                i === current ? "ring-2 opacity-100" : "opacity-40 hover:opacity-70"
              )}
              style={{ borderRadius: "var(--radius)", boxShadow: i === current ? `0 0 0 2px var(--accent)` : undefined }}
            >
              {a.coverImage.large && (
                <Image src={a.coverImage.large} alt="" fill sizes="48px" className="object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
