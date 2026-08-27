import { useState, useMemo } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import RecetaCard from '../components/RecetaCard'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import TrustBadges from '../components/TrustBadges'
import { useRecetas } from '../hooks/useRecetas'
import { ChefHat, Search, Sparkles } from 'lucide-react'
import YouTubeIcon from '../components/YouTubeIcon'

const TODAS_DIFICULTADES = 'todas'

export default function Recetas() {
  const { recetas, loading, error } = useRecetas()
  const [searchTerm, setSearchTerm] = useState('')
  const [dificultadFiltro, setDificultadFiltro] = useState(TODAS_DIFICULTADES)

  const filteredRecetas = useMemo(() => {
    return recetas.filter((r) => {
      const matchSearch =
        r.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.descripcion && r.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchDificultad =
        dificultadFiltro === TODAS_DIFICULTADES || r.dificultad === dificultadFiltro
      return matchSearch && matchDificultad
    })
  }, [recetas, searchTerm, dificultadFiltro])

  return (
    <div className="font-body bg-cream text-[#3D2C33] min-h-screen overflow-x-hidden">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 md:px-12 pt-36 md:pt-44 pb-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-rose-100/80 text-rose-800 border border-rose-200">
            <ChefHat className="w-3.5 h-3.5 text-rose-600" />
            Recetas & Secretos del Horno
          </span>
          <h1 className="font-display text-3xl md:text-5xl text-[#3D2C33] mt-3">
            Aprende a Hornear con Nosotros
          </h1>
          <p className="text-sm md:text-base text-[#6B5560] mt-3 leading-relaxed">
            Descubre recetas paso a paso, ingredientes exactos y videos demostrativos en YouTube para preparar tus postres favoritos en casa.
          </p>
        </div>

        {/* Buscador y Filtros */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Input de Búsqueda */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar recetas (ej. pie, galletas)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-taupe/40 text-xs md:text-sm focus:outline-none focus:border-rose-400 shadow-2xs"
            />
          </div>

          {/* Filtros por Dificultad */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: TODAS_DIFICULTADES, label: 'Todas las Dificultades' },
              { id: 'Fácil', label: '🟢 Fácil' },
              { id: 'Intermedio', label: '🟡 Intermedio' },
              { id: 'Avanzado', label: '🔴 Avanzado' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setDificultadFiltro(f.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-2xs ${
                  dificultadFiltro === f.id
                    ? 'bg-rose-metallic text-white shadow-xs'
                    : 'bg-white text-gray-700 border border-taupe/40 hover:bg-rose-50/50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center p-8 rounded-2xl bg-rose-50 border border-rose-100 max-w-lg mx-auto mb-8">
            <p className="text-xs text-rose-800">
              Conectando con el recetario ({error}). Las recetas se actualizarán automáticamente.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredRecetas.length === 0 && (
          <div className="text-center p-12 rounded-3xl bg-white border border-gray-100 max-w-lg mx-auto shadow-sm">
            <YouTubeIcon className="w-12 h-12 text-red-500 mx-auto mb-3 opacity-80" />
            <h3 className="font-display text-lg text-gray-900 font-bold">
              {searchTerm ? 'No se encontraron recetas' : 'Próximamente nuevas recetas'}
            </h3>
            <p className="text-xs text-gray-500 mt-2">
              {searchTerm
                ? 'Intenta buscar con otra palabra clave o quita los filtros.'
                : 'Estamos preparando videos y recetas deliciosas para ti.'}
            </p>
          </div>
        )}

        {/* Grid de Recetas */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecetas.map((receta) => (
            <RecetaCard key={receta.id} receta={receta} />
          ))}
        </div>

        {/* Banner Informativo */}
        <div className="mt-16 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-3xl p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Canal de Videos
            </span>
            <h3 className="font-display text-2xl font-bold">
              ¿Quieres pedir el postre listo para disfrutar?
            </h3>
            <p className="text-xs text-rose-100 mt-1 max-w-lg leading-relaxed">
              Si prefieres que nos encarguemos nosotros de hornearlo fresco con 48h de anticipación y entrega en Cochabamba, visita nuestro menú.
            </p>
          </div>
          <a
            href="/especialidades"
            className="px-6 py-3 rounded-full bg-white text-rose-700 font-bold text-xs hover:bg-rose-50 transition-all shadow-md shrink-0"
          >
            Ver Menú y Precios
          </a>
        </div>

        {/* Insignias de Confianza */}
        <div className="mt-16 pt-10 border-t border-rose-100">
          <TrustBadges />
        </div>
      </main>

      <Footer />
    </div>
  )
}
