"use client";
import { X, Upload, Loader2, Plus, ImagePlus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ImageSwatchItem {
    name: string;
    image: string;
    images: string[];
}

interface ProductVariationsProps {
    productType: string;
    setProductType: (type: string) => void;
    swatchType: "color" | "image";
    setSwatchType: (type: "color" | "image") => void;
    colors: string[];
    setColors: (colors: string[]) => void;
    imageSwatch: ImageSwatchItem[];
    setImageSwatch: (swatches: ImageSwatchItem[]) => void;
    sizes: string[];
    setSizes: (sizes: string[]) => void;
    displayOptions: string[];
    setDisplayOptions: (options: string[]) => void;
}

export default function ProductVariations({ productType, setProductType, swatchType, setSwatchType, colors, setColors, imageSwatch, setImageSwatch, sizes, setSizes, displayOptions, setDisplayOptions }: ProductVariationsProps) {
    const [uploadingSwatchImage, setUploadingSwatchImage] = useState(false);
    const [uploadingGalleryImage, setUploadingGalleryImage] = useState<number | null>(null);
    const [swatchName, setSwatchName] = useState("");
    const [swatchImages, setSwatchImages] = useState<string[]>([]);
    const [editingSwatchIndex, setEditingSwatchIndex] = useState<number | null>(null);
    const [sessionUrls, setSessionUrls] = useState<Set<string>>(new Set());

    const uploadImage = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch(`${API_URL}/upload/single`, {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                console.log(`Image uploaded: ${data.sizeKB}`);
                setSessionUrls(prev => new Set(prev).add(data.url));
                return data.url;
            } else {
                const error = await res.json();
                alert(error.error || "Failed to upload image");
                return null;
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload image");
            return null;
        }
    };

    const uploadImages = async (files: FileList): Promise<string[]> => {
        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append("images", file);
        });

        try {
            const res = await fetch(`${API_URL}/upload/multiple`, {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                const urls = data.images.map((img: any) => img.url);
                setSessionUrls(prev => {
                    const next = new Set(prev);
                    urls.forEach((u: string) => next.add(u));
                    return next;
                });
                return urls;
            } else {
                const error = await res.json();
                alert(error.error || "Failed to upload images");
                return [];
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload images");
            return [];
        }
    };

    const deleteImageFromCloudinary = async (url: string) => {
        try {
            await fetch(`${API_URL}/upload/delete-by-url`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });
        } catch (error) {
            console.error("Error deleting image from session:", error);
        }
    };

    const handleSwatchImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingSwatchImage(true);
        if (files.length === 1) {
            const url = await uploadImage(files[0]);
            if (url) {
                setSwatchImages(prev => [...prev, url]);
            }
        } else {
            const urls = await uploadImages(files);
            if (urls.length > 0) {
                setSwatchImages(prev => [...prev, ...urls]);
            }
        }
        setUploadingSwatchImage(false);
        e.target.value = "";
    };

    const addImageSwatch = () => {
        if (swatchName.trim() && swatchImages.length > 0) {
            const newSwatch: ImageSwatchItem = {
                name: swatchName.trim(),
                image: swatchImages[0],
                images: [...swatchImages],
            };
            setImageSwatch([...imageSwatch, newSwatch]);
            setSwatchName("");
            setSwatchImages([]);
        }
    };

    const handleAddGalleryImage = async (swatchIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingGalleryImage(swatchIndex);

        const urls = files.length === 1
            ? [await uploadImage(files[0])].filter((url): url is string => url !== null)
            : await uploadImages(files);

        if (urls.length > 0) {
            const updated = [...imageSwatch];
            if (!updated[swatchIndex].images) {
                updated[swatchIndex].images = [updated[swatchIndex].image];
            }
            updated[swatchIndex].images = [...updated[swatchIndex].images, ...urls];
            setImageSwatch(updated);
        }
        setUploadingGalleryImage(null);
        e.target.value = "";
    };

    const removeGalleryImage = (swatchIndex: number, imageIndex: number) => {
        const updated = [...imageSwatch];
        const removedUrl = updated[swatchIndex].images[imageIndex];

        // Instant delete if it was uploaded in this session
        if (sessionUrls.has(removedUrl)) {
            deleteImageFromCloudinary(removedUrl);
            setSessionUrls(prev => {
                const next = new Set(prev);
                next.delete(removedUrl);
                return next;
            });
        }

        updated[swatchIndex].images = updated[swatchIndex].images.filter((_, i) => i !== imageIndex);
        // If removing main image, update it
        if (imageIndex === 0 && updated[swatchIndex].images.length > 0) {
            updated[swatchIndex].image = updated[swatchIndex].images[0];
        }
        setImageSwatch(updated);
    };

    const setAsMainImage = (swatchIndex: number, imageUrl: string) => {
        const updated = [...imageSwatch];
        updated[swatchIndex].image = imageUrl;
        // Move to front of images array
        const images = updated[swatchIndex].images.filter(img => img !== imageUrl);
        updated[swatchIndex].images = [imageUrl, ...images];
        setImageSwatch(updated);
    };

    return (
        <>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                        <input type="radio" checked={productType === "simple"} onChange={() => setProductType("simple")} />
                        <span className="text-sm">Simple Product</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="radio" checked={productType === "variable"} onChange={() => setProductType("variable")} />
                        <span className="text-sm">Variable Product</span>
                    </label>
                </div>
            </div>

            {productType === "variable" && (
                <>
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-4 mb-3">
                            <label className="flex items-center gap-2">
                                <input type="radio" checked={swatchType === "color"} onChange={() => setSwatchType("color")} />
                                <span className="text-sm">Color Swatches</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" checked={swatchType === "image"} onChange={() => setSwatchType("image")} />
                                <span className="text-sm">Image Swatches</span>
                            </label>
                        </div>

                        {swatchType === "color" && (
                            <div className="space-y-3">
                                {colors.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {colors.map((color, idx) => (
                                            <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                                                <div className="w-6 h-6 rounded-full border-2 border-white shadow" style={{ backgroundColor: color }} />
                                                <span className="text-sm">{color}</span>
                                                <X className="w-4 h-4 cursor-pointer" onClick={() => setColors(colors.filter((_, i) => i !== idx))} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <input
                                    type="text"
                                    placeholder="Enter color and press Enter"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                            </div>
                        )}

                        {swatchType === "image" && (
                            <div className="space-y-4">
                                {imageSwatch.length > 0 && (
                                    <div className="space-y-4" suppressHydrationWarning>
                                        {imageSwatch.map((swatch, idx) => (
                                            <div key={idx} className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-medium text-gray-900">{swatch.name}</h4>
                                                    <button
                                                        onClick={() => setImageSwatch(imageSwatch.filter((_, i) => i !== idx))}
                                                        className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Images grid for this swatch */}
                                                <div className="flex flex-wrap gap-3">
                                                    {/* Main image */}
                                                    <div className="relative">
                                                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border-2 border-blue-500">
                                                            <Image src={swatch.image} alt={swatch.name} fill className="object-cover" unoptimized />
                                                        </div>
                                                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded">Main</span>
                                                    </div>

                                                    {/* Additional images */}
                                                    {swatch.images?.slice(1).map((img, imgIdx) => (
                                                        <div key={imgIdx} className="relative group">
                                                            <div
                                                                className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 cursor-pointer hover:border-blue-300"
                                                                onClick={() => setAsMainImage(idx, img)}
                                                                title="Click to set as main image"
                                                            >
                                                                <Image src={img} alt={`${swatch.name} ${imgIdx + 2}`} fill className="object-cover" unoptimized />
                                                            </div>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); removeGalleryImage(idx, imgIdx + 1); }}
                                                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}

                                                    {/* Add more images button */}
                                                    <label className={`w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors ${uploadingGalleryImage === idx ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                        {uploadingGalleryImage === idx ? (
                                                            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                                                        ) : (
                                                            <>
                                                                <ImagePlus className="w-5 h-5 text-gray-400" />
                                                                <span className="text-[10px] text-gray-400 mt-1">Add</span>
                                                            </>
                                                        )}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            className="hidden"
                                                            onChange={(e) => handleAddGalleryImage(idx, e)}
                                                            disabled={uploadingGalleryImage === idx}
                                                        />
                                                    </label>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">{swatch.images?.length || 1} image(s) • Click any image to set as main</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {swatchImages.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {swatchImages.map((img, idx) => (
                                            <div key={idx} className="relative group">
                                                <div className="relative w-12 h-12 rounded border overflow-hidden">
                                                    <Image src={img} alt="Preview" fill className="object-cover" unoptimized />
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        if (sessionUrls.has(img)) deleteImageFromCloudinary(img);
                                                        setSwatchImages(swatchImages.filter((_, i) => i !== idx));
                                                    }}
                                                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="flex gap-2 flex-wrap">
                                    <input
                                        type="text"
                                        placeholder="Swatch Name"
                                        value={swatchName}
                                        onChange={(e) => setSwatchName(e.target.value)}
                                        className="flex-1 min-w-[120px] px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <div className="flex-1 min-w-[200px] flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Image URL or upload"
                                            value={swatchImages[0] || ""}
                                            onChange={(e) => setSwatchImages([e.target.value, ...swatchImages.slice(1)])}
                                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <label className={`px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer flex items-center ${uploadingSwatchImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            {uploadingSwatchImage ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Upload className="w-4 h-4" />
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                onChange={handleSwatchImageUpload}
                                                disabled={uploadingSwatchImage}
                                            />
                                        </label>
                                    </div>
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 flex items-center gap-2"
                                        onClick={addImageSwatch}
                                        disabled={!swatchName.trim() || swatchImages.length === 0}
                                    >
                                        Add Swatch
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500">Images are automatically compressed to 30-60KB</p>
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {["S", "M", "L", "XL", "XXL"].map((size) => (
                                <button key={size} type="button" onClick={() => setSizes(sizes.includes(size) ? sizes.filter(s => s !== size) : [...sizes, size])} className={`px-4 py-2 rounded-lg border-2 ${sizes.includes(size) ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200"}`}>
                                    {size}
                                </button>
                            ))}
                            {sizes.filter(s => !["S", "M", "L", "XL", "XXL"].includes(s)).map((size, idx) => (
                                <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-2 border-blue-600 text-blue-700 rounded-lg">
                                    <span>{size}</span>
                                    <X className="w-4 h-4 cursor-pointer" onClick={() => setSizes(sizes.filter(s => s !== size))} />
                                </div>
                            ))}
                        </div>
                        <input
                            type="text"
                            placeholder="Add custom size and press Enter"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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

                    {displayOptions.length > 0 && (
                        <div className="md:col-span-2">
                            <div className="flex flex-wrap gap-2">
                                {displayOptions.map((option, idx) => (
                                    <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                                        <span className="text-sm font-medium text-blue-700">{option}</span>
                                        <X className="w-4 h-4 cursor-pointer" onClick={() => setDisplayOptions(displayOptions.filter((_, i) => i !== idx))} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
