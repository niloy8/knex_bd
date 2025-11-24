"use client";

import { allProducts } from "@/data/productsData";

// Mock data for admin dashboard

export interface Order {
    id: string;
    orderId: string;
    customer: string;
    product: string;
    productImage: string;
    quantity: number;
    total: number;
    status: "Pending" | "Processing" | "Delivered" | "Cancelled";
    date: string;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalOrders: number;
    totalSpent: number;
    status: "Active" | "Inactive";
}

export interface Activity {
    id: string;
    type: "order" | "customer" | "product";
    message: string;
    time: string;
    icon: string;
}

// Mock orders
const mockOrders: Order[] = [
    { id: "1", orderId: "#12253", customer: "Kristin Watson", product: "DELL Monitor", productImage: "🖥️", quantity: 2, total: 2500, status: "Pending", date: "2025-09-01" },
    { id: "2", orderId: "#12252", customer: "Subscribe Admin", product: "Running Shoes", productImage: "👟", quantity: 1, total: 875, status: "Processing", date: "2025-08-31" },
    { id: "3", orderId: "#12251", customer: "Suzanne Sincero", product: "Smart Watch", productImage: "⌚", quantity: 1, total: 1560, status: "Delivered", date: "2025-08-30" },
    { id: "4", orderId: "#12250", customer: "Oliver Hale", product: "Backpack", productImage: "🎒", quantity: 3, total: 590, status: "Delivered", date: "2025-08-29" },
    { id: "5", orderId: "#12249", customer: "Anna Smith", product: "HD Projector", productImage: "📽️", quantity: 1, total: 6990, status: "Processing", date: "2025-08-28" },
];

// Mock customers
const mockCustomers: Customer[] = [
    { id: "1", name: "Kristin Watson", email: "kristin@example.com", phone: "+880 1711-000001", totalOrders: 15, totalSpent: 45000, status: "Active" },
    { id: "2", name: "Subscribe Admin", email: "admin@example.com", phone: "+880 1711-000002", totalOrders: 8, totalSpent: 28000, status: "Active" },
    { id: "3", name: "Suzanne Sincero", email: "suzanne@example.com", phone: "+880 1711-000003", totalOrders: 22, totalSpent: 67000, status: "Active" },
    { id: "4", name: "Oliver Hale", email: "oliver@example.com", phone: "+880 1711-000004", totalOrders: 5, totalSpent: 12000, status: "Inactive" },
];

// Mock recent activities
const mockActivities: Activity[] = [
    { id: "1", type: "order", message: "New order placed by Kristin Watson", time: "10 min", icon: "🛒" },
    { id: "2", type: "customer", message: "New customer registered", time: "1 hr", icon: "👤" },
    { id: "3", type: "product", message: "Product 'DELL Monitor' stock updated", time: "2 hrs", icon: "📦" },
    { id: "4", type: "order", message: "Order #12252 status changed to processing", time: "3 hrs", icon: "🔄" },
    { id: "5", type: "order", message: "Payment received for order #12251", time: "5 hrs", icon: "💰" },
];

// Analytics data
export const analyticsData = {
    totalRevenue: 983410,
    revenueChange: "+2.5%",
    totalSales: 58375,
    salesChange: "+3.2%",
    totalVisitors: 237782,
    visitorsChange: "+1.8%",
    monthlyTarget: 5400000,
    targetAchieved: 85,
    conversionRate: {
        current: 25000,
        previous: 12000,
        goal: 8500,
        failed: 6200,
        low: 5000,
    },
    trafficSources: [
        { source: "Direct Traffic", percentage: 65 },
        { source: "Organic Search", percentage: 40 },
        { source: "Social Media", percentage: 30 },
        { source: "Referral Traffic", percentage: 10 },
        { source: "Email Campaigns", percentage: 5 },
    ],
    topCategories: [
        { name: "Electronics", value: 3120000 },
        { name: "Fashion", value: 1550000 },
        { name: "Home & Lifestyle", value: 750000 },
        { name: "Beauty & Health", value: 520000 },
    ],
};

// Revenue chart data (for last 7 days)
export const revenueChartData = [
    { day: "Mon", revenue: 120000 },
    { day: "Tue", revenue: 135000 },
    { day: "Wed", revenue: 142000 },
    { day: "Thu", revenue: 128000 },
    { day: "Fri", revenue: 155000 },
    { day: "Sat", revenue: 168000 },
    { day: "Sun", revenue: 145000 },
];

export const adminData = {
    getOrders: () => mockOrders,
    getCustomers: () => mockCustomers,
    getActivities: () => mockActivities,
    getProducts: () => allProducts,

    // Order operations
    updateOrderStatus: (orderId: string, status: Order["status"]) => {
        const order = mockOrders.find(o => o.id === orderId);
        if (order) order.status = status;
        return order;
    },

    // Product operations
    getProduct: (id: string) => allProducts.find(p => p.id === id),
    updateProduct: (id: string, data: Partial<(typeof allProducts)[number]>): (typeof allProducts)[number] | undefined => {
        // In real app, this would update the database
        const product = allProducts.find(p => p.id === id);
        return product ? { ...product, ...data } : undefined;
    },
};
