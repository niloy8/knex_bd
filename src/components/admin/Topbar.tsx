"use client";

import React from "react";
import { adminAuth } from "@/lib/adminAuth";
import { useRouter } from "next/navigation";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import Link from "next/link";

interface TopbarProps {
    onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
    const router = useRouter();
    const user = adminAuth.getCurrentUser();

    function handleLogout() {
        adminAuth.logout();
        router.push("/admin/login");
    }

    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6">
            {/* Left side */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                    <Menu className="w-5 h-5 text-gray-600" />
                </button>

                {/* Search */}
                <div className="hidden sm:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 w-64">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search here..."
                        className="bg-transparent border-none outline-none text-sm flex-1 text-gray-700 placeholder-gray-400"
                    />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile dropdown */}
                <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-medium text-gray-900">{user?.name || "Admin"}</p>
                        <p className="text-xs text-gray-500">{user?.role || "Administrator"}</p>
                    </div>
                    <div className="relative group">
                        <button className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-medium">
                                {user?.avatar || user?.name?.charAt(0) || "A"}
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-600 hidden sm:block" />
                        </button>

                        {/* Dropdown menu */}
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <Link href="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                Settings
                            </Link>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
