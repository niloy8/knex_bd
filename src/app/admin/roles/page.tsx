"use client";

import React, { useState, useEffect } from "react";
import ProtectedAdmin from "@/components/admin/ProtectAdmin";
import { Plus, Shield, Edit, Trash2, X, Save, Mail, Lock, User } from "lucide-react";
import { useNotification } from "@/context/NotificationContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const allPermissions = ["dashboard", "products", "orders", "customers", "settings"];

type Admin = { id: number; email: string; name: string; role: string; permissions: string[] };

export default function AdminRoles() {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [currentAdmin] = useState<Admin | null>(() => {
        if (typeof window !== "undefined") {
            const user = localStorage.getItem("adminUser");
            return user ? JSON.parse(user) : null;
        }
        return null;
    });
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Admin | null>(null);
    const [form, setForm] = useState({ email: "", password: "", name: "", role: "admin", permissions: [] as string[] });
    const [loading, setLoading] = useState(false);
    const { showToast, confirm } = useNotification();

    const getHeaders = () => ({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
    });

    const fetchAdmins = async () => {
        try {
            const res = await fetch(`${API}/admin`, { headers: getHeaders() });
            if (res.ok) setAdmins(await res.json());
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchAdmins();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSave = async () => {
        if (!form.email || (!editing && !form.password)) return;
        setLoading(true);
        try {
            const url = editing ? `${API}/admin/${editing.id}` : `${API}/admin`;
            const body = editing ? { name: form.name, role: form.role, permissions: form.permissions, ...(form.password && { password: form.password }) } : form;
            const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: getHeaders(), body: JSON.stringify(body) });
            if (res.ok) { fetchAdmins(); setShowModal(false); }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        confirm({
            title: "Delete Admin",
            message: "Are you sure you want to delete this admin user?",
            variant: "danger",
            confirmText: "Delete",
            onConfirm: async () => {
                try {
                    const res = await fetch(`${API}/admin/${id}`, { method: "DELETE", headers: getHeaders() });
                    if (res.ok) {
                        showToast("Admin deleted successfully");
                        fetchAdmins();
                    } else {
                        const err = await res.json();
                        showToast(err.error || "Failed to delete admin", "error");
                    }
                } catch (error) {
                    console.error("Error deleting admin:", error);
                    showToast("Failed to delete admin", "error");
                }
            }
        });
    };

    const openModal = (admin?: Admin) => {
        setEditing(admin || null);
        setForm(admin ? { email: admin.email, password: "", name: admin.name || "", role: admin.role, permissions: admin.permissions } : { email: "", password: "", name: "", role: "admin", permissions: [] });
        setShowModal(true);
    };

    const isSuperAdmin = currentAdmin?.role === "superadmin";

    return (
        <ProtectedAdmin>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage admin accounts and permissions</p>
                    </div>
                    {isSuperAdmin && (
                        <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                            <Plus className="w-4 h-4" /> Add Admin
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {admins.map((admin) => (
                        <div key={admin.id} className="bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-blue-600" />
                                </div>
                                {isSuperAdmin && admin.role !== "superadmin" && (
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => openModal(admin)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded"><Edit className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(admin.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                )}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">{admin.name || admin.email}</h3>
                            <p className="text-sm text-gray-500 mb-2">{admin.email}</p>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${admin.role === "superadmin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>{admin.role}</span>
                            <div className="mt-4">
                                <p className="text-xs text-gray-500 mb-2">Permissions:</p>
                                <div className="flex flex-wrap gap-1">
                                    {admin.permissions.map((p, i) => <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{p}</span>)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <div className="bg-white rounded-lg max-w-md w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">{editing ? "Edit Admin" : "Add Admin"}</h3>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="space-y-4">
                                {!editing && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="admin@example.com" />
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{editing ? "New Password (optional)" : "Password"}</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Admin Name" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="admin">Admin</option>
                                        <option value="manager">Manager</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                                    <div className="space-y-2">
                                        {allPermissions.map(p => (
                                            <label key={p} className="flex items-center gap-2 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
                                                <input type="checkbox" checked={form.permissions.includes(p) || form.permissions.includes("all")} onChange={() => setForm({ ...form, permissions: form.permissions.includes(p) ? form.permissions.filter(x => x !== p) : [...form.permissions, p] })} disabled={form.permissions.includes("all")} className="w-4 h-4 text-blue-600 rounded" />
                                                <span className="capitalize text-sm">{p}</span>
                                            </label>
                                        ))}
                                        <label className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded cursor-pointer">
                                            <input type="checkbox" checked={form.permissions.includes("all")} onChange={() => setForm({ ...form, permissions: form.permissions.includes("all") ? [] : ["all"] })} className="w-4 h-4 text-blue-600 rounded" />
                                            <span className="font-medium text-blue-700 text-sm">All Permissions</span>
                                        </label>
                                    </div>
                                </div>
                                <button onClick={handleSave} disabled={loading || !form.email || (!editing && !form.password)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
                                    <Save className="w-4 h-4" /> {loading ? "Saving..." : editing ? "Update" : "Create"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedAdmin>
    );
}
