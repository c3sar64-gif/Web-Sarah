import type { Product } from '../types/product'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="h-48 w-full object-cover"
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold text-neutral-900">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-neutral-500">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-red-600">
            ${product.price.toFixed(2)}
          </span>
          <button
            type="button"
            className="rounded-full bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  )
}
