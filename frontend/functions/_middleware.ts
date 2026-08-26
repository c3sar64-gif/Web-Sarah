/**
 * Cloudflare Pages Middleware
 * Implementa "Markdown for Agents" (RFC content negotiation):
 * - Si el agente envía Accept: text/markdown → devuelve la página como Markdown
 * - Si el navegador envía Accept: text/html → devuelve HTML normal
 */
export async function onRequest(context: {
  request: Request
  next: () => Promise<Response>
}): Promise<Response> {
  const { request, next } = context
  const acceptHeader = request.headers.get('Accept') || ''

  // Si el cliente acepta markdown (agente de IA), servimos llms.txt o markdown
  if (acceptHeader.includes('text/markdown') || acceptHeader.includes('text/plain')) {
    const url = new URL(request.url)

    // Mapa de rutas a contenido Markdown
    const markdownContent: Record<string, string> = {
      '/': getHomepageMarkdown(),
      '/especialidades': getEspecialidadesMarkdown(),
      '/contacto': getContactoMarkdown(),
      '/checkout': getCheckoutMarkdown(),
    }

    const markdown = markdownContent[url.pathname] ?? getHomepageMarkdown()
    const tokens = markdown.split(/\s+/).length

    return new Response(markdown, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'x-markdown-tokens': String(tokens),
        'Vary': 'Accept',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }

  // Para navegadores normales → comportamiento estándar HTML
  const response = await next()

  // Añadimos Link headers RFC 8288 en todas las respuestas HTML
  const newHeaders = new Headers(response.headers)
  newHeaders.set(
    'Link',
    '</.well-known/agent.json>; rel="agent", </llms.txt>; rel="describedby", </sitemap.xml>; rel="sitemap", </.well-known/api-catalog>; rel="api-catalog"'
  )
  newHeaders.set('Vary', 'Accept')

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  })
}

// --- Contenido Markdown por ruta ---

function getHomepageMarkdown(): string {
  return `# Sarah — Horneado con Amor

> Repostería Artesanal en Cochabamba, Bolivia 🇧🇴

## Descripción
Sarah es una repostería artesanal que elabora tortas, pies, galletas y queques con ingredientes de alta calidad. Servicio de entrega a domicilio exclusivo para Cochabamba con mínimo 48 horas de anticipación.

## Catálogo de Productos
- **Pie de Limón**: Bs 85.00
- **Queque Tradicional**: Bs 70.00
- **Galletas Artesanales**: Bs 35.00/caja
- **Torta Especial de la Casa**: Bs 120.00

## Zonas de Entrega (Cochabamba)
Cercado Centro, Cercado Norte, Cercado Sur, Tiquipaya, Sacaba, Quillacollo, Colcapirhua

## Información de Entrega
- **Tiempo mínimo de horneado**: 48 horas de anticipación
- **Horario de entrega**: 17:00 a 21:00 (tardes)
- **Pago**: QR Simple BNB (todos los bancos de Bolivia)

## Contacto
- WhatsApp: 71499575
- Facebook: https://www.facebook.com/share/1MTK9zJWmr/

## Realizar un Pedido
Visita: /checkout
`
}

function getEspecialidadesMarkdown(): string {
  return `# Especialidades — Sarah Horneado con Amor

## Productos Artesanales

### Tortas y Pasteles
Elaboradas con ingredientes frescos y de primera calidad. Disponibles en múltiples sabores para eventos, cumpleaños y celebraciones.

### Pies Artesanales
- **Pie de Limón**: Bs 85.00 — Cremoso, con base crocante y merengue.

### Queques y Bizcochos
- **Queque Tradicional**: Bs 70.00 — Esponjoso, sabor clásico de mantequilla.

### Galletas
- **Galletas Artesanales**: Bs 35.00/caja — Surtido de sabores artesanales.

## Pedidos Personalizados
Contáctanos por WhatsApp (71499575) para tortas y postres personalizados para eventos especiales.
`
}

function getContactoMarkdown(): string {
  return `# Contacto — Sarah Horneado con Amor

## Información de Contacto
- **WhatsApp**: 71499575
- **Facebook**: https://www.facebook.com/share/1MTK9zJWmr/
- **Correo**: sarahhorneadoconamor@gmail.com

## Ubicación
Cochabamba, Bolivia 🇧🇴
Entregas a domicilio en las zonas: Cercado Centro, Norte, Sur, Tiquipaya, Sacaba, Quillacollo, Colcapirhua.

## Horario de Atención
- Pedidos con mínimo 48 horas de anticipación
- Entregas de 17:00 a 21:00
`
}

function getCheckoutMarkdown(): string {
  return `# Realizar un Pedido — Sarah Horneado con Amor

## Proceso de Pedido
1. Agrega los productos al carrito desde /especialidades
2. Completa tus datos de entrega (nombre, teléfono, email)
3. Selecciona tu zona y dirección en Cochabamba
4. Elige fecha (mínimo 48h de anticipación) y horario (17:00–21:00)
5. Paga con QR Simple BNB desde cualquier banco de Bolivia

## Métodos de Pago Aceptados
- QR Simple BNB (Banco Nacional de Bolivia)
- Compatible con todos los bancos en Bolivia (Mercantil, Banco Unión, BCP, GanaMóvil, etc.)

## Banco para Transferencias
- **Titular**: Antezana Mejia Roxana
- **Banco**: BNB (Banco Nacional de Bolivia)
- **N° Cuenta**: 3502655964
`
}
