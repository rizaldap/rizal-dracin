'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import VideoPlayer from '@/components/player/VideoPlayer';
import type { Drama, Episode } from '@/types/drama';

interface WatchViewProps {
    drama: Drama;
    episode: Episode;
    prevEpisode: Episode | null;
    nextEpisode: Episode | null;
}

export default function WatchView({ drama, episode, prevEpisode, nextEpisode }: WatchViewProps) {
    const [selectedServer, setSelectedServer] = useState(
        episode.servers && episode.servers.length > 0 ? episode.servers[0] : null
    );

    // Update selected server when episode changes
    useEffect(() => {
        if (episode.servers && episode.servers.length > 0) {
            setSelectedServer(episode.servers[0]);
        } else {
            setSelectedServer(null);
        }
    }, [episode.id, episode.servers]);

    const currentStreamUrl = selectedServer?.url || episode.streamUrl;

    return (
        <div className="flex-1">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-4">
                <Link href="/" className="hover:text-white transition-colors">
                    Home
                </Link>
                <span>/</span>
                <Link href={`/drama/${drama.slug}`} className="hover:text-white transition-colors">
                    {drama.title}
                </Link>
                <span>/</span>
                <span className="text-white">Episode {episode.number}</span>
            </div>

            {/* Video Player */}
            <VideoPlayer episode={episode} sourceUrl={currentStreamUrl} />

            {/* Episode Navigation */}
            <div className="flex items-center justify-between mt-4">
                {prevEpisode ? (
                    <Link
                        href={`/watch/${drama.slug}/${prevEpisode.id}`}
                        className="btn-secondary"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Prev Episode
                    </Link>
                ) : (
                    <div />
                )}

                {nextEpisode ? (
                    <Link
                        href={`/watch/${drama.slug}/${nextEpisode.id}`}
                        className="btn-primary"
                    >
                        Next Episode
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                ) : (
                    <div />
                )}
            </div>

            {/* Episode Info */}
            <div className="mt-6 p-4 rounded-xl bg-[var(--bg-secondary)]">
                <div className="flex items-start gap-4">
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-white mb-1">
                            {drama.title}
                        </h1>
                        <p className="text-[var(--text-secondary)]">
                            Episode {episode.number} {episode.title && `- ${episode.title}`}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <button className="btn-ghost">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                        <button className="btn-ghost">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                        </button>
                        <a
                            href={episode.streamUrl}
                            download
                            className="btn-ghost"
                            title="Download"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Server Selection */}
                {episode.servers && episode.servers.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-sm text-[var(--text-secondary)] mb-2">Select Server:</p>
                        <div className="flex flex-wrap gap-2">
                            {episode.servers.map((server) => (
                                <button
                                    key={server.id}
                                    onClick={() => setSelectedServer(server)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedServer?.id === server.id
                                        ? 'bg-[var(--primary)] text-white'
                                        : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-white'
                                        }`}
                                >
                                    {server.name} {server.quality && `(${server.quality})`}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
