import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const WHATSAPP_NUMBER = '59176442752'
const PLACEHOLDER_IMG = 'https://placehold.co/80x80?text=Sin+imagen'

function buildWhatsAppMessage(
  items: ReturnType<typeof useCart>['items'],
  subtotal: number,
): string {
  const lineas = items.map(
    (i) => `• ${i.cantidad}x ${i.product.nombre} — Bs ${(i.product.precio * i.cantidad).toFixed(2)}`,
  )
  return [
    'Hola Sarah, quiero hacer este pedido:',
    '',
    ...lineas,
    '',
    `Total: Bs ${subtotal.toFixed(2)}`,
  ].join('\n')
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, clearCart } = useCart()
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleWhatsApp = () => {
    const mensaje = buildWhatsAppMessage(items, subtotal)
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
    window.open(url, '_blank', 'noreferrer')
  }

  const handleGoToCheckout = () => {
    closeCart()
    navigate('/checkout')
  }


  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* overlay */}
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={closeCart}
        className="absolute inset-0 bg-black/40"
      />

      {/* panel */}
      <div className="relative bg-cream w-full max-w-md h-full shadow-lifted flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-taupe/40">
          <h2 className="font-display text-xl text-mauve-dark">Tu pedido</h2>
          <button
            type="button"
            onClick={closeCart}
            className="text-[#3D2C33] hover:text-mauve text-2xl leading-none"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {items.length === 0 && (
            <p className="text-[#6B5560] text-sm text-center mt-10">
              Todavía no agregaste nada a tu pedido.
            </p>
          )}

          {items.map((item) => (
            <div key={item.product.id} className="flex items-center gap-3">
              <img
                src={item.product.imagenUrl ?? PLACEHOLDER_IMG}
                alt={item.product.nombre}
                className="w-16 h-16 rounded-xl2 object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.product.nombre}</p>
                <p className="text-sm text-mauve-dark font-semibold">
                  Bs {item.product.precio.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.product.id, item.cantidad - 1)}
                  className="w-7 h-7 rounded-full border border-taupe text-sm hover:bg-[#F1EBE0]"
                >
                  −
                </button>
                <span className="w-5 text-center text-sm">{item.cantidad}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.product.id, item.cantidad + 1)}
                  className="w-7 h-7 rounded-full border border-taupe text-sm hover:bg-[#F1EBE0]"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.product.id)}
                className="text-[#A99C8E] hover:text-[#B5564A] text-lg leading-none ml-1"
                aria-label={`Quitar ${item.product.nombre}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="border-t border-taupe/40 px-6 py-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6B5560]">Subtotal</span>
              <span className="font-display text-xl text-mauve-dark">
                Bs {subtotal.toFixed(2)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleGoToCheckout}
              className="w-full rounded-full bg-rose-metallic hover:bg-rose-metallic-dark text-white font-medium px-6 py-3.5 transition-colors shadow-sm text-sm"
            >
              Proceder al Pago (Checkout)
            </button>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full rounded-full border border-taupe hover:bg-taupe/15 text-[#3D2C33] font-medium px-6 py-2.5 transition-colors text-xs"
            >
              Consultar por WhatsApp
            </button>
            <button
              type="button"
              onClick={clearCart}
              className="w-full text-xs text-[#A99C8E] hover:text-[#B5564A] transition-colors mt-1"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
