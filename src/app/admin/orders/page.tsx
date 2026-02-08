"use client";

import React, { useState, useEffect } from "react";
import ProtectedAdmin from "@/components/admin/ProtectAdmin";
import {
    Filter,
    ShoppingCart,
    Eye,
    Loader2,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    Phone,
    MapPin,
    X,
    ChevronLeft,
    ChevronRight,
    Trash2
} from "lucide-react";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface OrderItem {
    id: number;
    productId: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
    selectedColor?: string;
    selectedSize?: string;
    selectedVariant?: { id?: number; name?: string; image?: string; price?: number };
    customSelections?: Record<string, string>;
}

interface Order {
    id: number;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryAddress: string;
    deliveryArea: string;
    deliveryCharge: number;
    subtotal: number;
    total: number;
    paymentMethod: string;
    paymentStatus: string;
    status: string;
    notes: string | null;
    items: OrderItem[];
    user: { id: number; name: string; email: string };
    createdAt: string;
}

const statusColors: { [key: string]: string } = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

const statusIcons: { [key: string]: React.ReactNode } = {
    pending: <Clock className="w-4 h-4" />,
    processing: <Package className="w-4 h-4" />,
    shipped: <Truck className="w-4 h-4" />,
    delivered: <CheckCircle className="w-4 h-4" />,
    cancelled: <XCircle className="w-4 h-4" />,
};

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);

    // Modal state
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [deletingOrder, setDeletingOrder] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            console.log("Fetching orders with token:", token ? "exists" : "missing");

            const params = new URLSearchParams();
            params.set("page", currentPage.toString());
            params.set("limit", "20");
            if (statusFilter !== "All") {
                params.set("status", statusFilter);
            }

            const url = `${API}/orders/admin/all?${params}`;
            console.log("Fetching from:", url);

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Response status:", res.status);

            if (res.ok) {
                const data = await res.json();
                console.log("Orders data:", data);
                setOrders(data.orders || []);
                setTotalPages(data.totalPages || 1);
                setTotalOrders(data.total || 0);
            } else {
                const errorData = await res.json();
                console.error("Error response:", errorData);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, currentPage]);

    // Also fetch on mount
    useEffect(() => {
        console.log("Admin Orders page mounted");
    }, []);

    const handleStatusUpdate = async (orderId: number, newStatus: string) => {
        setUpdatingStatus(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/orders/admin/${orderId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                // Refresh orders
                await fetchOrders();
                // Update selected order if modal is open
                if (selectedOrder?.id === orderId) {
                    setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
                }
            }
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleDeleteOrder = async (orderId: number) => {
        if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
            return;
        }

        setDeletingOrder(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/orders/admin/${orderId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                // Close modal and refresh orders
                setIsModalOpen(false);
                setSelectedOrder(null);
                await fetchOrders();
            } else {
                const error = await res.json();
                alert(error.error || "Failed to delete order");
            }
        } catch (error) {
            console.error("Error deleting order:", error);
            alert("Failed to delete order");
        } finally {
            setDeletingOrder(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-BD", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <ProtectedAdmin>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {totalOrders} total orders
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg border border-gray-100 p-4">
                    <div className="flex items-center gap-4">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <div className="flex gap-2 flex-wrap">
                            {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        setStatusFilter(status);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === status
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                {loading ? (
                    <div className="bg-white rounded-lg border border-gray-100 p-12 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-100 p-12">
                        <div className="text-center">
                            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                            <p className="text-sm text-gray-500 max-w-sm mx-auto">
                                {statusFilter !== "All"
                                    ? `No ${statusFilter.toLowerCase()} orders at the moment.`
                                    : "Orders will appear here once customers start placing them."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Order</th>
                                        <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Customer</th>
                                        <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Items</th>
                                        <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Total</th>
                                        <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-blue-600">{order.orderNumber}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{order.customerName}</p>
                                                    <p className="text-sm text-gray-500">{order.customerPhone}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-600">{order.items.length} items</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-gray-900">Tk {order.total.toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                                                    {statusIcons[order.status]}
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                                <p className="text-sm text-gray-500">
                                    Page {currentPage} of {totalPages}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
                                <p className="text-sm text-blue-600 font-medium">{selectedOrder.orderNumber}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleDeleteOrder(selectedOrder.id)}
                                    disabled={deletingOrder}
                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                    title="Delete Order"
                                >
                                    {deletingOrder ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Customer Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-900">Customer Information</h3>
                                    <div className="space-y-2">
                                        <p className="text-gray-600"><span className="font-medium text-gray-900">Name:</span> {selectedOrder.customerName}</p>
                                        <p className="text-gray-600 flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            {selectedOrder.customerPhone}
                                        </p>
                                        {selectedOrder.customerEmail && (
                                            <p className="text-gray-600">{selectedOrder.customerEmail}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-900">Delivery Address</h3>
                                    <div className="flex items-start gap-2 text-gray-600">
                                        <MapPin className="w-4 h-4 mt-1 shrink-0" />
                                        <div>
                                            <p>{selectedOrder.deliveryAddress}</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {selectedOrder.deliveryArea === "inside" ? "Inside Dhaka" : "Outside Dhaka"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Status Update */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h3 className="font-semibold text-gray-900 mb-3">Update Status</h3>
                                <div className="flex flex-wrap gap-2">
                                    {["pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                                            disabled={updatingStatus || selectedOrder.status === status}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${selectedOrder.status === status
                                                ? statusColors[status] + " ring-2 ring-offset-2 ring-blue-500"
                                                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                                                } disabled:opacity-50`}
                                        >
                                            {statusIcons[status]}
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                                <div className="border border-gray-200 rounded-xl overflow-hidden">
                                    {selectedOrder.items.map((item, idx) => {
                                        // Build variant display
                                        const variantParts: string[] = [];
                                        if (item.selectedVariant?.name) variantParts.push(item.selectedVariant.name);
                                        if (item.selectedColor) variantParts.push(`Color: ${item.selectedColor}`);
                                        if (item.selectedSize) variantParts.push(`Size: ${item.selectedSize}`);
                                        if (item.customSelections) {
                                            Object.entries(item.customSelections).forEach(([key, value]) => {
                                                variantParts.push(`${key}: ${value}`);
                                            });
                                        }
                                        const variantText = variantParts.join(" | ");

                                        return (
                                            <div key={item.id} className={`flex items-center gap-4 p-4 ${idx !== selectedOrder.items.length - 1 ? "border-b border-gray-100" : ""}`}>
                                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden relative shrink-0">
                                                    {item.image && item.image.startsWith('http') ? (
                                                        <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 truncate">{item.title}</p>
                                                    {variantText && (
                                                        <p className="text-sm text-blue-600">{variantText}</p>
                                                    )}
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900">Tk {(item.price * item.quantity).toLocaleString()}</p>
                                                    <p className="text-sm text-gray-500">Tk {item.price} × {item.quantity}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-blue-50 rounded-xl p-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>Tk {selectedOrder.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Delivery Charge</span>
                                        <span>Tk {selectedOrder.deliveryCharge.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Payment Method</span>
                                        <span className="uppercase font-medium">{selectedOrder.paymentMethod}</span>
                                    </div>
                                    <div className="border-t border-blue-200 pt-2 mt-2 flex justify-between">
                                        <span className="font-bold text-gray-900">Total</span>
                                        <span className="font-bold text-blue-600 text-xl">Tk {selectedOrder.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ProtectedAdmin>
    );
}
