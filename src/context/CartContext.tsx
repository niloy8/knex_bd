"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface CartItem {
    id: string;
    productId: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
    slug?: string;
}

interface CartContextType {
    items: CartItem[];
    isLoaded: boolean;
    isLoggedIn: boolean;
    addToCart: (item: Omit<CartItem, "quantity" | "id">, quantity?: number) => Promise<void>;
    removeFromCart: (productId: number) => Promise<void>;
    updateQuantity: (productId: number, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    getCartTotal: () => number;
    getCartCount: () => number;
    isInCart: (productId: number) => boolean;
    syncGuestCart: (token: string) => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_CART_KEY = "knex_guest_cart";

const getGuestCart = (): CartItem[] => {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(GUEST_CART_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const saveGuestCart = (items: CartItem[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};

const clearGuestCart = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(GUEST_CART_KEY);
};

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const loadCart = useCallback(async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
        setIsLoggedIn(!!token);

        if (token) {
            try {
                const res = await fetch(`${API}/cart`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setItems(data);
                }
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        } else {
            setItems(getGuestCart());
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        let isMounted = true;

        const initCart = async () => {
            const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
            if (isMounted) setIsLoggedIn(!!token);

            if (token) {
                try {
                    const res = await fetch(`${API}/cart`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (res.ok && isMounted) {
                        const data = await res.json();
                        setItems(data);
                    }
                } catch (error) {
                    console.error("Error fetching cart:", error);
                }
            } else if (isMounted) {
                setItems(getGuestCart());
            }
            if (isMounted) setIsLoaded(true);
        };

        initCart();
        return () => { isMounted = false; };
    }, []);

    const syncGuestCart = useCallback(async (token: string) => {
        const guestItems = getGuestCart();
        if (guestItems.length === 0) return;

        try {
            await fetch(`${API}/cart/sync`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    items: guestItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                }),
            });
            clearGuestCart();
            loadCart();
        } catch (error) {
            console.error("Error syncing cart:", error);
        }
    }, [loadCart]);

    const addToCart = useCallback(async (item: Omit<CartItem, "quantity" | "id">, quantity = 1) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;

        if (token) {
            try {
                await fetch(`${API}/cart`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ productId: item.productId, quantity }),
                });
                await loadCart();
            } catch (error) {
                console.error("Error adding to cart:", error);
            }
        } else {
            setItems(prev => {
                const existing = prev.find(i => i.productId === item.productId);
                let newItems: CartItem[];
                if (existing) {
                    newItems = prev.map(i =>
                        i.productId === item.productId
                            ? { ...i, quantity: i.quantity + quantity }
                            : i
                    );
                } else {
                    newItems = [...prev, { ...item, id: item.productId.toString(), quantity }];
                }
                saveGuestCart(newItems);
                return newItems;
            });
        }
    }, [loadCart]);

    const removeFromCart = useCallback(async (productId: number) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;

        if (token) {
            try {
                await fetch(`${API}/cart/${productId}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
                await loadCart();
            } catch (error) {
                console.error("Error removing from cart:", error);
            }
        } else {
            setItems(prev => {
                const newItems = prev.filter(item => item.productId !== productId);
                saveGuestCart(newItems);
                return newItems;
            });
        }
    }, [loadCart]);

    const updateQuantity = useCallback(async (productId: number, quantity: number) => {
        if (quantity < 1) return;
        const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;

        if (token) {
            try {
                await fetch(`${API}/cart/${productId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ quantity }),
                });
                await loadCart();
            } catch (error) {
                console.error("Error updating cart:", error);
            }
        } else {
            setItems(prev => {
                const newItems = prev.map(item =>
                    item.productId === productId ? { ...item, quantity } : item
                );
                saveGuestCart(newItems);
                return newItems;
            });
        }
    }, [loadCart]);

    const clearCart = useCallback(async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;

        if (token) {
            try {
                await fetch(`${API}/cart`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
                setItems([]);
            } catch (error) {
                console.error("Error clearing cart:", error);
            }
        } else {
            setItems([]);
            clearGuestCart();
        }
    }, []);

    const getCartTotal = useCallback(() => {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [items]);

    const getCartCount = useCallback(() => {
        return items.reduce((count, item) => count + item.quantity, 0);
    }, [items]);

    const isInCart = useCallback((productId: number) => {
        return items.some(item => item.productId === productId);
    }, [items]);

    return (
        <CartContext.Provider value={{
            items,
            isLoaded,
            isLoggedIn,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartCount,
            isInCart,
            syncGuestCart,
            refreshCart: loadCart,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
