import { Metadata } from 'next';
import { api } from '@/lib/api';
import DramaCard from '@/components/drama/DramaCard';

interface GenreDetailPageProps {
    params: { slug: string };
}

export async function generateMetadata({ params }: GenreDetailPageProps): Promise<Metadata> {
    const genres = await api.getGenres();
    const genre = genres.find((g) => g.slug === params.slug);

    return {
        title: genre?.name || 'Genre',
        description: `Browse ${genre?.name || ''} dramas - Streaming drama Asia terlengkap`,
    };
}

export default async function GenreDetailPage({ params }: GenreDetailPageProps) {
    const [genres, dramasResponse] = await Promise.all([
        api.getGenres(),
        api.getDramasByGenre(params.slug),
    ]);

    const genre = genres.find((g) => g.slug === params.slug);
    const dramas = dramasResponse.data || [];

    return (
        <div className="min-h-screen py-8">
            <div className="container-main">
                {/* Header */}
                <div className="mb-8">
                    <nav className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-4">
                        <a href="/" className="hover:text-white transition-colors">Home</a>
                        <span>/</span>
                        <a href="/genre" className="hover:text-white transition-colors">Genre</a>
                        <span>/</span>
                        <span className="text-white">{genre?.name || params.slug}</span>
                    </nav>

                    <h1 className="text-3xl font-bold text-white mb-2">
                        {genre?.name || params.slug}
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        {dramas.length} drama tersedia
                    </p>
                </div>

                {/* Drama Grid */}
                {dramas.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {dramas.map((drama) => (
                            <DramaCard key={drama.id} drama={drama} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-[var(--text-secondary)]">No dramas found in this genre</p>
                    </div>
                )}
            </div>
        </div>
    );
}
