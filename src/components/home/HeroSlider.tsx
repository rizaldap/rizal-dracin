'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Banner } from '@/types/drama';

interface HeroSliderProps {
    banners: Banner[];
}

export default function HeroSlider({ banners }: HeroSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, [banners.length]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 5000);
    };

    // Auto-play
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide]);

    if (!banners.length) return null;

    const currentBanner = banners[currentIndex];

    return (
        <section className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden bg-[var(--bg-secondary)]">
            {/* Slides */}
            <div className="absolute inset-0">
                {banners.map((banner, index) => (
                    <div
                        key={banner.id}
                        className={`absolute inset-0 transition-opacity duration-700 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <Image
                            src={banner.image}
                            alt={banner.title}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                        {/* Dark Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-primary)]/70 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="relative h-full container-main flex items-center">
                <div className="max-w-xl animate-fade-in" key={currentIndex}>
                    {/* Badge */}
                    {currentBanner.drama?.status && (
                        <span
                            className={`inline-block mb-4 px-3 py-1 rounded-full text-sm font-medium ${currentBanner.drama.status === 'ongoing'
                                    ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                                    : 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                                }`}
                        >
                            {currentBanner.drama.status === 'ongoing' ? '🔥 Ongoing' : '✅ Completed'}
                        </span>
                    )}

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                        {currentBanner.title}
                    </h1>

                    {/* Subtitle / Info */}
                    {currentBanner.subtitle && (
                        <p className="text-lg text-[var(--text-secondary)] mb-4">
                            {currentBanner.subtitle}
                        </p>
                    )}

                    {/* Drama Info */}
                    {currentBanner.drama && (
                        <div className="flex items-center gap-4 mb-6 text-sm text-[var(--text-secondary)]">
                            {/* Rating */}
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-white font-medium">{currentBanner.drama.rating}</span>
                            </div>

                            <span className="text-[var(--text-muted)]">•</span>
                            <span>{currentBanner.drama.year}</span>
                            <span className="text-[var(--text-muted)]">•</span>
                            <span>{currentBanner.drama.totalEpisodes} Episodes</span>
                            {currentBanner.drama.country && (
                                <>
                                    <span className="text-[var(--text-muted)]">•</span>
                                    <span>{currentBanner.drama.country.flag} {currentBanner.drama.country.name}</span>
                                </>
                            )}
                        </div>
                    )}

                    {/* Genres */}
                    {currentBanner.drama?.genres && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {currentBanner.drama.genres.slice(0, 3).map((genre) => (
                                <span
                                    key={genre.id}
                                    className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/10"
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <Link href={currentBanner.link} className="btn-primary">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            Watch Now
                        </Link>
                        <Link href={currentBanner.link} className="btn-secondary">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Detail
                        </Link>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity focus:opacity-100"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity focus:opacity-100"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'w-8 bg-[var(--primary)]'
                                : 'w-2 bg-white/30 hover:bg-white/50'
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}
