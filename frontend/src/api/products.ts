import { api } from './client'
import type { Product } from '../types/product'

export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/products/')
  return data
}

export async function getProduct(id: number): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${id}/`)
  return data
}
