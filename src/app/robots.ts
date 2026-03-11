import { MetadataRoute } from 'next';

export const revalidate = 86400; // 24 hours

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://knex.com.bd";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin',
                    '/login',
                    '/register',
                    '/account',
                    '/my-account',
                    '/api',
                    '/cart',
                    '/wishlist',
                    '/order-confirmation',
                    '/checkout',
                ],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
        host: BASE_URL,
    };
}
