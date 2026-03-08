"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Download, Share2, Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import type { Anime } from "@/types";

interface WatchClientProps {
  anime: Anime & {
    description?: string;
    studios?: { nodes: { name: string }[] };
    externalLinks?: { url: string; site: string }[];
  };
}

interface EpisodeInfo {
  id: string;
  number: number;
  title?: string;
}

export function WatchClient({ anime }: WatchClientProps) {
  const [episodes, setEpisodes] = useState<EpisodeInfo[]>([]);
  const [currentEp, setCurrentEp] = useState<EpisodeInfo | null>(null);
  const [sourceType, setSourceType] = useState("default");
  const [language, setLanguage] = useState("sub");
  const [downloadLink, setDownloadLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  const [loadingEps, setLoadingEps] = useState(true);

  const consumetBase =
    process.env.NEXT_PUBLIC_CONSUMET_API_URL ??
    "https://consumet-api.vercel.app";

  const animeTitle = anime.title.english || anime.title.romaji;

  // Fetch episode list dari AnimeKai
  useEffect(() => {
    const slug = animeTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    fetch(
      `${consumetBase}/anime/animekai/${encodeURIComponent(slug)}`
    )
      .then((r) => r.json())
      .then((data) => {
        // AnimeKai returns results array, take first match
        const result = data?.results?.[0];
        if (result?.id) {
          // Fetch episode list by anime ID
          return fetch(
            `${consumetBase}/anime/animekai/info/${encodeURIComponent(result.id)}`
          ).then((r) => r.json());
        }
        return null;
      })
      .then((info) => {
        const eps: EpisodeInfo[] =
          info?.episodes?.map(
            (e: { id: string; number: number; title?: string }) => ({
              id: e.id,
              number: e.number,
              title: e.title,
            })
          ) ?? [];
        setEpisodes(eps);
        if (eps.length > 0) setCurrentEp(eps[0]);
      })
      .catch(() => setEpisodes([]))
      .finally(() => setLoadingEps(false));
  }, [anime.id, animeTitle, consumetBase]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const goToPrevEp = () => {
    if (!currentEp) return;
    const idx = episodes.findIndex((e) => e.id === currentEp.id);
    if (idx > 0) setCurrentEp(episodes[idx - 1]);
  };

  const goToNextEp = () => {
    if (!currentEp) return;
    const idx = episodes.findIndex((e) => e.id === currentEp.id);
    if (idx < episodes.length - 1) setCurrentEp(episodes[idx + 1]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Player */}
      <div
        className="w-full rounded-xl overflow-hidden mb-4"
        style={{ aspectRatio: "16/9", backgroundColor: "#000" }}
      >
        {currentEp ? (
          <VideoPlayer
            episodeId={currentEp.id}
            animeTitle={animeTitle}
            episodeNumber={currentEp.number}
            sourceType={sourceType}
            language={language}
            consumetBase={consumetBase}
            onDownloadLink={setDownloadLink}
            onEpisodeEnd={goToNextEp}
            onPrevEpisode={goToPrevEp}
            onNextEpisode={goToNextEp}
          />
        ) : (
          <div className="w-full h-full skeleton" />
        )}
      </div>

      {/* Controls row */}
      <div
        className="flex flex-wrap items-center gap-2 p-3 rounded-xl mb-3"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        <span className="text-sm flex-1" style={{ color: "var(--text-secondary)" }}>
          {currentEp ? (
            <>
              Sedang menonton{" "}
              <strong style={{ color: "var(--text-primary)" }}>
                Episode {currentEp.number}
              </strong>
            </>
          ) : (
            <span
              className="skeleton inline-block rounded"
              style={{ width: "8rem", height: "1rem" }}
            />
          )}
        </span>

        {/* Source toggles */}
        <div className="flex gap-1.5 flex-wrap">
          {[
            { s: "default", l: "sub", label: "Sub — Default" },
            { s: "animekai", l: "sub", label: "Sub — AK" },
            { s: "default", l: "dub", label: "Dub" },
          ].map(({ s, l, label }) => (
            <button
              key={`${s}-${l}`}
              onClick={() => {
                setSourceType(s);
                setLanguage(l);
              }}
              className={cn(
                "soraku-btn text-xs py-1 px-2.5",
                sourceType === s && language === l && "soraku-btn-accent"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-1.5">
          <a
            href={downloadLink || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="soraku-btn p-2"
            title="Unduh episode"
          >
            <Download size={15} />
          </a>
          <button
            onClick={handleShare}
            className="soraku-btn p-2 gap-1.5 text-xs"
            title="Bagikan"
          >
            {isCopied ? <Check size={15} /> : <Share2 size={15} />}
            {isCopied ? "Disalin!" : ""}
          </button>
        </div>
      </div>

      <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
        Jika server saat ini tidak berfungsi, silakan coba server lain di atas.
      </p>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Left: Anime info */}
        <div>
          <div className="flex gap-4 mb-5">
            <Image
              src={anime.coverImage.large ?? "/soraku-logo.png"}
              alt={animeTitle}
              width={88}
              height={120}
              className="rounded-xl object-cover shrink-0"
              style={{ backgroundColor: "var(--bg-card)" }}
            />
            <div className="flex-1 min-w-0">
              <h1
                className="text-lg font-bold mb-2 leading-snug"
                style={{ color: "var(--text-primary)" }}
              >
                {animeTitle}
              </h1>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {anime.genres?.slice(0, 5).map((g) => (
                  <span
                    key={g}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "var(--bg-hover)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>
              <div
                className="flex gap-3 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                {anime.averageScore && (
                  <span className="flex items-center gap-1">
                    <span style={{ color: "#facc15" }}>★</span>
                    {(anime.averageScore / 10).toFixed(1)}
                  </span>
                )}
                {anime.episodes && <span>{anime.episodes} ep</span>}
                {anime.format && <span>{anime.format}</span>}
                {anime.season && (
                  <span>
                    {anime.season} {anime.seasonYear}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Deskripsi */}
          {anime.description && (
            <div>
              <div
                className={cn(
                  "text-sm leading-relaxed transition-all overflow-hidden",
                  !showDesc ? "line-clamp-3" : ""
                )}
                style={{ color: "var(--text-secondary)" }}
                dangerouslySetInnerHTML={{ __html: anime.description }}
              />
              <button
                onClick={() => setShowDesc((v) => !v)}
                className="flex items-center gap-1 text-xs mt-2 hover:underline"
                style={{ color: "var(--accent)" }}
              >
                {showDesc ? (
                  <>
                    <ChevronUp size={12} /> Lebih sedikit
                  </>
                ) : (
                  <>
                    <ChevronDown size={12} /> Selengkapnya
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right: Episode list */}
        <div
          className="rounded-xl p-4 h-fit"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <h3
            className="text-sm font-bold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Daftar Episode{" "}
            <span style={{ color: "var(--text-muted)" }}>
              ({episodes.length})
            </span>
          </h3>

          <div
            className="flex flex-col gap-1 overflow-y-auto"
            style={{ maxHeight: "22rem" }}
          >
            {loadingEps ? (
              Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="skeleton h-8 rounded-lg" />
              ))
            ) : episodes.length === 0 ? (
              <p
                className="text-xs text-center py-6"
                style={{ color: "var(--text-muted)" }}
              >
                Tidak ada episode tersedia saat ini.
              </p>
            ) : (
              episodes.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => setCurrentEp(ep)}
                  className={cn(
                    "text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                    currentEp?.id === ep.id
                      ? "text-white"
                      : "hover:bg-[var(--bg-hover)]"
                  )}
                  style={
                    currentEp?.id === ep.id
                      ? { backgroundColor: "var(--accent)" }
                      : { color: "var(--text-secondary)" }
                  }
                >
                  Ep {ep.number}
                  {ep.title && (
                    <span className="ml-1 opacity-60 line-clamp-1">
                      — {ep.title}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
