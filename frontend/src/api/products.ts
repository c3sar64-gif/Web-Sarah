import { api } from './client'
import type { Categoria, Product, ProductInput } from '../types/product'

export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/productos')
  return data
}

export async function getProduct(id: number): Promise<Product> {
  const { data } = await api.get<Product>(`/productos/${id}`)
  return data
}

export async function getCategorias(): Promise<Categoria[]> {
  const { data } = await api.get<Categoria[]>('/categorias')
  return data
}

export async function createProduct(payload: ProductInput): Promise<Product> {
  const { data } = await api.post<Product>('/productos', payload)
  return data
}

export async function updateProduct(id: number, payload: ProductInput): Promise<void> {
  await api.put(`/productos/${id}`, { id, ...payload })
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/productos/${id}`)
}
