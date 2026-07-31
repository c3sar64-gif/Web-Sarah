import { useEffect, useState } from 'react'
import { getCategorias } from '../api/products'
import type { Categoria } from '../types/product'

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getCategorias()
      .then((data) => {
        if (active) setCategorias(data)
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Error al cargar categorías')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return { categorias, loading, error }
}
