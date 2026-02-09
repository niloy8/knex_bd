"use client";
import { Eye, Heart, Package, Star, Check } from "lucide-react";
import Image from "next/image";

interface Product {
    id?: string;
    title?: string;
    price?: number;
    originalPrice?: number;
    category?: string;
    brand?: string;
    sku?: string;
    rating?: number;
    totalReviews?: number;
    image?: string;
    features?: string[];
    assured?: boolean;
}

interface ProductPreviewProps {
    product: Product;
    mainImage: string;
    gallery: string[];
    productType: string;
    swatchType: "color" | "image";
    colors: string[];
    imageSwatch: { name: string; image: string }[];
    sizes: string[];
    displayOptions: string[];
    variants: { name: string; values: string[] }[];
    features: string[];
    description: string;
    tags: string[];
}

export default function ProductPreview({ product, mainImage, gallery, productType, swatchType, colors, imageSwatch, sizes, variants, features, description, tags }: ProductPreviewProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Frontend Preview
            </h2>
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Image Gallery */}
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            {gallery.length > 0 && (
                                <div className="flex flex-col gap-2" suppressHydrationWarning>
                                    {gallery.slice(0, 6).map((img, idx) => (
                                        <div key={idx} className="relative w-16 h-16 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 shrink-0 overflow-hidden cursor-pointer">
                                            <Image src={img} alt={`Thumb ${idx + 1}`} fill className="object-cover" unoptimized />
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="relative flex-1 aspect-square bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden" suppressHydrationWarning>
                                {mainImage ? <Image src={mainImage} alt="Product" fill className="object-cover" unoptimized /> : <Package className="w-16 h-16 text-gray-300" />}
                                <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all group">
                                    <Heart className="w-5 h-5 text-gray-400 group-hover:text-red-500 group-hover:fill-red-500 transition-all" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{product.title || "Product Title"}</h1>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">{product.rating || 0} ({product.totalReviews || 0} reviews)</span>
                            </div>
                            {product.sku && <p className="text-sm text-gray-500 mt-2">SKU: {product.sku}</p>}
                        </div>

                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-blue-600">Tk {product.price || 0}</span>
                            {product.originalPrice && product.price && product.originalPrice > product.price && (
                                <>
                                    <span className="text-lg text-gray-400 line-through">Tk {product.originalPrice}</span>
                                    <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                    </span>
                                </>
                            )}
                        </div>

                        {productType === "variable" && (
                            <>
                                {swatchType === "color" && colors.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                                        <div className="flex gap-2">
                                            {colors.map((color, idx) => (
                                                <button key={idx} className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-blue-500" style={{ backgroundColor: color }} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {swatchType === "image" && imageSwatch.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Strap Color</label>
                                        <div className="flex gap-2 flex-wrap" suppressHydrationWarning>
                                            {imageSwatch.map((swatch, idx) => (
                                                <button key={idx} className="w-16 h-16 rounded-lg border-2 border-gray-200 hover:border-blue-500 overflow-hidden">
                                                    <Image src={swatch.image} alt={swatch.name} width={64} height={64} className="object-cover" unoptimized />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {sizes.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                                        <div className="flex gap-2 flex-wrap">
                                            {sizes.map((size, idx) => (
                                                <button key={idx} className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-blue-500">{size}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {variants.length > 0 && (
                            <div className="space-y-3">
                                {variants.map((variant, idx) => (
                                    <div key={idx}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{variant.name}</label>
                                        <div className="flex gap-2 flex-wrap">
                                            {variant.values.map((val, vIdx) => (
                                                <button key={vIdx} className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-blue-500">{val}</button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-4">
                            <div className="flex items-center border border-gray-200 rounded-lg">
                                <button className="px-3 py-2 hover:bg-gray-100">-</button>
                                <span className="px-4 py-2 border-x border-gray-200">1</span>
                                <button className="px-3 py-2 hover:bg-gray-100">+</button>
                            </div>
                            <button className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">Add to Cart</button>
                            <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700">Buy Now</button>
                        </div>

                        {features.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-2">Features:</h3>
                                <ul className="space-y-1">
                                    {features.map((feature, idx) => (
                                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                            <Check className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {description && (
                            <div className="pt-4 border-t border-gray-200">
                                <h3 className="text-sm font-medium text-gray-900 mb-2">Description:</h3>
                                <div className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
                            </div>
                        )}

                        {tags.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-2">Tags:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pt-4 border-t border-gray-200 space-y-1 text-sm">
                            {product.brand && <p><span className="font-medium">Brand:</span> {product.brand}</p>}
                            {product.category && <p><span className="font-medium">Category:</span> {product.category}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
