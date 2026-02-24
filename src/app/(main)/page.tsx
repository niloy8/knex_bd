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
                    const mappedCategories = data.map((cat: Category) => {
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

    const bannerImages = [
        {
            url: "https://res.cloudinary.com/dh34a84tc/image/upload/v1771566855/Banner_1_graraq.png",
            href: "/products?category=fashion&subcategory=women&subsubcategory=lehenga"
        },
        {
            url: "https://res.cloudinary.com/dh34a84tc/image/upload/v1771566855/Banner_2_mn799l.png",
            href: "/products?category=fashion&subcategory=women&subsubcategory=lehenga"
        },
    ];



    const topDeals = [
        { title: "Royal Noor Lehenga", price: "From Tk 6990", image: "https://res.cloudinary.com/dh34a84tc/image/upload/v1771742122/knex_uploads/product%204-1771742121264-1771742121431.webp", href: "/products?category=fashion&subcategory=women&subsubcategory=lehenga" },
        { title: "Meher Mahal Bridal Lehenga", price: "From Tk 499", image: "https://res.cloudinary.com/dh34a84tc/image/upload/v1771742072/knex_uploads/product%203-1771742070704-1771742071105.webp", href: "/products?category=fashion&subcategory=women&subsubcategory=lehenga" },
        { title: "Zarqa Velvet Dream Lehenga", price: "From Tk 6599", image: "https://res.cloudinary.com/dh34a84tc/image/upload/v1771742112/knex_uploads/product%201-1771742111293-1771742111537.webp", href: "/products?category=fashion&subcategory=women&subsubcategory=lehenga" },
        { title: "Sundari Blossom Lehenga", price: "From Tk 8279", image: "https://res.cloudinary.com/dh34a84tc/image/upload/v1771821836/product_5_cus2zj.jpg", href: "/products?category=fashion&subcategory=women&subsubcategory=lehenga" },
    ];

    // const saleDeals = [
    //     { title: "Winter Accessories", price: "Min. 50% Off", iconName: "Snowflake", href: "/products?category=winter" },
    //     { title: "Dry Fruits", price: "Min. 50% Off", iconName: "Apple", href: "/products?category=dry-fruits" },
    //     { title: "Baby Care", price: "Up to 40% Off", iconName: "Baby", href: "/products?category=baby-care" },
    //     { title: "Bike Lights", price: "From Tk 299", iconName: "Lightbulb", href: "/products?category=bike-lights" },
    // ];

    const winterEssentials = [
        { label: "Top Sellers", meta: "Warm • Soft • Everyday", image: "https://res.cloudinary.com/dh34a84tc/image/upload/v1771824205/WhatsApp_Image_2026-02-18_at_1.00.16_PM_a9am2b.jpg" },
        { label: "Most-loved", meta: "Trending • Best Rated", image: "https://res.cloudinary.com/dh34a84tc/image/upload/v1771825026/WhatsApp_Image_2026-02-18_at_1.00.31_PM_vd6qln.jpg" },
        { label: "Min. 50% Off", meta: "Big Savings • Limited Time", image: "https://res.cloudinary.com/dh34a84tc/image/upload/v1771825027/WhatsApp_Image_2026-02-18_at_1.00.29_PM_g8gb5d.jpg" },
        { label: "Top Picks", meta: " Choice • Cozy", image: "https://res.cloudinary.com/dh34a84tc/image/upload/v1771825029/WhatsApp_Image_2026-02-18_at_1.00.21_PM_w1qz0p.jpg" },
    ];

    const topPicksSale = [
        { label: "Min. 50% Off", meta: "Hot Deals • Limited Stock", image: "https://res.cloudinary.com/dh34a84tc/image/upload/v1771825923/WhatsApp_Image_2026-02-18_at_1.00.36_PM_dd49ed.jpg" },
        { label: "Min. 30% Off", meta: "Popular • Great Value", image: "https://res.cloudinary.com/dh34a84tc/image/upload/v1771825922/WhatsApp_Image_2026-02-18_at_1.00.36_PM_1_rscukl.jpg" },
        { label: "Min. 50% Off", meta: "Must-Have • Seasonal", image: "https://res.cloudinary.com/dh34a84tc/image/upload/v1771826272/knex_uploads/WhatsApp%20Image%202026-02-18%20at%201.00.36%20PM%20%282%29-1771826271961-1771826272128.webp" },
        { label: "Min. 50% Off", meta: "Top Rated • Durable", image: "https://res.cloudinary.com/dh34a84tc/image/upload/v1771825922/WhatsApp_Image_2026-02-18_at_1.00.38_PM_ekulee.jpg" },
    ];

    const fashionTopDealsGrid = [
        { label: "Min. 70% Off", meta: "Trending Salwar Kamiz", image: "https://res.cloudinary.com/dh34a84tc/image/upload/v1771826289/knex_uploads/WhatsApp%20Image%202026-02-18%20at%201.00.36%20PM%20%283%29-1771826288487-1771826289946.webp" },
        { label: "Min. 70% Off", meta: "Bengali Sari", image: "https://res.cloudinary.com/dh34a84tc/image/upload/v1771824375/knex_uploads/WhatsApp%20Image%202026-02-18%20at%201.00.05%20PM-1771824372862-1771824374208.webp" },
        { label: "Min. 90% Off", meta: "Lehengas Deals", image: "https://res.cloudinary.com/dh34a84tc/image/upload/v1771742123/knex_uploads/product%201-2-1771742123841-1771742124075.webp" },
        { label: "Min. 70% Off", meta: "Kurti", image: "https://res.cloudinary.com/dh34a84tc/image/upload/v1771827522/WhatsApp_Image_2026-02-18_at_1.00.28_PM_1_cv62ap.jpg" },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Categories */}
            <section className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 pb-3">
                    <div className="py-4">
                        <Banner images={bannerImages} autoSlide={true} interval={5000} />
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
                    <SectionHeader title="Top Deals" href="/products?category=fashion&subcategory=women&subsubcategory=lehenga" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {topDeals.map((deal) => (
                            <ProductCard key={deal.title} {...deal} />
                        ))}
                    </div>
                </section>
                {/* Three-column row: two deals sections + promo */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <DealsSection title="Entering New Stage of Life" items={winterEssentials} viewAllHref="/products?category=fashion&subcategory=women&subsubcategory=bengali-wedding-sari" />
                    <DealsSection title="Top picks of the sale" items={topPicksSale} viewAllHref="/products?category=fashion&subcategory=women&subsubcategory=salwar-kameez-and-dress" />
                    <FashionPromo
                        title="Shop your fashion Needs"
                        subtitle="with Latest & Trendy Choices"
                        buttonText="Shop Now"
                        image="https://res.cloudinary.com/dh34a84tc/image/upload/v1771823102/product_6_x3zole.jpg"
                    />
                </div>

                {/* Fashion's Top Deals + Smartphones Promo (row) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <DealsSection title="Fashion's Top Deals" items={fashionTopDealsGrid} viewAllHref="/products?category=fashion" />
                    </div>
                    <div className="lg:col-span-2">
                        <FashionPromo
                            title="Top Selling Lehengas"
                            subtitle="Latest Technology, Best Brands"
                            buttonText="Explore Now"
                            href="/products?category=fashion&subcategory=women&subsubcategory=lehenga"
                            image="https://res.cloudinary.com/dh34a84tc/image/upload/v1771823778/Product_Banner_hsb6ko.jpg"
                        />
                    </div>
                </div>



                {/* Top picks of the sale */}
                {/* <section>
                    <SectionHeader title="Top picks of the sale" href="/sale" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {saleDeals.map((deal) => (
                            <ProductCard key={deal.title} {...deal} />
                        ))}
                    </div>
                </section> */}




            </div>
        </div>
    );
}