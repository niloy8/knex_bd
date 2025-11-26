import { ImagePlus, Upload, X } from "lucide-react";
import Image from "next/image";

interface ProductImagesProps {
    mainImage: string;
    setMainImage: (image: string) => void;
    gallery: string[];
    setGallery: (gallery: string[]) => void;
}

export default function ProductImages({ mainImage, setMainImage, gallery, setGallery }: ProductImagesProps) {
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
                        </div>
                    )}
                    <div className="flex-1 flex gap-2">
                        <input
                            type="text"
                            value={mainImage}
                            onChange={(e) => setMainImage(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Enter image URL or emoji"
                        />
                        <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Upload
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setMainImage(URL.createObjectURL(file));
                            }} />
                        </label>
                    </div>
                </div>
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
                        placeholder="Enter image URL"
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
                    <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Upload
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setGallery([...gallery, URL.createObjectURL(file)]);
                        }} />
                    </label>
                </div>
            </div>
        </>
    );
}
