export function formatPrice(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(value)
}
