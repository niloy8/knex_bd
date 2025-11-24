"use client";

// Admin authentication utilities
const ADMIN_TOKEN_KEY = "knex_admin_token";
const ADMIN_USER_KEY = "knex_admin_user";

// Demo admin credentials (in production, this would be server-side)
const DEMO_ADMIN = {
    email: "admin@knex.bd",
    password: "KnexAdmin@2025",
    id: "admin-001",
    name: "Marvin George",
    role: "Super Admin",
    avatar: "👤",
};

export interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
}

export const adminAuth = {
    // Login with email/password
    async login(email: string, password: string): Promise<{ user: AdminUser; token: string }> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
                    const token = btoa(`${email}:${Date.now()}`);
                    const user: AdminUser = {
                        id: DEMO_ADMIN.id,
                        email: DEMO_ADMIN.email,
                        name: DEMO_ADMIN.name,
                        role: DEMO_ADMIN.role,
                        avatar: DEMO_ADMIN.avatar,
                    };

                    if (typeof window !== "undefined") {
                        localStorage.setItem(ADMIN_TOKEN_KEY, token);
                        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
                    }

                    resolve({ user, token });
                } else {
                    reject(new Error("Invalid credentials"));
                }
            }, 500);
        });
    },

    // Logout
    logout() {
        if (typeof window !== "undefined") {
            localStorage.removeItem(ADMIN_TOKEN_KEY);
            localStorage.removeItem(ADMIN_USER_KEY);
        }
    },

    // Check if authenticated
    isAuthenticated(): boolean {
        if (typeof window === "undefined") return false;
        return !!localStorage.getItem(ADMIN_TOKEN_KEY);
    },

    // Get current admin user
    getCurrentUser(): AdminUser | null {
        if (typeof window === "undefined") return null;
        const userStr = localStorage.getItem(ADMIN_USER_KEY);
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },
};
