"use client";

import { useState, useEffect, useCallback } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface WishlistItem {
    id: string;
    productId: number;
    title: string;
    price: number;
    originalPrice: number;
    image: string;
    slug: string;
    inStock: boolean;
    addedOn: string;
}

const GUEST_WISHLIST_KEY = "knex_guest_wishlist";

// Guest wishlist helpers (for non-logged-in users only)
const getGuestWishlist = (): WishlistItem[] => {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(GUEST_WISHLIST_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const saveGuestWishlist = (items: WishlistItem[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(items));
};

const clearGuestWishlist = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(GUEST_WISHLIST_KEY);
};

export function useWishlist() {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Load wishlist function
    const loadWishlist = async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
        setIsLoggedIn(!!token);

        if (token) {
            try {
                const res = await fetch(`${API}/wishlist`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setItems(data);
                }
            } catch (error) {
                console.error("Error fetching wishlist:", error);
            }
        } else {
            setItems(getGuestWishlist());
        }
        setIsLoaded(true);
    };

    useEffect(() => {
        let isMounted = true;

        const initWishlist = async () => {
            const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;

            if (isMounted) setIsLoggedIn(!!token);

            if (token) {
                try {
                    const res = await fetch(`${API}/wishlist`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (res.ok && isMounted) {
                        const data = await res.json();
                        setItems(data);
                    }
                } catch (error) {
                    console.error("Error fetching wishlist:", error);
                }
            } else if (isMounted) {
                setItems(getGuestWishlist());
            }
            if (isMounted) setIsLoaded(true);
        };

        initWishlist();

        return () => { isMounted = false; };
    }, []);

    // Sync guest wishlist to backend on login
    const syncGuestWishlist = useCallback(async (token: string) => {
        const guestItems = getGuestWishlist();
        if (guestItems.length === 0) return;

        try {
            await fetch(`${API}/wishlist/sync`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    items: guestItems.map(item => item.productId),
                }),
            });
            clearGuestWishlist();
            loadWishlist(); // Reload wishlist from backend
        } catch (error) {
            console.error("Error syncing wishlist:", error);
        }
    }, [loadWishlist]);

    const addToWishlist = useCallback(async (item: Omit<WishlistItem, "addedOn" | "id">) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;

        if (token) {
            try {
                await fetch(`${API}/wishlist`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ productId: item.productId }),
                });
                loadWishlist();
            } catch (error) {
                console.error("Error adding to wishlist:", error);
            }
        } else {
            setItems(prev => {
                const existing = prev.find(i => i.productId === item.productId);
                if (existing) return prev;

                const today = new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                });

                const newItems = [...prev, { ...item, id: item.productId.toString(), addedOn: today }];
                saveGuestWishlist(newItems);
                return newItems;
            });
        }
    }, []);

    const removeFromWishlist = useCallback(async (productId: number) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;

        if (token) {
            try {
                await fetch(`${API}/wishlist/${productId}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
                loadWishlist();
            } catch (error) {
                console.error("Error removing from wishlist:", error);
            }
        } else {
            setItems(prev => {
                const newItems = prev.filter(item => item.productId !== productId);
                saveGuestWishlist(newItems);
                return newItems;
            });
        }
    }, []);

    const clearWishlist = useCallback(async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;

        if (token) {
            try {
                await fetch(`${API}/wishlist`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
                setItems([]);
            } catch (error) {
                console.error("Error clearing wishlist:", error);
            }
        } else {
            setItems([]);
            clearGuestWishlist();
        }
    }, []);

    const isInWishlist = useCallback((productId: number) => {
        return items.some(item => item.productId === productId);
    }, [items]);

    const toggleWishlist = useCallback(async (item: Omit<WishlistItem, "addedOn" | "id">) => {
        if (isInWishlist(item.productId)) {
            await removeFromWishlist(item.productId);
        } else {
            await addToWishlist(item);
        }
    }, [isInWishlist, removeFromWishlist, addToWishlist]);

    return {
        items,
        isLoaded,
        isLoggedIn,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        toggleWishlist,
        syncGuestWishlist,
        refreshWishlist: loadWishlist,
    };
}
