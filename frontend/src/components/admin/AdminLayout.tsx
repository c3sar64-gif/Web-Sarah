import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const { usuario, logout } = useAuth()

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-taupe/30 px-6 py-4 flex items-center justify-between">
        <Link to="/admin/productos" className="font-semibold text-mauve">
          Panel de Sarah
        </Link>
        <div className="flex items-center gap-4 text-sm text-[#3D2C33]">
          <span>{usuario?.nombre}</span>
          <button onClick={logout} className="text-mauve hover:underline">
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
