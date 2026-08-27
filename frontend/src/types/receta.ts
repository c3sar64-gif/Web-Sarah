export interface Receta {
  id: number
  titulo: string
  descripcion?: string | null
  ingredientes: string
  instrucciones: string
  tiempoPreparacionMinutos?: number | null
  porciones?: number | null
  dificultad: string
  imagenUrl?: string | null
  videoUrl?: string | null
  youtubeUrl?: string | null
  publicada: boolean
  destacada: boolean
  createdAt: string
  updatedAt: string
}

export interface RecetaInput {
  titulo: string
  descripcion?: string | null
  ingredientes: string
  instrucciones: string
  tiempoPreparacionMinutos?: number | null
  porciones?: number | null
  dificultad: string
  imagenUrl?: string | null
  videoUrl?: string | null
  youtubeUrl?: string | null
  publicada: boolean
  destacada: boolean
}
