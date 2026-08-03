export interface Categoria {
  id: number
  nombre: string
  descripcion: string | null
}

export interface Product {
  id: number
  nombre: string
  descripcion: string | null
  precio: number
  imagenUrl: string | null
  disponible: boolean
  categoriaId: number | null
  categoria: Categoria | null
}

export interface ProductInput {
  nombre: string
  descripcion: string | null
  precio: number
  imagenUrl: string | null
  disponible: boolean
  categoriaId: number | null
}
