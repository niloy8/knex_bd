"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthChange, type AuthUser } from "@/lib/authHelper";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface UseAuthOptions {
    required?: boolean;
    redirectTo?: string;
}

export function useAuth(options: UseAuthOptions = {}) {
    const { required = true, redirectTo = "/login" } = options;
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthChange((authUser) => {
            setUser(authUser);
            setLoading(false);
            if (required && !authUser) {
                router.push(redirectTo);
            }
        });
        return () => unsubscribe();
    }, [required, redirectTo, router]);

    const getToken = () => localStorage.getItem("userToken");

    const authFetch = async (endpoint: string, options: RequestInit = {}) => {
        const token = getToken();
        if (!token) throw new Error("Not authenticated");

        const res = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...options.headers,
            },
        });

        // Return the response and let the calling component handle 401 errors
        // This prevents unnecessary redirects on temporary network issues
        return res;
    };

    return { user, loading, getToken, authFetch, isAuthenticated: !!user };
}
