export default function DashboardLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header skeleton */}
            <div className="flex justify-between items-center">
                <div>
                    <div className="h-8 w-40 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-64 bg-gray-200 rounded" />
                </div>
                <div className="h-10 w-24 bg-gray-200 rounded-lg" />
            </div>

            {/* Stats cards skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
                        <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-gray-200 rounded" />
                            <div className="h-8 w-16 bg-gray-200 rounded" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <div className="h-5 w-40 bg-gray-200 rounded mb-6" />
                    <div className="h-48 bg-gray-100 rounded" />
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <div className="h-5 w-48 bg-gray-200 rounded mb-6" />
                    <div className="h-48 flex items-center justify-center">
                        <div className="w-40 h-40 bg-gray-100 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Table skeleton */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <div className="h-5 w-32 bg-gray-200 rounded" />
                </div>
                <div className="p-6 space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-12 bg-gray-100 rounded" />
                    ))}
                </div>
            </div>
        </div>
    );
}
