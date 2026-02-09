"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Edit2, Trash2, ArrowLeft, Home, Building, CheckCircle, X, Save } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

interface Address {
    id: number;
    type: string;
    name: string;
    phone: string;
    address: string;
    area: string;
    city: string;
    isDefault: boolean;
}

const INITIAL_FORM = { type: "home", name: "", phone: "", address: "", area: "inside", city: "Dhaka", isDefault: false };

export default function AddressesPage() {
    const { loading: authLoading, authFetch } = useAuth();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM);

    useEffect(() => {
        if (!authLoading) fetchAddresses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authLoading]);

    const fetchAddresses = async () => {
        try {
            const res = await authFetch("/addresses");
            if (res.ok) setAddresses(await res.json());
        } catch (e) {
            console.error("Error fetching addresses:", e);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData(INITIAL_FORM);
        setEditingAddress(null);
        setShowForm(false);
    };

    const handleEdit = (addr: Address) => {
        setFormData({ type: addr.type, name: addr.name, phone: addr.phone, address: addr.address, area: addr.area, city: addr.city, isDefault: addr.isDefault });
        setEditingAddress(addr);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const endpoint = editingAddress ? `/addresses/${editingAddress.id}` : "/addresses";
            const res = await authFetch(endpoint, { method: editingAddress ? "PUT" : "POST", body: JSON.stringify(formData) });
            if (res.ok) { fetchAddresses(); resetForm(); }
            else { const err = await res.json(); alert(err.error || "Failed to save"); }
        } catch { alert("Failed to save address"); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this address?")) return;
        try {
            const res = await authFetch(`/addresses/${id}`, { method: "DELETE" });
            if (res.ok) fetchAddresses();
            else alert("Failed to delete");
        } catch { alert("Failed to delete"); }
    };

    const handleSetDefault = async (id: number) => {
        try {
            const res = await authFetch(`/addresses/${id}/default`, { method: "PATCH" });
            if (res.ok) fetchAddresses();
        } catch (e) { console.error("Error:", e); }
    };

    const TypeIcon = ({ type }: { type: string }) => {
        const Icon = type === "home" ? Home : type === "office" ? Building : MapPin;
        return <Icon className="w-5 h-5" />;
    };

    if (loading || authLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-48"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="h-40 bg-gray-200 rounded"></div>
                        <div className="h-40 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <Link href="/account" className="text-gray-400 hover:text-gray-600">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
                        <p className="text-sm text-gray-500">Manage your delivery addresses</p>
                    </div>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Address
                    </button>
                )}
            </div>

            {/* Address Form */}
            {showForm && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {editingAddress ? "Edit Address" : "Add New Address"}
                        </h2>
                        <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Address Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                            <div className="flex gap-3">
                                {[
                                    { value: "home", label: "Home", icon: Home },
                                    { value: "office", label: "Office", icon: Building },
                                    { value: "other", label: "Other", icon: MapPin },
                                ].map((opt) => {
                                    const Icon = opt.icon;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: opt.value })}
                                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${formData.type === opt.value
                                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                                : "border-gray-200 text-gray-600 hover:border-gray-300"
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="01XXX-XXXXXX"
                                    required
                                />
                            </div>
                        </div>

                        {/* Full Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Address *</label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                rows={3}
                                placeholder="House/Flat, Road, Area, Landmark"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Area */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Area *</label>
                                <select
                                    value={formData.area}
                                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                >
                                    <option value="inside">Inside Dhaka (Tk 80)</option>
                                    <option value="outside">Outside Dhaka (Tk 120)</option>
                                </select>
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Dhaka"
                                />
                            </div>
                        </div>

                        {/* Set as Default */}
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isDefault}
                                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Set as default address</span>
                        </label>

                        {/* Form Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                            >
                                <Save className="w-5 h-5" />
                                {saving ? "Saving..." : "Save Address"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Addresses List */}
            {addresses.length === 0 && !showForm ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
                    <p className="text-gray-500 mb-6">Add your first delivery address to get started</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus className="w-5 h-5" />
                        Add Address
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                        <div
                            key={addr.id}
                            className={`bg-white rounded-xl border p-5 relative transition-colors ${addr.isDefault ? "border-blue-300 ring-1 ring-blue-100" : "border-gray-200"
                                }`}
                        >
                            {addr.isDefault && (
                                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    Default
                                </div>
                            )}

                            <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${addr.type === "home"
                                    ? "bg-green-100 text-green-600"
                                    : addr.type === "office"
                                        ? "bg-blue-100 text-blue-600"
                                        : "bg-gray-100 text-gray-600"
                                    }`}>
                                    <TypeIcon type={addr.type} />
                                </div>
                                <div className="flex-1 min-w-0 pr-16">
                                    <h3 className="font-semibold text-gray-900 capitalize">{addr.type}</h3>
                                    <p className="text-sm text-gray-700 mt-1">{addr.name}</p>
                                    <p className="text-sm text-gray-500 mt-1">{addr.phone}</p>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{addr.address}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {addr.city} • {addr.area === "inside" ? "Inside Dhaka" : "Outside Dhaka"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => handleEdit(addr)}
                                    className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                </button>
                                <span className="text-gray-200">|</span>
                                <button
                                    onClick={() => handleDelete(addr.id)}
                                    className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                                {!addr.isDefault && (
                                    <>
                                        <span className="text-gray-200">|</span>
                                        <button
                                            onClick={() => handleSetDefault(addr.id)}
                                            className="text-sm text-gray-600 hover:text-gray-700"
                                        >
                                            Set as Default
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )
                    )}
                </div>
            )}
        </div>
    );
}
