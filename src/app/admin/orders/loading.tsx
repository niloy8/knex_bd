export default function OrdersLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header skeleton */}
            <div className="flex justify-between items-center">
                <div>
                    <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
                <div className="h-10 w-24 bg-gray-200 rounded-lg" />
            </div>

            {/* Filters skeleton */}
            <div className="bg-white rounded-lg border border-gray-100 p-4">
                <div className="flex items-center gap-4">
                    <div className="w-5 h-5 bg-gray-200 rounded" />
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-10 w-24 bg-gray-200 rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Table skeleton */}
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {["Order", "Customer", "Items", "Total", "Status", "Date", "Actions"].map((h) => (
                                    <th key={h} className="text-left px-6 py-4">
                                        <div className="h-3 w-16 bg-gray-200 rounded" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4"><div className="h-5 w-28 bg-gray-200 rounded" /></td>
                                    <td className="px-6 py-4">
                                        <div className="h-5 w-24 bg-gray-200 rounded mb-1" />
                                        <div className="h-4 w-20 bg-gray-100 rounded" />
                                    </td>
                                    <td className="px-6 py-4"><div className="h-5 w-12 bg-gray-200 rounded" /></td>
                                    <td className="px-6 py-4"><div className="h-5 w-20 bg-gray-200 rounded" /></td>
                                    <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-200 rounded-full" /></td>
                                    <td className="px-6 py-4"><div className="h-5 w-28 bg-gray-200 rounded" /></td>
                                    <td className="px-6 py-4"><div className="h-8 w-8 bg-gray-200 rounded" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
