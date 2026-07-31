export interface ContactoPayload {
  nombre: string
  email: string
  mensaje: string
}

export interface ContactoResponse {
  id: number
  nombre: string
  email: string
  mensaje: string
  creadoEn: string
  atendido: boolean
}
