"use client";

import React, { useState, useEffect, useCallback } from "react";
import ProtectedAdmin from "@/components/admin/ProtectAdmin";
import {
    Package,
    ShoppingCart,
    DollarSign,
    Clock,
    TrendingUp,
    AlertTriangle,
    BarChart3,
    RefreshCw
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Order {
    id: number;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    total: number;
    status: string;
    createdAt: string;
    items: { id: number; title: string; quantity: number }[];
}

interface LowStockProduct {
    id: number;
    title: string;
    slug: string;
    stock: number;
    images: string[];
    subcategory: { name: string } | null;
}

interface DashboardStats {
    totalProducts: number;
    totalOrders: number;
    totalSales: number;
    pendingOrders: number;
    processingOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
}

interface SalesData {
    day: string;
    sales: number;
    orders: number;
}

const statusColors: { [key: string]: string } = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-green-100 text-green-700",
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalProducts: 0,
        totalOrders: 0,
        totalSales: 0,
        pendingOrders: 0,
        processingOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
    });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
    const [salesData, setSalesData] = useState<SalesData[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const getAdminToken = () => localStorage.getItem("adminToken");

    const fetchDashboardData = useCallback(async () => {
        try {
            const token = getAdminToken();
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch all data in parallel
            const [productsRes, statsRes, ordersRes, lowStockRes, salesRes] = await Promise.all([
                fetch(`${API_URL}/products?limit=1`).catch(() => null),
                fetch(`${API_URL}/orders/admin/stats/summary`, { headers }).catch(() => null),
                fetch(`${API_URL}/orders/admin/all?limit=5`, { headers }).catch(() => null),
                fetch(`${API_URL}/products/admin/low-stock?threshold=10`, { headers }).catch(() => null),
                fetch(`${API_URL}/orders/admin/stats/sales-chart?days=7`, { headers }).catch(() => null),
            ]);

            // Products count
            let totalProducts = 0;
            if (productsRes?.ok) {
                const data = await productsRes.json();
                totalProducts = data.total || 0;
            }

            // Order stats
            let orderStats = {
                totalOrders: 0,
                pendingOrders: 0,
                processingOrders: 0,
                deliveredOrders: 0,
                cancelledOrders: 0,
                totalRevenue: 0,
            };
            if (statsRes?.ok) {
                orderStats = await statsRes.json();
            }

            // Recent orders
            let orders: Order[] = [];
            if (ordersRes?.ok) {
                const data = await ordersRes.json();
                orders = data.orders || [];
            }

            // Low stock products
            let lowStock: LowStockProduct[] = [];
            if (lowStockRes?.ok) {
                const data = await lowStockRes.json();
                lowStock = data.products || [];
            }

            // Sales chart data
            let sales: SalesData[] = [];
            if (salesRes?.ok) {
                sales = await salesRes.json();
            }

            setStats({
                totalProducts,
                totalOrders: orderStats.totalOrders,
                totalSales: orderStats.totalRevenue,
                pendingOrders: orderStats.pendingOrders,
                processingOrders: orderStats.processingOrders,
                deliveredOrders: orderStats.deliveredOrders,
                cancelledOrders: orderStats.cancelledOrders,
            });
            setRecentOrders(orders);
            setLowStockProducts(lowStock);
            setSalesData(sales);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
    }, [fetchDashboardData]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchDashboardData();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-BD", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
        });
    };

    // Calculate max sales for chart scaling
    const maxSales = Math.max(...salesData.map(d => d.sales), 1);

    // Order status distribution for pie chart
    const orderDistribution = [
        { label: "Pending", count: stats.pendingOrders, color: "#FBBF24" },
        { label: "Completed", count: stats.deliveredOrders, color: "#10B981" },
        { label: "Cancelled", count: stats.cancelledOrders, color: "#EF4444" },
    ].filter(d => d.count > 0);

    const totalForPie = orderDistribution.reduce((acc, d) => acc + d.count, 0);

    return (
        <ProtectedAdmin>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-sm text-gray-500 mt-1">Welcome back! Here&apos;s your store overview.</p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <p className="text-sm text-gray-500 mb-2">Total Products</p>
                        <div className="flex items-center gap-3">
                            <Package className="w-6 h-6 text-blue-600" />
                            <span className="text-2xl font-bold text-gray-900">
                                {loading ? "..." : stats.totalProducts}
                            </span>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <p className="text-sm text-gray-500 mb-2">Total Orders</p>
                        <div className="flex items-center gap-3">
                            <ShoppingCart className="w-6 h-6 text-green-600" />
                            <span className="text-2xl font-bold text-gray-900">
                                {loading ? "..." : stats.totalOrders}
                            </span>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <p className="text-sm text-gray-500 mb-2">Total Sales</p>
                        <div className="flex items-center gap-3">
                            <DollarSign className="w-6 h-6 text-yellow-600" />
                            <span className="text-2xl font-bold text-gray-900">
                                {loading ? "..." : `৳${stats.totalSales.toLocaleString()}`}
                            </span>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <p className="text-sm text-gray-500 mb-2">Pending Orders</p>
                        <div className="flex items-center gap-3">
                            <Clock className="w-6 h-6 text-purple-600" />
                            <span className="text-2xl font-bold text-gray-900">
                                {loading ? "..." : stats.pendingOrders}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sales Chart */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <BarChart3 className="w-5 h-5 text-gray-500" />
                            <h3 className="text-lg font-semibold text-gray-900">Sales (Last 7 Days)</h3>
                        </div>
                        {salesData.length > 0 ? (
                            <div className="h-48 flex items-end justify-between gap-2">
                                {salesData.map((day, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                        <div
                                            className="w-full bg-blue-500 rounded-t-sm transition-all hover:bg-blue-600"
                                            style={{
                                                height: `${Math.max((day.sales / maxSales) * 100, 5)}%`,
                                                minHeight: "8px"
                                            }}
                                            title={`Tk ${day.sales.toLocaleString()}`}
                                        />
                                        <span className="text-xs text-gray-500">{day.day}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-48 flex items-center justify-center text-gray-400">
                                <p>No sales data available</p>
                            </div>
                        )}
                    </div>

                    {/* Order Status Distribution */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="w-5 h-5 text-gray-500" />
                            <h3 className="text-lg font-semibold text-gray-900">Order Status Distribution</h3>
                        </div>
                        {totalForPie > 0 ? (
                            <div className="flex items-center justify-center gap-8">
                                {/* Simple Donut Chart */}
                                <div className="relative w-40 h-40">
                                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                                        {(() => {
                                            let cumulative = 0;
                                            return orderDistribution.map((segment, idx) => {
                                                const percentage = (segment.count / totalForPie) * 100;
                                                const strokeDasharray = `${percentage} ${100 - percentage}`;
                                                const strokeDashoffset = -cumulative;
                                                cumulative += percentage;
                                                return (
                                                    <circle
                                                        key={idx}
                                                        cx="18"
                                                        cy="18"
                                                        r="15.915"
                                                        fill="none"
                                                        stroke={segment.color}
                                                        strokeWidth="3"
                                                        strokeDasharray={strokeDasharray}
                                                        strokeDashoffset={strokeDashoffset}
                                                        strokeLinecap="round"
                                                    />
                                                );
                                            });
                                        })()}
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-xl font-bold text-gray-900">{totalForPie}</span>
                                    </div>
                                </div>
                                {/* Legend */}
                                <div className="space-y-3">
                                    {orderDistribution.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <span className="text-sm" style={{ color: item.color }}>
                                                {item.label}: {item.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="h-40 flex items-center justify-center text-gray-400">
                                <p>No orders yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Low Stock Alert */}
                {lowStockProducts.length > 0 && (
                    <div className="bg-orange-50 rounded-xl border border-orange-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-orange-200 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                            <h3 className="font-semibold text-orange-800">
                                Low Stock Alert ({lowStockProducts.length} products)
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-orange-100/50">
                                    <tr>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-orange-700 uppercase">Product</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-orange-700 uppercase">Category</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-orange-700 uppercase">Stock</th>
                                        <th className="text-center px-6 py-3 text-xs font-medium text-orange-700 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-orange-100">
                                    {lowStockProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-orange-100/30">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white rounded-lg overflow-hidden relative shrink-0">
                                                        {product.images?.[0] ? (
                                                            <Image
                                                                src={product.images[0]}
                                                                alt={product.title}
                                                                fill
                                                                className="object-cover"
                                                                unoptimized
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                                <Package className="w-5 h-5 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-gray-900">{product.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {product.subcategory?.name || "Uncategorized"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                    {product.stock} left
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Link
                                                    href={`/admin/products/${product.id}/edit`}
                                                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                                >
                                                    Restock
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Recent Orders */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-gray-500" />
                            <h3 className="font-semibold text-gray-900">Recent Orders</h3>
                        </div>
                        <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700">
                            View All
                        </Link>
                    </div>
                    {recentOrders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-sm text-gray-600">
                                                    #{order.orderNumber.slice(-8)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {order.customerName}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                ৳{order.total.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {formatDate(order.createdAt)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No orders yet</p>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedAdmin>
    );
}
