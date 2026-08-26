import { ShieldCheck, Clock, MapPin, MessageCircle } from 'lucide-react'

export default function TrustBadges() {
  const badges = [
    {
      icon: ShieldCheck,
      title: 'Pago Seguro con QR BNB',
      desc: 'Cuenta verificada a nombre de Roxana Antezana (BNB)',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      iconColor: 'text-emerald-600',
    },
    {
      icon: Clock,
      title: 'Horneado Fresco 48h Previo',
      desc: 'Elaboración artesanal bajo pedido para máxima frescura',
      color: 'bg-amber-50 text-amber-800 border-amber-200/60',
      iconColor: 'text-amber-600',
    },
    {
      icon: MapPin,
      title: 'Exclusivo Cochabamba',
      desc: 'Entregas en Cercado, Tiquipaya, Sacaba, Quillacollo',
      color: 'bg-rose-50 text-rose-800 border-rose-200/60',
      iconColor: 'text-rose-500',
    },
    {
      icon: MessageCircle,
      title: 'Atención Personalizada',
      desc: 'Confirmación y soporte directo por WhatsApp (71499575)',
      color: 'bg-sky-50 text-sky-800 border-sky-200/60',
      iconColor: 'text-sky-600',
    },
  ]

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-12 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map((b, i) => {
          const Icon = b.icon
          return (
            <div
              key={i}
              className={`flex items-start gap-3.5 p-4 rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${b.color}`}
            >
              <div className="p-2.5 rounded-xl bg-white shadow-xs shrink-0">
                <Icon className={`w-5 h-5 ${b.iconColor}`} />
              </div>
              <div>
                <h4 className="font-semibold text-sm leading-tight text-gray-900">{b.title}</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
