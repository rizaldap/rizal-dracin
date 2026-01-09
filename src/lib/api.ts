import { config } from './config';
import type {
    Drama,
    Episode,
    Genre,
    Country,
    HomeData,
    SearchResult,
    PaginatedResponse,
    StreamServer,
} from '@/types/drama';

// Types for Dramabox API responses
interface DramaboxBook {
    bookId: string;
    bookName: string;
    coverWap?: string;
    cover?: string;
    introduction?: string;
    chapterCount?: number;
    playCount?: string;
    tags?: string[];
    tagNames?: string[];
    author?: string;
    protagonist?: string;
}

interface DramaboxEpisode {
    chapterId: string;
    chapterIndex: number;
    chapterName: string;
    cdnList: {
        cdnDomain: string;
        videoPathList: {
            quality: number;
            videoPath: string;
            isDefault: number;
        }[];
    }[];
}

/* eslint-disable @typescript-eslint/no-explicit-any */
// API Client - uses 'any' for external API responses that have dynamic structure
class DramaboxAPI {
    private baseUrl: string;

    constructor() {
        this.baseUrl = config.api.baseUrl;
    }

    private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
        try {
            // Adjust endpoint to include /api/dramabox prefix if not present
            // but the config.api.baseUrl is likely "https://dramabox.sansekai.my.id"
            // and headers/endpoints seem to be "/api/dramabox/..."

            const url = `${this.baseUrl}${endpoint}`;
            // console.log(`Fetching: ${url}`); 

            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
                next: { revalidate: 60 }, // Cache for 1 minute
            });

            if (!response.ok) {
                // throw new Error(`API Error: ${response.status}`);
                console.error(`API Error ${response.status} for ${url}`);
                return [] as any; // Return empty array or object on error to prevent crash
            }

            const data = await response.json();
            return data as T;
        } catch (error) {
            console.error(`API fetch failed for ${endpoint}:`, error);
            throw error;
        }
    }

    // Helper to map DramaboxBook to Drama
    private mapBookToDrama(book: DramaboxBook): Drama {
        const genres: Genre[] = (book.tags || book.tagNames || []).map(tag => ({
            id: tag.toLowerCase().replace(/\s+/g, '-'),
            name: tag,
            slug: tag.toLowerCase().replace(/\s+/g, '-'),
            count: 0
        }));

        const country: Country = {
            code: 'cn',
            name: 'China'
        };

        const viewCount = book.playCount ? parseInt(book.playCount.replace(/\D/g, '')) * (book.playCount.includes('k') || book.playCount.includes('K') ? 1000 : (book.playCount.includes('M') || book.playCount.includes('m') ? 1000000 : 1)) : 0;

        return {
            id: book.bookId,
            title: book.bookName,
            slug: book.bookId, // Use ID as slug
            poster: book.coverWap || book.cover || '',
            rating: 0,
            views: viewCount,
            status: 'completed',
            synopsis: book.introduction || 'No synopsis available.',
            genres: genres,
            totalEpisodes: book.chapterCount || 0,
            releaseDate: '',
            country: country,
            year: 2024,
            originalTitle: book.bookName,
            backdrop: book.cover || book.coverWap || '',
            cast: [],
            updatedAt: new Date().toISOString(),
        };
    }

    // ==================== HOME & DISCOVERY ====================

    async getHome(): Promise<HomeData> {
        try {
            const [foryou, latest, trending] = await Promise.all([
                this.fetch<any[]>('/api/dramabox/foryou'),
                this.fetch<any[]>('/api/dramabox/latest'),
                this.fetch<any[]>('/api/dramabox/trending'),
            ]);

            const banners = foryou.slice(0, 5).map(item => {
                const book = item.bookId ? item : (item.tagCardVo?.tagBooks?.[0] || null);
                if (!book) return null;
                const drama = this.mapBookToDrama(book);
                return {
                    id: drama.id,
                    title: drama.title,
                    subtitle: drama.genres.map((g: Genre) => g.name).join(', '),
                    image: drama.backdrop || drama.poster,
                    link: `/drama/${drama.id}`,
                    drama: drama
                };
            }).filter(Boolean) as any[];

            const latestUpdates = latest.slice(0, 10).map((b: any) => {
                const drama = this.mapBookToDrama(b);
                return {
                    drama,
                    episode: {
                        id: 'latest',
                        dramaId: drama.id,
                        number: drama.totalEpisodes,
                        title: `Episode ${drama.totalEpisodes}`,
                        duration: 0,
                        streamUrl: '',
                        subtitles: [],
                        thumbnail: drama.poster,
                    },
                    updatedAt: new Date().toISOString()
                };
            });

            return {
                banners,
                trending: trending.slice(0, 10).map((b: any) => this.mapBookToDrama(b)),
                latest: latestUpdates,
                topToday: trending.slice(0, 5).map((b: any) => this.mapBookToDrama(b)), // Reuse trending
                topWeek: trending.slice(5, 10).map((b: any) => this.mapBookToDrama(b)), // Reuse trending
                genres: await this.getGenres(),
            };
        } catch (e) {
            console.error('getHome error', e);
            return { banners: [], trending: [], latest: [], topToday: [], topWeek: [], genres: [] };
        }
    }

    async getTrending(page: number = 1): Promise<PaginatedResponse<Drama>> {
        const data = await this.fetch<any[]>('/api/dramabox/trending');
        const dramas = data.map((b: any) => this.mapBookToDrama(b));
        return {
            data: dramas,
            page,
            totalPages: 10,
            totalItems: 100,
            hasMore: true,
        };
    }

    async getLatest(page: number = 1): Promise<PaginatedResponse<Drama>> {
        const data = await this.fetch<any[]>('/api/dramabox/latest');
        const dramas = data.map((b: any) => this.mapBookToDrama(b));
        return {
            data: dramas,
            page,
            totalPages: 10,
            totalItems: 100,
            hasMore: true,
        };
    }

    // ==================== SEARCH ====================

    async search(query: string, page: number = 1): Promise<PaginatedResponse<SearchResult>> {
        try {
            const encodedQuery = encodeURIComponent(query);
            const data = await this.fetch<any[]>(`/api/dramabox/search?query=${encodedQuery}`);

            if (!Array.isArray(data)) {
                console.error('Search API returned non-array:', data);
                return { data: [], page, totalPages: 0, totalItems: 0, hasMore: false };
            }

            const results: SearchResult[] = data.map((b: any) => ({
                id: b.bookId,
                title: b.bookName,
                slug: b.bookId,
                poster: b.cover || b.coverWap || '',
                type: 'drama' as const,
                year: 2024,
                rating: 0,
            }));

            return {
                data: results,
                page,
                totalPages: 1,
                totalItems: results.length,
                hasMore: false,
            };
        } catch (error) {
            console.error('Search error:', error);
            return { data: [], page, totalPages: 0, totalItems: 0, hasMore: false };
        }
    }

    // ==================== DRAMA DETAIL ====================

    async getDrama(idOrSlug: string): Promise<Drama> {
        // Try to find the drama from foryou, latest, or trending
        try {
            const [foryou, latest, trending] = await Promise.all([
                this.fetch<any[]>('/api/dramabox/foryou'),
                this.fetch<any[]>('/api/dramabox/latest'),
                this.fetch<any[]>('/api/dramabox/trending'),
            ]);

            // Combine all sources
            const allBooks = [
                ...foryou.filter(item => item.bookId),
                ...foryou.flatMap(item => item.tagCardVo?.tagBooks || []),
                ...latest,
                ...trending,
            ];

            // Find the book by ID
            const book = allBooks.find(b => b.bookId === idOrSlug);

            if (book) {
                return this.mapBookToDrama(book);
            }
        } catch (e) {
            console.error('getDrama error:', e);
        }

        // Fallback to stub if not found
        return {
            id: idOrSlug,
            title: `Drama ${idOrSlug}`,
            slug: idOrSlug,
            poster: '',
            synopsis: 'Details loading...',
            genres: [],
            totalEpisodes: 0,
            status: 'completed',
            views: 0,
            rating: 0,
            country: { code: 'cn', name: 'China' },
            year: 2024,
            originalTitle: '',
            backdrop: '',
            cast: [],
            releaseDate: '2024',
        };
    }

    async getEpisodes(dramaId: string, _season?: number): Promise<Episode[]> {
        const data = await this.fetch<DramaboxEpisode[]>(`/api/dramabox/allepisode?bookId=${dramaId}`);

        if (!Array.isArray(data)) {
            console.error('getEpisodes: Expected array', data);
            return [];
        }

        return data.map((ep) => {
            const servers: StreamServer[] = [];

            ep.cdnList.forEach((cdn) => {
                cdn.videoPathList.forEach((quality) => {
                    servers.push({
                        id: `${cdn.cdnDomain}-${quality.quality}`,
                        name: `${cdn.cdnDomain} (${quality.quality}p)`,
                        url: quality.videoPath,
                        quality: `${quality.quality}p`,
                        type: 'mp4',
                    });
                });
            });

            const defaultStream = servers.find(s => s.quality === '720p' || s.quality === '1080p') || servers[0];

            return {
                id: ep.chapterId,
                dramaId: dramaId,
                number: ep.chapterIndex + 1,
                title: ep.chapterName || `Episode ${ep.chapterIndex + 1}`,
                thumbnail: '',
                duration: 0,
                streamUrl: defaultStream?.url || '',
                servers: servers,
                subtitles: [],
                releaseDate: new Date().toISOString(),
            };
        });
    }

    async getRelated(_dramaId: string): Promise<Drama[]> {
        return (await this.getTrending()).data.slice(0, 5);
    }

    // ==================== GENRES & COUNTRIES ====================

    async getGenres(): Promise<Genre[]> {
        return [
            { id: 'romance', name: 'Romance', slug: 'romance', count: 100 },
            { id: 'ceo', name: 'CEO', slug: 'ceo', count: 80 },
            { id: 'revenge', name: 'Revenge', slug: 'revenge', count: 50 },
        ];
    }

    async getCountries(): Promise<Country[]> {
        return [
            { code: 'cn', name: 'China' },
        ];
    }

    async getDramasByGenre(genreSlug: string, page: number = 1): Promise<PaginatedResponse<Drama>> {
        const trending = await this.getTrending(page);
        return trending;
    }

    async getDramasByCountry(countryCode: string, page: number = 1): Promise<PaginatedResponse<Drama>> {
        return this.getLatest(page);
    }
}

export const api = new DramaboxAPI();
export default api;
