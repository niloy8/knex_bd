import { X, Upload } from "lucide-react";
import Image from "next/image";

interface ProductVariationsProps {
    productType: string;
    setProductType: (type: string) => void;
    swatchType: "color" | "image";
    setSwatchType: (type: "color" | "image") => void;
    colors: string[];
    setColors: (colors: string[]) => void;
    imageSwatch: { name: string; image: string }[];
    setImageSwatch: (swatches: { name: string; image: string }[]) => void;
    sizes: string[];
    setSizes: (sizes: string[]) => void;
    displayOptions: string[];
    setDisplayOptions: (options: string[]) => void;
}

export default function ProductVariations({ productType, setProductType, swatchType, setSwatchType, colors, setColors, imageSwatch, setImageSwatch, sizes, setSizes, displayOptions, setDisplayOptions }: ProductVariationsProps) {
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
                            <div className="space-y-3">
                                {imageSwatch.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3" suppressHydrationWarning>
                                        {imageSwatch.map((swatch, idx) => (
                                            <div key={idx} className="relative border-2 border-gray-200 rounded-lg p-2 group">
                                                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                                                    <Image src={swatch.image} alt={swatch.name} fill className="object-cover" unoptimized />
                                                </div>
                                                <p className="text-xs font-medium text-center truncate">{swatch.name}</p>
                                                <button onClick={() => setImageSwatch(imageSwatch.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <input type="text" id="swatchName" placeholder="Name" className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                    <input type="text" id="swatchImage" placeholder="Image URL" className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                    <button type="button" className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 flex items-center gap-2" onClick={() => {
                                        const nameInput = document.getElementById('swatchName') as HTMLInputElement;
                                        const imageInput = document.getElementById('swatchImage') as HTMLInputElement;
                                        if (nameInput?.value.trim() && imageInput?.value.trim()) {
                                            setImageSwatch([...imageSwatch, { name: nameInput.value.trim(), image: imageInput.value.trim() }]);
                                            nameInput.value = '';
                                            imageInput.value = '';
                                        }
                                    }}>
                                        <Upload className="w-4 h-4" />
                                        Add
                                    </button>
                                </div>
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
