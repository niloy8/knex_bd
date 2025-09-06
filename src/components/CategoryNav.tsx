"use client";

import Link from "next/link";

const categories = [
    { name: "Fashion", href: "/category/mobiles" },
    { name: "Beauty", href: "/category/fashion" },
    { name: "Mobiles", href: "/category/electronics" },
    { name: "Smart Gadget", href: "/category/home" },
    { name: "Electronics", href: "/category/appliances" },
    { name: "Home & Furniture", href: "/category/beauty" },
    { name: "Stone", href: "/flights", badge: "NEW" },
];

export default function CategoryNav() {
    return (
        <nav className="bg-white border border-amber-50 sticky top-0 z-40 ">
            <div className=" max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-around gap-6 overflow-x-auto scrollbar-hide mb-2 border-b pb-2">
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            href={category.href}
                            className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition cursor-pointer"
                        >
                            {category.name}

                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
