// frontend/src/api/auth.ts
import { api } from './client'

export interface AuthResponse {
  token: string
  nombre: string
  email: string
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
  return data
}

export async function loginWithGoogle(idToken: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/google', { idToken })
  return data
}
