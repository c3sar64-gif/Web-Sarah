import { useState, type FormEvent } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import SocialCards from '../components/SocialCards'
import { postContacto } from '../api/contacto'
import type { ContactoPayload } from '../types/contacto'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function Contacto() {
  const [form, setForm] = useState<ContactoPayload>({ nombre: '', email: '', mensaje: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg(null)
    try {
      await postContacto(form)
      setStatus('sent')
      setForm({ nombre: '', email: '', mensaje: '' })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'No se pudo enviar el mensaje')
    }
  }

  return (
    <div className="font-body bg-cream text-[#3D2C33] min-h-screen overflow-x-hidden">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 sm:px-8 md:px-14 pt-36 md:pt-44 pb-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm tracking-widest uppercase text-sage-dark font-semibold">
            Contacto & Redes Sociales
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-[#3D2C33] mt-3">
            Hablemos de tu pedido
          </h1>
          <p className="text-[#6B5560] mt-3">
            Escríbenos directamente o visítanos en nuestras redes sociales para estar en contacto y ver nuestras últimas creaciones.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Formulario de Contacto */}
          <div className="lg:col-span-6 bg-white rounded-xl2 shadow-card p-6 sm:p-8">
            <h2 className="font-display text-xl text-[#3D2C33] mb-2">Envíanos un mensaje</h2>
            <p className="text-xs text-[#6B5560] mb-6">
              Déjanos tus datos y te responderemos a la brevedad posible.
            </p>

            {status === 'sent' ? (
              <div className="text-center py-8">
                <p className="font-display text-xl text-mauve-dark">¡Mensaje enviado!</p>
                <p className="text-sm text-[#6B5560] mt-2">
                  Gracias por escribirnos, te responderemos muy pronto.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-6 rounded-full border border-taupe hover:bg-[#F1EBE0] text-[#3D2C33] text-sm font-medium px-6 py-2.5 transition-colors"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D2C33] mb-1">
                    Tu nombre
                  </label>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Ej. María García"
                    className="w-full rounded-xl border border-taupe bg-cream/40 placeholder-[#A99C8E] text-[#3D2C33] text-sm px-4 py-3 outline-none focus:border-mauve transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D2C33] mb-1">
                    Tu correo electrónico
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="Ej. maria@gmail.com"
                    className="w-full rounded-xl border border-taupe bg-cream/40 placeholder-[#A99C8E] text-[#3D2C33] text-sm px-4 py-3 outline-none focus:border-mauve transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D2C33] mb-1">
                    Mensaje / Detalle de tu pedido
                  </label>
                  <textarea
                    name="mensaje"
                    value={form.mensaje}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Cuéntanos la fecha de tu evento, cantidad de personas o tipo de pastel..."
                    className="w-full rounded-xl border border-taupe bg-cream/40 placeholder-[#A99C8E] text-[#3D2C33] text-sm px-4 py-3 outline-none focus:border-mauve resize-none transition-colors"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-sm text-[#B5564A]">
                    {errorMsg ?? 'No se pudo enviar el mensaje. Intenta de nuevo en un momento.'}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full rounded-full bg-rose-metallic hover:bg-rose-metallic-dark disabled:opacity-60 text-white text-sm font-medium px-6 py-3.5 transition-colors shadow-sm mt-2"
                >
                  {status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
                </button>
              </form>
            )}
          </div>

          {/* Sección de Redes Sociales */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-sage-dark">
                Conéctate con nosotros
              </span>
              <h2 className="font-display text-2xl text-[#3D2C33] mt-1">
                Síguenos en Redes Sociales
              </h2>
              <p className="text-xs text-[#6B5560] mt-2 leading-relaxed">
                Entérate de nuestros nuevos sabores, ofertas de la semana y contenido detrás de escenas en Facebook, Instagram, TikTok y WhatsApp.
              </p>
            </div>

            <SocialCards />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

