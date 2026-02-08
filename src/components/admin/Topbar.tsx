"use client";

import React, { useState, useEffect, useRef } from "react";
import { Menu, Search, Bell, ChevronDown, Package, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface AdminUser {
    id: number;
    name: string;
    email: string;
    role?: {
        name: string;
    };
}

interface OrderNotification {
    id: number;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
}

interface TopbarProps {
    onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
    const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
    const [notifications, setNotifications] = useState<OrderNotification[]>([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [lastCheck, setLastCheck] = useState<string | null>(null);
    const notificationRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Get admin user from localStorage (set during admin login)
        const storedAdmin = localStorage.getItem("adminUser");
        if (storedAdmin) {
            try {
                setAdminUser(JSON.parse(storedAdmin));
            } catch (e) {
                console.error("Error parsing admin user:", e);
            }
        }

        // Get last check time from localStorage
        const savedLastCheck = localStorage.getItem("lastNotificationCheck");
        if (savedLastCheck) {
            setLastCheck(savedLastCheck);
        }

        // Create audio element for notification sound
        audioRef.current = new Audio("/notification.mp3");
    }, []);

    // Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                if (!token) return;

                const params = new URLSearchParams();
                if (lastCheck) {
                    params.set("since", lastCheck);
                }

                const res = await fetch(`${API}/orders/admin/notifications?${params}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.ok) {
                    const data = await res.json();

                    // Check for new orders since last check
                    if (lastCheck && data.orders.length > 0) {
                        const newOrders = data.orders.filter((o: OrderNotification) =>
                            new Date(o.createdAt) > new Date(lastCheck)
                        );
                        if (newOrders.length > 0) {
                            // Play notification sound
                            if (audioRef.current) {
                                audioRef.current.play().catch(() => { });
                            }
                            // Show browser notification if permitted
                            if (Notification.permission === "granted") {
                                new Notification("New Order!", {
                                    body: `${newOrders.length} new order(s) received`,
                                    icon: "/logos/logo.png",
                                });
                            }
                        }
                    }

                    setNotifications(data.orders);
                    setPendingCount(data.pendingCount);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        // Initial fetch
        fetchNotifications();

        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);

        // Request notification permission
        if (Notification.permission === "default") {
            Notification.requestPermission();
        }

        return () => clearInterval(interval);
    }, [lastCheck]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
        // Update last check time when opening notifications
        if (!showNotifications) {
            const now = new Date().toISOString();
            setLastCheck(now);
            localStorage.setItem("lastNotificationCheck", now);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    function handleLogout() {
        // Clear admin tokens
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        localStorage.removeItem("lastNotificationCheck");
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
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={handleNotificationClick}
                        className="relative p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <Bell className="w-5 h-5 text-gray-600" />
                        {pendingCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full text-[10px] font-medium text-white flex items-center justify-center px-1">
                                {pendingCount > 9 ? "9+" : pendingCount}
                            </span>
                        )}
                    </button>

                    {/* Notifications dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-900">Notifications</h3>
                                <button
                                    onClick={() => setShowNotifications(false)}
                                    className="p-1 hover:bg-gray-100 rounded"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>

                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="px-4 py-8 text-center">
                                        <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">No new notifications</p>
                                    </div>
                                ) : (
                                    notifications.map((order) => (
                                        <Link
                                            key={order.id}
                                            href={`/admin/orders?highlight=${order.id}`}
                                            onClick={() => setShowNotifications(false)}
                                            className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                                        >
                                            <div className={`p-2 rounded-lg shrink-0 ${order.status === "pending"
                                                    ? "bg-yellow-50"
                                                    : order.status === "processing"
                                                        ? "bg-blue-50"
                                                        : "bg-green-50"
                                                }`}>
                                                <Package className={`w-4 h-4 ${order.status === "pending"
                                                        ? "text-yellow-600"
                                                        : order.status === "processing"
                                                            ? "text-blue-600"
                                                            : "text-green-600"
                                                    }`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    New order #{order.orderNumber}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {order.customerName} • Tk {order.total.toLocaleString()}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {formatTime(order.createdAt)}
                                                </p>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${order.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : order.status === "processing"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-green-100 text-green-700"
                                                }`}>
                                                {order.status}
                                            </span>
                                        </Link>
                                    ))
                                )}
                            </div>

                            {notifications.length > 0 && (
                                <Link
                                    href="/admin/orders"
                                    onClick={() => setShowNotifications(false)}
                                    className="block px-4 py-3 text-center text-sm font-medium text-blue-600 hover:bg-blue-50 border-t border-gray-100"
                                >
                                    View all orders
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                {/* Profile dropdown */}
                <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-medium text-gray-900">{adminUser?.name || adminUser?.email || "Admin"}</p>
                        <p className="text-xs text-gray-500">{adminUser?.role?.name || "Administrator"}</p>
                    </div>
                    <div className="relative group">
                        <button className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-medium">
                                {adminUser?.name?.charAt(0) || adminUser?.email?.charAt(0) || "A"}
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
