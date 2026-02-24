"use client";

import { Mail, LogIn, Lock, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthCard from "@/components/Authcard";
import { useState } from "react";
import { signInWithEmail, signInWithGoogle, isAdmin } from "@/lib/authHelper";

export default function Login() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect");
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const user = await signInWithEmail(email, password);
            if (isAdmin(user)) {
                setError("Please use admin login page");
                const { logout } = await import("@/lib/authHelper");
                await logout();
            } else {
                router.push(redirect || "/account");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        setLoading(true);
        try {
            const user = await signInWithGoogle();
            if (isAdmin(user)) {
                setError("Please use admin login page");
                const { logout } = await import("@/lib/authHelper");
                await logout();
            } else {
                router.push(redirect || "/account");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Google login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard title="Welcome Back" subtitle="Sign in to your KNEX account">
            <form className="space-y-4" onSubmit={handleEmailLogin}>
                {error && (
                    <div className="px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <label className="block">
                    <div className="flex items-center gap-3 px-3 py-2 border rounded-2xl focus-within:ring-2 focus-within:ring-blue-300 transition">
                        <Mail size={18} className="text-gray-500" />
                        <input
                            aria-label="Email"
                            type="email"
                            placeholder="Email address"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            className="w-full bg-transparent outline-none text-sm sm:text-base"
                        />
                    </div>
                </label>

                <label className="block">
                    <div className="flex items-center gap-3 px-3 py-2 border rounded-2xl focus-within:ring-2 focus-within:ring-blue-300 transition">
                        <Lock size={18} className="text-gray-500" />
                        <input
                            aria-label="Password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            className="w-full bg-transparent outline-none text-sm sm:text-base"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base active:scale-[0.99] transition disabled:opacity-50"
                >
                    <LogIn size={18} /> {loading ? "Signing in..." : "Sign in"}
                </button>

                <div className="flex items-center gap-3 mt-1">
                    <div className="h-px bg-gray-200 flex-1" />
                    <span className="text-xs text-gray-400">or</span>
                    <div className="h-px bg-gray-200 flex-1" />
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full mt-1 py-3 rounded-2xl border bg-white text-sm sm:text-base font-medium flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50 transition disabled:opacity-50"
                >
                    <FcGoogle size={20} /> Continue with Google
                </button>

                <p className="text-center text-xs sm:text-sm text-gray-500 mt-3">
                    Don’t have an account?{" "}
                    <Link href="/register" className="text-blue-600 hover:underline">
                        Create one
                    </Link>
                </p>
            </form>
        </AuthCard>
    );
}
