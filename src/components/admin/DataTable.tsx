"use client";

import React from "react";

interface DataTableProps {
    headers: string[];
    data: any[];
    renderRow: (item: any, index: number) => React.ReactNode;
    emptyMessage?: string;
}

export default function DataTable({ headers, data, renderRow, emptyMessage = "No data available" }: DataTableProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            {headers.map((header, i) => (
                                <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={headers.length} className="px-6 py-8 text-center text-gray-500">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((item, index) => renderRow(item, index))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
