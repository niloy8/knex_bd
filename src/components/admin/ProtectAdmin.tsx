"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminAuth } from "@/lib/adminAuth";

interface ProtectedAdminProps {
    children: React.ReactNode;
}

export default function ProtectedAdmin({ children }: ProtectedAdminProps) {
    const router = useRouter();

    useEffect(() => {
        if (!adminAuth.isAuthenticated()) {
            router.replace("/admin/login");
        }
    }, [router]);

    if (!adminAuth.isAuthenticated()) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return <>{children}</>;
}
