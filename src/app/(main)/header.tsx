"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import { ShoppingCart, Search, Heart, UserRound, Menu, X, Loader2, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface SearchProduct {
    id: string;
    title: string;
    slug: string;
    price: number;
    image: string;
    brand: { name: string } | null;
    category: { name: string; slug: string } | null;
}

export default function Header() {
    const [searchQuery, setSearchQuery] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<SearchProduct[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const { getCartCount } = useCart();
    const { items: wishlistItems } = useWishlist();

    const cartCount = getCartCount();
    const wishlistCount = wishlistItems.length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const searchProducts = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }
        setSearchLoading(true);
        try {
            const res = await fetch(`${API_URL}/products?search=${encodeURIComponent(query)}&limit=6`);
            const data = await res.json();
            setSuggestions(data.products || []);
        } catch (error) {
            console.error("Search error:", error);
            setSuggestions([]);
        } finally {
            setSearchLoading(false);
        }
    }, []);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim()) {
                searchProducts(searchQuery);
            } else {
                setSuggestions([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, searchProducts]);

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
                        <button className="absolute right-0 top-0 bottom-0 px-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-r-lg hover:from-blue-700 hover:to-indigo-700">
                            <Search size={20} />
                        </button>

                        {/* Search Suggestions Dropdown */}
                        {showSuggestions && (
                            <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                                {searchLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                    </div>
                                ) : suggestions.length > 0 ? (
                                    <div className="p-2">
                                        <p className="text-xs font-semibold text-gray-500 px-3 py-2">PRODUCTS</p>
                                        {suggestions.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/products/${product.slug || product.id}`}
                                                onClick={() => setShowSuggestions(false)}
                                                className="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
                                                    {product.image ? (
                                                        <Image src={product.image} alt={product.title} fill className="object-cover" unoptimized />
                                                    ) : (
                                                        <Package className="w-6 h-6 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.title}</p>
                                                    <p className="text-xs text-gray-500">{product.brand?.name || product.category?.name || ""}</p>
                                                </div>
                                                <p className="text-sm font-bold text-blue-600">Tk {product.price.toLocaleString()}</p>
                                            </Link>
                                        ))}
                                    </div>
                                ) : searchQuery.trim() ? (
                                    <div className="p-8 text-center">
                                        <p className="text-sm text-gray-500">No products found for &quot;{searchQuery}&quot;</p>
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/account" className="flex flex-col items-center gap-1 hover:text-blue-600"><UserRound size={20} /><span className="text-xs font-medium">Account</span></Link>
                        <Link href="/cart" className="flex flex-col items-center gap-1 hover:text-blue-600 relative">
                            <div className="relative">
                                <ShoppingCart size={20} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                        {cartCount > 99 ? "99+" : cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-xs font-medium">Cart</span>
                        </Link>
                        <Link href="/wishlist" className="flex flex-col items-center gap-1 hover:text-blue-600 relative">
                            <div className="relative">
                                <Heart size={20} />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                        {wishlistCount > 99 ? "99+" : wishlistCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-xs font-medium">Wishlist</span>
                        </Link>
                    </div>

                    <Link href="/cart" className="md:hidden relative">
                        <ShoppingCart size={24} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                {cartCount > 99 ? "99+" : cartCount}
                            </span>
                        )}
                    </Link>
                </div>

                <div className="md:hidden mt-3 relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full px-4 py-2 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="absolute right-0 top-0 bottom-0 px-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-r-lg">
                        <Search size={18} />
                    </button>

                    {/* Mobile Search Suggestions */}
                    {showSuggestions && (
                        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-80 overflow-y-auto z-50">
                            {searchLoading ? (
                                <div className="flex items-center justify-center py-6">
                                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                                </div>
                            ) : suggestions.length > 0 ? (
                                <div className="p-2">
                                    <p className="text-xs font-semibold text-gray-500 px-2 py-1">PRODUCTS</p>
                                    {suggestions.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/products/${product.slug || product.id}`}
                                            onClick={() => setShowSuggestions(false)}
                                            className="flex items-center gap-2 px-2 py-2 hover:bg-blue-50 rounded-lg"
                                        >
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
                                                {product.image ? (
                                                    <Image src={product.image} alt={product.title} fill className="object-cover" unoptimized />
                                                ) : (
                                                    <Package className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium line-clamp-1">{product.title}</p>
                                                <p className="text-xs text-blue-600 font-bold">Tk {product.price.toLocaleString()}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : searchQuery.trim() ? (
                                <div className="p-6 text-center">
                                    <p className="text-xs text-gray-500">No products found</p>
                                </div>
                            ) : null}
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
                    <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg">
                        <div className="relative">
                            <Heart size={20} />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                    {wishlistCount > 99 ? "99+" : wishlistCount}
                                </span>
                            )}
                        </div>
                        <span>Wishlist</span>
                    </Link>
                    <Link href="/cart" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg">
                        <div className="relative">
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                    {cartCount > 99 ? "99+" : cartCount}
                                </span>
                            )}
                        </div>
                        <span>Cart</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
}