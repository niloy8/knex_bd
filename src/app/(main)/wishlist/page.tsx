"use client";

import { useState } from "react";
import { Trash2, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface WishlistItem {
    id: string;
    title: string;
    price: number;
    originalPrice: number;
    image: string;
    inStock: boolean;
    addedOn: string;
    href: string;
}

const wishlistData: WishlistItem[] = [
    {
        id: "1",
        title: "Beanie with Logo",
        price: 1800,
        originalPrice: 2000,
        image: "https://knex.com.bd/wp-content/uploads/2025/11/Faison-removebg-preview.png",
        inStock: true,
        addedOn: "December 5, 2025",
        href: "/product/beanie-logo",
    },
    {
        id: "2",
        title: "Classy Shirt",
        price: 1600,
        originalPrice: 2200,
        image: "https://knex.com.bd/wp-content/uploads/2025/11/Beauty-2-1-removebg-preview-1.png",
        inStock: true,
        addedOn: "December 6, 2025",
        href: "/product/classy-shirt",
    },
    {
        id: "3",
        title: "Beanie",
        price: 1800,
        originalPrice: 2000,
        image: "https://knex.com.bd/wp-content/uploads/2025/11/mobiles-2-removebg-preview.png",
        inStock: true,
        addedOn: "December 6, 2025",
        href: "/product/beanie",
    },
];

export default function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(wishlistData);

    const removeItem = (id: string) => {
        setWishlistItems(wishlistItems.filter(item => item.id !== id));
    };

    const addToCart = (id: string) => {
        console.log("Adding to cart:", id);
        // Add actual cart functionality here
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 mt-2.5 mb-2.5">
                {/* Header with Heart Icon */}
                <div className="flex flex-col items-center mb-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-blue-400 to-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <Heart size={32} className="fill-white stroke-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">My Wishlist</h1>
                </div>

                {wishlistItems.length > 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        {/* Table Header */}
                        <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 font-semibold text-gray-700">
                            <div className="col-span-5">Product name</div>
                            <div className="col-span-2 text-center">Unit price</div>
                            <div className="col-span-2 text-center">Stock status</div>
                            <div className="col-span-3"></div>
                        </div>

                        {/* Wishlist Items */}
                        <div className="divide-y divide-gray-200">
                            {wishlistItems.map((item) => (
                                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-6 hover:bg-gray-50 transition-colors">
                                    {/* Product Info */}
                                    <div className="col-span-1 md:col-span-5 flex items-center gap-4">
                                        <Link href={item.href} className="flex-shrink-0">
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-contain p-2"
                                                />
                                            </div>
                                        </Link>
                                        <Link href={item.href} className="flex-1">
                                            <h3 className="font-medium text-gray-800 hover:text-blue-600 transition-colors">
                                                {item.title}
                                            </h3>
                                        </Link>
                                    </div>

                                    {/* Price */}
                                    <div className="col-span-1 md:col-span-2 flex md:flex-col flex-row items-start md:items-center md:justify-center gap-2">
                                        <span className="md:hidden text-sm text-green-400 font-medium">Price:</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400 line-through text-sm">
                                                Tk {item.originalPrice.toLocaleString()}
                                            </span>
                                            <span className="text-lg font-bold text-gray-800">
                                                Tk {item.price.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Stock Status */}
                                    <div className="col-span-1 md:col-span-2 flex md:items-center md:justify-center">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.inStock
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}>
                                            {item.inStock ? "In Stock" : "Out of Stock"}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-1 md:col-span-3 flex flex-col items-end justify-center gap-3">
                                        <span className="text-xs text-gray-500">
                                            Added on: {item.addedOn}
                                        </span>
                                        <div className="flex items-center gap-2 w-full md:w-auto">
                                            <button
                                                onClick={() => addToCart(item.id)}
                                                disabled={!item.inStock}
                                                className={`flex-1 md:flex-initial px-6 py-2 rounded-lg font-medium transition-all cursor-pointer ${item.inStock
                                                    ? "bg-blue-600 text-white  hover:bg-green-700 shadow-md hover:shadow-lg"
                                                    : "bg-gray-300 text-blue-500 cursor-not-allowed"
                                                    }`}
                                            >
                                                Add to cart
                                            </button>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer group"
                                                title="Remove from wishlist"
                                            >
                                                <Trash2 size={20} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 via-blue-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Heart size={48} className="fill-white stroke-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-3">Your wishlist is empty</h2>
                        <p className="text-gray-600 mb-8 text-lg">Save your favorite items here to buy them later</p>
                        <Link
                            href="/"
                            className="inline-block bg-gradient-to-r from-yellow-400 via-blue-500 to-green-500 text-white px-10 py-4 rounded-xl font-semibold hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
