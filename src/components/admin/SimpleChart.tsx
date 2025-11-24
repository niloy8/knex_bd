"use client";

import React from "react";

interface SimpleChartProps {
    data: { day: string; revenue: number }[];
    color?: string;
}

export default function SimpleChart({ data, color = "#3b82f6" }: SimpleChartProps) {
    const maxValue = Math.max(...data.map(d => d.revenue));

    return (
        <div className="flex items-end justify-between h-48 gap-2">
            {data.map((item, i) => {
                const height = (item.revenue / maxValue) * 100;
                return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full relative group">
                            <div
                                className="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
                                style={{ height: `${height}%`, backgroundColor: color, minHeight: "4px" }}
                            />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                Tk {item.revenue.toLocaleString()}
                            </div>
                        </div>
                        <span className="text-xs text-gray-500">{item.day}</span>
                    </div>
                );
            })}
        </div>
    );
}
