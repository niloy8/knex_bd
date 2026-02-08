"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function OrdersError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Orders Error:", error);
    }, [error]);

    return (
        <div className="flex items-center justify-center p-8">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <AlertTriangle className="w-7 h-7 text-red-600" />
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load orders</h2>
                <p className="text-gray-500 text-sm mb-6">
                    {error.message || "Unable to fetch orders data. Please try again."}
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Retry
                    </button>
                    <Link
                        href="/admin/dashboard"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
