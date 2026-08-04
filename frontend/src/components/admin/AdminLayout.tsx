import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const { usuario, logout } = useAuth()

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-taupe/30 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <Link to="/admin/productos" className="font-semibold text-mauve text-sm sm:text-base">
          Panel de Sarah
        </Link>
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-[#3D2C33]">
          <span className="hidden sm:inline font-medium">{usuario?.nombre}</span>
          <button
            onClick={logout}
            className="rounded-full border border-mauve/30 text-mauve hover:bg-mauve hover:text-white px-3 py-1 text-xs font-medium transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  )
}
