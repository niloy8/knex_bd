"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ShoppingCart, Search, Heart, UserRound, Menu, X, Monitor, Footprints, Home, Shirt, Sparkles, Gamepad2 } from "lucide-react";
import { allProducts } from "@/data/productsData";

export default function Header() {
    const [searchQuery, setSearchQuery] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const getCategoryIcon = (category: string) => {
        const icons: Record<string, React.ReactNode> = {
            "gaming-monitor": <Monitor className="w-5 h-5 text-blue-600" />,
            "sports-shoes": <Footprints className="w-5 h-5 text-green-600" />,
            "home-lifestyle": <Home className="w-5 h-5 text-purple-600" />,
            "fashion": <Shirt className="w-5 h-5 text-pink-600" />,
            "beauty-health": <Sparkles className="w-5 h-5 text-yellow-600" />,
            "gaming": <Gamepad2 className="w-5 h-5 text-red-600" />,
        };
        return icons[category] || <Monitor className="w-5 h-5 text-gray-600" />;
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getSearchResults = () => {
        if (!searchQuery.trim()) return { products: [], categories: [] };

        const query = searchQuery.toLowerCase();
        const matchedProducts = allProducts
            .filter(p => p.title.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query))
            .slice(0, 6);

        const categories = Array.from(new Set(
            allProducts
                .filter(p => p.category.toLowerCase().includes(query))
                .map(p => p.category)
        )).slice(0, 2);

        return { products: matchedProducts, categories };
    };

    const { products: suggestions, categories: categoryResults } = getSearchResults();
    const totalResults = suggestions.length + categoryResults.length;

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setShowSuggestions(value.trim().length > 0);
    };

    return (
        <header className="bg-white shadow-sm ">
            <div className="max-w-7xl mx-auto px-4 ">
                <div className="flex items-center justify-between lg:justify-around md:justify-around gap-4">
                    <button onClick={() => setMenuOpen(true)} className="md:hidden"><Menu size={24} /></button>
                    <Link href="/">
                        <Image
                            src="https://knex.com.bd/wp-content/uploads/2025/07/3d-png.png"
                            alt="KNEX.BD"
                            width={300}       // base width
                            height={100}      // base height
                            className="h-16 w-auto md:h-16 lg:h-20 xl:h-24"
                        />
                    </Link>

                    <div className="hidden md:flex flex-1 max-w-2xl relative" ref={searchRef}>
                        <input
                            type="text"
                            placeholder="Search for products, brands and more..."
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            onFocus={() => searchQuery && setShowSuggestions(true)}
                            className="w-full px-4 py-2.5 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="absolute right-0 top-0 bottom-0 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-r-lg hover:from-blue-700 hover:to-indigo-700">
                            <Search size={20} />
                        </button>

                        {/* Search Suggestions Dropdown */}
                        {showSuggestions && totalResults > 0 && (
                            <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                                {/* Categories */}
                                {categoryResults.length > 0 && (
                                    <div className="p-2 border-b border-gray-100">
                                        <p className="text-xs font-semibold text-gray-500 px-3 py-2">CATEGORIES</p>
                                        {categoryResults.map((category, idx) => (
                                            <Link
                                                key={idx}
                                                href={`/products?category=${category}`}
                                                onClick={() => setShowSuggestions(false)}
                                                className="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                                    {getCategoryIcon(category)}
                                                </div>
                                                <span className="text-sm font-medium text-gray-900 capitalize">{category.replace('-', ' ')}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* Products */}
                                {suggestions.length > 0 && (
                                    <div className="p-2">
                                        <p className="text-xs font-semibold text-gray-500 px-3 py-2">PRODUCTS</p>
                                        {suggestions.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={product.href}
                                                onClick={() => setShowSuggestions(false)}
                                                className="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                                                    {product.image}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.title}</p>
                                                    <p className="text-xs text-gray-500">{product.brand}</p>
                                                </div>
                                                <p className="text-sm font-bold text-blue-600">Tk {product.price.toLocaleString()}</p>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/account" className="flex flex-col items-center gap-1 hover:text-blue-600"><UserRound size={20} /><span className="text-xs font-medium">Account</span></Link>
                        <Link href="/cart" className="flex flex-col items-center gap-1 hover:text-blue-600"><ShoppingCart size={20} /><span className="text-xs font-medium">Cart</span></Link>
                        <Link href="/wishlist" className="flex flex-col items-center gap-1 hover:text-blue-600"><Heart size={20} /><span className="text-xs font-medium">Wishlist</span></Link>
                    </div>

                    <Link href="/cart" className="md:hidden"><ShoppingCart size={24} /></Link>
                </div>

                <div className="md:hidden mt-3 relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full px-4 py-2 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="absolute right-0 top-0 bottom-0 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-r-lg">
                        <Search size={18} />
                    </button>

                    {/* Mobile Search Suggestions */}
                    {showSuggestions && totalResults > 0 && (
                        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-80 overflow-y-auto z-50">
                            {categoryResults.length > 0 && (
                                <div className="p-2 border-b border-gray-100">
                                    <p className="text-xs font-semibold text-gray-500 px-2 py-1">CATEGORIES</p>
                                    {categoryResults.map((category, idx) => (
                                        <Link
                                            key={idx}
                                            href={`/products?category=${category}`}
                                            onClick={() => setShowSuggestions(false)}
                                            className="flex items-center gap-2 px-2 py-2 hover:bg-blue-50 rounded-lg"
                                        >
                                            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                                                {getCategoryIcon(category)}
                                            </div>
                                            <span className="text-sm font-medium capitalize">{category.replace('-', ' ')}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                            {suggestions.length > 0 && (
                                <div className="p-2">
                                    <p className="text-xs font-semibold text-gray-500 px-2 py-1">PRODUCTS</p>
                                    {suggestions.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={product.href}
                                            onClick={() => setShowSuggestions(false)}
                                            className="flex items-center gap-2 px-2 py-2 hover:bg-blue-50 rounded-lg"
                                        >
                                            <span className="text-xl">{product.image}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium line-clamp-1">{product.title}</p>
                                                <p className="text-xs text-blue-600 font-bold">Tk {product.price.toLocaleString()}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className={`fixed inset-0 bg-black/50 z-50 transition-opacity md:hidden ${menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setMenuOpen(false)} />

            <div className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-xl transform transition-transform md:hidden ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-bold">Menu</h2>
                    <button onClick={() => setMenuOpen(false)}><X size={24} /></button>
                </div>
                <nav className="p-4 space-y-4">
                    <Link href="/account" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg"><UserRound size={20} /><span>Account</span></Link>
                    <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg"><Heart size={20} /><span>Wishlist</span></Link>
                    <Link href="/orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg"><ShoppingCart size={20} /><span>Orders</span></Link>
                </nav>
            </div>
        </header>
    );
}