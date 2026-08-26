export interface SocialNetwork {
  id: string
  name: string
  handle: string
  url: string
  description: string
  ctaText: string
  brandColor: string
  hoverBg: string
  badgeText: string
}

export const SOCIAL_NETWORKS: SocialNetwork[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    handle: 'Sarah — Horneado con Amor',
    url: 'https://www.facebook.com/share/1MTK9zJWmr/',
    description: 'Sigue nuestras publicaciones, promociones y fotos de tortas personalizadas en nuestra página oficial de Facebook.',
    ctaText: 'Visitar en Facebook',
    brandColor: '#1877F2',
    hoverBg: 'hover:bg-[#1877F2]/10 hover:border-[#1877F2]/40',
    badgeText: 'Página Oficial',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@sarah.horneado',
    url: 'https://instagram.com/sarah.horneado',
    description: 'Historias del horno todos los días, recetas exclusivas y momentos dulces en nuestra cuenta de Instagram.',
    ctaText: 'Seguir en Instagram',
    brandColor: '#E4405F',
    hoverBg: 'hover:bg-[#E4405F]/10 hover:border-[#E4405F]/40',
    badgeText: 'Comunidad',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    handle: '+591 76442752',
    url: 'https://wa.me/59176442752?text=' + encodeURIComponent('¡Hola Sarah! Me comunico desde la página web sarah-horneado-con-amor.com. Me gustaría consultar sobre sus postres y realizar un pedido.'),
    description: 'Haz tus pedidos directo, realiza consultas sobre presupuestos o coordina la entrega de tus tortas por WhatsApp.',
    ctaText: 'Escribir por WhatsApp',
    brandColor: '#25D366',
    hoverBg: 'hover:bg-[#25D366]/10 hover:border-[#25D366]/40',
    badgeText: 'Atención Inmediata',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    handle: '@roxanaantezanamej',
    url: 'https://www.tiktok.com/@roxanaantezanamej',
    description: 'Mira el proceso detrás de cada receta artesanal, videos en cocina y tips reposteros en nuestro TikTok.',
    ctaText: 'Ver en TikTok',
    brandColor: '#000000',
    hoverBg: 'hover:bg-[#000000]/10 hover:border-[#000000]/40',
    badgeText: 'Videos & Decoración',
  },
]
