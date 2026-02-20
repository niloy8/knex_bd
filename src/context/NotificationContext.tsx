"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
}

interface ConfirmOptions {
    title?: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "primary";
}

interface NotificationContextType {
    showToast: (message: string, type?: ToastType) => void;
    confirm: (options: ConfirmOptions) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [confirmOptions, setConfirmOptions] = useState<ConfirmOptions | null>(null);

    const showToast = useCallback((message: string, type: ToastType = "success") => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove toast after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const confirm = useCallback((options: ConfirmOptions) => {
        setConfirmOptions(options);
    }, []);

    const handleConfirm = () => {
        if (confirmOptions) {
            confirmOptions.onConfirm();
            setConfirmOptions(null);
        }
    };

    const handleCancel = () => {
        setConfirmOptions(null);
    };

    return (
        <NotificationContext.Provider value={{ showToast, confirm }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>

            {/* Global Confirm Modal */}
            {confirmOptions && (
                <ConfirmModal
                    isOpen={!!confirmOptions}
                    title={confirmOptions.title || "Confirmation"}
                    message={confirmOptions.message}
                    confirmText={confirmOptions.confirmText || "Confirm"}
                    cancelText={confirmOptions.cancelText || "Cancel"}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    variant={confirmOptions.variant || "primary"}
                />
            )}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
}
