import { Link } from 'react-router-dom'
import { Clock, Users, Play, ChefHat } from 'lucide-react'
import type { Receta } from '../types/receta'
import { getYouTubeThumbnailUrl } from '../utils/youtube'
import YouTubeIcon from './YouTubeIcon'

interface RecetaCardProps {
  receta: Receta
}

export default function RecetaCard({ receta }: RecetaCardProps) {
  const ytThumb = getYouTubeThumbnailUrl(receta.youtubeUrl)
  const image = receta.imagenUrl || ytThumb

  const difficultyColor = {
    Fácil: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Intermedio: 'bg-amber-50 text-amber-700 border-amber-200',
    Avanzado: 'bg-rose-50 text-rose-700 border-rose-200',
  }[receta.dificultad] || 'bg-gray-50 text-gray-700 border-gray-200'

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl border border-rose-100/70 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
      <div>
        {/* Imagen / Miniatura con Badge */}
        <div className="relative aspect-video w-full overflow-hidden bg-rose-50/50">
          {image ? (
            <img
              src={image}
              alt={receta.titulo}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-rose-300">
              <ChefHat className="w-12 h-12 stroke-[1.5]" />
              <span className="text-xs mt-2 font-medium">Receta Sarah</span>
            </div>
          )}

          {/* Badge de YouTube / Video */}
          {receta.youtubeUrl && (
            <div className="absolute top-3 right-3 bg-red-600/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
              <YouTubeIcon className="w-3.5 h-3.5" />
              <span>Video</span>
            </div>
          )}

          {receta.videoUrl && !receta.youtubeUrl && (
            <div className="absolute top-3 right-3 bg-rose-600/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Video</span>
            </div>
          )}

          {/* Badge de Dificultad */}
          <div className="absolute bottom-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-xs shadow-2xs ${difficultyColor}`}>
              {receta.dificultad}
            </span>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-5">
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2.5">
            {receta.tiempoPreparacionMinutos && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                {receta.tiempoPreparacionMinutos} min
              </span>
            )}
            {receta.porciones && (
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-rose-500" />
                {receta.porciones} porciones
              </span>
            )}
          </div>

          <h3 className="font-display font-bold text-lg text-[#3D2C33] group-hover:text-rose-600 transition-colors line-clamp-1">
            {receta.titulo}
          </h3>

          {receta.descripcion && (
            <p className="text-xs text-[#6B5560] mt-2 line-clamp-2 leading-relaxed">
              {receta.descripcion}
            </p>
          )}
        </div>
      </div>

      {/* Footer Card */}
      <div className="p-5 pt-0">
        <Link
          to={`/recetas/${receta.id}`}
          className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-500 text-rose-700 hover:text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 group/btn"
        >
          <span>Ver Receta y Preparación</span>
          <span className="transition-transform group-hover/btn:translate-x-1">→</span>
        </Link>
      </div>
    </div>
  )
}
