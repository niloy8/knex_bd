"use client";

import React, { useState, useEffect, useCallback } from "react";
import ProtectedAdmin from "@/components/admin/ProtectAdmin";
import StatCard from "@/components/admin/StatCard";
import { Banknote, ShoppingBag, Users, TrendingUp, Package } from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Category {
    id: string;
    name: string;
    _count?: { products: number };
}

export default function AdminDashboard() {
    const [dateFilter, setDateFilter] = useState("Last 7 days");
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCategories: 0,
        totalBrands: 0,
    });
    const [topCategories, setTopCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = useCallback(async () => {
        try {
            const [productsRes, categoriesRes, brandsRes] = await Promise.all([
                fetch(`${API_URL}/products?limit=1`).catch(() => null),
                fetch(`${API_URL}/categories`).catch(() => null),
                fetch(`${API_URL}/brands`).catch(() => null),
            ]);

            let productsData = { total: 0 };
            let categoriesData: Category[] = [];
            let brandsData: string[] = [];

            if (productsRes?.ok) {
                try {
                    productsData = await productsRes.json();
                } catch { /* ignore parse errors */ }
            }
            if (categoriesRes?.ok) {
                try {
                    const data = await categoriesRes.json();
                    categoriesData = Array.isArray(data) ? data : [];
                } catch { /* ignore parse errors */ }
            }
            if (brandsRes?.ok) {
                try {
                    const data = await brandsRes.json();
                    brandsData = Array.isArray(data) ? data : [];
                } catch { /* ignore parse errors */ }
            }

            setStats({
                totalProducts: productsData.total || 0,
                totalCategories: categoriesData.length,
                totalBrands: brandsData.length,
            });

            setTopCategories(categoriesData.slice(0, 4));
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    return (
        <ProtectedAdmin>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-sm text-gray-500 mt-1">Welcome back! Here is your store overview.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>Last 90 days</option>
                        </select>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Products"
                        value={loading ? "..." : stats.totalProducts.toLocaleString()}
                        change="+0%"
                        trend="up"
                        icon={<Package className="w-6 h-6 text-blue-600" />}
                    />
                    <StatCard
                        title="Categories"
                        value={loading ? "..." : stats.totalCategories.toLocaleString()}
                        change="+0%"
                        trend="up"
                        icon={<ShoppingBag className="w-6 h-6 text-green-600" />}
                    />
                    <StatCard
                        title="Brands"
                        value={loading ? "..." : stats.totalBrands.toLocaleString()}
                        change="+0%"
                        trend="up"
                        icon={<Users className="w-6 h-6 text-purple-600" />}
                    />
                    <StatCard
                        title="Revenue"
                        value="Tk 0"
                        change="+0%"
                        trend="up"
                        icon={<Banknote className="w-6 h-6 text-yellow-600" />}
                    />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Quick Links */}
                    <div className="bg-white rounded-lg border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Link
                                href="/admin/products/new"
                                className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors text-center"
                            >
                                <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                <span className="text-sm font-medium text-gray-700">Add Product</span>
                            </Link>
                            <Link
                                href="/admin/products"
                                className="p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors text-center"
                            >
                                <ShoppingBag className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <span className="text-sm font-medium text-gray-700">View Products</span>
                            </Link>
                            <Link
                                href="/admin/orders"
                                className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors text-center"
                            >
                                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                <span className="text-sm font-medium text-gray-700">View Orders</span>
                            </Link>
                            <Link
                                href="/admin/customers"
                                className="p-4 border border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-200 transition-colors text-center"
                            >
                                <Users className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                                <span className="text-sm font-medium text-gray-700">Customers</span>
                            </Link>
                        </div>
                    </div>

                    {/* Categories Overview */}
                    <div className="bg-white rounded-lg border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                            <Link href="/admin/products" className="text-sm text-blue-600 hover:text-blue-700">See All</Link>
                        </div>
                        {topCategories.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No categories yet</p>
                                <p className="text-sm text-gray-400 mt-1">Run the seed script to add categories</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {topCategories.map((cat, i) => {
                                    const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"];
                                    return (
                                        <div key={cat.id}>
                                            <div className="flex items-center justify-between text-sm mb-2">
                                                <span className="text-gray-700">{cat.name}</span>
                                                <span className="font-medium text-gray-900">{cat._count?.products || 0} products</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div
                                                    className={`${colors[i % colors.length]} h-2 rounded-full transition-all duration-500`}
                                                    style={{ width: `${Math.min(100, (cat._count?.products || 0) * 10)}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Getting Started */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
                    <p className="text-blue-100 text-sm mb-4">
                        Your store is ready! Start by adding products to your catalog.
                    </p>
                    <div className="flex gap-3">
                        <Link
                            href="/admin/products/new"
                            className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                        >
                            Add First Product
                        </Link>
                        <Link
                            href="/admin/products"
                            className="px-4 py-2 bg-blue-400 text-white rounded-lg text-sm font-medium hover:bg-blue-300 transition-colors"
                        >
                            View Products
                        </Link>
                    </div>
                </div>
            </div>
        </ProtectedAdmin>
    );
}
