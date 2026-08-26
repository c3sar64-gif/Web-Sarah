import { useMemo, useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ProductCard from '../components/ProductCard'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import TrustBadges from '../components/TrustBadges'
import { useProducts } from '../hooks/useProducts'
import { useCategorias } from '../hooks/useCategorias'
import { Sparkles } from 'lucide-react'

const TODAS = 'todas'

export default function Especialidades() {
  const { products, loading: loadingProducts, error: errorProducts } = useProducts()
  const { categorias, loading: loadingCategorias } = useCategorias()
  const [activeTab, setActiveTab] = useState<string>(TODAS)

  const filtered = useMemo(() => {
    if (activeTab === TODAS) return products
    const categoriaId = Number(activeTab)
    return products.filter((p) => p.categoriaId === categoriaId)
  }, [products, activeTab])

  const loading = loadingProducts || loadingCategorias

  return (
    <div className="font-body bg-cream text-[#3D2C33] min-h-screen overflow-x-hidden">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 md:px-12 pt-36 md:pt-44 pb-20">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-rose-100/80 text-rose-800 border border-rose-200">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            Catálogo Artesanal
          </span>
          <h1 className="font-display text-3xl md:text-5xl text-[#3D2C33] mt-3">
            Nuestras Especialidades
          </h1>
          <p className="text-sm md:text-base text-[#6B5560] mt-3">
            Pies, tortas, queques y galletas elaborados artesanalmente bajo pedido en Cochabamba.
          </p>
        </div>

        {/* Filtros de Categorías */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          <button
            type="button"
            onClick={() => setActiveTab(TODAS)}
            className={`rounded-full px-5 py-2.5 text-xs md:text-sm font-semibold transition-all shadow-2xs ${
              activeTab === TODAS
                ? 'bg-rose-metallic text-white shadow-xs'
                : 'bg-white text-[#3D2C33] border border-taupe/40 hover:bg-rose-50/50'
            }`}
          >
            Todas las Especialidades
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTab(String(cat.id))}
              className={`rounded-full px-5 py-2.5 text-xs md:text-sm font-semibold transition-all shadow-2xs ${
                activeTab === String(cat.id)
                  ? 'bg-rose-metallic text-white shadow-xs'
                  : 'bg-white text-[#3D2C33] border border-taupe/40 hover:bg-rose-50/50'
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>

        {/* Loading con Skeletons */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {errorProducts && (
          <div className="text-center p-8 rounded-2xl bg-rose-50 border border-rose-100 max-w-lg mx-auto mb-8">
            <p className="text-xs text-rose-800">
              Conectando con el catálogo ({errorProducts}). Los productos se sincronizarán en vivo.
            </p>
          </div>
        )}

        {!loading && !errorProducts && filtered.length === 0 && (
          <div className="text-center p-12 rounded-3xl bg-white border border-gray-100 max-w-lg mx-auto shadow-sm">
            <p className="text-sm text-gray-600">
              No hay productos disponibles en esta categoría por el momento.
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Insignias de Confianza en el Catálogo */}
        <div className="mt-16 pt-10 border-t border-rose-100">
          <TrustBadges />
        </div>
      </main>

      <Footer />
    </div>
  )
}
