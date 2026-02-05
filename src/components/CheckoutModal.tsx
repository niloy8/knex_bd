"use client";

import { useState, useEffect } from "react";
import { X, User, Phone, Mail, MapPin, Wallet, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    total: number;
}

export default function CheckoutModal({ isOpen, onClose, total }: CheckoutModalProps) {
    const [location, setLocation] = useState<"inside" | "outside">("inside");
    const [paymentMethod, setPaymentMethod] = useState<"cod" /* | "bkash" | "nagad" */>("cod");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // Check if user is logged in
    useEffect(() => {
        if (isOpen) {
            const token = localStorage.getItem("userToken");
            setIsLoggedIn(!!token);
            setCheckingAuth(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const deliveryCharge = location === "inside" ? 80 : 150;
    const finalTotal = total + deliveryCharge;

    // Show login prompt if not logged in
    if (!checkingAuth && !isLoggedIn) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 relative text-center">
                    <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 cursor-pointer z-10">
                        <X size={24} />
                    </button>

                    <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <LogIn size={36} className="text-white" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Login Required</h2>
                    <p className="text-gray-600 mb-6">
                        Please login or create an account to complete your purchase. Your cart will be saved.
                    </p>

                    <div className="space-y-3">
                        <Link
                            href="/login"
                            onClick={onClose}
                            className="block w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            onClick={onClose}
                            className="block w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                        >
                            Create Account
                        </Link>
                    </div>

                    <p className="text-sm text-gray-500 mt-6">
                        Your cart items are saved and will be available after login.
                    </p>
                </div>
            </div>
        );
    }

    // Show loading while checking auth
    if (checkingAuth) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 cursor-pointer z-10">
                    <X size={24} />
                </button>

                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 relative shrink-0">
                        <Image src="https://knex.com.bd/wp-content/uploads/2025/07/3d-png.png" alt="KNEX" fill className="object-contain" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Checkout</h2>
                        <p className="text-xs text-gray-500">Complete your order</p>
                    </div>
                </div>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    {/* Personal Info - Side by Side */}
                    <div className="grid md:grid-cols-2 gap-3">
                        <label className="block">
                            <div className="flex items-center gap-3 px-4 py-3 border rounded-xl focus-within:ring-2 focus-within:ring-blue-400 transition">
                                <User size={18} className="text-blue-500 shrink-0" />
                                <input type="text" placeholder="Full Name" required className="w-full bg-transparent outline-none text-sm" />
                            </div>
                        </label>

                        <label className="block">
                            <div className="flex items-center gap-3 px-4 py-3 border rounded-xl focus-within:ring-2 focus-within:ring-green-400 transition">
                                <Phone size={18} className="text-green-500 shrink-0" />
                                <input type="tel" placeholder="Phone Number" required className="w-full bg-transparent outline-none text-sm" />
                            </div>
                        </label>
                    </div>

                    {/* Email */}
                    <label className="block">
                        <div className="flex items-center gap-3 px-4 py-3 border rounded-xl focus-within:ring-2 focus-within:ring-yellow-400 transition">
                            <Mail size={18} className="text-yellow-600 shrink-0" />
                            <input type="email" placeholder="Email Address" required className="w-full bg-transparent outline-none text-sm" />
                        </div>
                    </label>

                    {/* Address */}
                    <label className="block">
                        <div className="flex items-start gap-3 px-4 py-3 border rounded-xl focus-within:ring-2 focus-within:ring-blue-400 transition">
                            <MapPin size={18} className="text-blue-500 mt-1 shrink-0" />
                            <textarea placeholder="Delivery Address" required className="w-full bg-transparent outline-none text-sm resize-none" rows={2} />
                        </div>
                    </label>

                    {/* Delivery Location */}
                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-3">Delivery Location</p>
                        <div className="grid grid-cols-2 gap-3">
                            <label className="flex items-center gap-3 px-4 py-3 border-2 rounded-xl cursor-pointer hover:bg-blue-50 transition" style={{ borderColor: location === "inside" ? "#3b82f6" : "#e5e7eb" }}>
                                <input type="radio" name="location" checked={location === "inside"} onChange={() => setLocation("inside")} className="w-4 h-4 text-blue-600 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm">Inside Dhaka</p>
                                    <p className="text-xs text-gray-500">Delivery: Tk 80</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 px-4 py-3 border-2 rounded-xl cursor-pointer hover:bg-green-50 transition" style={{ borderColor: location === "outside" ? "#22c55e" : "#e5e7eb" }}>
                                <input type="radio" name="location" checked={location === "outside"} onChange={() => setLocation("outside")} className="w-4 h-4 text-green-600 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm">Outside Dhaka</p>
                                    <p className="text-xs text-gray-500">Delivery: Tk 150</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Wallet size={16} className="text-yellow-600" /> Payment Method
                        </p>
                        <div className="grid grid-cols-1 gap-3">
                            {/* Cash on Delivery - Active */}
                            <label className="flex items-center gap-3 px-4 py-4 border-2 rounded-xl cursor-pointer hover:border-blue-400 transition" style={{ borderColor: paymentMethod === "cod" ? "#3b82f6" : "#e5e7eb", backgroundColor: paymentMethod === "cod" ? "#eff6ff" : "transparent" }}>
                                <input type="radio" name="payment" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="w-4 h-4" />
                                <div>
                                    <p className="font-semibold text-sm">Cash on Delivery</p>
                                    <p className="text-xs text-gray-500">Pay when you receive</p>
                                </div>
                            </label>

                            {/* bKash - Commented Out */}
                            {/*
                            <label className="flex items-center gap-3 px-4 py-4 border-2 rounded-xl cursor-pointer hover:border-pink-400 transition" style={{ borderColor: paymentMethod === "bkash" ? "#e91e63" : "#e5e7eb", backgroundColor: paymentMethod === "bkash" ? "#fce7f3" : "transparent" }}>
                                <input type="radio" name="payment" checked={paymentMethod === "bkash"} onChange={() => setPaymentMethod("bkash")} className="w-4 h-4" />
                                <div>
                                    <p className="font-semibold text-sm text-pink-600">bKash</p>
                                    <p className="text-xs text-gray-500">Pay with bKash</p>
                                </div>
                            </label>
                            */}

                            {/* Nagad - Commented Out */}
                            {/*
                            <label className="flex items-center gap-3 px-4 py-4 border-2 rounded-xl cursor-pointer hover:border-orange-400 transition" style={{ borderColor: paymentMethod === "nagad" ? "#f97316" : "#e5e7eb", backgroundColor: paymentMethod === "nagad" ? "#ffedd5" : "transparent" }}>
                                <input type="radio" name="payment" checked={paymentMethod === "nagad"} onChange={() => setPaymentMethod("nagad")} className="w-4 h-4" />
                                <div>
                                    <p className="font-semibold text-sm text-orange-600">Nagad</p>
                                    <p className="text-xs text-gray-500">Pay with Nagad</p>
                                </div>
                            </label>
                            */}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-linear-to-r from-blue-50 to-green-50 rounded-xl p-5 border border-blue-100 mt-2">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Subtotal</span>
                            <span className="font-medium text-sm">Tk {total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Delivery</span>
                            <span className="font-medium text-sm text-green-600">Tk {deliveryCharge}</span>
                        </div>
                        <div className="border-t border-gray-300 pt-3 mt-2 flex justify-between items-center">
                            <span className="font-bold text-gray-900 text-base">Total</span>
                            <span className="text-2xl font-bold text-blue-600">Tk {finalTotal.toLocaleString()}</span>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-linear-to-r from-blue-600 to-green-600 text-white p-3 rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 transition cursor-pointer mt-2">
                        Place Order
                    </button>
                </form>
            </div>
        </div>
    );
}
