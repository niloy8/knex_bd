"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Package, Heart, MapPin, Shield, LogOut, Camera, Edit2, Save, X, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface UserProfile {
    id: number;
    name: string;
    email: string;
}

export default function MyProfile() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [tempProfile, setTempProfile] = useState({ name: "", email: "" });

    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = getToken();
            if (!token) {
                window.location.href = "/login";
                return;
            }

            const res = await fetch(`${API_URL}/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                setTempProfile({ name: data.name, email: data.email });
            } else if (res.status === 401) {
                window.location.href = "/login";
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        if (profile) {
            setTempProfile({ name: profile.name, email: profile.email });
        }
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const token = getToken();
            const res = await fetch(`${API_URL}/users/me`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(tempProfile),
            });

            if (res.ok) {
                setProfile(prev => prev ? { ...prev, ...tempProfile } : null);
                setIsEditing(false);
                alert("Profile updated successfully!");
            } else {
                alert("Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile");
        }
    };

    const handleCancel = () => {
        if (profile) {
            setTempProfile({ name: profile.name, email: profile.email });
        }
        setIsEditing(false);
    };

    const handleLogout = () => {
        if (confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
    };

    const quickLinks = [
        { href: "/myprofile/orders", label: "My Orders", description: "Track, return, or buy things again", icon: Package, color: "bg-blue-50 text-blue-600" },
        { href: "/wishlist", label: "Wishlist", description: "View and manage your saved items", icon: Heart, color: "bg-pink-50 text-pink-600" },
        { href: "/myprofile/addresses", label: "Addresses", description: "Edit addresses for orders", icon: MapPin, color: "bg-green-50 text-green-600" },
    ];

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-40 bg-gray-200 rounded-xl mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="h-32 bg-gray-200 rounded-xl"></div>
                        <div className="h-32 bg-gray-200 rounded-xl"></div>
                        <div className="h-32 bg-gray-200 rounded-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Profile Header Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-6 text-white">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
                        {profile?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{profile?.name || "User"}</h1>
                        <p className="text-blue-100">{profile?.email}</p>
                    </div>
                </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {quickLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                        <div
                            key={link.href}
                            onClick={() => router.push(link.href)}
                            className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer"
                        >
                            <div className={`w-12 h-12 ${link.color} rounded-xl flex items-center justify-center mb-4`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">{link.label}</h3>
                            <p className="text-sm text-gray-500">{link.description}</p>
                            <div className="flex items-center gap-1 text-blue-600 text-sm font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                View <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Profile Settings */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === "profile"
                                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        <User className="w-4 h-4 inline-block mr-2" />
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab("security")}
                        className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === "security"
                                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        <Shield className="w-4 h-4 inline-block mr-2" />
                        Security
                    </button>
                </div>

                <div className="p-6">
                    {/* Profile Tab */}
                    {activeTab === "profile" && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                                {!isEditing ? (
                                    <button
                                        onClick={handleEdit}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleCancel}
                                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                                        >
                                            <X className="w-4 h-4" />
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={isEditing ? tempProfile.name : (profile?.name || "")}
                                        onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={isEditing ? tempProfile.email : (profile?.email || "")}
                                        onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === "security" && (
                        <div className="space-y-6">
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 mb-2">Change Password</h3>
                                <p className="text-sm text-gray-600 mb-4">Update your password regularly to keep your account secure</p>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Change Password
                                </button>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 mb-2">Logout</h3>
                                <p className="text-sm text-gray-600 mb-4">Sign out from your account on this device</p>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
