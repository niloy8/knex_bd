"use client";

import { useState, useEffect } from "react";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import Banner from "@/components/Banner";
import SectionHeader from "@/components/SectionHeader";
import DealsSection from "@/components/DealsSection";
import FashionPromo from "@/components/FashionPromo";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Category {
    id?: number;
    name: string;
    slug?: string;
    icon: string;
    image?: string;
    href: string;
    badge?: string;
    subCategories?: {
        id: number;
        name: string;
        slug: string;
        image?: string;
    }[];
}

export default function HomePage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API_URL}/categories`);
                if (res.ok) {
                    const data = await res.json();
                    // Map categories to the format expected by CategoryCard
                    const mappedCategories = data.map((cat: any) => {
                        let imageUrl = cat.image || cat.icon || "https://knex.com.bd/wp-content/uploads/2025/11/Electronicss-removebg-preview.png";
                        // If it's a relative path starting with /uploads, prepend the backend URL
                        if (imageUrl.startsWith('/uploads')) {
                            const baseUrl = API_URL.replace('/api', '');
                            imageUrl = `${baseUrl}${imageUrl}`;
                        }

                        return {
                            id: cat.id,
                            name: cat.name,
                            slug: cat.slug,
                            icon: imageUrl,
                            href: `/products?category=${cat.slug}`,
                            badge: cat.name === "Stone" ? "NEW" : undefined,
                            subCategories: cat.subCategories || []
                        };
                    });
                    setCategories(mappedCategories);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                // Fallback to default categories if fetch fails
                setCategories([
                    { name: "Fashion", icon: "https://knex.com.bd/wp-content/uploads/2025/11/Faison-removebg-preview.png", href: "/products?category=fashion" },
                    { name: "Beauty", icon: "https://knex.com.bd/wp-content/uploads/2025/11/Beauty-2-1-removebg-preview-1.png", href: "/products?category=beauty" },
                    { name: "Mobiles", icon: "https://knex.com.bd/wp-content/uploads/2025/11/mobiles-2-removebg-preview.png", href: "/products?category=mobiles" },
                    { name: "Smart Gadget", icon: "https://knex.com.bd/wp-content/uploads/2025/11/smart-gadget-removebg-preview.png", href: "/products?category=smart-gadget" },
                    { name: "Electronics", icon: "https://knex.com.bd/wp-content/uploads/2025/11/Home-2-removebg-preview.png", href: "/products?category=electronics" },
                    { name: "Home & Furniture", icon: "https://knex.com.bd/wp-content/uploads/2025/11/Electronicss-removebg-preview.png", href: "/products?category=home-furniture" },
                    { name: "Stone", icon: "https://knex.com.bd/wp-content/uploads/2025/11/ChatGPT-Image-Nov-2-2025-02_17_01-PM-removebg-preview.png", href: "/products?category=stone", badge: "NEW" },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const banners = [
        { title: "Office Chairs", subtitle: "Green Soul, Cell Bell & more", price: "From Tk 2,999", bgColor: "bg-gradient-to-r from-blue-600 to-indigo-600", iconName: "Armchair" },
        { title: "Gaming Laptops", subtitle: "ASUS, MSI & more", price: "From Tk 49,999", bgColor: "bg-gradient-to-r from-purple-600 to-pink-600", iconName: "Laptop" },
        { title: "Smart Watches", subtitle: "Apple, Samsung & more", price: "From Tk 1,999", bgColor: "bg-gradient-to-r from-green-600 to-teal-600", iconName: "Watch" },
    ];



    const topDeals = [
        { title: "Projectors", price: "From Tk 6990", iconName: "Projector", href: "/products?category=projectors" },
        { title: "Speakers", price: "From Tk 499", iconName: "Speaker", href: "/products?category=speakers" },
        { title: "Gaming Monitor", price: "From Tk 6599", iconName: "Monitor", href: "/products?category=gaming-monitor" },
        { title: "Gaming Chair", price: "From Tk 8279", iconName: "Gamepad2", href: "/products?category=gaming-chair" },
    ];

    const saleDeals = [
        { title: "Winter Accessories", price: "Min. 50% Off", iconName: "Snowflake", href: "/products?category=winter" },
        { title: "Dry Fruits", price: "Min. 50% Off", iconName: "Apple", href: "/products?category=dry-fruits" },
        { title: "Baby Care", price: "Up to 40% Off", iconName: "Baby", href: "/products?category=baby-care" },
        { title: "Bike Lights", price: "From Tk 299", iconName: "Lightbulb", href: "/products?category=bike-lights" },
    ];

    const winterEssentials = [
        { label: "Top Sellers", meta: "Warm • Soft • Everyday", image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&q=80" },
        { label: "Most-loved", meta: "Trending • Best Rated", image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&q=80" },
        { label: "Min. 50% Off", meta: "Big Savings • Limited Time", image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400&q=80" },
        { label: "Top Picks", meta: "Editor's Choice • Cozy", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80" },
    ];

    const topPicksSale = [
        { label: "Min. 50% Off", meta: "Hot Deals • Limited Stock", image: "https://images.unsplash.com/photo-1542060748-10c28b62716f?w=400&q=80" },
        { label: "Min. 30% Off", meta: "Popular • Great Value", image: "https://images.unsplash.com/photo-1556228578-8fb722d5277a?w=400&q=80" },
        { label: "Min. 50% Off", meta: "Must-Have • Seasonal", image: "https://images.unsplash.com/photo-1586201375761-83865001e31b?w=400&q=80" },
        { label: "Min. 50% Off", meta: "Top Rated • Durable", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80" },
    ];

    const fashionTopDealsGrid = [
        { label: "Min. 70% Off", meta: "Trending Sneakers", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=80" },
        { label: "Min. 70% Off", meta: "Summer Sandals", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80" },
        { label: "Min. 90% Off", meta: "Smart Watch Deals", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80" },
        { label: "Min. 70% Off", meta: "Backpacks & Bags", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80" },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Categories */}
            <section className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 pb-3">
                    <div className="py-4">
                        <Banner banners={banners} autoSlide={true} interval={5000} />
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4">
                        {categories.map((category) => (
                            <CategoryCard key={category.name} {...category} />
                        ))}
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                {/* Top Deals */}
                <section>
                    <SectionHeader title="Top Deals" href="/deals" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {topDeals.map((deal) => (
                            <ProductCard key={deal.title} {...deal} />
                        ))}
                    </div>
                </section>
                {/* Three-column row: two deals sections + promo */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <DealsSection title="Winter Essentials for You" items={winterEssentials} viewAllHref="/products?category=winter" />
                    <DealsSection title="Top picks of the sale" items={topPicksSale} viewAllHref="/sale" />
                    <FashionPromo
                        title="Shop your fashion Needs"
                        subtitle="with Latest & Trendy Choices"
                        buttonText="Shop Now"
                        image="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80"
                    />
                </div>

                {/* Fashion's Top Deals + Smartphones Promo (row) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <DealsSection title="Fashion's Top Deals" items={fashionTopDealsGrid} viewAllHref="/deals/fashion" />
                    </div>
                    <div className="lg:col-span-2">
                        <FashionPromo
                            title="Top Selling Smartphones"
                            subtitle="Latest Technology, Best Brands"
                            buttonText="Explore Now"
                            href="/products?category=smartphones"
                            image="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80"
                        />
                    </div>
                </div>



                {/* Top picks of the sale */}
                <section>
                    <SectionHeader title="Top picks of the sale" href="/sale" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {saleDeals.map((deal) => (
                            <ProductCard key={deal.title} {...deal} />
                        ))}
                    </div>
                </section>




            </div>
        </div>
    );
}