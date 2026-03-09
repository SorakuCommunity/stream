"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipForward, SkipBack, Settings, Check, RefreshCw,
  Camera, Gauge, Layers, Theater,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AnimeProvider = "animekai" | "gogoanime" | "zoro";

export const PROVIDERS: { id: AnimeProvider; label: string; path: string }[] = [
  { id: "animekai",  label: "AnimeKai",  path: "/anime/animekai"  },
  { id: "gogoanime", label: "Gogoanime", path: "/anime/gogoanime" },
  { id: "zoro",      label: "HiAnime",  path: "/anime/zoro"      },
];

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

interface VideoSource  { url: string; quality: string; isM3U8?: boolean; }
interface SubTrack     { url: string; lang: string; label: string; }
interface SkipTime     { start: number; end: number; type: string; }
interface PlayerPrefs  { autoPutar: boolean; lewatiOtomatis: boolean; lanjutOtomatis: boolean; }

export interface VideoPlayerProps {
  episodeId:       string;
  animeTitle:      string;
  episodeNumber:   number;
  consumetBase:    string;
  lang:            "sub" | "dub";
  isTheater:       boolean;
  onToggleTheater: () => void;
  onDownloadLink:  (url: string) => void;
  onEpisodeEnd:    () => void;
  onPrevEpisode:   () => void;
  onNextEpisode:   () => void;
  initialProvider?: AnimeProvider;
  malId?:          number;
}

export function VideoPlayer({
  episodeId, animeTitle, episodeNumber, consumetBase,
  lang, isTheater, onToggleTheater,
  onDownloadLink, onEpisodeEnd, onPrevEpisode, onNextEpisode,
  initialProvider = "animekai", malId,
}: VideoPlayerProps) {

  const videoRef    = useRef<HTMLVideoElement>(null);
  const hlsRef      = useRef<Hls | null>(null);
  const containerRef= useRef<HTMLDivElement>(null);
  const timerRef    = useRef<NodeJS.Timeout | null>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);

  const [provider,    setProvider]    = useState<AnimeProvider>(initialProvider);
  const [src,         setSrc]         = useState("");
  const [subtracks,   setSubtracks]   = useState<SubTrack[]>([]);
  const [activeSub,   setActiveSub]   = useState<string>("");  // url or "" = off
  const [sources,     setSources]     = useState<VideoSource[]>([]);
  const [quality,     setQuality]     = useState("auto");
  const [isLoading,   setIsLoading]   = useState(true);
  const [hasError,    setHasError]    = useState(false);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [isMuted,     setIsMuted]     = useState(false);
  const [volume,      setVolume]      = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration,    setDuration]    = useState(0);
  const [isFullscreen,setIsFullscreen]= useState(false);
  const [showControls,setShowControls]= useState(true);
  const [speed,       setSpeed]       = useState(1);
  const [skipTimes,   setSkipTimes]   = useState<SkipTime[]>([]);
  const [showSkipBtn, setShowSkipBtn] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<"player"|"server"|"kualitas"|"speed"|"sub"|null>(null);
  const [prefs, setPrefs] = useState<PlayerPrefs>({
    autoPutar: true, lewatiOtomatis: true, lanjutOtomatis: true,
  });
  const [osdMsg, setOsdMsg] = useState<string | null>(null);
  const osdRef = useRef<NodeJS.Timeout | null>(null);

  const providerPath = PROVIDERS.find((p) => p.id === provider)?.path ?? "/anime/animekai";

  // ── OSD flash message ──────────────────────────────────────────────────────
  const osd = (msg: string) => {
    setOsdMsg(msg);
    if (osdRef.current) clearTimeout(osdRef.current);
    osdRef.current = setTimeout(() => setOsdMsg(null), 1400);
  };

  // ── Playback position save/restore ─────────────────────────────────────────
  const posKey = `soraku_pos_${episodeId}`;
  const savePos = useCallback(() => {
    const v = videoRef.current;
    if (!v || v.currentTime < 5) return;
    try { localStorage.setItem(posKey, String(Math.floor(v.currentTime))); } catch {}
  }, [posKey]);

  useEffect(() => {
    const interval = setInterval(savePos, 5000);
    return () => clearInterval(interval);
  }, [savePos]);

  // Restore on load
  const restorePos = useCallback(() => {
    try {
      const saved = localStorage.getItem(posKey);
      if (saved && videoRef.current) {
        const t = parseInt(saved);
        if (t > 5) videoRef.current.currentTime = t;
      }
    } catch {}
  }, [posKey]);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const v = videoRef.current;
      if (!v) return;
      switch (e.key) {
        case " ": case "k":
          e.preventDefault();
          if (v.paused) { v.play(); osd("▶ Putar"); setIsPlaying(true); }
          else          { v.pause(); osd("⏸ Jeda"); setIsPlaying(false); }
          break;
        case "ArrowRight":
          e.preventDefault();
          v.currentTime = Math.min(v.duration, v.currentTime + 10);
          osd("⏩ +10 detik");
          break;
        case "ArrowLeft":
          e.preventDefault();
          v.currentTime = Math.max(0, v.currentTime - 10);
          osd("⏪ -10 detik");
          break;
        case "ArrowUp":
          e.preventDefault();
          v.volume = Math.min(1, v.volume + 0.1);
          setVolume(v.volume);
          osd(`🔊 ${Math.round(v.volume * 100)}%`);
          break;
        case "ArrowDown":
          e.preventDefault();
          v.volume = Math.max(0, v.volume - 0.1);
          setVolume(v.volume);
          osd(`🔉 ${Math.round(v.volume * 100)}%`);
          break;
        case "f": case "F":
          e.preventDefault();
          toggleFullscreen();
          osd(document.fullscreenElement ? "⬜ Keluar Layar Penuh" : "⛶ Layar Penuh");
          break;
        case "t": case "T":
          e.preventDefault();
          onToggleTheater();
          osd("🎭 Mode Bioskop");
          break;
        case "m": case "M":
          e.preventDefault();
          v.muted = !v.muted;
          setIsMuted(v.muted);
          osd(v.muted ? "🔇 Bisu" : "🔊 Suara");
          break;
        case "n": case "N":
          e.preventDefault();
          onNextEpisode();
          osd("⏭ Episode Selanjutnya");
          break;
        case "p": case "P":
          e.preventDefault();
          onPrevEpisode();
          osd("⏮ Episode Sebelumnya");
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Fetch source ──────────────────────────────────────────────────────────
  const fetchFromProvider = useCallback(async (prov: AnimeProvider): Promise<boolean> => {
    const path = PROVIDERS.find((p) => p.id === prov)?.path ?? "/anime/animekai";
    const url = `${consumetBase}${path}/watch/${encodeURIComponent(episodeId)}`;
    try {
      const r = await fetch(url);
      const data = await r.json();
      const srcs: VideoSource[] = data?.sources ?? [];
      const preferred =
        srcs.find((s) => s.quality === "1080p") ??
        srcs.find((s) => s.quality === "720p")  ??
        srcs.find((s) => s.isM3U8)              ??
        srcs[0];
      if (!preferred?.url) return false;
      setSrc(preferred.url);
      setSources(srcs);
      setQuality(preferred.quality ?? "auto");
      onDownloadLink(preferred.url);
      // Subtitles
      const rawSubs: { url: string; lang: string }[] = data?.subtitles ?? data?.tracks ?? [];
      const tracks: SubTrack[] = rawSubs.map((s) => ({
        url: s.url, lang: s.lang,
        label: s.lang === "Indonesian" || s.lang.toLowerCase().includes("indonesia") ? "Indonesia 🇮🇩" : s.lang,
      }));
      const idSub = tracks.find((t) => t.lang.toLowerCase().includes("indonesi") || t.lang.toLowerCase() === "id");
      setSubtracks(tracks);
      if (idSub) setActiveSub(idSub.url);
      return true;
    } catch { return false; }
  }, [consumetBase, episodeId, onDownloadLink]);

  useEffect(() => {
    if (!episodeId) return;
    setIsLoading(true);
    setHasError(false);
    setSrc("");
    setSubtracks([]);
    setActiveSub("");

    // Try primary provider, then fallback order
    const fallbackOrder: AnimeProvider[] = [
      provider,
      ...PROVIDERS.map((p) => p.id).filter((id) => id !== provider),
    ];

    (async () => {
      let success = false;
      for (const prov of fallbackOrder) {
        const ok = await fetchFromProvider(prov);
        if (ok) { success = true; setProvider(prov); break; }
      }
      if (!success) setHasError(true);

      // Aniskip
      if (malId) {
        try {
          const sk = await fetch(`https://api.aniskip.com/v2/skip-times/${malId}/${episodeNumber}?types[]=op&types[]=ed&episodeLength=0`).then((r) => r.json());
          if (sk?.results) {
            setSkipTimes(sk.results.map((r: { interval: { startTime: number; endTime: number }; skipType: string }) => ({
              start: r.interval.startTime, end: r.interval.endTime, type: r.skipType,
            })));
          }
        } catch {}
      }
      setIsLoading(false);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodeId, provider]);

  // ── HLS setup ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!src || !videoRef.current) return;
    hlsRef.current?.destroy();
    hlsRef.current = null;

    const video = videoRef.current;
    video.playbackRate = speed;

    if (src.includes(".m3u8") && Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.playbackRate = speed;
        restorePos();
        if (prefs.autoPutar) video.play().catch(() => {});
      });
    } else {
      video.src = src;
      if (prefs.autoPutar) video.play().catch(() => {});
    }

    return () => { hlsRef.current?.destroy(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // ── Subtitle track injection ───────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Remove old tracks
    Array.from(video.querySelectorAll("track")).forEach((t) => t.remove());
    // Disable all existing text tracks
    for (let i = 0; i < video.textTracks.length; i++) {
      video.textTracks[i].mode = "disabled";
    }
    if (!activeSub) return;
    // Add new track
    const track = document.createElement("track");
    track.kind = "subtitles";
    track.src = activeSub;
    track.label = subtracks.find((t) => t.url === activeSub)?.label ?? "Subtitle";
    track.default = true;
    video.appendChild(track);
    setTimeout(() => {
      for (let i = 0; i < video.textTracks.length; i++) {
        video.textTracks[i].mode = "showing";
      }
    }, 100);
  }, [activeSub, subtracks]);

  // ── Skip detection ─────────────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !skipTimes.length) return;
    const onTime = () => {
      const t = video.currentTime;
      setCurrentTime(t);
      const hit = skipTimes.find((s) => t >= s.start && t < s.end);
      if (hit) {
        setShowSkipBtn(hit.type === "op" ? "Lewati Opening" : "Lewati Ending");
        if (prefs.lewatiOtomatis) video.currentTime = hit.end;
      } else setShowSkipBtn(null);
    };
    video.addEventListener("timeupdate", onTime);
    return () => video.removeEventListener("timeupdate", onTime);
  }, [skipTimes, prefs.lewatiOtomatis]);

  // ── Controls hide ──────────────────────────────────────────────────────────
  const resetTimer = useCallback(() => {
    setShowControls(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  }, [isPlaying]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setIsPlaying(true); }
    else          { v.pause(); setIsPlaying(false); }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const seek = (val: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = val;
    setCurrentTime(val);
  };

  const setVol = (val: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = val;
    setVolume(val);
    setIsMuted(val === 0);
  };

  const changeSpeed = (s: number) => {
    setSpeed(s);
    if (videoRef.current) videoRef.current.playbackRate = s;
  };

  const changeQuality = (q: VideoSource) => {
    const pos = videoRef.current?.currentTime ?? 0;
    setSrc(q.url);
    setQuality(q.quality);
    setTimeout(() => { if (videoRef.current) videoRef.current.currentTime = pos; }, 300);
  };

  const screenshot = () => {
    const v = videoRef.current;
    const c = canvasRef.current;
    if (!v || !c) return;
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext("2d")?.drawImage(v, 0, 0);
    const link = document.createElement("a");
    link.download = `${animeTitle}-ep${episodeNumber}-${Math.floor(currentTime)}s.png`;
    link.href = c.toDataURL("image/png");
    link.click();
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const togglePref = (k: keyof PlayerPrefs) =>
    setPrefs((p) => ({ ...p, [k]: !p[k] }));

  const togglePanel = (p: typeof activePanel) =>
    setActivePanel((v) => (v === p ? null : p));

  if (hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-black">
        <p className="text-white/60 text-sm">Server tidak tersedia.</p>
        <div className="flex gap-2">
          {PROVIDERS.filter((p) => p.id !== provider).map((p) => (
            <button
              key={p.id}
              onClick={() => setProvider(p.id)}
              className="px-4 py-2 rounded-lg text-xs font-700 text-white transition-all hover:scale-105"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              Coba {p.label}
            </button>
          ))}
          <button
            onClick={() => { setHasError(false); setIsLoading(true); }}
            className="px-4 py-2 rounded-lg text-xs font-700 text-white transition-all hover:scale-105 flex items-center gap-1.5"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              background: "rgba(var(--accent-rgb),0.8)",
            }}
          >
            <RefreshCw size={13} /> Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black select-none"
      onMouseMove={resetTimer}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onTouchStart={resetTimer}
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
        onEnded={() => {
          savePos();
          try { localStorage.removeItem(posKey); } catch {}
          setIsPlaying(false);
          if (prefs.lanjutOtomatis) onEpisodeEnd();
        }}
        playsInline
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* OSD flash message */}
      {osdMsg && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 animate-scale-in"
          style={{
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "0.6rem 1.2rem",
            color: "#fff",
            fontSize: "0.9rem",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          {osdMsg}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-white animate-spin" />
        </div>
      )}

      {/* Skip button */}
      {showSkipBtn && !prefs.lewatiOtomatis && (
        <div className="absolute bottom-24 right-5 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const hit = skipTimes.find((s) => (videoRef.current?.currentTime ?? 0) >= s.start);
              if (hit && videoRef.current) videoRef.current.currentTime = hit.end;
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-700 text-white transition-all hover:scale-105"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              background: "rgba(var(--accent-rgb),0.9)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 20px rgba(var(--accent-rgb),0.4)",
            }}
          >
            ⏭ {showSkipBtn}
          </button>
        </div>
      )}

      {/* Controls overlay */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-end transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 55%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Settings panels */}
        {activePanel && (
          <div
            className="absolute bottom-16 right-4 rounded-2xl p-4 w-56 z-30 animate-slide-down"
            style={{
              background: "rgba(10,10,15,0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* PLAYER prefs */}
            {activePanel === "player" && (
              <>
                <p className="text-[0.62rem] font-700 uppercase tracking-widest mb-3 text-white/40" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                  Player
                </p>
                {([
                  { k: "autoPutar", label: "Putar Otomatis" },
                  { k: "lewatiOtomatis", label: "Lewati Intro/Outro" },
                  { k: "lanjutOtomatis", label: "Lanjut Otomatis" },
                ] as { k: keyof PlayerPrefs; label: string }[]).map(({ k, label }) => (
                  <button
                    key={k}
                    onClick={() => togglePref(k)}
                    className="flex items-center gap-2.5 w-full py-2 text-left transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body)", fontSize: "0.8rem" }}
                  >
                    <span
                      className={cn("w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                        prefs[k] ? "border-[var(--accent)] bg-[var(--accent)]" : "border-white/25 bg-transparent")}
                    >
                      {prefs[k] && <Check size={9} strokeWidth={3} />}
                    </span>
                    {label}
                  </button>
                ))}
              </>
            )}

            {/* SERVER */}
            {activePanel === "server" && (
              <>
                <p className="text-[0.62rem] font-700 uppercase tracking-widest mb-3 text-white/40" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>Server</p>
                {PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setProvider(p.id); setActivePanel(null); }}
                    className="flex items-center justify-between w-full py-2 text-sm transition-colors hover:text-white"
                    style={{ color: provider === p.id ? "var(--accent)" : "rgba(255,255,255,0.7)", fontFamily: "var(--font-body)" }}
                  >
                    {p.label}
                    {provider === p.id && <Check size={13} style={{ color: "var(--accent)" }} />}
                  </button>
                ))}
              </>
            )}

            {/* KUALITAS */}
            {activePanel === "kualitas" && (
              <>
                <p className="text-[0.62rem] font-700 uppercase tracking-widest mb-3 text-white/40" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>Kualitas</p>
                {sources.map((s) => (
                  <button
                    key={s.quality}
                    onClick={() => { changeQuality(s); setActivePanel(null); }}
                    className="flex items-center justify-between w-full py-2 text-sm transition-colors hover:text-white"
                    style={{ color: quality === s.quality ? "var(--accent)" : "rgba(255,255,255,0.7)", fontFamily: "var(--font-body)" }}
                  >
                    {s.quality}
                    {quality === s.quality && <Check size={13} style={{ color: "var(--accent)" }} />}
                  </button>
                ))}
              </>
            )}

            {/* SPEED */}
            {activePanel === "speed" && (
              <>
                <p className="text-[0.62rem] font-700 uppercase tracking-widest mb-3 text-white/40" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>Kecepatan</p>
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    onClick={() => { changeSpeed(s); setActivePanel(null); }}
                    className="flex items-center justify-between w-full py-2 text-sm transition-colors hover:text-white"
                    style={{ color: speed === s ? "var(--accent)" : "rgba(255,255,255,0.7)", fontFamily: "var(--font-body)" }}
                  >
                    {s === 1 ? "Normal" : `${s}×`}
                    {speed === s && <Check size={13} style={{ color: "var(--accent)" }} />}
                  </button>
                ))}
              </>
            )}

            {/* SUBTITLE / TERJEMAHAN */}
            {activePanel === "sub" && (
              <>
                <p className="text-[0.62rem] font-700 uppercase tracking-widest mb-3 text-white/40" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                  Subtitle / Terjemahan
                </p>
                <button
                  onClick={() => { setActiveSub(""); setActivePanel(null); }}
                  className="flex items-center justify-between w-full py-2 text-sm transition-colors hover:text-white"
                  style={{ color: activeSub === "" ? "var(--accent)" : "rgba(255,255,255,0.7)", fontFamily: "var(--font-body)" }}
                >
                  Nonaktif
                  {activeSub === "" && <Check size={13} style={{ color: "var(--accent)" }} />}
                </button>
                {subtracks.length === 0 && (
                  <p className="text-xs text-white/30 py-2" style={{ fontFamily: "var(--font-body)" }}>
                    Subtitle tidak tersedia untuk episode ini.
                  </p>
                )}
                {subtracks.map((t) => (
                  <button
                    key={t.url}
                    onClick={() => { setActiveSub(t.url); setActivePanel(null); }}
                    className="flex items-center justify-between w-full py-2 text-sm transition-colors hover:text-white"
                    style={{
                      color: activeSub === t.url ? "var(--accent)" : "rgba(255,255,255,0.7)",
                      fontFamily: "var(--font-body)",
                      fontWeight: t.label.includes("Indonesia") ? 600 : 400,
                    }}
                  >
                    {t.label}
                    {activeSub === t.url && <Check size={13} style={{ color: "var(--accent)" }} />}
                  </button>
                ))}
              </>
            )}
          </div>
        )}

        {/* Title bar */}
        <div className="px-4 pb-1">
          <p className="text-white/60 text-xs truncate" style={{ fontFamily: "var(--font-body)" }}>
            {animeTitle} — Episode {episodeNumber}
          </p>
        </div>

        {/* Progress bar */}
        <div className="px-4 pb-2 group/progress">
          <input
            type="range"
            min={0} max={duration || 1} value={currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
            className="w-full cursor-pointer"
            style={{
              height: "3px",
              appearance: "none",
              background: `linear-gradient(to right, var(--accent) ${(currentTime/(duration||1))*100}%, rgba(255,255,255,0.2) 0%)`,
              outline: "none",
              borderRadius: "99px",
            }}
          />
        </div>

        {/* Buttons row */}
        <div className="flex items-center gap-1 px-3 pb-3">
          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); onPrevEpisode(); }}
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            <SkipBack size={16} />
          </button>

          {/* Play/Pause */}
          <button
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            className="p-2 text-white hover:text-white/80 transition-colors"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); onNextEpisode(); }}
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            <SkipForward size={16} />
          </button>

          {/* ±10s */}
          <button
            onClick={(e) => { e.stopPropagation(); seek(Math.max(0, currentTime - 10)); }}
            className="p-1.5 text-white/40 hover:text-white text-xs transition-colors"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >-10</button>
          <button
            onClick={(e) => { e.stopPropagation(); seek(Math.min(duration, currentTime + 10)); }}
            className="p-1.5 text-white/40 hover:text-white text-xs transition-colors"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >+10</button>

          {/* Time */}
          <span className="text-white/50 text-xs ml-1 tabular-nums" style={{ fontFamily: "var(--font-display)" }}>
            {fmt(currentTime)} / {fmt(duration)}
          </span>

          <div className="flex-1" />

          {/* Volume */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleMute(); }}
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range" min={0} max={1} step={0.05} value={isMuted ? 0 : volume}
            onChange={(e) => setVol(parseFloat(e.target.value))}
            className="w-16 hidden sm:block"
            style={{ height: "3px", appearance: "none", background: `linear-gradient(to right, white ${volume*100}%, rgba(255,255,255,0.2) 0%)`, outline: "none", borderRadius: "99px", cursor: "pointer" }}
          />

          {/* Subtitle */}
          <button
            onClick={(e) => { e.stopPropagation(); togglePanel("sub"); }}
            className={cn("p-2 transition-colors relative", activePanel === "sub" ? "text-[var(--accent)]" : "text-white/60 hover:text-white")}
            title="Subtitle / Terjemahan"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 15h4m4 0h2M7 11h2m4 0h4"/></svg>
            {activeSub && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            )}
          </button>

          {/* Screenshot */}
          <button
            onClick={(e) => { e.stopPropagation(); screenshot(); }}
            className="p-2 text-white/60 hover:text-white transition-colors hidden sm:block"
            title="Screenshot"
          >
            <Camera size={15} />
          </button>

          {/* Speed indicator */}
          {speed !== 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); togglePanel("speed"); }}
              className="px-2 py-1 rounded text-xs font-700 text-white/80"
              style={{ background: "rgba(255,255,255,0.1)", fontFamily: "var(--font-display)", fontWeight: 700 }}
            >
              {speed}×
            </button>
          )}

          {/* Settings icon */}
          <button
            onClick={(e) => { e.stopPropagation(); togglePanel("player"); }}
            className={cn("p-2 transition-colors", activePanel === "player" ? "text-[var(--accent)]" : "text-white/60 hover:text-white")}
            title="Pengaturan"
          >
            <Settings size={15} />
          </button>

          {/* Server */}
          <button
            onClick={(e) => { e.stopPropagation(); togglePanel("server"); }}
            className={cn("p-2 transition-colors hidden md:block", activePanel === "server" ? "text-[var(--accent)]" : "text-white/60 hover:text-white")}
            title="Server"
          >
            <Layers size={15} />
          </button>

          {/* Quality */}
          {sources.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); togglePanel("kualitas"); }}
              className={cn("p-2 transition-colors hidden md:block", activePanel === "kualitas" ? "text-[var(--accent)]" : "text-white/60 hover:text-white")}
              title="Kualitas"
            >
              <Gauge size={15} />
            </button>
          )}

          {/* Speed */}
          <button
            onClick={(e) => { e.stopPropagation(); togglePanel("speed"); }}
            className={cn("p-2 transition-colors hidden md:block", activePanel === "speed" ? "text-[var(--accent)]" : "text-white/60 hover:text-white")}
            title="Kecepatan"
          >
            <Gauge size={13} />
          </button>

          {/* Theater */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleTheater(); }}
            className={cn("p-2 transition-colors hidden md:block", isTheater ? "text-[var(--accent)]" : "text-white/60 hover:text-white")}
            title="Mode Bioskop"
          >
            <Theater size={15} />
          </button>

          {/* Fullscreen */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
            className="p-2 text-white/60 hover:text-white transition-colors"
            title="Layar Penuh"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
