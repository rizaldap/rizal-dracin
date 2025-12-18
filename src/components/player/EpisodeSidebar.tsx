import Image from 'next/image';
import Link from 'next/link';
import type { Episode } from '@/types/drama';
import { formatDuration } from '@/lib/utils';

interface EpisodeSidebarProps {
    episodes: Episode[];
    currentEpisodeId: string;
    dramaTitle: string;
}

export default function EpisodeSidebar({
    episodes,
    currentEpisodeId,
    dramaTitle,
}: EpisodeSidebarProps) {
    return (
        <div className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden h-fit lg:max-h-[calc(100vh-160px)] lg:sticky lg:top-24">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
                <h2 className="font-semibold text-white">Episodes</h2>
                <p className="text-sm text-[var(--text-secondary)]">{dramaTitle}</p>
            </div>

            {/* Episode List */}
            <div className="max-h-[400px] lg:max-h-[500px] overflow-y-auto">
                {episodes.map((episode) => {
                    const isCurrent = episode.id === currentEpisodeId;

                    return (
                        <Link
                            key={episode.id}
                            href={`/watch/${episode.dramaId}/${episode.id}`}
                            className={`flex items-center gap-3 p-3 border-b border-white/5 transition-all ${isCurrent
                                ? 'bg-[var(--primary)]/10 border-l-2 border-l-[var(--primary)]'
                                : 'hover:bg-[var(--bg-tertiary)]'
                                }`}
                        >
                            {/* Thumbnail */}
                            <div className="relative w-24 aspect-video rounded overflow-hidden flex-shrink-0">
                                {episode.thumbnail ? (
                                    <Image
                                        src={episode.thumbnail}
                                        alt={`Episode ${episode.number}`}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[var(--bg-tertiary)] flex items-center justify-center">
                                        <span className="text-lg font-bold text-[var(--text-muted)]">
                                            {episode.number}
                                        </span>
                                    </div>
                                )}

                                {/* Duration */}
                                {episode.duration > 0 && (
                                    <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/70 text-[10px] text-white">
                                        {formatDuration(episode.duration)}
                                    </div>
                                )}

                                {/* Playing Indicator */}
                                {isCurrent && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <div className="flex gap-0.5">
                                            <span className="w-1 h-3 bg-[var(--primary)] rounded animate-pulse" />
                                            <span className="w-1 h-3 bg-[var(--primary)] rounded animate-pulse delay-75" />
                                            <span className="w-1 h-3 bg-[var(--primary)] rounded animate-pulse delay-150" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p
                                    className={`font-medium line-clamp-1 ${isCurrent ? 'text-[var(--primary)]' : 'text-white'
                                        }`}
                                >
                                    Episode {episode.number}
                                </p>
                                {episode.title && (
                                    <p className="text-sm text-[var(--text-secondary)] line-clamp-1">
                                        {episode.title}
                                    </p>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
