"use client";

import React from "react";
import ProtectedAdmin from "@/components/admin/ProtectAdmin";
import DataTable from "@/components/admin/DataTable";
import Badge from "@/components/admin/Badge";
import { adminData } from "@/lib/adminData";
import { UserPlus, Mail, Phone } from "lucide-react";

export default function AdminCustomers() {
    const customers = adminData.getCustomers();

    return (
        <ProtectedAdmin>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage your customer database</p>
                    </div>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        <UserPlus className="w-4 h-4" />
                        Add Customer
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg border border-gray-100 p-6">
                        <p className="text-sm text-gray-500 mb-1">Total Customers</p>
                        <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
                        <p className="text-sm text-green-600 mt-2">↑ 12% from last month</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-100 p-6">
                        <p className="text-sm text-gray-500 mb-1">Active Customers</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {customers.filter(c => c.status === "Active").length}
                        </p>
                        <p className="text-sm text-blue-600 mt-2">Currently shopping</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-100 p-6">
                        <p className="text-sm text-gray-500 mb-1">Average Spend</p>
                        <p className="text-2xl font-bold text-gray-900">
                            Tk {Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">Per customer</p>
                    </div>
                </div>

                {/* Customers Table */}
                <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                    <DataTable
                        headers={["Customer", "Contact", "Total Orders", "Total Spent", "Status", "Actions"]}
                        data={customers}
                        renderRow={(customer) => (
                            <tr key={customer.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-medium">
                                            {customer.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                                            <p className="text-xs text-gray-500">ID: {customer.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <Mail className="w-3 h-3 text-gray-400" />
                                            {customer.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <Phone className="w-3 h-3 text-gray-400" />
                                            {customer.phone}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{customer.totalOrders}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    Tk {customer.totalSpent.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={customer.status === "Active" ? "success" : "default"}>
                                        {customer.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        )}
                    />
                </div>
            </div>
        </ProtectedAdmin>
    );
}
