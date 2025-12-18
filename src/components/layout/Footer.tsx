import Link from 'next/link';

const footerLinks = {
    browse: [
        { label: 'Trending', href: '/genre/trending' },
        { label: 'Latest Update', href: '/genre/latest' },
        { label: 'Popular', href: '/genre/popular' },
        { label: 'Top Rated', href: '/genre/top-rated' },
    ],
    genres: [
        { label: 'Romance', href: '/genre/romance' },
        { label: 'Action', href: '/genre/action' },
        { label: 'Comedy', href: '/genre/comedy' },
        { label: 'Thriller', href: '/genre/thriller' },
    ],
    countries: [
        { label: 'Korea', href: '/country/KR' },
        { label: 'China', href: '/country/CN' },
        { label: 'Japan', href: '/country/JP' },
        { label: 'Thailand', href: '/country/TH' },
    ],
    legal: [
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'DMCA', href: '/dmca' },
        { label: 'Contact', href: '/contact' },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-[var(--bg-secondary)] border-t border-white/5 mt-16">
            <div className="container-main py-12">
                {/* Top Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-4 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-lg bg-[var(--primary)] flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-white">
                                Rizal<span className="text-[var(--primary)]">Dracin</span>
                            </span>
                        </Link>
                        <p className="text-sm text-[var(--text-secondary)] mb-4">
                            Streaming drama Asia terlengkap dengan kualitas terbaik. Nonton gratis tanpa iklan yang mengganggu.
                        </p>
                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            <a href="#" className="w-9 h-9 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-card)] transition-all">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                </svg>
                            </a>
                            <a href="#" className="w-9 h-9 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-card)] transition-all">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a href="#" className="w-9 h-9 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-card)] transition-all">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.47 2H3.53a1.45 1.45 0 0 0-1.47 1.43v17.14A1.45 1.45 0 0 0 3.53 22h16.94a1.45 1.45 0 0 0 1.47-1.43V3.43A1.45 1.45 0 0 0 20.47 2zM8.09 18.74h-3v-9h3v9zM6.59 8.48a1.56 1.56 0 1 1 0-3.12 1.57 1.57 0 1 1 0 3.12zm12.32 10.26h-3v-4.83c0-1.21-.43-2-1.52-2A1.65 1.65 0 0 0 12.85 13a2 2 0 0 0-.1.73v5h-3v-9h3V11a3 3 0 0 1 2.71-1.5c2 0 3.45 1.29 3.45 4.06v5.18z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Browse */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Browse</h3>
                        <ul className="space-y-2">
                            {footerLinks.browse.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Genres */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Genres</h3>
                        <ul className="space-y-2">
                            {footerLinks.genres.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Countries */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Countries</h3>
                        <ul className="space-y-2">
                            {footerLinks.countries.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Legal</h3>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-[var(--text-muted)]">
                        © {new Date().getFullYear()} RizalDracin. All rights reserved.
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">
                        Made with ❤️ for drama lovers
                    </p>
                </div>
            </div>
        </footer>
    );
}
