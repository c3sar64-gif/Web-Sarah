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

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-[#3D2C33]">
            <tr>
              <th className="p-3">Foto</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">Precio</th>
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
                <td className="p-3">${p.precio.toFixed(2)}</td>
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
