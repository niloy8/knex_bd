"use client";

import { usePathname } from "next/navigation";
import CategoryNav from "./CategoryNav";

// Pages where CategoryNav should NOT be shown
const EXCLUDED_PATHS = [
    "/",           // Home page
    "/login",      // Login page
    "/register",   // Register/Signup page
    "/account",    // Account page (optional - remove if you want nav here)
];

// Check if current path should exclude the category nav
const shouldHideCategoryNav = (pathname: string): boolean => {
    // Exact match for excluded paths
    if (EXCLUDED_PATHS.includes(pathname)) {
        return true;
    }

    // Also check for paths that start with excluded paths followed by /
    // This handles nested routes like /account/settings but keeps /login as exact
    return false;
};

export default function ConditionalCategoryNav() {
    const pathname = usePathname();

    // Don't render if on excluded pages
    if (shouldHideCategoryNav(pathname)) {
        return null;
    }

    return <CategoryNav />;
}
