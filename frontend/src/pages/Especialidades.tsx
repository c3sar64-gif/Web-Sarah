import { useMemo, useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import { useCategorias } from '../hooks/useCategorias'

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

      <main className="max-w-6xl mx-auto px-8 md:px-14 pt-40 md:pt-48 pb-24">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-sm tracking-widest uppercase text-sage-dark font-semibold">
            Nuestro menú
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-[#3D2C33] mt-3">
            Nuestras Especialidades
          </h1>
          <p className="text-[#6B5560] mt-3">
            Cuatro maneras de endulzar tu mesa, todas horneadas frescas cada día.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            type="button"
            onClick={() => setActiveTab(TODAS)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              activeTab === TODAS
                ? 'bg-rose-metallic text-white'
                : 'bg-white text-[#3D2C33] border border-taupe hover:bg-[#F1EBE0]'
            }`}
          >
            Todas
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTab(String(cat.id))}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                activeTab === String(cat.id)
                  ? 'bg-rose-metallic text-white'
                  : 'bg-white text-[#3D2C33] border border-taupe hover:bg-[#F1EBE0]'
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>

        {loading && <p className="text-center text-[#6B5560]">Cargando productos…</p>}

        {errorProducts && (
          <p className="text-center text-sm text-[#6B5560]">
            No se pudo conectar al backend todavía ({errorProducts}). Los productos aparecerán
            aquí una vez que la API esté corriendo.
          </p>
        )}

        {!loading && !errorProducts && filtered.length === 0 && (
          <p className="text-center text-[#6B5560]">
            No hay productos en esta categoría todavía.
          </p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
