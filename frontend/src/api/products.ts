import { api } from './client'
import type { Categoria, Product } from '../types/product'

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
