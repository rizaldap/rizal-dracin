'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { SearchResult } from '@/types/drama';

/* eslint-disable @typescript-eslint/no-explicit-any */
function SearchPageContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Debounced search for suggestions
    const fetchSuggestions = useCallback((q: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (q.length < 2) {
            setSuggestions([]);
            return;
        }

        timeoutRef.current = setTimeout(async () => {
            try {
                // Use local API proxy to avoid CORS issues
                const response = await fetch(`/api/search?query=${encodeURIComponent(q)}`);
                const data = await response.json();

                if (Array.isArray(data)) {
                    const results = data.slice(0, 5).map((b: any) => ({
                        id: b.bookId,
                        title: b.bookName,
                        slug: b.bookId,
                        poster: b.cover || b.coverWap || '',
                        type: 'drama' as const,
                        year: 2024,
                        rating: 0,
                    }));
                    setSuggestions(results);
                } else {
                    setSuggestions([]);
                }
            } catch {
                setSuggestions([]);
            }
        }, 300);
    }, []);

    // Full search
    const handleSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        setShowSuggestions(false);

        try {
            // Use local API proxy to avoid CORS issues
            const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();

            if (Array.isArray(data)) {
                const results = data.map((b: any) => ({
                    id: b.bookId,
                    title: b.bookName,
                    slug: b.bookId,
                    poster: b.cover || b.coverWap || '',
                    type: 'drama' as const,
                    year: 2024,
                    rating: 0,
                }));
                setResults(results);
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        fetchSuggestions(value);
        setShowSuggestions(true);
    };

    // Handle form submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(query);
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion: SearchResult) => {
        setQuery(suggestion.title);
        setShowSuggestions(false);
        handleSearch(suggestion.title);
    };

    // Initial search from URL
    useEffect(() => {
        if (initialQuery) {
            handleSearch(initialQuery);
        }
    }, [initialQuery]);

    return (
        <div className="min-h-screen py-8">
            <div className="container-main">
                {/* Search Header */}
                <div className="max-w-2xl mx-auto mb-12">
                    <h1 className="text-3xl font-bold text-white text-center mb-6">
                        Search Drama
                    </h1>

                    {/* Search Form */}
                    <form onSubmit={handleSubmit} className="relative">
                        <div className="relative">
                            <input
                                type="text"
                                value={query}
                                onChange={handleInputChange}
                                onFocus={() => setShowSuggestions(true)}
                                placeholder="Search drama, actor, genre..."
                                className="w-full px-5 py-4 pl-12 rounded-xl bg-[var(--bg-secondary)] border border-white/10 text-white placeholder-[var(--text-muted)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all text-lg"
                            />
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            {query && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setQuery('');
                                        setResults([]);
                                        setSuggestions([]);
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-[var(--text-muted)] hover:text-white transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Autocomplete Suggestions */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-secondary)] border border-white/10 rounded-xl overflow-hidden shadow-xl z-50">
                                {suggestions.map((suggestion) => (
                                    <button
                                        key={suggestion.id}
                                        type="button"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-[var(--bg-tertiary)] transition-colors text-left"
                                    >
                                        <div className="relative w-10 h-14 rounded overflow-hidden flex-shrink-0">
                                            <Image
                                                src={suggestion.poster}
                                                alt={suggestion.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{suggestion.title}</p>
                                            <p className="text-sm text-[var(--text-secondary)]">{suggestion.year}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </form>
                </div>

                {/* Results */}
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="aspect-[2/3] rounded-lg skeleton" />
                                <div className="h-4 rounded skeleton w-3/4" />
                                <div className="h-3 rounded skeleton w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : results.length > 0 ? (
                    <>
                        <p className="text-[var(--text-secondary)] mb-6">
                            Found {results.length} results for &quot;{query}&quot;
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {results.map((result) => (
                                <Link
                                    key={result.id}
                                    href={`/drama/${result.slug}`}
                                    className="drama-card group"
                                >
                                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                                        <Image
                                            src={result.poster}
                                            alt={result.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center">
                                                <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                                            {result.title}
                                        </h3>
                                        <p className="text-xs text-[var(--text-secondary)] mt-1">{result.year}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                ) : query && !isLoading ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">No results found</h2>
                        <p className="text-[var(--text-secondary)]">
                            Try searching with different keywords
                        </p>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">Start searching</h2>
                        <p className="text-[var(--text-secondary)]">
                            Type to search for your favorite drama
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen py-8 flex items-center justify-center">
                <div className="text-white">Loading search...</div>
            </div>
        }>
            <SearchPageContent />
        </Suspense>
    );
}
