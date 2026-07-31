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
  const { count, openCart } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-cream/95 shadow-md border-b border-taupe/30 backdrop-blur-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-8 md:px-14 py-4">
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="Sarah — Horneado con Amor" className="h-12 md:h-14 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {LINKS.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-mauve' : 'text-[#3D2C33] hover:text-mauve'
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
          className="relative flex items-center gap-2 rounded-full bg-rose-metallic hover:bg-rose-metallic-dark text-white text-sm font-medium px-5 py-2.5 transition-colors"
        >
          Mi pedido
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-mauve text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
