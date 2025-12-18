// TypeScript interfaces for Rizal Dracin

export interface Drama {
    id: string;
    slug: string;
    title: string;
    originalTitle?: string;
    poster: string;
    backdrop?: string;
    synopsis: string;
    rating: number;
    views?: number;
    genres: Genre[];
    country: Country;
    year: number;
    status: 'ongoing' | 'completed';
    totalEpisodes: number;
    currentEpisode?: number;
    cast: CastMember[];
    director?: string;
    releaseDate?: string;
    updatedAt?: string;
}

export interface Episode {
    id: string;
    dramaId: string;
    number: number;
    season?: number;
    title?: string;
    thumbnail?: string;
    duration: number; // in seconds
    streamUrl?: string;
    servers?: StreamServer[];
    subtitles: Subtitle[];
    releaseDate?: string;
}

export interface StreamServer {
    id: string;
    name: string;
    quality?: string;
    url: string;
    type: 'hls' | 'mp4' | 'iframe';
}

export interface Subtitle {
    id: string;
    language: string;
    label: string;
    url: string;
    default?: boolean;
}

export interface Genre {
    id: string;
    slug: string;
    name: string;
    count?: number;
}

export interface Country {
    code: string;
    name: string;
    flag?: string;
}

export interface CastMember {
    id: string;
    name: string;
    originalName?: string;
    photo?: string;
    role?: string;
}

export interface SearchResult {
    id: string;
    slug: string;
    title: string;
    poster: string;
    year: number;
    type?: 'drama' | 'movie';
}

export interface HomeData {
    banners: Banner[];
    trending: Drama[];
    latest: LatestUpdate[];
    topToday: Drama[];
    topWeek: Drama[];
    genres: Genre[];
}

export interface Banner {
    id: string;
    title: string;
    subtitle?: string;
    image: string;
    link: string;
    drama?: Drama;
}

export interface LatestUpdate {
    drama: Drama;
    episode: Episode;
    updatedAt: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    totalPages: number;
    totalItems: number;
    hasMore: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
}

// Player state types
export interface PlayerState {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isMuted: boolean;
    isFullscreen: boolean;
    quality: string;
    playbackRate: number;
    subtitleEnabled: boolean;
    currentSubtitle?: string;
}

export interface WatchProgress {
    episodeId: string;
    currentTime: number;
    duration: number;
    percentage: number;
    updatedAt: string;
}
