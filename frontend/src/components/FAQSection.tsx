import { useState } from 'react'
import { HelpCircle, ChevronDown, Sparkles, MessageCircle } from 'lucide-react'

interface FAQItem {
  pregunta: string
  respuesta: string
  categoria: string
}

const FAQS: FAQItem[] = [
  {
    categoria: 'Pedidos & Anticipación',
    pregunta: '¿Con cuánta anticipación debo hacer mi pedido en Cochabamba?',
    respuesta:
      'Horneamos cada postre de manera 100% artesanal bajo pedido. Por ello, requerimos un mínimo de 48 horas de anticipación para garantizar frescura absoluta, masa crocante y la mejor textura.',
  },
  {
    categoria: 'Especialidades',
    pregunta: '¿Cuál es la especialidad más pedida de Sarah?',
    respuesta:
      'Nuestro Pie de Limón Artesanal (Bs 85) es el favorito indiscutible de nuestros clientes en Cochabamba, elaborado con base crocante de mantequilla pura, crema de limón natural y merengue suizo flameado. También son muy cotizados el Queque Tradicional esponjoso y las galletas con chispas de chocolate.',
  },
  {
    categoria: 'Entregas & Cobertura',
    pregunta: '¿Cuáles son las zonas de entrega y horarios en Cochabamba?',
    respuesta:
      'Realizamos entregas coordinadas a domicilio de 17:00 a 21:00 horas en Cercado (Norte, Centro y Sur), Tiquipaya, Sacaba, Quillacollo y Colcapirhua.',
  },
  {
    categoria: 'Pagos',
    pregunta: '¿Qué métodos de pago aceptan?',
    respuesta:
      'Aceptamos pagos 100% seguros mediante QR Simple BNB (válido para escanear desde cualquier banco del sistema financiero boliviano: Banco Unión, BCP, Banco FIE, Banco Mercantil Santa Cruz, Banco Sol, etc.) y transferencias bancarias.',
  },
  {
    categoria: 'Pedidos Especiales',
    pregunta: '¿Puedo pedir tortas personalizadas para cumpleaños o eventos?',
    respuesta:
      '¡Por supuesto! Puedes contactarnos directamente a nuestro WhatsApp oficial (+591 76442752) para cotizar diseños especiales, mensajes personalizados, tamaños para eventos o combinaciones de rellenos a tu gusto.',
  },
]

export default function FAQSection() {
  const [abierto, setAbierto] = useState<number | null>(0)

  const toggle = (index: number) => {
    setAbierto(abierto === index ? null : index)
  }

  return (
    <section className="max-w-4xl mx-auto px-6 md:px-8 py-16" id="preguntas-frecuentes">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-rose-100/70 text-rose-800 border border-rose-200/60">
          <Sparkles className="w-3.5 h-3.5 text-rose-600" />
          Resolvemos tus dudas
        </span>
        <h2 className="font-display text-3xl md:text-4xl text-[#3D2C33] mt-3">
          Preguntas Frecuentes
        </h2>
        <p className="text-sm text-[#6B5560] mt-2">
          Todo lo que necesitas saber sobre pedidos, horarios de entrega y pagos en Cochabamba.
        </p>
      </div>

      <div className="space-y-3.5">
        {FAQS.map((faq, idx) => {
          const isOpen = abierto === idx
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen
                  ? 'bg-white border-rose-200 shadow-sm'
                  : 'bg-white/80 border-taupe/20 hover:border-rose-200/60 hover:bg-white'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-sm sm:text-base text-[#3D2C33]">
                    {faq.pregunta}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-rose-500' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#6B5560] leading-relaxed border-t border-rose-50 animate-fadeIn">
                  <p>{faq.respuesta}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* CTA inferior de ayuda directa */}
      <div className="mt-10 p-6 rounded-3xl bg-gradient-to-r from-rose-50 via-white to-rose-50 border border-rose-100 text-center shadow-2xs">
        <p className="text-xs sm:text-sm text-[#3D2C33] font-medium">
          ¿Tienes alguna otra consulta o pedido especial para tu evento?
        </p>
        <a
          href="https://wa.me/59176442752?text=%C2%A1Hola%20Sarah!%20Tengo%20una%20consulta%20sobre%20sus%20postres%20y%20me%20gustar%C3%ADa%20hacer%20un%20pedido."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-3 px-6 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          Chatear por WhatsApp con Sarah (+591 76442752)
        </a>
      </div>
    </section>
  )
}
