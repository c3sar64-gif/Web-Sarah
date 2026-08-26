import { useState } from 'react'
import { MessageCircle, X, Cake, MapPin, ShoppingBag, Send } from 'lucide-react'

export default function WhatsAppFloatingButton() {
  const [isOpen, setIsOpen] = useState(false)
  const phone = '59176442752'

  const quickMessages = [
    {
      icon: Cake,
      title: 'Torta Personalizada',
      desc: 'Para cumpleaños y eventos especiales',
      text: '¡Hola Sarah! Me gustaría cotizar una torta personalizada para un evento.',
    },
    {
      icon: ShoppingBag,
      title: 'Consultar Pedido',
      desc: 'Seguimiento con código #SRH',
      text: '¡Hola Sarah! Quisiera consultar el estado de mi pedido.',
    },
    {
      icon: MapPin,
      title: 'Zonas de Entrega',
      desc: 'Cercado, Tiquipaya, Sacaba, Quillacollo',
      text: '¡Hola Sarah! Quisiera consultar si tienen entrega hasta mi zona en Cochabamba.',
    },
  ]

  const handleOpenWhatsApp = (message: string) => {
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank', 'noopener,noreferrer')
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 font-body">
      {/* Ventana flotante de chat rápido */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header del Chat */}
          <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-display font-bold text-lg">
                  🧁
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white"></span>
              </div>
              <div>
                <h4 className="font-semibold text-sm leading-tight">Sarah — Repostería</h4>
                <p className="text-[11px] text-rose-100 mt-0.5">En línea en Cochabamba 🇧🇴</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
              aria-label="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cuerpo con Opciones */}
          <div className="p-4 bg-rose-50/30">
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              👋 ¡Hola! ¿En qué podemos endulzar tu día hoy? Elige una opción o escríbenos directo:
            </p>

            <div className="space-y-2">
              {quickMessages.map((item, idx) => {
                const Icon = item.icon
                return (
                  <button
                    key={idx}
                    onClick={() => handleOpenWhatsApp(item.text)}
                    className="w-full text-left p-3 rounded-2xl bg-white hover:bg-rose-50 border border-gray-100 hover:border-rose-200 shadow-2xs transition-all flex items-center gap-3 group"
                  >
                    <div className="p-2 rounded-xl bg-rose-100/60 text-rose-600 group-hover:bg-rose-500 group-hover:text-white transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-gray-500 truncate">{item.desc}</div>
                    </div>
                    <Send className="w-3.5 h-3.5 text-gray-300 group-hover:text-rose-500 transition-colors" />
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => handleOpenWhatsApp('¡Hola Sarah! Me gustaría consultar sobre sus postres y realizar un pedido.')}
              className="w-full mt-3 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              Escribir mensaje personalizado
            </button>
          </div>
        </div>
      )}

      {/* Botón Principal Flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
        aria-label="Abrir chat de WhatsApp"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageCircle className="w-6 h-6" />
        <span className="font-semibold text-xs tracking-wide hidden sm:inline">
          WhatsApp
        </span>
      </button>
    </div>
  )
}
