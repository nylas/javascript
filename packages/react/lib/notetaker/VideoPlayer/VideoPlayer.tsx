import React, { useRef, useEffect, useCallback } from "react";

import { tv } from "tailwind-variants";
import { create } from "zustand";

interface VideoStore {
  currentTime: number;
  /** Whether the video is currently playing */
  isPlaying: boolean;
  setCurrentTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
}

export const videoPlayerStore = create<VideoStore>((set) => ({
  currentTime: 0,
  isPlaying: false,
  setCurrentTime: (time: number) => set({ currentTime: time }),
  setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),
}));

/**
 * Props for the VideoPlayer component.
 */
export interface VideoPlayerProps {
  /**
   * The URL of the video to play. If provided, a <source> tag will be rendered with this URL.
   */
  videoUrl: string;
  /**
   * Additional class name(s) for the video element.
   */
  className?: string;
  /**
   * Poster image URL to show before the video plays.
   */
  poster?: string;
  /**
   * Whether the video should start playing automatically.
   */
  autoPlay?: boolean;
  /**
   * Whether the video should be muted by default.
   */
  muted?: boolean;
  /**
   * Whether the video should loop after ending.
   */
  loop?: boolean;
  /**
   * The MIME type of the video (e.g., 'video/mp4'). Used for the <source> tag if videoUrl is provided.
   */
  videoType?: string;
  /**
   * Callback for every time update, receives the current playback time in seconds.
   */
  onTimeUpdate?: (currentTime: number) => void;
  /**
   * Callback when the user seeks to a new time, receives the new time in seconds.
   */
  onSeek?: (newTime: number) => void;
  /**
   * Callback when the video starts playing.
   */
  onPlay?: () => void;
  /**
   * Callback when the video is paused.
   */
  onPause?: () => void;
  /**
   * Callback when the video playback ends.
   */
  onEnded?: () => void;
}

const videoContainer = tv({
  base: "ny:w-full",
  variants: {},
});

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  className,
  poster,
  autoPlay = false,
  muted = false,
  loop = false,
  onTimeUpdate,
  onSeek,
  onPlay,
  onPause,
  onEnded,
  videoType,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { currentTime, setCurrentTime, setIsPlaying } = videoPlayerStore();

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (onTimeUpdate) {
        onTimeUpdate(videoRef.current.currentTime);
      }
    }
  }, [setCurrentTime, onTimeUpdate]);

  const handleSeeked = useCallback(() => {
    if (videoRef.current && onSeek) {
      onSeek(videoRef.current.currentTime);
    }
  }, [onSeek]);

  // Handlers to track play / pause / end state
  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    if (onPlay) {
      onPlay();
    }
  }, [setIsPlaying, onPlay]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    if (onPause) {
      onPause();
    }
  }, [setIsPlaying, onPause]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    if (onEnded) {
      onEnded();
    }
  }, [setIsPlaying, onEnded]);

  // Effect to synchronize video playback position with store's currentTime
  useEffect(() => {
    if (videoRef.current) {
      const delta = Math.abs(videoRef.current.currentTime - currentTime);
      if (delta > 1) {
        videoRef.current.currentTime = currentTime;
        videoRef.current.play();
      }
    }
  }, [currentTime]);

  useEffect(() => {
    setCurrentTime(0);
  }, [videoUrl, setCurrentTime]);

  return (
    <video
      ref={videoRef}
      onTimeUpdate={handleTimeUpdate}
      onSeeked={handleSeeked}
      controls
      poster={poster}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      className={videoContainer({ className })}
      onPlay={handlePlay}
      onPause={handlePause}
      onEnded={handleEnded}
    >
      {videoUrl && <source src={videoUrl} type={videoType || "video/mp4"} />}
      Your browser does not support the video tag.
    </video>
  );
};
