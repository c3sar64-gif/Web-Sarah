import { useEffect, useState } from 'react'
import type { OrdenResponse } from '../api/ordenes'

interface QrPaymentModuleProps {
  orden: OrdenResponse
  onPaymentConfirmed: (numeroTransaccion: string) => void
}

export default function QrPaymentModule({ orden, onPaymentConfirmed }: QrPaymentModuleProps) {
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutos en segundos
  const [transaccionNum, setTransaccionNum] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Temporizador de 15 minutos en cuenta regresiva
  useEffect(() => {
    if (timeLeft <= 0) return
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [timeLeft])

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    onPaymentConfirmed(transaccionNum || `TX-${Date.now().toString().slice(-6)}`)
  }

  return (
    <div className="bg-white rounded-xl2 shadow-card p-6 sm:p-8 flex flex-col gap-6">
      {/* Encabezado del Módulo QR */}
      <div className="text-center pb-4 border-b border-taupe/30">
        <span className="text-xs font-semibold uppercase tracking-widest text-sage-dark bg-sage/10 px-3 py-1 rounded-full border border-sage/20">
          Pago Seguro con QR Simple
        </span>
        <h2 className="font-display text-2xl text-[#3D2C33] mt-2">
          Escanea y Paga desde tu Banco
        </h2>
        <p className="text-xs text-[#6B5560] mt-1">
          Código de Orden: <span className="font-mono font-bold text-mauve-dark">{orden.codigoOrden}</span>
        </p>
      </div>

      {/* Temporizador & Monto Exacto */}
      <div className="grid grid-cols-2 gap-3 bg-cream/60 p-4 rounded-xl border border-taupe/30 text-center">
        <div>
          <span className="text-[11px] text-[#6B5560] block font-medium">Monto a Transferir</span>
          <span className="font-display text-2xl text-mauve-dark font-bold">
            Bs {orden.montoTotal.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-[#6B5560] block font-medium">Tiempo de Validez QR</span>
          <span
            className={`font-mono text-2xl font-bold ${
              timeLeft < 180 ? 'text-rose-600 animate-pulse' : 'text-[#3D2C33]'
            }`}
          >
            ⏱️ {formatTimer(timeLeft)}
          </span>
        </div>
      </div>

      {/* Código QR Interactivo Oficial BNB */}
      <div className="flex flex-col items-center justify-center py-2">
        <div className="relative p-3 bg-white rounded-2xl border-2 border-mauve/40 shadow-md max-w-[260px]">
          <img
            src="/qr-bnb.png"
            alt={`QR de pago BNB para orden ${orden.codigoOrden}`}
            className="w-full h-auto object-contain rounded-lg shadow-xs"
          />
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-mauve text-white text-[10px] font-semibold px-3.5 py-1 rounded-full shadow-sm whitespace-nowrap">
            QR Simple BNB 🇧🇴 (Válido cualquier banco)
          </div>
        </div>
        <p className="text-[11px] text-[#6B5560] text-center mt-5 max-w-xs leading-relaxed">
          Abre la app de tu banco (BNB, Mercantil, Banco Unión, GanaMóvil, BCP, Bisa, etc.), elige <strong>Pago QR Simple</strong> e ingresa el monto de <strong>Bs {orden.montoTotal.toFixed(2)}</strong>.
        </p>
      </div>

      {/* Datos Bancarios Oficiales BNB */}
      <div className="bg-cream/50 p-4 rounded-xl border border-taupe/40 text-xs space-y-1.5 shadow-xs">
        <p className="font-semibold text-[#3D2C33] border-b border-taupe/30 pb-1 mb-2 flex items-center justify-between">
          <span>🏦 Datos Bancarios Oficiales (BNB):</span>
          <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">QR Activo</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          <p><span className="text-[#6B5560]">Banco:</span> <strong>Banco Nacional de Bolivia (BNB)</strong></p>
          <p><span className="text-[#6B5560]">Titular / Pagar a:</span> <strong>Antezana Mejia Roxana</strong></p>
          <p><span className="text-[#6B5560]">Cuenta destino:</span> <strong className="font-mono text-mauve-dark">3502655964</strong></p>
          <p><span className="text-[#6B5560]">Concepto:</span> <strong>Pedido #{orden.codigoOrden}</strong></p>
        </div>
      </div>

      {/* Formulario de Confirmación */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 pt-2">
        <div>
          <label className="block text-xs font-semibold text-[#3D2C33] mb-1">
            N° de Transacción / Comprobante del Banco *
          </label>
          <input
            type="text"
            required
            value={transaccionNum}
            onChange={(e) => setTransaccionNum(e.target.value)}
            placeholder="Ej. TX-9842104 / Ref. 48219"
            className="w-full rounded-xl border border-taupe bg-cream/40 placeholder-[#A99C8E] text-[#3D2C33] text-sm px-4 py-3 outline-none focus:border-mauve transition-colors font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-rose-metallic hover:bg-rose-metallic-dark disabled:opacity-60 text-white text-base font-semibold py-3.5 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <span>{submitting ? 'Confirmando Pago…' : 'Confirmar Pago y Generar Orden'}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </form>
    </div>
  )
}
