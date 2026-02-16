"use client";

import { useState, useEffect, useCallback } from "react";
import { Package, ChevronRight, ArrowLeft, Eye, MapPin, Phone, User, CreditCard, CheckCircle, XCircle, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface OrderItem {
    id: number;
    productId: number;
    title: string;
    price: number;
    quantity: number;
    image: string | null;
    selectedColor?: string;
    selectedSize?: string;
}

interface Order {
    id: number;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    deliveryArea: string;
    deliveryCharge: number;
    subtotal: number;
    total: number;
    paymentMethod: string;
    paymentStatus: string;
    status: string;
    items: OrderItem[];
    createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

export default function MyOrdersPage() {
    const { loading: authLoading, authFetch, user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [filter, setFilter] = useState("all");
    const [error, setError] = useState<string | null>(null);
    const [isAuthError, setIsAuthError] = useState(false);

    const fetchOrders = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        setError(null);
        setIsAuthError(false);

        try {
            console.log("Fetching orders for user:", user?.email);
            const res = await authFetch("/orders/my-orders");
            console.log("Response status:", res.status);

            if (res.ok) {
                const data = await res.json();
                console.log("Fetched orders:", data);
                setOrders(data);
                setError(null);
                setIsAuthError(false);
            } else if (res.status === 401) {
                // Authentication error - token expired or invalid
                console.error("Authentication failed - redirecting to login");
                setError("Your session has expired. Please log in again.");
                setIsAuthError(true);
                // Redirect to login after a brief delay
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            } else {
                // Other errors (network, server, etc.) - don't logout
                const errData = await res.json().catch(() => ({ error: "Failed to fetch orders" }));
                console.error("Error response:", errData);
                setError(errData.error || `Server error (${res.status}). Please try again.`);
                setIsAuthError(false);
            }
        } catch (e) {
            console.error("Error fetching orders:", e);
            // Network errors or other exceptions - don't logout
            if (e instanceof Error && e.message === "Not authenticated") {
                setError("Please log in to view your orders.");
                setIsAuthError(true);
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            } else {
                setError("Network error. Please check your connection and try again.");
                setIsAuthError(false);
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [authFetch, user]);

    useEffect(() => {
        if (!authLoading) fetchOrders();
    }, [authLoading, fetchOrders]);

    // Auto-refresh every 30 seconds when viewing orders
    useEffect(() => {
        const interval = setInterval(() => {
            if (!authLoading && !loading) {
                fetchOrders(true);
            }
        }, 30000);
        return () => clearInterval(interval);
    }, [authLoading, loading, fetchOrders]);

    const handleRefresh = () => {
        fetchOrders(true);
    };

    const handleBackToOrders = () => {
        setSelectedOrder(null);
        fetchOrders(true); // Refresh when going back
    };

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" });

    const filteredOrders = filter === "all" ? orders : orders.filter(o => o.status === filter);

    const Badge = ({ status }: { status: string }) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[status] || "bg-gray-100"}`}>
            {status}
        </span>
    );

    if (loading || authLoading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-48"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    // Order Detail View
    if (selectedOrder) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-8">
                <button
                    onClick={handleBackToOrders}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 cursor-pointer"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Orders
                </button>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {/* Order Header */}
                    <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-6 border-b">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Order {selectedOrder.orderNumber}</h1>
                                <p className="text-sm text-gray-600 mt-1">Placed on {formatDate(selectedOrder.createdAt)}</p>
                            </div>
                            <Badge status={selectedOrder.status} />
                        </div>
                    </div>

                    {/* Order Progress */}
                    <div className="p-6 border-b bg-gray-50">
                        <div className="flex justify-between items-center max-w-2xl mx-auto">
                            {["pending", "processing", "shipped", "delivered"].map((step, idx) => {
                                const stepOrder = ["pending", "processing", "shipped", "delivered"];
                                const currentIdx = stepOrder.indexOf(selectedOrder.status);
                                const isCompleted = selectedOrder.status !== "cancelled" && idx <= currentIdx;
                                const isCancelled = selectedOrder.status === "cancelled";

                                return (
                                    <div key={step} className="flex flex-col items-center flex-1">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCancelled
                                            ? "bg-red-100 text-red-600"
                                            : isCompleted
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-200 text-gray-400"
                                            }`}>
                                            {isCancelled ? (
                                                <XCircle className="w-5 h-5" />
                                            ) : isCompleted ? (
                                                <CheckCircle className="w-5 h-5" />
                                            ) : (
                                                <span className="text-xs">{idx + 1}</span>
                                            )}
                                        </div>
                                        <span className={`text-xs mt-2 capitalize ${isCompleted ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                                            {step}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 p-6">
                        {/* Delivery Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-blue-600" />
                                Delivery Information
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">{selectedOrder.customerName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">{selectedOrder.customerPhone}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <span className="text-sm">{selectedOrder.deliveryAddress}</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-2">
                                    {selectedOrder.deliveryArea === "inside" ? "Inside Dhaka" : "Outside Dhaka"}
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                                Payment Information
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Method</span>
                                    <span className="font-medium capitalize">{selectedOrder.paymentMethod === "cod" ? "Cash on Delivery" : selectedOrder.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Payment Status</span>
                                    <span className={`font-medium capitalize ${selectedOrder.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"
                                        }`}>
                                        {selectedOrder.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6 border-t">
                        <h3 className="font-semibold text-gray-900 mb-4">Order Items ({selectedOrder.items.length})</h3>
                        <div className="space-y-4">
                            {selectedOrder.items.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="w-20 h-20 bg-white rounded-lg overflow-hidden shrink-0">
                                        {item.image ? (
                                            <Image
                                                src={item.image.startsWith("http") ? item.image : `${API_URL.replace("/api", "")}${item.image}`}
                                                alt={item.title}
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                                unoptimized
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = "none";
                                                    const parent = target.parentElement;
                                                    if (parent) {
                                                        parent.innerHTML = `<div class="w-full h-full bg-gray-200 flex items-center justify-center"><svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg></div>`;
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <Package className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
                                        <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-500">
                                            {item.selectedColor && (
                                                <span className="bg-white px-2 py-0.5 rounded">Color: {item.selectedColor}</span>
                                            )}
                                            {item.selectedSize && (
                                                <span className="bg-white px-2 py-0.5 rounded">Size: {item.selectedSize}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                                            <span className="font-semibold text-gray-900">Tk {(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="p-6 border-t bg-gray-50">
                        <div className="max-w-xs ml-auto space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span>Tk {selectedOrder.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Delivery</span>
                                <span>Tk {selectedOrder.deliveryCharge.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                <span>Total</span>
                                <span className="text-blue-600">Tk {selectedOrder.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Orders List View
    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <Link href="/account" className="text-gray-400 hover:text-gray-600">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                        <p className="text-sm text-gray-500">Track and manage your orders</p>
                    </div>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
                    {refreshing ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${isAuthError
                        ? "bg-red-50 border-red-200"
                        : "bg-yellow-50 border-yellow-200"
                    }`}>
                    <AlertCircle className={`w-5 h-5 mt-0.5 shrink-0 ${isAuthError ? "text-red-600" : "text-yellow-600"
                        }`} />
                    <div className="flex-1">
                        <p className={`text-sm font-medium ${isAuthError ? "text-red-900" : "text-yellow-900"
                            }`}>
                            {isAuthError ? "Authentication Error" : "Temporary Error"}
                        </p>
                        <p className={`text-sm mt-1 ${isAuthError ? "text-red-600" : "text-yellow-700"
                            }`}>
                            {error}
                        </p>
                        {!isAuthError && (
                            <button
                                onClick={() => fetchOrders(true)}
                                className="mt-2 text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
                            >
                                Try again
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {[
                    { value: "all", label: "All Orders" },
                    { value: "pending", label: "Pending" },
                    { value: "processing", label: "Processing" },
                    { value: "shipped", label: "Shipped" },
                    { value: "delivered", label: "Delivered" },
                    { value: "cancelled", label: "Cancelled" },
                ].map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => setFilter(opt.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === opt.value
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {filter === "all" ? "No orders yet" : `No ${filter} orders`}
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {filter === "all"
                            ? "When you place orders, they will appear here"
                            : "You don't have any orders with this status"}
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Start Shopping
                        <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 transition-colors"
                        >
                            {/* Order Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 border-b">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                                        <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                                    </div>
                                </div>
                                <Badge status={order.status} />
                            </div>

                            {/* Order Items Preview */}
                            <div className="p-4">
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {order.items.slice(0, 4).map((item) => (
                                        <div key={item.id} className="shrink-0">
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                                {item.image ? (
                                                    <Image
                                                        src={item.image.startsWith("http") ? item.image : `${API_URL.replace("/api", "")}${item.image}`}
                                                        alt={item.title}
                                                        width={64}
                                                        height={64}
                                                        className="w-full h-full object-cover"
                                                        unoptimized
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = "none";
                                                            const parent = target.parentElement;
                                                            if (parent) {
                                                                parent.innerHTML = `<div class="w-full h-full flex items-center justify-center"><svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg></div>`;
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {order.items.length > 4 && (
                                        <div className="shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <span className="text-sm text-gray-500">+{order.items.length - 4}</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    {order.items.length} item{order.items.length > 1 ? "s" : ""}
                                </p>
                            </div>

                            {/* Order Footer */}
                            <div className="flex items-center justify-between p-4 border-t bg-gray-50">
                                <div>
                                    <span className="text-sm text-gray-500">Total:</span>
                                    <span className="ml-2 font-bold text-gray-900">Tk {order.total.toLocaleString()}</span>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Eye className="w-4 h-4" />
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
