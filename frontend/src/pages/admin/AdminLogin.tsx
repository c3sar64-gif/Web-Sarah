import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { GoogleLogin, GoogleOAuthProvider, type CredentialResponse } from '@react-oauth/google'
import { useAuth } from '../../context/AuthContext'
import { login as loginRequest, loginWithGoogle } from '../../api/auth'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await loginRequest(email, password)
      login(res.token, { nombre: res.nombre, email: res.email })
      navigate('/admin/productos')
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : undefined
      setError(message ?? 'Credenciales inválidas.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return
    setError(null)
    try {
      const res = await loginWithGoogle(credentialResponse.credential)
      login(res.token, { nombre: res.nombre, email: res.email })
      navigate('/admin/productos')
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : undefined
      setError(message ?? 'Esta cuenta no tiene acceso al panel.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-semibold text-mauve mb-6 text-center">Panel de Sarah</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#3D2C33] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-taupe/50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-mauve"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3D2C33] mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-taupe/50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-mauve"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-rose-metallic hover:bg-rose-metallic-dark text-white font-medium py-2.5 transition-colors disabled:opacity-60"
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-taupe/40" />
          <span className="text-xs text-taupe">o</span>
          <div className="h-px flex-1 bg-taupe/40" />
        </div>

        <div className="flex justify-center">
          <GoogleOAuthProvider clientId={googleClientId}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('No se pudo iniciar sesión con Google.')}
            />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  )
}
