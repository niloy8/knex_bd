import { Grid3x3, List } from "lucide-react";

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
                    <button onClick={onOpenFilters} className="lg:hidden px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 cursor-pointer flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filters
                        {filterCount > 0 && (
                            <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {filterCount}
                            </span>
                        )}
                    </button>
                    <button onClick={() => onViewModeChange("list")} className={`p-2 rounded cursor-pointer ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}>
                        <List size={18} className="sm:w-5 sm:h-5" />
                    </button>
                    <button onClick={() => onViewModeChange("grid")} className={`p-2 rounded cursor-pointer ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}>
                        <Grid3x3 size={18} className="sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 text-sm flex-wrap">
                <span className="font-semibold whitespace-nowrap">Sort By</span>
                {sortOptions.map((option) => (
                    <button
                        key={option}
                        onClick={() => onSortChange(option.toLowerCase())}
                        className={`px-2 sm:px-3 py-1 rounded cursor-pointer whitespace-nowrap text-xs sm:text-sm ${sortBy === option.toLowerCase() ? "text-blue-600 font-semibold underline" : "text-gray-700 hover:text-blue-600"}`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}
