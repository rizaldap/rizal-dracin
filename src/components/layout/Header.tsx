'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/genre', label: 'Genre' },
        { href: '/country', label: 'Country' },
        { href: '/search', label: 'Search' },
    ];

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-white/5">
            <div className="container-main">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-lg bg-[var(--primary)] flex items-center justify-center transition-transform group-hover:scale-110">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-white hidden sm:block">
                            Rizal<span className="text-[var(--primary)]">Dracin</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive(link.href)
                                        ? 'text-white bg-[var(--bg-tertiary)]'
                                        : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-tertiary)]'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2">
                        {/* Search Button (Desktop) */}
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-white transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className="text-sm">Search drama...</span>
                            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 ml-2 text-xs bg-[var(--bg-tertiary)] rounded">⌘K</kbd>
                        </button>

                        {/* Mobile Search Link */}
                        <Link
                            href="/search"
                            className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-tertiary)] transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-tertiary)] transition-all"
                        >
                            {isMenuOpen ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-[var(--bg-secondary)] border-b border-white/5">
                    <nav className="container-main py-4 flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={`px-4 py-3 rounded-lg font-medium transition-all ${isActive(link.href)
                                        ? 'text-white bg-[var(--bg-tertiary)]'
                                        : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-tertiary)]'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}

            {/* Search Modal (Desktop) */}
            {isSearchOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20"
                    onClick={() => setIsSearchOpen(false)}
                >
                    <div
                        className="w-full max-w-xl mx-4 bg-[var(--bg-secondary)] rounded-xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 p-4 border-b border-white/10">
                            <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search drama, actor, genre..."
                                className="flex-1 bg-transparent text-white placeholder-[var(--text-muted)] outline-none text-lg"
                                autoFocus
                            />
                            <kbd className="px-2 py-1 text-xs text-[var(--text-secondary)] bg-[var(--bg-tertiary)] rounded">ESC</kbd>
                        </div>
                        <div className="p-4 text-center text-[var(--text-secondary)]">
                            <p>Type to search...</p>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
