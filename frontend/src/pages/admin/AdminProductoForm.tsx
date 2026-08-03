import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProduct, getCategorias, createProduct, updateProduct } from '../../api/products'
import { uploadImagen } from '../../api/uploads'
import type { Categoria, ProductInput } from '../../types/product'

const initialForm: ProductInput = {
  nombre: '',
  descripcion: '',
  precio: 0,
  imagenUrl: null,
  disponible: true,
  categoriaId: null,
}

export default function AdminProductoForm() {
  const { id } = useParams()
  const esEdicion = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState<ProductInput>(initialForm)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [subiendo, setSubiendo] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getCategorias().then(setCategorias)
  }, [])

  useEffect(() => {
    if (!id) return
    getProduct(Number(id)).then((p) =>
      setForm({
        nombre: p.nombre,
        descripcion: p.descripcion,
        precio: p.precio,
        imagenUrl: p.imagenUrl,
        disponible: p.disponible,
        categoriaId: p.categoriaId,
      }),
    )
  }, [id])

  const handleArchivo = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSubiendo(true)
    setError(null)
    try {
      const url = await uploadImagen(file)
      setForm((f) => ({ ...f, imagenUrl: url }))
    } catch {
      setError('No se pudo subir la imagen. Probá de nuevo.')
    } finally {
      setSubiendo(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setGuardando(true)
    setError(null)
    try {
      if (esEdicion) {
        await updateProduct(Number(id), form)
      } else {
        await createProduct(form)
      }
      navigate('/admin/productos')
    } catch {
      setError('No se pudo guardar el producto.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold text-mauve mb-6">
        {esEdicion ? 'Editar producto' : 'Nuevo producto'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl shadow-sm p-6">
        <div>
          <label className="block text-sm font-medium text-[#3D2C33] mb-1">Nombre</label>
          <input
            type="text"
            required
            value={form.nombre}
            onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
            className="w-full rounded-lg border border-taupe/50 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3D2C33] mb-1">Descripción</label>
          <textarea
            value={form.descripcion ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
            className="w-full rounded-lg border border-taupe/50 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3D2C33] mb-1">Precio</label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={form.precio}
            onChange={(e) => setForm((f) => ({ ...f, precio: Number(e.target.value) }))}
            className="w-full rounded-lg border border-taupe/50 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3D2C33] mb-1">Categoría</label>
          <select
            value={form.categoriaId ?? ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, categoriaId: e.target.value ? Number(e.target.value) : null }))
            }
            className="w-full rounded-lg border border-taupe/50 px-3 py-2"
          >
            <option value="">Sin categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="disponible"
            type="checkbox"
            checked={form.disponible}
            onChange={(e) => setForm((f) => ({ ...f, disponible: e.target.checked }))}
          />
          <label htmlFor="disponible" className="text-sm text-[#3D2C33]">
            Disponible
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3D2C33] mb-1">Foto</label>
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleArchivo} />
          {subiendo && <p className="text-sm text-taupe mt-1">Subiendo…</p>}
          {form.imagenUrl && (
            <img
              src={form.imagenUrl}
              alt="Vista previa"
              className="w-24 h-24 object-cover rounded-lg mt-2"
            />
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={guardando || subiendo}
          className="rounded-full bg-rose-metallic hover:bg-rose-metallic-dark text-white font-medium px-6 py-2.5 transition-colors disabled:opacity-60"
        >
          {guardando ? 'Guardando…' : 'Guardar'}
        </button>
      </form>
    </div>
  )
}
