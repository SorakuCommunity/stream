"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipForward, SkipBack, Settings, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  episodeId: string;
  animeTitle: string;
  episodeNumber: number;
  sourceType: string;
  language: string;
  consumetBase: string;
  onDownloadLink: (url: string) => void;
  onEpisodeEnd: () => void;
  onPrevEpisode: () => void;
  onNextEpisode: () => void;
}

interface PlayerSettings {
  autoPutar: boolean;
  lewatiOtomatis: boolean;
  lanjutOtomatis: boolean;
}

export function VideoPlayer({
  episodeId,
  animeTitle,
  episodeNumber,
  consumetBase,
  onDownloadLink,
  onEpisodeEnd,
  onPrevEpisode,
  onNextEpisode,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimer = useRef<NodeJS.Timeout | null>(null);

  const [src, setSrc] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<PlayerSettings>({
    autoPutar: true,
    lewatiOtomatis: true,
    lanjutOtomatis: true,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [skipTimes, setSkipTimes] = useState<
    { start: number; end: number; type: string }[]
  >([]);
  const [showSkipBtn, setShowSkipBtn] = useState<string | null>(null);

  // Fetch dari AnimeKai via Consumet self-host
  useEffect(() => {
    if (!episodeId) return;
    setIsLoading(true);
    setSrc("");

    const url = `${consumetBase}/anime/animekai/watch/${encodeURIComponent(episodeId)}`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const sources: { url: string; quality: string; isM3U8?: boolean }[] =
          data?.sources ?? [];

        // Prioritas kualitas: 1080p → 720p → m3u8 → pertama
        const preferred =
          sources.find((s) => s.quality === "1080p") ??
          sources.find((s) => s.quality === "720p") ??
          sources.find((s) => s.isM3U8) ??
          sources[0];

        if (preferred?.url) {
          setSrc(preferred.url);
          onDownloadLink(preferred.url);
        }

        // Aniskip untuk skip intro/outro
        const malId = data?.malId;
        if (malId) {
          fetch(
            `https://api.aniskip.com/v2/skip-times/${malId}/${episodeNumber}?types[]=op&types[]=ed&episodeLength=0`
          )
            .then((r) => r.json())
            .then((skip) => {
              if (skip?.results) {
                setSkipTimes(
                  skip.results.map(
                    (r: {
                      interval: { startTime: number; endTime: number };
                      skipType: string;
                    }) => ({
                      start: r.interval.startTime,
                      end: r.interval.endTime,
                      type: r.skipType,
                    })
                  )
                );
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [episodeId, consumetBase, episodeNumber, onDownloadLink]);

  // Setup HLS
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
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari native HLS
      videoRef.current.src = src;
      if (settings.autoPutar) videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.src = src;
      if (settings.autoPutar) videoRef.current.play().catch(() => {});
    }

    return () => { hlsRef.current?.destroy(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // Auto-skip
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !skipTimes.length) return;

    const handleTime = () => {
      const t = video.currentTime;
      setCurrentTime(t);
      const active = skipTimes.find((s) => t >= s.start && t < s.end);
      if (active) {
        const label = active.type === "op" ? "Lewati Opening" : "Lewati Ending";
        setShowSkipBtn(label);
        if (settings.lewatiOtomatis) video.currentTime = active.end;
      } else {
        setShowSkipBtn(null);
      }
    };
    video.addEventListener("timeupdate", handleTime);
    return () => video.removeEventListener("timeupdate", handleTime);
  }, [skipTimes, settings.lewatiOtomatis]);

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

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const handleSeek = (val: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = val;
    setCurrentTime(val);
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

  const skipForward = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (v) v.currentTime = Math.min(v.currentTime + 10, v.duration);
  };

  const skipBackward = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (v) v.currentTime = Math.max(v.currentTime - 10, 0);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const toggleSetting = (key: keyof PlayerSettings) =>
    setSettings((p) => ({ ...p, [key]: !p[key] }));

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
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onEnded={() => {
          setIsPlaying(false);
          if (settings.lanjutOtomatis) onEpisodeEnd();
        }}
        playsInline
      />

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Skip button */}
      {showSkipBtn && !settings.lewatiOtomatis && (
        <div className="absolute bottom-24 right-4 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const active = skipTimes.find(
                (s) => (videoRef.current?.currentTime ?? 0) >= s.start
              );
              if (active && videoRef.current)
                videoRef.current.currentTime = active.end;
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
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 55%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Anime title */}
        <div className="px-4 pb-1">
          <p className="text-white/70 text-xs truncate">
            {animeTitle} — Episode {episodeNumber}
          </p>
        </div>

        {/* Progress bar */}
        <div className="px-4 pb-1.5">
          <input
            type="range"
            min={0}
            max={duration || 1}
            value={currentTime}
            onChange={(e) => handleSeek(parseFloat(e.target.value))}
            className="w-full h-1 cursor-pointer accent-[var(--accent)]"
            style={{
              background: `linear-gradient(to right, var(--accent) ${
                (currentTime / (duration || 1)) * 100
              }%, rgba(255,255,255,0.25) 0%)`,
            }}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1.5 px-3 pb-3">
          <button
            onClick={(e) => { e.stopPropagation(); onPrevEpisode(); }}
            className="text-white/70 hover:text-white p-1.5 transition-colors"
            title="Episode sebelumnya"
          >
            <SkipBack size={16} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            className="text-white p-1.5"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onNextEpisode(); }}
            className="text-white/70 hover:text-white p-1.5 transition-colors"
            title="Episode berikutnya"
          >
            <SkipForward size={16} />
          </button>

          <button
            onClick={skipBackward}
            className="text-white/50 hover:text-white text-xs px-1.5 py-1 transition-colors"
            title="Mundur 10 detik"
          >
            -10
          </button>
          <button
            onClick={skipForward}
            className="text-white/50 hover:text-white text-xs px-1.5 py-1 transition-colors"
            title="Maju 10 detik"
          >
            +10
          </button>

          <span className="text-white/50 text-xs ml-1 tabular-nums">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="flex-1" />

          {/* Volume */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleMute(); }}
            className="text-white/70 hover:text-white p-1.5 transition-colors"
          >
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (videoRef.current) videoRef.current.volume = val;
              setVolume(val);
              setIsMuted(val === 0);
            }}
            className="w-16 h-1 cursor-pointer accent-[var(--accent)] hidden sm:block"
          />

          {/* Settings */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowSettings((v) => !v); }}
              className="text-white/70 hover:text-white p-1.5 transition-colors"
              title="Pengaturan"
            >
              <Settings size={15} />
            </button>
            {showSettings && (
              <div
                className="absolute bottom-10 right-0 rounded-xl p-3 w-52 text-xs z-20 animate-slide-down"
                style={{
                  backgroundColor: "rgba(18,18,18,0.97)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-white/40 text-[10px] uppercase tracking-wider mb-2 px-1">
                  Pengaturan Player
                </p>
                {(
                  [
                    { key: "autoPutar", label: "Putar Otomatis" },
                    { key: "lewatiOtomatis", label: "Lewati Otomatis (Intro/Outro)" },
                    { key: "lanjutOtomatis", label: "Lanjut Episode Otomatis" },
                  ] as { key: keyof PlayerSettings; label: string }[]
                ).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => toggleSetting(key)}
                    className="flex items-center gap-2.5 w-full py-2 px-1 text-left hover:text-white transition-colors"
                    style={{ color: "rgba(255,255,255,0.75)" }}
                  >
                    <span
                      className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center shrink-0",
                        settings[key]
                          ? "border-[var(--accent)] bg-[var(--accent)]"
                          : "border-white/30"
                      )}
                    >
                      {settings[key] && <Check size={10} strokeWidth={3} />}
                    </span>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
            className="text-white/70 hover:text-white p-1.5 transition-colors"
            title="Layar penuh"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
