import Image from 'next/image';
import Link from 'next/link';
import type { Drama } from '@/types/drama';

interface TopRankingProps {
    title: string;
    dramas: Drama[];
    type: 'today' | 'week';
}

export default function TopRanking({ title, dramas, type }: TopRankingProps) {
    const topDramas = dramas.slice(0, 10);

    return (
        <section className="py-8">
            <div className="container-main">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="section-title">{title}</h2>
                    <Link
                        href={`/ranking/${type}`}
                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors flex items-center gap-1"
                    >
                        View All
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                    {topDramas.map((drama, index) => (
                        <Link
                            key={drama.id}
                            href={`/drama/${drama.slug}`}
                            className="group flex items-center gap-4 p-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-all duration-300"
                        >
                            {/* Rank Number */}
                            <div
                                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg ${index < 3
                                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black'
                                        : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                                    }`}
                            >
                                {index + 1}
                            </div>

                            {/* Poster */}
                            <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                    src={drama.poster}
                                    alt={drama.title}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-110"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-white line-clamp-1 group-hover:text-[var(--primary)] transition-colors">
                                    {drama.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-secondary)]">
                                    <div className="flex items-center gap-1">
                                        <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span>{drama.rating}</span>
                                    </div>
                                    <span className="text-[var(--text-muted)]">•</span>
                                    <span>{drama.year}</span>
                                    <span className="text-[var(--text-muted)]">•</span>
                                    <span>
                                        {drama.status === 'ongoing'
                                            ? `Ep ${drama.currentEpisode}`
                                            : `${drama.totalEpisodes} Eps`}
                                    </span>
                                </div>
                            </div>

                            {/* Arrow */}
                            <svg
                                className="w-5 h-5 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
