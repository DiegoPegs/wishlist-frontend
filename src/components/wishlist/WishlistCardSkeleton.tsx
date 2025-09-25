export function WishlistCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-16 ml-4"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-28 mb-1"></div>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-24"></div>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
