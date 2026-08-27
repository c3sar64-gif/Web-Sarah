import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { getReceta, createReceta, updateReceta } from '../../api/recetas'
import type { RecetaInput } from '../../types/receta'
import { getYouTubeEmbedUrl } from '../../utils/youtube'
import {
  ChefHat,
  ArrowLeft,
  Image,
  Clock,
  Users,
  Video,
  Save,
  CheckCircle,
} from 'lucide-react'
import YouTubeIcon from '../../components/YouTubeIcon'

export default function AdminRecetaForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [formData, setFormData] = useState<RecetaInput>({
    titulo: '',
    descripcion: '',
    ingredientes: '',
    instrucciones: '',
    tiempoPreparacionMinutos: 45,
    porciones: 8,
    dificultad: 'Fácil',
    imagenUrl: '',
    videoUrl: '',
    youtubeUrl: '',
    publicada: true,
    destacada: false,
  })

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditing)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (isEditing && id) {
      setFetching(true)
      getReceta(Number(id))
        .then((r) => {
          setFormData({
            titulo: r.titulo,
            descripcion: r.descripcion ?? '',
            ingredientes: r.ingredientes,
            instrucciones: r.instrucciones,
            tiempoPreparacionMinutos: r.tiempoPreparacionMinutos ?? null,
            porciones: r.porciones ?? null,
            dificultad: r.dificultad || 'Fácil',
            imagenUrl: r.imagenUrl ?? '',
            videoUrl: r.videoUrl ?? '',
            youtubeUrl: r.youtubeUrl ?? '',
            publicada: r.publicada,
            destacada: r.destacada,
          })
        })
        .catch(() => setError('No se pudo cargar la información de la receta.'))
        .finally(() => setFetching(false))
    }
  }, [id, isEditing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.titulo.trim()) {
      setError('El título de la receta es obligatorio.')
      return
    }
    if (!formData.ingredientes.trim()) {
      setError('Debes incluir la lista de ingredientes.')
      return
    }
    if (!formData.instrucciones.trim()) {
      setError('Debes incluir las instrucciones de preparación.')
      return
    }

    setLoading(true)
    setError(null)

    const payload: RecetaInput = {
      titulo: formData.titulo.trim(),
      descripcion: formData.descripcion?.trim() || null,
      ingredientes: formData.ingredientes.trim(),
      instrucciones: formData.instrucciones.trim(),
      tiempoPreparacionMinutos: formData.tiempoPreparacionMinutos ? Number(formData.tiempoPreparacionMinutos) : null,
      porciones: formData.porciones ? Number(formData.porciones) : null,
      dificultad: formData.dificultad || 'Fácil',
      imagenUrl: formData.imagenUrl?.trim() || null,
      videoUrl: formData.videoUrl?.trim() || null,
      youtubeUrl: formData.youtubeUrl?.trim() || null,
      publicada: formData.publicada,
      destacada: formData.destacada,
    }

    try {
      if (isEditing && id) {
        await updateReceta(Number(id), payload)
      } else {
        await createReceta(payload)
      }
      setSuccess(true)
      setTimeout(() => {
        navigate('/admin/recetas')
      }, 1200)
    } catch (err: unknown) {
      let msg = 'Ocurrió un error al guardar la receta. Revisa los datos ingresados.'
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.data?.message) {
          msg = err.response.data.message
        } else if (err.response.data?.errors) {
          const errorsObj = err.response.data.errors as Record<string, string[]>
          msg = Object.values(errorsObj).flat().join(' • ')
        } else if (typeof err.response.data === 'string') {
          msg = err.response.data
        } else if (err.response.status === 401) {
          msg = 'Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.'
        }
      }
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const ytEmbed = getYouTubeEmbedUrl(formData.youtubeUrl)

  if (fetching) {
    return (
      <div className="text-center py-16">
        <ChefHat className="w-10 h-10 text-mauve animate-spin mx-auto mb-2" />
        <p className="text-xs text-gray-500">Cargando datos de la receta…</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/admin/recetas"
            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-mauve mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver a Recetas
          </Link>
          <h1 className="font-display font-bold text-2xl text-gray-900">
            {isEditing ? 'Editar Receta' : 'Crear Nueva Receta'}
          </h1>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          ¡Receta guardada exitosamente! Redirigiendo…
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-taupe/30 shadow-xs space-y-6">
        
        {/* Título */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Título de la Receta *
          </label>
          <input
            type="text"
            required
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            placeholder="Ej. Pie de Limón Artesanal"
            className="w-full px-4 py-2.5 rounded-xl border border-taupe/40 text-sm text-gray-900 focus:outline-none focus:border-mauve"
          />
        </div>

        {/* Descripción corta */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Descripción o Introducción
          </label>
          <textarea
            rows={2}
            value={formData.descripcion ?? ''}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            placeholder="Breve reseña sobre el sabor, textura o historia de este postre..."
            className="w-full px-4 py-2 rounded-xl border border-taupe/40 text-xs text-gray-900 focus:outline-none focus:border-mauve"
          />
        </div>

        {/* Tiempos, Porciones y Dificultad */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-mauve" /> Tiempo (min)
            </label>
            <input
              type="number"
              min="1"
              value={formData.tiempoPreparacionMinutos ?? ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tiempoPreparacionMinutos: e.target.value ? Number(e.target.value) : null,
                })
              }
              placeholder="Ej. 60"
              className="w-full px-3 py-2 rounded-xl border border-taupe/40 text-xs text-gray-900 focus:outline-none focus:border-mauve"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-mauve" /> Porciones
            </label>
            <input
              type="number"
              min="1"
              value={formData.porciones ?? ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  porciones: e.target.value ? Number(e.target.value) : null,
                })
              }
              placeholder="Ej. 8"
              className="w-full px-3 py-2 rounded-xl border border-taupe/40 text-xs text-gray-900 focus:outline-none focus:border-mauve"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Dificultad
            </label>
            <select
              value={formData.dificultad}
              onChange={(e) => setFormData({ ...formData, dificultad: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-taupe/40 text-xs text-gray-900 focus:outline-none focus:border-mauve bg-white"
            >
              <option value="Fácil">🟢 Fácil</option>
              <option value="Intermedio">🟡 Intermedio</option>
              <option value="Avanzado">🔴 Avanzado</option>
            </select>
          </div>
        </div>

        {/* Video de YouTube */}
        <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100 space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-red-900 flex items-center gap-1.5">
            <YouTubeIcon className="w-4 h-4 text-red-600" /> Enlace de Video de YouTube (Recomendado)
          </label>
          <input
            type="url"
            value={formData.youtubeUrl ?? ''}
            onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=... o https://youtu.be/..."
            className="w-full px-4 py-2 rounded-xl border border-red-200 text-xs text-gray-900 bg-white focus:outline-none focus:border-red-400"
          />
          <p className="text-[11px] text-gray-500">
            Pega el enlace de cualquier video o Short de YouTube y se mostrará automáticamente en la web con reproductor integrado.
          </p>

          {/* Preview de YouTube */}
          {ytEmbed && (
            <div className="mt-3 aspect-video w-full max-w-sm rounded-xl overflow-hidden shadow-xs border border-red-200">
              <iframe
                src={ytEmbed}
                title="Vista previa YouTube"
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>

        {/* Imagen de Portada y Video Directo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1">
              <Image className="w-3.5 h-3.5 text-mauve" /> URL de Imagen de Portada
            </label>
            <input
              type="url"
              value={formData.imagenUrl ?? ''}
              onChange={(e) => setFormData({ ...formData, imagenUrl: e.target.value })}
              placeholder="https://.../foto-torta.jpg"
              className="w-full px-3 py-2 rounded-xl border border-taupe/40 text-xs text-gray-900 focus:outline-none focus:border-mauve"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1">
              <Video className="w-3.5 h-3.5 text-mauve" /> Video Directo (Opcional MP4)
            </label>
            <input
              type="url"
              value={formData.videoUrl ?? ''}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              placeholder="https://.../video.mp4"
              className="w-full px-3 py-2 rounded-xl border border-taupe/40 text-xs text-gray-900 focus:outline-none focus:border-mauve"
            />
          </div>
        </div>

        {/* Ingredientes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 flex items-center justify-between">
            <span>Ingredientes * (Un ingrediente por línea)</span>
            <span className="text-[11px] font-normal text-gray-400">Presiona Enter para nuevo ingrediente</span>
          </label>
          <textarea
            rows={5}
            required
            value={formData.ingredientes}
            onChange={(e) => setFormData({ ...formData, ingredientes: e.target.value })}
            placeholder={"200g de harina 000\n100g de mantequilla fría\n1 lata de leche condensada\n4 limones sutil (jugo y ralladura)\n3 claras de huevo\n150g de azúcar"}
            className="w-full p-4 rounded-xl border border-taupe/40 text-xs font-mono text-gray-900 focus:outline-none focus:border-mauve"
          />
        </div>

        {/* Instrucciones */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 flex items-center justify-between">
            <span>Instrucciones de Preparación * (Un paso por línea)</span>
            <span className="text-[11px] font-normal text-gray-400">Presiona Enter para nuevo paso</span>
          </label>
          <textarea
            rows={6}
            required
            value={formData.instrucciones}
            onChange={(e) => setFormData({ ...formData, instrucciones: e.target.value })}
            placeholder={"Mezclar la harina con la mantequilla en cubos hasta obtener un arenado fino.\nForrar el molde de tarta y hornear a 180°C durante 15 minutos hasta dorar.\nBatir la leche condensada con el jugo de limón hasta espesar y volcar sobre la masa.\nPreparar un merengue suizo a baño maría y decorar con manga.\nDorar el merengue con soplete o gratinador del horno."}
            className="w-full p-4 rounded-xl border border-taupe/40 text-xs font-mono text-gray-900 focus:outline-none focus:border-mauve"
          />
        </div>

        {/* Opciones: Publicada y Destacada */}
        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-taupe/20">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
            <input
              type="checkbox"
              checked={formData.publicada}
              onChange={(e) => setFormData({ ...formData, publicada: e.target.checked })}
              className="w-4 h-4 text-mauve rounded border-gray-300 focus:ring-mauve"
            />
            <span>Publicar receta (visible para clientes)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
            <input
              type="checkbox"
              checked={formData.destacada}
              onChange={(e) => setFormData({ ...formData, destacada: e.target.checked })}
              className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-400"
            />
            <span>Marcar como Receta Destacada ⭐</span>
          </label>
        </div>

        {/* Botón Guardar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/recetas')}
            className="px-5 py-2.5 rounded-full border border-taupe/50 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-metallic hover:bg-rose-metallic-dark text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Guardando…' : isEditing ? 'Actualizar Receta' : 'Crear Receta'}
          </button>
        </div>
      </form>
    </div>
  )
}
