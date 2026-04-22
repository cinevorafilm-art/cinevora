import { addToMyList, updateWatchProgress } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import type { Movie } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  Loader2,
  Lock,
  Maximize,
  Minimize,
  Pause,
  Play,
  Settings,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  movie: Movie;
  resumeFrom?: number;
  onProgressUpdate?: (seconds: number) => void;
}

function PremiumGate() {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center z-20"
      style={{ background: "rgba(8,6,3,0.88)", backdropFilter: "blur(12px)" }}
      data-ocid="video_player.premium_gate"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="flex flex-col items-center text-center px-6"
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.72 0.18 70 / 0.2), oklch(0.65 0.16 65 / 0.08))",
            border: "1.5px solid oklch(0.72 0.18 70 / 0.4)",
            boxShadow:
              "0 0 30px oklch(0.72 0.18 70 / 0.35), 0 0 60px oklch(0.72 0.18 70 / 0.15)",
          }}
        >
          <Lock
            className="size-8 text-primary"
            style={{ filter: "drop-shadow(0 0 8px oklch(0.72 0.18 70 / 0.6))" }}
          />
        </div>
        <h3 className="text-xl font-display font-bold text-foreground mb-2">
          Premium Content
        </h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
          Unlock this film and thousands more in stunning HD with a Cinevora
          Premium subscription.
        </p>
        <Link
          to="/pricing"
          data-ocid="video_player.subscribe_button"
          className="btn-gold px-8 py-2.5 rounded-lg text-sm font-bold inline-flex items-center gap-2"
        >
          Subscribe Now
        </Link>
      </motion.div>
    </div>
  );
}

export default function VideoPlayer({
  movie,
  resumeFrom = 0,
  onProgressUpdate,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffering, setBuffering] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [quality, setQuality] = useState("1080p");
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [resumed, setResumed] = useState(false);

  const { isAuthenticated, userProfile } = useAuthStore();
  const isLocked = movie.isPremium && !userProfile?.isPremium;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  const showControlsNow = useCallback(() => {
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    setShowControls(true);
    controlsTimerRef.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  }, [playing]);

  // Resume from saved position once duration is known
  useEffect(() => {
    if (resumed || !videoRef.current || duration === 0 || resumeFrom <= 0)
      return;
    videoRef.current.currentTime = resumeFrom;
    setResumed(true);
  }, [duration, resumeFrom, resumed]);

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoaded = () => setDuration(video.duration);
    const onWaiting = () => setBuffering(true);
    const onCanPlay = () => setBuffering(false);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  // Save progress every 30s
  useEffect(() => {
    if (!isAuthenticated || isLocked) return;
    saveTimerRef.current = setInterval(() => {
      const video = videoRef.current;
      if (!video || video.currentTime < 2) return;
      if (userProfile?.userId) {
        addToMyList(userProfile.userId, movie.id);
        updateWatchProgress(
          userProfile.userId,
          movie.id,
          Math.floor(video.currentTime),
        );
      }
      onProgressUpdate?.(Math.floor(video.currentTime));
    }, 30000);
    return () => {
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
    };
  }, [isAuthenticated, isLocked, movie.id, userProfile, onProgressUpdate]);

  // Keyboard controls
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const video = videoRef.current;
      if (!video || isLocked) return;
      if (e.code === "Space") {
        e.preventDefault();
        playing ? video.pause() : video.play();
      }
      if (e.code === "ArrowLeft") {
        video.currentTime = Math.max(0, video.currentTime - 5);
        showControlsNow();
      }
      if (e.code === "ArrowRight") {
        video.currentTime = Math.min(video.duration, video.currentTime + 5);
        showControlsNow();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing, isLocked, showControlsNow]);

  // Fullscreen change listener
  useEffect(() => {
    function onFsChange() {
      setFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  function togglePlay() {
    const video = videoRef.current;
    if (!video || isLocked) return;
    playing ? video.pause() : video.play();
    showControlsNow();
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = (Number(e.target.value) / 100) * video.duration;
  }

  function handleVolume(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value);
    setVolume(v);
    if (videoRef.current) videoRef.current.volume = v / 100;
    setMuted(v === 0);
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    const next = !muted;
    video.muted = next;
    setMuted(next);
  }

  function toggleFullscreen() {
    if (!containerRef.current) return;
    if (!fullscreen) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  const VolumeIcon =
    muted || volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-xl overflow-hidden w-full group"
      style={{ aspectRatio: "16/9" }}
      onMouseMove={showControlsNow}
      onMouseLeave={() => {
        if (playing) setShowControls(false);
      }}
      data-ocid="video_player.container"
    >
      {/* Premium Gate */}
      {isLocked && <PremiumGate />}

      {/* Video element */}
      <video
        ref={videoRef}
        src={isLocked ? undefined : movie.videoUrl}
        poster={movie.thumbnailUrl}
        preload="metadata"
        className="w-full h-full object-contain"
        onClick={togglePlay}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") togglePlay();
        }}
      >
        <track kind="captions" />
      </video>

      {/* Buffering spinner */}
      <AnimatePresence>
        {buffering && !isLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            <Loader2
              className="size-12 text-primary animate-spin"
              style={{
                filter: "drop-shadow(0 0 8px oklch(0.72 0.18 70 / 0.6))",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center play/pause overlay */}
      {!playing && !isLocked && !buffering && (
        <button
          type="button"
          onClick={togglePlay}
          data-ocid="video_player.big_play_button"
          aria-label="Play"
          className="absolute inset-0 flex items-center justify-center bg-transparent z-10"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.18 70), oklch(0.65 0.16 65))",
              boxShadow:
                "0 0 30px oklch(0.72 0.18 70 / 0.35), 0 0 60px oklch(0.72 0.18 70 / 0.15)",
            }}
          >
            <Play className="size-7 text-primary-foreground fill-current ml-0.5" />
          </motion.div>
        </button>
      )}

      {/* Controls bar */}
      <motion.div
        animate={{ opacity: showControls || !playing ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-x-0 bottom-0 z-10"
        data-ocid="video_player.controls"
      >
        {/* Gradient fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

        <div className="relative px-4 pb-4 pt-8">
          {/* Seek bar */}
          <div className="relative w-full h-3 flex items-center mb-3 group/seek">
            <div className="absolute w-full h-1 rounded-full bg-foreground/20" />
            <div
              className="absolute h-1 rounded-full"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, oklch(0.72 0.18 70), oklch(0.65 0.16 65))",
              }}
            />
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={progress}
              onChange={handleSeek}
              data-ocid="video_player.seek_bar"
              disabled={isLocked}
              aria-label="Seek"
              className="absolute w-full opacity-0 cursor-pointer h-3"
            />
            {/* Thumb */}
            <div
              className="absolute w-3 h-3 rounded-full transition-transform duration-150 group-hover/seek:scale-125"
              style={{
                left: `calc(${progress}% - 6px)`,
                background: "oklch(0.72 0.18 70)",
                boxShadow: "0 0 6px oklch(0.72 0.18 70 / 0.8)",
              }}
            />
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between gap-2">
            {/* Left controls */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                data-ocid="video_player.play_button"
                aria-label={playing ? "Pause" : "Play"}
                disabled={isLocked}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-smooth disabled:opacity-40 hover:scale-110"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.72 0.18 70 / 0.9), oklch(0.65 0.16 65 / 0.9))",
                  boxShadow: "0 0 12px oklch(0.72 0.18 70 / 0.3)",
                }}
              >
                {playing ? (
                  <Pause className="size-4 text-primary-foreground" />
                ) : (
                  <Play className="size-4 text-primary-foreground fill-current ml-0.5" />
                )}
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleMute}
                  data-ocid="video_player.mute_button"
                  aria-label={muted ? "Unmute" : "Mute"}
                  className="text-foreground/70 hover:text-primary transition-smooth"
                >
                  <VolumeIcon className="size-5" />
                </button>
                <div className="relative w-20 h-3 items-center hidden sm:flex group/vol">
                  <div className="absolute w-full h-1 rounded-full bg-foreground/20" />
                  <div
                    className="absolute h-1 rounded-full"
                    style={{
                      width: `${muted ? 0 : volume}%`,
                      background:
                        "linear-gradient(90deg, oklch(0.72 0.18 70), oklch(0.65 0.16 65))",
                    }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={muted ? 0 : volume}
                    onChange={handleVolume}
                    data-ocid="video_player.volume_slider"
                    aria-label="Volume"
                    className="absolute w-full opacity-0 cursor-pointer h-3"
                  />
                </div>
              </div>

              {/* Time */}
              <span className="text-xs text-foreground/60 hidden sm:block font-mono tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              {/* Quality selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowQualityMenu((v) => !v)}
                  data-ocid="video_player.quality_button"
                  className="flex items-center gap-1 text-xs text-foreground/70 hover:text-primary transition-smooth"
                >
                  <Settings className="size-4" />
                  <span className="hidden sm:block">{quality}</span>
                </button>
                <AnimatePresence>
                  {showQualityMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-8 right-0 rounded-lg overflow-hidden shadow-xl z-30"
                      style={{
                        background: "oklch(0.14 0.018 50 / 0.95)",
                        border: "1px solid oklch(0.72 0.18 70 / 0.2)",
                        backdropFilter: "blur(12px)",
                      }}
                      data-ocid="video_player.quality_menu"
                    >
                      {["360p", "720p", "1080p"].map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => {
                            setQuality(q);
                            setShowQualityMenu(false);
                          }}
                          className={`flex w-full items-center px-4 py-2 text-xs transition-smooth ${quality === q ? "text-primary bg-primary/10" : "text-foreground/70 hover:bg-card/60 hover:text-primary"}`}
                          data-ocid={`video_player.quality_option_${q}`}
                        >
                          {q}
                          {quality === q && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Fullscreen */}
              <button
                type="button"
                onClick={toggleFullscreen}
                data-ocid="video_player.fullscreen_button"
                aria-label="Toggle fullscreen"
                className="text-foreground/70 hover:text-primary transition-smooth"
              >
                {fullscreen ? (
                  <Minimize className="size-5" />
                ) : (
                  <Maximize className="size-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
