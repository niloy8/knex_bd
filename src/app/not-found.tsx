"use client";

import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
            <div className="max-w-lg w-full text-center">
                {/* 404 Illustration */}
                <div className="relative mb-8">
                    <h1 className="text-[150px] sm:text-[200px] font-bold text-gray-200 leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white rounded-full p-6 shadow-lg">
                            <Search className="w-12 h-12 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Message */}
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                    Page Not Found
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    Let&apos;s get you back on track.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Home className="w-5 h-5" />
                        Back to Home
                    </Link>
                </div>

                {/* Quick Links */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-4">Or try these popular pages:</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/products" className="text-blue-600 hover:underline text-sm">
                            Products
                        </Link>
                        <Link href="/cart" className="text-blue-600 hover:underline text-sm">
                            Cart
                        </Link>
                        <Link href="/wishlist" className="text-blue-600 hover:underline text-sm">
                            Wishlist
                        </Link>
                        <Link href="/myprofile" className="text-blue-600 hover:underline text-sm">
                            My Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
