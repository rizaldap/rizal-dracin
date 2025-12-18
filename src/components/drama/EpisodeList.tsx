import Image from 'next/image';
import Link from 'next/link';
import type { Episode } from '@/types/drama';
import { formatDuration } from '@/lib/utils';

interface EpisodeListProps {
    episodes: Episode[];
    dramaSlug: string;
    currentEpisodeId?: string;
}

export default function EpisodeList({
    episodes,
    dramaSlug,
    currentEpisodeId,
}: EpisodeListProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {episodes.map((episode) => {
                const isCurrent = episode.id === currentEpisodeId;

                return (
                    <Link
                        key={episode.id}
                        href={`/watch/${dramaSlug}/${episode.id}`}
                        className={`group relative rounded-lg overflow-hidden transition-all duration-300 ${isCurrent
                            ? 'ring-2 ring-[var(--primary)] scale-[1.02]'
                            : 'hover:ring-2 hover:ring-white/20'
                            }`}
                    >
                        {/* Thumbnail */}
                        <div className="relative aspect-video bg-[var(--bg-tertiary)]">
                            {episode.thumbnail ? (
                                <Image
                                    src={episode.thumbnail}
                                    alt={`Episode ${episode.number}`}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)]">
                                    <span className="text-2xl font-bold text-[var(--text-muted)]">
                                        {episode.number}
                                    </span>
                                </div>
                            )}

                            {/* Play Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Duration Badge */}
                            {episode.duration > 0 && (
                                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-xs text-white">
                                    {formatDuration(episode.duration)}
                                </div>
                            )}

                            {/* Current Playing Indicator */}
                            {isCurrent && (
                                <div className="absolute top-1 left-1 px-2 py-0.5 rounded bg-[var(--primary)] text-xs text-white font-medium">
                                    Playing
                                </div>
                            )}
                        </div>

                        {/* Episode Info */}
                        <div className="p-2 bg-[var(--bg-secondary)]">
                            <p className="text-sm font-medium text-white line-clamp-1">
                                Episode {episode.number}
                            </p>
                            {episode.title && (
                                <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
                                    {episode.title}
                                </p>
                            )}
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
