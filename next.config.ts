import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'knex.com.bd',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/product-category/:slug',
        destination: '/category/:slug',
        permanent: true,
      },
      // Redirect query param URLs to clean URLs if they only have a category
      {
        source: '/products',
        has: [
          {
            type: 'query',
            key: 'category',
            value: '(?<category>.*)',
          },
        ],
        // Only redirect if it's ONLY the category to avoid breaking deep filters
        missing: [
          { type: 'query', key: 'subcategory' },
          { type: 'query', key: 'subsubcategory' },
          { type: 'query', key: 'brand' },
          { type: 'query', key: 'minPrice' },
          { type: 'query', key: 'maxPrice' },
          { type: 'query', key: 'sort' },
          { type: 'query', key: 'page' },
        ],
        destination: '/category/:category',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/category/:category',
        destination: '/products?category=:category',
      },
      {
        source: '/category/:category/:subcategory',
        destination: '/products?category=:category&subcategory=:subcategory',
      },
      {
        source: '/category/:category/:subcategory/:subsubcategory',
        destination: '/products?category=:category&subcategory=:subcategory&subsubcategory=:subsubcategory',
      },
    ];
  },
};

export default nextConfig;
