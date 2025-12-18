import { Metadata } from 'next';
import Link from 'next/link';
import { api } from '@/lib/api';

export const metadata: Metadata = {
    title: 'Browse by Country',
    description: 'Explore drama by country - Korea, China, Japan, Thailand, and more',
};

export default async function CountryPage() {
    const countries = await api.getCountries();

    return (
        <div className="min-h-screen py-8">
            <div className="container-main">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Browse by Country</h1>
                    <p className="text-[var(--text-secondary)]">
                        Explore drama berdasarkan negara asal
                    </p>
                </div>

                {/* Country Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {countries.map((country) => (
                        <Link
                            key={country.code}
                            href={`/country/${country.code}`}
                            className="group flex flex-col items-center p-6 rounded-xl bg-[var(--bg-secondary)] border border-white/5 transition-all duration-300 hover:border-[var(--primary)]/50 hover:bg-[var(--bg-tertiary)] hover:shadow-lg"
                        >
                            {/* Flag */}
                            <div className="text-5xl mb-3 transition-transform group-hover:scale-110">
                                {country.flag || '🏳️'}
                            </div>

                            {/* Name */}
                            <h3 className="text-lg font-semibold text-white group-hover:text-[var(--primary)] transition-colors text-center">
                                {country.name}
                            </h3>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
