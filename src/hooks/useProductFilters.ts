import { useState, useMemo } from "react";
import { allProducts, filters } from "@/data/productsData";

export function useProductFilters(categoryParam: string | null) {
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState<number[]>([]);
    const [sortBy, setSortBy] = useState("popularity");
    const [tempBrands, setTempBrands] = useState<string[]>([]);
    const [tempPriceRange, setTempPriceRange] = useState<number[]>([]);

    const filteredProducts = useMemo(() => {
        let filtered = [...allProducts];

        if (categoryParam) {
            filtered = filtered.filter(p => p.category === categoryParam);
        }

        if (selectedBrands.length > 0) {
            filtered = filtered.filter(p => selectedBrands.includes(p.brand));
        }

        if (selectedPriceRange.length > 0) {
            filtered = filtered.filter(p => {
                const range = filters.priceRanges[selectedPriceRange[0]];
                return p.price >= range.min && p.price <= range.max;
            });
        }

        switch (sortBy) {
            case "price -- low to high":
                filtered.sort((a, b) => a.price - b.price);
                break;
            case "price -- high to low":
                filtered.sort((a, b) => b.price - a.price);
                break;
            case "newest first":
                filtered.reverse();
                break;
        }

        return filtered;
    }, [categoryParam, selectedBrands, selectedPriceRange, sortBy]);

    const toggleBrand = (brand: string, isMobile = false) => {
        if (isMobile) {
            setTempBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
        } else {
            setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
        }
    };

    const togglePriceRange = (index: number, isMobile = false) => {
        if (isMobile) {
            setTempPriceRange(prev => prev.includes(index) ? prev.filter(i => i !== index) : [index]);
        } else {
            setSelectedPriceRange(prev => prev.includes(index) ? prev.filter(i => i !== index) : [index]);
        }
    };

    const clearAllFilters = () => {
        setSelectedBrands([]);
        setSelectedPriceRange([]);
        setTempBrands([]);
        setTempPriceRange([]);
    };

    const openMobileFilters = () => {
        setTempBrands(selectedBrands);
        setTempPriceRange(selectedPriceRange);
    };

    const applyMobileFilters = () => {
        setSelectedBrands(tempBrands);
        setSelectedPriceRange(tempPriceRange);
    };

    const closeMobileFilters = () => {
        setTempBrands(selectedBrands);
        setTempPriceRange(selectedPriceRange);
    };

    return {
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
    };
}
