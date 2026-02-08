"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Package, Heart, MapPin, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthChange, logout, type AuthUser } from "@/lib/authHelper";

export default function AccountPage() {
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthChange((authUser) => {
            setUser(authUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (user) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-500 to-green-500 flex items-center justify-center text-white text-2xl font-bold">
                                    {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{user.displayName || "User"}</h1>
                                    <p className="text-gray-500">{user.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                Logout
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link href="/account/orders" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">My Orders</h3>
                            <p className="text-sm text-gray-500">Track, return, or buy things again</p>
                        </Link>

                        <Link href="/wishlist" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center mb-4">
                                <Heart className="w-6 h-6 text-pink-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Wishlist</h3>
                            <p className="text-sm text-gray-500">View and manage your saved items</p>
                        </Link>

                        <Link href="/account/addresses" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                                <MapPin className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Addresses</h3>
                            <p className="text-sm text-gray-500">Edit addresses for orders</p>
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Account Details</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <User className="w-5 h-5 text-gray-600" />
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-medium text-gray-900">{user.displayName || "Not set"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <Mail className="w-5 h-5 text-gray-600" />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium text-gray-900">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to KNEX</h1>
                    <p className="text-gray-600">Login or create an account to continue</p>
                </div>

                <div>
                    <div className="space-y-4">
                        <Link
                            href="/login"
                            className="block w-full bg-green-600 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-lg transition-all text-center"
                        >
                            Login to Your Account
                        </Link>
                        <Link
                            href="/register"
                            className="block w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-4 rounded-lg transition-all text-center"
                        >
                            Create New Account
                        </Link>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            By continuing, you agree to our{" "}
                            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                            {" "}and{" "}
                            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
