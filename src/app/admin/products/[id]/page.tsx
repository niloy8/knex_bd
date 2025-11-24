/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import ProtectedAdmin from "@/components/admin/ProtectAdmin";
import { adminData } from "@/lib/adminData";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
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

    useEffect(() => {
        const p = adminData.getProduct(id);
        if (p) {
            setProduct(p);
            setMainImage(p.image || "");
            setGallery(p.gallery || []);
        } else {
            // New product
            setProduct({
                id: "",
                title: "",
                price: 0,
                originalPrice: 0,
                category: "",
                brand: "",
                features: [],
            });
        }
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
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

                        {/* Main Product Image */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Main Product Image</label>
                            <div className="flex items-center gap-4">
                                {mainImage && (
                                    <div className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden">
                                        <Image src={mainImage} alt="Main" fill className="object-cover" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={mainImage}
                                        onChange={(e) => setMainImage(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="Enter image URL or upload"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Enter image URL or use emoji</p>
                                </div>
                            </div>
                        </div>

                        {/* Image Gallery */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Image Gallery</label>
                            <div className="space-y-3">
                                {/* Display existing gallery images */}
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
                                {/* Add new image */}
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
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
                                        onClick={(e) => {
                                            const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                                            if (input?.value.trim()) {
                                                setGallery([...gallery, input.value.trim()]);
                                                input.value = '';
                                            }
                                        }}
                                    >
                                        <Upload className="w-4 h-4" />
                                        Add
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500">Press Enter or click Add to include image URL</p>
                            </div>
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
                        <Link
                            href="/admin/products"
                            className="px-4 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </Link>
                    </div>
                </div>
            </div>
        </ProtectedAdmin>
    );
}
