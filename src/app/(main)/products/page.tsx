"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import ProductListCard from "@/components/ProductListCard";
import ProductGridCard from "@/components/ProductGridCard";
import MobileFilters from "@/components/MobileFilters";
import DesktopFilters from "@/components/DesktopFilters";
import ProductsHeader from "@/components/ProductsHeader";
import { useProductFilters } from "@/hooks/useProductFilters";
import CategoryNav from "@/components/CategoryNav";

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("category");
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const {
        selectedBrands,
        selectedPriceRange,
        tempBrands,
        tempPriceRange,
        sortBy,
        filteredProducts,
        setSortBy,
        toggleBrand,
        togglePriceRange,
        clearAllFilters,
        openMobileFilters,
        applyMobileFilters,
        closeMobileFilters,
        setTempBrands,
        setTempPriceRange,
    } = useProductFilters(categoryParam);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    const getCategoryTitle = () => {
        if (!categoryParam) return "All Products";
        return categoryParam.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    };

    const handleOpenMobileFilters = () => {
        openMobileFilters();
        setShowFilters(true);
    };

    const handleApplyMobileFilters = () => {
        applyMobileFilters();
        setShowFilters(false);
        setCurrentPage(1);
    };

    const handleCloseMobileFilters = () => {
        closeMobileFilters();
        setShowFilters(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <CategoryNav></CategoryNav>
            <MobileFilters
                showFilters={showFilters}
                tempBrands={tempBrands}
                tempPriceRange={tempPriceRange}
                categoryParam={categoryParam}
                onClose={handleCloseMobileFilters}
                onApply={handleApplyMobileFilters}
                onToggleBrand={(brand) => toggleBrand(brand, true)}
                onTogglePriceRange={(index) => togglePriceRange(index, true)}
                onClearTemp={() => {
                    setTempBrands([]);
                    setTempPriceRange([]);
                }}
            />

            <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                    <DesktopFilters
                        selectedBrands={selectedBrands}
                        selectedPriceRange={selectedPriceRange}
                        categoryParam={categoryParam}
                        onToggleBrand={(brand) => {
                            toggleBrand(brand, false);
                            setCurrentPage(1);
                        }}
                        onTogglePriceRange={(index) => {
                            togglePriceRange(index, false);
                            setCurrentPage(1);
                        }}
                        onClearAll={clearAllFilters}
                    />

                    <main className="flex-1 min-w-0">
                        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4 overflow-x-auto">
                            <Link href="/" className="hover:text-blue-600 cursor-pointer whitespace-nowrap">Home</Link>
                            <ChevronRight size={16} className="flex-shrink-0" />
                            <span className="text-gray-900 font-medium whitespace-nowrap">{getCategoryTitle()}</span>
                        </nav>

                        <ProductsHeader
                            title={getCategoryTitle()}
                            productCount={filteredProducts.length}
                            viewMode={viewMode}
                            sortBy={sortBy}
                            filterCount={selectedBrands.length + selectedPriceRange.length}
                            onViewModeChange={setViewMode}
                            onSortChange={setSortBy}
                            onOpenFilters={handleOpenMobileFilters}
                        />

                        {paginatedProducts.length > 0 ? (
                            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-4"}>
                                {paginatedProducts.map((product) =>
                                    viewMode === "list" ? (
                                        <ProductListCard key={product.id} {...product} />
                                    ) : (
                                        <ProductGridCard key={product.id} {...product} />
                                    )
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg p-8 sm:p-12 text-center">
                                <div className="text-4xl sm:text-6xl mb-4">😔</div>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No products found</h2>
                                <p className="text-sm sm:text-base text-gray-600 mb-6">Try adjusting your filters</p>
                                <button onClick={clearAllFilters} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition cursor-pointer text-sm sm:text-base">
                                    Clear Filters
                                </button>
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-1 sm:gap-2 mt-8 flex-wrap">
                                <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} className="px-3 sm:px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs sm:text-sm" disabled={currentPage === 1}>
                                    Previous
                                </button>
                                <div className="flex gap-1 sm:gap-2">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`px-3 sm:px-4 py-2 rounded font-semibold cursor-pointer text-xs sm:text-sm ${currentPage === i + 1 ? "bg-blue-600 text-white" : "border border-gray-300 hover:bg-gray-100"}`}>
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} className="px-3 sm:px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs sm:text-sm" disabled={currentPage === totalPages}>
                                    Next
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
