"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipForward, SkipBack, Settings, Check, RefreshCw,
  Camera, Gauge, Layers, Theater,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Provider ─────────────────────────────────────────────────────────────────
export type AnimeProvider = "animekai" | "gogoanime" | "zoro";

export const PROVIDERS: { id: AnimeProvider; label: string; path: string }[] = [
  { id: "animekai", label: "AnimeKai",  path: "/anime/animekai"  },
  { id: "gogoanime", label: "Gogoanime", path: "/anime/gogoanime" },
  { id: "zoro",      label: "HiAnime",  path: "/anime/zoro"      },
];

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

interface VideoSource  { url: string; quality: string; isM3U8?: boolean; }
interface SkipTime     { start: number; end: number; type: string; }
interface PlayerPrefs  { autoPutar: boolean; lewatiOtomatis: boolean; lanjutOtomatis: boolean; }

export interface VideoPlayerProps {
  episodeId:      string;
  animeTitle:     string;
  episodeNumber:  number;
  consumetBase:   string;
  lang:           "sub" | "dub";
  isTheater:      boolean;
  onToggleTheater: () => void;
  onDownloadLink: (url: string) => void;
  onEpisodeEnd:   () => void;
  onPrevEpisode:  () => void;
  onNextEpisode:  () => void;
  initialProvider?: AnimeProvider;
  malId?:         number;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function VideoPlayer({
  episodeId, animeTitle, episodeNumber, consumetBase,
  lang, isTheater, onToggleTheater,
  onDownloadLink, onEpisodeEnd, onPrevEpisode, onNextEpisode,
  initialProvider = "animekai", malId,
}: VideoPlayerProps) {

  const videoRef    = useRef<HTMLVideoElement>(null);
  const hlsRef      = useRef<Hls | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef    = useRef<NodeJS.Timeout | null>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);

  // source
  const [provider,   setProvider]   = useState<AnimeProvider>(initialProvider);
  const [src,        setSrc]        = useState("");
  const [isLoading,  setIsLoading]  = useState(true);
  const [sourceError,setSourceError]= useState<string | null>(null);
  const [qualities,  setQualities]  = useState<VideoSource[]>([]);
  const [selQuality, setSelQuality] = useState("");

  // playback
  const [playing,    setPlaying]    = useState(false);
  const [muted,      setMuted]      = useState(false);
  const [volume,     setVolume]     = useState(1);
  const [currentTime,setCurrentTime]= useState(0);
  const [duration,   setDuration]   = useState(0);
  const [speed,      setSpeed]      = useState(1);
  const [isFullscreen,setIsFullscreen]= useState(false);
  const [showControls,setShowControls]= useState(true);
  const [showSettings,setShowSettings]= useState(false);
  const [settingsTab,  setSettingsTab] = useState<"player"|"source"|"quality"|"speed">("player");
  const [prefs,      setPrefs]      = useState<PlayerPrefs>({ autoPutar: true, lewatiOtomatis: true, lanjutOtomatis: true });
  const [skipTimes,  setSkipTimes]  = useState<SkipTime[]>([]);
  const [skipLabel,  setSkipLabel]  = useState<string | null>(null);
  const [screenshotMsg, setScreenshotMsg] = useState("");

  // ─── Fetch source ──────────────────────────────────────────────────────────
  const fetchSource = useCallback(async (p: AnimeProvider) => {
    if (!episodeId) return;
    setIsLoading(true); setSourceError(null); setSrc(""); setQualities([]);

    const pInfo = PROVIDERS.find((x) => x.id === p)!;
    // Append lang suffix for providers that support it
    const epIdWithLang = lang === "dub" ? `${episodeId}-dub` : episodeId;
    const url = `${consumetBase}${pInfo.path}/watch/${encodeURIComponent(epIdWithLang)}`;

    try {
      const res  = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const sources: VideoSource[] = data?.sources ?? [];
      if (!sources.length) throw new Error("Tidak ada sumber video");

      setQualities(sources);
      const best =
        sources.find((s) => s.quality === "1080p") ??
        sources.find((s) => s.quality === "720p")  ??
        sources.find((s) => s.isM3U8) ??
        sources[0];

      setSrc(best.url);
      setSelQuality(best.quality);
      onDownloadLink(best.url);

      // Aniskip
      const mid = malId ?? data?.malId;
      if (mid) {
        fetch(`https://api.aniskip.com/v2/skip-times/${mid}/${episodeNumber}?types[]=op&types[]=ed&episodeLength=0`)
          .then((r) => r.json())
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .then((skip) => { if (skip?.results) setSkipTimes(skip.results.map((r: any) => ({ start: r.interval.startTime, end: r.interval.endTime, type: r.skipType }))); })
          .catch(() => {});
      }
    } catch (err) {
      console.error(`[VideoPlayer] ${p}:`, err);
      setSourceError(`Gagal memuat dari ${pInfo.label}. Coba server lain.`);
    } finally { setIsLoading(false); }
  }, [consumetBase, episodeId, episodeNumber, lang, malId, onDownloadLink]);

  useEffect(() => { fetchSource(provider); }, [episodeId, provider, lang, fetchSource]);

  // ─── HLS setup ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!src || !videoRef.current) return;
    hlsRef.current?.destroy(); hlsRef.current = null;

    if (src.includes(".m3u8") && Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: false });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => { if (prefs.autoPutar) videoRef.current?.play().catch(() => {}); });
    } else {
      videoRef.current.src = src;
      if (prefs.autoPutar) videoRef.current.play().catch(() => {});
    }
    return () => { hlsRef.current?.destroy(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // ─── Auto-skip ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !skipTimes.length) return;
    const handle = () => {
      const t = v.currentTime;
      const active = skipTimes.find((s) => t >= s.start && t < s.end);
      if (active) {
        setSkipLabel(active.type === "op" ? "Lewati Opening" : "Lewati Ending");
        if (prefs.lewatiOtomatis) v.currentTime = active.end;
      } else setSkipLabel(null);
    };
    v.addEventListener("timeupdate", handle);
    return () => v.removeEventListener("timeupdate", handle);
  }, [skipTimes, prefs.lewatiOtomatis]);

  // ─── Controls auto-hide ────────────────────────────────────────────────────
  const resetHide = useCallback(() => {
    setShowControls(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { if (playing) setShowControls(false); }, 3000);
  }, [playing]);

  // ─── Screenshot ────────────────────────────────────────────────────────────
  const takeScreenshot = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    const canvas = canvasRef.current ?? document.createElement("canvas");
    canvas.width  = v.videoWidth;
    canvas.height = v.videoHeight;
    canvas.getContext("2d")?.drawImage(v, 0, 0, canvas.width, canvas.height);
    const a = document.createElement("a");
    a.download = `${animeTitle}_ep${episodeNumber}_${Math.floor(v.currentTime)}s.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
    setScreenshotMsg("Screenshot tersimpan!");
    setTimeout(() => setScreenshotMsg(""), 2000);
  };

  // ─── Quality change ────────────────────────────────────────────────────────
  const changeQuality = (q: VideoSource) => {
    const v = videoRef.current;
    const t = v?.currentTime ?? 0;
    const wasPlaying = playing;
    setSrc(q.url); setSelQuality(q.quality); onDownloadLink(q.url);
    if (v) {
      const restore = () => { v.currentTime = t; if (wasPlaying) v.play().catch(() => {}); v.removeEventListener("loadedmetadata", restore); };
      v.addEventListener("loadedmetadata", restore);
    }
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  const pct = duration ? (currentTime / duration) * 100 : 0;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black select-none group"
      onMouseMove={resetHide}
      onMouseLeave={() => playing && setShowControls(false)}
      onTouchStart={resetHide}
      onClick={() => { const v = videoRef.current; if (!v) return; if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); } }}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onEnded={() => { setPlaying(false); if (prefs.lanjutOtomatis) onEpisodeEnd(); }}
        playsInline
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {sourceError && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60">
          <p className="text-white/70 text-sm text-center px-8">{sourceError}</p>
          <div className="flex gap-2 flex-wrap justify-center">
            {PROVIDERS.filter((p) => p.id !== provider).map((p) => (
              <button key={p.id} onClick={(e) => { e.stopPropagation(); setProvider(p.id); }}
                className="soraku-btn soraku-btn-accent text-xs px-3 py-1.5">
                {p.label}
              </button>
            ))}
            <button onClick={(e) => { e.stopPropagation(); fetchSource(provider); }}
              className="soraku-btn text-xs px-3 py-1.5 flex items-center gap-1 text-white"
              style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        </div>
      )}

      {/* Skip button */}
      {skipLabel && !prefs.lewatiOtomatis && (
        <div className="absolute bottom-24 right-4 z-10">
          <button onClick={(e) => { e.stopPropagation(); const a = skipTimes.find((s) => (videoRef.current?.currentTime ?? 0) >= s.start); if (a && videoRef.current) videoRef.current.currentTime = a.end; }}
            className="soraku-btn soraku-btn-accent text-xs px-4 py-2 animate-fade-up">
            ⏭ {skipLabel}
          </button>
        </div>
      )}

      {/* Screenshot toast */}
      {screenshotMsg && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-lg text-xs text-white font-semibold animate-fade-up"
          style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", fontFamily: "var(--font-display)" }}>
          📸 {screenshotMsg}
        </div>
      )}

      {/* ── CONTROLS ── */}
      <div
        className={cn("absolute inset-0 flex flex-col justify-end transition-opacity duration-300", showControls ? "opacity-100" : "opacity-0 pointer-events-none")}
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 35%, transparent 60%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <div className="px-4 pb-1 flex items-center gap-2">
          <p className="text-white/70 text-xs truncate flex-1" style={{ fontFamily: "var(--font-body)" }}>
            {animeTitle}
            <span className="mx-1.5 opacity-40">·</span>
            Episode {episodeNumber}
            <span className="ml-1.5 text-[0.65rem] opacity-40 uppercase tracking-wider"
              style={{ fontFamily: "var(--font-display)", color: lang === "dub" ? "#facc15" : "rgba(255,255,255,0.5)" }}>
              {lang.toUpperCase()}
            </span>
          </p>
          <span className="text-[0.65rem] opacity-40 tracking-wider" style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}>
            {PROVIDERS.find((p) => p.id === provider)?.label}
          </span>
        </div>

        {/* Progress bar */}
        <div className="px-4 pb-2 group/progress cursor-pointer"
          onClick={(e) => { const rect = e.currentTarget.getBoundingClientRect(); const pct = (e.clientX - rect.left) / rect.width; const v = videoRef.current; if (v) { v.currentTime = pct * v.duration; setCurrentTime(pct * v.duration); } }}>
          <div className="relative h-1 rounded-full overflow-hidden transition-all group-hover/progress:h-2"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
            {/* Buffered */}
            <div className="absolute inset-y-0 left-0 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.2)", width: `${pct + 5}%` }} />
            {/* Progress */}
            <div className="absolute inset-y-0 left-0 rounded-full transition-all"
              style={{ backgroundColor: "var(--accent)", width: `${pct}%` }} />
          </div>
          <input type="range" min={0} max={duration || 1} value={currentTime}
            onChange={(e) => { const v = videoRef.current; const val = parseFloat(e.target.value); if (v) v.currentTime = val; setCurrentTime(val); }}
            className="absolute opacity-0 inset-x-4" style={{ cursor: "pointer" }} />
        </div>

        {/* Button row */}
        <div className="flex items-center gap-1 px-3 pb-3">
          <button onClick={(e) => { e.stopPropagation(); onPrevEpisode(); }}
            className="p-1.5 text-white/60 hover:text-white transition-colors" title="Episode sebelumnya">
            <SkipBack size={16} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); const v = videoRef.current; if (!v) return; if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); } }}
            className="p-1.5 text-white transition-colors">
            {playing ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onNextEpisode(); }}
            className="p-1.5 text-white/60 hover:text-white transition-colors" title="Episode berikutnya">
            <SkipForward size={16} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); const v = videoRef.current; if (v) v.currentTime = Math.max(v.currentTime - 10, 0); }}
            className="px-1.5 py-1 text-white/50 hover:text-white text-xs transition-colors">
            -10
          </button>
          <button onClick={(e) => { e.stopPropagation(); const v = videoRef.current; if (v) v.currentTime = Math.min(v.currentTime + 10, v.duration); }}
            className="px-1.5 py-1 text-white/50 hover:text-white text-xs transition-colors">
            +10
          </button>
          <span className="text-white/40 text-xs ml-1 tabular-nums" style={{ fontFamily: "var(--font-display)" }}>
            {fmt(currentTime)} / {fmt(duration)}
          </span>

          <div className="flex-1" />

          {/* Speed display */}
          {speed !== 1 && (
            <span className="text-xs font-bold px-1.5 py-0.5 rounded"
              style={{ backgroundColor: "rgba(var(--accent-rgb),0.3)", color: "var(--accent)", fontFamily: "var(--font-display)" }}>
              {speed}×
            </span>
          )}

          {/* Screenshot */}
          <button onClick={takeScreenshot} className="p-1.5 text-white/60 hover:text-white transition-colors" title="Screenshot">
            <Camera size={15} />
          </button>

          {/* Volume */}
          <button onClick={(e) => { e.stopPropagation(); const v = videoRef.current; if (!v) return; v.muted = !v.muted; setMuted(v.muted); }}
            className="p-1.5 text-white/60 hover:text-white transition-colors">
            {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume}
            onChange={(e) => { const val = parseFloat(e.target.value); if (videoRef.current) videoRef.current.volume = val; setVolume(val); setMuted(val === 0); }}
            className="w-16 h-1 cursor-pointer hidden sm:block accent-[var(--accent)]" />

          {/* Settings */}
          <div className="relative">
            <button onClick={(e) => { e.stopPropagation(); setShowSettings((v) => !v); }}
              className="p-1.5 text-white/60 hover:text-white transition-colors" title="Pengaturan">
              <Settings size={15} />
            </button>

            {showSettings && (
              <div className="absolute bottom-10 right-0 rounded-xl w-64 z-30 animate-slide-down overflow-hidden"
                style={{ backgroundColor: "rgba(12,12,15,0.97)", border: "1px solid rgba(255,255,255,0.08)" }}
                onClick={(e) => e.stopPropagation()}>
                {/* Tabs */}
                <div className="flex border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                  {([
                    { id: "player",  icon: <Settings size={11} />,  label: "Player"   },
                    { id: "source",  icon: <Layers size={11} />,    label: "Server"   },
                    { id: "quality", icon: <Gauge size={11} />,     label: "Kualitas" },
                    { id: "speed",   icon: <Theater size={11} />,   label: "Speed"    },
                  ] as { id: typeof settingsTab; icon: React.ReactNode; label: string }[]).map(({ id, icon, label }) => (
                    <button key={id} onClick={() => setSettingsTab(id)}
                      className="flex-1 py-2.5 text-[0.65rem] uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                      style={{ color: settingsTab === id ? "var(--accent)" : "rgba(255,255,255,0.35)", borderBottom: settingsTab === id ? "2px solid var(--accent)" : "2px solid transparent" }}>
                      {icon} {label}
                    </button>
                  ))}
                </div>

                <div className="p-3">
                  {/* Player tab */}
                  {settingsTab === "player" && (
                    <div className="flex flex-col gap-0.5">
                      {([
                        { key: "autoPutar",       label: "Putar Otomatis"              },
                        { key: "lewatiOtomatis",  label: "Lewati Intro/Outro Otomatis" },
                        { key: "lanjutOtomatis",  label: "Lanjut Episode Otomatis"     },
                      ] as { key: keyof PlayerPrefs; label: string }[]).map(({ key, label }) => (
                        <button key={key} onClick={() => setPrefs((p) => ({ ...p, [key]: !p[key] }))}
                          className="flex items-center gap-2.5 w-full py-2 px-1 text-left hover:text-white transition-colors"
                          style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body)", fontSize: "0.8125rem" }}>
                          <span className={cn("w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-all",
                            prefs[key] ? "border-[var(--accent)] bg-[var(--accent)]" : "border-white/25")}>
                            {prefs[key] && <Check size={9} strokeWidth={3} />}
                          </span>
                          {label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Server tab */}
                  {settingsTab === "source" && (
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[0.65rem] uppercase tracking-wider mb-2 px-1" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-display)" }}>Provider</p>
                      {PROVIDERS.map((p) => (
                        <button key={p.id} onClick={() => { setProvider(p.id); setShowSettings(false); }}
                          className="flex items-center gap-2.5 w-full py-2 px-1 text-left hover:text-white transition-colors"
                          style={{ color: provider === p.id ? "var(--accent)" : "rgba(255,255,255,0.7)", fontFamily: "var(--font-body)", fontSize: "0.8125rem" }}>
                          <span className={cn("w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                            provider === p.id ? "border-[var(--accent)] bg-[var(--accent)]" : "border-white/25")}>
                            {provider === p.id && <Check size={8} strokeWidth={4} />}
                          </span>
                          {p.label}
                        </button>
                      ))}
                      <p className="text-[0.65rem] text-white/25 mt-2 px-1" style={{ fontFamily: "var(--font-body)" }}>Ganti jika video tidak tersedia</p>
                    </div>
                  )}

                  {/* Quality tab */}
                  {settingsTab === "quality" && (
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[0.65rem] uppercase tracking-wider mb-2 px-1" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-display)" }}>Kualitas Video</p>
                      {!qualities.length
                        ? <p className="text-white/30 text-xs px-1 py-2">Memuat...</p>
                        : qualities.map((q) => (
                          <button key={q.url} onClick={() => { changeQuality(q); setShowSettings(false); }}
                            className="flex items-center gap-2.5 w-full py-2 px-1 text-left hover:text-white transition-colors"
                            style={{ color: selQuality === q.quality ? "var(--accent)" : "rgba(255,255,255,0.7)", fontFamily: "var(--font-body)", fontSize: "0.8125rem" }}>
                            <span className={cn("w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                              selQuality === q.quality ? "border-[var(--accent)] bg-[var(--accent)]" : "border-white/25")}>
                              {selQuality === q.quality && <Check size={8} strokeWidth={4} />}
                            </span>
                            {q.quality || "Auto"}
                            {q.isM3U8 && <span className="ml-auto text-[0.65rem] text-white/25">HLS</span>}
                          </button>
                        ))
                      }
                    </div>
                  )}

                  {/* Speed tab */}
                  {settingsTab === "speed" && (
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[0.65rem] uppercase tracking-wider mb-2 px-1" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-display)" }}>Kecepatan Putar</p>
                      {SPEEDS.map((s) => (
                        <button key={s} onClick={() => {
                          setSpeed(s);
                          if (videoRef.current) videoRef.current.playbackRate = s;
                          setShowSettings(false);
                        }}
                          className="flex items-center gap-2.5 w-full py-2 px-1 text-left hover:text-white transition-colors"
                          style={{ color: speed === s ? "var(--accent)" : "rgba(255,255,255,0.7)", fontFamily: "var(--font-body)", fontSize: "0.8125rem" }}>
                          <span className={cn("w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                            speed === s ? "border-[var(--accent)] bg-[var(--accent)]" : "border-white/25")}>
                            {speed === s && <Check size={8} strokeWidth={4} />}
                          </span>
                          {s === 1 ? "Normal" : `${s}×`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theater mode */}
          <button onClick={(e) => { e.stopPropagation(); onToggleTheater(); }}
            className="p-1.5 transition-colors hidden md:block"
            style={{ color: isTheater ? "var(--accent)" : "rgba(255,255,255,0.6)" }}
            title={isTheater ? "Keluar Theater" : "Theater Mode"}>
            <Theater size={15} />
          </button>

          {/* Fullscreen */}
          <button onClick={(e) => { e.stopPropagation(); const el = containerRef.current; if (!el) return; if (!document.fullscreenElement) { el.requestFullscreen(); setIsFullscreen(true); } else { document.exitFullscreen(); setIsFullscreen(false); } }}
            className="p-1.5 text-white/60 hover:text-white transition-colors">
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
