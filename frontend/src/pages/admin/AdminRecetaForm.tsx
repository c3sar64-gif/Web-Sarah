import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { getReceta, createReceta, updateReceta } from '../../api/recetas'
import type { RecetaInput } from '../../types/receta'
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '../../utils/youtube'
import {
  ArrowLeft,
  Image,
  Clock,
  Users,
  Video,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
} from 'lucide-react'
import YouTubeIcon from '../../components/YouTubeIcon'

export default function AdminRecetaForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const topRef = useRef<HTMLDivElement>(null)

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
  const [success, setSuccess] = useState<string | null>(null)

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
    setError(null)
    setSuccess(null)

    if (!formData.titulo.trim()) {
      setError('El título de la receta es obligatorio.')
      topRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    if (!formData.ingredientes.trim()) {
      setError('Debes incluir la lista de ingredientes.')
      topRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    if (!formData.instrucciones.trim()) {
      setError('Debes incluir las instrucciones de preparación.')
      topRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    setLoading(true)

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
        setSuccess('¡Receta actualizada con éxito!')
      } else {
        await createReceta(payload)
        setSuccess('¡Receta creada con éxito!')
      }

      // Redirigir al listado con mensaje de confirmación
      setTimeout(() => {
        navigate('/admin/recetas', {
          state: {
            flashMessage: isEditing
              ? `¡La receta "${payload.titulo}" fue actualizada correctamente!`
              : `¡La receta "${payload.titulo}" fue creada correctamente!`,
          },
        })
      }, 1000)
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
      topRef.current?.scrollIntoView({ behavior: 'smooth' })
    } finally {
      setLoading(false)
    }
  }

  const ytEmbed = getYouTubeEmbedUrl(formData.youtubeUrl)
  const ytThumb = getYouTubeThumbnailUrl(formData.youtubeUrl)

  if (fetching) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-taupe/20 max-w-xl mx-auto my-10 shadow-sm">
        <Loader2 className="w-10 h-10 text-mauve animate-spin mx-auto mb-3" />
        <p className="text-sm font-medium text-gray-700">Cargando datos de la receta…</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6" ref={topRef}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/admin/recetas"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-mauve mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver al listado de recetas
          </Link>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-gray-900">
            {isEditing ? 'Editar Receta' : 'Crear Nueva Receta'}
          </h1>
        </div>
      </div>

      {/* Alerta Superior de Error */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 flex items-start gap-2.5 shadow-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}

      {/* Alerta Superior de Éxito */}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 flex items-center gap-2.5 shadow-xs animate-fadeIn">
          <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
          <span className="font-bold">{success} Redirigiendo al panel…</span>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} noValidate className="bg-white p-6 sm:p-8 rounded-3xl border border-taupe/30 shadow-xs space-y-6">
        
        {/* Título */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Título de la Receta *
          </label>
          <input
            type="text"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            placeholder="Ej. Pie de Limón Artesanal"
            className="w-full px-4 py-2.5 rounded-xl border border-taupe/40 text-sm text-gray-900 focus:outline-none focus:border-mauve shadow-2xs"
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
            className="w-full px-4 py-2.5 rounded-xl border border-taupe/40 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-mauve shadow-2xs"
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
              className="w-full px-3 py-2 rounded-xl border border-taupe/40 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-mauve"
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
              className="w-full px-3 py-2 rounded-xl border border-taupe/40 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-mauve"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Dificultad
            </label>
            <select
              value={formData.dificultad}
              onChange={(e) => setFormData({ ...formData, dificultad: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-taupe/40 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-mauve bg-white font-medium"
            >
              <option value="Fácil">🟢 Fácil</option>
              <option value="Intermedio">🟡 Intermedio</option>
              <option value="Avanzado">🔴 Avanzado</option>
            </select>
          </div>
        </div>

        {/* Video de YouTube */}
        <div className="p-4 sm:p-5 rounded-2xl bg-red-50/60 border border-red-200 space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-red-900 flex items-center gap-1.5">
            <YouTubeIcon className="w-4 h-4 text-red-600" /> Enlace de Video de YouTube (Recomendado)
          </label>
          <input
            type="text"
            value={formData.youtubeUrl ?? ''}
            onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=... o https://youtu.be/..."
            className="w-full px-4 py-2.5 rounded-xl border border-red-200 text-xs sm:text-sm text-gray-900 bg-white focus:outline-none focus:border-red-500 shadow-2xs"
          />
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Puedes pegar cualquier enlace de YouTube o YouTube Short. Se reproducirá directamente en la página del cliente.
          </p>

          {/* Preview en vivo de YouTube */}
          {ytEmbed && (
            <div className="mt-3 aspect-video w-full max-w-md rounded-2xl overflow-hidden shadow-md border border-red-200 bg-black">
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1">
                <Image className="w-3.5 h-3.5 text-mauve" /> URL de Imagen de Portada
              </label>
              {formData.imagenUrl && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, imagenUrl: '' })}
                  className="text-[11px] text-red-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Usar miniatura de YouTube
                </button>
              )}
            </div>
            <input
              type="text"
              value={formData.imagenUrl ?? ''}
              onChange={(e) => setFormData({ ...formData, imagenUrl: e.target.value })}
              placeholder={ytThumb ? 'Opcional (si se deja vacío se usará la de YouTube)' : 'https://.../foto-torta.jpg'}
              className="w-full px-3 py-2 rounded-xl border border-taupe/40 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-mauve"
            />
            {formData.imagenUrl ? (
              <p className="text-[10px] text-gray-500">
                Mostrando imagen personalizada. Puedes borrarla si quieres usar la miniatura de YouTube.
              </p>
            ) : ytThumb ? (
              <p className="text-[10px] text-emerald-600 font-medium">
                ✓ Se usará automáticamente la miniatura del video de YouTube.
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1">
              <Video className="w-3.5 h-3.5 text-mauve" /> Video Directo (Opcional MP4)
            </label>
            <input
              type="text"
              value={formData.videoUrl ?? ''}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              placeholder="https://.../video.mp4"
              className="w-full px-3 py-2 rounded-xl border border-taupe/40 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-mauve"
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
            value={formData.ingredientes}
            onChange={(e) => setFormData({ ...formData, ingredientes: e.target.value })}
            placeholder={"200g de harina 000\n100g de mantequilla fría\n1 lata de leche condensada\n4 limones sutil (jugo y ralladura)\n3 claras de huevo\n150g de azúcar"}
            className="w-full p-4 rounded-xl border border-taupe/40 text-xs sm:text-sm font-mono text-gray-900 focus:outline-none focus:border-mauve shadow-2xs"
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
            value={formData.instrucciones}
            onChange={(e) => setFormData({ ...formData, instrucciones: e.target.value })}
            placeholder={"Mezclar la harina con la mantequilla en cubos hasta obtener un arenado fino.\nForrar el molde de tarta y hornear a 180°C durante 15 minutos hasta dorar.\nBatir la leche condensada con el jugo de limón hasta espesar y volcar sobre la masa.\nPreparar un merengue suizo a baño maría y decorar con manga.\nDorar el merengue con soplete o gratinador del horno."}
            className="w-full p-4 rounded-xl border border-taupe/40 text-xs sm:text-sm font-mono text-gray-900 focus:outline-none focus:border-mauve shadow-2xs"
          />
        </div>

        {/* Opciones: Publicada y Destacada */}
        <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-taupe/20">
          <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-semibold text-gray-800">
            <input
              type="checkbox"
              checked={formData.publicada}
              onChange={(e) => setFormData({ ...formData, publicada: e.target.checked })}
              className="w-4 h-4 text-mauve rounded border-gray-300 focus:ring-mauve"
            />
            <span>Publicar receta (visible para clientes)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-semibold text-gray-800">
            <input
              type="checkbox"
              checked={formData.destacada}
              onChange={(e) => setFormData({ ...formData, destacada: e.target.checked })}
              className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-400"
            />
            <span>Marcar como Receta Destacada ⭐</span>
          </label>
        </div>

        {/* Mensaje de feedback inferior junto al botón */}
        {(error || success) && (
          <div className="pt-2">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 flex items-center gap-2 font-bold animate-fadeIn">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{success} Redirigiendo…</span>
              </div>
            )}
          </div>
        )}

        {/* Botones de Acción */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-taupe/20">
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
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-rose-metallic hover:bg-rose-metallic-dark text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Guardando cambios…</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Actualizar Receta' : 'Crear Receta'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
