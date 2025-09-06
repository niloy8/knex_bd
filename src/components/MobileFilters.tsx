import { X, ChevronRight } from "lucide-react";
import { filters } from "@/data/productsData";

interface MobileFiltersProps {
    showFilters: boolean;
    tempBrands: string[];
    tempPriceRange: number[];
    categoryParam: string | null;
    onClose: () => void;
    onApply: () => void;
    onToggleBrand: (brand: string) => void;
    onTogglePriceRange: (index: number) => void;
    onClearTemp: () => void;
}

export default function MobileFilters({
    showFilters,
    tempBrands,
    tempPriceRange,
    categoryParam,
    onClose,
    onApply,
    onToggleBrand,
    onTogglePriceRange,
    onClearTemp,
}: MobileFiltersProps) {
    if (!showFilters) return null;

    return (
        <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

            <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto flex flex-col">
                <div className="sticky top-0 bg-white border-b z-10 px-4 py-3 flex items-center justify-between">
                    <h2 className="text-lg font-bold">Filters</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                    {(tempBrands.length > 0 || tempPriceRange.length > 0) && (
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Applied</span>
                                <button onClick={onClearTemp} className="text-blue-600 text-sm font-medium hover:underline cursor-pointer">
                                    Clear All
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {tempBrands.map((brand) => (
                                    <button key={brand} onClick={() => onToggleBrand(brand)} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200">
                                        {brand}
                                        <X size={14} />
                                    </button>
                                ))}
                                {tempPriceRange.map((index) => (
                                    <button key={index} onClick={() => onTogglePriceRange(index)} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200">
                                        {filters.priceRanges[index].label}
                                        <X size={14} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mb-6">
                        <h3 className="font-semibold mb-3">Categories</h3>
                        <div className="space-y-2">
                            {filters.categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        onClose();
                                        window.location.href = `/products?category=${category.id}`;
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded cursor-pointer hover:bg-gray-100 ${categoryParam === category.id ? "bg-blue-50 text-blue-600" : ""}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">{category.name}</span>
                                        <ChevronRight size={16} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-semibold mb-3">Brand</h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {filters.brands.map((brand) => (
                                <label key={brand} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                    <input type="checkbox" checked={tempBrands.includes(brand)} onChange={() => onToggleBrand(brand)} className="w-4 h-4 cursor-pointer" />
                                    <span className="text-sm">{brand}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">Price Range</h3>
                        <div className="space-y-2">
                            {filters.priceRanges.map((range, index) => (
                                <label key={index} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                    <input type="checkbox" checked={tempPriceRange.includes(index)} onChange={() => onTogglePriceRange(index)} className="w-4 h-4 cursor-pointer" />
                                    <span className="text-sm">{range.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-white border-t p-4">
                    <button onClick={onApply} className="w-full bg-gradient-to-r from-yellow-400 via-blue-500 to-green-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 cursor-pointer">
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
}
