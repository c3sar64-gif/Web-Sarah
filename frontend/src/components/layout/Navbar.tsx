import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

const LINKS = [
  { label: 'Inicio', to: '/' },
  { label: 'Especialidades', to: '/especialidades' },
  { label: 'Sobre Mí', to: '/sobre-mi' },
  { label: 'Contacto', to: '/contacto' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { count, openCart } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? 'bg-cream/95 shadow-md border-b border-taupe/30 backdrop-blur-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-8 md:px-14 py-3 sm:py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-[#3D2C33] hover:bg-taupe/20 transition-colors"
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Sarah — Horneado con Amor" className="h-10 sm:h-12 md:h-14 w-auto" />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-10">
          {LINKS.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-mauve font-semibold' : 'text-[#3D2C33] hover:text-mauve'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={openCart}
          className="relative flex items-center gap-1.5 sm:gap-2 rounded-full bg-rose-metallic hover:bg-rose-metallic-dark text-white text-xs sm:text-sm font-medium px-3.5 sm:px-5 py-2 sm:py-2.5 transition-colors"
        >
          <span>Mi pedido</span>
          {count > 0 && (
            <span className="bg-mauve text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
      </div>

      {/* Menú Móvil Deslizable */}
      {mobileOpen && (
        <nav className="md:hidden bg-cream border-t border-taupe/30 px-6 py-4 flex flex-col gap-3 shadow-lg animate-fadeIn">
          {LINKS.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `text-base font-medium py-2 px-3 rounded-lg transition-colors ${
                  isActive ? 'bg-mauve/10 text-mauve font-semibold' : 'text-[#3D2C33] hover:bg-taupe/10'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
