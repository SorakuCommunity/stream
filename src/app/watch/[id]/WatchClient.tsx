"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Download, Share2, Check, ChevronDown, ChevronUp,
  Star, Tv2, Clock, List, Grid3X3, ChevronLeft, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VideoPlayer, type AnimeProvider } from "@/components/player/VideoPlayer";
import type { Anime } from "@/types";

interface WatchClientProps {
  anime: Anime & {
    description?: string;
    studios?: { nodes: { name: string }[] };
    externalLinks?: { url: string; site: string }[];
  };
}

interface EpisodeInfo { id: string; number: number; title?: string; }

const EP_PAGE_SIZE = 50;

export function WatchClient({ anime }: WatchClientProps) {
  const [episodes,    setEpisodes]    = useState<EpisodeInfo[]>([]);
  const [currentEp,   setCurrentEp]   = useState<EpisodeInfo | null>(null);
  const [loadingEps,  setLoadingEps]  = useState(true);
  const [lang,        setLang]        = useState<"sub" | "dub">("sub");
  const [provider,    setProvider]    = useState<AnimeProvider>("animekai");
  const [isTheater,   setIsTheater]   = useState(false);
  const [downloadLink,setDownloadLink]= useState("");
  const [isCopied,    setIsCopied]    = useState(false);
  const [showDesc,    setShowDesc]    = useState(false);
  const [epGrid,      setEpGrid]      = useState(false);
  const [epPage,      setEpPage]      = useState(0); // paginated episodes

  const consumetBase = process.env.NEXT_PUBLIC_CONSUMET_API_URL ?? "https://consumet-api.vercel.app";
  const title = anime.title.english || anime.title.romaji;

  // Paginated episodes slice
  const epPages     = Math.ceil(episodes.length / EP_PAGE_SIZE);
  const epSlice     = episodes.slice(epPage * EP_PAGE_SIZE, (epPage + 1) * EP_PAGE_SIZE);

  // ─── Fetch episode list ──────────────────────────────────────────────────
  const fetchEpisodes = useCallback(async () => {
    setLoadingEps(true);
    const slug = title.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().replace(/\s+/g, "-");
    try {
      // Search → info pattern for AnimeKai
      const searchRes = await fetch(`${consumetBase}/anime/animekai/${encodeURIComponent(slug)}`);
      const searchData = await searchRes.json();
      const match = searchData?.results?.[0];
      if (!match?.id) throw new Error("No match");

      const infoRes = await fetch(`${consumetBase}/anime/animekai/info/${encodeURIComponent(match.id)}`);
      const info = await infoRes.json();

      const eps: EpisodeInfo[] = (info?.episodes ?? []).map((e: { id: string; number: number; title?: string }) => ({
        id: e.id, number: e.number, title: e.title,
      }));
      setEpisodes(eps);
      if (eps.length > 0) setCurrentEp(eps[0]);
    } catch {
      setEpisodes([]);
    } finally {
      setLoadingEps(false);
    }
  }, [consumetBase, title]);

  useEffect(() => { fetchEpisodes(); }, [anime.id, fetchEpisodes]);

  // Scroll active episode into view
  useEffect(() => {
    if (!currentEp) return;
    const pageIdx = Math.floor((currentEp.number - 1) / EP_PAGE_SIZE);
    setEpPage(pageIdx);
    setTimeout(() => {
      document.getElementById(`ep-${currentEp.id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  }, [currentEp]);

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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const studios = anime.studios?.nodes?.map((s) => s.name).join(", ");
  const score   = anime.averageScore ? (anime.averageScore / 10).toFixed(1) : null;

  // ─── Layout ──────────────────────────────────────────────────────────────
  return (
    <div className={cn("transition-all duration-300", isTheater ? "bg-black" : "")}>

      {/* ── Main content row ── */}
      <div className={cn(
        "max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-300",
        isTheater ? "max-w-full px-0 sm:px-0 py-0" : "py-4"
      )}>
        <div className={cn(
          "flex gap-4",
          isTheater ? "flex-col" : "flex-col xl:flex-row"
        )}>

          {/* ── Left: Player column ── */}
          <div className={cn(
            "flex flex-col gap-3 transition-all",
            isTheater ? "w-full" : "w-full xl:flex-1 min-w-0"
          )}>
            {/* Player box */}
            <div
              className={cn(
                "relative w-full overflow-hidden",
                isTheater ? "rounded-none" : "rounded-xl"
              )}
              style={{
                aspectRatio: "16/9",
                backgroundColor: "#000",
                boxShadow: isTheater ? "none" : "0 8px 40px rgba(0,0,0,0.4)",
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
                  onEpisodeEnd={goToNextEp}
                  onPrevEpisode={goToPrevEp}
                  onNextEpisode={goToNextEp}
                  initialProvider={provider}
                  malId={anime.idMal ?? undefined}
                />
              ) : (
                <div className="w-full h-full skeleton" />
              )}
            </div>

            {/* ── Controls bar ── (hidden in theater) */}
            {!isTheater && (
              <>
                {/* Sub/Dub + Share + Download */}
                <div className="flex flex-wrap items-center gap-2 px-1">
                  {/* Episode info */}
                  <div className="flex-1 min-w-0">
                    {currentEp ? (
                      <p className="text-sm font-semibold truncate"
                        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                        Ep {currentEp.number}
                        {currentEp.title && (
                          <span className="ml-2 font-normal" style={{ color: "var(--text-secondary)" }}>
                            — {currentEp.title}
                          </span>
                        )}
                      </p>
                    ) : <div className="skeleton h-4 w-40 rounded" />}
                  </div>

                  {/* Sub/Dub toggle */}
                  <div className="flex items-center gap-0.5 p-0.5 rounded-lg"
                    style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
                    {(["sub", "dub"] as const).map((l) => (
                      <button key={l} onClick={() => setLang(l)}
                        className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition-all"
                        style={{
                          fontFamily: "var(--font-display)",
                          backgroundColor: lang === l ? "var(--accent)" : "transparent",
                          color: lang === l ? "#fff" : "var(--text-muted)",
                        }}>
                        {l}
                      </button>
                    ))}
                  </div>

                  {/* Actions */}
                  <a href={downloadLink || "#"} target="_blank" rel="noopener noreferrer"
                    className="soraku-btn p-2" title="Unduh episode">
                    <Download size={15} />
                  </a>
                  <button onClick={handleShare} className="soraku-btn p-2 gap-1.5 text-xs" title="Bagikan link">
                    {isCopied ? <Check size={15} style={{ color: "#4ade80" }} /> : <Share2 size={15} />}
                  </button>
                </div>

                {/* ── Anime info card ── */}
                <div className="rounded-xl p-4" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
                  <div className="flex gap-4">
                    {/* Cover */}
                    <Link href={`/watch/${anime.id}`} className="shrink-0">
                      <div className="relative overflow-hidden" style={{ width: 72, height: 100, borderRadius: "var(--radius)" }}>
                        <Image
                          src={anime.coverImage.large ?? anime.coverImage.medium ?? "/soraku-logo.png"}
                          alt={title}
                          fill
                          sizes="72px"
                          className="object-cover"
                          style={{ backgroundColor: anime.coverImage.color ?? "var(--bg-hover)" }}
                        />
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <h1 className="text-base font-bold mb-2 leading-snug"
                        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                        {title}
                      </h1>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        {score && (
                          <span className="soraku-badge soraku-badge-accent">
                            <Star size={8} fill="currentColor" /> {score}
                          </span>
                        )}
                        {anime.format && <span className="soraku-badge"><Tv2 size={8} /> {anime.format}</span>}
                        {anime.episodes && <span className="soraku-badge"><List size={8} /> {anime.episodes} ep</span>}
                        {anime.season && (
                          <span className="soraku-badge">
                            <Clock size={8} /> {anime.season} {anime.seasonYear}
                          </span>
                        )}
                      </div>

                      {/* Genres */}
                      <div className="flex flex-wrap gap-1">
                        {anime.genres?.slice(0, 4).map((g) => (
                          <Link key={g} href={`/search?genre=${encodeURIComponent(g)}`}
                            className="text-[0.68rem] px-1.5 py-0.5 rounded-md transition-colors hover:text-[var(--accent)]"
                            style={{
                              backgroundColor: "var(--bg-hover)",
                              color: "var(--text-muted)",
                              border: "1px solid var(--border)",
                              fontFamily: "var(--font-display)",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                            }}>
                            {g}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {anime.description && (
                    <div className="mt-3">
                      <div
                        className={cn("text-xs leading-relaxed transition-all overflow-hidden", !showDesc ? "line-clamp-3" : "")}
                        style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
                        dangerouslySetInnerHTML={{ __html: anime.description }}
                      />
                      <button onClick={() => setShowDesc((v) => !v)}
                        className="flex items-center gap-1 text-xs mt-1.5 font-semibold hover:underline"
                        style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}>
                        {showDesc
                          ? <><ChevronUp size={12} /> Lebih sedikit</>
                          : <><ChevronDown size={12} /> Baca selengkapnya</>
                        }
                      </button>
                    </div>
                  )}

                  {studios && (
                    <p className="mt-2 text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                      Studio: <span style={{ color: "var(--text-secondary)" }}>{studios}</span>
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* ── Right: Episode sidebar ── */}
          {!isTheater && (
            <div className="w-full xl:w-[300px] shrink-0 flex flex-col gap-0 rounded-xl overflow-hidden"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", height: "fit-content" }}>

              {/* Sidebar header */}
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                <h3 className="text-xs font-bold uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}>
                  Episode
                  <span className="ml-1.5 font-normal normal-case" style={{ color: "var(--text-muted)", opacity: 0.6 }}>
                    ({episodes.length})
                  </span>
                </h3>

                {/* View toggle */}
                <div className="flex items-center gap-1">
                  <button onClick={() => setEpGrid(false)}
                    className="p-1 rounded transition-colors"
                    style={{ color: !epGrid ? "var(--accent)" : "var(--text-muted)" }}>
                    <List size={14} />
                  </button>
                  <button onClick={() => setEpGrid(true)}
                    className="p-1 rounded transition-colors"
                    style={{ color: epGrid ? "var(--accent)" : "var(--text-muted)" }}>
                    <Grid3X3 size={14} />
                  </button>
                </div>
              </div>

              {/* Episode page navigation */}
              {epPages > 1 && (
                <div className="flex items-center justify-between px-4 py-2 border-b text-xs"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
                  <button onClick={() => setEpPage((p) => Math.max(0, p - 1))} disabled={epPage === 0}
                    className="p-1 rounded transition-colors disabled:opacity-30"
                    style={{ color: "var(--text-muted)" }}>
                    <ChevronLeft size={14} />
                  </button>
                  <span style={{ color: "var(--text-secondary)", fontFamily: "var(--font-display)", fontWeight: 600 }}>
                    Ep {epPage * EP_PAGE_SIZE + 1}–{Math.min((epPage + 1) * EP_PAGE_SIZE, episodes.length)}
                  </span>
                  <button onClick={() => setEpPage((p) => Math.min(epPages - 1, p + 1))} disabled={epPage >= epPages - 1}
                    className="p-1 rounded transition-colors disabled:opacity-30"
                    style={{ color: "var(--text-muted)" }}>
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}

              {/* Episode list */}
              <div className={cn("overflow-y-auto p-2", epGrid ? "grid grid-cols-5 gap-1" : "flex flex-col gap-0.5")}
                style={{ maxHeight: "26rem" }}>
                {loadingEps ? (
                  epGrid
                    ? Array.from({ length: 20 }).map((_, i) => <div key={i} className="skeleton h-8 rounded-lg" />)
                    : Array.from({ length: 12 }).map((_, i) => <div key={i} className="skeleton h-9 rounded-lg" />)
                ) : epSlice.length === 0 ? (
                  <p className="text-xs text-center py-8 col-span-5"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                    Tidak ada episode tersedia.
                  </p>
                ) : epGrid ? (
                  /* Grid view */
                  epSlice.map((ep) => (
                    <button id={`ep-${ep.id}`} key={ep.id} onClick={() => setCurrentEp(ep)}
                      className="h-8 rounded-md text-xs font-bold transition-all hover:scale-95"
                      style={{
                        fontFamily: "var(--font-display)",
                        backgroundColor: currentEp?.id === ep.id ? "var(--accent)" : "var(--bg-hover)",
                        color: currentEp?.id === ep.id ? "#fff" : "var(--text-secondary)",
                        border: `1px solid ${currentEp?.id === ep.id ? "transparent" : "var(--border)"}`,
                      }}>
                      {ep.number}
                    </button>
                  ))
                ) : (
                  /* List view */
                  epSlice.map((ep) => {
                    const isActive = currentEp?.id === ep.id;
                    return (
                      <button id={`ep-${ep.id}`} key={ep.id} onClick={() => setCurrentEp(ep)}
                        className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all w-full", isActive ? "" : "hover:bg-[var(--bg-hover)]")}
                        style={{
                          backgroundColor: isActive ? "var(--accent)" : "transparent",
                        }}>
                        <span className="text-xs font-bold w-6 shrink-0 text-center"
                          style={{ fontFamily: "var(--font-display)", color: isActive ? "rgba(255,255,255,0.8)" : "var(--text-muted)" }}>
                          {ep.number}
                        </span>
                        <span className="text-xs truncate"
                          style={{ fontFamily: "var(--font-body)", color: isActive ? "#fff" : "var(--text-secondary)", fontWeight: isActive ? 600 : 400 }}>
                          {ep.title || `Episode ${ep.number}`}
                        </span>
                        {isActive && (
                          <span className="ml-auto shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Theater mode: episode strip at bottom ── */}
      {isTheater && episodes.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="scroll-row">
            {episodes.map((ep) => {
              const isActive = currentEp?.id === ep.id;
              return (
                <button key={ep.id} onClick={() => setCurrentEp(ep)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg shrink-0 text-xs font-semibold transition-all hover:scale-95"
                  style={{
                    fontFamily: "var(--font-display)",
                    backgroundColor: isActive ? "var(--accent)" : "var(--bg-card)",
                    color: isActive ? "#fff" : "var(--text-muted)",
                    border: `1px solid ${isActive ? "transparent" : "var(--border)"}`,
                  }}>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />}
                  Ep {ep.number}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
