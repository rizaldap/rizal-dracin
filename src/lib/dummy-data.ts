import type {
    Drama,
    Episode,
    Genre,
    Country,
    HomeData,
    SearchResult,
    Banner,
    LatestUpdate,
    PaginatedResponse,
} from '@/types/drama';

// Dummy poster images (using placeholder service)
const POSTER_BASE = 'https://picsum.photos/seed';

// Generate dummy dramas
const generateDrama = (id: number): Drama => ({
    id: `drama-${id}`,
    slug: `drama-title-${id}`,
    title: [
        'Love in the Moonlight',
        'My Love from the Star',
        'Crash Landing on You',
        'Goblin: The Lonely Guardian',
        'Descendants of the Sun',
        'Reply 1988',
        'It\'s Okay to Not Be Okay',
        'Vincenzo',
        'Squid Game',
        'All of Us Are Dead',
        'Sweet Home',
        'The Glory',
        'Business Proposal',
        'Twenty-Five Twenty-One',
        'Extraordinary Attorney Woo',
    ][id % 15],
    originalTitle: `드라마 ${id}`,
    poster: `${POSTER_BASE}/drama${id}/300/450`,
    backdrop: `${POSTER_BASE}/bg${id}/1280/720`,
    synopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    rating: Number((7 + Math.random() * 3).toFixed(1)),
    views: Math.floor(Math.random() * 1000000) + 100000,
    genres: [
        { id: 'romance', slug: 'romance', name: 'Romance' },
        { id: 'drama', slug: 'drama', name: 'Drama' },
    ],
    country: { code: 'KR', name: 'Korea', flag: '🇰🇷' },
    year: 2023 + (id % 3) - 1,
    status: id % 3 === 0 ? 'ongoing' : 'completed',
    totalEpisodes: 16 + (id % 10) * 2,
    currentEpisode: id % 3 === 0 ? 8 + (id % 8) : undefined,
    cast: [
        { id: 'cast-1', name: 'Park Seo-joon', role: 'Lead Actor' },
        { id: 'cast-2', name: 'Kim Da-mi', role: 'Lead Actress' },
        { id: 'cast-3', name: 'Lee Dong-wook', role: 'Supporting' },
    ],
    director: 'Kim Eun-sook',
    releaseDate: '2024-01-15',
    updatedAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
});

// Generate episodes
const generateEpisodes = (dramaId: string, count: number): Episode[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: `${dramaId}-ep-${i + 1}`,
        dramaId,
        number: i + 1,
        title: `Episode ${i + 1}`,
        thumbnail: `${POSTER_BASE}/ep${i}/400/225`,
        duration: 3600 + Math.floor(Math.random() * 1200), // 60-80 minutes
        streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', // Test HLS stream
        servers: [
            { id: 'server-1', name: 'Server 1', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls' as const, quality: '720p' },
            { id: 'server-2', name: 'Server 2', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls' as const, quality: '1080p' },
        ],
        subtitles: [
            { id: 'sub-id', language: 'id', label: 'Indonesia', url: '/subtitles/sample.vtt', default: true },
            { id: 'sub-en', language: 'en', label: 'English', url: '/subtitles/sample-en.vtt' },
        ],
        releaseDate: new Date(Date.now() - (count - i) * 86400000 * 7).toISOString(),
    }));
};

// Dummy genres
const genres: Genre[] = [
    { id: 'romance', slug: 'romance', name: 'Romance', count: 245 },
    { id: 'action', slug: 'action', name: 'Action', count: 189 },
    { id: 'comedy', slug: 'comedy', name: 'Comedy', count: 156 },
    { id: 'thriller', slug: 'thriller', name: 'Thriller', count: 134 },
    { id: 'fantasy', slug: 'fantasy', name: 'Fantasy', count: 98 },
    { id: 'historical', slug: 'historical', name: 'Historical', count: 87 },
    { id: 'horror', slug: 'horror', name: 'Horror', count: 65 },
    { id: 'mystery', slug: 'mystery', name: 'Mystery', count: 112 },
    { id: 'slice-of-life', slug: 'slice-of-life', name: 'Slice of Life', count: 78 },
    { id: 'medical', slug: 'medical', name: 'Medical', count: 45 },
];

// Dummy countries
const countries: Country[] = [
    { code: 'KR', name: 'Korea', flag: '🇰🇷' },
    { code: 'CN', name: 'China', flag: '🇨🇳' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
    { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
    { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
];

// Generate dramas array
const dramas: Drama[] = Array.from({ length: 20 }, (_, i) => generateDrama(i));

// Home data
const banners: Banner[] = dramas.slice(0, 5).map((drama, i) => ({
    id: `banner-${i}`,
    title: drama.title,
    subtitle: `${drama.status === 'ongoing' ? 'Ongoing' : 'Complete'} • ${drama.totalEpisodes} Episodes`,
    image: drama.backdrop || drama.poster,
    link: `/drama/${drama.slug}`,
    drama,
}));

const latestUpdates: LatestUpdate[] = dramas.slice(0, 10).map((drama) => ({
    drama,
    episode: {
        id: `${drama.id}-ep-latest`,
        dramaId: drama.id,
        number: drama.currentEpisode || drama.totalEpisodes,
        duration: 3600,
        subtitles: [],
    },
    updatedAt: drama.updatedAt || new Date().toISOString(),
}));

// Dummy HomeData
const homeData: HomeData = {
    banners,
    trending: dramas.slice(0, 8),
    latest: latestUpdates,
    topToday: dramas.slice(5, 15),
    topWeek: dramas.slice(3, 13),
    genres,
};

// Search results
const searchResults: PaginatedResponse<SearchResult> = {
    data: dramas.slice(0, 10).map((d) => ({
        id: d.id,
        slug: d.slug,
        title: d.title,
        poster: d.poster,
        year: d.year,
        type: 'drama' as const,
    })),
    page: 1,
    totalPages: 3,
    totalItems: 25,
    hasMore: true,
};

// Trending
const trending: PaginatedResponse<Drama> = {
    data: dramas.slice(0, 12),
    page: 1,
    totalPages: 5,
    totalItems: 50,
    hasMore: true,
};

// Latest
const latest: PaginatedResponse<Drama> = {
    data: dramas.slice(0, 12),
    page: 1,
    totalPages: 10,
    totalItems: 100,
    hasMore: true,
};

// Single drama
const singleDrama = dramas[0];
const episodes = generateEpisodes(singleDrama.id, singleDrama.totalEpisodes);

// Export dummy data
export const dummyData = {
    home: homeData,
    drama: singleDrama,
    dramas,
    episodes,
    genres,
    countries,
    searchResults,
    trending,
    latest,
    banners,
};

export default dummyData;
