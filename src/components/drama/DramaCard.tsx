import Image from 'next/image';
import Link from 'next/link';
import type { Drama } from '@/types/drama';

interface DramaCardProps {
    drama: Drama;
    showRank?: number;
    showBadge?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export default function DramaCard({
    drama,
    showRank,
    showBadge = true,
    size = 'md',
}: DramaCardProps) {
    const sizeClasses = {
        sm: 'w-[120px]',
        md: 'w-[150px] sm:w-[180px]',
        lg: 'w-[180px] sm:w-[220px]',
    };

    return (
        <Link
            href={`/drama/${drama.slug}`}
            className={`drama-card group flex-shrink-0 ${sizeClasses[size]}`}
        >
            {/* Poster */}
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                <Image
                    src={drama.poster}
                    alt={drama.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 120px, (max-width: 768px) 150px, 180px"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Rank Badge */}
                {showRank && (
                    <div className="absolute top-2 left-2 w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {showRank}
                    </div>
                )}

                {/* Status Badge */}
                {showBadge && drama.status && (
                    <div className="absolute top-2 right-2">
                        <span
                            className={`text-xs px-2 py-1 rounded font-medium ${drama.status === 'ongoing'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-blue-600 text-white'
                                }`}
                        >
                            {drama.status === 'ongoing' ? 'Ongoing' : 'End'}
                        </span>
                    </div>
                )}

                {/* Rating */}
                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-black/60 backdrop-blur-sm">
                        <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs text-white font-medium">{drama.rating}</span>
                    </div>
                </div>

                {/* Play Icon on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                        <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="p-2">
                <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                    {drama.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[var(--text-secondary)]">{drama.year}</span>
                    {drama.currentEpisode && (
                        <>
                            <span className="text-[var(--text-muted)]">•</span>
                            <span className="text-xs text-[var(--text-secondary)]">
                                Ep {drama.currentEpisode}/{drama.totalEpisodes}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
}
