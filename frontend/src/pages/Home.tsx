import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import TrustBadges from '../components/TrustBadges'
import BentoHome from '../components/BentoHome'
import { useProducts } from '../hooks/useProducts'
import { Sparkles, ArrowRight } from 'lucide-react'

export default function Home() {
  const { products, loading, error } = useProducts()
  const destacados = products.slice(0, 4)

  return (
    <div className="font-body bg-cream text-[#3D2C33] min-h-screen overflow-x-hidden">
      <Navbar />

      <main>
        {/* Hero Section */}
        <Hero />

        {/* Insignias de Confianza y Seguridad */}
        <TrustBadges />

        {/* Productos Destacados */}
        <section className="max-w-6xl mx-auto px-6 md:px-12 py-16">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-rose-100/70 text-rose-800 border border-rose-200/60">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              Lo más pedido en Cochabamba
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-[#3D2C33] mt-3">
              Nuestras Especialidades
            </h2>
            <p className="text-sm text-[#6B5560] mt-2">
              Elaboradas artesanalmente con ingredientes seleccionados de primera calidad.
            </p>
          </div>

          {/* Estado de carga elegante con Skeletons */}
          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {error && (
            <div className="text-center p-8 rounded-2xl bg-rose-50 border border-rose-100 max-w-lg mx-auto">
              <p className="text-xs text-rose-800">
                Conectando con el catálogo en vivo ({error}). Los productos se sincronizan automáticamente con la API.
              </p>
            </div>
          )}

          {!loading && !error && destacados.length === 0 && (
            <div className="text-center p-8 rounded-2xl bg-white border border-gray-100 max-w-lg mx-auto shadow-sm">
              <p className="text-xs text-gray-600">
                Estamos horneando novedades. Visita nuestro menú completo para descubrir todas las delicias disponibles.
              </p>
            </div>
          )}

          {destacados.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destacados.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/especialidades"
              className="inline-flex items-center gap-2 rounded-full bg-rose-metallic hover:bg-rose-metallic-dark text-white font-semibold text-sm px-8 py-4 transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg"
            >
              Ver todo el menú
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Bento Grid con Pasos, Cobertura y Testimonios */}
        <BentoHome />
      </main>

      <Footer />
    </div>
  )
}
