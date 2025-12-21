"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function ProtectedAdmin({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) { router.replace("/admin/login"); return; }

        fetch(`${API}/admin/me`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => { if (!res.ok) throw new Error(); return res.json(); })
            .then(() => setIsAuth(true))
            .catch(() => { localStorage.removeItem("adminToken"); router.replace("/admin/login"); })
            .finally(() => setLoading(false));
    }, [router]);

    if (loading || !isAuth) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    return <>{children}</>;
}
