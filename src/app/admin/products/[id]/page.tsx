/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import ProtectedAdmin from "@/components/admin/ProtectAdmin";
import { adminData } from "@/lib/adminData";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, X, Eye, Tag, FileText, Plus, Trash2, ImagePlus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminEditProduct() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [product, setProduct] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [mainImage, setMainImage] = useState<string>("");
    const [gallery, setGallery] = useState<string[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const [sizes, setSizes] = useState<string[]>([]);
    const [features, setFeatures] = useState<string[]>([]);
    const [productType, setProductType] = useState<string>("simple");
    const [showPreview, setShowPreview] = useState(false);
    const [swatchType, setSwatchType] = useState<"color" | "image">("color");
    const [imageSwatch, setImageSwatch] = useState<{ name: string; image: string }[]>([]);
    const [displayOptions, setDisplayOptions] = useState<string[]>([]);
    const [description, setDescription] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);
    const [variants, setVariants] = useState<{ name: string; values: string[]; prices?: { [key: string]: number } }[]>([]);

    useEffect(() => {
        const p = adminData.getProduct(id);
        if (p) {
            setProduct(p);
            setMainImage(p.image || "");
            setGallery((p as any).gallery || []);
            setColors((p as any).colors || []);
            setSizes((p as any).sizes || []);
            setFeatures(p.features || []);
            setImageSwatch((p as any).imageSwatch || []);
            setDisplayOptions((p as any).displayOptions || []);
            setDescription((p as any).description || "");
            setTags((p as any).tags || []);
            setVariants((p as any).variants || []);
            const hasVariants = (p as any).colors || (p as any).sizes || (p as any).imageSwatch;
            setProductType(hasVariants ? "variable" : "simple");
            setSwatchType((p as any).imageSwatch?.length > 0 ? "image" : "color");
        } else {
            setProduct({
                id: "",
                title: "",
                price: 0,
                originalPrice: 0,
                category: "",
                brand: "",
                features: [],
                rating: 0,
                totalReviews: 0,
                sku: "",
            });
        }
    }, [id]);

    const handleSave = async () => {
        setSaving(true);

        // Build product object with all data
        const productData = {
            ...product,
            image: mainImage,
            gallery,
            features,
            description,
            tags,
            variants,
            ...(productType === "variable" && {
                ...(swatchType === "color" ? { colors } : { imageSwatch }),
                sizes,
                displayOptions,
            }),
        };

        console.log("Saving product:", productData);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
        alert("Product saved successfully!");
        router.push("/admin/products");
    };

    if (!product) return <div>Loading...</div>;

    return (
        <ProtectedAdmin>
            <div className="space-y-6 max-w-4xl">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {id === "new" ? "Add New Product" : "Edit Product"}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {id === "new" ? "Create a new product" : `Update product details`}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg border border-gray-100 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Title</label>
                            <input
                                type="text"
                                value={product.title}
                                onChange={(e) => setProduct({ ...product, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Enter product title"
                            />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Product Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                placeholder="Enter detailed product description..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price (Tk)</label>
                            <input
                                type="number"
                                value={product.price}
                                onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (Tk)</label>
                            <input
                                type="number"
                                value={product.originalPrice}
                                onChange={(e) => setProduct({ ...product, originalPrice: Number(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <input
                                type="text"
                                value={product.category}
                                onChange={(e) => setProduct({ ...product, category: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="e.g., Electronics"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                            <input
                                type="text"
                                value={product.brand}
                                onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="e.g., DELL"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                            <input
                                type="text"
                                value={product.sku || ""}
                                onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="e.g., KNEX-0001"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rating (0-5)</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                value={product.rating || 0}
                                onChange={(e) => setProduct({ ...product, rating: Number(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="4.5"
                            />
                        </div>

                        {/* Tags */}
                        <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Tag className="w-4 h-4" />
                                Tags
                            </label>
                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {tags.map((tag, idx) => (
                                        <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                            {tag}
                                            <X className="w-3 h-3 cursor-pointer" onClick={() => setTags(tags.filter((_, i) => i !== idx))} />
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Add tag (e.g., Modern, Electronics, Best Seller)"
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            const input = e.target as HTMLInputElement;
                                            if (input.value.trim()) {
                                                setTags([...tags, input.value.trim()]);
                                                input.value = '';
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Product Type */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        checked={productType === "simple"}
                                        onChange={() => setProductType("simple")}
                                        className="text-blue-600"
                                    />
                                    <span className="text-sm">Simple Product</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        checked={productType === "variable"}
                                        onChange={() => setProductType("variable")}
                                        className="text-blue-600"
                                    />
                                    <span className="text-sm">Variable Product (Colors, Sizes)</span>
                                </label>
                            </div>
                        </div>

                        {/* Variable Product Options */}
                        {productType === "variable" && (
                            <>
                                {/* Swatch Type Selection */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Variation Type</label>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                checked={swatchType === "color"}
                                                onChange={() => setSwatchType("color")}
                                                className="text-blue-600"
                                            />
                                            <span className="text-sm">Color Swatches (Solid Colors)</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                checked={swatchType === "image"}
                                                onChange={() => setSwatchType("image")}
                                                className="text-blue-600"
                                            />
                                            <span className="text-sm">Image Swatches (Product Variations)</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Color Swatches */}
                                {swatchType === "color" && (
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
                                        <div className="space-y-3">
                                            {colors.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {colors.map((color, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                                                            <div className="w-6 h-6 rounded-full border-2 border-white shadow" style={{ backgroundColor: color }} />
                                                            <span className="text-sm">{color}</span>
                                                            <button
                                                                onClick={() => setColors(colors.filter((_, i) => i !== idx))}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Enter color (e.g., #3b82f6 or blue)"
                                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            const input = e.target as HTMLInputElement;
                                                            if (input.value.trim()) {
                                                                setColors([...colors, input.value.trim()]);
                                                                input.value = '';
                                                            }
                                                        }
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                                    onClick={(e) => {
                                                        const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                                                        if (input?.value.trim()) {
                                                            setColors([...colors, input.value.trim()]);
                                                            input.value = '';
                                                        }
                                                    }}
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Image Swatches */}
                                {swatchType === "image" && (
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Product Variations (Image Swatches)
                                        </label>
                                        <p className="text-xs text-gray-500 mb-3">Add different product variations with images (e.g., different strap colors for watches)</p>
                                        <div className="space-y-3">
                                            {imageSwatch.length > 0 && (
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {imageSwatch.map((swatch, idx) => (
                                                        <div key={idx} className="relative border-2 border-gray-200 rounded-lg p-2 group">
                                                            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                                                                <Image src={swatch.image} alt={swatch.name} fill className="object-cover" />
                                                            </div>
                                                            <p className="text-xs font-medium text-center truncate">{swatch.name}</p>
                                                            <button
                                                                onClick={() => setImageSwatch(imageSwatch.filter((_, i) => i !== idx))}
                                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    id="swatchName"
                                                    placeholder="Variation name (e.g., Pink Strap)"
                                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                />
                                                <input
                                                    type="text"
                                                    id="swatchImage"
                                                    placeholder="Image URL"
                                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            const nameInput = document.getElementById('swatchName') as HTMLInputElement;
                                                            const imageInput = e.target as HTMLInputElement;
                                                            if (nameInput?.value.trim() && imageInput.value.trim()) {
                                                                setImageSwatch([...imageSwatch, {
                                                                    name: nameInput.value.trim(),
                                                                    image: imageInput.value.trim()
                                                                }]);
                                                                nameInput.value = '';
                                                                imageInput.value = '';
                                                            }
                                                        }
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-2"
                                                    onClick={() => {
                                                        const nameInput = document.getElementById('swatchName') as HTMLInputElement;
                                                        const imageInput = document.getElementById('swatchImage') as HTMLInputElement;
                                                        if (nameInput?.value.trim() && imageInput?.value.trim()) {
                                                            setImageSwatch([...imageSwatch, {
                                                                name: nameInput.value.trim(),
                                                                image: imageInput.value.trim()
                                                            }]);
                                                            nameInput.value = '';
                                                            imageInput.value = '';
                                                        }
                                                    }}
                                                >
                                                    <Upload className="w-4 h-4" />
                                                    Add Variation
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Sizes */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap gap-2">
                                            {["S", "M", "L", "XL", "XXL"].map((size) => (
                                                <button
                                                    key={size}
                                                    type="button"
                                                    onClick={() => {
                                                        if (sizes.includes(size)) {
                                                            setSizes(sizes.filter(s => s !== size));
                                                        } else {
                                                            setSizes([...sizes, size]);
                                                        }
                                                    }}
                                                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${sizes.includes(size)
                                                            ? "border-blue-600 bg-blue-50 text-blue-700"
                                                            : "border-gray-200 hover:border-gray-300"
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Add custom size (e.g., 32, 34, XS)"
                                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        const input = e.target as HTMLInputElement;
                                                        if (input.value.trim() && !sizes.includes(input.value.trim())) {
                                                            setSizes([...sizes, input.value.trim()]);
                                                            input.value = '';
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Display Options (for watches, screens, etc.) */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Display Size / Additional Options
                                    </label>
                                    <p className="text-xs text-gray-500 mb-2">Add display sizes or other options (e.g., 1.39 inch, 35.3 mm)</p>
                                    <div className="space-y-3">
                                        {displayOptions.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {displayOptions.map((option, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                                                        <span className="text-sm font-medium text-blue-700">{option}</span>
                                                        <button
                                                            onClick={() => setDisplayOptions(displayOptions.filter((_, i) => i !== idx))}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Add option (e.g., 1.39 inch)"
                                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        const input = e.target as HTMLInputElement;
                                                        if (input.value.trim()) {
                                                            setDisplayOptions([...displayOptions, input.value.trim()]);
                                                            input.value = '';
                                                        }
                                                    }
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                                                onClick={(e) => {
                                                    const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                                                    if (input?.value.trim()) {
                                                        setDisplayOptions([...displayOptions, input.value.trim()]);
                                                        input.value = '';
                                                    }
                                                }}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* SKU */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                            <input
                                type="text"
                                value={product.sku || ""}
                                onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="e.g., KNEX-0001"
                            />
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rating (0-5)</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                value={product.rating || 0}
                                onChange={(e) => setProduct({ ...product, rating: Number(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="4.5"
                            />
                        </div>

                        {/* Features */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                            <div className="space-y-3">
                                {features.length > 0 && (
                                    <div className="space-y-2">
                                        {features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                                                <span className="flex-1 text-sm">{feature}</span>
                                                <button
                                                    onClick={() => setFeatures(features.filter((_, i) => i !== idx))}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Add product feature"
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                const input = e.target as HTMLInputElement;
                                                if (input.value.trim()) {
                                                    setFeatures([...features, input.value.trim()]);
                                                    input.value = '';
                                                }
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                        onClick={(e) => {
                                            const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                                            if (input?.value.trim()) {
                                                setFeatures([...features, input.value.trim()]);
                                                input.value = '';
                                            }
                                        }}
                                    >
                                        Add Feature
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Main Product Image */}
                        <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <ImagePlus className="w-4 h-4" />
                                Main Product Image
                            </label>
                            <div className="flex items-center gap-4">
                                {mainImage && (
                                    <div className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden">
                                        <Image src={mainImage} alt="Main" fill className="object-cover" />
                                    </div>
                                )}
                                <div className="flex-1 flex gap-2">
                                    <input
                                        type="text"
                                        value={mainImage}
                                        onChange={(e) => setMainImage(e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="Enter image URL or emoji"
                                    />
                                    <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer flex items-center gap-2">
                                        <Upload className="w-4 h-4" />
                                        Upload
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setMainImage(URL.createObjectURL(file));
                                            }
                                        }} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Image Gallery */}
                        <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <ImagePlus className="w-4 h-4" />
                                Image Gallery
                            </label>
                            <div className="space-y-3">
                                {gallery.length > 0 && (
                                    <div className="flex flex-wrap gap-3">
                                        {gallery.map((img, idx) => (
                                            <div key={idx} className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden group">
                                                <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                                                <button
                                                    onClick={() => setGallery(gallery.filter((_, i) => i !== idx))}
                                                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter image URL"
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                const input = e.target as HTMLInputElement;
                                                if (input.value.trim()) {
                                                    setGallery([...gallery, input.value.trim()]);
                                                    input.value = '';
                                                }
                                            }
                                        }}
                                    />
                                    <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer flex items-center gap-2">
                                        <Upload className="w-4 h-4" />
                                        Upload
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setGallery([...gallery, URL.createObjectURL(file)]);
                                            }
                                        }} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Product Variants (RAM, Storage, etc.) */}
                        <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Product Variants (RAM, Storage, etc.)
                            </label>
                            <p className="text-xs text-gray-500 mb-3">Add variants like RAM (8GB, 12GB, 16GB) or Storage (128GB, 256GB)</p>

                            {variants.map((variant, vIdx) => (
                                <div key={vIdx} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <input
                                            type="text"
                                            value={variant.name}
                                            onChange={(e) => {
                                                const newVariants = [...variants];
                                                newVariants[vIdx].name = e.target.value;
                                                setVariants(newVariants);
                                            }}
                                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Variant name (e.g., RAM, Storage)"
                                        />
                                        <button
                                            onClick={() => setVariants(variants.filter((_, i) => i !== vIdx))}
                                            className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap gap-2">
                                            {variant.values.map((val, valIdx) => (
                                                <div key={valIdx} className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-lg">
                                                    <span className="text-sm">{val}</span>
                                                    <X
                                                        className="w-3 h-3 cursor-pointer text-red-500"
                                                        onClick={() => {
                                                            const newVariants = [...variants];
                                                            newVariants[vIdx].values = newVariants[vIdx].values.filter((_, i) => i !== valIdx);
                                                            setVariants(newVariants);
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Add value (e.g., 8GB) and press Enter"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    const input = e.target as HTMLInputElement;
                                                    if (input.value.trim()) {
                                                        const newVariants = [...variants];
                                                        newVariants[vIdx].values.push(input.value.trim());
                                                        setVariants(newVariants);
                                                        input.value = '';
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => setVariants([...variants, { name: '', values: [] }])}
                                className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add New Variant
                            </button>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Stock Status</label>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        checked={product.assured === true}
                                        onChange={() => setProduct({ ...product, assured: true })}
                                        className="text-blue-600"
                                    />
                                    <span className="text-sm">In Stock</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        checked={product.assured === false}
                                        onChange={() => setProduct({ ...product, assured: false })}
                                        className="text-blue-600"
                                    />
                                    <span className="text-sm">Out of Stock</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? "Saving..." : "Save Product"}
                        </button>
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                            {showPreview ? "Hide Preview" : "Show Preview"}
                        </button>
                        <Link
                            href="/admin/products"
                            className="px-4 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </Link>
                    </div>
                </div>

                {/* Live Preview */}
                {showPreview && (
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
                                        {/* Thumbnail Strip (Vertical) */}
                                        {gallery.length > 0 && (
                                            <div className="flex flex-col gap-2">
                                                {gallery.slice(0, 6).map((img, idx) => (
                                                    <div key={idx} className="relative w-16 h-16 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 flex-shrink-0 overflow-hidden cursor-pointer transition-colors">
                                                        <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Main Image */}
                                        <div className="relative flex-1 aspect-square bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                                            {mainImage ? (
                                                <Image src={mainImage} alt="Product" fill className="object-cover" />
                                            ) : (
                                                <span className="text-6xl">📦</span>
                                            )}
                                            {/* Wishlist Icon */}
                                            <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                                                <span className="text-xl">🤍</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Product Info */}
                                <div className="space-y-6">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">{product.title || "Product Title"}</h1>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className={i < Math.floor(product.rating || 0) ? "text-yellow-400" : "text-gray-300"}>⭐</span>
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-600">{product.rating || 0} ({product.totalReviews || 0} reviews)</span>
                                        </div>
                                        {product.sku && (
                                            <p className="text-sm text-gray-500 mt-2">SKU: {product.sku}</p>
                                        )}
                                    </div>

                                    <div className="flex items-baseline gap-3">
                                        <span className="text-3xl font-bold text-blue-600">Tk {product.price || 0}</span>
                                        {product.originalPrice > product.price && (
                                            <>
                                                <span className="text-lg text-gray-400 line-through">Tk {product.originalPrice}</span>
                                                <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/* Variable Product Options */}
                                    {productType === "variable" && (
                                        <>
                                            {/* Color Swatches */}
                                            {swatchType === "color" && colors.length > 0 && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Color: {colors[0]}
                                                    </label>
                                                    <div className="flex gap-2">
                                                        {colors.map((color, idx) => (
                                                            <button
                                                                key={idx}
                                                                className={`w-10 h-10 rounded-full border-2 ${idx === 0 ? 'border-blue-600' : 'border-gray-200'} flex items-center justify-center`}
                                                                style={{ backgroundColor: color }}
                                                            >
                                                                {idx === 0 && <span className="text-white">✓</span>}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Image Swatches */}
                                            {swatchType === "image" && imageSwatch.length > 0 && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Strap Color: {imageSwatch[0]?.name}
                                                    </label>
                                                    <div className="flex gap-2 flex-wrap">
                                                        {imageSwatch.map((swatch, idx) => (
                                                            <button
                                                                key={idx}
                                                                className={`relative w-16 h-16 rounded-lg border-2 ${idx === 0 ? 'border-blue-600' : 'border-gray-200'
                                                                    } overflow-hidden`}
                                                            >
                                                                <Image src={swatch.image} alt={swatch.name} fill className="object-cover" />
                                                                {idx === 0 && (
                                                                    <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                                                                        <span className="text-white text-xl">✓</span>
                                                                    </div>
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Sizes */}
                                            {sizes.length > 0 && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Size: {sizes[0]}
                                                    </label>
                                                    <div className="flex gap-2 flex-wrap">
                                                        {sizes.map((size, idx) => (
                                                            <button
                                                                key={idx}
                                                                className={`px-4 py-2 rounded-lg border-2 ${idx === 0
                                                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                                        : 'border-gray-200 hover:border-gray-300'
                                                                    }`}
                                                            >
                                                                {size}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Display Options */}
                                            {displayOptions.length > 0 && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Display Size
                                                    </label>
                                                    <div className="flex gap-2 flex-wrap">
                                                        {displayOptions.map((option, idx) => (
                                                            <button
                                                                key={idx}
                                                                className={`px-4 py-2 rounded-lg border-2 ${idx === 0
                                                                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                                                                        : 'border-gray-200 hover:border-gray-300'
                                                                    }`}
                                                            >
                                                                {option}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* Variants */}
                                    {variants.length > 0 && (
                                        <div className="space-y-3">
                                            {variants.map((variant, idx) => (
                                                <div key={idx}>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        {variant.name}: {variant.values[0] || 'Select'}
                                                    </label>
                                                    <div className="flex gap-2 flex-wrap">
                                                        {variant.values.map((val, valIdx) => (
                                                            <button
                                                                key={valIdx}
                                                                className={`px-4 py-2 rounded-lg border-2 ${valIdx === 0
                                                                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                                                                        : 'border-gray-200 hover:border-gray-300'
                                                                    }`}
                                                            >
                                                                {val}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Quantity & Buttons */}
                                    <div className="flex gap-4">
                                        <div className="flex items-center border border-gray-200 rounded-lg">
                                            <button className="px-3 py-2 hover:bg-gray-100">-</button>
                                            <span className="px-4 py-2 border-x border-gray-200">1</span>
                                            <button className="px-3 py-2 hover:bg-gray-100">+</button>
                                        </div>
                                        <button className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
                                            Add to Cart
                                        </button>
                                        <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700">
                                            Buy Now
                                        </button>
                                    </div>

                                    {/* Features */}
                                    {features.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900 mb-2">Features:</h3>
                                            <ul className="space-y-1">
                                                {features.map((feature, idx) => (
                                                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                                        <span className="text-green-500 mt-0.5">✓</span>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Description */}
                                    {description && (
                                        <div className="pt-4 border-t border-gray-200">
                                            <h3 className="text-sm font-medium text-gray-900 mb-2">Description:</h3>
                                            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
                                        </div>
                                    )}

                                    {/* Tags */}
                                    {tags.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900 mb-2">Tags:</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {tags.map((tag, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Brand & Category */}
                                    <div className="pt-4 border-t border-gray-200 space-y-1 text-sm">
                                        {product.brand && (
                                            <p><span className="font-medium">Brand:</span> {product.brand}</p>
                                        )}
                                        {product.category && (
                                            <p><span className="font-medium">Category:</span> {product.category}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedAdmin>
    );
}
