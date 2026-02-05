"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type SubCategory = { id: number; name: string; slug: string };
type Category = {
    id: number;
    name: string;
    slug: string;
    icon: string;
    subcategories?: SubCategory[];
    subCategories?: SubCategory[];
};

export default function CategoryNav() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${API}/categories`)
            .then(res => res.json())
            .then(data => setCategories(Array.isArray(data) ? data : []))
            .catch(err => {
                console.error(err);
                setCategories([]);
            });
    }, []);

    const getSubcategories = (category: Category) =>
        category.subCategories || category.subcategories || [];

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-around gap-4 overflow-x-auto scrollbar-hide py-3">
                    {categories.map((category) => {
                        const subs = getSubcategories(category);
                        return (
                            <div
                                key={category.id}
                                className="relative"
                                onMouseEnter={() => setActiveDropdown(category.slug)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <Link
                                    href={`/products?category=${category.slug}`}
                                    className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition px-2 py-1"
                                >
                                    <span>{category.icon}</span>
                                    <span>{category.name}</span>
                                    {subs.length > 0 && (
                                        <ChevronDown className="w-4 h-4" />
                                    )}
                                </Link>

                                {activeDropdown === category.slug && subs.length > 0 && (
                                    <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px] z-50">
                                        {subs.map((sub) => (
                                            <Link
                                                key={sub.id}
                                                href={`/products?category=${category.slug}&subcategory=${sub.slug}`}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
