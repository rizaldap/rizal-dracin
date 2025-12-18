import { Metadata } from 'next';
import Link from 'next/link';
import { api } from '@/lib/api';

export const metadata: Metadata = {
    title: 'Browse by Genre',
    description: 'Explore drama by genre - Romance, Action, Comedy, Thriller, and more',
};

export default async function GenrePage() {
    const genres = await api.getGenres();

    return (
        <div className="min-h-screen py-8">
            <div className="container-main">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Browse by Genre</h1>
                    <p className="text-[var(--text-secondary)]">
                        Explore drama berdasarkan genre favoritmu
                    </p>
                </div>

                {/* Genre Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {genres.map((genre) => (
                        <Link
                            key={genre.id}
                            href={`/genre/${genre.slug}`}
                            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)] p-6 border border-white/5 transition-all duration-300 hover:border-[var(--primary)]/50 hover:shadow-[var(--shadow-glow)]"
                        >
                            {/* Background Decoration */}
                            <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-[var(--primary)]/5 group-hover:bg-[var(--primary)]/10 transition-colors" />
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-[var(--primary)]/5 group-hover:bg-[var(--primary)]/10 transition-colors" />

                            {/* Content */}
                            <div className="relative">
                                <h3 className="text-lg font-semibold text-white group-hover:text-[var(--primary)] transition-colors">
                                    {genre.name}
                                </h3>
                                {genre.count !== undefined && (
                                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                                        {genre.count} titles
                                    </p>
                                )}
                            </div>

                            {/* Arrow */}
                            <svg
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
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
        </div>
    );
}
