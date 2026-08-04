import { useState } from 'react'
import type { Product } from '../types/product'
import { useCart } from '../context/CartContext'

interface Props {
  product: Product
}

const PLACEHOLDER_IMG = 'https://placehold.co/400x300?text=Sin+imagen'

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart()
  const [agregado, setAgregado] = useState(false)

  const handleAgregar = () => {
    addItem(product)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1200)
  }

  return (
    <article className="bg-white rounded-xl2 shadow-card overflow-hidden flex flex-col hover:-translate-y-1 transition-transform">
      <div className="h-44 bg-[#F1EBE0] flex items-center justify-center overflow-hidden">
        <img
          src={product.imagenUrl ?? PLACEHOLDER_IMG}
          alt={product.nombre}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {product.categoria && (
          <span className="text-xs font-medium uppercase tracking-wide text-sage-dark">
            {product.categoria.nombre}
          </span>
        )}
        <h3 className="font-display text-lg text-[#3D2C33]">{product.nombre}</h3>
        {product.descripcion && (
          <p className="line-clamp-2 text-sm text-[#6B5560] leading-relaxed">{product.descripcion}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-semibold text-mauve-dark">
            Bs {product.precio.toFixed(2)}
          </span>
          <button
            type="button"
            onClick={handleAgregar}
            disabled={!product.disponible}
            className="rounded-full bg-rose-metallic px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-metallic-dark disabled:cursor-not-allowed disabled:bg-taupe"
          >
            {!product.disponible ? 'Agotado' : agregado ? 'Agregado ✓' : 'Agregar'}
          </button>
        </div>
      </div>
    </article>
  )
}
