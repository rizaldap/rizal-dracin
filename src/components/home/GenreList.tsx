import Link from 'next/link';
import type { Genre } from '@/types/drama';

interface GenreListProps {
    genres: Genre[];
}

export default function GenreList({ genres }: GenreListProps) {
    return (
        <section className="py-8">
            <div className="container-main">
                <h2 className="section-title">Browse by Genre</h2>

                <div className="flex flex-wrap gap-2 sm:gap-3">
                    {genres.map((genre) => (
                        <Link
                            key={genre.id}
                            href={`/genre/${genre.slug}`}
                            className="group px-4 py-2 rounded-full bg-[var(--bg-tertiary)] border border-white/5 text-[var(--text-secondary)] text-sm font-medium transition-all duration-300 hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] hover:shadow-[var(--shadow-glow)]"
                        >
                            <span>{genre.name}</span>
                            {genre.count && (
                                <span className="ml-2 text-xs opacity-60 group-hover:opacity-100">
                                    ({genre.count})
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
