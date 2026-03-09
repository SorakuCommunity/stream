"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Download, Share2, Check, ChevronLeft, ChevronRight,
  Star, List, Grid3X3, RefreshCw, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VideoPlayer, type AnimeProvider } from "@/components/player/VideoPlayer";
import { searchEpisodes, type EpisodeInfo } from "@/lib/episode-search";
import type { Anime } from "@/types";

interface WatchClientProps {
  anime: Anime & {
    description?: string;
    studios?: { nodes: { name: string }[] };
    externalLinks?: { url: string; site: string }[];
    idMal?: number;
  };
}

const EP_PAGE_SIZE = 50;

export function WatchClient({ anime }: WatchClientProps) {
  const [episodes,     setEpisodes]     = useState<EpisodeInfo[]>([]);
  const [currentEp,    setCurrentEp]    = useState<EpisodeInfo | null>(null);
  const [loadingEps,   setLoadingEps]   = useState(true);
  const [epError,      setEpError]      = useState(false);
  const [lang,         setLang]         = useState<"sub" | "dub">("sub");
  const [provider,     setProvider]     = useState<AnimeProvider>("animekai");
  const [isTheater,    setIsTheater]    = useState(false);
  const [downloadLink, setDownloadLink] = useState("");
  const [isCopied,     setIsCopied]     = useState(false);
  const [showDesc,     setShowDesc]     = useState(false);
  const [epGrid,       setEpGrid]       = useState(false);
  const [epPage,       setEpPage]       = useState(0);

  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const consumetBase =
    process.env.NEXT_PUBLIC_CONSUMET_API_URL ?? "https://consumet-api.vercel.app";
  const title = anime.title.english || anime.title.romaji;
  const epSlice = episodes.slice(epPage * EP_PAGE_SIZE, (epPage + 1) * EP_PAGE_SIZE);
  const epPages = Math.ceil(episodes.length / EP_PAGE_SIZE);

  // ── Fetch episodes with multi-strategy search ──────────────────────────
  const fetchEpisodes = useCallback(async () => {
    setLoadingEps(true);
    setEpError(false);
    const eps = await searchEpisodes(
      consumetBase,
      anime.title.english,
      anime.title.romaji,
    );
    setEpisodes(eps);
    if (eps.length > 0) setCurrentEp(eps[0]);
    else setEpError(true);
    setLoadingEps(false);
  }, [consumetBase, anime.title.english, anime.title.romaji]);

  useEffect(() => { fetchEpisodes(); }, [fetchEpisodes]);

  // Scroll to active episode
  useEffect(() => {
    if (!currentEp) return;
    const pageIdx = Math.floor((currentEp.number - 1) / EP_PAGE_SIZE);
    setEpPage(pageIdx);
    setTimeout(() => {
      document.getElementById(`ep-${currentEp.id}`)?.scrollIntoView({
        behavior: "smooth", block: "nearest",
      });
    }, 100);
  }, [currentEp]);

  // Save watch progress
  useEffect(() => {
    if (!currentEp) return;
    try {
      const KEY = "soraku_watch_progress";
      const existing = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      const filtered = existing.filter((x: { animeId: number }) => x.animeId !== anime.id);
      filtered.unshift({
        animeId: anime.id,
        animeTitle: title,
        coverImage: anime.coverImage.large ?? anime.coverImage.medium ?? "",
        episodeId: currentEp.id,
        episodeNumber: currentEp.number,
        currentTime: 0,
        duration: 0,
        updatedAt: Date.now(),
      });
      localStorage.setItem(KEY, JSON.stringify(filtered.slice(0, 10)));
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEp?.id]);

  const goToEp = (ep: EpisodeInfo) => setCurrentEp(ep);
  const goPrev = () => {
    if (!currentEp) return;
    const i = episodes.findIndex((e) => e.id === currentEp.id);
    if (i > 0) setCurrentEp(episodes[i - 1]);
  };
  const goNext = () => {
    if (!currentEp) return;
    const i = episodes.findIndex((e) => e.id === currentEp.id);
    if (i < episodes.length - 1) setCurrentEp(episodes[i + 1]);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const studio = anime.studios?.nodes?.[0]?.name;
  const score  = anime.averageScore ? (anime.averageScore / 10).toFixed(1) : null;

  return (
    <div
      className={cn("min-h-screen transition-all duration-300")}
      style={{ background: isTheater ? "#000" : "var(--bg-primary)" }}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
      }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        const dy = e.changedTouches[0].clientY - touchStartY.current;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
          if (dx < 0) goNext(); else goPrev();
        }
      }}
    >
      <div className={cn(
        "mx-auto py-4",
        isTheater ? "max-w-full px-0" : "max-w-7xl px-4 sm:px-6",
      )}>
        {/* ── Layout: player + sidebar ── */}
        <div className={cn(
          "flex gap-5 mb-5",
          isTheater ? "flex-col" : "flex-col xl:flex-row",
        )}>

          {/* Player column */}
          <div className={cn("min-w-0", isTheater ? "w-full" : "flex-1")}>

            {/* Video */}
            <div
              className="relative w-full overflow-hidden bg-black"
              style={{
                aspectRatio: "16/9",
                borderRadius: isTheater ? "0" : "var(--radius-xl)",
                boxShadow: isTheater ? "none" : "0 8px 48px rgba(0,0,0,0.55)",
              }}
            >
              {currentEp ? (
                <VideoPlayer
                  episodeId={currentEp.id}
                  animeTitle={title}
                  episodeNumber={currentEp.number}
                  consumetBase={consumetBase}
                  lang={lang}
                  isTheater={isTheater}
                  onToggleTheater={() => setIsTheater((v) => !v)}
                  onDownloadLink={setDownloadLink}
                  onEpisodeEnd={goNext}
                  onPrevEpisode={goPrev}
                  onNextEpisode={goNext}
                  initialProvider={provider}
                  malId={anime.idMal}
                />
              ) : loadingEps ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 rounded-full animate-spin"
                      style={{ borderColor: "rgba(255,255,255,0.15)", borderTopColor: "var(--accent)" }} />
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-display)" }}>
                      Mencari episode…
                    </p>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4 text-center px-6">
                    <AlertCircle size={36} style={{ color: "rgba(255,255,255,0.3)" }} />
                    <p className="text-sm font-600" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-display)" }}>
                      Episode tidak tersedia dari server manapun
                    </p>
                    <button
                      onClick={fetchEpisodes}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-700 transition-all hover:scale-105"
                      style={{ background: "var(--accent)", color: "#fff", fontFamily: "var(--font-display)" }}
                    >
                      <RefreshCw size={12} />
                      Coba Lagi
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Controls row */}
            {!isTheater && (
              <div
                className="flex items-center justify-between gap-3 mt-3 px-1"
              >
                {/* Sub/Dub */}
                <div
                  className="flex items-center rounded-xl p-0.5"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                >
                  {(["sub", "dub"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-800 uppercase transition-all"
                      style={{
                        fontFamily: "var(--font-display)", fontWeight: 800,
                        background: lang === l ? "var(--accent)" : "transparent",
                        color: lang === l ? "#fff" : "var(--text-muted)",
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>

                {/* Right: download + share */}
                <div className="flex items-center gap-2">
                  {downloadLink && (
                    <a
                      href={downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-700 transition-all hover:scale-105"
                      style={{
                        fontFamily: "var(--font-display)", fontWeight: 700,
                        background: "var(--bg-card)", border: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <Download size={12} />
                      Unduh
                    </a>
                  )}
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-700 transition-all hover:scale-105"
                    style={{
                      fontFamily: "var(--font-display)", fontWeight: 700,
                      background: "var(--bg-card)", border: "1px solid var(--border)",
                      color: isCopied ? "var(--accent)" : "var(--text-secondary)",
                    }}
                  >
                    {isCopied ? <Check size={12} /> : <Share2 size={12} />}
                    {isCopied ? "Tersalin!" : "Bagikan"}
                  </button>
                </div>
              </div>
            )}

            {/* Anime info card — below player (hidden in theater) */}
            {!isTheater && (
              <div
                className="mt-5 rounded-2xl overflow-hidden"
                style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}
              >
                <div className="flex gap-4 p-4">
                  {/* Cover */}
                  <Link href={`/anime/${anime.id}`} className="shrink-0">
                    <div className="relative rounded-xl overflow-hidden" style={{ width: 64, aspectRatio: "2/3" }}>
                      <Image
                        src={anime.coverImage.large ?? anime.coverImage.medium ?? ""}
                        alt={title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/anime/${anime.id}`}>
                      <h1
                        className="font-800 leading-tight mb-1 line-clamp-2 hover:text-[var(--accent)] transition-colors"
                        style={{
                          fontFamily: "var(--font-display)", fontWeight: 800,
                          fontSize: "0.9375rem", color: "var(--text-primary)",
                        }}
                      >
                        {title}
                      </h1>
                    </Link>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {score && (
                        <span className="flex items-center gap-1 text-xs">
                          <Star size={10} fill="#facc15" stroke="none" />
                          <span style={{ color: "#facc15", fontFamily: "var(--font-display)", fontWeight: 700 }}>{score}</span>
                        </span>
                      )}
                      {anime.format && (
                        <span className="soraku-badge">{anime.format}</span>
                      )}
                      {anime.episodes && (
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {anime.episodes} ep
                        </span>
                      )}
                      {studio && (
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {studio}
                        </span>
                      )}
                    </div>

                    {/* Genres */}
                    {anime.genres && anime.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {anime.genres.slice(0, 4).map((g) => (
                          <span key={g} className="soraku-badge soraku-badge-accent text-[0.6rem]">{g}</span>
                        ))}
                      </div>
                    )}

                    {/* Description toggle */}
                    {anime.description && (
                      <div className="mt-2">
                        <div
                          className={cn("text-xs leading-relaxed transition-all overflow-hidden", !showDesc && "line-clamp-2")}
                          style={{ color: "var(--text-muted)" }}
                          dangerouslySetInnerHTML={{ __html: anime.description }}
                        />
                        <button
                          onClick={() => setShowDesc((v) => !v)}
                          className="text-[0.68rem] mt-1 font-600 hover:underline"
                          style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}
                        >
                          {showDesc ? "Lebih sedikit ↑" : "Baca selengkapnya ↓"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Episode sidebar / panel ── */}
          <div
            className={cn(
              "shrink-0 flex flex-col rounded-2xl overflow-hidden",
              isTheater ? "w-full max-h-40" : "xl:w-80 2xl:w-96",
            )}
            style={{
              height: isTheater ? "auto" : "min(680px, calc(100vw * 9/16))",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 shrink-0"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-800"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--text-primary)" }}
                >
                  EPISODE
                </span>
                {episodes.length > 0 && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "var(--bg-hover)", color: "var(--text-muted)", fontFamily: "var(--font-display)", fontWeight: 700 }}
                  >
                    {episodes.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setEpGrid(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                  style={{
                    background: !epGrid ? "var(--accent)" : "var(--bg-hover)",
                    color: !epGrid ? "#fff" : "var(--text-muted)",
                  }}
                >
                  <List size={13} />
                </button>
                <button
                  onClick={() => setEpGrid(true)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                  style={{
                    background: epGrid ? "var(--accent)" : "var(--bg-hover)",
                    color: epGrid ? "#fff" : "var(--text-muted)",
                  }}
                >
                  <Grid3X3 size={13} />
                </button>
              </div>
            </div>

            {/* Pagination */}
            {epPages > 1 && (
              <div
                className="flex items-center gap-1 px-3 py-2 shrink-0 overflow-x-auto"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                {Array.from({ length: epPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setEpPage(i)}
                    className="shrink-0 px-2.5 py-1 rounded-lg text-[0.68rem] font-700 transition-all"
                    style={{
                      fontFamily: "var(--font-display)", fontWeight: 700,
                      background: epPage === i ? "var(--accent)" : "var(--bg-hover)",
                      color: epPage === i ? "#fff" : "var(--text-muted)",
                    }}
                  >
                    {i * EP_PAGE_SIZE + 1}–{Math.min((i + 1) * EP_PAGE_SIZE, episodes.length)}
                  </button>
                ))}
              </div>
            )}

            {/* Episode list */}
            <div className="flex-1 overflow-y-auto">
              {loadingEps ? (
                <div className="p-4 space-y-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="skeleton h-10 rounded-xl" />
                  ))}
                </div>
              ) : epError || episodes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
                  <AlertCircle size={28} style={{ color: "var(--text-muted)" }} />
                  <p className="text-sm font-600" style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}>
                    Tidak ada episode tersedia
                  </p>
                  <button
                    onClick={fetchEpisodes}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-700 transition-all hover:scale-105"
                    style={{ background: "var(--accent)", color: "#fff", fontFamily: "var(--font-display)" }}
                  >
                    <RefreshCw size={12} />
                    Coba Lagi
                  </button>
                </div>
              ) : epGrid ? (
                <div className="grid grid-cols-5 gap-1.5 p-3">
                  {epSlice.map((ep) => {
                    const isActive = currentEp?.id === ep.id;
                    return (
                      <button
                        key={ep.id}
                        id={`ep-${ep.id}`}
                        onClick={() => goToEp(ep)}
                        className="aspect-square rounded-lg text-xs font-800 transition-all hover:scale-105"
                        style={{
                          fontFamily: "var(--font-display)", fontWeight: 800,
                          background: isActive ? "var(--accent)" : "var(--bg-hover)",
                          color: isActive ? "#fff" : "var(--text-secondary)",
                          boxShadow: isActive ? "0 4px 12px rgba(var(--accent-rgb),0.4)" : "none",
                        }}
                      >
                        {ep.number}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-2 space-y-0.5">
                  {epSlice.map((ep) => {
                    const isActive = currentEp?.id === ep.id;
                    return (
                      <button
                        key={ep.id}
                        id={`ep-${ep.id}`}
                        onClick={() => goToEp(ep)}
                        className="w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-3"
                        style={{
                          background: isActive ? "rgba(var(--accent-rgb),0.12)" : "transparent",
                          borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                        }}
                      >
                        <span
                          className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-800"
                          style={{
                            fontFamily: "var(--font-display)", fontWeight: 800,
                            background: isActive ? "var(--accent)" : "var(--bg-hover)",
                            color: isActive ? "#fff" : "var(--text-muted)",
                          }}
                        >
                          {ep.number}
                        </span>
                        <span
                          className="text-xs font-600 line-clamp-1 flex-1"
                          style={{
                            fontFamily: "var(--font-display)", fontWeight: isActive ? 700 : 600,
                            color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                          }}
                        >
                          {ep.title ?? `Episode ${ep.number}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Prev / Next nav */}
            {currentEp && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 shrink-0"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <button
                  onClick={goPrev}
                  disabled={episodes.indexOf(currentEp) <= 0}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-700 transition-all disabled:opacity-30 hover:scale-105 disabled:hover:scale-100"
                  style={{
                    fontFamily: "var(--font-display)", fontWeight: 700,
                    background: "var(--bg-hover)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <ChevronLeft size={13} />
                  Sebelumnya
                </button>
                <button
                  onClick={goNext}
                  disabled={episodes.indexOf(currentEp) >= episodes.length - 1}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-700 transition-all disabled:opacity-30 hover:scale-105 disabled:hover:scale-100"
                  style={{
                    fontFamily: "var(--font-display)", fontWeight: 700,
                    background: "var(--bg-hover)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Selanjutnya
                  <ChevronRight size={13} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
