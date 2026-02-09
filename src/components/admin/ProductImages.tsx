"use client";
import { ImagePlus, Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ProductImagesProps {
    mainImage: string;
    setMainImage: (image: string) => void;
    gallery: string[];
    setGallery: (gallery: string[]) => void;
}

export default function ProductImages({ mainImage, setMainImage, gallery, setGallery }: ProductImagesProps) {
    const [uploading, setUploading] = useState(false);
    const [uploadingGallery, setUploadingGallery] = useState(false);

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

    const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const url = await uploadImage(file);
        if (url) {
            setMainImage(url);
        }
        setUploading(false);
        e.target.value = ""; // Reset input
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingGallery(true);
        const newUrls: string[] = [];

        for (const file of Array.from(files)) {
            const url = await uploadImage(file);
            if (url) {
                newUrls.push(url);
            }
        }

        if (newUrls.length > 0) {
            setGallery([...gallery, ...newUrls]);
        }
        setUploadingGallery(false);
        e.target.value = ""; // Reset input
    };

    return (
        <>
            <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <ImagePlus className="w-4 h-4" />
                    Main Product Image
                </label>
                <div className="flex items-center gap-4">
                    {mainImage && (
                        <div className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden" suppressHydrationWarning>
                            <Image src={mainImage} alt="Main" fill className="object-cover" unoptimized />
                            <button
                                onClick={() => setMainImage("")}
                                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    <div className="flex-1 flex gap-2">
                        <input
                            type="text"
                            value={mainImage}
                            onChange={(e) => setMainImage(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Enter image URL or upload"
                        />
                        <label className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer flex items-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {uploading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Upload className="w-4 h-4" />
                            )}
                            {uploading ? "Uploading..." : "Upload"}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleMainImageUpload}
                                disabled={uploading}
                            />
                        </label>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Images are automatically compressed to 30-60KB</p>
            </div>

            <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <ImagePlus className="w-4 h-4" />
                    Image Gallery
                </label>
                {gallery.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-3" suppressHydrationWarning>
                        {gallery.map((img, idx) => (
                            <div key={idx} className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden group">
                                <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" unoptimized />
                                <button onClick={() => setGallery(gallery.filter((_, i) => i !== idx))} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter image URL and press Enter"
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                    <label className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer flex items-center gap-2 ${uploadingGallery ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {uploadingGallery ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Upload className="w-4 h-4" />
                        )}
                        {uploadingGallery ? "Uploading..." : "Upload"}
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleGalleryUpload}
                            disabled={uploadingGallery}
                        />
                    </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">You can upload multiple images at once</p>
            </div>
        </>
    );
}
