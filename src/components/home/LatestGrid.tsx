import Image from 'next/image';
import Link from 'next/link';
import type { LatestUpdate } from '@/types/drama';
import { formatRelativeTime, getEpisodeLabel } from '@/lib/utils';

interface LatestGridProps {
    updates: LatestUpdate[];
}

export default function LatestGrid({ updates }: LatestGridProps) {
    return (
        <section className="py-8">
            <div className="container-main">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="section-title">Latest Updates</h2>
                    <Link
                        href="/latest"
                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors flex items-center gap-1"
                    >
                        View All
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {updates.map((update) => (
                        <Link
                            key={update.drama.id}
                            href={`/watch/${update.drama.id}/${update.episode.id}`}
                            className="drama-card group"
                        >
                            {/* Poster */}
                            <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                                <Image
                                    src={update.drama.poster}
                                    alt={update.drama.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                                {/* Episode Badge */}
                                <div className="absolute top-2 left-2">
                                    <span className="px-2 py-1 rounded bg-[var(--primary)] text-white text-xs font-medium">
                                        {getEpisodeLabel(update.episode.number)}
                                    </span>
                                </div>

                                {/* Time Badge */}
                                <div className="absolute top-2 right-2">
                                    <span className="px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-white text-xs">
                                        {formatRelativeTime(update.updatedAt)}
                                    </span>
                                </div>

                                {/* Play Button */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-12 h-12 rounded-full bg-[var(--primary)]/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                        <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Bottom Info */}
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <h3 className="text-sm font-medium text-white line-clamp-2 mb-1 group-hover:text-[var(--primary)] transition-colors">
                                        {update.drama.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                                        <div className="flex items-center gap-1">
                                            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span>{update.drama.rating}</span>
                                        </div>
                                        <span className="text-[var(--text-muted)]">•</span>
                                        <span>{update.drama.country?.flag}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
