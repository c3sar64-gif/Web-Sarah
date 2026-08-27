import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { getRecetas } from '../api/recetas'
import type { Receta } from '../types/receta'

export function useRecetas(todas: boolean = false) {
  const [recetas, setRecetas] = useState<Receta[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecetas = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getRecetas(todas)
      setRecetas(data)
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : undefined
      setError(message ?? 'No se pudieron cargar las recetas.')
    } finally {
      setLoading(false)
    }
  }, [todas])

  useEffect(() => {
    fetchRecetas()
  }, [fetchRecetas])

  return { recetas, loading, error, refetch: fetchRecetas }
}
