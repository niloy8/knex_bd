export default function ProductsLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header skeleton */}
            <div className="flex justify-between items-center">
                <div>
                    <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-48 bg-gray-200 rounded" />
                </div>
                <div className="h-10 w-32 bg-gray-200 rounded-lg" />
            </div>

            {/* Search and filters skeleton */}
            <div className="bg-white rounded-lg border border-gray-100 p-4">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-64 bg-gray-200 rounded-lg" />
                    <div className="h-10 w-32 bg-gray-200 rounded-lg" />
                    <div className="h-10 w-32 bg-gray-200 rounded-lg" />
                </div>
            </div>

            {/* Products grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                        <div className="aspect-square bg-gray-200" />
                        <div className="p-4 space-y-3">
                            <div className="h-5 w-3/4 bg-gray-200 rounded" />
                            <div className="h-4 w-1/2 bg-gray-200 rounded" />
                            <div className="flex justify-between items-center">
                                <div className="h-6 w-20 bg-gray-200 rounded" />
                                <div className="h-6 w-16 bg-gray-200 rounded-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
