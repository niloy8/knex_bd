"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    Star,
    Heart,
    Share2,
    ShoppingCart,
    Check,
    Minus,
    Plus,
    ChevronRight,
    Loader2,
    Package
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Review {
    id: number;
    rating: number;
    comment: string;
    userName: string;
    createdAt: string;
}

interface ProductVariant {
    id: number;
    name: string;
    image: string;
    images: string[];
    price?: number;
    stock: number;
}

interface Product {
    id: number;
    title: string;
    slug: string;
    price: number;
    originalPrice: number;
    discount: number;
    rating: number;
    totalRatings: number;
    totalReviews: number;
    image: string;
    images: string[];
    features: string[];
    description: string;
    inStock: boolean;
    stockQuantity: number;
    sku: string;
    badge?: string;
    category: { id: number; name: string; slug: string } | null;
    subCategory: { id: number; name: string; slug: string } | null;
    brand: { id: number; name: string } | null;
    colors?: string[];
    sizes?: string[];
    productType?: string;
    swatchType?: string;
    variants?: ProductVariant[];
    reviews?: Review[];
}

// Default color palette for color picker
const colorPalette: { [key: string]: string } = {
    red: "#ef4444", blue: "#3b82f6", green: "#22c55e", yellow: "#eab308",
    black: "#000000", white: "#ffffff", pink: "#ec4899", purple: "#8b5cf6",
    orange: "#f97316", gray: "#6b7280", brown: "#92400e", navy: "#1e3a8a",
};

export default function SingleProductPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [activeTab, setActiveTab] = useState("description");

    // Review form state
    const [reviewName, setReviewName] = useState("");
    const [reviewEmail, setReviewEmail] = useState("");
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    const fetchProduct = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/products/${id}`);
            if (!res.ok) {
                router.push("/products");
                return;
            }
            const data = await res.json();
            setProduct(data);

            // Set default selections
            if (data.colors?.length) setSelectedColor(data.colors[0]);
            if (data.sizes?.length) setSelectedSize(data.sizes[0]);

            // Don't auto-select variant - let user click to choose
            // This shows main product images first, then variant images on click
            // if (data.variants?.length > 0) {
            //     setSelectedVariant(data.variants[0]);
            // }

            // Fetch related products from same category
            if (data.category?.slug) {
                const relatedRes = await fetch(`${API_URL}/products?category=${data.category.slug}&limit=4`);
                const relatedData = await relatedRes.json();
                setRelatedProducts((relatedData.products || []).filter((p: Product) => p.id !== data.id));
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            router.push("/products");
        } finally {
            setLoading(false);
        }
    }, [id, router]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">Product not found</p>
            </div>
        );
    }

    // Build gallery from product images OR selected variant images
    const getGalleryImages = () => {
        // If variant is selected and has images, use those
        if (selectedVariant?.images?.length) {
            return selectedVariant.images.map(img => ({ type: "image" as const, content: img, bg: "bg-gray-100" }));
        }
        // Otherwise use main product images (main image + gallery)
        if (product.images?.length > 0) {
            return product.images.map(img => ({ type: "image" as const, content: img, bg: "bg-gray-100" }));
        }
        // Fallback to single image
        if (product.image) {
            return [{ type: "image" as const, content: product.image, bg: "bg-gray-100" }];
        }
        // If product has variants but no main images, use first variant's images as default
        if (product.variants?.[0]?.images?.length) {
            return product.variants[0].images.map(img => ({ type: "image" as const, content: img, bg: "bg-gray-100" }));
        }
        return [{ type: "placeholder" as const, content: "", bg: "bg-gray-100" }];
    };

    const galleryImages = getGalleryImages();

    const handleQuantityChange = (type: "inc" | "dec") => {
        if (type === "inc") setQuantity(prev => prev + 1);
        if (type === "dec" && quantity > 1) setQuantity(prev => prev - 1);
    };

    // Handle variant selection - reset image index and update gallery
    const handleVariantSelect = (variant: ProductVariant) => {
        setSelectedVariant(variant);
        setSelectedImage(0); // Reset to first image of the variant
    };

    // Get color hex value from name
    const getColorValue = (colorName: string) => {
        const lower = colorName.toLowerCase();
        return colorPalette[lower] || (lower.startsWith("#") ? lower : "#6b7280");
    };

    // Handle review submission
    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewName || !reviewComment) {
            alert("Please fill in your name and comment");
            return;
        }

        setSubmittingReview(true);
        try {
            const res = await fetch(`${API_URL}/products/${product.id}/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rating: reviewRating,
                    comment: reviewComment,
                    userName: reviewName,
                    userEmail: reviewEmail,
                }),
            });

            if (res.ok) {
                // Refresh product to get updated reviews
                await fetchProduct();
                setReviewName("");
                setReviewEmail("");
                setReviewRating(5);
                setReviewComment("");
                alert("Review submitted successfully!");
            } else {
                const error = await res.json();
                alert(error.error || "Failed to submit review");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Failed to submit review");
        } finally {
            setSubmittingReview(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
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
                                        className={`w-16 h-16 rounded-lg flex items-center justify-center border transition-all ${selectedImage === idx ? "border-blue-600 ring-2 ring-blue-100 scale-105" : "border-gray-100 hover:border-gray-300 bg-white"
                                            } ${img.bg}`}
                                        title={`View ${idx + 1}`}
                                    >
                                        {img.type === "placeholder" ? <Package className="w-6 h-6 text-gray-400" /> : <Image src={img.content} alt="" width={64} height={64} className="object-cover rounded-md" unoptimized />}
                                    </button>
                                ))}
                            </div>

                            <div className="flex-1 space-y-4">
                                {/* Main Image */}
                                <div className={`relative aspect-4/3 rounded-xl overflow-hidden flex items-center justify-center ${galleryImages[selectedImage].bg} border border-gray-100`}>
                                    {galleryImages[selectedImage].type === "placeholder" ? (
                                        <Package className="w-24 h-24 text-gray-300" />
                                    ) : (
                                        <Image src={galleryImages[selectedImage].content} alt={product.title} fill className="object-contain" unoptimized />
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
                                            className={`aspect-square rounded-lg flex items-center justify-center border transition-all ${selectedImage === idx ? "border-blue-600" : "border-gray-100 hover:border-gray-300 bg-white"
                                                } ${img.bg}`}
                                        >
                                            {img.type === "placeholder" ? <Package className="w-6 h-6 text-gray-400" /> : <Image src={img.content} alt="" width={48} height={48} className="object-cover rounded-md" unoptimized />}
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
                                            {product.rating.toFixed(1)} ({product.totalReviews} reviews)
                                        </span>
                                    </div>
                                    <span className="text-gray-300">|</span>
                                    <span className="text-gray-500">SKU: <span className="text-gray-900 font-medium">{product.sku || `KNEX-${product.id}`}</span></span>
                                    <span className="text-gray-300">|</span>
                                    <span className={`font-medium ${product.inStock ? "text-green-600" : "text-red-500"}`}>
                                        {product.inStock ? `In Stock (${product.stockQuantity})` : "Out of Stock"}
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="flex items-end gap-3 mb-6">
                                    <span className="text-3xl font-bold text-blue-600">Tk {product.price.toLocaleString()}</span>
                                    {product.originalPrice > product.price && (
                                        <span className="text-lg text-gray-400 line-through mb-1">Tk {product.originalPrice.toLocaleString()}</span>
                                    )}
                                </div>

                                {product.description ? (
                                    <div
                                        className="text-gray-600 mb-6 leading-relaxed prose prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: product.description }}
                                    />
                                ) : (
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        Experience the ultimate quality with this product. Designed with precision and crafted for durability.
                                    </p>
                                )}

                                <div className="h-px bg-gray-100 w-full mb-6"></div>

                                {/* Image Swatches / Variants - Show if product has variants */}
                                {(product.variants?.length ?? 0) > 0 && (
                                    <div className="mb-6">
                                        <span className="block text-sm font-medium text-gray-900 mb-3">
                                            Variant: <span className="text-gray-500 font-normal">{selectedVariant?.name || "Default"}</span>
                                        </span>
                                        <div className="flex flex-wrap gap-4">
                                            {/* Default/Main product option - shows main product images */}
                                            {product.image && (
                                                <div className="flex flex-col items-center gap-1">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedVariant(null);
                                                            setSelectedImage(0);
                                                        }}
                                                        className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${!selectedVariant
                                                            ? "border-blue-600 ring-2 ring-blue-100 scale-105"
                                                            : "border-gray-200 hover:border-gray-300"
                                                            }`}
                                                        title="Default"
                                                    >
                                                        <Image
                                                            src={product.image}
                                                            alt="Default"
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                        />
                                                        {!selectedVariant && (
                                                            <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                                                                <Check className="w-5 h-5 text-white drop-shadow-lg" />
                                                            </div>
                                                        )}
                                                    </button>
                                                    <span className={`text-xs ${!selectedVariant ? "text-blue-600 font-medium" : "text-gray-500"}`}>
                                                        Default
                                                    </span>
                                                </div>
                                            )}
                                            {/* Variant options */}
                                            {product.variants?.map((variant) => (
                                                <div key={variant.id} className="flex flex-col items-center gap-1">
                                                    <button
                                                        onClick={() => handleVariantSelect(variant)}
                                                        className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedVariant?.id === variant.id
                                                            ? "border-blue-600 ring-2 ring-blue-100 scale-105"
                                                            : "border-gray-200 hover:border-gray-300"
                                                            }`}
                                                        title={variant.name}
                                                    >
                                                        <Image
                                                            src={variant.image}
                                                            alt={variant.name}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                        />
                                                        {selectedVariant?.id === variant.id && (
                                                            <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                                                                <Check className="w-5 h-5 text-white drop-shadow-lg" />
                                                            </div>
                                                        )}
                                                    </button>
                                                    <span className={`text-xs ${selectedVariant?.id === variant.id ? "text-blue-600 font-medium" : "text-gray-500"}`}>
                                                        {variant.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Color Swatches - Show if product has colors (and NOT image variants) */}
                                {(product.colors?.length ?? 0) > 0 && (product.variants?.length ?? 0) === 0 && (
                                    <div className="mb-6">
                                        <span className="block text-sm font-medium text-gray-900 mb-3">Color: <span className="text-gray-500 font-normal">{selectedColor}</span></span>
                                        <div className="flex flex-wrap gap-3">
                                            {product.colors?.map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${selectedColor === color
                                                        ? "border-blue-600 ring-2 ring-blue-100 scale-110"
                                                        : "border-transparent hover:scale-105"
                                                        }`}
                                                    style={{ backgroundColor: getColorValue(color) }}
                                                    title={color}
                                                >
                                                    {selectedColor === color && (
                                                        <Check className={`w-5 h-5 ${color.toLowerCase() === 'white' ? 'text-black' : 'text-white'}`} />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Sizes */}
                                {(product.sizes?.length ?? 0) > 0 && (
                                    <div className="mb-8">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="block text-sm font-medium text-gray-900">Size: <span className="text-gray-500 font-normal">{selectedSize}</span></span>
                                            <button className="text-xs text-blue-600 hover:underline">Size Guide</button>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {product.sizes?.map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`min-w-12 h-10 px-3 rounded-lg border font-medium text-sm transition-all ${selectedSize === size
                                                        ? "border-blue-600 bg-blue-50 text-blue-600"
                                                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

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
                                        <span className="text-gray-900 font-medium">{product.brand?.name || "N/A"}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="w-24 text-gray-500">Category:</span>
                                        <span className="text-blue-600 hover:underline cursor-pointer capitalize">{product.category?.name || "N/A"}</span>
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
                                <div className="prose max-w-none text-gray-600">
                                    {product.description ? (
                                        <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                    ) : (
                                        <p>No description available for this product.</p>
                                    )}
                                </div>
                            )}
                            {activeTab === "additional info" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-w-3xl">
                                    {product.features?.length > 0 ? (
                                        product.features.map((feature, idx) => (
                                            <div key={idx} className="flex border-b border-gray-200 py-3">
                                                <span className="font-medium text-gray-900 w-1/2">{feature.split(':')[0]}</span>
                                                <span className="text-gray-600 w-1/2">{feature.split(':')[1] || "Yes"}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No additional information available.</p>
                                    )}
                                </div>
                            )}
                            {activeTab === "reviews" && (
                                <div className="space-y-8 max-w-4xl">
                                    {/* Existing Reviews */}
                                    {product.reviews && product.reviews.length > 0 ? (
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-semibold text-gray-900">Customer Reviews ({product.reviews.length})</h3>
                                            {product.reviews.map((review) => (
                                                <div key={review.id} className="bg-white p-6 rounded-xl border border-gray-100">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <p className="font-medium text-gray-900">{review.userName}</p>
                                                            <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600">{review.comment}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                                    )}

                                    {/* Write a Review Form */}
                                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
                                        <form onSubmit={handleSubmitReview} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                                    <input
                                                        type="text"
                                                        value={reviewName}
                                                        onChange={(e) => setReviewName(e.target.value)}
                                                        required
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Enter your name"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                                                    <input
                                                        type="email"
                                                        value={reviewEmail}
                                                        onChange={(e) => setReviewEmail(e.target.value)}
                                                        required
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Enter your email"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                                <div className="flex items-center gap-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            type="button"
                                                            key={star}
                                                            onClick={() => setReviewRating(star)}
                                                            className="focus:outline-none"
                                                        >
                                                            <Star
                                                                className={`w-8 h-8 transition-colors ${star <= reviewRating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-300'}`}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                                                <textarea
                                                    value={reviewComment}
                                                    onChange={(e) => setReviewComment(e.target.value)}
                                                    required
                                                    rows={4}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                                    placeholder="Share your experience with this product..."
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={submittingReview}
                                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {submittingReview ? 'Submitting...' : 'Submit Review'}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                            <span className="w-1 h-8 bg-blue-600 rounded-full block"></span>
                            Related Products
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.slice(0, 4).map((relatedProduct) => (
                                <Link href={`/products/${relatedProduct.slug || relatedProduct.id}`} key={relatedProduct.id} className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                                    <div className="aspect-4/3 bg-gray-50 flex items-center justify-center overflow-hidden">
                                        {relatedProduct.images?.[0] ? (
                                            <Image
                                                src={relatedProduct.images[0]}
                                                alt={relatedProduct.title}
                                                width={200}
                                                height={150}
                                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <Package className="w-12 h-12 text-gray-300" />
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {relatedProduct.title}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-blue-600">Tk {relatedProduct.price?.toLocaleString() || 0}</span>
                                            <div className="flex items-center text-yellow-400 text-xs">
                                                <Star className="w-3 h-3 fill-current" />
                                                <span className="ml-1 text-gray-500">{relatedProduct.rating || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}