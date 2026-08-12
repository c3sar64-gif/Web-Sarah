import { api } from './client'

export interface OrdenDetallePayload {
  productoId?: number
  nombreProducto: string
  cantidad: number
  precioUnitario: number
}

export interface CrearOrdenPayload {
  clienteNombre: string
  clienteTelefono: string
  clienteEmail: string
  zona: string
  direccion: string
  referencias?: string
  lat?: number
  lng?: number
  fechaEntrega: string
  horaEntrega: string
  detalles: OrdenDetallePayload[]
}

export interface OrdenResponse {
  id: string
  codigoOrden: string
  clienteNombre: string
  clienteTelefono: string
  clienteEmail: string
  zona: string
  direccion: string
  referencias?: string
  lat?: number
  lng?: number
  fechaEntrega: string
  horaEntrega: string
  montoTotal: number
  estado: string
  numeroTransaccion?: string
  comprobanteUrl?: string
  createdAt: string
  detalles: {
    id: number
    productoId?: number
    nombreProducto: string
    cantidad: number
    precioUnitario: number
    subtotal: number
  }[]
}

export async function postCrearOrden(payload: CrearOrdenPayload): Promise<OrdenResponse> {
  const { data } = await api.post<OrdenResponse>('/ordenes', payload)
  return data
}

export async function postConfirmarPago(
  id: string,
  payload: { numeroTransaccion?: string; comprobanteUrl?: string }
): Promise<{ mensaje: string; orden: OrdenResponse }> {
  const { data } = await api.post<{ mensaje: string; orden: OrdenResponse }>(
    `/ordenes/${id}/confirmar-pago`,
    payload
  )
  return data
}

export async function getOrdenPorCodigo(codigo: string): Promise<OrdenResponse> {
  const { data } = await api.get<OrdenResponse>(`/ordenes/codigo/${codigo}`)
  return data
}

export async function getOrdenesAdmin(): Promise<OrdenResponse[]> {
  const { data } = await api.get<OrdenResponse[]>('/ordenes')
  return data
}

export async function putCambiarEstadoOrden(
  id: string,
  estado: string
): Promise<{ mensaje: string; orden: OrdenResponse }> {
  const { data } = await api.put<{ mensaje: string; orden: OrdenResponse }>(
    `/ordenes/${id}/estado`,
    { estado }
  )
  return data
}

