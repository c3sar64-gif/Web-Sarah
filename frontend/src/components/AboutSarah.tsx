export default function AboutSarah() {
  return (
    <section id="sobre-mi" className="bg-[#F1EBE0] py-24">
      <div className="max-w-6xl mx-auto px-8 md:px-14 grid md:grid-cols-2 gap-14 items-center">
        <div className="w-full max-w-sm mx-auto aspect-[319/600] rounded-xl2 bg-white overflow-hidden">
          <img
            src="/sarah.jpg"
            alt="Sarah horneando"
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <span className="text-sm tracking-widest uppercase text-sage-dark font-semibold">
            Sobre mí
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-[#3D2C33] mt-3">Sobre Sarah</h2>
          <p className="text-[17px] text-[#6B5560] leading-relaxed mt-5 max-w-lg">
            Todo empezó en mi cocina, horneando para familia y amigos. Hoy sigo la misma receta de
            siempre: ingredientes de calidad, tiempo y mucho cariño en cada detalle. Cada pedido lo
            preparo pensando en la mesa donde va a llegar.
          </p>
          <p className="text-[17px] text-[#6B5560] leading-relaxed mt-4 max-w-lg">
            Soy Chef en Repostería y llevo 3 años dedicada de lleno a este oficio, especializándome
            en cuñapés, tortas y mucho más. Detrás de cada pedido no hay solo técnica, sino el amor
            de hacerlo con el corazón — esa es la razón por la que sigo horneando todos los días.
          </p>
          <p className="text-[17px] text-[#6B5560] leading-relaxed mt-4 max-w-lg">
            Sin conservantes, sin atajos — solo repostería artesanal hecha con las manos y el
            corazón.
          </p>
        </div>
      </div>
    </section>
  )
}
