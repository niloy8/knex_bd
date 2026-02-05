"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

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

interface WishlistContextType {
    items: WishlistItem[];
    isLoaded: boolean;
    isLoggedIn: boolean;
    addToWishlist: (item: Omit<WishlistItem, "addedOn" | "id">) => Promise<void>;
    removeFromWishlist: (productId: number) => Promise<void>;
    clearWishlist: () => Promise<void>;
    isInWishlist: (productId: number) => boolean;
    toggleWishlist: (item: Omit<WishlistItem, "addedOn" | "id">) => Promise<void>;
    syncGuestWishlist: (token: string) => Promise<void>;
    refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const GUEST_WISHLIST_KEY = "knex_guest_wishlist";

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

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const loadWishlist = useCallback(async () => {
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
    }, []);

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
            loadWishlist();
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
                await loadWishlist();
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
    }, [loadWishlist]);

    const removeFromWishlist = useCallback(async (productId: number) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;

        if (token) {
            try {
                await fetch(`${API}/wishlist/${productId}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
                await loadWishlist();
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
    }, [loadWishlist]);

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

    return (
        <WishlistContext.Provider value={{
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
        }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}
