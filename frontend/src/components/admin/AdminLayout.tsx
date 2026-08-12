import { Outlet, Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const { usuario, logout } = useAuth()

  return (
    <div className="min-h-screen bg-cream font-body">
      <header className="bg-white border-b border-taupe/30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6 sm:gap-8">
          <Link to="/admin/ordenes" className="font-display font-bold text-mauve text-lg">
            Sarah Admin
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <NavLink
              to="/admin/ordenes"
              className={({ isActive }) =>
                `text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-full transition-colors ${
                  isActive ? 'bg-mauve text-white font-semibold shadow-xs' : 'text-[#3D2C33] hover:bg-taupe/20'
                }`
              }
            >
              📦 Pedidos (Cochabamba)
            </NavLink>
            <NavLink
              to="/admin/productos"
              className={({ isActive }) =>
                `text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-full transition-colors ${
                  isActive ? 'bg-mauve text-white font-semibold shadow-xs' : 'text-[#3D2C33] hover:bg-taupe/20'
                }`
              }
            >
              🧁 Catálogo de Productos
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-[#3D2C33]">
          <span className="hidden sm:inline font-medium text-mauve-dark">👩‍🍳 {usuario?.nombre}</span>
          <button
            onClick={logout}
            className="rounded-full border border-mauve/30 text-mauve hover:bg-mauve hover:text-white px-3 py-1 text-xs font-medium transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  )
}

