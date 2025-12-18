import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import DramaCard from '@/components/drama/DramaCard';
import EpisodeList from '@/components/drama/EpisodeList';

interface DramaPageProps {
    params: { slug: string };
}

export async function generateMetadata({ params }: DramaPageProps): Promise<Metadata> {
    const drama = await api.getDrama(params.slug);

    return {
        title: drama.title,
        description: drama.synopsis?.slice(0, 160),
        openGraph: {
            title: drama.title,
            description: drama.synopsis?.slice(0, 160),
            images: [drama.poster],
        },
    };
}

export default async function DramaPage({ params }: DramaPageProps) {
    const [drama, episodes, related] = await Promise.all([
        api.getDrama(params.slug),
        api.getEpisodes(params.slug),
        api.getRelated(params.slug),
    ]);

    return (
        <div className="min-h-screen">
            {/* Hero Banner */}
            <section className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
                <Image
                    src={drama.backdrop || drama.poster}
                    alt={drama.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />
            </section>

            {/* Main Content */}
            <div className="container-main -mt-48 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Poster */}
                    <div className="flex-shrink-0">
                        <div className="relative w-48 sm:w-56 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl mx-auto lg:mx-0">
                            <Image
                                src={drama.poster}
                                alt={drama.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="flex-1">
                        {/* Status Badge */}
                        <span
                            className={`inline-block mb-3 px-3 py-1 rounded-full text-sm font-medium ${drama.status === 'ongoing'
                                ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                                : 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                                }`}
                        >
                            {drama.status === 'ongoing' ? '🔥 Ongoing' : '✅ Completed'}
                        </span>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                            {drama.title}
                        </h1>
                        {drama.originalTitle && (
                            <p className="text-lg text-[var(--text-secondary)] mb-4">
                                {drama.originalTitle}
                            </p>
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-[var(--text-secondary)]">
                            <div className="flex items-center gap-1.5">
                                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-white font-semibold text-lg">{drama.rating}</span>
                            </div>
                            <span className="text-[var(--text-muted)]">•</span>
                            <span>{drama.year}</span>
                            <span className="text-[var(--text-muted)]">•</span>
                            <span>{drama.totalEpisodes} Episodes</span>
                            {drama.country && (
                                <>
                                    <span className="text-[var(--text-muted)]">•</span>
                                    <span>{drama.country.flag} {drama.country.name}</span>
                                </>
                            )}
                        </div>

                        {/* Genres */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {drama.genres.map((genre) => (
                                <Link
                                    key={genre.id}
                                    href={`/genre/${genre.slug}`}
                                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--primary)] hover:text-white transition-all"
                                >
                                    {genre.name}
                                </Link>
                            ))}
                        </div>

                        {/* Synopsis */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-white mb-2">Synopsis</h2>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                {drama.synopsis}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                            {episodes.length > 0 && (
                                <Link
                                    href={`/watch/${drama.id}/${episodes[0].id}`}
                                    className="btn-primary"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                    Watch Now
                                </Link>
                            )}
                            <button className="btn-secondary">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                Add to List
                            </button>
                            <button className="btn-ghost">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                Share
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cast Section */}
                {drama.cast && drama.cast.length > 0 && (
                    <section className="mt-12">
                        <h2 className="section-title">Cast</h2>
                        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
                            {drama.cast.map((member) => (
                                <div key={member.id} className="flex-shrink-0 text-center">
                                    <div className="w-20 h-20 rounded-full bg-[var(--bg-tertiary)] overflow-hidden mb-2">
                                        {member.photo ? (
                                            <Image
                                                src={member.photo}
                                                alt={member.name}
                                                width={80}
                                                height={80}
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl text-[var(--text-muted)]">
                                                👤
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm font-medium text-white line-clamp-1 w-20">{member.name}</p>
                                    <p className="text-xs text-[var(--text-secondary)] line-clamp-1 w-20">{member.role}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Episodes Section */}
                <section className="mt-12">
                    <h2 className="section-title">Episodes</h2>
                    <EpisodeList episodes={episodes} dramaSlug={drama.slug} />
                </section>

                {/* Related Dramas */}
                {related && related.length > 0 && (
                    <section className="mt-12">
                        <h2 className="section-title">You May Also Like</h2>
                        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
                            {related.map((relatedDrama) => (
                                <DramaCard key={relatedDrama.id} drama={relatedDrama} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
