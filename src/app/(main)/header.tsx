"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingCart, Search, Heart, UserRound, Menu, X } from "lucide-react";

export default function Header() {
    const [searchQuery, setSearchQuery] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="bg-white shadow-sm ">
            <div className="max-w-7xl mx-auto px-4 py-1">
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

                    <div className="hidden md:flex flex-1 max-w-2xl relative">
                        <input type="text" placeholder="Search for products, brands and more..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-4 py-2.5 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <button className="absolute right-0 top-0 bottom-0 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-r-lg hover:from-blue-700 hover:to-indigo-700"><Search size={20} /></button>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/account" className="flex flex-col items-center gap-1 hover:text-blue-600"><UserRound size={20} /><span className="text-xs font-medium">Account</span></Link>
                        <Link href="/cart" className="flex flex-col items-center gap-1 hover:text-blue-600"><ShoppingCart size={20} /><span className="text-xs font-medium">Cart</span></Link>
                        <Link href="/wishlist" className="flex flex-col items-center gap-1 hover:text-blue-600"><Heart size={20} /><span className="text-xs font-medium">Wishlist</span></Link>
                    </div>

                    <Link href="/cart" className="md:hidden"><ShoppingCart size={24} /></Link>
                </div>

                <div className="md:hidden mt-3 relative">
                    <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-4 py-2 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button className="absolute right-0 top-0 bottom-0 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-r-lg"><Search size={18} /></button>
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