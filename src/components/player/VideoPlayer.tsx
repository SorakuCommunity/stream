"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipForward, SkipBack, Settings, Check, RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Provider Config ──────────────────────────────────────────────────────────
export type AnimeProvider = "animekai" | "gogoanime" | "zoro";

interface ProviderInfo {
  id: AnimeProvider;
  label: string;
  path: string; // Consumet endpoint prefix
}

export const PROVIDERS: ProviderInfo[] = [
  { id: "animekai", label: "AnimeKai", path: "/anime/animekai" },
  { id: "gogoanime", label: "Gogoanime", path: "/anime/gogoanime" },
  { id: "zoro", label: "HiAnime", path: "/anime/zoro" },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface VideoSource {
  url: string;
  quality: string;
  isM3U8?: boolean;
}

interface SkipTime {
  start: number;
  end: number;
  type: string;
}

interface PlayerSettings {
  autoPutar: boolean;
  lewatiOtomatis: boolean;
  lanjutOtomatis: boolean;
}

export interface VideoPlayerProps {
  episodeId: string;
  animeTitle: string;
  episodeNumber: number;
  consumetBase: string;
  onDownloadLink: (url: string) => void;
  onEpisodeEnd: () => void;
  onPrevEpisode: () => void;
  onNextEpisode: () => void;
  initialProvider?: AnimeProvider;
  malId?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function VideoPlayer({
  episodeId,
  animeTitle,
  episodeNumber,
  consumetBase,
  onDownloadLink,
  onEpisodeEnd,
  onPrevEpisode,
  onNextEpisode,
  initialProvider = "animekai",
  malId,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimer = useRef<NodeJS.Timeout | null>(null);

  const [provider, setProvider] = useState<AnimeProvider>(initialProvider);
  const [src, setSrc] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sourceError, setSourceError] = useState<string | null>(null);
  const [availableQualities, setAvailableQualities] = useState<VideoSource[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<string>("");

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<"player" | "source" | "quality">("player");
  const [settings, setSettings] = useState<PlayerSettings>({
    autoPutar: true,
    lewatiOtomatis: true,
    lanjutOtomatis: true,
  });
  const [skipTimes, setSkipTimes] = useState<SkipTime[]>([]);
  const [showSkipBtn, setShowSkipBtn] = useState<string | null>(null);

  // ─── Fetch source ─────────────────────────────────────────────────────────
  const fetchSource = useCallback(
    async (activeProvider: AnimeProvider) => {
      if (!episodeId) return;
      setIsLoading(true);
      setSourceError(null);
      setSrc("");
      setAvailableQualities([]);

      const pInfo = PROVIDERS.find((p) => p.id === activeProvider)!;
      const url = `${consumetBase}${pInfo.path}/watch/${encodeURIComponent(episodeId)}`;

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const sources: VideoSource[] = data?.sources ?? [];
        if (!sources.length) throw new Error("Tidak ada sumber video");

        setAvailableQualities(sources);

        const preferred =
          sources.find((s) => s.quality === "1080p") ??
          sources.find((s) => s.quality === "720p") ??
          sources.find((s) => s.isM3U8) ??
          sources[0];

        setSrc(preferred.url);
        setSelectedQuality(preferred.quality);
        onDownloadLink(preferred.url);

        // Aniskip
        const skipMalId = malId ?? data?.malId;
        if (skipMalId) {
          fetch(
            `https://api.aniskip.com/v2/skip-times/${skipMalId}/${episodeNumber}?types[]=op&types[]=ed&episodeLength=0`
          )
            .then((r) => r.json())
            .then((skip) => {
              if (skip?.results) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setSkipTimes(skip.results.map((r: any) => ({
                  start: r.interval.startTime,
                  end: r.interval.endTime,
                  type: r.skipType,
                })));
              }
            })
            .catch(() => {});
        }
      } catch (err) {
        console.error(`[VideoPlayer] ${activeProvider}:`, err);
        setSourceError(
          `Gagal memuat dari ${pInfo.label}. Coba provider lain di ⚙ Pengaturan.`
        );
      } finally {
        setIsLoading(false);
      }
    },
    [consumetBase, episodeId, episodeNumber, malId, onDownloadLink]
  );

  useEffect(() => { fetchSource(provider); }, [episodeId, provider, fetchSource]);

  // ─── HLS setup ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!src || !videoRef.current) return;
    hlsRef.current?.destroy();
    hlsRef.current = null;

    if (src.includes(".m3u8") && Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: false });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (settings.autoPutar) videoRef.current?.play().catch(() => {});
      });
    } else {
      videoRef.current.src = src;
      if (settings.autoPutar) videoRef.current.play().catch(() => {});
    }

    return () => { hlsRef.current?.destroy(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // ─── Auto-skip ────────────────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !skipTimes.length) return;
    const handle = () => {
      const t = video.currentTime;
      const active = skipTimes.find((s) => t >= s.start && t < s.end);
      if (active) {
        setShowSkipBtn(active.type === "op" ? "Lewati Opening" : "Lewati Ending");
        if (settings.lewatiOtomatis) video.currentTime = active.end;
      } else setShowSkipBtn(null);
    };
    video.addEventListener("timeupdate", handle);
    return () => video.removeEventListener("timeupdate", handle);
  }, [skipTimes, settings.lewatiOtomatis]);

  // ─── Controls ─────────────────────────────────────────────────────────────
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setIsPlaying(true); }
    else { v.pause(); setIsPlaying(false); }
  };

  const changeQuality = (q: VideoSource) => {
    const v = videoRef.current;
    const savedTime = v?.currentTime ?? 0;
    const wasPlaying = isPlaying;
    setSrc(q.url);
    setSelectedQuality(q.quality);
    onDownloadLink(q.url);
    if (v) {
      const restore = () => {
        v.currentTime = savedTime;
        if (wasPlaying) v.play().catch(() => {});
        v.removeEventListener("loadedmetadata", restore);
      };
      v.addEventListener("loadedmetadata", restore);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black select-none"
      onMouseMove={resetControlsTimer}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onTouchStart={resetControlsTimer}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onEnded={() => { setIsPlaying(false); if (settings.lanjutOtomatis) onEpisodeEnd(); }}
        playsInline
      />

      {/* Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {sourceError && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <p className="text-white/70 text-sm text-center px-8">{sourceError}</p>
          <div className="flex gap-2 flex-wrap justify-center">
            {PROVIDERS.filter((p) => p.id !== provider).map((p) => (
              <button
                key={p.id}
                onClick={(e) => { e.stopPropagation(); setProvider(p.id); }}
                className="soraku-btn soraku-btn-accent text-xs px-3 py-1.5"
              >
                Coba {p.label}
              </button>
            ))}
            <button
              onClick={(e) => { e.stopPropagation(); fetchSource(provider); }}
              className="soraku-btn text-xs px-3 py-1.5 flex items-center gap-1 text-white"
              style={{ border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        </div>
      )}

      {/* Skip btn */}
      {showSkipBtn && !settings.lewatiOtomatis && (
        <div className="absolute bottom-24 right-4 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const active = skipTimes.find((s) => (videoRef.current?.currentTime ?? 0) >= s.start);
              if (active && videoRef.current) videoRef.current.currentTime = active.end;
            }}
            className="soraku-btn soraku-btn-accent px-4 py-2 text-sm"
          >
            ⏭ {showSkipBtn}
          </button>
        </div>
      )}

      {/* Controls */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-end transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 55%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 pb-1">
          <p className="text-white/70 text-xs truncate">
            {animeTitle} — Episode {episodeNumber}
            <span className="ml-2 opacity-40">
              [{PROVIDERS.find((p) => p.id === provider)?.label}]
            </span>
          </p>
        </div>

        <div className="px-4 pb-1.5">
          <input
            type="range"
            min={0}
            max={duration || 1}
            value={currentTime}
            onChange={(e) => {
              const v = videoRef.current;
              const val = parseFloat(e.target.value);
              if (v) v.currentTime = val;
              setCurrentTime(val);
            }}
            className="w-full h-1 cursor-pointer accent-[var(--accent)]"
            style={{
              background: `linear-gradient(to right, var(--accent) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.25) 0%)`,
            }}
          />
        </div>

        <div className="flex items-center gap-1.5 px-3 pb-3">
          <button onClick={(e) => { e.stopPropagation(); onPrevEpisode(); }} className="text-white/70 hover:text-white p-1.5 transition-colors">
            <SkipBack size={16} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="text-white p-1.5">
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onNextEpisode(); }} className="text-white/70 hover:text-white p-1.5 transition-colors">
            <SkipForward size={16} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); const v = videoRef.current; if (v) v.currentTime = Math.max(v.currentTime - 10, 0); }} className="text-white/50 hover:text-white text-xs px-1.5 py-1 transition-colors">-10</button>
          <button onClick={(e) => { e.stopPropagation(); const v = videoRef.current; if (v) v.currentTime = Math.min(v.currentTime + 10, v.duration); }} className="text-white/50 hover:text-white text-xs px-1.5 py-1 transition-colors">+10</button>
          <span className="text-white/50 text-xs ml-1 tabular-nums">{formatTime(currentTime)} / {formatTime(duration)}</span>

          <div className="flex-1" />

          <button
            onClick={(e) => { e.stopPropagation(); const v = videoRef.current; if (!v) return; v.muted = !v.muted; setIsMuted(v.muted); }}
            className="text-white/70 hover:text-white p-1.5 transition-colors"
          >
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range" min={0} max={1} step={0.05}
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (videoRef.current) videoRef.current.volume = val;
              setVolume(val); setIsMuted(val === 0);
            }}
            className="w-16 h-1 cursor-pointer accent-[var(--accent)] hidden sm:block"
          />

          {/* Settings */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowSettings((v) => !v); }}
              className="text-white/70 hover:text-white p-1.5 transition-colors"
            >
              <Settings size={15} />
            </button>

            {showSettings && (
              <div
                className="absolute bottom-10 right-0 rounded-xl w-64 text-xs z-20 animate-slide-down overflow-hidden"
                style={{ backgroundColor: "rgba(14,14,14,0.97)", border: "1px solid rgba(255,255,255,0.1)" }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Tabs */}
                <div className="flex" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  {(["player", "source", "quality"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="flex-1 py-2 text-[10px] uppercase tracking-wider transition-colors"
                      style={{
                        color: activeTab === tab ? "var(--accent)" : "rgba(255,255,255,0.4)",
                        borderBottom: activeTab === tab ? "2px solid var(--accent)" : "2px solid transparent",
                      }}
                    >
                      {tab === "player" ? "Player" : tab === "source" ? "Sumber" : "Kualitas"}
                    </button>
                  ))}
                </div>

                <div className="p-3">
                  {/* Player tab */}
                  {activeTab === "player" && (
                    <div className="flex flex-col gap-1">
                      {([
                        { key: "autoPutar", label: "Putar Otomatis" },
                        { key: "lewatiOtomatis", label: "Lewati Intro/Outro" },
                        { key: "lanjutOtomatis", label: "Lanjut Episode Otomatis" },
                      ] as { key: keyof PlayerSettings; label: string }[]).map(({ key, label }) => (
                        <button
                          key={key}
                          onClick={() => setSettings((p) => ({ ...p, [key]: !p[key] }))}
                          className="flex items-center gap-2.5 w-full py-2 px-1 text-left hover:text-white transition-colors"
                          style={{ color: "rgba(255,255,255,0.75)" }}
                        >
                          <span className={cn("w-4 h-4 rounded border flex items-center justify-center shrink-0", settings[key] ? "border-[var(--accent)] bg-[var(--accent)]" : "border-white/30")}>
                            {settings[key] && <Check size={10} strokeWidth={3} />}
                          </span>
                          {label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Source tab */}
                  {activeTab === "source" && (
                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] text-white/40 mb-1 px-1">Pilih Provider Video</p>
                      {PROVIDERS.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => { setProvider(p.id); setShowSettings(false); }}
                          className="flex items-center gap-2.5 w-full py-2 px-1 text-left hover:text-white transition-colors"
                          style={{ color: provider === p.id ? "var(--accent)" : "rgba(255,255,255,0.75)" }}
                        >
                          <span className={cn("w-4 h-4 rounded-full border flex items-center justify-center shrink-0", provider === p.id ? "border-[var(--accent)] bg-[var(--accent)]" : "border-white/30")}>
                            {provider === p.id && <Check size={8} strokeWidth={4} />}
                          </span>
                          {p.label}
                        </button>
                      ))}
                      <p className="text-[10px] text-white/30 mt-2 px-1 leading-relaxed">
                        Ganti provider jika video tidak tersedia atau lambat
                      </p>
                    </div>
                  )}

                  {/* Quality tab */}
                  {activeTab === "quality" && (
                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] text-white/40 mb-1 px-1">Pilih Kualitas</p>
                      {availableQualities.length === 0
                        ? <p className="text-white/40 text-xs py-2 px-1">Belum ada kualitas...</p>
                        : availableQualities.map((q) => (
                          <button
                            key={q.url}
                            onClick={() => { changeQuality(q); setShowSettings(false); }}
                            className="flex items-center gap-2.5 w-full py-2 px-1 text-left hover:text-white transition-colors"
                            style={{ color: selectedQuality === q.quality ? "var(--accent)" : "rgba(255,255,255,0.75)" }}
                          >
                            <span className={cn("w-4 h-4 rounded-full border flex items-center justify-center shrink-0", selectedQuality === q.quality ? "border-[var(--accent)] bg-[var(--accent)]" : "border-white/30")}>
                              {selectedQuality === q.quality && <Check size={8} strokeWidth={4} />}
                            </span>
                            {q.quality || "Auto"}
                            {q.isM3U8 && <span className="ml-auto text-[10px] text-white/30">HLS</span>}
                          </button>
                        ))
                      }
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); const el = containerRef.current; if (!el) return; if (!document.fullscreenElement) { el.requestFullscreen(); setIsFullscreen(true); } else { document.exitFullscreen(); setIsFullscreen(false); } }}
            className="text-white/70 hover:text-white p-1.5 transition-colors"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
