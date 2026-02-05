"use client";

import { useState } from "react";
import CartItem from "@/components/CartItem";
import CheckoutModal from "@/components/CheckoutModal";
import CategoryNav from "@/components/CategoryNav";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [items, setItems] = useState([
        { id: "1", title: "Gaming Monitor 144Hz", price: 100, image: "/products/monitor.png", quantity: 1 },
        { id: "2", title: "Mechanical Keyboard", price: 200, image: "/products/keyboard.png", quantity: 2 },

    ]);

    const handleQuantityChange = (id: string, qty: number) => {
        if (qty < 1) return;
        setItems(items.map(item => item.id === id ? { ...item, quantity: qty } : item));
    };

    const handleRemove = (id: string) => setItems(items.filter(item => item.id !== id));

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-50 px-4">
                <div className="text-center">
                    <ShoppingCart size={60} className="sm:w-20 sm:h-20 mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-6">Add some products to get started!</p>
                    <Link href="/" className="inline-block bg-gray-900 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-gray-800 transition cursor-pointer text-sm sm:text-base">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <CategoryNav />
            <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} total={subtotal} />
            <div className="min-h-screen pt-12 sm:pt-8 pb-8 sm:pb-12 bg-linear-to-br from-gray-100 to-gray-50">
                <div className="max-w-6xl mx-auto px-3 sm:px-4">
                    <div className="bg-white  rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-12">
                        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                            {/* Left: Shopping Cart */}
                            <div className="lg:col-span-2">
                                <div className="flex items-center justify-between mb-6 sm:mb-8">
                                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Shopping Cart</h1>
                                    <span className="text-sm sm:text-base text-gray-500">{items.length} items</span>
                                </div>

                                <div className="space-y-4 sm:space-y-6">
                                    {items.map(item => (
                                        <CartItem
                                            key={item.id}
                                            {...item}
                                            onQuantityChange={handleQuantityChange}
                                            onRemove={handleRemove}
                                        />
                                    ))}
                                </div>

                                <Link href="/" className="text-blue-600 hover:underline mt-6 sm:mt-8 inline-flex items-center text-xs sm:text-sm font-medium">
                                    ← Back to shop
                                </Link>
                            </div>

                            {/* Right: Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:sticky lg:top-4">
                                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Summary</h2>

                                    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                                        <div className="flex justify-between text-gray-600">
                                            <span className="text-xs sm:text-sm">ITEMS {items.length}</span>
                                            <span className="font-medium text-sm sm:text-base">Tk {subtotal.toLocaleString()}</span>
                                        </div>

                                        <div>
                                            <label className="block text-xs sm:text-sm text-gray-600 mb-2">GIVE CODE</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Enter your code"
                                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                />
                                                <button className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium cursor-pointer">
                                                    →
                                                </button>
                                            </div>
                                        </div>

                                        <div className="border-t pt-3 sm:pt-4 flex justify-between items-center">
                                            <span className="text-xs sm:text-sm text-gray-600">TOTAL PRICE</span>
                                            <span className="text-lg sm:text-xl font-bold text-gray-900">৳ {subtotal.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <button onClick={() => setIsCheckoutOpen(true)} className="w-full bg-gray-900 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-800 transition uppercase text-xs sm:text-sm cursor-pointer">
                                        Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
