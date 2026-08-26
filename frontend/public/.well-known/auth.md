# Auth.md

> Autenticación y Registro de Agentes de Inteligencia Artificial para Sarah — Horneado con Amor API.

## Información de Autenticación para Agentes

Sarah Bakery proporciona acceso seguro a sus APIs de catálogo, pedidos y seguimiento de entregas para agentes autónomos y clientes autorizados.

### Endpoints de Autorización
- **Servidor de Autorización (Issuer)**: `https://sarah-horneado-con-amor.com`
- **Registro de Agentes (Registration URI)**: `https://sarah-horneado-con-amor.com/api/auth/register`
- **Obtención de Token (Token URI)**: `https://sarah-horneado-con-amor.com/api/auth/token`
- **Revocación de Token (Revocation URI)**: `https://sarah-horneado-con-amor.com/api/auth/revoke`
- **Recurso Protegido (Resource URI)**: `https://sarah-horneado-con-amor.com/api/`

### Tipos de Identidad y Credenciales Admitidos
- **Identity Types**: `agent`, `user`
- **Credential Types**: `client_secret`, `bearer_token`
- **Grant Types**: `authorization_code`, `client_credentials`, `password`

### Permisos (Scopes)
- `orders:read`: Consulta del estado de pedidos y tickets de compra.
- `orders:write`: Creación y confirmación de nuevas órdenes en Cochabamba.
- `products:read`: Lectura del catálogo de postres, tortas y precios en Bs.

### Documentación Adicional
- [Catálogo para LLMs](/llms.txt)
- [Manifiesto de Agente (agent.json)](/.well-known/agent.json)
- [Catálogo de APIs RFC 9727](/.well-known/api-catalog)
- [Especificación OpenAPI 3.0](/api/openapi.json)
