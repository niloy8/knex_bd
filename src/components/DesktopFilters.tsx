"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { filters } from "@/data/productsData";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface SubCategory {
    id: number;
    name: string;
    slug: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    subCategories?: SubCategory[];
    subcategories?: SubCategory[];
}

interface DesktopFiltersProps {
    selectedBrands: string[];
    selectedPriceRange: number[];
    categoryParam: string | null;
    subcategoryParam?: string | null;
    dynamicBrands?: string[];
    onToggleBrand: (brand: string) => void;
    onTogglePriceRange: (index: number) => void;
    onClearAll: () => void;
}

export default function DesktopFilters({
    selectedBrands,
    selectedPriceRange,
    categoryParam,
    subcategoryParam,
    dynamicBrands,
    onToggleBrand,
    onTogglePriceRange,
    onClearAll,
}: DesktopFiltersProps) {
    const brandsToShow = dynamicBrands && dynamicBrands.length > 0 ? dynamicBrands : filters.brands;
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        fetch(`${API}/categories`)
            .then(res => res.json())
            .then(data => setCategories(Array.isArray(data) ? data : []))
            .catch(err => {
                console.error(err);
                setCategories([]);
            });
    }, []);

    const currentCategory = categoryParam
        ? categories.find(c => c.slug === categoryParam)
        : null;

    const subcategories = currentCategory
        ? (currentCategory.subCategories || currentCategory.subcategories || [])
        : [];

    return (
        <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-lg p-4 sticky top-20">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Filters</h2>
                    <button onClick={onClearAll} className="text-blue-600 text-sm font-medium hover:underline cursor-pointer">
                        CLEAR ALL
                    </button>
                </div>

                {(selectedBrands.length > 0 || selectedPriceRange.length > 0) && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {selectedBrands.map((brand) => (
                            <button key={brand} onClick={() => onToggleBrand(brand)} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200">
                                {brand}
                                <X size={14} />
                            </button>
                        ))}
                        {selectedPriceRange.map((index) => (
                            <button key={index} onClick={() => onTogglePriceRange(index)} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200">
                                {filters.priceRanges[index].label}
                                <X size={14} />
                            </button>
                        ))}
                    </div>
                )}

                {/* Categories Section */}
                {categories.length > 0 && (
                    <div className="mb-6">
                        <h3 className="font-semibold mb-3">Categories</h3>
                        <div className="space-y-1 max-h-48 overflow-y-auto">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/products?category=${cat.slug}`}
                                    className={`block px-2 py-1.5 rounded text-sm transition ${categoryParam === cat.slug
                                            ? "bg-blue-50 text-blue-600 font-medium"
                                            : "hover:bg-gray-50 text-gray-700"
                                        }`}
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Subcategories Section - Only show when a category is selected */}
                {categoryParam && subcategories.length > 0 && (
                    <div className="mb-6">
                        <h3 className="font-semibold mb-3">Subcategories</h3>
                        <div className="space-y-1 max-h-48 overflow-y-auto">
                            {subcategories.map((sub) => (
                                <Link
                                    key={sub.id}
                                    href={`/products?category=${categoryParam}&subcategory=${sub.slug}`}
                                    className={`block px-2 py-1.5 rounded text-sm transition ${subcategoryParam === sub.slug
                                            ? "bg-blue-50 text-blue-600 font-medium"
                                            : "hover:bg-gray-50 text-gray-700"
                                        }`}
                                >
                                    {sub.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {brandsToShow.length > 0 && (
                    <div className="mb-6">
                        <h3 className="font-semibold mb-3">Brand</h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {brandsToShow.map((brand) => (
                                <label key={brand} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                    <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => onToggleBrand(brand)} className="w-4 h-4 cursor-pointer" />
                                    <span className="text-sm">{brand}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <h3 className="font-semibold mb-3">Price Range</h3>
                    <div className="space-y-2">
                        {filters.priceRanges.map((range, index) => (
                            <label key={index} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <input type="checkbox" checked={selectedPriceRange.includes(index)} onChange={() => onTogglePriceRange(index)} className="w-4 h-4 cursor-pointer" />
                                <span className="text-sm">{range.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
}
