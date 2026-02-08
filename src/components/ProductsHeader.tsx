import { LayoutGrid, LayoutList, SlidersHorizontal } from "lucide-react";

interface ProductsHeaderProps {
    title: string;
    productCount: number;
    viewMode: "list" | "grid";
    sortBy: string;
    filterCount: number;
    onViewModeChange: (mode: "list" | "grid") => void;
    onSortChange: (sort: string) => void;
    onOpenFilters: () => void;
}

export default function ProductsHeader({
    title,
    productCount,
    viewMode,
    sortBy,
    filterCount,
    onViewModeChange,
    onSortChange,
    onOpenFilters,
}: ProductsHeaderProps) {
    const sortOptions = ["Popularity", "Price -- Low to High", "Price -- High to Low", "Newest First"];

    return (
        <div className="bg-white rounded-lg p-3 sm:p-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">{title}</h1>
                    <p className="text-xs sm:text-sm text-gray-600">{productCount} products found</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={onOpenFilters} className="lg:hidden px-3 py-2 border border-indigo-300 rounded-lg text-sm font-medium hover:bg-indigo-50 cursor-pointer flex items-center gap-2 text-indigo-700">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                        {filterCount > 0 && (
                            <span className="bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {filterCount}
                            </span>
                        )}
                    </button>
                    <button onClick={() => onViewModeChange("list")} className={`p-2 rounded-lg cursor-pointer transition-colors ${viewMode === "list" ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-100 text-gray-500"}`}>
                        <LayoutList size={18} className="sm:w-5 sm:h-5" />
                    </button>
                    <button onClick={() => onViewModeChange("grid")} className={`p-2 rounded-lg cursor-pointer transition-colors ${viewMode === "grid" ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-100 text-gray-500"}`}>
                        <LayoutGrid size={18} className="sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 text-sm flex-wrap">
                <span className="font-semibold whitespace-nowrap">Sort By</span>
                {sortOptions.map((option) => (
                    <button
                        key={option}
                        onClick={() => onSortChange(option.toLowerCase())}
                        className={`px-2 sm:px-3 py-1 rounded cursor-pointer whitespace-nowrap text-xs sm:text-sm transition-colors ${sortBy === option.toLowerCase() ? "text-indigo-600 font-semibold underline decoration-2 underline-offset-4" : "text-gray-600 hover:text-indigo-600"}`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}
