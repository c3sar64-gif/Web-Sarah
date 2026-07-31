# Backend .NET — Catálogo Sarah

ASP.NET Core Web API + Entity Framework Core (Npgsql), conectado a la misma base PostgreSQL de Supabase que usaba el backend anterior.

## Comandos usados para crear el proyecto (referencia)

```powershell
dotnet new webapi -n Backend --use-controllers -o .
dotnet add package Microsoft.EntityFrameworkCore.Design --version 8.0.11
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version 8.0.11
dotnet tool install --global dotnet-ef --version 8.0.11
```

## Primeros pasos (en tu máquina)

```powershell
cd backend-dotnet
dotnet restore
dotnet ef database update    # aplica las migraciones (ya se corrieron una vez contra Supabase)
dotnet run
```

La API queda en `http://localhost:8002` (o el puerto que definas con `ASPNETCORE_URLS`), con Swagger en `/swagger` en modo Development.

Endpoints: `GET/POST/PUT/DELETE /api/categorias`, `GET/POST/PUT/DELETE /api/productos`, `GET/POST /api/contacto`.

## Configuración

- `appsettings.json`: valores por defecto, sin secretos.
- `appsettings.Development.json`: contiene la cadena de conexión real a Supabase, los orígenes CORS y la contraseña de aplicación de Gmail — **está en `.gitignore`, no se sube al repo**.
- `appsettings.Development.json.example`: plantilla de referencia.

## Correo del formulario de contacto

Cada vez que alguien envía el formulario de `/contacto` en el frontend, el mensaje se guarda en la tabla `mensajes_contacto` **y** se intenta enviar un correo a `sarahhorneadoconamor@gmail.com` por SMTP de Gmail. Si el correo falla (por ejemplo, falta la contraseña de aplicación), el mensaje igual queda guardado — revisa los logs de la consola o `GET /api/contacto` para verlo.

Para activar el envío real, genera una **contraseña de aplicación** de Gmail (no tu contraseña normal de la cuenta):

1. Entra a `myaccount.google.com/security` con la cuenta `sarahhorneadoconamor@gmail.com`.
2. Activa la verificación en dos pasos si no la tienes activada (Gmail lo exige para poder generar contraseñas de aplicación).
3. Ve a `myaccount.google.com/apppasswords`, crea una nueva para "Correo" / "Otra (nombre personalizado)" y copia el código de 16 caracteres que te da.
4. Pégalo en `backend-dotnet/appsettings.Development.json`, dentro de `"Email": { "SenderPassword": "..." }`, reemplazando el placeholder.
5. Reinicia `dotnet run`.

No compartas esa contraseña de aplicación en ningún chat ni la subas a git — solo va en tu `appsettings.Development.json` local.

## Modelos

- `Categoria`: Id, Nombre, Descripcion.
- `Producto`: Id, Nombre, Descripcion, Precio, ImagenUrl, Disponible, CategoriaId (FK).

Tablas creadas en Postgres: `categorias`, `productos` (separadas de las tablas `products_*` que dejó el backend Django anterior).

## Nota sobre el backend anterior

La carpeta `../backend/` (Django) queda intacta — el entorno donde corrí esto no pudo borrarla automáticamente. Puedes eliminarla tú manualmente desde el explorador de archivos y, si quieres, renombrar esta carpeta de `backend-dotnet` a `backend`.

También puedes borrar `bin/` y `obj/` de aquí (son artefactos de compilación, ya están en `.gitignore`).
