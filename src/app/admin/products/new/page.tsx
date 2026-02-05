/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react";
import ProtectedAdmin from "@/components/admin/ProtectAdmin";
import ProductFormFields from "@/components/admin/ProductFormFields";
import ProductVariations from "@/components/admin/ProductVariations";
import ProductImages from "@/components/admin/ProductImages";
import ProductVariants from "@/components/admin/ProductVariants";
import ProductPreview from "@/components/admin/ProductPreview";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Category {
    id: string;
    name: string;
    slug: string;
    subCategories?: { id: string; name: string; slug: string }[];
}

interface Brand {
    id: string;
    name: string;
}

export default function AdminNewProduct() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [saving, setSaving] = useState(false);
    const [product, setProduct] = useState<any>({
        id: "",
        title: "",
        price: 0,
        originalPrice: 0,
        categoryId: "",
        subCategoryId: "",
        brandId: "",
        features: [],
        rating: 0,
        totalReviews: 0,
        sku: "",
        inStock: true,
        stockQuantity: 0,
    });
    const [mainImage, setMainImage] = useState<string>("");
    const [gallery, setGallery] = useState<string[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const [sizes, setSizes] = useState<string[]>([]);
    const [features, setFeatures] = useState<string[]>([]);
    const [productType, setProductType] = useState<string>("simple");
    const [showPreview, setShowPreview] = useState(false);
    const [swatchType, setSwatchType] = useState<"color" | "image">("color");
    const [imageSwatch, setImageSwatch] = useState<{ name: string; image: string; images: string[] }[]>([]);
    const [displayOptions, setDisplayOptions] = useState<string[]>([]);
    const [description, setDescription] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);
    const [variants, setVariants] = useState<{ name: string; values: string[]; prices?: { [key: string]: number } }[]>([]);

    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/categories`);
            if (!res.ok) {
                console.error("Failed to fetch categories");
                setCategories([]);
                return;
            }
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                console.error("API returned non-JSON response");
                setCategories([]);
                return;
            }
            const data = await res.json();
            console.log("Categories fetched:", data);
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
        }
    }, []);

    const fetchBrands = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/brands`);
            if (!res.ok) {
                console.error("Failed to fetch brands");
                setBrands([]);
                return;
            }
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                console.error("API returned non-JSON response");
                setBrands([]);
                return;
            }
            const data = await res.json();
            setBrands(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching brands:", error);
            setBrands([]);
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;
        fetchCategories();
        fetchBrands();
    }, [mounted, fetchCategories, fetchBrands]);

    const handleSave = async () => {
        if (!product.title) {
            alert("Please enter a product title");
            return;
        }
        if (!product.price) {
            alert("Please enter a product price");
            return;
        }

        setSaving(true);

        try {
            const token = localStorage.getItem("adminToken");

            const productData = {
                title: product.title,
                price: Number(product.price),
                originalPrice: Number(product.originalPrice) || Number(product.price),
                categoryId: product.categoryId || null,
                subCategoryId: product.subCategoryId || null,
                brandId: product.brandId || null,
                image: mainImage,
                gallery,
                features,
                description,
                tags,
                variants,
                inStock: product.inStock,
                stockQuantity: Number(product.stockQuantity) || 0,
                sku: product.sku,
                productType,
                swatchType: productType === "variable" ? swatchType : null,
                ...(productType === "variable" && {
                    ...(swatchType === "color" ? { colors } : { imageSwatch }),
                    sizes,
                    displayOptions,
                }),
            };

            console.log("Sending product data:", { productType, swatchType, imageSwatch, productData });

            const res = await fetch(`${API_URL}/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(productData),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to create product");
            }

            alert("Product created successfully!");
            router.push("/admin/products");
        } catch (error: any) {
            console.error("Error creating product:", error);
            alert(error.message || "Error creating product");
        } finally {
            setSaving(false);
        }
    };

    if (!mounted) {
        return (
            <ProtectedAdmin>
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            </ProtectedAdmin>
        );
    }

    return (
        <ProtectedAdmin>
            <div className="space-y-6 max-w-4xl">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                        <p className="text-sm text-gray-500 mt-1">Create a new product in your catalog</p>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg border border-gray-100 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProductFormFields
                            product={product}
                            setProduct={setProduct}
                            description={description}
                            setDescription={setDescription}
                            tags={tags}
                            setTags={setTags}
                            categories={categories}
                            brands={brands}
                            onCategoriesChange={fetchCategories}
                            onBrandsChange={fetchBrands}
                        />
                        <ProductVariations
                            productType={productType}
                            setProductType={setProductType}
                            swatchType={swatchType}
                            setSwatchType={setSwatchType}
                            colors={colors}
                            setColors={setColors}
                            imageSwatch={imageSwatch}
                            setImageSwatch={setImageSwatch}
                            sizes={sizes}
                            setSizes={setSizes}
                            displayOptions={displayOptions}
                            setDisplayOptions={setDisplayOptions}
                        />
                        <ProductImages
                            mainImage={mainImage}
                            setMainImage={setMainImage}
                            gallery={gallery}
                            setGallery={setGallery}
                        />
                        <ProductVariants
                            variants={variants}
                            setVariants={setVariants}
                            features={features}
                            setFeatures={setFeatures}
                        />

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Stock Status</label>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        checked={product.inStock === true}
                                        onChange={() => setProduct({ ...product, inStock: true })}
                                        className="text-blue-600"
                                    />
                                    <span className="text-sm">In Stock</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        checked={product.inStock === false}
                                        onChange={() => setProduct({ ...product, inStock: false })}
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
                            {saving ? "Creating..." : "Create Product"}
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
                    <ProductPreview
                        product={product}
                        mainImage={mainImage}
                        gallery={gallery}
                        productType={productType}
                        swatchType={swatchType}
                        colors={colors}
                        imageSwatch={imageSwatch}
                        sizes={sizes}
                        displayOptions={displayOptions}
                        variants={variants}
                        features={features}
                        description={description}
                        tags={tags}
                    />
                )}
            </div>
        </ProtectedAdmin>
    );
}
