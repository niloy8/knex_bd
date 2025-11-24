"use client";

import React, { useState } from "react";
import ProtectedAdmin from "@/components/admin/ProtectAdmin";
import { Plus, Shield, Users, Edit, Trash2 } from "lucide-react";

const mockRoles = [
    { id: "1", name: "Super Admin", users: 2, permissions: ["all"] },
    { id: "2", name: "Admin", users: 5, permissions: ["products", "orders", "customers"] },
    { id: "3", name: "Editor", users: 8, permissions: ["products", "orders"] },
    { id: "4", name: "Support", users: 12, permissions: ["orders", "customers"] },
];

export default function AdminRoles() {
    const [roles] = useState(mockRoles);
    const [, setShowAddModal] = useState(false);

    return (
        <ProtectedAdmin>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage user roles and access controls</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Role
                    </button>
                </div>

                {/* Roles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roles.map((role) => (
                        <div key={role.id} className="bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex items-center gap-1">
                                    <button className="p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{role.name}</h3>

                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                <Users className="w-4 h-4" />
                                <span>{role.users} users</span>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 mb-2">Permissions:</p>
                                <div className="flex flex-wrap gap-2">
                                    {role.permissions.map((perm, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
                                        >
                                            {perm}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Permissions Table */}
                <div className="bg-white rounded-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Permission Matrix</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Module</th>
                                    {roles.map(role => (
                                        <th key={role.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            {role.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {["Dashboard", "Products", "Orders", "Customers", "Settings"].map((module) => (
                                    <tr key={module}>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{module}</td>
                                        {roles.map(role => (
                                            <td key={role.id} className="px-4 py-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={role.permissions.includes("all") || role.permissions.includes(module.toLowerCase())}
                                                    className="w-4 h-4 text-blue-600 rounded"
                                                    readOnly
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ProtectedAdmin>
    );
}
