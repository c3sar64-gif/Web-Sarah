export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-neutral-200">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="/" className="text-lg font-semibold tracking-tight">
          Mi Tienda
        </a>
        <ul className="hidden gap-6 text-sm font-medium text-neutral-700 sm:flex">
          <li>
            <a href="#productos" className="hover:text-red-600">
              Productos
            </a>
          </li>
          <li>
            <a href="#nosotros" className="hover:text-red-600">
              Nosotros
            </a>
          </li>
          <li>
            <a href="#contacto" className="hover:text-red-600">
              Contacto
            </a>
          </li>
        </ul>
        <button
          type="button"
          className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Carrito (0)
        </button>
      </nav>
    </header>
  )
}
