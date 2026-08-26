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

  const url = new URL(request.url)

  // 1. Manejo garantizado de endpoints .well-known con Content-Type y CORS correctos
  if (url.pathname === '/.well-known/oauth-protected-resource' || url.pathname === '/.well-known/oauth-protected-resource.json' || url.pathname.startsWith('/.well-known/oauth-protected-resource/')) {
    const data = {
      resource: 'https://sarah-horneado-con-amor.com/api/',
      authorization_servers: ['https://sarah-horneado-con-amor.com'],
      scopes_supported: ['orders:read', 'orders:write', 'products:read'],
      bearer_methods_supported: ['header'],
      resource_documentation: 'https://sarah-horneado-con-amor.com/llms.txt',
    }
    return new Response(JSON.stringify(data, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }

  if (url.pathname === '/.well-known/oauth-authorization-server') {
    const data = {
      issuer: 'https://sarah-horneado-con-amor.com',
      authorization_endpoint: 'https://sarah-horneado-con-amor.com/admin/login',
      token_endpoint: 'https://sarah-horneado-con-amor.com/api/auth/token',
      registration_endpoint: 'https://sarah-horneado-con-amor.com/api/auth/register',
      revocation_endpoint: 'https://sarah-horneado-con-amor.com/api/auth/revoke',
      jwks_uri: 'https://sarah-horneado-con-amor.com/.well-known/jwks.json',
      response_types_supported: ['code', 'token'],
      grant_types_supported: ['authorization_code', 'client_credentials', 'password'],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['RS256', 'HS256'],
      scopes_supported: ['openid', 'profile', 'email', 'orders:read', 'orders:write'],
      agent_auth: {
        register_uri: 'https://sarah-horneado-con-amor.com/api/auth/register',
        supported_identity_types: ['agent', 'user'],
        supported_credential_types: ['client_secret', 'bearer_token'],
        revocation_uri: 'https://sarah-horneado-con-amor.com/api/auth/revoke',
      },
      token_endpoint_auth_methods_supported: ['client_secret_post', 'client_secret_basic'],
    }
    return new Response(JSON.stringify(data, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }

  if (url.pathname === '/.well-known/ai-catalog.json' || url.pathname === '/.well-known/ai-catalog') {
    const data = {
      specVersion: '1.0',
      host: {
        name: 'Sarah — Horneado con Amor',
        domain: 'sarah-horneado-con-amor.com',
        description: 'Repostería artesanal en Cochabamba, Bolivia. Tortas, queques, galletas y pies con entrega a domicilio y pagos con QR Simple BNB.',
      },
      entries: [
        {
          identifier: 'urn:air:sarah-horneado-con-amor.com:mcp:server-card',
          id: 'urn:air:sarah-horneado-con-amor.com:mcp:server-card',
          displayName: 'Sarah Bakery MCP Server',
          type: 'application/json',
          url: 'https://sarah-horneado-con-amor.com/.well-known/mcp/server-card.json',
          description: 'Servidor Model Context Protocol con herramientas para consultar menú de postres y registrar pedidos en Cochabamba.',
          representativeQueries: [
            'consultar precio de pie de limon en cochabamba',
            'hacer pedido de torta artesanal en cochabamba',
            'catalogo de repostería sarah bolivia',
          ],
        },
        {
          identifier: 'urn:air:sarah-horneado-con-amor.com:openapi:order-api',
          id: 'urn:air:sarah-horneado-con-amor.com:openapi:order-api',
          displayName: 'Sarah Bakery OpenAPI Specification',
          type: 'application/vnd.oai.openapi+json',
          url: 'https://sarah-horneado-con-amor.com/api/openapi.json',
          description: 'Especificación OpenAPI 3.0 para endpoints de catálogo, pedidos y confirmación de pago QR BNB.',
          representativeQueries: [
            'api de pedidos de pasteleria',
            'endpoints de pago qr bolivia',
            'openapi rest api repostería',
          ],
        },
        {
          identifier: 'urn:air:sarah-horneado-con-amor.com:skills:ordering',
          id: 'urn:air:sarah-horneado-con-amor.com:skills:ordering',
          displayName: 'Sarah Bakery Ordering Skill',
          type: 'text/markdown',
          url: 'https://sarah-horneado-con-amor.com/.well-known/agent-skills/ordering/SKILL.md',
          description: 'Instrucciones de habilidades para agentes autónomos que gestionan órdenes en Cochabamba.',
          representativeQueries: [
            'instrucciones de compra para agentes de ia',
            'reglas de entrega 48 horas cochabamba',
            'skill de repostería artesanal',
          ],
        },
        {
          identifier: 'urn:air:sarah-horneado-con-amor.com:doc:llms',
          id: 'urn:air:sarah-horneado-con-amor.com:doc:llms',
          displayName: 'Sarah Bakery LLM Documentation',
          type: 'text/markdown',
          url: 'https://sarah-horneado-con-amor.com/llms.txt',
          description: 'Resumen completo en Markdown del negocio, precios en Bolivianos y horarios de entrega.',
          representativeQueries: [
            'información de contacto y whatsapp repostería sarah',
            'precios de pasteles en bolivianos cochabamba',
            'zonas de cobertura cercado tiquipaya sacaba',
          ],
        },
      ],
    }
    return new Response(JSON.stringify(data, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }

  if (url.pathname === '/.well-known/agent-skills/index.json' || url.pathname === '/.well-known/agent-skills.json') {
    const data = {
      $schema: 'https://agentskills.io/schema/v0.2.0/skills-index.json',
      skills: [
        {
          name: 'sarah-bakery-ordering',
          type: 'skill',
          description: 'Consultar menú de repostería artesanal y crear órdenes con entrega en Cochabamba y pago por QR Simple BNB.',
          url: 'https://sarah-horneado-con-amor.com/.well-known/agent-skills/ordering/SKILL.md',
          sha256: 'b8b9556cb9a306c43296d3f5134c0ea45a057c77da1e503c6e5082613038d9b0',
        },
      ],
    }
    return new Response(JSON.stringify(data, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }

  // 2. Si la petición es para otros archivos estáticos, dejar que Cloudflare los sirva directamente
  if (
    url.pathname.startsWith('/.well-known/') ||
    url.pathname.endsWith('.json') ||
    url.pathname.endsWith('.xml') ||
    url.pathname.endsWith('.txt') ||
    url.pathname.startsWith('/api/')
  ) {
    return next()
  }

  // Si el cliente acepta markdown (agente de IA), servimos la versión Markdown correspondiente
  if (acceptHeader.includes('text/markdown') || acceptHeader.includes('text/plain')) {
    // Si solicita directamente /auth.md
    if (url.pathname === '/auth.md') {
      const authMd = getAuthMarkdown()
      return new Response(authMd, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'x-markdown-tokens': String(authMd.split(/\s+/).length),
          'Vary': 'Accept',
          'Cache-Control': 'public, max-age=3600',
        },
      })
    }

    // Mapa de rutas a contenido Markdown
    const markdownContent: Record<string, string> = {
      '/': getHomepageMarkdown(),
      '/especialidades': getEspecialidadesMarkdown(),
      '/contacto': getContactoMarkdown(),
      '/checkout': getCheckoutMarkdown(),
      '/auth.md': getAuthMarkdown(),
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
    '</.well-known/agent.json>; rel="agent", </.well-known/ai-catalog.json>; rel="ai-catalog", </.well-known/agent-skills/index.json>; rel="agent-skills", </.well-known/mcp/server-card.json>; rel="mcp", </.well-known/oauth-protected-resource>; rel="oauth-protected-resource", </.well-known/oauth-authorization-server>; rel="oauth-authorization-server", </llms.txt>; rel="describedby", </sitemap.xml>; rel="sitemap", </.well-known/api-catalog>; rel="api-catalog"'
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

function getAuthMarkdown(): string {
  return `# Auth.md

## Authentication

This document describes how AI agents and automated systems authenticate and interact with the **Sarah — Horneado con Amor** API.

## Agent Registration

AI agents can register to obtain credentials and access tokens for placing orders and querying the pastry catalog.

### Step 1: Register Agent

Send a POST request to the registration endpoint:

POST /api/auth/register HTTP/1.1
Host: sarah-horneado-con-amor.com
Content-Type: application/json

{
  "client_name": "AutonomousAgent",
  "grant_types": ["client_credentials", "authorization_code"],
  "response_types": ["token"],
  "scope": "orders:read orders:write products:read"
}

### Step 2: Obtain Access Token

Exchange credentials for a Bearer token:

POST /api/auth/token HTTP/1.1
Host: sarah-horneado-con-amor.com
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&scope=orders:read%20orders:write

### Step 3: Access Protected APIs

Include the token in the Authorization header:

GET /api/ordenes HTTP/1.1
Host: sarah-horneado-con-amor.com
Authorization: Bearer <access_token>

## OAuth 2.0 & OIDC Endpoints

- **Issuer / Authorization Server**: https://sarah-horneado-con-amor.com
- **Registration URI**: https://sarah-horneado-con-amor.com/api/auth/register
- **Token URI**: https://sarah-horneado-con-amor.com/api/auth/token
- **Revocation URI**: https://sarah-horneado-con-amor.com/api/auth/revoke
- **Protected Resource**: https://sarah-horneado-con-amor.com/api/
- **Authorization Server Metadata**: /.well-known/oauth-authorization-server
- **Protected Resource Metadata**: /.well-known/oauth-protected-resource

## Supported Identity and Credential Types

- **Identity Types**: agent, user
- **Credential Types**: client_secret, bearer_token
- **Grant Types**: client_credentials, authorization_code, password

## Scopes

- orders:read: Query order state and purchase tickets.
- orders:write: Create new bakery orders in Cochabamba and confirm BNB QR payments.
- products:read: View artisan cake, pie, cookie, and pastry prices in Bs.

## Additional Documentation
- [LLMs Full Catalog](/llms.txt)
- [Agent Manifest (agent.json)](/.well-known/agent.json)
- [API Catalog RFC 9727](/.well-known/api-catalog)
- [OpenAPI 3.0 Spec](/api/openapi.json)
`
}


