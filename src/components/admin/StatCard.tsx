import React from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
    icon?: React.ReactNode;
    trend?: "up" | "down";
}

export default function StatCard({ title, value, change, icon, trend = "up" }: StatCardProps) {
    return (
        <div className="bg-white rounded-lg p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                    {change && (
                        <p className={`text-sm mt-2 flex items-center gap-1 ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
                            <span>{trend === "up" ? "↑" : "↓"}</span>
                            <span>{change}</span>
                            <span className="text-gray-400 text-xs">vs last month</span>
                        </p>
                    )}
                </div>
                {icon && (
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-2xl">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}
