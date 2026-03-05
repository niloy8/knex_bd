import { MetadataRoute } from 'next';

const STATIC_ROUTES = [
    '',
    '/about',
    '/careers',
    '/press',
    '/corporate',
    '/faq',
    '/payments',
    '/shipping',
    '/returns',
    '/privacy',
    '/terms',
    '/security',
    '/site-map',
    '/products',
    '/category',
    '/wishlist',
    '/cart',
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://knex.com.bd";

/**
 * Escapes characters that are reserved in XML to prevent parsing errors.
 */
function escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const sitemapEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
        url: escapeXml(`${BASE_URL}${route}`),
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'monthly',
        priority: route === '' ? 1 : 0.8,
    }));

    try {
        // Fetch Categories, Subcategories, and Sub-subcategories
        const categoriesRes = await fetch(`${API_URL}/categories`, { next: { revalidate: 3600 } });
        if (categoriesRes.ok) {
            const categories = await categoriesRes.json();
            for (const cat of categories) {
                // Category
                sitemapEntries.push({
                    url: escapeXml(`${BASE_URL}/category/${cat.slug}`),
                    lastModified: new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.7,
                });

                // Subcategories
                if (cat.subCategories && Array.isArray(cat.subCategories)) {
                    for (const sub of cat.subCategories) {
                        sitemapEntries.push({
                            url: escapeXml(`${BASE_URL}/category/${cat.slug}/${sub.slug}`),
                            lastModified: new Date(),
                            changeFrequency: 'weekly',
                            priority: 0.6,
                        });

                        // Sub-subcategories
                        if (sub.subSubCategories && Array.isArray(sub.subSubCategories)) {
                            for (const subSub of sub.subSubCategories) {
                                sitemapEntries.push({
                                    url: escapeXml(`${BASE_URL}/category/${cat.slug}/${sub.slug}/${subSub.slug}`),
                                    lastModified: new Date(),
                                    changeFrequency: 'weekly',
                                    priority: 0.5,
                                });
                            }
                        }
                    }
                }
            }
        }

        // Fetch Products (Fetch first 500 products for sitemap)
        const productsRes = await fetch(`${API_URL}/products?limit=500`, { next: { revalidate: 3600 } });
        if (productsRes.ok) {
            const data = await productsRes.json();
            const products = data.products || [];
            products.forEach((prod: any) => {
                sitemapEntries.push({
                    url: escapeXml(`${BASE_URL}/products/${prod.slug}`),
                    lastModified: new Date(prod.updatedAt || new Date()),
                    changeFrequency: 'weekly',
                    priority: 0.6,
                });
            });
        }
    } catch (error) {
        console.error('Error generating dynamic sitemap:', error);
    }

    return sitemapEntries;
}
