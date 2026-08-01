# Panel de administración — diseño

Fecha: 2026-08-01

## Contexto

El sitio (React/Vite + ASP.NET Core + Supabase Postgres, desplegado en Cloudflare Pages y Railway)
no tiene ningún sistema de autenticación. Los endpoints de escritura de productos
(`POST/PUT/DELETE /api/productos`) están abiertos sin protección — cualquiera con la URL del
backend puede crear, editar o borrar productos. Las fotos de producto viven como archivos
estáticos en `frontend/public/productos/` y se referencian por URL en el campo `ImagenUrl`.

Se necesita un panel de administración donde el desarrollador (c3sar64) y la dueña del negocio
(Sarah) puedan gestionar el catálogo (precios, altas, bajas, fotos) sin tocar código ni la base
de datos directamente, y que cierre el hueco de seguridad actual.

## Alcance

**Incluye:**
- Autenticación de administradores (2 cuentas fijas: c3sar64 y Sarah).
- CRUD de productos desde una interfaz protegida (`/admin/*`).
- Subida de fotos de producto a Supabase Storage (bucket `media`).
- Migración de las fotos de producto existentes desde `frontend/public/productos/` a Supabase
  Storage.
- Bloqueo de cuenta por intentos fallidos de login con contraseña.

**Fuera de alcance (explícitamente):**
- Gestión de categorías desde el panel (se sigue haciendo por Swagger, cambia con muy poca
  frecuencia).
- Alta de nuevas cuentas de administrador desde la UI (las 2 cuentas se cargan una vez, a mano,
  como parte de la implementación).
- Subida de otro tipo de archivos (PDFs, documentos) — se deja la convención de carpetas lista
  para el futuro, pero no se construye ningún endpoint para eso ahora porque nada lo consume.
- Tests automatizados — el proyecto no tiene testing en ningún lado todavía; este feature se
  verifica manualmente, igual que el resto del código existente.

## Autenticación

### Modelo de datos

Tabla nueva `Usuarios`:
- `Id` (PK)
- `Nombre`
- `Email` (único)
- `PasswordHash` (BCrypt)
- `IntentosFallidos` (int, default 0)
- `Bloqueado` (bool, default false)
- `CreadoEn`

Las dos cuentas (c3sar64 y Sarah) se insertan una única vez vía migración de EF Core, con el
email y la contraseña inicial que definan al implementar. No existe ningún endpoint que cree
usuarios nuevos.

### Login con contraseña

- `POST /api/auth/login` recibe `email` + `password`.
- Si la cuenta está `Bloqueado = true`, se rechaza inmediatamente con un mensaje indicando que
  debe iniciar sesión con Google para desbloquearse (o esperar a que un admin la resetee).
- Si la contraseña no coincide: se incrementa `IntentosFallidos`. Al llegar a 3, se marca
  `Bloqueado = true`.
- Si coincide: se resetea `IntentosFallidos = 0` y se emite un JWT (ver abajo).
- Mensajes de error genéricos ("credenciales inválidas") — nunca se revela si el email existe.

### Login con Google

- El frontend usa Google Identity Services para obtener un ID token del usuario al hacer clic en
  "Iniciar sesión con Google".
- `POST /api/auth/google` recibe ese token, lo valida contra las claves públicas de Google
  (paquete `Google.Apis.Auth`), y extrae el email verificado.
- Si el email no está en la tabla `Usuarios`, se rechaza (403) — no se crea cuenta nueva, solo
  entran los dos administradores ya cargados.
- Si el email está en la tabla: se resetea `IntentosFallidos = 0` y `Bloqueado = false`
  (auto-desbloqueo), y se emite el mismo tipo de JWT que el login por contraseña.

Requiere crear un OAuth Client ID en Google Cloud Console (paso único de configuración, se hace
al implementar). Ese Client ID no es secreto — va en el frontend como variable de build
(`VITE_GOOGLE_CLIENT_ID`), a diferencia de las credenciales S3 o el JWT secret, que sí son
sensibles y quedan solo en el backend.

### Sesión

- JWT firmado con un secreto en variable de entorno (`Jwt__Secret` en Railway), expira a los 7
  días.
- Se agrega el middleware de JWT Bearer authentication en `Program.cs`.
- Se agrega `[Authorize]` a los endpoints de escritura existentes (`POST/PUT/DELETE
  /api/productos`) y al nuevo endpoint de subida de imágenes.
- Frontend: el JWT se guarda en `localStorage`. Un `AuthContext` (mismo patrón que el
  `CartContext` ya existente) expone `token`, `usuario`, `login()`, `logout()`.
- Un componente `ProtectedRoute` envuelve las rutas `/admin/*`; si no hay token válido, redirige
  a `/admin/login`.
- El cliente Axios existente (`frontend/src/api/client.ts`) agrega un interceptor que adjunta
  `Authorization: Bearer <token>` cuando hay sesión, y que ante una respuesta 401 limpia la
  sesión y redirige a `/admin/login`.

### Desbloqueo manual (caso de emergencia)

Si una cuenta queda bloqueada y esa persona tampoco puede entrar con Google, no hay
autoservicio de recuperación — alguien con acceso a la base de datos (Supabase Table Editor)
resetea `IntentosFallidos` a 0 y `Bloqueado` a `false` a mano. No se construye una pantalla para
esto por ser un caso raro.

## Subida e imágenes (Supabase Storage)

### Backend

- Paquete `AWSSDK.S3`, cliente S3 configurado contra el endpoint S3-compatible de Supabase:
  - Endpoint: `https://pglatlkxuhdzusdweqrk.storage.supabase.co/storage/v1/s3`
  - Region: `us-west-2`
  - Bucket: `media`
  - Credenciales vía variables de entorno en Railway (`Supabase__S3__AccessKey`,
    `Supabase__S3__SecretKey`) — **nunca** en código de frontend ni committeadas a git.
- `POST /api/uploads/imagen` (protegido con `[Authorize]`):
  - Valida que el archivo sea imagen (`image/jpeg`, `image/png`, `image/webp`) y no supere 5MB.
  - Sube el archivo al bucket bajo la key `fotos/productos/<guid>-<nombre-archivo>`.
  - Devuelve `{ "url": "<url pública>" }`.
  - Si falla la subida (ej. error de red con Supabase), responde 502 con un mensaje claro sin
    romper el resto del formulario.
- Prerrequisito de configuración: el bucket `media` debe estar marcado como público en el
  dashboard de Supabase para que las URLs devueltas sean directamente accesibles desde el
  navegador (mismo comportamiento que ya tienen las URLs actuales en `ImagenUrl`).

### Convención de carpetas dentro del bucket `media`

```
media/
  fotos/
    productos/
      <id-o-guid>-<nombre-archivo>.jpg
```

Se deja esta convención (`fotos/`, y en el futuro `documentos/`, etc.) como patrón para
contenido futuro, pero solo se implementa `fotos/productos/` ahora.

### Frontend

- En el formulario de producto, al elegir un archivo se sube inmediatamente contra
  `/api/uploads/imagen`, se muestra una vista previa y la URL resultante queda en el estado del
  formulario como `ImagenUrl`. El guardado del producto (`POST`/`PUT /api/productos`) usa esa
  URL como cualquier otro campo de texto.

### Migración de fotos existentes

Como parte de la implementación:
1. Subir las 10 fotos actuales de `frontend/public/productos/*.png` al bucket, bajo
   `fotos/productos/`.
2. Actualizar el campo `ImagenUrl` de cada producto en la base para apuntar a la nueva URL de
   Supabase.
3. Eliminar los archivos de `frontend/public/productos/` del repo (ya no se usan, y dejan de
   viajar en cada deploy del frontend).

Con esto, todas las fotos de producto —existentes y nuevas— viven en Supabase Storage, ninguna
en el repositorio.

## Pantallas del panel (frontend)

- **`/admin/login`**: formulario de email/contraseña + botón "Iniciar sesión con Google".
- **`/admin/productos`**: tabla con miniatura, nombre, categoría, precio y disponibilidad de
  cada producto; botones "Editar" / "Eliminar" por fila; botón "+ Nuevo producto".
- **Formulario de producto** (compartido entre alta y edición): Nombre, Descripción, Precio,
  Categoría (desplegable poblado desde `GET /api/categorias`, sin edición de categorías),
  Disponible (sí/no), Imagen (input de archivo con subida y vista previa inmediata). Botón
  "Guardar".
- **Eliminar producto**: pide confirmación antes de llamar a `DELETE /api/productos/{id}`.
- Header del panel con el nombre de la persona logueada y botón "Cerrar sesión".
- Estética: misma paleta de la marca (cream `#F8F4ED`, mauve `#734F62`, rose-metallic
  `#E0A9A1`), pero con un layout utilitario tipo planilla — no la estética de venta del sitio
  público.

## Manejo de errores

- Login inválido → mensaje genérico "credenciales inválidas", sin revelar si el email existe.
- Cuenta bloqueada → mensaje indicando que puede desbloquearse iniciando sesión con Google.
- Google login de una cuenta no autorizada → "esta cuenta no tiene acceso al panel".
- Sesión vencida (401 en cualquier llamada admin) → redirección automática a `/admin/login`.
- Archivo de imagen inválido (tipo no soportado o > 5MB) → mensaje claro explicando el motivo,
  sin subir nada.
- Falla de red al subir a Supabase → mensaje de reintentar, sin perder los demás datos del
  formulario.
- Estados de carga (spinner/deshabilitar botón) durante subida de imagen y guardado de producto,
  para evitar doble envío.

## Pruebas

Sin framework de testing automatizado (consistente con el resto del proyecto, que no tiene
tests). Verificación manual antes de dar el feature por terminado:
1. Login con contraseña correcta e incorrecta (incluyendo el bloqueo al 3er intento).
2. Login con Google, con cuenta autorizada y con una no autorizada.
3. Que el login con Google desbloquee una cuenta bloqueada por contraseña.
4. Crear producto con foto nueva.
5. Editar producto (incluyendo reemplazar la foto).
6. Eliminar producto.
7. Que `/admin/*` redirija a `/admin/login` sin sesión.
8. Que un token vencido/inválido redirija al login automáticamente.

## Seguridad — notas explícitas

- Las credenciales S3 de Supabase (access key, secret key) van **solo** como variables de
  entorno en Railway. Nunca en código de frontend, nunca committeadas a git.
- El secret de la clave S3 fue pegado en texto plano en la conversación con el asistente; se
  recomienda rotarla desde Supabase (Project Settings → Storage → S3 Access Keys) por las dudas,
  aunque no es bloqueante para este trabajo.
- El JWT secret también va como variable de entorno en Railway, generado aparte (no reutilizar
  ninguna otra clave del proyecto).
