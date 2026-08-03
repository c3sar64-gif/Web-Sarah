import { api } from './client'

export async function uploadImagen(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('archivo', file)

  const { data } = await api.post<{ url: string }>('/uploads/imagen', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return data.url
}
