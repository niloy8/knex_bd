"use client";

import React, { useState } from "react";
import ProtectedAdmin from "@/components/admin/ProtectAdmin";
import DataTable from "@/components/admin/DataTable";
import Badge from "@/components/admin/Badge";
import { adminData } from "@/lib/adminData";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";

export default function AdminProducts() {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All Categories");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const products = adminData.getProducts();

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "All Categories" || p.category === categoryFilter;
        const matchesStatus = statusFilter === "All Status" ||
            (statusFilter === "In Stock" && p.assured) ||
            (statusFilter === "Out of Stock" && !p.assured);
        return matchesSearch && matchesCategory && matchesStatus;
    });

    return (
        <ProtectedAdmin>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage your product inventory</p>
                    </div>
                    <Link
                        href="/admin/products/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Product
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg border border-gray-100 p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                            <option>All Categories</option>
                            <option>Electronics</option>
                            <option>Fashion</option>
                            <option>Home & Lifestyle</option>
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                            <option>All Status</option>
                            <option>In Stock</option>
                            <option>Out of Stock</option>
                        </select>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                    <DataTable
                        headers={["Product", "Category", "Price", "Stock", "Rating", "Actions"]}
                        data={filteredProducts}
                        renderRow={(product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                                            {product.image}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 line-clamp-1 max-w-xs">
                                                {product.title}
                                            </p>
                                            <p className="text-xs text-gray-500">ID: {product.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant="info">{product.category}</Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Tk {product.price.toLocaleString()}</p>
                                        {product.originalPrice > product.price && (
                                            <p className="text-xs text-gray-400 line-through">Tk {product.originalPrice.toLocaleString()}</p>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={product.assured ? "success" : "error"}>
                                        {product.assured ? "In Stock" : "Low Stock"}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1">
                                        <span className="text-yellow-400">★</span>
                                        <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                                        <span className="text-xs text-gray-400">({product.totalReviews})</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin/products/${product.id}`}
                                            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    />
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-medium">{filteredProducts.length}</span> of{" "}
                        <span className="font-medium">{products.length}</span> products
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50">
                            Previous
                        </button>
                        <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm">1</button>
                        <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">2</button>
                        <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">3</button>
                        <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </ProtectedAdmin>
    );
}
