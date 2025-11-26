/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { adminData } from "@/lib/adminData";
import ProtectedAdmin from "@/components/admin/ProtectAdmin";
import ProductFormFields from "@/components/admin/ProductFormFields";
import ProductVariations from "@/components/admin/ProductVariations";
import ProductImages from "@/components/admin/ProductImages";
import ProductVariants from "@/components/admin/ProductVariants";
import ProductPreview from "@/components/admin/ProductPreview";

export default function AdminEditProduct() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [mounted, setMounted] = useState(false);
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
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const loadProduct = () => {
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
        };

        const timer = setTimeout(loadProduct, 0);
        return () => clearTimeout(timer);
    }, [id, mounted]);

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

    if (!mounted || !product) return null;

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
                        <ProductFormFields
                            product={product}
                            setProduct={setProduct}
                            description={description}
                            setDescription={setDescription}
                            tags={tags}
                            setTags={setTags}
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
