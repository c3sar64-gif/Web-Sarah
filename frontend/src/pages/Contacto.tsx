import { useState, type FormEvent } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
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

      <main className="max-w-3xl mx-auto px-8 md:px-14 pt-40 md:pt-48 pb-24">
        <div className="text-center mb-12">
          <span className="text-sm tracking-widest uppercase text-sage-dark font-semibold">
            Contacto
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-[#3D2C33] mt-3">
            Hablemos de tu pedido
          </h1>
          <p className="text-[#6B5560] mt-3">
            Cuéntanos qué celebras y armamos juntas el pastel o mesa dulce perfecta.
          </p>
        </div>

        {status === 'sent' ? (
          <div className="bg-white rounded-xl2 shadow-card p-8 text-center">
            <p className="font-display text-xl text-mauve-dark">¡Mensaje enviado!</p>
            <p className="text-[#6B5560] mt-2">
              Gracias por escribirnos, te responderemos pronto.
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="mt-6 rounded-full border border-taupe hover:bg-[#F1EBE0] text-[#3D2C33] font-medium px-6 py-2.5 transition-colors"
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl2 shadow-card p-8 flex flex-col gap-4"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                placeholder="Tu nombre"
                className="flex-1 rounded-xl2 border border-taupe bg-cream/40 placeholder-[#A99C8E] text-[#3D2C33] text-sm px-4 py-3 outline-none focus:border-mauve"
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Tu correo"
                className="flex-1 rounded-xl2 border border-taupe bg-cream/40 placeholder-[#A99C8E] text-[#3D2C33] text-sm px-4 py-3 outline-none focus:border-mauve"
              />
            </div>
            <textarea
              name="mensaje"
              value={form.mensaje}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Cuéntanos sobre tu pedido..."
              className="rounded-xl2 border border-taupe bg-cream/40 placeholder-[#A99C8E] text-[#3D2C33] text-sm px-4 py-3 outline-none focus:border-mauve resize-none"
            />

            {status === 'error' && (
              <p className="text-sm text-[#B5564A]">
                {errorMsg ?? 'No se pudo enviar el mensaje. Intenta de nuevo en un momento.'}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-fit rounded-full bg-rose-metallic hover:bg-rose-metallic-dark disabled:opacity-60 text-white text-sm font-medium px-6 py-3 transition-colors"
            >
              {status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  )
}
