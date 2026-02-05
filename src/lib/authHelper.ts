"use client";

import { auth } from "./firebaseClient";
import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser,
} from "firebase/auth";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Admin email - only this email has admin access
const ADMIN_EMAIL = "admin@knex.bd";

export interface AuthUser {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
}

// Convert Firebase user to our user format
const toAuthUser = (firebaseUser: FirebaseUser): AuthUser => ({
    uid: firebaseUser.uid,
    email: firebaseUser.email || "",
    displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
    photoURL: firebaseUser.photoURL || undefined,
});

// Sync user with backend and get JWT token
const syncWithBackend = async (user: AuthUser): Promise<void> => {
    try {
        const res = await fetch(`${API}/users/sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: user.email,
                name: user.displayName,
                firebaseUid: user.uid,
            }),
        });

        if (res.ok) {
            const data = await res.json();
            // Store backend JWT token for cart/wishlist operations
            localStorage.setItem("userToken", data.token);
            localStorage.setItem("userData", JSON.stringify(data.user));

            // Sync guest cart/wishlist to backend
            await syncGuestData(data.token);
        }
    } catch (error) {
        console.error("Error syncing with backend:", error);
    }
};

// Sync guest cart/wishlist data to backend after login
const syncGuestData = async (token: string): Promise<void> => {
    try {
        // Sync guest cart
        const guestCart = localStorage.getItem("knex_guest_cart");
        if (guestCart) {
            const items = JSON.parse(guestCart);
            if (items.length > 0) {
                await fetch(`${API}/cart/sync`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        items: items.map((item: { productId: number; quantity: number }) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                        })),
                    }),
                });
                localStorage.removeItem("knex_guest_cart");
            }
        }

        // Sync guest wishlist
        const guestWishlist = localStorage.getItem("knex_guest_wishlist");
        if (guestWishlist) {
            const items = JSON.parse(guestWishlist);
            if (items.length > 0) {
                await fetch(`${API}/wishlist/sync`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        items: items.map((item: { productId: number }) => item.productId),
                    }),
                });
                localStorage.removeItem("knex_guest_wishlist");
            }
        }
    } catch (error) {
        console.error("Error syncing guest data:", error);
    }
};

// Google Sign-In
export const signInWithGoogle = async (): Promise<AuthUser> => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = toAuthUser(result.user);
    await syncWithBackend(user);
    return user;
};

// Email/Password Sign-In
export const signInWithEmail = async (email: string, password: string): Promise<AuthUser> => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const user = toAuthUser(credential.user);
    await syncWithBackend(user);
    return user;
};

// Email/Password Sign-Up
export const signUpWithEmail = async (email: string, password: string): Promise<AuthUser> => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const user = toAuthUser(credential.user);
    await syncWithBackend(user);
    return user;
};

// Sign Out
export const logout = async (): Promise<void> => {
    await signOut(auth);
    // Clear backend tokens
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
};

// Get current user (synchronous)
export const getCurrentUser = (): AuthUser | null => {
    const user = auth.currentUser;
    return user ? toAuthUser(user) : null;
};

// Wait for auth to initialize and get current user
export const waitForAuthUser = (): Promise<AuthUser | null> => {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            unsubscribe();
            resolve(firebaseUser ? toAuthUser(firebaseUser) : null);
        });
    });
};

// Listen to auth state changes
export const onAuthChange = (callback: (user: AuthUser | null) => void) => {
    return onAuthStateChanged(auth, (firebaseUser) => {
        callback(firebaseUser ? toAuthUser(firebaseUser) : null);
    });
};

// Check if current user is admin
export const isAdmin = (user: AuthUser | null): boolean => {
    return user?.email === ADMIN_EMAIL;
};

// Get ID token
export const getIdToken = async (forceRefresh = false): Promise<string | null> => {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken(forceRefresh);
};

// Get backend JWT token
export const getBackendToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("userToken");
};
