import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { getProducts, deleteProduct } from '../../api/products'
import type { Product } from '../../types/product'

export default function AdminProductos() {
  const [productos, setProductos] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargar = () => {
    setLoading(true)
    getProducts()
      .then(setProductos)
      .catch((err) => {
        const message = axios.isAxiosError(err) ? err.response?.data?.message : undefined
        setError(message ?? 'No se pudieron cargar los productos.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    cargar()
  }, [])

  const handleEliminar = async (producto: Product) => {
    if (!confirm(`¿Seguro que querés eliminar "${producto.nombre}"?`)) return
    try {
      await deleteProduct(producto.id)
      cargar()
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : undefined
      setError(message ?? 'No se pudo eliminar el producto.')
    }
  }

  if (loading) return <p>Cargando productos…</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-mauve">Productos</h1>
        <Link
          to="/admin/productos/nuevo"
          className="rounded-full bg-rose-metallic hover:bg-rose-metallic-dark text-white text-sm font-medium px-4 py-2 transition-colors"
        >
          + Nuevo producto
        </Link>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {/* Vista Móvil (Tarjetas) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {productos.map((p) => (
          <div key={p.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {p.imagenUrl ? (
                <img
                  src={p.imagenUrl}
                  alt={p.nombre}
                  className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 bg-taupe/20 rounded-lg flex-shrink-0 flex items-center justify-center text-xs text-[#6B5560]">
                  Sin foto
                </div>
              )}
              <div className="min-w-0">
                <p className="font-medium text-sm text-[#3D2C33] truncate">{p.nombre}</p>
                <p className="text-xs text-[#6B5560]">{p.categoria?.nombre ?? 'Sin categoría'}</p>
                <p className="text-xs font-semibold text-mauve-dark mt-0.5">
                  Bs {p.precio.toFixed(2)} • {p.disponible ? 'Disponible' : 'No disponible'}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-right">
              <Link to={`/admin/productos/${p.id}/editar`} className="text-xs font-medium text-mauve hover:underline">
                Editar
              </Link>
              <button onClick={() => handleEliminar(p)} className="text-xs font-medium text-red-600 hover:underline">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Vista Escritorio (Tabla) */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-[#3D2C33]">
            <tr>
              <th className="p-3">Foto</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">Precio (Bs)</th>
              <th className="p-3">Disponible</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id} className="border-t border-taupe/20">
                <td className="p-3">
                  {p.imagenUrl && (
                    <img
                      src={p.imagenUrl}
                      alt={p.nombre}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                </td>
                <td className="p-3">{p.nombre}</td>
                <td className="p-3">{p.categoria?.nombre ?? '—'}</td>
                <td className="p-3">Bs {p.precio.toFixed(2)}</td>
                <td className="p-3">{p.disponible ? 'Sí' : 'No'}</td>
                <td className="p-3 text-right space-x-3">
                  <Link to={`/admin/productos/${p.id}/editar`} className="text-mauve hover:underline">
                    Editar
                  </Link>
                  <button onClick={() => handleEliminar(p)} className="text-red-600 hover:underline">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
