import { Plus, Trash2, X } from "lucide-react";

interface ProductVariantsProps {
    variants: { name: string; values: string[] }[];
    setVariants: (variants: { name: string; values: string[] }[]) => void;
    features: string[];
    setFeatures: (features: string[]) => void;
}

export default function ProductVariants({ variants = [], setVariants, features = [], setFeatures }: ProductVariantsProps) {
    // Ensure variants is always an array
    const safeVariants = Array.isArray(variants) ? variants : [];
    const safeFeatures = Array.isArray(features) ? features : [];

    return (
        <>
            <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Product Variants (RAM, Storage, etc.)
                </label>
                <p className="text-xs text-gray-500 mb-3">Add variants like RAM, Storage, etc.</p>

                {safeVariants.map((variant, vIdx) => (
                    <div key={vIdx} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <input
                                type="text"
                                value={variant.name}
                                onChange={(e) => {
                                    const newVariants = [...safeVariants];
                                    newVariants[vIdx].name = e.target.value;
                                    setVariants(newVariants);
                                }}
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Variant name (e.g., RAM)"
                            />
                            <button onClick={() => setVariants(safeVariants.filter((_, i) => i !== vIdx))} className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {(variant.values || []).map((val, valIdx) => (
                                <div key={valIdx} className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-lg">
                                    <span className="text-sm">{val}</span>
                                    <X className="w-3 h-3 cursor-pointer text-red-500" onClick={() => {
                                        const newVariants = [...safeVariants];
                                        newVariants[vIdx].values = newVariants[vIdx].values.filter((_, i) => i !== valIdx);
                                        setVariants(newVariants);
                                    }} />
                                </div>
                            ))}
                        </div>
                        <input
                            type="text"
                            placeholder="Add value and press Enter"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    const input = e.target as HTMLInputElement;
                                    if (input.value.trim()) {
                                        const newVariants = [...safeVariants];
                                        newVariants[vIdx].values.push(input.value.trim());
                                        setVariants(newVariants);
                                        input.value = '';
                                    }
                                }
                            }}
                        />
                    </div>
                ))}

                <button type="button" onClick={() => setVariants([...safeVariants, { name: '', values: [] }])} className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Variant
                </button>
            </div>

            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                {safeFeatures.length > 0 && (
                    <div className="space-y-2 mb-3">
                        {safeFeatures.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                                <span className="flex-1 text-sm">{feature}</span>
                                <X className="w-4 h-4 cursor-pointer text-red-500" onClick={() => setFeatures(safeFeatures.filter((_, i) => i !== idx))} />
                            </div>
                        ))}
                    </div>
                )}
                <input
                    type="text"
                    placeholder="Add feature and press Enter"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            if (input.value.trim()) {
                                setFeatures([...safeFeatures, input.value.trim()]);
                                input.value = '';
                            }
                        }
                    }}
                />
            </div>
        </>
    );
}
