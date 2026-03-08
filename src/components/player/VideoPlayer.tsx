"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipForward, SkipBack, Settings, Check, Square,
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
  episodeId, animeTitle, episodeNumber, sourceType, language,
  consumetBase, onDownloadLink, onEpisodeEnd, onPrevEpisode, onNextEpisode,
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
  const [skipTimes, setSkipTimes] = useState<{ start: number; end: number; type: string }[]>([]);
  const [showSkipBtn, setShowSkipBtn] = useState<string | null>(null);

  // Fetch streaming source
  useEffect(() => {
    if (!episodeId) return;
    setIsLoading(true);

    const endpoint =
      sourceType === "vidstreaming"
        ? `${consumetBase}/anime/gogoanime/watch/${episodeId}?server=vidstreaming`
        : `${consumetBase}/anime/gogoanime/watch/${episodeId}`;

    fetch(endpoint)
      .then((r) => r.json())
      .then((data) => {
        const sources = data?.sources ?? [];
        const preferred = sources.find((s: { quality: string }) => s.quality === "1080p")
          ?? sources.find((s: { quality: string }) => s.quality === "720p")
          ?? sources.find((s: { isM3U8: boolean }) => s.isM3U8)
          ?? sources[0];

        if (preferred?.url) {
          setSrc(preferred.url);
          onDownloadLink(preferred.url);
        }

        // Skip times from Aniskip
        const malId = data?.malId;
        if (malId) {
          fetch(`https://api.aniskip.com/v2/skip-times/${malId}/${episodeNumber}?types[]=op&types[]=ed&episodeLength=0`)
            .then((r) => r.json())
            .then((skip) => {
              if (skip?.results) {
                setSkipTimes(skip.results.map((r: {
                  interval: { startTime: number; endTime: number };
                  skipType: string;
                }) => ({
                  start: r.interval.startTime,
                  end: r.interval.endTime,
                  type: r.skipType,
                })));
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [episodeId, sourceType, language, consumetBase, episodeNumber, onDownloadLink]);

  // HLS setup
  useEffect(() => {
    if (!src || !videoRef.current) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

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
  }, [src, settings.autoPutar]);

  // Auto-skip
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !skipTimes.length) return;

    const handleTimeUpdate = () => {
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
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [skipTimes, settings.lewatiOtomatis]);

  // Controls hide timer
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

  const handleVolumeChange = (val: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = val;
    setVolume(val);
    setIsMuted(val === 0);
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

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const skipForward = () => {
    const v = videoRef.current;
    if (v) v.currentTime = Math.min(v.currentTime + 10, v.duration);
  };
  const skipBackward = () => {
    const v = videoRef.current;
    if (v) v.currentTime = Math.max(v.currentTime - 10, 0);
  };

  const toggleSetting = (key: keyof PlayerSettings) => {
    setSettings((p) => ({ ...p, [key]: !p[key] }));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black select-none"
      onMouseMove={resetControlsTimer}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onTouchStart={resetControlsTimer}
      onClick={togglePlay}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        className="w-full h-full"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
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
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Skip button */}
      {showSkipBtn && !settings.lewatiOtomatis && (
        <div className="absolute bottom-24 right-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const active = skipTimes.find(
                (s) => (videoRef.current?.currentTime ?? 0) >= s.start
              );
              if (active && videoRef.current) videoRef.current.currentTime = active.end;
            }}
            className="soraku-btn soraku-btn-accent text-sm px-4 py-2"
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
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <div className="px-4 pb-1">
          <p className="text-white text-xs font-medium opacity-80">
            {animeTitle} — Episode {episodeNumber}
          </p>
        </div>

        {/* Progress bar */}
        <div className="px-4 pb-1">
          <input
            type="range"
            min={0}
            max={duration || 1}
            value={currentTime}
            onChange={(e) => handleSeek(parseFloat(e.target.value))}
            className="w-full h-1 cursor-pointer accent-[var(--accent)]"
            style={{ background: `linear-gradient(to right, var(--accent) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.3) 0%)` }}
          />
        </div>

        {/* Buttons row */}
        <div className="flex items-center gap-2 px-4 pb-3">
          {/* Prev/Play/Next */}
          <button onClick={onPrevEpisode} className="text-white/80 hover:text-white p-1">
            <SkipBack size={18} />
          </button>
          <button onClick={togglePlay} className="text-white p-1">
            {isPlaying ? <Pause size={22} /> : <Play size={22} />}
          </button>
          <button onClick={onNextEpisode} className="text-white/80 hover:text-white p-1">
            <SkipForward size={18} />
          </button>

          {/* Skip ±10s */}
          <button onClick={skipBackward} className="text-white/60 hover:text-white text-xs p-1">
            -10
          </button>
          <button onClick={skipForward} className="text-white/60 hover:text-white text-xs p-1">
            +10
          </button>

          {/* Time */}
          <span className="text-white/70 text-xs ml-1">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="flex-1" />

          {/* Volume */}
          <button onClick={toggleMute} className="text-white/80 hover:text-white p-1">
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range" min={0} max={1} step={0.05} value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-16 h-1 cursor-pointer accent-[var(--accent)] hidden sm:block"
          />

          {/* Settings toggle */}
          <div className="relative">
            <button
              onClick={() => setShowSettings((v) => !v)}
              className="text-white/80 hover:text-white p-1"
            >
              <Settings size={16} />
            </button>
            {showSettings && (
              <div
                className="absolute bottom-10 right-0 rounded-lg p-3 min-w-[180px] text-xs animate-slide-down z-10"
                style={{ backgroundColor: "rgba(20,20,20,0.95)", border: "1px solid var(--border)" }}
                onClick={(e) => e.stopPropagation()}
              >
                {(
                  [
                    { key: "autoPutar", label: "Putar Otomatis" },
                    { key: "lewatiOtomatis", label: "Lewati Otomatis" },
                    { key: "lanjutOtomatis", label: "Lanjut Otomatis" },
                  ] as { key: keyof PlayerSettings; label: string }[]
                ).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => toggleSetting(key)}
                    className="flex items-center gap-2 w-full py-1.5 text-left text-white/80 hover:text-white"
                  >
                    <span
                      className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center shrink-0",
                        settings[key]
                          ? "bg-[var(--accent)] border-[var(--accent)]"
                          : "border-white/30"
                      )}
                    >
                      {settings[key] && <Check size={10} />}
                    </span>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen */}
          <button onClick={toggleFullscreen} className="text-white/80 hover:text-white p-1">
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
