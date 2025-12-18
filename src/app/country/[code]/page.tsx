import { Metadata } from 'next';
import { api } from '@/lib/api';
import DramaCard from '@/components/drama/DramaCard';

interface CountryDetailPageProps {
    params: { code: string };
}

export async function generateMetadata({ params }: CountryDetailPageProps): Promise<Metadata> {
    const countries = await api.getCountries();
    const country = countries.find((c) => c.code === params.code);

    return {
        title: country?.name || 'Country',
        description: `Browse ${country?.name || ''} dramas - Streaming drama Asia terlengkap`,
    };
}

export default async function CountryDetailPage({ params }: CountryDetailPageProps) {
    const [countries, dramasResponse] = await Promise.all([
        api.getCountries(),
        api.getDramasByCountry(params.code),
    ]);

    const country = countries.find((c) => c.code === params.code);
    const dramas = dramasResponse.data || [];

    return (
        <div className="min-h-screen py-8">
            <div className="container-main">
                {/* Header */}
                <div className="mb-8">
                    <nav className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-4">
                        <a href="/" className="hover:text-white transition-colors">Home</a>
                        <span>/</span>
                        <a href="/country" className="hover:text-white transition-colors">Country</a>
                        <span>/</span>
                        <span className="text-white">{country?.name || params.code}</span>
                    </nav>

                    <div className="flex items-center gap-4">
                        <span className="text-5xl">{country?.flag || '🏳️'}</span>
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                {country?.name || params.code}
                            </h1>
                            <p className="text-[var(--text-secondary)]">
                                {dramas.length} drama tersedia
                            </p>
                        </div>
                    </div>
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
                        <p className="text-[var(--text-secondary)]">No dramas found from this country</p>
                    </div>
                )}
            </div>
        </div>
    );
}
