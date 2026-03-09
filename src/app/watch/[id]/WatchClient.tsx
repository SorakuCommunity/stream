"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Download, Share2, Check, ChevronDown, ChevronUp,
  Star, Tv2, List, Grid3X3, ChevronLeft, ChevronRight,
  Theater, Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VideoPlayer, type AnimeProvider } from "@/components/player/VideoPlayer";
import type { Anime } from "@/types";

interface WatchClientProps {
  anime: Anime & {
    description?: string;
    studios?: { nodes: { name: string }[] };
    externalLinks?: { url: string; site: string }[];
    idMal?: number;
  };
}

interface EpisodeInfo { id: string; number: number; title?: string; }
const EP_PAGE_SIZE = 50;

export function WatchClient({ anime }: WatchClientProps) {
  const [episodes,     setEpisodes]     = useState<EpisodeInfo[]>([]);
  const [currentEp,    setCurrentEp]    = useState<EpisodeInfo | null>(null);
  const [loadingEps,   setLoadingEps]   = useState(true);
  const [lang,         setLang]         = useState<"sub" | "dub">("sub");
  const [provider,     setProvider]     = useState<AnimeProvider>("animekai");
  const [isTheater,    setIsTheater]    = useState(false);
  const [downloadLink, setDownloadLink] = useState("");
  const [isCopied,     setIsCopied]     = useState(false);
  const [showDesc,     setShowDesc]     = useState(false);
  const [epGrid,       setEpGrid]       = useState(false);
  const [epPage,       setEpPage]       = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const consumetBase = process.env.NEXT_PUBLIC_CONSUMET_API_URL ?? "https://consumet-api.vercel.app";
  const title = anime.title.english || anime.title.romaji;
  const epSlice = episodes.slice(epPage * EP_PAGE_SIZE, (epPage + 1) * EP_PAGE_SIZE);
  const epPages = Math.ceil(episodes.length / EP_PAGE_SIZE);

  const fetchEpisodes = useCallback(async () => {
    setLoadingEps(true);
    const slug = title.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().replace(/\s+/g, "-");
    try {
      const searchRes = await fetch(`${consumetBase}/anime/animekai/${encodeURIComponent(slug)}`);
      const searchData = await searchRes.json();
      const match = searchData?.results?.[0];
      if (!match?.id) throw new Error("No match");
      const infoRes = await fetch(`${consumetBase}/anime/animekai/info/${encodeURIComponent(match.id)}`);
      const info = await infoRes.json();
      const eps: EpisodeInfo[] = ((info?.episodes ?? []) as { id: string; number: number; title?: string }[]).map((e) => ({
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

  useEffect(() => { fetchEpisodes(); }, [fetchEpisodes]);

  useEffect(() => {
    if (!currentEp) return;
    const pageIdx = Math.floor((currentEp.number - 1) / EP_PAGE_SIZE);
    setEpPage(pageIdx);
    setTimeout(() => {
      document.getElementById(`ep-${currentEp.id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  }, [currentEp]);

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

  return (
    <div className={cn("transition-all duration-300", isTheater ? "bg-black min-h-screen" : "")}>
      <div className={cn(
        "mx-auto px-4 sm:px-6 py-6",
        isTheater ? "max-w-full px-0 py-0" : "max-w-7xl",
      )}>

        {/* ── Player area ── */}
        <div className={cn(
          "flex gap-5 mb-5 transition-all duration-300",
          isTheater ? "flex-col" : "flex-col xl:flex-row",
        )}>
          {/* Player */}
          <div className={cn("min-w-0", isTheater ? "w-full" : "flex-1")}>
            <div
              className="relative w-full overflow-hidden"
              style={{
                aspectRatio: "16/9",
                backgroundColor: "#000",
                borderRadius: isTheater ? "0" : "var(--radius-xl)",
                boxShadow: isTheater ? "none" : "0 8px 40px rgba(0,0,0,0.6)",
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
              ) : (
                <div className="w-full h-full skeleton" />
              )}
            </div>

            {/* Controls row */}
            {!isTheater && (
              <div
                className="flex flex-wrap items-center gap-2 p-3 rounded-2xl mt-3"
                style={{
                  background: "var(--glass-bg)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid var(--glass-border)",
                }}
              >
                <span className="text-sm flex-1" style={{ color: "var(--text-secondary)" }}>
                  {currentEp ? (
                    <>
                      Menonton{" "}
                      <strong style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-primary)" }}>
                        Episode {currentEp.number}
                      </strong>
                    </>
                  ) : (
                    <span className="skeleton inline-block rounded w-32 h-4" />
                  )}
                </span>

                {/* Sub/Dub */}
                <div className="flex gap-1 p-0.5 rounded-lg" style={{ background: "var(--bg-card)" }}>
                  {(["sub", "dub"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className="px-3 py-1 rounded-md text-xs font-700 transition-all"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        background: lang === l ? "var(--accent)" : "transparent",
                        color: lang === l ? "#fff" : "var(--text-muted)",
                      }}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Provider */}
                <div className="flex gap-1 p-0.5 rounded-lg" style={{ background: "var(--bg-card)" }}>
                  {(["animekai", "gogoanime", "zoro"] as AnimeProvider[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setProvider(p)}
                      className="px-2.5 py-1 rounded-md text-xs font-700 transition-all"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        background: provider === p ? "var(--bg-hover)" : "transparent",
                        color: provider === p ? "var(--text-primary)" : "var(--text-muted)",
                      }}
                    >
                      {p === "animekai" ? "AK" : p === "gogoanime" ? "GG" : "HI"}
                    </button>
                  ))}
                </div>

                {/* Theater + Download + Share */}
                <button
                  onClick={() => setIsTheater((v) => !v)}
                  className="soraku-btn-ghost p-2 rounded-lg"
                  title="Mode Bioskop"
                >
                  <Theater size={15} style={{ color: "var(--text-muted)" }} />
                </button>
                <a
                  href={downloadLink || "#"}
                  target="_blank" rel="noopener noreferrer"
                  className="soraku-btn-ghost p-2 rounded-lg"
                  title="Unduh"
                >
                  <Download size={15} style={{ color: "var(--text-muted)" }} />
                </a>
                <button onClick={handleShare} className="soraku-btn-ghost p-2 rounded-lg flex items-center gap-1" title="Bagikan">
                  {isCopied ? <Check size={15} style={{ color: "var(--accent)" }} /> : <Share2 size={15} style={{ color: "var(--text-muted)" }} />}
                  {isCopied && <span className="text-xs font-600" style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--accent)" }}>Disalin!</span>}
                </button>
              </div>
            )}

            {/* Anime info card — non-theater */}
            {!isTheater && (
              <div className="flex gap-4 mt-5">
                <Image
                  src={anime.coverImage.large ?? "/soraku-logo.png"}
                  alt={title}
                  width={72}
                  height={100}
                  className="rounded-xl object-cover shrink-0 shadow-lg"
                />
                <div className="flex-1 min-w-0">
                  <Link href={`/anime/${anime.id}`}>
                    <h1
                      className="text-base font-800 mb-1.5 leading-snug hover:text-[var(--accent)] transition-colors line-clamp-2"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--text-primary)" }}
                    >
                      {title}
                    </h1>
                  </Link>
                  <div className="flex flex-wrap gap-2 items-center mb-2">
                    {anime.averageScore && (
                      <span className="flex items-center gap-1 text-xs font-600" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
                        <Star size={10} fill="#facc15" stroke="none" />
                        <span style={{ color: "#facc15" }}>{(anime.averageScore / 10).toFixed(1)}</span>
                      </span>
                    )}
                    {anime.episodes && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                        <Tv2 size={10} />
                        {anime.episodes} ep
                      </span>
                    )}
                    {anime.format && <span className="soraku-badge">{anime.format}</span>}
                  </div>
                  {anime.genres?.length && (
                    <div className="flex flex-wrap gap-1">
                      {anime.genres.slice(0, 4).map((g: string) => (
                        <Link
                          key={g}
                          href={`/search?genre=${encodeURIComponent(g)}`}
                          className="soraku-badge soraku-badge-accent hover:opacity-80 transition-opacity"
                        >
                          {g}
                        </Link>
                      ))}
                    </div>
                  )}
                  {anime.description && (
                    <div className="mt-2">
                      <div
                        className={cn("text-xs leading-relaxed", !showDesc && "line-clamp-2")}
                        style={{ color: "var(--text-muted)" }}
                        dangerouslySetInnerHTML={{ __html: anime.description }}
                      />
                      <button
                        onClick={() => setShowDesc((v) => !v)}
                        className="text-[0.68rem] mt-1 font-600 hover:underline"
                        style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--accent)" }}
                      >
                        {showDesc ? <><ChevronUp size={11} className="inline" /> Lebih sedikit</> : <><ChevronDown size={11} className="inline" /> Selengkapnya</>}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Episode sidebar ── */}
          {!isTheater && (
            <div
              className="xl:w-72 shrink-0 rounded-2xl overflow-hidden flex flex-col"
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid var(--glass-border)",
                boxShadow: "var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.04)",
                maxHeight: "calc(56.25vw + 60px)",
              }}
            >
              {/* Sidebar header */}
              <div
                className="flex items-center justify-between px-4 py-3 shrink-0"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <h3
                  className="text-sm font-700"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-primary)" }}
                >
                  Episode{" "}
                  <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>({episodes.length})</span>
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEpGrid(false)}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: !epGrid ? "var(--accent)" : "var(--text-muted)", background: !epGrid ? "rgba(var(--accent-rgb),0.1)" : "transparent" }}
                  >
                    <List size={14} />
                  </button>
                  <button
                    onClick={() => setEpGrid(true)}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: epGrid ? "var(--accent)" : "var(--text-muted)", background: epGrid ? "rgba(var(--accent-rgb),0.1)" : "transparent" }}
                  >
                    <Grid3X3 size={14} />
                  </button>
                </div>
              </div>

              {/* Pagination */}
              {epPages > 1 && (
                <div className="flex items-center justify-between px-4 py-2 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
                  <button
                    onClick={() => setEpPage((p) => Math.max(0, p - 1))}
                    disabled={epPage === 0}
                    className="soraku-btn-ghost p-1.5 rounded-lg disabled:opacity-30"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-xs font-600" style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text-muted)" }}>
                    {epPage * EP_PAGE_SIZE + 1}–{Math.min((epPage + 1) * EP_PAGE_SIZE, episodes.length)} / {episodes.length}
                  </span>
                  <button
                    onClick={() => setEpPage((p) => Math.min(epPages - 1, p + 1))}
                    disabled={epPage >= epPages - 1}
                    className="soraku-btn-ghost p-1.5 rounded-lg disabled:opacity-30"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}

              {/* Episode list */}
              <div ref={listRef} className="flex-1 overflow-y-auto p-2">
                {loadingEps ? (
                  <div className={cn("gap-1.5", epGrid ? "grid grid-cols-4" : "flex flex-col")}>
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={i} className={cn("skeleton rounded-lg", epGrid ? "h-9" : "h-8")} />
                    ))}
                  </div>
                ) : episodes.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Tidak ada episode tersedia.</p>
                  </div>
                ) : epGrid ? (
                  <div className="grid grid-cols-4 gap-1.5">
                    {epSlice.map((ep) => (
                      <button
                        id={`ep-${ep.id}`}
                        key={ep.id}
                        onClick={() => goToEp(ep)}
                        className="flex items-center justify-center h-9 rounded-lg text-xs font-700 transition-all hover:scale-105"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          background: currentEp?.id === ep.id ? "var(--accent)" : "var(--bg-hover)",
                          color: currentEp?.id === ep.id ? "#fff" : "var(--text-secondary)",
                          boxShadow: currentEp?.id === ep.id ? "0 2px 10px rgba(var(--accent-rgb),0.4)" : "none",
                        }}
                      >
                        {ep.number}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-0.5">
                    {epSlice.map((ep) => (
                      <button
                        id={`ep-${ep.id}`}
                        key={ep.id}
                        onClick={() => goToEp(ep)}
                        className="text-left px-3 py-2 rounded-xl text-xs font-600 transition-all"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 600,
                          background: currentEp?.id === ep.id ? "rgba(var(--accent-rgb),0.15)" : "transparent",
                          borderLeft: currentEp?.id === ep.id ? "2px solid var(--accent)" : "2px solid transparent",
                          color: currentEp?.id === ep.id ? "var(--accent)" : "var(--text-secondary)",
                        }}
                      >
                        Ep {ep.number}
                        {ep.title && (
                          <span className="ml-1 opacity-60 line-clamp-1 font-400" style={{ fontWeight: 400 }}>— {ep.title}</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theater episode strip */}
        {isTheater && episodes.length > 0 && (
          <div className="scroll-row px-4 py-3 bg-black/80 backdrop-blur">
            {episodes.map((ep) => (
              <button
                key={ep.id}
                onClick={() => goToEp(ep)}
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-700 transition-all"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  background: currentEp?.id === ep.id ? "var(--accent)" : "rgba(255,255,255,0.08)",
                  color: currentEp?.id === ep.id ? "#fff" : "rgba(255,255,255,0.5)",
                }}
              >
                {ep.number}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
