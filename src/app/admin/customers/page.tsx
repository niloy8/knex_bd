"use client";

import React, { useState, useEffect, useCallback } from "react";
import ProtectedAdmin from "@/components/admin/ProtectAdmin";
import { Users, Download, Search, TrendingUp, ShoppingBag, DollarSign, UserPlus, ChevronLeft, ChevronRight, ArrowUpDown, Mail, Phone, MapPin, Calendar } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Customer {
    id: number;
    name: string;
    email: string;
    totalOrders: number;
    completedOrders: number;
    totalSpent: number;
    avgOrderValue: number;
    lastOrderDate: string | null;
    joinedAt: string;
}

interface CustomerStats {
    totalCustomers: number;
    activeCustomers: number;
    avgSpend: number;
    newCustomersThisMonth: number;
}

export default function AdminCustomers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [stats, setStats] = useState<CustomerStats>({
        totalCustomers: 0,
        activeCustomers: 0,
        avgSpend: 0,
        newCustomersThisMonth: 0,
    });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("orders");
    const [sortOrder, setSortOrder] = useState("desc");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [exporting, setExporting] = useState(false);

    const fetchStats = useCallback(async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/users/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    }, []);

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "20",
                sortBy,
                sortOrder,
            });
            if (search) params.set("search", search);

            const res = await fetch(`${API}/users/admin/customers?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setCustomers(data.customers);
                setTotalPages(data.pagination.totalPages);
                setTotal(data.pagination.total);
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setLoading(false);
        }
    }, [page, search, sortBy, sortOrder]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleExport = async () => {
        setExporting(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/users/admin/customers/export`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Export failed");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `customers-${new Date().toISOString().split("T")[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Export error:", error);
            alert("Failed to export customers");
        } finally {
            setExporting(false);
        }
    };

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("desc");
        }
        setPage(1);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Never";
        return new Date(dateString).toLocaleDateString("en-BD", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatCurrency = (amount: number) => {
        return `Tk ${amount.toLocaleString()}`;
    };

    return (
        <ProtectedAdmin>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            View and manage customers who have placed orders
                        </p>
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={exporting || stats.totalCustomers === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download className="w-4 h-4" />
                        {exporting ? "Exporting..." : "Export CSV"}
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <p className="text-sm text-gray-500">Total Customers</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                        <p className="text-sm text-gray-400 mt-1">All time</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                            <p className="text-sm text-gray-500">Active Customers</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats.activeCustomers}</p>
                        <p className="text-sm text-gray-400 mt-1">Last 30 days</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <DollarSign className="w-5 h-5 text-purple-600" />
                            </div>
                            <p className="text-sm text-gray-500">Average Spend</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.avgSpend)}</p>
                        <p className="text-sm text-gray-400 mt-1">Per customer</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-orange-50 rounded-lg">
                                <UserPlus className="w-5 h-5 text-orange-600" />
                            </div>
                            <p className="text-sm text-gray-500">New This Month</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats.newCustomersThisMonth}</p>
                        <p className="text-sm text-gray-400 mt-1">First-time buyers</p>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg border border-gray-100 p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] = e.target.value.split("-");
                                setSortBy(field);
                                setSortOrder(order);
                                setPage(1);
                            }}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="orders-desc">Most Orders</option>
                            <option value="orders-asc">Least Orders</option>
                            <option value="spent-desc">Highest Spend</option>
                            <option value="spent-asc">Lowest Spend</option>
                            <option value="name-asc">Name A-Z</option>
                            <option value="name-desc">Name Z-A</option>
                        </select>
                    </div>
                </div>

                {/* Customers Table */}
                {loading ? (
                    <div className="bg-white rounded-lg border border-gray-100 p-12">
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-sm text-gray-500">Loading customers...</p>
                        </div>
                    </div>
                ) : customers.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-100 p-12">
                        <div className="text-center">
                            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {search ? "No customers found" : "No customers yet"}
                            </h3>
                            <p className="text-sm text-gray-500 max-w-sm mx-auto">
                                {search
                                    ? "Try adjusting your search terms"
                                    : "Customers will appear here once they place their first order."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th
                                                className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleSort("orders")}
                                            >
                                                <div className="flex items-center gap-1">
                                                    Orders
                                                    <ArrowUpDown className="w-3 h-3" />
                                                </div>
                                            </th>
                                            <th
                                                className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleSort("spent")}
                                            >
                                                <div className="flex items-center gap-1">
                                                    Total Spent
                                                    <ArrowUpDown className="w-3 h-3" />
                                                </div>
                                            </th>
                                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Avg Order
                                            </th>
                                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Last Order
                                            </th>
                                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Joined
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {customers.map((customer) => (
                                            <tr key={customer.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                                                            {customer.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{customer.name}</p>
                                                            <p className="text-sm text-gray-500">{customer.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <ShoppingBag className="w-4 h-4 text-gray-400" />
                                                        <span className="font-medium text-gray-900">{customer.totalOrders}</span>
                                                        <span className="text-sm text-gray-500">
                                                            ({customer.completedOrders} delivered)
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-medium text-gray-900">
                                                        {formatCurrency(customer.totalSpent)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-gray-600">
                                                        {formatCurrency(customer.avgOrderValue)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-gray-600">{formatDate(customer.lastOrderDate)}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-gray-600">{formatDate(customer.joinedAt)}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between bg-white rounded-lg border border-gray-100 px-6 py-4">
                                <p className="text-sm text-gray-500">
                                    Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total} customers
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <span className="text-sm text-gray-600">
                                        Page {page} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </ProtectedAdmin>
    );
}
