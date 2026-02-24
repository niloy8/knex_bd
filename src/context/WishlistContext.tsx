"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { onTokenChange } from "@/lib/authHelper";

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
    selectedColor?: string;
    selectedSize?: string;
    selectedVariant?: any;
    customSelections?: Record<string, string>;
}

interface WishlistContextType {
    items: WishlistItem[];
    isLoaded: boolean;
    isLoggedIn: boolean;
    addToWishlist: (item: Omit<WishlistItem, "addedOn" | "id">) => Promise<void>;
    removeFromWishlist: (productId: number, selectedColor?: string, selectedSize?: string, customSelections?: Record<string, string>, selectedVariant?: any) => Promise<void>;
    clearWishlist: () => Promise<void>;
    isInWishlist: (productId: number, selectedColor?: string, selectedSize?: string, customSelections?: Record<string, string>, selectedVariant?: any) => boolean;
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
    if (typeof window !== "undefined") {
        localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(items));
    }
};

const areCustomSelectionsEqual = (
    sel1?: Record<string, string> | null,
    sel2?: Record<string, string> | null
) => {
    if (!sel1 && !sel2) return true;
    if (!sel1 || !sel2) {
        // Handle case where one is empty object and other is null/undefined
        const s1 = sel1 && Object.keys(sel1).length > 0 ? sel1 : null;
        const s2 = sel2 && Object.keys(sel2).length > 0 ? sel2 : null;
        if (!s1 && !s2) return true;
        return false;
    }
    const keys1 = Object.keys(sel1);
    const keys2 = Object.keys(sel2);
    if (keys1.length !== keys2.length) return false;
    return keys1.every(key => sel1[key] === sel2[key]);
};

const clearGuestWishlist = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(GUEST_WISHLIST_KEY);
};

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        if (typeof window !== "undefined") {
            return !!localStorage.getItem("userToken");
        }
        return false;
    });

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

        // Listen for token changes to update state immediately
        // This ensures loadWishlist fires only after userToken is in localStorage
        const unsubscribe = onTokenChange((token) => {
            setIsLoggedIn(!!token);
            if (token) {
                loadWishlist();
            } else {
                setItems(getGuestWishlist());
            }
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, [loadWishlist]);

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
                    items: guestItems.map(item => ({
                        productId: item.productId,
                        selectedColor: item.selectedColor,
                        selectedSize: item.selectedSize,
                        selectedVariant: item.selectedVariant,
                        customSelections: item.customSelections,
                    })),
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
                    body: JSON.stringify({
                        productId: item.productId,
                        selectedColor: item.selectedColor,
                        selectedSize: item.selectedSize,
                        selectedVariant: item.selectedVariant,
                        customSelections: item.customSelections,
                    }),
                });
                await loadWishlist();
            } catch (error) {
                console.error("Error adding to wishlist:", error);
            }
        } else {
            setItems(prev => {
                const existing = prev.find(i =>
                    i.productId === item.productId &&
                    (i.selectedColor || null) === (item.selectedColor || null) &&
                    (i.selectedSize || null) === (item.selectedSize || null) &&
                    (i.selectedVariant?.id || null) === (item.selectedVariant?.id || null) &&
                    areCustomSelectionsEqual(i.customSelections, item.customSelections)
                );
                if (existing) return prev;

                const today = new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                });

                const newItems = [...prev, { ...item, id: `${item.productId}-${Date.now()}`, addedOn: today }];
                saveGuestWishlist(newItems);
                return newItems;
            });
        }
    }, [loadWishlist]);

    const removeFromWishlist = useCallback(async (productId: number, selectedColor?: string, selectedSize?: string, customSelections?: Record<string, string>, selectedVariant?: any) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;

        if (token) {
            try {
                let url = `${API}/wishlist/${productId}`;
                const params = new URLSearchParams();
                if (selectedColor) params.append("selectedColor", selectedColor);
                if (selectedSize) params.append("selectedSize", selectedSize);
                if (selectedVariant) params.append("selectedVariant", JSON.stringify(selectedVariant));
                if (customSelections) params.append("customSelections", JSON.stringify(customSelections));
                if (params.toString()) url += `?${params.toString()}`;

                await fetch(url, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
                await loadWishlist();
            } catch (error) {
                console.error("Error removing from wishlist:", error);
            }
        } else {
            setItems(prev => {
                const newItems = prev.filter(item =>
                    !(item.productId === productId &&
                        (item.selectedColor || null) === (selectedColor || null) &&
                        (item.selectedSize || null) === (selectedSize || null) &&
                        (item.selectedVariant?.id || null) === (selectedVariant?.id || null) &&
                        areCustomSelectionsEqual(item.customSelections, customSelections))
                );
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

    const isInWishlist = useCallback((productId: number, selectedColor?: string, selectedSize?: string, customSelections?: Record<string, string>, selectedVariant?: any) => {
        return items.some(item =>
            item.productId === productId &&
            (selectedColor !== undefined ? (item.selectedColor || null) === (selectedColor || null) : true) &&
            (selectedSize !== undefined ? (item.selectedSize || null) === (selectedSize || null) : true) &&
            (selectedVariant !== undefined ? (item.selectedVariant?.id || null) === (selectedVariant?.id || null) : true) &&
            (customSelections !== undefined ? areCustomSelectionsEqual(item.customSelections, customSelections) : true)
        );
    }, [items]);

    const toggleWishlist = useCallback(async (item: Omit<WishlistItem, "addedOn" | "id">) => {
        if (isInWishlist(item.productId, item.selectedColor, item.selectedSize, item.customSelections, item.selectedVariant)) {
            await removeFromWishlist(item.productId, item.selectedColor, item.selectedSize, item.customSelections, item.selectedVariant);
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
