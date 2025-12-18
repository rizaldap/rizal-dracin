'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import type { Episode } from '@/types/drama';
import { config } from '@/lib/config';
import { formatDuration } from '@/lib/utils';

interface VideoPlayerProps {
    episode: Episode;
    onEnded?: () => void;
    onTimeUpdate?: (currentTime: number) => void;
}

export default function VideoPlayer({
    episode,
    onEnded,
    onTimeUpdate,
    sourceUrl, // [NEW] Optional prop to override episode.streamUrl
}: VideoPlayerProps & { sourceUrl?: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [buffered, setBuffered] = useState(0);
    const [_currentSubtitle, setCurrentSubtitle] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null); // [NEW] Error state
    const controlsTimeoutRef = useRef<NodeJS.Timeout>();

    // Initialize HLS
    useEffect(() => {
        const video = videoRef.current;
        const urlToLoad = sourceUrl || episode.streamUrl; // [MODIFIED] Use sourceUrl if provided

        if (!video || !urlToLoad) return;

        // Reset error state
        // Reset error state
        setError(null);

        // Check if stream is HLS
        const isHls = urlToLoad.includes('.m3u8');

        if (isHls && Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
            });

            hls.loadSource(urlToLoad);
            hls.attachMedia(video);
            hlsRef.current = hls;

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(() => {
                    // Autoplay blocked, user must click to play
                });
            });

            // [NEW] Error handling
            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.error('HLS Network Error:', data);
                            hls.startLoad(); // Try to recover
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.error('HLS Media Error:', data);
                            hls.recoverMediaError(); // Try to recover
                            break;
                        default:
                            console.error('HLS Fatal Error:', data);
                            setError('Video stream unavailable. Please try another server.');
                            hls.destroy();
                            break;
                    }
                }
            });

            return () => {
                hls.destroy();
            };
        } else {
            // Native Playback (MP4 or HLS on Safari)
            video.src = urlToLoad;
            // Attempt to play
            video.play().catch(() => { });

            // [NEW] Native error handling
            video.onerror = () => {
                setError('Video playback error.');
            };
        }
    }, [episode.streamUrl, sourceUrl]);

    // Handle subtitles
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !episode.subtitles?.length) return;

        // Remove existing tracks
        while (video.textTracks.length > 0) {
            const track = video.textTracks[0];
            if (track.mode) track.mode = 'hidden';
        }

        // Add subtitle tracks
        episode.subtitles.forEach((sub) => {
            const track = document.createElement('track');
            track.kind = 'subtitles';
            track.label = sub.label;
            track.srclang = sub.language;
            track.src = sub.url;
            if (sub.default) {
                track.default = true;
                setCurrentSubtitle(sub.language);
            }
            video.appendChild(track);
        });
    }, [episode.subtitles]);

    // Video event handlers
    const handleTimeUpdate = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        setCurrentTime(video.currentTime);
        onTimeUpdate?.(video.currentTime);

        // Update buffered
        if (video.buffered.length > 0) {
            setBuffered(video.buffered.end(video.buffered.length - 1));
        }
    }, [onTimeUpdate]);

    const handleLoadedMetadata = () => {
        const video = videoRef.current;
        if (video) {
            setDuration(video.duration);
        }
    };

    // Control handlers
    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current;
        if (!video) return;

        const time = parseFloat(e.target.value);
        video.currentTime = time;
        setCurrentTime(time);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current;
        if (!video) return;

        const vol = parseFloat(e.target.value);
        video.volume = vol;
        setVolume(vol);
        setIsMuted(vol === 0);
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isMuted) {
            video.volume = volume || 1;
            video.muted = false;
            setIsMuted(false);
        } else {
            video.muted = true;
            setIsMuted(true);
        }
    };

    const toggleFullscreen = async () => {
        const container = containerRef.current;
        if (!container) return;

        if (!document.fullscreenElement) {
            await container.requestFullscreen();
            setIsFullscreen(true);
        } else {
            await document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const skip = (seconds: number) => {
        const video = videoRef.current;
        if (!video) return;

        video.currentTime = Math.min(Math.max(0, video.currentTime + seconds), video.duration);
    };

    const skipIntro = () => skip(config.player.skipIntroSeconds);
    const skipOutro = () => skip(config.player.skipOutroSeconds);

    // Show/hide controls
    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 3000);
    };

    // Progress percentage
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
    const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0;

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            {/* Error Overlay */}
            {error && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 text-white">
                    <svg className="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-lg font-medium">{error}</p>
                </div>
            )}

            {/* Video Element (existing code) */}
            <video
                // ...
                ref={videoRef}
                className="w-full h-full"
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={onEnded}
                playsInline
            />

            {/* Center Play Button (when paused) */}
            {!isPlaying && (
                <button
                    onClick={togglePlay}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[var(--primary)]/90 flex items-center justify-center hover:scale-110 transition-transform"
                >
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </button>
            )}

            {/* Controls Overlay */}
            <div
                className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 pointer-events-none ${showControls ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Skip Buttons */}
                <div className="absolute top-4 right-4 flex gap-2 pointer-events-auto">
                    <button
                        onClick={skipIntro}
                        className="px-3 py-1.5 rounded bg-white/10 backdrop-blur-sm text-white text-sm hover:bg-white/20 transition-colors"
                    >
                        Skip Intro
                    </button>
                </div>

                {/* Bottom Controls */}
                <div className="relative z-10 p-4 space-y-3 pointer-events-auto">
                    {/* Progress Bar */}
                    <div className="relative h-1 bg-white/20 rounded-full overflow-hidden group/progress cursor-pointer">
                        {/* Buffered */}
                        <div
                            className="absolute h-full bg-white/30 rounded-full"
                            style={{ width: `${bufferedPercent}%` }}
                        />
                        {/* Progress */}
                        <div
                            className="absolute h-full bg-[var(--primary)] rounded-full transition-all"
                            style={{ width: `${progressPercent}%` }}
                        />
                        {/* Seek Input */}
                        <input
                            type="range"
                            min={0}
                            max={duration || 100}
                            value={currentTime}
                            onChange={handleSeek}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {/* Hover Thumb */}
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--primary)] opacity-0 group-hover/progress:opacity-100 transition-opacity pointer-events-none"
                            style={{ left: `calc(${progressPercent}% - 6px)` }}
                        />
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {/* Play/Pause */}
                            <button onClick={togglePlay} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                {isPlaying ? (
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                )}
                            </button>

                            {/* Skip Back 10s */}
                            <button onClick={() => skip(-10)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                                </svg>
                            </button>

                            {/* Skip Forward 10s */}
                            <button onClick={() => skip(10)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                                </svg>
                            </button>

                            {/* Volume */}
                            <div className="flex items-center gap-2 group/volume">
                                <button onClick={toggleMute} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    {isMuted || volume === 0 ? (
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                                        </svg>
                                    )}
                                </button>
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.1}
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="w-0 group-hover/volume:w-20 transition-all opacity-0 group-hover/volume:opacity-100 accent-[var(--primary)]"
                                />
                            </div>

                            {/* Time Display */}
                            <span className="text-sm text-white">
                                {formatDuration(currentTime)} / {formatDuration(duration)}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Subtitle Toggle */}
                            {episode.subtitles && episode.subtitles.length > 0 && (
                                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                </button>
                            )}

                            {/* Skip Outro */}
                            <button
                                onClick={skipOutro}
                                className="px-3 py-1.5 rounded bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
                            >
                                Skip Outro
                            </button>

                            {/* Fullscreen */}
                            <button onClick={toggleFullscreen} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                {isFullscreen ? (
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
