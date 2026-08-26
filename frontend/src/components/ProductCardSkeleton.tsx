export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse flex flex-col justify-between">
      <div>
        {/* Imagen Skeleton */}
        <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
        {/* Título Skeleton */}
        <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-2"></div>
        {/* Descripción Skeleton */}
        <div className="h-3.5 bg-gray-100 rounded-md w-full mb-1.5"></div>
        <div className="h-3.5 bg-gray-100 rounded-md w-2/3 mb-4"></div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        {/* Precio Skeleton */}
        <div className="h-6 bg-gray-200 rounded-md w-16"></div>
        {/* Botón Skeleton */}
        <div className="h-8 bg-gray-200 rounded-full w-24"></div>
      </div>
    </div>
  )
}
