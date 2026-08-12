import { useEffect, useState } from 'react'
import { getOrdenesAdmin, putCambiarEstadoOrden, type OrdenResponse } from '../../api/ordenes'

type FilterStatus = 'Todos' | 'PendientePago' | 'Pagado' | 'EnPreparacion' | 'Entregado' | 'Cancelado'

const ESTADOS: { value: FilterStatus; label: string; badgeBg: string; textCol: string }[] = [
  { value: 'Todos', label: 'Todos los pedidos', badgeBg: 'bg-gray-100', textCol: 'text-gray-700' },
  { value: 'PendientePago', label: 'Pendientes de Pago', badgeBg: 'bg-amber-50', textCol: 'text-amber-700' },
  { value: 'Pagado', label: 'Pagados', badgeBg: 'bg-blue-50', textCol: 'text-blue-700' },
  { value: 'EnPreparacion', label: 'En Preparación', badgeBg: 'bg-purple-50', textCol: 'text-purple-700' },
  { value: 'Entregado', label: 'Entregados', badgeBg: 'bg-emerald-50', textCol: 'text-emerald-700' },
  { value: 'Cancelado', label: 'Cancelados', badgeBg: 'bg-red-50', textCol: 'text-red-700' },
]

function getStatusBadge(estado: string) {
  switch (estado) {
    case 'Pagado':
      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">● Pagado</span>
    case 'EnPreparacion':
      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">🧁 En Preparación</span>
    case 'Entregado':
      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">✅ Entregado</span>
    case 'Cancelado':
      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">❌ Cancelado</span>
    default:
      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">⏳ Pendiente de Pago</span>
  }
}

function formatDateFriendly(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-BO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function AdminOrdenes() {
  const [ordenes, setOrdenes] = useState<OrdenResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterStatus>('Todos')
  const [search, setSearch] = useState('')
  const [selectedOrden, setSelectedOrden] = useState<OrdenResponse | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const cargarOrdenes = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const data = await getOrdenesAdmin()
      setOrdenes(data)
    } catch (err) {
      console.error('Error al cargar órdenes:', err)
      setErrorMsg('No se pudieron cargar los pedidos. Verifica tu sesión.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarOrdenes()
  }, [])

  const handleCambiarEstado = async (ordenId: string, nuevoEstado: string) => {
    setUpdatingId(ordenId)
    try {
      const res = await putCambiarEstadoOrden(ordenId, nuevoEstado)
      setOrdenes((prev) => prev.map((o) => (o.id === ordenId ? res.orden : o)))
      if (selectedOrden && selectedOrden.id === ordenId) {
        setSelectedOrden(res.orden)
      }
    } catch (err) {
      console.error('Error al actualizar estado:', err)
      alert('No se pudo actualizar el estado de la orden')
    } finally {
      setUpdatingId(null)
    }
  }

  const ordenesFiltradas = ordenes.filter((o) => {
    const matchFilter = filter === 'Todos' || o.estado === filter
    const matchSearch =
      search === '' ||
      o.codigoOrden.toLowerCase().includes(search.toLowerCase()) ||
      o.clienteNombre.toLowerCase().includes(search.toLowerCase()) ||
      o.clienteTelefono.includes(search) ||
      o.zona.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-[#3D2C33]">Gestión de Pedidos (Cochabamba)</h1>
          <p className="text-xs text-[#6B5560] mt-1">
            Administra las órdenes recibidas, verifica transferencias QR y coordina entregas.
          </p>
        </div>

        <button
          type="button"
          onClick={cargarOrdenes}
          className="w-fit rounded-full border border-taupe bg-white hover:bg-cream text-[#3D2C33] text-xs font-medium px-4 py-2 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <span>🔄 Actualizar Pedidos</span>
        </button>
      </div>

      {/* Buscador & Pestañas de Filtro */}
      <div className="bg-white rounded-xl2 shadow-card p-4 sm:p-5 flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por código (#SRH-XXXX), cliente, teléfono o zona..."
            className="w-full rounded-xl border border-taupe bg-cream/40 placeholder-[#A99C8E] text-[#3D2C33] text-xs sm:text-sm pl-10 pr-4 py-2.5 outline-none focus:border-mauve transition-colors"
          />
          <span className="absolute left-3.5 top-2.5 text-sm text-[#6B5560]">🔍</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1 border-t border-taupe/20">
          {ESTADOS.map((e) => {
            const count =
              e.value === 'Todos' ? ordenes.length : ordenes.filter((o) => o.estado === e.value).length
            return (
              <button
                key={e.value}
                type="button"
                onClick={() => setFilter(e.value)}
                className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                  filter === e.value
                    ? 'bg-mauve text-white shadow-sm'
                    : 'bg-cream text-[#3D2C33] hover:bg-taupe/20'
                }`}
              >
                <span>{e.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${filter === e.value ? 'bg-white/20 text-white' : 'bg-taupe/30 text-[#3D2C33]'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Estado de Carga o Error */}
      {loading && <p className="text-center text-sm text-[#6B5560] py-8">Cargando pedidos…</p>}

      {errorMsg && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs text-center border border-red-200">
          {errorMsg}
        </div>
      )}

      {/* Lista de Tarjetas de Pedidos */}
      {!loading && !errorMsg && ordenesFiltradas.length === 0 && (
        <div className="bg-white rounded-xl2 p-8 text-center text-[#6B5560] text-sm shadow-card">
          No se encontraron pedidos con los filtros aplicados.
        </div>
      )}

      {!loading && !errorMsg && ordenesFiltradas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ordenesFiltradas.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-xl2 shadow-card p-5 border border-taupe/30 flex flex-col justify-between hover:border-mauve/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-taupe/20">
                  <span className="font-mono font-bold text-sm text-mauve-dark">
                    {ord.codigoOrden}
                  </span>
                  {getStatusBadge(ord.estado)}
                </div>

                <div className="space-y-1.5 text-xs text-[#3D2C33] mb-4">
                  <p className="font-semibold text-sm">{ord.clienteNombre}</p>
                  <p className="text-[#6B5560]">
                    📱 <a href={`https://wa.me/591${ord.clienteTelefono}`} target="_blank" rel="noreferrer" className="text-mauve hover:underline font-mono">{ord.clienteTelefono}</a>
                  </p>
                  <p className="text-[#6B5560]">
                    📍 <strong>{ord.zona}</strong> — {ord.direccion}
                  </p>
                  <p className="text-[#6B5560]">
                    📅 Entrega: <strong>{formatDateFriendly(ord.fechaEntrega)}</strong> ({ord.horaEntrega})
                  </p>
                  {ord.numeroTransaccion && (
                    <p className="font-mono text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded w-fit">
                      Ref. Pago: {ord.numeroTransaccion}
                    </p>
                  )}
                </div>

                {/* Resumen de ítems */}
                <div className="bg-cream/50 p-3 rounded-lg text-[11px] space-y-1 mb-4">
                  <span className="font-semibold text-[#6B5560] block">Productos ({ord.detalles.length}):</span>
                  {ord.detalles.slice(0, 3).map((d) => (
                    <div key={d.id} className="flex justify-between text-[#3D2C33]">
                      <span className="truncate max-w-[200px]">• {d.cantidad}x {d.nombreProducto}</span>
                      <span>Bs {d.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                  {ord.detalles.length > 3 && (
                    <p className="text-[10px] text-mauve italic">+ {ord.detalles.length - 3} productos más</p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-taupe/20 flex items-center justify-between gap-2">
                <span className="font-display font-bold text-base text-mauve-dark">
                  Total: Bs {ord.montoTotal.toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedOrden(ord)}
                  className="rounded-full bg-rose-metallic hover:bg-rose-metallic-dark text-white text-xs font-semibold px-4 py-2 transition-colors shadow-sm"
                >
                  Ver Detalle & Mapa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Detalle Completo de Orden */}
      {selectedOrden && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl2 shadow-lifted w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-taupe/30 pb-4">
              <div>
                <span className="font-mono font-bold text-lg text-mauve-dark">
                  {selectedOrden.codigoOrden}
                </span>
                <p className="text-xs text-[#6B5560]">
                  Registrado el {new Date(selectedOrden.createdAt).toLocaleString('es-BO')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrden(null)}
                className="text-[#3D2C33] hover:text-mauve text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Cambio de Estado Rápido */}
            <div className="bg-cream/60 p-4 rounded-xl border border-taupe/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-[#3D2C33] block">Estado Actual:</span>
                {getStatusBadge(selectedOrden.estado)}
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-[#6B5560]">Cambiar a:</label>
                <select
                  disabled={updatingId === selectedOrden.id}
                  value={selectedOrden.estado}
                  onChange={(e) => handleCambiarEstado(selectedOrden.id, e.target.value)}
                  className="text-xs rounded-lg border border-taupe bg-white px-3 py-1.5 font-medium text-[#3D2C33] outline-none focus:border-mauve"
                >
                  <option value="PendientePago">Pendiente de Pago</option>
                  <option value="Pagado">Pagado</option>
                  <option value="EnPreparacion">En Preparación</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            {/* Datos del Cliente y Ubicación */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div>
                <h4 className="font-semibold text-[#3D2C33] mb-1 text-sm">Cliente</h4>
                <p><strong>Nombre:</strong> {selectedOrden.clienteNombre}</p>
                <p><strong>Teléfono:</strong> {selectedOrden.clienteTelefono}</p>
                <p><strong>Email:</strong> {selectedOrden.clienteEmail}</p>
                <a
                  href={`https://wa.me/591${selectedOrden.clienteTelefono}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-700 font-semibold hover:underline mt-2"
                >
                  <span>💬 Abrir Chat de WhatsApp</span>
                </a>
              </div>

              <div>
                <h4 className="font-semibold text-[#3D2C33] mb-1 text-sm">Entrega en Cochabamba</h4>
                <p><strong>Zona:</strong> {selectedOrden.zona}</p>
                <p><strong>Dirección:</strong> {selectedOrden.direccion}</p>
                {selectedOrden.referencias && <p><strong>Ref:</strong> {selectedOrden.referencias}</p>}
                <p><strong>Fecha Programada:</strong> {formatDateFriendly(selectedOrden.fechaEntrega)}</p>
                <p><strong>Horario:</strong> {selectedOrden.horaEntrega}</p>
                {selectedOrden.lat && selectedOrden.lng && (
                  <a
                    href={`https://www.google.com/maps?q=${selectedOrden.lat},${selectedOrden.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-mauve font-semibold hover:underline mt-2"
                  >
                    <span>📍 Ver Pin GPS en Google Maps</span>
                  </a>
                )}
              </div>
            </div>

            {/* Productos */}
            <div>
              <h4 className="font-semibold text-[#3D2C33] mb-2 text-sm">Detalle de Productos</h4>
              <div className="border border-taupe/30 rounded-xl overflow-hidden divide-y divide-taupe/20 text-xs">
                {selectedOrden.detalles.map((d) => (
                  <div key={d.id} className="p-3 flex justify-between items-center bg-white">
                    <div>
                      <p className="font-medium text-[#3D2C33]">{d.nombreProducto}</p>
                      <p className="text-[11px] text-[#6B5560]">
                        {d.cantidad} unidades x Bs {d.precioUnitario.toFixed(2)}
                      </p>
                    </div>
                    <span className="font-semibold text-mauve-dark text-sm">
                      Bs {d.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="p-3 bg-cream/60 flex justify-between items-center font-display font-bold text-sm text-mauve-dark">
                  <span>Total de la Orden</span>
                  <span>Bs {selectedOrden.montoTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Cierre */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrden(null)}
                className="rounded-full bg-gray-200 hover:bg-gray-300 text-[#3D2C33] text-xs font-semibold px-6 py-2.5 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
