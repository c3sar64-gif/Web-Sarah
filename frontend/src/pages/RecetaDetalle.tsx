import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { getReceta } from '../api/recetas'
import type { Receta } from '../types/receta'
import { getYouTubeEmbedUrl } from '../utils/youtube'
import {
  Clock,
  Users,
  ChefHat,
  ArrowLeft,
  CheckCircle2,
  Share2,
  ShoppingBag,
  Play,
  Sparkles,
} from 'lucide-react'
import YouTubeIcon from '../components/YouTubeIcon'

export default function RecetaDetalle() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [receta, setReceta] = useState<Receta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ingredientesMarcados, setIngredientesMarcados] = useState<Record<number, boolean>>({})

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getReceta(Number(id))
      .then(setReceta)
      .catch(() => setError('No se pudo cargar la receta solicitada.'))
      .finally(() => setLoading(false))
  }, [id])

  const toggleIngrediente = (index: number) => {
    setIngredientesMarcados((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const handleShareWhatsApp = () => {
    if (!receta) return
    const text = `¡Mira esta receta de ${receta.titulo} de Sarah — Horneado con Amor! 🧁\n${window.location.href}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream font-body">
        <Navbar />
        <main className="max-w-4xl mx-auto px-6 pt-40 pb-20 text-center">
          <ChefHat className="w-12 h-12 text-rose-400 animate-bounce mx-auto mb-4" />
          <p className="text-sm text-gray-600">Cargando receta deliciosa…</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !receta) {
    return (
      <div className="min-h-screen bg-cream font-body">
        <Navbar />
        <main className="max-w-xl mx-auto px-6 pt-40 pb-20 text-center">
          <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-sm">
            <h2 className="font-display text-2xl text-gray-900 font-bold mb-2">Receta no encontrada</h2>
            <p className="text-xs text-gray-600 mb-6">{error || 'La receta solicitada no existe o no está publicada.'}</p>
            <button
              onClick={() => navigate('/recetas')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-metallic text-white text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" /> Volver al Recetario
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const embedUrl = getYouTubeEmbedUrl(receta.youtubeUrl)
  const ingredientesList = receta.ingredientes
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  const instruccionesList = receta.instrucciones
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  return (
    <div className="font-body bg-cream text-[#3D2C33] min-h-screen overflow-x-hidden">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 md:px-10 pt-36 md:pt-44 pb-20">
        {/* Botón Volver */}
        <Link
          to="/recetas"
          className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-700 mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Volver a todas las recetas
        </Link>

        {/* Encabezado */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
              {receta.dificultad}
            </span>
            {receta.destacada && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Destacada
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl md:text-5xl text-[#3D2C33] leading-tight font-bold">
            {receta.titulo}
          </h1>

          {receta.descripcion && (
            <p className="text-sm md:text-base text-[#6B5560] mt-3 leading-relaxed">
              {receta.descripcion}
            </p>
          )}

          {/* Badges de Tiempos y Porciones */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 p-4 rounded-2xl bg-white border border-rose-100/70 shadow-xs">
            {receta.tiempoPreparacionMinutos && (
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Tiempo</div>
                  <div className="text-xs font-bold text-gray-800">{receta.tiempoPreparacionMinutos} minutos</div>
                </div>
              </div>
            )}

            {receta.porciones && (
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Porciones</div>
                  <div className="text-xs font-bold text-gray-800">{receta.porciones} personas</div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Nivel</div>
                <div className="text-xs font-bold text-gray-800">{receta.dificultad}</div>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Compartir por WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                Compartir
              </button>
            </div>
          </div>
        </div>

        {/* Reproductor de Video / Imagen Principal */}
        <div className="mb-10 rounded-3xl overflow-hidden shadow-md border border-rose-100/70 bg-black">
          {embedUrl ? (
            <div className="relative aspect-video w-full">
              <iframe
                src={embedUrl}
                title={receta.titulo}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          ) : receta.videoUrl ? (
            <div className="relative aspect-video w-full bg-black">
              <video
                src={receta.videoUrl}
                controls
                className="w-full h-full object-contain"
                poster={receta.imagenUrl || undefined}
              >
                Tu navegador no soporta reproducción de video.
              </video>
            </div>
          ) : receta.imagenUrl ? (
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={receta.imagenUrl}
                alt={receta.titulo}
                className="w-full h-full object-cover"
              />
            </div>
          ) : null}
        </div>

        {/* Botón directo a YouTube si existe URL */}
        {receta.youtubeUrl && (
          <div className="mb-10 p-4 rounded-2xl bg-red-50 border border-red-200/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-600 text-white">
                <YouTubeIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-gray-900">¿Prefieres verlo directamente en YouTube?</h4>
                <p className="text-[11px] text-gray-600">Abre el video completo con comentarios y tutorial en alta definición.</p>
              </div>
            </div>
            <a
              href={receta.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              Ver en YouTube
            </a>
          </div>
        )}

        {/* Contenido: Ingredientes y Pasos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna 1: Ingredientes (1/3) */}
          <div className="md:col-span-1">
            <div className="sticky top-28 bg-white p-6 rounded-3xl border border-rose-100 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-rose-100">
                <ChefHat className="w-5 h-5 text-rose-500" />
                <h2 className="font-display font-bold text-lg text-gray-900">Ingredientes</h2>
              </div>
              {ingredientesList.length > 0 ? (
                <>
                  <p className="text-[11px] text-gray-500 mb-4">
                    Marca los ingredientes a medida que los tengas listos:
                  </p>
                  <ul className="space-y-2.5">
                    {ingredientesList.map((ing, idx) => {
                      const marcado = !!ingredientesMarcados[idx]
                      return (
                        <li
                          key={idx}
                          onClick={() => toggleIngrediente(idx)}
                          className={`flex items-start gap-2.5 p-2 rounded-xl cursor-pointer text-xs transition-all ${
                            marcado
                              ? 'bg-emerald-50/60 text-gray-400 line-through'
                              : 'hover:bg-rose-50/50 text-gray-800'
                          }`}
                        >
                          <CheckCircle2
                            className={`w-4 h-4 mt-0.5 shrink-0 transition-colors ${
                              marcado ? 'text-emerald-500' : 'text-gray-300'
                            }`}
                          />
                          <span className="leading-snug">{ing}</span>
                        </li>
                      )
                    })}
                  </ul>
                </>
              ) : (
                <p className="text-xs text-gray-500 italic">
                  Ingredientes y cantidades detallados en el video tutorial de YouTube.
                </p>
              )}
            </div>
          </div>

          {/* Columna 2: Pasos de Preparación (2/3) */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-xs">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-rose-100">
                <Sparkles className="w-5 h-5 text-rose-500" />
                <h2 className="font-display font-bold text-xl text-gray-900">Preparación Paso a Paso</h2>
              </div>

              {instruccionesList.length > 0 ? (
                <div className="space-y-6">
                  {instruccionesList.map((paso, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                        {idx + 1}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                          {paso}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Mira el video superior para ver el paso a paso detallado de la preparación de este postre.
                </p>
              )}
            </div>

            {/* CTA para pedir el producto horneado */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-50 to-white border border-rose-200/70 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-base text-gray-900">
                  ¿Se te antoja pero no tienes tiempo para cocinar?
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Nosotros horneamos este postre fresco para ti en Cochabamba.
                </p>
              </div>
              <Link
                to="/especialidades"
                className="px-5 py-2.5 rounded-full bg-rose-metallic hover:bg-rose-metallic-dark text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-xs shrink-0"
              >
                <ShoppingBag className="w-4 h-4" />
                Pedir en Tienda
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
