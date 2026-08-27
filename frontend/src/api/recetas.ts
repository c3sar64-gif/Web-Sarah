import { api } from './client'
import type { Receta, RecetaInput } from '../types/receta'

export async function getRecetas(todas: boolean = false): Promise<Receta[]> {
  const { data } = await api.get<Receta[]>('/recetas', {
    params: {
      ...(todas ? { todas: true } : {}),
      _t: Date.now(),
    },
  })
  return data
}

export async function getReceta(id: number): Promise<Receta> {
  const { data } = await api.get<Receta>(`/recetas/${id}`, {
    params: { _t: Date.now() },
  })
  return data
}

export async function createReceta(payload: RecetaInput): Promise<Receta> {
  const { data } = await api.post<Receta>('/recetas', payload)
  return data
}

export async function updateReceta(id: number, payload: RecetaInput): Promise<Receta> {
  const { data } = await api.put<Receta>(`/recetas/${id}`, payload)
  return data
}

export async function deleteReceta(id: number): Promise<void> {
  await api.delete(`/recetas/${id}`)
}
