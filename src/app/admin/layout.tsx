import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "KNEX Admin Panel",
    description: "E-commerce admin dashboard",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return <AdminLayout>{children}</AdminLayout>;
}
