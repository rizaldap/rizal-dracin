// API Configuration
export const config = {
    api: {
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dramabox.sansekai.my.id',
        tokenUrl: process.env.NEXT_PUBLIC_API_TOKEN_URL || 'https://dramabox-api.vercel.app/api/token',
        timeout: 10000,
    },
    site: {
        name: process.env.NEXT_PUBLIC_SITE_NAME || 'Rizal Dracin',
        url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Streaming Drama Asia Terlengkap',
    },
    player: {
        defaultVolume: 1,
        skipIntroSeconds: 85,
        skipOutroSeconds: 90,
        autoNextDelay: 5, // seconds before auto next episode
    },
    cache: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 30 * 60 * 1000, // 30 minutes
    },
} as const;

export default config;
