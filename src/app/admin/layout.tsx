"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { usePathname, useRouter } from "next/navigation";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === "/admin/login";
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        // Skip auth check for login page
        if (isLoginPage) {
            setIsAuthenticated(true);
            return;
        }

        // Check for admin token
        const adminToken = localStorage.getItem("adminToken");
        const adminUser = localStorage.getItem("adminUser");

        if (!adminToken || !adminUser) {
            // No admin credentials, redirect to admin login
            router.replace("/admin/login");
            return;
        }

        // Optional: Verify token is still valid by checking with backend
        setIsAuthenticated(true);
    }, [isLoginPage, router]);

    // Show loading while checking auth
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (isLoginPage) {
        return <>{children}</>;
    }

    return <AdminLayout>{children}</AdminLayout>;
}
