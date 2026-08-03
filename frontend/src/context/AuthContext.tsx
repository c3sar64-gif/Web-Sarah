// frontend/src/context/AuthContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react'

export const TOKEN_KEY = 'sarah_admin_token'
export const USER_KEY = 'sarah_admin_usuario'

export interface AdminUsuario {
  nombre: string
  email: string
}

interface AuthContextValue {
  token: string | null
  usuario: AdminUsuario | null
  isAuthenticated: boolean
  login: (token: string, usuario: AdminUsuario) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function loadUsuario(): AdminUsuario | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AdminUsuario) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [usuario, setUsuario] = useState<AdminUsuario | null>(loadUsuario)

  const login = (newToken: string, newUsuario: AdminUsuario) => {
    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(USER_KEY, JSON.stringify(newUsuario))
    setToken(newToken)
    setUsuario(newUsuario)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ token, usuario, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de un AuthProvider')
  return ctx
}
