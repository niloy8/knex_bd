"use client";

import React, { useState } from "react";
import ProtectedAdmin from "@/components/admin/ProtectAdmin";
import { Filter, Download, ShoppingCart } from "lucide-react";

export default function AdminOrders() {
    const [statusFilter, setStatusFilter] = useState<string>("All");

    return (
        <ProtectedAdmin>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage and track all customer orders</p>
                    </div>
                    <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg border border-gray-100 p-4">
                    <div className="flex items-center gap-4">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <div className="flex gap-2 flex-wrap">
                            {["All", "Pending", "Processing", "Delivered", "Cancelled"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
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

                {/* Empty State */}
                <div className="bg-white rounded-lg border border-gray-100 p-12">
                    <div className="text-center">
                        <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto">
                            Orders will appear here once customers start placing them.
                            The orders system will be implemented when the checkout feature is ready.
                        </p>
                    </div>
                </div>
            </div>
        </ProtectedAdmin>
    );
}
