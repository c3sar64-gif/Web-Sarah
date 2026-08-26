import { Link } from 'react-router-dom'
import { Sparkles, MapPin, HeartHandshake, Star, ShoppingBag, ArrowRight } from 'lucide-react'

export default function BentoHome() {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-12 py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-rose-100/80 text-rose-800 border border-rose-200">
          <Sparkles className="w-3.5 h-3.5 text-rose-600" />
          Experiencia Sarah
        </span>
        <h2 className="font-display text-3xl md:text-4xl text-[#3D2C33] mt-3">
          Repostería que crea momentos inolvidables
        </h2>
        <p className="text-sm md:text-base text-[#6B5560] mt-2">
          Horneamos cada receta de manera artesanal y a pedido para garantizar máxima frescura y sabor.
        </p>
      </div>

      {/* Grid Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        
        {/* Tarjeta 1: Pasos para pedir (2 columnas en desktop) */}
        <div className="md:col-span-2 bg-gradient-to-br from-white to-rose-50/40 p-7 rounded-3xl border border-rose-100/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-600 bg-rose-100/60 px-2.5 py-1 rounded-lg">
                Fácil y Rápido
              </span>
              <ShoppingBag className="w-5 h-5 text-rose-400" />
            </div>
            <h3 className="font-display text-2xl text-[#3D2C33] mt-4">
              ¿Cómo ordenar tu postre favorito?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-3.5 rounded-2xl bg-white/90 border border-rose-100/60 shadow-xs">
                <span className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center mb-2">
                  1
                </span>
                <h4 className="font-semibold text-xs text-gray-900">Elige del Catálogo</h4>
                <p className="text-[11px] text-gray-500 mt-1">Pies, tortas, queques y galletas artesanales.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/90 border border-rose-100/60 shadow-xs">
                <span className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center mb-2">
                  2
                </span>
                <h4 className="font-semibold text-xs text-gray-900">Ubica tu Zona</h4>
                <p className="text-[11px] text-gray-500 mt-1">Mapa interactivo con cobertura en Cochabamba.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/90 border border-rose-100/60 shadow-xs">
                <span className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center mb-2">
                  3
                </span>
                <h4 className="font-semibold text-xs text-gray-900">Paga con QR BNB</h4>
                <p className="text-[11px] text-gray-500 mt-1">Válido desde cualquier banco en Bolivia.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-rose-100 flex items-center justify-between">
            <span className="text-xs text-gray-600 font-medium">
              ⏰ Recuerda pedir con 48h de anticipación
            </span>
            <Link
              to="/checkout"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 group"
            >
              Hacer Pedido
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Tarjeta 2: Cobertura Cochabamba */}
        <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-display text-xl text-[#3D2C33]">
              Cobertura en Cochabamba
            </h3>
            <p className="text-xs text-[#6B5560] mt-2 leading-relaxed">
              Llegamos hasta la puerta de tu hogar en horario de <strong>17:00 a 21:00</strong>.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-gray-700 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Cercado (Centro, Norte, Sur)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Tiquipaya & Sacaba
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Quillacollo & Colcapirhua
              </li>
            </ul>
          </div>
          <Link
            to="/contacto"
            className="mt-5 text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
          >
            Ver detalles de entrega
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Tarjeta 3: Calidad Artesanal */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-7 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center mb-4">
              <HeartHandshake className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-display text-xl text-white">
              100% Horneado con Amor
            </h3>
            <p className="text-xs text-amber-50 mt-2 leading-relaxed">
              Mantequilla real, frutas frescas y sin premezclas industriales. El auténtico sabor de casa en cada bocado.
            </p>
          </div>
          <div className="mt-5 flex items-center gap-1.5 text-xs text-amber-100 font-medium">
            <span>✨ Recetas familiares tradicionales</span>
          </div>
        </div>

        {/* Tarjeta 4: Testimonios de Clientes (col-span-full o 2 cols en lg) */}
        <div className="md:col-span-3 lg:col-span-4 bg-[#3D2C33] text-white p-8 rounded-3xl shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <h3 className="font-display text-2xl text-white mt-1">
                La repostería favorita de las familias cochabambinas
              </h3>
            </div>
            <a
              href="https://www.facebook.com/share/1MTK9zJWmr/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white border border-white/20"
            >
              Ver opiniones en Facebook
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs text-rose-100 italic leading-relaxed">
                "El pie de limón tiene el balance perfecto entre ácido y dulce. La masa crocante y fresca. ¡100% recomendado!"
              </p>
              <div className="mt-3 text-xs font-semibold text-amber-300">— Mariana V. (Tiquipaya)</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs text-rose-100 italic leading-relaxed">
                "Puntuales con la entrega de 17:00 a 21:00 y el queque tradicional esponjoso como el de la abuela. Volveré a pedir."
              </p>
              <div className="mt-3 text-xs font-semibold text-amber-300">— Roberto M. (Cercado Norte)</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs text-rose-100 italic leading-relaxed">
                "Hice el pedido por la página y pagué al instante con QR BNB. Todo súper seguro y transparente."
              </p>
              <div className="mt-3 text-xs font-semibold text-amber-300">— Andrea S. (Sacaba)</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
