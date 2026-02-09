"use client";

import { useState, useEffect, useCallback } from "react";
import { X, User, Phone, Mail, MapPin, Wallet, LogIn, Loader2, CheckCircle, XCircle, ChevronDown, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Address {
    id: number;
    type: string;
    name: string;
    phone: string;
    address: string;
    area: string;
    city: string;
    isDefault: boolean;
}

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    total: number;
}

export default function CheckoutModal({ isOpen, onClose, total }: CheckoutModalProps) {
    const router = useRouter();
    const { refreshCart } = useCart();

    const [location, setLocation] = useState<"inside" | "outside">("inside");
    const [paymentMethod, setPaymentMethod] = useState<"cod" /* | "bkash" | "nagad" */>("cod");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // Saved addresses state
    const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | "custom">("custom");
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [showAddressSelector, setShowAddressSelector] = useState(false);

    // Form state
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");

    // Submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderNumber, setOrderNumber] = useState("");
    const [error, setError] = useState("");

    // Fetch saved addresses
    const fetchAddresses = useCallback(async () => {
        const token = localStorage.getItem("userToken");
        if (!token) return;

        setLoadingAddresses(true);
        try {
            const res = await fetch(`${API}/addresses`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const addresses: Address[] = await res.json();
                setSavedAddresses(addresses);

                // Pre-fill with default address if available
                const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
                if (defaultAddr) {
                    setSelectedAddressId(defaultAddr.id);
                    setCustomerName(defaultAddr.name);
                    setCustomerPhone(defaultAddr.phone);
                    setDeliveryAddress(`${defaultAddr.address}, ${defaultAddr.city}`);
                    setLocation(defaultAddr.area === "inside" ? "inside" : "outside");
                }
            }
        } catch (e) {
            console.error("Error fetching addresses:", e);
        } finally {
            setLoadingAddresses(false);
        }
    }, []);

    // Check if user is logged in and fetch addresses
    useEffect(() => {
        if (isOpen) {
            const token = localStorage.getItem("userToken");
            const loggedIn = !!token;
            setIsLoggedIn(loggedIn);
            setCheckingAuth(false);
            setOrderSuccess(false);
            setError("");

            if (loggedIn) {
                fetchAddresses();
            }
        }
    }, [isOpen, fetchAddresses]);

    // Handle address selection
    const handleAddressSelect = (addressId: number | "custom") => {
        setSelectedAddressId(addressId);
        setShowAddressSelector(false);

        if (addressId === "custom") {
            // Clear form for custom entry
            setCustomerName("");
            setCustomerPhone("");
            setCustomerEmail("");
            setDeliveryAddress("");
            return;
        }

        const selected = savedAddresses.find((a) => a.id === addressId);
        if (selected) {
            setCustomerName(selected.name);
            setCustomerPhone(selected.phone);
            setDeliveryAddress(`${selected.address}, ${selected.city}`);
            setLocation(selected.area === "inside" ? "inside" : "outside");
        }
    };

    if (!isOpen) return null;

    const deliveryCharge = location === "inside" ? 80 : 150;
    const finalTotal = total + deliveryCharge;

    // Handle order submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!customerName.trim()) {
            setError("Please enter your name");
            return;
        }
        if (!customerPhone.trim()) {
            setError("Please enter your phone number");
            return;
        }
        if (!deliveryAddress.trim()) {
            setError("Please enter your delivery address");
            return;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("userToken");
            const res = await fetch(`${API}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    customerName: customerName.trim(),
                    customerEmail: customerEmail.trim(),
                    customerPhone: customerPhone.trim(),
                    deliveryAddress: deliveryAddress.trim(),
                    deliveryArea: location,
                    paymentMethod,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to place order");
            }

            // Success!
            setOrderNumber(data.order.orderNumber);
            setOrderSuccess(true);

            // Refresh cart to clear items
            await refreshCart();

            // Reset form
            setCustomerName("");
            setCustomerPhone("");
            setCustomerEmail("");
            setDeliveryAddress("");

        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to place order");
        } finally {
            setIsSubmitting(false);
        }
    };

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

    // Show success message
    if (orderSuccess) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 relative text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Order Placed!</h2>
                    <p className="text-gray-600 mb-2">
                        Your order has been placed successfully.
                    </p>
                    <p className="text-lg font-semibold text-blue-600 mb-6">
                        Order Number: {orderNumber}
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        We will contact you shortly to confirm your order.
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                onClose();
                                router.push("/myprofile?tab=orders");
                            }}
                            className="block w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer"
                        >
                            View My Orders
                        </button>
                        <button
                            onClick={() => {
                                onClose();
                                router.push("/");
                            }}
                            className="block w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-200 transition cursor-pointer"
                        >
                            Continue Shopping
                        </button>
                    </div>
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

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                        <XCircle size={20} className="text-red-500 shrink-0" />
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {/* Saved Address Selector */}
                {savedAddresses.length > 0 && (
                    <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <MapPin size={16} className="text-blue-500" /> Delivery Address
                        </p>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowAddressSelector(!showAddressSelector)}
                                className="w-full flex items-center justify-between gap-3 px-4 py-3 border-2 border-blue-200 bg-blue-50 rounded-xl hover:border-blue-400 transition"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <MapPin size={18} className="text-blue-500 shrink-0" />
                                    <span className="text-sm text-gray-700 truncate">
                                        {selectedAddressId === "custom"
                                            ? "Enter new address"
                                            : savedAddresses.find((a) => a.id === selectedAddressId)?.address || "Select address"}
                                    </span>
                                </div>
                                <ChevronDown size={18} className={`text-gray-500 shrink-0 transition-transform ${showAddressSelector ? "rotate-180" : ""}`} />
                            </button>

                            {showAddressSelector && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-60 overflow-y-auto">
                                    {savedAddresses.map((addr) => (
                                        <button
                                            key={addr.id}
                                            type="button"
                                            onClick={() => handleAddressSelect(addr.id)}
                                            className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition text-left border-b border-gray-100 last:border-b-0 ${selectedAddressId === addr.id ? "bg-blue-50" : ""
                                                }`}
                                        >
                                            <MapPin size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                                                    {addr.name}
                                                    {addr.isDefault && (
                                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Default</span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">{addr.address}, {addr.city}</p>
                                                <p className="text-xs text-gray-400">{addr.phone}</p>
                                            </div>
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => handleAddressSelect("custom")}
                                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left ${selectedAddressId === "custom" ? "bg-blue-50" : ""
                                            }`}
                                    >
                                        <Plus size={16} className="text-green-500" />
                                        <span className="text-sm text-gray-700">Enter different address</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {loadingAddresses && (
                    <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                        <Loader2 size={16} className="animate-spin" />
                        Loading saved addresses...
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Personal Info - Side by Side */}
                    <div className="grid md:grid-cols-2 gap-3">
                        <label className="block">
                            <div className="flex items-center gap-3 px-4 py-3 border rounded-xl focus-within:ring-2 focus-within:ring-blue-400 transition">
                                <User size={18} className="text-blue-500 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    required
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full bg-transparent outline-none text-sm"
                                />
                            </div>
                        </label>

                        <label className="block">
                            <div className="flex items-center gap-3 px-4 py-3 border rounded-xl focus-within:ring-2 focus-within:ring-green-400 transition">
                                <Phone size={18} className="text-green-500 shrink-0" />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    required
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    className="w-full bg-transparent outline-none text-sm"
                                />
                            </div>
                        </label>
                    </div>

                    {/* Email */}
                    <label className="block">
                        <div className="flex items-center gap-3 px-4 py-3 border rounded-xl focus-within:ring-2 focus-within:ring-yellow-400 transition">
                            <Mail size={18} className="text-yellow-600 shrink-0" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                required
                                value={customerEmail}
                                onChange={(e) => setCustomerEmail(e.target.value)}
                                className="w-full bg-transparent outline-none text-sm"
                            />
                        </div>
                    </label>

                    {/* Address */}
                    <label className="block">
                        <div className="flex items-start gap-3 px-4 py-3 border rounded-xl focus-within:ring-2 focus-within:ring-blue-400 transition">
                            <MapPin size={18} className="text-blue-500 mt-1 shrink-0" />
                            <textarea
                                placeholder="Delivery Address"
                                required
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                className="w-full bg-transparent outline-none text-sm resize-none"
                                rows={2}
                            />
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

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-linear-to-r from-blue-600 to-green-600 text-white p-3 rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 transition cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Placing Order...
                            </>
                        ) : (
                            "Place Order"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
