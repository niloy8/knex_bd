import React from "react";

type BadgeVariant = "success" | "warning" | "error" | "info" | "default";

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    size?: "sm" | "md";
}

const variantStyles: Record<BadgeVariant, string> = {
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    error: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    default: "bg-gray-100 text-gray-700",
};

export default function Badge({ children, variant = "default", size = "sm" }: BadgeProps) {
    const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

    return (
        <span className={`inline-flex items-center rounded-full font-medium ${variantStyles[variant]} ${sizeClass}`}>
            {children}
        </span>
    );
}
