import { useState, useMemo, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useRecetas } from '../../hooks/useRecetas'
import { deleteReceta } from '../../api/recetas'
import type { Receta } from '../../types/receta'
import { getYouTubeThumbnailUrl } from '../../utils/youtube'
import {
  ChefHat,
  Plus,
  Search,
  Play,
  Clock,
  Eye,
  Edit,
  Trash2,
  Sparkles,
  CheckCircle,
  RefreshCw,
} from 'lucide-react'
import YouTubeIcon from '../../components/YouTubeIcon'

export default function AdminRecetas() {
  const location = useLocation()
  const navigate = useNavigate()
  const { recetas, loading, error, refetch } = useRecetas(true) // todas: true (modo admin)
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [flashMessage, setFlashMessage] = useState<string | null>(
    (location.state as { flashMessage?: string })?.flashMessage ?? null
  )

  useEffect(() => {
    if (flashMessage) {
      // Limpiar state del historial después de leer
      navigate(location.pathname, { replace: true, state: {} })
      const timer = setTimeout(() => setFlashMessage(null), 4500)
      return () => clearTimeout(timer)
    }
  }, [flashMessage, location.pathname, navigate])

  const filtered = useMemo(() => {
    return recetas.filter((r) =>
      r.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.descripcion && r.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [recetas, searchTerm])

  const handleDelete = async (receta: Receta) => {
    if (!window.confirm(`¿Estás seguro de eliminar la receta "${receta.titulo}"?`)) return
    setDeletingId(receta.id)
    setActionError(null)
    try {
      await deleteReceta(receta.id)
      setFlashMessage(`La receta "${receta.titulo}" fue eliminada.`)
      await refetch()
    } catch (err) {
      setActionError('No se pudo eliminar la receta. Inténtalo nuevamente.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 flex items-center gap-2">
            <ChefHat className="w-7 h-7 text-mauve" />
            Recetas y Videos de Preparación
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Administra los tutoriales, videos de YouTube e ingredientes que ven los clientes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={loading}
            className="p-2.5 rounded-full border border-taupe/40 text-gray-600 hover:bg-taupe/20 transition-colors"
            title="Recargar recetas"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/admin/recetas/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-rose-metallic hover:bg-rose-metallic-dark text-white text-xs font-bold transition-all shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            Nueva Receta
          </Link>
        </div>
      </div>

      {/* Mensaje Flash de Éxito */}
      {flashMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 flex items-center gap-2.5 shadow-xs animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-bold">{flashMessage}</span>
        </div>
      )}

      {/* Buscador */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar recetas por título..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-taupe/40 text-xs text-gray-900 focus:outline-none focus:border-mauve shadow-2xs"
        />
      </div>

      {/* Alertas */}
      {actionError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
          {actionError}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-12 bg-white rounded-2xl border border-taupe/20">
          <p className="text-xs text-gray-500">Cargando recetario…</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-taupe/20 p-6">
          <ChefHat className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-sm text-gray-800">No hay recetas registradas</h3>
          <p className="text-xs text-gray-500 mt-1 mb-4">
            Comienza subiendo tu primera receta con enlace de YouTube o video de preparación.
          </p>
          <Link
            to="/admin/recetas/nuevo"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-mauve text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4" /> Crear primera receta
          </Link>
        </div>
      )}

      {/* Tabla / Tarjetas de Recetas */}
      {!loading && filtered.length > 0 && (
        <div className="bg-white rounded-2xl border border-taupe/30 shadow-xs overflow-hidden">
          <div className="divide-y divide-taupe/20">
            {filtered.map((r) => {
              const ytThumb = getYouTubeThumbnailUrl(r.youtubeUrl)
              const img = r.imagenUrl || ytThumb

              return (
                <div
                  key={r.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-cream/40 transition-colors"
                >
                  {/* Foto e Info Principal */}
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-rose-50 shrink-0 border border-taupe/30">
                      {img ? (
                        <img src={img} alt={r.titulo} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-rose-300">
                          <ChefHat className="w-6 h-6" />
                        </div>
                      )}
                      {r.youtubeUrl && (
                        <div className="absolute bottom-1 right-1 bg-red-600 text-white p-0.5 rounded-sm">
                          <YouTubeIcon className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            r.publicada
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {r.publicada ? 'Publicada' : 'Borrador'}
                        </span>
                        {r.destacada && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            Destacada
                          </span>
                        )}
                        <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {r.dificultad}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-gray-900 truncate">{r.titulo}</h3>

                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        {r.tiempoPreparacionMinutos && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {r.tiempoPreparacionMinutos} min
                          </span>
                        )}
                        {r.youtubeUrl && (
                          <span className="flex items-center gap-1 text-red-600">
                            <Play className="w-3 h-3 fill-red-600" /> YouTube
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <Link
                      to={`/recetas/${r.id}`}
                      target="_blank"
                      className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                      title="Ver vista previa pública"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <Link
                      to={`/admin/recetas/${r.id}/editar`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mauve/10 hover:bg-mauve text-mauve hover:text-white text-xs font-semibold transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Editar
                    </Link>

                    <button
                      onClick={() => handleDelete(r)}
                      disabled={deletingId === r.id}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                      title="Eliminar receta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
