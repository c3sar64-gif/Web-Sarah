import { api } from './client'
import type { ContactoPayload, ContactoResponse } from '../types/contacto'

export async function postContacto(payload: ContactoPayload): Promise<ContactoResponse> {
  const { data } = await api.post<ContactoResponse>('/contacto', payload)
  return data
}
