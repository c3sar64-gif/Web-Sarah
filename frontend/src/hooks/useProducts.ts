import { useEffect, useState } from 'react'
import { getProducts } from '../api/products'
import type { Product } from '../types/product'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getProducts()
      .then((data) => {
        if (active) setProducts(data)
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Error al cargar productos')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return { products, loading, error }
}
