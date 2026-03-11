import { MetadataRoute } from 'next'

export const revalidate = 86400; // 24 hours

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'KNEX',
        short_name: 'KNEX',
        description: 'Shop for Electronics, Fashion, Home, Beauty and more at KNEX.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0059a9',
        icons: [
            {
                src: '/icon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
            },
            {
                src: '/icon.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
