"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

const iconMap = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
};

const bgMap = {
    success: "bg-white border-green-100",
    error: "bg-white border-red-100",
    warning: "bg-white border-yellow-100",
    info: "bg-white border-blue-100",
};

export default function Toast({ message, type, onClose }: ToastProps) {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
        }, 2700);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`
            flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg pointer-events-auto
            min-w-[300px] animate-in slide-in-from-right duration-300
            ${isExiting ? "animate-out fade-out slide-out-to-right fill-mode-forwards" : ""}
            ${bgMap[type]}
        `}>
            {iconMap[type]}
            <p className="flex-1 text-sm font-medium text-gray-800">{message}</p>
            <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
