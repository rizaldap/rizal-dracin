/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'dramabox.sansekai.my.id',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '*.dramabox.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '*.dramaboxdb.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
