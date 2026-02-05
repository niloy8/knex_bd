"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Star, Package } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

interface ProductGridCardProps {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    rating: number;
    totalRatings: number;
    image: string;
    assured?: boolean;
    href: string;
}

export default function ProductGridCard({
    id,
    title,
    price,
    originalPrice,
    discount,
    rating,
    totalRatings,
    image,

    href,
}: ProductGridCardProps) {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const productId = parseInt(id);
    const isWishlisted = isInWishlist(productId);

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist({
            productId,
            title,
            price,
            originalPrice: originalPrice || price,
            image,
            slug: href.replace('/products/', ''),
            inStock: true,
        });
    };

    return (
        <Link href={href} className="bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all border border-gray-200 group relative cursor-pointer">
            <button
                onClick={handleWishlistClick}
                className="absolute top-2 right-2 z-10 p-2 bg-white hover:bg-gray-100 rounded-full shadow-md transition cursor-pointer"
            >
                <Heart
                    size={18}
                    className={isWishlisted ? "fill-red-500 stroke-red-500" : "stroke-gray-600"}
                />
            </button>

            <div className="aspect-square bg-gray-50 p-4 relative">
                <div className="w-full h-full flex items-center justify-center relative">
                    {image ? (
                        <Image src={image} alt={title} fill className="object-contain" unoptimized />
                    ) : (
                        <Package className="w-16 h-16 text-gray-300" />
                    )}
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-medium text-gray-800 mb-2 group-hover:text-blue-600 line-clamp-2 min-h-[3rem]">
                    {title}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                        {rating} <Star size={10} fill="white" />
                    </span>
                    <span className="text-xs text-gray-500">({totalRatings.toLocaleString()})</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl font-bold text-gray-900">Tk {price.toLocaleString()}</span>
                    {originalPrice && (
                        <>
                            <span className="text-sm text-gray-400 line-through">
                                Tk {originalPrice.toLocaleString()}
                            </span>
                            <span className="text-sm text-green-600 font-semibold">
                                {discount}% off
                            </span>
                        </>
                    )}
                </div>

            </div>
        </Link>
    );
}
