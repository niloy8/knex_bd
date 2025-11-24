"use client";

import React from "react";
import ProtectedAdmin from "@/components/admin/ProtectAdmin";
import StatCard from "@/components/admin/StatCard";
import SimpleChart from "@/components/admin/SimpleChart";
import ProgressRing from "@/components/admin/ProgressRing";
import DataTable from "@/components/admin/DataTable";
import Badge from "@/components/admin/Badge";
import {
    analyticsData,
    revenueChartData,
    adminData
} from "@/lib/adminData";
import { Banknote, ShoppingBag, Users, TrendingUp, MoreVertical } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const orders = adminData.getOrders();
    const activities = adminData.getActivities();
    const topCategories = analyticsData.topCategories;
    const trafficSources = analyticsData.trafficSources;

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "success" | "warning" | "error" | "info"> = {
            Delivered: "success",
            Processing: "info",
            Pending: "warning",
            Cancelled: "error",
        };
        return <Badge variant={variants[status] || "default"}>{status}</Badge>;
    };

    return (
        <ProtectedAdmin>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-sm text-gray-500 mt-1">Welcome back! Here is what happening today.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>Last 90 days</option>
                        </select>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            + Add New
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Revenue"
                        value={`Tk ${analyticsData.totalRevenue.toLocaleString()}`}
                        change={analyticsData.revenueChange}
                        trend="up"
                        icon={<Banknote className="w-6 h-6 text-blue-600" />}
                    />
                    <StatCard
                        title="Total Sales"
                        value={analyticsData.totalSales.toLocaleString()}
                        change={analyticsData.salesChange}
                        trend="up"
                        icon={<ShoppingBag className="w-6 h-6 text-green-600" />}
                    />
                    <StatCard
                        title="Total Visitors"
                        value={analyticsData.totalVisitors.toLocaleString()}
                        change={analyticsData.visitorsChange}
                        trend="up"
                        icon={<Users className="w-6 h-6 text-purple-600" />}
                    />
                    <StatCard
                        title="Conversion Rate"
                        value="3.2%"
                        change="+0.4%"
                        trend="up"
                        icon={<TrendingUp className="w-6 h-6 text-yellow-600" />}
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Analytics */}
                    <div className="lg:col-span-2 bg-white rounded-lg border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
                                <p className="text-sm text-gray-500">Last 7 days performance</p>
                            </div>
                            <button className="px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                Last 7 Days
                            </button>
                        </div>
                        <SimpleChart data={revenueChartData} color="#3b82f6" />
                    </div>

                    {/* Monthly Target */}
                    <div className="bg-white rounded-lg border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Monthly Target</h3>
                            <button className="p-1 hover:bg-gray-100 rounded">
                                <MoreVertical className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <div className="flex flex-col items-center">
                            <ProgressRing percentage={analyticsData.targetAchieved} />
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-500">Goal Target: 100%</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Total Targeted: Tk {analyticsData.monthlyTarget.toLocaleString()}
                                </p>
                                <p className="text-xs text-green-600 font-medium mt-1">
                                    On track to hit target 🎯
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Orders */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg border border-gray-100">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                                <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    View All →
                                </Link>
                            </div>
                            <DataTable
                                headers={["Order ID", "Customer", "Product", "Qty", "Total", "Status"]}
                                data={orders.slice(0, 5)}
                                renderRow={(order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.orderId}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{order.customer}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 flex items-center gap-2">
                                            <span className="text-2xl">{order.productImage}</span>
                                            <span className="hidden sm:inline">{order.product}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{order.quantity}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">Tk {order.total}</td>
                                        <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                                    </tr>
                                )}
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Top Categories */}
                        <div className="bg-white rounded-lg border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Top Categories</h3>
                                <Link href="#" className="text-sm text-blue-600 hover:text-blue-700">See All</Link>
                            </div>
                            <div className="space-y-4">
                                {topCategories.map((cat, i) => {
                                    const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"];
                                    return (
                                        <div key={i}>
                                            <div className="flex items-center justify-between text-sm mb-2">
                                                <span className="text-gray-700">{cat.name}</span>
                                                <span className="font-medium text-gray-900">Tk {(cat.value / 1000).toFixed(0)}K</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div
                                                    className={`${colors[i % colors.length]} h-2 rounded-full transition-all duration-500`}
                                                    style={{ width: `${(cat.value / topCategories[0].value) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Traffic Sources */}
                        <div className="bg-white rounded-lg border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
                            <div className="space-y-3">
                                {trafficSources.map((source, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                            <span className="text-sm text-gray-700">{source.source}</span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{source.percentage}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-lg border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                {activities.map((activity) => (
                                    <div key={activity.id} className="flex gap-3">
                                        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span>{activity.icon}</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-700">{activity.message}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{activity.time} ago</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedAdmin>
    );
}
