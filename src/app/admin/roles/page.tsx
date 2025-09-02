"use client";

import React, { useState } from "react";
import ProtectedAdmin from "@/components/admin/ProtectAdmin";
import { Plus, Shield, Users, Edit, Trash2, X, Save } from "lucide-react";

const mockRoles = [
    { id: "1", name: "Super Admin", users: 2, permissions: ["all"] },
    { id: "2", name: "Admin", users: 5, permissions: ["products", "orders", "customers"] },
    { id: "3", name: "Editor", users: 8, permissions: ["products", "orders"] },
    { id: "4", name: "Support", users: 12, permissions: ["orders", "customers"] },
];

const allPermissions = ["dashboard", "products", "orders", "customers", "settings"];

export default function AdminRoles() {
    const [roles, setRoles] = useState(mockRoles);
    const [showModal, setShowModal] = useState(false);
    const [editingRole, setEditingRole] = useState<typeof mockRoles[0] | null>(null);
    const [roleName, setRoleName] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

    const handleAddRole = () => {
        setEditingRole(null);
        setRoleName("");
        setSelectedPermissions([]);
        setShowModal(true);
    };

    const handleEditRole = (role: typeof mockRoles[0]) => {
        setEditingRole(role);
        setRoleName(role.name);
        setSelectedPermissions(role.permissions);
        setShowModal(true);
    };

    const togglePermission = (permission: string) => {
        setSelectedPermissions(prev =>
            prev.includes(permission)
                ? prev.filter(p => p !== permission)
                : [...prev, permission]
        );
    };

    const handleSaveRole = () => {
        if (!roleName.trim()) return;

        if (editingRole) {
            setRoles(roles.map(r => r.id === editingRole.id ? { ...r, name: roleName, permissions: selectedPermissions } : r));
        } else {
            const newRole = {
                id: String(roles.length + 1),
                name: roleName,
                users: 0,
                permissions: selectedPermissions
            };
            setRoles([...roles, newRole]);
        }
        setShowModal(false);
        setRoleName("");
        setSelectedPermissions([]);
    };

    const handleDeleteRole = (roleId: string) => {
        setRoles(roles.filter(r => r.id !== roleId));
    };

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
                        onClick={handleAddRole}
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
                                    <button
                                        onClick={() => handleEditRole(role)}
                                        className="p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteRole(role.id)}
                                        className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-colors"
                                    >
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

                {/* Add/Edit Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="bg-white rounded-lg max-w-2xl w-full p-6 mx-auto mt-8 mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {editingRole ? "Edit Role" : "Add New Role"}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {editingRole ? "Update role details and permissions" : "Create a new role with permissions"}
                                    </p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Role Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
                                    <input
                                        type="text"
                                        value={roleName}
                                        onChange={(e) => setRoleName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="e.g., Manager, Moderator, etc."
                                    />
                                </div>

                                {/* Permissions */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
                                    <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                                        {allPermissions.map((permission) => (
                                            <label key={permission} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPermissions.includes(permission) || selectedPermissions.includes("all")}
                                                    onChange={() => togglePermission(permission)}
                                                    disabled={selectedPermissions.includes("all")}
                                                    className="w-5 h-5 text-blue-600 rounded"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900 capitalize">{permission}</p>
                                                    <p className="text-xs text-gray-500">Access to {permission} management</p>
                                                </div>
                                            </label>
                                        ))}
                                        <label className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedPermissions.includes("all")}
                                                onChange={() => setSelectedPermissions(prev =>
                                                    prev.includes("all") ? [] : ["all"]
                                                )}
                                                className="w-5 h-5 text-blue-600 rounded"
                                            />
                                            <div className="flex-1">
                                                <p className="font-bold text-blue-900">All Permissions</p>
                                                <p className="text-xs text-blue-700">Grant full access to all modules</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={handleSaveRole}
                                        disabled={!roleName.trim()}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Save className="w-4 h-4" />
                                        {editingRole ? "Update Role" : "Create Role"}
                                    </button>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedAdmin>
    );
}
