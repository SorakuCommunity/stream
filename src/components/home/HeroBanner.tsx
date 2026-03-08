"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Anime } from "@/types";

interface HeroBannerProps {
  animes: Anime[];
}

export function HeroBanner({ animes }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);

  if (!animes.length) return null;
  const anime = animes[current];
  const title = anime.title.english || anime.title.romaji;

  return (
    <div className="relative w-full mb-8 overflow-hidden rounded-xl"
      style={{ height: "clamp(220px, 35vw, 420px)" }}>

      {/* Background image */}
      {anime.bannerImage && (
        <Image
          src={anime.bannerImage}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.85) 35%, transparent 75%), linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex items-end p-6 sm:p-8">
        <div className="max-w-lg animate-fade-in">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: "var(--accent)" }}
          >
            {anime.format} • {anime.season} {anime.seasonYear}
          </p>
          <h1
            className="text-2xl sm:text-3xl font-bold mb-2 line-clamp-2"
            style={{ color: "#fff" }}
          >
            {title}
          </h1>
          {anime.averageScore && (
            <p className="text-sm mb-3" style={{ color: "#ccc" }}>
              ★ {(anime.averageScore / 10).toFixed(1)} &nbsp;·&nbsp;{" "}
              {anime.episodes ? `${anime.episodes} episode` : "Ongoing"}
            </p>
          )}
          <div className="flex items-center gap-3">
            <Link
              href={`/watch/${anime.id}`}
              className="soraku-btn soraku-btn-accent gap-2"
            >
              <Play size={16} fill="currentColor" />
              Tonton
            </Link>
            <Link
              href={`/watch/${anime.id}`}
              className="soraku-btn"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff" }}
            >
              <Info size={16} />
              Detail
            </Link>
          </div>
        </div>
      </div>

      {/* Prev/Next controls */}
      {animes.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((c) => (c - 1 + animes.length) % animes.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all hover:scale-110"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "#fff" }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setCurrent((c) => (c + 1) % animes.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all hover:scale-110"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "#fff" }}
          >
            <ChevronRight size={18} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 right-6 flex gap-1.5">
            {animes.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "rounded-full transition-all",
                  i === current ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
