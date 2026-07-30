import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'

export default function Home() {
  const { products, loading, error } = useProducts()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="bg-gradient-to-b from-red-50 to-white px-4 py-16 text-center">
          <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
            Bienvenida a tu tienda
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-neutral-600">
            Este es el punto de partida del sitio. Cuando compartas el diseño final,
            se reemplaza este contenido por el layout definitivo.
          </p>
        </section>

        <section id="productos" className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="mb-6 text-2xl font-semibold text-neutral-900">Productos</h2>

          {loading && <p className="text-neutral-500">Cargando productos…</p>}

          {error && (
            <p className="text-sm text-neutral-500">
              No se pudo conectar al backend todavía ({error}). Los productos
              aparecerán aquí una vez que la API esté corriendo.
            </p>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="text-neutral-500">
              Todavía no hay productos cargados. Agrégalos desde el panel de
              administración de Django.
            </p>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section id="nosotros" className="bg-neutral-50 px-4 py-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold text-neutral-900">Nosotros</h2>
            <p className="mt-3 text-neutral-600">
              Contenido pendiente — reemplazar con la historia de la marca.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
