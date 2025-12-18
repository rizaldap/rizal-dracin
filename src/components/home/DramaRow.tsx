import Link from 'next/link';
import DramaCard from '@/components/drama/DramaCard';
import type { Drama } from '@/types/drama';

interface DramaRowProps {
    title: string;
    dramas: Drama[];
    viewAllLink?: string;
    showRank?: boolean;
}

export default function DramaRow({
    title,
    dramas,
    viewAllLink,
    showRank = false,
}: DramaRowProps) {
    return (
        <section className="py-8">
            <div className="container-main">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="section-title">{title}</h2>
                    {viewAllLink && (
                        <Link
                            href={viewAllLink}
                            className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors flex items-center gap-1"
                        >
                            View All
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    )}
                </div>

                {/* Horizontal Scroll Row */}
                <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
                    <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 sm:px-6 lg:px-8 pb-4">
                        {dramas.map((drama, index) => (
                            <DramaCard
                                key={drama.id}
                                drama={drama}
                                showRank={showRank ? index + 1 : undefined}
                            />
                        ))}
                    </div>

                    {/* Fade edges */}
                    <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-[var(--bg-primary)] to-transparent pointer-events-none" />
                    <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-[var(--bg-primary)] to-transparent pointer-events-none" />
                </div>
            </div>
        </section>
    );
}
