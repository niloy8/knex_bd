"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { allProducts } from "@/data/productsData";
import Link from "next/link";
import {
    Star,
    Heart,
    Share2,
    ShoppingCart,
    Check,
    Minus,
    Plus,
    ChevronRight,
    PlayCircle
} from "lucide-react";
import CategoryCard from "@/components/CategoryCard";
import CategoryNav from "@/components/CategoryNav";

// Mock data for extended product details since the basic data is limited
const extendedProductData = {
    description: "Experience the ultimate performance with our latest product. Designed with precision and crafted for durability, this item stands out in both functionality and style. Whether you're a professional or an enthusiast, this product will exceed your expectations.",
    longDescription: `
    <p class="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <p class="mb-4">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <ul class="list-disc pl-5 mb-4 space-y-2">
      <li>High-quality materials for long-lasting durability</li>
      <li>Ergonomic design for maximum comfort</li>
      <li>Advanced technology for superior performance</li>
      <li>Eco-friendly manufacturing process</li>
    </ul>
  `,
    reviews: [
        { id: 1, user: "John Doe", rating: 5, comment: "Absolutely amazing product! Worth every penny.", date: "2023-10-15" },
        { id: 2, user: "Jane Smith", rating: 4, comment: "Great quality, but shipping took a bit longer than expected.", date: "2023-10-12" },
    ],
    gallery: [
        "/placeholder-1.jpg", // Will replace with emoji or color blocks for demo
        "/placeholder-2.jpg",
        "/placeholder-3.jpg",
        "/placeholder-4.jpg",
    ],
    colors: [
        { name: "Blue", value: "#3b82f6" },
        { name: "Green", value: "#22c55e" },
        { name: "Yellow", value: "#eab308" },
        { name: "Black", value: "#000000" },
    ],
    sizes: ["S", "M", "L", "XL"],
};

export default function SingleProductPage() {
    const params = useParams();
    const id = params.id as string;
    const product = allProducts.find((p) => p.id === id) || allProducts[0]; // Fallback to first product if not found

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(extendedProductData.colors[0]);
    const [selectedSize, setSelectedSize] = useState(extendedProductData.sizes[1]);
    const [activeTab, setActiveTab] = useState("description");

    // Mock gallery using the product emoji and some colored blocks to simulate images
    const galleryImages = [
        { type: "image", content: product.image, bg: "bg-gray-100" },
        { type: "image", content: product.image, bg: "bg-blue-50" },
        { type: "image", content: product.image, bg: "bg-green-50" },
        { type: "video", content: "▶️", bg: "bg-gray-900 text-white" },
    ];

    const handleQuantityChange = (type: "inc" | "dec") => {
        if (type === "inc") setQuantity(prev => prev + 1);
        if (type === "dec" && quantity > 1) setQuantity(prev => prev - 1);
    };

    // Calculate discount percentage if not provided
    const discountPercentage = product.discount || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <CategoryNav></CategoryNav>
            {/* Breadcrumbs */}
            <div className="bg-white">
                <div className="container mx-auto px-4 py-2">
                    <div className="flex items-center text-sm text-gray-500">
                        <Link href="/" className="hover:text-blue-600">Home</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <Link href="/products" className="hover:text-blue-600">Products</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-md">{product.title}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
                        {/* Left Column: Image Gallery (with vertical thumbnails) */}
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="hidden lg:flex flex-col gap-4 w-20">
                                {galleryImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl border transition-all ${selectedImage === idx ? "border-blue-600 ring-2 ring-blue-100 scale-105" : "border-gray-100 hover:border-gray-300 bg-white"
                                            } ${img.bg}`}
                                        title={`View ${idx + 1}`}
                                    >
                                        {img.type === "video" ? <PlayCircle className="w-5 h-5" /> : img.content}
                                    </button>
                                ))}
                            </div>

                            <div className="flex-1 space-y-4">
                                {/* Main Image */}
                                <div className={`relative aspect-[4/3] rounded-xl overflow-hidden flex items-center justify-center text-9xl ${galleryImages[selectedImage].bg} border border-gray-100`}>
                                    {galleryImages[selectedImage].type === "video" ? (
                                        <div className="flex flex-col items-center justify-center text-white">
                                            <PlayCircle className="w-24 h-24 mb-4 opacity-90" />
                                            <span className="text-lg font-medium">Product Video</span>
                                        </div>
                                    ) : (
                                        <span className="transform transition-transform duration-500 hover:scale-105 cursor-zoom-in text-[6rem]">
                                            {galleryImages[selectedImage].content}
                                        </span>
                                    )}

                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        {product.discount > 0 && (
                                            <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                                -{product.discount}%
                                            </span>
                                        )}
                                        {product.badge && (
                                            <span className="bg-blue-700 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                {product.badge}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Mobile thumbnails */}
                                <div className="lg:hidden grid grid-cols-4 gap-3">
                                    {galleryImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`aspect-square rounded-lg flex items-center justify-center text-2xl border transition-all ${selectedImage === idx ? "border-blue-600" : "border-gray-100 hover:border-gray-300 bg-white"
                                                } ${img.bg}`}
                                        >
                                            {img.type === "video" ? <PlayCircle className="w-6 h-6" /> : img.content}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Product Details + Sticky Purchase Panel */}
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-1">
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                    {product.title}
                                </h1>

                                {/* Ratings & SKU */}
                                <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                                    <div className="flex items-center text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-current" : "text-gray-300"}`} />
                                        ))}
                                        <span className="ml-2 text-gray-600 font-medium">
                                            {product.rating} ({product.totalReviews} reviews)
                                        </span>
                                    </div>
                                    <span className="text-gray-300">|</span>
                                    <span className="text-gray-500">SKU: <span className="text-gray-900 font-medium">KNEX-{product.id.padStart(4, '0')}</span></span>
                                    <span className="text-gray-300">|</span>
                                    <span className={`font-medium ${product.assured ? "text-green-600" : "text-red-500"}`}>
                                        {product.assured ? "In Stock" : "Out of Stock"}
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="flex items-end gap-3 mb-6">
                                    <span className="text-3xl font-bold text-blue-600">Tk {product.price.toLocaleString()}</span>
                                    {product.originalPrice > product.price && (
                                        <span className="text-lg text-gray-400 line-through mb-1">Tk {product.originalPrice.toLocaleString()}</span>
                                    )}
                                </div>

                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {extendedProductData.description}
                                </p>

                                <div className="h-px bg-gray-100 w-full mb-6"></div>

                                {/* Variable Product Options */}
                                <div className="space-y-6 mb-8">
                                    {/* Colors */}
                                    <div>
                                        <span className="block text-sm font-medium text-gray-900 mb-3">Color: <span className="text-gray-500 font-normal">{selectedColor.name}</span></span>
                                        <div className="flex flex-wrap gap-3">
                                            {extendedProductData.colors.map((color) => (
                                                <button
                                                    key={color.name}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${selectedColor.name === color.name
                                                        ? "border-blue-600 ring-2 ring-blue-100 scale-110"
                                                        : "border-transparent hover:scale-105"
                                                        }`}
                                                    style={{ backgroundColor: color.value }}
                                                    title={color.name}
                                                >
                                                    {selectedColor.name === color.name && (
                                                        <Check className={`w-5 h-5 ${color.name === 'White' ? 'text-black' : 'text-white'}`} />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sizes */}
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="block text-sm font-medium text-gray-900">Size: <span className="text-gray-500 font-normal">{selectedSize}</span></span>
                                            <button className="text-xs text-blue-600 hover:underline">Size Guide</button>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {extendedProductData.sizes.map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`min-w-[3rem] h-10 px-3 rounded-lg border font-medium text-sm transition-all ${selectedSize === size
                                                        ? "border-blue-600 bg-blue-50 text-blue-600"
                                                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                    {/* Quantity */}
                                    <div className="flex items-center border border-gray-300 rounded-lg h-12 w-fit">
                                        <button
                                            onClick={() => handleQuantityChange("dec")}
                                            className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <input
                                            type="text"
                                            value={quantity}
                                            readOnly
                                            className="w-12 h-full text-center border-x border-gray-300 text-gray-900 font-medium focus:outline-none"
                                        />
                                        <button
                                            onClick={() => handleQuantityChange("inc")}
                                            className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Add to Cart & Buy Now */}
                                    <div className="flex flex-1 gap-3">
                                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-200">
                                            <ShoppingCart className="w-5 h-5" />
                                            Add to Cart
                                        </button>
                                        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold h-12 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-200">
                                            Buy Now
                                        </button>
                                    </div>
                                </div>

                                {/* Meta Actions */}
                                <div className="flex items-center gap-6 text-sm text-gray-500">
                                    <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                                        <Heart className="w-4 h-4" />
                                        Add to Wishlist
                                    </button>
                                    <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                                        <Share2 className="w-4 h-4" />
                                        Share Product
                                    </button>
                                </div>

                                {/* Product Meta */}
                                <div className="mt-8 pt-6 border-t border-gray-100 space-y-2 text-sm">
                                    <div className="flex">
                                        <span className="w-24 text-gray-500">Brand:</span>
                                        <span className="text-gray-900 font-medium">{product.brand}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="w-24 text-gray-500">Category:</span>
                                        <span className="text-blue-600 hover:underline cursor-pointer capitalize">{product.category}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="w-24 text-gray-500">Tags:</span>
                                        <span className="text-gray-600">Modern, Electronics, Best Seller</span>
                                    </div>
                                </div>

                            </div>


                        </div>
                    </div>

                    {/* Mobile sticky buy bar */}
                    <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
                        <div className="bg-white border border-gray-100 rounded-lg p-3 flex items-center gap-3 shadow-lg">
                            <div className="flex-1">
                                <div className="text-sm text-gray-500">Tk {product.price.toLocaleString()}</div>
                                <div className="text-xs text-gray-400 line-through">Tk {product.originalPrice.toLocaleString()}</div>
                            </div>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Add</button>
                            <button className="bg-green-600 text-white px-4 py-2 rounded-lg">Buy</button>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="border-t border-gray-200">
                        <div className="flex border-b border-gray-200 overflow-x-auto">
                            {["description", "additional info", "reviews"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-8 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab
                                        ? "border-blue-600 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>
                        <div className="p-6 lg:p-10 bg-gray-50/50 min-h-[300px]">
                            {activeTab === "description" && (
                                <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: extendedProductData.longDescription }} />
                            )}
                            {activeTab === "additional info" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-w-3xl">
                                    {product.features.map((feature, idx) => (
                                        <div key={idx} className="flex border-b border-gray-200 py-3">
                                            <span className="font-medium text-gray-900 w-1/2">{feature.split(':')[0]}</span>
                                            <span className="text-gray-600 w-1/2">{feature.split(':')[1] || "Yes"}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeTab === "reviews" && (
                                <div className="space-y-6 max-w-4xl">
                                    {extendedProductData.reviews.map((review) => (
                                        <div key={review.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                        {review.user.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">{review.user}</h4>
                                                        <div className="flex text-yellow-400 text-xs mt-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-400">{review.date}</span>
                                            </div>
                                            <p className="text-gray-600">{review.comment}</p>
                                        </div>
                                    ))}
                                    <button className="mt-4 text-blue-600 font-medium hover:underline">Write a Review</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                        <span className="w-1 h-8 bg-blue-600 rounded-full block"></span>
                        Related Products
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4).map((relatedProduct) => (
                            <Link href={`/products/${relatedProduct.id}`} key={relatedProduct.id} className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                                <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-500">
                                    {relatedProduct.image}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {relatedProduct.title}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-blue-600">Tk {relatedProduct.price.toLocaleString()}</span>
                                        <div className="flex items-center text-yellow-400 text-xs">
                                            <Star className="w-3 h-3 fill-current" />
                                            <span className="ml-1 text-gray-500">{relatedProduct.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
