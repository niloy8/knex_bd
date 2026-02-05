"use client";

import React, { useState, useEffect, useCallback } from "react";
import ProtectedAdmin from "@/components/admin/ProtectAdmin";
import DataTable from "@/components/admin/DataTable";
import Badge from "@/components/admin/Badge";
import { Plus, Edit, Trash2, Search, Loader2, Package, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Product {
    id: string;
    title: string;
    slug: string;
    price: number;
    originalPrice: number;
    discount: number;
    rating: number;
    totalReviews: number;
    image: string;
    inStock: boolean;
    stockQuantity: number;
    category: { id: string; name: string; slug: string } | null;
    subCategory: { id: string; name: string; slug: string } | null;
    brand: { id: string; name: string } | null;
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

export default function AdminProducts() {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append("page", currentPage.toString());
            params.append("limit", "10");
            if (searchQuery) params.append("search", searchQuery);
            if (categoryFilter) params.append("category", categoryFilter);
            if (statusFilter === "instock") params.append("inStock", "true");
            if (statusFilter === "outofstock") params.append("inStock", "false");

            const res = await fetch(`${API_URL}/products?${params.toString()}`);

            // Check if response is JSON
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                console.error("API returned non-JSON response. Is the backend server running?");
                setProducts([]);
                return;
            }

            const data = await res.json();
            setProducts(Array.isArray(data.products) ? data.products : []);
            setTotalProducts(data.total || 0);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error("Error fetching products:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchQuery, categoryFilter, statusFilter]);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/categories`);

            // Check if response is JSON
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                console.error("API returned non-JSON response. Is the backend server running?");
                setCategories([]);
                return;
            }

            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDelete = async (productId: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_URL}/products/${productId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                fetchProducts();
            } else {
                alert("Failed to delete product");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Error deleting product");
        }
    };

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
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.slug}>{cat.name}</option>
                            ))}
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                            <option value="">All Status</option>
                            <option value="instock">In Stock</option>
                            <option value="outofstock">Out of Stock</option>
                        </select>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No products found</p>
                            <Link href="/admin/products/new" className="text-blue-600 hover:underline mt-2 inline-block">
                                Add your first product
                            </Link>
                        </div>
                    ) : (
                        <DataTable
                            headers={["Product", "Category", "Price", "Stock", "Rating", "Actions"]}
                            data={products}
                            renderRow={(product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
                                                {product.image ? (
                                                    <Image src={product.image} alt={product.title} fill className="object-cover" unoptimized />
                                                ) : (
                                                    <Package className="w-6 h-6 text-gray-400" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 line-clamp-1 max-w-xs">
                                                    {product.title}
                                                </p>
                                                <p className="text-xs text-gray-500">{product.brand?.name || "No Brand"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="info">{product.category?.name || "Uncategorized"}</Badge>
                                        {product.subCategory && (
                                            <p className="text-xs text-gray-400 mt-1">{product.subCategory.name}</p>
                                        )}
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
                                        <Badge variant={product.inStock ? "success" : "error"}>
                                            {product.inStock ? `${product.stockQuantity} in stock` : "Out of Stock"}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-medium text-gray-900">{product.rating.toFixed(1)}</span>
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
                                                onClick={() => handleDelete(product.id)}
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
                    )}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-medium">{products.length}</span> of{" "}
                        <span className="font-medium">{totalProducts}</span> products
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1.5 rounded-lg text-sm ${currentPage === page
                                    ? "bg-blue-600 text-white"
                                    : "border border-gray-200 hover:bg-gray-50"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </ProtectedAdmin>
    );
}
