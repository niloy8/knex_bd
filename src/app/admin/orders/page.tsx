"use client";

import React, { useState } from "react";
import ProtectedAdmin from "@/components/admin/ProtectAdmin";
import DataTable from "@/components/admin/DataTable";
import Badge from "@/components/admin/Badge";
import { adminData } from "@/lib/adminData";
import type { Order } from "@/lib/adminData";
import { Filter, Download } from "lucide-react";

export default function AdminOrders() {
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const orders = adminData.getOrders();

    const filteredOrders = statusFilter === "All"
        ? orders
        : orders.filter(o => o.status === statusFilter);

    const getStatusBadge = (status: Order["status"]) => {
        const variants: Record<Order["status"], "success" | "warning" | "error" | "info"> = {
            Delivered: "success",
            Processing: "info",
            Pending: "warning",
            Cancelled: "error",
        };
        return <Badge variant={variants[status]}>{status}</Badge>;
    };

    const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
        adminData.updateOrderStatus(orderId, newStatus);
        alert(`Order ${orderId} status updated to ${newStatus}`);
    };

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

                {/* Orders Table */}
                <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                    <DataTable
                        headers={["Order ID", "Customer", "Product", "Quantity", "Total", "Date", "Status", "Actions"]}
                        data={filteredOrders}
                        renderRow={(order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-blue-600">{order.orderId}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{order.customer}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{order.productImage}</span>
                                        <span className="text-sm text-gray-700">{order.product}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">{order.quantity}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">Tk {order.total.toLocaleString()}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                                <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                                <td className="px-6 py-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                                        className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        )}
                    />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg border border-gray-100 p-4">
                        <p className="text-sm text-gray-500">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-100 p-4">
                        <p className="text-sm text-gray-500">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">
                            {orders.filter(o => o.status === "Pending").length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-100 p-4">
                        <p className="text-sm text-gray-500">Processing</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {orders.filter(o => o.status === "Processing").length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-100 p-4">
                        <p className="text-sm text-gray-500">Delivered</p>
                        <p className="text-2xl font-bold text-green-600">
                            {orders.filter(o => o.status === "Delivered").length}
                        </p>
                    </div>
                </div>
            </div>
        </ProtectedAdmin>
    );
}
