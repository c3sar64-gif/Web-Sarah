import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'

export default function Home() {
  const { products, loading, error } = useProducts()
  const destacados = products.slice(0, 4)

  return (
    <div className="font-body bg-cream text-[#3D2C33] min-h-screen overflow-x-hidden">
      <Navbar />

      <main>
        <Hero />

        <section className="max-w-6xl mx-auto px-8 md:px-14 py-24">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-sm tracking-widest uppercase text-sage-dark font-semibold">
              Lo más pedido
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-[#3D2C33] mt-3">
              Un vistazo a nuestras especialidades
            </h2>
          </div>

          {loading && <p className="text-center text-[#6B5560]">Cargando productos…</p>}

          {error && (
            <p className="text-center text-sm text-[#6B5560]">
              No se pudo conectar al backend todavía ({error}). Los productos aparecerán aquí una
              vez que la API esté corriendo.
            </p>
          )}

          {!loading && !error && destacados.length === 0 && (
            <p className="text-center text-[#6B5560]">
              Todavía no hay productos cargados. Agrégalos desde la API o directo en la base de
              Supabase.
            </p>
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
              className="inline-block rounded-full bg-rose-metallic hover:bg-rose-metallic-dark text-white font-medium px-7 py-3.5 transition-all hover:-translate-y-0.5"
            >
              Ver todo el menú
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
