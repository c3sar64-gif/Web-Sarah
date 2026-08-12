import type { OrdenResponse } from '../api/ordenes'

interface OrderTicketProps {
  orden: OrdenResponse
}

function formatDateFriendly(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-BO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const WHATSAPP_NUMBER = '59176442752'

export default function OrderTicket({ orden }: OrderTicketProps) {
  const handlePrint = () => {
    window.print()
  }

  const handleSendWhatsAppNotification = () => {
    const lineas = orden.detalles.map(
      (d) => `• ${d.cantidad}x ${d.nombreProducto} — Bs ${d.subtotal.toFixed(2)}`
    )
    const mensaje = [
      `✨ *NUEVO PEDIDO CONFIRMADO — SARAH* ✨`,
      `*Orden:* ${orden.codigoOrden}`,
      `*Cliente:* ${orden.clienteNombre}`,
      `*Teléfono:* ${orden.clienteTelefono}`,
      `*Zona:* ${orden.zona}`,
      `*Dirección:* ${orden.direccion}`,
      orden.lat && orden.lng ? `*Ubicación GPS:* https://www.google.com/maps?q=${orden.lat},${orden.lng}` : '',
      `*Fecha Entrega:* ${formatDateFriendly(orden.fechaEntrega)}`,
      `*Horario:* ${orden.horaEntrega}`,
      `*N° Transacción Pago:* ${orden.numeroTransaccion ?? 'N/A'}`,
      '',
      `*DETALLE DE PRODUCTOS:*`,
      ...lineas,
      '',
      `*TOTAL:* Bs ${orden.montoTotal.toFixed(2)}`,
    ]
      .filter(Boolean)
      .join('\n')

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
    window.open(url, '_blank', 'noreferrer')
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      {/* Imprimible Ticket container */}
      <div className="bg-white rounded-xl2 shadow-lifted border border-taupe/40 p-6 sm:p-10 relative overflow-hidden print:shadow-none print:border-none">
        {/* Decorativo Superior de Recibo */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-mauve" />

        {/* Encabezado */}
        <div className="text-center pb-6 border-b border-dashed border-taupe/50">
          <div className="w-12 h-12 bg-mauve/10 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl">
            🧁
          </div>
          <span className="font-display text-2xl text-[#3D2C33] block">
            Sarah — Horneado con Amor
          </span>
          <p className="text-xs text-[#6B5560] mt-0.5">Repostería Artesanal • Cochabamba 🇧🇴</p>

          <div className="mt-4 inline-block bg-cream px-4 py-1.5 rounded-full border border-taupe/40">
            <span className="text-xs font-mono font-bold text-mauve-dark">
              ORDEN: {orden.codigoOrden}
            </span>
          </div>
        </div>

        {/* Estado y Fecha del Registro */}
        <div className="flex items-center justify-between py-4 border-b border-taupe/30 text-xs">
          <div>
            <span className="text-[#6B5560] block mb-1">Estado del Pago:</span>
            {orden.estado === 'Pagado' ? (
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                ✅ Pagado
              </span>
            ) : orden.estado === 'EnPreparacion' ? (
              <span className="font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                🧁 En Preparación
              </span>
            ) : orden.estado === 'Entregado' ? (
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                🎉 Entregado
              </span>
            ) : (
              <span className="font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                ⏳ Pendiente de Verificación / Pago
              </span>
            )}
          </div>
          <div className="text-right">
            <span className="text-[#6B5560] block">Fecha de Registro:</span>
            <span className="font-medium text-[#3D2C33]">
              {new Date(orden.createdAt).toLocaleDateString('es-BO')}
            </span>
          </div>
        </div>

        {/* Datos de Entrega */}
        <div className="py-4 border-b border-taupe/30 text-xs space-y-2">
          <h3 className="font-semibold text-[#3D2C33] uppercase tracking-wider text-[11px] text-mauve">
            Datos de Entrega en Cochabamba
          </h3>
          <p><span className="text-[#6B5560]">Cliente:</span> <strong>{orden.clienteNombre}</strong></p>
          <p><span className="text-[#6B5560]">Teléfono:</span> <strong>{orden.clienteTelefono}</strong></p>
          <p><span className="text-[#6B5560]">Email:</span> <strong>{orden.clienteEmail}</strong></p>
          <p><span className="text-[#6B5560]">Zona:</span> <strong>{orden.zona}</strong></p>
          <p><span className="text-[#6B5560]">Dirección:</span> <strong>{orden.direccion}</strong></p>
          {orden.referencias && (
            <p><span className="text-[#6B5560]">Referencias:</span> {orden.referencias}</p>
          )}
          {orden.lat && orden.lng && (
            <p>
              <span className="text-[#6B5560]">Ubicación GPS:</span>{' '}
              <a
                href={`https://www.google.com/maps?q=${orden.lat},${orden.lng}`}
                target="_blank"
                rel="noreferrer"
                className="text-mauve font-semibold hover:underline"
              >
                Abrir en Google Maps 📍
              </a>
            </p>
          )}
          <div className="bg-cream/60 p-3 rounded-lg border border-taupe/30 mt-2">
            <p className="font-medium text-[#3D2C33]">
              📅 Entrega Programada: <strong>{formatDateFriendly(orden.fechaEntrega)}</strong>
            </p>
            <p className="text-[#6B5560]">⏰ Horario: <strong>{orden.horaEntrega}</strong></p>
          </div>
        </div>

        {/* Tabla de Productos */}
        <div className="py-4 text-xs">
          <h3 className="font-semibold text-[#3D2C33] uppercase tracking-wider text-[11px] text-mauve mb-3">
            Detalle del Pedido
          </h3>
          <div className="divide-y divide-taupe/20">
            {orden.detalles.map((item) => (
              <div key={item.id} className="py-2 flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#3D2C33]">{item.nombreProducto}</p>
                  <p className="text-[11px] text-[#6B5560]">
                    {item.cantidad} x Bs {item.precioUnitario.toFixed(2)}
                  </p>
                </div>
                <span className="font-semibold text-[#3D2C33]">
                  Bs {item.subtotal.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-[#3D2C33] pt-3 mt-3 flex items-center justify-between text-sm font-bold text-mauve-dark font-display">
            <span>Total Pagado</span>
            <span>Bs {orden.montoTotal.toFixed(2)}</span>
          </div>

          {orden.numeroTransaccion && (
            <p className="text-[11px] text-[#6B5560] text-right mt-1 font-mono">
              Ref. Transacción: {orden.numeroTransaccion}
            </p>
          )}
        </div>

        {/* Pie de Ticket */}
        <div className="text-center pt-4 border-t border-dashed border-taupe/50 text-[11px] text-[#6B5560]">
          <p>¡Gracias por elegir Sarah para tus momentos más dulces! 💕</p>
          <p className="text-[10px] opacity-70 mt-1">Cochabamba, Bolivia</p>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-col sm:flex-row gap-3 print:hidden">
        <button
          type="button"
          onClick={handleSendWhatsAppNotification}
          className="flex-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3.5 transition-colors text-sm flex items-center justify-center gap-2 shadow-sm"
        >
          <span>Enviar Notificación a WhatsApp</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.887 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="rounded-full border border-taupe hover:bg-white text-[#3D2C33] font-medium px-6 py-3.5 transition-colors text-sm flex items-center justify-center gap-2"
        >
          <span>Imprimir / Descargar Ticket</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
