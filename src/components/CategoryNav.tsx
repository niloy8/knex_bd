"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type SubCategory = { id: number; name: string; slug: string; image?: string };
type Category = {
    id: number;
    name: string;
    slug: string;
    icon?: string;
    image?: string;
    subcategories?: SubCategory[];
    subCategories?: SubCategory[];
};

export default function CategoryNav() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<{ left: number; width: number } | null>(null);
    const navRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        fetch(`${API}/categories`)
            .then(res => res.json())
            .then(data => setCategories(Array.isArray(data) ? data : []))
            .catch(err => {
                console.error(err);
                setCategories([]);
            });
    }, []);

    const getSubcategories = useCallback((category: Category) =>
        category.subCategories || category.subcategories || [], []);

    const handleMouseEnter = useCallback((categorySlug: string, element: HTMLDivElement) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setActiveDropdown(categorySlug);

        // Calculate dropdown position
        const rect = element.getBoundingClientRect();
        const navRect = navRef.current?.getBoundingClientRect();
        if (navRect) {
            setDropdownPosition({
                left: rect.left - navRect.left,
                width: rect.width
            });
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        timeoutRef.current = setTimeout(() => {
            setActiveDropdown(null);
            setDropdownPosition(null);
        }, 150);
    }, []);

    const handleDropdownEnter = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const activeCategory = categories.find(c => c.slug === activeDropdown);
    const activeSubs = activeCategory ? getSubcategories(activeCategory) : [];

    return (
        <nav
            ref={navRef}
            className="bg-white border-b border-gray-200 relative"
            aria-label="Category navigation"
        >
            <div className="max-w-7xl mx-auto px-2 sm:px-0">
                <div
                    className="flex items-center lg:justify-center overflow-x-auto scrollbar-hide"
                    style={{
                        WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}
                >
                    {categories.map((category) => {
                        const subs = getSubcategories(category);
                        const isActive = activeDropdown === category.slug;

                        return (
                            <div
                                key={category.id}
                                className="relative shrink-0"
                                onMouseEnter={(e) => handleMouseEnter(category.slug, e.currentTarget)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <Link
                                    href={`/products?category=${category.slug}`}
                                    className={`
                                        flex items-center gap-1 px-3 sm:px-4 py-3
                                        text-xs sm:text-sm font-medium whitespace-nowrap
                                        transition-colors duration-200
                                        border-b-2
                                        ${isActive
                                            ? 'text-blue-600 border-blue-600'
                                            : 'text-gray-700 border-transparent hover:text-blue-600'
                                        }
                                    `}
                                >
                                    <span>{category.name}</span>
                                    {subs.length > 0 && (
                                        <ChevronDown
                                            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`}
                                        />
                                    )}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Dropdown Overlay for Subcategories */}
            {activeDropdown && activeSubs.length > 0 && dropdownPosition && (
                <div
                    className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50"
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                            {activeSubs.map((sub) => (
                                <Link
                                    key={sub.id}
                                    href={`/products?category=${activeDropdown}&subcategory=${sub.slug}`}
                                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-150"
                                >
                                    <div className="relative w-8 h-8 shrink-0">
                                        <img
                                            src={(() => {
                                                let img = sub.image || "https://knex.com.bd/wp-content/uploads/2025/11/Electronicss-removebg-preview.png";
                                                if (img.startsWith('/uploads')) {
                                                    const baseUrl = API.replace('/api', '');
                                                    return `${baseUrl}${img}`;
                                                }
                                                return img;
                                            })()}
                                            alt={sub.name}
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "https://knex.com.bd/wp-content/uploads/2025/11/Electronicss-removebg-preview.png";
                                            }}
                                        />
                                    </div>
                                    <span className="truncate">{sub.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
