import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-12 px-8 md:px-14 pt-40 md:pt-48 pb-20">
      <div>
        <span className="inline-block rounded-full bg-sage/20 text-sage-dark text-xs font-semibold tracking-wide uppercase px-4 py-1.5">
          Horneado con amor
        </span>

        <h1 className="font-display text-4xl md:text-6xl leading-tight text-[#3D2C33] mt-5 max-w-lg">
          Endulzando tus momentos especiales
        </h1>

        <p className="text-lg text-[#6B5560] leading-relaxed mt-5 max-w-md">
          Cada pastel, galleta y postre se hornea a mano con ingredientes frescos, para que tus
          celebraciones sepan a cariño.
        </p>

        <div className="flex flex-wrap gap-4 mt-9">
          <Link
            to="/especialidades"
            className="rounded-full bg-rose-metallic hover:bg-rose-metallic-dark text-white font-medium px-7 py-3.5 transition-all hover:-translate-y-0.5"
          >
            Ver menú
          </Link>
          <Link
            to="/contacto"
            className="rounded-full border border-taupe hover:bg-[#F1EBE0] text-[#3D2C33] font-medium px-7 py-3.5 transition-colors"
          >
            Haz tu pedido
          </Link>
        </div>
      </div>

      <div className="w-full h-[340px] md:h-[420px] rounded-xl2 bg-[#F1EBE0] overflow-hidden">
        <img
          src="/pastel-hero.png"
          alt="Pastel insignia de Sarah — Horneado con Amor"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  )
}
